import * as userModel from './userModel.js';
import * as cartModel from '../cart/cartModel.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Register a new user and create a cart
export async function registerUser(req, res) {
    console.log(req.body)
    try {
        const { username, email, password, address, phone_number, role } = req.body;
        if (!username || !email || !password || !phone_number || !role) {
            return res.status(400).json({ error: 'username, email, and password are required' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const userResult = await userModel.createUser(username, email, hashedPassword, address, phone_number, role);
        const userId = userResult[0].insertId;

        // Create cart for the new user
        await cartModel.createCart(userId);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error.message);
        res.status(500).json({ error: error.message });
    }
}

// Login user and return a JWT
export async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const [users] = await userModel.findUserByEmail(email);
        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error logging in user:', error.message);
        res.status(500).json({ error: error.message });
    }
}