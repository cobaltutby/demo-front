import { Component, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MdDialog, MdDialogRef } from '@angular/material';
import { TrialService } from '../trial.service';

import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';
import { Http, URLSearchParams, Headers, RequestOptions, Response } from '@angular/http';
import * as Classes from '../../classes/classes';
import * as Services from '../../services/services';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @Output() user_id: string;
  current_user: Classes.User;
  current_password: string;
  current_email: string;
  email_valid: boolean;
  password_valid: boolean;

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(EMAIL_REGEX)]);

  guest = {
    email: 'guest@email',
    surname: 'Guest',
    common_user: true
  }

  constructor(public trialService: TrialService,
    public dialogRef: MdDialogRef<LoginComponent>,
    public ppService: Services.PPService,
    public configService: Services.ConfigService,
    public http: Http,
  ) {
    this.current_user = new Classes.User;
    this.current_password = null;
    this.current_email = null;
    this.email_valid = false;
    this.password_valid = false;
  }

  ngOnInit() {

  }

  checkPassword() {

    const _params = {
      email: this.current_email,
      password: this.current_password
    }

    this.ppService.backEndGet(this.configService.checkUserPassword, _params)
      .subscribe(res => {
        this.password_valid = false;
        if (res['_body'] === 'OK') {
          this.password_valid = true;
        }

      });


  }

  checkEmail() {

    const _params = {
      email: this.current_email,
    }
    this.ppService.backEndGet(this.configService.checkUserEmail, _params)
      .subscribe(res => {
        this.email_valid = false;
        if (res['_body'] === 'OK') {
          this.email_valid = true;
        }
      });
  }




  login() {

    const _params = {
      password: this.current_password,
      email: this.current_email
    }

    this.ppService.backEndGet(this.configService.getUser, _params)
      .subscribe(res => {
        if (res['_body'] !== 'FAIL') {
          const tmp_user = new Classes.User(JSON.parse(res['_body']));
          if (tmp_user.email) {
            this.dialogRef.close(tmp_user);
          }
        }
      },
      error => {

      })
  }

  createAccount() {
    const tmp_user = new Classes.User(this.guest);
    this.dialogRef.close(tmp_user);
  }

}
