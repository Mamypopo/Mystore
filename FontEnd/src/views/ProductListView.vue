<template>
  <section>
    <div class="container">
    <h1>Product List</h1>
    <div class="products-grid">
        <div v-for="product in products" :key="product.id" class="product-item">
            <img :src="`http://localhost:8000/uploads/${product.image}`" alt="Product Image" class="product-image">
            <p class="product-name">{{ product.name }}</p>
            <p class="product-description">{{ product.description }}</p>
            <p v-if="product.stock > 0" class="product-stock ">Stock: {{ product.stock }}</p>
            <p v-else class="out-of-stock">สินค้าหมด</p>
            <p class="product-price">฿{{ product.price }}</p>


            <div class="quantity-controls">
                <button class="button-pd" @click="decrementQuantity(product)" :disabled="product.quantity <= 1">-</button>
                <span>{{ product.quantity }}</span>
                <button class="button-pd" @click="incrementQuantity(product)" :disabled="product.quantity >= product.stock">+</button>
            </div>

            <button class="add-to-cart-btn"
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
import Swal from 'sweetalert2';
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

    async decrementQuantity(product) {
  if (product.quantity > 1) {
    product.quantity--;
  } else {
    Swal.fire('ผิดพลาด!', 'จำนวนสินค้าต่ำสุดคือ 1 ชิ้น.', 'error');
  }
},


    async addToCart(product) {
  const result = await Swal.fire({
    title: 'ยืนยันการเพิ่มสินค้า?',
    text: `คุณต้องการเพิ่มสินค้า ${product.name} จำนวน ${product.quantity} ชิ้น ลงในตะกร้าหรือไม่?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'ตกลง',
    cancelButtonText: 'ยกเลิก'
  });

  if (result.isConfirmed) {
    try {
      const token = localStorage.getItem('token'); // ดึง token จาก localStorage
      if (!token) {
        alert('Please log in first');
        return;
      }
      const response = await axios.post('http://localhost:8000/api/cart/add', {
        userId: useUserStore().getUser.id,
        productId: product.id,
        quantity: product.quantity
      }, {
        headers: { 
          Authorization: "Bearer " + token
        }
      });

      if (response.data.status === 'Sold Out') {
        alert('สินค้านี้หมดแล้ว!');
      } else {
        Swal.fire('สำเร็จ!', `สินค้า "${product.name}" จำนวน ${product.quantity} ถูกเพิ่มลงในตะกร้าเรียบร้อยแล้ว!`, 'success');
        product.quantity = 1; // รีเซ็ตจำนวนสินค้าเป็น 1
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
      Swal.fire('ผิดพลาด!', 'ไม่สามารถเพิ่มสินค้าได้.', 'error');
    }
  }
}


  }
  
  
};
</script>
<style scoped>

/* Slide Section */
.slider-container {
  position: relative;
  height: 60vh;
  overflow: hidden;
}

.slide {
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.slide.active {
  opacity: 1;
}

.slide-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.slide-caption {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1.2rem;
}



/* Category Section */
.category-container {
  text-align: center;
  padding: 40px 20px;
}

.section-title {
  font-size: 2rem;
  margin-bottom: 20px;
  color: #222;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
}

.category-item {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.category-image {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 10px;
}

/* Product List Section */
.container {
  padding: 40px 20px;
  font-family: 'Noto Sans Thai', sans-serif;

}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.product-item {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 10px;
}

.product-name {
  font-size: 1.2rem;
  margin: 10px 0;
  color: #333;
}

.product-description {
  font-size: 0.9rem;
  color: #666;
}

.product-sold, .product-stock, .out-of-stock {
  font-size: 0.9rem;
  margin: 10px 0;
}

.out-of-stock {
  color: red;
}

.product-price {
  font-size: 1.2rem;
  color: #333;
  font-weight: bold;
}

.quantity-controls {
  display: flex;
  align-items: center;
  margin: 10px 0;
}

.button-pd {
  background-color: #f0f0f0;
  border: none;
  padding: 5px 10px;
  margin: 0 5px;
  cursor: pointer;
  border-radius: 5px;
}

.add-to-cart-btn {
  background-color: #333;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.add-to-cart-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
