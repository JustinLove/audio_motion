define(['jquery', 'leap'], function($) {
  var context
  var filter
  var delay
  var delayGain
  var volume
  var dest
  var stopFrequencyWobble = function() {}
  var stopVolumeWobble = function() {}
  var stopAnimation = function() {}
  var stopPointing = function() {}

  var controller

  var right = {
    div: '#right',
  }

  var left = {
    div: '#left',
  }

  var targets = [
    {
      id: 'target1',
      x: 600,
      y: 200,
      size: 25,
      frequency: 220,
      active: false,
    },
    {
      id: 'target2',
      x: 700,
      y: 100,
      size: 25,
      frequency: 330,
      active: false,
    },
    {
      id: 'target3',
      x: 800,
      y: 200,
      size: 25,
      frequency: 440,
      active: false,
    },
  ]

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

  var note = function(frequency, t) {
    var vol = context.createGain()
    peak(vol.gain, 0.001, 1, t)
    vol.connect(dest)
    var source = context.createOscillator()
    source.type = 'sine'
    source.frequency.value = frequency
    source.connect(vol)
    source.start(context.currentTime)
    source.stop(context.currentTime + t)
  }

  var start = function() {
    volume.gain.value = 0.1
    volume.connect(context.destination)
    //stopFrequencyWobble = wobble(source.frequency, 110, 440, 4)
    //source.connect(volume)
    //stopVolumeWobble = wobble(volume.gain, 1.0, 0.001, 2)

    //filter = context.createBiquadFilter();
    // Create the audio graph.
    //filter.connect(dest);
    // Create and specify parameters for the low-pass filter.
    //filter.type = 0; // Low-pass filter. See BiquadFilterNode docs
    //filter.frequency.value = 440
    //filter.Q.value = 1


    controller.connect()
    stopAnimation = animate()
    stopPointer = point()
    //note(440, 2)
  }

  var stop = function() {
    controller.disconnect()
    stopFrequencyWobble()
    stopVolumeWobble()
    stopAnimation()
    stopPointing()
    //filter.disconnect()
    //filter = null
    volume.disconnect()
  }

  var peak = function(param, a, b, t) {
    param.setValueAtTime(a, context.currentTime)
    param.exponentialRampToValueAtTime(b, context.currentTime + t/2)
    param.exponentialRampToValueAtTime(a, context.currentTime + t)
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

  var animate = function() {
    var timeout
    var round = function() {
      processFrame(controller.frame())

      //source.frequency.value = 2*rHeight
      //filter.frequency.value = Math.abs(rWidth)
      //filter.Q.value = rWidth/2
      //volume.gain.value = Math.sqrt(Math.max(rDepth, 0))

      delay.delayTime.value = right.height / 400

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

      $('#pointer').css({left: right.x - 25, top: right.y - 25})

      targets.forEach(function(t) {
        if (Math.abs(right.x - t.x) < t.size && Math.abs(right.y - t.y) < t.size) {
          if (!t.active) {
            console.log('hit')
            //note(100 + Math.random() * 550, 2)
            note(t.frequency, 2)
            t.active = true
          }
        } else {
          t.active = false
        }
      })

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
    if (frame.hands.length < 1) return

    frame.hands.forEach(function(hand) {
      if (!right.id && hand.stabilizedPalmPosition[0] > 0) {
        right.id = hand.id
      }

      if (!left.id && hand.stabilizedPalmPosition[0] < 0) {
        left.id = hand.id
      }
    })

    var data

    if (data = frame.handsMap[right.id]) {
      processHand(right, data)
    } else {
      right.id = null
    }

    if (data = frame.handsMap[left.id]) {
      processHand(left, data)
    } else {
      left.id = null
    }
  }

  var processHand = function(hand, data) {
    var $div = $(hand.div)

    //console.log(frame)
    var s = data.stabilizedPalmPosition
    //console.log(s)
    hand.width = s[0]
    hand.height = s[1]
    hand.depth = s[2]

    $div.find('.id').text(hand.id)
    $div.find('.width').text(hand.width)
    $div.find('.height').text(hand.height)
    $div.find('.depth').text(hand.depth)

    if (data.pointables[0]) {
      var t = data.pointables[0].stabilizedTipPosition
      var d = data.pointables[0].direction

      hand.x = t[0] + d[0]*700
      hand.y = t[1] + d[1]*700

      var width = $(document).width() / 2
      var height = $(document).height()

      hand.x = width + hand.x/300 * width
      hand.y = height - hand.y/300 * height

      $div.find('.x').text(right.x)
      $div.find('.y').text(right.y)
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
      volume = context.createGain()
      var echo = context.createGain()
      delay = context.createDelay(2)
      delay.delayTime.value = 0.5
      delayGain = context.createGain()
      delayGain.gain.value = 0.5
      echo.connect(volume)
      echo.connect(delay)
      delay.connect(delayGain)
      delayGain.connect(echo)

      dest = echo

      controller = new Leap.Controller()

      targets.forEach(function(t) {
        $("<div class='target' id="+t.id+"></div>")
          .css({left: t.x - t.size, top: t.y - t.size})
          .appendTo('body')
      })
    }
  }
})
