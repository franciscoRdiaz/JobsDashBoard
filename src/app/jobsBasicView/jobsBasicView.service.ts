/**
 * Created by frdiaz on 02/12/2016.
 */
import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { environment } from "../../environments/environment";
import 'rxjs/Rx';



@Injectable()
export class JobsStatusService {

  private headers = new Headers({});
  private endInitialUrl: string = "api/json";
  private endJobsDataUrl: string = "?tree=jobs[name,url,buildable,lastBuild[*]]";
  private endViewsUrl: string = "?tree=views[url,name],primaryView[url,name]";
  private invokedUrl: string;
  private resquestOptions: RequestOptions;

  constructor(private http: Http){
    this.headers.append("Access-Control-Allow-Credentials", "true");
    this.headers.append("Authorization", "Basic " + btoa(environment.jenkinsUser + ":" + environment.jenkinsPass));
    this.headers.append("Content-Type","application/json");
    this.resquestOptions = new RequestOptions({
      headers: this.headers,
    })
  }

  getViews(){

    let invokeUrl = environment.jenkinsUrl + this.endInitialUrl + this.endViewsUrl;
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

  getJobData(jobUrl:string){
    this.invokedUrl = jobUrl + this.endInitialUrl;
    return this.http.post(this.invokedUrl, undefined, this.resquestOptions).map(
      response => this.extractDataJob(response)
    )
  }

  getJobExecData(jobUrl:string){
    this.invokedUrl = jobUrl + this.endInitialUrl;
    return this.http.post(this.invokedUrl, undefined, this.resquestOptions).map(
      response => this.extractDataJob(response)
    )
  }

  private extractDataJobs(response: Response){
    return response.json().jobs;
  }


  private extractDataJob(response: Response){
    return response.json();
  }
}

