/**
 * Created by frdiaz on 02/12/2016.
 */
import { Component } from '@angular/core';
import { JobsStatusService } from './jobsBasicView.service';
import { OnInit } from '@angular/core';
import { JobModel } from '../job/job.model';
import { JobsBasicViewConfig } from './jobsBasicViewConfig';
import { JobBasicViewModel } from './jobsBasicView.model';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';
import {JobView} from "../commons/jobView";

@Component({
  selector: 'jobsBasicView',
  templateUrl: 'jobsBasicView.component.html',
  styleUrls: ['../app.component.css']
})

export class JobsBasicViewComponent implements OnInit{

  private jobsModel: JobModel[] = [];
  viewConfig: JobsBasicViewConfig;
  views: JobBasicViewModel[] = [];
  jobsViewSelected: JobBasicViewModel;
  titleOfViewDisplay: string ="No se ha seleccionado ninguna vista todavía.";
  timer;
  subscription;

  constructor(private jobsStatusService: JobsStatusService){}

  /**
   * Initialize the component. Load the initial configuration
   */
  ngOnInit(){
    this.viewConfig = new JobsBasicViewConfig();
    this.jobsStatusService.getViews().subscribe(
      views => {

        for(let view of views.views){
          this.views.push(view);
          if (view.name === views.primaryView.name){
            this.jobsViewSelected = view;
          }
        }

        this.titleOfViewDisplay = this.jobsViewSelected.name;

        this.initLoadJobsStatus(this.jobsViewSelected.url);
      },
      error => console.log(error)
    );
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

    this.jobsStatusService.getJobsData(urlFolderOfJobs)
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
  setColumnsLayout(viewConfig: JobsBasicViewConfig){
    this.viewConfig.classColumn = "columns-"+viewConfig.numColSelected;

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
  setPollingInterval(viewConfig: JobsBasicViewConfig){
    this.viewConfig.pollingIntervalInMilSecond = viewConfig === undefined ? this.viewConfig.pollingIntervalInMin : viewConfig.pollingIntervalInMin * 60 * 1000;
    this.initLoadJobsStatus(this.jobsViewSelected.url);
  }

}
