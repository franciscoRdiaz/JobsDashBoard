/**
 * Created by frdiaz on 03/12/2016.
 */
import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import 'rxjs/Rx';


@Injectable()
export class AppService {

  private jobNames: string[] = [];
  private username = "tdktvs";
  private password = "12345678";
  private creds = "username=" + this.username + "&password=" + this.password;
  private headers = new Headers();
  /*{
    'Content-Type': 'application/x-www-form-urlencoded'

  });*/
  private resquestOptions = new RequestOptions({
    headers: this.headers
  })

  constructor(private http: Http) {
  }

  getAuthentication() {

    //let url = "http://localhost:8080/job/JobTest1/api/json?pretty=true";
    let url = "http://localhost:8080/login";
    //this.headers.append("Authorization", "Basic " + btoa(this.username + ":" + this.password));
    this.headers.append("Content-Type", "application/x-www-form-urlencoded");//+ btoa(this.username + ":" + this.password));
    this.headers.append("Access-Control-Allow-Origin","http://localhost:8080");
    this.headers.append("Access-Control-Allow-Credentials", "true");
    /*  return this.http.get(url).subscribe(
     response => {
     let data = response.json();
     for(var i = 0; i < data.jobs.length ; i++){
     this.jobNames.push(data.jobs[i].name);
     }
     },
     error => this.jobNames.push("No hay jobs")
     );*/
    return this.http.post(url, this.creds, {headers: this.headers}
    ).map(res => res.json())
      .subscribe(
        data => localStorage.setItem('id_token', data.id_token),
        error => console.log("ERRORRR"+error)
      );
  }
}


