/**
 * dialog.js
 */
;(() => {
  window.jsDialog = {
    duringAnimation: 500,

    init() {
      const rules = document.querySelector('.js-modal-rules')
      const rulesShowBtns = document.querySelectorAll('.js-modal-rules-show')

      if (rules) this._initDialog(rules, rulesShowBtns)
    },

    _initDialog(dialog, showBtns) {
      const btnClose = dialog.querySelector('.js-m-close')

      showBtns.forEach((it) =>
        it.addEventListener('click', () => {
          this.openDialog(dialog)
        })
      )

      btnClose.addEventListener('click', () => {
        this.closeDialogl(dialog)
      })

      dialog.addEventListener('click', (evt) => {
        if (evt.target !== dialog) return
        this.closeDialogl(dialog)
      })
    },

    openDialog(dialog) {
      document.documentElement.classList.add('scroll-lock')
      dialog.classList.add('show')
    },

    closeDialogl(dialog) {
      setTimeout(() => {
        dialog.classList.remove('hiding')
      }, this.duringAnimation)

      document.documentElement.classList.remove('scroll-lock')
      dialog.classList.remove('show')
      dialog.classList.add('hiding')
    }
  }
})()
