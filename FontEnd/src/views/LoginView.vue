<template>
  <div class="auth-container" :class="{ wide: !isLogin }">
    <ul class="tab-list">
      <li :class="{ active: isLogin }" @click="isLogin = true">Login</li>
      <li :class="{ active: !isLogin }" @click="isLogin = false">Register</li>
    </ul>

    <div class="tab-content">
      <div v-if="isLogin">
        <h1 class="text-center">Login</h1>
        <form @submit.prevent="login">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              v-model="email"
              required
              class="form-control"
            />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              v-model="password"
              required
              class="form-control"
            />
          </div>
          <button type="submit" class="button-18">Login</button>
          <p class="text-center">
            Don't have an account? <router-link to="#" @click="isLogin = false">Register here</router-link>
          </p>
        </form>
      </div>

      <div v-else>
        <h1 class="text-center">Register</h1>
        <form @submit.prevent="register">
          <div class="form-row">
            <div class="form-group half-width">
              <label for="username">Username</label>
              <input
                type="text"
                id="username"
                v-model="username"
                required
                class="form-control"
              />
            </div>
            <div class="form-group half-width">
              <label for="email">Email</label>
              <input
                type="email"
                id="email"
                v-model="emailregister"
                required
                class="form-control"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group half-width">
              <label for="password">Password</label>
              <input
                type="password"
                id="password"
                v-model="passwordregister"
                required
                class="form-control"
              />
            </div>
            <div class="form-group half-width">
              <label for="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                v-model="confirmPassword"
                required
                class="form-control"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group half-width">
              <label for="phone_number">Phone Number</label>
              <input
                type="text"
                id="phone_number"
                v-model="phone_number"
                required
                class="form-control"
              />
            </div>
            <div class="form-group half-width">
              <label for="address">Address</label>
              <input
                type="text"
                id="address"
                v-model="address"
                required
                class="form-control"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="profileImage">Profile Image</label>
            <input
              type="file"
              id="profileImage"
              @change="handleFileUpload"
              class="form-control"
            />
          
          </div>
          
          <button type="submit" class="button-18">Register</button>
          <p class="text-center">
            Already have an account? <router-link to="#" @click="isLogin = true">Login here</router-link>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useUserStore } from '../stores/userStore.js';
import Swal from 'sweetalert2';

export default {
  name: 'LoginView',
  data() {
    return {
      isLogin: true,
      email: '',
      password: '',
      emailregister: '',
      passwordregister: '',
      name: '',
      confirmPassword: '',
      username: '',
      address: '',
      phone_number: '',
      profileImage: '',
      imageFile: null,
      errorMessage: '',
      role: ''
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('http://localhost:8000/auth/login', {
          email: this.email,
          password: this.password,
        });
        const user = response.data.user; // เก็บข้อมูลผู้ใช้
        const userStore = useUserStore(); // เข้าถึง userStore
        userStore.setUser(user); // เก็บข้อมูลผู้ใช้ลงใน state    
        const token = response.data.token;
        localStorage.setItem('token', token);
        this.$router.push('/'); // Redirect to home or desired route
        Swal.fire('Success!', 'Logged in successfully.', 'success');
      } catch (error) {
        Swal.fire('Error!', 'Invalid email or password.', 'error');
      }
    },

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
        formData.append('email', this.emailregister);
        formData.append('password', this.passwordregister);
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
  },
};
</script>

<style scoped>
.auth-container {
  max-width: 400px; /* ขนาดเริ่มต้น */
  margin: 50px auto;
  padding: 20px;
  border-radius: 5px;
  background-color: #f9f9f9;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: max-width 0.3s; /* เพิ่มการเปลี่ยนแปลงขนาด */
}

.auth-container.wide {
  max-width: 600px; /* ขนาดที่กว้างขึ้นสำหรับ Register */
}

.tab-list {
  display: flex;
  justify-content: space-around;
  border-bottom: 2px solid #3498db;
  list-style: none;
  padding: 0;
}

.tab-list li {
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s;
  flex: 1; /* ทำให้แท็บมีขนาดเท่ากัน */
  text-align: center; /* จัดให้อยู่กลาง */
}

.tab-list li.active {
  background-color: #3498db;
  color: white;
  border-radius: 5px 5px 0 0;
}

.tab-content {
  padding: 20px;
}

h1 {
  margin-bottom: 20px;
  text-align: center;
}

.register-form {
  display: flex;
  flex-wrap: wrap; /* ให้ฟอร์มมีการห่อหุ้ม */
  justify-content: space-between; /* จัดให้ไอเท็มอยู่ห่างกัน */
}

.form-group {
  margin-bottom: 15px;
  width: 100%; /* ทำให้ input กว้างเต็มที่ */
}

.form-control {
  width: 100%; /* ทำให้ input กว้างเต็มที่ */
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.profile-preview {
  margin-top: 10px;
  max-width: 100%; /* ขนาดสูงสุดของภาพ */
  border-radius: 5px; /* มุมกลม */
}

.button-18 {
  width: 100%;
  padding: 10px;
  background-color: #3498db;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.button-18:hover {
  background-color: #2980b9;
}

.text-center {
  text-align: center;
}
.half-width {
  width: calc(50% - 10px); /* ช่อง input จะกว้างครึ่งหนึ่ง */
  display: inline-block;
  margin-right: 10px;
}

</style>
