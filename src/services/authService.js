class AuthService {
  constructor() {
    this.playlistCode = '3282703';
  }

  auth(codigo) {
    this.playlistCode = codigo;
  }

  getUserToken() {
    if (this.playlistCode === '') throw new Error('Não foi cadastrado o codigo da playlist');

    return btoa(`${this.playlistCode}:${this.playlistCode}`);
  }
}

export default new AuthService();
