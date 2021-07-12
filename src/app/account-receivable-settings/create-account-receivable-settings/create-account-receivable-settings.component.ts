import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
declare var $: any;
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { MenuItem } from 'primeng/api';//bread crumb
import { AuthService } from '../../services/auth.service';
import { CustomerService } from '../../services/customer.service';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { Subject } from 'rxjs'
import { DatePipe } from '@angular/common';
import { SOSettingsModel } from '../../components/sales/quotes/models/verify-sales-quote-model';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { CustomerPaymentsService } from '../../services/customer-payment.service';

@Component({
    selector: 'app-create-account-receivable-settings',
    templateUrl: './create-account-receivable-settings.component.html',
    styleUrls: ['./create-account-receivable-settings.component.scss'],
    providers: [DatePipe]
})

export class CreateARSettingsComponent implements OnInit {
    @ViewChild("errorMessagePop", { static: false }) public errorMessagePop: ElementRef;
    errorModal: NgbModalRef;
    accountTypes: any[] = [];
    receivingForm: SOSettingsModel = new SOSettingsModel();
    isEditMode: boolean = false;
    private onDestroy$: Subject<void> = new Subject<void>();
    breadcrumbs: MenuItem[] = [
        { label: 'Admin' },
        { label: 'AR Settings' },
        { label: 'Create AR Settings' }
    ];

    salesOrderStatusList: any = [];
    salesOrderPriorityList: any = [];
    salesOrderViewList = [{ label: "PN View", value: 1 },
    { label: "SO View", value: 2 }];

    salesOrderTypes;
    moduleName: string = "SO Settings";
    allSettings: any = [];
    isSpinnerVisible = false;
    disableSave = true;
    errorMessages: any[] = [];
    constructor(private router: Router,
        private arService: CustomerPaymentsService,
        private alertService: AlertService,
        private customerService: CustomerService,
        private authService: AuthService,
        private commonservice: CommonService) {
    }

    ngOnInit() {
        if (this.arService.isEditARSettingsList) {
            this.isEditMode = true;
            this.receivingForm = this.arService.arSettingsData;
        }

        this.glList();
    }

    enableSaveUpdate() {
        this.disableSave = false;
    }

    get masterCompanyId(): number {
        return this.authService.currentUser
            ? this.authService.currentUser.masterCompanyId
            : 1;
    }

    get userName(): string {
        return this.authService.currentUser
            ? this.authService.currentUser.userName
            : "";
    }

    getAccountTypes() {
        this.customerService.getCustomerTypes().subscribe(result => {
            this.accountTypes = result[0];
        })
    }

    getAllsalesOrderTypes(): void {
        this.commonservice.smartDropDownList("MasterSalesOrderQuoteTypes", "Id", "Description", 0).subscribe(
            result => {
                this.salesOrderTypes = result[0];
            }, error => {
                this.isSpinnerVisible = false;
            }
        );
    }

    saveOrUpdateSOSetting() {
        if (!this.isEditMode) {
            this.receivingForm.createdDate.toDateString();
        } else {
            this.receivingForm.createdDate = new Date();
        }

        this.receivingForm.updatedDate = new Date();
        this.receivingForm.updatedDate.toDateString();
        this.receivingForm.createdBy = this.userName;
        this.receivingForm.updatedBy = this.userName;
        this.receivingForm.masterCompanyId = Number(this.masterCompanyId);
        this.arService.saveOrUpdateARSetting(this.receivingForm)
            .subscribe(
                (res) => {
                    this.alertService.showMessage(
                        this.moduleName,
                        `Setting ${(this.isEditMode) ? 'updated' : 'created'} successfully`,
                        MessageSeverity.success
                    );
                    this.router.navigateByUrl('/accountreceivablesettingsmodule/arsettings/app-account-receivable-settings-list');
                }, error => {
                    this.isSpinnerVisible = false;
                });
    }

    closeErrorMessage() {
        this.errorModal.close();
    }

    get currentUserMasterCompanyId(): number {
        return this.authService.currentUser
            ? this.authService.currentUser.masterCompanyId
            : null;
    }

    allGlInfo: any[] = [];
    private glList() {
        this.commonservice.getGlAccountList(this.currentUserMasterCompanyId).subscribe(res => {
            this.allGlInfo = res;
        })
    }
}