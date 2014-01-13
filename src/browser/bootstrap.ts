
import Binder = require('./Record/Binder');
import KeyHandler = require('./Record/KeyHandler');
import MouseHandler = require('./Record/MouseHandler');
import Recorder = require('./Record/Recorder');
import Timer = require('./Record/Timer');
import WindowProxy = require('./Record/WindowProxy');

import IDarwinWindow = require('../common/IDarwinWindow');

function bootstrap() {
  var timer = new Timer();
  var windowProxy = new WindowProxy(<IDarwinWindow>window);

  var keyHandler = new KeyHandler(windowProxy, timer);
  var mouseHandler = new MouseHandler(windowProxy, timer);
  var binder = new Binder(window, keyHandler, mouseHandler);

  var recorder = new Recorder(binder, timer);

  recorder.start();
}

bootstrap();