/**
 * slider.js
 */
;(() => {
  window.jsSlider = {
    mediaQuery: window.matchMedia(window.jsUtils.BREAKPOINT_TABLET),

    stars: null,

    init() {
      const sliderAmbassadors = document.querySelector('.js-slider-ambassadors')
      const sliderStars = document.querySelector('.js-slider-stars')
      const sliderPrizes = document.querySelector('.js-slider-prizes')
      const sliderChangeAmbassadors = document.querySelector(
        'js-slider-change-ambasador'
      )

      if (sliderAmbassadors) {
        this._ambassadors(sliderAmbassadors)
      }
      if (sliderStars) {
        this._stars(sliderStars)
      }
      if (sliderPrizes) {
        this._prizes(sliderPrizes)
      }
      if (sliderChangeAmbassadors) {
        this._changeAmbasador(sliderChangeAmbassadors)
      }
    },

    _ambassadors(el) {
      // eslint-disable-next-line no-undef
      const swiper = new Swiper(el, {
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

    _stars(el) {
      // eslint-disable-next-line no-undef
      this.stars = new Swiper(el, {
        slidesPerView: 'auto',
        grabCursor: true,
        // initialSlide: 1,
        navigation: {
          prevEl: '.js-slider-stars-prev',
          nextEl: '.js-slider-stars-next'
        }
      })
      this.stars.slideTo(5, 2000)
    },

    _prizes(el) {
      // eslint-disable-next-line no-undef
      new Swiper(el, {
        slidesPerView: 'auto',
        grabCursor: true,
        navigation: {
          prevEl: '.js-slider-prizes-prev',
          nextEl: '.js-slider-prizes-next'
        }
      })
    },

    _changeAmbasador(el) {
      // eslint-disable-next-line no-undef
      const swiper = new Swiper(el, {
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
