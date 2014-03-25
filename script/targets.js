define(['jquery'], function($) {
  var targets = [
    {
      id: 'target1',
      x: 400,
      y: 300,
      size: 50,
      samplePath: 'samples/17__tictacshutup__studio-drums-1/428__tictacshutup__prac-kick.wav',
      gain: 5,
      active: false,
    },
    {
      id: 'target2',
      x: 600,
      y: 100,
      size: 50,
      samplePath: 'samples/17__tictacshutup__studio-drums-1/421__tictacshutup__prac-hat-2.wav',
      gain: 5,
      active: false,
    },
    {
      id: 'target3',
      x: 800,
      y: 300,
      size: 50,
      samplePath: 'samples/17__tictacshutup__studio-drums-1/449__tictacshutup__prac-tom.wav',
      gain: 5,
      active: false,
    },
    {
      id: 'target4',
      x: 600,
      y: 500,
      size: 50,
      samplePath: 'samples/17__tictacshutup__studio-drums-1/447__tictacshutup__prac-snare.wav',
      gain: 5,
      active: false,
    },
  ]

  return {
    targets: targets,
    place: function(audiograph) {
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
