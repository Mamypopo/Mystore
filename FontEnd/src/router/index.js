import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterForAdmin from '../views/RegisterForAdmin.vue';
import { useUserStore } from '../stores/userStore.js';
import axios from 'axios';
import CartView from '@/views/CartView.vue';
import ProductFormView from '@/views/ProductFormView.vue';
import UserView from '@/views/UserView.vue';
import AdminOrderDashboardView from '@/views/AdminOrderDashboardView.vue';
import ProductListView from '@/views/ProductListView.vue';
const router = createRouter({
    history: createWebHistory(
        import.meta.env.BASE_URL),
    routes: [{
            path: '/',
            name: '',
            component: HomeView
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView,
            meta: { requiresGuest: true }
        },
    
        {
            path: '/register-foradmin',
            name: 'register-admin',
            component: RegisterForAdmin
        },
        {
            path: '/products',
            component: ProductListView,
            // meta: { requiresAuth: true }
        },
        {
            path: '/products/new',
            name: 'create-product',
            component: ProductFormView,
            meta: { requiresAuth: true }
        },
        {
            path: '/products/edit/:id',
            name: 'edit-product',
            component: ProductFormView,
            props: true
                // meta: { requiresAuth: true }
        },
        {
            path: '/cart',
            name: 'cart-product',
            component: CartView,
            meta: { requiresAuth: true }
        },
    
        {
            path: '/user-page',
            name: 'UserPage',
            component: UserView,
          },
          {
            path: '/admin-order-dashboard',
            name: 'AdminPage',
            component: AdminOrderDashboardView,
          },
    ]
});

router.beforeEach(async(to, from, next) => {

    try {
        const token = localStorage.getItem('token');

        if (token) {
            const response = await axios.get('http://localhost:8000/auth/getprofile', {
                headers: {
                    Authorization: 'Bearer ' + token,
                }
            });
            useUserStore().setUser(response.data.user)
        }
        
        if (to.matched.some(record => record.meta.requiresAuth) && !token) {
            // ถ้าหน้าต้องการการล็อกอินและผู้ใช้ไม่มี token
            next('/'); // เปลี่ยนเส้นทางไปยังหน้า login
        } else if (to.matched.some(record => record.meta.requiresGuest) && token) {
            // ถ้าหน้าต้องการให้ผู้ใช้ยังไม่ล็อกอินและผู้ใช้มี token
            next('/'); // เปลี่ยนเส้นทางไปยังหน้า Home หรือหน้าที่ผู้ใช้ควรจะเห็น
        } else {
            next(); // ไปยังเส้นทางที่กำหนด
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                if (error.response.data.cause === 'token expired') {
                    localStorage.removeItem('token');
                    useUserStore().resetUser();

                }
            }
        }
        next('/');
    }
  
})
export default router;