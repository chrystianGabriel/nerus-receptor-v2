<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>
import { mapActions } from 'vuex';
import AuthService from './services/authService';

export default {
  name: 'App',
  mounted() {
    const codigo = '3282703';
    AuthService.auth(codigo);
    this.carreguePlaylist(codigo);
  },
  methods: {
    ...mapActions({ carreguePlaylist: 'playlist/carreguePlaylist' }),
  },
};
</script>
