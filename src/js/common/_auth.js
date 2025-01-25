/**
 * auth.js
 */
;(() => {
  window.jsAuth = {
    city: null,
    isSetOpenBeforeGame: false,

    regModal: null,
    setModal: null,

    regUrl: 'https://xcomfeed.com/fonbet/fasw2025/register-user',
    getUserUrl: 'https://xcomfeed.com/fonbet/fasw2025/get-user-info',
    sendAmbasodorUrl: 'https://xcomfeed.com/fonbet/fasw2025/update',
    getGameDataUrl: 'https://xcomfeed.com/fonbet/fasw2025/get-games',

    async init() {
      this.regModal = document.querySelector('.js-modal-reg')
      this.setModal = document.querySelector('.js-modal-set')

      this._initReg()
      this._initSet()

      document.addEventListener('registrationCompleted', async (evt) => {
        console.log('userInfoUpdated')
        const pin = evt.detail.clientId
        if (!pin) return

        this._closeReg()
        await this._udpateUserInfo(pin)
        await window.jsScore.updateScorePage(pin)
      })

      document.addEventListener('userInfoUpdated', async (evt) => {
        if (evt.detail.clientId !== evt.detail.prevClientId) {
          console.log('userInfoUpdated')

          this._closeReg()
          await this._udpateUserInfo(pin)
          await window.jsScore.updateScorePage(pin)
        }
      })

      const pin = window.userInfo.getClientID()
      if (pin) {
        await this._udpateUserInfo(pin)
        await window.jsScore.updateScorePage(pin)
      }
    },

    async _udpateUserInfo(pin) {
      let userInfo = await this._getUserInfo(pin)

      if (!userInfo) {
        await this._regUser(pin)
        userInfo = await this._getUserInfo(pin)
      }

      window.jsPage.renderHeader(userInfo.pin, userInfo.score)

      if (userInfo.ambasador) {
        window.jsState.setAmbasador(userInfo.ambasador)
        window.jsPage.renderAmbasador(userInfo.ambasador)
      }
      await this._updateGameState(userInfo.pin)
    },

    _initReg() {
      const openBtnList = document.querySelectorAll('.js-modal-reg-show')
      const closeBtnList = document.querySelectorAll('.js-modal-reg-close')

      openBtnList.forEach((it) =>
        it.addEventListener('click', () => this._openReg())
      )

      closeBtnList.forEach((it) =>
        it.addEventListener('click', () => this._closeReg())
      )

      this.regModal.addEventListener('click', (evt) => {
        if (evt.target !== this.regModal) return
        this._closeReg()
      })
    },

    _initSet() {
      const screen1 = this.setModal.querySelector('.js-set-screen-1')
      const screen2 = this.setModal.querySelector('.js-set-screen-2')
      const screen3 = this.setModal.querySelector('.js-set-screen-3')
      const screen4 = this.setModal.querySelector('.js-set-screen-4')

      const cityBtn = this.setModal.querySelector('.js-set-btn-city')
      const ambasadorBtn = this.setModal.querySelector('.js-set-btn-ambasador')
      const finishBtn = this.setModal.querySelector('.js-set-btn-finish')
      const gameBtn = document.querySelector('.js-set-btn-game')
      const gameBtnAuth = document.querySelector('.js-set-btn-game-auth')
      const closeBtnList = document.querySelectorAll('.js-set-close')

      const cityField = this.setModal.querySelector('.js-set-field')
      const ambasadorList = this.setModal.querySelectorAll('.js-set-ambasador')
      const personImg = this.setModal.querySelector('.js-set-person')
      const bg = this.setModal.querySelector('.js-set-bg')

      cityField.addEventListener('input', () => {
        if (cityField.value.length === 0) {
          cityBtn.setAttribute('disabled', 'disabled')
          this.city = null
        } else {
          cityBtn.removeAttribute('disabled')
          this.city = cityField.value
        }
      })

      cityBtn.addEventListener('click', () => {
        window.jsUtils.hideEl(screen1)
        window.jsUtils.showEl(screen2)
      })

      ambasadorBtn.addEventListener('click', async () => {
        ambasadorBtn.setAttribute('disabled', 'disabled')
        const res = await this._sendAmbasador()
        ambasadorBtn.removeAttribute('disabled')

        if (!res) return

        window.jsUtils.hideEl(screen2)
        window.jsUtils.showEl(screen3)

        closeBtnList.forEach((it) => window.jsUtils.showEl(it))
      })

      finishBtn.addEventListener('click', () => {
        window.jsUtils.hideEl(screen3)
        window.jsUtils.showEl(screen4)
        bg.classList.add('last-screen')
      })

      gameBtn.addEventListener('click', () => {
        // TODO: 2025-01-22 / Амбасадор, приступить к игре
        this._gameBtnHandler()
      })

      gameBtnAuth.addEventListener('click', () => {
        // TODO: 2025-01-22 / Учавствовать
        const pin = window.userInfo.getClientID()
        if (pin) {
          this._gameBtnHandler()
        } else {
          this._openReg()
        }
      })

      ambasadorList.forEach((ambasador) =>
        ambasador.addEventListener('click', () => {
          ambasadorList.forEach((it) => it.classList.remove('actv'))

          ambasador.classList.add('actv')
          window.jsState.setAmbasador(ambasador.dataset.id)
          // TODO: 2025-01-22 / check
          personImg.src = ambasador.dataset.img

          ambasadorBtn.removeAttribute('disabled')
        })
      )

      closeBtnList.forEach((it) =>
        it.addEventListener('click', () => this._closeSet())
      )

      this.setModal.addEventListener('click', (evt) => {
        if (evt.target !== this.setModal) return
        this._closeSet()
      })
    },

    _gameBtnHandler() {
      const sliderGame = document.querySelector('.js-game-stars-block')

      this._closeSet()
      if (!this.isSetOpenBeforeGame) {
        sliderGame.scrollIntoView({ behavior: 'smooth' })
        window.jsSlider.stars.slideTo(5, 2000)
      }
    },

    _closeReg() {
      document.documentElement.classList.remove('scroll-lock')
      this.regModal.classList.remove('show')
    },

    _openReg() {
      window.jsHeader.closeModal()

      document.documentElement.classList.add('scroll-lock')
      this.regModal.classList.add('show')
    },

    _closeSet() {
      if (!this.city || !window.jsState.ambasador) return

      const pin = window.userInfo.getClientID()
      if (!pin) return

      window.jsPage.renderAmbasador(window.jsState.ambasador)
      if (!this.isSetOpenBeforeGame) {
        document.documentElement.classList.remove('scroll-lock')
      }
      this.setModal.classList.remove('show')
    },

    openSet() {
      document.documentElement.classList.add('scroll-lock')
      this.setModal.classList.add('show')
    },

    async updateScore() {
      const pin = window.userInfo.getClientID()
      if (!pin) return

      const userInfo = await this._getUserInfo(pin)
      if (!userInfo) return

      window.jsPage.renderScore(userInfo.score)
    },

    async _updateGameState(pin) {
      if (window.jsState.pin !== pin) {
        window.jsState.resetState(pin)
      }

      const gameData = await this._getGameData()
      window.jsPage.renderGameCard(gameData)
    },

    async _regUser(pin) {
      try {
        const req = { pin }
        const res = await window.jsUtils.sendData(this.regUrl, 'POST', req)

        if (res.error) {
          console.error(res)
          return false
        }

        return !res.error
      } catch (err) {
        console.error(err)
        return false
      }
    },

    async _getUserInfo(pin) {
      try {
        const req = { pin }
        const res = await window.jsUtils.sendData(this.getUserUrl, 'POST', req)

        if (res.error) {
          console.error(res)
          return false
        }

        return res.data
      } catch (err) {
        console.error(err)
        return false
      }
    },

    async _sendAmbasador() {
      const pin = window.userInfo.getClientID()
      if (!pin) {
        console.error('Не получилось зарегистрировать амбасадора')
        return
      }

      try {
        const req = {
          pin,
          city: this.city,
          ambasador: window.jsState.ambasador
        }

        const res = await window.jsUtils.sendData(
          this.sendAmbasodorUrl,
          'POST',
          req
        )

        if (res.error) {
          console.error(res)
          return false
        }

        return !res.error
      } catch (err) {
        console.error(err)
        return false
      }
    },

    async _getGameData() {
      const pin = window.userInfo.getClientID()
      if (!pin) {
        console.error('Не получилось получить результаты')
        return
      }

      try {
        const req = { pin }
        const res = await window.jsUtils.sendData(
          this.getGameDataUrl,
          'POST',
          req
        )

        if (res.error) {
          console.error(res)
          return false
        }

        return res.data
      } catch (err) {
        console.error(err)
        return false
      }
    }
  }
})()
