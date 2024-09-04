import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterForAdmin from '../views/RegisterForAdmin.vue';
import RegisterForUser from '../views/RegisterForUser.vue';
import { useUserStore } from '../stores/user';
import ProductList from '@/views/ProductList.vue';
import ProductForm from '@/views/ProductForm.vue';
import CartPage from '@/views/CartPage.vue';
import axios from 'axios';
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
            component: LoginView
        },
        {
            path: '/register-foruser',
            name: 'register-user',
            component: RegisterForUser
        },
        {
            path: '/register-foradmin',
            name: 'register-admin',
            component: RegisterForAdmin
        },
        {
            path: '/products',
            component: ProductList,
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
        next();
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