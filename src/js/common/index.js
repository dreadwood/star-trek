/**
 * index.js
 */
;(async () => {
  window.jsGame.getLocal()
  //
  window.jsPin.init()
  window.jsHeader.init()
  window.jsSlider.init()
  window.jsDialog.init()
  await window.jsAuth.init()
  window.jsGame.init()
})()
