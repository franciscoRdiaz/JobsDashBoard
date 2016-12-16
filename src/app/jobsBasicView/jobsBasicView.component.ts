/**
 * Created by frdiaz on 02/12/2016.
 */
import { Component } from '@angular/core';
import { JobsStatusService } from './jobsBasicView.service';
import { OnInit } from '@angular/core';
import {JobComponent} from '../job/job.component';
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
  jobNamesTitle: string = "Jobs";

  constructor(private jobsStatusService: JobsStatusService){}

  /**
   * Initial Dashboard's load.
   */
  ngOnInit(){
    //this.getJobsStatus();
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
      //names => this.jobs = names,
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
        //this.createJobData(job.jobs);
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

  setColumnsLayout(){
    this.viewConfig.classColumn = "columns-"+this.viewConfig.numColSelected;
  }
}
