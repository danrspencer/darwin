
import Handler = require('./Event/Handler');
import Monitor = require('./Monitor/Monitor');

import IDarwinWindow = require('../common/IDarwinWindow');

function bootstrap() {
  var handler = new Handler();
  var monitor = new Monitor(<IDarwinWindow>window, window.console, handler);

  monitor.setup();
}

bootstrap();