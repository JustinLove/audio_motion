define(['jquery'], function($) {
  var context;
  var source;
  var gain;
  var stopFrequencyWobble = function() {}
  var stopGainWobble = function() {}

  var createContext = function() {
    var context

    try {
      // Fix up for prefixing
      window.AudioContext = window.AudioContext||window.webkitAudioContext;
      context = new AudioContext();
    }
    catch(e) {
      alert('Web Audio API is not supported in this browser');
    }

    console.log(context)
    return context
  }

  var start = function() {
    source = context.createOscillator()
    stopFrequencyWobble = wobble(source.frequency, 440, 880, 2)
    source.connect(gain)
    stopGainWobble = wobble(gain.gain, 1.0, 0.1, 5)
    source.start(0)
  }

  var stop = function() {
    stopFrequencyWobble()
    stopGainWobble()
    source.stop(0)
    source.disconnect()
    source = null
  }

  var wobble = function(param, a, b, t) {
    var timeout
    var round = function() {
      param.setValueAtTime(a, context.currentTime)
      param.exponentialRampToValueAtTime(b, context.currentTime + t)
      param.exponentialRampToValueAtTime(a, context.currentTime + t*2)
      timeout = setTimeout(round, 2*t*1000)
    }
    round()
    return function() {
      clearTimeout(timeout)
    }
  }

  $('#play').on('change', function() {
    if ($(this).prop('checked')) {
      start()
    } else {
      stop()
    }
  })

  return {
    ready: function() {
      context = createContext()
      gain = context.createGain()
      gain.connect(context.destination)
    }
  }
})
