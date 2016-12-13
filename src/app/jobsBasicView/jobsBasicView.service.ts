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
  private endInitialUrl: string = "api/json?pretty=true";
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


  configureCall(endUrl:string, bodyUrl:string){
    this.invokedUrl = environment.jenkinsUrl + bodyUrl+ endUrl;
  }

  getJobsData(){
    this.configureCall(this.endInitialUrl, this.bodyUrl);
    return this.http.post(this.invokedUrl, undefined, this.resquestOptions).map(
      response => this.extractDataJobs(response)
    )
  }

  getJobData(jobName:string){
    this.configureCall(this.endInitialUrl, this.createBodyUrl(jobName, undefined));
    return this.http.post(this.invokedUrl, undefined, this.resquestOptions).map(
      response => this.extractDataJob(response)
    )
  }

  createBodyUrl(jobName:string, execNumber: number){
    if(execNumber == undefined) {
      this.bodyUrl = "job/" + jobName + "/" ;
    }else{
      this.bodyUrl = "job/" + jobName + "/" + execNumber + "/";
    }
    return this.bodyUrl;
  }

  getJobExecData(jobName:string, execNumber){
    let exec:boolean = false;
    this.configureCall(this.endInitialUrl, this.createBodyUrl(jobName, execNumber));
    return this.http.post(this.invokedUrl, undefined, this.resquestOptions).map(
      response => this.extractDataJob(response)
    )
  }

  private extractDataJobs(response: Response){
    return response.json().jobs;
  }


  private extractDataJob(response: Response){
//   return response.json().jobs.map(job => job.lastBuild);
    // TODO Delete this code line --console.log("NUMERO DE CONSTRUCCIÓN: "+ response.json().lastBuild.number);
    return response.json();
  }
}

