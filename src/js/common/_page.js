/**
 * page.js
 */
;(() => {
  window.jsPage = {
    renderGameCard(gameData) {
      const gameCardList = document.querySelectorAll('.js-game-card')
      // const moscowDate = window.jsUtils.getMoscowDate()

      gameCardList.forEach((card) => {
        const closeMsg = card.querySelector('.js-game-card-state-close')
        const openMsg = card.querySelector('.js-game-card-state-open')
        const doneMsg = card.querySelector('.js-game-card-state-done')

        const index = card.dataset.order - 1
        const hasAnswer = gameData[index].user.has_answer

        // const dateOpen = new Date(gameData[index].started_at)
        // const isOpen = moscowDate >= dateOpen

        if (hasAnswer) {
          window.jsUtils.hideEl(closeMsg)
          window.jsUtils.hideEl(openMsg)
          window.jsUtils.showEl(doneMsg)
          return
        }

        // if (isOpen) {
        //   window.jsUtils.hideEl(closeMsg)
        //   window.jsUtils.showEl(openMsg)
        //   window.jsUtils.hideEl(doneMsg)
        // }
      })
    },

    renderHeader(pin, score) {
      const idWrp = document.querySelector('.js-header-id-wrp')
      const idText = document.querySelector('.js-header-id-text')
      const scoreWrp = document.querySelector('.js-header-score-wrp')
      const headerBtn = document.querySelector('.js-header-btn')
      const scoreText = document.querySelector('.js-header-score-text')
      const btnLogin = document.querySelector('.js-header-login')

      idText.textContent = pin
      scoreText.textContent = score
      headerBtn.classList.add('auth')
      window.jsUtils.showEl(idWrp)
      window.jsUtils.showEl(scoreWrp)
      window.jsUtils.hideEl(btnLogin)
    },

    renderScore(score) {
      const scoreText = document.querySelector('.js-header-score-text')
      scoreText.textContent = score
    },

    renderAmbasador(ambasador) {
      const cardAmbasador = document.querySelector('.js-card-ambasador')
      const ambasadorTestList = cardAmbasador.querySelectorAll(
        '.js-card-ambasador-img'
      )
      const ambasadorMsgList = document.querySelectorAll('.js-msg-ambasador')
      const ambasadorQuizList = document.querySelectorAll('.js-quiz-ambasador')

      const existTestAmbasador = [...ambasadorTestList].some(
        (it) => it.dataset.person === ambasador
      )
      const existMsgAmbasador = [...ambasadorMsgList].some(
        (it) => it.dataset.person === ambasador
      )
      const existQuizAmbasador = [...ambasadorQuizList].some(
        (it) => it.dataset.person === ambasador
      )

      if (existTestAmbasador) {
        ambasadorTestList.forEach((it) => {
          if (it.dataset.person === ambasador) {
            window.jsUtils.showEl(it)
          } else {
            window.jsUtils.hideEl(it)
          }
        })
      }

      if (existMsgAmbasador) {
        ambasadorMsgList.forEach((it) => {
          if (it.dataset.person === ambasador) {
            window.jsUtils.showEl(it)
          } else {
            window.jsUtils.hideEl(it)
          }
        })
      }

      if (existQuizAmbasador) {
        ambasadorQuizList.forEach((it) => {
          if (it.dataset.person === ambasador) {
            window.jsUtils.showEl(it)
          } else {
            window.jsUtils.hideEl(it)
          }
        })
      }

      window.jsUtils.showEl(cardAmbasador)
    }
  }
})()
