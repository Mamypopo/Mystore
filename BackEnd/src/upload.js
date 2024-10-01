import multer from 'multer';

// กำหนด storage และตั้งค่า multer สำหรับการอัปโหลดไฟล์
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads'); // กำหนดโฟลเดอร์ปลายทางที่ไฟล์จะถูกบันทึก
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // กำหนดชื่อไฟล์ใหม่ให้ไม่ซ้ำกันโดยใช้เวลาในการสร้างชื่อ
    },
});

const upload = multer({ storage }); // สร้างตัวแปร upload สำหรับจัดการการอัปโหลดไฟล์

export default upload;