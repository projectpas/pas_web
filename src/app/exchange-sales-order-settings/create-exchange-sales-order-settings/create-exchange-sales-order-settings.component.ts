import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
declare var $: any;
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { CustomerService } from '../../services/customer.service';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { Subject } from 'rxjs'
import { DatePipe } from '@angular/common';
import { ExchangeSOSettingsModel } from '../../components/exchange-sales-order/models/verify-exchange-sales-order-model';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { ExchangeSalesOrderService } from '../../services/exchangesalesorder.service';
@Component({
  selector: 'app-create-exchange-sales-order-settings',
  templateUrl: './create-exchange-sales-order-settings.component.html',
  styleUrls: ['./create-exchange-sales-order-settings.component.scss'],
  providers: [DatePipe]
})
export class CreateExchangeSalesOrderSettingsComponent implements OnInit {
  @ViewChild("errorMessagePop", { static: false }) public errorMessagePop: ElementRef;
  errorModal: NgbModalRef;
  accountTypes: any[] = [];
  receivingForm: ExchangeSOSettingsModel = new ExchangeSOSettingsModel();
  isEditMode: boolean = false;
  private onDestroy$: Subject<void> = new Subject<void>();
  breadcrumbs: MenuItem[] = [
    { label: 'Admin' },
    { label: 'Exchange SO  Settings' },
    { label: 'Create Exchange SO Settings' }
  ];
  salesOrderStatusList: any = [];
  salesOrderPriorityList: any = [];
  salesOrderViewList = [{ label: "Exchange PN View", value: 1 },
  { label: "Exchange SO View", value: 2 }];
  salesOrderTypes;
  moduleName: string = "Exchange SO Settings";
  allSettings: any = [];
  isSpinnerVisible = false;
  disableSave = true;
  errorMessages: any[] = [];
  constructor(private router: Router,
    private exchangeSalesOrderService: ExchangeSalesOrderService,
    private alertService: AlertService,
    private authService: AuthService,
    private commonservice: CommonService,
    private modalService: NgbModal) { }

  ngOnInit() {
    if (this.exchangeSalesOrderService.isEditSOSettingsList) {
      this.isEditMode = true;
      this.receivingForm = this.exchangeSalesOrderService.soSettingsData;
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

  getInitialData() {
    let typeId = this.receivingForm.typeId ? this.receivingForm.typeId : 0;
    let defaultStatusId = this.receivingForm.defaultStatusId ? this.receivingForm.defaultStatusId : 0;
    let defaultPriorityId = this.receivingForm.defaultPriorityId ? this.receivingForm.defaultPriorityId : 0;
    let defaultStatus = this.receivingForm.soListStatusId ? this.receivingForm.soListStatusId : 0;
    this.isSpinnerVisible = true;
    forkJoin(this.commonservice.autoSuggestionSmartDropDownList('ExchangeType', 'Id', 'Name', '', true, 0, [typeId].join(), this.masterCompanyId),
      this.commonservice.autoSuggestionSmartDropDownList('ExchangeStatus', 'ExchangeStatusId', 'Name', '', true, 100, [defaultStatusId, defaultStatus].join(), this.masterCompanyId),
      this.commonservice.autoSuggestionSmartDropDownList('Priority', 'PriorityId', 'Description', '', true, 100, [defaultPriorityId].join(), this.masterCompanyId)).subscribe(result => {
        this.isSpinnerVisible = false;
        this.salesOrderTypes = result[0];
        this.salesOrderStatusList = result[1];
        this.salesOrderPriorityList = result[2];
      }, error => {
        this.isSpinnerVisible = false;
      })
  }

  saveOrUpdateSOSetting() {
    this.isSpinnerVisible = true;
    let validSettings = this.validateSettings();
    if (validSettings) {
      this.isSpinnerVisible = false;
      let content = this.errorMessagePop;
      this.errorModal = this.modalService.open(content, { size: "sm", backdrop: 'static', keyboard: false });
    } else {
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
      this.exchangeSalesOrderService.saveOrUpdateExchangeSOSettings(this.receivingForm)
        .subscribe(
          (res) => {
            this.isSpinnerVisible = false;
            this.alertService.showMessage(
              this.moduleName,
              `Setting ${(this.isEditMode) ? 'updated' : 'created'} successfully`,
              MessageSeverity.success
            );
            this.router.navigateByUrl('/exchangesalesordersettingsmodule/exchangesalesordersettings/app-exchange-sales-order-settings-list');
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
    // if (this.receivingForm.soListViewId <= 0) {
    //   this.errorMessages.push("Please select SO List View");
    //   haveError = true;
    // }
    if (this.receivingForm.soListStatusId <= 0) {
      this.errorMessages.push("Please select SO List Status ");
      haveError = true;
    }
    if (this.receivingForm.typeId <= 0) {
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
    if (this.receivingForm.defaultPriorityId <= 0) {
      this.errorMessages.push("Please select Priority");
      haveError = true;
    }
    if (this.receivingForm.defaultStatusId <= 0) {
      this.errorMessages.push("Please select SO Status");
      haveError = true;
    }
    // if (this.receivingForm.isApprovalRule) {
    //   if (this.receivingForm.effectiveDate == null) {
    //     this.errorMessages.push("Effective Date Required!");
    //     haveError = true;
    //   }
    // }
    return haveError;
  }
}