import { createUser, getUserByEmail, verifyPassword, generateToken  } from '../user/userModel.js';

import multer from 'multer';

export const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });
// ฟังก์ชันสำหรับการลงทะเบียนผู้ใช้ใหม่
export const register = async(req, res) => {
    const { username, email, password, address, phone_number, role } = req.body;
    const profileImage = req.file ? req.file.filename : null; // รับไฟล์รูปโปรไฟล์ถ้ามี
     console.log('Received values:', { username, phone_number, address,  profileImage });
    if (!username || !email || !password || !address || !phone_number || !profileImage || !role) {
        return res.status(400).json({ error: 'Username, email, password, address, and phone number are required' });
    }
    try {
        // ตรวจสอบอีเมลว่ามีอยู่แล้วหรือไม่
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        
        // สร้างผู้ใช้ใหม่
        const userId = await createUser(username, email, password, address, phone_number, profileImage, role);
       
        res.status(201).json({ message: 'User registered successfully', userId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// ฟังก์ชันสำหรับการล็อกอินผู้ใช้
export const login = async(req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // ค้นหาผู้ใช้โดยอีเมล
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // ตรวจสอบรหัสผ่าน
        const validPassword = await verifyPassword(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // console.log('login user' , user)
        // สร้างและส่งคืน JWT
        const token = generateToken(user);
        res.json({ token, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getProfile = async(req, res, next) => {
    try {
        const user = req.user
      
        res.status(200).send({
            user
        });
    } catch (error) {

        next(error);
    }
};


