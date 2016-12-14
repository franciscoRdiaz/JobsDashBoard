/**
 * Created by frdiaz on 02/12/2016.
 */
import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { environment } from "../../environments/environment";
import 'rxjs/Rx';



@Injectable()
export class JobsStatusService {

  private jobNames: string[] = [];
  private headers = new Headers({});
  private endInitialUrl: string = "api/json";
  private endExecUrl: string = "?tree=builds[url]{0}";
  private bodyUrl: string = "";
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


  getJobsData(){
    this.invokedUrl = environment.jenkinsUrl + this.endInitialUrl;
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

