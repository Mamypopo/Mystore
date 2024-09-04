<template >
     <section >
<div class="container" >
<div class="login">
  <div class="login-front">
      <header>
        <router-link  to="/login"  aria-current="page" >  Sign In </router-link>
       <router-link to="/register" >Sign Up </router-link> 
      
      </header>
      <span class="entypo-lock"></span><input rules="required" v-model="username" type="text" id="username" placeholder="Username" />
      <span class="entypo-user"></span><input rules="required" type="email" id="email" v-model="email" placeholder="Email" />
      <span class="entypo-lock"></span><input rules="required" v-model="password" type="password" id="password" placeholder="Password" />
      <span class="entypo-user"></span><input rules="required" type="password" id="confirmPassword" v-model="confirmPassword" placeholder="ConfirmPassword" />
      <span class="entypo-user"></span><textarea rules="required" v-model="address" type="text" id="address" placeholder="Address"  > </textarea>
      <span class="entypo-lock"></span><input rules="required" v-model="phone_number" type="text" id="phone_number" placeholder="Phone" />

      
      <p v-if="errorMessage">{{ errorMessage }}</p>     
     
  </div>
  <section class="signin">
        <button type="submit" @click="register()" class="entypo-right-dir"  value="Log In">Sign in</button>
      </section>
</div>
</div>
     </section>
  </template>
  <script>
import axios from 'axios';

export default {
  data() {
    return {
      username:'',
      email: '',
      password: '',
      address: '',
      phone_number: '',
      confirmPassword: '',
      errorMessage: '',
      role:''
    };
  },
  methods: {
    async register() {
      if (this.password !== this.confirmPassword) {
        this.error = 'Passwords do not match';
        return;
      }
      try {
        const response = await axios.post('http://localhost:8000/auth/register', {
          email: this.email,
          password: this.password,
          username: this.username,
          address: this.address,
          phone_number: this.phone_number,
          role: "customer",
        });
        console.log('Registration successful:', response.data);
        this.$router.push('/login'); 
      } catch (error) {
        console.error('Error registering user:', error.response.data);
      
      }
    }
  }
};
  </script>
  <style scoped >
   .container {
            text-align: center;
            padding: 20px;
            width: 30%;
        }

  </style>