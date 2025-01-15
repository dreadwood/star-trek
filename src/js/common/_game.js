/**
 * game.js
 */
;(() => {
  const TIMER_SECOND = 30
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

    firstDialog: null,
    firstMsg: null,
    firstQuiz: null,
    firstEnd: null,
    firstAnswerList: [],
    firstNextList: [],

    dialogClose: null,

    timer: TIMER_SECOND,
    timerId: null,

    sendResultUrl: 'https://xcomfeed.com/fonbet/fasw2025/answer',

    init() {
      this._initFirst()
    },

    async _initFirst() {
      const startOpenList = document.querySelectorAll('.js-game-first-open')
      const startBtn = document.querySelector('.js-game-first-start')
      const firstDialogCloseList = document.querySelectorAll(
        '.js-game-first-close'
      )

      this.firstDialog = document.querySelector('.js-game-first-dialog')
      this.firstMsg = document.querySelector('.js-game-first-msg')
      this.firstQuiz = document.querySelector('.js-game-first-quiz')
      this.firstEnd = document.querySelector('.js-game-first-end')
      this.firstAnswerList = document.querySelectorAll('.js-game-quiz-answer')
      this.firstNextList = document.querySelectorAll('.js-game-quiz-next')

      this.dialogClose = document.querySelector('.js-modal-close')
      const dialogCloseNext = document.querySelector('.js-modal-close-next')
      const dialogCloseExit = document.querySelector('.js-modal-close-exit')

      startOpenList.forEach((btn) => {
        btn.addEventListener('click', () => {
          this._firstQuizOpenHandler()
        })
      })

      startBtn.addEventListener('click', () => {
        this._firstQuizStartHandler()
      })

      firstDialogCloseList.forEach((it) =>
        it.addEventListener('click', () => {
          this._closeDialog()
        })
      )

      this.firstDialog.addEventListener('click', (evt) => {
        if (evt.target !== this.firstDialog) return
        this._closeDialog()
      })

      this.firstAnswerList.forEach((it, i) => {
        it.addEventListener('click', () => {
          this._checkAnswer(it, i)
        })
      })

      this.firstNextList.forEach((it) => {
        it.addEventListener('click', () => {
          this._firstQuizNextHandler()
        })
      })

      dialogCloseNext.addEventListener('click', () => {
        this._closeDialogClose()
      })

      dialogCloseExit.addEventListener('click', () => {
        this._dialogCloseExitHandler()
      })
    },

    async _firstQuizOpenHandler() {
      const pin = window.userInfo.getClientID()
      if (!pin) {
        window.jsAuth._openReg()
        return
      }

      this._openDialog()

      if (window.stateJs.firstQuizStatus) {
        this._showFirstEnd()
        return
      }

      const length = window.quizJs[window.stateJs.ambasador].length

      if (length < window.stateJs.firstQuizQuestion) {
        // network
        // await this._sendResult()
        window.stateJs.firstQuizStatus =
          length === window.stateJs.firstQuizRight ? 'high' : 'low'
        this._showFirstEnd()
        return
      }

      this._showFirstMsg()
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
        // await this._sendResult()
        window.stateJs.firstQuizStatus =
          length === window.stateJs.firstQuizRight ? 'high' : 'low'
        this._showFirstEnd()
      } else {
        this._updateFirstQuestion()
      }
    },

    _dialogCloseExitHandler() {
      this.isGame = false

      if (this.isAnswer) {
        window.stateJs.firstQuizQuestion += 1
        this.isAnswer = false
      }

      this._setLocal()
      this._stopTimer()
      this._closeDialogClose()
      this._closeDialog()
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
      title.textContent = title.dataset[window.stateJs.firstQuizStatus]

      window.jsUtils.hideEl(this.firstMsg)
      window.jsUtils.hideEl(this.firstQuiz)
      window.jsUtils.showEl(this.firstEnd)
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

      this.firstNextList.forEach((it) => {
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

      this.firstNextList.forEach((it) => {
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

      this.firstNextList.forEach((it) => {
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

    async _sendResult() {
      const pin = window.userInfo.getClientID()
      if (!pin) {
        console.error('Не получилось отправить результат')
        return
      }

      try {
        const req = {
          pin,
          game_id: 1,
          answer: window.stateJs.firstQuizRight
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

        return !res.error
      } catch (err) {
        console.error(err)
        // добавить обработку ошибок
        return false
      }
    },

    _openDialog() {
      document.documentElement.classList.add('scroll-lock')
      this.firstDialog.classList.add('show')
    },

    _closeDialog() {
      if (this.isGame) {
        this._openDialogClose()
        return
      }

      document.documentElement.classList.remove('scroll-lock')
      this.firstDialog.classList.remove('show')
    },

    _openDialogClose() {
      this.dialogClose.classList.add('show')
    },

    _closeDialogClose() {
      this.dialogClose.classList.remove('show')
    }
  }
})()
