<template >
 <section>

  
  <div class="container" >
  <div class="login">
    <div class="login-front">
        <header> 
        <router-link to="/login" class="active" aria-current="page" >  Sign In </router-link>
        <router-link to="/register-foruser" class="inactive underlineHover">Sign Up </router-link>
        </header>
        <span class="entypo-user"></span><input rules="required" type="email" id="email" v-model="email" placeholder="Email" />
        <span class="entypo-lock"></span><input rules="required" v-model="password" type="password" id="password" placeholder="Password" />
        
        <br>
        <p v-if="errorMessage">{{ errorMessage }}</p>     
        
        <section class="signin">
          <button type="submit" @click="login()" class="entypo-right-dir"  value="Log In">Sign in</button>
     
        </section>
    </div>
  </div>
  </div>
  </section>
</template>
<script>
import axios from 'axios';
import { useUserStore } from '../stores/userStore.js';

export default {
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
      user: null,

    };
  },
  methods: {
    async login() {
     
      try {
        const response = await axios.post('http://localhost:8000/auth/login', {
          email: this.email,
          password: this.password,
        });
        const user  = response.data.user; 
        const token = response.data.token;
        useUserStore().setUser(user);
        localStorage.setItem('token', token); 
        this.$router.push('/');
        location.reload(); 
      } catch (error) {
        this.errorMessage = error.response.data.error || 'Login failed';
      }
    }
  }
};
</script>
<style scoped>
  .container {
            text-align: center;
            padding: 20px;
            width: 30%;
        }
</style>