import {JobsBasicViewModel} from '../jobs-basic-view/jobsBasicView.model';
import {ConfigModel} from '../commons/configModel';
/**
 * Created by frdiaz on 15/12/2016.
 */
export class JobsBasicViewMenuConfig {

  views: JobsBasicViewModel[] = [];
  jobsViewSelected: JobsBasicViewModel;
  numColSelected = 1;
  combNumColumns: number [] = [1, 2, 3, 4, 5, 6, 7, 8];
  pollingInterval= 5;
  configuration: ConfigModel = {'user': '', 'pass': '', 'jenkinsUrl': '', 'jenkinsPlugin': false}
}
