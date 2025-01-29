/**
 * prediction.js
 */
;(() => {
  window.jsPrediction = {
    sendPredictionUrl: 'https://xcomfeed.com/fonbet/fasw2025/send-forecast',
    getPredictionsUrl: 'https://xcomfeed.com/fonbet/fasw2025/check-forecast',

    init() {
      this.initFirst()
      this.initSecond()
      this.initThird()
      this.initFourth()
      this.initFifth()
    },

    initFirst() {
      const id = 1
      const openBtnList = document.querySelectorAll(
        '.js-predictions-first-open'
      )
      const dialog = document.querySelector('.js-prediction-first-dialog')

      if (openBtnList.length === 0 || !dialog) return
      new window.jsPredictionList.dialog({ id, dialog, openBtnList })
    },

    initSecond() {
      const id = 2
      const openBtnList = document.querySelectorAll(
        '.js-predictions-second-open'
      )
      const dialog = document.querySelector('.js-prediction-second-dialog')

      if (openBtnList.length === 0 || !dialog) return
      // window.jsPredictionSelect.init({ id, dialog, openBtnList })
      new window.jsPredictionSelect.dialog({ id, dialog, openBtnList })
    },

    initThird() {
      const id = 3
      const openBtnList = document.querySelectorAll(
        '.js-predictions-third-open'
      )
      const dialog = document.querySelector('.js-prediction-third-dialog')

      if (openBtnList.length === 0 || !dialog) return
      new window.jsPredictionSelect.dialog({ id, dialog, openBtnList })
    },

    initFourth() {
      const id = 4
      const openBtnList = document.querySelectorAll(
        '.js-predictions-fourth-open'
      )
      const dialog = document.querySelector('.js-prediction-fourth-dialog')

      if (openBtnList.length === 0 || !dialog) return
      new window.jsPredictionField.dialog({ id, dialog, openBtnList })
    },

    initFifth() {
      const id = 5
      const openBtnList = document.querySelectorAll(
        '.js-predictions-fifth-open'
      )
      const dialog = document.querySelector('.js-prediction-fifth-dialog')

      if (openBtnList.length === 0 || !dialog) return
      new window.jsPredictionSelect.dialog({ id, dialog, openBtnList })
    },

    async updatePredictions() {
      const predictionData = await this.getPredictionsData()
      window.jsPage.renderPrediction(predictionData)
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
    },

    async getPredictionsData() {
      const pin = window.userInfo.getClientID()
      if (!pin) {
        console.error('Не получилось получить прогнозы')
        return
      }

      try {
        const req = {
          pin,
          forecast: [1, 2, 3, 4, 5]
        }
        const res = await window.jsUtils.sendData(
          this.getPredictionsUrl,
          'POST',
          req
        )

        if (res.error) {
          console.error(res)
          return false
        }

        return res.result
      } catch (err) {
        console.error(err)
        return false
      }
    }
  }
})()
