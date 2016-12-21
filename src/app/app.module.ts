import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { JobsBasicViewComponent } from './jobsBasicView/jobsBasicView.component';
import { JobsStatusService } from './jobsBasicView/jobsBasicView.service';
import { JenkinsService } from './commons/jenkinsService.service';
import { AppService } from './app.service';
import { JobComponent } from './job/job.component';
import {JobsBasicViewMenuConfig} from "./jobsBasicViewMenuConfig/jobsViewMenuConfig.component";

@NgModule({
  declarations: [
    AppComponent,
    JobsBasicViewComponent,
    JobComponent,
    JobsBasicViewMenuConfig
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule
  ],
  providers: [ JobsStatusService, AppService, JenkinsService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
