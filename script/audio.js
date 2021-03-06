define(['audiograph', 'hands', 'targets', 'draw', 'jquery'],
function(audiograph, hands, targets, draw, $) {
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

      if (hands.left.fingers == 2 || hands.left.fingers == 3) {
        $('#hand').text('V')
        $('.volume').attr('value', audiograph.volume.gain.value = (hands.left.height-50) / 400)
      } else if (hands.left.fingers == 4 || hands.left.fingers == 5) {
        $('#hand').text('E')
        $('.delay').attr('value', audiograph.delay.delayTime.value = hands.left.width / -200)
        $('.delayGain').attr('value', audiograph.delayGain.gain.value = (hands.left.height-50) / 400)
      } else if (hands.left.fingers == 0) {
        $('#hand').text('-')
        $('.volume').attr('value', audiograph.volume.gain.value = 0)
      } else {
        $('#hand').text('')
      }

      audiograph.analyser.getByteFrequencyData(audiograph.fBin)
      draw.plot('freq', audiograph.fBin, 0, 1)
      audiograph.analyser.getByteTimeDomainData(audiograph.tBin)
      draw.plot('time', audiograph.tBin, 128, 0.5)

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
      $('#pointer').clone().attr('id', '').addClass('trail')
        .appendTo('body')
        .fadeOut(500, function() {$(this).remove()})

      targets.intersect(hands.right, audiograph)

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
      $('.volume').attr('value', audiograph.volume.gain.value = 1)
      $('.delayGain').attr('value', audiograph.delayGain.gain.value)
      $('.delay').attr('value', audiograph.delay.delayTime.value)

      hands.create()

      targets.place(audiograph)
    }
  }
})
