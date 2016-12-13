/**
 * Created by frdiaz on 12/12/2016.
 */
import { Component } from "@angular/core";

@Component({
  selector: "job",
  templateUrl: "./job.component.html"
})

export class JobComponent {

  public urlJobExecution:string;
  public lastExecTime:number;
  public lastExecNumber:number;
  public displayLastExecNumber:string;
  public result: string;
  public timestamp: number;

  constructor( public name:string, public urlJob:string){}

  buildUrlJobApi(){

  }

  buildUrlRunJobApi(){

  }

  calculateProgres(){

  }
}
