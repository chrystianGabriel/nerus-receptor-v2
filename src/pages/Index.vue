<template>
  <div>
    <vs-row
      vs-align="center"
      vs-type="flex"
      vs-justify="center"
      vs-w="12"
      style="height:100vh">
        <vs-col
          vs-type="flex"
          vs-justify="center"
          vs-align="flex-end"
          vs-w="12">
            <vs-input
              label-placeholder="Código"
              v-model="codigo" />

            <vs-button
              color="primary"
              type="filled"
              icon="search"
              style="margin-left: 10px"
              @click="buscarCodigoPlaylist" />
        </vs-col>
        <audio ref="playerMusica" style="display:none" autobuffer="autobuffer" controls>
          <source :src="musica">
        </audio>
        <audio ref="playerAudio" style="display:none" autobuffer="autobuffer" controls>
          <source :src="audio">
        </audio>
    </vs-row>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import AuthService from '../services/authService';
import database from '../providers/database';
import timerManager from '../services/TimerManagerSerice';
import Logger from '../services/loggerService';

export default {
  name: 'PageIndex',
  data() {
    return {
      codigo: '',
      musicaAtual: '',
      audioAtual: '',
    };
  },
  computed: {
    ...mapGetters({ playlist: 'playlist/obtenhaInfoPlaylist' }),
    musica: {
      set(valor) {
        this.musicaAtual = valor;
      },
      get() {
        return this.musicaAtual;
      },
    },
    audio: {
      set(valor) {
        this.audioAtual = valor;
      },
      get() {
        return this.audioAtual;
      },
    },
    tocando() {
      const horas = this.playlist.tempo.split(':')[0];
      const minutos = this.playlist.tempo.split(':')[1];
      const horaDeParada = new Date(new Date(Date.now())
        .setHours(
          parseInt(horas, 10),
          parseInt(minutos, 10),
        ));
      const horaAtual = new Date(Date.now());
      return this.playlist.tocando && horaDeParada > horaAtual;
    },
  },
  methods: {
    ...mapActions({
      carreguePlaylist: 'playlist/carreguePlaylist',
      atualizeAudioTocando: 'playlist/atualizeAudioTocando',
      atualizeMusicaTocando: 'playlist/atualizeMusicaTocando',
    }),
    ...mapGetters({
      obtenhaProximoAudio: 'playlist/obtenhaProximoAudio',
      obtenhaProximaMusica: 'playlist/obtenhaProximaMusica',
      obtenhaAudioAtual: 'playlist/obtenhaAudioAtual',
      obtenhaMusicaAtual: 'playlist/obtenhaMusicaAtual',
    }),
    ...mapMutations({
      avanceAudio: 'playlist/avanceParaOProximoAudio',
      avanceMusica: 'playlist/avanceParaAProximaMusica',
    }),
    iniciarExecucao() {
      timerManager.addTimer(`INIT_PLAYLIST_MUSICAS: ${this.playlist.nome}`, () => this.executarMusica(), this.playlist.intervaloMusicaInicial, 'seconds');
      timerManager.addTimer(`INIT_PLAYLIST_AUDIOS: ${this.playlist.nome}`, () => this.executarAudio(), this.playlist.intervaloMusicaInicial + this.playlist.intervaloAudioInicial, 'seconds');
      this.observeSePlaylistEstaTocando();
      this.observeSeAudiosForamAdicionados();
      this.observeSeMusicasForamAdicionadas();
    },
    proximoAudio() {
      const audio = this.obtenhaProximoAudio();
      this.avanceAudio();
      return audio;
    },
    proximaMusica() {
      const musica = this.obtenhaProximaMusica();
      this.avanceMusica();
      return musica;
    },
    executarAudio() {
      if (this.tocando) {
        const audio = this.proximoAudio();
        this.audio = audio.local;
        this.fadOutMusica();
        this.$refs.playerAudio.load();
        this.$refs.playerAudio.play().then(() => {
          this.$refs.playerAudio.playbackRate = 2;
          Logger.classe('App')
            .metodo('executarAudio')
            .mensagem(`Audio Iniciado: ${audio.nome}`)
            .info();

          this.$refs.playerAudio.onended = () => {
            Logger.classe('App')
              .metodo('executarAudio')
              .mensagem(`Audio finalizado: ${audio.nome}`)
              .info();

            this.fadInMusica();
            timerManager.addTimer(`TIMER_AUDIO: ${audio.nome}`,
              () => this.executarAudio(), audio.intervalo, 'seconds');
          };
        });
      }
    },
    executarMusica() {
      if (this.tocando) {
        const musica = this.proximaMusica();
        this.musica = musica.local;
        this.$refs.playerMusica.load();
        this.$refs.playerMusica.play().then(() => {
          this.$refs.playerMusica.playbackRate = 2;
          this.atualizeMusicaTocando(this.obtenhaMusicaAtual());
          Logger.classe('App')
            .metodo('executarMusica')
            .mensagem(`Musica Iniciada: ${musica.nome}`)
            .info();

          this.$refs.playerMusica.onended = () => {
            Logger.classe('App')
              .metodo('executarMusica')
              .mensagem(`Musica Finalizada: ${musica.nome}`)
              .info();
            timerManager.addTimer(`TIMER_MUSICA: ${musica.nome}`, () => this.executarMusica(), musica.intervalo, 'seconds');
          };
        });
      }
    },
    fadOutMusica() {
      const refs = this.$refs;
      const cond = function () { return refs.playerMusica.volume > 0.2; };
      const func = function () { refs.playerMusica.volume -= 0.005; };

      timerManager.addTimerLoop('TIMER_FADE_IN_MUSICA', func, cond, 5);
    },
    fadInMusica() {
      const refs = this.$refs;
      const cond = function () { return refs.playerMusica.volume < 1; };
      const func = function () { refs.playerMusica.volume += 0.005; };

      timerManager.addTimerLoop('TIMER_FADE_IN_MUSICA', func, cond, 5);
    },
    observeSePlaylistEstaTocando() {
      database.observeSePlaylistEstaTocando('3282703').then((playlist) => {
        this.$store.commit('playlist/adicioneInfoPlaylist', playlist);
        this.observeSePlaylistEstaTocando();
      });
    },
    observeSeAudiosForamAdicionados() {
      database.observeSeAudiosForamAdicionados('3282703').then((audios) => {
        this.$store.commit('playlist/adicioneAudiosAPlaylist', audios);
        this.observeSeAudiosForamAdicionados();
      });
    },
    observeSeMusicasForamAdicionadas() {
      database.observeSeMusicasForamAdicionadas('3282703').then((musicas) => {
        this.$store.commit('playlist/adicioneMusicasAPlaylist', musicas);
        this.observeSeMusicasForamAdicionadas();
      });
    },
    buscarCodigoPlaylist() {
      AuthService.auth('3282703');
      this.$vs.loading();
      this.carreguePlaylist('3282703').then(() => {
        this.$vs.loading.close();
        this.iniciarExecucao();
        Logger.classe('App')
          .metodo('buscarCodigoPlaylist')
          .mensagem('Playlist carregada com sucesso')
          .info();
      })
        .catch((e) => {
          Logger.classe('App')
            .metodo('buscarCodigoPlaylist')
            .mensagem(e.message)
            .info();
        });
    },
  },
};
</script>
