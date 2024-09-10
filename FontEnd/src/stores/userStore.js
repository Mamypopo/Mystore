import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state() {
        return {
            id: 0,
            email: '',
            password: '',
            role: '',
            phone: '',
        }
    },
    getters: {
        getUser() {
            return this.user;
        }
    },
    actions: {
        setUser(user) {
            this.user = user;
        },
        resetUser() {
            this.user = {
                id: 0,
                email: '',
                password: '',
                role: '',
                phone: '',
              }
        }
    }
});