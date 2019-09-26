import { CollectionViewer, ListRange } from '@angular/cdk/collections';
import { Observable } from 'rxjs';

export interface FlexCollectionViewer extends CollectionViewer {
  viewChange: Observable<ListRange>;
}
