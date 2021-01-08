// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'globalNmberFormat', pure: true })
export class GlobalNumberFormat implements PipeTransform {
    transform(value: any): any {
        if (!value) return 0;

        var globalObject = JSON.parse(localStorage.getItem('global_settings'));
        var localId = 'en-US';
        if (globalObject) {
            localId = globalObject.cultureName;
        }
        let valueAfterRemovingComma = Number(value.toString().replace(/\,/g, ''));
        // let tempValue = Number(value.toString().replace(/[^0-9.-]+/g, "")).toLocaleString(localId);
        let tempValue = Number(valueAfterRemovingComma).toLocaleString(localId);

        return tempValue;

    }
}