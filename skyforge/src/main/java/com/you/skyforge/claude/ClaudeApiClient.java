package com.you.skyforge.claude;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

/**
 * Minimal Anthropic Messages API client over raw HTTP (JDK 17 HttpClient + Gson). No SDK, so
 * nothing to shade into the mod jar. One method: send the running message list and get the raw
 * response object back; the caller (ClaudeBridge) drives the tool-use loop.
 */
public final class ClaudeApiClient {

    private static final String ENDPOINT = "https://api.anthropic.com/v1/messages";
    private static final String API_VERSION = "2023-06-01";
    private static final Gson GSON = new Gson();

    private static final HttpClient HTTP = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(15))
            .build();

    private ClaudeApiClient() {
    }

    /** Raised on any non-200 so the bridge can surface a readable error in chat. */
    public static final class ApiException extends Exception {
        public final int status;

        ApiException(int status, String body) {
            super("HTTP " + status + ": " + body);
            this.status = status;
        }
    }

    /**
     * POST /v1/messages. {@code messages} is the full running conversation (user turn, then
     * assistant+tool_result turns as the loop progresses). Returns the parsed response object;
     * the caller reads {@code stop_reason} and {@code content}.
     */
    public static JsonObject send(ClaudeConfig cfg, String system, JsonArray tools, JsonArray messages)
            throws Exception {
        JsonObject body = new JsonObject();
        body.addProperty("model", cfg.model);
        body.addProperty("max_tokens", cfg.maxTokens);
        body.addProperty("system", system);
        body.add("tools", tools);
        body.add("messages", messages);

        HttpRequest req = HttpRequest.newBuilder(URI.create(ENDPOINT))
                .header("x-api-key", cfg.apiKey)
                .header("anthropic-version", API_VERSION)
                .header("content-type", "application/json")
                .timeout(Duration.ofSeconds(90))
                .POST(HttpRequest.BodyPublishers.ofString(GSON.toJson(body)))
                .build();

        HttpResponse<String> resp = HTTP.send(req, HttpResponse.BodyHandlers.ofString());
        if (resp.statusCode() != 200) {
            throw new ApiException(resp.statusCode(), truncate(resp.body()));
        }
        return JsonParser.parseString(resp.body()).getAsJsonObject();
    }

    private static String truncate(String s) {
        if (s == null) return "";
        return s.length() > 300 ? s.substring(0, 300) + "..." : s;
    }
}
