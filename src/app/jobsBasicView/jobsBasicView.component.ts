/**
 * Created by frdiaz on 02/12/2016.
 */
import { Component } from "@angular/core";
import { JobsStatusService } from "./jobsBasicView.service"
import { OnInit } from "@angular/core";



@Component({
  selector: 'jobsBasicView',
  templateUrl: './jobsBasicView.html',
  styleUrls: ['../app.component.css']
})


export class JobsBasicViewComponent implements OnInit{

  private jobs: string[] = [];
  jobNamesTitle: string = "Jobs";

  constructor(private jobsStatusService: JobsStatusService){}

  ngOnInit(){
    this.getJobsStatus();
  }
  getJobsStatus(){
    this.jobs = [];
    this.jobsStatusService.getJobsStatus().subscribe(
      names => this.jobs = names,
      error => this.jobs[0] = "No hay jobs"
    );
  }
}
