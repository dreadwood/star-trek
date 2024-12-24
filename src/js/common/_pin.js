/**
 * pin.js
 */
;(() => {
  window.jsPin = {
    init() {
      let regFlag = false

      let refreshIntervalId = setInterval(() => {
        if (typeof window.registrationApi !== 'undefined') regFlag = true
        if (regFlag) {
          clearInterval(refreshIntervalId)
          document.dispatchEvent(new Event('registrationInit'))
          // eslint-disable-next-line no-undef
          registrationApi.onRegistrationStateChanged = (state) => {
            console.log('registrationApi state', state)
          }
          // eslint-disable-next-line no-undef
          registrationApi.onRegistrationCompleted = (clientId) => {
            document.dispatchEvent(
              new CustomEvent('registrationCompleted', {
                detail: { clientId: clientId }
              })
            )
            console.log('Registration completed', clientId)
          }
        }
      }, 500)

      const userInfo = (() => {
        let clientId = null
        let prevClientId = null
        let fsid = null

        const getCookie = (name) => {
          const matches = document.cookie.match(
            new RegExp(
              `(?:^|; )${name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1')}=([^;]*)`
            )
          )
          return matches ? decodeURIComponent(matches[1]) : undefined
        }

        const getParameterByName = (name, url = window.location.href) => {
          name = name.replace(/[[\]]/g, '\\$&')
          const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`)
          const results = regex.exec(url)
          if (!results) return null
          if (!results[2]) return ''
          return decodeURIComponent(results[2].replace(/\+/g, ' '))
        }

        const setClientID = () => {
          prevClientId = clientId
          clientId =
            getParameterByName('clientId') ||
            getCookie('headerApi.cid') ||
            getParameterByName('fsid')
        }

        const setFSID = () => {
          fsid = getCookie('headerApi.fsid') || getCookie('headerApi.FSID')
        }

        const handleVisibilityChange = () => {
          if (document.visibilityState === 'visible') {
            setClientID()
            const event = new CustomEvent('userInfoUpdated', {
              detail: {
                clientId,
                prevClientId
              }
            })
            document.dispatchEvent(event)
          }
        }

        setClientID()
        setFSID()

        document.addEventListener('visibilitychange', handleVisibilityChange)

        return {
          getClientID: () => clientId,
          getPrevClientID: () => prevClientId,
          setClientID,
          getFSID: () => fsid,
          setFSID,
          handleVisibilityChange
        }
      })()

      window.userInfo = userInfo
    }
  }
})()
