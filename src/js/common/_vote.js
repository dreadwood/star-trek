/**
 * vote.js
 */
;(() => {
  window.jsVote = {
    keyLocal: 'GS_VOTE_KEY',
    // iframeParams: '?width=100%25&amp;height=100%25&amp;lang=ru',
    iframeParams:
      '?sr=165&type_id=24&width=100%25&height=100%25&lang=ru&autoplay=1',
    // not-started
    // started - лендинг с голосованием
    // completed - финальное голосование

    getPlayersUrl: 'https://xcomfeed.com/fonbet/vote/get',
    sendPhoneUrl: 'https://xcomfeed.com/fonbet/vote/set-phone',
    sendVoteUrl: 'https://xcomfeed.com/fonbet/vote/vote',

    status: null,

    playersData: null,
    playerId: null,

    mediaQuery: window.matchMedia(window.jsUtils.BREAKPOINT_TABLET),

    async init() {
      const startBtn = document.querySelector('.js-vote-btn-start')
      const selectBtn = document.querySelector('.js-vote-btn-select')

      this.promoScreen = document.querySelector('.js-vote-screen-promo')
      this.playersScreen = document.querySelector('.js-vote-screen-players')
      this.phoneScreen = document.querySelector('.js-vote-screen-phone')
      this.successScreen = document.querySelector('.js-vote-screen-success')
      this.tableScreen = document.querySelector('.js-vote-screen-table')
      this.resultScreen = document.querySelector('.js-vote-screen-result')
      this.slider = document.querySelector('.js-slider-players')
      this.players = document.querySelector('.js-vote-players')
      this.dialog = document.querySelector('.js-modal-video')
      const dialogCloseBtn = document.querySelectorAll('.js-modal-video-close')
      this.iframe = document.querySelector('.js-vote-iframe')
      this.form = document.querySelector('.js-vote-form')
      this.fieldPhone = document.querySelector('.js-vote-form-phone')
      const phoneSkipBtn = document.querySelector('.js-vote-phone-skip')
      const successSkipBtn = document.querySelector('.js-vote-success-skip')
      this.table = document.querySelector('.js-vote-table')
      this.winnerWrp = document.querySelector('.js-vote-winner-wrp')

      // eslint-disable-next-line no-undef
      IMask(this.fieldPhone, {
        mask: '+{7} 000 000-00-00'
      })

      this.fieldPhone.addEventListener('input', (evt) => {
        if (evt.target.value.length < 2) {
          evt.target.value = '+7'
        }
      })

      startBtn.addEventListener('click', () => this.startBtnClickHandler())
      selectBtn.addEventListener('click', () => this.selectBtnClickHandler())
      this.form.addEventListener('submit', (evt) => this.formSubmitHandler(evt))
      dialogCloseBtn.forEach((it) =>
        it.addEventListener('click', () => this.closeDialogl())
      )
      this.dialog.addEventListener('click', (evt) => {
        if (evt.target !== this.dialog) return
        this.closeDialog()
      })
      phoneSkipBtn.addEventListener('click', () =>
        this.phoneSkipBtnClickHandler()
      )
      successSkipBtn.addEventListener('click', () =>
        this.successSkipBtnClickHandler()
      )
      this.players.addEventListener('click', (evt) =>
        this.elHasVideoBtnClickHandler(evt)
      )
      this.table.addEventListener('click', (evt) =>
        this.elHasVideoBtnClickHandler(evt)
      )
      this.winnerWrp.addEventListener('click', (evt) =>
        this.elHasVideoBtnClickHandler(evt)
      )

      await this.update()
    },

    async update() {
      const stateClose = document.querySelector('.js-vote-state-close')
      const stateOpen = document.querySelector('.js-vote-state-open')
      const regBtn = document.querySelector('.js-vote-phone-reg')

      const isVote = localStorage.getItem(this.keyLocal)

      const pin = window.userInfo.getClientID()
      if (pin) {
        window.jsUtils.hideEl(regBtn)
      }

      const playersData = await this.fetchGetPlayers()
      if (!playersData) return

      this.playersData = playersData.players.sort(
        (a, b) => b.vote_percent - a.vote_percent
      )
      this.status = playersData.status

      if (this.status === 'completed') {
        this.renderWinner()
        window.jsUtils.hideEl(this.promoScreen)
        window.jsUtils.showEl(this.resultScreen)
        return
      }

      if (this.status === 'started' && isVote) {
        this.renderTable()
        window.jsUtils.hideEl(this.promoScreen)
        window.jsUtils.showEl(this.tableScreen)
        return
      }

      if (this.status === 'started') {
        this.renderSlider()
        this.initSlider()
        window.jsUtils.hideEl(stateClose)
        window.jsUtils.showEl(stateOpen)
        return
      }
    },

    renderSlider() {
      const html = this.playersData
        .map(
          (it) =>
            `<article class="v-players__card swiper-slide" data-id="${it.id}">
  <div class="v-players__preview">
    <img src="${it.rank}" width="260" height="160" alt="">
    <button class="v-players__play" data-src="${it.video_url}">
      <div class="v-players__play-icon">
        <svg width="13" height="16">
          <use xlink:href="#play"></use>
        </svg>
      </div>
    </button>
  </div>
  <div class="v-players__person">
    <div class="v-players__photo"><img src="${it.photo_url}" width="260" height="160" alt=""></div>
    <div>
      <div class="v-players__spec">${it.lastname} ${it.firstname}</div>
      <div class="v-players__name">${it.teamname}</div>
    </div>
  </div>
</article>`
        )
        .join('')

      this.players.innerHTML = html
    },

    renderTable() {
      const html = this.playersData
        .map(
          (it) =>
            `<div class="v-table__player">
  <div class="v-table__photo">
    <img src="${it.photo_url}" width="60" height="60" alt=""></div>
  <div class="v-table__info">
    <div class="v-table__name">${it.lastname} ${it.firstname}</div>
    <div class="v-table__subname">${it.teamname}</div>
  </div>
  <div class="v-table__play">
    <button class="btn-play" data-src="${it.video_url}">
      <svg width="13" height="16">
        <use xlink:href="#play"></use>
      </svg><span>Смотреть видео</span>
    </button>
  </div>
  <div class="v-table__progress" style="--percent-value: ${it.vote_percent}%;"></div>
  <div class="v-table__percent">${it.vote_percent}%</div>
</div>`
        )
        .join('')

      this.table.innerHTML = html
    },

    renderWinner() {
      const html = this.playersData
        .slice(0, 1)
        .map(
          (it) =>
            `<div class="v-promo__person">
  <div class="v-promo__person-top">
    <div class="v-promo__photo">
    <img src="${it.photo_url}" width="260" height="160" alt=""></div>
    <div>${it.lastname} ${it.firstname}</div>
    <div class="v-promo__percent">${it.vote_percent}%</div>
  </div>
  <button class="btn-play" data-src="${it.video_url}" type="button">
    <svg width="13" height="16">
      <use xlink:href="#play"></use>
    </svg><span>Смотреть видео</span>
  </button>
</div>`
        )
        .join('')

      this.winnerWrp.innerHTML = html
    },

    initSlider() {
      const parrent = this

      // eslint-disable-next-line no-undef
      const swiper = new Swiper(this.slider, {
        slidesPerView: 'auto',
        grabCursor: true,
        centeredSlides: true,
        slideActiveClass: 'actv',
        loop: true,
        navigation: {
          prevEl: '.js-slider-players-prev',
          nextEl: '.js-slider-players-next'
        }
      })
      swiper.on('slideChange', function (instance) {
        const activeSlide = instance.slides[instance.activeIndex]
        parrent.playerId = activeSlide.dataset.id
      })

      swiper.slideTo(2)
      window.addEventListener('resize', () => swiper.updateSize())
    },

    startBtnClickHandler() {
      window.jsUtils.hideEl(this.promoScreen)
      window.jsUtils.showEl(this.playersScreen)
    },

    async selectBtnClickHandler() {
      const req = { player_id: +this.playerId }

      const result = await this.fetchSendVoteUrl(req)
      if (!result) return

      localStorage.setItem(this.keyLocal, '1')

      window.jsUtils.hideEl(this.playersScreen)
      window.jsUtils.showEl(this.phoneScreen)

      const playersData = await this.fetchGetPlayers()
      if (playersData) {
        this.renderWinner()
        this.playersData = playersData.players.sort(
          (a, b) => b.vote_percent - a.vote_percent
        )
      }
    },

    async formSubmitHandler(evt) {
      evt.preventDefault()

      const phone = this.fieldPhone.value.replace(/[^\d+]/g, '')

      const req = {
        player_id: +this.playerId,
        phone
      }

      const result = await this.fetchSendPhoneUrl(req)
      if (!result) return

      window.jsUtils.hideEl(this.phoneScreen)
      window.jsUtils.showEl(this.successScreen)
    },

    phoneSkipBtnClickHandler() {
      window.jsUtils.hideEl(this.phoneScreen)
      window.jsUtils.showEl(this.successScreen)
    },

    successSkipBtnClickHandler() {
      this.renderTable()
      window.jsUtils.hideEl(this.successScreen)
      window.jsUtils.showEl(this.tableScreen)
    },

    elHasVideoBtnClickHandler(evt) {
      const el = evt.target.closest('button')
      if (!el) return

      this.iframe.src = el.dataset.src + this.iframeParams
      this.openDialog()
    },

    showTableAfterAuth() {
      const isVote = localStorage.getItem(this.keyLocal)
      if (!isVote) return

      this.renderTable()
      window.jsUtils.hideEl(this.promoScreen)
      window.jsUtils.hideEl(this.playersScreen)
      window.jsUtils.hideEl(this.phoneScreen)
      window.jsUtils.hideEl(this.successScreen)
      window.jsUtils.showEl(this.tableScreen)
    },

    openDialog() {
      document.documentElement.classList.add('scroll-lock')
      this.dialog.classList.add('show')
    },

    closeDialogl() {
      this.iframe.src = ''
      document.documentElement.classList.remove('scroll-lock')
      this.dialog.classList.remove('show')
    },

    async fetchGetPlayers() {
      try {
        const res = await window.jsUtils.sendData(this.getPlayersUrl)

        if (res.error) {
          console.error(res)
          return false
        }

        return res
      } catch (err) {
        console.error(err)
        return false
      }
    },

    async fetchSendPhoneUrl(req) {
      try {
        const res = await window.jsUtils.sendData(
          this.sendPhoneUrl,
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

    async fetchSendVoteUrl(req) {
      try {
        const res = await window.jsUtils.sendData(this.sendVoteUrl, 'POST', req)

        if (res.error) {
          console.error(res)
          return false
        }

        return res.success
      } catch (err) {
        console.error(err)
        return false
      }
    }
  }
})()
