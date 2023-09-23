<template>
  <div id="app">
    <NavbarView/>
    <ErrorView v-if="error" :msg="error"/>
    <router-view/>
  
  
  </div>
  <!-- <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav> -->

</template>

<script>
import NavbarView from './components/NavbarView.vue';
import ErrorView from './components/ErrorView.vue';
import { mapGetters } from 'vuex';
export default{
  components:{
    NavbarView,
    ErrorView
},

computed:{
    ...mapGetters(["error"])
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
