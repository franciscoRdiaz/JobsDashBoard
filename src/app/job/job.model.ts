import {InputMetadataWalker} from "codelyzer/noInputRenameRule";
import {Input} from "@angular/core";
/**
 * Created by frdiaz on 14/12/2016.
 */

export class JobModel {

  public urlJobExecution: string;
  public lastExecTime: number;
  public lastExecNumber: number;
  public displayLastExecNumber: string;
  public result: string;
  public statusClass: string = "basic project widget unknown";

  public timestamp: number;

  constructor( public name:string, public urlJob:string){}

  setStatusClass(){
    /**switch (this.result){
      case "SUCCESS":
        this.statusClass = "basic project widget successful";
        break;
      case "FAILURE":
        this.statusClass = "basic project widget failing";
        break;
      default:
        this.statusClass = "basic project widget unknown";
    }*/

    switch (this.result){
      case "SUCCESS":
        this.statusClass = "successful";
        break;
      case "FAILURE":
        this.statusClass = "failing";
        break;
      default:
        this.statusClass = "unknown";
    }
  }

  setClasses(){
    let jobClasses = {
      basic: true,
      project: true,
      widget: true,
      unknown: this.statusClass == "unknown" ? true:false ,
      failing: this.statusClass == "failing" ? true:false ,
      successful: this.statusClass == "successful" ? true:false
    };
    return jobClasses;
  }
}
