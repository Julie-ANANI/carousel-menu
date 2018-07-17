import { Pipe, PipeTransform } from '@angular/core';


@Pipe({name: 'dateTransform'})

export class DateFormatPipe implements PipeTransform {

    YEAR_DAYS = 365;
    YEAR_MONTHS = 12;
    MONTH_DAYS = 30;
    DAY_HOURS = 24;


    transform(value: number, format: string): string{
        let years = '';
        let months = '';
        let days = '';
        value = Math.abs(value);
        if(value >= this.YEAR_DAYS) {
            years = `${Math.floor(value / this.YEAR_DAYS)}`;
            value = value % this.YEAR_DAYS;
        }
        if(value >= this.MONTH_DAYS) {
            months = `${Math.floor(value / this.MONTH_DAYS)}`;
            value = value % this.MONTH_DAYS;
        }
        days = `${value}`;
        return '-' + (years ? `${years} y,` : '') + (months ? ` ${months} m,` : '') + (days ? ` ${days} d` : '0d');
    }

}
