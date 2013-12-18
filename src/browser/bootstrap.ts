
import Handler = require('./Event/Click');
import Monitor = require('./Monitor/Monitor');

function bootstrap() {
  var handler = new Handler();
  var monitor = new Monitor(window, window.console, handler);

  monitor.setup();
}

bootstrap();