/**
 * Created by frdiaz on 02/12/2016.
 */
import { Component } from "@angular/core";
import { JobsStatusService } from "./jobsBasicView.service"
import { OnInit } from "@angular/core";
import {JobComponent} from "../job/job.component";

@Component({
  selector: 'jobsBasicView',
  templateUrl: './jobsBasicView.html',
  styleUrls: ['../app.component.css']
})

export class JobsBasicViewComponent implements OnInit{

  private jobs = [];
  private jobsComponent: JobComponent[] = [];
  jobNamesTitle: string = "Jobs";

  constructor(private jobsStatusService: JobsStatusService){}

  ngOnInit(){
    this.getJobsStatus();
  }

  getJobsStatus(){
    this.jobs = [];
    this.jobsStatusService.getJobsData().subscribe(
      //names => this.jobs = names,
      jobs => {this.createJobData(jobs)
      },
      error => this.jobs[0] = "No hay jobs"
    );
  }

  createJobData(jobs: any[]){
    this.jobs = jobs;
    let jobComponentAux:JobComponent;

    for(let job of this.jobs){
      jobComponentAux = new JobComponent(job.name, job.url);
      this.jobsComponent.push(jobComponentAux);
    }
    //TODO: Delete line console.log("TAMAÑO JOBSCOMPONENT 2: " + this.jobsComponent.length);

    for(let jobComponent of this.jobsComponent) {
      this.jobsStatusService.getJobData(jobComponent.name).subscribe(
        job => {
          this.getJobExecData(job, jobComponent);
        },
        error => console.log(error)
      );
    }
  }

  getJobExecData(job: any, jobComponent: JobComponent){
    jobComponent.lastExecNumber = job.lastBuild.number;
    this.jobsStatusService.getJobExecData(jobComponent.name, jobComponent.lastExecNumber).subscribe(
      jobExecution =>{
        this.addJobExecData(jobExecution, jobComponent)
      },
      error => console.log(error)
    );
  }

  addJobExecData(jobExecution: any, jobComponent: JobComponent){
    //TODO Delete this line in the future console.log("EN CONSTRUCCIÓN: "+ jobExecution.building);
    jobComponent.lastExecTime = jobExecution.duration;
    jobComponent.result = jobExecution.result;
    jobComponent.timestamp = jobExecution.timestamp;
    jobComponent.displayLastExecNumber = jobExecution.displayName;
  }

}
