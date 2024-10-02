<template>
  <div class="cart-container">
    <header class="cart-header">
      <h1>Shopping Cart</h1>
    </header>
    
    <div v-if="cartItems.length === 0" class="empty-cart-message">
      <p>Your cart is empty.</p>
    </div>
    
    <div v-else>
      <table class="cart-table">
        <thead>
          <tr>
            <th>Photo</th>
            <th>Qty</th>
            <th>Product</th>
            <th>Price</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cartItems" :key="item.product_id" class="cart-item">
            <td>
              <img :src="`http://localhost:8000/uploads/${item.image}`" alt="Product Image" class="order-image">
            </td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.product_name }}</td>
            <td v-if="typeof item.product_price === 'number'">${{ item.product_price.toFixed(2) }}</td>
            <td v-else>{{ item.product_price }}</td>
            <td>${{ (item.product_price * item.quantity).toFixed(2) }}</td>
            <td>
              <button class="remove-button" @click="removeFromCart(item.product_id)">
                <span class="material-symbols-outlined">remove_shopping_cart</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="cart-summary">
       
        <div class="summary-row total-row">
          <span>Total:</span>
          <span>${{ totalPrice }}</span>
        </div>
      </div>

      <div class="checkout-button">
  
  <button class="button-18" @click="placeOrder">Place Order</button>
</div>
    </div>
  </div>
</template>




<script>
import axios from 'axios';
import { useUserStore } from "../stores/userStore.js";
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      userProfile: [],
      cartItems: [],
      userId: '',
      totalAmount: 0,
    };
  },
  async created() {
    this.fetchCartItems();
  },
  computed: {
    getUser() {
      return useUserStore().getUser;
    },
    totalPrice() {
      let total = this.cartItems.reduce((sum, item) => {
        return sum + item.product_price * item.quantity;
      }, 0);
      return total.toFixed(2); // ส่งค่ารวม
    },
  },
  methods: {
    async fetchCartItems() {
      try {
        const userId = useUserStore().getUser.id;
        const response = await axios.get(`http://localhost:8000/api/cart/${userId}`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        });
        this.cartItems = response.data;
      } catch (error) {
        console.error('Error fetching cart items:', error);
        Swal.fire('ผิดพลาด!', 'ไม่สามารถดึงข้อมูลตะกร้าได้.', 'error');
      }
    },
    async removeFromCart(productId) {
      const itemToRemove = this.cartItems.find(item => item.product_id === productId);
      const result = await Swal.fire({
        title: 'ยืนยันการลบสินค้า?',
        text: `คุณต้องการลบสินค้า ${itemToRemove.product_name} จำนวณ ${itemToRemove.quantity} ชิ้น จากตะกร้าหรือไม่?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ตกลง',
        cancelButtonText: 'ยกเลิก'
      });

      if (result.isConfirmed) {
        try {
          const userId = useUserStore().getUser.id;
          await axios.delete(`http://localhost:8000/api/cart/${userId}/${productId}`, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          });
          Swal.fire('สำเร็จ!', `สินค้า ${itemToRemove.product_name} ถูกลบออกจากตะกร้าเรียบร้อยแล้ว!`, 'success');
          this.fetchCartItems();
        } catch (error) {
          console.error('Error deleting product from cart:', error);
          Swal.fire('ผิดพลาด!', 'ไม่สามารถลบสินค้าได้.', 'error');
        }
      }
    },
    async placeOrder() {
      const userId = useUserStore().getUser.id;
      if (this.cartItems.length === 0) {
        Swal.fire('ไม่มีสินค้าในตะกร้า!', 'กรุณาเพิ่มสินค้าก่อนทำการสั่งซื้อ.', 'warning');
        return;
      }
      const orderDetails = this.cartItems.map(item => 
        `ชื่อสินค้า: ${item.product_name} จำนวน: ${item.quantity} ชิ้น`
      ).join('\n');

      const result = await Swal.fire({
        title: 'ยืนยันการสั่งซื้อ',
        text: `คุณต้องการสั่งซื้อสินค้าดังต่อไปนี้:\n${orderDetails}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ตกลง',
        cancelButtonText: 'ยกเลิก'
      });
      if(result.isConfirmed){
        try {
          const response = await axios.post('http://localhost:8000/api/orders', {
            userId,
            items: this.cartItems.map(item => ({ product_id: item.product_id, quantity: item.quantity })),
            email: this.userProfile.email,
          });
          
          console.log('Order placed:', response.data);
          
          const orderDetails = this.cartItems.map(item => 
            `ชื่อสินค้า: ${item.product_name}, จำนวน: ${item.quantity}`
          ).join('\n');
          
          Swal.fire({
            title: 'สั่งซื้อเรียบร้อย!',
            text: `คุณได้ทำการสั่งซื้อสินค้าดังต่อไปนี้:\n${orderDetails}`,
            icon: 'success',
            confirmButtonText: 'ตกลง'
          });

          this.cartItems = []; 
        } catch (error) {
          console.error('Error placing order:', error);
          Swal.fire('ผิดพลาด!', 'ไม่สามารถทำการสั่งซื้อได้.', 'error');
        }
      }
    },
  }
};
</script>


<style scoped>
body {
  background-color: #f4f7f9; /* สีพื้นหลัง */
  font-family: Arial, sans-serif;
}

.cart-container {
  max-width: 1000px;
  margin: 80px auto; /* เพิ่มระยะห่างด้านบนจาก navbar */
  padding: 20px;
  background-color: #fff; /* สีพื้นหลังของตระกร้า */
  border-radius: 10px; /* มุมโค้ง */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); /* เงา */
}

.cart-header {
  text-align: center;
  margin-bottom: 20px;
}

.empty-cart-message {
  text-align: center;
  font-size: 1.5em;
  color: #666;
}

.order-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 5px;
  margin-right: 10px;
}
.cart-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.cart-table th, .cart-table td {
  padding: 10px;
  text-align: center;
  border: 1px solid #ccc;
}

.product-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
}

.remove-button {
  background: none; /* ไม่มีพื้นหลัง */
  border: none; /* ไม่มีกรอบ */
  cursor: pointer; /* เปลี่ยนเป็นลูกศร */
  color: #e74c3c; /* เปลี่ยนสีไอคอน */
}

.cart-summary {
  margin-top: 20px;
  font-weight: bold;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
  padding: 10px; /* เพิ่มการเว้นระยะให้เห็นชัดขึ้น */
  background-color: #f0f0f0; /* สีพื้นหลังแทบสีเทา */
  border-radius: 5px; /* มุมโค้ง */
}

.total-row {
  font-size: 1.2em;
}

.checkout-button {
  display: flex; /* ใช้ flexbox เพื่อจัดการการวางตำแหน่ง */
  justify-content:flex-end; /* วางปุ่มไปทางขวา */
  align-items: center; /* จัดให้อยู่กลางแนวตั้ง */
  margin-top: 20px; /* เพิ่มระยะห่างด้านบน */
}


.button-18 {
  padding: 10px 20px;
  border: none;
  background-color: #3498db;
  color: #fff;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.button-18:hover {
  background-color: #2980b9;
}

</style>

