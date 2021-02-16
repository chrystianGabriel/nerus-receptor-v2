import ErrorException from '../Utils/errorException';

class AuthService {
  constructor() {
    this.playlistCode = '';
  }

  getUserToken() {
    if (this.playlistCode === '') throw new ErrorException(5, this.getUserToken.toString(), [], 'Não foi cadastrado o codigo da playlist');

    return {
      username: this.playlistCode,
      password: this.playlistCode,
    };
  }
}

export default new AuthService();
