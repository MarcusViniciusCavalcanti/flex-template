import { Injectable } from '@angular/core';

import { FlexLayoutDirectionService } from '../../theme/services/direction/flex-direction.service';
import { FlexGlobalPhysicalPosition } from './flex-global-physical-position';
import { FlexGlobalLogicalPosition } from './flex-global-logical-position';

export type FlexGlobalPosition = FlexGlobalPhysicalPosition | FlexGlobalLogicalPosition;

@Injectable()
export class FlexPositionHelper {
  constructor(protected layoutDirection: FlexLayoutDirectionService) {
  }

  toLogicalPosition(position: FlexGlobalPosition): FlexGlobalLogicalPosition {
    if (Object.values(FlexGlobalLogicalPosition).includes(position)) {
      return position as FlexGlobalLogicalPosition;
    }

    if (this.layoutDirection.isLtr()) {
      return this.toLogicalPositionWhenLtr(position as FlexGlobalPhysicalPosition);
    } else {
      return this.toLogicalPositionWhenRtl(position as FlexGlobalPhysicalPosition);
    }
  }

  toPhysicalPosition(position: FlexGlobalPosition): FlexGlobalPhysicalPosition {
    if (Object.values(FlexGlobalPhysicalPosition).includes(position)) {
      return position as FlexGlobalPhysicalPosition;
    }

    if (this.layoutDirection.isLtr()) {
      return this.toPhysicalPositionWhenLtr(position as FlexGlobalLogicalPosition);
    } else {
      return this.toPhysicalPositionWhenRtl(position as FlexGlobalLogicalPosition);
    }
  }

  isTopPosition(position: FlexGlobalPosition) {
    const logicalPosition = this.toLogicalPosition(position);

    return logicalPosition === FlexGlobalLogicalPosition.TOP_END
      || logicalPosition === FlexGlobalLogicalPosition.TOP_START;
  }

  isRightPosition(position: FlexGlobalPosition) {
    const physicalPosition = this.toPhysicalPosition(position);

    return physicalPosition === FlexGlobalPhysicalPosition.TOP_RIGHT
      || physicalPosition === FlexGlobalPhysicalPosition.BOTTOM_RIGHT;
  }

  protected toLogicalPositionWhenLtr(position: FlexGlobalPhysicalPosition): FlexGlobalLogicalPosition {
    switch (position) {
      case FlexGlobalPhysicalPosition.TOP_RIGHT:
        return FlexGlobalLogicalPosition.TOP_END;
      case FlexGlobalPhysicalPosition.TOP_LEFT:
        return FlexGlobalLogicalPosition.TOP_START;
      case FlexGlobalPhysicalPosition.BOTTOM_RIGHT:
        return FlexGlobalLogicalPosition.BOTTOM_END;
      case FlexGlobalPhysicalPosition.BOTTOM_LEFT:
        return FlexGlobalLogicalPosition.BOTTOM_START;
    }
  }

  protected toLogicalPositionWhenRtl(position: FlexGlobalPhysicalPosition): FlexGlobalLogicalPosition {
    switch (position) {
      case FlexGlobalPhysicalPosition.TOP_RIGHT:
        return FlexGlobalLogicalPosition.TOP_START;
      case FlexGlobalPhysicalPosition.TOP_LEFT:
        return FlexGlobalLogicalPosition.TOP_END;
      case FlexGlobalPhysicalPosition.BOTTOM_RIGHT:
        return FlexGlobalLogicalPosition.BOTTOM_START;
      case FlexGlobalPhysicalPosition.BOTTOM_LEFT:
        return FlexGlobalLogicalPosition.BOTTOM_END;
    }
  }

  protected toPhysicalPositionWhenLtr(position: FlexGlobalLogicalPosition): FlexGlobalPhysicalPosition {
    switch (position) {
      case FlexGlobalLogicalPosition.TOP_START:
        return FlexGlobalPhysicalPosition.TOP_LEFT;
      case FlexGlobalLogicalPosition.TOP_END:
        return FlexGlobalPhysicalPosition.TOP_RIGHT;
      case FlexGlobalLogicalPosition.BOTTOM_START:
        return FlexGlobalPhysicalPosition.BOTTOM_LEFT;
      case FlexGlobalLogicalPosition.BOTTOM_END:
        return FlexGlobalPhysicalPosition.BOTTOM_RIGHT;
    }
  }

  protected toPhysicalPositionWhenRtl(position: FlexGlobalLogicalPosition): FlexGlobalPhysicalPosition {
    switch (position) {
      case FlexGlobalLogicalPosition.TOP_START:
        return FlexGlobalPhysicalPosition.TOP_RIGHT;
      case FlexGlobalLogicalPosition.TOP_END:
        return FlexGlobalPhysicalPosition.TOP_LEFT;
      case FlexGlobalLogicalPosition.BOTTOM_START:
        return FlexGlobalPhysicalPosition.BOTTOM_RIGHT;
      case FlexGlobalLogicalPosition.BOTTOM_END:
        return FlexGlobalPhysicalPosition.BOTTOM_LEFT;
    }
  }
}
