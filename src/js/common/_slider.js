/**
 * slider.js
 */
;(() => {
  window.jsSlider = {
    mediaQuery: window.matchMedia(window.jsUtils.BREAKPOINT_TABLET),

    stars: null,

    init() {
      this._ambassadors()
      this._stars()
      this._prizes()
      this._changeAmbasador()
    },

    _ambassadors() {
      // eslint-disable-next-line no-undef
      const swiper = new Swiper('.js-slider-ambassadors', {
        slidesPerView: 'auto',
        grabCursor: true,
        navigation: {
          prevEl: '.js-slider-ambassadors-prev',
          nextEl: '.js-slider-ambassadors-next'
        }
      })

      this.mediaQuery.addEventListener('change', (evt) =>
        this._toggleSwiper(swiper, evt.matches)
      )
      this._toggleSwiper(swiper, this.mediaQuery.matches)
    },

    _stars() {
      // eslint-disable-next-line no-undef
      this.stars = new Swiper('.js-slider-stars', {
        slidesPerView: 'auto',
        grabCursor: true,
        initialSlide: 1,
        navigation: {
          prevEl: '.js-slider-stars-prev',
          nextEl: '.js-slider-stars-next'
        }
      })
    },

    _prizes() {
      // eslint-disable-next-line no-undef
      new Swiper('.js-slider-prizes', {
        slidesPerView: 'auto',
        grabCursor: true,
        navigation: {
          prevEl: '.js-slider-prizes-prev',
          nextEl: '.js-slider-prizes-next'
        }
      })
    },

    _changeAmbasador() {
      // eslint-disable-next-line no-undef
      const swiper = new Swiper('.js-slider-change-ambasador', {
        slidesPerView: 'auto',
        grabCursor: true,
        navigation: {
          prevEl: '.js-slider-change-ambasador-prev',
          nextEl: '.js-slider-change-ambasador-next'
        }
      })

      this.mediaQuery.addEventListener('change', (evt) => {
        this._toggleSwiper(swiper, evt.matches)
      })
      this._toggleSwiper(swiper, this.mediaQuery.matches)
    },

    _toggleSwiper(swiperInstance, matches) {
      if (matches) swiperInstance.disable()
      else swiperInstance.enable()
    }
  }
})()
