/**
 * prediction.js
 */
;(() => {
  window.jsPrediction = {
    sendPredictionUrl: 'https://xcomfeed.com/fonbet/fasw2025/send-forecast',

    init() {
      window.jsPredictionFirst.init()
      window.jsPredictionSecond.init()
    },

    async sendPrediction(id, answer) {
      const pin = window.userInfo.getClientID()
      if (!pin) {
        console.error('Не получилось отправить прогноз')
        return
      }

      try {
        const req = {
          pin,
          forecast_id: id,
          answer
        }
        const res = await window.jsUtils.sendData(
          this.sendPredictionUrl,
          'POST',
          req
        )

        if (res.error) {
          console.error(res.message)
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
