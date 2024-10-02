<template>
  <div>
    <!-- Banner -->
    <div class="banner">Get free delivery on orders over $80</div>

    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg sticky-top custom-navbar">
      <div class="container-fluid">
        <!-- Logo -->
        <router-link to="/" class="navbar-brand logo">LoGo</router-link>

        <!-- Mobile Toggle Button -->
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarToggler" aria-controls="navbarToggler" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Collapsible Navbar -->
        <div class="collapse navbar-collapse" id="navbarToggler">
          <div class="d-flex justify-content-between w-100">
            <!-- Left Side Links -->
            <ul class="navbar-nav mx-auto">
              <li class="nav-item">
                <router-link to="/" class="nav-link">HOME</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/products" class="nav-link">PRODUCTS</router-link>
              </li>
              <li class="nav-item" v-if="getUser.role === 'admin'">
                <router-link to="/products/new" class="nav-link">ADD PRODUCT</router-link>
              </li>
            </ul>

            <!-- Right Side: Cart, Login, and Profile -->
            <ul class="navbar-nav">
              <!-- Cart Icon (for non-admin users) -->
              <li class="nav-item" v-if="getUser.id != 0 && getUser.role !== 'admin'">
                <router-link to="/cart" class="nav-link">
                    <span class="material-symbols-outlined">
shopping_bag
</span>
                </router-link>
              </li>

              <!-- Admin Dashboard -->
              <li class="nav-item" v-if="getUser.role === 'admin'">
                <router-link to="/admin-order-dashboard" class="nav-link">DASHBOARD</router-link>
              </li>

              <!-- Login Icon -->
              <li class="nav-item" v-if="getUser.id === 0">
                <router-link to="/login" class="nav-link">
                    <span class="material-symbols-outlined">
person
</span>
                </router-link>
              </li>

              <!-- User Profile Dropdown -->
              <li class="nav-item dropdown" v-else>
  <a class="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
    <span class="material-symbols-outlined">
      account_circle
    </span>
  </a>
  <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
    <li><router-link to="/user-page" class="dropdown-item">Profile</router-link></li>
    <li><a href="#" class="dropdown-item" @click.prevent="logout">Logout</a></li>
  </ul>
</li>

            </ul>
          </div>
        </div>
      </div>
    </nav>
  </div>
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
.navbar .dropdown-toggle::after {
  display: none; /* ซ่อน caret */
  font-family: 'Noto Sans Thai', sans-serif;

}
/* General styles for banner */
.banner {
  background-color: #f8d7da;
  color: #721c24;
  text-align: center;
  padding: 10px;
  font-size: 14px;
  
}

/* Custom Navbar */
.custom-navbar {
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
  padding: 15px;
}

/* Logo Style */
.logo {
  font-size: 24px;
  font-weight: bold;
  color: #007bff;
  text-transform: uppercase;
}

/* Navbar Links */
.nav-link {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  transition: color 0.3s;
  text-transform: uppercase;
}

.nav-link:hover {
  color: #007bff;
}

/* Icons in Navbar */
.nav-link i {
  font-size: 18px;
}

/* Dropdown menu */
.dropdown-menu {
  background-color: #fff;
  border: 1px solid #ddd;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.dropdown-item {
  color: #333;
  transition: background-color 0.3s;
}

.dropdown-item:hover {
  background-color: #007bff;
  color: #fff;
}

/* Navbar Toggler (for mobile view) */
.navbar-toggler {
  border: none;
}

.navbar-toggler-icon {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(0, 123, 255, 1)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
}

/* Responsive adjustments */
@media (max-width: 991.98px) {
  .navbar-nav {
    flex-direction: column;
    align-items: flex-start;
  }

  .navbar-nav .nav-link {
    padding: 10px;
    text-align: left;
    width: 100%;
  }
}

@media (max-width: 767.98px) {
  .banner {
    font-size: 12px;
    padding: 8px;
  }

  .navbar-brand {
    font-size: 20px;
  }

  .navbar-nav .nav-link {
    font-size: 14px;
  }
}
</style>