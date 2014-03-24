define([], function() {
  var context
  var stopFrequencyWobble = function() {}
  var stopVolumeWobble = function() {}

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

    //console.log(context)
    return context
  }

  var load = function(url, gain, success) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    request.onload = function() {
      context.decodeAudioData(request.response, function(buffer) {
        buffer.gain = gain
        success(buffer)
      }, function() {
        console.log('decode failed for ', url)
      })
    }
    request.send();
  }

  var play = function(buffer) {
    var source = context.createBufferSource()
    source.buffer = buffer
    source.connect(AG.dest)
    source.start(context.currentTime)
  }

  var peak = function(param, a, b, t) {
    param.setValueAtTime(a, context.currentTime)
    param.exponentialRampToValueAtTime(b, context.currentTime + t/2)
    param.exponentialRampToValueAtTime(a, context.currentTime + t)
  }

  var note = function(frequency, t) {
    var vol = context.createGain()
    peak(vol.gain, 0.001, 1, t)
    vol.connect(AG.dest)
    var source = context.createOscillator()
    source.type = 'sine'
    source.frequency.value = frequency
    source.connect(vol)
    source.start(context.currentTime)
    source.stop(context.currentTime + t)
  }

  var start = function() {
    AG.volume.gain.value = 0.1
    AG.volume.connect(context.destination)
    //stopFrequencyWobble = wobble(source.frequency, 110, 440, 4)
    //source.connect(AG.volume)
    //stopVolumeWobble = wobble(AG.volume.gain, 1.0, 0.001, 2)

    //filter = context.createBiquadFilter();
    // Create the audio graph.
    //filter.connect(dest);
    // Create and specify parameters for the low-pass filter.
    //filter.type = 0; // Low-pass filter. See BiquadFilterNode docs
    //filter.frequency.value = 440
    //filter.Q.value = 1

    //note(440, 2)
  }

  var stop = function() {
    stopFrequencyWobble()
    stopVolumeWobble()
    //filter.disconnect()
    //filter = null
    AG.volume.disconnect()
  }

  var wobble = function(param, a, b, t) {
    var timeout
    var round = function() {
      peak(param, a, b, t)
      timeout = setTimeout(round, t*1000)
    }
    round()
    return function() {
      clearTimeout(timeout)
    }
  }

  var create = function() {
    context = createContext()
    AG.volume = context.createGain()
    var echo = context.createGain()
    AG.delay = context.createDelay(2)
    AG.delay.delayTime.value = 0.0
    AG.delayGain = context.createGain()
    AG.delayGain.gain.value = 0.5
    echo.connect(AG.volume)
    echo.connect(AG.delay)
    AG.delay.connect(AG.delayGain)
    AG.delayGain.connect(echo)

    AG.dest = echo
  }

  var AG = {
    create: create,
    start: start,
    stop: stop,
    note: note,
    load: load,
    play: play,
  }

  return AG
})
