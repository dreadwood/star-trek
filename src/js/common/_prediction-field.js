/**
 * prediction-field.js
 */
;(() => {
  class PredictionField {
    constructor({ id, dialog, openBtnList }) {
      this.id = id
      this.dialog = dialog
      this.screens = {}

      this.screens.msg = this.dialog.querySelector('.js-prediction-msg')
      this.screens.content = this.dialog.querySelector('.js-prediction-content')
      this.screens.end = this.dialog.querySelector('.js-prediction-end')
      const startBtn = this.dialog.querySelector('.js-prediction-start')
      const closeBtnList = this.dialog.querySelectorAll('.js-prediction-close')

      this.field = this.dialog.querySelector('.js-prediction-field')
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

      this.field.addEventListener('input', (evt) => this.fieldInputHandler(evt))

      this.answerBtn.addEventListener('click', () => this.answerClickHandler())
    }

    fieldInputHandler(evt) {
      if (evt.target.value !== '') {
        this.answerBtn.removeAttribute('disabled')
      } else {
        this.answerBtn.setAttribute('disabled', 'disabled')
      }
    }

    async answerClickHandler() {
      this.answerBtn.setAttribute('disabled', 'disabled')

      const result = await window.jsPrediction.sendPrediction(
        this.id,
        this.field.value
      )

      if (result) {
        this.showEndScreen()
      }
    }

    showMsgScreen() {
      window.jsUtils.changeVisibleList(this.screens, this.screens.msg)
    }

    showContentScreen() {
      this.field.value = ''
      this.answerBtn.setAttribute('disabled', 'disabled')

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

  window.jsPredictionField = {
    dialog: PredictionField
  }
})()
