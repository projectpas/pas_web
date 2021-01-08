// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { Pipe, PipeTransform } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { DecimalPipe } from '@angular/common';


// @Pipe({ name: 'twoDecimalGlobalNumberFormatPipe', pure: true })
// export class TwoDecimalGlobalNumberFormatPipe implements PipeTransform {
//     transform(value: number): any {
//              if (!value || value == 0) return 0.00;
//         var globalObject = JSON.parse(localStorage.getItem('global_settings'));
//         var localId = 'en-US';
//         if(globalObject){
//             localId = globalObject.cultureName;
//         }         
//         let tempValue = value.toString().replace(",", "");
//        return new Intl.NumberFormat(localId, {style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2}).format(parseFloat(tempValue));
//      }
// }
@Pipe({ name: 'twoDecimalGlobalNumberFormatPipe', pure: true })
export class TwoDecimalGlobalNumberFormatPipe extends DecimalPipe{
    transform(value: any, digitsInfo: string = "1.2-5"): any {
             if (!value)  return super.transform(0, digitsInfo, localId);

        var globalObject = JSON.parse(localStorage.getItem('global_settings'));
        var localId = 'en-US';
        if(globalObject){
            localId = globalObject.cultureName;
        }         
        // let tempValue = value.toString().replace(",", "");
        let tempValue = Number(value.toString().replace(/[^0-9.-]+/g, ""));
    //    return new Intl.NumberFormat(localId, {style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2}).format(parseFloat(tempValue));

       const str = super.transform(tempValue, digitsInfo, localId);
       return str;

     }
}