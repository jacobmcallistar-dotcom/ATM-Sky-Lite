package com.you.skyforge.claude;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import net.minecraftforge.fml.loading.FMLPaths;

import java.nio.file.Files;
import java.nio.file.Path;

/**
 * Config for the in-game Claude chat bridge. Lives at config/skyforge-claude.json so the API
 * key (a secret) stays out of the mod jar and out of the world save. Created with defaults on
 * first server start if absent.
 */
public final class ClaudeConfig {

    /** Master switch. */
    public boolean enabled = true;

    /** Anthropic API key (sk-ant-...). Empty = bridge tells the player where to set it. */
    public String apiKey = "";

    /**
     * Model id. Defaults to the most capable model; for a cheap/fast in-game bot that answers
     * many short questions, "claude-haiku-4-5" is ~5x cheaper and lower-latency -- switch here.
     */
    public String model = "claude-opus-4-8";

    /** Output cap per reply. Chat answers are short; keep this modest to bound cost. */
    public int maxTokens = 1500;

    /** Chat prefix that summons Claude, e.g. "@claude how do I make sky steel?". */
    public String trigger = "@claude";

    /** Whether Claude may run server commands to fix/give things. */
    public boolean allowCommands = true;

    /** Only server operators can invoke command-running Claude (recommended). */
    public boolean opOnly = true;

    /** Safety backstop on the agentic loop (command round-trips per question). */
    public int maxToolIterations = 6;

    private static final Gson GSON = new GsonBuilder().setPrettyPrinting().create();
    private static final Path FILE = FMLPaths.CONFIGDIR.get().resolve("skyforge-claude.json");

    public static ClaudeConfig loadOrCreate() {
        try {
            if (Files.exists(FILE)) {
                ClaudeConfig cfg = GSON.fromJson(Files.readString(FILE), ClaudeConfig.class);
                return cfg != null ? cfg : new ClaudeConfig();
            }
            ClaudeConfig def = new ClaudeConfig();
            def.save();
            return def;
        } catch (Exception e) {
            return new ClaudeConfig();
        }
    }

    public void save() {
        try {
            Files.writeString(FILE, GSON.toJson(this));
        } catch (Exception ignored) {
        }
    }

    public boolean hasKey() {
        return apiKey != null && !apiKey.isBlank();
    }

    public Path path() {
        return FILE;
    }
}
