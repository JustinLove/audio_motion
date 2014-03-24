define(['leap'], function() {
  var controller

  var right = {
    div: '#right',
  }

  var left = {
    div: '#left',
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


  return {
    right: right,
    left: left,
    create: function() {
      controller = new Leap.Controller()
    },
    start: function() {
      controller.connect()
    },
    stop: function() {
      controller.disconnect()
    },
    poll: function() {
      processFrame(controller.frame())
    }
  }
})
