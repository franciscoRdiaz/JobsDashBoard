/**
 * Created by frdiaz on 03/12/2016.
 */
import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import 'rxjs/Rx';
import { environment } from "../environments/environment";


@Injectable()
export class AppService {

  private jobNames: string[] = [];
  private headers = new Headers();

  private resquestOptions = new RequestOptions({
    headers: this.headers
  })

  constructor(private http: Http) {
    this.headers.append("Access-Control-Allow-Credentials", "true");
    this.headers.append("Authorization", "Basic " + btoa(environment.jenkinsUser + ":" + environment.jenkinsPass));
    this.headers.append("Content-Type","application/json");
    this.resquestOptions = new RequestOptions({
      headers: this.headers,
    })
  }

  /**getAuthentication() {

    let url = "https://ci.kurento.org/jenkins/login";

    this.headers.append("Authorization", "Basic " + btoa(environment.jenkinsUser + ":" + environment.jenkinsPass));
    this.headers.append("Content-Type", "application/x-www-form-urlencoded");
    this.headers.append("Access-Control-Allow-Credentials", "true");

    return this.http.post(url, undefined, {headers: this.headers}
    ).map(res => res.json())
      .subscribe(
        data => localStorage.setItem('id_token', data.id_token),
        error => console.log("ERRORRR"+error)
      );
  }*/
}


