import database from '../../providers/database';
import arquivos from '../../providers/arquivos';

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
  adicioneUidPlaylist(state, uiid) {
    state.uid = uiid;
  },
  adicioneUidAudios(state, uiid) {
    state.uidAudios = uiid;
  },
  adicioneUidMusicas(state, uiid) {
    state.uidMusicas = uiid;
  },
  adicioneAudiosAPlaylist(state, audios) {
    state.audios = audios;
  },
  adicioneMusicasAPlaylist(state, musicas) {
    state.musicas = musicas;
  },
  avanceParaAProximaMusica(state) {
    state.musicaAtual = (state.musicaAtual + 1) % state.musicas.length;
  },
  avanceParaOProximoAudio(state) {
    state.audioAtual = (state.audioAtual + 1) % state.audios.length;
  },
  retorneParaOInicio(state) {
    state.musicaAtual = 0;
    state.audioAtual = 0;
  },
};

const getters = {
  obtenhaProximaMusica(state) {
    const musica = state.musicas[state.musicaAtual];
    return musica;
  },
  obtenhaProximoAudio(state) {
    const audio = state.audios[state.audioAtual];
    return audio;
  },
  obtenhaAudioAtual(state) {
    return state.audioAtual - 1;
  },
  obtenhaMusicaAtual(state) {
    return state.musicaAtual - 1;
  },
  obtenhaInfoPlaylist(state) {
    return {
      codigo: state.codigo,
      intervaloDeRepeticao: state.intervaloDeRepeticao,
      nome: state.nome,
      tempo: state.tempo,
      tocando: state.tocando,
      intervaloMusicaInicial: state.musicas[0].intervalo,
      intervaloAudioInicial: state.audios[0].intervalo,
      uid: state.uid,
      uidAudios: state.uidAudios,
      uidMusicas: state.uidMusicas,
    };
  },
};

const actions = {
  carregueAudios(context, codigo) {
    return new Promise((resolve, reject) => {
      database.obtenhaAudiosPlaylist(codigo).then((audios) => {
        context.commit('adicioneUidAudios', audios[0]);
        const promises = audios[1].map(async (audio) => {
          const local = await arquivos.downloadArquivo('audios', audio.path);
          return {
            ...audio,
            local,
          };
        });
        Promise.allSettled(promises).then((a) => {
          const audiosComSucesso = a.filter((f) => f.value !== undefined).map((v) => v.value);
          context.commit('adicioneAudiosAPlaylist', audiosComSucesso);
          resolve();
        })
          .catch((e) => {
            reject(e);
          });
      });
    });
  },
  carregueMusicas(context, codigo) {
    return new Promise((resolve, reject) => {
      database.obtenhaMusicasPlaylist(codigo).then((musicas) => {
        context.commit('adicioneUidMusicas', musicas[0]);
        const promises = musicas[1].map(async (musica) => {
          const local = await arquivos.downloadArquivo('musicas', musica.path);

          return {
            ...musica,
            local,
          };
        });

        Promise.allSettled(promises).then((m) => {
          const musicasComSucesso = m.filter((f) => f.value !== undefined).map((v) => v.value);
          context.commit('adicioneMusicasAPlaylist', musicasComSucesso);
          resolve();
        })
          .catch((e) => {
            reject(e);
          });
      });
    });
  },
  carreguePlaylist(context, codigo) {
    return new Promise((resolve, reject) => {
      database.obtenhaInfoPlaylist(codigo).then(async (playlist) => {
        context.commit('adicioneUidPlaylist', playlist[0]);
        context.commit('adicioneInfoPlaylist', playlist[1]);
        await actions.carregueAudios(context, codigo).catch((e) => reject(e));
        await actions.carregueMusicas(context, codigo).catch((e) => reject(e));

        resolve();
      });
    });
  },
  atualizeAudioTocando(context, index) {
    return new Promise((resolve, reject) => {
      const audios = context.state.audios.map((valor, i) => {
        const tocando = index === i;
        return {
          ...valor,
          tocando,
        };
      });

      context.commit('adicioneAudiosAPlaylist', audios);
      database.atualizeAudio(context.state, audios)
        .then(() => resolve())
        .catch((e) => reject(e));
    });
  },
  atualizeMusicaTocando(context, index) {
    return new Promise((resolve, reject) => {
      const musicas = context.state.musicas.map((valor, i) => {
        const tocando = index === i;
        return {
          ...valor,
          tocando,
        };
      });
      context.commit('adicioneMusicasAPlaylist', musicas);
      database.atualizeMusica(context.state, musicas)
        .then(() => resolve())
        .catch((e) => reject(e));
    });
  },
};

const state = () => ({
  codigo: '',
  uid: '',
  uidAudios: '',
  uidMusicas: '',
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
