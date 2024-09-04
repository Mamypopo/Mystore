import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state() {
        return {
            user: {
                id: 0,
                email: '',
                username: '',
                address: '',
                phone_number: '',
                role: ''
            },
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
                username: '',
                address: '',
                phone_number: '',
                role: ''
            }
        }
    }
});