define(['jquery'], function($) {
  var context;
  var source;
  var gain;

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
    source.frequency.setValueAtTime(440, context.currentTime)
    wobble()
    source.connect(gain)
    //gain.gain.setValueAtTime(1.0, context.currentTime)
    //gain.gain.exponentialRampToValueAtTime(0.1, context.currentTime + 5)
    source.start(0)
  }

  var stop = function() {
    if (wobbler) clearTimeout(wobbler)
    source.stop(0)
    source.disconnect()
    source = null
  }

  var wobbler
  var wobble = function() {
    source.frequency.exponentialRampToValueAtTime(880, context.currentTime + 2)
    source.frequency.exponentialRampToValueAtTime(440, context.currentTime + 4)
    wobbler = setTimeout(wobble, 4*1000)
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
