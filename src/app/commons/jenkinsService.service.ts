/**
 * Created by frdiaz on 02/12/2016.
 */
import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { environment } from "../../environments/environment";
import 'rxjs/Rx';

@Injectable()
export class JenkinsService {

  private headers = new Headers({});
  private endInitialUrl: string = "api/json";
  private endJobsDataUrl: string = "?tree=jobs[name,url,buildable,lastBuild[*,actions[parameters[*]]]]";
  private endViewsUrl: string = "?tree=views[url,name],primaryView[url,name]";
  private invokedUrl: string;
  private resquestOptions: RequestOptions;

  constructor(private http: Http){

  }

  configHeaders(authentication: boolean){

    if(authentication){
      console.log("With authentication");
      this.headers.append("Access-Control-Allow-Credentials", "true");
      this.headers.append("Authorization", "Basic " + btoa(environment.jenkinsUser + ":" + environment.jenkinsPass));
    }
    this.headers.append("Content-Type","application/json");
    this.resquestOptions = new RequestOptions({
      headers: this.headers,
    })
  }

  getViews(urlJenkins:string){

    let invokeUrl = (urlJenkins !== null && urlJenkins !== undefined) ? urlJenkins : environment.jenkinsUrl;
    invokeUrl = invokeUrl + this.endInitialUrl + this.endViewsUrl;
    this.configHeaders((urlJenkins === null || urlJenkins === undefined));
    console.log("URL del api de las vistas: " + invokeUrl);

    return this.http.post(invokeUrl, undefined, this.resquestOptions).map(
      response => response.json()
    )
  }

  /**
   *
   * @returns {Observable<R>}
   */
  getJobsData(urlFolderOfJobs:string){
    if(urlFolderOfJobs === undefined){
      this.invokedUrl = environment.jenkinsUrl + this.endInitialUrl + this.endJobsDataUrl;
    }else{
      this.invokedUrl = urlFolderOfJobs + this.endInitialUrl + this.endJobsDataUrl;
    }

    return this.http.post(this.invokedUrl, undefined, this.resquestOptions).map(
      response => this.extractDataJobs(response)
    )
  }

  private extractDataJobs(response: Response){
    return response.json().jobs;
  }

  submitForm(){
    console.log("Enviamos el formulario al servidor");
    this.http.post("http://localhost:8080/monitor-pro/prove",undefined, undefined);
  }

}

