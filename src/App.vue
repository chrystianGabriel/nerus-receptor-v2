<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>
import { mapActions } from 'vuex';

export default {
  name: 'App',
  mounted() {
    this.carreguePlaylist('3282703');
  },
  methods: {
    ...mapActions({ carreguePlaylist: 'playlist/carreguePlaylist' }),
  },
};
</script>
