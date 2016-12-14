/**
 * Created by frdiaz on 12/12/2016.
 */
import {Component, Input} from "@angular/core";
import { JobModel } from "./job.model";
@Component({
  selector: "job",
  templateUrl: "./job.component.html"
})

export class JobComponent {

  @Input()
  private jobModel: JobModel;

  calculateProgres(){

  }

}
