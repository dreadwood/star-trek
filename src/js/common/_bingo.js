/**
 * bingo.js
 */
;(() => {
  window.jsBingo = {
    getBingoOptionsUrl:
      'https://xcomfeed.com/fonbet/fasw2025/get-bingo-options',
    sendBingoUrl: 'https://xcomfeed.com/fonbet/fasw2025/send-bingo',
    checkBingoUrl: 'https://xcomfeed.com/fonbet/fasw2025/check-bingo',

    dialog: null,
    screens: {
      msg: null,
      content: null,
      end: null
    },

    startBtn: null,
    grid: null,
    sendBtn: null,
    count: null,

    answers: [],

    init() {
      const openBtnList = document.querySelectorAll('.js-bingo-open')

      this.dialog = document.querySelector('.js-bingo-dialog')
      this.screens.msg = this.dialog.querySelector('.js-bingo-msg')
      this.screens.content = this.dialog.querySelector('.js-bingo-content')
      this.screens.end = this.dialog.querySelector('.js-bingo-end')

      this.startBtn = this.dialog.querySelector('.js-bingo-start')
      const closeBtnList = this.dialog.querySelectorAll('.js-bingo-close')
      this.grid = this.dialog.querySelector('.js-bingo-grid')
      this.sendBtn = this.dialog.querySelector('.js-bingo-send')
      this.count = this.dialog.querySelector('.js-bingo-count')

      openBtnList.forEach((btn) => {
        btn.addEventListener('click', () => this.openDialog())
      })

      this.startBtn.addEventListener('click', () => {
        this.showContentScreen()
      })

      closeBtnList.forEach((it) =>
        it.addEventListener('click', () => this.closeDialog())
      )

      this.dialog.addEventListener('click', (evt) => {
        if (evt.target !== this.dialog) return
        this.closeDialog()
      })

      this.grid.addEventListener('click', (evt) => this.gridClickHandler(evt))

      this.sendBtn.addEventListener('click', () => this.sendBtnClickHandler())
    },

    async gridClickHandler(evt) {
      if (evt.target.tagName !== 'BUTTON') return
      evt.target.classList.toggle('actv')

      this.countAnswers()
    },

    countAnswers() {
      this.answers = []
      const answerList = this.grid.querySelectorAll('button')

      answerList.forEach((it) => {
        if (it.classList.contains('actv')) {
          this.answers.push(+it.dataset.id)
        }
      })

      this.count.textContent = `${this.answers.length}/6 событий`

      if (this.answers.length === 6) {
        this.sendBtn.removeAttribute('disabled')
      } else {
        this.sendBtn.setAttribute('disabled', 'disabled')
      }
    },

    async sendBtnClickHandler() {
      this.sendBtn.setAttribute('disabled', 'disabled')

      await this.sendBingo()
      await this.updateBingo()

      this.showEndScreen()
    },

    async renderAnswer() {
      const options = await this.getBingoOptions()

      const html = options
        .map(
          (it) =>
            `<button class="g-bingo__answer js-bingo-answer" data-id="${it.id}">${it.title}</button>`
        )
        .join('')

      this.grid.innerHTML = html
      this.startBtn.removeAttribute('disabled')
    },

    async updateBingo() {
      const isSend = await this.checkBingoSend()
      window.jsPage.renderBingo(isSend)
    },

    showMsgScreen() {
      this.startBtn.setAttribute('disabled', 'disabled')
      window.jsUtils.changeVisibleList(this.screens, this.screens.msg)

      this.renderAnswer()
    },

    showContentScreen() {
      this.sendBtn.setAttribute('disabled', 'disabled')
      this.count.textContent = '0/6 событий'
      window.jsUtils.changeVisibleList(this.screens, this.screens.content)
    },

    showEndScreen() {
      window.jsUtils.changeVisibleList(this.screens, this.screens.end)
    },

    openDialog() {
      const pin = window.userInfo.getClientID()
      if (!pin) {
        window.jsAuth._openReg()
        return
      }

      this.showMsgScreen()

      document.documentElement.classList.add('scroll-lock')
      this.dialog.classList.add('show')
    },

    closeDialog() {
      this.dialog.classList.remove('show')
      document.documentElement.classList.remove('scroll-lock')
    },

    async getBingoOptions() {
      try {
        const res = await window.jsUtils.sendData(this.getBingoOptionsUrl)

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

    async sendBingo() {
      const pin = window.userInfo.getClientID()
      if (!pin) {
        console.error('Не получилось отправить ответы бинго')
        return
      }

      try {
        const req = {
          pin,
          forecast: this.answers
        }
        const res = await window.jsUtils.sendData(
          this.sendBingoUrl,
          'POST',
          req
        )

        if (res.error) {
          console.error(res)
          return false
        }

        return res.success
      } catch (err) {
        console.error(err)
        return false
      }
    },

    async checkBingoSend() {
      const pin = window.userInfo.getClientID()
      if (!pin) {
        console.error('Не получилось узнать участие в бинго')
        return
      }

      try {
        const req = { pin }
        const res = await window.jsUtils.sendData(
          this.checkBingoUrl,
          'POST',
          req
        )

        if (res.error) {
          console.error(res)
          return
        }

        return res.forecast_sent
      } catch (err) {
        console.error(err)
        return
      }
    }
  }
})()
