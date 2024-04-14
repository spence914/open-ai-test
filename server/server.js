const express = require('express');
const axios = require('axios');
require('dotenv').config();
const app = express();
const cors = require('cors');
const morgan = require('morgan');

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const PORT = process.env.PORT || 3003;

app.post('/api/openai', async (req, res) => {
    console.log('Request body:', req.body);
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: [{
                role: "user",
                content: req.body.prompt
            }]
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Failed to fetch from OpenAI:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: "Failed to process request", details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
