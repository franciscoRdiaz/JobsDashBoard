/**
 * Created by frdiaz on 20/12/2016.
 */
import {Component, Output, EventEmitter, Input, OnInit} from '@angular/core';
import { JobsBasicViewMenuConfig } from './jobsBasicViewMenuConfig.model';
import {JenkinsService} from "../commons/jenkinsService.service";
import {JobsBasicViewModel} from "../jobs-basic-view/jobsBasicView.model";

@Component({
  selector: 'menu-config',
  templateUrl: './jobsBasicViewMenuConfig.component.html'
})

export class JobsBasicViewMenConfComponent implements OnInit {

  viewConfig: JobsBasicViewMenuConfig;
  toggleSettings: boolean = false;

  @Input()
  private urlJenkins: string;

  @Output()
  onSelectedView = new EventEmitter<JobsBasicViewModel>();

  @Output()
  onSelectNumColumn = new EventEmitter<number>();

  @Output()
  onSetPollingInterval = new EventEmitter<number>();

  constructor(private jenkinsService: JenkinsService){}

  /**
   * Initialize the component. Load the initial configuration
   */
  ngOnInit(){
    this.viewConfig = new JobsBasicViewMenuConfig();

    this.jenkinsService.getViews(this.urlJenkins).subscribe(
      views => {
        for(let view of views.views){
          this.viewConfig.views.push(view);
          if (view.name === views.primaryView.name){
            this.viewConfig.jobsViewSelected = view;
          }
        }
        this.onSelectedView.next(this.viewConfig.jobsViewSelected);
      },
      error => console.log(error)
    );
  }

  loadViewSelected(){
    this.onSelectedView.next(this.viewConfig.jobsViewSelected);
  }

  setColumnsLayout(){
    this.onSelectNumColumn.next(this.viewConfig.numColSelected);
  }

  onSubmit(){
    this.jenkinsService.submitForm();
    this.onSetPollingInterval.next(this.viewConfig.pollingInterval);
    console.log("Change value of polling: "+ this.viewConfig.pollingInterval);
  }
}
