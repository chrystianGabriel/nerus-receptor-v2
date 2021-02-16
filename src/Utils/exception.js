export default class Exception {
  constructor(metodo, params, mensagem) {
    this.metodo = metodo;
    this.params = params;
    this.message = mensagem;
  }
}
