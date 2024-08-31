<template>
  <div class="container">
    <div id="w">
    <header id="title">
      <h1>Shopping Cart</h1>
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
            <span colspan="2"><span class="thick"> $  {{ totalPrice.toFixed(2) }} </span></span>
          </tr>
   <div class="chout">
     <button class="button-18 ">Checkout Now!</button>
   </div>
        
  </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      cartItems: [],  // สินค้าในตะกร้า
    };
  },
  created() {
    this.fetchCartItems();  // เรียกดูสินค้าที่อยู่ในตะกร้าเมื่อสร้างคอมโพเนนต์
  },
  computed: {
    totalPrice() {
      // คำนวณผลรวมของราคาสินค้าในตะกร้า
      return this.cartItems.reduce((total, item) => total + (item.product_price * item.quantity), 35);
    }
  },
  methods: {
    async fetchCartItems() {
      try {
        const userId = 1; // สมมติว่า userId เป็น 1 หรือคุณจะเปลี่ยนเป็นค่าอื่นก็ได้ตามความต้องการ

        // ดึงข้อมูลสินค้าที่อยู่ในตะกร้าของผู้ใช้
        const response = await axios.get(`http://localhost:8000/api/cart/${userId}`);
        this.cartItems = response.data;
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    },
    async removeFromCart(productId) {
      try {
        const userId = 1; // สมมติว่า userId เป็น 1

        await axios.post('http://localhost:8000/api/cart/remove', {
          userId,
          productId,
        });

        this.fetchCartItems();  // อัปเดตตะกร้าใหม่หลังจากลบสินค้า
      } catch (error) {
        console.error('Error removing item from cart:', error);
      }
    },
    async decreaseQuantity(productId) {

      try {
        const userId = 1;
        
        await axios.post('http://localhost:8000/api/cart/decrease', {
          userId,
          productId,
          quantity: 1, // ลดจำนวนสินค้าลง 1
        });

        this.fetchCartItems();  // อัปเดตตะกร้าใหม่หลังจากลดจำนวนสินค้า
      } catch (error) {
        console.error('Error decreasing item quantity:', error);
      }
    },
    checkout() {
      // ฟังก์ชันการชำระเงิน สามารถเพิ่มฟังก์ชันได้ที่นี่
      console.log('Proceed to checkout');
    }
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
