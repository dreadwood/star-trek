/**
 * slider.js
 */
;(() => {
  window.jsSlider = {
    /** @type {MediaQueryList} */
    mediaQuery: window.matchMedia(window.jsUtils.BREAKPOINT_TABLET),

    init() {
      this.ambassadors()
      this.stars()
      this.prizes()
    },

    ambassadors() {
      // eslint-disable-next-line no-undef
      const swiper = new Swiper('.js-slider-ambassadors', {
        slidesPerView: 'auto',
        grabCursor: true,
        navigation: {
          prevEl: '.js-slider-ambassadors-prev',
          nextEl: '.js-slider-ambassadors-next'
        }
      })

      /**
       * @param {boolean} matches
       */
      function toogleSlider(matches) {
        if (matches) {
          swiper.disable()
        } else {
          swiper.enable()
        }
      }

      this.mediaQuery.addEventListener('change', (evt) =>
        toogleSlider(evt.matches)
      )
      toogleSlider(this.mediaQuery.matches)
    },

    stars() {
      // eslint-disable-next-line no-undef
      new Swiper('.js-slider-stars', {
        slidesPerView: 'auto',
        grabCursor: true,
        initialSlide: 5,
        navigation: {
          prevEl: '.js-slider-stars-prev',
          nextEl: '.js-slider-stars-next'
        },
        on: {
          update(swiper) {
            swiper.slideNext()
          }
        }
      })

      // /**
      //  * @param {boolean} matches
      //  */
      // function toogleSlider(matches) {
      //   if (matches) {
      //     swiper.disable()
      //   } else {
      //     swiper.enable()
      //   }
      // }

      // this.mediaQuery.addEventListener('change', (evt) =>
      //   toogleSlider(evt.matches)
      // )
      // toogleSlider(this.mediaQuery.matches)
    },

    prizes() {
      // eslint-disable-next-line no-undef
      new Swiper('.js-slider-prizes', {
        slidesPerView: 'auto',
        grabCursor: true,
        navigation: {
          prevEl: '.js-slider-prizes-prev',
          nextEl: '.js-slider-prizes-next'
        }
      })
    }
  }
})()
