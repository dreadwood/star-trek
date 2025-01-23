/**
 * fifth-game.js
 */
;(() => {
  window.jsFifthGame = {
    id: 5,

    dialog: null,
    iframe: null,
    screens: {
      msg: null,
      content: null,
      end: null
    },

    init() {
      const openBtnList = document.querySelectorAll('.js-game-fifth-open')
      const startBtn = document.querySelector('.js-game-fifth-start')
      const closeBtnList = document.querySelectorAll('.js-game-fifth-close')

      this.dialog = document.querySelector('.js-game-fifth-dialog')
      this.screens.msg = this.dialog.querySelector('.js-game-msg')
      this.screens.content = this.dialog.querySelector('.js-game-content')
      this.screens.end = this.dialog.querySelector('.js-game-end')

      this.iframe = this.dialog.querySelector('.js-game-iframe')

      openBtnList.forEach((btn) => {
        btn.addEventListener('click', () => this._openDialog())
      })

      startBtn.addEventListener('click', () => {
        this._startBtnHandler()
      })

      closeBtnList.forEach((it) =>
        it.addEventListener('click', () => this.closeDialog())
      )

      this.dialog.addEventListener('click', (evt) => {
        if (evt.target !== this.dialog) return
        this.closeDialog()
      })

      window.addEventListener('message', async (event) => {
        if (!(event.data && event.data.type === 'log')) {
          return
        }

        if (event.data.idGame !== this.id) return

        const msg = event.data.args[0]

        if (!(typeof msg === 'object' && msg !== null)) {
          return
        }

        if (msg.type === 'exit') {
          this.closeDialog()
          // {
          //   type: 'exit',
          //   log: 'eyJ0eXBlI...jFaIn0=',
          //   maxScore: 600,
          //   pucks: []
          //   timeStart: "2025-01-23T10:27:03.343Z",
          //   timeEnd: "2025-01-23T10:27:18.261Z"
          // }
        }

        if (msg.type === 'finishLog') {
          const logObj = {
            logs: {
              finish: msg.log
            }
          }
          const result = await window.jsGame._sendResult(
            this.id,
            msg.maxScore,
            logObj
          )
          const gameDataList = await window.jsAuth._getGameData()
          await window.jsAuth.updateScore()

          if (result) {
            window.jsState.setFifthGameScore(msg.maxScore)
          }

          if (gameDataList) {
            window.jsPage.renderGameCard(gameDataList)
            window.jsGame.checkGameOver(gameDataList)
          }

          this._showEndScreen()

          // {
          //   type: "finishLog",
          //   timeStart: "2025-01-23T10:30:37.936Z",
          //   pucks: [],
          //   maxScore: 400,
          //   timeEnd: "2025-01-23T10:30:56.481Z"
          // }
        }
      })
    },

    _startBtnHandler() {
      this.iframe.src = window.jsGame.fifthGameUrl
      this._showContentScreen()
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

      const title = document.querySelector('.js-game-fifth-title')
      const text = document.querySelector('.js-game-fifth-text')
      const score = document.querySelector('.js-game-fifth-score')

      title.textContent = title.dataset[window.jsState.fifthGameStatus]
      text.innerHTML = text.dataset[window.jsState.fifthGameStatus]
      score.textContent = window.jsState.fifthGameScore

      window.jsGame.changeVisibleScreen(this.screens, this.screens.end)
    },

    _openDialog() {
      const pin = window.userInfo.getClientID()
      if (!pin) {
        window.jsAuth._openReg()
        return
      }

      if (!window.jsState.ambasador) {
        window.jsAuth.isSetOpenBeforeGame = true
        window.jsAuth.openSet(true)
      }

      this._showMsgScreen()

      document.documentElement.classList.add('scroll-lock')
      this.dialog.classList.add('show')
    },

    closeDialog() {
      // if (window.jsGame.isGame) {
      //   window.jsGame._openConfirmDialog()
      //   return
      // }
      this.iframe.src = ''

      this.dialog.classList.remove('show')
      document.documentElement.classList.remove('scroll-lock')

      if (window.jsGame.isGameOver) {
        window.jsGame._openSoonDialog()
        return
      }
    }
  }
})()
