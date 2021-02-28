/* eslint-disable */
import { loggerApi } from 'boot/axios';
import AuthService from './authService';

class Logger {
  constructor() {
    this.log = {};
  }
  
  classe(classe) {
    this.log['classe'] = classe;
    return this;
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
        withCredentials: true,
        headers: {
          Authorization: `Basic ${AuthService.getUserToken()}`
        }
      })
        .then((res) => {
          this.log = {};
          resolve(res.data.sucesso);
        })
        .catch((e) => reject(e));
    });
  }

  warn() {
    return new Promise((resolve, reject) => {
      loggerApi.post(`/warn`, this.log, {
        withCredentials: true,
        headers: {
          Authorization: `Basic ${AuthService.getUserToken()}`
        }
      })
        .then((res) => {
          this.log = {};
          resolve(res.data.sucesso);
        })
        .catch((e) => reject(e));
    });
  }

  info() {
    return new Promise((resolve, reject) => {
      if(process.env.DEV) {
        loggerApi.post(`/info`, this.log, {
          withCredentials: true,
          headers: {
            Authorization: `Basic ${AuthService.getUserToken()}`
          }
        })
          .then((res) => {
            this.log = {};
            resolve(res.data.sucesso);
          })
          .catch((e) => reject(e));
      }

      resolve(true);
    });
  }

  http() {
    return new Promise((resolve, reject) => {
      loggerApi.post(`/http`, this.log, {
        withCredentials: true,
        headers: {
          Authorization: `Basic ${AuthService.getUserToken()}`
        }
      })
        .then((res) => {
          this.log = {};
          resolve(res.data.sucesso);
        })
        .catch((e) => reject(e));
    });
  }

  debbug() {
    return new Promise((resolve, reject) => {
      loggerApi.post(`/debbug`, this.log, {
        withCredentials: true,
        headers: {
          Authorization: `Basic ${AuthService.getUserToken()}`
        }
      })
        .then((res) => {
          this.log = {};
          resolve(res.data.sucesso);
        })
        .catch((e) => reject(e));
    });
  }
}

export default new Logger();
