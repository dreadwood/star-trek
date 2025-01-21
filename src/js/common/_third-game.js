/**
 * third.js
 */
;(() => {
  const TIMER_SECOND = 45

  window.jsThirdGame = {
    id: 3,

    pos: 0,
    isLastLevel: false,

    division: ['bobrov', 'chernyshev', 'kharlamov', 'tarasov'],
    name: {
      bobrov: 'Боброва',
      chernyshev: 'Чернышева',
      kharlamov: 'Харламова',
      tarasov: 'Тарасова'
    },

    asw: {
      bobrov: ['ggrB', 'Ubcu', 'kzID'],
      chernyshev: ['xfyB', 'HbbQ', 'sCpV'],
      kharlamov: ['jEYU', 'UUZZ', 'Xnhd'],
      tarasov: ['oQPU', 'vAYJ', 'Ojhf']
    },

    score: [0, 0, 0, 0],
    levelStatus: null, // cool / live / livezero / time / timeszero

    lives: 3,
    isSelect: {
      jersey: false,
      shorts: false,
      getri: false
    },

    dialog: null,
    screens: {
      msg: null,
      content: null,
      pause: null,
      end: null
    },
    // thirdMsg: null,
    // thirdContent: null,
    // thirdPause: null,
    // thirdEnd: null,

    jersey: null,
    shorts: null,
    getri: null,

    answerList: [],
    answerGrid: null,

    timer: TIMER_SECOND,
    timerId: null,

    init() {
      const openBtnList = document.querySelectorAll('.js-game-third-open')
      const startBtn = document.querySelector('.js-game-third-start')
      const closeBtnList = document.querySelectorAll('.js-game-third-close')

      this.dialog = document.querySelector('.js-game-third-dialog')
      this.screens.msg = this.dialog.querySelector('.js-game-msg')
      this.screens.content = this.dialog.querySelector('.js-game-content')
      this.screens.pause = this.dialog.querySelector('.js-game-pause')
      this.screens.end = this.dialog.querySelector('.js-game-end')

      this.jersey = document.querySelector('.js-game-third-jersey')
      this.shorts = document.querySelector('.js-game-third-shorts')
      this.getri = document.querySelector('.js-game-third-getri')

      this.answerList = document.querySelectorAll('.g-equip__answer')
      this.answerGrid = document.querySelector('.js-game-third-grid')
      const btnNext = document.querySelector('.js-game-third-next')

      openBtnList.forEach((btn) =>
        btn.addEventListener('click', () => this._thirdGameOpenHandler())
      )

      startBtn.addEventListener('click', () => {
        this._renderLevel()
        this._showContentScreen()
      })

      closeBtnList.forEach((it) =>
        it.addEventListener('click', () => this.closeDialog())
      )

      this.dialog.addEventListener('click', (evt) => {
        if (evt.target !== this.dialog) return
        this.closeDialog()
      })

      this.answerList.forEach((it) =>
        it.addEventListener('click', () => this._answerHandler(it))
      )

      btnNext.addEventListener('click', () => {
        this._incrementPos()
        this._renderLevel()
        this._showContentScreen()
      })
    },

    async _thirdGameOpenHandler() {
      const pin = window.userInfo.getClientID()
      if (!pin) {
        window.jsAuth._openReg()
        return
      }

      this._openDialog()

      if (window.jsState.thirdGameStatus) {
        return
      }

      this._showMsgScreen()
    },

    _answerHandler(answer) {
      const img = answer.querySelector('img')

      const division = this.division[this.pos]
      const type = answer.dataset.type
      const id = answer.dataset.id

      let indexAsw = 0

      switch (type) {
        case 'jersey':
          this.jersey.src = img.src
          indexAsw = 0
          break
        case 'shorts':
          this.shorts.src = img.src
          indexAsw = 1
          break
        case 'getri':
          this.getri.src = img.src
          indexAsw = 2
          break
      }

      if (id === this.asw[division][indexAsw]) {
        // верный ответ
        answer.classList.add('actv')
        this.answerList.forEach((it) => {
          if (it.dataset.type === type) {
            it.setAttribute('disabled', 'disabled')
          }
        })
        this.isSelect[type] = true
        this.score[this.pos] += 100
      } else {
        // ошибка
        answer.classList.add('error')
        this.lives -= 1
      }

      answer.setAttribute('disabled', 'disabled')
      this._updateLives()
      this._checkAnswer()
    },

    _checkAnswer() {
      if (this.lives === 0) {
        this._updateLevelStatus()
        this._showCorrectScreen()
        return
      }

      if (this.timer <= 0) {
        this._updateLevelStatus()
        this._showCorrectScreen()
        return
      }

      if (Object.values(this.isSelect).every((it) => it)) {
        this.score[this.pos] *= 1.5
        this._updateLevelStatus()
        this._showCorrectScreen()
        return
      }
    },

    _renderLevel() {
      this._setTimer()

      if (this.pos === 0) {
        return
      }

      const levelList = document.querySelectorAll('.js-game-third-level')
      const name = document.querySelector('.js-game-third-name')

      const division = this.division[this.pos]

      this.lives = 3
      this.isSelect = {
        jersey: false,
        shorts: false,
        getri: false
      }
      this.levelStatus = null

      levelList.forEach((it, i) => {
        if (i <= this.pos) it.classList.add('actv')
        else it.classList.remove('actv')
      })

      this._updateLives()

      name.textContent = `Дивизион ${this.name[division]}`
      this.jersey.src = this.jersey.dataset.default
      this.shorts.src = this.shorts.dataset.default
      this.getri.src = this.getri.dataset.default
      this.answerGrid.dataset.division = this.division[this.pos]
      this.answerList.forEach((it) => {
        it.classList.remove('error')
        it.classList.remove('error')
        it.removeAttribute('disabled', 'disabled')
      })
    },

    _showMsgScreen() {
      window.jsGame.isGame = false

      window.jsGame.changeVisibleScreen(this.screens, this.screens.msg)
    },

    _showContentScreen() {
      window.jsGame.isGame = true

      window.jsGame.changeVisibleScreen(this.screens, this.screens.content)
    },

    _showPauseScreen() {
      window.jsGame.isGame = false

      const title = document.querySelector('.js-game-third-level-title')
      const text = document.querySelector('.js-game-third-level-text')
      const score = document.querySelector('.js-game-third-level-score')

      title.textContent = title.dataset[this.levelStatus]
      text.innerHTML = text.dataset[this.levelStatus]
      score.textContent = this.score[this.pos]

      window.jsGame.changeVisibleScreen(this.screens, this.screens.pause)
    },

    _showEndScreen() {
      window.jsGame.isGame = false

      const title = document.querySelector('.js-game-third-title')
      const text = document.querySelector('.js-game-third-text')
      const score = document.querySelector('.js-game-third-score')

      title.textContent = title.dataset[window.jsState.thirdGameStatus]
      text.innerHTML = text.dataset[window.jsState.thirdGameStatus]
      score.textContent = window.jsState.thirdGameScore

      window.jsGame.changeVisibleScreen(this.screens, this.screens.end)
    },

    _openDialog() {
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
      this._stopTimer()

      if (window.jsGame.nextGame) {
        window.jsGame._openSoonDialog()
        return
      }
    },

    _setTimer() {
      // FIXME: 2025-01-19 /
      const time = document.querySelector('.js-game-third-time')
      const progress = document.querySelector('.js-game-third-progress')

      this._stopTimer()
      this._updateTimer(time, progress)

      this.timerId = setInterval(() => {
        if (this.timer > 0) {
          this.timer -= 1
          this._updateTimer(time, progress)
        } else {
          this._checkAnswer()
        }
      }, 1000)
    },

    _updateTimer(timeEl, progressEl) {
      const sec = this.timer >= 10 ? this.timer : `0${this.timer}`
      timeEl.textContent = sec
      progressEl.value = this.timer
    },

    _stopTimer() {
      this.timer = TIMER_SECOND
      if (this.timerId !== null) {
        clearInterval(this.timerId)
      }
    },

    _updateLives() {
      const liveList = document.querySelectorAll('.js-game-third-live')

      ;[...liveList].reverse().forEach((it, i) => {
        if (this.lives >= i + 1) {
          it.classList.add('actv')
        } else {
          it.classList.remove('actv')
        }
      })
    },

    // FIXME: 2025-01-19 /
    async _showCorrectScreen() {
      this._stopTimer()

      if (this.isLastLevel) {
        const score = this.score.reduce((acc, it) => acc + it)

        const result = await window.jsGame._sendResult(this.id, score)
        const gameDataList = await window.jsAuth._getGameData()
        await window.jsAuth.updateScore()

        if (result) {
          window.jsState.setThirdGameScore(score, this.levelStatus)
        }

        if (gameDataList) {
          window.jsPage.renderGameCard(gameDataList)
          window.jsGame.setNextGameData(gameDataList)
        }

        this._showEndScreen()
        return
      } else {
        this._showPauseScreen()
      }
    },

    _updateLevelStatus() {
      let score = this.score[this.pos]

      if (this.isLastLevel) {
        score = this.score.reduce((acc, it) => acc + it)
      }

      if (this.lives <= 0) {
        this.levelStatus = score === 0 ? 'livezero' : 'live'
        return
      }

      if (this.timer <= 0) {
        1
        this.levelStatus = score === 0 ? 'timezero' : 'time'
        return
      }

      if (Object.values(this.isSelect).every((it) => it)) {
        this.levelStatus = 'cool'
        return
      }
    },

    _incrementPos() {
      this.pos += 1
      this.isLastLevel = this.pos === this.division.length - 1
    }
  }
})()
