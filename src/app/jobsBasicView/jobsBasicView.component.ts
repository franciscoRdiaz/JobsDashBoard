/**
 * Created by frdiaz on 02/12/2016.
 */
import {Component, Input} from '@angular/core';
import { OnInit } from '@angular/core';
import { JobsBasicViewConfig } from './jobsBasicViewConfig';
import { JobBasicViewModel } from './jobsBasicView.model';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';
import {JobView} from "../commons/jobView";
import {JenkinsService} from "../commons/jenkinsService.service";
import {Job} from "../job/job.model";

@Component({
  selector: 'jobsBasicView',
  templateUrl: 'jobsBasicView.component.html',
  styleUrls: ['../app.component.css']
})

export class JobsBasicViewComponent implements OnInit{

  @Input()
  private urlJenkins:string;

  private jobsModel: Job[] = [];
  viewConfig: JobsBasicViewConfig;
  views: JobBasicViewModel[] = [];
  jobsViewSelected: JobBasicViewModel;
  titleOfViewDisplay: string ="No view selected jet.";
  timer;
  subscription;

  constructor(private jenkinsService: JenkinsService){}

  /**
   * Initializes the component. Load the initial configuration
   */
  ngOnInit(){
    this.viewConfig = new JobsBasicViewConfig();
  }

  /**
   * Starts load of jobs status
   * @param url
   */
  public initLoadJobsStatus(url:string) {

    this.jenkinsService.getJobsStatus(url).subscribe(
      jobsModelAux => this.jobsModel = jobsModelAux,
      error => console.log("Error retriving data")
    );

    /* Starts the polling configuration */
    if (this.subscription !== undefined){
      this.subscription.unsubscribe();
    }

    this.timer = Observable.interval(this.viewConfig.pollingIntervalInMilSecond);
    this.subscription = this.timer
      .subscribe(() => {
        this.jenkinsService.getJobsStatus(url).subscribe(
          jobsModelAux => this.jobsModel = jobsModelAux,
          error => console.log("Error retriving data")
        );
    });
    /* Ends the polling configuration */
  }

  /**
   * Sets the number of columns to the view
   */
  setColumnsLayout(numColumnsSelected: number){
    this.viewConfig.classColumn = "columns-"+ numColumnsSelected;
  }

  /**
   * Loads data of selected view.
   */
  loadViewSelected(jobsViewSelected: JobView){
    this.titleOfViewDisplay = jobsViewSelected.name;
    this.initLoadJobsStatus(jobsViewSelected.url);
    this.jobsViewSelected = jobsViewSelected;
  }

  /**
   * Changes value of polling interval and data reload
   */
  setPollingInterval(pollingIntervalInSec: number){
    this.viewConfig.pollingIntervalInMilSecond = pollingIntervalInSec * 1000;
    this.initLoadJobsStatus(this.jobsViewSelected.url);
  }

}
