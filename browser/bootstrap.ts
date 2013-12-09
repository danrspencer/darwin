
import Handler = require('com/Event/Click');
import Main = require('com/Main');

function bootstrap() {
  var handler = new Handler();
  var main = new Main(window, window.console, handler);

  main.setup();
}

export = bootstrap;
