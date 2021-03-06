define(['jquery', 'draw'], function($, draw) {
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
    {
      id: 'target5',
      size: 50,
      note: 440,
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
      var size = Math.max(cx, cy) / 10
      targets.forEach(function(t, i) {
        t.size = size
        t.x = cx + cx/2 * Math.sin(angle * i)
        t.y = cy + cy/2 * Math.cos(angle * i)
        $("<canvas class='target' id="+t.id+"></canvas>")
          .attr('width', t.size*2)
          .attr('height', t.size*2)
          .css({
            left: t.x - t.size,
            top: t.y - t.size,
            width: t.size*2,
            height: t.size*2,
          })
        .appendTo('body')

        if (t.samplePath) {
          audiograph.load(t.samplePath, t.gain, function(buffer) {
            draw.wave(t.id, buffer.getChannelData(0))
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
            $('#'+t.id).addClass('active')
            t.active = true
            setTimeout(function() {
              t.active = false
              $('#'+t.id).removeClass('active')
            }, 500)
          }
        } else {
          //t.active = false
        }
      })
    }
  }
})
