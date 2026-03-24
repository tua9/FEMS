import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

/**
 * Groq SDK Initialization
 */
export const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

/**
 * Model constants
 */
export const AI_CONFIG = {
    // llama-3.1-8b-instant: nhanh, miễn phí, hỗ trợ tool calling
    // Lỗi tool_use_failed trước đây đã được giải quyết bằng cách xóa anyOf khỏi tool schema
    MODEL_ID: "llama-3.1-8b-instant",
    MAX_ITERATIONS: 4,
    TEMPERATURE: 0.1,
};
