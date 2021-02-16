/*eslint-disable */
import {Dropbox} from 'dropbox';

class ArquivosProvider {
    constructor(){
        this.dropbox = new Dropbox({ accessToken: 'ZrgwP9vVfx8AAAAAAAAAAWQEo1bGaOrYtcSb5JoJd2s5cqnwU5qNQ4Brw15AeVCl' });
        this.file = null;
    }

    carregarFile(diretorio) {
        const ref = this;
        return new Promise((resolve, reject) => {
            document.addEventListener("deviceready", () => {
                console.log(cordova.file.externalDataDirectory);
                window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function (dirEntry) {
                    dirEntry.getDirectory(`/${diretorio}`, { create: true }, (fs) => {
                        ref.file = fs;
                        resolve(true)
                    })
                }, (e) => console.log(e));
            }, false);
        });
    }

    downloadArquivo(diretorio, url) {
       var ref = this;
       return new Promise(async (resolve, reject) => {
            this.carregarFile(diretorio).then(() => {
                this.dropbox.sharingListSharedLinks({ path: url }).then(data => {
                    this.dropbox.sharingGetSharedLinkFile({url: data.result.links[0].url})
                    .then(data => {
                        const arquivo = data.result;
                        ref.file.getFile(arquivo.name, { create: true, exclusive: false }, (fileEntry) => {
                            fileEntry.createWriter(function(fileWriter) {

                                fileWriter.onwriteend = function() {
                                    console.log("Successful file write...");
                                };
    
                                fileWriter.onerror = function (e) {
                                    console.log("Failed file write: " + e.toString());
                                };
                                fileWriter.write(arquivo.fileBlob);
                                resolve();
                                })
                            }, (e) => reject(e));
                        })
                 });
            });
       })
    }
}

export default new ArquivosProvider();