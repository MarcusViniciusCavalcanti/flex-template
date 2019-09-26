import {
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  EmbeddedViewRef,
  Injector,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import { FlexComponentPortal, FlexPortalInjector, FlexPortalOutletDirective, FlexTemplatePortal } from '../flex-cdk-mapping.module';

@Component({
  selector: 'app-flex-overlay-container',
  template: `
    <div *ngIf="isStringContent" class="primitive-overlay">{{ content }}</div>
    <ng-template appPortalOutlet></ng-template>
  `,
})
export class FlexOverlayContainerComponent {

  isAttached = false;

  content: string;

  @ViewChild(FlexPortalOutletDirective, { static: true }) portalOutlet: FlexPortalOutletDirective;

  constructor(protected vcr: ViewContainerRef,
              protected injector: Injector, private changeDetectorRef: ChangeDetectorRef) {
  }

  get isStringContent(): boolean {
    return !!this.content;
  }

  attachComponentPortal<T>(portal: FlexComponentPortal<T>, context?: {}): ComponentRef<T> {
    portal.injector = this.createChildInjector(portal.componentFactoryResolver);
    const componentRef = this.portalOutlet.attachComponentPortal(portal);
    if (context) {
      Object.assign(componentRef.instance, context);
    }
    componentRef.changeDetectorRef.markForCheck();
    componentRef.changeDetectorRef.detectChanges();
    this.isAttached = true;
    return componentRef;
  }

  attachTemplatePortal<C>(portal: FlexTemplatePortal<C>): EmbeddedViewRef<C> {
    const templateRef = this.portalOutlet.attachTemplatePortal(portal);
    templateRef.detectChanges();
    this.isAttached = true;
    return templateRef;
  }

  attachStringContent(content: string) {
    this.content = content;
    this.changeDetectorRef.markForCheck();
    this.changeDetectorRef.detectChanges();
    this.isAttached = true;
  }

  detach() {
    if (this.portalOutlet.hasAttached()) {
      this.portalOutlet.detach();
    }
    this.attachStringContent(null);
    this.isAttached = false;
  }

  protected createChildInjector(cfr: ComponentFactoryResolver): FlexPortalInjector {
    return new FlexPortalInjector(this.injector, new WeakMap([
      [ ComponentFactoryResolver, cfr ],
    ]));
  }
}
