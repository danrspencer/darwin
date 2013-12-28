
import fs = require('fs');
import webdriver = require('selenium-webdriver');

class Screenshot {

  constructor(private _fs: typeof fs) {

  }

  public captureAndSave(driver: webdriver.Driver,
                        saveAs: string,
                        callback: () => void) {
    driver
      .takeScreenshot()
      .then((result) => {
        var buffer = new Buffer(result, 'base64');

        this._fs.writeFileSync(saveAs, buffer);

        callback();
      });
  }

}

export = Screenshot;