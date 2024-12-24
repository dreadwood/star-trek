/**
 * auth.js
 */

;(() => {
  window.jsAuth = {
    init() {
      document.addEventListener('registrationCompleted', (evt) => {
        const clientId = evt.detail.clientId
        if (!clientId) return

        console.log('userInfoUpdated')
      })

      document.addEventListener('userInfoUpdated', (evt) => {
        if (evt.detail.clientId !== evt.detail.prevClientId) {
          console.log('userInfoUpdated')
        }
      })
    }
  }
})()
