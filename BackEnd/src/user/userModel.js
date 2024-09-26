import pool from '../database.js'; // เชื่อมต่อกับฐานข้อมูล
import bcrypt from 'bcrypt'; // ใช้สำหรับการเข้ารหัสรหัสผ่าน
import jwt from 'jsonwebtoken'; // ใช้สำหรับสร้าง JWT

// ฟังก์ชันในการสร้างผู้ใช้ใหม่
export const createUser = async(username, email, password, address, phone_number, role) => {

    const hashedPassword = await bcrypt.hash(password, 10); // เข้ารหัสรหัสผ่าน
    const [result] = await pool.query(
        'INSERT INTO users (username, email, password, address, phone_number ,role) VALUES (?, ?, ?, ?, ?, ?)', [username, email, hashedPassword, address, phone_number, role]
    );
    return result.insertId; // ส่งคืน ID ของผู้ใช้ที่สร้างขึ้น
};

// ฟังก์ชันในการค้นหาผู้ใช้โดยอีเมล
export const getUserByEmail = async (email) => {
    const [rows] = await pool.query('SELECT id, email, password, role, phone_number FROM users WHERE email = ?', [email]);
    return rows[0]; // คืนค่าผู้ใช้ที่ตรงตามอีเมล
};
// ฟังก์ชันในการค้นหาผู้ใช้โดยชื่อผู้ใช้
export const getUserByUsername = async(username) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0]; // ส่งคืนข้อมูลของผู้ใช้ที่พบ
};

export const getUserById = async (userId) => {
    try {
        const [rows] = await pool.query('SELECT id, username, email FROM users WHERE id = ?', [userId]);
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        throw error;
    }
};
// ฟังก์ชันในการตรวจสอบรหัสผ่าน
export const verifyPassword = async(inputPassword, hashedPassword) => {
    return bcrypt.compare(inputPassword, hashedPassword); // ตรวจสอบความถูกต้องของรหัสผ่าน
};

// ฟังก์ชันในการสร้าง JWT
export const generateToken = (user) => {
    return jwt.sign({ id: user.id, username: user.username, email: user.email, }, process.env.JWT_SECRET, { expiresIn: '1h' });
};


export async function getUserEmail(userId) {
    const query = 'SELECT email FROM users WHERE id = ?';
    const [result] = await pool.query(query, [userId]);
    return result[0]?.email; // ตรวจสอบให้แน่ใจว่ามีการคืนค่าอีเมลที่ถูกต้อง
  }