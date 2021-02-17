/*eslint-disable */
import {Dropbox} from 'dropbox';
import Logger from '../services/loggerService';

class ArquivosProvider {
    constructor(){
        this.dropbox = new Dropbox({ accessToken: 'ZrgwP9vVfx8AAAAAAAAAAWQEo1bGaOrYtcSb5JoJd2s5cqnwU5qNQ4Brw15AeVCl' });
        this.file = null;      
    }

    carregarFile(diretorio) {
        const ref = this;
        return new Promise((resolve, reject) => {
            document.addEventListener("deviceready", () => {
                window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function (dirEntry) {
                    dirEntry.getDirectory(`/${diretorio}`, { create: true }, (fs) => {
                        ref.file = fs;
                        Logger.classe(ref.constructor.name)
                              .metodo('carregarFile')
                              .mensagem('Sistema de arquivos carregado com sucesso')
                              .info();
                    
                        resolve(true)
                    })
                }, (e) => {
                    Logger.classe(ref.constructor.name)
                              .metodo('carregarFile')
                              .mensagem(e.message)
                              .error();
                    reject(e);
                });
            }, false);
        });
    }

    downloadArquivo(diretorio, url) {
       var ref = this;
       return new Promise(async (resolve, reject) => {
            this.carregarFile(diretorio).then(() => {
                this.dropbox.sharingListSharedLinks({ path: url }).then(data => {
                    Logger.classe(ref.constructor.name)
                              .metodo('downloadArquivo')
                              .parametros([diretorio, url])
                              .mensagem(`arquivo encontrado com sucesso`)
                              .info();

                    this.dropbox.sharingGetSharedLinkFile({url: data.result.links[0].url})
                    .then(data => {
                        const arquivo = data.result;
                        console.log(data);
                        Logger.classe(ref.constructor.name)
                              .metodo('downloadArquivo')
                              .parametros([diretorio, url])
                              .mensagem(`arquivo baixado com sucesso ${diretorio} - ${arquivo.name}`)
                              .info();

                        ref.file.getFile(arquivo.name, { create: true, exclusive: false }, (fileEntry) => {
                            fileEntry.createWriter(function(fileWriter) {

                                fileWriter.onwriteend = function() {
                                    Logger.classe(ref.constructor.name)
                                    .metodo('downloadArquivo')
                                    .parametros([diretorio, url])
                                    .mensagem(`arquivo salvo com sucesso ${diretorio} - ${arquivo.name}`)
                                    .info();
                                };
    
                                fileWriter.onerror = function (e) {
                                    Logger.classe(ref.constructor.name)
                                    .metodo('downloadArquivo')
                                    .parametros([diretorio, url])
                                    .mensagem(e.message)
                                    .error();
                                };

                                fileWriter.write(arquivo.fileBlob);

                                resolve();
                                })
                            }, (e) => reject(e));
                        })
                 })
                 .catch(e => {
                    Logger.classe(ref.constructor.name)
                          .metodo('downloadArquivo')
                          .parametros([diretorio, url])
                          .mensagem(e.message)
                          .info();
                 })
            });
       })
    }
}

export default new ArquivosProvider();