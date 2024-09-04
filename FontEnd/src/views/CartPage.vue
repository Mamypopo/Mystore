<template>
  <div class="container">
    <div id="w">
    <header id="title">
      <h1>Shopping Cart {{ getUser.id }} {{ getUser.address }}</h1>
    </header>
    <div v-if="cartItems.length === 0">
      <p>Your cart is empty.</p>
    </div>
    <div v-else>
      <div v-for="item in cartItems" :key="item.product_id" class="cart-item" >
      <table id="cart">
        <thead>
          <tr>
            <th class="first">Photo</th>
            <th class="second">Qty</th>
            <th class="third">Product</th>
            <th class="fourth">Price</th>
          </tr>
        </thead>
        <tbody>
          <tr class="productitm">
            <td><img :src="item.product_image_url" alt="Product Image" class="product-image"></td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.product_name }}</td>
            <td  v-if="typeof item.product_price === 'number'" >${{ item.product_price.toFixed(2) }}</td>
            <td v-else >{{ item.product_price }}</td>
            <button class="button-16" @click="removeFromCart(item.product_id)">Remove</button>
          </tr>
        </tbody>
      </table>
      
    </div>
    
    </div>
          <tr class="extracosts col d-flex ">
            <td class="light">Shipping &amp; Tax</td>
            <td colspan="2" class="light"></td>
            <td>$35.00</td>
            <td>&nbsp;</td>
          </tr>
          <tr class="totalprice col d-flex ">
            <span class="light">Total:</span>
            <span class="thicks">$</span><span class="thick">{{ totalPrice.toFixed(2) }}</span>

          </tr>
   <div class="chout">
     <button class="button-18 ">Checkout Now!</button>
   </div>
        
  </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useUserStore } from "../stores/user";

export default {
  data() {
    return {
      cartItems: [],  
      userId:'',
      productId:'',
    };
  },
  created() {
    this.fetchCartItems();  
  },
  computed: {
    totalPrice() {
      // คำนวณผลรวมของราคาสินค้าในตะกร้า
      return this.cartItems.reduce((total, item) => total + (item.product_price * item.quantity), 35);
    },
    
    getUser() {
      return useUserStore().getUser
    }
  },
  methods: {
    async fetchCartItems() {
      try {
        const userId = useUserStore().getUser.id 
        const response = await axios.get(`http://localhost:8000/api/cart/${userId}`,
        {
          headers: { 
            Authorization: "Bearer " + localStorage.getItem("token")
           }
        }
        );
        this.cartItems = response.data;
      }
       catch (error) {
        console.error('Error fetching cart items:', error);
      }
    },
    async removeFromCart(productId) {
    const confirmation = confirm('Are you sure you want to remove this item from the cart?');
    if (confirmation) {
        try {
            const userId = useUserStore().getUser.id 
           await axios.delete(`http://localhost:8000/api/cart/${userId}/${productId}`, {          
          headers: { 
            Authorization: "Bearer " + localStorage.getItem("token")
           }      
        });
        
        this.fetchCartItems(); 
        } catch (error) {
            console.error('Error deleting product from cart:', error);
        }
    }
  },
}
};
</script>

<style>
.chout{
  padding: 20px;
  
}
h1 {
  color: #fff;
  font-size: 3.5em;
  line-height: 1.1em;
  padding: 6px 0;
  font-weight: normal;
  text-align: center;
}


/* page structure */
#w {
  display: block;
  width: 900px;
  margin: 0 auto;
  background: #ffffff;
}

#title {
  display: block;
  margin-top: 30px;
  width: 100%;
  background: #A7CC6E;
  padding: 10px 0;
  -webkit-border-top-right-radius: 6px;
  -webkit-border-top-left-radius: 6px;
  -moz-border-radius-topright: 6px;
  -moz-border-radius-topleft: 6px;
  border-top-right-radius: 6px;
  border-top-left-radius: 6px;
}

#page {
  display: block;
  background: #fff;
  padding: 15px 0;
  -webkit-box-shadow: 0 2px 4px rgba(0,0,0,0.4);
  -moz-box-shadow: 0 2px 4px rgba(0,0,0,0.4);
}


/** cart table **/
#cart {
  display: block;
  border-collapse: collapse;
  margin: 0;
  width: 100%;
  font-size: 1.2em;
  color: #444;
}
#cart thead th {
  padding: 8px 0;
  font-weight: bold;
}

#cart thead th.first {
  width: 200px;


}
#cart thead th.second {


  width: 60px;
}
#cart thead th.third {
  width: 300px;
  text-align: center;
}
#cart thead th.fourth {
  width: 180px;

}
#cart thead th.fifth {
  width: 60px;


}

#cart tbody td {
  text-align: center;
  margin-top: 4px;
}

tr.productitm {
  height: 65px;
  line-height: 65px;
  border-bottom: 1px solid #d7dbe0;
}


#cart tbody td img.thumb {
  vertical-align: bottom;
  border: 1px solid #ddd;
  margin-bottom: 4px;
}

.qtyinput {
  width: 33px;
  height: 22px;
  border: 1px solid #a3b8d3;
  background: #dae4eb;
  color: #616161;
  text-align: center;
}

tr.totalprice, tr.extracosts {
  height: 35px;
  line-height: 35px;
  margin: 15px;
}
tr.extracosts {
  background: #e4edf4;
}


.light {
  color: #888b8d;
  text-shadow: 1px 1px 0 rgba(255,255,255,0.45);
  font-size: 1.1em;
  font-weight: normal;
  width: 90%;
}
.thick {
  color: #272727;
  font-size: 1.7em;
  font-weight: bold;
}

.thicks {
  color: #272727;
  font-size: 1.7em;
  font-weight: bold;
  margin-right: 10px;
}

/** submit btn **/
tr.checkoutrow {
  background: #cfdae8;
  border-top: 1px solid #abc0db;
  border-bottom: 1px solid #abc0db;
}
td.checkout {
  padding: 12px 0;
  padding-top: 20px;
  width: 100%;
  text-align: right;
}



</style>
