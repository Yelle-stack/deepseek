import OpenAI from "openai";

// Initialize OpenAI client with DeepSeek API key and base URL
const openai = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: process.env.DEEPSEEK_API_KEY,
});

export async function POST(){
    
}