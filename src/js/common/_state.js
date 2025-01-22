/**
 * state.js
 */
;(() => {
  const LOCAL_KEY = 'GS_KEY'

  window.jsState = {
    ambasadorList: ['ovechkin', 'medvedeva', 'korney', 'ed', 'akinfeev'],
    pin: null,
    ambasador: null,

    // first
    firstQuizQuestion: 1,
    firstQuizRight: 0,
    firstQuizStatus: null, // low / high / zero
    firstQuizScore: 0,

    // second
    secondGameRight: 0,
    secondGameStatus: null, // low / high / zero
    secondGameScore: 0,

    // third
    thirdGameRight: 0,
    thirdGameStatus: null, // cool / live / livezero / time / timezero
    thirdGameScore: 0,

    // fourth
    fourthGameQuestion: 1,
    fourthGameRight: 0,
    fourthGameStatus: null, // low / high / zero
    fourthGameScore: 0,

    resetState(pin) {
      this.pin = pin

      this.firstQuizQuestion = 1
      this.firstQuizRight = 0
      this.firstQuizStatus = null
      this.firstQuizScore = 0

      this.fourthGameQuestion = 1
      this.fourthGameRight = 0
      this.fourthGameStatus = null
      this.fourthGameScore = 0
    },

    setAmbasador(ambasador) {
      const existAmbasador = this.ambasadorList.some((it) => it === ambasador)

      this.ambasador = existAmbasador ? ambasador : 'ovechkin'
    },

    setFirstQuizScore(rightAnswer) {
      this.firstQuizRight = rightAnswer
      this.firstQuizScore = rightAnswer * 100

      switch (rightAnswer) {
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
    },

    setSecondGameScore(score) {
      this.secondGameScore = score

      switch (true) {
        case score === 3000:
          this.secondGameStatus = 'high'
          break
        case score === 0:
          this.secondGameStatus = 'zero'
          break
        default:
          this.secondGameStatus = 'low'
          break
      }
    },

    setThirdGameScore(score, status) {
      this.thirdGameScore = score
      window.jsState.thirdGameStatus = status
    },

    setFourthGameScore(score) {
      this.fourthGameScore = score

      switch (this.fourthGameRight) {
        case 12:
          this.fourthGameStatus = 'high'
          break
        case 0:
          this.fourthGameStatus = 'zero'
          break
        default:
          this.fourthGameStatus = 'low'
          break
      }
    },

    setLocal() {
      const pin = window.userInfo.getClientID()
      if (!pin) return

      const data = {
        pin,

        firstQuizQuestion: window.jsState.firstQuizQuestion,
        firstQuizRight: window.jsState.firstQuizRight,
        firstQuizStatus: window.jsState.firstQuizStatus,

        fourthGameQuestion: window.jsState.fourthGameQuestion,
        fourthGameRight: window.jsState.fourthGameRight,
        fourthGameStatus: window.jsState.fourthGameStatus
      }

      localStorage.setItem(LOCAL_KEY, JSON.stringify(data))
    },

    getLocal() {
      const value = localStorage.getItem(LOCAL_KEY)
      if (!value) return

      const data = JSON.parse(value)

      window.jsState.pin = data.pin
      window.jsState.firstQuizQuestion = data.firstQuizQuestion || 1
      window.jsState.firstQuizRight = data.firstQuizRight || 0
      window.jsState.firstQuizStatus = data.firstQuizStatus || null

      window.jsState.fourthGameQuestion = data.fourthGameQuestion || 1
      window.jsState.fourthGameRight = data.fourthGameRight || 0
      window.jsState.fourthGameStatus = data.fourthGameStatus || null
    }
  }
})()
