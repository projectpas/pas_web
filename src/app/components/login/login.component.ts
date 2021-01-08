// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { Component, ViewChild, AfterViewInit } from "@angular/core";

import { LoginControlComponent } from './login-control.component';
import * as $ from 'jquery';
@Component({
    selector: "app-login",
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements AfterViewInit {
    @ViewChild(LoginControlComponent,{static:false})
    loginControl: LoginControlComponent;

    ngAfterViewInit() {


    }
}