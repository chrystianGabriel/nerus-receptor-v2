import Vue from 'vue';
import axios from 'axios';

Vue.prototype.$axios = axios;

const loggerApi = axios.create({ baseURL: process.env.LOGGER_URL });
export { axios, loggerApi };
