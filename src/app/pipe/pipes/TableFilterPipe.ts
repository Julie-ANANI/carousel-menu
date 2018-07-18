import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
    name: 'filter',
    pure: false
})

@Injectable()
export class FilterPipe implements PipeTransform {
    transform(items: any[], fields: any, value: string): any[] {
        if (!items) {
            return [];
        }
        const validFields = FilterPipe.validFields(fields);
        if (validFields.length === 0) {
            return items;
        }


        return items.filter(singleItem => {
            let valid = true;
            validFields.forEach(field => {
                valid = valid && singleItem[field].toLowerCase().includes(fields[field].toLowerCase());
            });
            return valid;
        });
    }

    static validFields(fields: any): Array<any> {
        return Object.keys(fields).filter(field => fields[field] !== '');
    }
}
