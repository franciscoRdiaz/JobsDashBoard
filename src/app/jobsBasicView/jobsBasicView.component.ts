/**
 * Created by frdiaz on 02/12/2016.
 */
import {Component, Input} from '@angular/core';
import { OnInit } from '@angular/core';
import { SimpleJob } from '../job/simpleJob.model';
import { JobsBasicViewConfig } from './jobsBasicViewConfig';
import { JobBasicViewModel } from './jobsBasicView.model';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';
import {JobView} from "../commons/jobView";
import {JenkinsService} from "../commons/jenkinsService.service";
import {FilteredJobsGroupParam} from "../commons/filteredJobsGroupParam";
import {Job} from "../job/job.model";
import {GroupedJob} from "../job/groupedJob.model";

@Component({
  selector: 'jobsBasicView',
  templateUrl: 'jobsBasicView.component.html',
  styleUrls: ['../app.component.css']
})

export class JobsBasicViewComponent implements OnInit{

  @Input()
  private urlJenkins:string;

  private jobsModel: Job[] = [];
  viewConfig: JobsBasicViewConfig;
  views: JobBasicViewModel[] = [];
  jobsViewSelected: JobBasicViewModel;
  titleOfViewDisplay: string ="No view selected jet.";
  timer;
  subscription;
  dynamicObjForGroupJobs= {};
  listOfJobsGroupsNames: string[] = [];

  constructor(private jenkinsService: JenkinsService){}

  /**
   * Initialize the component. Load the initial configuration
   */
  ngOnInit(){
    this.viewConfig = new JobsBasicViewConfig();
  }

  public initLoadJobsStatus(url:string) {
    this.jobsModel = [];
    this.dynamicObjForGroupJobs = {};
    this.listOfJobsGroupsNames = [];
    if (this.subscription !== undefined){
      this.subscription.unsubscribe();
    }
    this.getJobsStatus(url);
    this.timer = Observable.interval(this.viewConfig.pollingIntervalInMilSecond);
    this.subscription = this.timer
      .subscribe(() => {
        this.jobsModel = [];
        this.dynamicObjForGroupJobs = {};
        this.listOfJobsGroupsNames = [];
        this.getJobsStatus(url);
    });
  }
  /**
   * Loads jobs from root or a folder
   */
  getJobsStatus(urlFolderOfJobs:string){

    this.jenkinsService.getJobsData(urlFolderOfJobs)
      .subscribe(jobs => this.createJobData(jobs),
        error => console.log("There are't jobs.")
      );
  }

  /**
   * Builds and fills jobs object
   * @param jobs
   */
  createJobData(jobs: any[]){

    for(let job of jobs){
      if(job !== null){
        if(job.buildable === undefined){
          this.getJobsStatus(job.url);
        }else {
          if (job.lastBuild !== null) {
            let validJob = true;
            if (this.viewConfig.filteredJobsGroupParam!==undefined && this.viewConfig.filteredJobsGroupParam.checkedByJogsGroupParam){
              validJob = this.passFilteredByJobsGroupParameter(job);
            }
            if (validJob){
              this.addToDynamicObjForGroupJobs(job);
            }
          }
        }
      }
    }
    for(let group of this.listOfJobsGroupsNames){
      if (group === "reminder" || this.dynamicObjForGroupJobs[group].length === 0){
        for (let job of this.dynamicObjForGroupJobs[group]){
          let jobModel = new SimpleJob();
          jobModel.name = job.name;
          jobModel.urlJob = job.url;
          jobModel.urlJobExecution = job.lastBuild.url;
          jobModel.lastExecTime = job.lastBuild.duration;
          jobModel.result = job.lastBuild.result;
          jobModel.timestamp = job.lastBuild.timestamp;
          jobModel.displayLastExecNumber = job.lastBuild.displayName;
          jobModel.setStatusClass();
          this.jobsModel.push(jobModel);
        }
      }else{
        let principalJobModel: GroupedJob = new GroupedJob();
        principalJobModel.name = group;
        //let groupedJobStatus:string = ""
        for (let job of this.dynamicObjForGroupJobs[group]){
          let jobModel = new SimpleJob();
          jobModel.name = job.name;
          jobModel.urlJob = job.url;
          jobModel.urlJobExecution = job.lastBuild.url;
          jobModel.lastExecTime = job.lastBuild.duration;
          jobModel.result = job.lastBuild.result;
          jobModel.timestamp = job.lastBuild.timestamp;
          jobModel.displayLastExecNumber = job.lastBuild.displayName;
          jobModel.setStatusClass();
          if (jobModel.result !=="SUCCESS"){
            principalJobModel.result = jobModel.result;
            console.log("RESULTADO GROUP JOB"+ principalJobModel.result);
          }
          principalJobModel.listDifBuildsConfiguration.push(jobModel);
        }
        principalJobModel.setStatusClass();
        this.jobsModel.push(principalJobModel);
      }
    }
  }

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

  passFilteredByJobsGroupParameter(job: any){

    let pass: boolean = false;

    for( let action of job.lastBuild.actions){
      if(action._class === 'hudson.model.ParametersAction' ){
        for(let parameter of action.parameters){
          if (parameter.name === 'Jobs_Group' && parameter.value === this.viewConfig.filteredJobsGroupParam.jobsGroupParamValue){
            pass = true;
            break;
          }
        }
        break;
      }
    }
    return pass;
  }

  /**
   * Sets the number of columns to the view
   */
  setColumnsLayout(numColumnsSelected: number){
    this.viewConfig.classColumn = "columns-"+ numColumnsSelected;

  }

  /**
   * Loads data of selected view.
   */
  loadViewSelected(jobsViewSelected: JobView){
    this.titleOfViewDisplay = jobsViewSelected.name;
    this.initLoadJobsStatus(jobsViewSelected.url);
    this.jobsViewSelected = jobsViewSelected;
  }

  /**
   * Changes value of polling interval and data reload
   */
  setPollingInterval(pollingIntervalInSec: number){
    this.viewConfig.pollingIntervalInMilSecond = pollingIntervalInSec * 1000;
    this.initLoadJobsStatus(this.jobsViewSelected.url);
  }

  /**
   * Sets the flag value to filter jobs by JobsGroup parameter
   * @param filtered
   */
  selectFilterByJobsGroupParam(filteredJobsGroupPara: FilteredJobsGroupParam){
    this.viewConfig.filteredJobsGroupParam = filteredJobsGroupPara;
    this.initLoadJobsStatus(this.jobsViewSelected.url);
  }

}
