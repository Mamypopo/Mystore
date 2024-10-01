<template>
  <div class="container mt-4">
    <h1 class="text-center mb-4">Admin Order Dashboard</h1>
    <div class="table-responsive">
      <table class="table table-striped table-bordered">
        <thead class="thead-dark">
          <tr>
            <th>Order ID</th>
            <th>User ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Total Amount</th>
            <th>Created At</th>
            <th>Status</th>
            <th>Update Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.order_id" @click="viewUserOrders(order.user_id)">
            <td>{{ order.order_id }}</td>
            <td>{{ order.user_id }}</td>
            <td>{{ order.username }}</td>
            <td>{{ order.email }}</td>
            <td>{{ order.total_amount }}</td>
            <td>{{ new Date(order.created_at).toLocaleString() }}</td>
            <td>{{ order.status }}</td>
            <td>
              <select v-model="selectedStatus[order.order_id]" >
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
              <button @click="updateOrderStatus(order.order_id)" class="btn btn-primary mt-1">Update</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="userOrders.length" class="mt-4">
      <h2>Orders for User ID: {{ selectedUserId }}</h2>
      <ul class="list-group">
        <li v-for="order in userOrders" :key="order.id" class="list-group-item">
          Order ID: {{ order.id }}, Amount: {{ order.total_amount ? parseFloat(order.total_amount).toFixed(2) : 'N/A' }} ฿, Date: {{ new Date(order.created_at).toLocaleString() }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
export default {
  data() {
    return {
      orders: [],
      userOrders: [],
      selectedUserId: null,
      selectedStatus: {},
    };
  },
  created() {
    this.fetchOrders();
  },
  methods: {
    async fetchOrders() {
      try {
        const response = await axios.get('http://localhost:8000/api/orders');
        this.orders = response.data;
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    },
    async viewUserOrders(userId) {
      this.selectedUserId = userId;
      try {
        const response = await axios.get(`http://localhost:8000/api/orders/user/${userId}`);
        this.userOrders = response.data;
      } catch (error) {
        console.error('Error fetching user orders:', error);
      }
    },
    async updateOrderStatus(orderId) {
      const status = this.selectedStatus[orderId];
      if (!status) {
        console.error('Status not selected for order ID:', orderId);
        return;
      }
      try {
        const response = await fetch('http://localhost:8000/api/orders', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId, status }),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
          // แสดง SweetAlert2 แจ้งเตือนสำเร็จ
          Swal.fire({
          title: 'อัปเดตสถานะเรียบร้อย!',
          text: `สถานะของคำสั่งซื้อ ID: ${orderId} ได้ถูกอัปเดตเป็น "${status}"`,
          icon: 'success',
          confirmButtonText: 'ตกลง'
        });
         // อัปเดตสถานะที่แสดงในตาราง
        await this.fetchOrders(); // Refresh orders
      } catch (error) {
        console.error('Error updating order:', error);
        Swal.fire('เกิดข้อผิดพลาดในการอัปเดตสถานะคำสั่งซื้อ');
      }
    },
  
  },
};
</script>

<style>
.cursor-pointer {
  cursor: pointer;
}
.cursor-pointer:hover {
  background-color: #f8f9fa;
}
</style>
