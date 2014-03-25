define(['jquery'], function($) {
  var targets = [
    {
      id: 'target1',
      size: 50,
      samplePath: 'samples/17__tictacshutup__studio-drums-1/428__tictacshutup__prac-kick.wav',
      gain: 5,
      active: false,
    },
    {
      id: 'target2',
      size: 50,
      samplePath: 'samples/17__tictacshutup__studio-drums-1/421__tictacshutup__prac-hat-2.wav',
      gain: 5,
      active: false,
    },
    {
      id: 'target3',
      size: 50,
      samplePath: 'samples/17__tictacshutup__studio-drums-1/449__tictacshutup__prac-tom.wav',
      gain: 5,
      active: false,
    },
    {
      id: 'target4',
      size: 50,
      samplePath: 'samples/17__tictacshutup__studio-drums-1/447__tictacshutup__prac-snare.wav',
      gain: 5,
      active: false,
    },
  ]

  return {
    targets: targets,
    place: function(audiograph) {
      var $body = $('body')
      var cx = $body.width() / 2
      var cy = $body.height() / 2
      var angle = Math.PI*2/targets.length
      var size = Math.min(cx, cy) / 5
      targets.forEach(function(t, i) {
        t.size = size
        t.x = cx + cx/2 * Math.sin(angle * i)
        t.y = cy + cy/2 * Math.cos(angle * i)
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
    },
    intersect: function(hand, audiograph) {
      targets.forEach(function(t) {
        if (Math.abs(hand.px - t.x) < t.size && Math.abs(hand.py - t.y) < t.size) {
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
    }
  }
})
