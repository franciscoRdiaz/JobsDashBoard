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
  public listDifBuildsConfiguration: JobModel[];
  public name: string;
  public urlJob: string;

  setStatusClass(){
    switch (this.result){
      case "SUCCESS":
        this.statusClass = "successful";
        break;
      case "FAILURE":
        this.statusClass = "failing";
        break;
      case "UNSTABLE":
        this.statusClass = "unstable";
        break;
      case "ABORTED":
        this.statusClass = "aborted";
        break;
      case "DISABLED":
        this.statusClass = "disabled";
        break;
      default:
        this.statusClass = "unknown";
    }
  }

  setClasses(){
    return {
      basic: true,
      project: true,
      widget: true,
      unknown: this.statusClass === "unknown",
      failing: this.statusClass === "failing",
      successful: this.statusClass === "successful",
      unstable: this.statusClass === "unstable",
      aborted: this.statusClass === "aborted",
      disabled: this.statusClass === "disabled"
    };
  }
}
