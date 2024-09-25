<template>
  <section>
    <div class="container">
    <h1>Product List</h1>
    <div class="products-grid">
        <div v-for="product in products" :key="product.id" class="product-item">
            <img :src="`http://localhost:8000/uploads/${product.image}`" alt="Product Image" class="product-image">
            <p class="product-name">{{ product.name }}</p>
            <p class="product-description">{{ product.description }}</p>
            <p v-if="product.stock > 0" class="product-stock">Stock: {{ product.stock }}</p>
            <p v-else class="out-of-stock">สินค้าหมด</p>
            <p class="product-price">{{ product.price }}</p>

            <div class="quantity-controls">
                <button class="button-pd" @click="decrementQuantity(product)" :disabled="product.quantity <= 1">-</button>
                <span>{{ product.quantity }}</span>
                <button class="button-pd" @click="incrementQuantity(product)" :disabled="product.quantity >= product.stock">+</button>
            </div>

            <button 
                @click="addToCart(product)" 
                :disabled="product.stock <= 0"
                >
                Add to Cart
            </button>
        </div>
    </div>
</div>

  </section>
</template>

<script>
import axios from 'axios';
import {useUserStore} from '../stores/userStore.js'
export default {
  data() {
    return {
      products: [],  // รายการสินค้าจะถูกบันทึกที่นี่\
      quantity: 1,
    };
  },
 
  async created() {
    try {
      const response = await axios.get('http://localhost:8000/api/products');
      this.products = response.data.map(product => ({
        ...product,
        quantity: 1 
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  },
  
  methods: {
    incrementQuantity(product) {
      // เพิ่มปริมาณสินค้า
      if (product.quantity < product.stock) {
        product.quantity++;
      }
    },

    decrementQuantity(product) {
      // ลดปริมาณสินค้า
      if (product.quantity > 1) {
        product.quantity--;
      }
    },


    async addToCart(product ) {
      try {
        const token = localStorage.getItem('token'); // ดึง token จาก localStorage
        if (!token) {
          alert('Please log in first');
          return;
        }
        const response =  await axios.post('http://localhost:8000/api/cart/add', {
          userId: useUserStore().getUser.id, 
          productId: product.id,
          quantity: product.quantity

        },{
          headers: { 
            Authorization: "Bearer " + localStorage.getItem("token")
           }
        });
   
        if (response.data.status === 'Sold Out') {
          alert('This product is sold out!');
        } else {
          alert('Product added to cart successfully!');
          location.reload();
          product.quantity = 1;
        }
      } catch (error) {
        console.error('Error adding product to cart:', error);
        alert('Error adding product to cart. Please try again.');
      }
    },


  }
  
  
};
</script>
<style scoped>




h1{
  text-align: center;
  padding-top: 30px;
}

button {
  height: 55px;
  width: 100%;
  margin: 0 auto;
  background: #ea7272;
  border-radius: 4px;
  border: none;
  border-bottom: 3px solid #e24848;
  color: #f6f6f6;
  font: 600 1.7rem 'Source Sans Pro', sans-serif;
  text-transform: uppercase;
  text-indent: 10px;
  cursor: pointer;
}
button.entypo-right-dir:before{
  position: relative;
  background: #e24848;
  padding: 4px 9px;
  border-radius: 50%;
  font-size: 2rem;
  color: #f6f6f6;
  text-indent: 2px;
  left: -10px;
  top: 2px;
}
/* Button  pseudos*/
button:hover {
  background: #ef7572;
  
}
button:active {
  border-bottom: 2px solid #e24848;
  font: 600 1.7rem 'Source Sans Pro', sans-serif;
  text-transform: uppercase;
  text-indent: 10px;
  cursor: pointer;
   height: 55px;
  width: 100%;
  margin: 0 auto;
  background: #ea7272;
  border-radius: 4px;
  border: none;
}

button:disabled {
  background-color: gray;
  cursor: not-allowed;
  opacity: 0.6;
}


.button-pd {
  height: 40px;
  width: 40px;
  margin: 10px;
  background: #ea7272;
  border-radius: 4px;
  border: none;
  border-bottom: 3px solid #e24848;
  color: #f6f6f6;
  font: 600 1.7rem 'Source Sans Pro', sans-serif;
  text-transform: uppercase;
  text-indent: 1px;
  cursor: pointer;
  
}
.button-pd.entypo-right-dir:before{
  position: relative;
  background: #e24848;
  padding: 4px 9px;
  border-radius: 50%;
  font-size: 2rem;
  color: #f6f6f6;
  text-indent: 1px;
  left: -10px;
  top: 2px;
}
/* Button  pseudos*/
.button-pd:hover {
  background: #ef7572;
  
}
.button-pd:active {
  border-bottom: 2px solid #e24848;
  font: 600 1.7rem 'Source Sans Pro', sans-serif;
  text-transform: uppercase;
  text-indent: 1px;
  cursor: pointer;
  height: 40px;
  width: 40px;
  margin: 10px;
  background: #ea7272;
  border-radius: 4px;
  border: none;
}

.button-pd:disabled {
  background-color: gray;
  cursor: not-allowed;
  opacity: 0.6;
}




</style>