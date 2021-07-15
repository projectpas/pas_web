import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Subject } from "rxjs";
import { ExchangequoteService } from '../../services/exchangequote.service';
import { takeUntil } from 'rxjs/operators';
import { AlertService, MessageSeverity } from "../../services/alert.service";
import { AuthService } from "../../services/auth.service";
//import { ExchangeSalesOrderService } from "../../services/exchangesalesorder.service";
import { ExchangeQuoteSettingsModel } from "../../components/exchange-quote/models/verify-exchange-quote-model";
import { DatePipe } from "@angular/common";
import * as $ from "jquery";
@Component({
  selector: 'app-exchange-quote-settings-list',
  templateUrl: './exchange-quote-settings-list.component.html',
  styleUrls: ['./exchange-quote-settings-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ExchangeQuoteSettingsListComponent {
  title: string = "Exchange SO settings";
  soqSettingsList: any = [];
  auditHistory: any = [];
  modal: NgbModalRef;
  isSpinnerVisible = false;
  targetData: any;
  private onDestroy$: Subject<void> = new Subject<void>();
  selectedGridColumn: any[];
  disableCreateNewSettings = false;
  selectedGridColumns: any[] = [
    { field: 'typeName', header: 'Exch Quote Type' },
    { field: 'prefix', header: 'Prefix' },
    { field: 'sufix', header: 'Suffix' },
    { field: 'startCode', header: 'Start Code' },
    { field: 'defaultStatusName', header: 'Exch Quote Status' },
    { field: 'defaultPriorityName', header: 'Priority' },
    { field: 'cogs', header: 'COGS' },
    { field: 'daysForCoreReturn', header: 'Days For Core Return' }
  ];
  gridColumns = [
    { field: 'typeName', header: 'Exch Quote Type' },
    { field: 'prefix', header: 'Prefix' },
    { field: 'sufix', header: 'Suffix' },
    { field: 'startCode', header: 'Start Code' },
    { field: 'defaultStatusName', header: 'Exch Quote Status' },
    { field: 'defaultPriorityName', header: 'Priority' },
    { field: 'cogs', header: 'COGS' },
    { field: 'daysForCoreReturn', header: 'Days For Core Return' }
  ];
  pageSize: number = 10;
  pageIndex: number = 0;
  first = 0;
  data: any;
  filteredText: string;
  totalRecords: number = 0;
  totalPages: number = 0;
  selected;
  selectedOnly: boolean = false;
  noDatavailable: any;
  constructor(public customerService: CustomerService,
    public exchangequoteService: ExchangequoteService,
    //public exchangeSalesOrderService: ExchangeSalesOrderService,
    public alertService: AlertService,
    private modalService: NgbModal,
    public authService: AuthService,
    private route: Router,
    private datePipe: DatePipe) { }

  ngOnInit() {
    this.selectedGridColumns = this.gridColumns;
    this.getAllSOSettings();
  }
  closeModal() {
    $("#downloadConfirmation").modal("hide");
  }

  ngOnChange() {
  }

  columnsChanges() {
  }

  globalSearch(value) {
    this.pageIndex = 0;
    this.filteredText = value;
    this.customerService.getGlobalSearch(value, this.pageIndex, this.pageSize).subscribe(res => {
      this.data = res;
      if (res.length > 0) {
        this.totalRecords = res[0].totalRecords;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
      }
    })
  }

  getAuditHistoryById(rowData) {
    this.isSpinnerVisible = true;
    this.exchangequoteService.getSOSettingHistory(rowData.salesOrderSettingId)
      .subscribe(
        (res: any[]) => {
          this.isSpinnerVisible = false;
          this.auditHistory = res;
        }, error => {
          this.isSpinnerVisible = false;
        }
      )
  }

  get userName(): string {
    return this.authService.currentUser
      ? this.authService.currentUser.userName
      : "";
  }

  edit(rowData) {
    this.exchangequoteService.isEditSOSettingsList = true;
    let editeddRow = this.soqSettingsList.find(setting => setting.accountTypeId == rowData.accountTypeId);
    this.exchangequoteService.soSettingsData = editeddRow;
    this.route.navigateByUrl(`exchangesalesordersettingsmodule/exchangesalesordersettings/app-create-exchange-quote-settings`);
  }

  deleteSettings() {
    this.isSpinnerVisible = true;
    this.exchangequoteService.deleteSoSetting(this.selected, this.userName).subscribe(response => {
      this.isSpinnerVisible = false;
      this.getAllSOSettings();
      this.dismissModel();
      this.exchangequoteService.soSettingsData = new ExchangeQuoteSettingsModel();
      this.alertService.showMessage(
        'Exchange Quote Settings',
        `Succesfully deleted setting`,
        MessageSeverity.success
      );
    }, error => {
      this.dismissModel();
      this.isSpinnerVisible = false;
      this.alertService.showMessage(
        'Exchange Quote Settings',
        error,
        MessageSeverity.error
      );
    })
  }

  getColorCodeForHistory(i, field, value) {
    const data = this.auditHistory;
    const dataLength = data.length;
    if (i >= 0 && i <= dataLength) {
      if ((i + 1) === dataLength) {
        return true;
      } else {
        return data[i + 1][field] === value
      }
    }
  }

  get currentUserMasterCompanyId(): number {
    return this.authService.currentUser
      ? this.authService.currentUser.masterCompanyId
      : null;
  }

  getAllSOSettings(): void {
    this.isSpinnerVisible = true;
    this.exchangequoteService.getAllExchangeQuoteSettings(this.currentUserMasterCompanyId).pipe(takeUntil(this.onDestroy$)).subscribe(
      result => {
        this.isSpinnerVisible = false;
        let response: any = result;
        this.soqSettingsList = response;
        if (response && response.length > 0) {
          this.totalRecords = response.length;
          this.disableCreateNewSettings = true;
        } else {
          this.totalRecords = 0;
          this.disableCreateNewSettings = false;
        }

        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
      }, error => {
        this.isSpinnerVisible = false;
      }
    );
  }

  dismissModel() {
    if (this.modal != undefined)
      this.modal.close();
  }

  AddPage() {
    this.route.navigateByUrl('/exchangesalesordersettingsmodule/exchangesalesordersettings/app-create-exchange-quote-settings');
  }

  openEdit(row) {
    this.route.navigateByUrl('/exchangesalesordersettingsmodule/exchangesalesordersettings/app-create-exchange-quote-settings');
  }

  openDelete(content, rowData) {
    this.selected = rowData.salesOrderSettingId;
    this.modal = this.modalService.open(content, { size: "sm", backdrop: 'static', keyboard: false });
  }

  exportCSV(dt) {
    this.isSpinnerVisible = true;
    this.exchangequoteService
      .getAllExchangeQuoteSettings(this.currentUserMasterCompanyId).subscribe(res => {
        let response: any = res;
        const vList = response.map(x => {
          return {
            ...x,
            createdDate: x.createdDate ? this.datePipe.transform(x.createdDate, 'MMM-dd-yyyy hh:mm a') : '',
          }
        });

        dt._value = vList;
        dt.exportCSV();
        dt.value = this.soqSettingsList;
        this.isSpinnerVisible = false;
      }, err => {
        this.isSpinnerVisible = false;
      });
  }
}
