import { Component, OnInit, Input } from '@angular/core';
import { AlertService } from '../../../../services/alert.service';
import { Router } from '@angular/router';
import * as $ from 'jquery'
import { fadeInOut } from '../../../../services/animations';

@Component({
    selector: 'app-view-asset',
    templateUrl: './view-asset.component.html',
    styleUrls: ['./view-asset.component.scss'],
    animations: [fadeInOut]
})
/** View-Asset component*/
export class ViewAssetComponent implements OnInit {

    @Input() assetViewList: any;

    ngOnInit(): void {
        // console.log('childMessage' + JSON.stringify(this.assetViewList));
    }

    constructor(private alertService: AlertService,
          private _route: Router, ) {
    }

    openAllCollapse() {
        $('#step1').collapse('show');
        $('#step2').collapse('show');
        $('#step3').collapse('show');
        $('#step4').collapse('show');
    }
    closeAllCollapse() {
        $('#step1').collapse('hide');
        $('#step2').collapse('hide');
        $('#step3').collapse('hide');
        $('#step4').collapse('hide');
    }
 }