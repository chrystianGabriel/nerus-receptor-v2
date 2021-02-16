import Exception from './exception';

export default class ErrorException extends Exception {
  constructor(level, metodo, params, mensagem) {
    super(metodo, params, mensagem);
    this.level = level;
  }
}
