import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Initialize Gemini SDK with telemetry user-agent
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Check API status
app.get('/api/status', (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const isConfigured = !!apiKey && apiKey !== 'MY_GEMINI_API_KEY';
  res.json({
    status: isConfigured ? 'configured' : 'missing',
    message: isConfigured 
      ? 'Gemini API key is configured successfully.' 
      : 'Gemini API key is missing. Please set GEMINI_API_KEY in Settings > Secrets.',
  });
});

// Prompt completion
app.post('/api/gemini/generate', async (req, res) => {
  try {
    const { prompt, systemInstruction, temperature, topP, topK } = req.body;
    
    if (!prompt) {
      res.status(400).json({ error: 'Prompt is required.' });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.status(400).json({ 
        error: 'API_KEY_MISSING',
        message: 'Gemini API key is missing. Please configure GEMINI_API_KEY in the Secrets panel in AI Studio.' 
      });
      return;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: temperature !== undefined ? Number(temperature) : undefined,
        topP: topP !== undefined ? Number(topP) : undefined,
        topK: topK !== undefined ? Number(topK) : undefined,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Gemini generate error:', error);
    res.status(500).json({ error: 'Failed to generate content', details: error.message || error });
  }
});

// Chat completion (accepts history messages)
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { messages, systemInstruction, temperature } = req.body;
    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: 'Messages array is required.' });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.status(400).json({ 
        error: 'API_KEY_MISSING',
        message: 'Gemini API key is missing.' 
      });
      return;
    }

    // Prepare contents in chat format: { role: 'user' | 'model', parts: [{ text: '...' }] }
    const contents = messages.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    // The chat object doesn't accept a history easily without initializing a chat or just sending the whole contents array. 
    // In @google/genai, ai.models.generateContent accepts raw contents history, which is extremely robust.
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction,
        temperature: temperature !== undefined ? Number(temperature) : undefined,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Gemini chat error:', error);
    res.status(500).json({ error: 'Failed to complete chat message', details: error.message || error });
  }
});

// Boot servers
const PORT = 3000;

async function start() {
  if (process.env.NODE_ENV === 'production') {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, 'dist')));
    
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Production server running on port ${PORT}`);
    });
  } else {
    // Lazy-load Vite in development
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    
    app.use(vite.middlewares);
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Development server running on http://localhost:${PORT}`);
    });
  }
}

start().catch((err) => {
  console.error('Failed to start server:', err);
});
