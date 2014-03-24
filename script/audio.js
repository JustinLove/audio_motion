define(['audiograph', 'hands', 'jquery'], function(audiograph, hands, $) {
  var stopAnimation = function() {}
  var stopPointing = function() {}

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
    hands.start()

    stopAnimation = animate()
    stopPointer = point()
  }

  var stop = function() {
    audiograph.stop()
    hands.stop()
    stopAnimation()
    stopPointing()
  }

  var animate = function() {
    var timeout
    var round = function() {
      hands.poll()

      //source.frequency.value = 2*rHeight
      //filter.frequency.value = Math.abs(rWidth)
      //filter.Q.value = rWidth/2
      //volume.gain.value = Math.sqrt(Math.max(rDepth, 0))

      audiograph.delay.delayTime.value = hands.left.width / -200
      audiograph.delayGain.gain.value = hands.left.height / 400

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
      hands.poll()

      $('#pointer').css({left: hands.right.x - 25, top: hands.right.y - 25})

      targets.forEach(function(t) {
        if (Math.abs(hands.right.x - t.x) < t.size && Math.abs(hands.right.y - t.y) < t.size) {
          if (!t.active) {
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

      hands.create()

      targets.forEach(function(t) {
        $("<div class='target' id="+t.id+"></div>")
          .css({left: t.x - t.size, top: t.y - t.size})
          .appendTo('body')
      })
    }
  }
})
