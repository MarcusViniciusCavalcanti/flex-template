import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">Create by <b><a href="http://zonework.info" target="_blank">Zonework</a></b> 2019</span>
    <div class="socials">
      <a href="#" target="_blank" class="ion ion-social-facebook"></a>
      <a href="#" target="_blank" class="ion ion-social-linkedin"></a>
    </div>
  `,
})
export class FooterComponent {
}
