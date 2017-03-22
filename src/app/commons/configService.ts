import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {ConfigModel} from "./configModel";
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
    let rootUrl:string = this.removeMonitorProPath();
      return new Promise((resolve, reject) => {
        this.http.get(rootUrl+'assets/securityConfig.json')
          .map(res => res.json())
            .catch((error: any): any => {
              this.http.get(rootUrl+'plugin/monitor-pro/assets/securityConfig.json').map(res => res.json())
                .subscribe(data => {
                  this.fillConfigModel(data);
                  // Application execution as Jenkins`s plugin
                  console.log("Deployed as plugin.");
                  resolve();
                });
        })
          .subscribe(data => {
            //Application execution as standalone app
            this.fillConfigModel(data);
            resolve();
          });
      });
  }

  removeMonitorProPath(){
    let url:string = window.location.pathname;
    if (url.indexOf("monitor-pro") > -1){
      url=url.slice(0,url.indexOf("monitor-pro"));
    }
    return url;
  }
  fillConfigModel(res: any){
    this.configModel = new ConfigModel(res.user, res.pass, res.jenkinsUrl);
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
