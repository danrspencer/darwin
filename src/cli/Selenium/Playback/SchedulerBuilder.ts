
import Scheduler = require('./Scheduler');

class SchedulerBuilder {

  public getScheduler() {
    return new Scheduler();
  }

}

export = SchedulerBuilder;