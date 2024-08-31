<template>
    <div>
      <h1>สินค้าใหม่ที่สุด</h1>
      <div v-if="loading">กำลังโหลด...</div>
      <div v-else-if="products.length === 0">ไม่มีสินค้าใหม่</div>
      <div v-else>
        <div v-for="product in products" :key="product.id" class="product-card">
          <img :src="product.image_url" alt="Product Image" />
          <h2>{{ product.name }}</h2>
          <p>{{ product.price.toFixed(2) }} บาท</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        products: [],
        loading: true,
      };
    },
    // async created() {
    //   try {
    //     const response = await axios.get('http://localhost:8000/api/products/newest');
    //     this.products = response.data;
    //   } catch (error) {
    //     console.error('Error fetching newest products:', error);
    //   } finally {
    //     this.loading = false;
    //   }
    // }
  };
  </script>
  
  <style>
  .product-card {
    border: 1px solid #ddd;
    padding: 10px;
    margin: 10px;
    border-radius: 5px;
    text-align: center;
  }
  .product-card img {
    max-width: 100%;
    height: auto;
  }
  </style>
  