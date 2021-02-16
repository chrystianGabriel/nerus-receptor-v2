/* eslint-disable */
import { loggerApi } from 'boot/axios';
import AuthService from './authService';

class Logger {
  constructor() {
    this.log = {};
  }

  metodo(metodo) {
    this.log['metodo'] = metodo;
    return this;
  }

  parametros(parametros) {
    this.log['parametros'] = parametros;
    return this;
  }
  
  mensagem(mensagem) {
    this.log['mensagem'] = mensagem;

    return this;
  }

  error() {
    return new Promise((resolve, reject) => {
      loggerApi.post('/error', this.log, {
        auth: AuthService.getUserToken(),
      })
        .then(() => {
          resolve();
        })
        .catch((e) => reject(e));
    });
  }

  warn() {
    return new Promise((resolve, reject) => {
      loggerApi.post(`${this.URL_BASE}/warn`, this.log)
        .then(() => {
          resolve();
        })
        .catch((e) => reject(e));
    });
  }

  info() {
    return new Promise((resolve, reject) => {
      loggerApi.post(`${this.URL_BASE}/info`, this.log)
        .then(() => {
          resolve();
        })
        .catch((e) => reject(e));
    });
  }

  http() {
    return new Promise((resolve, reject) => {
      loggerApi.post(`${this.URL_BASE}/http`, this.log)
        .then(() => {
          resolve();
        })
        .catch((e) => reject(e));
    });
  }

  debbug() {
    return new Promise((resolve, reject) => {
      loggerApi.post(`${this.URL_BASE}/debbug`, this.log)
        .then(() => {
          resolve();
        })
        .catch((e) => reject(e));
    });
  }
}

export default new Logger();
