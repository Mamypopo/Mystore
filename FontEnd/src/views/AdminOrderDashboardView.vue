<template>
  <div class="container mt-4">
    <h1 class="text-center mb-4">Admin Order Dashboard</h1>
  
    <div class="table-responsive">
      <table class="table table-striped table-bordered table-hover">
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
          <tr v-for="order in orders" :key="order.order_id" @click="viewUserOrders(order.user_id)" class="cursor-pointer">
            <td>{{ order.order_id }}</td>
            <td>{{ order.user_id }}</td>
            <td>{{ order.username }}</td>
            <td>{{ order.email }}</td>
            <td>{{ order.total_amount }} ฿</td>
            <td>{{ new Date(order.created_at).toLocaleString() }}</td>
            <td>{{ order.status }}</td>
            <td class="d-flex align-items-center">
              <select v-model="selectedStatus[order.order_id]" class="form-select me-2">
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
              <button @click="updateOrderStatus(order.order_id)" class="btn btn-primary btn-sm">
                <span class="material-symbols-outlined">
                  upgrade
                </span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
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

<style scoped>

.button-group {
  margin-bottom: 20px; /* เพิ่มพื้นที่ด้านล่างของกลุ่มปุ่ม */
}

.button-18 {
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  background-color: #4CAF50; /* สีเขียว */
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.button-18:hover {
  background-color: #45a049; /* สีเขียวเข้มเมื่อ hover */
}
.container {
  max-width: 1200px;
  margin: auto;
  padding: 20px;
  font-family: 'Sukhumvit Set', sans-serif; /* ใช้ฟอนต์ Sukhumvit Set */
  padding: 20px;
  

}

h1 {
  font-size: 2rem;
  color: #333;
}

.table {
  margin-top: 20px;
  border-radius: 8px;
  overflow: hidden;
}

.table th,
.table td {
  text-align: center;
  padding: 12px;
}

.thead-dark {
  background-color: #343a40;
  color: white;
}

.table-striped tbody tr:nth-of-type(odd) {
  background-color: #f8f9fa;
}

.table-hover tbody tr:hover {
  background-color: #e2e6ea;
}

.btn-primary {
  background-color: #32f1b1;
  border: none;
  border-radius: 5px;
  padding: 5px 8px; /* ปรับขนาด Padding ของปุ่ม */
  font-size: 0.8rem; /* ปรับขนาดฟอนต์ของปุ่ม */
}

.btn-primary:hover {
  background-color: #1ddf8e;
}

.cursor-pointer {
  cursor: pointer;
}

.cursor-pointer:hover {
  background-color: #f1f1f1;
}

.form-select {
  width: auto; /* ทำให้ Select ขนาดเล็กลง */
  padding: 5px; /* ปรับขนาด Padding */
  border-radius: 5px;
  border: 1px solid #ccc; /* กำหนดกรอบให้กับ Select */
}

.table td {
  vertical-align: middle; /* จัดให้อยู่กลางในเซลล์ */
}
</style>
