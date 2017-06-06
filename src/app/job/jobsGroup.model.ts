import {Job} from "./job.model";

import {SimpleJob} from "./simpleJob.model";
/**
 * Created by frdiaz on 30/12/2016.
 */
export class JobsGroup extends Job {

  public jobsList: SimpleJob[];

  constructor(){
    super();
    this.jobsList = [];
    this.result = "SUCCESS";

  }
}
