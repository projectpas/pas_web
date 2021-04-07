// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AlertService, MessageSeverity, DialogType } from '../../services/alert.service';
import { AuthService } from "../../services/auth.service";
import { ConfigurationService } from '../../services/configuration.service';
import { Utilities } from '../../services/utilities';
import { UserLogin } from '../../models/user-login.model';
import {MasterComapnyService} from '../../services/mastercompany.service';
import * as $ from 'jquery';
import { MasterCompany } from 'src/app/models/mastercompany.model';
import { Router } from '@angular/router';

declare var $ : any;
@Component({
    selector: "app-login-control",
    templateUrl: './login-control.component.html',
    styleUrls: ['./login-control.component.scss']
})
export class LoginControlComponent implements OnInit, OnDestroy {
    loginForm: FormGroup;

    isLoading = false;
    formResetToggle = true;
    modalClosedCallback: () => void;
    loginStatusSubscription: any;

    masterCompanyList:MasterCompany[] = [];

    @Input()
    isModal = false;

    constructor(
        private alertService: AlertService,
        private authService: AuthService,
        private configurations: ConfigurationService,
        private formBuilder: FormBuilder,
        private masterCompanyService:MasterComapnyService,
        private router:Router) {
        this.buildForm();
    }

    ngOnInit() {
        this.loginForm.setValue({
            userName: '',
            password: '',
            masterCompanyId:1,
            rememberMe: this.authService.rememberMe
        });

        this.loadMasterCompanies();

        // if (this.getShouldRedirect()) {
        //     this.authService.redirectLoginUser();
        // }
        // else {
        //     this.loginStatusSubscription = this.authService.getLoginStatusEvent()
        //         .subscribe(isLoggedIn => {
        //             if (this.getShouldRedirect()) {
        //                 this.authService.redirectLoginUser();
        //             }
        //         });
        // }
    }

    private loadMasterCompanies() {
        this.masterCompanyService.getMasterCompanies().subscribe(
            results => this.onDataMasterCompaniesLoadSuccessful(results[0]),
            error => this.onDataLoadFailed(error)
        );
    
    }

    private onDataMasterCompaniesLoadSuccessful(allComapnies: MasterCompany[]) {
        // alert('success');
       //alert(allComapnies);
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
console.log(error);
    }

    private onDataLoadFailed(error: any) {
        console.log(error);
    }
    
    ngOnDestroy() {
        if (this.loginStatusSubscription) {
            this.loginStatusSubscription.unsubscribe();
        }
    }

    buildForm() {
        this.loginForm = this.formBuilder.group({
            userName: ['', Validators.required],
            password: ['', Validators.required],
            masterCompanyId: ['', Validators.required],
            rememberMe: ''
        });
    }

    get userName() { return this.loginForm.get('userName'); }

    get password() { return this.loginForm.get('password'); }

    get masterCompanyId(){return this.loginForm.get('masterCompanyId');}

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
   
    getUserLogin(): UserLogin {
        const formModel = this.loginForm.value;
        return new UserLogin(formModel.userName, formModel.password, formModel.rememberMe,formModel.masterCompanyId);
    }
    
 
    
    login() {
        this.isLoading = true;
        this.alertService.startLoadingMessage("", "Attempting login...");
        this.authService.login(this.getUserLogin()).subscribe(
            user => {              
                const userLoginDetails = localStorage.getItem('current_user') === null || localStorage.getItem('current_user') == undefined ?    sessionStorage.getItem('current_user')  :  localStorage.getItem('current_user');
                if(this.authService.currentUser.isResetPassword=="False"){
                    this.router.navigateByUrl('/UpdatePassword');
                }
                //this.getEmployeeDetailsByEmployeeId(userLoginDetails);
                setTimeout(() => {
                    this.alertService.stopLoadingMessage();
                    this.isLoading = false;
                    this.reset();

                    if (!this.isModal) {
                      
                        this.alertService.showMessage("Login", `Welcome ${user.userName}!`, MessageSeverity.success);
                    }
                    else {
                       
                        this.alertService.showMessage("Login", `Session for ${user.userName} restored!`, MessageSeverity.success);
                        setTimeout(() => {
                            this.alertService.showStickyMessage("Session Restored", "Please try your last operation again", MessageSeverity.default);
                        }, 500);

                        this.closeModal();
                    }
                }, 500);
            },
            error => {
                this.alertService.stopLoadingMessage();

                if (Utilities.checkNoNetwork(error)) {
                    this.alertService.showStickyMessage(Utilities.noNetworkMessageCaption, Utilities.noNetworkMessageDetail, MessageSeverity.error, error);
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error) || Utilities.findHttpResponseMessage("error", error);

                    if (errorMessage) {
                        this.alertService.showStickyMessage("Unable to login", this.mapLoginErrorMessage(errorMessage), MessageSeverity.error, error);
                    }
                    else {
                        this.alertService.showStickyMessage("Unable to login", "An error occured, please try again later.\nError: " + error.statusText || error.status, MessageSeverity.error, error);
                    }
                }
                setTimeout(() => {
                    this.isLoading = false;
                }, 500);
            });
    }

    getEmployeeDetailsByEmployeeId(loginDetails)
    {        
        const {employeeId} = JSON.parse(loginDetails);
      
        if( parseInt(employeeId) > 0)
        {           
            this.authService.employeeDetailsByEmpId(parseInt(employeeId)).subscribe(res => {
                console.log(res);
            })
        }
        
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