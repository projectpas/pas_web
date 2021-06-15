// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { Component, ViewChild, AfterViewInit } from "@angular/core";
import { ForgotPasswordComponent } from "../forgot-password/forgot-password.component";
declare var $: any;
@Component({
    selector: "app-forgotpassword",
    templateUrl: './forgotpassword.component.html',
    styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotPassComponent implements AfterViewInit {
    @ViewChild(ForgotPasswordComponent, { static: false }) forgotpasswordControl: ForgotPasswordComponent;

    constructor() {
      }
      
    ngAfterViewInit() {
    }
}