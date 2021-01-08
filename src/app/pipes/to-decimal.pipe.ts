
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'toDecimal' })
export class ToDecimalPipe implements PipeTransform {

    //#TODO: Inject a singletone service here to get the gobal number formatter setting
    constructor() {

    }

    transform(value: number,
        decimalLength: number = 2): string {

        if (typeof (value) === 'undefined' || Number.isNaN(value)) {
            value = 0;
        }

        return decimalLength <= 0
            ? value.toString()
            : value.toFixed(Math.max(0, ~~decimalLength));
    }
}