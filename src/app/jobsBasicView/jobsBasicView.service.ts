/**
 * Created by frdiaz on 02/12/2016.
 */
import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import 'rxjs/Rx';


@Injectable()
export class JobsStatusService {

  private jobNames: string[] = [];
  private username = "tdktvs";
  private password = "12345678";
  private creds = "username=" + this.username + "&password=" + this.password;
  private headers = new Headers({
    'Content-Type': 'application/json'
  });


  constructor(private http: Http){}

  getJobsStatus(){


    let url = "http://localhost:8080/api/json";
    //this.headers.append("Authorization", "Basic dGRrdHZzOjEyMzQ1Njc4");
   // this.headers.append("Access-Control-Allow-Origin","http://localhost:8080");
    this.headers.append("Access-Control-Allow-Credentials", "true");

    let resquestOptions = new RequestOptions({
      headers: this.headers,
      body: this.creds,
      withCredentials: true
    })
  /*  return this.http.get(url).subscribe(
      response => {
        let data = response.json();
        for(var i = 0; i < data.jobs.length ; i++){
          this.jobNames.push(data.jobs[i].name);
        }
      },
      error => this.jobNames.push("No hay jobs")
    );*/
    return this.http.get(url, resquestOptions).map(
      response => this.extractJobsNames(response)
    )
  }

  private extractJobsNames(response: Response){
    return response.json().jobs.map(job => job.name)
  }
}

