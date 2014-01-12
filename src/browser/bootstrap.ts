
import Binder = require('./Record/Binder');
import KeyHandler = require('./Record/KeyHandler');
import MouseHandler = require('./Record/MouseHandler');
import Recorder = require('./Record/Recorder');
import Timer = require('./Record/Timer');

import IDarwinWindow = require('../common/IDarwinWindow');

function bootstrap() {
  var keyHandler = new KeyHandler();
  var mouseHandler = new MouseHandler();
  var binder = new Binder(<IDarwinWindow>window, keyHandler, mouseHandler);

  var timer = new Timer();

  var recorder = new Recorder(binder, timer);

  recorder.start();
}

bootstrap();