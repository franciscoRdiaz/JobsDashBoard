/**
 * Created by frdiaz on 20/12/2016.
 */
import {Component, Output, EventEmitter, Input, OnInit} from '@angular/core';
import { JobsBasicViewMenuConfig } from './jobsBasicViewMenuConfig.model';
import {JenkinsService} from '../commons/jenkinsService.service';
import {JobsBasicViewModel} from '../jobs-basic-view/jobsBasicView.model';
import {ConfigService} from '../commons/configService';
import {configServiceFactory} from '../commons/configServiceFactory';

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

  constructor(private jenkinsService: JenkinsService, private configService: ConfigService){}

  /**
   * Initialize the component. Load the initial configuration
   */
  ngOnInit() {
    this.loadViews();
  }

  loadViews() {
    if (this.viewConfig === undefined || this.viewConfig === null) {
      this.viewConfig = new JobsBasicViewMenuConfig();
    }else{
      this.urlJenkins = this.viewConfig.configuration.jenkinsUrl;
      this.viewConfig.views.splice(0, this.viewConfig.views.length);
    }

     this.jenkinsService.getViews(this.urlJenkins).subscribe(
      views => {
        for (let view of views.views){
          this.viewConfig.views.push(view);
          if (view.name === views.primaryView.name) {
            this.viewConfig.jobsViewSelected = view;
          }
        }

        this.viewConfig.configuration = this.configService.configModel;

        this.onSelectedView.next(this.viewConfig.jobsViewSelected);
      },
      error => console.log(error)
    );
  }

  loadViewSelected() {
    this.onSelectedView.next(this.viewConfig.jobsViewSelected);
  }

  setColumnsLayout() {
    this.onSelectNumColumn.next(this.viewConfig.numColSelected);
  }

  onSubmit() {    
    this.configService.configModel = this.viewConfig.configuration;
    this.loadViews();
    this.onSetPollingInterval.next(this.viewConfig.pollingInterval);
    console.log('Change plugin configuration: ' + this.viewConfig.pollingInterval);
  }
}
