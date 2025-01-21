/**
 * index.js
 */
;(async () => {
  window.jsState.getLocal()
  //
  window.jsPin.init()
  window.jsHeader.init()
  window.jsSlider.init()
  window.jsDialog.init()
  await window.jsAuth.init()
  window.jsScore.init()
  window.jsGame.init()
})()
