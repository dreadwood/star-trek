/**
 * state.js
 */
;(() => {
  window.stateJs = {
    ambasadorList: ['ovechkin', 'medvedeva', 'korney', 'ed', 'akinfeev'],

    pin: null,

    ambasador: 'ovechkin',
    // quiz
    firstQuizQuestion: 1,
    firstQuizRight: 0,
    firstQuizStatus: null, // low / high
    // firstQuizStatus: 'low'

    resetState(pin) {
      this.pin = pin
      this.firstQuizQuestion = 1
      this.firstQuizRight = 0
      this.firstQuizStatus = null
    },

    setAmbasador(ambasador) {
      const existAmbasador = this.ambasadorList.some((it) => it === ambasador)

      this.ambasador = existAmbasador ? ambasador : 'ovechkin'
    }
  }
})()
