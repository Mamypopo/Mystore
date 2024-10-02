<template>
  <div id="app">
    <header>
      <Navbar />
    </header>
    <main>
      <router-view />
    </main>
    <footer>
      <Footer />
    </footer>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';

export default {
  components: {
    Navbar,
    Footer,
  },
  data() {
    return {
      editingProduct: null,
    };
  },
  methods: {
    refreshList() {
      this.editingProduct = null;
    },
  },
};
</script>

<style scoped>

</style>
