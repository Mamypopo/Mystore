import * as userModel from './userModel.js';
import * as cartModel from '../cart/cartModel.js';
import jwt from 'jsonwebtoken';
import fs from 'fs';
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Register a new user and create a cart
export async function registerUser(req, res) {
    console.log(req.body)
    try {
        const { username, email, password, address, phone_number, profileImage, role } = req.body;
        if (!username || !email || !password || !phone_number || !role) {
            return res.status(400).json({ error: 'username, email, and password are required' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const userResult = await userModel.createUser(username, email, hashedPassword, address, phone_number, profileImage, role);
        const userId = userResult[0].insertId;

        // Create cart for the new user
        await cartModel.createCart(userId);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error.message);
        res.status(500).json({ error: error.message });
    }
}



// ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้ตาม ID
export const getUserById = async (req, res) => {
    const userId = req.params.id;  // รับค่า userId จากพารามิเตอร์ใน URL
    try {
      const user = await userModel.getUserById(userId);  // เรียกใช้โมเดลเพื่อดึงข้อมูลผู้ใช้จากฐานข้อมูล
      if (!user) {  // ถ้าไม่พบผู้ใช้
        return res.status(404).json({ message: 'User not found' });  // ส่งสถานะ 404 กลับไปว่าผู้ใช้ไม่พบ
      }
      res.json(user);  // ส่งข้อมูลผู้ใช้กลับไปให้ฝั่ง frontend
    } catch (error) {
      console.error('Error retrieving user:', error);  // แสดงข้อผิดพลาดใน console
      res.status(500).json({ message: 'Internal Server Error' });  // ส่งสถานะ 500 กลับไปหากมีข้อผิดพลาด
    }
  };

  export const updateUser = async (req, res) => {
    const userId = req.params.id;
    const { username, address, phone_number } = req.body;
    const profileImage = req.file ? req.file.filename : null; // รับไฟล์รูปโปรไฟล์ถ้ามี
    try {
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' }); // ถ้าไม่มี userId ให้ส่งข้อความผิดพลาด
          }
      
          // เรียกข้อมูลผู้ใช้ปัจจุบันเพื่อตรวจสอบรูปโปรไฟล์เก่า
          const existingUser = await userModel.getUserById(userId);
          if (!existingUser) { // ถ้าไม่พบผู้ใช้
            return res.status(404).json({ message: 'User not found' }); // ส่งข้อความผู้ใช้ไม่พบ
          }
      
          // ถ้าไม่มีการส่งไฟล์ใหม่มา ให้ใช้รูปโปรไฟล์เก่า
          const newProfileImage = profileImage || existingUser.profileImage;
  
      const result = await userModel.updateUser(userId, username, address, phone_number, newProfileImage);  // เรียกใช้โมเดลเพื่ออัปเดตข้อมูลผู้ใช้
  
      if (result.affectedRows === 0) {  // ถ้าการอัปเดตไม่สำเร็จ (ไม่มีผู้ใช้ที่ตรงกับ userId)
        return res.status(404).json({ message: 'User not found' });  // ส่งสถานะ 404 กลับไปว่าผู้ใช้ไม่พบ
      }
  
      res.json({ message: 'User updated successfully' });  // ส่งข้อความยืนยันการอัปเดตกลับไป
    } catch (error) {
      console.error('Error updating user:', error);  // แสดงข้อผิดพลาดใน console
      res.status(500).json({ message: 'Internal Server Error' });  // ส่งสถานะ 500 กลับไปหากมีข้อผิดพลาด
    }
  };

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