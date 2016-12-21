/**
 * Created by frdiaz on 20/12/2016.
 */
import {Component, Output, EventEmitter, Input, OnInit} from '@angular/core';
//import { JobsBasicViewConfig } from '../jobsBasicView/jobsBasicViewConfig';
import { JobsBasicViewConfig } from './jobsViewMenuConfig.model';
import {JenkinsService} from "../commons/jenkinsService.service";
import { JobView } from '../commons/jobView';

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
    this.onSetPollingInterval.next(this.viewConfig.pollingIntervalInMin);
    console.log("Se cambia el valor del polling: "+ this.viewConfig.pollingIntervalInMin);
  }
}
