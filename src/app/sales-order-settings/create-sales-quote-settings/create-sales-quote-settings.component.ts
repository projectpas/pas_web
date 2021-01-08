import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { PageHeaderComponent } from '../../shared/page-header.component';
import * as $ from 'jquery';
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { ItemMasterService } from '../../services/itemMaster.service';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
 
import { NgbModal,NgbModalRef, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { MenuItem } from 'primeng/api';//bread crumb
import { Charge } from '../../models/charge.model';
import { MasterCompany } from '../../models/mastercompany.model';
import { AuditHistory } from '../../models/audithistory.model';
import { AuthService } from '../../services/auth.service';
import { ReceivingCustomerWorkService } from '../../services/receivingcustomerwork.service';
import { MasterComapnyService } from '../../services/mastercompany.service';
import { CustomerService } from '../../services/customer.service';
import { Condition } from '../../models/condition.model';
import { ConditionService } from '../../services/condition.service';
import { VendorService } from '../../services/vendor.service';
import { BinService } from '../../services/bin.service';
import { SiteService } from '../../services/site.service';
import { Site } from '../../models/site.model';
import { LegalEntityService } from '../../services/legalentity.service';
import { Router, ActivatedRoute } from '@angular/router';
import { getValueFromObjectByKey, getObjectByValue, getValueFromArrayOfObjectById, getObjectById, editValueAssignByCondition } from '../../generic/autocomplete';
import { CommonService } from '../../services/common.service';
import { Subject ,  forkJoin } from 'rxjs'
import { takeUntil } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { StocklineService } from '../../services/stockline.service';
import { ConfigurationService } from '../../services/configuration.service';
import { WorkOrderService } from '../../services/work-order/work-order.service';
import { WorkOrderType } from '../../models/work-order-type.model';
import { WorkOrderSettingsService } from '../../services/work-order-settings.service';
import { SalesQuoteService } from '../../services/salesquote.service';
import { SOQSettingsModel } from '../../components/sales/quotes/models/verify-sales-quote-model';


@Component({
    selector: 'app-create-sales-quote-settings',
    templateUrl: './create-sales-quote-settings.component.html',
    styleUrls: ['./create-sales-quote-settings.component.scss'],
    providers: [DatePipe]
})

export class CreateSalesQuoteSettingsComponent implements OnInit {


    accountTypes: any[] = [];
    receivingForm: SOQSettingsModel = new SOQSettingsModel();

    @ViewChild("errorMessagePop",{static:false}) public errorMessagePop: ElementRef;
    errorModal: NgbModalRef;
    // salesOrderViewList = [];
    salesOrderStatusList = [];
    salesOrderPriorityList = [];
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
        this.getInitialData();
        if (this.salesQuoteService.isEditSOQuoteSettingsList) {
            this.isEditMode = true;
            this.receivingForm = this.salesQuoteService.soQuoteSettingsData;
        }
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



    getInitialData() {
        this.isSpinnerVisible = true;
        forkJoin(this.commonservice.smartDropDownList("MasterSalesOrderQuoteTypes", "Id", "Description"),
            this.customerService.getCustomerTypes(),
            this.salesQuoteService.getAllSalesOrderQuoteSettings(),
            this.commonservice.smartDropDownList("MasterSalesOrderQuoteStatus", "Id", "Name"),
            this.commonservice.smartDropDownList("Priority", "PriorityId", "Description")
        ).subscribe(result => {
            this.isSpinnerVisible = false;
            this.salesOrderTypes = result[0];
            this.accountTypes = result[1][0];
            this.allSettings = result[2];
            this.salesOrderStatusList = result[3];
            this.salesOrderPriorityList = result[4];

        }, error => {
            this.isSpinnerVisible = false;
            const errorLog = error;
            this.onDataLoadFailed(errorLog)
        })
    }

    getAllsalesOrderTypes(): void {
        this.commonservice.smartDropDownList("MasterSalesOrderQuoteTypes", "Id", "Description").subscribe(
            result => {
                this.salesOrderTypes = result[0];
            }, error => {
                this.isSpinnerVisible = false;
                const errorLog = error;
                this.onDataLoadFailed(errorLog)
            }
        );
    }

    saveOrUpdateSOQuoteSetting() {
        let validSettings = this.validateSettings();
        if (validSettings) {
            let content = this.errorMessagePop;
            this.errorModal = this.modalService.open(content, { size: "sm", backdrop: 'static', keyboard: false });
            this.errorModal.result.then(
                () => {
                },
                () => {
                }
            );
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
                        this.alertService.showMessage(
                            this.moduleName,
                            `Setting ${(this.isEditMode) ? 'updated' : 'created'} successfully`,
                            MessageSeverity.success
                        );
                        this.router.navigateByUrl('/salesordersettingsmodule/salesordersettings/app-sales-quote-settings-list');
                    }, error => {
                        this.isSpinnerVisible = false;
                        const errorLog = error;
                        this.onDataLoadFailed(errorLog)
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
        return haveError;
    }

    onDataLoadFailed(log) {
        // this.isSpinnerVisible = false;
        const errorLog = log;
        var msg = '';
        if (errorLog.message) {
            if (errorLog.error && errorLog.error.errors.length > 0) {
                for (let i = 0; i < errorLog.error.errors.length; i++) {
                    msg = msg + errorLog.error.errors[i].message + '<br/>'
                }
            }
            this.alertService.showMessage(
                errorLog.error.message,
                msg,
                MessageSeverity.error
            );
        }
        else {
            this.alertService.showMessage(
                'Error',
                log.error,
                MessageSeverity.error
            );
        }
    }


}



