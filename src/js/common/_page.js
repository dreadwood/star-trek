/**
 * page.js
 */
;(() => {
  window.jsPage = {
    renderGameCard(gameData) {
      const gameCardList = document.querySelectorAll('.js-game-card')

      gameCardList.forEach((card) => {
        const index = card.dataset.order - 1
        const stateList = card.querySelectorAll('.js-game-card-state')

        stateList.forEach((it) => {
          if (!gameData[index].user.has_answer) return

          if (it.dataset.state !== 'done') {
            window.jsUtils.hideEl(it)
          } else {
            window.jsUtils.showEl(it)
          }
        })
      })
    }
  }
})()
