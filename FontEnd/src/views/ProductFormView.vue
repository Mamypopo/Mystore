<template>
  <div class="container">
    <h1>จัดการสินค้า</h1>

    <div class="header d-flex justify-content-between align-items-center mt-4">
      <h3>รายการสินค้า</h3>
      <button type="button" class="button-18" data-bs-toggle="modal" data-bs-target="#exampleModal">
        เพิ่มสินค้า
      </button>
    </div>

    <!-- Modal สำหรับเพิ่มสินค้า -->
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">เพิ่มสินค้า</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveProduct">
              <div class="mb-3">
                <label for="name" class="form-label">ชื่อสินค้า:</label>
                <input type="text" class="form-control" v-model="product.name" required />
              </div>
              <div class="mb-3">
                <label for="description" class="form-label">คำอธิบายสินค้า:</label>
                <textarea class="form-control" v-model="product.description" required></textarea>
              </div>
              <div class="mb-3">
                <label for="price" class="form-label">ราคาสินค้า:</label>
                <input type="number" class="form-control" v-model="product.price" required />
              </div>
              <div class="mb-3">
                <label for="stock" class="form-label">จำนวนสินค้า:</label>
                <input type="number" class="form-control" v-model="product.stock" required />
              </div>
              <div class="mb-3">
                <label for="image" class="form-label">รูปสินค้า:</label>
                <input type="file" class="form-control" @change="handleFileChange" />
              </div>
              <div class="modal-footer">
                <button type="button" class="button-16" data-bs-dismiss="modal">ปิด</button>
                <button type="submit" class="button-18">เพิ่มสินค้า</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <table class="table table-striped table-hover mt-4">
      <thead>
        <tr>
          <th scope="col">No.</th>
          <th scope="col">ชื่อ</th>
          <th scope="col">รูป</th>
          <th scope="col">คำอธิบาย</th>
          <th scope="col">จำนวน</th>
          <th scope="col">ราคา</th>
          <th scope="col">แก้ไข</th>
          <th scope="col">ลบ</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(product, index) in products" :key="product.id">
          <td>{{ index + 1 }}</td>
          <td>{{ product.name }}</td>
          <td>
            <img :src="`http://localhost:8000/uploads/${product.image}`" class="image-form" />
          </td>
          <td>{{ product.description }}</td>
          <td>
            <p v-if="product.stock > 0">Stock: {{ product.stock }}</p>
            <p v-else class="out-of-stock">สินค้าหมด</p>
          </td>
          <td>{{ product.price }}</td>
          <td>
            <button class="button-17" @click="editProduct(product)" data-bs-toggle="modal" data-bs-target="#edit">แก้ไข</button>
          </td>
          <td>
            <button class="button-16" @click="deleteProduct(product.id)">ลบ</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal สำหรับแก้ไขสินค้า -->
    <div class="modal fade" id="edit" tabindex="-1" aria-labelledby="editLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="editLabel">แก้ไขสินค้า</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveProduct">
              <div class="mb-3">
                <label for="name" class="form-label">ชื่อสินค้า:</label>
                <input type="text" class="form-control" v-model="product.name" required />
              </div>
              <div class="mb-3">
                <label for="description" class="form-label">คำอธิบายสินค้า:</label>
                <textarea class="form-control" v-model="product.description" required></textarea>
              </div>
              <div class="mb-3">
                <label for="price" class="form-label">ราคาสินค้า:</label>
                <input type="number" class="form-control" v-model="product.price" required />
              </div>
              <div class="mb-3">
                <label for="stock" class="form-label">จำนวนสินค้า:</label>
                <input type="number" class="form-control" v-model="product.stock" required />
              </div>
              <div class="mb-3">
                <label for="image" class="form-label">รูปสินค้า:</label>
                <input type="file" class="form-control" @change="handleFileChange" />
              </div>
              <div class="modal-footer">
                <button type="button" class="button-16" data-bs-dismiss="modal">ปิด</button>
                <button type="submit" class="button-17">อัปเดตสินค้า</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useUserStore } from '../stores/userStore.js';
export default {
  data() {
    return {
      products: [],
      product: {
        id: null,
        name: '',
        description: '',
        price: '',
        image: null,
        stock: '',
      },
    };
  },
  async created() {
    this.fetchProducts();
  },
  computed: {
    getUser() {
      return useUserStore().getUser;
    },
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await axios.get('http://localhost:8000/api/products');
        this.products = response.data;
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    },
    handleFileChange(event) {
      this.product.image = event.target.files[0];
    },
    async saveProduct() {
      const formData = new FormData();
      formData.append('name', this.product.name);
      formData.append('description', this.product.description);
      formData.append('price', this.product.price);
      formData.append('stock', this.product.stock);
      if (this.product.image) {
        formData.append('image', this.product.image);
      }

      try {
        const token = localStorage.getItem('token');
        if (this.isEditing) {
          await axios.put(`http://localhost:8000/api/products/${this.product.id}`, formData, {
            headers: {
              Authorization: token,
            },
          });
          this.isEditing = false;
        } else {
          await axios.post('http://localhost:8000/api/products', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        }
        this.fetchProducts();
        this.resetForm();
      } catch (error) {
        console.error('Error saving product:', error.response ? error.response.data : error.message);
      }
    },
    async deleteProduct(id) {
      const isConfirmed = window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?');
      if (isConfirmed) {
        try {
          await axios.delete(`http://localhost:8000/api/products/${id}`);
          this.fetchProducts();
        } catch (error) {
          console.error('Error deleting product:', error);
        }
      }
    },
    editProduct(product) {
      this.product = { ...product, image: null };
      this.isEditing = true;
    },
    resetForm() {
      this.product = { id: null, name: '', description: '', price: '', image: null };
    },
  },
};
</script>

<style scoped>
.container{
font-family: 'Noto Sans Thai', sans-serif;
}
h1 {
  text-align: center;
  padding-top: 30px;
  font-weight: bold; /* เพิ่มความหนักให้ข้อความ */
  color: #333; /* ใช้สีที่เป็นกลาง */
}

.header {
  margin-bottom: 20px;
}

.button-16,
.button-17,
.button-18 {
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.button-16 {
  background-color: #f44336; /* สีแดง */
  color: white;
}

.button-17 {
  background-color: #2196F3; /* สีน้ำเงิน */
  color: white;
}

.button-18 {
  background-color: #4CAF50; /* สีเขียว */
  color: white;
}

.button-16:hover,
.button-17:hover,
.button-18:hover {
  opacity: 0.9; /* ลดความทึบลงเมื่อ hover */
}

.table {
  border-collapse: collapse; /* ปรับให้ตารางเรียบขึ้น */
}

.table th,
.table td {
  padding: 10px;
  text-align: left;
}

.image-form {
  width: 80px; /* ปรับขนาดของภาพ */
  height: 60px; /* ให้สูงอัตโนมัติ */
  border-radius: 5px; /* มุมโค้ง */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); /* เพิ่มเงาให้กับรูป */
}

.out-of-stock {
  color: red; /* ใช้สีแดงสำหรับสถานะหมด */
}
</style>
