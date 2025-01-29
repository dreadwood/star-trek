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
  await window.jsScore.init()
  await window.jsAuth.init()
  // window.jsGame.init()
  window.jsPrediction.init()
  window.jsBingo.init()
})()
