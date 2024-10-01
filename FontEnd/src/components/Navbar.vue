<template>
  <header>
    <div class="banner">Get free delivery on orders over $80</div>
<nav class="navbar navbar-expand-lg sticky-top">
      
    <div class="container-fluid">
     
      <router-link to="/" class="navbar-brand" >LoGo</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
        <div class="d-flex justify-content-between w-100">
          <ul class="navbar-nav mx-auto">
            <li class="nav-item">
              <router-link to="/" class="nav-link">HOME</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/products" class="nav-link" >Product</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/products/new" class="nav-link" v-if="getUser.role === 'admin'" >Add Product</router-link>
            </li>
           
          </ul>
          
          <ul class="navbar-nav">
           <!-- แสดง Cart ถ้าผู้ใช้ไม่ใช่ admin -->
           <li class="nav-item" v-if="getUser.id != 0 && getUser.role !== 'admin'">
                <router-link to="/cart" class="nav-link">Cart</router-link>
              </li>
              <li class="nav-item" v-if="getUser.role === 'admin'">
                <router-link to="/admin-order-dashboard" class="nav-link">Dashboard</router-link>
              </li>
              <li class="nav-item" v-if="getUser.id === 0">
                <router-link to="/login" class="nav-link">Login</router-link>
              </li>
            
            <li class="nav-item dropdown" v-else>
            <a class="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown"
              aria-expanded="false">
              {{ getUser.username }}
            </a>
            <ul class="dropdown-menu dropdown-menu  dropdown-menu-end " aria-labelledby="navbarDropdown">
            <li class="nav-item" >
              <router-link to="/user-page" class="nav-link">ข้อมูลส่วนตัว</router-link>
            </li>
            <li class="nav-item" >
              <a href="#" class="nav-link" @click.prevent="logout">Logout</a>
            </li>
             
            </ul>
          </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
  </header>
    
  
</template>
<script >

import { useUserStore } from '@/stores/userStore';
export default {
  
  computed: {
    getUser() {
      return useUserStore().getUser
    },
    isLoggedIn() {
      return !!localStorage.getItem('token');
    },
  },
  methods: {
    logout() {
    const userStore = useUserStore();
    userStore.resetUser(); // รีเซ็ตสถานะผู้ใช้
    localStorage.removeItem('token'); // ลบ token
    this.$router.push('/'); // ส่งกลับไปยังหน้า home
  },
  }
}
</script>
<style scoped >


</style>