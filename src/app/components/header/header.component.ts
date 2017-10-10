import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MdDialog, MdDialogRef } from '@angular/material';

import { LoginComponent } from '../../services/login/login.component';

import { HttpClient } from '@angular/common/http';

import * as Services from '../../services/services';
import * as Classes from '../../classes/classes';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  database: Classes.ApplicationDatabase;
  database_from_backend: Classes.ApplicationDatabase;
  database_from_LS: Classes.ApplicationDatabase;

  current_user: Classes.User;
  login_tooltip: string;

  constructor(
    public trialService: Services.TrialService,
    public route: ActivatedRoute,
    public router: Router,
    public http: HttpClient,
    public ppService: Services.PPService,
    public configService: Services.ConfigService,
    public dialog: MdDialog
  ) {
    this.login_tooltip = 'Login';
  }

  ngOnInit() {

    this.getCurrentUser();

  }

  ngOnDestroy() {

  }

  getCurrentUser() {

    this.trialService.current_user = null;

    const current_user = new Classes.User(JSON.parse(localStorage.getItem(this.trialService.current_user_ls)));

    if (current_user && current_user.email) {
      this.checkUserLogin(current_user);
    }

  }

  checkUserLogin(current_user: Classes.User) {

    const _params = {
      password: current_user.password,
      email: current_user.email
    }

    this.ppService.backEndGet(this.configService.getUser, _params)
      .subscribe(res => {
        if (res['_body'] !== 'FAIL') {
          const tmp_user = new Classes.User(JSON.parse(res['_body']));
          if (tmp_user.email) {
            this.login_tooltip = 'Logout';
            this.trialService.current_user = current_user;
            this.loadUserData();
          }
        }
      },
      error => {

      })

  }

  login() {

    const dialogRef = this.dialog.open(LoginComponent, {
      width: '500px'
    });


    dialogRef.afterClosed().subscribe(current_user => {
      if (!current_user) {
        return;
      }



      this.trialService.current_user = new Classes.User(current_user);
      localStorage.setItem(this.trialService.current_user_ls, JSON.stringify(this.trialService.current_user));
      this.login_tooltip = 'Logout';

      if (this.trialService.current_user.email === 'guest@email') {
        this.loadGuestData();
      } else {
        this.loadUserData();
      }



    });

  }

  logout() {

    this.login_tooltip = 'Login';
    this.trialService.current_user = null;
    this.trialService.database = null;
    localStorage.clear();
    this.router.navigate(['']);

  }

  switchUser() {

    if (this.trialService.current_user) {
      this.logout();
    } else {
      this.login();
    }

  }

  exit() {

    window.close();

  }

  loadUserData() {

    const database_ls = new Classes.ApplicationDatabase(JSON.parse(localStorage.getItem(this.trialService.database_ls)));

    this.ppService.getDataBaseFromBackEnd()
      .subscribe(database => {
        database = JSON.parse(database);
        const batabase_backend = new Classes.ApplicationDatabase(database);
        if (batabase_backend.last_modified > database_ls.last_modified) {
          this.trialService.database = batabase_backend;
        } else {
          this.trialService.database = database_ls;
        }
        this.router.navigate(['JoggingApp']);
      },
      error => {
        // TODO
      });

  };

  loadGuestData() {

    const database_ls = new Classes.ApplicationDatabase(JSON.parse(localStorage.getItem(this.trialService.database_ls)));

    this.ppService.getDataBaseFromBackEnd()
      .subscribe(database => {
        database = JSON.parse(database);
        const batabase_backend = new Classes.ApplicationDatabase(database);
        if (batabase_backend.last_modified > database_ls.last_modified) {
          this.trialService.database = batabase_backend;
        } else {
          this.trialService.database = database_ls;
        }
        this.router.navigate(['EditUser']);
      },
      error => {
        // TODO
      });

  };

  saveDatabase() {
    // TODO
  }

  createAccount() {
    this.router.navigate(['EditUser']);
  }

}
