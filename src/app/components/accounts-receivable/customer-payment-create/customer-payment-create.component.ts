import { Component, OnInit, ViewChild, ElementRef, Input } from "@angular/core";
import {
  NgForm,
  FormGroup
} from "@angular/forms";
import { Customer } from "../../../models/customer.model";
import { AlertService, MessageSeverity } from "../../../services/alert.service";
import { ActivatedRoute } from "@angular/router";
import { ISalesOrder } from "../../../models/sales/ISalesOrder.model";
import { ISalesOrderQuote } from "../../../models/sales/ISalesOrderQuote";
import { ISalesQuoteView } from "../../../models/sales/ISalesQuoteView";
import { ISalesOrderView } from "../../../models/sales/ISalesOrderView";
import { CommonService } from "../../../services/common.service";
import { CurrencyService } from "../../../services/currency.service";
import { EmployeeService } from "../../../services/employee.service";
import { AuthService } from "../../../services/auth.service";
import { Router } from "@angular/router";
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
import { SalesOrderFreightComponent } from "../../sales/order/shared/components/sales-order-freight/sales-order-freight.component";
import { SalesOrderChargesComponent } from "../../sales/order/shared/components/sales-order-charges/sales-order-charges.component";
import { ManagementStructureComponent } from "../../sales/quotes/shared/components/management-structure/management-structure.component";
import { SalesOrderPartNumberComponent } from "../../sales/order/shared/components/sales-order-part-number/sales-order-part-number.component";
import { SalesAddressComponent } from "../../sales/quotes/shared/components/sales-address/sales-address.component";
import { SalesOrderConfirmationModalComponent } from "../../sales/order/sales-order-confirmation-modal/sales-order-confirmation-modal.compoent";
import { SalesOrderBillingComponent } from "../../sales/order/shared/components/sales-order-billing/sales-order-billing.component";
import { SalesOrderShippingComponent } from "../../sales/order/shared/components/sales-order-shipping/sales-order-shipping.component";
import { SalesOrderAnalysisComponent } from "../../sales/order/sales-order-analysis/sales-order-analysis.component";
import { SalesOrderPickTicketsComponent } from "../../sales/order/sales-order-pick-tickets/sales-order-pick-tickets.component";
import { SalesOrderApproveComponent } from "../../sales/order/shared/components/sales-approve/sales-approve.component";
import { SalesOrderCustomerApprovalComponent } from "../../sales/order/shared/components/sales-order-customer-approval/sales-order-customer-approval.component";
import { ISalesOrderCopyParameters } from "../../sales/order/models/isalesorder-copy-parameters";
import { PartDetail } from "../../sales/shared/models/part-detail";
import { CustomerViewComponent } from "../../../shared/components/customer/customer-view/customer-view.component";
import { IStatus } from "../../../models/sales/IStatus";
import { ICustomerPayments } from "../../../models/sales/ICustomerPayments";
import { CustomerPayments } from "../../../models/sales/CustomerPayments.model";
import { CustomerPaymentsService } from "../../../services/customer-payment.service";

@Component({
  selector: "app-customer-payment-create",
  templateUrl: "./customer-payment-create.component.html",
  styleUrls: ["./customer-payment-create.component.scss"]
})

export class CustomerPaymentCreateComponent implements OnInit {
  SalesOrderId: any;
  salesCreateHeaderOrderId: number;
  query: CustomerSearchQuery;
  customers: Customer[];
  totalRecords: number = 0;
  totalPages: number = 0;
  showPaginator: boolean = false;
  customerId: number;
  customerPayment: any = {};
  defaultSettingPriority;
  soSettingsList: any = [];
  salesOrder: ICustomerPayments;
  customerDetails: any;
  salesOrderQuote: ISalesOrderQuote;
  enableUpdateButton = true;
  salesOrderQuoteObj: ISalesOrderQuote;
  salesOrderObj: ISalesOrder;
  salesQuoteView: ISalesQuoteView;
  salesOrderView: ISalesOrderView;
  creditTerms: any[];
  percents: any[];
  markupList: any[];
  allCurrencyInfo: any[];
  firstCollection: any[];
  csrFirstCollection: any[];
  agentFirstCollection: any[];
  salesFirstCollection: any[];
  allEmployeeinfo: any[] = [];
  customerNames: any[];
  allCustomer: any[];
  customerContactList: any[] = [];
  customerWarningData: any = [];
  accountTypes: any[];
  selectedParts: any[] = [];
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
  salesQuoteForm: FormGroup;
  display: boolean = false;
  id: any;
  errorMessages: any[] = [];
  isEdit: boolean = false;
  isEditModeHeader: boolean = false;
  jobTitles: any;
  csrOriginalList: any;
  agentsOriginalList: any[] = [];
  salesPersonOriginalList: any[] = [];
  salesPersonAndAgentOriginalList: any[] = []
  managementStructureId: any;
  toggle_po_header: boolean = true;
  isEmailTabEnabled: boolean = false;
  isMemoTabEnabled: boolean = false;
  isPhoneTabEnabled: boolean = false;
  isTextTabEnabled: boolean = false;
  selectedCommunicationTab: any = '';
  customerInfoFromSalesQuote: any = {};
  custPaymentData: any = {};
  marginSummary: MarginSummary = new MarginSummary();
  @ViewChild("newSalesOrderForm", { static: false }) public newSalesOrderForm: NgForm;
  @ViewChild("errorMessagePop", { static: false }) public errorMessagePop: ElementRef;
  @ViewChild("newSalesQuoteForm", { static: false }) public newSalesQuoteForm: NgForm;
  @ViewChild(SalesOrderFreightComponent, { static: false }) public salesOrderFreightComponent: SalesOrderFreightComponent;
  @ViewChild(SalesOrderChargesComponent, { static: false }) public salesOrderChargesComponent: SalesOrderChargesComponent;
  @ViewChild(SalesOrderPartNumberComponent, { static: false }) public salesOrderPartNumberComponent: SalesOrderPartNumberComponent;
  @ViewChild(ManagementStructureComponent, { static: false }) managementStructureComponent: ManagementStructureComponent;
  @ViewChild(SalesAddressComponent, { static: false }) public salesAddressComponent: SalesAddressComponent;
  @ViewChild(SalesOrderConfirmationModalComponent, { static: false }) salesOrderConfirmationModalComponent: SalesOrderConfirmationModalComponent;
  @ViewChild(SalesOrderBillingComponent, { static: false }) public salesOrderBillingComponent: SalesOrderBillingComponent;
  @ViewChild(SalesOrderShippingComponent, { static: false }) public salesOrderShippingComponent: SalesOrderShippingComponent;
  @ViewChild(SalesOrderAnalysisComponent, { static: false }) public salesOrderAnalysisComponent: SalesOrderAnalysisComponent;
  @ViewChild(SalesOrderPickTicketsComponent, { static: false }) public salesOrderPickTicketsComponent: SalesOrderPickTicketsComponent;
  employeesList: any = [];
  customerWarning: any = {};
  status: IStatus[] = [];
  freight = [];
  charge = [];
  @Input() salesQuoteId: number = 0;
  @ViewChild(SalesOrderApproveComponent, { static: false }) public salesOrderApproveComponent: SalesOrderApproveComponent;
  @ViewChild(SalesOrderCustomerApprovalComponent, { static: false }) public salesOrderCustomerApprovalComponent: SalesOrderCustomerApprovalComponent;
  salesOrderCopyParameters: ISalesOrderCopyParameters;
  copyMode: boolean;
  copy: boolean;
  copyData: string;
  isCreateModeHeader: boolean = false;
  isHeaderSubmit: boolean = false;
  @ViewChild("updateConfirmationModal", { static: false })
  public updateConfirmationModal: ElementRef;
  @ViewChild("viewQuote", { static: false }) public viewQuoteModal: ElementRef;
  submitType: boolean = true;
  totalFreights = 0;
  totalCharges = 0;
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
  requisitionerList: any[];
  currentUserEmployeeName: string;
  controlSettings: any = {
    showViewQuote: false
  };
  moduleName: any = "SalesOrder";
  statusList: any = [];
  accntPriodList: any = [];
  addressType: any = 'SO';
  showAddresstab: boolean = false;

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
    this.salesOrderCopyParameters = null;
    this.copyMode = false;
    this.copy = null;
  }

  ngOnInit() {
    this.loadStatus();
    this.loadAcctPeriods();

    this.id = +this.route.snapshot.paramMap.get("id");
    this.controlSettings.showViewQuote = false;

    // this.salesQuoteService.resetSalesOrderQuote();

    // this.salesQuoteService.getSalesOrderQuteInstance().subscribe(data => {
    //   this.salesOrderQuote = data;
    // });

    // this.salesQuoteService.getSelectedParts().subscribe(data => {
    //   this.selectedParts = data;
    //   this.marginSummary = this.salesQuoteService.getSalesQuoteHeaderMarginDetails(this.selectedParts, this.marginSummary);
    // });

    this.managementStructureId = this.currentUserManagementStructureId;
    this.load(this.managementStructureId);

    setTimeout(() => {
      this.getSoInstance(true);
    },
      2200);

    // this.salesQuoteService.salesOrderViewSubj$.subscribe(data => {
    //   this.salesOrderView = data;
    // });

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
    this.enableUpdateButton = false;
  }

  getInitialDataForSO() {
    // let creditLimitTermsId = this.salesQuote.creditLimitTermsId ? this.salesQuote.creditLimitTermsId : 0;
    // let accountTypeId = this.salesQuote.accountTypeId ? this.salesQuote.accountTypeId : 0;
    // this.isSpinnerVisible = true;

    // this.getCustomerDetails();
    // this.getDefaultContact();
  }

  getSOMarginSummary() {
    // this.salesOrderService.getSOMarginSummary(this.id).subscribe(result => {
    //   if (result) {
    //     let summary: any = result;
    //     this.marginSummary = summary;
    //     this.totalCharges = this.marginSummary.misc;
    //     this.totalFreights = this.marginSummary.freightAmount;
    //     this.salesOrderService.setTotalFreights(this.marginSummary.freightAmount);
    //     this.salesOrderService.setTotalCharges(this.marginSummary.misc);
    //   } else {
    //     this.marginSummary = new MarginSummary();
    //   }
    // })
  }

  getSoInstance(initialCall = false) {
    if (this.copyMode) {
      //this.copySalesOrderInstance(this.salesOrderCopyParameters.salesOrderId);
    }
    else if (this.id) {
      this.getSalesOrderInstance(this.id, initialCall);
      this.isEdit = true;
      this.toggle_po_header = false;
    } else if (this.salesOrderView) {
      // this.customerPayment = this.salesOrderView.salesOrder
      // this.commonSalesOrderInstanceForConvertAndEdit(this.salesOrderView);
      // this.getSOMarginSummary();
    }
    else {
      this.getNewSalesOrderInstance(this.customerId, initialCall);
      // this.marginSummary = new MarginSummary();
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

  // setTypesOfWarnings(warningsData) {
  //   if (warningsData.length > 0) {
  //     warningsData.filter(i => {
  //       if (i.label == DBkeys.GLOBAL_CUSTOMER_WARNING_TYOE_FOR_SALES_ORDER) {
  //         this.getCustomerWarningsData(i.value)
  //       }
  //     })
  //   }
  // }

  // async getCustomerWarningsData(customerWarningListId: number) {
  //   await this.customerService
  //     .getCustomerWarningsByCustomerIdandCustomerWarningsListID(this.customerId, customerWarningListId)
  //     .subscribe(res => {
  //       this.customerWarning = res;
  //       if (this.customerWarning && this.customerWarning.customerWarningId) {
  //         this.salesQuote.warningId = this.customerWarning.customerWarningId
  //         this.salesQuote.customerWarningId = this.customerWarning.customerWarningId;
  //       }
  //     }, error => {
  //       this.isSpinnerVisible = false;
  //     });
  // }

  // setCreditTerms(creditTerms) {
  //   this.creditTerms = creditTerms;
  // }

  // setAccountTypes(responseData) {
  //   this.accountTypes = responseData;
  // }

  filterfirstName(event) {
    if (event.query !== undefined && event.query !== null) {
      this.employeedata(event.query, this.customerPayment.managementStructureId);
    }
    this.enableUpdateButton = false;
  }

  // filtercsrFirstName(event) {
  //   this.csrFirstCollection = this.csrOriginalList;

  //   const CSRData = [
  //     ...this.csrOriginalList.filter(x => {
  //       return x.name.toLowerCase().includes(event.query.toLowerCase());
  //     })
  //   ];
  //   this.csrFirstCollection = CSRData;
  //   this.enableUpdateButton = false;
  // }

  // filterSalesFirstName(event) {
  //   this.salesFirstCollection = this.salesPersonAndAgentOriginalList;
  //   const employeeListData = [
  //     ...this.salesPersonAndAgentOriginalList.filter(x => {
  //       return x.name.toLowerCase().includes(event.query.toLowerCase());
  //     })
  //   ];
  //   this.salesFirstCollection = employeeListData;
  //   this.enableUpdateButton = false;
  // }

  // async setJobTitles(res) {
  //   this.csrOriginalList = res.csrEmpList;
  //   this.salesPersonAndAgentOriginalList = res.salesEmpList;
  // }

  // setCSR() {
  //   if (this.isEdit && this.salesOrderObj.customerSeviceRepId && this.salesOrderObj.customerSeviceRepId != 0) {
  //     this.salesQuote.customerServiceRepName = getObjectById(
  //       "employeeId",
  //       this.salesOrderObj.customerSeviceRepId,
  //       this.csrOriginalList
  //     );
  //   } else if (this.customerDetails && this.customerDetails.csrId) {
  //     this.salesQuote.customerServiceRepName = getObjectById(
  //       "employeeId",
  //       this.customerDetails.csrId,
  //       this.csrOriginalList
  //     );
  //   }
  // }

  // setSalesPerson() {
  //   if (this.isEdit && this.salesOrderObj.salesPersonId && this.salesOrderObj.salesPersonId != 0) {
  //     this.salesQuote.salesPersonName = getObjectById(
  //       "employeeId",
  //       this.salesOrderObj.salesPersonId,
  //       this.salesPersonAndAgentOriginalList
  //     );
  //   } else if (this.customerDetails && this.customerDetails.primarySalesPersonId) {
  //     this.salesQuote.salesPersonName = getObjectById(
  //       "employeeId",
  //       this.customerDetails.primarySalesPersonId,
  //       this.salesPersonAndAgentOriginalList
  //     );
  //   }
  // }

  // filterNames(event) {
  //   this.customerNames = [];
  //   if (this.allCustomer) {
  //     if (this.allCustomer.length > 0) {
  //       for (let i = 0; i < this.allCustomer.length; i++) {
  //         let name = this.allCustomer[i].name;
  //         if (name.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
  //           this.customerNames.push(name);
  //         }
  //       }
  //     }
  //   }
  // }

  getCustomerDetails() {
    // this.salesQuote.customerId = this.customerId;
    // this.salesQuote.customerName = this.customerDetails.name;
    // this.salesQuote.customerEmail = this.customerDetails.email;
    // this.salesQuote.customerCode = this.customerDetails.customerCode;
    // this.salesQuote.creditLimit = this.customerDetails.creditLimit;
    // this.salesQuote.creditLimitTermsId = this.customerDetails.creditTermsId;
    // this.customerInfoFromSalesQuote = {
    //   customerName: this.customerDetails.name,
    //   customerCode: this.customerDetails.customerCode,
    //   customerId: this.customerDetails.customerId
    // }

    // if (!this.id) {
    //   this.salesQuote.contractReferenceName = this.customerDetails.contractReference;
    //   this.salesQuote.restrictPMA = this.customerDetails.restrictPMA;
    //   this.salesQuote.restrictDER = this.customerDetails.restrictDER;
    //   this.salesQuote.accountTypeId = this.customerDetails.customerTypeId;
    //   this.setValidDaysBasedOnSettings(false);
    // }
    // else {
    //   this.setValidDaysBasedOnSettings(true);
    // }

    // this.setSalesPerson();
    // this.setCSR();
  }

  getDefaultContact() {
    if (this.customerContactList) {
      if (this.customerContactList.length > 0) {
        for (let i = 0; i < this.customerContactList.length; i++) {
          let isDefaultContact = this.customerContactList[i].isDefaultContact;
          if (isDefaultContact) {
            this.customerPayment.customerContactId = this.customerContactList[
              i
            ].contactId;
          }
        }
      }
    }
  }

  setAllCustomerContact(result) {
    this.customerContactList = result.contactList;
  }

  commonSalesOrderInstanceForConvertAndEdit(data) {
    this.salesOrderView = data;
    this.salesOrderObj = this.salesOrderView.salesOrder;
    let partList: any[] = this.salesOrderView.parts;

    for (let i = 0; i < partList.length; i++) {
      let selectedPart = partList[i];
      let partNumberObj = new PartDetail();
      partNumberObj.itemMasterId = selectedPart.itemMasterId;
      partNumberObj.stockLineId = selectedPart.stockLineId;
      partNumberObj.fixRate = selectedPart.fxRate;
      partNumberObj.quantityFromThis = selectedPart.qty;
      partNumberObj.conditionId = selectedPart.conditionId;
      partNumberObj.conditionDescription = selectedPart.conditionDescription;
      partNumberObj.currencyId = selectedPart.currencyId;
      partNumberObj.currencyDescription = selectedPart.currencyDescription;
      partNumberObj.partNumber = selectedPart.partNumber;
      partNumberObj.description = selectedPart.partDescription;
      partNumberObj.stockLineNumber = selectedPart.stockLineNumber;
      if (selectedPart.isOEM) partNumberObj.pmaStatus = "OEM";
      if (selectedPart.isPMA) partNumberObj.pmaStatus = "PMA";
      if (selectedPart.isDER) partNumberObj.pmaStatus = "DER";
      partNumberObj.salesPricePerUnit = selectedPart.unitSalePrice;
      partNumberObj.salesPriceExtended = selectedPart.salesBeforeDiscount;
      partNumberObj.salesDiscount = selectedPart.discount;
      partNumberObj.salesDiscountPerUnit = selectedPart.discountAmount;
      partNumberObj.netSalesPriceExtended = selectedPart.netSales;
      partNumberObj.masterCompanyId = selectedPart.masterCompanyId;
      partNumberObj.quantityFromThis = selectedPart.qty;
      partNumberObj.markUpPercentage = selectedPart.markUpPercentage;
      partNumberObj.salesOrderPartId = selectedPart.salesOrderPartId;
      partNumberObj.salesOrderId = selectedPart.salesOrderId;
      partNumberObj.markupExtended = selectedPart.markupExtended;
      partNumberObj.method = selectedPart.method;
      partNumberObj.methodType = selectedPart.methodType;
      partNumberObj.serialNumber = selectedPart.serialNumber;
      partNumberObj.marginAmountExtended = selectedPart.marginAmountExtended;
      partNumberObj.marginPercentagePerUnit = selectedPart.marginPercentage;
      partNumberObj.markupExtended = selectedPart.markupExtended;
      partNumberObj.unitCostPerUnit = selectedPart.unitCost;
      partNumberObj.unitCostExtended = selectedPart.unitCostExtended;
      partNumberObj.salesOrderQuoteId = selectedPart.salesOrderQuoteId
      partNumberObj.salesOrderQuotePartId = selectedPart.salesOrderQuotePartId;
      this.selectedParts.push(partNumberObj);
    }
    this.customerPayment.managementStructureId = this.salesOrderObj.managementStructureId;
    this.managementStructureId = this.salesOrderObj.managementStructureId;
    this.customerPayment.priorities = this.salesOrderView.priorities;
    this.customerPayment.leadSources = this.salesOrderView.leadSources;
    this.status = this.salesOrderView.status && this.salesOrderView.status.length > 0 ? this.salesOrderView.status.slice(0) : [];
    this.customerPayment.salesOrderQuoteId = this.salesOrderObj.salesOrderQuoteId;
    this.customerPayment.quoteTypeId = this.salesOrderObj.typeId;
    this.customerPayment.statusId = this.salesOrderObj.statusId;
    this.customerPayment.statusChangeDate = null;
    this.customerPayment.openDate = new Date(this.salesOrderObj.openDate);
    this.customerPayment.numberOfItems = this.salesOrderObj.numberOfItems;
    this.customerPayment.salesOrderNumber = this.salesOrderObj.salesOrderNumber;
    this.customerPayment.accountTypeId = this.salesOrderObj.accountTypeId;
    this.customerPayment.customerId = this.salesOrderObj.customerId;
    this.customerPayment.customerContactId = this.salesOrderObj.customerContactId;
    this.customerPayment.customerReferenceName = this.salesOrderObj.customerReference;
    this.customerPayment.quoteApprovedById = this.salesOrderObj.approvedById;
    this.customerPayment.totalSalesAmount = this.salesOrderObj.totalSalesAmount;
    this.customerPayment.customerHold = this.salesOrderObj.customerHold;
    this.customerPayment.depositAmount = this.salesOrderObj.depositAmount;
    this.customerPayment.balanceDue = this.salesOrderObj.balanceDue;
    this.customerPayment.employeeName = getObjectById(
      "value",
      this.salesOrderObj.employeeId,
      this.allEmployeeList
    );

    this.salesOrderQuote.managementStructureId = this.salesOrderObj.managementStructureId;
    this.salesOrderQuote.salesOrderQuoteId = this.salesOrderObj.salesOrderQuoteId;
    this.customerPayment.creditLimit = this.salesOrderObj.creditLimit;
    this.customerPayment.creditLimitTermsId = this.salesOrderObj.creditTermId;
    this.customerPayment.restrictPMA = this.salesOrderObj.restrictPMA;
    this.customerPayment.restrictDER = this.salesOrderObj.restrictDER;
    if (this.salesOrderObj.approvedDate)
      this.customerPayment.approvedDate = new Date(
        this.salesOrderObj.approvedDate
      );
    this.customerPayment.currencyId = this.salesOrderObj.currencyId;
    this.customerPayment.warningId = this.salesOrderObj.customerWarningId;
    this.customerPayment.memo = this.salesOrderObj.memo;
    this.customerPayment.notes = this.salesOrderObj.notes;
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

  copySalesOrderInstance(salesOrderId: number) {
    // this.isSpinnerVisible = true;
    // this.salesOrderService.copy(salesOrderId).subscribe(data => {
    //   this.getSOMarginSummary();
    //   this.load(this.managementStructureId);
    //   this.salesOrderView = data && data.length ? data[0] : null;
    //   if (this.salesOrderCopyParameters) {
    //     if (!this.salesOrderCopyParameters.copyParts) {
    //       this.salesOrderView.parts = [];
    //     }
    //   }
    //   this.bindData(this.salesOrderView);
    //   this.isSpinnerVisible = false;
    // }, error => {
    //   this.isSpinnerVisible = false;
    // });
  }

  bindData(custPayment: ICustomerPayments, initialCall = false) {
    this.customerPayment.receiptNo = custPayment.receiptNo;
    this.customerPayment.bankName = custPayment.bankName;
    this.customerPayment.bankAcctNum = custPayment.bankAcctNum;
    this.customerPayment.depositDate = new Date(custPayment.depositDate);
    this.customerPayment.acctingPeriod = parseInt(custPayment.acctingPeriod);
    this.customerPayment.amount = custPayment.amount;
    this.customerPayment.amtApplied = custPayment.amtApplied;
    this.customerPayment.amtRemaining = custPayment.amount;
    this.customerPayment.reference = custPayment.reference;
    this.customerPayment.cntrlNum = custPayment.cntrlNum;
    this.customerPayment.openDate = new Date(custPayment.openDate);
    this.customerPayment.statusId = custPayment.statusId;
    this.customerPayment.postedDate = new Date(custPayment.postedDate);
    this.customerPayment.memo = custPayment.memo;
    this.customerPayment.managementStructureId = custPayment.managementStructureId;
    this.customerPayment.employeeId = getObjectById(
      "value",
      custPayment.employeeId,
      this.allEmployeeList
    );
  }

  getNewSalesOrderInstance(customerId: number, initialCall = false) {
    this.customerPayment.receiptNo = "Creating";
    this.customerPayment.statusId = getObjectByValue('label', 'Open', this.statusList).value; // Open status by default
    
    // this.salesOrderService
    //   .getNewSalesOrderInstance(customerId)
    //   .subscribe(data => {
    //     this.salesQuote = data && data.length ? data[0] : null;

    //     this.load(this.managementStructureId);
    //     if (this.salesQuote) {
    //       this.status = this.salesQuote.status && this.salesQuote.status.length > 0 ? this.salesQuote.status.slice(0) : [];
    //     }
    //     this.salesQuote.shippedDate = null;
    //     this.salesQuote.openDate = new Date();
    //     this.salesQuote.statusId = 1;
    //     this.salesQuote.validForDays = 10;
    //     this.salesQuote.quoteExpiryDate = new Date();
    //     this.onChangeValidForDays();
    //     this.salesQuote.employeeName = getObjectById(
    //       "value",
    //       this.employeeId,
    //       this.allEmployeeList
    //     );
    //     this.salesQuote.salesOrderNumber = "Generating";
    //     this.getInitialDataForSO();
    //     this.isSpinnerVisible = false;
    //   }, error => {
    //     this.isSpinnerVisible = false;
    //   });
  }

  onChangeValidForDays() {
    let od = new Date(this.customerPayment.openDate);
    let validForDays = +this.customerPayment.validForDays;
    let ed = new Date(this.customerPayment.openDate);
    ed.setDate(od.getDate() + validForDays);
    this.customerPayment.quoteExpiryDate = ed;
  }

  onChangeOpenDate() {
    let od = new Date(this.customerPayment.openDate);
    let validForDays = +this.customerPayment.validForDays;
    let ed = new Date(this.customerPayment.openDate);
    ed.setDate(od.getDate() + validForDays);
    this.customerPayment.quoteExpiryDate = ed;
    this.enableUpdateButton = false;
  }

  viewSelectedRow() {
    this.modal = this.modalService.open(CustomerViewComponent, { size: "lg", backdrop: 'static', keyboard: false });
    this.modal.componentInstance.customerId = this.customerId;
  }

  setValidDaysBasedOnSettings(isEditMode) {
    // if (this.soSettingsList.length > 0) {
    //   let settingsObject = this.soSettingsList[0];

    //   if (settingsObject) {
    //     if (!isEditMode) {
    //       this.salesQuote.quoteTypeId = settingsObject.typeId;
    //       this.salesQuote.statusId = settingsObject.defaultStatusId;
    //       this.salesQuote.statusName = settingsObject.defaultStatusName;
    //     }
    //     this.defaultSettingPriority = settingsObject.defaultPriorityId;
    //   } else {
    //     if (this.soTypeList.length > 0) {
    //       this.salesQuote.quoteTypeId = this.soTypeList[0].value;
    //     }
    //   }
    // } else {
    //   if (this.soTypeList.length > 0) {
    //     this.salesQuote.quoteTypeId = this.soTypeList[0].value;
    //   }
    // }
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
    this.enableUpdateButton = false;
  }

  closeErrorMessage() {
    this.errorModal.close();
  }

  onSubmit(submitType: Boolean, createNewVersion: boolean = false) {
    this.errorMessages = [];
    let haveError = false;
    // if (this.customerPayment.quoteTypeId <= 0) {
    //   this.errorMessages.push("Please select Type");
    //   haveError = true;
    // }
    // if (!this.customerPayment.openDate) {
    //   this.errorMessages.push("Please select Open Date");
    //   haveError = true;
    // }
    // if (!this.customerPayment.creditLimit) {
    //   this.errorMessages.push("Please select Credit Limit");
    //   haveError = true;
    // }
    // if (!this.customerPayment.creditLimitTermsId) {
    //   this.errorMessages.push("Please select Credit Terms");
    //   haveError = true;
    // }
    // if (this.customerPayment.accountTypeId <= 0) {
    //   this.errorMessages.push("Please select Account Type");
    //   haveError = true;
    // }
    // if (this.customerPayment.customerContactId < 0) {
    //   this.errorMessages.push("Please select Customer Contact");
    //   haveError = true;
    // }
    // if (!this.customerPayment.employeeId) {
    //   this.errorMessages.push("Please select employee");
    //   haveError = true;
    // }

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

      // for (let i = 0; i < this.selectedParts.length; i++) {
      //   let selectedPart = this.selectedParts[i];
      //   var errmessage = '';
      //   if (!selectedPart.customerRequestDate) {
      //     this.isSpinnerVisible = false;
      //     invalidParts = true;
      //     errmessage = errmessage + '<br />' + "Please enter Customer Request Date."
      //   }
      //   if (!selectedPart.estimatedShipDate) {
      //     this.isSpinnerVisible = false;
      //     invalidParts = true;
      //     errmessage = errmessage + '<br />' + "Please enter Estimated Ship Date."
      //   }
      //   if (!selectedPart.promisedDate) {
      //     this.isSpinnerVisible = false;
      //     invalidParts = true;
      //     errmessage = errmessage + '<br />' + "Please enter Promised Date."
      //   }
      //   if (!selectedPart.priorityId) {
      //     this.isSpinnerVisible = false;
      //     invalidParts = true;
      //     errmessage = errmessage + '<br />' + "Please enter priority ID."
      //   }
      //   if (selectedPart.customerRequestDate && selectedPart.promisedDate && selectedPart.estimatedShipDate) {
      //     if (selectedPart.customerRequestDate < this.salesQuote.openDate ||
      //       selectedPart.estimatedShipDate < this.salesQuote.openDate ||
      //       selectedPart.promisedDate < this.salesQuote.openDate) {
      //       invalidDate = true;
      //     }
      //   }
      //   if (!invalidDate && !invalidParts) {
      //     let partNumberObj = this.salesOrderService.marshalSOPartToSave(selectedPart, this.userName);
      //     partList.push(partNumberObj);
      //   }
      // }

      // this.salesOrderView.parts = partList;
      // this.marginSummary = this.salesQuoteService.getSalesQuoteHeaderMarginDetails(this.salesOrderView.parts, this.marginSummary);

      if (this.id) {
        this.isCreateModeHeader = false;
        //   if (invalidParts) {
        //     this.isSpinnerVisible = false;
        //     this.alertService.resetStickyMessage();
        //     this.alertService.showStickyMessage('Sales Order', errmessage, MessageSeverity.error);
        //   } else if (invalidDate) {
        //     this.isSpinnerVisible = false;
        //     this.alertService.resetStickyMessage();
        //     this.alertService.showStickyMessage('Sales Order', "Please select valid Dates for Sales Order PartsList!", MessageSeverity.error);
        //   } else {
        //     this.marginSummary.salesOrderId = this.id;
        //     this.salesOrderService.createSOMarginSummary(this.marginSummary).subscribe(result => {
        //       this.marginSummary.soMarginSummaryId = result;
        //     });
        //     this.salesOrderService.update(this.salesOrderView).subscribe(data => {
        //       this.isSpinnerVisible = false;
        //       this.alertService.showMessage(
        //         "Success",
        //         `Sales Order updated successfully.`,
        //         MessageSeverity.success
        //       );
        //       this.getSalesOrderInstance(this.id, true);
        //       if (createNewVersion) {
        //         this.router.navigateByUrl(`salesmodule/salespages/sales-order-list`);
        //       }
        //       this.toggle_po_header = false;
        //       if (this.isEdit) {
        //         this.isCreateModeHeader = false;
        //       }
        //       this.enableUpdateButton = true;
        //     }, error => {
        //       this.isSpinnerVisible = false;
        //       this.toggle_po_header = true;
        //     });
        //   }
      } else {
        this.customerPaymentsService.create(this.salesOrder).subscribe(data => {
          let receiptId = data[0].receiptId;
          this.isCreateModeHeader = true;
          this.isHeaderSubmit = true;
          this.isSpinnerVisible = false;
          this.alertService.showMessage(
            "Success",
            `Payment Header Information updated successfully`,
            MessageSeverity.success
          );
          this.toggle_po_header = false;
          this.id = this.salesCreateHeaderOrderId;
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

  public onPartsApprovedEvent(): void {
    this.selectedParts = [];
    this.getSalesOrderInstance(this.id);
  }

  dismissModel() {
    this.modal.close();
  }

  quote: any = {
    quoteTypeId: null,
    quoteDate: Date
  };

  openConfirmationModal(submitType: boolean) {
    this.submitType = submitType;
    this.modal = this.modalService.open(this.updateConfirmationModal, { size: "sm", backdrop: 'static', keyboard: false });
  }

  closeConfirmationModal() {
    if (this.modal) {
      this.modal.close();
    }
  }

  createNewSalesOrderQuoteVersion() {
    this.closeConfirmationModal();
    this.onSubmit(this.submitType, true);
  }

  updateSalesOrderQuote() {
    this.closeConfirmationModal();
    this.onSubmit(this.submitType, false);
  }

  onTabChange(event) {
    // if (event.index == 0) {
    //   this.salesOrderPartNumberComponent.refresh();
    // }
    // if (event.index == 1) {
    //   this.salesOrderApproveComponent.refresh(this.marginSummary);
    // }
    // if (event.index == 2) {
    //   this.salesOrderCustomerApprovalComponent.refresh(this.marginSummary, this.salesOrderView.salesOrder.salesOrderId, this.salesOrderView.salesOrder.salesOrderQuoteId);
    // }
    // if (event.index == 3) {
    //   this.showAddresstab = true;
    // }
    // if (event.index == 4) {
    //   if (this.salesQuote.status == "Open" || this.salesQuote.status == "Partially Approved") {
    //     this.salesOrderFreightComponent.refresh(false);
    //   } else {
    //     this.salesOrderFreightComponent.refresh(true);
    //   }
    // }
    // if (event.index == 5) {
    //   if (this.salesQuote.statusName == "Open" || this.salesQuote.statusName == "Partially Approved") {
    //     this.salesOrderChargesComponent.refresh(false);
    //   } else {
    //     this.salesOrderChargesComponent.refresh(true);
    //   }
    // }
    // if (event.index == 6) {
    //   this.salesOrderPickTicketsComponent.refresh(this.id);
    // }
    // if (event.index == 7) {
    //   this.salesOrderShippingComponent.refresh(this.selectedParts);
    // }
    // if (event.index == 8) {
    //   this.salesOrderBillingComponent.refresh(this.id); //(this.selectedParts);
    // }
    // if (event.index == 10) {
    //   this.salesOrderAnalysisComponent.refresh(this.id);
    // }
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
    this.enableUpdateButton = false;
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
}