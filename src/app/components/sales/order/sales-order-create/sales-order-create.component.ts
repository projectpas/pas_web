import { Component, OnInit, ViewChild, ElementRef, Input } from "@angular/core";
import {
  NgForm,
  FormBuilder,
  FormGroup
} from "@angular/forms";
import { CustomerSearchQuery } from "../models/customer-search-query";
import { CustomerService } from "../../../../services/customer.service";
import { Customer } from "../../../../models/customer.model";
import { AlertService, MessageSeverity } from "../../../../services/alert.service";
import { ActivatedRoute } from "@angular/router";
import { SalesQuoteService } from "../../../../services/salesquote.service";
import { SalesOrderService } from "../../../../services/salesorder.service";
import { ISalesOrder } from "../../../../models/sales/ISalesOrder.model";
import { SalesOrder } from "../../../../models/sales/SalesOrder.model";
import { ISalesOrderQuote } from "../../../../models/sales/ISalesOrderQuote";
import { ISalesQuoteView } from "../../../../models/sales/ISalesQuoteView";
import { ISalesOrderView } from "../../../../models/sales/ISalesOrderView";
import { SalesOrderView } from "../../../../models/sales/SalesOrderView";

import { CommonService } from "../../../../services/common.service";
import { Currency } from "../../../../models/currency.model";
import { CurrencyService } from "../../../../services/currency.service";
import { EmployeeService } from "../../../../services/employee.service";
import { AuthService } from "../../../../services/auth.service";
import { Router } from "@angular/router";
import {
  getObjectById,
  editValueAssignByCondition,
  getValueFromArrayOfObjectById,
} from "../../../../generic/autocomplete";
import {
  NgbModal,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
import { CustomerViewComponent } from "../../../../shared/components/customer/customer-view/customer-view.component";
import { PartDetail } from "../../shared/models/part-detail";

import { ManagementStructureComponent } from "../../quotes/shared/components/management-structure/management-structure.component";
import { SalesAddressComponent } from "../../quotes/shared/components/sales-address/sales-address.component";
import { DBkeys } from "../../../../services/db-Keys";
import { IStatus } from "../../../../models/sales/IStatus";
import { SalesOrderActionType } from "../../sales-order-actions-emuns";
import { SalesOrderConfirmationType } from "../../sales-confirmation-type.enum";
import { SalesOrderConfirmationModalComponent } from "../sales-order-confirmation-modal/sales-order-confirmation-modal.compoent";
import { SalesOrderEventArgs } from "../../sales-order-event-args";
import { ISalesOrderCopyParameters } from "../models/isalesorder-copy-parameters";
import { MarginSummary } from "../../../../models/sales/MarginSummaryForSalesorder";
import { SalesOrderApproveComponent } from "../shared/components/sales-approve/sales-approve.component";
import { SalesOrderCustomerApprovalComponent } from "../shared/components/sales-order-customer-approval/sales-order-customer-approval.component";
import { forkJoin } from "rxjs";
import { SalesOrderFreightComponent } from "../shared/components/sales-order-freight/sales-order-freight.component";
import { SalesOrderChargesComponent } from "../shared/components/sales-order-charges/sales-order-charges.component";
import { SalesOrderPartNumberComponent } from "../shared/components/sales-order-part-number/sales-order-part-number.component";
import { SalesOrderBillingComponent } from "../shared/components/sales-order-billing/sales-order-billing.component";
import { SalesOrderAnalysisComponent } from "../sales-order-analysis/sales-order-analysis.component";
import { SalesOrderShippingComponent } from "../shared/components/sales-order-shipping/sales-order-shipping.component";
@Component({
  selector: "app-sales-order-create",
  templateUrl: "./sales-order-create.component.html",
  styleUrls: ["./sales-order-create.component.scss"]
})
export class SalesOrderCreateComponent implements OnInit {
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
  salesOrder: ISalesOrder;
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
  marginSummary: MarginSummary = new MarginSummary();
  @ViewChild("newSalesOrderForm",{static:false}) public newSalesOrderForm: NgForm;
  @ViewChild("errorMessagePop",{static:false}) public errorMessagePop: ElementRef;
  @ViewChild("newSalesQuoteForm",{static:false}) public newSalesQuoteForm: NgForm;
  @ViewChild(SalesOrderFreightComponent,{static:false}) public salesOrderFreightComponent: SalesOrderFreightComponent;
  @ViewChild(SalesOrderChargesComponent,{static:false}) public salesOrderChargesComponent: SalesOrderChargesComponent;
  @ViewChild(SalesOrderPartNumberComponent,{static:false}) public salesOrderPartNumberComponent: SalesOrderPartNumberComponent;
  @ViewChild(ManagementStructureComponent,{static:false}) managementStructureComponent: ManagementStructureComponent;
  @ViewChild(SalesAddressComponent,{static:false}) public salesAddressComponent: SalesAddressComponent;
  @ViewChild(SalesOrderConfirmationModalComponent,{static:false}) salesOrderConfirmationModalComponent: SalesOrderConfirmationModalComponent;
  @ViewChild(SalesOrderBillingComponent,{static:false}) public salesOrderBillingComponent: SalesOrderBillingComponent;
  @ViewChild(SalesOrderShippingComponent,{static:false}) public salesOrderShippingComponent: SalesOrderShippingComponent;
  @ViewChild(SalesOrderAnalysisComponent,{static:false}) public salesOrderAnalysisComponent: SalesOrderAnalysisComponent;
  employeesList: any = [];
  customerWarning: any = {};
  status: IStatus[] = [];
  freight = [];
  charge = [];
  @Input() salesQuoteId: number = 0;
  @ViewChild(SalesOrderApproveComponent,{static:false}) public salesOrderApproveComponent: SalesOrderApproveComponent;
  @ViewChild(SalesOrderCustomerApprovalComponent,{static:false}) public salesOrderCustomerApprovalComponent: SalesOrderCustomerApprovalComponent;
  salesOrderCopyParameters: ISalesOrderCopyParameters;
  copyMode: boolean;
  copy: boolean;
  copyData: string;
  isCreateModeHeader: boolean = false;
  isHeaderSubmit: boolean = false;
  @ViewChild("updateConfirmationModal",{static:false})
  public updateConfirmationModal: ElementRef;
  @ViewChild("viewQuote",{static:false})
  public viewQuoteModal: ElementRef;
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

  constructor(
    private customerService: CustomerService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private salesQuoteService: SalesQuoteService,
    private salesOrderService: SalesOrderService,
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

    this.controlSettings.showViewQuote = false;
    this.customerId = +this.route.snapshot.paramMap.get("customerId");
    this.id = +this.route.snapshot.paramMap.get("id");
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
    this.salesQuoteService.resetSalesOrderQuote();

    this.salesQuoteService.getSalesOrderQuteInstance().subscribe(data => {
      this.salesOrderQuote = data;
    });
    this.salesQuoteService.getSelectedParts().subscribe(data => {
      this.selectedParts = data;
      this.marginSummary = this.salesQuoteService.getSalesQuoteHeaderMarginDetails(this.selectedParts, this.marginSummary);
    });
    this.managementStructureId = this.currentUserManagementStructureId;
    this.getInitialDataForSO();
    this.salesQuoteService.salesOrderViewSubj$.subscribe(data => {
      this.salesOrderView = data;
    });
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
    this.isSpinnerVisible = true;
    forkJoin(this.customerService.getCustomerCommonDataWithContactsById(this.customerId),
      this.commonservice.getCSRAndSalesPersonOrAgentList(this.currentUserManagementStructureId),
      this.employeeService.getEmployeeCommonData(this.currentUserManagementStructureId),
      this.commonservice.smartDropDownList('CustomerWarningType', 'CustomerWarningTypeId', 'Name'),
      this.commonservice.smartDropDownList('CustomerType', 'CustomerTypeId', 'Description'),
      this.commonservice.smartDropDownList("CreditTerms", "CreditTermsId", "Name"),
      this.salesOrderService.getAllSalesOrderSettings()).subscribe(result => {
        this.isSpinnerVisible = false;
        this.setAllCustomerContact(result[0]);
        this.setJobTitles(result[1]);
        this.onempDataLoadSuccessful(result[2][0]);
        this.setTypesOfWarnings(result[3]);
        this.setAccountTypes(result[4]);
        this.setCreditTerms(result[5]);
        this.customerDetails = result[0];
        let settingList: any = result[6];
        if (settingList && settingList.length > 0) {
          this.soSettingsList = settingList;
        }
        this.getSoInstance();
      }, error => {
        this.isSpinnerVisible = false;
        const errorLog = error;
        this.onDataLoadFailed(errorLog)
      });
  }

  getSOMarginSummary() {
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
    }, error => {
      const errorLog = error;
      this.onDataLoadFailed(errorLog);
    })

  }

  getSoInstance() {
    if (this.copyMode) {
      this.copySalesOrderInstance(this.salesOrderCopyParameters.salesOrderId);
    }
    else if (this.id) {
      this.getSalesOrderInstance(this.id);
      this.getSOMarginSummary();
      this.isEdit = true;
    } else if (this.salesOrderView) {
      this.salesQuote = this.salesOrderView.salesOrder
      this.commonSalesOrderInstanceForConvertAndEdit(this.salesOrderView);
      this.getSOMarginSummary();
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

  async getCustomerWarningsData(customerWarningListId: number) {
    await this.customerService
      .getCustomerWarningsByCustomerIdandCustomerWarningsListID(this.customerId, customerWarningListId)
      .subscribe(res => {
        this.customerWarning = res;
        if (this.customerWarning) {
          this.salesOrder.customerWarningId = this.customerWarning.customerWarningId;
        }
      }, error => {
        this.isSpinnerVisible = false;
        const errorLog = error;
        this.onDataLoadFailed(errorLog)
      });
  }

  setCreditTerms(creditTerms) {
    this.creditTerms = creditTerms;
  }
  setAccountTypes(responseData) {
    this.accountTypes = responseData;
  }

  private oncurrencySuccessful(getCreditTermsList: Currency[]) {
    this.allCurrencyInfo = getCreditTermsList;
  }

  private getEmployeedata() {
    this.employeeService.getEmployeeCommonData(this.currentUserManagementStructureId).subscribe(
      results => this.onempDataLoadSuccessful(results[0]), error => {
        this.isSpinnerVisible = false;
        const errorLog = error;
        this.onDataLoadFailed(errorLog)
      }
    );
  }

  private onempDataLoadSuccessful(getEmployeeCerficationList: any[]) {
    this.allEmployeeinfo = getEmployeeCerficationList;
    this.allEmployeeinfo.filter(x => {

      x.firstName = x.firstName + " " + x.lastName
      this.employeesList.push({ name: x.firstName, employeeId: x.employeeId })
    })
    if (this.salesQuote.employeeId != undefined) {
      if (this.salesOrderQuoteObj) { // during normal
        this.salesQuote.employeeName = getObjectById(
          "employeeId",
          this.salesOrderQuoteObj.employeeId,
          this.allEmployeeinfo
        );
      }
      else { //during sales quote conversion
        this.salesQuote.employeeName = getObjectById(
          "employeeId",
          this.salesQuote.employeeId,
          this.allEmployeeinfo
        );
      }

    } else {
      this.salesQuote.employeeName = getObjectById(
        "employeeId",
        this.employeeId,
        this.allEmployeeinfo
      );
    }
  }

  filterfirstName(event) {
    this.firstCollection = this.allEmployeeinfo;

    const employeeListData = [
      ...this.allEmployeeinfo.filter(x => {
        if (x.firstName.toLowerCase().includes(event.query.toLowerCase())) {
          return x.firstName + '' + x.lastName;
        }

      })
    ];
    this.firstCollection = employeeListData;
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

  filterAgentFirstName(event) {
    this.agentFirstCollection = this.agentsOriginalList;

    const agentData = [
      ...this.agentsOriginalList.filter(x => {
        return x.name.toLowerCase().includes(event.query.toLowerCase());
      })
    ];
    this.agentFirstCollection = agentData;
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

  private onCustomerDataLoadSuccessful(allCustomerFlows: any[]) {
    this.allCustomer = allCustomerFlows;
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
    } else {
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
  }

  setAllCustomerContact(result) {
    this.customerContactList = result.contactList;
  }

  onDataLoadFailed(log) {
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


  onSalesPersonSelect(event) {
    if (this.allEmployeeinfo) {
      for (let i = 0; i < this.allEmployeeinfo.length; i++) {
        if (event == this.allEmployeeinfo[i].firstName) {
          this.salesQuote.salesPersonId = this.allEmployeeinfo[i].employeeId;
        }
      }
    }
  }

  onAgentSelect(event) {
    if (this.allEmployeeinfo) {
      for (let i = 0; i < this.allEmployeeinfo.length; i++) {
        if (event == this.allEmployeeinfo[i].firstName) {
          this.salesQuote.agentId = this.allEmployeeinfo[i].employeeId;
        }
      }
    }
  }

  onCustomerServiceRepSelect(event) {
    if (this.allEmployeeinfo) {
      for (let i = 0; i < this.allEmployeeinfo.length; i++) {
        if (event == this.allEmployeeinfo[i].firstName) {
          this.salesQuote.customerServiceRepId = this.allEmployeeinfo[
            i
          ].employeeId;
        }
      }
    }
  }

  onEmployeeNameSelect(event) {
    if (this.allEmployeeinfo) {
      for (let i = 0; i < this.allEmployeeinfo.length; i++) {
        if (event == this.allEmployeeinfo[i].firstName) {
          this.salesQuote.employeeId = this.allEmployeeinfo[i].employeeId;
        }
      }
    }
  }

  onWarningSelect(event) {
    if (this.customerWarningData) {
      for (let i = 0; i < this.customerWarningData.length; i++) {
        if (event == this.customerWarningData[i].customerWarningId) {
          this.salesQuote.warningName = this.customerWarningData[
            i
          ].warningMessage;
          this.salesQuote.warningId = this.customerWarningData[i].customerWarningId
        }
      }
    }
  }

  updateApproverDetails(approver) {
    if (this.allEmployeeinfo) {
      for (let i = 0; i < this.allEmployeeinfo.length; i++) {
        let employeeId = approver.employeeId;
        if (employeeId == this.allEmployeeinfo[i].employeeId) {
          approver.firstName = this.allEmployeeinfo[i].firstName;
          approver.employeeCode = this.allEmployeeinfo[i].employeeCode;
          approver.email = this.allEmployeeinfo[i].email;
        }
      }
    }
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
    this.salesQuote.managementStructureId = this.salesOrderObj.managementStructureId;
    this.managementStructureId = this.salesOrderObj.managementStructureId;
    this.salesQuote.priorities = this.salesOrderView.priorities;
    this.salesQuote.leadSources = this.salesOrderView.leadSources;
    this.salesQuote.salesQuoteTypes = this.salesOrderView.salesQuoteTypes;
    this.salesQuote.status = this.salesOrderView.status;
    this.status = this.salesOrderView.status && this.salesOrderView.status.length > 0 ? this.salesOrderView.status.slice(0) : [];
    this.salesQuote.salesOrderQuoteId = this.salesOrderObj.salesOrderQuoteId;
    this.salesQuote.quoteTypeId = this.salesOrderObj.typeId;
    this.salesQuote.statusId = this.salesOrderObj.statusId;
    this.salesQuote.statusChangeDate = null;
    this.salesQuote.openDate = new Date(this.salesOrderObj.openDate);
    this.salesQuote.numberOfItems = this.salesOrderObj.numberOfItems;
    this.salesQuote.salesOrderNumber = this.salesOrderObj.salesOrderNumber;
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
      "employeeId",
      this.salesOrderObj.employeeId,
      this.allEmployeeinfo
    );

    this.salesOrderQuote.managementStructureId = this.salesOrderObj.managementStructureId;
    this.salesOrderQuote.shipToUserTypeId = this.salesOrderObj.shipToUserTypeId;
    this.salesOrderQuote.shipToUserId = this.salesOrderObj.shipToUserId;
    this.salesOrderQuote.shipToAddressId = this.salesOrderObj.shipToAddressId;
    this.salesOrderQuote.shipViaId = this.salesOrderObj.shipViaId;
    this.salesOrderQuote.billToContactId = this.salesOrderObj.billToContactId;
    this.salesOrderQuote.shipToContactId = this.salesOrderObj.shipToContactId;
    this.salesOrderQuote.shipToSiteName = this.salesOrderObj.shipToSiteName;
    this.salesOrderQuote.shipToAddress1 = this.salesOrderObj.shipToAddress1;
    this.salesOrderQuote.shipToAddress2 = this.salesOrderObj.shipToAddress2;
    this.salesOrderQuote.shipToCity = this.salesOrderObj.shipToCity;
    this.salesOrderQuote.shipToState = this.salesOrderObj.shipToState;
    this.salesOrderQuote.shipToPostalCode = this.salesOrderObj.shipToPostalCode;
    this.salesOrderQuote.shipToCountry = this.salesOrderObj.shipToCountry;
    this.salesOrderQuote.shipViaName = this.salesOrderObj.shipViaName;
    this.salesOrderQuote.shipViaShippingAccountInfo = this.salesOrderObj.shipViaShippingAccountInfo;
    this.salesOrderQuote.shippingId = this.salesOrderObj.shippingId;
    this.salesOrderQuote.shippingURL = this.salesOrderObj.shippingURL;
    this.salesOrderQuote.shipViaMemo = this.salesOrderObj.shipViaMemo;
    this.salesOrderQuote.shipViaShippingURL = this.salesOrderObj.shipViaShippingURL;
    this.salesOrderQuote.billToUserTypeId = this.salesOrderObj.billToUserTypeId;
    this.salesOrderQuote.billToUserId = this.salesOrderObj.billToUserId;
    this.salesOrderQuote.billToAddressId = this.salesOrderObj.billToAddressId;
    this.salesOrderQuote.billToSiteName = this.salesOrderObj.billToSiteName;
    this.salesOrderQuote.billToAddress1 = this.salesOrderObj.billToAddress1;
    this.salesOrderQuote.billToAddress2 = this.salesOrderObj.billToAddress2;
    this.salesOrderQuote.billToCity = this.salesOrderObj.billToCity;
    this.salesOrderQuote.billToState = this.salesOrderObj.billToState;
    this.salesOrderQuote.billToPostalCode = this.salesOrderObj.billToPostalCode;
    this.salesOrderQuote.billToCountry = this.salesOrderObj.billToCountry;
    this.salesOrderQuote.billToMemo = this.salesOrderObj.billToMemo;

    this.salesOrderQuote.salesOrderQuoteId = this.salesOrderObj.salesOrderQuoteId;
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

    this.getCustomerDetails();

    // if (this.managementStructureComponent) {
    //   this.managementStructureComponent.load(this.currentUserManagementStructureId);
    // }
  }

  getSalesOrderInstance(salesOrderId: number) {
    this.isSpinnerVisible = true;
    this.salesOrderService.getSalesOrder(salesOrderId).subscribe(data => {
      this.load(this.managementStructureId);
      this.isSpinnerVisible = false;
      if (data) {
        this.salesOrderView = data && data.length ? data[0] : null;
        this.bindData(this.salesOrderView);
      }
    }, error => {
      this.isSpinnerVisible = false;
      const errorLog = error;
      this.onDataLoadFailed(errorLog)
    });
  }

  copySalesOrderInstance(salesOrderId: number) {
    this.isSpinnerVisible = true;
    this.salesOrderService.copy(salesOrderId).subscribe(data => {
      this.getSOMarginSummary();
      this.load(this.managementStructureId);
      this.salesOrderView = data && data.length ? data[0] : null;
      if (this.salesOrderCopyParameters) {
        if (!this.salesOrderCopyParameters.copyParts) {
          this.salesOrderView.parts = [];
        }
      }
      this.bindData(this.salesOrderView);
      this.isSpinnerVisible = false;
    }, error => {
      this.isSpinnerVisible = false;
      const errorLog = error;
      this.onDataLoadFailed(errorLog)
    });
  }

  bindData(salesOrderView: ISalesOrderView) {
    this.salesOrderObj = salesOrderView.salesOrder;

    if (this.salesOrderObj && this.salesOrderObj.salesOrderQuoteId && this.salesOrderObj.salesOrderQuoteId) {
      this.controlSettings.showViewQuote = true;
    }
    let partList: any[] = this.salesOrderView.parts;
    for (let i = 0; i < partList.length; i++) {
      let selectedPart = partList[i];
      let partNumberObj = this.salesOrderService.marshalSOPartToView(selectedPart, this.salesOrderObj);
      this.selectedParts.push(partNumberObj);
    }
    this.marginSummary = this.salesQuoteService.getSalesQuoteHeaderMarginDetails(this.selectedParts, this.marginSummary);
    this.salesOrderPartNumberComponent.refresh();
    this.salesQuote.managementStructureId = this.salesOrderObj.managementStructureId;
    this.managementStructureId = this.salesOrderObj.managementStructureId;
    this.salesQuote.priorities = this.salesOrderView.priorities;
    this.salesQuote.leadSources = this.salesOrderView.leadSources;
    this.salesQuote.salesQuoteTypes = this.salesOrderView.salesQuoteTypes;
    this.salesQuote.status = this.salesOrderView.status;
    this.salesQuote.statusId = this.salesOrderObj.statusId;
    this.salesQuote.masterCompanyId = this.masterCompanyId;
    this.status = this.salesQuote.status && this.salesQuote.status.length > 0 ? this.salesQuote.status.slice(0) : [];
    this.salesQuote.salesOrderQuoteId = this.salesOrderObj.salesOrderQuoteId;
    this.salesQuote.quoteTypeId = this.salesOrderObj.typeId;
    this.salesQuote.statusChangeDate = new Date(this.salesOrderObj.statusChangeDate);
    this.salesQuote.openDate = new Date(this.salesOrderObj.openDate);
    this.salesQuote.contractReferenceName = this.salesOrderObj.contractReference;
    this.salesQuote.versionNumber = this.salesOrderObj.salesOrderQuoteVersionNumber;;
    this.salesQuote.numberOfItems = this.salesOrderObj.numberOfItems;
    this.salesQuote.salesOrderNumber = this.salesOrderObj.salesOrderNumber;
    this.salesQuote.accountTypeId = this.salesOrderObj.accountTypeId;
    this.salesQuote.customerId = this.salesOrderObj.customerId;
    this.salesQuote.customerContactId = this.salesOrderObj.customerContactId;
    this.salesQuote.customerReferenceName = this.salesOrderObj.customerReference;
    this.salesQuote.quoteApprovedById = this.salesOrderObj.approvedById;
    this.salesQuote.totalSalesAmount = this.salesOrderObj.totalSalesAmount;
    this.salesQuote.customerHold = this.salesOrderObj.customerHold;
    this.salesQuote.depositAmount = this.salesOrderObj.depositAmount;
    this.salesQuote.balanceDue = this.salesOrderObj.balanceDue;
    this.salesQuote.salesOrderQuoteNumber = this.salesOrderObj.salesOrderQuoteNumber;
    this.setSalesPerson();
    this.setCSR();
    this.salesQuote.employeeName = getObjectById(
      "employeeId",
      this.salesOrderObj.employeeId,
      this.allEmployeeinfo
    );

    this.salesOrderQuote.managementStructureId = this.salesOrderObj.managementStructureId;
    this.salesOrderQuote.shipToUserTypeId = this.salesOrderObj.shipToUserTypeId;
    this.salesOrderQuote.shipToUserId = this.salesOrderObj.shipToUserId;
    this.salesOrderQuote.shipToAddressId = this.salesOrderObj.shipToAddressId;
    this.salesOrderQuote.shipViaId = this.salesOrderObj.shipViaId;
    this.salesOrderQuote.billToContactId = this.salesOrderObj.billToContactId;
    this.salesOrderQuote.shipToContactId = this.salesOrderObj.shipToContactId;
    this.salesOrderQuote.shipToSiteName = this.salesOrderObj.shipToSiteName;
    this.salesOrderQuote.shipToAddress1 = this.salesOrderObj.shipToAddress1;
    this.salesOrderQuote.shipToAddress2 = this.salesOrderObj.shipToAddress2;
    this.salesOrderQuote.shipToCity = this.salesOrderObj.shipToCity;
    this.salesOrderQuote.shipToState = this.salesOrderObj.shipToState;
    this.salesOrderQuote.shipToPostalCode = this.salesOrderObj.shipToPostalCode;
    this.salesOrderQuote.shipToCountry = this.salesOrderObj.shipToCountry;
    this.salesOrderQuote.shipViaName = this.salesOrderObj.shipViaName;
    this.salesOrderQuote.shipViaShippingAccountInfo = this.salesOrderObj.shipViaShippingAccountInfo;
    this.salesOrderQuote.shippingId = this.salesOrderObj.shippingId;
    this.salesOrderQuote.shippingURL = this.salesOrderObj.shippingURL;
    this.salesOrderQuote.shipViaMemo = this.salesOrderObj.shipViaMemo;
    this.salesOrderQuote.shipViaShippingURL = this.salesOrderObj.shipViaShippingURL;
    this.salesOrderQuote.billToUserTypeId = this.salesOrderObj.billToUserTypeId;
    this.salesOrderQuote.billToUserId = this.salesOrderObj.billToUserId;
    this.salesOrderQuote.billToAddressId = this.salesOrderObj.billToAddressId;
    this.salesOrderQuote.billToSiteName = this.salesOrderObj.billToSiteName;
    this.salesOrderQuote.billToAddress1 = this.salesOrderObj.billToAddress1;
    this.salesOrderQuote.billToAddress2 = this.salesOrderObj.billToAddress2;
    this.salesOrderQuote.billToCity = this.salesOrderObj.billToCity;
    this.salesOrderQuote.billToState = this.salesOrderObj.billToState;
    this.salesOrderQuote.billToPostalCode = this.salesOrderObj.billToPostalCode;
    this.salesOrderQuote.billToCountry = this.salesOrderObj.billToCountry;
    this.salesOrderQuote.billToMemo = this.salesOrderObj.billToMemo;

    this.salesOrderQuote.salesOrderQuoteId = this.salesOrderObj.salesOrderQuoteId;

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
    this.salesQuote.salesOrderQuoteNumber = this.salesOrderObj.salesOrderQuoteNumber;
    this.salesQuote.isApproved = this.salesOrderObj.isApproved;
    this.getCustomerDetails();
    // if (this.managementStructureComponent) {
    //   this.managementStructureComponent.load(this.currentUserManagementStructureId);
    // }
  }

  getNewSalesOrderInstance(customerId: number) {
    this.isSpinnerVisible = true;
    this.salesOrderService
      .getNewSalesOrderInstance(customerId)
      .subscribe(data => {
        this.salesQuote = data && data.length ? data[0] : null;

        this.load(this.managementStructureId);
        if (this.salesQuote) {
          this.status = this.salesQuote.status && this.salesQuote.status.length > 0 ? this.salesQuote.status.slice(0) : [];
        }
        this.salesQuote.shippedDate = null;
        this.salesQuote.openDate = new Date();
        this.salesQuote.statusId = this.status[0].id;
        this.salesQuote.validForDays = 10;
        this.salesQuote.quoteExpiryDate = new Date();
        this.onChangeValidForDays();
        this.getCustomerDetails();
        this.getDefaultContact();
        this.salesQuote.employeeName = getObjectById(
          "employeeId",
          this.employeeId,
          this.allEmployeeinfo
        );
        this.salesQuote.salesOrderNumber = "Generating";
        // if (this.managementStructureComponent) {
        //   this.managementStructureComponent.load(this.currentUserManagementStructureId);
        // }
        this.isSpinnerVisible = false;
      }, error => {
        this.isSpinnerVisible = false;
        const errorLog = error;
        this.onDataLoadFailed(errorLog)
      });
  }

  onChangeValidForDays() {
    let od = new Date(this.salesQuote.openDate);
    let validForDays = +this.salesQuote.validForDays;
    let ed = new Date(this.salesQuote.openDate);
    ed.setDate(od.getDate() + validForDays);
    this.salesQuote.quoteExpiryDate = ed;
  }

  onChangeQuoteExpiryDate() {
    let od = new Date(this.salesQuote.openDate);
    let ed = new Date(this.salesQuote.quoteExpiryDate);
    let Difference_In_Time = ed.getTime() - od.getTime();
    let Difference_In_Days = Math.floor(
      Difference_In_Time / (1000 * 3600 * 24)
    );
    this.salesQuote.validForDays = Difference_In_Days;
  }

  onChangeOpenDate() {
    let od = new Date(this.salesQuote.openDate);
    let validForDays = +this.salesQuote.validForDays;
    let ed = new Date(this.salesQuote.openDate);
    ed.setDate(od.getDate() + validForDays);
    this.salesQuote.quoteExpiryDate = ed;
    this.enableUpdateButton = false;
  }

  searchCustomerByName(event) {
    this.customerService
      .getcustomerByNameList(event.query)
      .subscribe((results: any) => {
        this.customers = results.length > 0 ? results[0] : [];
      }, error => {
        this.isSpinnerVisible = false;
        const errorLog = error;
        this.onDataLoadFailed(errorLog)
      });
  }

  onCustomerNameSelect(customer: any) {
    this.salesQuote.customerId = customer.customerId;
    this.salesQuote.customerCode = customer.customerCode;
  }
  viewSelectedRow() {
    this.modal = this.modalService.open(CustomerViewComponent, { size: "lg", backdrop: 'static', keyboard: false });
    this.modal.componentInstance.customerId = this.customerId;
    this.modal.result.then(
      () => {
      },
      () => {
      }
    );
  }

  setValidDaysBasedOnSettings(isEditMode) {
    if (this.soSettingsList.length > 0) {
      let settingsObject = this.soSettingsList[0];
      if (settingsObject) {
        if (!isEditMode) {
          this.salesQuote.quoteTypeId = settingsObject.typeId;
          this.salesQuote.statusId = settingsObject.defaultStatusId;
          this.salesQuote.statusName = settingsObject.defaultStatusName;
        }
        this.defaultSettingPriority = settingsObject.defaultPriorityId;
      } else {
        if (this.salesQuote.salesQuoteTypes.length > 0) {
          this.salesQuote.quoteTypeId = this.salesQuote.salesQuoteTypes[0].id;
        }
      }
    } else {
      if (this.salesQuote.salesQuoteTypes.length > 0) {
        this.salesQuote.quoteTypeId = this.salesQuote.salesQuoteTypes[0].id;
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
    if (!this.salesQuote.employeeName) {
      this.errorMessages.push("Please select employee");
      haveError = true;
    }
    if (this.isCreateModeHeader) {
      if (!this.salesOrderQuote.shipToSiteName) {
        this.errorMessages.push("Please select Ship To SiteName");
        haveError = true;
      }
      if (!this.salesOrderQuote.shipToContactId) {
        this.errorMessages.push("Please select Ship To Contact");
        haveError = true;
      }
      if (!this.salesOrderQuote.billToSiteName) {
        this.errorMessages.push("Please select Bill To SiteName");
        haveError = true;
      }
      if (!this.salesOrderQuote.billToContactId) {
        this.errorMessages.push("Please select Bill To Contact");
        haveError = true;
      }
    }
    if (haveError) {
      let content = this.errorMessagePop;
      this.errorModal = this.modalService.open(content, { size: "sm", backdrop: 'static', keyboard: false });
      this.errorModal.result.then(
        () => {
        },
        () => {
        }
      );
      this.display = true;
    } else {
      this.display = false;
      this.isSpinnerVisible = true;
      this.salesOrder = new SalesOrder();
      this.salesOrder.salesOrderId = this.id;
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
      this.salesOrder
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
      if (this.customerWarning) {
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
        "employeeId",
        this.salesQuote.employeeName
      );
      this.salesOrder.billToContactName = editValueAssignByCondition(
        "firstName",
        this.salesOrderQuote.billToContactId
      );
      this.salesOrder.billToContactId = editValueAssignByCondition(
        "contactId",
        this.salesOrderQuote.billToContactId
      );
      this.salesOrder.shipToContactName = editValueAssignByCondition(
        "firstName",
        this.salesOrderQuote.shipToContactId
      );
      this.salesOrder.shipToContactId = editValueAssignByCondition(
        "contactId",
        this.salesOrderQuote.shipToContactId
      );
      this.salesOrder.shipToUserId = editValueAssignByCondition(
        "value",
        this.salesOrderQuote.shipToUserId
      );
      this.salesOrder.billToUserId = editValueAssignByCondition(
        "value",
        this.salesOrderQuote.billToUserId
      );
      if (this.id) {
        this.salesOrder.statusId = this.salesQuote.statusId;
        this.salesOrder.statusChangeDate = null;
      }
      this.salesOrder.shipToUserTypeId = this.salesOrderQuote.shipToUserTypeId;
      this.salesOrder.shipToAddressId = this.salesOrderQuote.shipToAddressId;
      this.salesOrder.shipViaId = this.salesOrderQuote.shipViaId;
      this.salesOrder.shipToSiteName = this.salesOrderQuote.shipToSiteName;
      this.salesOrder.shipToAddress1 = this.salesOrderQuote.shipToAddress1;
      this.salesOrder.shipToAddress2 = this.salesOrderQuote.shipToAddress2;
      this.salesOrder.shipToCity = this.salesOrderQuote.shipToCity;
      this.salesOrder.shipToState = this.salesOrderQuote.shipToState;
      this.salesOrder.shipToPostalCode = this.salesOrderQuote.shipToPostalCode;
      this.salesOrder.shipToCountry = this.salesOrderQuote.shipToCountry;
      this.salesOrder.shipViaName = this.salesOrderQuote.shipViaName;
      this.salesOrder.shipViaShippingAccountInfo = this.salesOrderQuote.shipViaShippingAccountInfo;
      this.salesOrder.shippingId = this.salesOrderQuote.shippingId;
      this.salesOrder.shippingURL = this.salesOrderQuote.shippingURL;
      this.salesOrder.shipViaMemo = this.salesOrderQuote.shipViaMemo;
      this.salesOrder.shipViaShippingURL = this.salesOrderQuote.shipViaShippingURL;
      this.salesOrder.billToUserTypeId = this.salesOrderQuote.billToUserTypeId;
      this.salesOrder.billToAddressId = this.salesOrderQuote.billToAddressId;
      this.salesOrder.billToSiteName = this.salesOrderQuote.billToSiteName;
      this.salesOrder.billToAddress1 = this.salesOrderQuote.billToAddress1;
      this.salesOrder.billToAddress2 = this.salesOrderQuote.billToAddress2;
      this.salesOrder.billToCity = this.salesOrderQuote.billToCity;
      this.salesOrder.billToState = this.salesOrderQuote.billToState;
      this.salesOrder.billToPostalCode = this.salesOrderQuote.billToPostalCode;
      this.salesOrder.billToCountry = this.salesOrderQuote.billToCountry;
      this.salesOrder.billToMemo = this.salesOrderQuote.billToMemo;
      this.salesOrderQuote.salesOrderQuoteId = null;
      this.salesOrder.memo = this.salesQuote.memo;
      this.salesOrder.notes = this.salesQuote.notes;
      this.salesOrder.createdBy = this.userName;
      this.salesOrder.updatedBy = this.userName;
      this.salesOrder.createdOn = new Date().toDateString();
      this.salesOrder.updatedOn = new Date().toDateString();
      this.salesOrderView = new SalesOrderView();
      if (this.salesQuote.salesOrderQuoteId) {
        this.salesOrder.salesOrderQuoteId = this.salesQuote.salesOrderQuoteId;
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
          if (selectedPart.customerRequestDate < this.salesQuote.openDate ||
            selectedPart.estimatedShipDate < this.salesQuote.openDate ||
            selectedPart.promisedDate < this.salesQuote.openDate) {
            invalidDate = true;
          }
        }
        if (!invalidDate && !invalidParts) {
          let partNumberObj = this.salesOrderService.marshalSOPartToSave(selectedPart, this.userName);
          partList.push(partNumberObj);
        }
      }
      this.salesOrderView.parts = partList;
      this.marginSummary = this.salesQuoteService.getSalesQuoteHeaderMarginDetails(this.salesOrderView.parts, this.marginSummary);
      if (this.id) {
        if (invalidParts) {
          this.isSpinnerVisible = false;
          this.alertService.resetStickyMessage();
          this.alertService.showStickyMessage('Sales Order', errmessage, MessageSeverity.error);
        } else if (invalidDate) {
          this.isSpinnerVisible = false;
          this.alertService.resetStickyMessage();
          this.alertService.showStickyMessage('Sales Order', "Please select valid Dates for Sales Order PartsList!", MessageSeverity.error);
        } else {
          this.marginSummary.salesOrderId = this.id;
          this.salesOrderService.createSOMarginSummary(this.marginSummary).subscribe(result => {
            this.marginSummary.soMarginSummaryId = result;
          }, error => this.onDataLoadFailed(error));
          this.salesOrderService.update(this.salesOrderView).subscribe(data => {
            this.isSpinnerVisible = false;
            this.alertService.showMessage(
              "Success",
              `Sales Order updated successfully.`,
              MessageSeverity.success
            );
            this.router.navigateByUrl(`salesmodule/salespages/sales-order-list`);
          }, error => {
            this.isSpinnerVisible = false;
            const errorLog = error;
            this.onDataLoadFailed(errorLog)
          });
        }
      } else {
        this.salesOrderService.create(this.salesOrderView).subscribe(data => {
          this.salesCreateHeaderOrderId = data[0].salesOrderId;
          this.salesOrderView.salesOrder.salesOrderId = this.salesCreateHeaderOrderId;
          this.isCreateModeHeader = true;
          this.isHeaderSubmit = true;
          this.isSpinnerVisible = false;
          this.alertService.showMessage(
            "Success",
            `Sales Order created successfully.`,
            MessageSeverity.success
          );
          this.toggle_po_header = false;
          this.id = this.salesCreateHeaderOrderId;
          if (this.salesCreateHeaderOrderId) {

            this.getSalesOrderInstance(this.salesCreateHeaderOrderId);
            this.getCustomerDetails()
            this.isEdit = true;
          }
          if (!this.isCreateModeHeader) {
            this.router.navigateByUrl(`salesmodule/salespages/sales-quote-list`);
          }
        }, error => {
          this.isSpinnerVisible = false;
          const errorLog = error;
          this.onDataLoadFailed(errorLog)
        });
      }
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
      this.modal.result.then(
        () => {
        },
        () => {
        }
      );
      this.isSpinnerVisible = false;
    }, error => {
      this.isSpinnerVisible = false;
      const errorLog = error;
      this.onDataLoadFailed(errorLog)
    });
  }

  onSalesOrderActionClick(eventArgs: SalesOrderEventArgs): void {
    this.isEmailTabEnabled = true;
    switch (eventArgs.actionType) {


      case SalesOrderActionType.NewSalesOrder:
        this.router.navigateByUrl(
          `salesmodule/salespages/sales-order-create/${this.salesOrderView.salesOrder.customerId}`
        );
        break;
      case SalesOrderActionType.ViewQuote:
        if (this.salesOrderQuote.salesOrderQuoteId) {
          this.viewSoQuote(this.viewQuoteModal, this.salesOrderQuote.salesOrderQuoteId);
        }
        break;
      case SalesOrderActionType.CloseSalesOrder:
        if (eventArgs.confirmType === SalesOrderConfirmationType.Yes) {
          this.salesOrderService.close(this.salesOrderView.salesOrder.salesOrderId).subscribe(result => {
            this.router.navigateByUrl(`salesmodule/salespages/sales-order-list`);
          }, error => {
            this.isSpinnerVisible = false;
            const errorLog = error;
            this.onDataLoadFailed(errorLog)
          });
        }
        break;
      case SalesOrderActionType.CancelSalesOrder:
        if (eventArgs.confirmType === SalesOrderConfirmationType.Yes) {
          this.salesOrderService.cancel(this.salesOrderView.salesOrder.salesOrderId).subscribe(result => {
            this.router.navigateByUrl(`salesmodule/salespages/sales-order-list`);
          }, error => {
            this.isSpinnerVisible = false;
            const errorLog = error;
            this.onDataLoadFailed(errorLog)
          });
        }
        break;
      case SalesOrderActionType.MakeDuplicate:
        break;
      case SalesOrderActionType.Memo:
        this.selectedCommunicationTab = "memo";
        break;
      case SalesOrderActionType.Email:
        this.selectedCommunicationTab = "email";

        break;
      case SalesOrderActionType.Phone:
        this.selectedCommunicationTab = "phone";
        break;
      case SalesOrderActionType.Text:
        this.selectedCommunicationTab = "text";

        break;
      case SalesOrderActionType.EmailSalesOrder:
        this.selectedCommunicationTab = "Quotemail";
        break;

    }
  }

  quote: any = {
    quoteTypeId: null,
    quoteDate: Date
  };
  openConfirmationModal(submitType: boolean) {

    this.submitType = submitType;

    this.modal = this.modalService.open(this.updateConfirmationModal, { size: "sm", backdrop: 'static', keyboard: false });
    this.modal.result.then(
      () => {
      },
      () => {
      }
    );
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
  inititateEmailQuote() {

    this.selectedCommunicationTab = "Quotemail";
    this.isEmailTabEnabled = true;

  }
  onTabChange(event) {
    if (event.index == 0) {
      this.salesOrderPartNumberComponent.refresh();
    }
    if (event.index == 1) {
      this.salesOrderApproveComponent.refresh(this.marginSummary);
    }
    if (event.index == 2) {
      this.salesOrderCustomerApprovalComponent.refresh(this.marginSummary, this.salesOrderView.salesOrder.salesOrderId, this.salesOrderView.salesOrder.salesOrderQuoteId);
    }
    if (event.index == 3) {
      this.salesAddressComponent.refresh(this.salesOrderQuote)
    }
    if (event.index == 4) {

      this.salesOrderFreightComponent.refresh(false);
    }
    if (event.index == 5) {
      this.salesOrderChargesComponent.refresh(false);
    }
    if (event.index == 6) {
      this.salesOrderShippingComponent.refresh(this.selectedParts);
    }
    if (event.index == 7) {
      this.salesOrderBillingComponent.refresh(this.selectedParts);
    }

    if (event.index == 9) {
      this.salesOrderAnalysisComponent.refresh(this.id);
    }
  }

  updateMarginSummary() {
    this.isSpinnerVisible = true;
    this.marginSummary.salesOrderId = this.id;
    this.salesOrderService.createSOMarginSummary(this.marginSummary).subscribe(result => {
      this.marginSummary.soMarginSummaryId = result;
      this.isSpinnerVisible = false;
    }, error => {
      this.isSpinnerVisible = false;
      const errorLog = error;
      this.onDataLoadFailed(errorLog)
    });
  }

  onPartsSaveEvent(savedParts) {
    if (savedParts) {
      this.marginSummary = this.salesQuoteService.getSalesQuoteHeaderMarginDetails(savedParts, this.marginSummary);
      this.updateMarginSummary();
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
    this.salesOrderService.setTotalFreights(e);
    this.setFreightsOrCharges();
    this.updateMarginSummary();
  }

  updateSalesOrderFreightsList(e) {
    this.totalFreights = e;
    this.marginSummary.freightAmount = this.totalFreights;
    this.salesOrderService.setTotalFreights(e);
    this.setFreightsOrCharges();
    this.updateMarginSummary();
  }

  getFreightList() {
  }

  saveSalesOrderChargesList(e) {
    this.totalCharges = e;
    this.salesOrderService.setTotalCharges(e);
    this.marginSummary.misc = this.totalCharges;
    this.setFreightsOrCharges();
    this.updateMarginSummary();
  }

  updateSalesOrderChargesList(e) {
    this.totalCharges = e;
    this.salesOrderService.setTotalCharges(e);
    this.marginSummary.misc = this.totalCharges;
    this.setFreightsOrCharges();
    this.updateMarginSummary();
  }

  getChargesList() {
  }

  load(managementStructureId: number) {
    this.managementStructureId = managementStructureId;
    this.getManagementStructureDetails(managementStructureId, this.employeeId);
  }


  enableHeaderSave() {
    this.enableHeaderSaveBtn = true;
  }
  checkValidOnChange(condition, value) {
    if (condition != null && condition != 0 && value == "companyId") {
      this.managementValidCheck = false;
    }
  }
  getManagementStructureDetails(id, empployid = 0, editMSID = 0) {
    empployid = empployid == 0 ? this.employeeId : empployid;
    editMSID = this.isEditModeHeader ? editMSID = id : 0;
    this.commonservice.getManagmentStrctureData(id, empployid, editMSID).subscribe(response => {
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
      const errorLog = err;
      this.errorMessageHandler(errorLog);
    });
  }

  employeedata(strText = '', manStructID = 0) {
    if (this.arrayEmplsit.length == 0) {
      this.arrayEmplsit.push(0);
    }
    this.arrayEmplsit.push(this.employeeId == null ? 0 : this.employeeId);
    this.commonservice.autoCompleteDropdownsEmployeeByMS(strText, true, 20, this.arrayEmplsit.join(), manStructID).subscribe(res => {
      this.allEmployeeList = res;
      this.requisitionerList = res;
      this.currentUserEmployeeName = getValueFromArrayOfObjectById('label', 'value', this.employeeId, res);
      if (!this.isEdit) {
        this.getRequisitionerOnLoad(this.employeeId);
      }
    }, err => {
      const errorLog = err;
      this.errorMessageHandler(errorLog);
    })
  }
  getRequisitionerOnLoad(id) {
    this.salesQuote['requisitionerId'] = getObjectById('value', id, this.allEmployeeList);
  }
  errorMessageHandler(log) {
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


  getManagementStructureForChildEdit(partChildList) {
    var editMSID = this.isEditModeHeader ? partChildList.managementStructureId : 0;
    this.commonservice.getManagmentStrctureData(partChildList.managementStructureId, this.employeeId, editMSID).subscribe(response => {
      if (response) {
        const result = response;
        if (result[0] && result[0].level == 'Level1') {
          partChildList.maincompanylist = result[0].lstManagmentStrcture;
          partChildList.childCompanyId = result[0].managementStructureId;
          partChildList.managementStructureId = result[0].managementStructureId;
          partChildList.childBulist = [];
          partChildList.childDivisionlist = [];
          partChildList.childDepartmentlist = [];
          partChildList.childbuId = 0;
          partChildList.childDivisionId = 0;
          partChildList.childDeptId = 0;

        } else {
          partChildList.maincompanylist = [];
          partChildList.childBulist = [];
          partChildList.childDivisionlist = [];
          partChildList.childDepartmentlist = [];
          partChildList.childCompanyId = 0;
          partChildList.childbuId = 0;
          partChildList.childDivisionId = 0;
          partChildList.childDeptId = 0;
        }

        if (result[1] && result[1].level == 'Level2') {
          partChildList.childBulist = result[1].lstManagmentStrcture;
          partChildList.managementStructureId = result[1].managementStructureId;
          partChildList.childbuId = result[1].managementStructureId;
          partChildList.childDivisionlist = [];
          partChildList.childDepartmentlist = [];
          partChildList.childDivisionId = 0;
          partChildList.childDeptId = 0;
        } else {
          if (result[1] && result[1].level == 'NEXT') {
            partChildList.childBulist = result[1].lstManagmentStrcture;
          }
          partChildList.childDivisionlist = [];
          partChildList.childDepartmentlist = [];
          partChildList.childbuId = 0;
          partChildList.childDivisionId = 0;
          partChildList.childDeptId = 0;
        }

        if (result[2] && result[2].level == 'Level3') {
          partChildList.childDivisionlist = result[2].lstManagmentStrcture;
          partChildList.childDivisionId = result[2].managementStructureId;
          partChildList.managementStructureId = result[2].managementStructureId;
          partChildList.childDeptId = 0;
          partChildList.childDepartmentlist = [];
        } else {
          if (result[2] && result[2].level == 'NEXT') {
            partChildList.childDivisionlist = result[2].lstManagmentStrcture;
          }
          partChildList.childDepartmentlist = [];
          partChildList.childDivisionId = 0;
          partChildList.childDeptId = 0;
        }

        if (result[3] && result[3].level == 'Level4') {
          partChildList.childDepartmentlist = result[3].lstManagmentStrcture;;
          partChildList.childDeptId = result[3].managementStructureId;
          partChildList.managementStructureId = result[3].managementStructureId;
        } else {
          if (result[3] && result[3].level == 'NEXT') {
            partChildList.childDepartmentlist = result[3].lstManagmentStrcture;
          }

          partChildList.childDeptId = 0;
        }

      }
    })
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
      this.commonservice.getManagementStructurelevelWithEmployee(legalEntityId, this.employeeId).subscribe(res => {
        this.bulist = res;
      });
    }
    else {
      this.salesQuote.managementStructureId = 0;
      this.salesQuote.companyId = 0;
    }

  }

  getParentBUList(partList) {
    partList.parentBulist = [];
    partList.parentDivisionlist = [];
    partList.parentDepartmentlist = [];
    partList.parentbuId = 0;
    partList.parentDivisionId = 0;
    partList.parentDeptId = 0;
    if (partList.childList) {
      for (let j = 0; j < partList.childList.length; j++) {
        partList.childList[j].childCompanyId = partList.parentCompanyId;
        partList.childList[j].childBulist = [];
        partList.childList[j].childDivisionlist = [];
        partList.childList[j].childDepartmentlist = [];
        partList.childList[j].childbuId = 0;
        partList.childList[j].childDivisionId = 0;
        partList.childList[j].childDeptId = 0;
      }
    }

    if (partList.parentCompanyId != 0 && partList.parentCompanyId != null && partList.parentCompanyId != undefined) {
      partList.managementStructureId = partList.parentCompanyId;
      this.commonservice.getManagementStructurelevelWithEmployee(partList.parentCompanyId, this.employeeId).subscribe(res => {
        partList.parentBulist = res;
        if (partList.childList) {
          for (let j = 0; j < partList.childList.length; j++) {
            partList.childList[j].childBulist = partList.parentBulist;
            partList.childList[j].childCompanyId = partList.parentCompanyId;
            partList.childList[j].managementStructureId = partList.parentCompanyId;
          }
        }

      });
    }
    else {
      partList.managementStructureId = 0;
      if (partList.childList) {
        for (let j = 0; j < partList.childList.length; j++) {
          partList.childList[j].managementStructureId = 0;
        }
      }
    }
  }

  getChildBUList(partChildList) {
    partChildList.childBulist = [];
    partChildList.childDivisionlist = [];
    partChildList.childDepartmentlist = [];
    partChildList.childbuId = 0;
    partChildList.childDivisionId = 0;
    partChildList.childDeptId = 0;
    if (partChildList.childCompanyId != 0 && partChildList.childCompanyId != null && partChildList.childCompanyId != undefined) {
      partChildList.managementStructureId = partChildList.childCompanyId;
      this.commonservice.getManagementStructurelevelWithEmployee(partChildList.childCompanyId, this.employeeId).subscribe(res => {
        partChildList.childBulist = res;
      });
    }
    else {
      partChildList.managementStructureId = 0;
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
      this.commonservice.getManagementStructurelevelWithEmployee(buId, this.employeeId).subscribe(res => {
        this.divisionlist = res;
      });
      // for (let i = 0; i < this.partListData.length; i++) {
      // 	this.partListData[i].parentbuId = buId;
      // 	this.getParentDivisionlist(this.partListData[i]);
      // }		
    } else {
      this.salesQuote.managementStructureId = this.salesQuote.companyId;
    }

  }

  getParentDivisionlist(partList) {

    partList.parentDivisionlist = [];
    partList.parentDepartmentlist = [];
    partList.parentDivisionId = 0;
    partList.parentDeptId = 0;
    if (partList.childList) {
      for (let j = 0; j < partList.childList.length; j++) {
        partList.childList[j].childbuId = partList.parentbuId;
        partList.childList[j].childDivisionlist = [];
        partList.childList[j].childDepartmentlist = [];
        partList.childList[j].childDivisionId = 0;
        partList.childList[j].childDeptId = 0;
      }
    }
    if (partList.parentbuId != 0 && partList.parentbuId != null && partList.parentbuId != undefined) {
      partList.managementStructureId = partList.parentbuId;
      this.commonservice.getManagementStructurelevelWithEmployee(partList.parentbuId, this.employeeId).subscribe(res => {
        partList.parentDivisionlist = res;
        if (partList.childList) {
          for (let j = 0; j < partList.childList.length; j++) {
            partList.childList[j].childDivisionlist = partList.parentDivisionlist;
            partList.childList[j].childbuId = partList.parentbuId;
            partList.childList[j].managementStructureId = partList.parentbuId;
          }
        }
      });
    }
    else {
      partList.managementStructureId = partList.parentCompanyId;
      if (partList.childList) {
        for (let j = 0; j < partList.childList.length; j++) {
          partList.childList[j].managementStructureId = partList.parentCompanyId;
        }
      }

    }
  }



  getChildDivisionlist(partChildList) {
    partChildList.childDivisionId = 0;
    partChildList.childDeptId = 0;
    partChildList.childDivisionlist = [];
    partChildList.childDepartmentlist = [];
    if (partChildList.childbuId != 0 && partChildList.childbuId != null && partChildList.childbuId != undefined) {
      partChildList.managementStructureId = partChildList.childbuId;
      this.commonservice.getManagementStructurelevelWithEmployee(partChildList.childbuId, this.employeeId).subscribe(res => {
        partChildList.childDivisionlist = res;
      });
    }
    else {
      partChildList.managementStructureId = partChildList.childCompanyId;;
    }

  }

  getDepartmentlist(divisionId) {
    this.salesQuote.departmentId = 0;
    this.departmentList = [];
    if (divisionId != 0 && divisionId != null && divisionId != undefined) {
      this.salesQuote.divisionId = divisionId;
      this.salesQuote.managementStructureId = divisionId;
      this.commonservice.getManagementStructurelevelWithEmployee(divisionId, this.employeeId).subscribe(res => {
        this.departmentList = res;
      });
      //    for (let i = 0; i < this.partListData.length; i++) {
      // 	this.partListData[i].divisionId = divisionId;
      // 	this.getParentDeptlist(this.partListData[i]);
      // 	}
    }
    else {
      this.salesQuote.managementStructureId = this.salesQuote.buId;
      this.salesQuote.divisionId = 0;
    }
  }
  getParentDeptlist(partList) {
    partList.parentDeptId = 0;
    partList.parentDepartmentlist = [];
    if (partList.childList) {
      for (let j = 0; j < partList.childList.length; j++) {
        partList.childList[j].childDivisionId = partList.parentDivisionId;
        partList.childList[j].childDepartmentlist = [];
        partList.childList[j].childDeptId = 0;
      }
    }

    if (partList.parentDivisionId != 0 && partList.parentDivisionId != null && partList.parentDivisionId != undefined) {
      partList.managementStructureId = partList.parentDivisionId;
      this.commonservice.getManagementStructurelevelWithEmployee(partList.parentDivisionId, this.employeeId).subscribe(res => {
        partList.parentDepartmentlist = res;
        if (partList.childList) {
          for (let j = 0; j < partList.childList.length; j++) {
            partList.childList[j].childDepartmentlist = partList.parentDepartmentlist;
            partList.childList[j].childDivisionId = partList.parentDivisionId;
            partList.childList[j].managementStructureId = partList.parentDivisionId;
          }
        }
      });
    }
    else {
      partList.managementStructureId = partList.parentbuId;
      if (partList.childList) {
        for (let j = 0; j < partList.childList.length; j++) {
          partList.childList[j].managementStructureId = partList.parentbuId;
        }
      }
    }
  }
  getChildDeptlist(partChildList) {
    partChildList.childDepartmentlist = [];
    partChildList.childDeptId = 0;
    if (partChildList.childDivisionId != 0 && partChildList.childDivisionId != null && partChildList.childDivisionId != undefined) {
      partChildList.managementStructureId = partChildList.childDivisionId;
      this.commonservice.getManagementStructurelevelWithEmployee(partChildList.childDivisionId, this.employeeId).subscribe(res => {
        partChildList.childDepartmentlist = res;
      });
    }
    else {
      partChildList.managementStructureId = partChildList.childbuId;
    }
  }

  getDepartmentId(departmentId) {
    if (departmentId != 0 && departmentId != null && departmentId != undefined) {
      this.salesQuote.managementStructureId = departmentId;
      this.salesQuote.departmentId = departmentId;
      //  for (let i = 0; i < this.partListData.length; i++) {
      // 	this.partListData[i].parentDeptId = departmentId;
      // 	this.getParentDeptId(this.partListData[i]);			
      // }
    }
    else {
      this.salesQuote.managementStructureId = this.salesQuote.divisionId;
      this.salesQuote.departmentId = 0;
    }
  }
  getParentDeptId(partList) {
    if (partList.parentDeptId != 0 && partList.parentDeptId != null && partList.parentDeptId != undefined) {
      partList.managementStructureId = partList.parentDeptId;
      if (partList.childList) {
        for (let j = 0; j < partList.childList.length; j++) {
          partList.childList[j].childDeptId = partList.parentDeptId;
          this.getChildDeptId(partList.childList[j]);
        }
      }
    }
    else {
      partList.managementStructureId = partList.parentDivisionId;
      if (partList.childList) {
        for (let j = 0; j < partList.childList.length; j++) {
          partList.childList[j].managementStructureId = partList.parentDivisionId;
          partList.childList[j].childDeptId = partList.parentDeptId;
        }
      }

    }

  }

  getChildDeptId(partChildList) {
    if (partChildList.childDeptId != 0 && partChildList.childDeptId != null && partChildList.childDeptId != undefined) {
      partChildList.managementStructureId = partChildList.childDeptId;
    }
    else {
      partChildList.managementStructureId = partChildList.childDivisionId;
    }
  }
}
