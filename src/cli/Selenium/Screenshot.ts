
import fs = require('fs');
import webdriver = require('selenium-webdriver');

class Screenshot {

  constructor(private _fs: typeof fs) {

  }

  public captureAndSave(driver: webdriver.Driver,
                        saveAs: string,
                        onSuccess: () => void) {

    driver.takeScreenshot();
  }

}

export = Screenshot;