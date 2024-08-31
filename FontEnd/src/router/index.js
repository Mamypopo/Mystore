import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import Register from '@/views/Register.vue';
import { useUserStore } from '../stores/user';
import ProductList from '@/views/ProductList.vue';
import ProductForm from '@/views/ProductForm.vue';
import CartPage from '@/views/CartPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes : [
    {
      path: '/',
      name: '',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/products',
      component: ProductList ,
      // meta: { requiresAuth: true }
    },
    {
      path: '/products/new',
      name: 'create-product',
      component: ProductForm,
      // meta: { requiresAuth: true }
    },
    {
      path: '/products/edit/:id',
      name: 'edit-product',
      component: ProductForm,
      props: true
      // meta: { requiresAuth: true }
    },
    {
      path: '/cart',
      name: 'cart-product',
      component: CartPage,
      // meta: { requiresAuth: true }
    },
   
  ]
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;