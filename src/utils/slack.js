import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL || 'https://hooks.slack.com/services/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';

/**
 * Send a message to Slack webhook
 * @param {string} message - The message to send
 */
const sendSlackMessage = async (message) => {
    try {
        const response = await axios.post(SLACK_WEBHOOK_URL, { text: message }, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    } catch (error) {
        console.error("Slack Webhook Error:", error.response?.data || error.message);
        throw new Error('Failed to send message to Slack');
    }
};

// 🔹 API Route to send messages to Slack
app.post('/slack/send', async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Text message is required' });
    }

    try {
        await sendSlackMessage(text);
        res.json({ success: true, message: 'Message sent to Slack successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the Express Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
