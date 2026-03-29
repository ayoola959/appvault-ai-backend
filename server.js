const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// FAKE API KEY - REPLACE WITH YOUR REAL KEY LATER (in Render environment variables)
const OPENAI_API_KEY = "ndbskashskdbdmsbdmshssmsbsdndbdndn";

app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;
    if (!userMessage) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant for App Vault, a safe app download platform.' },
                    { role: 'user', content: userMessage }
                ],
                temperature: 0.7,
                max_tokens: 500
            })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error?.message || 'OpenAI API error');
        }

        const reply = data.choices[0].message.content;
        res.json({ reply });
    } catch (error) {
        console.error('Backend error:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
