/**
 * Created by frdiaz on 14/12/2016.
 */

export class JobModel {

  public urlJobExecution: string;
  public lastExecTime: number;
  public displayLastExecNumber: string;
  public result: string;
  public statusClass: string = "basic project widget unknown";
  public timestamp: number;
  public listDiferentsBuildsConfiguration: JobModel[];

  constructor( public name:string, public urlJob:string){}

  setStatusClass(){
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
      unknown: this.statusClass == "unknown",
      failing: this.statusClass == "failing",
      successful: this.statusClass == "successful"
    };
    return jobClasses;
  }
}
