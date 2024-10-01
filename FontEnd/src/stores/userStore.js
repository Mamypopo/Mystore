// Pinia Store
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state() {
        return {
            id: 0,
            email: '',
            password: '',
            username:'',
            address:'',
            role: '',
            phone_number: '',
            profileImage: '',
        };
    },
    getters: {
        getUser() {
            return { 
                id: this.id, 
                email: this.email,
                username: this.username, 
                address: this.address, 
                role: this.role, 
                phone_number:this.phone_number,
                profileImage:this.profileImage 
            };
        }
    },
    actions: {
        setUser(user) {
            this.id = user.id;
            this.email = user.email;
            this.username = user.username;
            this.address = user.address;
            this.role = user.role;
            this.phone_number = user.phone_number;
            this.profileImage = user.profileImage;

        },
        resetUser() {
            this.id = 0;
            this.email = '';
            this.password = '';
            this.username='';
            this.address='';
            this.role = '';
            this.phone_number = '';
            this.profileImage= null;

        },
    }
});
