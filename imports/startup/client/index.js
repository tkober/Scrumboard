import angular from 'angular';
//import angularTranslate from 'angular-translate';
//import angularTranslateLoaderStaticFiles from 'angular-translate-loader-static-files';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { Accounts } from 'meteor/accounts-base';

import { Boards } from '../../api/collections.js';

const name = 'scrumboard';

export default angular.module(name, [
  angularMeteor,
  uiRouter,
  'accounts.ui'
]);
