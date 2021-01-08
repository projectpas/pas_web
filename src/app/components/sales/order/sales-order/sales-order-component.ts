import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { CustomerSearchQuery } from "../models/customer-search-query";
import { CustomerService } from "../../../../services/customer.service";
import { Customer } from "../../../../models/customer.model";
import { AlertService, MessageSeverity } from "../../../../services/alert.service";
import { Router } from "@angular/router";
import { listSearchFilterObjectCreation } from '../../../../generic/autocomplete';
import { TableModule, Table } from 'primeng/table';
import { NgbModal, NgbActiveModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CustomerViewComponent } from '../../../../shared/components/customer/customer-view/customer-view.component';
import { CommonService } from "../../../../services/common.service";
import { DBkeys } from "../../../../services/db-Keys";
import { MenuItem } from "primeng/api";
import * as moment from 'moment';


@Component({
  selector: "app-sales-order-create",
  templateUrl: "./sales-order.component.html",
  styleUrls: ["./sales-order.component.css"]
})
export class SalesOrderComponent implements OnInit {
  query: CustomerSearchQuery;
  customers: Customer[];
  totalRecords: number = 0;
  totalPages: number = 0;
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
  isSpinnerVisible = false;

  headers = [
    { field: 'name', header: 'Name' },
    { field: 'customerCode', header: 'Code' },
    { field: 'accountType', header: 'Account Type' },
    { field: 'customerType', header: 'Type' },
    { field: 'customerClassificationType', header: 'Classification' },
    { field: 'email', header: 'Email' },
    { field: 'city', header: 'City' },
    { field: 'stateOrProvince', header: 'State' },
    { field: 'contact', header: 'Contact' },
    { field: 'salesPersonPrimary', header: 'Sales Person' }
  ]
  selectedColumns = this.headers;
  customerWarning: any = {};
  @ViewChild("warningPopup",{static:false}) public warningPopup: ElementRef;
  @ViewChild("restrictionPopup",{static:false}) public restrictionPopup: ElementRef;


  constructor(
    private customerService: CustomerService,
    private alertService: AlertService,
    private modalService: NgbModal,
    private router: Router,
    private commonservice: CommonService
  ) { }

  ngOnInit() {
    this.query = new CustomerSearchQuery();
    this.breadcrumbs = [
      { label: 'Sales Order' },
      { label: 'Create Sales Order' },
    ];
  }

  getList(data) {

    this.isSpinnerVisible = true;
    const PagingData = { ...data, filters: listSearchFilterObjectCreation(data.filters) }
    this.customerService.getCustomerAll(PagingData).subscribe(res => {
      this.isSpinnerVisible = false;
      this.data = res.results;
      this.totalRecords = res.totalRecordsCount;
      this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    }, error => {
      this.onDataLoadFailed(error);
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
  globalSearch(value) {
    this.isSpinnerVisible = true;
    this.pageIndex = 0;
    this.filteredText = value;
    this.customerService.getGlobalSearch(value, this.pageIndex, this.pageSize).subscribe(res => {
      this.isSpinnerVisible = false;
      this.data = res.results;
      this.totalRecords = res.totalRecordsCount;
      this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    }, error => {
      this.onDataLoadFailed(error);
    })
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
    this.modal.result.then(() => {
      console.log('When user closes');
    }, () => { console.log('Backdrop click') })

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

  createOrder(customer: any) {
    // this.router.navigateByUrl(
    //   `salesmodule/salespages/sales-order-create/${customer.customerId}`
    // );
    this.getTypesOfWarnings(customer.customerId)
  }

  getTypesOfWarnings(customerId) {
    this.isSpinnerVisible = true;
    this.commonservice.smartDropDownList('CustomerWarningType', 'CustomerWarningTypeId', 'Name').subscribe(data => {
      if (data.length > 0) {
        this.isSpinnerVisible = false;
        data.filter(i => {
          if (i.label == DBkeys.GLOBAL_CUSTOMER_WARNING_TYOE_FOR_SALES_ORDER) {
            this.getCustomerRestrictionsData(i.value, customerId);
          }
        })
      }
    }, error => {
      this.onDataLoadFailed(error);
    })
  }

  async getCustomerRestrictionsData(customerWarningListId: number, customerId) {
    this.isSpinnerVisible = true;
    await this.customerService
      .getCustomerRestrictionsByCustomerIdandCustomerWarningsListID(customerId, customerWarningListId)
      .subscribe(res => {
        this.isSpinnerVisible = false;
        this.customerWarning = res;
        this.customerWarning['customerId'] = customerId;
        if (res.customerWarningId == 0) {
          this.getCustomerWarningsData(customerWarningListId, customerId)
        } else {
          this.modal = this.modalService.open(this.restrictionPopup, { size: 'lg', backdrop: 'static', keyboard: false });
          this.modal.result.then(() => {
            console.log('When user closes');
          }, () => { console.log('Backdrop click') })
        }

        // let warningRes = res[0].warningsData || [];
        // for (let i = 0; i < warningRes.length; i++) {
        //   if (warningRes[i].customerWarningId == this.globalCustomerWarningId) {
        //     this.customerWarningData.push(warningRes[i]);
        //   }
        // }

      }, error => {
        this.onDataLoadFailed(error);
      });
  }
  async getCustomerWarningsData(customerWarningListId: number, customerId) {
    this.isSpinnerVisible = true;
    await this.customerService
      .getCustomerWarningsByCustomerIdandCustomerWarningsListID(customerId, customerWarningListId)
      .subscribe(res => {
        this.isSpinnerVisible = false;
        this.customerWarning = res;
        this.customerWarning['customerId'] = customerId;
        if (res.customerWarningId == 0) {
          this.moveToCreate(customerId)
        } else {
          this.modal = this.modalService.open(this.warningPopup, { size: 'lg', backdrop: 'static', keyboard: false });
          this.modal.result.then(() => {
            console.log('When user closes');

          }, () => { console.log('Backdrop click') })
        }

        // let warningRes = res[0].warningsData || [];
        // for (let i = 0; i < warningRes.length; i++) {
        //   if (warningRes[i].customerWarningId == this.globalCustomerWarningId) {
        //     this.customerWarningData.push(warningRes[i]);
        //   }
        // }

      }, error => {
        this.onDataLoadFailed(error);
      });
  }
  onDataLoadFailed(error) {
    this.isSpinnerVisible = false;
    let errorMessage = '';
    if (error.message) {
      errorMessage = error.message;
    }
    this.alertService.resetStickyMessage();
    this.alertService.showStickyMessage("Sales Order Quote", errorMessage, MessageSeverity.error, error);
    // this.alertService.showMessage(error);
  }
  moveToCreate(customerId) {
    this.closeModal()
    this.router.navigateByUrl(
      `salesmodule/salespages/sales-order-create/${customerId}`
    );
  }
  closeModal() {
    if (this.modal) {
      this.modal.close();
    }

  }

  private searchCustomer() {
    this.alertService.startLoadingMessage();
    this.customerService
      .getServerPages(this.query)
      .subscribe((response: any) => {
        this.customers = response[0].customerList;
        this.totalRecords = response[0].totalRecordsCount;
        this.totalPages = Math.ceil(this.totalRecords / this.query.rows);
        this.showPaginator = this.totalRecords > 0;
        this.alertService.stopLoadingMessage();
      });
  }


  mouseOverData(key, data) {
    if (key === 'customerClassificationType') {
      return data['customerClassification']
    }
  }
  getColorCodeForMultiple(data) {
    return data['customerClassificationType'] === 'Multiple' ? 'green' : 'black';
  }
}
