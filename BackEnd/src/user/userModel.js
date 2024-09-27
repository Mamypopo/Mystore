import pool from '../database.js'; 
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken'; 


export const createUser = async(username, email, password, address, phone_number, role) => {

    const hashedPassword = await bcrypt.hash(password, 10); 
    const [result] = await pool.query(
        'INSERT INTO users (username, email, password, address, phone_number ,role) VALUES (?, ?, ?, ?, ?, ?)', [username, email, hashedPassword, address, phone_number, role]
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

export const getUserById = async (userId) => {
    try {
        const [rows] = await pool.query('SELECT id, username, email FROM users WHERE id = ?', [userId]);
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        throw error;
    }
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