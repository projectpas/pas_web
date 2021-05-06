import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { CustomerService } from "../../../../services/customer.service";
import { CustomerSearchQuery } from "../../quotes/models/customer-search-query";
import { Customer } from "../../../../models/customer.model";
import { AlertService, MessageSeverity } from "../../../../services/alert.service";
import { Router } from "@angular/router";
import { listSearchFilterObjectCreation } from '../../../../generic/autocomplete';
import { Table } from 'primeng/table';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CustomerViewComponent } from '../../../../shared/components/customer/customer-view/customer-view.component';
import { CommonService } from "../../../../services/common.service";
import { DBkeys } from "../../../../services/db-Keys";
import { MenuItem } from "primeng/api";
declare var $: any;
import { DatePipe } from '@angular/common';
import { AuthService } from "../../../../services/auth.service";

@Component({
  selector: "app-speed-quote",
  templateUrl: "./speed-quote.component.html",
  styleUrls: ["./speed-quote.component.css"],
  providers: [DatePipe]
})
export class SpeedQuoteComponent implements OnInit {
  query: CustomerSearchQuery;
  customers: Customer[];
  totalRecords: number = 0;
  totalPages: number = 0;
  @ViewChild("warningPopup", { static: false }) public warningPopup: ElementRef;
  @ViewChild("restrictionPopup", { static: false }) public restrictionPopup: ElementRef;
  isSpinnerVisible = false;
  showPaginator: boolean = false;
  pageLinks: any;
  modal: NgbModalRef;
  data: any;
  pageSize: number = 10;
  pageIndex: number = 0;
  first = 0;
  lazyLoadEventData: any;
  filteredText: string;
  private table: Table;
  breadcrumbs: MenuItem[];
  home: any;
  targetData: any;
  selectedOnly: boolean = false;

  headers = [
    { field: 'name', header: 'Name' },
    { field: 'customerCode', header: 'Code' },
    { field: 'accountType', header: 'Account Type' },
    { field: 'customerType', header: 'Type' },
    { field: 'customerClassification', header: 'Classification' },
    { field: 'email', header: 'Email' },
    { field: 'city', header: 'City' },
    { field: 'stateOrProvince', header: 'State' },
    { field: 'contact', header: 'Contact' },
    { field: 'salesPersonPrimary', header: 'Sales Person' }
  ]
  selectedColumns = this.headers;
  customerWarning: any = {};

  constructor(
    private customerService: CustomerService,
    private alertService: AlertService,
    private modalService: NgbModal,
    private router: Router,
    private commonservice: CommonService,
    private datePipe: DatePipe,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.query = new CustomerSearchQuery();
    this.breadcrumbs = [
      { label: 'Speed Quote' },
      { label: 'Create Speed Quote' },
    ];
  }

  get currentUserMasterCompanyId(): number {
    return this.authService.currentUser
      ? this.authService.currentUser.masterCompanyId
      : null;
  }

  getList(data) {
    this.isSpinnerVisible = true;
    const PagingData = { ...data, filters: listSearchFilterObjectCreation(data.filters) };
    PagingData.filters.masterCompanyId = this.currentUserMasterCompanyId;
    PagingData.filters.status = "Active";
    PagingData.filters.isDeleted = false;
    this.customerService.getCustomerAll(PagingData).subscribe(res => {
      this.isSpinnerVisible = false;
      this.data = res['results'];
      if (this.data.length > 0) {
        this.totalRecords = res.totalRecordsCount;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
      }

    }, error => {
      this.isSpinnerVisible = false;
    })
  }

  columnsChanges() {
    this.refreshList();
  }

  refreshList() {
    if (this.filteredText != "" && this.filteredText != null && this.filteredText != undefined) {
      this.globalSearch(this.filteredText);
    }
    else {
      this.table.reset();
    }
  }

  globalSearch1(value) {
    this.pageIndex = 0;
    this.filteredText = value;
    this.isSpinnerVisible = true;
    this.customerService.getGlobalSearch(value, this.pageIndex, this.pageSize).subscribe(res => {
      this.data = res;
      this.isSpinnerVisible = false;
      if (res.length > 0) {
        this.totalRecords = res.totalRecordsCount;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
      }
    }, error => {
      this.isSpinnerVisible = false;
    })
  }

  globalSearch(value) {
    this.pageIndex = this.lazyLoadEventData.rows > 10 ? parseInt(this.lazyLoadEventData.first) / this.lazyLoadEventData.rows : 0;
    this.pageSize = this.lazyLoadEventData.rows;
    this.lazyLoadEventData.first = this.pageIndex;
    this.lazyLoadEventData.globalFilter = value;
    this.filteredText = value;
    this.lazyLoadEventData.filters = { ...this.lazyLoadEventData.filters };
    this.getList(this.lazyLoadEventData);
  }

  loadData(event) {
    this.lazyLoadEventData = event;
    const pageIndex = parseInt(event.first) / event.rows;;
    this.pageIndex = pageIndex;
    this.pageSize = event.rows;
    event.first = pageIndex;
    this.getList(event)
  }

  filterData(data) {
  }

  getPageCount(totalNoofRecords, pageSize) {
    return Math.ceil(totalNoofRecords / pageSize)
  }

  viewSelectedRow(rowData) {
    this.modal = this.modalService.open(CustomerViewComponent, { size: 'lg', backdrop: 'static', keyboard: false });
    this.modal.componentInstance.customerId = rowData.customerId;
  }

  onSearch(event) {
    this.query.reset();
    this.searchCustomer();
  }

  onPaging(event) {
    if (this.totalRecords > 0) {
      this.query.first = event.first;
      this.query.rows = event.rows;
      this.searchCustomer();
    }
  }

  createQuote(customer: any) {
    this.getTypesOfWarnings(customer.customerId);
  }

  getTypesOfWarnings(customerId) {
    this.isSpinnerVisible = true;
    this.commonservice.smartDropDownList('CustomerWarningType', 'CustomerWarningTypeId', 'Name').subscribe(data => {
      this.isSpinnerVisible = false;
      if (data.length > 0) {
        data.filter(i => {
          if (i.label == DBkeys.GLOBAL_CUSTOMER_WARNING_TYOE_FOR_SALES_QUOTE) {
            this.getCustomerRestrictionsData(i.value, customerId);
          }
        })
      }
    }, error => {
      this.isSpinnerVisible = false;
    })
  }

  async getCustomerRestrictionsData(customerWarningListId: number, customerId) {
    this.isSpinnerVisible = true;
    await this.customerService
      .getCustomerRestrictionsByCustomerIdandCustomerWarningsListID(customerId, customerWarningListId)
      .subscribe(res => {
        this.customerWarning = res;
        this.isSpinnerVisible = false;
        this.customerWarning['customerId'] = customerId;
        if (res.customerWarningId == 0) {
          this.getCustomerWarningsData(customerWarningListId, customerId)
        } else {
          this.modal = this.modalService.open(this.restrictionPopup, { size: 'lg', backdrop: 'static', keyboard: false });
        }

      }, error => {
        this.isSpinnerVisible = false;
      });
  }

  async getCustomerWarningsData(customerWarningListId: number, customerId) {
    this.isSpinnerVisible = true;
    await this.customerService
      .getCustomerWarningsByCustomerIdandCustomerWarningsListID(customerId, customerWarningListId)
      .subscribe(res => {
        this.customerWarning = res;
        this.isSpinnerVisible = false;
        this.customerWarning['customerId'] = customerId;
        if (res.customerWarningId == 0) {
          this.moveToCreate(customerId)
        } else {
          this.modal = this.modalService.open(this.warningPopup, { size: 'lg', backdrop: 'static', keyboard: false });
        }
      }, error => {
        this.isSpinnerVisible = false;
      });
  }

  moveToCreate(customerId) {
    this.closeModal();
    this.router.navigateByUrl(
      `salesmodule/salespages/speed-quote-create/${customerId}`
    );
  }

  private searchCustomer() {
    this.isSpinnerVisible = true;
    this.customerService
      .getServerPages(this.query)
      .subscribe((response: any) => {
        this.isSpinnerVisible = false;
        this.customers = response[0].customerList;
        this.totalRecords = response[0].totalRecordsCount;
        this.totalPages = Math.ceil(this.totalRecords / this.query.rows);
        this.showPaginator = this.totalRecords > 0;
      }, error => {
        this.isSpinnerVisible = false;
      });
  }

  closeModal() {
    if (this.modal) {
      this.modal.close();
    }
  }

  mouseOverData(key, data) {
    if (key === 'customerClassificationType') {
      return data['customerClassification']
    }
  }

  getColorCodeForMultiple(data) {
    return data['customerClassificationType'] === 'Multiple' ? 'green' : 'black';
  }

  closePopupModal() {
    $("#downloadConfirmation").modal("hide");
  }

  closeDeleteModal() {
    $("#downloadConfirmation").modal("hide");
  }

  exportCSV(dt) {
    this.isSpinnerVisible = true;
    let PagingData = { "first": 0, "rows": dt.totalRecords, "sortOrder": 1, "filters": { "status": true, "isDeleted": false }, "globalFilter": "" };
    let filters = Object.keys(dt.filters);
    filters.forEach(x => {
      PagingData.filters[x] = dt.filters[x].value;
    })

    this.customerService.getCustomerAll(PagingData).subscribe(res => {
      dt._value = res['results'].map(x => {
        return {
          ...x,
          createdDate: x.createdDate ? this.datePipe.transform(x.createdDate, 'MMM-dd-yyyy hh:mm a') : '',
          updatedDate: x.updatedDate ? this.datePipe.transform(x.updatedDate, 'MMM-dd-yyyy hh:mm a') : '',
        }
      });
      dt.exportCSV();
      dt.value = this.data;
      this.isSpinnerVisible = false;
    },
      error => {
        this.isSpinnerVisible = false;
      });
  }
}