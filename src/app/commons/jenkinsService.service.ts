/**
 * Created by frdiaz on 02/12/2016.
 */
import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import 'rxjs/Rx';
import {ConfigService} from "./configService";
import {Job} from "../job/job.model";
import {JobsGroup} from "../job/jobsGroup.model";
import {SimpleJob} from "../job/simpleJob.model";
import {JobsBasicViewModel} from "../jobs-basic-view/jobsBasicView.model";

@Injectable()
export class JenkinsService {

  private headers = new Headers({});
  private static readonly endJobsDataUrl: string = 'api/json?tree=jobs[name,url,buildable,lastBuild[*,actions[parameters[*]]]]';
  private static readonly endViewsUrl: string = 'api/json?tree=views[url,name],primaryView[url,name]';
  private invokedUrl: string;
  private resquestOptions: RequestOptions;
  private jobsGroupsFinded= {};
  private jobsGroupsNamesList: string[] = [];

  constructor(private http: Http, private configService: ConfigService) {}

  /**
   * Configures headers to invoke the server
   * @param authentication
   */
  configHeaders(authentication: boolean) {
    if (authentication) {
      console.log('With authentication');
      this.headers.append('Authorization', 'Basic ' + btoa(this.configService.getUser() + ':' + this.configService.getPass()));
    }
    this.headers.append('Content-Type', 'application/json');
    this.resquestOptions = new RequestOptions({
      headers: this.headers,
    })
  }

  /**
   * Retrieves the exists views in Jenkins
   * @param urlJenkins
   * @returns {Observable<R>}
   */
  getViews(urlJenkins: string) {

    let invokeUrl = (urlJenkins !== null && urlJenkins !== undefined && urlJenkins === this.configService.getJenkinsUrl()) ? urlJenkins : this.configService.getJenkinsUrl();
    invokeUrl = invokeUrl  + JenkinsService.endViewsUrl;
    this.configHeaders((urlJenkins === null || urlJenkins === undefined || urlJenkins !== this.configService.getJenkinsUrl()));

    return this.http.post(invokeUrl, undefined, this.resquestOptions)
      .map(response => response.json());
  }

  transformToJovViews(response: Response) {
    let jobViews : JobsBasicViewModel[] = [];

    for (let view of response.json().views){
      jobViews.push(new JobsBasicViewModel(view.url, view.name));
    }

    return jobViews;
  }

  /**
   * Starts retrieving and formatting process of the Jobs State Data.
   * @param urlFolderOfJobs
   * @returns {Observable<R>}
   */
  getJobsStatus(urlFolderOfJobs: string) {
    this.jobsGroupsFinded = {};
    this.jobsGroupsNamesList = [];

    if (urlFolderOfJobs === undefined) {
      this.invokedUrl = this.configService.getJenkinsUrl()  + JenkinsService.endJobsDataUrl;
    }else {
      this.invokedUrl = urlFolderOfJobs + JenkinsService.endJobsDataUrl;
    }

    return this.http.post(this.invokedUrl, undefined, this.resquestOptions)
      .map(response => this.createJobData(response.json().jobs))
  }

  /**
   * Converts backend Jobs Objects in to frontend Jobs Objects
   * @param jobs
   */
  createJobData(jobs: any[]) {

    let jobModelAux: Job[] = [];

    for(let job of jobs){
      if(job !== null){
        if(job.buildable === undefined){
          this.getJobsStatus(job.url);
        }else {
          if (job.lastBuild !== null) {
              this.addJobToAGroup(job);
          }
        }
      }
    }
    for(let group of this.jobsGroupsNamesList){
      if (group === "reminder" || this.jobsGroupsFinded[group].length === 0){
        for (let job of this.jobsGroupsFinded[group]){
          let jobModel = new SimpleJob(job);
          jobModel.setStatusClass();
          jobModelAux.push((jobModel));
        }
      }else{
        let principalJobModel: JobsGroup = new JobsGroup();
        principalJobModel.name = group;
        for (let job of this.jobsGroupsFinded[group]){
          let jobModel = new SimpleJob(job);
          jobModel.setStatusClass();
          if (jobModel.result !=="SUCCESS"){
            principalJobModel.result = jobModel.result;
            console.log("RESULTADO GROUP JOB"+ principalJobModel.result);
          }
          principalJobModel.jobsList.push(jobModel);
        }
        principalJobModel.setStatusClass();
        jobModelAux.push((principalJobModel));
      }
    }
    return jobModelAux;

  }

  /**
   * Adds the job to the correct group, according to a job's parameter.
   * @param job
   */
  addJobToAGroup(job: any) {
    for ( let action of job.lastBuild.actions) {
      if (action._class === undefined || action._class === 'hudson.model.ParametersAction') {

        if (action.parameters !== undefined) {
          for (let i = 0; i < action.parameters.length; i++) {
            if (action.parameters[i].name === 'Jobs_Group') {
              if (this.jobsGroupsFinded[action.parameters[i].value] !== undefined) {
                this.jobsGroupsFinded[action.parameters[i].value].push(job);
              } else {
                this.jobsGroupsNamesList.push(action.parameters[i].value);
                this.jobsGroupsFinded[action.parameters[i].value] = [job];
              }
              break;
            } else {
              if (i === action.parameters.length - 1) {
                if (this.jobsGroupsFinded['reminder'] !== undefined) {
                  this.jobsGroupsFinded['reminder'].push(job);
                } else {
                  this.jobsGroupsNamesList.push('reminder');
                  this.jobsGroupsFinded['reminder'] = [job
                  ];
                }
              }
            }
          }
        }else {
          if (this.jobsGroupsFinded['reminder'] !== undefined) {
            this.jobsGroupsFinded['reminder'].push(job);
          } else {
            this.jobsGroupsNamesList.push('reminder');
            this.jobsGroupsFinded['reminder'] = [job];
          }
        }
        break;
      }
    }
  }

  submitForm() {
    console.log('Sends form to the Server');
  }

}

