package com.you.skyforge.claude;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.you.skyforge.SkyForge;
import net.minecraft.commands.CommandSource;
import net.minecraft.commands.CommandSourceStack;
import net.minecraft.network.chat.Component;
import net.minecraft.server.MinecraftServer;
import net.minecraft.server.level.ServerPlayer;
import net.minecraftforge.event.ServerChatEvent;
import net.minecraftforge.event.server.ServerStartingEvent;
import net.minecraftforge.eventbus.api.SubscribeEvent;
import net.minecraftforge.fml.common.Mod;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * In-game Claude. A player types "@claude ..." in chat; the message is sent to the Anthropic
 * Messages API, and Claude answers in chat -- and may run server commands via a tool to fix or
 * hand out things.
 *
 * <p>The chat event fires on the server thread; the HTTP call must not block it, so the whole
 * exchange runs on a background executor. Commands, which touch world state, are bounced back
 * onto the server thread. Every command Claude runs is echoed to chat before it executes, so
 * nothing happens invisibly.
 */
@Mod.EventBusSubscriber(modid = SkyForge.MOD_ID, bus = Mod.EventBusSubscriber.Bus.FORGE)
public final class ClaudeBridge {

    private static ClaudeConfig config;

    private static final ExecutorService WORKER = Executors.newSingleThreadExecutor(r -> {
        Thread t = new Thread(r, "skyforge-claude");
        t.setDaemon(true);
        return t;
    });

    private ClaudeBridge() {
    }

    @SubscribeEvent
    public static void onServerStarting(ServerStartingEvent event) {
        config = ClaudeConfig.loadOrCreate();
    }

    @SubscribeEvent
    public static void onServerChat(ServerChatEvent event) {
        if (config == null || !config.enabled) {
            return;
        }
        String raw = event.getRawText();
        String trigger = config.trigger;
        if (raw == null || !raw.toLowerCase().startsWith(trigger.toLowerCase())) {
            return;
        }

        String prompt = raw.substring(trigger.length()).trim();
        ServerPlayer player = event.getPlayer();
        MinecraftServer server = player.getServer();
        if (server == null || prompt.isEmpty()) {
            return;
        }

        if (!config.hasKey()) {
            player.sendSystemMessage(Component.literal(
                    "§c[Claude] No API key set. Add one to " + config.path().getFileName()
                            + " and restart, or set enabled=false to hide me."));
            return;
        }

        boolean op = server.getPlayerList().isOp(player.getGameProfile());
        // Let the question show in chat (event not cancelled), then answer on the worker thread.
        WORKER.submit(() -> converse(server, player, prompt, op));
    }

    /** The agentic loop: ask, run any requested commands, feed results back, until Claude stops. */
    private static void converse(MinecraftServer server, ServerPlayer player, String prompt, boolean op) {
        JsonArray messages = new JsonArray();
        messages.add(userText(prompt));

        boolean commandsAllowed = config.allowCommands && (!config.opOnly || op);

        try {
            for (int i = 0; i < config.maxToolIterations; i++) {
                JsonObject resp = ClaudeApiClient.send(config, systemPrompt(commandsAllowed),
                        tools(), messages);

                JsonArray content = resp.getAsJsonArray("content");
                sendText(server, content);

                // Echo the assistant turn back verbatim -- tool_use blocks must be preserved.
                JsonObject assistant = new JsonObject();
                assistant.addProperty("role", "assistant");
                assistant.add("content", content);
                messages.add(assistant);

                String stop = resp.has("stop_reason") && !resp.get("stop_reason").isJsonNull()
                        ? resp.get("stop_reason").getAsString() : "end_turn";
                if (!"tool_use".equals(stop)) {
                    return; // done
                }

                JsonArray toolResults = new JsonArray();
                for (var el : content) {
                    JsonObject block = el.getAsJsonObject();
                    if (!"tool_use".equals(optString(block, "type"))) {
                        continue;
                    }
                    String id = optString(block, "id");
                    String command = block.getAsJsonObject("input").get("command").getAsString();

                    String result;
                    if (!commandsAllowed) {
                        result = "Command execution is disabled (op-only, or turned off in config).";
                    } else {
                        broadcast(server, "§7[Claude ran] /" + command);
                        result = runOnServerThread(server, player, command);
                    }
                    toolResults.add(toolResult(id, result));
                }

                JsonObject toolTurn = new JsonObject();
                toolTurn.addProperty("role", "user");
                toolTurn.add("content", toolResults);
                messages.add(toolTurn);
            }
            broadcast(server, "§c[Claude] Stopped after too many steps.");
        } catch (ClaudeApiClient.ApiException e) {
            broadcast(server, "§c[Claude] API error " + e.status + ".");
        } catch (Exception e) {
            broadcast(server, "§c[Claude] " + e.getClass().getSimpleName() + ".");
        }
    }

    // ---- command execution (server thread) with captured output ----

    private static String runOnServerThread(MinecraftServer server, ServerPlayer player, String command) {
        try {
            return server.submit(() -> runCaptured(server, player, command)).get();
        } catch (Exception e) {
            return "(failed to run: " + e.getClass().getSimpleName() + ")";
        }
    }

    private static String runCaptured(MinecraftServer server, ServerPlayer player, String command) {
        Capturing cap = new Capturing();
        // Run at the player's position/entity (so @s and relative coords work) but with operator
        // permission, and route command feedback into our capturing source.
        CommandSourceStack src = player.createCommandSourceStack()
                .withSource(cap)
                .withPermission(4);
        try {
            server.getCommands().performPrefixedCommand(src, command);
        } catch (Exception e) {
            return "command error: " + e.getMessage();
        }
        return cap.lines.isEmpty() ? "(ran; no output)" : String.join("\n", cap.lines);
    }

    private static final class Capturing implements CommandSource {
        final List<String> lines = new ArrayList<>();

        @Override
        public void sendSystemMessage(Component component) {
            lines.add(component.getString());
        }

        @Override
        public boolean acceptsSuccess() {
            return true;
        }

        @Override
        public boolean acceptsFailure() {
            return true;
        }

        @Override
        public boolean shouldInformAdmins() {
            return false;
        }
    }

    // ---- chat output ----

    private static void sendText(MinecraftServer server, JsonArray content) {
        StringBuilder sb = new StringBuilder();
        for (var el : content) {
            JsonObject block = el.getAsJsonObject();
            if ("text".equals(optString(block, "type"))) {
                if (sb.length() > 0) sb.append('\n');
                sb.append(optString(block, "text"));
            }
        }
        String text = sb.toString().trim();
        if (text.isEmpty()) {
            return;
        }
        for (String line : text.split("\n")) {
            if (!line.isBlank()) {
                broadcast(server, "§b[Claude] §r" + line);
            }
        }
    }

    private static void broadcast(MinecraftServer server, String text) {
        server.execute(() ->
                server.getPlayerList().broadcastSystemMessage(Component.literal(text), false));
    }

    // ---- request pieces ----

    private static JsonObject userText(String text) {
        JsonObject m = new JsonObject();
        m.addProperty("role", "user");
        m.addProperty("content", text);
        return m;
    }

    private static JsonObject toolResult(String toolUseId, String content) {
        JsonObject block = new JsonObject();
        block.addProperty("type", "tool_result");
        block.addProperty("tool_use_id", toolUseId);
        block.addProperty("content", content);
        return block;
    }

    private static JsonArray tools() {
        JsonObject schema = new JsonObject();
        schema.addProperty("type", "object");
        JsonObject props = new JsonObject();
        JsonObject cmd = new JsonObject();
        cmd.addProperty("type", "string");
        cmd.addProperty("description", "The command to run, WITHOUT the leading slash.");
        props.add("command", cmd);
        schema.add("properties", props);
        JsonArray required = new JsonArray();
        required.add("command");
        schema.add("required", required);

        JsonObject tool = new JsonObject();
        tool.addProperty("name", "run_command");
        tool.addProperty("description",
                "Run a Minecraft server command to help or fix things for the player. Runs at the "
                        + "player's position with operator permission. Use the smallest command that "
                        + "solves the request (give, tp, time set, gamerule, effect, etc.). Do not run "
                        + "destructive or world-wiping commands unless the player explicitly asks.");
        tool.add("input_schema", schema);

        JsonArray tools = new JsonArray();
        tools.add(tool);
        return tools;
    }

    private static String systemPrompt(boolean commandsAllowed) {
        String base = "You are Claude, embedded in the Minecraft chat of a modpack called "
                + "\"ATM Sky Lite\" -- a 1.20.1 Forge void-skyblock with an 8-Age tech/space/boss "
                + "progression built around a custom mod, SkyForge.\n\n"
                + "Answer the player's questions concisely -- this is chat, so 1-4 short lines. "
                + "Plain text only, no markdown. Know the pack:\n"
                + "- No mining: you SIEVE for everything (Ex Deorum). Cobble -> gravel -> sand -> "
                + "dust, sieve with mesh tiers (string->flint->iron->diamond->netherite).\n"
                + "- Ages gate on real recipes: Create's Precision Mechanism gates Mekanism; a "
                + "Mekanism Advanced Control Circuit gates AE2 inscribers; a Nether Star gates the "
                + "NASA Workbench (space); planets gate dimensions (Moon->Twilight, Mars->Undergarden, "
                + "Venus->Blue Skies).\n"
                + "- SkyForge adds the Sky Assembler, sky_dust->sky_steel chain, keystone bridges to "
                + "osmium/certus/uraninite, craftable lava/water buckets, AE2 press recipes, and MA "
                + "seeds for desh/ostrum/calorite (as mysticalagriculture:desh_seeds etc).\n"
                + "- Void rescue is on (falling doesn't kill you) and deaths leave a Gravestone.\n"
                + "Tell players to press R/U in JEI to look up recipes when unsure.";
        if (commandsAllowed) {
            base += "\n\nYou can run server commands with the run_command tool to give items, fix "
                    + "stuck quests, or help the player. Prefer the smallest fix. Reference the player "
                    + "by their in-game name. Never run destructive commands unless explicitly asked.";
        } else {
            base += "\n\nYou cannot run commands for this player (answer questions only).";
        }
        return base;
    }

    private static String optString(JsonObject o, String key) {
        return o.has(key) && !o.get(key).isJsonNull() ? o.get(key).getAsString() : "";
    }
}
