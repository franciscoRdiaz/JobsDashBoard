/**
 * Created by frdiaz on 02/12/2016.
 */
import {Component, Input} from '@angular/core';
import { OnInit } from '@angular/core';
import { JobModel } from '../job/job.model';
import { JobsBasicViewConfig } from './jobsBasicViewConfig';
import { JobBasicViewModel } from './jobsBasicView.model';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';
import {JobView} from "../commons/jobView";
import {JenkinsService} from "../commons/jenkinsService.service";

@Component({
  selector: 'jobsBasicView',
  templateUrl: 'jobsBasicView.component.html',
  styleUrls: ['../app.component.css']
})

export class JobsBasicViewComponent implements OnInit{

  @Input()
  private urlJenkins:string;

  private jobsModel: JobModel[] = [];
  viewConfig: JobsBasicViewConfig;
  views: JobBasicViewModel[] = [];
  jobsViewSelected: JobBasicViewModel;
  titleOfViewDisplay: string ="No se ha seleccionado ninguna vista todavía.";
  timer;
  subscription;

  constructor(private jenkinsService: JenkinsService){}

  /**
   * Initialize the component. Load the initial configuration
   */
  ngOnInit(){
    console.log("URL JENKINS FROM JOBSBASICVIEW:"+this.urlJenkins);
    this.viewConfig = new JobsBasicViewConfig();
  }

  public initLoadJobsStatus(url:string) {
    this.jobsModel = [];
    if (this.subscription !== undefined){
      this.subscription.unsubscribe();
    }
    this.getJobsStatus(url);
    this.timer = Observable.interval(this.viewConfig.pollingIntervalInMilSecond);
    this.subscription = this.timer
      .subscribe(() => {
        this.jobsModel = [];
      this.getJobsStatus(url);
    });
  }
  /**
   * Loads jobs from root or a folder
   */
  getJobsStatus(urlFolderOfJobs:string){

    this.jenkinsService.getJobsData(urlFolderOfJobs)
      .subscribe(jobs => this.createJobData(jobs),
        error => console.log("No hay jobs")
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
            let jobModel = new JobModel(job.name, job.url);
            jobModel.urlJobExecution = job.lastBuild.url;
            jobModel.lastExecTime = job.lastBuild.duration;
            jobModel.result = job.lastBuild.result;
            jobModel.timestamp = job.lastBuild.timestamp;
            jobModel.displayLastExecNumber = job.lastBuild.displayName;
            jobModel.setStatusClass();
            this.jobsModel.push(jobModel);
          }
        }
      }
    }
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
  setPollingInterval(pollingIntervalInMin: number){
    this.viewConfig.pollingIntervalInMilSecond = pollingIntervalInMin * 60 * 1000;
    this.initLoadJobsStatus(this.jobsViewSelected.url);
  }

}
