import { Component } from '@angular/core';
import { fadeInOut } from '../../../services/animations';
import { PageHeaderComponent } from '../../../shared/page-header.component';
import * as $ from 'jquery';

@Component({
    selector: 'app-general-ledger-currency',
    templateUrl: './general-ledger-currency.component.html',
    styleUrls: ['./general-ledger-currency.component.scss'],
    animations: [fadeInOut]
})
/** GeneralLedgerCurrency component*/
export class GeneralLedgerCurrencyComponent {
    /** GeneralLedgerCurrency ctor */
    constructor() {
        $(document).ready(function () {

        });
    }
}