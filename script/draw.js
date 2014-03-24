define([], function() {

  var plot = function(id, data, base, baseline) {
    var canvas = document.getElementById(id)
    console.log(canvas)
    var c = canvas.getContext('2d')
    var l = data.length
    c.clearRect(0, 0, canvas.width, canvas.height)
    c.save()
    c.translate(0, canvas.height * baseline)
    c.scale(canvas.width / l, -1)
    c.fillStyle = 'black'
    for (var i = 0;i < l;i++) {
      c.fillRect(i, 0, 1, data[i] - base)
    }
    c.restore()
  }

  return {
    plot: plot
  }
})
