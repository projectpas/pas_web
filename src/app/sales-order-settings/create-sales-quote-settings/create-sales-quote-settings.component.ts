import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
declare var $: any;
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { MenuItem } from 'primeng/api';//bread crumb
import { AuthService } from '../../services/auth.service';
import { CustomerService } from '../../services/customer.service';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { Subject } from 'rxjs'
import { DatePipe } from '@angular/common';
import { SalesQuoteService } from '../../services/salesquote.service';
import { SOQSettingsModel } from '../../components/sales/quotes/models/verify-sales-quote-model';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-create-sales-quote-settings',
    templateUrl: './create-sales-quote-settings.component.html',
    styleUrls: ['./create-sales-quote-settings.component.scss'],
    providers: [DatePipe]
})
export class CreateSalesQuoteSettingsComponent implements OnInit {
    accountTypes: any[] = [];
    receivingForm: SOQSettingsModel = new SOQSettingsModel();
    @ViewChild("errorMessagePop", { static: false }) public errorMessagePop: ElementRef;
    errorModal: NgbModalRef;
    salesOrderStatusList: any = [];
    salesOrderPriorityList: any = [];
    isEditMode: boolean = false;
    private onDestroy$: Subject<void> = new Subject<void>();
    breadcrumbs: MenuItem[] = [
        { label: 'Admin' },
        { label: 'SO Quote Settings' },
        { label: 'Create SO Quote Settings' }
    ];
    salesOrderTypes;
    moduleName: string = "SO Quote Settings";
    allSettings: any = [];
    isSpinnerVisible = false;
    disableSave = true;
    errorMessages: any[] = [];
    salesOrderViewList = [{ label: "PN View", value: 1 },
    { label: "SOQ View", value: 2 }];

    constructor(private router: Router,
        private salesQuoteService: SalesQuoteService,
        private alertService: AlertService,
        private customerService: CustomerService,
        private authService: AuthService,
        private commonservice: CommonService,
        private modalService: NgbModal) {
    }

    ngOnInit() {
        if (this.salesQuoteService.isEditSOQuoteSettingsList) {
            this.isEditMode = true;
            this.receivingForm = this.salesQuoteService.soQuoteSettingsData;
            if (this.receivingForm.effectiveDate) {
                this.receivingForm.effectiveDate = new Date(this.receivingForm.effectiveDate);
            }
        }
        this.getInitialData();
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
        });
    }

    getInitialData() {
        let quoteTypeId = this.receivingForm.quoteTypeId ? this.receivingForm.quoteTypeId : 0;
        let defaultStatusId = this.receivingForm.defaultStatusId ? this.receivingForm.defaultStatusId : 0;
        let defaultPriorityId = this.receivingForm.defaultPriorityId ? this.receivingForm.defaultPriorityId : 0;
        let defaultStatus = this.receivingForm.soqListStatusId ? this.receivingForm.soqListStatusId : 0;

        this.isSpinnerVisible = true;
        forkJoin(
            this.commonservice.autoSuggestionSmartDropDownList('MasterSalesOrderQuoteTypes', 'Id', 'Description', '', true, 100, [quoteTypeId].join(), this.masterCompanyId),
            this.commonservice.autoSuggestionSmartDropDownList('MasterSalesOrderQuoteStatus', 'Id', 'Name', '', true, 100, [defaultStatusId, defaultStatus].join(), this.masterCompanyId),
            this.commonservice.autoSuggestionSmartDropDownList('Priority', 'PriorityId', 'Description', '', true, 100, [defaultPriorityId].join(), this.masterCompanyId),
        ).subscribe(result => {
            this.isSpinnerVisible = false;
            this.salesOrderTypes = result[0];
            this.salesOrderStatusList = result[1];
            this.salesOrderPriorityList = result[2];
        }, error => {
            this.isSpinnerVisible = false;
        })
    }

    getAllsalesOrderTypes(): void {
        this.commonservice.smartDropDownList("MasterSalesOrderQuoteTypes", "Id", "Description").subscribe(
            result => {
                this.salesOrderTypes = result[0];
            }, error => {
                this.isSpinnerVisible = false;
            }
        );
    }

    saveOrUpdateSOQuoteSetting() {
        this.isSpinnerVisible = true;
        let validSettings = this.validateSettings();
        if (validSettings) {
            this.isSpinnerVisible = false;
            let content = this.errorMessagePop;
            this.errorModal = this.modalService.open(content, { size: "sm", backdrop: 'static', keyboard: false });
        } else {
            if (!this.isEditMode) {
                this.receivingForm.createdDate.toDateString();
            }
            this.receivingForm.createdDate = new Date();
            this.receivingForm.updatedDate = new Date();
            this.receivingForm.updatedDate.toDateString();
            this.receivingForm.createdBy = this.userName;
            this.receivingForm.updatedBy = this.userName;
            this.receivingForm.masterCompanyId = Number(this.masterCompanyId);
            this.salesQuoteService.saveOrUpdateSOQuoteSetting(this.receivingForm)
                .subscribe(
                    (res) => {
                        this.isSpinnerVisible = false;
                        this.alertService.showMessage(
                            this.moduleName,
                            `Setting ${(this.isEditMode) ? 'updated' : 'created'} successfully`,
                            MessageSeverity.success
                        );
                        this.router.navigateByUrl('/salesordersettingsmodule/salesordersettings/app-sales-quote-settings-list');
                    }, error => {
                        this.isSpinnerVisible = false;
                    }
                )
        }

    }

    closeErrorMessage() {
        this.errorModal.close();
    }

    validateSettings() {
        this.errorMessages = [];

        let haveError = false;
        if (this.receivingForm.soqListViewId <= 0) {
            this.errorMessages.push("Please select SO List View");
            haveError = true;
        }
        if (this.receivingForm.soqListStatusId <= 0) {
            this.errorMessages.push("Please select SO List Status ");
            haveError = true;
        }
        if (this.receivingForm.quoteTypeId <= 0) {
            this.errorMessages.push("Please select SO Type");
            haveError = true;
        }
        if (!this.receivingForm.prefix) {
            this.errorMessages.push("Please enter Prefix");
            haveError = true;
        }
        if (!this.receivingForm.startCode) {
            this.errorMessages.push("Please enter Start Code");
            haveError = true;
        }
        if (!this.receivingForm.validDays || this.receivingForm.validDays <= 0) {
            this.errorMessages.push("Please enter Valid Days");
            haveError = true;
        }
        if (this.receivingForm.defaultPriorityId <= 0) {
            this.errorMessages.push("Please select Priority");
            haveError = true;
        }
        if (this.receivingForm.defaultStatusId <= 0) {
            this.errorMessages.push("Please select SOQ Status");
            haveError = true;
        }
        if (this.receivingForm.isApprovalRule) {
            if (this.receivingForm.effectiveDate == null) {
                this.errorMessages.push("Effective Date Required!");
                haveError = true;
            }
        }
        return haveError;
    }
}