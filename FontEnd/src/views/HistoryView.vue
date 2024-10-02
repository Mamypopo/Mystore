<template>
    <div class="container">
      <h2 class="my-4 text-center">ประวัติการสั่งซื้อ</h2>
      <div v-if="orders.length > 0" class="order-list">
        <div class="order card mb-4">
          <div class="card-body">
            <h5>คำสั่งซื้อทั้งหมด: {{ orders.length }} รายการ</h5>
            <div class="order-details">
              <div class="d-flex flex-column">
                <div v-for="order in orders" :key="order.id" class="order-item mb-3 p-3 border rounded">
                  <div class="d-flex justify-content-between">
                    <div>
                      <h6>Order ID: {{ order.id }}</h6>
                      <p>วันที่สั่งซื้อ: {{ formatDate(order.created_at) }}</p>
                      <p>ยอดรวม: <strong>{{ order.total_amount }} บาท</strong></p>
                    </div>
                    <div>
                      <button class="btn btn-secondary" @click="toggleOrderDetails(order)">ดูรายละเอียด</button>
                    </div>
                  </div>
                  <!-- แสดงรายละเอียดสินค้าเมื่อ selectedOrder มีค่า -->
                  <div v-if="selectedOrder && selectedOrder.id === order.id" class="mt-3">
                    <h6>รายละเอียดสินค้า:</h6>
                    <ul class="list-unstyled">
                      <li v-for="item in order.items" :key="item.product_id" class="item d-flex align-items-center mb-2">
                        <img :src="`http://localhost:8000/uploads/${item.image}`" alt="Product Image" class="product-image" />
                        <div class="item-details ms-3">
                          <p><strong>ชื่อสินค้า:</strong> {{ item.name }}</p>
                          <p><strong>ราคา:</strong> {{ item.price }} บาท</p>
                          <p><strong>จำนวน:</strong> {{ item.quantity }}</p>
                          <p><strong>ยอดรวม:</strong> {{ item.price * item.quantity }} บาท</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <p class="text-center">ยังไม่มีประวัติการสั่งซื้อ</p>
      </div>
    </div>
  </template>
<script>
import axios from 'axios';
import { useUserStore } from "../stores/userStore.js";

export default {
    data() {
        return {
            orders: [],
            selectedOrder: null,
        };
    },
    async mounted() {
        const userId = useUserStore().getUser.id;
        await this.fetchOrderHistory(userId);
    },
    methods: {
        async fetchOrderHistory(userId) {
            try {
                const response = await axios.get(`http://localhost:8000/api/orders/history/${userId}`);
                this.orders = response.data; // รับข้อมูลคำสั่งซื้อที่มีรายละเอียดสินค้า
            } catch (error) {
                console.error('Error fetching order history:', error);
            }
        },
        viewOrderDetails(order) {
            this.selectedOrder = order; // ตั้งค่า selectedOrder เป็นคำสั่งซื้อนี้
        },
        formatDate(dateString) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateString).toLocaleDateString('th-TH', options);
        },
        toggleOrderDetails(order) {
      this.selectedOrder = this.selectedOrder && this.selectedOrder.id === order.id ? null : order;
    },
    }
};
</script>

<style scoped>

.container {
  max-width: 800px;
  margin: 0 auto;
}
.order {
  border: none;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.product-image {
  max-width: 100px;
  height: auto;
}
.item {
  display: flex;
  align-items: center;
}
.item-details {
  margin-left: 15px; /* ระยะห่างระหว่างรูปภาพและรายละเอียดสินค้า */
}
.order-item {
  transition: background-color 0.3s;
}
.order-item:hover {
  background-color: #f8f9fa; /* เปลี่ยนสีพื้นเมื่อมีการ hover */
}
</style>
