import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import {
  NgForm
} from "@angular/forms";
import { Customer } from "../../../models/customer.model";
import { AlertService, MessageSeverity } from "../../../services/alert.service";
import { ActivatedRoute } from "@angular/router";
import { CommonService } from "../../../services/common.service";
import { CurrencyService } from "../../../services/currency.service";
import { EmployeeService } from "../../../services/employee.service";
import { AuthService } from "../../../services/auth.service";
import { Router } from "@angular/router";
import { Subject } from 'rxjs';
import {
  getObjectById,
  editValueAssignByCondition,
  getValueFromArrayOfObjectById,
  formatNumberAsGlobalSettingsModule,
  getObjectByValue,
} from "../../../generic/autocomplete";
import {
  NgbModal,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
import { CustomerSearchQuery } from "../../sales/quotes/models/customer-search-query";
import { MarginSummary } from "../../../models/sales/MarginSummaryForSalesorder";
import { ManagementStructureComponent } from "../../sales/quotes/shared/components/management-structure/management-structure.component";
import { ICustomerPayments } from "../../../models/sales/ICustomerPayments";
import { CustomerPayments } from "../../../models/sales/CustomerPayments.model";
import { CustomerPaymentsService } from "../../../services/customer-payment.service";
import { ReviewCustomerPaymentComponent } from "../reivew-customer-payments/review-customer-payment.component";

@Component({
  selector: "app-customer-payment-create",
  templateUrl: "./customer-payment-create.component.html",
  styleUrls: ["./customer-payment-create.component.scss"]
})
export class CustomerPaymentCreateComponent implements OnInit {
  uploadDocs: Subject<boolean> = new Subject();
  query: CustomerSearchQuery;
  customers: Customer[];
  totalRecords: number = 0;
  totalPages: number = 0;
  showPaginator: boolean = false;
  customerId: number;
  customerPayment: any = {};
  salesOrder: ICustomerPayments;
  customerDetails: any;
  enableUpdateButton = false;
  isDocumentsAdded = false;
  firstCollection: any[];
  allEmployeeinfo: any[] = [];
  customerNames: any[];
  allCustomer: any[];
  modal: NgbModalRef;
  errorModal: NgbModalRef;
  tempMemo: any;
  tempMemoLabel: any;
  isSpinnerVisible: boolean = true;
  customer: any = {
    customerName: "",
    customerCode: "",
    promisedDate: ""
  };
  display: boolean = false;
  id: any;
  errorMessages: any[] = [];
  isEdit: boolean = false;
  isEditModeHeader: boolean = false;
  managementStructureId: any;
  toggle_po_header: boolean = true;
  custPaymentData: any = {};
  marginSummary: MarginSummary = new MarginSummary();
  @ViewChild("errorMessagePop", { static: false }) public errorMessagePop: ElementRef;
  @ViewChild("newSalesQuoteForm", { static: false }) public newSalesQuoteForm: NgForm;
  @ViewChild(ManagementStructureComponent, { static: false }) managementStructureComponent: ManagementStructureComponent;
  employeesList: any = [];
  isCreateModeHeader: boolean = false;
  isHeaderSubmit: boolean = false;
  @ViewChild("viewQuote", { static: false }) public viewQuoteModal: ElementRef;
  @ViewChild(ReviewCustomerPaymentComponent, { static: false }) public reviewCustomerPaymentComponent: ReviewCustomerPaymentComponent;
  legalEntityList: any;
  businessUnitList: any;
  enableHeaderSaveBtn: boolean = false;
  managementValidCheck: boolean;
  departmentList: any;
  divisionList: any;
  bulist: any[] = [];
  divisionlist: any[] = [];
  maincompanylist: any[] = [];
  arrayEmplsit: any[] = [];
  allEmployeeList: any = [];
  currentUserEmployeeName: string;
  statusList: any = [];
  accntPriodList: any = [];
  modalIsMaintannce: NgbModalRef;
  maintanancemoduleName = 'CustomerReceipt';
  selectedIndex: number = 0;

  constructor(
    private alertService: AlertService,
    private route: ActivatedRoute,
    private customerPaymentsService: CustomerPaymentsService,
    private commonservice: CommonService,
    public currencyService: CurrencyService,
    public employeeService: EmployeeService,
    private authService: AuthService,
    public router: Router,
    private modalService: NgbModal
  ) {
  }

  ngOnInit() {
    this.loadStatus();
    this.loadAcctPeriods();

    this.id = +this.route.snapshot.paramMap.get("id");
    this.managementStructureId = this.currentUserManagementStructureId;

    if (!this.isEdit) {
      this.load(this.managementStructureId);
    }

    setTimeout(() => {
      this.getSoInstance(true);
    }, 2200);

    this.isSpinnerVisible = false;
  }

  get userName(): string {
    return this.authService.currentUser
      ? this.authService.currentUser.userName
      : "";
  }

  get masterCompanyId(): number {
    return this.authService.currentUser
      ? this.authService.currentUser.masterCompanyId
      : 1;
  }

  get userId() {
    return this.authService.currentUser ? this.authService.currentUser.id : 0;
  }

  get employeeId() {
    return this.authService.currentUser ? this.authService.currentUser.employeeId : 0;
  }

  get currentUserManagementStructureId(): number {
    return this.authService.currentUser
      ? this.authService.currentUser.managementStructureId
      : null;
  }

  onChangeInput() {
    this.enableUpdateButton = true;
  }

  getSoInstance(initialCall = false) {
    if (this.id) {
      this.getSalesOrderInstance(this.id, initialCall);
      this.isEdit = true;
      this.toggle_po_header = false;
    }
    else {
      this.getNewSalesOrderInstance();
      this.isEdit = false;
    }
  }

  parsedText(text) {
    if (text) {
      const dom = new DOMParser().parseFromString(
        '<!doctype html><body>' + text,
        'text/html');
      const decodedString = dom.body.textContent;
      return decodedString;
    }
  }

  filterfirstName(event) {
    if (event.query !== undefined && event.query !== null) {
      this.employeedata(event.query, this.customerPayment.managementStructureId);
    }
    this.enableUpdateButton = true;
  }

  getCustomerDetails() {
  }

  getSalesOrderInstance(salesOrderId: number, initialCall = false) {
    this.isSpinnerVisible = true;
    this.customerPaymentsService.getCustomerPayment(salesOrderId).subscribe(data => {
      this.isSpinnerVisible = false;
      if (data) {
        this.custPaymentData = data && data.length ? data[0] : null;
        this.bindData(this.custPaymentData, initialCall);
      }
    }, error => {
      this.isSpinnerVisible = false;
    });
  }

  bindData(custPayment: ICustomerPayments, initialCall = false) {
    this.customerPayment.receiptNo = custPayment.receiptNo;
    this.customerPayment.bankName = custPayment.bankName;
    this.customerPayment.bankAcctNum = custPayment.bankAcctNum;
    this.customerPayment.depositDate = new Date(custPayment.depositDate);
    this.customerPayment.acctingPeriod = parseInt(custPayment.acctingPeriod);
    this.customerPayment.amount = custPayment.amount ? formatNumberAsGlobalSettingsModule(custPayment.amount, 2) : 0.00;
    this.customerPayment.amtApplied = custPayment.amtApplied;
    this.customerPayment.amtRemaining = custPayment.amtRemaining;
    this.customerPayment.reference = custPayment.reference;
    this.customerPayment.cntrlNum = custPayment.cntrlNum;
    this.customerPayment.openDate = new Date(custPayment.openDate);
    this.customerPayment.statusId = custPayment.statusId;
    this.customerPayment.postedDate = custPayment.postedDate ? new Date(custPayment.postedDate) : null;
    this.customerPayment.memo = custPayment.memo;
    this.customerPayment.managementStructureId = custPayment.managementStructureId;
  }

  getNewSalesOrderInstance() {
    this.customerPayment.receiptNo = "Creating";
    this.customerPayment.statusId = getObjectByValue('label', 'Open', this.statusList).value; // Open status by default
    this.customerPayment.depositDate = new Date();
    this.customerPayment.openDate = new Date();
    this.customerPayment.amount = formatNumberAsGlobalSettingsModule(0, 2);
  }

  onAddDescription(value) {
    this.tempMemo = "";

    if (value == "notes") {
      this.tempMemoLabel = "Notes";
      this.tempMemo = this.customerPayment.notes;
    }
    if (value == "memo") {
      this.tempMemoLabel = "Memo";
      this.tempMemo = this.customerPayment.memo;
    }
  }

  onSaveDescription() {
    if (this.tempMemoLabel == "Notes") {
      this.customerPayment.notes = this.tempMemo;
    }
    if (this.tempMemoLabel == "Memo") {
      this.customerPayment.memo = this.tempMemo;
    }
    this.enableUpdateButton = true;
  }

  closeErrorMessage() {
    this.errorModal.close();
  }

  onSubmit() {
    this.errorMessages = [];
    let haveError = false;
    if (this.customerPayment.amount == undefined || this.customerPayment.amount <= 0) {
      this.errorMessages.push("Please enter amount");
      haveError = true;
    }

    if (haveError) {
      let content = this.errorMessagePop;
      this.errorModal = this.modalService.open(content, { size: "sm", backdrop: 'static', keyboard: false });
      this.display = true;
    }
    else {
      this.display = false;
      this.isSpinnerVisible = true;
      this.salesOrder = new CustomerPayments();
      this.salesOrder.receiptNo = "Creating";
      this.salesOrder.receiptId = this.id;
      this.salesOrder.bankName = this.customerPayment.bankName;
      this.salesOrder.bankAcctNum = this.customerPayment.bankAcctNum;
      this.salesOrder.masterCompanyId = this.masterCompanyId;
      this.salesOrder.depositDate = this.customerPayment.depositDate;
      this.salesOrder.acctingPeriod = this.customerPayment.acctingPeriod;
      this.salesOrder.amount = this.customerPayment.amount;
      this.salesOrder.amtApplied = this.customerPayment.amtApplied;
      this.salesOrder.amtRemaining = this.customerPayment.amount;
      this.salesOrder.reference = this.customerPayment.reference;
      this.salesOrder.cntrlNum = "cntrl";
      this.salesOrder.openDate = this.customerPayment.openDate;
      this.salesOrder.statusId = this.customerPayment.status;
      this.salesOrder.postedDate = this.customerPayment.postedDate;
      this.salesOrder.memo = this.customerPayment.memo;
      this.salesOrder.managementStructureId = this.customerPayment.managementStructureId;

      this.salesOrder.employeeId = editValueAssignByCondition(
        "value",
        this.customerPayment.employeeId
      );

      this.salesOrder.createdBy = this.userName;
      this.salesOrder.updatedBy = this.userName;
      this.salesOrder.createdDate = new Date();
      this.salesOrder.updatedDate = new Date();

      if (this.id) {
        this.isCreateModeHeader = false;
        this.customerPaymentsService.update(this.salesOrder).subscribe(data => {
          this.isSpinnerVisible = false;
          this.alertService.showMessage(
            "Success",
            `Payment Header Information updated successfully.`,
            MessageSeverity.success
          );
          if (this.isDocumentsAdded) {
            this.uploadDocs.next(true);
          }
          this.getSalesOrderInstance(this.id, true);

          this.toggle_po_header = false;
          if (this.isEdit) {
            this.isCreateModeHeader = false;
          }
          this.enableUpdateButton = true;
        }, error => {
          this.isSpinnerVisible = false;
          this.toggle_po_header = true;
        });
      } else {
        this.customerPaymentsService.create(this.salesOrder).subscribe(data => {
          let receiptId = data[0].receiptId;
          if (this.isDocumentsAdded) {
            localStorage.setItem('commonId', receiptId.toString());
            this.uploadDocs.next(true);
          }
          this.isCreateModeHeader = true;
          this.isHeaderSubmit = true;
          this.isSpinnerVisible = false;
          this.alertService.showMessage(
            "Success",
            `Payment Header Information updated successfully`,
            MessageSeverity.success
          );
          this.toggle_po_header = false;
          if (receiptId) {
            this.router.navigateByUrl(
              `accountreceivable/accountreceivablepages/process-customer-payment/${receiptId}`
            );
          }
        }, error => {
          this.isSpinnerVisible = false;
          this.toggle_po_header = true;
        });
      }
      this.toggle_po_header = false;
    }
  }

  onChangeAmount() {
    this.customerPayment.amount = this.customerPayment.amount ? formatNumberAsGlobalSettingsModule(this.customerPayment.amount, 2) : '0.00';
  }

  dismissModel() {
    this.modal.close();
  }

  closeConfirmationModal() {
    if (this.modal) {
      this.modal.close();
    }
  }

  onTabChange(event) {
    if (event.index == 0) {
      this.selectedIndex = 0;
    }
    if (event.index == 1) {
      this.selectedIndex = 1;
      this.reviewCustomerPaymentComponent.fetchDataForReview();
    }
  }

  load(managementStructureId: number) {
    this.managementStructureId = managementStructureId;

    if (this.id) {
      this.getManagementStructureDetails(this.managementStructureId, this.employeeId, this.customerPayment.managementStructureId);
    } else {
      this.getManagementStructureDetails(this.managementStructureId, this.employeeId);
    }
  }

  enableHeaderSave() {
    this.enableHeaderSaveBtn = true;
    this.enableUpdateButton = true;
  }

  checkValidOnChange(condition, value) {
    if (condition != null && condition != 0 && value == "companyId") {
      this.managementValidCheck = false;
    }
  }

  getManagementStructureDetails(id, empployid = 0, editMSID = 0) {
    empployid = empployid == 0 ? this.employeeId : empployid;
    editMSID = this.isEditModeHeader ? editMSID = id : 0;
    this.isSpinnerVisible = true;
    this.commonservice.getManagmentStrctureData(id, empployid, editMSID).subscribe(response => {
      this.isSpinnerVisible = false;
      if (response) {
        const result = response;
        if (result[0] && result[0].level == 'Level1') {
          this.maincompanylist = result[0].lstManagmentStrcture;
          this.customerPayment.companyId = result[0].managementStructureId;
          this.customerPayment.managementStructureId = result[0].managementStructureId;
          this.customerPayment.buId = 0;
          this.customerPayment.divisionId = 0;
          this.customerPayment.departmentId = 0;
          this.bulist = [];
          this.divisionlist = [];
          this.departmentList = [];
        } else {
          this.customerPayment.companyId = 0;
          this.customerPayment.buId = 0;
          this.customerPayment.divisionId = 0;
          this.customerPayment.departmentId = 0;
          this.maincompanylist = [];
          this.bulist = [];
          this.divisionlist = [];
          this.departmentList = [];
        }

        if (result[1] && result[1].level == 'Level2') {
          this.bulist = result[1].lstManagmentStrcture;
          this.customerPayment.buId = result[1].managementStructureId;
          this.customerPayment.managementStructureId = result[1].managementStructureId;
          this.customerPayment.divisionId = 0;
          this.customerPayment.departmentId = 0;
          this.divisionlist = [];
          this.departmentList = [];
        } else {
          if (result[1] && result[1].level == 'NEXT') {
            this.bulist = result[1].lstManagmentStrcture;
          }
          this.customerPayment.buId = 0;
          this.customerPayment.divisionId = 0;
          this.customerPayment.departmentId = 0;
          this.divisionlist = [];
          this.departmentList = [];
        }

        if (result[2] && result[2].level == 'Level3') {
          this.divisionlist = result[2].lstManagmentStrcture;
          this.customerPayment.divisionId = result[2].managementStructureId;
          this.customerPayment.managementStructureId = result[2].managementStructureId;
          this.customerPayment.departmentId = 0;
          this.departmentList = [];
        } else {
          if (result[2] && result[2].level == 'NEXT') {
            this.divisionlist = result[2].lstManagmentStrcture;
          }
          this.customerPayment.divisionId = 0;
          this.customerPayment.departmentId = 0;
          this.departmentList = [];
        }

        if (result[3] && result[3].level == 'Level4') {
          this.departmentList = result[3].lstManagmentStrcture;;
          this.customerPayment.departmentId = result[3].managementStructureId;
          this.customerPayment.managementStructureId = result[3].managementStructureId;
        } else {
          this.customerPayment.departmentId = 0;
          if (result[3] && result[3].level == 'NEXT') {
            this.departmentList = result[3].lstManagmentStrcture;
          }
        }
        this.employeedata('', this.customerPayment.managementStructureId);
      }
    }, err => {
      this.isSpinnerVisible = false;
    });
  }

  employeedata(strText = '', manStructID = 0) {
    if (this.arrayEmplsit.length == 0) {
      this.arrayEmplsit.push(0);
    }

    this.arrayEmplsit.push(this.employeeId == null ? 0 : this.employeeId);

    this.isSpinnerVisible = true;
    this.commonservice.autoCompleteDropdownsEmployeeByMS(strText, true, 20, this.arrayEmplsit.join(), manStructID).subscribe(res => {
      this.isSpinnerVisible = false;
      this.allEmployeeList = res;
      this.firstCollection = res;
      this.employeesList = res;
      this.currentUserEmployeeName = getValueFromArrayOfObjectById('label', 'value', this.employeeId, res);
      if (!this.isEdit) {
        this.getEmployeerOnLoad(this.customerPayment.employeeId ? this.customerPayment.employeeId.value : this.employeeId);
      }
    }, err => {
      this.isSpinnerVisible = false;
    })
  }

  getEmployeerOnLoad(id) {
    this.customerPayment.employeeId = getObjectById('value', id, this.allEmployeeList);
  }

  getBUList(legalEntityId) {
    this.customerPayment.buId = 0;
    this.customerPayment.divisionId = 0;
    this.customerPayment.departmentId = 0;
    this.bulist = [];
    this.divisionlist = [];
    this.departmentList = [];
    if (legalEntityId != 0 && legalEntityId != null && legalEntityId != undefined) {
      this.customerPayment.managementStructureId = legalEntityId;
      this.customerPayment.companyId = legalEntityId;
      this.commonservice.getManagementStructurelevelWithEmployee(legalEntityId, this.employeeId).subscribe(res => {
        this.bulist = res;
        this.employeedata('', this.customerPayment.managementStructureId);
      }, err => {
        this.isSpinnerVisible = false;
      });
    }
    else {
      this.customerPayment.managementStructureId = 0;
      this.customerPayment.companyId = 0;
    }
  }

  getDivisionlist(buId) {
    this.divisionlist = [];
    this.departmentList = [];
    this.customerPayment.divisionId = 0;
    this.customerPayment.departmentId = 0;

    if (buId != 0 && buId != null && buId != undefined) {
      this.customerPayment.managementStructureId = buId;
      this.customerPayment.buId = buId;
      this.commonservice.getManagementStructurelevelWithEmployee(buId, this.employeeId).subscribe(res => {
        this.divisionlist = res;
      }, err => {
        this.isSpinnerVisible = false;
      });
    } else {
      this.customerPayment.managementStructureId = this.customerPayment.companyId;
    }

    this.employeedata('', this.customerPayment.managementStructureId);
  }

  getDepartmentlist(divisionId) {
    this.customerPayment.departmentId = 0;
    this.departmentList = [];
    if (divisionId != 0 && divisionId != null && divisionId != undefined) {
      this.customerPayment.divisionId = divisionId;
      this.customerPayment.managementStructureId = divisionId;
      this.commonservice.getManagementStructurelevelWithEmployee(divisionId, this.employeeId).subscribe(res => {
        this.departmentList = res;
      }, err => {
        this.isSpinnerVisible = false;
      });
    }
    else {
      this.customerPayment.managementStructureId = this.customerPayment.buId;
      this.customerPayment.divisionId = 0;
    }

    this.employeedata('', this.customerPayment.managementStructureId);
  }

  loadStatus() {
    this.commonservice.smartDropDownList('MasterCustomerPaymentStatus', 'Id', 'Name').subscribe(response => {
      if (response) {
        this.statusList = response;
        this.statusList = this.statusList.sort((a, b) => (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0));
      }
    }, err => {
      this.isSpinnerVisible = false;
    });
  }

  loadAcctPeriods() {
    this.commonservice.smartDropDownList('AccountingCalendar', 'AccountingCalendarId', 'PeriodName').subscribe(response => {
      if (response) {
        this.accntPriodList = response;
        this.accntPriodList = this.accntPriodList.sort((a, b) => (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0));
      }
    }, err => {
      this.isSpinnerVisible = false;
    });
  }

  changeOfStatus() {
    this.enableUpdateButton = true;
    this.isDocumentsAdded = true;
  }

  viewCRDocumentModal(content) {
    this.modalIsMaintannce = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
  }

  closeCDDocumentModal() {
    this.modalIsMaintannce.close();
  }

  changeToReviewTab(event) {
    this.selectedIndex = 1;
    this.reviewCustomerPaymentComponent.fetchDataForReview();
  }
}