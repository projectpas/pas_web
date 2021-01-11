import { Component } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { PageHeaderComponent } from '../../shared/page-header.component';
declare var $ : any;

@Component({
    selector: 'app-platform',
    templateUrl: './platform.component.html',
    styleUrls: ['./platform.component.scss'],
    animations: [fadeInOut]
})
/** Platform component*/
export class PlatformComponent {
    /** Platform ctor */
    constructor() {
        $(document).ready(function () {

        });
    }
}