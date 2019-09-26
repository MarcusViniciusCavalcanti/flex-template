import {
  FlexConnectedOverlayPositionChange,
  FlexConnectedPosition, FlexConnectionPositionPair,
  FlexFlexibleConnectedPositionStrategy, FlexOverlayRef,
  FlexPositionStrategy
} from '../../flex-cdk-mapping.module';
import { FlexPosition } from '../flex-position';
import { FlexAdjustment } from '../flex-adjustment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

function comparePositions(p1: FlexConnectedPosition, p2: FlexConnectedPosition): boolean {
  return p1.originX === p2.originX
    && p1.originY === p2.originY
    && p1.overlayX === p2.overlayX
    && p1.overlayY === p2.overlayY;
}

const COUNTER_CLOCKWISE_POSITIONS = [FlexPosition.TOP, FlexPosition.LEFT, FlexPosition.BOTTOM, FlexPosition.RIGHT];
const CLOCKWISE_POSITIONS = [FlexPosition.TOP, FlexPosition.RIGHT, FlexPosition.BOTTOM, FlexPosition.LEFT];
const VERTICAL_POSITIONS = [FlexPosition.BOTTOM, FlexPosition.TOP];
const HORIZONTAL_POSITIONS = [FlexPosition.START, FlexPosition.END];

const POSITIONS = {
  [FlexPosition.RIGHT](offset) {
    return { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: offset };
  },
  [FlexPosition.BOTTOM](offset) {
    return { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: offset };
  },
  [FlexPosition.LEFT](offset) {
    return { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -offset };
  },
  [FlexPosition.TOP](offset) {
    return { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -offset };
  },
  [FlexPosition.START](offset) {
    return this[FlexPosition.LEFT](offset);
  },
  [FlexPosition.END](offset) {
    return this[FlexPosition.RIGHT](offset);
  },
};

export class FlexAdjustableConnectedPositionStrategy
  extends FlexFlexibleConnectedPositionStrategy implements FlexPositionStrategy {
  protected pos: FlexPosition;
  protected off = 15;
  protected adj: FlexAdjustment;

  protected appliedPositions: { key: FlexPosition, connectedPosition: FlexConnectedPosition }[];

  readonly positionChange: Observable<FlexPosition> = this.positionChanges.pipe(
    map((positionChange: FlexConnectedOverlayPositionChange) => positionChange.connectionPair),
    map((connectionPair: FlexConnectionPositionPair) => {
      return this.appliedPositions.find(({ connectedPosition }) => {
        return comparePositions(connectedPosition, connectionPair);
      }).key;
    }),
  );

  attach(overlayRef: FlexOverlayRef) {
    this.applyPositions();
    super.attach(overlayRef);
  }

  apply() {
    this.applyPositions();
    super.apply();
  }

  position(position: FlexPosition): this {
    this.pos = position;
    return this;
  }

  adjustment(adjustment: FlexAdjustment): this {
    this.adj = adjustment;
    return this;
  }

  offset(offset: number): this {
    this.off = offset;
    return this;
  }

  protected applyPositions() {
    const positions: FlexPosition[] = this.createPositions();
    this.persistChosenPositions(positions);
    this.withPositions(this.appliedPositions.map(({ connectedPosition }) => connectedPosition));
  }

  protected createPositions(): FlexPosition[] {
    switch (this.adj) {
      case FlexAdjustment.NOOP:
        return [ this.pos ];
      case FlexAdjustment.CLOCKWISE:
        return this.reorderPreferredPositions(CLOCKWISE_POSITIONS);
      case FlexAdjustment.COUNTERCLOCKWISE:
        return this.reorderPreferredPositions(COUNTER_CLOCKWISE_POSITIONS);
      case FlexAdjustment.HORIZONTAL:
        return this.reorderPreferredPositions(HORIZONTAL_POSITIONS);
      case FlexAdjustment.VERTICAL:
        return this.reorderPreferredPositions(VERTICAL_POSITIONS);
    }
  }

  protected persistChosenPositions(positions: FlexPosition[]) {
    this.appliedPositions = positions.map(position => ({
      key: position,
      connectedPosition: POSITIONS[position](this.off),
    }));
  }

  protected reorderPreferredPositions(positions: FlexPosition[]): FlexPosition[] {
    const cpy = positions.slice();
    const startIndex = positions.indexOf(this.pos);
    const start = cpy.splice(startIndex);
    return start.concat(...cpy);
  }
}
