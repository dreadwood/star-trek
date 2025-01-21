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
    }
  }
})()
