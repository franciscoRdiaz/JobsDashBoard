import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { JobsBasicViewComponent } from './jobsBasicView/jobsBasicView.component';
import { JenkinsService } from './commons/jenkinsService.service';
import { JobComponent } from './job/job.component';
import {JobsBasicViewMenuConfig} from "./jobsBasicViewMenuConfig/jobsViewMenuConfig.component";
import {ConfigService} from "./commons/configService";
import { configServiceFactory } from "./commons/configServiceFactory";

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
  providers: [
    ConfigService, {
      provide: APP_INITIALIZER, useFactory: configServiceFactory,
      deps: [ConfigService], multi: true
    },
    JenkinsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
