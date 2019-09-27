/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { FlexAuthTokenClass } from '../services/token/token';

export class FlexAuthStrategyOptions {
  name: string;
  token?: {
    class?: FlexAuthTokenClass;
    [key: string]: any;
  };
}
