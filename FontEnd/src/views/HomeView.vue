<template>
    <div class="container">
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
  