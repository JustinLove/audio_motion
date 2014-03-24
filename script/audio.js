define(['audiograph', 'hands', 'targets', 'jquery'],
function(audiograph, hands, targets, $) {
  var stopAnimation = function() {}
  var stopPointing = function() {}

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

      $('#hand').css({left: hands.left.hx - 100, top: hands.left.hy - 100})

      //source.frequency.value = 2*rHeight
      //filter.frequency.value = Math.abs(rWidth)
      //filter.Q.value = rWidth/2
      //volume.gain.value = Math.sqrt(Math.max(rDepth, 0))

      if (hands.left.fingers == 4 || hands.left.fingers == 5) {
        $('#hand').text('V')
        audiograph.volume.gain.value = (hands.left.height-50) / 400
      } else if (hands.left.fingers == 2 || hands.left.fingers == 3) {
        $('#hand').text('E')
        audiograph.delay.delayTime.value = hands.left.width / -200
        audiograph.delayGain.gain.value = (hands.left.height-50) / 400
      } else if (hands.left.fingers == 0) {
        $('#hand').text('-')
        audiograph.volume.gain.value = 0
      } else {
        $('#hand').text('')
      }

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

        $('#pointer').css({left: hands.right.px - 25, top: hands.right.py - 25})

        targets.forEach(function(t) {
          if (Math.abs(hands.right.px - t.x) < t.size && Math.abs(hands.right.py - t.y) < t.size) {
            if (!t.active) {
              //audiograph.note(100 + Math.random() * 550, 2)
              if (t.sample) {
                audiograph.play(t.sample)
              } else {
                audiograph.note(t.frequency, 2)
              }
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
            .css({
              left: t.x - t.size,
              top: t.y - t.size,
              width: t.size*2,
              height: t.size*2,
            })
          .appendTo('body')
        if (t.samplePath) {
          audiograph.load(t.samplePath, t.gain, function(buffer) {
            t.sample = buffer
          })
        }
      })
    }
  }
})
