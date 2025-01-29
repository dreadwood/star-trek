/**
 * prediction-list.js
 */
;(() => {
  class jsPredictionList {
    constructor({ id, dialog, openBtnList }) {
      this.id = id
      this.dialog = dialog
      this.screens = {}

      this.screens.msg = this.dialog.querySelector('.js-prediction-msg')
      this.screens.content = this.dialog.querySelector('.js-prediction-content')
      this.screens.end = this.dialog.querySelector('.js-prediction-end')
      const startBtn = this.dialog.querySelector('.js-prediction-start')
      const closeBtnList = this.dialog.querySelectorAll('.js-prediction-close')

      this.answerList = this.dialog.querySelectorAll('.js-prediction-answer')

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

      this.answerList.forEach((it) =>
        it.addEventListener('click', (evt) => this.answerClickHandler(evt))
      )
    }

    async answerClickHandler(evt) {
      this.answerList.forEach((it) => it.setAttribute('disabled', 'disabled'))

      const result = await window.jsPrediction.sendPrediction(
        this.id,
        evt.currentTarget.dataset.answer
      )

      if (result) {
        this.showEndScreen()
        await window.jsPrediction.updatePredictions()
      }
    }

    showMsgScreen() {
      window.jsUtils.changeVisibleList(this.screens, this.screens.msg)
    }

    showContentScreen() {
      this.answerList.forEach((it) =>
        it.removeAttribute('disabled', 'disabled')
      )

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

  window.jsPredictionList = {
    dialog: jsPredictionList
  }
})()
