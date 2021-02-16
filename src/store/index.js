import Vue from 'vue';
import Vuex from 'vuex';
import Playlist from './playlist';

Vue.use(Vuex);

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      playlist: Playlist,
    },

    strict: process.env.DEBUGGING,
  });

  return Store;
}
