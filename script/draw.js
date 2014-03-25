define([], function() {

  var plot = function(id, data, base, baseline) {
    var canvas = document.getElementById(id)
    var c = canvas.getContext('2d')
    var l = data.length
    c.clearRect(0, 0, canvas.width, canvas.height)
    c.save()
    c.translate(0, canvas.height * baseline)
    c.scale(canvas.width / l, -1)
    c.fillStyle = 'black'
    c.beginPath()
    c.moveTo(l, 0)
    c.lineTo(0, 0)
    for (var i = 0;i < l;i++) {
      c.lineTo(i, data[i] - base)
    }
    c.closePath()
    c.fill()
    c.restore()
  }

  return {
    plot: plot
  }
})
