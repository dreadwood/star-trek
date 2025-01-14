/**
 * index.js
 */
;(async () => {
  window.jsPin.init()
  window.jsHeader.init()
  window.jsSlider.init()
  window.jsDialog.init()
  await window.jsAuth.init()
})()
