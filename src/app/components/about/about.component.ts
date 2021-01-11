// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { Component } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
declare var $ : any;


@Component({
    selector: 'about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss'],
    animations: [fadeInOut]
})
export class AboutComponent {


    title = 'abgular 4 with jquery';
    toggleTitle() {
        $('.title').slideToggle(); //
    }


}