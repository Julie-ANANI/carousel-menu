/**
 * Created by juandavidcruzgomez on 13/04/2018.
 */

import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({ name: 'limits' })

@Injectable()
export class LimitsPipe implements PipeTransform {
    transform(items: any[], field: string, value: number): any[] {
        if (!items) {
            return [];
        }

        if (!field || !value) {
            return items;
        }

        let start = (field === 'offset') ? (value || 0) : 0;
        let limit = (field === 'limit') ? (value || items.length) : items.length;



        return items.slice(start, (start + limit));
    }

}
