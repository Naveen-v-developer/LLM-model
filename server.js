import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    process.env.FRONTEND_URL || "*"
  ],
  credentials: true
}));
app.use(express.json());

// Initialize Groq client
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

// Root endpoint (friendly message)
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "VaraNex AI backend is live. Use /health or /ask endpoints."
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Backend is running" });
});

// Main chat endpoint
app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || typeof question !== "string") {
      return res.status(400).json({ 
        error: "Invalid request. Please provide a valid question." 
      });
    }

    if (!process.env.GROQ_API_KEY) {
      console.error("❌ GROQ_API_KEY is not set");
      return res.status(500).json({ 
        error: "Server configuration error" 
      });
    }

    console.log("📨 Received question:", question.substring(0, 50) + "...");

    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are VaraNex AI, a helpful assistant. Respond in Markdown with headings, bullet points, and short paragraphs. Use emojis and decorative formatting to make answers visually appealing. Keep replies clear, concise, and easy to scan. Avoid long rambling text."
        },
        {
          role: "user",
          content: question
        }
      ],
      temperature: 0.7,
      max_tokens: 2048,
    });

    const answer = response.choices[0].message.content;
    console.log("✅ Response generated successfully");

    res.json({
      answer: answer,
      model: "llama-3.1-8b-instant",
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("🔥 Error:", error.message);
    
    if (error.status === 429) {
      return res.status(429).json({ 
        error: "Rate limit exceeded. Please try again in a moment." 
      });
    }

    if (error.status === 401) {
      return res.status(401).json({ 
        error: "Authentication failed. Check your API key." 
      });
    }

    res.status(500).json({ 
      error: error.message || "Failed to generate response. Please try again." 
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error("❌ Unexpected error:", err);
  res.status(500).json({ 
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🚀 Environment: ${process.env.NODE_ENV || "development"}`);
});