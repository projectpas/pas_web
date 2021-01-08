import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { fadeInOut } from '../../services/animations';

@Component({
    selector: 'app-actions',
    templateUrl: './actions-buttons.component.html',
    styleUrls: [],
    animations: [fadeInOut]
})
/** Actions component*/
export class ActionsButtonsComponent implements OnInit {

    constructor() {
    }

    ngOnInit(): void {

    }
}