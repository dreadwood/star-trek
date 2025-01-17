/**
 * game.js
 */
;(() => {
  const TIMER_SECOND = 10
  const LOCAL_KEY = 'GS_KEY'

  window.jsGame = {
    TIME_SECOND: TIMER_SECOND,

    asw: {
      ovechkin: [1, 2, 2, 3, 1],
      medvedeva: [0, 1, 2, 0, 1],
      korney: [1, 2, 1, 1, 2],
      ed: [1, 1, 1, 3, 2],
      akinfeev: [2, 2, 1, 1, 2]
    },

    isGame: false, // открыт экран квиза
    isAnswer: false, // идет ответ на вопрос

    // first
    firstDialog: null,
    firstMsg: null,
    firstQuiz: null,
    firstEnd: null,
    firstAnswerList: [],
    firstBtnNextList: [], // клавиша следующего хода

    // second
    secondDialog: null,
    secondMsg: null,
    secondContent: null,
    secondEnd: null,
    secondIframe: null,

    confirmDialog: null,

    timer: TIMER_SECOND,
    timerId: null,

    sendResultUrl: 'https://xcomfeed.com/fonbet/fasw2025/answer',

    init() {
      this._initConfirm()
      this._initFirst()
      this._initSecond()
    },

    async _initConfirm() {
      this.confirmDialog = document.querySelector('.js-modal-close')
      const nextBtn = this.confirmDialog.querySelector('.js-modal-close-next')
      const exitBtn = this.confirmDialog.querySelector('.js-modal-close-exit')

      nextBtn.addEventListener('click', () => {
        this._closeConfirmDialog()
      })

      exitBtn.addEventListener('click', () => {
        this._confirmDialogExitBtnHandler()
      })
    },

    async _initFirst() {
      const openBtnList = document.querySelectorAll('.js-game-first-open')
      const startBtn = document.querySelector('.js-game-first-start')
      const closeBtnList = document.querySelectorAll('.js-game-first-close')

      this.firstDialog = document.querySelector('.js-game-first-dialog')
      this.firstMsg = document.querySelector('.js-game-first-msg')
      this.firstQuiz = document.querySelector('.js-game-first-quiz')
      this.firstEnd = document.querySelector('.js-game-first-end')
      this.firstAnswerList = document.querySelectorAll('.js-game-quiz-answer')
      this.firstBtnNextList = document.querySelectorAll('.js-game-quiz-next')

      openBtnList.forEach((btn) => {
        btn.addEventListener('click', () => {
          this._firstQuizOpenHandler()
        })
      })

      startBtn.addEventListener('click', () => {
        this._firstQuizStartHandler()
      })

      closeBtnList.forEach((it) =>
        it.addEventListener('click', () => {
          this._closeFirstDialog()
        })
      )

      this.firstDialog.addEventListener('click', (evt) => {
        if (evt.target !== this.firstDialog) return
        this._closeFirstDialog()
      })

      this.firstAnswerList.forEach((it, i) => {
        it.addEventListener('click', () => {
          this._checkAnswer(it, i)
        })
      })

      this.firstBtnNextList.forEach((it) => {
        it.addEventListener('click', () => {
          this._firstQuizNextHandler()
        })
      })
    },

    async _initSecond() {
      const openBtnList = document.querySelectorAll('.js-game-second-open')
      const startBtn = document.querySelector('.js-game-second-start')
      const closeBtnList = document.querySelectorAll('.js-game-second-close')

      this.secondDialog = document.querySelector('.js-game-second-dialog')
      this.secondMsg = document.querySelector('.js-game-second-msg')
      this.secondContent = document.querySelector('.js-game-second-content')
      this.secondEnd = document.querySelector('.js-game-second-end')
      this.secondIframe = this.secondDialog.querySelector(
        '.js-game-second-iframe'
      )

      openBtnList.forEach((btn) => {
        btn.addEventListener('click', () => {
          this._secondGameOpenHandler()
        })
      })

      startBtn.addEventListener('click', () => {
        // начало игры
        this._secondStartBtnHandler()
      })

      closeBtnList.forEach((it) =>
        it.addEventListener('click', () => {
          this._closeSecondDialog()
        })
      )

      this.secondDialog.addEventListener('click', (evt) => {
        if (evt.target !== this.secondDialog) return
        this._closeSecondDialog()
      })

      window.addEventListener('message', async (event) => {
        if (!(event.data && event.data.type === 'log')) {
          return
        }

        const msg = event.data.args[0]

        if (!(typeof msg === 'object' && msg !== null)) {
          return
        }

        console.log(msg)

        // score, find, exit

        if (msg.type === 'exit') {
          // TODO: 2025-01-17 / Выход
          this._closeSecondDialog()
        }

        if (msg.type === 'score') {
          // TODO: 2025-01-17 / Завершение игры
          console.log('Набрано очков ', msg.value)

          const result = await this._sendResult(2, msg.value)
          const gameData = await window.jsAuth._getGameData()

          if (result) {
            window.stateJs.setSecondGameScore(result.total_scores)
          }

          if (gameData) {
            window.jsPage.renderGameCard(gameData)
          }

          await window.jsAuth.updateScore()

          window.stateJs.setSecondGameScore(msg.value)

          this._showSecondEnd()
        }
      })
    },

    async _firstQuizOpenHandler() {
      const pin = window.userInfo.getClientID()
      if (!pin) {
        window.jsAuth._openReg()
        return
      }

      this._openFirstDialog()

      if (window.stateJs.firstQuizStatus) {
        this._showFirstEnd()
        return
      }

      const length = window.quizJs[window.stateJs.ambasador].length

      if (length < window.stateJs.firstQuizQuestion) {
        // network
        const result = await this._sendResult(1, window.stateJs.firstQuizRight)
        console.log(result)
        if (result) {
          window.stateJs.setFirstQuizScore(result.total_scores)
        }
        await window.jsAuth.updateScore()

        window.stateJs.updateFirstQuizStatus()
        this._showFirstEnd()
        return
      }

      this._showFirstMsg()
    },

    // TODO: 2025-01-17 /
    async _secondGameOpenHandler() {
      const pin = window.userInfo.getClientID()
      if (!pin) {
        window.jsAuth._openReg()
        return
      }

      this._openSecondDialog()

      if (window.stateJs.secondGameStatus) {
        // this._showFirstEnd()
        console.log('result second open')
        return
      }

      // TODO: 2025-01-17 /

      this._showSecondMsg()
    },

    _secondStartBtnHandler() {
      this.secondIframe.src = 'https://2lands.ru/ru/fasw2025_g2/'
      // this.secondIframe.src = './game2'
      this.isGame = true

      this._showSecondContent()
    },

    _firstQuizStartHandler() {
      this._updateFirstQuestion()
      this._showFirstQuiz()
    },

    _firstQuizQuestionHandler() {
      this._showFirstQuiz()
    },

    async _firstQuizNextHandler() {
      const length = window.quizJs[window.stateJs.ambasador].length

      if (length < window.stateJs.firstQuizQuestion) {
        // network
        // TODO: 2025-01-16 /
        const result = await this._sendResult(1, window.stateJs.firstQuizRight)
        const gameData = await window.jsAuth._getGameData()

        if (result) {
          window.stateJs.setFirstQuizScore(result.total_scores)
        }

        if (gameData) {
          window.jsPage.renderGameCard(gameData)
        }

        await window.jsAuth.updateScore()

        window.stateJs.updateFirstQuizStatus()
        this._showFirstEnd()
      } else {
        this._updateFirstQuestion()
      }
    },

    _confirmDialogExitBtnHandler() {
      this.isGame = false

      if (this.isAnswer) {
        // window.stateJs.firstQuizQuestion += 1
        this.isAnswer = false
      }

      this._setLocal()
      this._stopTimer()

      // TODO: 2025-01-17 /
      this.secondIframe.src = ''

      this._closeConfirmDialog()
      this._closeFirstDialog()
      this._closeSecondDialog()
    },

    _showFirstMsg() {
      this.isGame = false

      window.jsUtils.showEl(this.firstMsg)
      window.jsUtils.hideEl(this.firstQuiz)
      window.jsUtils.hideEl(this.firstEnd)
    },

    _showFirstQuiz() {
      this.isGame = true

      window.jsUtils.hideEl(this.firstMsg)
      window.jsUtils.showEl(this.firstQuiz)
      window.jsUtils.hideEl(this.firstEnd)
    },

    _showFirstEnd() {
      this._setLocal()
      this.isGame = false

      const title = document.querySelector('.js-game-first-title')
      const text = document.querySelector('.js-game-first-text')
      const answer = document.querySelector('.js-game-first-answer')
      const score = document.querySelector('.js-game-first-score')

      title.textContent = title.dataset[window.stateJs.firstQuizStatus]
      text.innerHTML = text.dataset[window.stateJs.firstQuizStatus]
      answer.textContent = `${window.stateJs.firstQuizRight}/5`
      score.textContent = window.stateJs.firstQuizScore

      window.jsUtils.hideEl(this.firstMsg)
      window.jsUtils.hideEl(this.firstQuiz)
      window.jsUtils.showEl(this.firstEnd)
    },

    _showSecondMsg() {
      this.isGame = false

      window.jsUtils.showEl(this.secondMsg)
      window.jsUtils.hideEl(this.secondContent)
      window.jsUtils.hideEl(this.secondEnd)
    },

    _showSecondContent() {
      this.isGame = true

      window.jsUtils.hideEl(this.secondMsg)
      window.jsUtils.showEl(this.secondContent)
      window.jsUtils.hideEl(this.secondEnd)
    },

    _showSecondEnd() {
      // this._setLocal()
      this.isGame = false

      const title = document.querySelector('.js-game-second-title')
      const text = document.querySelector('.js-game-second-text')
      const score = document.querySelector('.js-game-second-score')

      title.textContent = title.dataset[window.stateJs.secondGameStatus]
      text.innerHTML = text.dataset[window.stateJs.secondGameStatus]
      score.textContent = window.stateJs.secondGameScore

      window.jsUtils.hideEl(this.secondMsg)
      window.jsUtils.hideEl(this.secondContent)
      window.jsUtils.showEl(this.secondEnd)
    },

    _updateFirstQuestion() {
      const index = window.stateJs.firstQuizQuestion - 1
      const questionData = window.quizJs[window.stateJs.ambasador][index]

      const questionStep = document.querySelector('.js-game-quiz-step')
      const questionText = document.querySelector('.js-game-quiz-question')
      const answerList = document.querySelectorAll('.js-game-quiz-answer')

      answerList.forEach((it, i) => {
        const text = it.querySelector('.js-game-quiz-answer-text')
        text.innerHTML = questionData.answers[i]

        it.classList.remove('actv')
        it.classList.remove('correct')
        it.classList.remove('error')

        it.removeAttribute('disabled')
      })

      this.firstBtnNextList.forEach((it) => {
        it.setAttribute('disabled', 'disabled')
      })

      questionText.innerHTML = questionData.quesion

      const count = window.quizJs[window.stateJs.ambasador].length
      questionStep.textContent = `Вопрос ${window.stateJs.firstQuizQuestion}/${count}`

      this._setTimer()
      this.isAnswer = true
    },

    _setTimer() {
      const timeEl = document.querySelector('.js-game-quiz-time')

      this._stopTimer()
      this._updateTimer(timeEl)

      this.timerId = setInterval(() => {
        if (this.timer > 0) {
          this.timer -= 1
          this._updateTimer(timeEl)
        } else {
          this._timeOver()
        }
      }, 1000)
    },

    _stopTimer() {
      this.timer = TIMER_SECOND
      if (this.timerId !== null) {
        clearInterval(this.timerId)
      }
    },

    _updateTimer(timeEl) {
      const sec = this.timer >= 10 ? this.timer : `0${this.timer}`
      timeEl.textContent = `00:${sec}`
    },

    _timeOver() {
      this.firstAnswerList.forEach((it) =>
        it.setAttribute('disabled', 'disabled')
      )

      const indexQuestion = window.stateJs.firstQuizQuestion - 1
      const asw = this.asw[window.stateJs.ambasador][indexQuestion]

      this.firstAnswerList.forEach((it, i) => {
        if (i === asw) {
          it.classList.add('correct')
        }
      })

      window.stateJs.firstQuizQuestion += 1

      this.firstBtnNextList.forEach((it) => {
        it.removeAttribute('disabled')
      })

      this._stopTimer()
      this._setLocal()
      this.isAnswer = false
    },

    _checkAnswer(btn, i) {
      btn.classList.add('actv')

      this.firstAnswerList.forEach((it) =>
        it.setAttribute('disabled', 'disabled')
      )

      const indexQuestion = window.stateJs.firstQuizQuestion - 1
      const asw = this.asw[window.stateJs.ambasador][indexQuestion]

      if (i === asw) {
        btn.classList.add('correct')
        window.stateJs.firstQuizRight += 1
      } else {
        btn.classList.add('error')
        this.firstAnswerList.forEach((it, i) => {
          if (i === asw) {
            it.classList.add('correct')
          }
        })
      }

      window.stateJs.firstQuizQuestion += 1

      this.firstBtnNextList.forEach((it) => {
        it.removeAttribute('disabled')
      })

      this._stopTimer()
      this._setLocal()
      this.isAnswer = false
    },

    _setLocal() {
      const pin = window.userInfo.getClientID()

      const data = {
        pin,
        firstQuizQuestion: window.stateJs.firstQuizQuestion,
        firstQuizRight: window.stateJs.firstQuizRight,
        firstQuizStatus: window.stateJs.firstQuizStatus
      }

      localStorage.setItem(LOCAL_KEY, JSON.stringify(data))
    },

    getLocal() {
      const value = localStorage.getItem(LOCAL_KEY)

      if (!value) {
        return
      }
      const data = JSON.parse(value)

      window.stateJs.pin = data.pin
      window.stateJs.firstQuizQuestion = data.firstQuizQuestion
      window.stateJs.firstQuizRight = data.firstQuizRight
      window.stateJs.firstQuizStatus = data.firstQuizStatus
    },

    async _sendResult(gameId, answer) {
      const pin = window.userInfo.getClientID()
      if (!pin || !gameId) {
        console.error('Не получилось отправить результат')
        return
      }

      try {
        const req = {
          pin,
          game_id: gameId,
          answer
        }
        const res = await window.jsUtils.sendData(
          this.sendResultUrl,
          'POST',
          req
        )

        if (res.error) {
          // добавить обработку ошибок
          return false
        }

        return res.data
      } catch (err) {
        console.error(err)
        // добавить обработку ошибок
        return false
      }
    },

    _openFirstDialog() {
      document.documentElement.classList.add('scroll-lock')
      this.firstDialog.classList.add('show')
    },

    _closeFirstDialog() {
      if (this.isGame) {
        this._openConfirmDialog()
        return
      }

      document.documentElement.classList.remove('scroll-lock')
      this.firstDialog.classList.remove('show')
    },

    _openSecondDialog() {
      document.documentElement.classList.add('scroll-lock')
      this.secondDialog.classList.add('show')
    },

    _closeSecondDialog() {
      if (this.isGame) {
        this._openConfirmDialog()
        return
      }

      document.documentElement.classList.remove('scroll-lock')
      this.secondDialog.classList.remove('show')
    },

    _openConfirmDialog() {
      this.confirmDialog.classList.add('show')
    },

    _closeConfirmDialog() {
      this.confirmDialog.classList.remove('show')
    }
  }
})()
