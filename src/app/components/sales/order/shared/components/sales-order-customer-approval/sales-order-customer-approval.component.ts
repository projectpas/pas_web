import { Component, Input, ViewChild, ElementRef, Output, EventEmitter, OnInit, OnChanges } from "@angular/core";
import { ISalesOrderQuote } from "../../../../../../models/sales/ISalesOrderQuote";
import { SalesQuoteService } from "../../../../../../services/salesquote.service";
import { EmployeeService } from '../../../../../../services/employee.service';
import { AuthService } from '../../../../../../services/auth.service';
import { ISalesQuote } from "../../../../../../models/sales/ISalesQuote.model";
import { ActivatedRoute } from "@angular/router";
import { DBkeys } from "../../../../../../services/db-Keys";
import { MessageSeverity, AlertService } from "../../../../../../services/alert.service";
import { SalesQuote } from "../../../../../../models/sales/SalesQuote.model";
import { SalesOrderQuote } from "../../../../../../models/sales/SalesOrderQuote";
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CustomerService } from "../../../../../../services/customer.service";
import { StocklineViewComponent } from "../../../../../../shared/components/stockline/stockline-view/stockline-view.component";
import { IStatus } from "../../../../../../models/sales/IStatus";
import { ISalesOrder } from "../../../../../../models/sales/ISalesOrder.model";
import { SalesOrderService } from "../../../../../../services/salesorder.service";
import { ISalesOrderCustomerApproval } from "../../../models/isales-order-customer-approval";
import { ICustomerContact } from "../../../../models/icustomer-contact";
import { ISalesOrderCustomerApprovalView } from "../../../models/isales-order-customer-approval-view";
import { SalesOrderCustomerApprovalView } from "../../../models/sales-order-customer-approval-view";
import { SalesOrderCustomerApproval } from '../../../models/sales-order-customer-approval';
import { WorkOrderQuoteService } from "../../../../../../services/work-order/work-order-quote.service";

import * as $ from 'jquery'
import { CommonService } from "../../../../../../services/common.service";
import { MarginSummary } from "../../../../../../models/sales/MarginSummaryForSalesorder";
import { forkJoin } from "rxjs";
@Component({
  selector: "app-sales-order-customer-approval",
  templateUrl: "./sales-order-customer-approval.component.html",
  styleUrls: ["./sales-order-customer-approval.component.scss"]
})
export class SalesOrderCustomerApprovalComponent implements OnInit, OnChanges {
  @Input("sales-order") salesOrder: ISalesOrder;
  @Input("customer-id") customerId: number;
  @Input("sales-order-id") salesOrderId: number;
  @Input() status: IStatus[] = [];
  @Input("customer-contacts") customerContacts: ICustomerContact[] = [];
  @Output("on-part-approved-event") onPartApprovedEvent = new EventEmitter();
  @Input("is-view-mode") isViewMode: boolean = false;
  @Input() customerContactList: any = [];

  defaultApprovalStatusId: number = DBkeys.DEFAULT_SALES_ORDER_APPROVAL_STATUS_ID;
  approveAll: boolean = false;
  salesOrderCustomerApprovalList: ISalesOrderCustomerApproval[];
  salesOrderCustomerApprovalListView: any[] = [];
  pageSize: number = 10;
  QuoteApprovalList: any = [];
  modal: NgbModalRef;
  partModal: NgbModalRef;
  @Input() approvers;
  moduleName: string;
  Total: any[];
  @ViewChild("customerApprovalConfirmationModal",{static:false})
  public customerApprovalConfirmationModal: ElementRef;
  loading: boolean = true;
  isView: any;
  selectall: any;
  salesQuoteId: number;
  statusList: any[] = [];
  defaultContactId: any;


  columns: any = [
    { field: 'actionStatus', header: 'Action', width: "100px" },
    { field: 'internalSentDate', header: 'Internal Sent Date', width: "100px" },
    { field: 'internalStatusId', header: 'Internal Status', width: "100px" },
    { field: 'internalMemo', header: 'Internal Memo  ', width: "100px" },
    { field: 'internalApprovedDate', header: 'Internal Approved Date ', width: "100px" },
    { field: 'internalApprovedBy', header: 'Internal Approved By', width: "100px" },
    { field: 'customerSentDate', header: 'Customer Sent Date', width: "100px" },
    { field: 'customerStatusId', header: 'Customer Status', width: "100px" },
    { field: 'customerMemo', header: 'Customer Memo', width: "100px" },
    { field: 'customerApprovedDate', header: 'Customer Approved Date', width: "100px" },
    { field: 'customerApprovedBy', header: 'Customer Approved By', width: "100px" },
    { field: 'partNumber', header: 'PN', width: "100px" },
    { field: 'partDescription', header: 'PN Desc', width: "110px" },
    { field: 'qty', header: 'Qty', width: "90px" },
    // { field: 'markUpPercentage', header: 'Mark Up %', width: "80px" },
    { field: 'markupExtended', header: 'Mark Up Amt.', width: "90px" },
    // { field: 'discount', header: 'Disc %', width: "60px" },
    { field: 'discountAmount', header: 'Disc Amt.', width: "90px" },
    { field: 'netSales', header: 'Net Sales', width: "90px" },
    // { field: 'unitCost', header: 'Unit Cost', width: "90px" },
    { field: 'unitCostExtended', header: 'Ext Cost', width: "90px" },
    { field: 'marginAmountExtended', header: 'Margin Amt.', width: "90px" },
    { field: 'marginPercentage', header: 'Margin %', width: "60px" },
  ];


  selectedColumns: any = this.columns;
  isSpinnerVisible = false;
  statusListForApproval = [];

  constructor(private alertService: AlertService
    , private modalService: NgbModal
    , public employeeService: EmployeeService
    , private salesOrderService: SalesOrderService
    , private authService: AuthService
    , private route: ActivatedRoute
    , private customerService: CustomerService,
    private workOrderService: WorkOrderQuoteService,
    private commonService: CommonService
  ) {


  }

  ngOnInit(): void {
    console.log("customer-id", this.customerId);
    console.log("sales-order-id", this.salesOrderId);
    // this.getApproverStatusList();
    // this.getCustomerApprovalList();
    this.selectedColumns = this.columns;
    this.moduleName = "Sales Order";
    this.customerId = +this.route.snapshot.paramMap.get("customerId");
    this.salesQuoteId = +this.route.snapshot.paramMap.get("id");
    this.setAllCustomerContact(this.customerContactList);
    this.setDefaultContact();
  }

  setDefaultContact() {
    if (this.customerContactList) {
      if (this.customerContactList.length > 0) {
        for (let i = 0; i < this.customerContactList.length; i++) {
          let isDefaultContact = this.customerContactList[i].isDefaultContact;
          if (isDefaultContact) {
            this.defaultContactId = this.customerContactList[i].contactId;
          }
        }
      }
    }
  }


  refresh(marginSummary: MarginSummary, salesOrderId, salesQuoteId, isViewMode = false, customerContactList = []) {
    this.isSpinnerVisible = true;
    this.salesOrderId = salesOrderId;
    this.salesQuoteId = salesQuoteId;
    this.isView = isViewMode;
    if (customerContactList && customerContactList.length > 0) {
      this.customerContactList = customerContactList;
      this.setAllCustomerContact(this.customerContactList);
      this.setDefaultContact();
    }
    forkJoin(this.commonService.smartDropDownList('ApprovalStatus', 'ApprovalStatusId', 'Name'),
      this.workOrderService.getInternalApproversList(5, marginSummary.netSales),
      this.salesOrderService.getCustomerApprovalList(this.salesOrderId)
    ).subscribe(response => {
      this.isSpinnerVisible = false;
      this.setAproverStatusList(response[0]);
      if (response[1] && response[1].length > 0) {
        this.approvers = response[1];
      } else {
        this.approvers = [];
      }
      if (response[2] && response[2].length > 0) {
        this.loadApprovalListView(response[2][0]);
      }
    }, error => this.dataLoadError(error))
    // this.workOrderService.getInternalApproversList(6, marginSummary.netSales)
    //   .subscribe(
    //     (res) => {
    //       if (res && res.length > 0) {
    //         this.approvers = res;
    //       } else {
    //         this.approvers = [];
    //       }
    //       this.isSpinnerVisible = false;
    //     }, error => this.dataLoadError(error)
    //   )
    // this.getCustomerApprovalList();
  }

  ngOnChanges(changes) {

  }

  setAproverStatusList(res) {
    if (res && res.length > 0) {
      this.statusList = res.map(x => {
        return {
          ...x,
          statusId: x.value,
          name: x.label
        };
      });
    }
    this.setStatusListForApproval(this.statusList);
  }
  getApproverStatusList() {
    this.commonService.smartDropDownList('ApprovalStatus', 'ApprovalStatusId', 'Name').subscribe(res => {
      this.statusList = res.map(x => {
        return {
          ...x,
          statusId: x.value,
          name: x.label
        };
      });
      this.setStatusListForApproval(this.statusList);
    })
  }

  setStatusListForApproval(statusList) {
    let tempList = [];
    if (statusList && statusList.length > 0) {
      for (let i = 0; i < statusList.length; i++) {
        if (statusList[i].name === "Approved") {
          tempList.push(statusList[i]);
        } else if (statusList[i].name === "Rejected") {
          tempList.push(statusList[i]);
        }
      }
    }
    this.statusListForApproval = tempList;
  }

  get userName(): string {
    return this.authService.currentUser
      ? this.authService.currentUser.userName
      : "";
  }

  get employeeId() {
    return this.authService.currentUser
      ? this.authService.currentUser.employeeId
      : "";
  }

  getPartToDisableOrNot(part) {
    if (part.actionStatus != 'Approved') {
      if (part.approvalActionId == 1 && part.createdBy != this.userName) {
        return true;
      } else if (part.approvalActionId == 2) {
        if (this.approvers && this.approvers.length > 0) {
          let approverFound = this.approvers.find(approver => approver.approverId == this.employeeId);
          if (approverFound) {
            return false;
          } else {
            return true;
          }
        } else {
          return true;
        }
      } else if (part.approvalActionId == 3 && part.createdBy != this.userName) {
        return true;
      } else if (part.approvalActionId == 4 && part.createdBy != this.userName) {
        return true;

      } else {
        return false;
      }
    } else {
      return true;
    }
  }

  getAllPartsToDisableOrNot() {
    let disableEdit = true;
    if (this.salesOrderCustomerApprovalListView && this.salesOrderCustomerApprovalListView.length > 0) {
      this.salesOrderCustomerApprovalListView.forEach(
        (x) => {
          if (x.actionStatus != "Approved")
            return false;
        }
      )
    }
    return disableEdit;
  }

  getCustomerApprovalList() {
    this.isSpinnerVisible = true;
    this.salesOrderService
      .getCustomerApprovalList(this.salesOrderId)
      .subscribe((data: ISalesOrderCustomerApproval[][]) => {
        this.isSpinnerVisible = false;
        if (data && data.length > 0) {
          this.loadApprovalListView(data[0]);
        }
      }, error => this.dataLoadError(error));
  }
  selectAllApproval(type, isSelected) {
    this.salesOrderCustomerApprovalListView.forEach(
      (x, i) => {
        let disableEdit = this.getPartToDisableOrNot(x);
        if (!disableEdit) {
          x.selected = !isSelected;
          this.onApprovalSelected(x, i);
        }
      }
    )
  }

  setAllCustomerContact(contacts) {
    if (contacts && contacts.length > 0) {
      this.customerContactList = contacts;
      for (let i = 0; i < this.customerContactList.length; i++) {
        this.customerContactList[i]['contactName'] = this.customerContactList[i].firstName + " " + this.customerContactList[i].lastName;
      }
    } else {
      this.customerContactList = [];
    }
  }

  onApprovalSelected(approver, i) {
    if (approver.approvalActionId == 4) {
      if (this.defaultContactId) {
        this.salesOrderCustomerApprovalListView[i].customerApprovedById = this.defaultContactId;
      } else {
        this.salesOrderCustomerApprovalListView[i].customerApprovedById = '';
      }
    }
  }

  dataLoadError(error) {
    this.isSpinnerVisible = false;
    let errorMessage = '';
    if (error.message) {
      errorMessage = error.message;
    }
    this.alertService.resetStickyMessage();
    this.alertService.showStickyMessage("Sales Order", errorMessage, MessageSeverity.error, error);
    // this.alertService.showMessage(error);
  }
  loadApprovalListView(approvalList: ISalesOrderCustomerApproval[]) {
    let approvalListView: SalesOrderCustomerApprovalView[] = [];;

    approvalList.forEach(approval => {
      let instance: SalesOrderCustomerApprovalView = new SalesOrderCustomerApprovalView();

      Object.keys(approval).forEach(key => {
        instance[key] = approval[key];
      });

      instance.originalStatusId = approval.statusId;
      instance.selected = instance.originalStatusId == DBkeys.DEFAULT_SALES_ORDER_APPROVAL_STATUS_ID;
      instance.openDate = new Date(approval.openDate);
      instance.approvalDate = new Date(approval.approvalDate);
      instance.approvedDate = new Date(approval.approvedDate);
      instance.statusChangeDate = new Date(approval.statusChangeDate);
      if (approval.internalSentDate) {
        instance.internalSentDate = new Date(approval.internalSentDate);
        if (!approval.internalApprovedDate) {
          instance.internalApprovedDate = new Date();
        }
      }
      else if (!approval.internalSentDate) {
        instance.internalSentDate = new Date();
      }
      if (approval.customerSentDate) {
        instance.customerSentDate = new Date(approval.customerSentDate);
        if (!approval.customerApprovedDate) {
          instance.customerApprovedDate = new Date();
        }
      }
      if (approval.internalApprovedDate) {
        instance.internalApprovedDate = new Date(approval.internalApprovedDate);
        if (!approval.customerSentDate) {
          instance.customerSentDate = new Date();
        }
      }
      if (approval.customerApprovedDate) {
        instance.customerApprovedDate = new Date(approval.customerApprovedDate);
      }
      approvalListView.push(instance);
    });

    if (approvalListView.length > 0) {

      this.salesOrderCustomerApprovalListView = approvalListView.slice(0);

      console.log("salesOrderCustomerApprovalListView", this.salesOrderCustomerApprovalListView);

    }
  }
  getInternalSentMaxDate(sentDate) {
    let sDate = new Date(sentDate);
    if (new Date() > sDate) {
      return sDate;
    }
    return new Date();
  }

  getInternalSentMinDate(openDate) {
    return new Date(openDate);
  }

  getInternalApprovedMaxDate() {
    return new Date();
  }

  getCustomerSentMinDate(intApprovedDate) {
    if (intApprovedDate) {
      return new Date(intApprovedDate);
    }
    return;
  }

  isApproved(statusId: number) {
    return statusId == DBkeys.DEFAULT_SALES_QUOTE_APPROVAL_ID;
  }

  getPageCount(totalRecords: number, pageSize: number): number {
    return Math.ceil(totalRecords / pageSize)
  }

  onPartCheckChange(data: SalesOrderCustomerApprovalView) {
    data.statusId = data.selected ? DBkeys.DEFAULT_SALES_ORDER_APPROVAL_STATUS_ID : data.originalStatusId;
  }

  resetDataState(data: SalesOrderCustomerApprovalView) {
    data.approvedContactId = null;
    data.approvalDate = null;
    data.approvedContactId = null;
    data.memo = '';
    data.approver = '';
    data.approvedName = '';
    data.title = '';
  }

  isValidCustomerApprovalStatus(status: any) {
    return status.displayInDropdown && (status.id === 1 || status.id === 4);
  }

  dismissViewModel() {
    this.partModal.close();
  }

  hasPartsSelected() {
    var result = this.salesOrderCustomerApprovalListView.filter(view => !this.isApproved(view.originalStatusId)) || [];
    return result.length > 0;
  }

  openConfirmationModal() {
    if (this.hasPartsSelected()) {
      this.modal = this.modalService.open(this.customerApprovalConfirmationModal, { size: "sm" });
      this.modal.result.then(
        () => { },
        () => { }
      );
    }
  }

  closeConfirmationModal() {
    if (this.modal) {
      this.modal.close();
    }
  }

  viewSelectedStockLine(rowData: SalesOrderCustomerApprovalView, content: any) {
    if (rowData.stockLineId) {
      this.partModal = this.modalService.open(StocklineViewComponent, { size: 'lg', backdrop: 'static', keyboard: false });
      this.partModal.componentInstance.stockLineId = rowData.stockLineId;
      this.partModal.result.then(() => {
      }, () => { })
    }
  }
  saveApprovalProcess() {
    let openEmail = false;
    console.log(this.approvers);
    if (this.approvers && this.approvers.length > 0) {
      this.approvers.forEach(
        x => {
          if (x.selected && x.approvalActionId == 3) {
            openEmail = true;
          }
        }
      )
    }
    if (openEmail) {
      $('#quoteVersion').modal('show');
    }
    else {
      this.saveApprovalData();
    }
  }
  saveApprovalData() {
    let payLoad = [];
    let currentEmployee = JSON.parse(localStorage.getItem('employee'));
    let mastercompanyid = JSON.parse(localStorage.getItem('current_user'));
    if (!mastercompanyid) {
      mastercompanyid = JSON.parse(sessionStorage.getItem('current_user'))
    }
    if (!mastercompanyid) {
      mastercompanyid = { "masterCompanyId": 1 };
    }
    this.salesOrderCustomerApprovalListView.forEach(
      x => {
        if (x.selected) {
          let obj = {
            "SalesOrderId": x.salesOrderId,

            "SalesOrderQuotePartId": x.salesOrderQuotePartId,
            "SalesOrderPartId": x.salesOrderPartId,
            "CustomerId": x.customerId,

            "ApprovedContactId": x.approvedContactId,
            "InternalSentDate": x.internalSentDate,
            "InternalApprovedDate": x.internalApprovedDate,
            //"InternalApprovedById": currentEmployee.employeeId,
            "CustomerSentDate": x.customerSentDate,
            "CustomerApprovedDate": x.customerApprovedDate,
            "CustomerApprovedById": x.customerApprovedById,
            "InternalStatusId": x.internalStatusId,
            "CustomerStatusId": x.customerStatusId,
            "InternalMemo": x.internalMemo,
            "CustomerMemo": x.customerMemo,
            "UpdatedBy": "admin",
            "salesOrderApprovalId": x.salesOrderApprovalId,

            "ApprovalActionId": x.approvalActionId,
            "IsInternalApprove": x.isInternalApprove,

            "createdBy": "admin",
            "updatedBy": "admin",
            "createdDate": new Date().toDateString(),
            "updatedDate": new Date().toDateString(),
            "isActive": true,
            "isDeleted": false
          }
          // obj['MasterCompanyId'] = mastercompanyid.masterCompanyId;
          obj['masterCompanyId'] = mastercompanyid.masterCompanyId;

          if (x.approvalActionId == 1) { // Sent for Internal Approvals
            obj['InternalEmails'] = this.getApproversEmails();
            obj['approvers'] = this.getApproversNames();
          }
          else {
            obj['InternalEmails'] = "";
            obj['approvers'] = "";
          }
          if (x.approvalActionId == 2) {

            obj['InternalApprovedById'] = currentEmployee.employeeId;
          }
          else {
            obj['InternalApprovedById'] = x.internalApprovedById;
          }
          payLoad.push(obj);
        }
      }
    )

    this.isSpinnerVisible = true;
    this.salesOrderService.sentForInternalApproval(payLoad)
      .subscribe(
        res => {
          $('#quoteVersion').modal('hide');
          this.alertService.showMessage(
            this.moduleName,
            `Data updated successfully`,
            MessageSeverity.success
          );
          this.isSpinnerVisible = false;
          this.getCustomerApprovalList();
        },
        err => {
          this.alertService.showMessage(
            this.moduleName,
            `Data updating failed`,
            MessageSeverity.error
          );
          this.isSpinnerVisible = false;
          $('#quoteVersion').modal('hide');
        }
      )
  }
  getApproversNames() {
    let result = '';
    if (this.approvers && this.approvers.length > 0) {
      this.approvers.forEach(
        (x) => {
          if (result != '') {
            result += ','
          }
          result += x.approverName;
        }
      )
    }

    return result;
  }
  getApproversEmails() {
    let result = '';
    if (this.approvers && this.approvers.length > 0) {
      // this.approvers.forEach(
      //   (x) => {
      //     if (result != '') {
      //       result += ','
      //     }
      //     result += x.approverEmail;
      //   }
      // )
      return this.approvers[0].approverEmails;
    }
    return result;
  }
  approve(): void {

    let selectedParts: SalesOrderCustomerApprovalView[] = this.salesOrderCustomerApprovalListView.filter(item => item.originalStatusId != 4 && item.selected) || [];

    if (selectedParts.length > 0) {
      let partsToApprove: ISalesOrderCustomerApproval[] = [];
      selectedParts.forEach(part => {
        let instance: SalesOrderCustomerApproval = new SalesOrderCustomerApproval();

        Object.keys(part).forEach(key => {
          instance[key] = part[key];
        });

        instance.statusChangeDate = null;

        partsToApprove.push(instance);
      });
      this.isSpinnerVisible = true;
      this.salesOrderService.approveParts(partsToApprove).subscribe(data => {
        this.isSpinnerVisible = false;
        this.closeConfirmationModal();
        this.alertService.showMessage(
          "Success",
          `Part(s) approved successfully.`,
          MessageSeverity.success
        );
        this.getCustomerApprovalList();
        this.onPartApprovedEvent.emit();
      }, error => {
        this.getCustomerApprovalList();
        // this.alertService.showMessage(
        //   "Success",
        //   `Quote(s) approved successfully.`,
        //   MessageSeverity.success
        // );
        this.dataLoadError(error);
        // this.isSpinnerVisible = false;
        // this.alertService.showStickyMessage(error, null, MessageSeverity.error);
      });
    }
  }

  getApprovalActionInternalStatus(approver) {
    if (approver.selected && approver.approvalActionId == 2) {
      return true;
    } else {
      return false;
    }
  }

  getApprovalActionCustomerStatus(approver) {
    if (approver.selected && approver.approvalActionId == 4) {
      return true;
    } else {
      return false;
    }
  }

  memoIndex;
  memoType;
  onAddTextAreaInfo(material, index) {
    this.memoIndex = index;
    this.memoType = material;
    console.log("memolist", material, index);
    this.textAreaInfo = this.salesOrderCustomerApprovalListView[index][material];
  }
  textAreaInfo: any;
  onSaveTextAreaInfo(memo) {
    if (memo) {
      this.textAreaInfo = memo;
      this.salesOrderCustomerApprovalListView[this.memoIndex][this.memoType] = this.textAreaInfo;
    }
    $("#memo-popup").modal("hide");
  }
  onCloseTextAreaInfo() {
    $("#memo-popup").modal("hide");
  }
}