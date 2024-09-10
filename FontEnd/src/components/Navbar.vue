<template>
  
<header >
  <section>
    <nav class="navbar navbar-expand-lg  ">
  <div class="container-fluid">
    <a class="navbar-brand" href="/">LoGo</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item ">
            <router-link to='/'><a class="nav-link">HOME</a></router-link>
          </li> 
        <li class="nav-item ">
            <router-link to='/products'><a class="nav-link">Product</a></router-link>
          </li> 
          <li class="nav-item ">
            <router-link to='/products/new'><a class="nav-link">Add Product</a></router-link>
          </li> 
      </ul>
      <li class="nav-item " >
            <router-link to='/cart'><a class="nav-link"  >Cart</a></router-link>
          </li> 

      <ul class="mb-lg-0 d-flex">
        <li class="nav-item " >
            <router-link to='/login'><a class="nav-link"  >Login</a></router-link>
          </li> 
          <li class="nav-item " v>
            <router-link to='/' ><a class="nav-link" @click="logout()" >Logout</a></router-link>
          </li>
        </ul>
        
    </div>
  </div>
</nav>
  </section>

</header>
</template>
<script >

import { useUserStore } from '@/stores/userStore';
export default {
  
  computed: {
    getUser() {
      return useUserStore().getUser
    }
  },
  methods: {
    logout() {
      useUserStore().resetUser()
      localStorage.removeItem('token');
      this.$router.push('/');
    }
  }
}
</script>
<style scoped >

li a {
  display: block;
  color: rgb(0, 0, 0);
  text-align: center;
  text-decoration: none;
  
}
.nav-item {
      margin-right: 20px;
    }
    .nav-item:last-child {
      margin-right: 0; 
    }
</style>