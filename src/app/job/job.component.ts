/**
 * Created by frdiaz on 12/12/2016.
 */
import {Component, Input, OnInit} from "@angular/core";
import { SimpleJob } from "./simpleJob.model";
import {Job} from "./job.model";
import {GroupedJob} from "./groupedJob.model";
@Component({
  selector: "job",
  templateUrl: "./job.component.html"
})

export class JobComponent implements OnInit{

  @Input()
  private jobModel: Job;

  jobs: Job[]= [];

  calculateProgres(){
  }

  ngOnInit(){
  }

  isSimpleJob(job:Job){
    if (job instanceof SimpleJob){
      return true;
    }else if(job instanceof GroupedJob){
      return false;
    }
  }

}
