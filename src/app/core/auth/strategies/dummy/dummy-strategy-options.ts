import { FlexAuthStrategyOptions } from '../auth-strategy-options';
import { FlexAuthSimpleToken } from '../../services/token/token';

export class FlexDummyAuthStrategyOptions extends FlexAuthStrategyOptions {
  token? = {
    class: FlexAuthSimpleToken,
  };
  delay? = 1000;
  alwaysFail? = false;
}

export const dummyStrategyOptions: FlexDummyAuthStrategyOptions = new FlexDummyAuthStrategyOptions();
