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
import { MasterComapnyService } from "../../../services/mastercompany.service";

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
        private masterCompanyService: MasterComapnyService,
        private employeeService: EmployeeService) {
        this.buildForm();
    }

    ngOnInit() {
        this.forgotPasswordForm.setValue({
            email: '',
            masterCompanyId: 1
        });

        this.loadMasterCompanies();
    }

    private loadMasterCompanies() {
        this.masterCompanyService.getMasterCompanies().subscribe(
            results => this.onDataMasterCompaniesLoadSuccessful(results[0]),
            error => this.onDataLoadFailed(error)
        );
    }

    private onDataMasterCompaniesLoadSuccessful(allComapnies: MasterCompany[]) {
        this.masterCompanyList = allComapnies;
        if (this.getShouldRedirect()) {
            this.authService.redirectLoginUser();
        }
        else {
            this.loginStatusSubscription = this.authService.getLoginStatusEvent()
                .subscribe(isLoggedIn => {
                    if (this.getShouldRedirect()) {
                        this.authService.redirectLoginUser();
                    }
                });
        }
    }

    private onDataLoadFailed(error: any) {
    }

    ngOnDestroy() {
        if (this.loginStatusSubscription) {
            this.loginStatusSubscription.unsubscribe();
        }
    }

    buildForm() {
        this.forgotPasswordForm = this.formBuilder.group({
            email: ['', Validators.required],
            masterCompanyId: ['', Validators.required]
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
        return new ForgotPassword(formModel.email, formModel.masterCompanyId);
    }

    backToLoginLink() {
        this.router.navigateByUrl('/Login');
    }

    get masterCompanyId() { return this.forgotPasswordForm.get('masterCompanyId'); }

    sendForgetPasswordLink() {
        this.isLoading = true;
        this.alertService.startLoadingMessage("", "Attempting login...");
        var email = this.forgotPasswordForm.value.email;
        var masterCompanyId = this.forgotPasswordForm.value.email;
        this.alertService.startLoadingMessage();
        this.employeeService.forgotPassword(email, this.masterCompanyId.value).subscribe(res => {
            this.alertService.stopLoadingMessage();
            this.isLoading = false;
            this.alertService.showMessage("Reset Password", `please check your email to reset your password.`, MessageSeverity.success);
            //this.router.navigateByUrl('/Login');
        }, error => {
            this.alertService.stopLoadingMessage();
            this.isLoading = false;
            //this.alertService.showStickyMessage("Load Error", `Unable to reset password.\r\nErrors: "${Utilities.getHttpResponseMessage(error)}"`, MessageSeverity.error, error);
            this.alertService.showMessage("Reset Password", `please check your email to reset your password.`, MessageSeverity.success);
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