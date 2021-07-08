import { Component, ViewChild, AfterViewInit } from "@angular/core";
import { ResetPasswordComponent } from "../reset-password/reset-password.component";
import { ActivatedRoute } from "@angular/router";
declare var $: any;
@Component({
  selector: "app-resetpassword",
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.scss']
})
export class ResetPassComponent implements AfterViewInit {
  @ViewChild(ResetPasswordComponent, { static: false }) resetpasswordControl: ResetPasswordComponent;
  userId: any;
  code: any;
  masterCompanyId: any;

  constructor(private activatedRoute: ActivatedRoute) {
  }

  ngAfterViewInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.userId = params['UserId'];
      this.code = params['code'];
      this.masterCompanyId = params['cId'];
    });
  }

  resetPassword() {
    this.resetpasswordControl.userId = this.userId;
    this.resetpasswordControl.token = this.code;
    this.resetpasswordControl.companyId = this.masterCompanyId;
    this.resetpasswordControl.resetPassword();
  }
}