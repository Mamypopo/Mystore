<template>

  <section>
    <div class="container">
      
        <h1>Product</h1>      
        <div id="shop">
            <div   v-for="product in products" :key="product.id" class="products " id="product">
                <img class="product-image" :src="`/uploads/${product.image}`"  >
                <p class="product-name">{{ product.name }}</p>
                <p class="product-description">{{ product.description }}</p>
                <p  class="product-name" >{{ product.stock }} </p> 
                <p  class="product-price" >{{ product.price }}</p>
      <!-- <button type="submit" class="entypo-right-dir  " @click="addToCart(product.id)" :disabled="quantity > product.stock || quantity <= 0" >ADD TO CART</button> -->
     <!-- Quantity Control -->
     
      <button   @click="incrementQuantity(product)" :disabled="product.quantity >= product.stock">+</button>
 <span>{{ product.quantity }}</span>
      <button @click="decrementQuantity(product)" :disabled="product.quantity <= 1">-</button>
      <button 
        @click="addToCart(product)" 
        :disabled="product.stock <= 0">
        Add to Cart
      </button>
            </div>        
        </div>
        
    </div>
        <div id='cart-wrapper' class="slider close">
            <div id='cart'>
                <div id="cart-products-wrapper">
                    <table id="cart-table">
                    <thead id="cart-table-header">
                         <th class="name-col">Product Name</th> 
                         <th class="quantity-col">Quantity</th>       
                         <th class="price-col">Price</th>
                         <th class="updated-price-col">Updated Price</th>
                         <th class="update-col">Update</th>
                         <th class="remove-col">Remove</th>
                    </thead>
                    <tbody id="cart-table-body"></tbody>
                    </table>
                </div>
            </div>
            
            <div id='amount-controls'>
                <div id="cart-amount-wrapper">
                    <table>
                        <tbody>
                            <tr id='subtotal-wrappper'>
                                <td id="subtotal-label">Subtotal:</td>
                                <td id="subtotal">0.00</td>
                            </tr>

                            <tr id='total-wrapper'>
                                <td id="total-label">Total:</td>
                                <td id="total">0.00</td>
                            </tr>

                            <tr id="promo-checkout">
                                <td id="promo-wrapper">
                                    <input id="promo" placeholder="Input Promo Code">
                                    <button id="apply-promo">Apply Promo</button>
                                </td>

                                <td>
                                    <button id="checkout">Checkout</button>
                                </td>
                                
                                <td>
                                    <button id="ks" class="keep-shopping">Keep Shopping</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
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
  height: 80px;
  width: 100%;
  background: #efefef;
  border-radius: 0 0 6px 6px;
  margin-top: 15px;
  padding: 10px 5% 0 5%;
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





</style>