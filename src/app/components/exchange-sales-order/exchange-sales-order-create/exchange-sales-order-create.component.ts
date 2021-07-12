import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import {
  NgForm,
  FormGroup
} from "@angular/forms";
import { CustomerSearchQuery } from "../../sales/order/models/customer-search-query";
import { CustomerService } from "../../../services/customer.service";
import { Customer } from "../../../models/customer.model";
import { AlertService, MessageSeverity } from "../../../services/alert.service";
import { ActivatedRoute } from "@angular/router";
import { SalesQuoteService } from "../../../services/salesquote.service";
import { SalesOrderService } from "../../../services/salesorder.service";
import { ExchangeSalesOrderService } from "../../../services/exchangesalesorder.service";
import { ExchangequoteService } from "../../../services/exchangequote.service";
//import { ISalesOrder } from "../../../models/sales/ISalesOrder.model";
import { IExchangeSalesOrder } from "../../../models/exchange/IExchangeSalesOrder.model";
//import { SalesOrder } from "../../../models/sales/SalesOrder.model";
import { ExchangeSalesOrder } from "../../../models/exchange/ExchangeSalesOrder.model";
//import { ISalesOrderQuote } from "../../../models/sales/ISalesOrderQuote";
import { IExchangeOrderQuote } from "../../../models/exchange/IExchangeOrderQuote";
//import { ISalesQuoteView } from "../../../models/sales/ISalesQuoteView";
import { IExchangeQuoteView } from "../../../models/exchange/IExchangeQuoteView";
//import { ISalesOrderView } from "../../../models/sales/ISalesOrderView";
import { IExchangeSalesOrderView } from "../../../models/exchange/IExchangeSalesOrderView";
//import { SalesOrderView } from "../../../models/sales/SalesOrderView";
import { ExchangeSalesOrderView } from "../../../models/exchange/ExchangeSalesOrderView";
import { CommonService } from "../../../services/common.service";
import { CurrencyService } from "../../../services/currency.service";
import { EmployeeService } from "../../../services/employee.service";
import { AuthService } from "../../../services/auth.service";
import { Router } from "@angular/router";
import {
  getObjectById,
  editValueAssignByCondition,
  getValueFromArrayOfObjectById,
} from "../../../generic/autocomplete";
import {
  NgbModal,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
import { CustomerViewComponent } from "../../../shared/components/customer/customer-view/customer-view.component";
import { PartDetail } from "../shared/models/part-detail";
//import { ManagementStructureComponent } from "../quotes/shared/components/management-structure/management-structure.component";
import { ManagementStructureComponent } from "../../sales/quotes/shared/components/management-structure/management-structure.component";
import { SalesAddressComponent } from "../../sales/quotes/shared/components/sales-address/sales-address.component";
import { DBkeys } from "../../../services/db-Keys";
import { IStatus } from "../../../models/sales/IStatus";
import { SalesOrderActionType } from "../../sales/sales-order-actions-emuns";
import { SalesOrderConfirmationType } from "../../sales/sales-confirmation-type.enum";
//import { SalesOrderConfirmationModalComponent } from "../../sales/order/sales-order-confirmation-modal/sales-order-confirmation-modal.compoent";
import { SalesOrderEventArgs } from "../../sales/sales-order-event-args";
import { ISalesOrderCopyParameters } from "../../sales/order/models/isalesorder-copy-parameters";
import { MarginSummary } from "../../../models/sales/MarginSummaryForSalesorder";
import { SalesOrderApproveComponent } from "../../sales/order/shared/components/sales-approve/sales-approve.component";
import { SalesOrderCustomerApprovalComponent } from "../../sales/order/shared/components/sales-order-customer-approval/sales-order-customer-approval.component";
import { forkJoin } from "rxjs/observable/forkJoin";
import { ExchangeSalesOrderFreightComponent } from "../shared/components/exchange-sales-order-freight/exchange-sales-order-freight.component";
import { ExchangeSalesOrderChargesComponent } from "../shared/components/exchange-sales-order-charges/exchange-sales-order-charges.component";
// import { SalesOrderPartNumberComponent } from "../../sales/order/shared/components/sales-order-part-number/sales-order-part-number.component";
import { ExchangeSalesOrderBillingComponent } from "../shared/components/exchange-sales-order-billing/exchange-sales-order-billing.component";
// import { SalesOrderAnalysisComponent } from "../../sales/order/sales-order-analysis/sales-order-analysis.component";
 import { ExchangeSalesOrderShippingComponent } from "../shared/components/exchange-sales-order-shipping/exchange-sales-order-shipping.component";
// import { SalesOrderPickTicketsComponent } from "../../sales/order/sales-order-pick-tickets/sales-order-pick-tickets.component";
import { ExchangeSalesOrderPartNumberComponent } from '../shared/components/exchange-sales-order-part-number/exchange-sales-order-part-number.component';
import { ExchangeSalesOrderPickTicketsComponent } from '../shared/components/exchange-sales-order-pick-tickets/exchange-sales-order-pick-tickets.component';
@Component({
  selector: 'app-exchange-sales-order-create',
  templateUrl: './exchange-sales-order-create.component.html',
  styleUrls: ['./exchange-sales-order-create.component.scss']
})
export class ExchangeSalesOrderCreateComponent implements OnInit {
  SalesOrderId: any;
  salesCreateHeaderOrderId: number;
  query: CustomerSearchQuery;
  customers: Customer[];
  totalRecords: number = 0;
  totalPages: number = 0;
  showPaginator: boolean = false;
  customerId: number;
  salesQuote: any = {};
  defaultSettingPriority;
  soSettingsList: any = [];
  //salesOrder: ISalesOrder;
  salesOrder: IExchangeSalesOrder;
  customerDetails: any;
  salesOrderQuote: IExchangeSalesOrder;
  enableUpdateButton = true;
  salesOrderQuoteObj: IExchangeSalesOrder;
  salesOrderObj: IExchangeSalesOrder;
  salesQuoteView: IExchangeQuoteView;
  salesOrderView: IExchangeSalesOrderView;
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
  marginSummary: MarginSummary = new MarginSummary();
  @ViewChild("newSalesOrderForm", { static: false }) public newSalesOrderForm: NgForm;
  @ViewChild("errorMessagePop", { static: false }) public errorMessagePop: ElementRef;
  @ViewChild("newSalesQuoteForm", { static: false }) public newSalesQuoteForm: NgForm;
  @ViewChild("salesOrderPrintPopup", { static: false }) public salesOrderPrintPopup: ElementRef;
  employeesList: any = [];
  customerWarning: any = {};
  status: IStatus[] = [];
  freight = [];
  charge = [];
  @Input() salesQuoteId: number = 0;
  @ViewChild(ExchangeSalesOrderPartNumberComponent, { static: false }) public exchangeSalesOrderPartNumberComponent: ExchangeSalesOrderPartNumberComponent;
  @ViewChild(ExchangeSalesOrderPickTicketsComponent, { static: false }) public exchangeSalesOrderPickTicketsComponent: ExchangeSalesOrderPickTicketsComponent;
  // @ViewChild(SalesOrderApproveComponent, { static: false }) public salesOrderApproveComponent: SalesOrderApproveComponent;
  // @ViewChild(SalesOrderCustomerApprovalComponent, { static: false }) public salesOrderCustomerApprovalComponent: SalesOrderCustomerApprovalComponent;
  @ViewChild(ExchangeSalesOrderShippingComponent, { static: false }) public exchangeSalesOrderShippingComponent: ExchangeSalesOrderShippingComponent;
  @ViewChild(ExchangeSalesOrderFreightComponent, { static: false }) public exchangeSalesOrderFreightComponent: ExchangeSalesOrderFreightComponent;
  @ViewChild(ExchangeSalesOrderChargesComponent, { static: false }) public exchangeSalesOrderChargesComponent: ExchangeSalesOrderChargesComponent;
  @ViewChild(ExchangeSalesOrderBillingComponent, { static: false }) public exchangeSalesOrderBillingComponent: ExchangeSalesOrderBillingComponent;
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
  moduleName: any = "ExchangeSalesOrder";
  soStatusList: any = [];
  soTypeList: any = [];
  addressType: any = 'ExchSO';
  showAddresstab: boolean = false;
  isContactsLoaded: boolean = false;
  todayDate: Date = new Date();
  constructor(private customerService: CustomerService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private salesQuoteService: SalesQuoteService,
    private salesOrderService: SalesOrderService,
    private exchangeSalesOrderService: ExchangeSalesOrderService,
    private exchangequoteService: ExchangequoteService,
    private commonservice: CommonService,
    public currencyService: CurrencyService,
    public employeeService: EmployeeService,
    private authService: AuthService,
    public router: Router,
    private modalService: NgbModal) {
    this.salesOrderCopyParameters = null;
    this.copyMode = false;
    this.copy = null;
  }

  ngOnInit() {
    this.loadSOStatus();
    //this.loadSOType();

    this.controlSettings.showViewQuote = false;
    this.customerId = +this.route.snapshot.paramMap.get("customerId");
    this.id = +this.route.snapshot.paramMap.get("id");
    this.SalesOrderId = this.id;
    this.route.queryParams.subscribe(params => {
      this.copyMode = params["cp"] && params['cia'];
      if (this.copyMode) {
        this.salesOrderCopyParameters = {
          copyParts: params['cp'] === 'true',
          copyInternalApprovals: params['cia'] === 'true',
          customerId: this.customerId,
          salesOrderId: this.id
        }
      }
    });

    this.exchangequoteService.resetSalesOrderQuote();

    this.exchangequoteService.getSalesOrderQuteInstance().subscribe(data => {
      this.salesOrderQuote = data;
    });

    this.exchangequoteService.getSelectedParts().subscribe(data => {
      this.selectedParts = data;
      //this.marginSummary = this.salesQuoteService.getSalesQuoteHeaderMarginDetails(this.selectedParts, this.marginSummary);
    });

    this.managementStructureId = this.currentUserManagementStructureId;

    if (!this.isEdit) {
      this.load(this.managementStructureId);
    }

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
    let creditLimitTermsId = this.salesQuote.creditLimitTermsId ? this.salesQuote.creditLimitTermsId : 0;
    let accountTypeId = this.salesQuote.accountTypeId ? this.salesQuote.accountTypeId : 0;
    let warningTypeId = 0;
    this.isSpinnerVisible = true;

    forkJoin(this.customerService.getCustomerCommonDataWithContactsById(this.customerId, this.salesQuote.customerContactId),
      this.commonservice.getCSRAndSalesPersonOrAgentList(this.currentUserManagementStructureId, this.customerId, this.salesQuote.customerServiceRepId, this.salesQuote.salesPersonId),
      this.commonservice.autoSuggestionSmartDropDownList('CustomerWarningType', 'CustomerWarningTypeId', 'Name', '', true, 0, [warningTypeId].join(), 0),
      this.commonservice.autoSuggestionSmartDropDownList('CustomerType', 'CustomerTypeId', 'Description', '', true, 100, [accountTypeId].join(), this.masterCompanyId),
      this.commonservice.autoSuggestionSmartDropDownList("CreditTerms", "CreditTermsId", "Name", '', true, 200, [creditLimitTermsId].join(), this.masterCompanyId),
      this.exchangeSalesOrderService.getAllExchangeSalesOrderSettings(this.masterCompanyId)).subscribe(result => {
        this.isSpinnerVisible = false;
        this.setAllCustomerContact(result[0]);
        this.setJobTitles(result[1]);
        let settingList: any = result[5];
        if (settingList && settingList.length > 0) {
          this.soSettingsList = settingList;
        }
        this.customerDetails = result[0];
        this.getCustomerDetails();
        this.setTypesOfWarnings(result[2]);
        this.setAccountTypes(result[3]);
        this.setCreditTerms(result[4]);
        this.getDefaultContact();
      }, error => {
        this.isSpinnerVisible = false;
      });
  }
  getSOMarginSummary() {
    this.isSpinnerVisible = true;
    this.salesOrderService.getSOMarginSummary(this.id).subscribe(result => {
      if (result) {
        let summary: any = result;
        this.marginSummary = summary;
        this.totalCharges = this.marginSummary.misc;
        this.totalFreights = this.marginSummary.freightAmount;
        this.salesOrderService.setTotalFreights(this.marginSummary.freightAmount);
        this.salesOrderService.setTotalCharges(this.marginSummary.misc);
      } else {
        this.marginSummary = new MarginSummary();
      }
      this.isSpinnerVisible = false;
    }, err => {
      this.isSpinnerVisible = false;
    })
  }

  getSoInstance(initialCall = false) {
    // if (this.copyMode) {
    //   this.getNewSalesOrderInstance(this.customerId);
    //   this.copySalesOrderInstance(this.salesOrderCopyParameters.salesOrderId);
    // }
    if (this.id) {
      this.getSalesOrderInstance(this.id, initialCall);
      //this.getSOMarginSummary();
      this.isEdit = true;
      this.toggle_po_header = false;
    } else if (this.salesOrderView) {
      this.salesQuote = this.salesOrderView.salesOrder
      this.commonSalesOrderInstanceForConvertAndEdit(this.salesOrderView);
      //this.getSOMarginSummary();
    }
    else {
      this.getNewSalesOrderInstance(this.customerId);
      this.marginSummary = new MarginSummary();
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

  setTypesOfWarnings(warningsData) {
    if (warningsData.length > 0) {
      warningsData.filter(i => {
        if (i.label == DBkeys.GLOBAL_CUSTOMER_WARNING_TYOE_FOR_SALES_ORDER) {
          this.getCustomerWarningsData(i.value)
        }
      })
    }
  }

  getCustomerWarningsData(customerWarningListId: number) {
    this.isSpinnerVisible = true;
    this.customerService
      .getCustomerWarningsByCustomerIdandCustomerWarningsListID(this.customerId, customerWarningListId)
      .subscribe(res => {
        this.customerWarning = res;
        if (this.customerWarning && this.customerWarning.customerWarningId) {
          this.salesQuote.warningId = this.customerWarning.customerWarningId
          this.salesQuote.customerWarningId = this.customerWarning.customerWarningId;
        }
        this.isSpinnerVisible = false;
      }, error => {
        this.isSpinnerVisible = false;
      });
  }

  setCreditTerms(creditTerms) {
    this.creditTerms = creditTerms;
  }

  setAccountTypes(responseData) {
    this.accountTypes = responseData;
  }

  filterfirstName(event) {
    if (event.query !== undefined && event.query !== null) {
      this.employeedata(event.query, this.salesQuote.managementStructureId);
    }
    this.enableUpdateButton = false;
  }

  filtercsrFirstName(event) {
    this.csrFirstCollection = this.csrOriginalList;

    const CSRData = [
      ...this.csrOriginalList.filter(x => {
        return x.name.toLowerCase().includes(event.query.toLowerCase());
      })
    ];
    this.csrFirstCollection = CSRData;
    this.enableUpdateButton = false;
  }

  filterSalesFirstName(event) {
    this.salesFirstCollection = this.salesPersonAndAgentOriginalList;
    const employeeListData = [
      ...this.salesPersonAndAgentOriginalList.filter(x => {
        return x.name.toLowerCase().includes(event.query.toLowerCase());
      })
    ];
    this.salesFirstCollection = employeeListData;
    this.enableUpdateButton = false;
  }

  async setJobTitles(res) {
    this.csrOriginalList = res.csrEmpList;
    this.salesPersonAndAgentOriginalList = res.salesEmpList;
  }

  setCSR() {
    if (this.isEdit && this.salesOrderObj.customerSeviceRepId && this.salesOrderObj.customerSeviceRepId != 0) {
      this.salesQuote.customerServiceRepName = getObjectById(
        "employeeId",
        this.salesOrderObj.customerSeviceRepId,
        this.csrOriginalList
      );
    } else if (this.customerDetails && this.customerDetails.csrId) {
      this.salesQuote.customerServiceRepName = getObjectById(
        "employeeId",
        this.customerDetails.csrId,
        this.csrOriginalList
      );
    }
  }

  setSalesPerson() {
    if (this.isEdit && this.salesOrderObj.salesPersonId && this.salesOrderObj.salesPersonId != 0) {
      this.salesQuote.salesPersonName = getObjectById(
        "employeeId",
        this.salesOrderObj.salesPersonId,
        this.salesPersonAndAgentOriginalList
      );
    } else if (this.customerDetails && this.customerDetails.primarySalesPersonId) {
      this.salesQuote.salesPersonName = getObjectById(
        "employeeId",
        this.customerDetails.primarySalesPersonId,
        this.salesPersonAndAgentOriginalList
      );
    }
  }

  filterNames(event) {
    this.customerNames = [];
    if (this.allCustomer) {
      if (this.allCustomer.length > 0) {
        for (let i = 0; i < this.allCustomer.length; i++) {
          let name = this.allCustomer[i].name;
          if (name.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
            this.customerNames.push(name);
          }
        }
      }
    }
  }

  getCustomerDetails() {
    this.salesQuote.customerId = this.customerId;
    this.salesQuote.customerName = this.customerDetails.name;
    this.salesQuote.customerEmail = this.customerDetails.email;
    this.salesQuote.customerCode = this.customerDetails.customerCode;
    this.salesQuote.creditLimit = this.customerDetails.creditLimit;
    this.salesQuote.creditLimitTermsId = this.customerDetails.creditTermsId;
    this.customerInfoFromSalesQuote = {
      customerName: this.customerDetails.name,
      customerCode: this.customerDetails.customerCode,
      customerId: this.customerDetails.customerId
    }

    if (!this.id) {
      this.salesQuote.contractReferenceName = this.customerDetails.contractReference;
      this.salesQuote.restrictPMA = this.customerDetails.restrictPMA;
      this.salesQuote.restrictDER = this.customerDetails.restrictDER;
      this.salesQuote.accountTypeId = this.customerDetails.customerTypeId;
      this.setValidDaysBasedOnSettings(false);
    }
    else {
      this.setValidDaysBasedOnSettings(true);
    }

    this.setSalesPerson();
    this.setCSR();
  }

  getDefaultContact() {
    if (this.customerContactList) {
      if (this.customerContactList.length > 0) {
        for (let i = 0; i < this.customerContactList.length; i++) {
          let isDefaultContact = this.customerContactList[i].isDefaultContact;
          if (isDefaultContact) {
            this.salesQuote.customerContactId = this.customerContactList[
              i
            ].contactId;
          }
        }
      }
    }

    this.isContactsLoaded = true;
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
      //partNumberObj.salesOrderPartId = selectedPart.salesOrderPartId;
      partNumberObj.exchangeSalesOrderId = selectedPart.exchangeSalesOrderId;
      partNumberObj.markupExtended = selectedPart.markupExtended;
      partNumberObj.method = selectedPart.method;
      partNumberObj.methodType = selectedPart.methodType;
      partNumberObj.serialNumber = selectedPart.serialNumber;
      partNumberObj.marginAmountExtended = selectedPart.marginAmountExtended;
      partNumberObj.marginPercentagePerUnit = selectedPart.marginPercentage;
      partNumberObj.markupExtended = selectedPart.markupExtended;
      partNumberObj.unitCostPerUnit = selectedPart.unitCost;
      partNumberObj.unitCostExtended = selectedPart.unitCostExtended;
      partNumberObj.exchangeQuoteId = selectedPart.exchangeQuoteId
      partNumberObj.exchangeSalesOrderPartId = selectedPart.exchangeSalesOrderPartId;
      this.selectedParts.push(partNumberObj);
    }
    this.salesQuote.managementStructureId = this.salesOrderObj.managementStructureId;
    this.managementStructureId = this.salesOrderObj.managementStructureId;
    this.salesQuote.priorities = this.salesOrderView.priorities;
    this.salesQuote.leadSources = this.salesOrderView.leadSources;
    this.status = this.salesOrderView.status && this.salesOrderView.status.length > 0 ? this.salesOrderView.status.slice(0) : [];
    this.salesQuote.exchangeQuoteId = this.salesOrderObj.exchangeQuoteId;
    this.salesQuote.quoteTypeId = this.salesOrderObj.typeId;
    this.salesQuote.statusId = this.salesOrderObj.statusId;
    this.salesQuote.statusChangeDate = null;
    this.salesQuote.openDate = new Date(this.salesOrderObj.openDate);
    this.salesQuote.numberOfItems = this.salesOrderObj.numberOfItems;
    this.salesQuote.exchangeSalesOrderNumber = this.salesOrderObj.exchangeSalesOrderNumber;
    this.salesQuote.accountTypeId = this.salesOrderObj.accountTypeId;
    this.salesQuote.customerId = this.salesOrderObj.customerId;
    this.salesQuote.customerContactId = this.salesOrderObj.customerContactId;
    this.salesQuote.customerReferenceName = this.salesOrderObj.customerReference;
    this.salesQuote.quoteApprovedById = this.salesOrderObj.approvedById;
    this.salesQuote.totalSalesAmount = this.salesOrderObj.totalSalesAmount;
    this.salesQuote.customerHold = this.salesOrderObj.customerHold;
    this.salesQuote.depositAmount = this.salesOrderObj.depositAmount;
    this.salesQuote.balanceDue = this.salesOrderObj.balanceDue;
    this.salesQuote.employeeName = getObjectById(
      "value",
      this.salesOrderObj.employeeId,
      this.allEmployeeList
    );

    this.salesOrderQuote.managementStructureId = this.salesOrderObj.managementStructureId;
    this.salesOrderQuote.exchangeQuoteId = this.salesOrderObj.exchangeQuoteId;
    this.salesQuote.creditLimit = this.salesOrderObj.creditLimit;
    this.salesQuote.creditLimitTermsId = this.salesOrderObj.creditTermId;
    this.salesQuote.restrictPMA = this.salesOrderObj.restrictPMA;
    this.salesQuote.restrictDER = this.salesOrderObj.restrictDER;
    if (this.salesOrderObj.approvedDate)
      this.salesQuote.approvedDate = new Date(
        this.salesOrderObj.approvedDate
      );
    this.salesQuote.currencyId = this.salesOrderObj.currencyId;
    this.salesQuote.warningId = this.salesOrderObj.customerWarningId;
    this.salesQuote.memo = this.salesOrderObj.memo;
    this.salesQuote.notes = this.salesOrderObj.notes;
  }

  getSalesOrderInstance(salesOrderId: number, initialCall = false) {
    this.isSpinnerVisible = true;
    this.exchangeSalesOrderService.getSalesOrder(salesOrderId).subscribe(data => {
      this.isSpinnerVisible = false;
      if (data) {
        this.salesOrderView = data && data.length ? data[0] : null;
        this.bindData(this.salesOrderView, initialCall);
      }
    }, error => {
      this.isSpinnerVisible = false;
    });
  }

  // copySalesOrderInstance(salesOrderId: number) {
  //   this.isSpinnerVisible = true;
  //   this.salesOrderService.copy(salesOrderId).subscribe(data => {
  //     this.getSOMarginSummary();
  //     this.load(this.managementStructureId);
  //     //this.salesOrderView = data && data.length ? data[0] : null;
  //     if (this.salesOrderCopyParameters) {
  //       if (!this.salesOrderCopyParameters.copyParts) {
  //         this.salesOrderView.parts = [];
  //       }
  //     }
  //     this.bindData(this.salesOrderView);
  //     this.isSpinnerVisible = false;
  //   }, error => {
  //     this.isSpinnerVisible = false;
  //   });
  // }

  bindData(salesOrderView: IExchangeSalesOrderView, initialCall = false) {
    this.salesOrderObj = salesOrderView.salesOrder;

    if (this.salesOrderObj && this.salesOrderObj.exchangeQuoteId && this.salesOrderObj.exchangeQuoteId) {
      this.controlSettings.showViewQuote = true;
    }

    let partList: any[] = this.salesOrderView.parts;

    if (this.selectedParts.length > 0)
      this.selectedParts = [];

    // for (let i = 0; i < partList.length; i++) {
    //   let selectedPart = partList[i];
    //   //let partNumberObj = this.exchangeSalesOrderService.marshalExchangeSalesOrderPartToView(selectedPart, this.salesOrderObj);
    //   let partNumberObj = this.exchangeSalesOrderService.marshalExchangeSalesOrderPartToView(selectedPart);
    //   this.selectedParts.push(partNumberObj);
    //   this.exchangeSalesOrderService.selectedParts = selectedPart;
    // }
    for (let i = 0; i < partList.length; i++) {
      let selectedPart = partList[i];
      let partNumberObj = this.exchangeSalesOrderService.marshalExchangeSalesOrderPartToView(selectedPart);
      const selectedPartsTemp = this.selectedParts;
      selectedPartsTemp.push(partNumberObj)
      this.exchangeSalesOrderService.selectedParts = selectedPartsTemp;
    }
    //this.marginSummary = this.salesQuoteService.getSalesQuoteHeaderMarginDetails(this.selectedParts, this.marginSummary);

    if (this.exchangeSalesOrderPartNumberComponent) {
      this.exchangeSalesOrderPartNumberComponent.refresh();
    }
    this.salesQuote.managementStructureId = this.salesOrderObj.managementStructureId;
    this.managementStructureId = this.salesOrderObj.managementStructureId;
    this.salesQuote.priorities = this.salesOrderView.priorities;
    this.salesQuote.leadSources = this.salesOrderView.leadSources;
    this.salesQuote.salesQuoteTypes = this.salesOrderObj.typeId && this.salesOrderObj.typeId > 0 ? getValueFromArrayOfObjectById('label', 'value', this.salesOrderObj.typeId, this.soTypeList) : '';
    this.salesQuote.status = this.salesOrderObj.statusId && this.salesOrderObj.statusId > 0 ? getValueFromArrayOfObjectById('label', 'value', this.salesOrderObj.statusId, this.soStatusList) : '';
    this.salesQuote.statusId = this.salesOrderObj.statusId;
    this.salesQuote.masterCompanyId = this.masterCompanyId;
    this.status = this.salesQuote.status && this.salesQuote.status.length > 0 ? this.salesQuote.status.slice(0) : [];
    this.salesQuote.exchangeQuoteId = this.salesOrderObj.exchangeQuoteId;
    this.salesQuote.quoteTypeId = this.salesOrderObj.typeId.toString();
    this.salesQuote.statusChangeDate = new Date(this.salesOrderObj.statusChangeDate);
    this.salesQuote.openDate = new Date(this.salesOrderObj.openDate);
    this.salesQuote.contractReferenceName = this.salesOrderObj.contractReference;
    this.salesQuote.versionNumber = this.salesOrderObj.salesOrderQuoteVersionNumber;;
    this.salesQuote.numberOfItems = this.salesOrderObj.numberOfItems;
    this.salesQuote.salesOrderNumber = this.salesOrderObj.exchangeSalesOrderNumber;
    this.salesQuote.accountTypeId = this.salesOrderObj.accountTypeId;
    this.salesQuote.customerId = this.salesOrderObj.customerId;
    this.salesQuote.customerContactId = this.salesOrderObj.customerContactId;
    this.salesQuote.customerReferenceName = this.salesOrderObj.customerReference;
    this.salesQuote.quoteApprovedById = this.salesOrderObj.approvedById;
    this.salesQuote.totalSalesAmount = this.salesOrderObj.totalSalesAmount;
    this.salesQuote.customerHold = this.salesOrderObj.customerHold;
    this.salesQuote.depositAmount = this.salesOrderObj.depositAmount;
    this.salesQuote.balanceDue = this.salesOrderObj.balanceDue;
    this.salesQuote.exchangeQuoteNumber = this.salesOrderObj.exchangeQuoteNumber;
    this.salesQuote.employeeId = getObjectById('value', this.salesOrderObj.employeeId, this.allEmployeeList);//this.salesOrderObj.employeeId;
    this.setSalesPerson();
    this.setCSR();
    this.salesQuote.employeeName = getObjectById(
      "value",
      this.salesOrderObj.employeeId,
      this.allEmployeeList
    );
    this.salesOrderQuote.managementStructureId = this.salesOrderObj.managementStructureId;
    this.salesOrderQuote.exchangeQuoteId = this.salesOrderObj.exchangeQuoteId;
    this.salesQuote.creditLimit = this.salesOrderObj.creditLimit;
    this.salesQuote.creditLimitTermsId = this.salesOrderObj.creditTermId;
    this.salesQuote.restrictPMA = this.salesOrderObj.restrictPMA;
    this.salesQuote.restrictDER = this.salesOrderObj.restrictDER;
    if (this.salesOrderObj.approvedDate)
      this.salesQuote.approvedDate = new Date(
        this.salesOrderObj.approvedDate
      );
    this.salesQuote.currencyId = this.salesOrderObj.currencyId;
    this.salesQuote.warningId = this.salesOrderObj.customerWarningId;
    this.salesQuote.memo = this.salesOrderObj.memo;
    this.salesQuote.notes = this.salesOrderObj.notes;
    this.salesQuote.exchangeQuoteNumber = this.salesOrderObj.exchangeQuoteNumber;
    this.salesQuote.statusName = this.salesOrderObj.statusName;
    this.salesQuote.isApproved = this.salesOrderObj.isApproved;
    this.salesQuote.companyId = this.salesOrderObj.masterCompanyId;
    this.salesQuote.buId = this.salesOrderObj.buId;
    this.salesQuote.divisionId = this.salesOrderObj.divisionId;
    this.salesQuote.departmentId = this.salesOrderObj.departmentId;
    this.salesQuote.customerServiceRepId = this.salesOrderObj.customerSeviceRepId;
    this.salesQuote.salesPersonId = this.salesOrderObj.salesPersonId;

    this.load(this.managementStructureId);
    if (initialCall) {
      this.getInitialDataForSO();
    }
  }

  getNewSalesOrderInstance(customerId: number) {
    this.isSpinnerVisible = true;
    this.exchangeSalesOrderService
      .getNewSalesOrderInstance(customerId)
      .subscribe(data => {
        this.salesQuote = data && data.length ? data[0] : null;
        this.salesQuote.quoteTypeId = "1";
        this.load(this.managementStructureId);
        if (this.salesQuote) {
          this.status = this.salesQuote.status && this.salesQuote.status.length > 0 ? this.salesQuote.status.slice(0) : [];
        }
        this.salesQuote.shippedDate = null;
        this.salesQuote.openDate = new Date();
        this.salesQuote.statusId = 1;
        this.salesQuote.validForDays = 10;
        this.salesQuote.quoteExpiryDate = new Date();
        this.onChangeValidForDays();
        this.salesQuote.employeeName = getObjectById(
          "value",
          this.employeeId,
          this.allEmployeeList
        );
        this.salesQuote.salesOrderNumber = "Generating";
        this.getInitialDataForSO();
        this.isSpinnerVisible = false;
      }, error => {
        this.isSpinnerVisible = false;
      });
  }

  onChangeValidForDays() {
    let od = new Date(this.salesQuote.openDate);
    let validForDays = +this.salesQuote.validForDays;
    let ed = new Date(this.salesQuote.openDate);
    ed.setDate(od.getDate() + validForDays);
    this.salesQuote.quoteExpiryDate = ed;
  }

  onChangeOpenDate() {
    let od = new Date(this.salesQuote.openDate);
    let validForDays = +this.salesQuote.validForDays;
    let ed = new Date(this.salesQuote.openDate);
    ed.setDate(od.getDate() + validForDays);
    this.salesQuote.quoteExpiryDate = ed;
    this.enableUpdateButton = false;
  }

  viewSelectedRow() {
    this.modal = this.modalService.open(CustomerViewComponent, { size: "lg", backdrop: 'static', keyboard: false });
    this.modal.componentInstance.customerId = this.customerId;
  }

  setValidDaysBasedOnSettings(isEditMode) {
    if (this.soSettingsList.length > 0) {
      let settingsObject = this.soSettingsList[0];

      if (settingsObject) {
        if (!isEditMode) {
          this.salesQuote.quoteTypeId = settingsObject.typeid.toString();
          this.salesQuote.statusId = settingsObject.defaultStatusId;
          this.salesQuote.statusName = settingsObject.defaultStatusName;
        }
        this.defaultSettingPriority = settingsObject.defaultPriorityId;
      } else {
        if (this.soTypeList.length > 0) {
          this.salesQuote.quoteTypeId = this.soTypeList[0].value;
        }
      }
    } else {
      if (this.soTypeList.length > 0) {
        this.salesQuote.quoteTypeId = this.soTypeList[0].value;
      }
    }
  }

  onAddDescription(value) {
    this.tempMemo = "";

    if (value == "notes") {
      this.tempMemoLabel = "Notes";
      this.tempMemo = this.salesQuote.notes;
    }
    if (value == "memo") {
      this.tempMemoLabel = "Memo";
      this.tempMemo = this.salesQuote.memo;
    }
  }

  onSaveDescription() {
    if (this.tempMemoLabel == "Notes") {
      this.salesQuote.notes = this.tempMemo;
    }
    if (this.tempMemoLabel == "Memo") {
      this.salesQuote.memo = this.tempMemo;
    }
    this.enableUpdateButton = false;
  }

  closeErrorMessage() {
    this.errorModal.close();
  }

  onSubmit(submitType: Boolean, createNewVersion: boolean = false) {
    this.errorMessages = [];
    let haveError = false;
    if (this.salesQuote.quoteTypeId <= 0) {
      this.errorMessages.push("Please select Type");
      haveError = true;
    }
    if (!this.salesQuote.openDate) {
      this.errorMessages.push("Please select Open Date");
      haveError = true;
    }
    if (!this.salesQuote.creditLimit) {
      this.errorMessages.push("Please select Credit Limit");
      haveError = true;
    }
    if (!this.salesQuote.creditLimitTermsId) {
      this.errorMessages.push("Please select Credit Terms");
      haveError = true;
    }
    if (this.salesQuote.accountTypeId <= 0) {
      this.errorMessages.push("Please select Account Type");
      haveError = true;
    }
    if (this.salesQuote.customerContactId < 0) {
      this.errorMessages.push("Please select Customer Contact");
      haveError = true;
    }
    if (!this.salesQuote.employeeId) {
      this.errorMessages.push("Please select employee");
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
      this.salesOrder = new ExchangeSalesOrder();
      this.salesOrder.exchangeSalesOrderId = this.id;
      this.salesOrder.typeId = this.salesQuote.quoteTypeId;
      this.salesOrder.openDate = this.salesQuote.openDate.toDateString();
      this.salesOrder.numberOfItems = this.salesQuote.numberOfItems;
      this.salesOrder.masterCompanyId = this.masterCompanyId;
      this.salesOrder.accountTypeId = this.salesQuote.accountTypeId;
      this.salesOrder.customerId = this.salesQuote.customerId;
      this.salesOrder.customerName = this.salesQuote.customerName;
      this.salesOrder.customerCode = this.salesQuote.customerCode;
      this.salesOrder.customerContactId = this.salesQuote.customerContactId;
      this.salesOrder.customerReference = this.salesQuote.customerReferenceName;
      this.salesOrder.customerReference = "SO";
      this.salesOrder.currencyId = this.salesQuote.currencyId;
      this.salesOrder.totalSalesAmount = this.salesQuote.totalSalesAmount;
      this.salesOrder.customerHold = this.salesQuote.customerHold;
      this.salesOrder.depositAmount = this.salesQuote.depositAmount;
      this.salesOrder.balanceDue = this.salesQuote.balanceDue;
      this.salesOrder.approvedById = this.salesQuote.quoteApprovedById;
      if (this.salesQuote.approvedDate) {
        this.salesOrder.approvedDate = this.salesQuote.approvedDate.toDateString();
      }
      this.salesOrder.priorityId = this.salesQuote.priorityId;
      this.salesOrder.managementStructureId = this.salesQuote.managementStructureId;
      this.salesOrder.creditLimit = this.salesQuote.creditLimit;
      this.salesOrder.creditTermId = this.salesQuote.creditLimitTermsId;
      this.salesOrder.restrictPMA = this.salesQuote.restrictPMA;
      this.salesOrder.restrictDER = this.salesQuote.restrictDER;
      if (this.customerWarning && this.customerWarning.customerWarningId) {
        this.salesOrder.customerWarningId = this.customerWarning.customerWarningId;
      } else {
        this.salesOrder.customerWarningId = this.salesQuote.warningId;
      }

      this.salesOrder.contractReference = this.salesQuote.contractReferenceName;

      this.salesOrder.salesPersonId = editValueAssignByCondition(
        "employeeId",
        this.salesQuote.salesPersonName
      );
      this.salesOrder.agentId = editValueAssignByCondition(
        "employeeId",
        this.salesQuote.agentId
      );
      this.salesOrder.agentName = editValueAssignByCondition(
        "name",
        this.salesQuote.agentId
      );
      this.salesOrder.customerSeviceRepId = editValueAssignByCondition(
        "employeeId",
        this.salesQuote.customerServiceRepName
      );
      this.salesOrder.employeeId = editValueAssignByCondition(
        "value",
        this.salesQuote.employeeId
      );

      if (this.id) {
        this.salesOrder.statusId = this.salesQuote.statusId;
        this.salesOrder.statusChangeDate = null;
      }

      this.salesOrderQuote.exchangeQuoteId = null;
      this.salesOrder.memo = this.salesQuote.memo;
      this.salesOrder.notes = this.salesQuote.notes;
      this.salesOrder.createdBy = this.userName;
      this.salesOrder.updatedBy = this.userName;
      this.salesOrder.createdOn = new Date().toDateString();
      this.salesOrder.updatedOn = new Date().toDateString();
      this.salesOrderView = new ExchangeSalesOrderView();

      if (this.salesQuote.exchangeQuoteId) {
        this.salesOrder.exchangeQuoteId = this.salesQuote.exchangeQuoteId;
      }

      this.salesOrderView.salesOrder = this.salesOrder;
      let partList: any = [];
      let invalidParts = false;
      let invalidDate = false;

      for (let i = 0; i < this.selectedParts.length; i++) {
        let selectedPart = this.selectedParts[i];
        var errmessage = '';
        if (!selectedPart.customerRequestDate) {
          this.isSpinnerVisible = false;
          invalidParts = true;
          errmessage = errmessage + '<br />' + "Please enter Customer Request Date."
        }
        if (!selectedPart.estimatedShipDate) {
          this.isSpinnerVisible = false;
          invalidParts = true;
          errmessage = errmessage + '<br />' + "Please enter Estimated Ship Date."
        }
        if (!selectedPart.promisedDate) {
          this.isSpinnerVisible = false;
          invalidParts = true;
          errmessage = errmessage + '<br />' + "Please enter Promised Date."
        }
        if (!selectedPart.priorityId) {
          this.isSpinnerVisible = false;
          invalidParts = true;
          errmessage = errmessage + '<br />' + "Please enter priority ID."
        }
        if (selectedPart.customerRequestDate && selectedPart.promisedDate && selectedPart.estimatedShipDate) {
          let crdate = new Date(Date.UTC(selectedPart.customerRequestDate.getUTCFullYear(), selectedPart.customerRequestDate.getUTCMonth(), selectedPart.customerRequestDate.getUTCDate()));
          let esdate = new Date(Date.UTC(selectedPart.estimatedShipDate.getUTCFullYear(), selectedPart.estimatedShipDate.getUTCMonth(), selectedPart.estimatedShipDate.getUTCDate()));
          let pdate = new Date(Date.UTC(selectedPart.promisedDate.getUTCFullYear(), selectedPart.promisedDate.getUTCMonth(), selectedPart.promisedDate.getUTCDate()));
          let opendate = new Date(Date.UTC(this.salesQuote.openDate.getUTCFullYear(), this.salesQuote.openDate.getUTCMonth(), this.salesQuote.openDate.getUTCDate()));

          if (crdate < opendate || esdate < opendate || pdate < opendate) {
            invalidDate = true;
            if (crdate < opendate) {
              this.isSpinnerVisible = false;
              invalidParts = true;
              errmessage = errmessage + '<br />PN - ' + selectedPart.partNumber;
              errmessage = errmessage + '<br />' + "Request Date cannot be less than open date."
            }
            if (esdate < opendate) {
              this.isSpinnerVisible = false;
              invalidParts = true;
              errmessage = errmessage + '<br />PN - ' + selectedPart.partNumber;
              errmessage = errmessage + '<br />' + "Est. Ship Date cannot be less than open date."
            }
            if (pdate < opendate) {
              this.isSpinnerVisible = false;
              invalidParts = true;
              errmessage = errmessage + '<br />PN - ' + selectedPart.partNumber;
              errmessage = errmessage + '<br />' + "Cust Prmsd Date cannot be less than open date."
            }
          }
        }
        if (!invalidDate && !invalidParts) {
          let partNumberObj = this.exchangeSalesOrderService.marshalExchangeSalesOrderPartToSave(selectedPart, this.userName);
          partList.push(partNumberObj);
        }
      }

      this.salesOrderView.parts = partList;
      //this.marginSummary = this.salesQuoteService.getSalesQuoteHeaderMarginDetails(this.salesOrderView.parts, this.marginSummary);

      if (this.id && !this.copyMode) {
        if (invalidParts) {
          this.isSpinnerVisible = false;
          this.alertService.resetStickyMessage();
          this.alertService.showStickyMessage('Sales Order', errmessage, MessageSeverity.error);
        } else if (invalidDate) {
          this.isSpinnerVisible = false;
          this.alertService.resetStickyMessage();
          this.alertService.showStickyMessage('Sales Order', "Please select valid Dates for Sales Order PartsList!", MessageSeverity.error);
        } else {
          // this.marginSummary.salesOrderId = this.id;
          // this.salesOrderService.createSOMarginSummary(this.marginSummary).subscribe(result => {
          //   this.marginSummary.soMarginSummaryId = result;
          // });
          this.exchangeSalesOrderService.update(this.salesOrderView).subscribe(data => {
            this.isSpinnerVisible = false;
            this.alertService.showMessage(
              "Success",
              `Exchange Sales Order updated successfully.`,
              MessageSeverity.success
            );
            this.getSalesOrderInstance(this.id, true);
            if (createNewVersion) {
              this.router.navigateByUrl(`exchangemodule/exchangepages/exchange-sales-order-list`);
            }
            this.toggle_po_header = false;
            if (this.isEdit) {
              this.isCreateModeHeader = false;
            }
            this.enableUpdateButton = true;
          }, error => {
            this.isSpinnerVisible = false;
            this.toggle_po_header = true;
          });
        }
      } else {
        this.exchangeSalesOrderService.create(this.salesOrderView).subscribe(data => {
          this.salesCreateHeaderOrderId = data[0].exchangeSalesOrderId;
          this.salesOrderView.salesOrder.exchangeSalesOrderId = this.salesCreateHeaderOrderId;
          this.isCreateModeHeader = true;
          this.isHeaderSubmit = true;
          this.isSpinnerVisible = false;
          this.alertService.showMessage(
            "Success",
            `Exchange Sales Order created successfully.`,
            MessageSeverity.success
          );
          this.toggle_po_header = false;
          this.id = this.salesCreateHeaderOrderId;
          if (this.salesCreateHeaderOrderId) {
            this.router.navigateByUrl(
              `exchangemodule/exchangepages/exchange-sales-order-edit/${this.customerId}/${this.salesCreateHeaderOrderId}`
            );
          }
          if (!this.isCreateModeHeader) {
            this.router.navigateByUrl(`exchangemodule/exchangepages/exchange-sales-order-list`);
          }
        }, error => {
          this.isSpinnerVisible = false;
          this.toggle_po_header = true;
        });
      }
      this.toggle_po_header = false;
    }
  }

  public onPartsApprovedEvent(): void {
    this.selectedParts = [];
    this.getSalesOrderInstance(this.id);
  }

  dismissModel() {
    this.modal.close();
  }

  viewSoQuote(content, salesOrderQuoteId) {
    this.isSpinnerVisible = true;
    this.salesQuoteService.getview(salesOrderQuoteId).subscribe(res => {
      this.salesQuoteView = res[0];
      this.modal = this.modalService.open(content, { size: "lg", backdrop: 'static', keyboard: false });
      this.isSpinnerVisible = false;
    }, error => {
      this.isSpinnerVisible = false;
    });
  }

  // onSalesOrderActionClick(eventArgs: SalesOrderEventArgs): void {
  //   this.isEmailTabEnabled = true;
  //   switch (eventArgs.actionType) {
  //     case SalesOrderActionType.NewSalesOrder:
  //       this.router.navigateByUrl(
  //         `salesmodule/salespages/sales-order-create/${this.salesOrderView.salesOrder.customerId}`
  //       );
  //       break;
  //     case SalesOrderActionType.ViewQuote:
  //       this.isEmailTabEnabled = false;
  //       if (this.salesOrderQuote.exchangeQuoteId) {
  //         this.viewSoQuote(this.viewQuoteModal, this.salesOrderQuote);
  //       }
  //       break;
  //     case SalesOrderActionType.CloseSalesOrder:
  //       this.isEmailTabEnabled = false;
  //       if (eventArgs.confirmType === SalesOrderConfirmationType.Yes) {
  //         this.salesOrderService.close(this.salesOrderView.salesOrder.exchangeSalesOrderId, this.userName).subscribe(result => {
  //           this.router.navigateByUrl(`salesmodule/salespages/sales-order-list`);
  //         }, error => {
  //           this.isSpinnerVisible = false;
  //         });
  //       }
  //       break;
  //     case SalesOrderActionType.CancelSalesOrder:
  //       this.isEmailTabEnabled = false;
  //       if (eventArgs.confirmType === SalesOrderConfirmationType.Yes) {
  //         this.salesOrderService.cancel(this.salesOrderView.salesOrder.exchangeSalesOrderId, this.userName).subscribe(result => {
  //           this.router.navigateByUrl(`salesmodule/salespages/sales-order-list`);
  //         }, error => {
  //           this.isSpinnerVisible = false;
  //         });
  //       }
  //       break;
  //     case SalesOrderActionType.MakeDuplicate:
  //       break;
  //     case SalesOrderActionType.Memo:
  //       this.selectedCommunicationTab = "memo";
  //       break;
  //     case SalesOrderActionType.Email:
  //       this.selectedCommunicationTab = "email";

  //       break;
  //     case SalesOrderActionType.Phone:
  //       this.selectedCommunicationTab = "phone";
  //       break;
  //     case SalesOrderActionType.Text:
  //       this.selectedCommunicationTab = "text";
  //       break;
  //     case SalesOrderActionType.EmailSalesOrder:
  //       this.selectedCommunicationTab = "Quotemail";
  //       break;
  //     case SalesOrderActionType.PrintSalesOrder:
  //       this.isEmailTabEnabled = false;
  //       this.initiateSOPrintProcess();
  //       break;
  //   }
  // }

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
    if (event.index == 0) {
      this.exchangeSalesOrderPartNumberComponent.refresh();
      this.exchangeSalesOrderPartNumberComponent.refreshParts();
    }
    if (event.index == 1) {
      this.showAddresstab = true;
    }
    if (event.index == 2) {
      this.exchangeSalesOrderPickTicketsComponent.refresh(this.id);
    }
    if (event.index == 3) {
      if (this.salesQuote.status == "Open" || this.salesQuote.status == "Partially Approved") {
        this.exchangeSalesOrderFreightComponent.refresh(false);
      } else {
        this.exchangeSalesOrderFreightComponent.refresh(true);
      }
    }
    if (event.index == 4) {
      if (this.salesQuote.statusName == "Open" || this.salesQuote.statusName == "Partially Approved") {
        this.exchangeSalesOrderChargesComponent.refresh(false);
      } else {
        this.exchangeSalesOrderChargesComponent.refresh(true);
      }
    }
    if (event.index == 5) {
      this.exchangeSalesOrderShippingComponent.refresh(this.selectedParts);
    }
    if (event.index == 6) {
      this.exchangeSalesOrderBillingComponent.refresh(this.id); //(this.selectedParts);
    }
  }

  updateMarginSummary() {
    //this.isSpinnerVisible = true;
    this.marginSummary.salesOrderId = this.id;
    // this.salesOrderService.createSOMarginSummary(this.marginSummary).subscribe(result => {
    //   this.marginSummary.soMarginSummaryId = result;
    //   this.isSpinnerVisible = false;
    // }, error => {
    //   this.isSpinnerVisible = false;
    // });
  }

  onPartsSaveEvent(savedParts) {
    if (savedParts) {
      // this.marginSummary = this.salesQuoteService.getSalesQuoteHeaderMarginDetails(savedParts, this.marginSummary);
      // this.updateMarginSummary();
    }
  }

  setFreightsOrCharges() {
    if (this.salesQuoteService.selectedParts && this.salesQuoteService.selectedParts.length > 0) {
      this.salesQuoteService.selectedParts.forEach((part, i) => {
        this.salesQuoteService.selectedParts[i].freight = this.totalFreights;
        this.salesQuoteService.selectedParts[i].misc = this.totalCharges;
      });
    }
    this.marginSummary = this.salesQuoteService.getSalesQuoteHeaderMarginDetails(this.salesQuoteService.selectedParts, this.marginSummary);
  }

  saveSalesOrderFreightsList(e) {
    this.totalFreights = e;
    this.marginSummary.freightAmount = this.totalFreights;
    //this.salesOrderService.setTotalFreights(e);
    this.setFreightsOrCharges();
    this.updateMarginSummary();
  }

  updateSalesOrderFreightsList(e) {
    this.totalFreights = e;
    this.marginSummary.freightAmount = this.totalFreights;
    //this.salesOrderService.setTotalFreights(e);
    this.setFreightsOrCharges();
    this.updateMarginSummary();
  }

  saveSalesOrderChargesList(e) {
    this.totalCharges = e;
    //this.salesOrderService.setTotalCharges(e);
    this.marginSummary.misc = this.totalCharges;
    this.setFreightsOrCharges();
    this.updateMarginSummary();
  }

  updateSalesOrderChargesList(e) {
    this.totalCharges = e;
    //this.salesOrderService.setTotalCharges(e);
    this.marginSummary.misc = this.totalCharges;
    this.setFreightsOrCharges();
    this.updateMarginSummary();
  }

  load(managementStructureId: number) {
    this.managementStructureId = managementStructureId;

    if (this.id) {
      this.getManagementStructureDetails(this.managementStructureId, this.employeeId, this.salesQuote.managementStructureId);
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
    this.commonservice.getManagmentStrctureData(id, empployid, editMSID, this.masterCompanyId).subscribe(response => {
      this.isSpinnerVisible = false;
      if (response) {
        const result = response;
        if (result[0] && result[0].level == 'Level1') {
          this.maincompanylist = result[0].lstManagmentStrcture;
          this.salesQuote.companyId = result[0].managementStructureId;
          this.salesQuote.managementStructureId = result[0].managementStructureId;
          this.salesQuote.buId = 0;
          this.salesQuote.divisionId = 0;
          this.salesQuote.departmentId = 0;
          this.bulist = [];
          this.divisionlist = [];
          this.departmentList = [];
        } else {
          this.salesQuote.companyId = 0;
          this.salesQuote.buId = 0;
          this.salesQuote.divisionId = 0;
          this.salesQuote.departmentId = 0;
          this.maincompanylist = [];
          this.bulist = [];
          this.divisionlist = [];
          this.departmentList = [];
        }

        if (result[1] && result[1].level == 'Level2') {
          this.bulist = result[1].lstManagmentStrcture;
          this.salesQuote.buId = result[1].managementStructureId;
          this.salesQuote.managementStructureId = result[1].managementStructureId;
          this.salesQuote.divisionId = 0;
          this.salesQuote.departmentId = 0;
          this.divisionlist = [];
          this.departmentList = [];
        } else {
          if (result[1] && result[1].level == 'NEXT') {
            this.bulist = result[1].lstManagmentStrcture;
          }
          this.salesQuote.buId = 0;
          this.salesQuote.divisionId = 0;
          this.salesQuote.departmentId = 0;
          this.divisionlist = [];
          this.departmentList = [];
        }

        if (result[2] && result[2].level == 'Level3') {
          this.divisionlist = result[2].lstManagmentStrcture;
          this.salesQuote.divisionId = result[2].managementStructureId;
          this.salesQuote.managementStructureId = result[2].managementStructureId;
          this.salesQuote.departmentId = 0;
          this.departmentList = [];
        } else {
          if (result[2] && result[2].level == 'NEXT') {
            this.divisionlist = result[2].lstManagmentStrcture;
          }
          this.salesQuote.divisionId = 0;
          this.salesQuote.departmentId = 0;
          this.departmentList = [];
        }

        if (result[3] && result[3].level == 'Level4') {
          this.departmentList = result[3].lstManagmentStrcture;;
          this.salesQuote.departmentId = result[3].managementStructureId;
          this.salesQuote.managementStructureId = result[3].managementStructureId;
        } else {
          this.salesQuote.departmentId = 0;
          if (result[3] && result[3].level == 'NEXT') {
            this.departmentList = result[3].lstManagmentStrcture;
          }
        }
        this.employeedata('', this.salesQuote.managementStructureId);
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
    this.commonservice.autoCompleteDropdownsEmployeeByMS(strText, true, 20, this.arrayEmplsit.join(), manStructID, this.masterCompanyId).subscribe(res => {
      this.isSpinnerVisible = false;
      this.allEmployeeList = res;
      this.firstCollection = res;
      this.employeesList = res;
      this.currentUserEmployeeName = getValueFromArrayOfObjectById('label', 'value', this.employeeId, res);
      if (!this.isEdit) {
        this.getEmployeerOnLoad(this.salesQuote.employeeId ? this.salesQuote.employeeId.value : this.employeeId);
      }
      else {
        if (this.salesQuote != undefined) {
          this.salesQuote.employeeId = getObjectById('value', this.salesOrderObj.employeeId, this.allEmployeeList);//this.salesOrderObj.employeeId;
          this.setSalesPerson();
          this.setCSR();
          this.salesQuote.employeeName = getObjectById(
            "value",
            this.salesOrderObj.employeeId,
            this.allEmployeeList
          );
        }
      }
    }, err => {
      this.isSpinnerVisible = false;
    })
  }

  getEmployeerOnLoad(id) {
    this.salesQuote.employeeId = getObjectById('value', id, this.allEmployeeList);
  }

  getBUList(legalEntityId) {
    this.salesQuote.buId = 0;
    this.salesQuote.divisionId = 0;
    this.salesQuote.departmentId = 0;
    this.bulist = [];
    this.divisionlist = [];
    this.departmentList = [];
    if (legalEntityId != 0 && legalEntityId != null && legalEntityId != undefined) {
      this.salesQuote.managementStructureId = legalEntityId;
      this.salesQuote.companyId = legalEntityId;
      this.isSpinnerVisible = true;
      this.commonservice.getManagementStructurelevelWithEmployee(legalEntityId, this.employeeId).subscribe(res => {
        this.bulist = res;
        this.employeedata('', this.salesQuote.managementStructureId);
        this.isSpinnerVisible = false;
      }, err => {
        this.isSpinnerVisible = false;
      });
    }
    else {
      this.salesQuote.managementStructureId = 0;
      this.salesQuote.companyId = 0;
    }
  }

  getDivisionlist(buId) {
    this.divisionlist = [];
    this.departmentList = [];
    this.salesQuote.divisionId = 0;
    this.salesQuote.departmentId = 0;

    if (buId != 0 && buId != null && buId != undefined) {
      this.salesQuote.managementStructureId = buId;
      this.salesQuote.buId = buId;
      this.isSpinnerVisible = true;
      this.commonservice.getManagementStructurelevelWithEmployee(buId, this.employeeId).subscribe(res => {
        this.divisionlist = res;
        this.isSpinnerVisible = false;
      }, err => {
        this.isSpinnerVisible = false;
      });
    } else {
      this.salesQuote.managementStructureId = this.salesQuote.companyId;
    }

    this.employeedata('', this.salesQuote.managementStructureId);
  }

  getDepartmentlist(divisionId) {
    this.salesQuote.departmentId = 0;
    this.departmentList = [];
    if (divisionId != 0 && divisionId != null && divisionId != undefined) {
      this.salesQuote.divisionId = divisionId;
      this.salesQuote.managementStructureId = divisionId;
      this.isSpinnerVisible = true;
      this.commonservice.getManagementStructurelevelWithEmployee(divisionId, this.employeeId).subscribe(res => {
        this.departmentList = res;
        this.isSpinnerVisible = false;
      }, err => {
        this.isSpinnerVisible = false;
      });
    }
    else {
      this.salesQuote.managementStructureId = this.salesQuote.buId;
      this.salesQuote.divisionId = 0;
    }

    this.employeedata('', this.salesQuote.managementStructureId);
  }

  getDepartmentId(departmentId) {
    if (departmentId != 0 && departmentId != null && departmentId != undefined) {
      this.salesQuote.managementStructureId = departmentId;
      this.salesQuote.departmentId = departmentId;
    }
    else {
      this.salesQuote.managementStructureId = this.salesQuote.divisionId;
      this.salesQuote.departmentId = 0;
    }

    this.employeedata('', this.salesQuote.managementStructureId);
  }

  arraySOStatuslist: any[] = [];
  loadSOStatus() {
    if (this.arraySOStatuslist.length == 0) {
      this.arraySOStatuslist.push(0);
    }
    this.isSpinnerVisible = true;
    this.commonservice.autoSuggestionSmartDropDownList('ExchangeStatus', 'ExchangeStatusId', 'Name', '', true, 20, this.arraySOStatuslist.join(), this.masterCompanyId).subscribe(res => {
      this.soStatusList = res;
      this.soStatusList = this.soStatusList.sort((a, b) => (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0));
      this.isSpinnerVisible = false;
    }, error => {
      this.isSpinnerVisible = false;
    });
  }

  arraySOTypelist: any[] = [];
  loadSOType() {
    if (this.arraySOTypelist.length == 0) {
      this.arraySOTypelist.push(0);
    }
    this.isSpinnerVisible = true;
    this.commonservice.autoSuggestionSmartDropDownList('MasterSalesOrderQuoteTypes', 'Id', 'Name', '', true, 20, this.arraySOTypelist.join(), this.masterCompanyId).subscribe(res => {
      this.soTypeList = res;
      this.soTypeList = this.soTypeList.sort((a, b) => (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0));
      this.isSpinnerVisible = false;
    }, error => {
      this.isSpinnerVisible = false;
    });
  }

  initiateSOPrintProcess() {
    let content = this.salesOrderPrintPopup;
    this.modal = this.modalService.open(content, { size: "lg", backdrop: 'static', keyboard: false });
  }

  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('sales_order_print_content').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
           <title>Exchange Sales Order</title>
           <style>
           div {
            white-space: normal;
          }
          table { page-break-after:auto }
tr    { page-break-inside:avoid; page-break-after:auto }
td    { page-break-inside:avoid; page-break-after:auto }
thead { display: table-row-group; }
tfoot { display:table-footer-group }
             @media print
             {
               @page {
               margin-top: 0;
               margin-bottom: 0;
               size: auto;  margin: 0mm; 
               size: landscape
               }
             
             } 
             span {
               /* font-weight: normal; */
               font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
               font-size: 10.5px !important;
               font-weight: 700;
             }
                         table {font-size:12px !important}        
             table thead { background: #808080;}    
              
             table, thead, td {
             border: 1px solid black;
             border-collapse: collapse;
           } 
           table, thead, th {
             border: 1px solid black;
             border-collapse: collapse;
           } 
           .border-none{
             border:none;
           }
             table thead tr th 
             {
               //   background: #0d57b0 !important;
                 padding: 5px!important;color: #fff;letter-spacing: 0.3px;font-weight:bold;
                 font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
                  font-size: 12.5px;text-transform: capitalize; z-index: 1;} 
             table tbody{   overflow-y: auto; max-height: 500px;  }
             table tbody tr td{ background: #fff;
                padding: 2px;line-height: 22px;
                height:22px;color: #333;
                border-right:1px solid black !important;
               font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;font-weight;normal;
               font-size: 12.5px !important;max-width:100%; letter-spacing: 0.1px;border:0}
             h4{padding: 5px; display: inline-block; font-size: 14px; font-weight: normal; width: 100%; margin: 0;}
             
             .very-first-block {position: relative; height:auto;border-right:1px solid black; min-height: 1px; float: left;padding-right: 2px;padding-left: 2px;
               width: 50%;}
             .first-block-name{margin-right: 20px} 
             .first-block-sold-to {
               position: relative;
               min-height: 82px;
               height: auto;
               float: left;
               padding-bottom:5px;
               padding-right: 2px;
               border-right: 1px solid black;
               background: #fff;
               width: 100%;
               margin-top:-2px
              
             }
             
             .first-block-ship-to {
               position: relative;
               min-height: 80px;
               padding-bottom:5px;
               height: auto;
               padding-right: 2px;
               border-right: 1px solid black;
               background: #fff;
               width: 100%;
             
             }
             
             .first-block-sold {
               position: relative;
               min-height: 120px;
               height:auto;
               float: left;
               border-right:1px solid black;
               padding-right: 2px;
               padding-left: 2px;
               margin-left:-1px;
               width: 50%;
             }
             
             .first-block-ship {
               position: relative;
               min-height: 1px;
               float: right;
               padding-right: 2px;
              
               width: 49%;
             }
             
             .address-block {
               position: relative;
               min-height: 1px;
               float: left;
               height:auto;
               padding-right: 2px;
               // border: 1px solid black;
               width: 100%;
               padding-left: 2px;
             }
             
             .first-block-address {
               margin-right: 20px;
               text-align: left
             }
             
             
             .second-block {
               position: relative;
               min-height: 1px;
               float: left;
               padding-right: 2px;
               width: 42%;
             height:auto;
               // border-left:1px solid black;
                 // margin-left: 16%;
               padding-left: 2px;
               box-sizing: border-box;
             }
             
             .second-block-div {
               margin: 2px 0;
               position: relative;
               display: flex;
             
               min-height: 1px;
               height:auto
              
               width: 100%;
             }
             .label{
               font-weight:500;
             }
             
             .second-block-label {
               position: relative;
               min-height: 1px;
               float: left;
               padding-right: 2px;
               padding-left: 2px;
               font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
                   font-size: 10.5px !important;
                   font-weight: 700;
               
                   width: 38.33333333%;
                   text-transform: capitalize;
                   margin-bottom: 0;
                   text-align: left;
             }
             
             .clear {
               clear: both;
             }
             
             .form-div {
               // top: 6px;
               position: relative;
               font-weight: normal;
               font-size:12.5
               font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
               // margin-top: 10px;
              
             }
             span {
               font-weight: normal;
               font-size: 12.5px !important;
           }
             
             .image {
               border: 1px solid #000;
               // padding: 5px;
               width: 100%;
               display: block;
             }
             
             .logo-block {
               margin: auto;
               text-align: center
             }
             
             .pdf-block {
               width: 800px;
               margin: auto;
               font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
               font-weight:normal;
               border: 1px solid #ccc;
               padding: 25px 15px;
             }
             
             .picked-by {
               position: relative;
               float: left;
               width: 48%;
               font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
               font-size: 10.5px !important;
               font-weight: 700;
             }
             
             .confirmed-by {
               position: relative;
               float: right;
               width: 48%;
               font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
               font-size: 10.5px !important;
               font-weight: 700;
             }
             
             .first-part {
               position: relative;
               display: inline;
               float: left;
               width: 50%
             }
             
             .seond-part {
               position: relative;
               display: flex;
               float: right;
               width: 24%
             }
             
             .input-field-border {
               width: 88px;
               border-radius: 0px !important;
               border: none;
               border-bottom: 1px solid black;
             }
             
             .border-transparent {
               border-block-color: white;
             }
             
             .pick-ticket-header {
               border: 1px solid black;
               text-align: center;
               background: #0d57b0 !important;
               color: #fff !important;
               -webkit-print-color-adjust: exact;
             }
             
             .first-block-label {
               position: relative;
               min-height: 1px;
               float: left;
               padding-right: 2px;
               padding-left: 2px;
               // width: 38.33333333%;
               font-size:10.5px !important;
             
               font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
               font-weight: 700;
           
               text-transform: capitalize;
               margin-bottom: 0;
               text-align: left;
             }
             
             .very-first-block {
               position: relative;
               min-height: 159px;
               float: left;
               height:auto;
              border-right:1px solid black;
               padding-right: 2px;
               padding-left: 2px;
               width: 57% !important;
             }
             
             .logo {
               padding-top: 10px;
                   // height:70px;
                   // width:220px;
                   height:auto;
                   max-width:100%;
                   padding-bottom:10px;
             }
             
             .sold-block-div {
               margin: 2px 0;
               position: relative;
               display: flex;
               min-height: 1px;
               width: 100%;
             }
             
             .ship-block-div {
               margin: 2px 0;
               position: relative;
               display: flex;
               min-height: 1px;
               width: 100%;
             }
             .first-block-sold-bottom{
               border-bottom: 1px solid black;
                   position:relative;
                   min-height:1px;
                   height:auto;
                   width:100%;
                   float:left;
                     // margin-top: -2px;
                    // min-height: 120px;
             }
             .print-table{
               width:100%;
             }
             .parttable th {
               background: #fff !important;
               color: #000 !important;
               -webkit-print-color-adjust: exact;
             }
             .border-bottom{
               border-bottom:1px solid black !important;
             }
             .table-margins{
                   margin-top:-1px;margin-left:0px
                 }
             .invoice-border{
               border-bottom: 1px solid;
                   position:relative;
                     // min-height: 119px;
                     min-height:1px;
                     height: auto;
                     width:100%;
                   float:left;}
             
                         </style>
        </head>
        <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }

  closeModal() {
    this.modal.close();
  }

  checkEnforceInternalApproval() {
    return this.soSettingsList[0] != null &&
      this.soSettingsList[0].isApprovalRule &&
      new Date(this.todayDate) >= new Date(this.soSettingsList[0].effectiveDate);
  }

  getChargesList() { }
  getFreightList() { }
  saveExchangeQuoteFreightsList(e) {
     this.totalFreights = e;
    // this.marginSummary.freightAmount = this.totalFreights;
    // this.exchangequoteService.setTotalFreights(e);
    // this.setFreightsOrCharges();
    // this.updateMarginSummary();
  }

  updateExchangeQuoteFreightsList(e) {
     this.totalFreights = e;
    // this.marginSummary.freightAmount = this.totalFreights;
    // this.exchangequoteService.setTotalFreights(e);
    // this.setFreightsOrCharges();
    // this.updateMarginSummary();
  }
  saveExchangeQuoteChargesList(e) {
    this.modelcharges = e;
    // this.totalCharges = this.modelcharges.amount;
    // this.totalcost = this.modelcharges.cost;
    // this.marginSummary.otherCharges = this.totalCharges;
    // this.marginSummary.otherCost = this.totalcost;
    // this.exchangequoteService.setTotalCharges(this.modelcharges.amount);
    // this.exchangequoteService.setTotalcost(this.modelcharges.cost);
    // this.setFreightsOrCharges();
    // this.updateMarginSummary();
  }
  public modelcharges = { amount: 0, cost: 0 };
  updateExchangeQuoteChargesList(e) {
    this.modelcharges = e;
    // this.totalCharges = this.modelcharges.amount;
    // this.totalcost = this.modelcharges.cost;
    // this.exchangequoteService.setTotalCharges(this.modelcharges.amount);
    // this.exchangequoteService.setTotalcost(this.modelcharges.cost);
    // this.marginSummary.otherCharges = this.totalCharges;
    // this.marginSummary.otherCost = this.totalcost;
    // this.setFreightsOrCharges();
    // this.updateMarginSummary();
  }
}