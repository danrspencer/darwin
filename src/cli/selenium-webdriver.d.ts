
declare module "selenium-webdriver" {

  export class Builder {

    usingServer(serverUrl: any): Builder;
    withCapabilities(browser: any): Builder;
    build(): Driver;

  }

  export class Driver {
    manage(): Manage;
    get(url: string): void;
    executeScript(script: string): void;
  }

  export module Capabilities {
    export function chrome(): any;
  }

  export class Manage {
    window: () => Window;
  }

  export class Window {
    setSize: (x: any,y: any) => Window;
    then: (done: any) => Window;
  }

}