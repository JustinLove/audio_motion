define(['audiograph', 'jquery', 'leap'], function(audiograph, $) {
  var controller
  var stopAnimation = function() {}
  var stopPointing = function() {}

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

  var start = function() {
    audiograph.start()

    controller.connect()
    stopAnimation = animate()
    stopPointer = point()
  }

  var stop = function() {
    audiograph.stop()
    controller.disconnect()
    stopAnimation()
    stopPointing()
  }

  var animate = function() {
    var timeout
    var round = function() {
      processFrame(controller.frame())

      //source.frequency.value = 2*rHeight
      //filter.frequency.value = Math.abs(rWidth)
      //filter.Q.value = rWidth/2
      //volume.gain.value = Math.sqrt(Math.max(rDepth, 0))

      audiograph.delay.delayTime.value = left.width / -200
      audiograph.delayGain.gain.value = left.height / 400

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
            //audiograph.note(100 + Math.random() * 550, 2)
            audiograph.note(t.frequency, 2)
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
    hand.height = s[1] - 50
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
      audiograph.create()

      controller = new Leap.Controller()

      targets.forEach(function(t) {
        $("<div class='target' id="+t.id+"></div>")
          .css({left: t.x - t.size, top: t.y - t.size})
          .appendTo('body')
      })
    }
  }
})
