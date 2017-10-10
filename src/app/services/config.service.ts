import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {

  // projectName = 'Soshace Demo Application'
  projectName = 'Soshace Demo App'
  workflowName = 'Jogging App'
  workflowTitle = 'SDA'

  // API

  checkUserPassword = 'checkUserPassword/';
  checkUserEmail = 'checkUserEmail/';
  getUser = 'getUser/';

  constructor() {

  }

}
