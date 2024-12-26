;(() => {
  window.jsHeader = {
    header: null,
    dialog: null,
    isShow: false,

    /** @type {MediaQueryList} */
    mediaQuery: window.matchMedia(window.jsUtils.BREAKPOINT_TABLET),

    init() {
      this.header = document.querySelector('.js-header')
      const dialog = this.header.querySelector('.js-header-dialog')
      const burger = this.header.querySelector('.js-header-burger')
      const links = this.header.querySelectorAll('.js-header-nav a')

      burger.addEventListener('click', () => {
        if (this.isShow) {
          this._closeModal()
        } else {
          this._openModal()
        }
      })

      dialog.addEventListener('click', (evt) => {
        if (evt.target !== dialog) return
        this._closeModal()
      })

      links.forEach((link) =>
        link.addEventListener('click', () => this._closeModal())
      )

      document.addEventListener('keydown', (evt) => {
        if (evt.key === 'Escape') {
          this._closeModal()
        }
      })

      this.mediaQuery.addEventListener('change', (evt) => {
        if (!evt.matches) return
        this._closeModal()
      })
    },

    _openModal() {
      document.documentElement.classList.add('scroll-lock')
      this.header.classList.add('show')

      this.isShow = true
    },

    _closeModal() {
      document.documentElement.classList.remove('scroll-lock')
      this.header.classList.remove('show')

      this.isShow = false
    }
  }
})()
