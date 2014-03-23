define(['jquery'], function($) {
  var context
  var source
  var filter
  var gain
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
    stopFrequencyWobble = wobble(source.frequency, 110, 440, 2)
    //source.connect(gain)
    //stopGainWobble = wobble(gain.gain, 1.0, 0.1, 5)

    filter = context.createBiquadFilter();
    // Create the audio graph.
    source.connect(filter);
    filter.connect(context.destination);
    // Create and specify parameters for the low-pass filter.
    filter.type = 0; // Low-pass filter. See BiquadFilterNode docs
    filter.frequency.value = 220
    filter.Q.value = 1

    source.start(0)
  }

  var stop = function() {
    stopFrequencyWobble()
    stopGainWobble()
    filter.disconnect()
    filter = null
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
      //gain = context.createGain()
      //gain.connect(context.destination)
    }
  }
})
