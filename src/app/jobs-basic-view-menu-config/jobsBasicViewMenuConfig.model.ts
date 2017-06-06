import {JobsBasicViewModel} from "../jobs-basic-view/jobsBasicView.model";
/**
 * Created by frdiaz on 15/12/2016.
 */
export class JobsBasicViewMenuConfig{

  views: JobsBasicViewModel[] = [];
  jobsViewSelected: JobsBasicViewModel;
  numColSelected: number = 1;
  combNumColumns: number [] = [1,2,3,4,5,6,7,8];
  pollingInterval: number = 5;
}
