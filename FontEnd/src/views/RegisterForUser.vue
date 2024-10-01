<template>
  <div class="container">
    <h2>สมัครสมาชิก</h2>
    <form @submit.prevent="register">
      <div>
        <label for="profileImage">รูปโปรไฟล์:</label>
        <input type="file" @change="handleFileUpload" id="profileImage" accept="image/*" />
      </div>
      <div>
        <img v-if="profileImage" :src="profileImage" alt="Profile Preview" class="profile-preview" />
      </div>
      <div>
        <label for="username">ชื่อผู้ใช้:</label>
        <input type="text" v-model="username" id="username" required />
      </div>
      <div>
        <label for="email">อีเมล:</label>
        <input type="email" v-model="email" id="email" required />
      </div>
      <div>
        <label for="password">รหัสผ่าน:</label>
        <input type="password" v-model="password" id="password" required />
      </div>
      <div>
        <label for="phone_number">เบอร์โทร:</label>
        <input type="text" v-model="phone_number" id="phone_number" required />
      </div>
      <div>
        <label for="address">ที่อยู่:</label>
        <input type="text" v-model="address" id="address" required />
      </div>
      <button type="submit">สมัครสมาชิก</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      username: '',
      email: '',
      password: '',
      address: '',
      phone_number: '',
      profileImage: '',
      imageFile: null,
      errorMessage: '',
      role:''
    };
  },
  methods: {
    handleFileUpload(event) {
      this.imageFile = event.target.files[0]; // เก็บไฟล์ที่เลือก
      this.profileImage = URL.createObjectURL(this.imageFile); // แสดงตัวอย่างภาพ
    },
    async register() {
      const result = await Swal.fire({
    title: 'ยืนยันการสมัครสมาชิก?',
    text: 'คุณต้องการสมัครสมาชิกหรือไม่?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'ตกลง',
    cancelButtonText: 'ยกเลิก'
  });
if (result.isConfirmed) {
  const formData = new FormData();
      formData.append('username', this.username);
      formData.append('email', this.email);
      formData.append('password', this.password);
      formData.append('phone_number', this.phone_number);
      formData.append('address', this.address);
      formData.append('role', 'customer');
      if (this.imageFile) {
        formData.append('profileImage', this.imageFile); // เพิ่มรูปโปรไฟล์
      }

      try {
        const response = await axios.post('http://localhost:8000/auth/register', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Registration successful:', response.data);
        Swal.fire('สำเร็จ!', 'คุณสมัครสมาชิกเรียบร้อยแล้ว!', 'success');
        this.$router.push('/login'); 
      } catch (error) {
        console.error('Error registering user:', error.response.data);
        Swal.fire('ผิดพลาด!', 'ไม่สามารถสมัครสมาชิกได้.', 'error');
      }
    }
  },
}
    
};
</script>

<style scoped>
.container {
  text-align: center;
  padding: 20px;
  width: 30%;
}
.profile-preview {
  max-width: 150px;
  max-height: 150px;
  margin-top: 10px;
}
</style>
