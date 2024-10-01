<template>
  <div class="container">
    <div id="w">
      <header id="title">
        <h1>Shopping Cart</h1>
      </header>
      <div v-if="cartItems.length === 0">
        <p class="fs-5 text-xl-center p-md-2">Your cart is empty.</p>
      </div>
      <div v-else>
        <table id="cart">
          <thead>
            <tr>
              <th class="first">Photo</th>
              <th class="second">Qty</th>
              <th class="third">Product</th>
              <th class="fourth">Price</th>
              <th class="fourth">Total</th>
              <th class="fifth">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in cartItems" :key="item.product_id" class="productitm">
              <td><img :src="item.product_image_url" alt="Product Image" class="product-image" /></td>
              <td>{{ item.quantity }}</td>
              <td>{{ item.product_name }}</td>
              <td v-if="typeof item.product_price === 'number'">${{ item.product_price.toFixed(2) }}</td>
              <td v-else>{{ item.product_price }}</td>
              <td>${{ (item.product_price * item.quantity).toFixed(2) }}</td>
              <td>
                <button class="button-16" @click="removeFromCart(item.product_id)">Remove</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <tr class="extracosts col d-flex">
        <td class="light">Shipping & Tax</td>
        <td colspan="2" class="light"></td>
        <td>$35.00</td>
        <td>&nbsp;</td>
      </tr>
      <tr class="totalprice col d-flex">
        <span class="light">Total:</span>
        <span class="thicks">$</span><span class="thick">{{ totalPrice }}</span>
      </tr>
      <div class="chout">
        <button class="button-18" @click="placeOrder">Checkout Now!</button>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios';
import { useUserStore } from "../stores/userStore.js";
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      userProfile: [],
      cartItems: [],
      userId: '',
      totalAmount: 0,
    };
  },
  async created() {
    this.fetchCartItems();
  },
  computed: {
    getUser() {
      return useUserStore().getUser;
    },
    totalPrice() {
      return this.cartItems.reduce((total, item) => total + (item.product_price * item.quantity), 35).toFixed(2);
    }
  },
  methods: {
    async fetchCartItems() {
      try {
        const userId = useUserStore().getUser.id;
        const response = await axios.get(`http://localhost:8000/api/cart/${userId}`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        });
        this.cartItems = response.data;
      } catch (error) {
        console.error('Error fetching cart items:', error);
        Swal.fire('ผิดพลาด!', 'ไม่สามารถดึงข้อมูลตะกร้าได้.', 'error');
      }
    },
    async removeFromCart(productId) {
      const itemToRemove = this.cartItems.find(item => item.product_id === productId);
      const result = await Swal.fire({
        title: 'ยืนยันการลบสินค้า?',
        text: `คุณต้องการลบสินค้า ${itemToRemove.product_name} จำนวณ ${itemToRemove.quantity} ชิ้น จากตะกร้าหรือไม่?`,     
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ตกลง',
        cancelButtonText: 'ยกเลิก'
      });

      if (result.isConfirmed) {
        try {
          const userId = useUserStore().getUser.id;
          await axios.delete(`http://localhost:8000/api/cart/${userId}/${productId}`, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          });
          Swal.fire('สำเร็จ!', `สินค้า ${itemToRemove.product_name} ถูกลบออกจากตะกร้าเรียบร้อยแล้ว!`, 'success');
          this.fetchCartItems();
        } catch (error) {
          console.error('Error deleting product from cart:', error);
          Swal.fire('ผิดพลาด!', 'ไม่สามารถลบสินค้าได้.', 'error');
        }
      }
    },
    async placeOrder() {
  const userId = useUserStore().getUser.id;
  if (this.cartItems.length === 0) {
    Swal.fire('ไม่มีสินค้าในตะกร้า!', 'กรุณาเพิ่มสินค้าก่อนทำการสั่งซื้อ.', 'warning');
    return;
  }
  const orderDetails = this.cartItems.map(item => 
    `ชื่อสินค้า: ${item.product_name} จำนวน: ${item.quantity} ชิ้น`
  ).join('\n');

  const result = await Swal.fire({
    title: 'ยืนยันการสั่งซื้อ',
        text: `คุณต้องการสั่งซื้อสินค้าดังต่อไปนี้:\n${orderDetails}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ตกลง',
        cancelButtonText: 'ยกเลิก'
      });
      if(result.isConfirmed){
        try {
    const response = await axios.post('http://localhost:8000/api/orders', {
      userId,
      items: this.cartItems.map(item => ({ product_id: item.product_id, quantity: item.quantity })),
      email: this.userProfile.email,
    });
    
    console.log('Order placed:', response.data);
    
    
    const orderDetails = this.cartItems.map(item => 
      `ชื่อสินค้า: ${item.product_name}, จำนวน: ${item.quantity}`
    ).join('\n');
    
    Swal.fire({
      title: 'สั่งซื้อเรียบร้อย!',
      text: `คุณได้ทำการสั่งซื้อสินค้าดังต่อไปนี้:\n${orderDetails}`,
      icon: 'success',
      confirmButtonText: 'ตกลง'
    });

    this.cartItems = []; 
  } catch (error) {
    console.error('Error placing order:', error);
    Swal.fire('ผิดพลาด!', 'ไม่สามารถทำการสั่งซื้อได้.', 'error');
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
