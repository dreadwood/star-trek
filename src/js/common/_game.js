/**
 * game.js
 */
;(() => {
  const TIMER_SECOND = 10

  window.jsGame = {
    asw: {
      ovechkin: [1, 2, 2, 3, 1],
      medvedeva: [0, 1, 2, 0, 1],
      korney: [1, 2, 1, 1, 2],
      ed: [1, 1, 1, 3, 2],
      akinfeev: [2, 2, 1, 1, 2]
    },

    isGame: false, // открыт экран квиза
    isAnswer: false, // идет ответ на вопрос

    isGameOver: false,

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

    // other
    confirmDialog: null,
    soonDialog: null,

    timer: TIMER_SECOND,
    timerId: null,

    sendResultUrl: 'https://xcomfeed.com/fonbet/fasw2025/answer',

    // secondGameUrl: 'https://fon.bet/promo/fasw2025_g2/',
    // fifthGameUrl: 'https://fon.bet/promo/fasw2025_g5/',
    secondGameUrl: 'https://2lands.ru/ru/fasw2025_g2/',
    fifthGameUrl: 'https://2lands.ru/ru/fasw2025_g5/',

    init() {
      this._initConfirm()
      this._initSoon()
      this._initFirst()
      this._initSecond()
      window.jsThirdGame.init()
      window.jsFourthGame.init()
      window.jsFifthGame.init()
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

    async _initSoon() {
      this.soonDialog = document.querySelector('.js-modal-soon')
      const closeBtnList = this.soonDialog.querySelectorAll(
        '.js-modal-soon-close'
      )

      closeBtnList.forEach((it) =>
        it.addEventListener('click', () => {
          this._closeSoonDialog()
        })
      )

      this.soonDialog.addEventListener('click', (evt) => {
        if (evt.target !== this.soonDialog) return
        this._closeSoonDialog()
      })
    },

    async _initFirst() {
      const openBtnList = document.querySelectorAll('.js-game-first-open')
      const startBtn = document.querySelector('.js-game-first-start')
      const closeBtnList = document.querySelectorAll('.js-game-first-close')

      this.firstDialog = document.querySelector('.js-game-first-dialog')
      this.firstMsg = this.firstDialog.querySelector('.js-game-first-msg')
      this.firstQuiz = this.firstDialog.querySelector('.js-game-first-quiz')
      this.firstEnd = this.firstDialog.querySelector('.js-game-first-end')
      this.firstAnswerList = this.firstDialog.querySelectorAll(
        '.js-game-quiz-answer'
      )
      this.firstBtnNextList =
        this.firstDialog.querySelectorAll('.js-game-quiz-next')

      openBtnList.forEach((btn) => {
        btn.addEventListener('click', () => this._openFirstDialog())
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
      const gameId = 2

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
        btn.addEventListener('click', () => this._openSecondDialog())
      })

      startBtn.addEventListener('click', () => {
        this._secondStartBtnHandler()
      })

      closeBtnList.forEach((it) =>
        it.addEventListener('click', () => this._closeSecondDialog())
      )

      this.secondDialog.addEventListener('click', (evt) => {
        if (evt.target !== this.secondDialog) return
        this._closeSecondDialog()
      })

      window.addEventListener('message', async (event) => {
        if (!(event.data && event.data.type === 'log')) {
          return
        }

        if (event.data.idGame !== gameId) return

        const msg = event.data.args[0]

        if (!(typeof msg === 'object' && msg !== null)) {
          return
        }

        if (msg.type === 'exit') {
          this._closeSecondDialog()
        }

        if (msg.type === 'score') {
          const result = await this._sendResult(gameId, msg.value)
          const gameDataList = await window.jsAuth._getGameData()

          if (result) {
            window.jsState.setSecondGameScore(msg.value)
          }

          if (gameDataList) {
            window.jsPage.renderGameCard(gameDataList)
            this.checkGameOver(gameDataList)
          }

          await window.jsAuth.updateScore()

          window.jsState.setSecondGameScore(msg.value)

          this._showSecondEnd()
        }
      })
    },

    async _secondGameOpenHandler() {
      const pin = window.userInfo.getClientID()
      if (!pin) {
        window.jsAuth._openReg()
        return
      }

      this._openSecondDialog()

      if (window.jsState.secondGameStatus) {
        return
      }

      this._showSecondMsg()
    },

    _secondStartBtnHandler() {
      this.secondIframe.src = this.secondGameUrl
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
      const length = window.jsFirstQuiz[window.jsState.ambasador].length

      if (length < window.jsState.firstQuizQuestion) {
        const gameId = 1
        const result = await this._sendResult(
          gameId,
          window.jsState.firstQuizRight
        )
        const gameDataList = await window.jsAuth._getGameData()

        if (result) {
          window.jsState.setFirstQuizScore(window.jsState.firstQuizRight)
        }

        if (gameDataList) {
          window.jsPage.renderGameCard(gameDataList)
          this.checkGameOver(gameDataList)
        }

        await window.jsAuth.updateScore()

        this._showFirstEnd()
      } else {
        this._updateFirstQuestion()
      }
    },

    _confirmDialogExitBtnHandler() {
      this.isGame = false

      if (this.isAnswer) {
        this.isAnswer = false
      }

      window.jsState.setLocal()
      this._stopTimer()
      window.jsFourthGame.stopTimer()

      this.secondIframe.src = ''
      window.jsFifthGame.iframe.src = ''

      this._closeConfirmDialog()
      this._closeFirstDialog()
      this._closeSecondDialog()
      window.jsThirdGame.closeDialog()
      window.jsFourthGame.closeDialog()
      window.jsFifthGame.closeDialog()
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
      window.jsState.setLocal()
      this.isGame = false

      const title = document.querySelector('.js-game-first-title')
      const text = document.querySelector('.js-game-first-text')
      const answer = document.querySelector('.js-game-first-answer')
      const score = document.querySelector('.js-game-first-score')

      title.textContent = title.dataset[window.jsState.firstQuizStatus]
      text.innerHTML = text.dataset[window.jsState.firstQuizStatus]
      answer.textContent = `${window.jsState.firstQuizRight}/5`
      score.textContent = window.jsState.firstQuizScore

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
      this.isGame = false

      const title = document.querySelector('.js-game-second-title')
      const text = document.querySelector('.js-game-second-text')
      const score = document.querySelector('.js-game-second-score')

      title.textContent = title.dataset[window.jsState.secondGameStatus]
      text.innerHTML = text.dataset[window.jsState.secondGameStatus]
      score.textContent = window.jsState.secondGameScore

      window.jsUtils.hideEl(this.secondMsg)
      window.jsUtils.hideEl(this.secondContent)
      window.jsUtils.showEl(this.secondEnd)
    },

    _updateFirstQuestion() {
      const index = window.jsState.firstQuizQuestion - 1
      const questionData = window.jsFirstQuiz[window.jsState.ambasador][index]

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

      const count = window.jsFirstQuiz[window.jsState.ambasador].length
      questionStep.textContent = `Вопрос ${window.jsState.firstQuizQuestion}/${count}`

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

      const indexQuestion = window.jsState.firstQuizQuestion - 1
      const asw = this.asw[window.jsState.ambasador][indexQuestion]

      this.firstAnswerList.forEach((it, i) => {
        if (i === asw) {
          it.classList.add('correct')
        }
      })

      window.jsState.firstQuizQuestion += 1

      this.firstBtnNextList.forEach((it) => {
        it.removeAttribute('disabled')
      })

      this._stopTimer()
      window.jsState.setLocal()
      this.isAnswer = false
    },

    _checkAnswer(btn, i) {
      btn.classList.add('actv')

      this.firstAnswerList.forEach((it) =>
        it.setAttribute('disabled', 'disabled')
      )

      const indexQuestion = window.jsState.firstQuizQuestion - 1
      const asw = this.asw[window.jsState.ambasador][indexQuestion]

      if (i === asw) {
        btn.classList.add('correct')
        window.jsState.firstQuizRight += 1
      } else {
        btn.classList.add('error')
        this.firstAnswerList.forEach((it, i) => {
          if (i === asw) {
            it.classList.add('correct')
          }
        })
      }

      window.jsState.firstQuizQuestion += 1

      this.firstBtnNextList.forEach((it) => {
        it.removeAttribute('disabled')
      })

      this._stopTimer()
      window.jsState.setLocal()
      this.isAnswer = false
    },

    checkGameOver(gameDataList) {
      this.isGameOver = gameDataList.every((it) => it.user.has_answer)
    },

    changeVisibleScreen(screens, screen) {
      for (const it in screens) {
        if (screens[it] === screen) window.jsUtils.showEl(screens[it])
        else window.jsUtils.hideEl(screens[it])
      }
    },

    async _sendResult(gameId, answer, obj = {}) {
      const pin = window.userInfo.getClientID()
      if (!pin || !gameId) {
        console.error('Не получилось отправить результат')
        return
      }

      try {
        const req = {
          pin,
          game_id: gameId,
          answer,
          ...obj
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

    async _openFirstDialog() {
      const pin = window.userInfo.getClientID()
      if (!pin) {
        window.jsAuth._openReg()
        return
      }

      if (!window.jsState.ambasador) {
        window.jsAuth.isSetOpenBeforeGame = true
        window.jsAuth.openSet(true)
      }

      const length = window.jsState.ambasador
        ? window.jsFirstQuiz[window.jsState.ambasador].length
        : 0

      if (length > 0 && length < window.jsState.firstQuizQuestion) {
        const gameId = 1
        const result = await this._sendResult(
          gameId,
          window.jsState.firstQuizRight
        )
        const gameDataList = await window.jsAuth._getGameData()

        if (result) {
          window.jsState.setFirstQuizScore(window.jsState.firstQuizRight)
        }

        if (gameDataList) {
          window.jsPage.renderGameCard(gameDataList)
          this.checkGameOver(gameDataList)
        }

        await window.jsAuth.updateScore()

        this._showFirstEnd()
        document.documentElement.classList.add('scroll-lock')
        this.firstDialog.classList.add('show')
        return
      }

      this._showFirstMsg()
      document.documentElement.classList.add('scroll-lock')
      this.firstDialog.classList.add('show')
    },

    _closeFirstDialog() {
      if (this.isGame) {
        this._openConfirmDialog()
        return
      }

      this.firstDialog.classList.remove('show')
      document.documentElement.classList.remove('scroll-lock')

      if (this.isGameOver) {
        this._openSoonDialog()
        return
      }
    },

    _openSecondDialog() {
      const pin = window.userInfo.getClientID()
      if (!pin) {
        window.jsAuth._openReg()
        return
      }

      if (!window.jsState.ambasador) {
        window.jsAuth.isSetOpenBeforeGame = true
        window.jsAuth.openSet(true)
      }

      this._showSecondMsg()

      document.documentElement.classList.add('scroll-lock')
      this.secondDialog.classList.add('show')
    },

    _closeSecondDialog() {
      if (this.isGame) {
        this._openConfirmDialog()
        return
      }

      this.secondDialog.classList.remove('show')
      document.documentElement.classList.remove('scroll-lock')

      if (this.isGameOver) {
        this._openSoonDialog()
        return
      }
    },

    _openConfirmDialog() {
      console.log('test')
      this.confirmDialog.classList.add('show')
    },

    _closeConfirmDialog() {
      this.confirmDialog.classList.remove('show')
    },

    _openSoonDialog() {
      this.soonDialog.classList.add('show')
      document.documentElement.classList.add('scroll-lock')
    },

    _closeSoonDialog() {
      this.isGameOver = false
      this.soonDialog.classList.remove('show')
      document.documentElement.classList.remove('scroll-lock')
    }
  }
})()
