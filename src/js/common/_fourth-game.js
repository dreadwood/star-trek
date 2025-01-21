/**
 * fourth.js
 */
;(() => {
  const TIMER_SECOND = 10
  const POINTS_FOR_ANSWER = 100

  window.jsFourthGame = {
    id: 4,
    asw: [2, 2, 3, 1, 0, 2, 3, 1, 0, 0, 1, 1],

    numQuestions: 0,

    timer: TIMER_SECOND,
    timerId: null,

    dialog: null,
    screens: {
      msg: null,
      content: null,
      end: null
    },

    nextBtnList: [],
    answerList: [],
    step: null,
    question: null,
    time: null,

    init() {
      const openBtnList = document.querySelectorAll('.js-game-fourth-open')
      const startBtn = document.querySelector('.js-game-fourth-start')
      const closeBtnList = document.querySelectorAll('.js-game-fourth-close')

      this.dialog = document.querySelector('.js-game-fourth-dialog')
      this.screens.msg = this.dialog.querySelector('.js-game-msg')
      this.screens.content = this.dialog.querySelector('.js-game-content')
      this.screens.end = this.dialog.querySelector('.js-game-end')

      this.nextBtnList = document.querySelectorAll('.js-game-quiz-next')
      this.answerList = this.dialog.querySelectorAll('.js-game-quiz-answer')
      this.step = this.dialog.querySelector('.js-game-quiz-step')
      this.question = this.dialog.querySelector('.js-game-quiz-question')
      this.time = this.dialog.querySelector('.js-game-quiz-time')

      this.numQuestions = window.jsFourtQuiz.length

      openBtnList.forEach((btn) => {
        btn.addEventListener('click', () => this._openDialog())
      })

      startBtn.addEventListener('click', () => {
        this._startGame()
      })

      closeBtnList.forEach((it) =>
        it.addEventListener('click', () => this.closeDialog())
      )

      this.dialog.addEventListener('click', (evt) => {
        if (evt.target !== this.dialog) return
        this.closeDialog()
      })

      this.answerList.forEach((it, i) =>
        it.addEventListener('click', () => this._checkAnswer(it, i))
      )

      this.nextBtnList.forEach((it) =>
        it.addEventListener('click', () => this._nextBtnHandler())
      )
    },

    _showMsgScreen() {
      window.jsGame.isGame = false

      window.jsGame.changeVisibleScreen(this.screens, this.screens.msg)
    },

    _showContentScreen() {
      window.jsGame.isGame = true

      window.jsGame.changeVisibleScreen(this.screens, this.screens.content)
    },

    _showEndScreen() {
      window.jsGame.isGame = false

      const title = document.querySelector('.js-game-fourth-title')
      const text = document.querySelector('.js-game-fourth-text')
      const answer = document.querySelector('.js-game-fourth-answer')
      const score = document.querySelector('.js-game-fourth-score')

      title.textContent = title.dataset[window.jsState.fourthGameStatus]
      text.innerHTML = text.dataset[window.jsState.fourthGameStatus]
      answer.textContent = `${window.jsState.fourthGameRight}/${this.numQuestions}`
      score.textContent = window.jsState.fourthGameScore

      window.jsGame.changeVisibleScreen(this.screens, this.screens.end)
    },

    _startGame() {
      this._renderQuestion()
      this._showContentScreen()
    },

    _renderQuestion() {
      const index = window.jsState.fourthGameQuestion - 1
      const questionData = window.jsFourtQuiz[index]

      this.answerList.forEach((it, i) => {
        const text = it.querySelector('.js-game-quiz-answer-text')
        text.innerHTML = questionData.answers[i]

        it.classList.remove('actv')
        it.classList.remove('correct')
        it.classList.remove('error')

        it.removeAttribute('disabled')
      })

      this.nextBtnList.forEach((it) => {
        it.setAttribute('disabled', 'disabled')
      })

      this.question.innerHTML = questionData.quesion
      this.step.textContent = `Вопрос ${window.jsState.fourthGameQuestion}/${this.numQuestions}`

      this._setTimer()
      window.jsGame.isAnswer = true
    },

    async _nextBtnHandler() {
      if (this.numQuestions < window.jsState.fourthGameQuestion) {
        const score = window.jsState.fourthGameRight * POINTS_FOR_ANSWER

        const result = await window.jsGame._sendResult(this.id, score)
        const gameDataList = await window.jsAuth._getGameData()
        await window.jsAuth.updateScore()

        if (result) {
          window.jsState.setFourthGameScore(score)
        }

        if (gameDataList) {
          window.jsPage.renderGameCard(gameDataList)
          window.jsGame.setNextGameData(gameDataList)
        }

        this._showEndScreen()
      } else {
        this._renderQuestion()
      }
    },

    _checkAnswer(btn, i) {
      btn.classList.add('actv')

      const asw = this._setAnswer()

      if (i === asw) window.jsState.fourthGameRight += 1
      else btn.classList.add('error')
    },

    _setAnswer() {
      const index = window.jsState.fourthGameQuestion - 1
      const asw = this.asw[index]

      this.answerList.forEach((it, i) => {
        if (i === asw) it.classList.add('correct')
        it.setAttribute('disabled', 'disabled')
      })

      window.jsState.fourthGameQuestion += 1

      this.nextBtnList.forEach((it) => it.removeAttribute('disabled'))

      this.stopTimer()
      window.jsState.setLocal()
      window.jsGame.isAnswer = false

      return asw
    },

    _setTimer() {
      this.stopTimer()
      this._updateTimer()

      this.timerId = setInterval(() => {
        if (this.timer > 0) {
          this.timer -= 1
          this._updateTimer()
        } else {
          this._setAnswer()
        }
      }, 1000)
    },

    _updateTimer() {
      const sec = this.timer >= 10 ? this.timer : `0${this.timer}`
      this.time.textContent = `00:${sec}`
    },

    // TODO: 2025-01-21 / public?
    stopTimer() {
      this.timer = TIMER_SECOND
      if (this.timerId !== null) clearInterval(this.timerId)
    },

    _openDialog() {
      const pin = window.userInfo.getClientID()
      if (!pin) {
        window.jsAuth._openReg()
        return
      }

      this._showMsgScreen()

      document.documentElement.classList.add('scroll-lock')
      this.dialog.classList.add('show')
    },

    closeDialog() {
      if (window.jsGame.isGame) {
        window.jsGame._openConfirmDialog()
        return
      }

      this.dialog.classList.remove('show')
      document.documentElement.classList.remove('scroll-lock')
      this.stopTimer()

      if (window.jsGame.nextGame) {
        window.jsGame._openSoonDialog()
        return
      }
    }
  }
})()
