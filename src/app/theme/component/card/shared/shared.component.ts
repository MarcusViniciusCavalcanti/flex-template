import { Component } from '@angular/core';

@Component({
  selector: 'app-flex-card-front',
  template: '<ng-content select="app-flex-card"></ng-content>',
})
export class FlexCardFrontComponent { }

@Component({
  selector: 'app-flex-card-back',
  template: '<ng-content select="app-flex-card"></ng-content>',
})
export class FlexCardBackComponent { }
