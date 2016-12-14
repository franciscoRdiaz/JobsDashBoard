/**
 * Created by frdiaz on 02/12/2016.
 */
import { Component } from '@angular/core';
import { JobsStatusService } from './jobsBasicView.service';
import { OnInit } from '@angular/core';
import {JobComponent} from '../job/job.component';
import { JobModel } from '../job/job.model';

@Component({
  selector: 'jobsBasicView',
  templateUrl: './jobsBasicView.html',
  styleUrls: ['../app.component.css']
})

export class JobsBasicViewComponent implements OnInit{


  //private jobsComponent: JobComponent[] = [];
  private jobsModel: JobModel[] = [];
  jobNamesTitle: string = "Jobs";

  constructor(private jobsStatusService: JobsStatusService){}

  /**
   * Initial Dashboard's load.
   */
  ngOnInit(){
    //this.getJobsStatus();
  }

  public initLoadJobsStatus(){
    this.getJobsStatus();
  }
  /**
   * Starts the initial built of the Dashboard
   */
  getJobsStatus(){

    this.jobsStatusService.getJobsData().subscribe(
      //names => this.jobs = names,
      jobs => {this.createJobData(jobs)
      },
      error => console.log("No hay jobs")
    );
  }

  /**
   * Orchestrates the information retrieval to build jobs object
   * @param jobs
   */
  createJobData(jobs: any[]){

    console.log("Create job data:");
    for(let job of jobs){
      console.log("       "+job.url);
    }

    for(let job of jobs) {
      this.jobsStatusService.getJobData(job.url).subscribe(
        job => {
          if(job.buildable === undefined){
            this.createJobData(job.jobs);
          }else {
            if (job.lastBuild.url !== undefined) {
              let jobModel = new JobModel(job.name, job.url);
              jobModel.urlJobExecution = job.lastBuild.url;
              this.jobsModel.push(jobModel);
              this.getJobExecData(jobModel);
            }
          }
        },
        error => console.log(error)
      );
    }
  }

  /**
   *
   * @param job
   * @param jobModel
   */
  getJobExecData(jobModel: JobModel){
    this.jobsStatusService.getJobExecData(jobModel.urlJobExecution).subscribe(
      jobExecution =>{
        this.addJobExecData(jobExecution, jobModel)
      },
      error => console.log(error)
    );
  }

  /**
   *
   * @param jobExecution
   * @param jobModel
   */
  addJobExecData(jobExecution: any, jobModel: JobModel){
    jobModel.lastExecTime = jobExecution.duration;
    jobModel.result = jobExecution.result;
    jobModel.timestamp = jobExecution.timestamp;
    jobModel.displayLastExecNumber = jobExecution.displayName;
  }

}
