import {Component, ElementRef} from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'Monitor Pro v0.1';
  urlJenkins: string = "http://localhost:8080/"; //by default

  constructor(elm: ElementRef){
    this.urlJenkins = elm.nativeElement.getAttribute("urlJenkins");
  }

}
