
<template>

   <header>
    <Navbar />
  </header>
  <main>
    <router-view></router-view>
  </main>


</template>
<script >
import { RouterLink, RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue';


export default {
  data() {
    return {
      editingProduct: null
    };
  },
  components: {
    Navbar,
   
  },
  methods: {
    refreshList() {
      this.editingProduct = null;
    }
  }
}

</script>
<style scoped>

</style>
