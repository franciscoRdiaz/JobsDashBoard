import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {ConfigModel} from "./configModel";
import {isNullOrUndefined} from "util";
/**
 * Created by frdiaz on 07/01/2017.
 */

@Injectable()
export class ConfigService {

 private configModel: ConfigModel;

  constructor(private http: Http){
    //this.configModel = new ConfigModel();
  }

  /**
   * Load security configuration data from file
   * @returns {Promise<T>}
   */
  load(){
    console.log(window.location.toString());
    let rootUrl:string = window.location.pathname;
      return new Promise((resolve, reject) => {
        this.http.get(rootUrl+'assets/securityConfig.json')
          .map(res => res.json())
            .catch((error: any): any => {
              console.log("Deployed as plugin.");
              resolve();
        })
          .subscribe(data => {
            //Application run as standalone app
            this.fillConfigModel(data);
            resolve();
          });
      });
  }

  /**removeMonitorProFromPath(){
    let url:string = window.location.pathname;
    if (url.indexOf("monitor-pro") > -1){
      url=url.slice(0,url.indexOf("monitor-pro"));
    }
    return url;
  }*/
  fillConfigModel(res: any){
    if( !isNullOrUndefined(res)) {
      this.configModel = new ConfigModel(res.user, res.pass, res.jenkinsUrl);
    }
    return this.configModel;
  }

  getUser(){
    return this.configModel.user;
  }

  getPass(){
    return this.configModel.pass;
  }
  getJenkinsUrl(){
    return this.configModel.jenkinsUrl;
  }

}
