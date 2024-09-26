// Pinia Store
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state() {
        return {
            id: 0,
            email: '',
            password: '',
            role: '',
            phone: '',
        };
    },
    getters: {
        getUser() {
            return { id: this.id, email: this.email, role: this.role, phone: this.phone };
        }
    },
    actions: {
        setUser(user) {
            this.id = user.id;
            this.email = user.email;
            this.role = user.role;
            this.phone = user.phone;
        },
        resetUser() {
            this.id = 0;
            this.email = '';
            this.password = '';
            this.role = '';
            this.phone = '';
        }
    }
});
