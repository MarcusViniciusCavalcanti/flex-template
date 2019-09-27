import { Component, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'app-flex-flip-card',
  styleUrls: ['./flip-card.component.scss'],
  template: `
    <div class="flipcard-body">
      <div class="front-container">
        <ng-content select="app-flex-card-front"></ng-content>
        <a *ngIf="showToggleButton" class="flip-button" (click)="toggle()">
          <app-flex-icon icon="chevron-left-outline" pack="nebular-essentials" aria-hidden="true"></app-flex-icon>
        </a>
      </div>
      <div class="back-container">
        <ng-content select="app-flex-card-back"></ng-content>
        <a *ngIf="showToggleButton" class="flip-button" (click)="toggle()">
          <app-flex-icon icon="chevron-left-outline" pack="nebular-essentials" aria-hidden="true"></app-flex-icon>
        </a>
      </div>
    </div>
  `,
})
export class FlexFlipCardComponent {
  @Input()
  @HostBinding('class.flipped')
  flipped = false;

  @Input() showToggleButton = true;

  toggle() {
    this.flipped = !this.flipped;
  }
}
