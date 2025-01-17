/**
 * state.js
 */
;(() => {
  window.jsState = {
    ambasadorList: ['ovechkin', 'medvedeva', 'korney', 'ed', 'akinfeev'],

    pin: null,

    ambasador: 'ovechkin',
    // first
    firstQuizQuestion: 1,
    firstQuizRight: 0,
    firstQuizStatus: null, // low / high / zero
    firstQuizScore: 0,

    // second
    secondGameRight: 0,
    secondGameStatus: null, // low / high / zero
    secondGameScore: 0,

    resetState(pin) {
      this.pin = pin

      this.firstQuizQuestion = 1
      this.firstQuizRight = 0
      this.firstQuizStatus = null
      this.firstQuizScore = 0

      this.secondGameRight = 0
      this.secondGameStatus = null
      this.secondGameScore = 0
    },

    setAmbasador(ambasador) {
      const existAmbasador = this.ambasadorList.some((it) => it === ambasador)

      this.ambasador = existAmbasador ? ambasador : 'ovechkin'
    },

    setFirstQuizScore(score) {
      this.firstQuizScore = score
    },

    setSecondGameScore(score) {
      this.secondGameScore = score

      switch (true) {
        case this.secondGameScore === 3000:
          this.secondGameStatus = 'high'
          break
        case this.secondGameScore === 0:
          this.secondGameStatus = 'zero'
          break
        default:
          this.secondGameStatus = 'low'
          break
      }
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

    // updateSecondGameStatus() {
    //   switch (true) {
    //     case this.secondGameScore === 3000:
    //       this.secondGameStatus = 'high'
    //       break
    //     case this.secondGameScore === 0:
    //       this.secondGameStatus = 'zero'
    //       break
    //     default:
    //       this.secondGameStatus = 'low'
    //       break
    //   }
    // }
  }
})()
