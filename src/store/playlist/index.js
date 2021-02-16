import database from '../../providers/database';
import arquivos from '../../providers/arquivos';
import logger from '../../services/loggerService';

const mutations = {
  adicioneInfoPlaylist(state, {
    codigo, intervaloDeRepeticao, nome, tempo, tocando,
  }) {
    state.codigo = codigo;
    state.intervaloDeRepeticao = intervaloDeRepeticao;
    state.nome = nome;
    state.tempo = tempo;
    state.tocando = tocando;
  },
  adicioneAudiosAPlaylist(state, audios) {
    state.audios = audios;
  },
  adicioneMusicasAPlaylist(state, musicas) {
    state.musicas = musicas;
  },
  avanceParaAProximaMusica(state) {
    state.musicaAtual += 1;
  },
  avanceParaAProximoAudio(state) {
    state.audioAtual += 1;
  },
  retorneParaOInicio(state) {
    state.musicaAtual = 0;
    state.audioAtual = 0;
  },
};

const getters = {
  obtenhaProximaMusica(state) {
    const musica = state.musicas[state.musicaAtual];
    mutations.avanceParaAProximaMusica();

    return musica;
  },
  obtenhaProximoAudio(state) {
    const audio = state.audios[state.audioAtual];
    mutations.avanceParaAProximoAudio();

    return audio;
  },
  obtenhaInfoPlaylist(state) {
    return {
      codigo: state.codigo,
      intervaloDeRepeticao: state.intervaloDeRepeticao,
      nome: state.nome,
      tempo: state.tempo,
      tocando: state.tocando,
    };
  },
};

const actions = {
  carreguePlaylist(context, codigo) {
    database.obtenhaInfoPlaylist(codigo).then((playlist) => {
      context.commit('adicioneInfoPlaylist', playlist);
    });
    database.obtenhaAudiosPlaylist(codigo).then((audios) => {
      console.log(logger);
      audios.forEach(async (audio) => {
        await arquivos.downloadArquivo('audios', audio.path);
      });

      context.commit('adicioneAudiosAPlaylist', audios);
    });
    database.obtenhaMusicasPlaylist(codigo).then((musicas) => {
      musicas.forEach(async (musica) => {
        await arquivos.downloadArquivo('musicas', musica.path);
      });
      context.commit('adicioneMusicasAPlaylist', musicas);
    });
  },
};

const state = () => ({
  codigo: '',
  intervaloDeRepeticao: 0,
  nome: '',
  tempo: '23:00',
  tocando: true,
  audios: [],
  musicas: [],
  musicaAtual: 0,
  audioAtual: 0,
});

export default {
  state,
  mutations,
  getters,
  actions,
  namespaced: true,
};
