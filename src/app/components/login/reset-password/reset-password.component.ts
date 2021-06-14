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
import { Utilities } from "../../../services/utilities";
import { EmployeeService } from "../../../services/employee.service";

declare var $: any;
@Component({
    selector: "app-reset-password",
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
    resetPasswordForm: FormGroup;
    isLoading = false;
    formResetToggle = true;
    modalClosedCallback: () => void;
    loginStatusSubscription: any;
    masterCompanyList: MasterCompany[] = [];
    @Input() isModal = false;
    userId: string;
    token: string;

    constructor(
        private alertService: AlertService,
        private authService: AuthService,
        private formBuilder: FormBuilder,
        private router: Router,
        private employeeService: EmployeeService) {
        this.buildForm();
    }

    ngOnInit() {
        this.resetPasswordForm.setValue({
            password: '',
            cpassword: ''
        });
    }

    ngOnDestroy() {
        if (this.loginStatusSubscription) {
            this.loginStatusSubscription.unsubscribe();
        }
    }

    buildForm() {
        this.resetPasswordForm = this.formBuilder.group({
            'password': [null, Validators.compose([Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}$')])],
            'cpassword': [null, Validators.compose([Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}$')])]
        }, {
            validators: this.ConfirmedValidator('password', 'cpassword')
        });
    }

    ConfirmedValidator(controlName: string, matchingControlName: string) {
        debugger;
        return (formGroup: FormGroup) => {
            const control = formGroup.controls[controlName];
            const matchingControl = formGroup.controls[matchingControlName];
            if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
                return;
            }
            if (control.value !== matchingControl.value) {
                matchingControl.setErrors({ confirmedValidator: true });
            } else {
                matchingControl.setErrors(null);
            }
        }
    }

    get password() { return this.resetPasswordForm.get('password'); }
    get cpassword() { return this.resetPasswordForm.get('cpassword'); }

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
        const formModel = this.resetPasswordForm.value;
        return new ForgotPassword(formModel.password);
    }

    resetPassword() {
        this.isLoading = true;
        var data = {
            password: this.resetPasswordForm.value.password,
            userId: this.userId,
            code: this.token
        }

        this.alertService.startLoadingMessage();
        this.employeeService.resetPassword(data).subscribe(res => {
            this.alertService.stopLoadingMessage();
            this.alertService.showMessage("Reset Password", `Your password has been reset.`, MessageSeverity.success);
            this.isLoading = true;
            this.router.navigateByUrl('/login');
        }, error => {
            this.isLoading = true;
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