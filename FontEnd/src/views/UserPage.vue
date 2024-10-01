<template>
  <section>
    <div class="container">
      <div class="user-profile">
        <div class="profile-info">
          <img :src="`http://localhost:8000/uploads/${profileImageUrl}`" alt="Profile Image" class="profile-image">
          <h2>{{ getUser.name }}</h2>
          <p>Email: {{ getUser.email }}</p>
          <p>Phone: {{ getUser.phone }}</p>
          <button class="btn-edit" @click="toggleEditMode">{{ isEditing ? 'ยกเลิก' : 'แก้ไขข้อมูลผู้ใช้' }}</button>
        </div>
      </div>

      <!-- แสดงฟอร์มแก้ไขข้อมูลผู้ใช้ -->
      <div class="edit-profile" v-if="isEditing">
        <h2>แก้ไขข้อมูลผู้ใช้</h2>
        <form @submit.prevent="updateProfile(getUser.id)">
          <label>
            ชื่อผู้ใช้:
            <input type="text" v-model="username" required />
          </label>
          <label>
            ที่อยู่:
            <input type="text" v-model="address" required />
          </label>
          <label>
            เบอร์โทรศัพท์:
            <input type="tel" v-model="phone_number" required />
          </label>
          <label>
            รูปโปรไฟล์:
            <input type="file" @change="onFileChange" />
          </label>
          <button type="submit" class="btn-update">อัปเดตข้อมูล</button>
          <button type="button" class="btn-cancel" @click="toggleEditMode">กลับ</button>
        </form>
      </div>

      <div class="tabs" v-if="!isEditing">
        <button :class="{ active: activeTab === 'orderHistory' }" @click="activeTab = 'orderHistory'">ประวัติการสั่งซื้อ</button>
        <button :class="{ active: activeTab === 'tracking' }" @click="activeTab = 'tracking'">ติดตามสถานะคำสั่งซื้อ</button>
      </div>

      <div class="order-content" v-if="activeTab === 'orderHistory' && !isEditing">
        <h2>ประวัติการสั่งซื้อ</h2>
        <div v-if="orders.length === 0">
          <p>ยังไม่มีประวัติการสั่งซื้อ</p>
        </div>
        <ul v-else>
          <li v-for="order in orders" :key="order.id" class="order-item">
            <p>หมายเลขการสั่งซื้อ: {{ order.id }}</p>
            <p>วันที่สั่งซื้อ: {{ formatDate(order.created_at) }}</p>
            <p>ยอดรวม: {{ order.total_amount }}</p>
            <ul class="order-details">
              <li v-for="item in order.items" :key="item.product_id" class="order-detail">
                <img :src="`http://localhost:8000/uploads/${item.image}`" alt="Product Image" class="order-image">
                <p>ชื่อสินค้า: {{ item.name }}</p>
                <p>จำนวน: {{ item.quantity }}</p>
                <p>ราคา: {{ item.price }}</p>
              </li>
            </ul>
            <hr>
          </li>
        </ul>
      </div>

      <div class="order-content" v-if="activeTab === 'tracking' && !isEditing">
        <h2>ติดตามสถานะคำสั่งซื้อ</h2>
        <div v-if="orders.length === 0">
          <p>ยังไม่มีประวัติการสั่งซื้อ</p>
        </div>
        <ul v-else>
          <li v-for="order in orders" :key="order.id" class="order-item">
            <p>หมายเลขการสั่งซื้อ: {{ order.id }}</p>
            <p>สถานะคำสั่งซื้อ: <strong>{{ order.status }}</strong></p>
            <p>วันที่สั่งซื้อ: {{ formatDate(order.created_at) }}</p>
            <hr>
          </li>
        </ul>
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
      activeTab: 'orderHistory', // กำหนดแท็บเริ่มต้น
    };
  },
  computed: {
    getUser() {
      return useUserStore().getUser;
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
        this.orders = response.data;
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
  display: flex;
  flex-direction: column;
  padding: 20px;
  max-width: 800px;
  margin: auto;
}

.user-profile {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding-bottom: 20px;
}

.profile-info {
  text-align: center;
  margin-right: 20px;
}

.profile-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px solid #007bff;
}

.edit-profile {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ddd;
}

.tabs {
  display: flex;
  margin: 20px 0;
}

.tabs button {
  flex: 1;
  padding: 10px;
  cursor: pointer;
  background-color: #f1f1f1;
  border: 1px solid #ddd;
}

.tabs button.active {
  background-color: #007bff;
  color: white;
}

.order-content {
  margin-top: 20px;
}

.order-item {
  padding: 10px;
  border-bottom: 1px solid #ddd;
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
  width: 50px;
  height: 50px;
  margin-right: 10px;
}

.btn-edit,
.btn-update,
.btn-cancel {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

.btn-cancel {
  background-color: #dc3545; /* สีแดงสำหรับปุ่มยกเลิก */
}
</style>
