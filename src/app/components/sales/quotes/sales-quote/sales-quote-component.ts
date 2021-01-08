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

@Component({
  selector: "app-sales-quote-create",
  templateUrl: "./sales-quote.component.html",
  styleUrls: ["./sales-quote.component.css"]
})
export class SalesQuoteComponent implements OnInit {
  query: CustomerSearchQuery;
  customers: Customer[];
  totalRecords: number = 0;
  totalPages: number = 0;
  @ViewChild("warningPopup",{static:false}) public warningPopup: ElementRef;
  @ViewChild("restrictionPopup",{static:false}) public restrictionPopup: ElementRef;
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
    private commonservice: CommonService
  ) { }

  ngOnInit() {
    this.query = new CustomerSearchQuery();
    //this.getList();
    this.breadcrumbs = [
      { label: 'Sales Order Quote' },
      { label: 'Create Quote' },
    ];
  }

  getList(data) {
    this.isSpinnerVisible = true;
    console.log(data.sortField);
    const PagingData = { ...data, filters: listSearchFilterObjectCreation(data.filters) }
    this.customerService.getCustomerAll(PagingData).subscribe(res => {
      this.isSpinnerVisible = false;
      console.log(res, "ress_+++++")
      this.data = res['results'];
      if (this.data.length > 0) {
        this.totalRecords = res.totalRecordsCount;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
      }

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

    console.log(event);
  }



  filterData(data) {
    console.log(data);
  }
  getPageCount(totalNoofRecords, pageSize) {
    return Math.ceil(totalNoofRecords / pageSize)
  }

  viewSelectedRow(rowData) {

    console.log(rowData);
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

  createQuote(customer: any) {


    this.getTypesOfWarnings(customer.customerId);
  }
  getTypesOfWarnings(customerId) {
    this.isSpinnerVisible = true;
    this.commonservice.smartDropDownList('CustomerWarningType', 'CustomerWarningTypeId', 'Name').subscribe(data => {
      console.log(data, "data+++");
      this.isSpinnerVisible = false;
      if (data.length > 0) {
        data.filter(i => {
          if (i.label == DBkeys.GLOBAL_CUSTOMER_WARNING_TYOE_FOR_SALES_QUOTE) {
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
        this.customerWarning = res;
        this.isSpinnerVisible = false;
        this.customerWarning['customerId'] = customerId;
        if (res.customerWarningId == 0) {
          this.getCustomerWarningsData(customerWarningListId, customerId)
        } else {
          this.modal = this.modalService.open(this.restrictionPopup, { size: 'lg', backdrop: 'static', keyboard: false });
          this.modal.result.then(() => {
            console.log('When user closes');
          }, () => { console.log('Backdrop click') })
        }
        console.log(res, "resfrom customer warnigns api");

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
        this.customerWarning = res;
        this.isSpinnerVisible = false;
        this.customerWarning['customerId'] = customerId;
        console.log(res, "resfrom customer warnigns api");
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
  moveToCreate(customerId) {
    this.closeModal();
    this.router.navigateByUrl(
      `salesmodule/salespages/sales-quote-create/${customerId}`
    );
  }
  private searchCustomer() {
    // this.alertService.startLoadingMessage();
    this.isSpinnerVisible = true;
    this.customerService
      .getServerPages(this.query)
      .subscribe((response: any) => {
        this.isSpinnerVisible = false;
        this.customers = response[0].customerList;
        this.totalRecords = response[0].totalRecordsCount;
        this.totalPages = Math.ceil(this.totalRecords / this.query.rows);
        this.showPaginator = this.totalRecords > 0;
        // this.alertService.stopLoadingMessage();

      }, error => {
        this.onDataLoadFailed(error);
      });
  }
  closeModal() {
    if (this.modal) {
      this.modal.close();
    }
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

  mouseOverData(key, data) {
    if (key === 'customerClassificationType') {
      return data['customerClassification']
    }
  }

  getColorCodeForMultiple(data) {
    return data['customerClassificationType'] === 'Multiple' ? 'green' : 'black';
  }
}
