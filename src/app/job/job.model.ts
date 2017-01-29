/**
 * Created by frdiaz on 30/12/2016.
 */
export class Job{

  private _name:string;
  public result: string;
  public statusClass: string = "basic project widget unknown";

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

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
