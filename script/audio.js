define(['jquery'], function($) {
  var context;
  var source;

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
    source.frequency.value = 440
    source.connect(context.destination)
    source.start(0)
  }

  var stop = function() {
    source.stop(0)
    source.disconnect()
    source = null
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
    }
  }
})
