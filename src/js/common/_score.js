/**
 * score.js
 */
;(() => {
  window.jsScore = {
    getScoreUrl: 'https://xcomfeed.com/fonbet/fasw2025/get-leaderboard',
    testPin: 'test1100',

    arrivedScoreBody: null,

    async init() {
      const score = document.querySelector('.js-modal-score')
      const showBtnList = document.querySelectorAll('.js-modal-score-show')
      const btnClose = score.querySelector('.js-m-close')

      this.arrivedScoreBody = document.querySelector('.js-arrived-score-body')

      showBtnList.forEach((it) =>
        it.addEventListener('click', () => this._openDialog(score))
      )

      btnClose.addEventListener('click', () => this._closeDialogl(score))

      score.addEventListener('click', (evt) => {
        if (evt.target !== score) return
        this._closeDialogl(score)
      })

      // await this.updateScorePage(this.testPin)
    },

    async _openDialog(dialog) {
      const result = await this._loadScore()
      if (!result) return

      this._renderTable(result)

      document.documentElement.classList.add('scroll-lock')
      dialog.classList.add('show')
    },

    _closeDialogl(dialog) {
      if (!window.jsHeader.isShow) {
        document.documentElement.classList.remove('scroll-lock')
      }
      dialog.classList.remove('show')
    },

    async updateScorePage(pin) {
      if (this.arrivedScoreBody) return

      const result = await this._loadScore(pin)
      if (!result) return

      this._renderTablePage(result, pin)
    },

    _renderTable(result) {
      const body = document.querySelector('.js-modal-score-body')
      const self = document.querySelector('.js-modal-score-self')
      const line = document.querySelector('.js-modal-score-line')

      window.jsUtils.showEl(line)
      window.jsUtils.showEl(self)

      const bodySring = result
        .slice(0, 5)
        .map((it, i) => {
          if (it.current_user && i <= 5) {
            window.jsUtils.hideEl(line)
            window.jsUtils.hideEl(self)
          }
          return this._renderRow(it)
        })
        .join(' ')

      const selfString = result
        .filter((it) => it.current_user)
        .slice(0, 1)
        .map((it) => this._renderRow(it))
        .join(' ')

      const pin = window.userInfo.getClientID()
      if (!pin) {
        window.jsUtils.hideEl(line)
        window.jsUtils.hideEl(self)
      }

      body.innerHTML = bodySring
      self.innerHTML = selfString
    },

    _renderRow(row) {
      const self = row.current_user ? 'Это ты' : ''
      const selfClass = row.current_user ? 'blue' : ''
      return `<div class="m-score__row ${selfClass}">
  <div>${row.place}</div>
  <div>${row.pin}</div>
  <div>${self}</div>
  <div></div>
  <div>${row.score}</div>
</div>`
    },

    _renderTablePage(result, pin) {
      const self = document.querySelector('.js-arrived-score-self')
      const line = document.querySelector('.js-arrived-score-line')

      window.jsUtils.showEl(line)
      window.jsUtils.showEl(self)

      const bodySring = result
        .slice(0, 5)
        .map((it, i) => {
          if (it.current_user && i <= 5) {
            window.jsUtils.hideEl(line)
            window.jsUtils.hideEl(self)
          }
          return this._renderRowPage(it)
        })
        .join(' ')

      const selfString = result
        .filter((it) => it.current_user)
        .slice(0, 1)
        .map((it) => this._renderRow(it))
        .join(' ')

      if (pin === this.testPin) {
        window.jsUtils.hideEl(line)
        window.jsUtils.hideEl(self)
      }

      this.arrivedScoreBody.innerHTML = bodySring
      self.innerHTML = selfString
    },

    _renderRowPage(row) {
      const self = row.current_user ? 'Это ты' : ''
      const selfClass = row.current_user ? 'blue' : ''
      return `<div class="b-arrived__score-row ${selfClass}">
  <div>${row.place}</div>
  <div>${row.pin}</div>
  <div>${self}</div>
  <div></div>
  <div>${row.score}</div>
</div>`
    },

    async _loadScore(currentPin) {
      const pin = currentPin || window.userInfo.getClientID()

      try {
        const req = { pin: pin || undefined }
        const res = await window.jsUtils.sendData(this.getScoreUrl, 'POST', req)

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
    }
  }
})()
