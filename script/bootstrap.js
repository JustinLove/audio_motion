require.config({
  paths: {
    jquery: 'lib/ext/jquery-2.1.0',
    leap: 'lib/ext/leap',
  }
})
require(['audio', 'jquery', 'lib/ext/es5-shim'], function(audio, $) {
  "use strict";

  $(audio.ready)
})

