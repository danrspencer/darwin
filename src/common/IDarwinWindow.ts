
import IDarwinObject = require('./IDarwinObject');

interface IDarwinWindow extends Window {
  __darwin: IDarwinObject
}

export = IDarwinWindow;