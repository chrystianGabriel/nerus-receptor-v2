/*eslint-disable */
import firebase from 'firebase/app';
import 'firebase/database';
import Logger from '../services/loggerService';

class DataBase {
  constructor() {
    this.inicializeFirebase();
    this.database = firebase.database();
  }

  inicializeFirebase() {
    try
    {
      const firebaseConfig = {
        apiKey: 'AIzaSyCPpyRKqFRXME63hZEk3K_e-UEitQGmVfo',
        authDomain: 'ionic-nerus.firebaseapp.com',
        databaseURL: 'https://ionic-nerus.firebaseio.com',
        projectId: 'ionic-nerus',
        storageBucket: 'ionic-nerus.appspot.com',
        messagingSenderId: '356187916470',
        appId: '1:356187916470:web:ea8573f04b421606bdbe17',
      };
  
      firebase.initializeApp(firebaseConfig);

      Logger.classe(this.constructor.name)
            .metodo('inicializeFirebase')
            .mensagem('Firebase Inicializado')
            .info();
    }
    catch(e) {
      Logger.classe(this.constructor.name)
            .metodo('inicializeFirebase')
            .mensagem(e.message)
            .error();
    }
  }

  obtenhaInfoPlaylist(codigo) {
    return new Promise((resolve, reject) => {
      this.database.ref(`/play_lists/${codigo}`).once('value').then((data) => {
      
        Logger.classe(this.constructor.name)
              .metodo('obtenhaInfoPlaylist')
              .mensagem('Obtido informações da playlist')
              .info();
        
        resolve(data.val()[Object.keys(data.val())[0]]);
      })
      .catch((e) => {

        Logger.classe(this.constructor.name)
              .metodo('obtenhaInfoPlaylist')
              .parametros([codigo])
              .mensagem(e.message)
              .error();

        reject(e);
      });
    });
  }

  obtenhaAudiosPlaylist(codigo) {
    return new Promise((resolve, reject) => {
      this.database.ref(`/audios/${codigo}`).once('value').then((data) => {
        
        Logger.classe(this.constructor.name)
              .metodo('obtenhaAudiosPlaylist')
              .parametros([codigo])
              .mensagem('Obtido audios da playlist')
              .info();

        resolve(data.val()[Object.keys(data.val())[0]]);
      })
      .catch((e) => {
        Logger.classe(this.constructor.name)
              .metodo('obtenhaAudiosPlaylist')
              .parametros([codigo])
              .mensagem(e.message)
              .error();

        reject(e)
      });
    });
  }

  obtenhaMusicasPlaylist(codigo) {
    return new Promise((resolve, reject) => {
      this.database.ref(`/musicas/${codigo}`).once('value').then((data) => {
  
        Logger.classe(this.constructor.name)
              .metodo('obtenhaMusicasPlaylist')
              .parametros([codigo])
              .mensagem('Obtido musicas da playlist')
              .info();
      
        resolve(data.val()[Object.keys(data.val())[0]]);
      })
      .catch((e) => {

        Logger.classe(this.constructor.name)
              .metodo('obtenhaMusicasPlaylist')
              .parametros([codigo])
              .mensagem(e.message)
              .error();
        reject(e)
      });
    });
  }
}

export default new DataBase();
