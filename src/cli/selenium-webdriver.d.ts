
declare module "selenium-webdriver" {

  export class Builder {

    usingServer(serverUrl: any): Builder;
    withCapabilities(browser: any): Builder;
    build();

  }

  export module Capabilities {

    export function chrome(): any;
  }

  export function manage(): manage;

  interface manage {
    window: () => manage;
    setSize: (x: any,y: any) => manage;
    then: (done: any) => manage;
  }

}