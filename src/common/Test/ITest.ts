
import IAction = require('./IAction');

interface ITest {

  options: {
    tolerance: string;
  };
  actions: IAction[];

}

export = ITest;