import {Job} from "./job.model";

import {SimpleJob} from "./simpleJob.model";
/**
 * Created by frdiaz on 30/12/2016.
 */
export class GroupedJob extends Job {

  public listDifBuildsConfiguration: SimpleJob[];

  constructor(){
    super();
    this.listDifBuildsConfiguration = [];
    this.result = "SUCCESS";

  }
}
