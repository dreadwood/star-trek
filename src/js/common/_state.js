/**
 * state.js
 */
;(() => {
  window.stateJs = {
    ambasadorList: ['ovechkin', 'medvedeva', 'korney', 'ed', 'akinfeev'],

    pin: null,

    ambasador: 'ovechkin',
    // first
    firstQuizQuestion: 1,
    firstQuizRight: 0,
    firstQuizStatus: null, // low / high / zero
    firstQuizScore: 0,

    // second
    secondQuizRight: 0,
    secondQuizStatus: null, // low / high / zero
    secondQuizScore: 0,

    resetState(pin) {
      this.pin = pin

      this.firstQuizQuestion = 1
      this.firstQuizRight = 0
      this.firstQuizStatus = null
      this.firstQuizScore = 0

      this.secondQuizRight = 0
      this.secondQuizStatus = null
      this.secondQuizScore = 0
    },

    setAmbasador(ambasador) {
      const existAmbasador = this.ambasadorList.some((it) => it === ambasador)

      this.ambasador = existAmbasador ? ambasador : 'ovechkin'
    },

    setFirstQuizScore(score) {
      this.firstQuizScore = score
    },

    updateFirstQuizStatus() {
      switch (this.firstQuizRight) {
        case 5:
          this.firstQuizStatus = 'high'
          break
        case 0:
          this.firstQuizStatus = 'zero'
          break
        default:
          this.firstQuizStatus = 'low'
          break
      }
    }
  }
})()
