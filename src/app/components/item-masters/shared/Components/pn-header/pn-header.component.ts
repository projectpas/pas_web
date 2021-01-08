import { Component, ViewChild, OnInit, AfterViewInit, Input, ChangeDetectorRef, ElementRef, SimpleChanges } from '@angular/core';
import { fadeInOut } from '../../../../../services/animations';


@Component({
    selector: 'app-pn-header',
    templateUrl: './pn-header.component.html',
    styleUrls: ['./pn-header.component.scss'],
    animations: [fadeInOut],

})
/** item-master-capabilities-list component*/
export class PNHeaderComponent implements OnInit {
    @Input() partData: any = {};
   


    constructor(){
               
    }


    ngOnInit() {
    }
}