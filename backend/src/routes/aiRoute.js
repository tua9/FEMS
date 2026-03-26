import express from 'express'
import User from '../models/User.js';
import runAgent from '../groq-ai/index.js';

const router = express.Router();

router.post('/chat', async (req, res) => {
    try {
        const { user_id, message, history } = req.body
        if (!user_id) return res.status(400).json({ message: 'Missing user_id' })
        //Get User By Id
        const user = await User.findById(user_id)
        if (!user) return res.status(404).json({ message: 'User not found' })

        const response = await runAgent(user, message, history)
        return res.status(200).json({ message: 'Gọi AI thành công', response })
    } catch (error) {
        console.log('error while calling AI: ', error.message);
        return res.status(500).json({ message: 'Internal server error' })
    }
})

export default router