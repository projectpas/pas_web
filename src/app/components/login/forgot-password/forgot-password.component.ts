// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================
import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { AuthService } from "../../../services/auth.service";
import * as $ from 'jquery';
import { Router } from '@angular/router';
import { MasterCompany } from "../../../models/mastercompany.model";
import { ForgotPassword } from "../../../models/forgot-password.model";
import { AccountService } from "../../../services/account.service";
import { Utilities } from "../../../services/utilities";
import { EmployeeService } from "../../../services/employee.service";

declare var $: any;
@Component({
    selector: "app-forgot-password",
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
    forgotPasswordForm: FormGroup;
    isLoading = false;
    formResetToggle = true;
    modalClosedCallback: () => void;
    loginStatusSubscription: any;
    masterCompanyList: MasterCompany[] = [];
    @Input() isModal = false;

    constructor(
        private alertService: AlertService,
        private authService: AuthService,
        private formBuilder: FormBuilder,
        private router: Router,
        private employeeService: EmployeeService) {
        this.buildForm();
    }

    ngOnInit() {
        this.forgotPasswordForm.setValue({
            email: ''
        });
    }

    ngOnDestroy() {
        if (this.loginStatusSubscription) {
            this.loginStatusSubscription.unsubscribe();
        }
    }

    buildForm() {
        this.forgotPasswordForm = this.formBuilder.group({
            email: ['', Validators.required]
        });
    }

    get email() { return this.forgotPasswordForm.get('email'); }

    getShouldRedirect() {
        return !this.isModal && this.authService.isLoggedIn && !this.authService.isSessionExpired;
    }

    showErrorAlert(caption: string, message: string) {
        this.alertService.showMessage(caption, message, MessageSeverity.error);
    }

    closeModal() {
        if (this.modalClosedCallback) {
            this.modalClosedCallback();
        }
    }

    getUserLogin(): ForgotPassword {
        const formModel = this.forgotPasswordForm.value;
        return new ForgotPassword(formModel.email);
    }

    sendForgetPasswordLink() {
        debugger;
        this.isLoading = true;
        this.alertService.startLoadingMessage("", "Attempting login...");
        var email = this.forgotPasswordForm.value.email;
        this.alertService.startLoadingMessage();
        this.employeeService.forgotPassword(email).subscribe(res => {
            this.alertService.stopLoadingMessage();
            this.alertService.showMessage("Reset Password", `Password Reset Link Has Been Sent`, MessageSeverity.success);
            this.authService.logout();
            this.router.navigateByUrl('/Login');
        },
            error => {
                this.alertService.stopLoadingMessage();
                this.alertService.showStickyMessage("Load Error", `Unable to reset password.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`,
                    MessageSeverity.error, error);
            });
    }

    mapLoginErrorMessage(error: string) {
        if (error == 'invalid_username_or_password')
            return 'Invalid username or password';
        if (error == 'invalid_grant')
            return 'This account has been disabled';
        return error;
    }

    reset() {
        this.formResetToggle = false;

        setTimeout(() => {
            this.formResetToggle = true;
        });
    }
}