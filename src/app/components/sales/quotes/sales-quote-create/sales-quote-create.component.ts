import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import {
  NgForm,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray
} from "@angular/forms";
import { CustomerSearchQuery } from "../models/customer-search-query";
import { CustomerService } from "../../../../services/customer.service";
import { Customer } from "../../../../models/customer.model";
import {
  AlertService,
  MessageSeverity
} from "../../../../services/alert.service";
import { ActivatedRoute } from "@angular/router";
import { map ,  takeUntil } from "rxjs/operators";
import { SalesQuoteService } from "../../../../services/salesquote.service";
import { ISalesQuote } from "../../../../models/sales/ISalesQuote.model";
import { SalesQuote } from "../../../../models/sales/SalesQuote.model";
import { ISalesOrderQuote } from "../../../../models/sales/ISalesOrderQuote";
import { ISalesQuoteView } from "../../../../models/sales/ISalesQuoteView";
import { SalesQuoteView } from "../../../../models/sales/SalesQuoteView";
import { SalesOrderQuotePart } from "../../../../models/sales/SalesOrderQuotePart";
import { SalesOrderQuote } from "../../../../models/sales/SalesOrderQuote";
import { CommonService } from "../../../../services/common.service";
import { Currency } from "../../../../models/currency.model";
import { CurrencyService } from "../../../../services/currency.service";
import { EmployeeService } from "../../../../services/employee.service";
import { AuthService } from "../../../../services/auth.service";
import { Router } from "@angular/router";
import { getValueFromArrayOfObjectById } from "../../../../generic/autocomplete";

import {
  getValueFromObjectByKey,
  getObjectById,
  editValueAssignByCondition,
  getObjectByValue,
  getValueByFieldFromArrayofObject,
  formatStringToNumber
} from "../../../../generic/autocomplete";
import {
  NgbModal,
  NgbActiveModal,
  NgbModalRef,
  ModalDismissReasons
} from "@ng-bootstrap/ng-bootstrap";
import { CustomerViewComponent } from "../../../../shared/components/customer/customer-view/customer-view.component";
import { PartDetail } from "../../shared/models/part-detail";
import { Subject ,  forkJoin } from "rxjs";
import { ManagementStructureComponent } from "../shared/components/management-structure/management-structure.component";
import { SalesAddressComponent } from "../shared/components/sales-address/sales-address.component";
import { DBkeys } from "../../../../services/db-Keys";
import { CopyConsiderationsForSalesQuote } from "../models/copy-considerations-for-sales-quote";
import { VerifySalesQuoteModel } from "../models/verify-sales-quote-model";
import { SalesOrderConversionCritera } from "../models/sales-order-conversion-criteria";
import { SalesOrder } from "../../../../models/sales/SalesOrder.model";
import { SalesOrderView } from "../../../../models/sales/SalesOrderView";
import { MenuItem } from "primeng/api";
import { SalesOrderCustomerApproval } from "../../order/models/sales-order-customer-approval";
import { SalesApproveComponent } from "../shared/components/sales-approve/sales-approve.component";
import { SalesCustomerApprovalsComponent } from "../shared/components/sales-customer-approvals/sales-customer-approvals.component";
import { SalesOrderQuoteFreightComponent } from "../../shared/components/sales-order-quote-freight/sales-order-quote-freight.component";
import { SalesOrderQuoteChargesComponent } from "../../shared/components/sales-order-quote-charges/sales-order-quote-charges.component";
import { SOQuoteMarginSummary } from "../../../../models/sales/SoQuoteMarginSummary";
import { SalesPartNumberComponent } from "../../shared/components/sales-part-number/sales-part-number.component";
import { SalesQuoteDocumentsComponent } from "../sales-document/salesQuote-document.component";
import { SalesQuoteAnalysisComponent } from "../sales-quote-analysis/sales-quote-analysis.component";
//import { AddressComponentComponent } from "../../../../components/address-component/address-component.component";
import { error } from "@angular/compiler/src/util";
@Component({
  selector: "app-sales-quote-create",
  templateUrl: "./sales-quote-create.component.html",
  styleUrls: ["./sales-quote-create.component.scss"]
})
export class SalesQuoteCreateComponent implements OnInit {
  query: CustomerSearchQuery;
  communicationItems: MenuItem[];
  selectedCommunicationTab: any = '';
  isEmailTabEnabled: boolean = false;
  globalCustomerWarningId: any;
  customers: Customer[];
  customerDetails: any;
  totalRecords: number = 0;
  totalPages: number = 0;
  showPaginator: boolean = false;
  customerId: number;
  SalesOrderQuoteId: number;
  salesQuote: ISalesQuote;
  enableUpdateButton = true;
  defaultSettingPriority;
  salesOrderQuote: ISalesOrderQuote;
  salesOrderQuoteObj: any = {};
  salesQuoteView: ISalesQuoteView;
  creditTerms: any[];
  percents: any[];
  allCurrencyInfo: any[];
  firstCollection: any[];
  csrFirstCollection: any[];
  agentFirstCollection: any[];
  salesFirstCollection: any[];
  allEmployeeinfo: any[] = [];
  customerNames: any[];
  allCustomer: any[] = [];
  customerContactList: any[];
  customerWarningData: any = [];
  // approvers: any[];
  accountTypes: any[] = [];
  selectedParts: any[] = [];
  modal: NgbModalRef;
  errorModal: NgbModalRef;
  tempMemo: any;
  tempMemoLabel: any;
  customer: any = {
    customerName: "",
    customerCode: "",
    promisedDate: ""
  };
  salesQuoteForm: FormGroup;
  display: boolean = false;
  id: any;
  // selectedApprovers: any[] = [];
  errorMessages: any[] = [];
  isEdit: boolean = false;
  jobTitles: any;
  csrOriginalList: any[] = [];
  agentsOriginalList: any[] = [];
  salesPersonOriginalList: any[] = [];
  salesPersonAndAgentOriginalList: any[] = [];
  managementStructureId: any;
  marginSummary: SOQuoteMarginSummary = new SOQuoteMarginSummary();
  headerInfo: any = {};
  toggle_po_header: boolean = true;
  qoId: any;
  leadSources = [];
  businessUnitList: any;
  departmentList: any;
  isEditMode = false;
  divisionList: any;
  bulist: any[] = [];
  divisionlist: any[] = [];
  private onDestroy$: Subject<void> = new Subject<void>();
  @ViewChild("errorMessagePop",{static:false}) public errorMessagePop: ElementRef;
  @ViewChild("closeQuotePopup",{static:false}) public closeQuotePopup: ElementRef;
  @ViewChild("newQuoteCreatePopup",{static:false}) public newQuoteCreatePopup: ElementRef;
  @ViewChild("copyQuotePopup",{static:false}) public copyQuotePopup: ElementRef;
  @ViewChild("newSalesQuoteForm",{static:false}) public newSalesQuoteForm: NgForm;
  @ViewChild("salesQuoteConvertPopup",{static:false}) public salesQuoteConvertPopup: ElementRef;
  @ViewChild("emailQuotePopup",{static:false}) public emailQuotePopup: ElementRef;
  @ViewChild("salesQuotePrintPopup",{static:false}) public salesQuotePrintPopup: ElementRef;
  @ViewChild(SalesApproveComponent,{static:false}) public salesApproveComponent: SalesApproveComponent;
  @ViewChild(SalesCustomerApprovalsComponent,{static:false}) public salesCustomerApprovalsComponent: SalesCustomerApprovalsComponent;
  @ViewChild(SalesOrderQuoteFreightComponent,{static:false}) public salesOrderQuoteFreightComponent: SalesOrderQuoteFreightComponent;
  @ViewChild(SalesOrderQuoteChargesComponent,{static:false}) public salesOrderQuoteChargesComponent: SalesOrderQuoteChargesComponent;
  @ViewChild(SalesPartNumberComponent,{static:false}) public salesPartNumberComponent: SalesPartNumberComponent;
  @ViewChild(SalesQuoteDocumentsComponent,{static:false}) public salesQuoteDocumentsComponent: SalesQuoteDocumentsComponent;
  @ViewChild(SalesQuoteAnalysisComponent,{static:false}) public salesQuoteAnalysisComponent: SalesQuoteAnalysisComponent;
  @ViewChild(ManagementStructureComponent,{static:false})
  public managementStructureComponent: ManagementStructureComponent;
  @ViewChild(SalesAddressComponent,{static:false}) public salesAddressComponent: SalesAddressComponent;
  isCopyMode: boolean = false;
  quoteCopyRefId: any;
  copyConsiderations: CopyConsiderationsForSalesQuote;
  deletePartsWhileCopieng: boolean = false;
  deleteApproversWhileCopieng: boolean = false;
  verifySalesOrderQuoteObj: VerifySalesQuoteModel;
  salesOrderConversionCriteriaObj: SalesOrderConversionCritera;
  salesOrderView: SalesOrderView;
  @ViewChild("updateConfirmationModal",{static:false})
  public updateConfirmationModal: ElementRef;
  submitType: boolean = true;
  customerWarning: any = {};
  conversionStarted: boolean = false;
  isEmailQuoteTabEnabled: boolean = false;
  isCreateModeHeader: boolean = false;
  isHeaderSubmit: boolean = false;
  customerInfoFromSalesQuote: any = {}
  isSpinnerVisible: Boolean = false;
  addressType: any = 'SOQ';
  freight = [];
  charge = [];
  salesOrderFreightList = [];
  markupList = [];
  buildMethodDetails = [];
  totalFreights = 0;
  arrayEmplsit: any[] = [];
  maincompanylist: any[] = [];
  allEmployeeList: any = [];
  requisitionerList: any[];
  currentUserEmployeeName: string;
  totalCharges = 0;
  selectAllForConversion = true;
  validDaysSettingsList = [];
  managementValidCheck: boolean;
  constructor(
    private customerService: CustomerService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private salesQuoteService: SalesQuoteService,
    private formBuilder: FormBuilder,
    private commonservice: CommonService,
    private commonService: CommonService,
    public currencyService: CurrencyService,
    public employeeService: EmployeeService,
    private authService: AuthService,
    private router: Router,
    private modalService: NgbModal,
  ) {
    this.salesQuote = new SalesQuote();
    this.copyConsiderations = new CopyConsiderationsForSalesQuote();
    this.verifySalesOrderQuoteObj = new VerifySalesQuoteModel();
    this.salesOrderConversionCriteriaObj = new SalesOrderConversionCritera();
    this.globalCustomerWarningId = DBkeys.GLOBAL_CUSTOMER_WARNING_ID_FOR_SALES_ORDER;
    this.conversionStarted = false;
  }

  ngOnInit() {
    this.isSpinnerVisible = true;
    this.initCommunication();
    this.customerId = +this.route.snapshot.paramMap.get("customerId");
    this.id = +this.route.snapshot.paramMap.get("id");
    this.salesQuote.priorityId = DBkeys.DEFAULT_PRIORITY_ID;
    this.isCreateModeHeader = false;
    this.salesQuoteService.resetSalesOrderQuote();
    this.salesQuoteService.getSalesOrderQuteInstance().subscribe(data => {
      this.salesOrderQuote = data;
      this.salesOrderQuote.statusChangeDate = new Date();
    });
    this.salesQuoteService.getSelectedParts().subscribe(data => {
      this.selectedParts = data;
    });
    this.managementStructureId = this.currentUserManagementStructureId;
    this.getInitialDataForSOQ();
    if (this.id) {
      this.getMarginSummary()
    }
    this.route.queryParams.subscribe(params => {
      if (params['copyref']) {
        this.isCopyMode = true;
        this.quoteCopyRefId = params['copyref'];
        if (params['considerparts'] == false || params['considerparts'] == "false") {
          this.deletePartsWhileCopieng = true;
        }
        if (params['considerapprovers'] == false || params['considerapprovers'] == "false") {
          this.deleteApproversWhileCopieng = true;
        }
        this.getSalesQuoteInstance(params['copyref']);
      }
    });
    this.isSpinnerVisible = false;
  }

  onActionSelectAllforconvversion() {
    if (this.selectAllForConversion) {
      this.salesOrderConversionCriteriaObj.transferCharges = true;
      this.salesOrderConversionCriteriaObj.transferFreight = true;
      this.salesOrderConversionCriteriaObj.transferMemos = true;
      this.salesOrderConversionCriteriaObj.transferNotes = true;
      this.salesOrderConversionCriteriaObj.transferStockline = true;
      this.salesOrderConversionCriteriaObj.reserveStockline = true;
    } else {
      this.salesOrderConversionCriteriaObj.transferCharges = false;
      this.salesOrderConversionCriteriaObj.transferFreight = false;
      this.salesOrderConversionCriteriaObj.transferMemos = false;
      this.salesOrderConversionCriteriaObj.transferNotes = false;
      this.salesOrderConversionCriteriaObj.transferStockline = false;
      this.salesOrderConversionCriteriaObj.reserveStockline = false;
    }

  }

  initCommunication(): void {

    this.communicationItems = [
      {

        label: 'Memo', command: () => {
          this.Memo();
        }
      },
      {
        label: 'Email', command: () => {
          this.Email();
        }
      },
      {
        label: 'Phone', command: () => {
          this.Phone();
        }
      },
      {
        label: 'Text', command: () => {
          this.Text();
        }
      },

    ];
  }
  Memo() {
    this.isEmailTabEnabled = true;
    this.selectedCommunicationTab = "memo";
  }
  Email() {
    this.isEmailTabEnabled = true;
    this.selectedCommunicationTab = "email";
  }
  Phone() {
    this.isEmailTabEnabled = true;
    this.selectedCommunicationTab = "phone";
  }
  Text() {
    this.isEmailTabEnabled = true;
    this.selectedCommunicationTab = "text";
  }
  get userName(): string {
    return this.authService.currentUser
      ? this.authService.currentUser.userName
      : "";
  }
  get currentUserManagementStructureId(): number {
    return this.authService.currentUser
      ? this.authService.currentUser.managementStructureId
      : null;
  }
  get userId() {
    return this.authService.currentUser ? this.authService.currentUser.id : 0;
  }
  get employeeId() {
    return this.authService.currentUser ? this.authService.currentUser.employeeId : 0;
  }

  expandHeader() {
    this.toggle_po_header = !this.toggle_po_header;
    // if (this.toggle_po_header) {
    //   if (this.managementStructureComponent) {
    //     this.managementStructureComponent.load(this.currentUserManagementStructureId);
    //   }
    // }
  }

  getInitialDataForSOQ() {
    this.isSpinnerVisible = true;
    forkJoin(
      this.customerService.getCustomerCommonDataWithContactsById(this.customerId),
      this.commonservice.getCSRAndSalesPersonOrAgentList(this.currentUserManagementStructureId),
      // this.employeeService.getEmployeeCommonData(this.currentUserManagementStructureId),
      this.commonservice.smartDropDownList('CustomerWarningType', 'CustomerWarningTypeId', 'Name'),
      this.commonservice.smartDropDownList('CustomerType', 'CustomerTypeId', 'Description'),
      this.commonservice.smartDropDownList("[Percent]", "PercentId", "PercentValue"),
      this.commonservice.smartDropDownList("CreditTerms", "CreditTermsId", "Name"),
      this.commonservice.smartDropDownList("LeadSource", "LeadSourceId", "LeadSources"),
      this.salesQuoteService.getAllSalesOrderQuoteSettings()).subscribe(result => {
        this.isSpinnerVisible = false;
        this.setAllCustomerContact(result[0]);
        this.setCSRAndSalesPersonOrAgentList(result[1]);
        // this.onempDataLoadSuccessful(result[2][0]);
        this.setTypesOfWarnings(result[2]);
        this.setAccountTypes(result[3]);
        this.setPercents(result[4]);
        this.setCreditTerms(result[5]);
        this.setLeadSources(result[6]);
        this.setValidDays(result[7]);
        this.customerDetails = result[0];
        this.getSOQInstance();
      }, error => {
        this.isSpinnerVisible = false;
        const errorLog = error;
        this.onDataLoadFailed(errorLog);
        this.getSOQInstance();
      });
  }

  getMarginSummary() {
    this.salesQuoteService.getSOQMarginSummary(this.id).subscribe(result => {
      this.setSOQMarginSummary(result);
    }, error => {
      const errorLog = error;
      this.onDataLoadFailed(errorLog);
    })

  }


  setValidDays(result) {
    if (result && result.length > 0) {
      this.validDaysSettingsList = result;
    }
  }

  setSOQMarginSummary(data) {
    if (data) {
      this.marginSummary = data;
      this.totalCharges = this.marginSummary.misc;
      this.totalFreights = this.marginSummary.freightAmount;
      this.salesQuoteService.setTotalCharges(this.marginSummary.misc);
      this.salesQuoteService.setTotalFreights(this.marginSummary.freightAmount);
    } else {
      this.marginSummary = new SOQuoteMarginSummary;
    }
  }

  getSOQInstance() {
    if (this.id) {
      this.getSalesQuoteInstance(this.id);
      this.isEdit = true;
      this.getCustomerDetails();
    } else {
      this.getNewSalesQuoteInstance(this.customerId);
      this.isEdit = false;
    }
  }
  setCreditTerms(creditTerms) {
    this.creditTerms = creditTerms;
  }
  setPercents(percents) {
    this.percents = percents;
    this.markupList = percents;
  }

  setAccountTypes(accountTypes) {
    this.accountTypes = accountTypes;
  }

  setLeadSources(leadSources) {
    this.leadSources = leadSources;
  }

  setTypesOfWarnings(warningsData) {
    if (warningsData.length > 0) {
      warningsData.filter(i => {
        if (i.label == DBkeys.GLOBAL_CUSTOMER_WARNING_TYOE_FOR_SALES_QUOTE) {
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
        if (this.customerWarning && this.customerWarning.customerWarningId) {
          this.salesQuote.warningId = this.customerWarning.customerWarningId
          this.salesQuote['customerWarningId'] = this.customerWarning.customerWarningId;
        }
      }, error => {
        this.isSpinnerVisible = false;
        const errorLog = error;
        this.onDataLoadFailed(errorLog)
      });
  }

  setCSRAndSalesPersonOrAgentList(csrAndSalesPersonList) {
    this.csrOriginalList = csrAndSalesPersonList.csrEmpList;
    this.salesPersonAndAgentOriginalList = csrAndSalesPersonList.salesEmpList;
  }

  getCustomerDetails() {
    // this.isSpinnerVisible = true;
    // this.customerService.getCustomerCommonDataById(this.customerId).subscribe(res => {
    if (this.customerDetails) {
      this.salesQuote.customerName = this.customerDetails.name;
      this.salesQuote.customerEmail = this.customerDetails.email;
      this.salesQuote.customerCode = this.customerDetails.customerCode;
      this.customerInfoFromSalesQuote = {
        customerName: this.customerDetails.name,
        customerCode: this.customerDetails.customerCode,
        customerId: this.customerDetails.customerId
      }

      if (!this.id) {
        this.salesQuote.creditLimit = this.customerDetails.creditLimit;
        this.salesQuote.creditLimitTermsId = this.customerDetails.creditTermsId;
        this.salesQuote.contractReferenceName = this.customerDetails.contractReference;
        this.salesQuote.restrictPMA = this.customerDetails.restrictPMA;
        this.salesQuote.restrictDER = this.customerDetails.restrictDER;
        this.salesQuote.accountTypeId = this.customerDetails.customerTypeId;
        this.setValidDaysBasedOnSettings(false);
        this.onChangeValidForDays();
      } else {
        this.setValidDaysBasedOnSettings(true);
      }
      this.setCSR();
      this.setSalesPerson();
    }
  }

  // private onempDataLoadSuccessful(getEmployeeCerficationList: any[]) {
  //   this.isSpinnerVisible = false;
  //   this.allEmployeeinfo = getEmployeeCerficationList;
  //   this.allEmployeeinfo.filter(x => {
  //     x.firstName = x.firstName + " " + x.lastName
  //   })
  //   if (this.salesOrderQuoteObj.employeeId != undefined) {
  //     this.salesQuote.employeeName = getObjectById(
  //       "value",
  //       this.salesOrderQuoteObj.employeeId,
  //       this.allEmployeeList
  //     );
  //   } else {
  //     this.salesQuote.employeeName = getObjectById(
  //       "value",
  //       this.employeeId,
  //       this.allEmployeeList
  //     );
  //   }
  // }

  enableHeaderSave() {
    this.enableUpdateButton = false;
  }
  filterfirstName(event) {
    // this.firstCollection = this.allEmployeeList;

    // const employeeListData = [
    //   ...this.allEmployeeList.filter(x => {
    //     if (x.label.toLowerCase().includes(event.query.toLowerCase())) {
    //       return x.label;
    //     }
    //   })
    // ];
    // this.firstCollection = employeeListData;
    if (event.query !== undefined && event.query !== null) {
      this.employeedata(event.query, this.managementStructureId);
    }
    // else {
    //   this.employeedata('', 0);
    // }
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

  setCSR() {
    if (this.isEdit && this.salesOrderQuoteObj.customerSeviceRepId && this.salesOrderQuoteObj.customerSeviceRepId != 0) {
      this.salesQuote.customerServiceRepName = getObjectById(
        "employeeId",
        this.salesOrderQuoteObj.customerSeviceRepId,
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
    if (this.isEdit && this.salesOrderQuoteObj.salesPersonId && this.salesOrderQuoteObj.salesPersonId != 0) {
      this.salesQuote.salesPersonName = getObjectById(
        "employeeId",
        this.salesOrderQuoteObj.salesPersonId,
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

  getDefaultContact() {
    if (this.customerContactList) {
      if (this.customerContactList.length > 0) {
        for (let i = 0; i < this.customerContactList.length; i++) {
          let isDefaultContact = this.customerContactList[i].isDefaultContact;
          if (isDefaultContact) {
            this.salesQuote.customerContactId = this.customerContactList[
              i
            ].contactId;
          } else {
            this.salesQuote.customerContactId = 0;
          }
        }
      }
    }
  }

  setAllCustomerContact(result) {
    this.customerContactList = result.contactList;
    if (this.customerContactList && this.customerContactList.length > 0) {
      for (let i = 0; i < this.customerContactList.length; i++) {
        this.customerContactList[i]['contactName'] = this.customerContactList[i].firstName + " " + this.customerContactList[i].lastName;
      }
    }

  }


  getManagementStructureDetails(id, empployid = 0, editMSID = 0) {
    empployid = empployid == 0 ? this.employeeId : empployid;
    editMSID = this.isEditMode ? editMSID = id : 0;
    this.isSpinnerVisible = true;
    this.commonService.getManagmentStrctureData(id, empployid, editMSID).subscribe(response => {
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
      const errorLog = err;
      this.errorMessageHandler(errorLog);
    });
  }

  employeedata(strText = '', manStructID = 0) {
    if (this.arrayEmplsit.length == 0) {
      this.arrayEmplsit.push(0);
    }
    this.arrayEmplsit.push(this.employeeId == null ? 0 : this.employeeId);
    // this.arrayEmplsit.push(this.salesQuote.employeeId);
    this.isSpinnerVisible = true;
    this.commonService.autoCompleteDropdownsEmployeeByMS(strText, true, 20, this.arrayEmplsit.join(), manStructID).subscribe(res => {
      this.isSpinnerVisible = false;
      this.allEmployeeList = res;
      this.firstCollection = res;
      this.salesQuote.employeeName = getObjectById(
        "value",
        this.salesQuote.employeeId,
        this.allEmployeeList
      );
      this.currentUserEmployeeName = getValueFromArrayOfObjectById('label', 'value', this.employeeId, res);
      if (!this.isEditMode) {
        this.getRequisitionerOnLoad(this.employeeId);
      }
    }, err => {
      this.isSpinnerVisible = false;
      const errorLog = err;
      this.errorMessageHandler(errorLog);
    })
  }
  getRequisitionerOnLoad(id) {
    this.salesQuote.employeeId = getObjectById('value', id, this.allEmployeeList);
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

  checkValidOnChange(condition, value) {
    if (condition != null && condition != 0 && value == "companyId") {
      this.managementValidCheck = false;
    }
  }
  load(managementStructureId: number) {
    this.managementStructureId = managementStructureId;
    if (this.id) {
      this.getManagementStructureDetails(this.managementStructureId, this.employeeId, this.salesQuote.managementStructureId);
    } else {
      this.getManagementStructureDetails(this.managementStructureId, this.employeeId);
    }
  }

  getManagementStructureForChildEdit(partChildList) {
    var editMSID = this.isEditMode ? partChildList.managementStructureId : 0;
    this.commonService.getManagmentStrctureData(partChildList.managementStructureId, this.employeeId, editMSID).subscribe(response => {
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
      this.commonService.getManagementStructurelevelWithEmployee(legalEntityId, this.employeeId).subscribe(res => {
        this.bulist = res;
        this.employeedata('', this.salesQuote.managementStructureId);
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
      this.commonService.getManagementStructurelevelWithEmployee(partList.parentCompanyId, this.employeeId).subscribe(res => {
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
      this.commonService.getManagementStructurelevelWithEmployee(partChildList.childCompanyId, this.employeeId).subscribe(res => {
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
      this.commonService.getManagementStructurelevelWithEmployee(buId, this.employeeId).subscribe(res => {
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
      this.commonService.getManagementStructurelevelWithEmployee(partList.parentbuId, this.employeeId).subscribe(res => {
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
      this.commonService.getManagementStructurelevelWithEmployee(partChildList.childbuId, this.employeeId).subscribe(res => {
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
      this.commonService.getManagementStructurelevelWithEmployee(divisionId, this.employeeId).subscribe(res => {
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
      this.commonService.getManagementStructurelevelWithEmployee(partList.parentDivisionId, this.employeeId).subscribe(res => {
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
      this.commonService.getManagementStructurelevelWithEmployee(partChildList.childDivisionId, this.employeeId).subscribe(res => {
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


  onDataLoadFailedCustom(error) {
    this.isSpinnerVisible = false;
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
  parsedText(text) {
    if (text) {
      const dom = new DOMParser().parseFromString(
        '<!doctype html><body>' + text,
        'text/html');
      const decodedString = dom.body.textContent;
      return decodedString;
    }
  }
  onWarningSelect(event) {
    if (this.customerWarningData) {
      for (let i = 0; i < this.customerWarningData.length; i++) {
        if (event == this.customerWarningData[i].customerWarningId) {
          this.salesQuote.warningName = this.customerWarningData[
            i
          ].warningMessage;
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
          approver.lastName = this.allEmployeeinfo[i].lastName;
          approver.employeeCode = this.allEmployeeinfo[i].employeeCode;
          approver.email = this.allEmployeeinfo[i].email;
        }
      }
    }
  }

  getSalesQuoteInstance(salesQuoteId: number) {
    this.isSpinnerVisible = true;
    if (this.isCopyMode) {
      this.selectedParts = [];
    }
    this.salesQuoteService.getSalesQuote(salesQuoteId).subscribe(data => {
      if (data) {
        this.salesQuoteView = data && data.length ? data[0] : null;
        this.salesOrderQuoteObj = this.salesQuoteView.salesOrderQuote;
        this.verifySalesQuoteConversion(this.salesQuoteView.verificationResult);
      }
      if (this.deletePartsWhileCopieng == true) {
        this.salesQuoteView.parts = [];
      }

      let partList: any[] = this.salesQuoteView.parts;

      for (let i = 0; i < partList.length; i++) {
        let selectedPart = partList[i];
        let partNumberObj = this.salesQuoteService.marshalSOQPartToView(selectedPart);
        const selectedPartsTemp = this.selectedParts;
        selectedPartsTemp.push(partNumberObj)
        this.salesQuoteService.selectedParts = selectedPartsTemp;
      }

      this.arrayEmplsit.push(this.salesOrderQuoteObj.employeeId);
      this.load(this.salesOrderQuoteObj.managementStructureId);
      if (this.salesPartNumberComponent) {
        this.salesPartNumberComponent.refresh();
      }
      this.marginSummary = this.salesQuoteService.getSalesQuoteHeaderMarginDetails(this.salesQuoteService.selectedParts, this.marginSummary);
      this.salesQuote.managementStructureId = this.salesOrderQuoteObj.managementStructureId;
      this.managementStructureId = this.salesOrderQuoteObj.managementStructureId;
      this.salesQuote.priorities = this.salesQuoteView.priorities;
      this.salesQuote.salesQuoteTypes = this.salesQuoteView.salesQuoteTypes;
      this.salesQuote.status = this.salesQuoteView.status;
      this.salesQuote.salesOrderQuoteId = this.salesOrderQuoteObj.salesOrderQuoteId;
      this.salesQuote.quoteTypeId = this.salesOrderQuoteObj.quoteTypeId;
      this.salesQuote.statusId = this.salesOrderQuoteObj.statusId;
      this.salesQuote.statusChangeDate = new Date(
        this.salesOrderQuoteObj.statusChangeDate
      );
      this.salesQuote.openDate = new Date(this.salesOrderQuoteObj.openDate);
      this.salesQuote.validForDays = this.salesOrderQuoteObj.validForDays;
      this.salesQuote.quoteExpiryDate = new Date(
        this.salesOrderQuoteObj.quoteExpireDate
      );

      // this.salesOrderQuote.masterCompanyId = this.masterCompanyId;
      this.salesQuote.salesOrderQuoteNumber = this.salesOrderQuoteObj.salesOrderQuoteNumber;
      this.salesQuote.versionNumber = this.salesOrderQuoteObj.versionNumber;
      this.salesQuote.accountTypeId = this.salesOrderQuoteObj.accountTypeId;
      this.salesQuote.customerId = this.salesOrderQuoteObj.customerId;
      this.salesQuote.customerContactId = this.salesOrderQuoteObj.customerContactId;
      this.salesQuote.customerReferenceName = this.salesOrderQuoteObj.customerReference;
      this.salesQuote.contractReferenceName = this.salesOrderQuoteObj.contractReference;
      this.salesQuote.quoteApprovedById = this.salesOrderQuoteObj.quoteApprovedById;
      this.salesQuote.quoteApprovedById = this.salesOrderQuoteObj.quoteApprovedById;
      this.salesQuote.employeeId = this.salesOrderQuoteObj.employeeId;
      this.salesOrderQuote.managementStructureId = this.salesOrderQuoteObj.managementStructureId;
      this.salesOrderQuote.shipToUserTypeId = this.salesOrderQuoteObj.shipToUserTypeId;
      this.salesOrderQuote.shipToUserId = this.salesOrderQuoteObj.shipToUserId;
      this.salesOrderQuote.shipToAddressId = this.salesOrderQuoteObj.shipToAddressId;
      this.salesOrderQuote.shipViaId = this.salesOrderQuoteObj.shipViaId;
      this.salesOrderQuote.billToContactId = this.salesOrderQuoteObj.billToContactId;
      this.salesOrderQuote.shipToContactId = this.salesOrderQuoteObj.shipToContactId;
      this.salesOrderQuote.shipToSiteName = this.salesOrderQuoteObj.shipToSiteName;
      this.salesOrderQuote.shipToAddress1 = this.salesOrderQuoteObj.shipToAddress1;
      this.salesOrderQuote.shipToAddress2 = this.salesOrderQuoteObj.shipToAddress2;
      this.salesOrderQuote.shipToCity = this.salesOrderQuoteObj.shipToCity;
      this.salesOrderQuote.shipToState = this.salesOrderQuoteObj.shipToState;
      this.salesOrderQuote.shipToPostalCode = this.salesOrderQuoteObj.shipToPostalCode;
      this.salesOrderQuote.shipToCountry = this.salesOrderQuoteObj.shipToCountry;
      this.salesOrderQuote.shipViaName = this.salesOrderQuoteObj.shipViaName;
      this.salesOrderQuote.shipViaShippingAccountInfo = this.salesOrderQuoteObj.shipViaShippingAccountInfo;
      this.salesOrderQuote.shippingId = this.salesOrderQuoteObj.shippingId;
      this.salesOrderQuote.shippingURL = this.salesOrderQuoteObj.shippingURL;
      this.salesOrderQuote.shipViaMemo = this.salesOrderQuoteObj.shipViaMemo;
      this.salesOrderQuote.shipViaShippingURL = this.salesOrderQuoteObj.shipViaShippingURL;
      this.salesOrderQuote.billToUserTypeId = this.salesOrderQuoteObj.billToUserTypeId;
      this.salesOrderQuote.billToUserId = this.salesOrderQuoteObj.billToUserId;
      this.salesOrderQuote.billToAddressId = this.salesOrderQuoteObj.billToAddressId;
      this.salesOrderQuote.billToSiteName = this.salesOrderQuoteObj.billToSiteName;
      this.salesOrderQuote.billToAddress1 = this.salesOrderQuoteObj.billToAddress1;
      this.salesOrderQuote.billToAddress2 = this.salesOrderQuoteObj.billToAddress2;
      this.salesOrderQuote.billToCity = this.salesOrderQuoteObj.billToCity;
      this.salesOrderQuote.billToState = this.salesOrderQuoteObj.billToState;
      this.salesOrderQuote.billToPostalCode = this.salesOrderQuoteObj.billToPostalCode;
      this.salesOrderQuote.billToCountry = this.salesOrderQuoteObj.billToCountry;
      this.salesOrderQuote.billToMemo = this.salesOrderQuoteObj.billToMemo;

      this.salesOrderQuote.salesOrderQuoteId = this.salesOrderQuoteObj.salesOrderQuoteId;

      this.salesQuote.probabilityId = this.salesOrderQuoteObj.probabilityId;
      this.salesQuote.leadSourceId = this.salesOrderQuoteObj.leadSourceId;
      this.salesQuote.creditLimit = this.salesOrderQuoteObj.creditLimit;
      this.salesQuote.creditLimitTermsId = this.salesOrderQuoteObj.creditTermId;
      this.salesQuote.restrictPMA = this.salesOrderQuoteObj.restrictPMA;
      this.salesQuote.restrictDER = this.salesOrderQuoteObj.restrictDER;
      this.salesQuote.companyId = this.salesOrderQuoteObj.masterCompanyId;
      this.salesQuote.buId = this.salesOrderQuoteObj.buId;
      this.salesQuote.divisionId = this.salesOrderQuoteObj.divisionId;
      this.salesQuote.departmentId = this.salesOrderQuoteObj.departmentId;
      if (this.salesOrderQuoteObj.approvedDate)
        this.salesQuote.approvedDate = new Date(
          this.salesOrderQuoteObj.approvedDate
        );
      this.salesQuote.currencyId = this.salesOrderQuoteObj.currencyId;
      this.salesQuote.warningId = this.salesOrderQuoteObj.customerWarningId;
      this.salesQuote.memo = this.salesOrderQuoteObj.memo;
      this.salesQuote.notes = this.salesOrderQuoteObj.notes;
      this.salesQuote.statusName = this.salesQuoteView.salesOrderQuote.status;
      this.salesQuote.isApproved = this.salesQuoteView.salesOrderQuote.isApproved;
      // if (this.managementStructureComponent) {
      //   this.managementStructureComponent.load(
      //     this.currentUserManagementStructureId
      //   );
      // }
      this.isSpinnerVisible = false;
    }, error => {
      this.isSpinnerVisible = false;
      const errorLog = error;
      this.onDataLoadFailed(errorLog)
    });
  }
  bindCopiedQuoteData(data) {
    this.salesQuoteView = data[0];
    this.salesOrderQuoteObj = this.salesQuoteView.salesOrderQuote;
    this.salesQuote.customerReferenceName = this.salesOrderQuoteObj.customerReference;
    this.isSpinnerVisible = false;
  }

  setValidDaysBasedOnSettings(isEditMode) {
    if (this.validDaysSettingsList.length > 0) {
      let validDaysObject = this.validDaysSettingsList[0];
      if (validDaysObject) {
        if (!isEditMode) {
          this.salesQuote.validForDays = validDaysObject.validDays;
          this.salesQuote.quoteTypeId = validDaysObject.quoteTypeId;
          this.salesQuote.statusId = validDaysObject.defaultStatusId;
          this.salesQuote.statusName = validDaysObject.defaultStatusName;
        }
        this.defaultSettingPriority = validDaysObject.defaultPriorityId;
      } else {
        this.salesQuote.validForDays = 10;
        if (this.salesQuote.salesQuoteTypes.length > 0) {
          this.salesQuote.quoteTypeId = this.salesQuote.salesQuoteTypes[0].id;

        }
      }
    } else {
      this.salesQuote.validForDays = 10;
      if (this.salesQuote.salesQuoteTypes.length > 0) {
        this.salesQuote.quoteTypeId = this.salesQuote.salesQuoteTypes[0].id;
      }
    }
  }

  getNewSalesQuoteInstance(customerId: number) {
    this.isSpinnerVisible = true;
    this.salesQuoteService
      .getNewSalesQuoteInstance(customerId)
      .subscribe(data => {
        this.salesQuote = data && data.length ? data[0] : null;
        this.salesQuote.openDate = new Date();
        this.salesQuote.quoteExpiryDate = new Date();
        this.salesQuote.statusChangeDate = new Date();
        this.salesQuote.managementStructureId = this.currentUserManagementStructureId;
        this.salesQuote.companyId = this.masterCompanyId;
        this.getCustomerDetails();
        this.getDefaultContact();
        this.salesQuote.leadSourceId = null;
        this.salesQuote.probabilityId = null;
        this.salesQuote.employeeName = getObjectById(
          "value",
          this.employeeId,
          this.allEmployeeList
        );
        this.salesQuote.salesOrderQuoteNumber = "Generating";
        this.load(this.managementStructureId);
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
    this.enableUpdateButton = false;
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

  onChangeInput() {
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

  get masterCompanyId(): number {
    return this.authService.currentUser
      ? this.authService.currentUser.masterCompanyId
      : 1;
  }

  onSubmit(submitType: Boolean, createNewVersion: boolean = false) {
    this.errorMessages = [];

    let haveError = false;
    if (this.salesQuote.quoteTypeId <= 0) {
      this.errorMessages.push("Please select Quote Type");
      haveError = true;
    }
    if (!this.salesQuote.openDate) {
      this.errorMessages.push("Please select Open Date");
      haveError = true;
    }
    if (this.salesQuote.validForDays < 1) {
      this.errorMessages.push("Please enter Valid For (Days)");
      haveError = true;
    }
    if (!this.salesQuote.quoteExpiryDate) {
      this.errorMessages.push("Please select Quote Expiry Date");
      haveError = true;
    }
    if (this.salesQuote.accountTypeId <= 0) {
      this.errorMessages.push("Please select Account Type");
      haveError = true;
    }
    if (this.salesQuote.customerContactId <= 0) {
      this.errorMessages.push("Please select Customer Contact");
      haveError = true;
    }
    if (!this.salesQuote.customerReferenceName) {
      this.errorMessages.push("Please enter Customer Reference Name");
      haveError = true;
    }
    if (!this.salesQuote.employeeName) {
      this.errorMessages.push("Please select employee");
      haveError = true;
    }
    if (this.salesQuote.companyId <= 0) {
      this.errorMessages.push("Please select Management Structure");
      haveError = true;
    }

    if (submitType == false) {
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
      this.salesOrderQuote.quoteTypeId = this.salesQuote.quoteTypeId;
      this.salesOrderQuote.openDate = this.salesQuote.openDate.toDateString();
      this.salesOrderQuote.validForDays = this.salesQuote.validForDays;
      this.salesOrderQuote.quoteExpireDate = this.salesQuote.quoteExpiryDate.toDateString();
      this.salesOrderQuote.accountTypeId = this.salesQuote.accountTypeId;
      this.salesOrderQuote.customerId = this.salesQuote.customerId;
      this.salesOrderQuote.customerContactId = this.salesQuote.customerContactId;
      this.salesOrderQuote.customerReference = this.salesQuote.customerReferenceName;
      this.salesOrderQuote.contractReference = this.salesQuote.contractReferenceName;
      this.salesOrderQuote.managementStructureId = this.salesQuote.managementStructureId;
      this.salesOrderQuote.salesOrderQuoteNumber = this.salesQuote.salesOrderQuoteNumber;
      this.salesOrderQuote.versionNumber = this.salesQuote.versionNumber;
      this.salesOrderQuote.masterCompanyId = this.masterCompanyId;
      this.salesOrderQuote.buId = this.salesQuote.buId;
      this.salesOrderQuote.departmentId = this.salesQuote.departmentId;
      this.salesOrderQuote.divisionId = this.salesQuote.divisionId;
      this.salesOrderQuote.salesPersonId = editValueAssignByCondition(
        "employeeId",
        this.salesQuote.salesPersonName
      );
      this.salesOrderQuote.agentId = editValueAssignByCondition(
        "employeeId",
        this.salesQuote.agentId
      );
      this.salesOrderQuote.agentName = editValueAssignByCondition(
        "name",
        this.salesQuote.agentId
      );
      this.salesOrderQuote.customerSeviceRepId = editValueAssignByCondition(
        "employeeId",
        this.salesQuote.customerServiceRepName
      );

      this.salesOrderQuote.probabilityId = this.salesQuote.probabilityId;
      this.salesOrderQuote.employeeId = editValueAssignByCondition(
        "value",
        this.salesQuote.employeeName
      );
      this.salesOrderQuote.billToContactName = editValueAssignByCondition(
        "firstName",
        this.salesOrderQuote.billToContactId
      );
      this.salesOrderQuote.billToContactId = editValueAssignByCondition(
        "contactId",
        this.salesOrderQuote.billToContactId
      );
      this.salesOrderQuote.shipToContactName = editValueAssignByCondition(
        "firstName",
        this.salesOrderQuote.shipToContactId
      );
      this.salesOrderQuote.shipToContactId = editValueAssignByCondition(
        "contactId",
        this.salesOrderQuote.shipToContactId
      );
      this.salesOrderQuote.shipToUserId = editValueAssignByCondition(
        "value",
        this.salesOrderQuote.shipToUserId
      );
      this.salesOrderQuote.billToUserId = editValueAssignByCondition(
        "value",
        this.salesOrderQuote.billToUserId
      );
      this.salesOrderQuote.leadSourceId = this.salesQuote.leadSourceId;
      // this.salesOrderQuote.employeeId = this.salesQuote.employeeId;
      if (this.salesQuote.approvedDate)
        if (this.id) {
          this.salesOrderQuote.statusId = this.salesQuote.statusId;
          this.salesOrderQuote.statusChangeDate = this.salesQuote.statusChangeDate;
        }
      this.salesOrderQuote.creditLimit = this.salesQuote.creditLimit;
      this.salesOrderQuote.creditTermId = this.salesQuote.creditLimitTermsId;
      this.salesOrderQuote.restrictPMA = this.salesQuote.restrictPMA;
      this.salesOrderQuote.restrictDER = this.salesQuote.restrictDER;
      this.salesOrderQuote.quoteApprovedById = this.salesQuote.quoteApprovedById;
      if (this.salesQuote.approvedDate)
        this.salesOrderQuote.approvedDate = this.salesQuote.approvedDate.toDateString();
      this.salesOrderQuote.currencyId = this.salesQuote.currencyId;
      if (this.customerWarning && this.customerWarning.customerWarningId) {
        this.salesOrderQuote.customerWarningId = this.customerWarning.customerWarningId;
      } else {
        this.salesOrderQuote.customerWarningId = this.salesQuote.warningId;
      }
      this.salesOrderQuote.memo = this.salesQuote.memo;
      this.salesOrderQuote.notes = this.salesQuote.notes;
      this.salesOrderQuote.createdBy = this.userName;
      this.salesOrderQuote.updatedBy = this.userName;
      this.salesOrderQuote.createdOn = new Date().toDateString();
      this.salesOrderQuote.updatedOn = new Date().toDateString();
      this.salesQuoteView = new SalesQuoteView();
      this.salesQuoteView.createNewVersion = createNewVersion;
      this.salesQuoteView.salesOrderQuote = this.salesOrderQuote
      let partList: any = [];
      let invalidParts = false;
      let invalidDate = false;
      var errmessage = '';
      for (let i = 0; i < this.selectedParts.length; i++) {
        let selectedPart = this.selectedParts[i];
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
        // if (!selectedPart.customerRequestDate) {
        //   invalidParts = true;
        // }
        // if (!selectedPart.promisedDate) {
        //   invalidParts = true;
        // }
        // if (!selectedPart.estimatedShipDate) {
        //   invalidParts = true;
        // }
        // if (!(selectedPart.priorityId > 0)) {
        //   invalidParts = true;
        // }
        if (selectedPart.customerRequestDate && selectedPart.promisedDate && selectedPart.estimatedShipDate) {
          if (selectedPart.customerRequestDate < this.salesQuote.openDate ||
            selectedPart.estimatedShipDate < this.salesQuote.openDate ||
            selectedPart.promisedDate < this.salesQuote.openDate) {
            invalidDate = true;
          }
        }
        if (!invalidParts && !invalidDate) {
          let partNumberObj = this.salesQuoteService.marshalSOQPartToSave(selectedPart, this.userName);
          partList.push(partNumberObj);
        }
      }
      this.salesQuoteView.parts = partList;

      if (this.id) {
        if (invalidParts) {
          this.isSpinnerVisible = false;
          this.alertService.resetStickyMessage();
          // this.alertService.showStickyMessage('Sales Order Quote', "Please enter required fields for Sales Order Quote PartsList!", MessageSeverity.error);
          this.alertService.showStickyMessage('Sales Order Quote', errmessage, MessageSeverity.error);
        } else if (invalidDate) {
          this.isSpinnerVisible = false;
          this.alertService.resetStickyMessage();
          this.alertService.showStickyMessage('Sales Order Quote', "Please select valid Dates for Sales Order Quote PartsList!", MessageSeverity.error);
        } else {
          this.marginSummary.salesOrderQuoteId = this.id;
          this.marginSummary.misc = this.totalCharges;
          this.salesQuoteService.createSOQMarginSummary(this.marginSummary).subscribe(result => {
            this.marginSummary.soQuoteMarginSummaryId = result
          }, error => {
            this.isSpinnerVisible = false;
            const errorLog = error;
            this.onDataLoadFailed(errorLog)
          });
          this.salesQuoteService.update(this.salesQuoteView).subscribe(data => {
            this.SalesOrderQuoteId = data[0].salesOrderQuoteId;
            this.isCreateModeHeader = true;
            this.isSpinnerVisible = false;
            this.alertService.showMessage(
              "Success",
              `Quote updated successfully.`,
              MessageSeverity.success
            );
            this.router.navigateByUrl(`salesmodule/salespages/sales-quote-list`);
            this.toggle_po_header = false;
            if (submitType == false) {
            }
          }, error => {
            this.isSpinnerVisible = false;
            const errorLog = error;
            this.onDataLoadFailed(errorLog)
          });
        }
      } else {
        if (this.isCopyMode == true) {
          this.salesQuoteView.originalSalesOrderQuoteId = parseInt(this.quoteCopyRefId);
          this.salesQuoteView.salesOrderQuote.salesOrderQuoteId = null;
          this.salesQuoteView.salesOrderQuote.salesOrderQuoteNumber = undefined;
          if (this.salesQuoteView.parts.length > 0) {
            this.salesQuoteView.parts.filter(x => x.salesOrderQuotePartId = null)
          }
        }
        this.salesQuoteService.create(this.salesQuoteView).subscribe(data => {
          this.SalesOrderQuoteId = data[0].salesOrderQuoteId;
          this.salesQuoteView.salesOrderQuote.salesOrderQuoteId = this.SalesOrderQuoteId;
          this.isCreateModeHeader = true;
          this.isHeaderSubmit = true;
          this.isSpinnerVisible = false;
          this.alertService.showMessage(
            "Success",
            `Quote created successfully.`,
            MessageSeverity.success
          );
          this.toggle_po_header = false;
          this.id = this.SalesOrderQuoteId;
          if (this.SalesOrderQuoteId) {
            this.getSalesQuoteInstance(this.id);
            this.getCustomerDetails()
            this.isEdit = true;
          }
          if (!this.isCreateModeHeader) {
            this.router.navigateByUrl(`salesmodule/salespages/sales-quote-list`);
          }
        }
          , error => {
            this.isSpinnerVisible = false;
            const errorLog = error;
            this.onDataLoadFailed(errorLog)
          })
      }
    }
  }
  saveSalesQuoteHeader() {

    if (this.headerInfo.companyId == "null") {
      let haveError = false;
      if (this.salesQuote.quoteTypeId <= 0) {
        this.errorMessages.push("Please select Quote Type");
        haveError = true;
      }
      if (!this.salesQuote.openDate) {
        this.errorMessages.push("Please select Open Date");
        haveError = true;
      }
      if (this.salesQuote.validForDays < 1) {
        this.errorMessages.push("Please enter Valid For (Days)");
        haveError = true;
      }
      if (!this.salesQuote.quoteExpiryDate) {
        this.errorMessages.push("Please select Quote Expiry Date");
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
      if (!this.salesQuote.customerReferenceName) {
        this.errorMessages.push("Please enter Customer Reference Name");
        haveError = true;
      }
      if (!this.salesQuote.employeeName) {
        this.errorMessages.push("Please select employee");
        haveError = true;
      }
      if (this.salesQuote.managementStructureId <= 0) {
        this.errorMessages.push("Please select Management Structure");
        haveError = true;
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
      }
    }
    else {
      const headerInfoObj = {
        quoteTypeId: this.salesQuote.quoteTypeId,
        openDate: this.salesQuote.openDate.toDateString(),
        validForDays: this.salesQuote.validForDays,
        quoteExpireDate: this.salesQuote.quoteExpiryDate.toDateString(),
        accountTypeId: this.salesQuote.accountTypeId,
        customerId: this.salesQuote.customerId,
        customerContactId: this.salesQuote.customerContactId,
        customerReference: this.salesQuote.customerReferenceName,
        contractReference: this.salesQuote.contractReferenceName,
        managementStructureId: this.salesQuote.managementStructureId,
        salesOrderQuoteNumber: this.salesQuote.salesOrderQuoteNumber,
        versionNumber: this.salesQuote.versionNumber,
        salesPersonId: editValueAssignByCondition("employeeId", this.salesQuote.salesPersonName),
        agentId: editValueAssignByCondition("employeeId", this.salesQuote.agentId),
        agentName: editValueAssignByCondition("name", this.salesQuote.agentId),
        customerSeviceRepId: editValueAssignByCondition("employeeId", this.salesQuote.customerServiceRepName),
        probabilityId: this.salesQuote.probabilityId,
        employeeId: editValueAssignByCondition("value", this.salesQuote.employeeName),
        leadSourceId: this.salesQuote.leadSourceId,
        creditLimit: this.salesQuote.creditLimit,
        creditTermId: this.salesQuote.creditLimitTermsId,
        restrictPMA: this.salesQuote.restrictPMA,
        restrictDER: this.salesQuote.restrictDER,
        currencyId: this.salesQuote.currencyId,
        customerWarningId: this.salesQuote.warningId[0],
        memo: this.salesQuote.memo,
        notes: this.salesQuote.notes,
        createdBy: this.userName,
        updatedBy: this.userName,
        createdOn: new Date().toDateString(),
        updatedOn: new Date().toDateString()
      }

      if (!this.isCreateModeHeader) {
        this.salesQuoteService.saveSalesQuoteHeader({ ...headerInfoObj }).subscribe(saveddata => {
          this.SalesOrderQuoteId = saveddata.salesOrderQuoteId;
          this.qoId = saveddata.salesOrderQuoteId;
          this.headerInfo.salesOrderQuoteNumber = saveddata.salesOrderQuoteNumber;

          if (this.qoId) {
            this.isCreateModeHeader = true;
          }
        }, error => {
          this.isSpinnerVisible = false;
          const errorLog = error;
          this.onDataLoadFailed(errorLog)
        })
      } else {
        const poHeaderEdit = { ...headerInfoObj, SalesOrderQuoteId: parseInt(this.qoId) };
        this.salesQuoteService.saveSalesQuoteHeader({ ...poHeaderEdit }).subscribe(saveddata => {
          this.SalesOrderQuoteId = saveddata.salesOrderQuoteId;

          this.headerInfo.salesOrderQuoteNumber = saveddata.salesOrderQuoteNumber;

        }, error => {
          this.isSpinnerVisible = false;
          const errorLog = error;
          this.onDataLoadFailed(errorLog)
        });
      }
      this.toggle_po_header = true;
    }
  }
  quote: any = {
    quoteTypeId: null,
    quoteDate: Date
  };


  initiateSalesOrderCoversion() {
    this.selectAllForConversion = true;
    this.salesOrderConversionCriteriaObj.transferCharges = true;
    this.salesOrderConversionCriteriaObj.transferFreight = true;
    this.salesOrderConversionCriteriaObj.transferMemos = true;
    this.salesOrderConversionCriteriaObj.transferNotes = true;
    this.salesOrderConversionCriteriaObj.transferStockline = true;
    this.salesOrderConversionCriteriaObj.reserveStockline = true;
    this.salesOrderConversionCriteriaObj.customerReference = "";
    let content = this.salesQuoteConvertPopup;
    this.modal = this.modalService.open(content, { size: "sm", backdrop: 'static', keyboard: false });

    this.modal.result.then(
      () => {
      },
      () => {

      }
    )
  }

  inititateEmailQuote() {

    this.selectedCommunicationTab = "Quotemail";
    this.isEmailTabEnabled = true;
  }

  sendQuoteToCustomer() {
    this.salesQuoteService.sendQuoteToCustomer(this.id).subscribe(
      results => {
        this.alertService.showMessage(
          "Success",
          `Quote sent to customer successfully.`,
          MessageSeverity.success
        );

        this.closeModal()

      }, error => {
        this.isSpinnerVisible = false;
        const errorLog = error;
        this.onDataLoadFailed(errorLog)
      }
    );
  }

  convertSalesOrderQuote() {
    this.conversionStarted = true;
    this.isSpinnerVisible = true;
    this.salesOrderConversionCriteriaObj.salesOrderQuoteId = this.id;

    this.salesQuoteService.convertfromquote(this.salesOrderConversionCriteriaObj).subscribe(
      results => {


        this.alertService.showMessage(
          "Success",
          `Quote coverted to Order successfully.`,
          MessageSeverity.success
        );
        this.isSpinnerVisible = false;
        this.salesOrderView = results[0];

        this.closeModal();

        this.router.navigateByUrl(`salesmodule/salespages/sales-order-edit/${this.salesOrderView.salesOrder.customerId}/${this.salesOrderView.salesOrder.salesOrderId}`);
      }, error => {
        this.isSpinnerVisible = false;
        const errorLog = error;
        this.onDataLoadFailed(errorLog)
      }
    );

    this.isSpinnerVisible = false;
  }

  initiateQuoteCopying() {
    let content = this.copyQuotePopup;
    this.modal = this.modalService.open(content, { size: "sm", backdrop: 'static', keyboard: false });
    this.modal.result.then(
      () => {
      },
      () => {
      }
    )
  }

  copySalesOrderQuote() {
    let considerParts = false;
    if (this.copyConsiderations.isPartsAllowForCopy == true) {
      considerParts = true
    } else {
      considerParts = false;
    }
    let considerApprovers = false;
    this.salesQuoteService.initiateQuoteCopying(this.id).subscribe(
      results => {
        this.closeModal()
        this.router.navigate(['/salesmodule/salespages/sales-quote-create/' + results[0].salesOrderQuote.customerId], { queryParams: { copyRef: results[0].originalSalesOrderQuoteId, considerParts: considerParts, considerApprovers: considerApprovers } });
      }, error => {
        this.isSpinnerVisible = false;
        const errorLog = error;
        this.onDataLoadFailed(errorLog)
      }
    );
  }

  verifySalesQuoteConversion(results) {
    // this.salesQuoteService.verifySalesOrderConversion(salesQuoteId).subscribe(
    // results => {
    const resultsTemp = results;
    this.verifySalesOrderQuoteObj = resultsTemp;
    this.salesOrderConversionCriteriaObj = this.verifySalesOrderQuoteObj.salesOrderConversionCritera;
    this.salesOrderConversionCriteriaObj.customerReference = "";

    // }, error => {
    // this.isSpinnerVisible = false;
    // const errorLog = error;
    // this.onDataLoadFailed(errorLog)
    //   }
    // );
    ;

  }



  initiateClosingSalesOrderQuote() {

    let content = this.closeQuotePopup;
    this.modal = this.modalService.open(content, { size: "sm", backdrop: 'static', keyboard: false });
    this.modal.result.then(
      () => {
      },
      () => {
      }
    );

  }
  initiateCreatingNewQuote() {

    let content = this.newQuoteCreatePopup;
    this.modal = this.modalService.open(content, { size: "sm", backdrop: 'static', keyboard: false });
    this.modal.result.then(
      () => {
      },
      () => {
      }
    );

  }

  initiatePrintProcess() {
    let content = this.salesQuotePrintPopup;
    this.modal = this.modalService.open(content, { size: "lg", backdrop: 'static', keyboard: false });
    this.modal.result.then(
      () => {
      },
      () => {
      }
    )

  }
  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('quote_print_content').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Print tab</title>
          <style>
          .t0 td {
             
            border: 1px solid #999; 
            -webkit-print-color-adjust: exact; 
            
                }
                .t1 .td1, .t1 .td3 {
                    padding-right: 30px;
                }
                .t1 .td2{
                    padding-right: 100px;
                }
                .t4 th, .t3 th{
                    background: #4298ff;  
                    -webkit-print-color-adjust: exact; 
                    color: #FFF;
                    
                    padding: 5px;
                }
                .t4 th{
                 border: 1px solid #999;
 
                }
                .t2 th{
                    background: #c7c6c6;  
                    color: #000;
                    padding: 5px;
                    border: 1px solid #999;
                    -webkit-print-color-adjust: exact; 
                }
                .t2{
                    border: 1px solid #999;   
                    -webkit-print-color-adjust: exact; 
                    margin-top: 20px;
                }
               .t4 td{
                    border: 1px solid #999;
                    padding: 5px; 
                    -webkit-print-color-adjust: exact; 
            
                }
                .t2 td {
                    border-bottom: 1px solid #999;
                    -webkit-print-color-adjust: exact; 
                    border-left: 1px solid #999;
                    padding: 5px;
                }
                
                .t2 .th2, .t2 .td2{
                    width: 265px;
                }
                .t3 .td2{
                    border: 1px solid #999; 
                    min-width: 100px;
                    -webkit-print-color-adjust: exact; 
            
                }
                .t2 td{
                    height: 25px;
                }
               .t2 td.blank {
                border: 0;
                }
                .t3{
                 width: 100%;
                 margin-bottom: 20px;
               }
               .t3 th{
                 font-size: 12px !important;
               }
               .logo{
                 background: url("../../../../assets/images/PAS-logo.png");
                 width: 100px;
                 height: 100px;
               }
               table{
                 font-size: 12px !important;
               }
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }


  closeSalesOrderQuote() {
    this.salesQuoteService.closeSalesOrderQuote(this.id).subscribe(
      results => {
        this.isSpinnerVisible = false;
        this.alertService.showMessage(
          "Success",
          `Quote closed successfully.`,
          MessageSeverity.success
        );
        this.closeModal();
        this.router.navigateByUrl(`salesmodule/salespages/sales-quote-list`);
      }, error => {
        this.isSpinnerVisible = false;
        const errorLog = error;
        this.onDataLoadFailed(errorLog)
      }
    );
  }

  newQuoteEvent() {
    this.closeModal();
    this.router.navigateByUrl('/salesmodule/salespages/sales-quote-create/' + this.customerId);
  }
  closeModal() {
    this.modal.close();
  }

  openConfirmationModal(submitType: boolean) {

    this.submitType = submitType;

    this.modal = this.modalService.open(this.updateConfirmationModal, { size: "sm" });
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

  onPartsApprovedEvent(approved: boolean) {
    if (approved) {
      this.selectedParts = [];
      this.getSalesQuoteInstance(this.id);
    }
  }

  onPartsSaveEvent(savedParts) {
    if (savedParts) {
      this.marginSummary = this.salesQuoteService.getSalesQuoteHeaderMarginDetails(savedParts, this.marginSummary);
      this.updateMarginSummary();
    }
  }

  updateMarginSummary() {
    this.isSpinnerVisible = true;
    this.marginSummary.salesOrderQuoteId = this.id;
    this.salesQuoteService.createSOQMarginSummary(this.marginSummary).subscribe(result => {
      this.marginSummary.soQuoteMarginSummaryId = result;
      this.isSpinnerVisible = false;
    }, error => {
      this.isSpinnerVisible = false;
      const errorLog = error;
      this.onDataLoadFailed(errorLog)
    })
  }

  onTabChange(event) {
    if (event.index == 0) {
      this.salesPartNumberComponent.refresh();
    }
    if (event.index == 1) {
      this.salesApproveComponent.refresh(this.marginSummary);
    }
    if (event.index == 2) {
      this.salesCustomerApprovalsComponent.refresh(this.marginSummary, this.salesQuote.salesOrderQuoteId);
    }
    // if (event.index == 3) {
    //   this.salesAddressComponent.refresh(this.salesOrderQuote);
    // }
    if (event.index == 4) {
      if (this.salesQuote.statusName == "Open" || this.salesQuote.statusName == "Partially Approved") {
        this.salesOrderQuoteFreightComponent.refresh(false);
      } else {
        this.salesOrderQuoteFreightComponent.refresh(true);
      }
      // this.salesOrderQuoteFreightComponent.refresh();
    }
    if (event.index == 5) {
      if (this.salesQuote.statusName == "Open" || this.salesQuote.statusName == "Partially Approved") {
        this.salesOrderQuoteChargesComponent.refresh(false);
      } else {
        this.salesOrderQuoteChargesComponent.refresh(true);
      }
      // this.salesOrderQuoteChargesComponent.refresh();
    }
    if (event.index == 6) {
      this.salesQuoteDocumentsComponent.refresh();
    }
    if (event.index == 7) {
      this.salesQuoteAnalysisComponent.refresh(this.id);
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
    this.salesQuoteService.setTotalFreights(e);
    this.setFreightsOrCharges();
    this.updateMarginSummary();
  }

  updateSalesOrderFreightsList(e) {
    this.totalFreights = e;
    this.marginSummary.freightAmount = this.totalFreights;
    this.salesQuoteService.setTotalFreights(e);
    this.setFreightsOrCharges();
    this.updateMarginSummary();
  }

  getFreightList() {
  }

  saveSalesOrderChargesList(e) {
    this.totalCharges = e;
    this.marginSummary.misc = this.totalCharges;
    this.salesQuoteService.setTotalCharges(e);
    this.setFreightsOrCharges();
    this.updateMarginSummary();
  }

  updateSalesOrderChargesList(e) {
    this.totalCharges = e;
    this.salesQuoteService.setTotalCharges(e);
    this.marginSummary.misc = this.totalCharges;
    this.setFreightsOrCharges();
    this.updateMarginSummary();
  }

  getChargesList() {
  }
}