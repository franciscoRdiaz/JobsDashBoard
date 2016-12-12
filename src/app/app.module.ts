import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { JobsBasicViewComponent } from './JobsBasicView/jobsBasicView.component';
import { JobsStatusService } from './JobsBasicView/jobsBasicView.service';
import { AppService } from './app.service';


@NgModule({
  declarations: [
    AppComponent,
    JobsBasicViewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule
  ],
  providers: [ JobsStatusService, AppService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
