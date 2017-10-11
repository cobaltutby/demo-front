import { Component, OnInit, OnDestroy, EventEmitter, QueryList, ViewChildren, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';


import { ViewChild } from '@angular/core';
import { MdSort } from '@angular/material';

import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';

import * as Services from '../../services/services';
import * as Classes from '../../classes/classes';

@Component({
  selector: 'app-demo-app',
  templateUrl: './demo-app.component.html',
  styleUrls: ['./demo-app.component.css']
})
export class DemoAppComponent implements OnInit, OnDestroy, AfterViewInit {

  displayedColumns_records = ['date_records', 'distance', 'time', 'avs', 'edit', 'delete'];
  displayedColumns_ports = ['week', 'avd', 'avs'];
  displayedColumns_users = ['email', 'first_name', 'last_name', 'edit', 'delete'];
  displayedColumns_all_records = ['email', 'date', 'distance', 'time', 'avs', 'edit', 'delete'];

  tripDatabase: Classes.TripDatabase;
  userDatabase: Classes.UserDatabase;

  recordsDataSource: Classes.RecordsDataSource | null;
  reportsDataSource: Classes.ReportsDataSource | null;
  usersDataSource: Classes.UserDataSource | null;
  allRecordsDataSource: Classes.AllRecordsDataSource | null;

  @ViewChildren(MdSort) sort: QueryList<MdSort>;

  sort_array: MdSort[];
  activeTabIndex: number;



  constructor(

    public route: ActivatedRoute,  // angular routing
    public router: Router,  // angular navigation
    public trialService: Services.TrialService, // application cross component data exchange and common service functions
    public ppService: Services.PPService, // communication with Pipeline Pilot Server
    public configService: Services.ConfigService, // global vars
    public http: HttpClient,

  ) {

    this.sort_array = [];

  }

  ngOnInit() {

    this.trialService.user_to_edit = null;
    this.trialService.record_to_edit = null;

    this.activeTabIndex = Number(localStorage.getItem('activeTabIndex'));

    this.tripDatabase = new Classes.TripDatabase(this.trialService.database);
    this.tripDatabase.dataChange.subscribe(res => {
      this.tripDatabaseChanged();
    });
    this.userDatabase = new Classes.UserDatabase(this.trialService.database);
    this.userDatabase.dataChange.subscribe(res => {
      this.userDatabaseChanged();
    });

  }

  ngAfterViewInit() {

    this.sort.forEach(element => {
      this.sort_array.push(element);
    });

    setTimeout(() => {
      this.recordsDataSource = new Classes.RecordsDataSource(this.tripDatabase, this.sort_array[0], this.trialService.current_user);
      this.reportsDataSource = new Classes.ReportsDataSource(this.tripDatabase, this.sort_array[1], this.trialService.current_user);
      this.usersDataSource = new Classes.UserDataSource(this.userDatabase, this.sort_array[2]);
      this.allRecordsDataSource = new Classes.AllRecordsDataSource(this.tripDatabase, this.sort_array[3]);
    }, 0)

  }


  ngOnDestroy() {

    this.tripDatabase.dataChange.unsubscribe();
    this.userDatabase.dataChange.unsubscribe();

  }

  tripDatabaseChanged() {

    this.trialService.database.user_data = this.tripDatabase.data;

    this.ppService.saveDatabaseToLS(this.trialService.database);

  }

  userDatabaseChanged() {

    this.trialService.database.user_list = this.userDatabase.data;

    this.ppService.saveDatabaseToLS(this.trialService.database);

  }


  getAverageSpeed(row: Classes.Trip) {

    if (row) {
      return ((row.distance / 1000) / (row.time / 3600)).toFixed(2);
    }

  }


  getDate(row: Classes.Trip) {

    if (row) {
      return row.date.toString().slice(0, 15);
    }

  }

  editRecord(row: Classes.Trip) {

    this.trialService.record_to_edit = row;
    this.router.navigate(['EditRecord']);

  }

  deleteRecord(row: Classes.Trip) {

    this.tripDatabase.deleteRow(row);

  }

  editUser(user: Classes.User) {

    this.trialService.user_to_edit = user;
    this.router.navigate(['EditUser']);

  }

  deleteUser(user: Classes.User) {

    this.userDatabase.deleteRow(user);

  }

  saveIndex() {

    localStorage.setItem('activeTabIndex', this.activeTabIndex.toString());

  }

  addNewRecord() {

    this.trialService.user_to_edit = new Classes.User(this.trialService.current_user);
    this.router.navigate(['EditRecord']);

  }

  addNewUser() {

    this.router.navigate(['EditUser']);

  }

  // API common test

  getTripData() {

    const _params = {
      password: this.trialService.current_user.password,
      email: this.trialService.current_user.email
    }
    this.ppService.backEndGet('getUserTripData/', _params)
      .subscribe(res => {
        console.dir(JSON.parse(res['_body']));
      })
  }

}













