import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

import { ConfigService } from './config.service';
import { TrialService } from './trial.service';

import { Http, URLSearchParams, Headers, RequestOptions, Response } from '@angular/http';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';

import * as Classes from '../classes/classes';



import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

@Injectable()
export class PPService {

  backEndServer: string;
  port = ':3000/';
  protocol = 'http://';

  fileUploadPath: string;

  // save WF data variables

  database: Classes.ApplicationDatabase;
  req_save_WFData: boolean;
  experiment_data_writing: boolean;
  saving_to_backEnd: boolean;

  constructor(
    public http: HttpClient,
    public http_old: Http,
    public configService: ConfigService,
    public trialService: TrialService,
  ) {

    if (environment.production) {

      this.backEndServer = location.host;

    } else {

      this.backEndServer = '146.185.150.183';
    }

  }


  backEndGet(protocolPath: string, _params?: any): Observable<any | string> {


    const url = this.protocol + this.backEndServer + this.port + protocolPath;


    const search = new URLSearchParams();
    // const headers = new Headers();
    const options = new RequestOptions();
    const headers = new Headers({ 'Content-Type': 'application/json' });

    options.headers = headers;
    options.withCredentials = true;

    for (const p in _params) {
      if (p !== undefined) {
        search.set(p, _params[p]);
      }
    }
    options.search = search;


    return this.http_old.get(url, options)

  }



  saveDatabaseToLS(database: Classes.ApplicationDatabase) {

    this.saveDatabaseToBackEnd(database);
    const database_to_save = new Classes.ApplicationDatabase(database);
    database_to_save.last_modified = Date.now();

    try {

      localStorage.setItem(this.trialService.database_ls, JSON.stringify(database_to_save));

    } catch (err) {

    }

  }

  saveDatabaseToBackEnd(database: Classes.ApplicationDatabase) {

    if (this.saving_to_backEnd) {
      return;
    }
    this.saving_to_backEnd = true;
    const database_to_save = new Classes.ApplicationDatabase(database);
    database_to_save.last_modified = Date.now();

    const file = new File([JSON.stringify(database_to_save)], 'database.json');

    const url = 'http://146.185.150.183:3000/upload';
    const options = new Classes.RequestOptions();
    options.withCredentials = true;
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post(url, formData, options)
      .subscribe(res => {
        this.saving_to_backEnd = false;
      }, err => {
        this.saving_to_backEnd = false;
      })

  }

  getDataBaseFromBackEnd() {

    let url: string;
    url = 'http://146.185.150.183:3000/uploads/database.json';

    const search = new URLSearchParams();
    const headers = new Headers();
    const options = new Classes.RequestOptions();

    options.withCredentials = true;

    return this.http.get(url, { responseType: 'text' })

  };

}




