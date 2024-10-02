<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <h5>เกี่ยวกับเรา</h5>
        <p>เราคือบริษัทที่จำหน่ายสินค้าที่ดีที่สุดในตลาด</p>
      </div>
      <div class="footer-section ">
        <h5>ติดต่อเรา</h5>
        <p>โทร: 012-345-6789</p>
        <p>อีเมล: support@example.com</p>
      </div>
      <div class="footer-section">
        <h5>social-media</h5>
        <ul class="social-media">
          <li><a href="#"><i class="fab fa-facebook-f"></i></a></li>
          <li><a href="#"><i class="fab fa-instagram"></i></a></li>
          
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; {{ new Date().getFullYear() }} บริษัทของเรา. สงวนลิขสิทธิ์.</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
};
</script>

<style scoped>


.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* ให้มีความสูงเต็มหน้าจอ */
  font-family: 'Noto Sans Thai', sans-serif;

}

.footer {
  background-color: #282c34;
  color: white;
  padding: 20px 0;
  text-align: center;
  margin-top: auto; /* ทำให้ Footer ติดอยู่ด้านล่าง */
}

.footer-content {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  padding: 0 20px; /* เพิ่ม Padding ด้านซ้ายและขวา */
}

.footer-section {
  margin: 10px 0;
  text-align: center; /* จัดข้อความให้อยู่กลาง */
}

.social-media {
  list-style: none;
  padding: 0;
  display: flex; /* ใช้ flex สำหรับจัดเรียง */
  justify-content: center; /* จัดให้อยู่ตรงกลาง */
}

.social-media li {
  margin: 0 15px; /* เพิ่มระยะห่างระหว่างไอคอน */
}

.social-media a {
  color: white; /* เปลี่ยนสีไอคอน */
  text-decoration: none; /* ลบขีดเส้นใต้ */
  font-size: 1.5rem; /* ขนาดไอคอน */
  transition: color 0.3s; /* เพิ่มการเปลี่ยนสีเมื่อเอาเมาส์ไปที่ไอคอน */
}

.social-media a:hover {
  color: #61dafb; /* เปลี่ยนสีเมื่อเอาเมาส์ไปที่ไอคอน */
}

.footer-bottom {
  margin-top: 20px;
}
</style>
