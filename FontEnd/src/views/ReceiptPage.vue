<template>
  <div>
    <h2>ประวัติการสั่งซื้อ</h2>
    <ul>
      <li v-for="order in orders" :key="order.id">
        <p><strong>Order ID:</strong> {{ order.id }}</p>
        <p><strong>วันที่สั่งซื้อ:</strong> {{ order.createdAt }}</p>
        <ul>
          <li v-for="item in order.items" :key="item.product_id">
            <p>
              ชื่อสินค้า: {{ item.name }} - ราคา: {{ item.price }} บาท - จำนวน: {{ item.quantity }}
            </p>
          </li>
        </ul>
        <p><strong>ราคารวม:</strong> {{ order.totalAmount }} บาท</p>
        <button @click="viewOrderDetails(order.id)">ดูรายละเอียด</button>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios'
import { useUserStore } from '../stores/userStore.js'

export default {
  data() {
    return {
      orders: [] // เก็บข้อมูลคำสั่งซื้อและสินค้าภายใน
    }
  },
  async mounted() {
    const userId = useUserStore().getUser.id
    await this.fetchOrderHistory(userId)
  },
  methods: {
    async fetchOrderHistory(userId) {
      try {
        const response = await axios.get(`http://localhost:8000/api/orders/history/${userId}`)
        const orders = response.data || []

        this.orders = await Promise.all(
          orders.map(async (order) => {
            const itemsWithDetails = await Promise.all(
              (order.items || []).map(async (item) => {
                const productResponse = await axios.get(
                  `http://localhost:8000/api/products/${item.product_id}`
                )
                const product = productResponse.data

                return {
                  name: product.name, // ชื่อสินค้า
                  price: product.price, // ราคาสินค้า
                  quantity: item.quantity // จำนวนสินค้า
                }
              })
            )

            return {
              ...order,
              items: itemsWithDetails // ใส่รายละเอียดสินค้าในคำสั่งซื้อ
            }
          })
        )
      } catch (error) {
        console.error('Error fetching order history:', error)
      }
    },
    // ฟังก์ชันสำหรับการฟอร์แมตวันที่
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(dateString).toLocaleDateString('th-TH', options)
    },
    async viewOrderDetails(orderId) {
      try {
        const response = await axios.get(`http://localhost:8000/api/orders/${orderId}`)
        console.log('Order Details:', response.data)
      } catch (error) {
        console.error('Error fetching order details:', error)
      }
    }
  }
}
</script>
