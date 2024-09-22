<template>
  <div class="container">

    <h1>จัดการสินค้า</h1>
    
    <div class="container mt-4">
    <div class="row">
      <div class="col d-flex justify-content-start align-items-center">
        <h3>รายการสินค้า</h3>
      </div>
      <div class="col d-flex justify-content-end align-items-center">
        <button type="button" class="button-18" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@getbootstrap">เพิ่มสินค้า</button>
      </div>
    </div>
  </div>

<div  class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">เพิ่มสินค้า</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form >
          <div class="mb-3">
            <label for="recipient-name" class="col-form-label">ชื่อสินค้า:</label>
            <input type="text" class="form-control" v-model="product.name" id="name" required  >
          </div>
          <div class="mb-3">
            <label for="description" class="col-form-label">คำอธิบายสินค้า:</label>
            <textarea class="form-control" v-model="product.description" id="description" required></textarea>
          </div>
          <div class="mb-3">
            <label for="price" class="col-form-label">ราคาสินค้า:</label>
            <input class="form-control" type="number" v-model="product.price" id="price" required >
          </div>
          <div class="mb-3">
            <label for="stock" class="col-form-label">จำนวนสินค้า:</label>
            <input class="form-control" type="number" v-model="product.stock" id="stock" required >
          </div>
          <div class="mb-3">
            <label for="image" class="col-form-label">รูปสินค้า:</label>
            <input class="form-control" type="file" @change="handleFileChange" id="image" >
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="button-16" data-bs-dismiss="modal">Close</button>
        <button type="submit" @click="saveProduct()"  class="button-18" data-bs-dismiss="modal" >เพิ่มสินค้า</button>
      </div>
    </div>
  </div>
</div>




    <table  class="table table table-striped table-hover table-responsive">
  <thead>
    <tr>
      <th scope="col">No.</th>
      <th scope="col">Name</th>
      <th scope="col">image</th>
      <th scope="col">Description</th>
      <th scope="col">Stock</th>
      <th scope="col">Price</th>
      <th scope="col"></th>
      <th scope="col"></th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(product, index) in products" :key="product.id" >
      <td>{{ index + 1 }}</td>
      <td>{{ product.name }}</td>
     <td>
      <img :src="`http://localhost:8000/uploads/${product.image}`" class="image-form">
     </td> 
      <td>{{ product.description }}</td>
      <td>{{ product.stock }}</td>
      <td>{{ product.price }}</td>
      <td><button class="button-17" @click="editProduct(product)"  data-bs-toggle="modal" data-bs-target="#edit" data-bs-whatever="@getbootstrap" >แก้ไข</button> </td>
      <td><button class="button-16" @click="deleteProduct(product.id)">ลบ</button> </td>
     
    </tr>
  </tbody>
  

</table>
<div class="modal fade" id="edit" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">แก้ไขสินค้า</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form >
          <div class="mb-3">
            <label for="recipient-name" class="col-form-label">ชื่อสินค้า:</label>
            <input type="text" class="form-control" v-model="product.name" id="name" required  >
          </div>
          <div class="mb-3">
            <label for="description" class="col-form-label">คำอธิบายสินค้า:</label>
            <textarea class="form-control" v-model="product.description" id="description" required></textarea>
          </div>
          <div class="mb-3">
            <label for="price" class="col-form-label">ราคาสินค้า:</label>
            <input class="form-control" type="number" v-model="product.price" id="price" required >
          </div>
          <div class="mb-3">
            <label for="stock" class="col-form-label">จำนวนสินค้า:</label>
            <input class="form-control" type="number" v-model="product.stock" id="stock" required >
          </div>
          <div class="mb-3">
            <label for="image" class="col-form-label">รูปสินค้า:</label>
            <input class="form-control" type="file"  @change="handleFileChange" id="image" >
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="button-16" data-bs-dismiss="modal">Close</button>
        <button type="submit" class="button-17" @click="saveProduct()" data-bs-dismiss="modal">อัปเดตสินค้า</button>
      </div>
    </div>
  </div>
</div>
  </div>
  
</template>

<script>
import axios from 'axios';
import {useUserStore} from '../stores/userStore.js'
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
        stock:'',
       
      },
    };
  },
  async created() {
    this.fetchProducts();
  },
  computed: {
    getUser() {
      return useUserStore().getUser
    }
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
                    Authorization: token
                }
          });
          this.isEditing = false;
        } else {
          await axios.post('http://localhost:8000/api/products', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }
        this.fetchProducts();
        this.resetForm();
      } catch (error) {
        console.error('Error saving product:', error.response ? error.response.data : error.message); 
      }
    },

    async deleteProduct(id) {
      const isConfirmed = window.confirm('Are you sure you want to remove this item from the cart?');

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
    
  }
  
  
};
</script>

<style scoped>

h1{
  text-align: center;
  padding-top: 30px;
}

button{
  margin-bottom: 10px;
}


.image-form{
  width: 100px;
  height: 100px;
}
</style>
