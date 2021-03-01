/*eslint-disable */
import { Plugins, FilesystemDirectory, Capacitor } from '@capacitor/core';

const { Filesystem } = Plugins;
import {Dropbox} from 'dropbox';
import Logger from '../services/loggerService';

class ArquivosProvider {
    constructor(){
        this.dropbox = new Dropbox({ accessToken: 'ZrgwP9vVfx8AAAAAAAAAAWQEo1bGaOrYtcSb5JoJd2s5cqnwU5qNQ4Brw15AeVCl' });   

        Filesystem.mkdir({
            path:`musicas`,
            directory: FilesystemDirectory.Data,
            recursive: false,
        }).then(r => console.log(r));


        Filesystem.mkdir({
            path:`audios`,
            directory: FilesystemDirectory.Data,
            recursive: false,
        }).then(r => console.log(r));
    }

    downloadArquivo(diretorio, url) {
        return new Promise(async (resolve, reject) => {
            const ref = this;
            this.dropbox.sharingListSharedLinks({ path: url }).then(data => {
                Logger.classe(ref.constructor.name)
                            .metodo('downloadArquivo')
                            .parametros([diretorio, url])
                            .mensagem(`arquivo encontrado com sucesso`)
                            .info();
                
            this.dropbox.sharingGetSharedLinkFile({url: data.result.links[0].url})
                .then(data => {
                    const arquivo = data.result;
                    Logger.classe(ref.constructor.name)
                            .metodo('downloadArquivo')
                            .parametros([diretorio, url])
                            .mensagem(`arquivo baixado com sucesso ${diretorio} - ${arquivo.name}`)
                            .info();

                    var reader = new FileReader();
                    reader.readAsDataURL(arquivo.fileBlob); 
                    reader.onloadend = function() {
                        var base64data = reader.result;                
                        Filesystem.writeFile({
                            path: `${diretorio}\\${arquivo.name}`,
                            data: base64data,
                            directory: FilesystemDirectory.Data,
                            recursive: true,
                        })
                        .then((result) => {
                            const { uri } = result;
                            resolve(Capacitor.convertFileSrc(uri));
                        })
                    }
                })
                .catch(e => {
                    Logger.classe(ref.constructor.name)
                            .metodo('downloadArquivo')
                            .parametros([diretorio, url])
                            .mensagem(e.message)
                            .error();
                    reject(e);
                })
            })
            .catch(e => {
                Logger.classe(ref.constructor.name)
                        .metodo('downloadArquivo')
                        .parametros([diretorio, url])
                        .mensagem(e.message)
                        .error();
                reject(e);
            })
        })
    }
}

export default new ArquivosProvider();
