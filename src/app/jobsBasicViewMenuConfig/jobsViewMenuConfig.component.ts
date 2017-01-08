/**
 * Created by frdiaz on 20/12/2016.
 */
import {Component, Output, EventEmitter, Input, OnInit} from '@angular/core';
//import { JobsBasicViewConfig } from '../jobsBasicView/jobsBasicViewConfig';
import { JobsBasicViewConfig } from './jobsViewMenuConfig.model';
import {JenkinsService} from "../commons/jenkinsService.service";
import { JobView } from '../commons/jobView';
import {FilteredJobsGroupParam} from "../commons/filteredJobsGroupParam";


@Component({
  selector: 'menu-config',
  templateUrl: 'jobsViewMenuConfig.component.html'
})

export class JobsBasicViewMenuConfig implements OnInit {

  viewConfig: JobsBasicViewConfig;

  toggleSettings: boolean = false;
  views: JobView[] = [];
  jobsViewSelected: JobView;

  @Input()
  private urlJenkins: string;

  @Output()
  onSelectedView = new EventEmitter<JobView>();

  @Output()
  onSelectNumColumn = new EventEmitter<number>();

  @Output()
  onSetPollingInterval = new EventEmitter<number>();

  @Output()
  onChangeFilterByJobsGrupo = new EventEmitter<FilteredJobsGroupParam>();


  constructor(private jenkinsService: JenkinsService){}

  /**
   * Initialize the component. Load the initial configuration
   */
  ngOnInit(){
    this.viewConfig = new JobsBasicViewConfig();

    this.jenkinsService.getViews(this.urlJenkins).subscribe(
      views => {

        for(let view of views.views){
          this.views.push(view);
          if (view.name === views.primaryView.name){
            this.jobsViewSelected = view;
          }
        }
        this.onSelectedView.next(this.jobsViewSelected);
      },
      error => console.log(error)
    );
  }

  loadViewSelected(){
    this.onSelectedView.next(this.jobsViewSelected);
  }

  setColumnsLayout(){
    this.onSelectNumColumn.next(this.viewConfig.numColSelected);
  }

  selectFilterByJobsGroupParam(){
    let filteredJobsGroupParam: FilteredJobsGroupParam = new FilteredJobsGroupParam();
    filteredJobsGroupParam.checkedByJogsGroupParam = this.viewConfig.checkedByJogsGroupParam;
    filteredJobsGroupParam.jobsGroupParamValue = this.viewConfig.jobsGroupParamValue;

    if((this.viewConfig.checkedByJogsGroupParam && this.viewConfig.jobsGroupParamValue !== undefined && this.viewConfig.jobsGroupParamValue !== "")
      || !this.viewConfig.checkedByJogsGroupParam){
      filteredJobsGroupParam.checkedByJogsGroupParam=this.viewConfig.checkedByJogsGroupParam;
      this.onChangeFilterByJobsGrupo.next(filteredJobsGroupParam);
      console.log("Se filtra por Grupo de jobs");
    }
  }

  changeJobsGroupName(){
    this.selectFilterByJobsGroupParam();
  }

  onSubmit(){
    this.jenkinsService.submitForm();
    this.onSetPollingInterval.next(this.viewConfig.pollingIntervalInSec);
    console.log("Change value of polling: "+ this.viewConfig.pollingIntervalInSec);
  }
}
