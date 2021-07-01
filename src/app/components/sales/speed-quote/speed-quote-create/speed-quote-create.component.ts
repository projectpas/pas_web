import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, ɵConsole,OnChanges } from "@angular/core";
import {
  NgForm,
  FormGroup
} from "@angular/forms";
import { CustomerSearchQuery } from "../../quotes/models/customer-search-query";
import { CustomerService } from "../../../../services/customer.service";
import { Customer } from "../../../../models/customer.model";
import {
  AlertService,
  MessageSeverity
} from "../../../../services/alert.service";
import { ActivatedRoute } from "@angular/router";
import { CommonService } from "../../../../services/common.service";
import { CurrencyService } from "../../../../services/currency.service";
import { EmployeeService } from "../../../../services/employee.service";
import { AuthService } from "../../../../services/auth.service";
import { Router } from "@angular/router";
import { getValueFromArrayOfObjectById } from "../../../../generic/autocomplete";
import {
  getObjectById,
  editValueAssignByCondition
} from "../../../../generic/autocomplete";
import {
  NgbModal,
  NgbModalRef
} from "@ng-bootstrap/ng-bootstrap";
import { CustomerViewComponent } from "../../../../shared/components/customer/customer-view/customer-view.component";
import { Subject } from "rxjs";
import { ManagementStructureComponent } from "../../quotes/shared/components/management-structure/management-structure.component";
import { SalesAddressComponent } from "../../quotes/shared/components/sales-address/sales-address.component";
import { DBkeys } from "../../../../services/db-Keys";
import { CopyConsiderationsForSalesQuote } from "../../quotes/models/copy-considerations-for-sales-quote";
import { VerifySalesQuoteModel } from "../../quotes/models/verify-sales-quote-model";
import { SalesOrderConversionCritera } from "../../quotes/models/sales-order-conversion-criteria";
import { SalesOrderView } from "../../../../models/sales/SalesOrderView";
import { MenuItem } from "primeng/api";
import { SalesApproveComponent } from "../../quotes/shared/components/sales-approve/sales-approve.component";
import { SalesCustomerApprovalsComponent } from "../../quotes/shared/components/sales-customer-approvals/sales-customer-approvals.component";
import { forkJoin } from "rxjs/observable/forkJoin";
import { SalesPartNumberComponent } from "../../shared/components/sales-part-number/sales-part-number.component";
import { SpeedQuotePartNumberComponent } from "../shared/components/speed-quote-part-number/speed-quote-part-number.component";
import { SalesQuoteDocumentsComponent } from "../../quotes/sales-document/salesQuote-document.component";
import { SalesQuoteAnalysisComponent } from "../../quotes/sales-quote-analysis/sales-quote-analysis.component"
import { SpeedQuote } from "../../../../models/sales/SpeedQuote.model";
import { ISpeedQuote } from "../../../../models/sales/ISpeedQuote.model";
import { SpeedQuoteService } from "../../../../services/speedquote.service";
import { ISpeedQuoteView } from "../../../../models/sales/ISpeedQuoteView";
import { ISpeedQte } from "../../../../models/sales/ISpeedQte";
import { SpeedQuoteView } from "../../../../models/sales/SpeedQuoteView";
import { SpeedQuoteMarginSummary } from "../../../../models/sales/SpeedQuoteMarginSummary";
import { SpeedQuoteTypeEnum } from "../models/speed-auote-type-enum";
import { SpeedQuoteExclusionsComponent } from "../shared/components/speed-quote-exclusions/speed-quote-exclusions.component";
import { SpeedQuotePrintCritera } from "../models/speed-quote-print-criteria";
declare var $: any;
import { ConfigurationService } from '../../../../services/configuration.service';
@Component({
  selector: "app-speed-quote-create",
  templateUrl: "./speed-quote-create.component.html",
  styleUrls: ["./speed-quote-create.component.scss"]
})

export class SpeedQuoteCreateComponent implements OnInit {
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
  SpeedQuoteId: number;
  salesQuote: ISpeedQuote;
  enableUpdateButton = true;
  defaultSettingPriority;
  speedQuote: ISpeedQte;
  salesOrderQuoteObj: any = {};
  speedQuoteView: ISpeedQuoteView;
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
  accountTypes: any[] = [];
  selectedParts: any[] = [];
  modal: NgbModalRef;
  printmodal: NgbModalRef;
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
  salesOrderQuoteId: number;
  errorMessages: any[] = [];
  isEdit: boolean = false;
  jobTitles: any;
  csrOriginalList: any[] = [];
  agentsOriginalList: any[] = [];
  salesPersonOriginalList: any[] = [];
  salesPersonAndAgentOriginalList: any[] = [];
  managementStructureId: any;
  marginSummary: SpeedQuoteMarginSummary = new SpeedQuoteMarginSummary();
  headerInfo: any = {};
  toggle_po_header: boolean = true;
  qoId: any;
  leadSources = [];
  businessUnitList: any;
  departmentList: any;
  divisionList: any;
  bulist: any[] = [];
  divisionlist: any[] = [];
  SpeedQuoteType: SpeedQuoteTypeEnum;
  speedQuotePrintCriteraObj: SpeedQuotePrintCritera;
  private onDestroy$: Subject<void> = new Subject<void>();
  @ViewChild("errorMessagePop", { static: false }) public errorMessagePop: ElementRef;
  @ViewChild("closeQuotePopup", { static: false }) public closeQuotePopup: ElementRef;
  @ViewChild("newQuoteCreatePopup", { static: false }) public newQuoteCreatePopup: ElementRef;
  @ViewChild("copyQuotePopup", { static: false }) public copyQuotePopup: ElementRef;
  @ViewChild("newSalesQuoteForm", { static: false }) public newSalesQuoteForm: NgForm;
  @ViewChild("salesQuoteConvertPopup", { static: false }) public salesQuoteConvertPopup: ElementRef;
  @ViewChild("emailQuotePopup", { static: false }) public emailQuotePopup: ElementRef;
  @ViewChild("emailSendQuotePopup", { static: false }) public emailSendQuotePopup: ElementRef;
  @ViewChild("salesQuotePrintPopup", { static: false }) public salesQuotePrintPopup: ElementRef;
  @ViewChild("speedQuoteExclusionePrintPopup", { static: false }) public speedQuoteExclusionePrintPopup: ElementRef;
  @ViewChild("speedQuotePrintCritariaPopup", { static: false }) public speedQuotePrintCritariaPopup: ElementRef;
  @ViewChild(SalesApproveComponent, { static: false }) public salesApproveComponent: SalesApproveComponent;
  @ViewChild(SpeedQuotePartNumberComponent, { static: false }) public speedQuotePartNumberComponent: SpeedQuotePartNumberComponent;
  @ViewChild(SalesQuoteDocumentsComponent, { static: false }) public salesQuoteDocumentsComponent: SalesQuoteDocumentsComponent;
  @ViewChild(SalesQuoteAnalysisComponent, { static: false }) public salesQuoteAnalysisComponent: SalesQuoteAnalysisComponent;
  @ViewChild(ManagementStructureComponent, { static: false }) public managementStructureComponent: ManagementStructureComponent;
  @ViewChild(SalesAddressComponent, { static: false }) public salesAddressComponent: SalesAddressComponent;
  @ViewChild(SpeedQuoteExclusionsComponent, { static: false }) public speedQuoteExclusionsComponent: SpeedQuoteExclusionsComponent;
  isCopyMode: boolean = false;
  quoteCopyRefId: any;
  copyConsiderations: CopyConsiderationsForSalesQuote;
  deletePartsWhileCopieng: boolean = false;
  deleteApproversWhileCopieng: boolean = false;
  verifySalesOrderQuoteObj: VerifySalesQuoteModel;
  salesOrderConversionCriteriaObj: SalesOrderConversionCritera;
  salesOrderView: SalesOrderView;
  @ViewChild("updateConfirmationModal", { static: false })
  public updateConfirmationModal: ElementRef;
  submitType: boolean = true;
  customerWarning: any = {};
  conversionStarted: boolean = false;
  isEmailQuoteTabEnabled: boolean = false;
  isCreateModeHeader: boolean = false;
  isHeaderSubmit: boolean = false;
  customerInfoFromSalesQuote: any = {}
  isSpinnerVisible: Boolean = false;
  addressType: any = 'SPQ';
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
  moduleName: any = "SpeedQuote";
  enforceApproval: boolean;
  selectedIndex: number = 0;
  exclusionCount:number = 0;
  exclusionSelectDisable:boolean=false;
  constructor(
    private customerService: CustomerService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private speedQuoteService: SpeedQuoteService,
    private commonservice: CommonService,
    private commonService: CommonService,
    public currencyService: CurrencyService,
    public employeeService: EmployeeService,
    private authService: AuthService,
    private router: Router,
    private modalService: NgbModal,
    private changeDetector: ChangeDetectorRef,
    private configurations: ConfigurationService,
  ) {
    this.salesQuote = new SpeedQuote();
    this.copyConsiderations = new CopyConsiderationsForSalesQuote();
    this.verifySalesOrderQuoteObj = new VerifySalesQuoteModel();
    this.salesOrderConversionCriteriaObj = new SalesOrderConversionCritera();
    this.globalCustomerWarningId = DBkeys.GLOBAL_CUSTOMER_WARNING_ID_FOR_SALES_ORDER;
    this.conversionStarted = false;
    this.speedQuotePrintCriteraObj = new SpeedQuotePrintCritera();
  }

  ngOnInit() {
    this.loadSOStatus();
    this.isSpinnerVisible = true;
    this.initCommunication();
    this.customerId = +this.route.snapshot.paramMap.get("customerId");
    this.id = +this.route.snapshot.paramMap.get("id");
    this.SpeedQuoteId = this.id;
    this.salesQuote.priorityId = DBkeys.DEFAULT_PRIORITY_ID;
    this.isCreateModeHeader = false;
    this.speedQuoteService.resetSalesOrderQuote();
    this.speedQuoteService.getSpeedQuteInstance().subscribe(data => {
      this.speedQuote = data;
      this.speedQuote.statusChangeDate = new Date();
    });
    this.speedQuoteService.getSelectedParts().subscribe(data => {
      this.selectedParts = data;
    });
    this.managementStructureId = this.currentUserManagementStructureId;

    if (!this.isEdit) {
      this.load(this.managementStructureId);
    }

    setTimeout(() => {
      this.getSOQInstance(true);
    }, 1200);

    if (this.id) {
      //this.getMarginSummary()
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
        setTimeout(() => {
          this.toggle_po_header = true;
        }, 1600);
      }
    });
    this.getAllEmployees('');
    this.getAllEmailType('');
    this.customerContacts('');
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
  }

  getInitialDataForSOQ() {
    this.isSpinnerVisible = true;
    let probabilityId = this.salesQuote.probabilityId ? this.salesQuote.probabilityId : 0;
    let creditLimitTermsId = this.salesQuote.creditLimitTermsId ? this.salesQuote.creditLimitTermsId : 0;
    let leadSourceId = this.salesQuote.leadSourceId ? this.salesQuote.leadSourceId : 0;
    let warningTypeId = 0;
    forkJoin(
      this.customerService.getCustomerCommonDataWithContactsById(this.customerId, this.salesQuote.customerContactId),
      this.commonservice.getCSRAndSalesPersonOrAgentList(this.currentUserManagementStructureId, this.customerId, this.salesQuote.customerServiceRepId, this.salesQuote.salesPersonId),
      this.commonservice.autoSuggestionSmartDropDownList('CustomerWarningType', 'CustomerWarningTypeId', 'Name', '', true, 100, [warningTypeId].join(), this.masterCompanyId),
      this.commonService.autoSuggestionSmartDropDownList("[Percent]", "PercentId", "PercentValue", '', true, 200, [probabilityId].join(), this.masterCompanyId),
      this.commonService.autoSuggestionSmartDropDownList("CreditTerms", "CreditTermsId", "Name", '', true, 200, [creditLimitTermsId].join(), this.masterCompanyId),
      this.commonService.autoSuggestionSmartDropDownList("LeadSource", "LeadSourceId", "LeadSources", '', true, 100, [leadSourceId].join(), this.masterCompanyId),

      this.speedQuoteService.getAllSpeedQuoteSettings(this.masterCompanyId)).subscribe(result => {
        this.isSpinnerVisible = false;
        this.setAllCustomerContact(result[0]);
        this.customerDetails = result[0];
        this.setCSRAndSalesPersonOrAgentList(result[1]);
        this.setTypesOfWarnings(result[2]);
        this.setPercents(result[3]);
        this.setCreditTerms(result[4]);
        this.setLeadSources(result[5]);
        this.setValidDays(result[6]);
        this.getCustomerDetails();
        if (this.id) {
        } else {
          this.getDefaultContact();
        }
        this.setCSR();
        this.setSalesPerson();
      }, error => {
        this.isSpinnerVisible = false;
      });
  }

  filterUniqueIds(csrList) {
    let uniqueList = [];
    if (csrList && csrList.length > 0) {
      csrList.forEach(object => {
        if (uniqueList && uniqueList.length > 0) {
          let itemFound = uniqueList.find(x => x.employeeId == object.employeeId);
          if (!itemFound) {
            uniqueList.push(object);
          }
        } else {
          uniqueList.push(object);
        }

      });
    }
    return uniqueList;
  }

  // getMarginSummary() {
  //   this.speedQuoteService.getSOQMarginSummary(this.id).subscribe(result => {
  //     this.setSOQMarginSummary(result);
  //   }, error => {
  //     const errorLog = error;
  //   })
  // }

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
      this.speedQuoteService.setTotalCharges(this.marginSummary.misc);
      this.speedQuoteService.setTotalFreights(this.marginSummary.freightAmount);
    } else {
      this.marginSummary = new SpeedQuoteMarginSummary;
    }
  }

  getSOQInstance(isInitialCall) {
    if (this.id) {
      this.getSalesQuoteInstance(this.id, false, isInitialCall);
      this.isEdit = true;
    } else {
      this.getNewSalesQuoteInstance(this.customerId, isInitialCall);
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

  setLeadSources(leadSources) {
    this.leadSources = leadSources;
  }

  setTypesOfWarnings(warningsData) {
    if (warningsData && warningsData.length > 0) {
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
      });
  }

  setCSRAndSalesPersonOrAgentList(csrAndSalesPersonList) {
    this.csrOriginalList = this.filterUniqueIds(csrAndSalesPersonList.csrEmpList);
    this.salesPersonAndAgentOriginalList = this.filterUniqueIds(csrAndSalesPersonList.salesEmpList);
  }

  getCustomerDetails() {
    if (this.customerDetails) {
      this.salesQuote.customerName = this.customerDetails.name;
      this.salesQuote.customerEmail = this.customerDetails.email;
      this.salesQuote.customerCode = this.customerDetails.customerCode;
      this.customerInfoFromSalesQuote = {
        customerName: this.customerDetails.name,
        customerCode: this.customerDetails.customerCode,
        customerId: this.customerDetails.customerId
      }
      if (!this.isEdit) {
        this.salesQuote.salesPersonId = this.customerDetails.primarySalesPersonId;
        this.salesQuote.customerServiceRepId = this.customerDetails.csrId;
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
    }
  }

  enableHeaderSave() {
    this.enableUpdateButton = false;
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
      if (this.allCustomer && this.allCustomer.length > 0) {
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
    let isDefaultContactFound = false;
    if (this.customerContactList) {
      if (this.customerContactList && this.customerContactList.length > 0) {
        for (let i = 0; i < this.customerContactList.length; i++) {
          let isDefaultContact = this.customerContactList[i].isDefaultContact;
          if (isDefaultContact) {
            isDefaultContactFound = true;
            this.salesQuote.customerContactId = this.customerContactList[
              i
            ].customerContactId;
          } else if (!isDefaultContactFound) {
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
        this.customerContactList[i]['email'] = this.customerContactList[i].email;
      }
    }

    if (result !== undefined) {
      let accountTypeId = result.customerTypeId ? result.customerTypeId : 0;

      this.commonService.autoSuggestionSmartDropDownList('CustomerType', 'CustomerTypeId', 'Description', '',
        true, 100, [accountTypeId].join(), this.masterCompanyId).subscribe(accountTypes => {
          this.accountTypes = accountTypes;
        })
    }
  }

  getManagementStructureDetails(id, empployid = 0, editMSID = 0) {
    empployid = empployid == 0 ? this.employeeId : empployid;
    editMSID = this.isEdit ? editMSID = id : 0;
    this.isSpinnerVisible = true;
    this.commonService.getManagmentStrctureData(id, empployid, editMSID, this.masterCompanyId).subscribe(response => {
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
    if (this.arrayEmplsit && this.arrayEmplsit.length == 0) {
      this.arrayEmplsit.push(0);
    }
    this.arrayEmplsit.push(this.employeeId == null ? 0 : this.employeeId);
    this.isSpinnerVisible = true;
    this.commonService.autoCompleteDropdownsEmployeeByMS(strText, true, 20, this.arrayEmplsit.join(), manStructID, this.masterCompanyId).subscribe(res => {
      this.isSpinnerVisible = false;
      this.allEmployeeList = res;
      this.firstCollection = res;
      this.currentUserEmployeeName = getValueFromArrayOfObjectById('label', 'value', this.employeeId, res);
      if (!this.isEdit) {
        this.getEmployeerOnLoad(this.salesQuote.employeeId ? this.salesQuote.employeeId.value : this.employeeId);
      }

      this.changeDetector.detectChanges();
    }, err => {
      this.isSpinnerVisible = false;
    });
  }

  setEditArray: any = [];

  getEmployeerOnLoad(id) {
    this.salesQuote.employeeId = getObjectById('value', id, this.allEmployeeList);
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
    }
    else {
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
      this.commonService.getManagementStructurelevelWithEmployee(divisionId, this.employeeId).subscribe(res => {
        this.departmentList = res;
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

  onDataLoadFailedCustom(error) {
    this.isSpinnerVisible = false;
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

  getSalesQuoteInstance(salesQuoteId: number, partsRefresh = false, isInitialCall = false) {
    this.isSpinnerVisible = true;
    if (this.isCopyMode) {
      this.selectedParts = [];
    }
    this.speedQuoteService.getSpeedQuote(salesQuoteId).subscribe(data => {
      if (data) {
        this.speedQuoteView = data && data.length ? data[0] : null;
        this.salesOrderQuoteObj = this.speedQuoteView.speedQuote;
        //this.verifySalesQuoteConversion(this.speedQuoteView.verificationResult);
        this.toggle_po_header = false;
      }
      // if (this.deletePartsWhileCopieng == true) {
      //   this.speedQuoteView.parts = [];
      // }

      let partList: any[] = this.speedQuoteView.parts;
      this.selectedParts = [];
      for (let i = 0; i < partList.length; i++) {
        let selectedPart = partList[i];
        let partNumberObj = this.speedQuoteService.marshalSpeedQPartToView(selectedPart);
        const selectedPartsTemp = this.selectedParts;
        selectedPartsTemp.push(partNumberObj)
        this.speedQuoteService.selectedParts = selectedPartsTemp;
      }
      this.arrayEmplsit.push(this.salesOrderQuoteObj.employeeId);
      if (!partsRefresh || !isInitialCall) {
        this.load(this.salesOrderQuoteObj.managementStructureId);
      }

      //this.marginSummary = this.speedQuoteService.getSpeedQuoteHeaderMarginDetails(this.speedQuoteService.selectedParts, this.marginSummary);
      this.salesQuote.managementStructureId = this.salesOrderQuoteObj.managementStructureId;
      this.managementStructureId = this.salesOrderQuoteObj.managementStructureId;
      this.salesQuote.salesQuoteTypes = this.speedQuoteView.salesQuoteTypes;
      this.salesQuote.status = this.speedQuoteView.status;
      this.salesQuote.priorities = this.speedQuoteView.priorities;
      if (this.speedQuotePartNumberComponent) {
        this.speedQuotePartNumberComponent.refresh();
      }
      //this.salesQuote.speedQuoteId = this.salesOrderQuoteObj.salesOrderQuoteId;
      this.salesQuote.speedQuoteId = this.salesOrderQuoteObj.speedQuoteId;
      //this.salesQuote.speedQuoteTypeId = this.salesOrderQuoteObj.quoteTypeId;
      this.salesQuote.speedQuoteTypeId = this.salesOrderQuoteObj.speedQuoteTypeId;
      this.salesQuote.statusId = this.salesOrderQuoteObj.statusId;
      this.salesQuote.statusChangeDate = new Date(
        this.salesOrderQuoteObj.statusChangeDate
      );
      this.salesQuote.openDate = new Date(this.salesOrderQuoteObj.openDate);
      this.salesQuote.validForDays = this.salesOrderQuoteObj.validForDays;
      this.salesQuote.quoteExpiryDate = new Date(
        this.salesOrderQuoteObj.quoteExpireDate
      );

      this.salesQuote.speedQuoteNumber = this.salesOrderQuoteObj.speedQuoteNumber;
      this.salesQuote.versionNumber = this.salesOrderQuoteObj.versionNumber;
      this.salesQuote.accountTypeId = this.salesOrderQuoteObj.accountTypeId;
      this.salesQuote.customerId = this.salesOrderQuoteObj.customerId;
      this.salesQuote.customerContactId = this.salesOrderQuoteObj.customerContactId;
      this.salesQuote.customerReferenceName = this.salesOrderQuoteObj.customerReference;
      this.salesQuote.contractReferenceName = this.salesOrderQuoteObj.contractReference;
      this.salesQuote.quoteApprovedById = this.salesOrderQuoteObj.quoteApprovedById;
      this.salesQuote.quoteApprovedById = this.salesOrderQuoteObj.quoteApprovedById;
      this.salesQuote.employeeId = getObjectById('value', this.salesOrderQuoteObj.employeeId, this.allEmployeeList)//this.salesOrderQuoteObj.employeeId;
      this.salesQuote.managementStructureId = this.salesOrderQuoteObj.managementStructureId;
      //this.speedQuote.speedQuoteId = this.salesOrderQuoteObj.salesOrderQuoteId;
      //this.speedQuote.speedQuoteId = this.salesOrderQuoteObj.speedQuoteId;
      this.salesQuote.speedQuoteId = this.salesOrderQuoteObj.speedQuoteId;
      this.salesQuote.probabilityId = this.salesOrderQuoteObj.probabilityId;
      this.salesQuote.leadSourceId = this.salesOrderQuoteObj.leadSourceId;
      this.salesQuote.leadSourceReference = this.salesOrderQuoteObj.leadSourceReference;
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
      this.salesQuote.statusName = this.speedQuoteView.speedQuote.statusName;
      this.salesQuote.isApproved = this.speedQuoteView.speedQuote.isApproved;
      this.salesQuote.customerServiceRepId = this.salesOrderQuoteObj.customerSeviceRepId;
      this.salesQuote.salesPersonId = this.salesOrderQuoteObj.salesPersonId;
      this.isSpinnerVisible = false;
      if (isInitialCall) {
        this.getInitialDataForSOQ();
      }
    }, error => {
      this.isSpinnerVisible = false;
    });
  }

  setValidDaysBasedOnSettings(isEdit) {
    if (this.validDaysSettingsList && this.validDaysSettingsList.length > 0) {
      let validDaysObject = this.validDaysSettingsList[0];
      if (validDaysObject) {
        if (!isEdit) {
          this.salesQuote.validForDays = validDaysObject.validDays;
          this.salesQuote.speedQuoteTypeId = validDaysObject.quoteTypeId;
          this.salesQuote.statusId = validDaysObject.defaultStatusId;
          this.salesQuote.statusName = validDaysObject.defaultStatusName;
        }
        this.defaultSettingPriority = validDaysObject.defaultPriorityId;
        this.enforceApproval = validDaysObject.isApprovalRule;
      } else {
        this.salesQuote.validForDays = 10;
        if (this.salesQuote.salesQuoteTypes && this.salesQuote.salesQuoteTypes.length > 0) {
          this.salesQuote.speedQuoteTypeId = this.salesQuote.salesQuoteTypes[0].id;

        }
      }
    } else {
      this.salesQuote.validForDays = 10;
      if (this.salesQuote.salesQuoteTypes && this.salesQuote.salesQuoteTypes.length > 0) {
        this.salesQuote.speedQuoteTypeId = this.salesQuote.salesQuoteTypes[0].id;
      }
    }
  }

  getNewSalesQuoteInstance(customerId: number, isInitialCall = false) {
    this.isSpinnerVisible = true;
    this.speedQuoteService
      .getNewSpeedQuoteInstance(customerId)
      .subscribe(data => {
        this.salesQuote = data && data.length ? data[0] : null;
        this.salesQuote.openDate = new Date();
        this.salesQuote.speedQuoteTypeId = SpeedQuoteTypeEnum.MRO;
        this.salesQuote.quoteExpiryDate = new Date();
        this.salesQuote.statusChangeDate = new Date();
        this.salesQuote.managementStructureId = this.currentUserManagementStructureId;
        this.salesQuote.companyId = this.masterCompanyId;
        this.salesQuote.leadSourceId = null;
        this.salesQuote.probabilityId = null;
        this.salesQuote.speedQuoteNumber = "Creating";
        this.load(this.managementStructureId);
        this.getInitialDataForSOQ();
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
    this.enableUpdateButton = false;
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

  viewSelectedRow() {
    this.modal = this.modalService.open(CustomerViewComponent, { size: "lg", backdrop: 'static', keyboard: false });
    this.modal.componentInstance.customerId = this.customerId;
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
    if (this.salesQuote.speedQuoteTypeId <= 0) {
      this.errorMessages.push("Please select Speed Quote Type");
      haveError = true;
    }
    if (!this.salesQuote.openDate) {
      this.errorMessages.push("Please select Open Date");
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
    if (!this.salesQuote.employeeId) {
      this.errorMessages.push("Please select employee");
      haveError = true;
    }
    if (this.salesQuote.companyId <= 0) {
      this.errorMessages.push("Please select Management Structure");
      haveError = true;
    }

    if (haveError) {
      let content = this.errorMessagePop;
      this.errorModal = this.modalService.open(content, { size: "sm", backdrop: 'static', keyboard: false });
      this.display = true;
    } else {
      this.display = false;
      this.isSpinnerVisible = true;
      if(this.id)
        this.speedQuote.speedQuoteId = this.id;
      this.speedQuote.speedQuoteTypeId = this.salesQuote.speedQuoteTypeId;
      this.speedQuote.openDate = this.salesQuote.openDate.toDateString();
      this.speedQuote.validForDays = this.salesQuote.validForDays;
      this.speedQuote.quoteExpireDate = this.salesQuote.quoteExpiryDate.toDateString();
      this.speedQuote.accountTypeId = this.salesQuote.accountTypeId;
      this.speedQuote.customerId = this.salesQuote.customerId;
      this.speedQuote.customerContactId = this.salesQuote.customerContactId;
      this.speedQuote.customerReference = this.salesQuote.customerReferenceName;
      this.speedQuote.contractReference = this.salesQuote.contractReferenceName;
      this.speedQuote.leadSourceReference = this.salesQuote.leadSourceReference;
      this.speedQuote.managementStructureId = this.salesQuote.managementStructureId;
      this.speedQuote.speedQuoteNumber = this.salesQuote.speedQuoteNumber;
      this.speedQuote.versionNumber = this.salesQuote.versionNumber;
      this.speedQuote.masterCompanyId = this.masterCompanyId;
      this.speedQuote.buId = this.salesQuote.buId;
      this.speedQuote.departmentId = this.salesQuote.departmentId;
      this.speedQuote.divisionId = this.salesQuote.divisionId;
      this.speedQuote.salesPersonId = editValueAssignByCondition(
        "employeeId",
        this.salesQuote.salesPersonName
      );
      this.speedQuote.agentId = editValueAssignByCondition(
        "employeeId",
        this.salesQuote.agentId
      );
      this.speedQuote.agentName = editValueAssignByCondition(
        "name",
        this.salesQuote.agentId
      );
      this.speedQuote.customerSeviceRepId = editValueAssignByCondition(
        "employeeId",
        this.salesQuote.customerServiceRepName
      );

      this.speedQuote.probabilityId = this.salesQuote.probabilityId;
      this.speedQuote.employeeId = editValueAssignByCondition(
        "value",
        this.salesQuote.employeeId
      );

      this.speedQuote.leadSourceId = this.salesQuote.leadSourceId;
      if (this.salesQuote.approvedDate)
        if (this.id) {
          this.speedQuote.statusId = this.salesQuote.statusId;
          this.speedQuote.statusChangeDate = this.salesQuote.statusChangeDate;
        }
      this.speedQuote.creditLimit = this.salesQuote.creditLimit;
      this.speedQuote.creditTermId = this.salesQuote.creditLimitTermsId;
      this.speedQuote.restrictPMA = this.salesQuote.restrictPMA;
      this.speedQuote.restrictDER = this.salesQuote.restrictDER;
      this.speedQuote.quoteApprovedById = this.salesQuote.quoteApprovedById;
      if (this.salesQuote.approvedDate)
        this.speedQuote.approvedDate = this.salesQuote.approvedDate.toDateString();
      this.speedQuote.currencyId = this.salesQuote.currencyId;
      if (this.customerWarning && this.customerWarning.customerWarningId) {
        this.speedQuote.customerWarningId = this.customerWarning.customerWarningId;
      } else {
        this.speedQuote.customerWarningId = this.salesQuote.warningId;
      }
      this.speedQuote.memo = this.salesQuote.memo;
      this.speedQuote.notes = this.salesQuote.notes;
      this.speedQuote.createdBy = this.userName;
      this.speedQuote.updatedBy = this.userName;
      this.speedQuote.createdOn = new Date().toDateString();
      this.speedQuote.updatedOn = new Date().toDateString();
      this.speedQuoteView = new SpeedQuoteView();
      this.speedQuoteView.createNewVersion = createNewVersion;
      this.speedQuoteView.speedQuote = this.speedQuote
      let partList: any = [];
      let invalidParts = false;
      let invalidDate = false;
      var errmessage = '';
      for (let i = 0; i < this.selectedParts.length; i++) {
        let partNameAdded = false;
        let selectedPart = this.selectedParts[i];
        // if (!selectedPart.customerRequestDate) {
        //   this.isSpinnerVisible = false;
        //   invalidParts = true;
        //   if (!partNameAdded) {
        //     errmessage = errmessage + '<br />PN - ' + selectedPart.partNumber;
        //     partNameAdded = true;
        //   }
        //   errmessage = errmessage + '<br />' + "Please enter Customer Request Date."
        // }
        // if (!selectedPart.estimatedShipDate) {
        //   this.isSpinnerVisible = false;
        //   invalidParts = true;
        //   if (!partNameAdded) {
        //     errmessage = errmessage + '<br />PN - ' + selectedPart.partNumber;
        //     partNameAdded = true;
        //   }
        //   errmessage = errmessage + '<br />' + "Please enter Estimated Ship Date."
        // }
        // if (!selectedPart.promisedDate) {
        //   this.isSpinnerVisible = false;
        //   invalidParts = true;
        //   if (!partNameAdded) {
        //     errmessage = errmessage + '<br />PN - ' + selectedPart.partNumber;
        //     partNameAdded = true;
        //   }
        //   errmessage = errmessage + '<br />' + "Please enter Promised Date."
        // }
        // if (!selectedPart.priorityId) {
        //   this.isSpinnerVisible = false;
        //   invalidParts = true;
        //   if (!partNameAdded) {
        //     errmessage = errmessage + '<br />PN - ' + selectedPart.partNumber;
        //     partNameAdded = true;
        //   }
        //   errmessage = errmessage + '<br />' + "Please enter priority ID."
        // }

        // if (selectedPart.customerRequestDate && selectedPart.promisedDate && selectedPart.estimatedShipDate) {
        //   let crdate = new Date(Date.UTC(selectedPart.customerRequestDate.getUTCFullYear(), selectedPart.customerRequestDate.getUTCMonth(), selectedPart.customerRequestDate.getUTCDate()));
        //   let esdate = new Date(Date.UTC(selectedPart.estimatedShipDate.getUTCFullYear(), selectedPart.estimatedShipDate.getUTCMonth(), selectedPart.estimatedShipDate.getUTCDate()));
        //   let pdate = new Date(Date.UTC(selectedPart.promisedDate.getUTCFullYear(), selectedPart.promisedDate.getUTCMonth(), selectedPart.promisedDate.getUTCDate()));
        //   let opendate = new Date(Date.UTC(this.salesQuote.openDate.getUTCFullYear(), this.salesQuote.openDate.getUTCMonth(), this.salesQuote.openDate.getUTCDate()));

        //   if (crdate < opendate || esdate < opendate || pdate < opendate) {
        //     invalidDate = true;
        //     if (crdate < opendate) {
        //       this.isSpinnerVisible = false;
        //       invalidParts = true;
        //       if (!partNameAdded) {
        //         errmessage = errmessage + '<br />PN - ' + selectedPart.partNumber;
        //         partNameAdded = true;
        //       }
        //       errmessage = errmessage + '<br />' + "Request Date cannot be less than open date."
        //     }
        //     if (esdate < opendate) {
        //       this.isSpinnerVisible = false;
        //       invalidParts = true;
        //       if (!partNameAdded) {
        //         errmessage = errmessage + '<br />PN - ' + selectedPart.partNumber;
        //         partNameAdded = true;
        //       }
        //       errmessage = errmessage + '<br />' + "Est. Ship Date cannot be less than open date."
        //     }
        //     if (pdate < opendate) {
        //       this.isSpinnerVisible = false;
        //       invalidParts = true;
        //       if (!partNameAdded) {
        //         errmessage = errmessage + '<br />PN - ' + selectedPart.partNumber;
        //         partNameAdded = true;
        //       }
        //       errmessage = errmessage + '<br />' + "Cust Prmsd Date cannot be less than open date."
        //     }
        //   }
        //}
        let partNumberObj;
        if (this.isCopyMode) {
          partNumberObj = this.speedQuoteService.marshalSpeedQuotePartToSave(selectedPart, this.userName);
          partList.push(partNumberObj);
        }
        if (!invalidParts && !invalidDate) {
          partNumberObj = this.speedQuoteService.marshalSpeedQuotePartToSave(selectedPart, this.userName);
          partList.push(partNumberObj);
        }
      }
      this.speedQuoteView.parts = partList;

      if (this.id) {
        if (invalidParts) {
          this.isSpinnerVisible = false;
          this.alertService.resetStickyMessage();
          this.alertService.showStickyMessage('Speed Quote', errmessage, MessageSeverity.error);
        } else if (invalidDate) {
          this.isSpinnerVisible = false;
          this.alertService.resetStickyMessage();
          this.alertService.showStickyMessage('Speed Quote', "Please select valid Dates for Speed Quote PartsList!", MessageSeverity.error);
        } else {
          this.isSpinnerVisible = false;
          // this.marginSummary.speedQuoteId = this.id;
          // this.marginSummary.misc = this.totalCharges;
          // this.speedQuoteService.createSpeedQuoteMarginSummary(this.marginSummary).subscribe(result => {
          //   this.marginSummary.speedQuoteMarginSummaryId = result
          // }, error => {
          //   this.isSpinnerVisible = false;
          // });
          this.speedQuoteService.update(this.speedQuoteView).subscribe(data => {
            this.SpeedQuoteId = data[0].speedQuoteId;
            this.isCreateModeHeader = true;
            this.isSpinnerVisible = false;
            this.alertService.showMessage(
              "Success",
              `Quote updated successfully.`,
              MessageSeverity.success
            );
            this.getSalesQuoteInstance(this.id, true);
            if (createNewVersion) {
              this.router.navigateByUrl(`salesmodule/salespages/speed-quote-list`);
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
        if (this.isCopyMode == true) {
          this.speedQuoteView.originalSpeedQuoteId = parseInt(this.quoteCopyRefId);
          this.speedQuoteView.speedQuote.speedQuoteId = null;
          this.speedQuoteView.speedQuote.speedQuoteNumber = undefined;
          if (this.speedQuoteView.parts && this.speedQuoteView.parts.length > 0) {
            this.speedQuoteView.parts.filter(x => x.speedQuotePartId = null)
          }
        }
        this.speedQuoteService.create(this.speedQuoteView).subscribe(data => {
          this.SpeedQuoteId = data[0].speedQuoteId;
          this.speedQuoteView.speedQuote.speedQuoteId = this.SpeedQuoteId;
          this.isCreateModeHeader = true;
          this.isHeaderSubmit = true;
          this.isSpinnerVisible = false;
          this.alertService.showMessage(
            "Success",
            `Speed Quote created successfully.`,
            MessageSeverity.success
          );
          this.toggle_po_header = false;
          this.id = this.SpeedQuoteId;
          if (this.SpeedQuoteId) {
            this.router.navigateByUrl(
              `salesmodule/salespages/speed-quote-edit/${this.customerId}/${this.SpeedQuoteId}`
            );
          }
          if (!this.isCreateModeHeader) {
            this.router.navigateByUrl(`salesmodule/salespages/speed-quote-list`);
          }
        }
          , error => {
            this.isSpinnerVisible = false;
            this.toggle_po_header = true;
          })
      }
      this.toggle_po_header = false;
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
  }

  inititateEmailQuote() {
    this.selectedCommunicationTab = "Quotemail";
    this.isEmailTabEnabled = true;
  }

  sendQuoteToCustomer() {
    this.speedQuoteService.sendSpeedQuoteToCustomer(this.id).subscribe(
      results => {
        this.alertService.showMessage(
          "Success",
          `Speed Quote sent to customer successfully.`,
          MessageSeverity.success
        );

        this.closeModal()
      }, error => {
        this.isSpinnerVisible = false;
      }
    );
  }

  // convertSalesOrderQuote() {
  //   this.conversionStarted = true;
  //   this.isSpinnerVisible = true;
  //   this.salesOrderConversionCriteriaObj.salesOrderQuoteId = this.id;

  //   this.speedQuoteService.convertfromquote(this.salesOrderConversionCriteriaObj, this.employeeId).subscribe(
  //     results => {
  //       this.alertService.showMessage(
  //         "Success",
  //         `Speed Quote coverted to Order successfully.`,
  //         MessageSeverity.success
  //       );
  //       this.isSpinnerVisible = false;
  //       this.salesOrderView = results[0];

  //       this.closeModal();

  //       this.router.navigateByUrl(`salesmodule/salespages/sales-order-edit/${this.salesOrderView.salesOrder.customerId}/${this.salesOrderView.salesOrder.salesOrderId}`);
  //     }, error => {
  //       this.isSpinnerVisible = false;
  //     }
  //   );

  //   this.isSpinnerVisible = false;
  // }

  initiateQuoteCopying() {
    // let content = this.copyQuotePopup;
    // this.modal = this.modalService.open(content, { size: "sm", backdrop: 'static', keyboard: false });
    this.copySpeedQuote();
  }

  copySpeedQuote() {
    let considerParts = false;
    // if (this.copyConsiderations.isPartsAllowForCopy == true) {
    //   considerParts = true
    // } else {
    //   considerParts = false;
    // }
    let considerApprovers = false;
    this.speedQuoteService.initiateQuoteCopying(this.id).subscribe(
      results => {
        //this.closeModal();
        this.speedQuoteView.parts = results[0].parts;
        this.router.navigate(['/salesmodule/salespages/speed-quote-create/' + results[0].speedQuote.customerId], { queryParams: { copyRef: results[0].originalSpeedQuoteId, considerParts: considerParts, considerApprovers: considerApprovers } });
      }, error => {
        this.isSpinnerVisible = false;
      }
    );
  }

  verifySalesQuoteConversion(results) {
    const resultsTemp = results;
    this.verifySalesOrderQuoteObj = resultsTemp;
    this.salesOrderConversionCriteriaObj = this.verifySalesOrderQuoteObj.salesOrderConversionCritera;
    this.salesOrderConversionCriteriaObj.customerReference = "";
  }

  initiateClosingSalesOrderQuote() {
    let content = this.closeQuotePopup;
    this.modal = this.modalService.open(content, { size: "sm", backdrop: 'static', keyboard: false });
  }

  initiateCreatingNewQuote() {
    let content = this.newQuoteCreatePopup;
    this.modal = this.modalService.open(content, { size: "sm", backdrop: 'static', keyboard: false });
  }

  initiatePrintProcess() {
    let content = this.salesQuotePrintPopup;
    this.modal = this.modalService.open(content, { size: "lg", backdrop: 'static', keyboard: false });
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
          @page { size: auto;  margin: 0mm; }
          
                        @media print
            {
              @page {
              margin-top: 0;
              margin-bottom: 0;
              }
            
              @page {size: landscape}
            } 
            span {
              /* font-weight: normal; */
              font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
              font-size: 10.5px !important;
              font-weight: 700;
            }
             

              table {
                width: 100.3%;
               overflow: auto !important;
              }
              
              table thead {
               background: #808080;
              }
              
              table thead tr {
               /* background: #0d57b0 !important; */
              
              }
              
              table,
              thead,
              td {
               border: 1px solid black;
               border-collapse: collapse;
              }
              
              table,
              thead,
              th {
               border: 1px solid black;
               border-collapse: collapse;
              }
              
              table thead tr th {
               /*  background: #c7c6c6 !important; */
               padding: 5px !important;
               color: #000;
               letter-spacing: 0.3px;
               font-size: 10.5px;
               text-transform: capitalize;
               z-index: 1;
              }
              
              table tbody {
               overflow-y: auto;
               max-height: 500px;
              }
              
              table tbody tr td {
               background: #fff;
               padding: 2px;
               line-height: 22px;
               height: 22px;
               color: #333;
              border:1px solid black !important;
                border-right: 1px solid black !important;
               font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
                 font-size: 10.5px !important;
                 font-weight: 700;
               max-width: 100px;
               letter-spacing: 0.1px;
               border: 0
              }
             
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
            
            .parttable th {
              // background: #fff !important;
              background: #c7c6c6 !important;
              color: #000 !important;
              -webkit-print-color-adjust: exact;
            }
            .border-bottom{
              border-bottom:1px solid black !important;
            }
            .table-margins{
                  margin-top:-1px;margin-left:0px
                }
                .packing-slip-table{
                  width:100%;
                }
            .invoice-border{
              border-bottom: 1px solid;
                  position:relative;
                    // min-height: 119px;
                    min-height:1px;
                    height: auto;
                    width:100%;
                  float:left;}
                  .exclusdeditem{
                    text-align: center;
                    font-size: 12px;
                  }
                  .aligntop{
                    margin-top:300px;
                  }
            
                        </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }

  closeSalesOrderQuote() {
    this.speedQuoteService.closeSpeedQuote(this.id, this.userName).subscribe(
      results => {
        this.isSpinnerVisible = false;
        this.alertService.showMessage(
          "Success",
          `Speed Quote closed successfully.`,
          MessageSeverity.success
        );
        this.closeModal();
        this.router.navigateByUrl(`salesmodule/salespages/speed -quote-list`);
      }, error => {
        this.isSpinnerVisible = false;
      }
    );
  }

  newQuoteEvent() {
    this.closeModal();
    this.router.navigateByUrl('/salesmodule/salespages/speed-quote-create/' + this.customerId);
  }

  closeModal() {
    this.modal.close();
  }
  closePrintModal() {
    this.printmodal.close()
  }

  openConfirmationModal(submitType: boolean) {
    this.submitType = submitType;
    this.modal = this.modalService.open(this.updateConfirmationModal, { size: "sm" });
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
      this.getSalesQuoteInstance(this.id, true);
    }
  }

  onPartsSaveEvent(savedParts) {
    if (savedParts) {
      //this.marginSummary = this.speedQuoteService.getSpeedQuoteHeaderMarginDetails(savedParts, this.marginSummary);
      //this.updateMarginSummary();
      this.getSalesQuoteInstance(this.id, true);
    }
  }

  updateMarginSummary() {
    this.isSpinnerVisible = true;
    this.marginSummary.speedQuoteId = this.id;
    // this.speedQuoteService.createSpeedQuoteMarginSummary(this.marginSummary).subscribe(result => {
    //   this.marginSummary.speedQuoteMarginSummaryId = result;
    //   this.isSpinnerVisible = false;
    // }, error => {
    //   this.isSpinnerVisible = false;
    // })
  }

  onTabChange(event) {
    if (event.index == 0) {
      this.selectedIndex = 0;
      this.speedQuotePartNumberComponent.refresh();
    }
    if (event.index == 1) {
      this.selectedIndex = 1;
      this.speedQuoteExclusionsComponent.refresh(true);
    }
    // if (event.index == 1) {
    //   this.salesApproveComponent.refresh(this.marginSummary);
    // }
    // if (event.index == 2) {
    //   this.salesCustomerApprovalsComponent.refresh(this.marginSummary, this.salesQuote.speedQuoteId);
    // }
    // if (event.index == 4) {
    //   if (this.salesQuote.statusName == "Open" || this.salesQuote.statusName == "Partially Approved") {
    //     this.salesOrderQuoteFreightComponent.refresh(false);
    //   } else {
    //     this.salesOrderQuoteFreightComponent.refresh(true);
    //   }
    // }
    // if (event.index == 5) {
    //   if (this.salesQuote.statusName == "Open" || this.salesQuote.statusName == "Partially Approved") {
    //     this.salesOrderQuoteChargesComponent.refresh(false);
    //   } else {
    //     this.salesOrderQuoteChargesComponent.refresh(true);
    //   }
    // }
    // if (event.index == 6) {
    //   this.salesQuoteDocumentsComponent.refresh();
    // }
    // if (event.index == 7) {
    //   this.salesQuoteAnalysisComponent.refresh(this.id);
    // }
  }

  setFreightsOrCharges() {
    if (this.speedQuoteService.selectedParts && this.speedQuoteService.selectedParts.length > 0) {
      this.speedQuoteService.selectedParts.forEach((part, i) => {
        this.speedQuoteService.selectedParts[i].freight = this.totalFreights;
        this.speedQuoteService.selectedParts[i].misc = this.totalCharges;
      });
    }
    this.marginSummary = this.speedQuoteService.getSpeedQuoteHeaderMarginDetails(this.speedQuoteService.selectedParts, this.marginSummary);
  }

  saveSalesOrderFreightsList(e) {
    this.totalFreights = e;
    this.marginSummary.freightAmount = this.totalFreights;
    this.speedQuoteService.setTotalFreights(e);
    this.setFreightsOrCharges();
    this.updateMarginSummary();
  }

  updateSalesOrderFreightsList(e) {
    this.totalFreights = e;
    this.marginSummary.freightAmount = this.totalFreights;
    this.speedQuoteService.setTotalFreights(e);
    this.setFreightsOrCharges();
    this.updateMarginSummary();
  }

  getFreightList() {
  }

  saveSalesOrderChargesList(e) {
    this.totalCharges = e;
    this.marginSummary.misc = this.totalCharges;
    this.speedQuoteService.setTotalCharges(e);
    this.setFreightsOrCharges();
    this.updateMarginSummary();
  }

  updateSalesOrderChargesList(e) {
    this.totalCharges = e;
    this.speedQuoteService.setTotalCharges(e);
    this.marginSummary.misc = this.totalCharges;
    this.setFreightsOrCharges();
    this.updateMarginSummary();
  }

  getChargesList() {
  }

  changeToExclusionTab(event) {
    console.log("rowdata",event);
    this.selectedIndex = 1;
    this.speedQuoteExclusionsComponent.addPartNumber(event);
  }

  initiateExclusionPrintProcess() {
    let content = this.speedQuoteExclusionePrintPopup;
    this.modal = this.modalService.open(content, { size: "lg", backdrop: 'static', keyboard: false });
  }

  initiateSpeedQuotePrint() {
    this.speedQuotePrintCriteraObj.speedQuoteId = this.id;
    this.speedQuotePrintCriteraObj.printQuote = true;
    if(this.exclusionCount > 0){
      this.speedQuotePrintCriteraObj.printExclusion = true;
    }else{
      this.speedQuotePrintCriteraObj.printExclusion = false;
      this.exclusionSelectDisable = true;
    }
    //let content = this.salesQuoteConvertPopup;
    let content = this.speedQuotePrintCritariaPopup;
    this.printmodal = this.modalService.open(content, { size: "sm", backdrop: 'static', keyboard: false });
  }
  printQuoteAndExclusion(){
      let content = this.salesQuotePrintPopup;
      this.modal = this.modalService.open(content, { size: "lg", backdrop: 'static', keyboard: false });
  }

  onExlusionLoad(count){
    this.exclusionCount = count;
  }
  sendSpeedQuoteEMail() {
    this.conversionStarted = true;
    this.isSpinnerVisible = true;
    this.speedQuotePrintCriteraObj.speedQuoteId = this.id;

    this.speedQuoteService.sendSppedQuoteEmail(this.speedQuotePrintCriteraObj).subscribe(
      results => {
        this.alertService.showMessage(
          "Success",
          `Email Send successfully.`,
          MessageSeverity.success
        );
        this.isSpinnerVisible = false;
        //this.salesOrderView = results[0];

        this.closeModal();

        //this.router.navigateByUrl(`salesmodule/salespages/sales-order-edit/${this.salesOrderView.salesOrder.customerId}/${this.salesOrderView.salesOrder.salesOrderId}`);
      }, error => {
        this.isSpinnerVisible = false;
      }
    );

    this.isSpinnerVisible = false;
  }

  arraySOStatuslist: any[] = [];
  soStatusList: any = [];
  loadSOStatus() {
    if (this.arraySOStatuslist.length == 0) {
      this.arraySOStatuslist.push(0);
    }
    this.isSpinnerVisible = true;
    this.commonservice.autoSuggestionSmartDropDownList('MasterSpeedQuoteStatus', 'Id', 'Name', '', true, 20, this.arraySOStatuslist.join(), this.masterCompanyId).subscribe(res => {
      this.soStatusList = res;
      this.soStatusList = this.soStatusList.sort((a, b) => (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0));
      this.isSpinnerVisible = false;
    }, error => {
      this.isSpinnerVisible = false;
    });
  }

  emailTypes: any[];
  formData = new FormData();
  ContactList: any = [];
  customerContact: any;
  cusContactList: any;
  customerDetailsList: any = {};
  toEmail: any;
  cc: any;
  bcc: any;
  subject: any;
  emailBody: any;
  file: any;
  contactBy: any;
  createdBy: any;
  emailType: number;
  employeeList: any = [];
  employeesOriginalData: any = [];
  @ViewChild('fileUploadInput',{static:false}) fileUploadInput: any;
  addList: any = [];
  pdfPath: any;
  addMemo() {
    this.closeModal();
    this.closePrintModal();
    //this.isEditMode = false;
    this.formData = new FormData();
    if (this.ContactList.length > 0) {
        this.ContactList.forEach(
            (cc) => {
                this.customerContact = cc;
                this.contactSelected(cc)
                return;
            }
        )
    }
    this.bcc = "";
    this.cc = '';
    this.emailBody = '';
    this.contactBy = this.authService.currentEmployee;
    
        this.speedQuoteService.getSpeedQuote(this.id).subscribe(data => {
            if (data) {
                let quote = data && data.length ? data[0] : null;
                this.subject = quote.speedQuote.customerName + ', Speed Quote Number: ' + quote.speedQuote.speedQuoteNumber;
            }
        });
    
    
    this.emailTypes.forEach(
        (x) => {
            if (x.label == 'Manual') {
                this.emailType = x.value;
            }
        }
    );
    this.fileUploadInput.clear();
    this.addList.push({ memoId: '', memo: '' })
  }

  contactSelected(event) {
    this.toEmail = event.email ? event.email : '';
  }

  // ngOnChanges(): void {
  //   //if (this.isView == false) {
  //       this.getAllEmployees('');
  //       this.getAllEmailType('');
  //       this.customerContacts('');
  //   //}
  //   // this.getAllEmail();
  //   // this.moduleId = this.moduleId;
  //   // this.referenceId = this.referenceId;
  // }
  getAllEmailType(value) {
    this.setEditArray = [];
    this.setEditArray.push(0);
    const strText = value ? value : '';
    this.commonService.autoSuggestionSmartDropDownList('EmailType', 'EmailTypeId', 'Name', strText, true, 20, this.setEditArray.join()).subscribe(res => {
        this.emailTypes = res;
    }, err => {
    });
  }
  arrayContactlist: any = []
    getAllEmployees(strText = '') {
        this.arrayContactlist.push(0);
        //this.commonService.autoCompleteSmartDropDownEmployeeList('firstName', strText, true, this.arrayContactlist.join()).subscribe(res => {
            this.commonService.autoSuggestionSmartDropDownList('Employee', 'EmployeeId', 'FirstName', strText,
			true, 0, this.arrayContactlist.join(),this.authService.currentUser.masterCompanyId).subscribe(res => {

            this.employeeList = res.map(x => {
                return {
                    ...x,
                    employeeId: x.value,
                    name: x.label
                }
            });
        }, err => {
        })
    }
    filterEmployee(event): void {
        if (event.query !== undefined && event.query !== null) {
            this.getAllEmployees(event.query);
        } else {
            this.getAllEmployees('');
        }
    }
    
    customerContacts(value) {
        this.setEditArray = [];
        this.setEditArray.push(0);
        const strText = value ? value : '';
        this.commonService.autoDropListCustomerContacts(this.customerId, strText, 20, this.setEditArray.join(),this.authService.currentUser.masterCompanyId).subscribe(res => {
            this.ContactList = res.map(x => {
                return {
                    ...x,
                    contactId: x.contactId,
                    firstName: x.customerContactName
                }
            });
            this.cusContactList = this.ContactList;
        }, err => {
        });
    }
    filterCustomerContact(event): void {
          if (event.query !== undefined && event.query !== null) {
              this.customerContacts(event.query);
          } else {
              this.customerContacts('');
          }
  }
  send(isFormValid) {
    if (isFormValid) {
            let content = this.emailSendQuotePopup;
            this.getQuotePDF();
            this.modal = this.modalService.open(content, { size: "sm" });
    }
  }
  getQuotePDF() {
    this.isSpinnerVisible = true;
    this.speedQuoteService.getSQsendmailpdfpreview(this.id)
        .subscribe(
            (res: any) => {
                this.isSpinnerVisible = false;
                this.pdfPath = res;
            }, err => {
            }
        )
  }
  downloadFileUpload(link) {
    const url = `${this.configurations.baseUrl}/api/FileUpload/downloadattachedfile?filePath=${link}`;
    window.location.assign(url);
  }
}