/**
 * Incomplete and probably inaccurate selenium definition
 */

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
    executeAsyncScript(script: Function): Driver;
    executeAsyncScript(script: string): Driver;
    takeScreenshot(): Driver;
    then: (done: any) => void;
  }

  export module Capabilities {
    export function chrome(): any;
    export function firefox(): any;
  }

  export class Manage {
    window: () => Window;
    timeouts: () => Timeouts;
  }

  export class Window {
    setSize: (x: any,y: any) => Window;
    then: (done: any) => void;
  }

  export class Timeouts {
    setScriptTimeout: (amount: number) => void;
  }

}