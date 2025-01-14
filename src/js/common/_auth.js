/**
 * auth.js
 */

;(() => {
  window.jsAuth = {
    city: null,
    ambasador: null,

    regModal: null,
    setModal: null,

    regUrl: 'https://xcomfeed.com/fonbet/fasw2025/register-user',
    getUserUrl: 'https://xcomfeed.com/fonbet/fasw2025/get-user-info',
    sendAmbasodor: 'https://xcomfeed.com/fonbet/fasw2025/update',

    async init() {
      this.regModal = document.querySelector('.js-modal-reg')
      this.setModal = document.querySelector('.js-modal-set')

      this._initReg()
      this._initSet()

      document.addEventListener('registrationCompleted', async (evt) => {
        console.log('userInfoUpdated')

        const pin = evt.detail.clientId
        if (!pin) return

        await this._checkAmbasador(pin)
      })

      document.addEventListener('userInfoUpdated', async (evt) => {
        if (evt.detail.clientId !== evt.detail.prevClientId) {
          console.log('userInfoUpdated')

          await this._checkAmbasador(evt.detail.clientId)
        }
      })

      const pin = window.userInfo.getClientID()
      if (pin) {
        await this._checkAmbasador(pin)
      }
    },

    _updateData(userInfo) {
      const idWrp = document.querySelector('.js-header-id-wrp')
      const idText = document.querySelector('.js-header-id-text')
      const scoreWrp = document.querySelector('.js-header-score-wrp')
      const scoreText = document.querySelector('.js-header-score-text')
      const btnLogin = document.querySelector('.js-header-login')

      const testBlock = document.querySelector('.js-test')
      const ambasadorTestList = document.querySelectorAll('.js-test-ambasador')
      const ambasadorMsgList = document.querySelectorAll('.js-msg-ambasador')

      // idText.textContent = `****${userInfo.pin.slice(-4)}`
      idText.textContent = userInfo.pin
      scoreText.textContent = userInfo.score
      window.jsUtils.showEl(idWrp)
      window.jsUtils.showEl(scoreWrp)
      window.jsUtils.hideEl(btnLogin)

      const existTestAmbasador = [...ambasadorTestList].some(
        (it) => it.dataset.person === userInfo.ambasador
      )
      const existMsgAmbasador = [...ambasadorMsgList].some(
        (it) => it.dataset.person === userInfo.ambasador
      )

      console.log(existMsgAmbasador)

      if (existTestAmbasador) {
        ambasadorTestList.forEach((it) => {
          if (it.dataset.person === userInfo.ambasador) {
            window.jsUtils.showEl(it)
          } else {
            window.jsUtils.hideEl(it)
          }
        })
      }

      if (existMsgAmbasador) {
        ambasadorMsgList.forEach((it) => {
          if (it.dataset.person === userInfo.ambasador) {
            window.jsUtils.showEl(it)
          } else {
            window.jsUtils.hideEl(it)
          }
        })
      }

      window.jsUtils.showEl(testBlock)
    },

    _initReg() {
      const openBtnList = document.querySelectorAll('.js-modal-reg-show')
      const closeBtnList = document.querySelectorAll('.js-modal-reg-close')

      openBtnList.forEach((it) =>
        it.addEventListener('click', () => {
          this._openReg()
        })
      )

      closeBtnList.forEach((it) =>
        it.addEventListener('click', () => {
          this._closeReg()
        })
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

      ambasadorList.forEach((ambasador) =>
        ambasador.addEventListener('click', () => {
          ambasadorList.forEach((it) => it.classList.remove('actv'))

          ambasador.classList.add('actv')
          this.ambasador = ambasador.dataset.id
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

    _closeReg() {
      document.documentElement.classList.remove('scroll-lock')
      this.regModal.classList.remove('show')
    },

    _openReg() {
      document.documentElement.classList.add('scroll-lock')
      window.jsHeader.closeModal()
      this.regModal.classList.add('show')
    },

    _closeSet() {
      if (!this.city || !this.ambasador) return

      const pin = window.userInfo.getClientID()
      if (!pin) return

      this._checkAmbasador(pin)
      document.documentElement.classList.remove('scroll-lock')
      this.setModal.classList.remove('show')
    },

    _openSet() {
      document.documentElement.classList.add('scroll-lock')
      this.setModal.classList.add('show')
    },

    async _checkAmbasador(pin) {
      const userInfo = await this._getUserInfo(pin)

      if (!userInfo) {
        // подразумеваеться что он если нужно зарегистрирует
        await this._regUser(pin)
      }

      if (!userInfo.ambasador) {
        this._openSet()
        return
      }

      this._updateData(userInfo)
    },

    async _regUser(pin) {
      try {
        const req = { pin }
        const res = await window.jsUtils.sendData(this.regUrl, 'POST', req)

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

    async _getUserInfo(pin) {
      try {
        const req = { pin }
        const res = await window.jsUtils.sendData(this.getUserUrl, 'POST', req)

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
          ambasador: this.ambasador
        }

        const res = await window.jsUtils.sendData(
          this.sendAmbasodor,
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
    }
  }
})()
