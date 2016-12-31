import {Job} from "./job.model";
/**
 * Created by frdiaz on 14/12/2016.
 */

export class SimpleJob extends Job{

  public urlJobExecution: string;
  public lastExecTime: number;
  public displayLastExecNumber: string;
  public timestamp: number;
  public listDifBuildsConfiguration: SimpleJob[];
  public urlJob: string;


}
