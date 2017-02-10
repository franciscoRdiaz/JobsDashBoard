/**
 * Created by frdiaz on 20/12/2016.
 */
import {Component, Output, EventEmitter, Input, OnInit} from '@angular/core';
import { JobsBasicViewConfig } from './jobsViewMenuConfig.model';
import {JenkinsService} from "../commons/jenkinsService.service";
import {JobBasicViewModel} from "../jobsBasicView/jobsBasicView.model";


@Component({
  selector: 'menu-config',
  templateUrl: 'jobsViewMenuConfig.component.html'
})

export class JobsBasicViewMenuConfig implements OnInit {

  viewConfig: JobsBasicViewConfig;

  toggleSettings: boolean = false;
  views: JobBasicViewModel[] = [];
  jobsViewSelected: JobBasicViewModel;

  @Input()
  private urlJenkins: string;

  @Output()
  onSelectedView = new EventEmitter<JobBasicViewModel>();

  @Output()
  onSelectNumColumn = new EventEmitter<number>();

  @Output()
  onSetPollingInterval = new EventEmitter<number>();

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

  onSubmit(){
    this.jenkinsService.submitForm();
    this.onSetPollingInterval.next(this.viewConfig.pollingIntervalInSec);
    console.log("Change value of polling: "+ this.viewConfig.pollingIntervalInSec);
  }
}
