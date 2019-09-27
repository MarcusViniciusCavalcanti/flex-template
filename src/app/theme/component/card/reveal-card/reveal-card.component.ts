import { Component, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'app-flex-reveal-card',
  styleUrls: ['./reveal-card.component.scss'],
  template: `
    <ng-content select="app-flex-card-front"></ng-content>
    <div class="second-card-container">
      <ng-content select="app-flex-card-back"></ng-content>
    </div>
    <a *ngIf="showToggleButton" class="reveal-button" (click)="toggle()">
      <nb-icon icon="chevron-down-outline" pack="nebular-essentials" aria-hidden="true"></nb-icon>
    </a>
  `,
})
export class FlexRevealCardComponent {
  @Input()
  @HostBinding('class.revealed')
  revealed = false;

  @Input() showToggleButton = true;

  toggle() {
    this.revealed = !this.revealed;
  }
}
