/**
 * Created by frdiaz on 12/12/2016.
 */
import {Component, Input, OnInit} from "@angular/core";
import { SimpleJob } from "./simpleJob.model";
import {Job} from "./job.model";
import {JobsGroup} from "./jobsGroup.model";

@Component({
  selector: "job",
  templateUrl: "./job.component.html"
})

export class JobComponent implements OnInit{

  @Input()
  jobModel: Job;

  calculateProgres(){
  }

  ngOnInit(){
  }

  isSimpleJob(job:Job){
    if (job instanceof SimpleJob){
      return true;
    }else if(job instanceof JobsGroup){
      return false;
    }
  }

}
