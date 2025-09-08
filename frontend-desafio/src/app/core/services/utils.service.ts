import { Injectable } from '@angular/core';
import { RequestService } from './request.service';

import { map, Observable } from 'rxjs';

import { ISelectOption } from '@app/shared/interfaces/select-options.interface';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  public mapToSelectOptions<T, V>(
    request: RequestService,
    url: string,
    mapLabel: (item: T) => string,
    mapValue: (item: T) => V,
    sortFn?: (a: T, b: T) => number,
  ): Observable<ISelectOption<V>[]> {
    return request.getRequest<T[]>(url).pipe(
      map(response => (sortFn ? [...response].sort(sortFn) : response)),
      map(data => {
        const options: ISelectOption<V>[] = data.map(item => ({
          label: mapLabel(item),
          value: mapValue(item),
        }));

        return options;
      }),
    );
  }
}
