'use strict'

/**
 * utils.js
 */
;(() => {
  window.jsUtils = {
    BREAKPOINT_MOBILE: '(min-width: 768px)',
    BREAKPOINT_TABLET: '(min-width: 1024px)',

    /**
     * show html element
     * @param {HTMLElement} el
     */
    showEl(el) {
      el.removeAttribute('hidden')
    },

    /**
     * hide html element
     * @param {HTMLElement} el
     */
    hideEl(el) {
      el.setAttribute('hidden', 'hidden')
    },

    /**
     * wrapper for fetch
     * @param {string} url
     * @param {string} method
     * @param {JSON} data
     * @returns
     */
    async sendData(url, method = 'GET', data) {
      const options = {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: data ? JSON.stringify(data) : undefined
      }

      try {
        const res = await fetch(url, options)
        return await res.json()
      } catch (err) {
        console.error('Request error:', err)
        throw err
      }
    },

    /**
     * wrapper for fetch
     * @param {string} url
     * @param {string} method
     * @param {FormData} formData
     * @returns
     */
    async sendDataForm(url, formData, method = 'POST') {
      const urlParams = new URLSearchParams(formData)

      const options = {
        method,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: urlParams.toString()
      }

      try {
        const res = await fetch(url, options)
        return await res.json()
      } catch (err) {
        console.error('Request error:', err)
        throw err
      }
    },

    /**
     * Example: 'балл', 'балла', 'баллов'
     * @param {number} number
     * @param {string} one
     * @param {string} few
     * @param {string} many
     * @returns
     */
    pluralize(number, one, few, many) {
      const lastDigit = number % 10
      const lastTwoDigits = number % 100

      switch (true) {
        case lastDigit === 1:
        case lastTwoDigits !== 11:
          return one
        case lastDigit >= 2:
        case lastDigit <= 4:
        case !(lastTwoDigits >= 12 && lastTwoDigits <= 14):
          return few
        default:
          return many
      }
    },

    /**
     * get random integer
     * @param {number} min
     * @param {number} max
     * @returns {number}
     */
    randomInteger(min, max) {
      const rand = min + Math.random() * (max + 1 - min)
      return Math.floor(rand)
    },

    /**
     * @param {(...args: any[]) => T} func
     * @param {number} delay
     * @returns {(...args: any[]) => void}
     */
    throttle(func, delay) {
      let lastCall = 0

      return function (...args) {
        const now = new Date().getTime()

        if (now - lastCall >= delay) {
          lastCall = now
          func.apply(this, args)
        }
      }
    },

    /**
     * @param {HTMLElement[]} list
     * @param {HTMLElement} item
     */
    changeVisibleList(list, item) {
      for (const it in list) {
        if (list[it] === item) window.jsUtils.showEl(list[it])
        else window.jsUtils.hideEl(list[it])
      }
    }
  }
})()
