<template>
  <section>
    <div class="container">
      <div class="user-section d-flex">
        <!-- Profile Information and Edit Form -->
        <div class="profile-column">
          <div class="user-profile">
            <div class="profile-info">
              <img :src="`http://localhost:8000/uploads/${profileImageUrl}`" alt="Profile Image" class="profile-image">
              <h2>{{ getUser.name }}</h2>
              <p>Email: {{ getUser.email }}</p>
              <p>Phone: {{ getUser.phone }}</p>
              <p>Address: {{ getUser.address }}</p>
              <button class="btn-edit" @click="toggleEditMode">{{ isEditing ? 'Cancel' : 'Edit Profile' }}</button>
            </div>
          </div>

          <!-- Edit Profile Form -->
          <!-- Edit Profile Modal -->
<div v-if="isEditing" class="modal">
  <div class="modal-content">
    <span class="close" @click="toggleEditMode">&times;</span>
    <h2>Edit Profile</h2>
    <form @submit.prevent="updateProfile(getUser.id)">
      <label>
        Username:
        <input type="text" v-model="username" required />
      </label>
      <label>
        Address:
        <input type="text" v-model="address" required />
      </label>
      <label>
        Phone:
        <input type="tel" v-model="phone_number" required />
      </label>
      <label>
        Profile Image:
        <input type="file" @change="onFileChange" />
      </label>
      <button type="submit" class="btn-update">Update</button>
      <button type="button" class="btn-cancel" @click="toggleEditMode">Cancel</button>
    </form>
  </div>
</div>

        </div>

        <!-- Order Tabs and Content -->
        <div class="order-column">
          <!-- Tabs -->
     <!-- Tabs -->
<div class="tabs" v-if="!isEditing">
  <button :class="{ active: activeTab === 'all' }" @click="activeTab = 'all'">
    All 
    <span v-if="orders.length > 0"></span>
  </button>
  <button :class="{ active: activeTab === 'delivered' }" @click="activeTab = 'delivered'">
    Delivered 
    <span v-if="deliveredOrders.length > 0" class="badge">{{ deliveredOrders.length }}</span>
  </button>
  <button :class="{ active: activeTab === 'shipped' }" @click="activeTab = 'shipped'">
    Shipped 
    <span v-if="shippedOrders.length > 0" class="badge">{{ shippedOrders.length }}</span>
  </button>
  <button :class="{ active: activeTab === 'processing' }" @click="activeTab = 'processing'">
    Processing 
    <span v-if="processingOrders.length > 0" class="badge">{{ processingOrders.length }}</span>
  </button>
</div>

<!-- All Orders -->
<div class="order-content" v-if="activeTab === 'all' && !isEditing">
  <h2>All Orders</h2>
  <div v-if="orders.length === 0">
    <p>No orders found</p>
  </div>
  <ul v-else>
    <li v-for="order in orders" :key="order.id" class="order-item">
      <p>Order ID: {{ order.id }}</p>
      <p>Order Date: {{ formatDate(order.created_at) }}</p>
      <p>Status: <strong>{{ order.status }}</strong></p>
      <p>Total: {{ order.total_amount }}</p>
      <ul class="order-details">
        <li v-for="item in order.items" :key="item.product_id" class="order-detail">
          <img :src="`http://localhost:8000/uploads/${item.image}`" alt="Product Image" class="order-image">
          <p>Product: {{ item.name }}</p>
          <p>Quantity: {{ item.quantity }}</p>
          <p>Price: {{ item.price }}</p>
        </li>
      </ul>
      <hr>
    </li>
  </ul>
</div>

         <!-- Delivered Orders -->
<div class="order-content" v-if="activeTab === 'delivered' && !isEditing">
  <h2>Delivered Orders</h2>
  <div v-if="deliveredOrders.length === 0">
    <p>No delivered orders yet</p>
  </div>
  <ul v-else>
    <li v-for="order in deliveredOrders" :key="order.id" class="order-item">
      <p>Order ID: {{ order.id }}</p>
      <p>Order Date: {{ formatDate(order.created_at) }}</p>
      <p>Total: {{ order.total_amount }}</p>
      <ul class="order-details">
        <li v-for="item in order.items" :key="item.product_id" class="order-detail">
          <img :src="`http://localhost:8000/uploads/${item.image}`" alt="Product Image" class="order-image">
          <p>Product: {{ item.name }}</p>
          <p>Quantity: {{ item.quantity }}</p>
          <p>Price: {{ item.price }}</p>
        </li>
      </ul>
      <hr>
    </li>
  </ul>
</div>

         <!-- Shipped Orders -->
<div class="order-content" v-if="activeTab === 'shipped' && !isEditing">
  <h2>Shipped Orders</h2>
  <div v-if="shippedOrders.length === 0">
    <p>No shipped orders yet</p>
  </div>
  <ul v-else>
    <li v-for="order in shippedOrders" :key="order.id" class="order-item">
      <p>Order ID: {{ order.id }}</p>
      <p>Order Date: {{ formatDate(order.created_at) }}</p>
      <p>Total: {{ order.total_amount }}</p>
      <hr>
    </li>
  </ul>
</div>

<!-- Processing Orders -->
<div class="order-content" v-if="activeTab === 'processing' && !isEditing">
  <h2>Processing Orders</h2>
  <div v-if="processingOrders.length === 0">
    <p>No processing orders yet</p>
  </div>
  <ul v-else>
    <li v-for="order in processingOrders" :key="order.id" class="order-item">
      <p>Order ID: {{ order.id }}</p>
      <p>Order Date: {{ formatDate(order.created_at) }}</p>
      <p>Total: {{ order.total_amount }}</p>
      <hr>
    </li>
  </ul>
</div>
         
        </div>
      </div>
    </div>
  </section>

</template>

<script>
import axios from 'axios';
import { useUserStore } from '../stores/userStore'; 
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      isEditing: false,  
      username: '',
      address: '',
      phone_number: '',
      profileImage: null,
      profileImageUrl: '',
      orders: [],
      activeTab: 'delivered', // กำหนดแท็บเริ่มต้นเป็น 'delivered'
    };
  },
  computed: {
    getUser() {
      return useUserStore().getUser;
    },
    deliveredOrders() {
      return this.orders.filter(order => order.status === 'Delivered');
    },
    shippedOrders() {
      return this.orders.filter(order => order.status === 'Shipped');
    },
    processingOrders() {
      return this.orders.filter(order => order.status === 'Processing');
    },
    
  },
  async mounted() {
    const userId = this.getUser.id;
    await this.fetchOrderHistory(userId);
    await this.fetchUserData(userId);
  },
  methods: {
    toggleEditMode() {
  this.isEditing = !this.isEditing; 
  if (!this.isEditing) {
    this.fetchUserData(this.getUser.id); 
  }
},
    async fetchUserData(userId) {
      try {
        const response = await axios.get(`http://localhost:8000/api/users/${userId}`);
        this.username = response.data.username;
        this.address = response.data.address;
        this.phone_number = response.data.phone_number;
        this.profileImageUrl = response.data.profileImage;
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    },
    onFileChange(e) {
      this.profileImage = e.target.files[0];
    },
    async updateProfile(userId) {
      const result = await Swal.fire({
        title: 'ยืนยันการอัปเดต?',
        text: 'คุณต้องการอัปเดตข้อมูลโปรไฟล์ของคุณหรือไม่?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ตกลง',
        cancelButtonText: 'ยกเลิก',
      });

      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append('username', this.username);
        formData.append('address', this.address);
        formData.append('phone_number', this.phone_number);
        if (this.profileImage) {
          formData.append('profileImage', this.profileImage);
        }

        try {
          await axios.patch(`http://localhost:8000/api/users/${userId}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          Swal.fire('สำเร็จ!', 'ข้อมูลของคุณได้รับการอัปเดตเรียบร้อยแล้ว!', 'success');
          this.toggleEditMode(); 
        } catch (error) {
          console.error('Error updating profile:', error);
          Swal.fire('ผิดพลาด!', 'ไม่สามารถอัปเดตข้อมูลได้.', 'error');
        }
      }
    },
  
    async fetchOrderHistory(userId) {
      try {
        const response = await axios.get(`http://localhost:8000/api/orders/history/${userId}`);
        this.orders = response.data; // อาจต้องปรับให้เหมาะกับรูปแบบข้อมูลที่ได้มา
      } catch (error) {
        console.error('Error fetching order history:', error);
      }
    },
    formatDate(dateString) {
      if (!dateString) return 'ไม่มีข้อมูล';
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('th-TH', options);
    },
  },
};
</script>


<style scoped>
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.user-section {
  display: flex;
  justify-content: space-between;
}

.profile-column {
  flex: 1;
  margin-right: 20px;
}

.order-column {
  flex: 2;
}

.user-profile, .edit-profile {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
}

.profile-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 15px;
}

h2 {
  font-size: 1.8em;
  color: #333;
}

p {
  font-size: 1.2em;
  color: #666;
}

.btn-edit, .btn-update, .btn-cancel {
  padding: 10px 20px;
  border: none;
  background-color: #3498db;
  color: #fff;
  cursor: pointer;
  border-radius: 5px;
  margin: 10px 0;
  transition: background-color 0.3s;
}

.btn-edit:hover, .btn-update:hover, .btn-cancel:hover {
  background-color: #2980b9;
}

.tabs {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.tabs button {
  padding: 10px 20px;
  border: none;
  background-color: #f1f1f1;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
  width: 100%;
  margin: 0 5px;
}

.tabs button.active {
  background-color: #3498db;
  color: #fff;
}

.order-item {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.order-details {
  list-style: none;
  padding: 0;
}

.order-detail {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.order-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 5px;
  margin-right: 10px;
}

hr {
  margin: 15px 0;
}

.badge {
  background-color: red; /* สีของ badge */
  color: white;
  border-radius: 50%;
  padding: 0.2em 0.5em;
  font-size: 0.8em;
  margin-left: 0.5em; /* เว้นระยะจากข้อความ */
}



.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8); /* เปลี่ยนสีพื้นหลังให้เข้มขึ้น */
  backdrop-filter: blur(5px); /* เพิ่ม blur ให้กับพื้นหลัง */
}

.modal-content {
  background-color: #ffffff; /* เปลี่ยนสีพื้นหลังของ modal */
  padding: 30px; /* เพิ่มพื้นที่รอบๆ */
  border-radius: 10px; /* มุมที่โค้งมน */
  width: 400px; /* ความกว้างของ modal */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25); /* เพิ่มเงาให้ดูนุ่มนวล */
  position: relative;
  animation: fadeIn 0.3s; /* เพิ่ม animation */
}

.close {
  position: absolute;
  right: 15px; /* ทำให้ปุ่มปิดอยู่ห่างจากขอบ */
  top: 15px; /* ทำให้ปุ่มปิดอยู่ห่างจากขอบ */
  font-size: 20px; /* ขนาดตัวอักษร */
  color: #3498db; /* เปลี่ยนสี */
  cursor: pointer;
}

.close:hover {
  color: #2980b9; /* สีเมื่อเลื่อนเมาส์ไปที่ปุ่มปิด */
}

h2 {
  font-size: 1.8em; /* ขนาดตัวอักษรของหัวข้อ */
  margin-bottom: 15px; /* ช่องว่างใต้หัวข้อ */
  color: #333; /* สีตัวอักษร */
}

label {
  display: block; /* จัดการแสดง label ให้เป็น block */
  margin: 15px 0 5px; /* ช่องว่างรอบๆ label */
}

input[type="text"],
input[type="tel"],
input[type="file"] {
  width: 100%; /* ความกว้างเต็ม */
  padding: 10px; /* ช่องว่างภายใน */
  border: 1px solid #ccc; /* เส้นขอบ */
  border-radius: 5px; /* มุมที่โค้งมน */
  box-sizing: border-box; /* รวม padding และ border ในความกว้าง */
}

input[type="file"] {
  padding: 5px; /* ปรับ padding สำหรับ input file */
}

.btn-update, .btn-cancel {
  padding: 10px 15px; /* ขนาดของปุ่ม */
  border: none; /* ไม่มีเส้นขอบ */
  background-color: #3498db; /* สีพื้นหลัง */
  color: #fff; /* สีตัวอักษร */
  cursor: pointer; /* เปลี่ยนเคอร์เซอร์เมื่อเลื่อนเมาส์ */
  border-radius: 5px; /* มุมที่โค้งมน */
  margin: 10px 5px 0; /* ช่องว่างรอบๆ */
  transition: background-color 0.3s; /* เพิ่มการเปลี่ยนสีเมื่อ hover */
}

.btn-update:hover, .btn-cancel:hover {
  background-color: #2980b9; /* สีเมื่อ hover */
}

/* Animation for modal */
@keyframes fadeIn {
  from {
    opacity: 0; /* เริ่มจากโปร่งใส */
  }
  to {
    opacity: 1; /* สิ้นสุดที่โปร่งใสเต็มที่ */
  }
}


</style>
