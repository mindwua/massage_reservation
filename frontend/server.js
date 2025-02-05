import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5001';

app.use(cors({
    origin: frontendUrl,
    methods: ['GET', 'POST'],
}));

app.use(express.json());

app.post('/api/v1/register', (req, res) => {
    const { name, password, email, telephone } = req.body;

    if (!name || !password || !email || !telephone) {
        return res.status(400).send({
            success: false,
            message: 'Missing required fields',
        });
    }

    res.status(201).send({
        success: true,
        message: 'User registered successfully',
        data: {
            name,
            email,
            telephone,
        },
    });
});

const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';

app.listen(5001, () => {
    console.log(`Server running on ${backendUrl}`);
    console.log(process.env.BACKEND_URL);
});
