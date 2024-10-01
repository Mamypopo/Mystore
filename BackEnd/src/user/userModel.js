import pool from '../database.js'; 
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken'; 


export const createUser = async(username, email, password, address, phone_number, profileImage, role) => {

    const hashedPassword = await bcrypt.hash(password, 10); 
    const [result] = await pool.query(
        'INSERT INTO users (username, email, password, address, phone_number, profileImage ,role) VALUES (?, ?, ?, ?, ?, ?, ?)', [username, email, hashedPassword, address, phone_number, profileImage, role]
    );
    return result.insertId; 
};



export const getUserByEmail = async (email) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0]; 
};


export const getUserByUsername = async(username) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0]; 
};


// ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้ตาม ID
export const getUserById = async (userId) => {
    const query = 'SELECT * FROM users WHERE id = ?';  // คำสั่ง SQL สำหรับดึงข้อมูลผู้ใช้
    const [rows] = await pool.execute(query, [userId]);  // เรียกใช้คำสั่ง SQL และรับผลลัพธ์กลับมา
    return rows[0];  // ส่งข้อมูลผู้ใช้แถวแรกกลับไป
  };
  
  export const updateUser = async (userId, username, address, phone_number,  profileImage) => {
    const sql = `
      UPDATE users 
      SET username = ?, address = ?, phone_number = ?, profileImage = ? 
      WHERE id = ?
    `;
    const values = [username, address, phone_number, profileImage, userId];
    
    // เรียกใช้คำสั่ง SQL เพื่ออัปเดตข้อมูลในฐานข้อมูล
    const [result] = await pool.execute(sql, values);
    return result;
  };
  


export const verifyPassword = async(inputPassword, hashedPassword) => {
    return bcrypt.compare(inputPassword, hashedPassword); // ตรวจสอบความถูกต้องของรหัสผ่าน
};


export const generateToken = (user) => {
    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
};


export async function getUserEmail(userId) {
    const query = 'SELECT email FROM users WHERE id = ?';
    const [result] = await pool.query(query, [userId]);
    return result[0]?.email; // ตรวจสอบให้แน่ใจว่ามีการคืนค่าอีเมลที่ถูกต้อง
  }