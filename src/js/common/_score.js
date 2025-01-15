/**
 * dialog.js
 */
;(() => {
  window.jsScore = {
    getScoreUrl: 'https://xcomfeed.com/fonbet/fasw2025/get-leaderboard',

    init() {
      const score = document.querySelector('.js-modal-score')
      const showBtnList = document.querySelectorAll('.js-modal-score-show')

      const btnClose = score.querySelector('.js-m-close')

      showBtnList.forEach((it) =>
        it.addEventListener('click', () => {
          this._openDialog(score)
        })
      )

      btnClose.addEventListener('click', () => {
        this._closeDialogl(score)
      })

      score.addEventListener('click', (evt) => {
        if (evt.target !== score) return
        this._closeDialogl(score)
      })
    },

    async _openDialog(dialog) {
      const result = await this._loadScore()
      if (!result) return

      this._renderTable(result)

      document.documentElement.classList.add('scroll-lock')
      dialog.classList.add('show')
    },

    _closeDialogl(dialog) {
      document.documentElement.classList.remove('scroll-lock')
      dialog.classList.remove('show')
    },

    _renderTable(result) {
      const body = document.querySelector('.js-modal-score-body')
      const self = document.querySelector('.js-modal-score-self')

      const bodySring = result
        .slice(0, 5)
        .map((it) => this._renderRow(it))
        .join(' ')

      body.innerHTML = bodySring
    },

    _renderRow(row) {
      const self = row.current_user ? 'Это ты' : ''
      return `<div class="m-score__row">
  <div>${row.place}</div>
  <div>${row.pin}</div>
  <div>${self}</div>
  <div></div>
  <div>${row.score}</div>
</div>`
    },

    async _loadScore() {
      const pin = window.userInfo.getClientID()
      if (!pin) {
        console.error('Не получилось таблицу результатов')
        return
      }

      try {
        const req = { pin }
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
