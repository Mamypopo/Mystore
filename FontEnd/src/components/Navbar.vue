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
              <router-link to="/products" class="nav-link">Product</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/products/new" class="nav-link">Add Product</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/history" class="nav-link">history</router-link>
            </li>
          </ul>
          <ul class="navbar-nav">
            <li class="nav-item" v-if="!isLoggedIn">
              <router-link to="/login" class="nav-link">Login</router-link>
            </li>
            <li class="nav-item" v-if="isLoggedIn">
              <router-link to="/cart" class="nav-link">Cart</router-link>
            </li>
            <li class="nav-item" v-if="isLoggedIn">
              <a href="#" class="nav-link" @click.prevent="logout">Logout</a>
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
      useUserStore().resetUser()
      localStorage.removeItem('token');
      location.reload(); 
      this.$router.push('/');
    }
  }
}
</script>
<style scoped >


</style>