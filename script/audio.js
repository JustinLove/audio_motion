define(['jquery', 'leap'], function($) {
  var context
  var source
  var filter
  var gain
  var stopFrequencyWobble = function() {}
  var stopGainWobble = function() {}
  var stopAnimation = function() {}
  var stopPointing = function() {}


  var controller
  var rWidth
  var rHeight
  var rDepth
  var rx
  var ry

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
    gain.gain.value = 0.5
    //stopFrequencyWobble = wobble(source.frequency, 110, 440, 2)
    //source.connect(gain)
    //stopGainWobble = wobble(gain.gain, 1.0, 0.1, 5)

    filter = context.createBiquadFilter();
    // Create the audio graph.
    source.connect(filter);
    filter.connect(gain);
    // Create and specify parameters for the low-pass filter.
    filter.type = 0; // Low-pass filter. See BiquadFilterNode docs
    filter.frequency.value = 440
    filter.Q.value = 1

    //source.start(0)

    controller.connect()
    //stopAnimation = animate()
    stopPointer = point()
  }

  var stop = function() {
    controller.disconnect()
    stopFrequencyWobble()
    stopGainWobble()
    stopAnimation()
    stopPointing()
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

  var animate = function() {
    var timeout
    var round = function() {
      processFrame(controller.frame())

      source.frequency.value = 2*rHeight
      //filter.frequency.value = Math.abs(rWidth)
      filter.Q.value = rWidth/2
      //gain.gain.value = Math.sqrt(Math.max(rDepth, 0))

      timeout = setTimeout(round, 100)
    }
    round()
    return function() {
      clearTimeout(timeout)
    }
  }

  var point = function() {
    var run = true
    var round = function() {
      processFrame(controller.frame())

      var $pointer = $('#pointer')

      $pointer.css('left', rx)
      $pointer.css('top', ry)

      if (run) {
        requestAnimationFrame(round)
      }
    }
    round()
    return function() {
      run = false
    }
  }

  var processFrame = function(frame) {
    if (frame.hands[0]) {
      var s = frame.hands[0].stabilizedPalmPosition
      //console.log(s)
      rWidth = s[0]
      rHeight = s[1]
      rDepth = s[2]

      $('#width').text(rWidth)
      $('#height').text(rHeight)
      $('#depth').text(rDepth)
    }

    if (frame.pointables[0]) {
      var t = frame.pointables[0].stabilizedTipPosition
      var d = frame.pointables[0].direction

      rx = t[0] + d[0]*700
      ry = t[1] + d[1]*700

      var width = $(document).width() / 2
      var height = $(document).height()

      rx = width + rx/300 * width
      ry = height - ry/300 * height

      $('#rx').text(rx)
      $('#ry').text(ry)
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

      controller = new Leap.Controller()

      console.log($(document).width())
    }
  }
})
