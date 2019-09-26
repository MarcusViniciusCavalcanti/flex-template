import { GlobalPositionStrategy } from '@angular/cdk/overlay';
import { FlexGlobalLogicalPosition } from '../../../../../../helpers/position/flex-global-logical-position';

export class FlexGlobalPositionStrategy extends GlobalPositionStrategy {

  position(position: FlexGlobalLogicalPosition): this {
    switch (position) {
      case FlexGlobalLogicalPosition.TOP_START:
        return this.top().left();

      case FlexGlobalLogicalPosition.TOP_END:
        return this.top().right();

      case FlexGlobalLogicalPosition.BOTTOM_START:
        return this.bottom().left();

      case FlexGlobalLogicalPosition.BOTTOM_END:
        return this.bottom().right();
    }
  }
}
