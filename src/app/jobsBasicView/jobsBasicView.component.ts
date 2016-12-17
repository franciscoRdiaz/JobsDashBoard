/**
 * Created by frdiaz on 02/12/2016.
 */
import { Component } from '@angular/core';
import { JobsStatusService } from './jobsBasicView.service';
import { OnInit } from '@angular/core';
import { JobModel } from '../job/job.model';
import { JobsBasicViewConfig } from './jobsBasicViewConfig';

@Component({
  selector: 'jobsBasicView',
  templateUrl: './jobsBasicView.html',
  styleUrls: ['../app.component.css']
})

export class JobsBasicViewComponent implements OnInit{

  private jobsModel: JobModel[] = [];
  viewConfig: JobsBasicViewConfig;

  constructor(private jobsStatusService: JobsStatusService){}

  /**
   * Initialize the component. Load the initial configuration
   */
  ngOnInit(){
    this.viewConfig = new JobsBasicViewConfig();
  }

  public initLoadJobsStatus(){
    this.getJobsStatus(undefined);
  }
  /**
   * Loads jobs from root or a folder
   */
  getJobsStatus(urlFolderOfJobs:string){
    if (urlFolderOfJobs === undefined){
      this.jobsModel = [];
    }

    this.jobsStatusService.getJobsData(urlFolderOfJobs).subscribe(
      jobs => {this.createJobData(jobs)
      },
      error => console.log("No hay jobs")
    );
  }

  /**
   * Builds and fills jobs object
   * @param jobs
   */
  createJobData(jobs: any[]){

    console.log("Create job data:");

    for(let job of jobs){
      console.log("       "+job.url);
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
          //this.getJobExecData(jobModel);
          this.jobsModel.push(jobModel);
        }
      }
    }
  }

  /**
   * Sets the number of columns to the view
   */
  setColumnsLayout(){
    this.viewConfig.classColumn = "columns-"+this.viewConfig.numColSelected;
  }
}
