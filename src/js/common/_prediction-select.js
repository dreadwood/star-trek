/**
 * prediction-select.js
 */
;(() => {
  class PredictionSelect {
    constructor({ id, dialog, openBtnList }) {
      this.id = id
      this.dialog = dialog
      this.screens = {}

      this.screens.msg = this.dialog.querySelector('.js-prediction-msg')
      this.screens.content = this.dialog.querySelector('.js-prediction-content')
      this.screens.end = this.dialog.querySelector('.js-prediction-end')
      const startBtn = this.dialog.querySelector('.js-prediction-start')
      const closeBtnList = this.dialog.querySelectorAll('.js-prediction-close')

      this.select = this.dialog.querySelector('.js-prediction-select')
      this.answerBtn = this.dialog.querySelector('.js-prediction-answer')

      openBtnList.forEach((btn) => {
        btn.addEventListener('click', () => this.openDialog())
      })

      startBtn.addEventListener('click', () => {
        this.showContentScreen()
      })

      closeBtnList.forEach((it) =>
        it.addEventListener('click', () => this.closeDialog())
      )

      this.dialog.addEventListener('click', (evt) => {
        if (evt.target !== this.dialog) return
        this.closeDialog()
      })

      this.select.addEventListener('change', (evt) =>
        this.selectChangeHandler(evt)
      )

      this.answerBtn.addEventListener('click', () => this.answerClickHandler())
    }

    selectChangeHandler(evt) {
      if (evt.target.value !== '') {
        this.answerBtn.removeAttribute('disabled')
        this.select.classList.add('selected')
      } else {
        this.answerBtn.setAttribute('disabled', 'disabled')
        this.select.classList.remove('selected')
      }
    }

    async answerClickHandler() {
      this.answerBtn.setAttribute('disabled', 'disabled')

      const result = await window.jsPrediction.sendPrediction(
        this.id,
        this.select.value
      )

      if (result) {
        this.showEndScreen()
      }
    }

    showMsgScreen() {
      window.jsUtils.changeVisibleList(this.screens, this.screens.msg)
    }

    showContentScreen() {
      this.select.selectedIndex = 0
      this.answerBtn.setAttribute('disabled', 'disabled')
      this.select.classList.remove('selected')

      window.jsUtils.changeVisibleList(this.screens, this.screens.content)
    }

    showEndScreen() {
      window.jsUtils.changeVisibleList(this.screens, this.screens.end)
    }

    openDialog() {
      const pin = window.userInfo.getClientID()
      if (!pin) {
        window.jsAuth._openReg()
        return
      }

      this.showMsgScreen()

      document.documentElement.classList.add('scroll-lock')
      this.dialog.classList.add('show')
    }

    closeDialog() {
      this.dialog.classList.remove('show')
      document.documentElement.classList.remove('scroll-lock')
    }
  }

  window.jsPredictionSelect = {
    dialog: PredictionSelect
  }
})()
