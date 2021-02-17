/* eslint-disable */ 
import TimerManager from './TimerManager';
import Logger from '../services/loggerService';
import dayJS from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';



class PlaylistManager {
  constructor(){
    this.playlist = {};
  }

  Playlist(playlist) {
    this.playlist = playlist;

    TimerManager.addTimer('PLAYLIST_INIT', () => console.log('teste'), 3, 'minutes');
  }
}

export default new PlaylistManager();