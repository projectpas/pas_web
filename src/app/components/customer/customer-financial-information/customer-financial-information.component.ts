import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  SimpleChanges,
} from '@angular/core';
import { fadeInOut } from '../../../services/animations';
import { CustomerService } from '../../../services/customer.service';
import { CurrencyService } from '../../../services/currency.service';
import { CreditTermsService } from '../../../services/Credit Terms.service';
import { TaxRateService } from '../../../services/taxrate.service';
import { ItemMasterService } from '../../../services/itemMaster.service';
import { IntegrationService } from '../../../services/integration-service';
import { CustomerClassificationService } from '../../../services/CustomerClassification.service';
import { TaxTypeService } from '../../../services/taxtype.service';
import { AuthService } from '../../../services/auth.service';
import { AlertService, MessageSeverity } from '../../../services/alert.service';
import {
  validateRecordExistsOrNot,
  editValueAssignByCondition,
  getValueFromArrayOfObjectById,
} from '../../../generic/autocomplete';
import { CommonService } from '../../../services/common.service';
import { PercentService } from '../../../services/percent.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import {
  NgbModal,
  NgbActiveModal,
  ModalDismissReasons,
} from '@ng-bootstrap/ng-bootstrap';
import { ConfigurationService } from '../../../services/configuration.service';
import {
  getValueFromObjectByKey,
  getObjectByValue,
  getObjectById,
  selectedValueValidate,
} from '../../../generic/autocomplete';
import { Pipe, PipeTransform } from '@angular/core';
import { DBkeys } from '../../../services/db-Keys';
import { LocalStoreManager } from '../../../services/local-store-manager.service';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { Params, ActivatedRoute } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-customer-financial-information',
  templateUrl: './customer-financial-information.component.html',
  styleUrls: ['./customers-financial-information.component.scss'],
  animations: [fadeInOut],
})
/** anys component*/
export class CustomerFinancialInformationComponent implements OnInit {
  @Input() savedGeneralInformationData: any;
  @Input() editGeneralInformationData;
  @Input() editMode;
  @Output() tab = new EventEmitter();
  @Input() selectedCustomerTab: string = '';
  @ViewChild('taxExemptFileUploadInput', { static: false }) taxExemptFileUploadInput: any;
  @ViewChild('tabRedirectConfirmationModal', { static: false }) public tabRedirectConfirmationModal: ElementRef;
  @ViewChild("financialInfoForm", { static: false }) fininfoformdata;
  stopmulticlicks: boolean;
  taxRatesList: any = [];
  pageSize: number = 10;
  pageSizeDoc: number = 5;
  pageSizeTax: number = 5;
  discountList: any;
  discountList1: any;
  totalRecords: number = 0;
  pageIndex: number = 0;
  totalPages: number = 0;
  markUpList: any;
  taxrateList: any;
  state_taxRateList: any;
  id: number;
  legalEntityId: number;
  selectedRowForDelete: any;
  intergationNew = {
    allowPartialBilling: true,
    allowProformaBilling: true,
    markUpValue: '',
  };
  addNewIntergration = { ...this.intergationNew };
  creditTermsNew = {
    name: '',
    percentage: '',
    days: '',
    netDays: '',
    isActive: true,
    isDeleted: false,
    memo: '',
  };

  taxTyeNew = {
    description: '',

    isActive: true,
    isDeleted: false,
    memo: '',
  };

  taxRateNew = {
    taxRate: 0,
    isActive: true,
    isDeleted: false,
    memo: '',
  };
  totalRecordNew: number = 0;
  pageSizeNew: number = 3;
  memoPopupContent: any;
  memoPopupValue: any;
  totalPagesNew: number = 0;
  sourceViewforDocumentListColumns = [
    { field: 'fileName', header: 'File Name' },
  ];
  taxExemptTableColumns = [
    { field: 'docName', header: 'Name' },
    { field: 'docDescription', header: 'Description' },
    { field: 'docMemo', header: 'Memo' },
    { field: 'fileName', header: 'File Name' },
    { field: 'fileSize', header: 'File Size' },

    { field: 'createdBy', header: 'Created By' },
    { field: 'updatedBy', header: 'Updated By' },
    { field: 'createdDate', header: 'Created Date' },
    { field: 'updatedDate', header: 'Updated Date' },
  ];
  index: number;
  disableFileAttachmentSubmit: boolean = true;
  sourceViewforDocument: any = [];
  sourceViewforDocumentAudit: any = [];
  isEditButton: boolean = false;
  documentInformation = {
    docName: '',
    docMemo: '',
    docDescription: '',
    attachmentDetailId: 0,
  };
  selectedFileAttachment: any = [];
  selectedFile: File = null;
  allDocumentListOriginal: any = [];
  selectedRowForDeleteDoc: any;
  rowIndex: number;
  addNewCreditTerms = { ...this.creditTermsNew };
  addNewTaxType = { ...this.taxTyeNew };
  addNewTaxRate = { ...this.taxRateNew };
  isCreditTermsExists: boolean = false;
  isPercentageExists: boolean = false;
  isTaxTypeExists: boolean = false;
  isTaxRateExists: boolean = false;
  customerTaxRateMappingId: number;
  isDeleteMode: boolean = false;
  _creditTermList: any[];
  _creditTermsList: any[];
  _creditTermPercentageList: any;
  _TaxTypeList: any;
  _TaxRateList: any;
  percentValue = null;
  percentageList: any;
  taxTypeList: any;
  discontValue = null;
  _discountList: any;
  isDiscountExists: boolean = false;
  allCurrencyInfo: any;
  customerCode: any;
  customerName: any;
  selectedTaxRates: any = 0;
  selectedTaxType: any = 0;
  taxTypeRateMapping: any = [];
  selectedConsume: any;
  disableSaveConsume: boolean;
  discountcollection: any[] = [];
  namecolle: any[] = [];
  modal: NgbModalRef;
  localcollection: any;
  isSpinnerVisible: boolean = false;
  formData = new FormData();
  allCustomerFinanceDocumentsList: any = [];
  taxInfoTableColumns: any[] = [
    { field: 'taxType', header: 'Tax Type' },
    { field: 'taxRate', header: 'Tax Rate' },
  ];
  globalSettings: any = {};
  _discountListForDropdown: any = [];
  selectedRowFileForDelete: any;
  taxRateEditData: any;
  indexForTaxRate: any = 1;
  auditDataForTaxData: any = [];
  global_lang: string;
  showAllowNettingOfAPAR: boolean = false;
  customerGeneralInformation: any = {};
  allCustomerFinanceDocumentsListOriginal: any;
  nextOrPreviousTab: string;
  taxRateIndex: any;
  taxAndRateUpdateFlag: boolean = true;
  attachCertificateUpdateFlag: boolean = true;
  disableCreditTerms: boolean = true;
  creditTermsListOriginal: any[];
  CREDITTERMDATA: any = [];
  currentDeletedstatus: boolean = false;
  disableSave: boolean = true;
  editModeFinance: boolean = false;
  isCountdisable: boolean = false;
  disableTaxSave: boolean = true;
  moduleName: any = "CustomerFinance";
  referenceId: any;
  constructor(
    public taxtypeser: TaxTypeService,
    public creditTermsService: CreditTermsService,
    public currencyService: CurrencyService,
    public customerClassificationService: CustomerClassificationService,
    public inteservice: IntegrationService,
    public taxRateService: TaxRateService,
    public itemser: ItemMasterService,
    public customerService: CustomerService,
    private authService: AuthService,
    private alertService: AlertService,
    private commonservice: CommonService,
    public percentService: PercentService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private configurations: ConfigurationService,
    public creditTermService: CreditTermsService,
    private localStorage: LocalStoreManager,
    private router: ActivatedRoute
  ) {
    this.id = this.router.snapshot.params['id'];
  }
  taxtypesList = [];

  ngOnInit(): void {
    this.savedGeneralInformationData = this.savedGeneralInformationData || {};
    this.savedGeneralInformationData.discountId = 0;
    this.savedGeneralInformationData.markUpPercentageId = 0;

    if (this.editMode) {     
      //this.id = this.editGeneralInformationData.customerId;
      this.customerGeneralInformation = this.editGeneralInformationData;
      this.savedGeneralInformationData = this.editGeneralInformationData;
      this.customerCode = this.editGeneralInformationData.customerCode;
      this.customerName = this.editGeneralInformationData.name;
      //if (this.customerGeneralInformation.isCustomerAlsoVendor == true && this.customerGeneralInformation.type == 'Customer') {      
      if (this.customerGeneralInformation.isCustomerAlsoVendor == true) {
         this.showAllowNettingOfAPAR = true;
         this.savedGeneralInformationData.allowNettingOfAPAR = true;
       } else {
         this.showAllowNettingOfAPAR = false;
         this.savedGeneralInformationData.allowNettingOfAPAR = false;
      }
    } else {     
      this.savedGeneralInformationData.allowPartialBilling = true;
      this.savedGeneralInformationData.allowProformaBilling = true;
      this.customerGeneralInformation = this.savedGeneralInformationData;
      //this.id = this.savedGeneralInformationData.customerId;
      this.customerCode = this.savedGeneralInformationData.customerCode;
      this.customerName = this.savedGeneralInformationData.name;
      this.getDefaultCurrency();
      //if (this.customerGeneralInformation.isCustomerAlsoVendor == true && this.customerGeneralInformation.type == 'Customer') {
      if (this.customerGeneralInformation.isCustomerAlsoVendor == true) {
        this.showAllowNettingOfAPAR = true;
        this.savedGeneralInformationData.allowNettingOfAPAR = true;
      } else {
        this.showAllowNettingOfAPAR = false;
        this.savedGeneralInformationData.allowNettingOfAPAR = false;
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let property in changes) {
      if (property == 'selectedCustomerTab') {
        if (changes[property].currentValue != {} && changes.selectedCustomerTab.currentValue == "Financial") {

          this.getGlobalSettings();
          this.getAllCreditTerms();
          this.getAllPercentage();
          this.getAllDiscountList1();
          this.getAllCurrency();
          this.getAllTaxTypes();
          this.getAllTaxRates();

          if (this.editMode) {
            this.disableSave = true;
            if (this.editGeneralInformationData.currency == null || this.editGeneralInformationData.currency == 0) {
              this.getDefaultCurrency();
            }
            this.getMappedTaxTypeRateDetails();

            if (this.id) {
              this.toGetDocumentsListNew(this.id);
              this.getFinanceInfoByCustomerId();
            }            

            this.savedGeneralInformationData = {
              ...this.editGeneralInformationData,
              creditTermsId: getObjectById('value', this.editGeneralInformationData.creditTermsId, this.creditTermsListOriginal),
            };
          }
        }
      }
    }
  }

  getFinanceInfoByCustomerId() {
    if (this.id) {
      this.isSpinnerVisible = true;
      this.customerService.getFinanceInfoByCustomerId(this.id).subscribe(res => {
        if (res) {
          this.editModeFinance = true;
          this.savedGeneralInformationData = res;
          this.savedGeneralInformationData = {
            ...this.savedGeneralInformationData,
            creditTermsId: getObjectById(
              'value',
              this.savedGeneralInformationData.creditTermsId,
              this.creditTermsListOriginal
            ),
          };
        }
        else {
          this.savedGeneralInformationData.allowPartialBilling = true;
          this.savedGeneralInformationData.allowProformaBilling = true;
        }
        this.isSpinnerVisible = false;
      }, error => { this.isSpinnerVisible = false });
    }
  }

  getAllCreditTerms() {
    this.commonservice.autoSuggestionSmartDropDownList('CreditTerms', 'CreditTermsId', 'Name', '', '', 20, '', this.currentUserMasterCompanyId).subscribe(res => {
      this.creditTermsListOriginal = res;
    }, error => { this.isSpinnerVisible = false });
  }

  get currentUserMasterCompanyId(): number {
    return this.authService.currentUser
      ? this.authService.currentUser.masterCompanyId
      : null;
  }

  get userName(): string {
    return this.authService.currentUser
      ? this.authService.currentUser.userName
      : '';
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

  getGlobalSettings() {
    this.globalSettings =
      this.localStorage.getDataObject<any>(DBkeys.GLOBAL_SETTINGS) || {};
    this.global_lang = this.globalSettings.cultureName;
  }

  getAllcreditTermList() {
    //this.commonservice.smartDropDownList('CreditTerms', 'CreditTermsId', 'Name').subscribe((res) => {
    this.commonservice.autoSuggestionSmartDropDownList('CreditTerms', 'CreditTermsId', 'Name', '', '', 20, '', this.currentUserMasterCompanyId).subscribe(res => {
      this.creditTermsListOriginal = res;
    }, error => { this.isSpinnerVisible = false });
  }

  getAllCurrency() {
    this.currencyService.getCurrencyList(this.currentUserMasterCompanyId).subscribe((res) => {
      this.allCurrencyInfo = res[0];
    }, error => { this.isSpinnerVisible = false });
  }

  formatCreditLimit(val) {
    if (val) {
      if (isNaN(val) == true) {
        val = Number(val.replace(/[^0-9.-]+/g, ''));
      }
      this.savedGeneralInformationData.creditLimit = new Intl.NumberFormat(
        this.global_lang,
        { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }
      ).format(val);
      return this.savedGeneralInformationData.creditLimit;
    }
  }

  getDefaultCurrency() {
    this.legalEntityId = 19;
    this.commonservice.getDefaultCurrency(this.legalEntityId).subscribe((res) => {
      this.savedGeneralInformationData.generalCurrencyId = res.currencyId;
    }, error => { this.isSpinnerVisible = false });
  }

  getAllPercentage() {
    //this.commonservice.smartDropDownList('[Percent]', 'PercentId', 'PercentValue').subscribe((res) => {
    this.commonservice.autoSuggestionSmartDropDownList('[Percent]', 'PercentId', 'PercentValue', '', '', 0, '', this.currentUserMasterCompanyId).subscribe(res => {
      this.percentageList = res;
      this.percentageList.sort(function(a, b) {
        return parseFloat(a.label) - parseFloat(b.label);
      });
    }, error => { this.isSpinnerVisible = false });
  }

  getAllTaxRates() {
    //this.commonservice.smartDropDownList('[TaxRate]', 'TaxRateId', 'TaxRate').subscribe((res) => {
    this.commonservice.autoSuggestionSmartDropDownList('[TaxRate]', 'TaxRateId', 'TaxRate', '', '', 0, '', this.currentUserMasterCompanyId).subscribe(res => {
      this.taxRatesList = res;
      this.taxRatesList.sort(function(a, b) {
        return parseFloat(a.label) - parseFloat(b.label);
      });
    }, error => { this.isSpinnerVisible = false });
  }

  getAllTaxTypes() {
    //this.commonservice.smartDropDownList('TaxType', 'TaxTypeId', 'Description').subscribe((res) => {
    this.commonservice.autoSuggestionSmartDropDownList('TaxType', 'TaxTypeId', 'Description', '', '', 0, '', this.currentUserMasterCompanyId).subscribe(res => {
      this.taxTypeList = res;
    }, error => { this.isSpinnerVisible = false });
  }

  filterCreditTerms(event) {
    this._creditTermList = this.creditTermsListOriginal;

    this._creditTermList = [
      ...this.creditTermsListOriginal.filter((x) => {
        return x.label.toLowerCase().includes(event.query.toLowerCase());
      }),
    ];
  }

  filterCreditTerm(event) {
    this._creditTermsList = this.creditTermsListOriginal;

    const CREDITTERMDATA = [
      ...this.creditTermsListOriginal.filter((x) => {
        return x.label.toLowerCase().includes(event.query.toLowerCase());
      }),
    ];
    this._creditTermsList = CREDITTERMDATA;
  }

  validateCreditTerms(value) {
    if (value != 0) {
      this.disableCreditTerms = false;
    } else {
      this.disableCreditTerms = true;
    }
  }

  checkCreditTermsExists(field, value) {
    const exists = validateRecordExistsOrNot(
      field,
      value,
      this.creditTermsListOriginal
    );

    if (exists.length > 0) {
      this.isCreditTermsExists = true;
    } else {
      this.isCreditTermsExists = false;
    }
  }

  selectedCreditTerm() {
    this.isCreditTermsExists = true;
  }

  filterPercentage(event) {
    this._creditTermPercentageList = this.percentageList;

    this._creditTermPercentageList = [
      ...this.percentageList.filter((x) => {
        return x.percentValue.includes(parseInt(event.query));
      }),
    ];
  }

  checkPercentageExists(field, value) {
    const exists = validateRecordExistsOrNot(field, value, this.percentageList);

    if (exists.length > 0) {
      this.isPercentageExists = true;
    } else {
      this.isPercentageExists = false;
    }
  }

  selectedPercentage() {
    this.isPercentageExists = true;
  }

  filterTaxType(event) {
    this._TaxTypeList = this.taxTypeList;

    this._TaxTypeList = [
      ...this.taxTypeList.filter((x) => {
        return x.label.toLowerCase().includes(event.query.toLowerCase());
      }),
    ];
  }

  filterTaxRate(event) {
    this._TaxRateList = this.percentageList;

    this._TaxRateList = [
      ...this.percentageList.filter((x) => {
        return x.label.includes(event.query.toLowerCase());
      }),
    ];
  }

  checkTaxTypeExists(field, value) {
    this.isTaxTypeExists = false;
    const exists = validateRecordExistsOrNot(field, value, this.taxTypeList);

    if (exists.length > 0) {
      this.isTaxTypeExists = true;
    } else {
      this.isTaxTypeExists = false;
    }
  }

  selectedTaxTypes(object) {
    this.isTaxTypeExists = true;
  }

  selectedTaxRate() {
    this.isTaxRateExists = true;
  }

  // not in use
  getAllDiscountList() {
    this.customerService.getDiscountList().subscribe((res) => {
      if (res) {
        this.discountList = res[0];

        for (let i = 0; i < this.discountList.length; i++) {
          if (
            this.discountList[i].discontValue >= 0 &&
            this.discountList[i].discontValue <= 100
          ) {
            this._discountListForDropdown.push({
              label: this.discountList[i].discontValue.toString(),
              value: this.discountList[i].discontValue,
            });
          }
        }
      }
    }, error => { this.isSpinnerVisible = false });
  }

  getAllDiscountList1() {
    //this.commonservice.smartDropDownList('[Discount]', 'DiscountId', 'DiscontValue').subscribe((res) => {
    this.commonservice.autoSuggestionSmartDropDownList('[Discount]', 'DiscountId', 'DiscontValue', '', '', 20, '', this.currentUserMasterCompanyId).subscribe(res => {
      this.discountList1 = res;
      this.discountList1.sort(function(a, b) {
        return parseFloat(a.label) - parseFloat(b.label);
      });
    }, error => { this.isSpinnerVisible = false });
  }

  filterDiscount(event) {
    this._discountListForDropdown = [
      ...this._discountListForDropdown.filter((x) => {
        return x.label.includes(event.query.toLowerCase());
      }),
    ];

    setTimeout(() => {
      this._discountListForDropdown = this._discountListForDropdown;
    }, 1000);
  }

  checkDiscountExists(value) {
    this.getAllDiscountList();

    this.isCountdisable = false;
    this._discountListForDropdown = this._discountListForDropdown;
    const exists = validateRecordExistsOrNot(
      'field',
      value,
      this._discountListForDropdown
    );

    if (
      this.discontValue == undefined &&
      this.discontValue == undefined &&
      this.discontValue == null &&
      this.discontValue == ''
    ) {
      this.isCountdisable = false;
      this.discontValue == null;
    } else if (this.discontValue < 0 || this.discontValue > 100) {
      this.isCountdisable = true;
      this.discontValue == null;
    }
    if (exists && exists.length > 0) {
      this.isDiscountExists = true;
    } else if (this.discontValue < 0 || this.discontValue > 100) {
      return (this.isDiscountExists = false);
    } else {
      this.isDiscountExists = false;
    }
  }

  checkDiscountExistss(value) {
    this.isDiscountExists = false;
    if (
      this.discontValue == undefined &&
      this.discontValue == undefined &&
      this.discontValue == null &&
      this.discontValue == ''
    ) {
      this.isCountdisable = false;
    } else if (this.discontValue < 0 || this.discontValue > 100) {
      this.isCountdisable = true;
    } else {
      this._discountListForDropdown = this._discountListForDropdown;
      for (let i = 0; i < this._discountListForDropdown.length; i++) {
        if (
          this.discontValue == this._discountListForDropdown[i].label ||
          value == this._discountListForDropdown[i].label
        ) {
          this.isDiscountExists = true;

          return;
        } else {
          this.isDiscountExists = false;
        }
      }
    }
  }

  selectedDiscount() {
    this.isDiscountExists = true;
  }

  checkPercentExists(value) {
    this.isTaxRateExists = false;

    for (let i = 0; i < this.percentageList.length; i++) {
      if (
        this.discontValue == this.percentageList[i].label ||
        value == this.percentageList[i].label
      ) {
        this.isTaxRateExists = true;

        return;
      }
    }
  }

  // not in use
  getAllTaxList() {
    this.taxRateService.getTaxRateList().subscribe((res) => {
      if (res) {
        const responseData = res[0];
        this.taxtypesList = responseData.map((x) => {
          return {
            label: x.taxTypeId,
            value: x.taxTypeId,
          };
        });
      }
    }, error => { this.isSpinnerVisible = false });
  }

  getPageCount(totalNoofRecords, pageSize) {
    return Math.ceil(totalNoofRecords / pageSize);
  }
  getTaxPageCount(totalNoofRecordsT, pageSizeT) {

    return Math.ceil(totalNoofRecordsT / pageSizeT);
  }
  getPageCount2(totalNoofRecords, pageSize) {
    return Math.ceil(totalNoofRecords / pageSize);
  }
  pageIndexChangeForDoc(event) {
    this.pageSizeDoc = event.rows;
  }
  pageIndexChangeForTax(event) {
    this.pageSizeTax = event.rows;
  }

  validateSaveButton() {
    if (this.selectedTaxRates > 0 && this.selectedTaxType > 0) {
      this.disableTaxSave = false;
    }
    else {
      this.disableTaxSave = true;
    }
  }

  getMappedTaxTypeRateDetails() {
    this.isSpinnerVisible = true;
    this.customerService.getMappedTaxTypeRateDetails(this.id, this.currentDeletedstatus).subscribe((res) => {
        res.map((element, index) => {
          element.id = index + 1;
        });
        this.taxTypeRateMapping = res;
        this.totalRecords = this.taxTypeRateMapping.length;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        this.isSpinnerVisible = false;
      }, error => { this.isSpinnerVisible = false });
  }

  mapTaxTypeandRate() {
    if (this.selectedTaxRates && this.selectedTaxType) {
      const index = this.taxTypeRateMapping.findIndex(
        (item) =>
          item.taxType ===
          getValueFromArrayOfObjectById(
            'label',
            'value',
            this.selectedTaxType,
            this.taxTypeList
          )
      );
      if (index > -1) {
        this.alertService.showMessage(
          'Duplicate',
          `Record Already Exists `,
          MessageSeverity.warn
        );
        this.selectedTaxRates = null;
        this.selectedTaxType = null;
        this.disableTaxSave = true;
      } else {
        this.taxTypeRateMapping.push({
          isDisable: true,
          customerId: this.id,
          id: this.taxTypeRateMapping.length + 1,
          taxTypeId: this.selectedTaxType,
          taxRateId: this.selectedTaxRates,
          taxType: getValueFromArrayOfObjectById(
            'label',
            'value',
            this.selectedTaxType,
            this.taxTypeList
          ),
          taxRate: getValueFromObjectByKey(
            'label',
            getObjectById('value', this.selectedTaxRates, this.taxRatesList)
          ),
        });
        this.totalRecords = this.taxTypeRateMapping.length;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);

        this.selectedTaxRates = null;
        this.selectedTaxType = null;
        this.disableTaxSave = true;
      }
    }
  }

  editTaxtRate(rowData) {
    this.taxRateEditData = { ...rowData, updatedBy: this.userName };
    this.taxAndRateUpdateFlag = true;
  }

  updateTaxTypeandRate() {
    if (this.taxRateEditData.customerTaxTypeRateMappingId) {
      this.customerService.updateCustomerTaxTypeRate(this.taxRateEditData).subscribe((res) => {
          this.taxRateEditData = undefined;
          this.getMappedTaxTypeRateDetails();
          this.alertService.showMessage(
            'Success',
            `Successfully Updated Tax Type and Tax Rate`,
            MessageSeverity.success
          );
        }, error => { this.isSpinnerVisible = false });
    } else {
      const data = [
        ...this.taxTypeRateMapping.map((x) => {
          if (x.id == this.taxRateEditData.id) {
            return {
              ...this.taxRateEditData,
              taxType: getValueFromArrayOfObjectById(
                'label',
                'value',
                this.taxRateEditData.taxTypeId,
                this.taxTypeList
              ),
              taxRate: getValueFromObjectByKey(
                'label',
                getObjectById(
                  'value',
                  this.taxRateEditData.taxRateId,
                  this.taxRatesList
                )
              ),
            };
          } else {
            return x;
          }
        }),
      ];
      this.taxTypeRateMapping = data;

      this.alertService.showMessage(
        'Success',
        `Successfully Updated Tax Type and  Tax Rate`,
        MessageSeverity.success
      );
    }
  }

  getAuditHistoryById(content, data) {
    const { customerTaxTypeRateMappingId } = data;
    this.customerService.getAuditHistoryForTaxType(customerTaxTypeRateMappingId).subscribe((res) => {
        this.auditDataForTaxData = res;
      }, error => { this.isSpinnerVisible = false });
    this.modal = this.modalService.open(content, {
      size: 'sm',
      backdrop: 'static',
      keyboard: false,
    });
  }

  saveFinancialInformation() {
    this.isSpinnerVisible = true;

    this.customerService.updatefinanceinfo({
      ...this.savedGeneralInformationData,
      CustomerTaxTypeRateMapping: this.taxTypeRateMapping.map(obj => {
        return {
          ...obj,
          createdBy: this.userName,
          updatedBy: this.userName,
        }
      }),
      discountId: this.savedGeneralInformationData.discountId == 0 || this.savedGeneralInformationData.discountId == undefined ? null : editValueAssignByCondition('DiscountId', this.savedGeneralInformationData.discountId),//this.savedGeneralInformationData.discountId,
      markUpPercentageId: this.savedGeneralInformationData.markUpPercentageId == 0 || this.savedGeneralInformationData.markUpPercentageId == undefined ? null : editValueAssignByCondition('PercentId', this.savedGeneralInformationData.markUpPercentageId),//this.savedGeneralInformationData.markUpPercentageId,
      createdBy: this.userName,
      updatedBy: this.userName,
      creditTermsId: this.savedGeneralInformationData.creditTermsId.value,
    },
      this.id
    ).subscribe((res) => {
        this.onUploadDocumentListNew();
        this.savedGeneralInformationData.customerFinancialId = res;
        this.alertService.showMessage(
          'Success',
          ` ${
          this.editModeFinance ? 'Updated' : 'Saved'
          }  Customer Financial Information Sucessfully`,
          MessageSeverity.success
        );
        this.getMappedTaxTypeRateDetails();
        this.editModeFinance = true;
        this.disableSave = true;
        this.isSpinnerVisible = false;
        //this.fininfoformdata.reset();
      }, error => { this.isSpinnerVisible = false });
  }

  downloadFileUpload(rowData) {
    const url = `${this.configurations.baseUrl}/api/FileUpload/downloadattachedfile?filePath=${rowData.link}`;
    window.location.assign(url);
  }

  dateFilterForTable(date, field) {
    if (date !== '' && moment(date).format('MMMM DD YYYY')) {
      this.allCustomerFinanceDocumentsList = this.allCustomerFinanceDocumentsListOriginal;
      const data = [
        ...this.allCustomerFinanceDocumentsList.filter((x) => {
          if (
            moment(x.createdDate).format('MMMM DD YYYY') ===
            moment(date).format('MMMM DD YYYY') &&
            field === 'createdDate'
          ) {
            return x;
          } else if (
            moment(x.updatedDate).format('MMMM DD YYYY') ===
            moment(date).format('MMMM DD YYYY') &&
            field === 'updatedDate'
          ) {
            return x;
          }
        }),
      ];
      this.allCustomerFinanceDocumentsList = data;
    } else {
      this.allCustomerFinanceDocumentsList = this.allCustomerFinanceDocumentsListOriginal;
    }
  }

  deleteFile(rowData) {
    this.selectedRowFileForDelete = rowData;
  }

  deleteConformationForFile(value) {
    if (value === 'Yes') {
      this.customerService.GetCustomerAttachmentDelete(
          this.selectedRowFileForDelete.attachmentDetailId,
          true,
          this.userName
        )
        .subscribe((res) => {
          this.alertService.showMessage(
            'Success',
            `deleted File`,
            MessageSeverity.success
          );
          this.toGetDocumentsListNew(this.id);
        }, error => { this.isSpinnerVisible = false });
    } else {
      this.selectedRowFileForDelete = undefined;
    }
  }

  saveMarkUpPercentage() {
    const data = {
      ...this.addNewIntergration,
      createdBy: this.userName,
      updatedBy: this.userName,
    };
    this.customerService.newMarkUp(data).subscribe((data) => {
      if (data) {
        this.savedGeneralInformationData.markUpPercentageId =
          data.markUpPercentageId;
        this.alertService.showMessage(
          'Success',
          `Add MarkUp Sucessfully `,
          MessageSeverity.success
        );
      }
    }, error => { this.isSpinnerVisible = false });
  }

  restMarkUpPopUp() {
    this.addNewIntergration = { ...this.intergationNew };
  }

  newCreditTermAdd() {
    const data = {
      ...this.addNewCreditTerms,
      masterCompanyId: this.currentUserMasterCompanyId,
      createdBy: this.userName,
      updatedBy: this.userName,
    };
    this.creditTermsService.newAddcreditterms(data).subscribe((data) => {
      this.getAllcreditTermList();
      this.alertService.showMessage(
        'Success',
        `Added New Credit Term Successfully `,
        MessageSeverity.success
      );
      this.resetCreditTermsPopUp();

      this.savedGeneralInformationData.creditTermsId = data.creditTermsId;
    }, error => { this.isSpinnerVisible = false });
  }
  resetCreditTermsPopUp() {
    this.addNewCreditTerms = { ...this.creditTermsNew };
  }

  newDiscountAdd() {
    const data = {
      discontValue: this.discontValue,
      masterCompanyId: this.currentUserMasterCompanyId,
      createdBy: this.userName,
      updatedBy: this.userName,
      createdDate: new Date(),
      updatedDate: new Date(),
    };

    this.customerService.newAddDiscount(data).subscribe((data) => {
      this.getAllDiscountList();
      this.alertService.showMessage(
        'Success',
        `Added New Discount  Successfully `,
        MessageSeverity.success
      );
      this.restDiscount();
      this.savedGeneralInformationData.discountId = data.discontValue;
    }, error => { this.isSpinnerVisible = false });
  }

  restDiscount() {
    this.discontValue = null;
    this.isDiscountExists = false;
    this.isCountdisable = false;
  }

  newTaxTypeAdd() {
    const data = {
      ...this.addNewTaxType,
      masterCompanyId: this.currentUserMasterCompanyId,
      createdBy: this.userName,
      updatedBy: this.userName,
      createdDate: new Date(),
      updatedDate: new Date(),
    };
    this.taxtypeser.newAction(data).subscribe((data) => {
      this.getAllTaxTypes();
      this.alertService.showMessage(
        'Success',
        `Added New Tax Type  Successfully `,
        MessageSeverity.success
      );
      this.resetTaxType();
    }, error => { this.isSpinnerVisible = false });
  }
  newTaxRateAdd() {
    const data = {
      ...this.addNewTaxRate,
      createdBy: this.userName,
      updatedBy: this.userName,
      masterCompanyId: this.currentUserMasterCompanyId,
    };

    this.taxRateService.newTaxRate(data).subscribe(() => {
      this.resetTaxType();
      this.getAllTaxTypes();
      this.getAllTaxRates();
      this.getAllPercentage();
      this.addNewTaxRate = { ...this.taxRateNew };

      this.alertService.showMessage(
        'Success',
        `Added New Tax Rate  Successfully`,
        MessageSeverity.success
      );
    }, error => { this.isSpinnerVisible = false });
  }

  resetTaxType() {
    this.addNewTaxType = { ...this.taxTyeNew };
  }
  resetTaxRate() {
    this.addNewTaxRate = { ...this.taxRateNew };
  }

  backClick() {
    this.tab.emit('Atachapter');
  }

  onClickMemo() {
    this.memoPopupContent = this.documentInformation.docMemo;
    this.enableSave();
    this.enableSaveDoc();
    //this.memoPopupValue = value;
  }
  onClickPopupSave() {
    this.documentInformation.docMemo = this.memoPopupContent;
    this.memoPopupContent = '';
    $('#financial-memo-popup').modal("hide");
  }
  closeMemoModel() {
    $('#financial-memo-popup').modal("hide");
  }

  deleteTaxTypeRate(content, rowData, index) {
    this.taxRateIndex = index;
    this.isDeleteMode = true;
    this.localcollection = rowData;
    this.selectedRowForDelete = rowData;

    this.customerTaxRateMappingId = rowData.customerTaxTypeRateMappingId;
    this.modal = this.modalService.open(content, {
      size: 'sm',
      backdrop: 'static',
      keyboard: false,
    });
  }

  deleteItemAndCloseModel() {
    let customerTaxRateMappingId = this.customerTaxRateMappingId;
    let user = this.userName;
    if (customerTaxRateMappingId > 0) {
      this.customerService.deleteCustomerTaxTypeRateById(customerTaxRateMappingId, true, user).subscribe(
          (response) => {
            this.saveCompleted('');
            this.getMappedTaxTypeRateDetails();
          },(error) => {this.currentUserMasterCompanyId});
    } else {
      this.taxTypeRateMapping.splice(this.taxRateIndex, 1);
      this.totalRecords = this.taxTypeRateMapping.length;
      this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    }
    this.modal.close();
  }

  restoreTaxTypeRate(content, rowData, index) {
    this.taxRateIndex = index;
    this.localcollection = rowData;
    this.selectedRowForDelete = rowData;
    this.customerTaxRateMappingId = rowData.customerTaxTypeRateMappingId;
    this.modal = this.modalService.open(content, {
      size: 'sm',
      backdrop: 'static',
      keyboard: false,
    });
  }

  restoreItemAndCloseModel() {
    let customerTaxRateMappingId = this.customerTaxRateMappingId;
    let user = this.userName;
    if (customerTaxRateMappingId > 0) {
      this.customerService.deleteCustomerTaxTypeRateById(customerTaxRateMappingId, false, user).subscribe(
          (response) => {
            this.alertService.showMessage(
              'Success',
              `Action was Restore successfully`,
              MessageSeverity.success
            );
            this.getMappedTaxTypeRateDetails();
          },
          (error) => this.saveFailedHelper(error)
        );
    } else {
      this.taxTypeRateMapping.splice(this.taxRateIndex, 1);
      this.totalRecords = this.taxTypeRateMapping.length;
      this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    }
    this.modal.close();
  }

  private saveCompleted(user?: any) {
    if (this.isDeleteMode == true) {
      this.alertService.showMessage(
        'Success',
        `Action was deleted successfully`,
        MessageSeverity.success
      );
      this.isDeleteMode = false;
    } else {
      this.alertService.showMessage(
        'Success',
        `Action was edited successfully`,
        MessageSeverity.success
      );
      this.saveCompleted;
    }
  }
  private saveFailedHelper(error: any) {
    this.isSpinnerVisible = false;
    this.alertService.stopLoadingMessage();
    this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
    this.alertService.showStickyMessage(error, null, MessageSeverity.error);
    setTimeout(() => this.alertService.stopLoadingMessage(), 10000);
  }

  dismissModel() {
    this.modal.close();
    if (this.nextOrPreviousTab == 'Next') {
      this.tab.emit('Billing');
    }
    if (this.nextOrPreviousTab == 'Previous') {
      this.tab.emit('Atachapter');
    }
  }

  getColorCodeForHistory(i, field, value) {
    const data = this.auditDataForTaxData;
    const dataLength = data.length;
    if (i >= 0 && i <= dataLength) {
      if (i + 1 === dataLength) {
        return true;
      } else {
        return data[i + 1][field] === value;
      }
    }
  }

  nextClick(nextOrPrevious) {
    this.nextOrPreviousTab = nextOrPrevious;
    if (this.fininfoformdata.form.dirty) {
      let content = this.tabRedirectConfirmationModal;
      this.modal = this.modalService.open(content, { size: 'sm' });
    }
    else {
      this.stopmulticlicks = true;
      this.fininfoformdata.reset();
      if (this.nextOrPreviousTab == 'Next') {
        this.tab.emit('Billing');
      }
      if (this.nextOrPreviousTab == 'Previous') {
        this.tab.emit('Atachapter');
      }
      setTimeout(() => {
        this.stopmulticlicks = false;
      }, 500)
    }
  }

  redirectToTab() {
    if (!this.disableSave) {
      this.saveFinancialInformation();
    }
    this.dismissModel();
    this.fininfoformdata.reset();
    if (this.nextOrPreviousTab == 'Next') {
      this.tab.emit('Billing');
    }
    if (this.nextOrPreviousTab == 'Previous') {
      this.tab.emit('Atachapter');
    }
  }

  addDocumentDetails() {
    this.selectedFileAttachment = [];
    this.index = 0;
    this.disableFileAttachmentSubmit = false;

    this.isEditButton = false;
    this.documentInformation = {
      docName: '',
      docMemo: '',
      docDescription: '',
      attachmentDetailId: 0,
    };
  }
  dismissDocumentPopupModel(type) {
    this.taxExemptFileUploadInput.clear();
    this.closeMyModel(type);
  }
  closeMyModel(type) {
    $(type).modal('hide');
  }

  downloadFileUploadNew(link) {
    const url = `${this.configurations.baseUrl}/api/FileUpload/downloadattachedfile?filePath=${link}`;
    window.location.assign(url);
  }

  fileUpload(event) {
    if (event.files.length === 0) {
      this.disableFileAttachmentSubmit = false;
    } else {
      this.disableFileAttachmentSubmit = true;
    }

    const filesSelectedTemp = [];
    this.selectedFileAttachment = [];
    for (let file of event.files) {
      var flag = false;
      for (var i = 0; i < this.allCustomerFinanceDocumentsList.length; i++) {
        if (this.allCustomerFinanceDocumentsList[i].fileName == file.name) {
          flag = true;
          this.alertService.showMessage(
            'Duplicate',
            `Already Exists this file `,
            MessageSeverity.warn
          );
          this.disableFileAttachmentSubmit = false;
          if (this.taxExemptFileUploadInput) {
            this.taxExemptFileUploadInput.clear();
          }
        }
      }
      if (!flag) {
        filesSelectedTemp.push({
          link: file.objectURL,
          fileName: file.name,
          isFileFromServer: false,
          fileSize: file.size,
        });

        this.formData.append(file.name, file);
      }
    }

    for (var i = 0; i < filesSelectedTemp.length; i++) {
      this.selectedFileAttachment.push({
        docName: this.documentInformation.docName,
        docMemo: this.documentInformation.docMemo,
        docDescription: this.documentInformation.docDescription,
        createdBy: this.userName,
        updatedBy: this.userName,
        link: filesSelectedTemp[i].link,
        fileName: filesSelectedTemp[i].fileName,
        fileSize: filesSelectedTemp[i].fileSize,

        isFileFromServer: false,
        attachmentDetailId: 0,
      });

    }
    this.attachCertificateUpdateFlag = false;
  }
  onFileChanged(event) {
    this.selectedFile = event.target.files[0];
  }

  addDocumentInformation(type, documentInformation) {
    if (this.selectedFileAttachment != []) {
      for (var i = 0; i < this.selectedFileAttachment.length; i++) {
        this.allCustomerFinanceDocumentsList.push({
          docName: documentInformation.docName,
          docMemo: documentInformation.docMemo,
          docDescription: documentInformation.docDescription,
          link: this.selectedFileAttachment[i].link,
          fileName: this.selectedFileAttachment[i].fileName,
          isFileFromServer: false,
          attachmentDetailId: 0,
          createdBy: this.userName,
          updatedBy: this.userName,
          createdDate: Date.now(),
          updatedDate: Date.now(),
          fileSize: (
            this.selectedFileAttachment[i].fileSize /
            (1024 * 1024)
          ).toFixed(2),
        });

      }
    }

    if (documentInformation.attachmentDetailId > 0 || this.index > 0) {
      for (var i = 0; i <= this.allCustomerFinanceDocumentsList.length; i++) {
        if (this.allCustomerFinanceDocumentsList[i].attachmentDetailId > 0) {
          if (
            this.allCustomerFinanceDocumentsList[i].attachmentDetailId ==
            documentInformation.attachmentDetailId
          ) {
            this.allCustomerFinanceDocumentsList[i].docName =
              documentInformation.docName;
            this.allCustomerFinanceDocumentsList[i].docMemo =
              documentInformation.docMemo;
            this.allCustomerFinanceDocumentsList[i].docDescription =
              documentInformation.docDescription;
            break;
          }
        } else {
          if (i == this.index) {
            this.allCustomerFinanceDocumentsList[i].docName =
              documentInformation.docName;
            this.allCustomerFinanceDocumentsList[i].docMemo =
              documentInformation.docMemo;
            this.allCustomerFinanceDocumentsList[i].docDescription =
              documentInformation.docDescription;
            break;
          }
        }
      }
    }
    this.allCustomerFinanceDocumentsList = [
      ...this.allCustomerFinanceDocumentsList,
    ];
    if (this.allCustomerFinanceDocumentsList.length > 0) {
      this.totalRecordNew = this.allCustomerFinanceDocumentsList.length;
      this.totalPagesNew = Math.ceil(this.totalRecordNew / this.pageSizeNew);

      this.index = 0;
      this.isEditButton = false;
      this.disableFileAttachmentSubmit == true;

      this.dismissDocumentPopupModel(type);
    }

    this.dismissDocumentPopupModel(type);

    if (this.taxExemptFileUploadInput) {
      this.taxExemptFileUploadInput.clear();
    }
    this.onUploadDocumentListNew();
    this.alertService.showMessage(
      'Success',
      `Successfully Attached Certificate. `,
      MessageSeverity.success
    );
  }

  editCustomerDocument(rowdata, index = 0) {
    this.selectedFileAttachment = [];
    this.isEditButton = true;
    this.documentInformation = rowdata;
    this.index = index;
    if (rowdata.attachmentDetailId > 0) {
      this.toGetDocumentView(rowdata.attachmentDetailId);
    } else {
      this.sourceViewforDocument = rowdata;
    }
    this.attachCertificateUpdateFlag = true;
  }

  deleteAttachmentRow(rowdata, index, content) {
    this.selectedRowForDelete = rowdata;
    this.rowIndex = index;
    this.modal = this.modalService.open(content, { size: 'sm' });
  }

  deleteItemAndCloseModelNew() {
    let attachmentDetailId = this.selectedRowForDelete.attachmentDetailId;
    if (attachmentDetailId > 0) {
      this.commonservice.GetAttachmentDeleteById(attachmentDetailId, this.userName).subscribe((res) => {
          this.toGetDocumentsListNew(this.id);
          this.alertService.showMessage(
            'Success',
            `Deleted Attachment  Successfully`,
            MessageSeverity.success
          );
        }, error => { this.isSpinnerVisible = false });
    } else {
      this.allCustomerFinanceDocumentsList.splice(this.rowIndex, 1);
      this.totalRecordNew = this.allCustomerFinanceDocumentsList.length;
      this.totalPagesNew = Math.ceil(this.totalRecordNew / this.pageSizeNew);
    }
    this.modal.close();
  }

  onUploadDocumentListNew() {
    const data = {
      ...this.allCustomerFinanceDocumentsList,
      referenceId: this.id,
      masterCompanyId: this.currentUserMasterCompanyId,
      updatedBy: this.userName,
      createdBy: this.userName,
      moduleId: 50,
    }
    for (var key in data) {
      this.formData.append(key, data[key]);
    }
    if (this.allCustomerFinanceDocumentsList != undefined && this.allCustomerFinanceDocumentsList.length > 0) {
      this.formData.append(
        'attachmentdetais',
        JSON.stringify(this.allCustomerFinanceDocumentsList)
      );

      this.commonservice
        .uploadDocumentsEndpoint(this.formData)
        .subscribe((res) => {
          this.formData = new FormData();
          this.toGetDocumentsListNew(this.id);
        }, error => { this.isSpinnerVisible = false });
    }
  }

  toGetDocumentsListNew(id) {
    var moduleId = 50;
    this.commonservice.GetDocumentsListNew(id, moduleId).subscribe((res) => {
      this.allCustomerFinanceDocumentsList = res || [];
      this.allDocumentListOriginal = res;

      if (this.allCustomerFinanceDocumentsList.length > 0) {
        this.allCustomerFinanceDocumentsList.forEach((item) => {
          item['isFileFromServer'] = true;
        });

        this.savedGeneralInformationData.isTaxExempt = true;
      }
      this.totalRecordNew = this.allCustomerFinanceDocumentsList.length;
      this.totalPagesNew = Math.ceil(this.totalRecordNew / this.pageSizeNew);
    }, error => { this.isSpinnerVisible = false });
  }

  toGetDocumentView(id) {
    this.commonservice.GetAttachment(id).subscribe((res) => {
      this.sourceViewforDocument = res || [];
    }, error => { this.isSpinnerVisible = false });
  }

  private onAuditHistoryLoadSuccessful(auditHistory, content) {
    this.alertService.stopLoadingMessage();
    this.sourceViewforDocumentAudit = auditHistory;
    this.modal = this.modalService.open(content, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }

  openHistory(content, rowData) {
    this.alertService.startLoadingMessage();

    this.commonservice.GetAttachmentAudit(rowData.attachmentDetailId).subscribe(
      (results) => this.onAuditHistoryLoadSuccessful(results, content),
      (error) => this.saveFailedHelper(error)
    );
  }
  getColorCodeForHistoryDoc(i, field, value) {
    const data = this.sourceViewforDocumentAudit;
    const dataLength = data.length;
    if (i >= 0 && i <= dataLength) {
      if (i + 1 === dataLength) {
        return true;
      } else {
        return data[i + 1][field] === value;
      }
    }
  }

  removeFile(event) {
    //this.formData.delete(event.file.name)
  }

  dismissModelNew() {
    this.isDeleteMode = false;
    this.isEditButton = false;
    this.modal.close();
  }

  getDeleteListByStatus(value) {
    if (value) {
      this.currentDeletedstatus = true;
    } else {
      this.currentDeletedstatus = false;
    }
    this.getMappedTaxTypeRateDetails();
  }

  enableSave() {
    this.disableSave = false;
  }
  enableSaveDoc() {
    this.attachCertificateUpdateFlag = false;
  }

  dateFilterForTableNew(event, field) { }
}
