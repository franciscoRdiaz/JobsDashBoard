/**
 * Created by frdiaz on 02/12/2016.
 */
import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import 'rxjs/Rx';
import {ConfigService} from "./configService";
import {Job} from "../job/job.model";
import {GroupedJob} from "../job/groupedJob.model";
import {SimpleJob} from "../job/simpleJob.model";
import {JobBasicViewModel} from "../jobsBasicView/jobsBasicView.model";

@Injectable()
export class JenkinsService {

  private headers = new Headers({});
  private endInitialUrl: string = "api/json";
  private endJobsDataUrl: string = "?tree=jobs[name,url,buildable,lastBuild[*,actions[parameters[*]]]]";
  private endViewsUrl: string = "?tree=views[url,name],primaryView[url,name]";
  private invokedUrl: string;
  private resquestOptions: RequestOptions;
  private dynamicObjForGroupJobs= {};
  private listOfJobsGroupsNames: string[] = [];

  constructor(private http: Http, private configService: ConfigService){}

  /**
   * Configures headers to invoke the server
   * @param authentication
   */
  configHeaders(authentication: boolean){
    if(authentication){
      console.log("With authentication");
      this.headers.append("Access-Control-Allow-Credentials", "true");
      this.headers.append("Authorization", "Basic " + btoa(this.configService.getUser() + ":" + this.configService.getPass()));
    }
    this.headers.append("Content-Type","application/json");
    this.resquestOptions = new RequestOptions({
      headers: this.headers,
    })
  }

  /**
   * Retrieves the exists views in Jenkins
   * @param urlJenkins
   * @returns {Observable<R>}
   */
  getViews(urlJenkins:string){

    let invokeUrl = (urlJenkins !== null && urlJenkins !== undefined) ? urlJenkins : this.configService.getJenkinsUrl();
    invokeUrl = invokeUrl + this.endInitialUrl + this.endViewsUrl;
    this.configHeaders((urlJenkins === null || urlJenkins === undefined));

    return this.http.post(invokeUrl, undefined, this.resquestOptions)
      .map(response => response.json());
  }

  transformToJovViews(response: Response){
    let jobViews : JobBasicViewModel[] = [];

    for(let view of response.json().views){
      jobViews.push(new JobBasicViewModel(view.url, view.name));
    }

    return jobViews;
  }

  /**
   * Starts data retriving from the server and initilizes parameters
   */
  getJobsStatus(urlFolderOfJobs:string){
    this.dynamicObjForGroupJobs = {};
    this.listOfJobsGroupsNames = [];

    if(urlFolderOfJobs === undefined){
      this.invokedUrl = this.configService.getJenkinsUrl() + this.endInitialUrl + this.endJobsDataUrl;
    }else{
      this.invokedUrl = urlFolderOfJobs + this.endInitialUrl + this.endJobsDataUrl;
    }

    return this.http.post(this.invokedUrl, undefined, this.resquestOptions)
      .map(response => this.createJobData(response.json().jobs))
  }

  /**
   * Builds presentation jobs and returns them into an array
   * @param jobs
   */
  createJobData(jobs: any[]){

    let jobModelAux: Job[] = [];

    for(let job of jobs){
      if(job !== null){
        if(job.buildable === undefined){
          this.getJobsStatus(job.url);
        }else {
          if (job.lastBuild !== null) {
              this.addToDynamicObjForGroupJobs(job);
          }
        }
      }
    }
    for(let group of this.listOfJobsGroupsNames){
      if (group === "reminder" || this.dynamicObjForGroupJobs[group].length === 0){
        for (let job of this.dynamicObjForGroupJobs[group]){
          let jobModel = new SimpleJob(job);
          jobModel.setStatusClass();
          jobModelAux.push((jobModel));
        }
      }else{
        let principalJobModel: GroupedJob = new GroupedJob();
        principalJobModel.name = group;
        for (let job of this.dynamicObjForGroupJobs[group]){
          let jobModel = new SimpleJob(job);
          jobModel.setStatusClass();
          if (jobModel.result !=="SUCCESS"){
            principalJobModel.result = jobModel.result;
            console.log("RESULTADO GROUP JOB"+ principalJobModel.result);
          }
          principalJobModel.listDifBuildsConfiguration.push(jobModel);
        }
        principalJobModel.setStatusClass();
        jobModelAux.push((principalJobModel));
      }
    }
    return jobModelAux;

  }

  /**
   * Adds the job to the correct group based on a job's parameter.
   * @param job
   */
  addToDynamicObjForGroupJobs(job: any){
    for( let action of job.lastBuild.actions) {
      if (action._class === undefined || action._class === 'hudson.model.ParametersAction') {

        if (action.parameters !== undefined) {
          for (let i = 0; i < action.parameters.length; i++) {
            if (action.parameters[i].name === 'Jobs_Group') {
              if (this.dynamicObjForGroupJobs[action.parameters[i].value] !== undefined) {
                this.dynamicObjForGroupJobs[action.parameters[i].value].push(job);
              } else {
                this.listOfJobsGroupsNames.push(action.parameters[i].value);
                this.dynamicObjForGroupJobs[action.parameters[i].value] = [job];
              }
              break;
            } else {
              if (i === action.parameters.length - 1) {
                if (this.dynamicObjForGroupJobs["reminder"] !== undefined) {
                  this.dynamicObjForGroupJobs["reminder"].push(job);
                } else {
                  this.listOfJobsGroupsNames.push("reminder");
                  this.dynamicObjForGroupJobs["reminder"] = [job];
                }
              }
            }
          }
        }else{
          if (this.dynamicObjForGroupJobs["reminder"] !== undefined) {
            this.dynamicObjForGroupJobs["reminder"].push(job);
          } else {
            this.listOfJobsGroupsNames.push("reminder");
            this.dynamicObjForGroupJobs["reminder"] = [job];
          }
        }
        break;
      }
    }
  }

  submitForm(){
    console.log("Sends form to the Server");
    this.http.post("http://localhost:8080/monitor-pro/prove",undefined, undefined);
  }

}

