import { Component, OnInit, AfterViewInit, ViewChild, Input, ContentChildren } from '@angular/core';
import { fadeInOut } from '../../../../services/animations';
import { CustomerService } from '../../../../services/customer.service';
import { CommonService } from '../../../../services/common.service';
import { NgbModal, NgbActiveModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import * as $ from 'jquery';
import { ConfigurationService } from '../../../../services/configuration.service';
import { EmployeeService } from '../../../../services/employee.service';
import { LocalStoreManager } from '../../../../services/local-store-manager.service';
import { DBkeys } from '../../../../services/db-Keys';
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
import { formatNumberAsGlobalSettingsModule } from '../../../../generic/autocomplete';

@Component({
    selector: 'app-customer-view',
    templateUrl: './customer-view.component.html',
    styleUrls: ['./customer-view.component.scss'],
    animations: [fadeInOut]
})

export class CustomerViewComponent implements OnInit {

    @Input() customerId;
    viewDataGeneralInformation: any = {};
    viewDataclassification: any[];
    customerContacts: any = [];
    customerContactsColumns: any[];
    pageSize: number = 10;
    sourceViewforDocumentAudit: any = [];
    currantDeletedStatusDER: boolean = false;
    currantDeletedStatusPMA: boolean = false;
    modal: NgbModalRef;
    restrictHeaders = [
        { field: 'partNumber', header: 'PN' },
        { field: 'partDescription', header: 'Description' },
        { field: 'manufacturerName', header: 'Manufacturer' },

    ];
    colsaircraftLD: any = [
        { field: "aircraftType", header: "Aircraft" },
        { field: "aircraftModel", header: "Model" },
        { field: "dashNumber", header: "Dash Numbers" },
        { field: "inventory", header: "Inventory" },
        { field: "memo", header: "Memo" }

    ]

    ataHeaders = [
        { field: 'firstName', header: 'Contact' },
        { field: 'ataChapterName', header: 'ATA Chapter' },
        { field: 'ataSubChapterDescription', header: 'ATA Sub-Chapter' }
    ]
    billingInfoTableHeaders = [
        { field: 'siteName', header: 'Site Name' },
        { field: 'address1', header: 'Address1' },
        { field: 'address2', header: 'Address2' },

        { field: 'city', header: 'City' },
        { field: 'stateOrProvince', header: 'State/Prov' },
        { field: 'postalCode', header: 'Postal Code' },
        { field: 'countryName', header: 'Country' }
    ]
    domesticShippingHeaders = [
        { field: 'siteName', header: 'Site Name' },
        { field: 'address1', header: 'Address1' },
        { field: 'address2', header: 'Address2' },

        { field: 'city', header: 'City' },
        { field: 'stateOrProvince', header: 'State Or Province' },
        { field: 'postalCode', header: 'Postal Code' },
        { field: 'countryName', header: 'Country' }
    ]
    internationalShippingHeaders = [
        { field: 'exportLicense', header: 'Export License' },
        { field: 'description', header: 'Description' },
        { field: 'isPrimary', header: 'IsDefault' },
        { field: 'startDate', header: 'Start Date' },
        { field: 'expirationDate', header: 'Expiration Date' },
        { field: 'amount', header: 'Amount' }
    ]

    warningHeaders = [
        { field: 'sourceModule', header: 'Module' },
        { field: 'warningMessage', header: 'Warning Message' },
        { field: 'restrictMessage', header: 'Restrict Message' },
        { field: 'isActive', header: 'Is Active' }

    ]
    customerDocumentsColumns = [

        { field: 'docName', header: 'Name' },
        { field: 'docDescription', header: 'Description' },
        { field: 'documents', header: 'Documents' },
        { field: 'docMemo', header: 'Memo' }
    ];
    customerPMAColumns = [
        { field: 'partNumber', header: 'Part Number' },
        { field: 'partDescription', header: 'Description' },
        { field: 'manufacturerName', header: 'Manufacturer' }
    ];
    customerDERColumns = [
        { field: 'partNumber', header: 'Part Number' },
        { field: 'partDescription', header: 'Description' },
        { field: 'manufacturerName', header: 'Manufacturer' }
    ];
    contactTableColumns = [
        { field: 'tag', header: 'Tag' },
        { field: 'firstName', header: 'First Name' },
        { field: 'lastName', header: 'Last Name' },
        { field: 'contactTitle', header: 'Contact Title' },
        { field: 'email', header: 'Email' },
        { field: 'workPhone', header: 'Work Phone' },
        { field: 'mobilePhone', header: 'Mobile Phone' },
        { field: 'fax', header: 'Fax' },

    ]
    taxTypeRateMappingColumns = [
        { field: 'taxType', header: 'Tax Type' },
        { field: 'taxRate', header: 'Tax Rate' }
    ]
    
    allCustomerFinanceDocumentsListColumns: any[] = [
        { field: 'docName', header: 'Name' },
        { field: 'docDescription', header: 'Description' },
        { field: 'docMemo', header: 'Memo' },

        { field: "fileName", header: "File Name" },
        { field: 'fileSize', header: 'File Size' },

        { field: 'createdDate', header: 'Created Date' },
        { field: 'createdBy', header: 'CreatedBy' },
        { field: 'updatedDate', header: 'Updated Date' },
        { field: 'updatedBy', header: 'UpdatedBy' },
        { field: 'download', header: 'Actions' },
    ];
    isSpinnerVisible: boolean = false;
    aircraftListDataValues: any = [];
    financeInfoListDataValues: any = [];
    salesInfoListDataValues: any = [];
    ataListDataValues: any = [];
    billingInfoList: any = [];
    waringInfoList: any = [];
    DocumentsList: any = [];
    domesticShippingData: any;
    internationalShippingData: any = [];
    ataloader: boolean = true;
    salesloader: boolean = true;
    warningsloader: boolean = true;
    filterKeysByValue: object = {};
    taxTypeRateMapping: any = [];
    restrictedPMAParts: any = [];
    restrictedDERParts: any = [];
    disableRestrictedPMA: boolean = false;
    currentDeletedstatus: boolean = false;
    classificationIds: any[];
    viewDataIntegration: any;
    allCustomerFinanceDocumentsList: any = [];
    countOfRestrictDerParts: any = 0;
    countOfRestrictPMAParts: any = 0;
    employeeListOriginal: any = [];
    globalSettings: any = {};
    global_lang: string;
    auditHistoryATA: any;
    constructor(public customerService: CustomerService, private commonService: CommonService,
         private activeModal: NgbActiveModal,
          private configurations: ConfigurationService,
           public employeeService: EmployeeService,
        private localStorage: LocalStoreManager,
        private alertService: AlertService,
        private modalService: NgbModal,
    ) {}
    ngOnInit(): void {

        this.customerContactsColumns = [
            { field: 'tag', header: 'Tag' },
            { field: 'firstName', header: 'First Name' },
            { field: 'lastName', header: 'Last Name' },
            { field: 'contactTitle', header: 'Contact Title' },
            { field: 'email', header: 'Email' },
            { field: 'workPhone', header: 'Work Phone' },
            { field: 'mobilePhone', header: 'Mobile Phone' },
            { field: 'fax', header: 'Fax' },

        ];
        let customerId = this.customerId;
        if(customerId != undefined || customerId != null){
        this.isSpinnerVisible = true;
        this.customerService.getCustomerdataById(customerId).subscribe(res => {
            this.salesloader = false;
            this.getMappedATAByCustomerId(customerId);
            this.getCustomerWaringByCustomerId(customerId);
            this.getMappedTaxTypeRateDetails(customerId);
            this.getCustomerRestrictedPMAByCustomerId(customerId);
            this.getCustomerRestrictedDERByCustomerId(customerId);
            this.getCustomerClassificationByCustomerId(customerId);
            this.getCustomerIntegrationTypesByCustomerId(customerId);
            this.getFinanceInfoByCustomerId(customerId);
            this.toGetCustomerFinanceDocumentsList(customerId);       
            this.getSalesInfoByCustomerId(customerId);
            this.viewDataGeneralInformation = res[0];
            this.viewDataGeneralInformation.markUpPercentage=   this.viewDataGeneralInformation.markUpPercentage ? formatNumberAsGlobalSettingsModule( this.viewDataGeneralInformation.markUpPercentage, 2) : '';
            this.viewDataGeneralInformation.creditLimit=   this.viewDataGeneralInformation.creditLimit ? formatNumberAsGlobalSettingsModule( this.viewDataGeneralInformation.creditLimit, 2) : '';
            this.viewDataGeneralInformation.discountId=   this.viewDataGeneralInformation.discountId ? formatNumberAsGlobalSettingsModule( this.viewDataGeneralInformation.discountId, 2) : '';
            this.getGlobalSettings();
            this.changeOfTab("Shipping");
            this.isSpinnerVisible = false;

        }, err => {
            this.salesloader = false;
            this.isSpinnerVisible = false;
        })
    }
    this.isSpinnerVisible = false;
    }
    getGlobalSettings() {
        this.globalSettings = this.localStorage.getDataObject<any>(DBkeys.GLOBAL_SETTINGS) || {};
        this.global_lang = this.globalSettings.cultureName;
    }
    formatCreditLimit(val){
        if(val){
            if(isNaN(val) ==  true){
                val = Number(val.replace(/[^0-9.-]+/g,""));
              }
            this.viewDataGeneralInformation.creditLimit = new Intl.NumberFormat(this.global_lang, { style: 'decimal', minimumFractionDigits: 2,    maximumFractionDigits: 2}).format(val)
            return this.viewDataGeneralInformation.creditLimit;
        }
        
    }
    pageIndexChange(event) {
        this.pageSize = event.rows;
    }
    pageIndexChange1(event) {
        this.pageSize = event.rows;
    }
    pageIndexChange2(event) {
        this.pageSize = event.rows;
    }
    pageIndexChange5(event) {
        this.pageSize = event.rows;
    }
    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }

    getAllCustomerContact(customerId) {
        // get Customer Contatcs 
        this.customerService.getContacts(customerId).subscribe(res => {
            this.customerContacts = res[0] || [];
        })
    }

    getAircraftMappedDataByCustomerId(customerId) {
        this.customerService.getMappedAirCraftDetails(customerId).subscribe(res => {
            this.aircraftListDataValues = res || [];
        })
    }

    getFinanceInfoByCustomerId(customerId) {	
          this.isSpinnerVisible = true;	
          this.customerService.getFinanceInfoByCustomerId(customerId).subscribe(res => {
            if(res)
            {
              this.financeInfoListDataValues = res || [];
            }
            this.isSpinnerVisible = false;	
          },error => this.saveFailedHelper(error))
    }

        getSalesInfoByCustomerId(customerId) {		
            this.customerService.getSalesInfo(customerId).subscribe(res => {
                if(res)
                {
                    this.salesInfoListDataValues = res || [];
                }
            })
        }

    async getMappedATAByCustomerId(customerId) {
        await this.customerService.getATAMappedByCustomerId(customerId).subscribe(res => {
            this.ataListDataValues = res || [];
            this.ataloader = false;
        }, err => {
            this.ataloader = false;
        })
    }
    async getBillingDataById(customerId) {
        await this.customerService.getCustomerBillViaDetails(customerId).subscribe(res => {
            this.billingInfoList = res[0] || []
        })
    }

    async getDomesticShippingByCustomerId(customerId) {
        await this.customerService.getCustomerShipAddressGet(customerId).subscribe(res => {
            this.domesticShippingData = res[0] || [];
        })
    }

    async getInternationalShippingByCustomerId(customerId) {
        await this.customerService.getInternationalShippingByCustomerId(customerId).subscribe(res => {
            this.internationalShippingData = res.paginationList || [];
        }, err => {
        })
    }
    currentTab:any;
    viewCurrentRecordData:any={};
    changeOfTab(value){
        if (value === 'Shipping') {
            this.viewCurrentRecordData=this.viewDataGeneralInformation;
		} 
    }
    async getCustomerWaringByCustomerId(customerId) {
        await this.customerService.getCustomerWarnings(customerId).subscribe(res => {
            this.warningsloader = false;
            this.waringInfoList = res[0].map(x => {
                return {
                    ...x,
                    sourceModule: `${x.sourceModule == null ? '' : x.sourceModule}`,
                    warningMessage: `${x.t.warningMessage == null ? '' : x.t.warningMessage}`,
                    restrictMessage: `${x.t.restrictMessage == null ? '' : x.t.restrictMessage}`,
                    isActive: `${x.t.isActive == null ? '' : x.t.isActive}`
                };
            }) || [];


        }, err => {
            this.warningsloader = false;
        })
    }

    async getMappedTaxTypeRateDetails(customerId) {
        await this.customerService.getMappedTaxTypeRateDetails(customerId, this.currentDeletedstatus).subscribe(res => {
            this.taxTypeRateMapping = res || [];

        })
    }

    getCustomerRestrictedPMAByCustomerId(customerId) {

        this.commonService.getRestrictedPartsWithDesc(1, customerId, 'PMA', this.currantDeletedStatusPMA).subscribe(res => {
            this.restrictedPMAParts = res || [];
        })
    }


    getCustomerRestrictedDERByCustomerId(customerId) {

        this.commonService.getRestrictedPartsWithDesc(1, customerId, 'DER', this.currantDeletedStatusDER).subscribe(res => {
            this.restrictedDERParts = res || [];
        })
    }

    getPMAPartListByStatus(value)
    {
        if(value){
            this.currantDeletedStatusPMA=true;
        }else{
            this.currantDeletedStatusPMA=false;
        }
        this.getCustomerRestrictedPMAByCustomerId(this.customerId);
    }

    getDERPartListByStatus(value)
    {
        if(value){
            this.currantDeletedStatusDER=true;
        }else{
            this.currantDeletedStatusDER=false;
        }
        this.getCustomerRestrictedDERByCustomerId(this.customerId);
    }

    async getCustomerClassificationByCustomerId(customerId) {

        await this.customerService.getCustomerClassificationMapping(customerId).subscribe(res => {
            this.viewDataclassification = res.map(x => x.description + ' ');
        });
    }

    getCustomerIntegrationTypesByCustomerId(customerId) {
        this.commonService.getIntegrationMapping(customerId, 1).subscribe(res => {
            this.viewDataIntegration = res.map(x => x.description);
        });
    }
    toGetCustomerFinanceDocumentsList(customerId) {
        var moduleId = 50;
        this.commonService.GetDocumentsListNew(customerId, moduleId).subscribe(res => {
        this.allCustomerFinanceDocumentsList = res;
        })
    }
    downloadFileUpload(rowData) {

        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadattachedfile?filePath=${rowData.link}`;
        window.location.assign(url);
    }
    dismissModel() {
        this.activeModal.close();
    }
    openStep1() {
        $('#step1').collapse('show');
    }

    ExpandAllCustomerDetailsModel() {
        $('#step1').collapse('show');
        $('#step2').collapse('show');
        $('#step3').collapse('show');
        $('#step4').collapse('show');
        $('#step5').collapse('show');
        $('#step6').collapse('show');
        $('#step7').collapse('show');
        $('#step8').collapse('show');
        $('#step9').collapse('show');
        $('#step10').collapse('show');
    }
    CloseAllCustomerDetailsModel() {
        $('#step1').collapse('hide');
        $('#step2').collapse('hide');
        $('#step3').collapse('hide');
        $('#step4').collapse('hide');
        $('#step5').collapse('hide');
        $('#step6').collapse('hide');
        $('#step7').collapse('hide');
        $('#step8').collapse('hide');
        $('#step9').collapse('hide');
        $('#step10').collapse('hide');

    }

    private onAuditHistoryLoadSuccessful(auditHistory, content) {
        this.sourceViewforDocumentAudit = auditHistory;
        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
    }

    openHistoryDoc(rowData) {
            this.commonService.GetAttachmentAudit(rowData.attachmentDetailId).subscribe(
                res => {
                    this.sourceViewforDocumentAudit = res;
                })
    }
    getColorCodeForHistoryDoc(i, field, value) {
        const data = this.sourceViewforDocumentAudit;
        const dataLength = data.length;
        if (i >= 0 && i <= dataLength) {
            if ((i + 1) === dataLength) {
                return true;
            } else {
                return data[i + 1][field] === value
            }
        }
    }

    getATAAuditHistoryById(rowData) {
        this.customerService.getCustomerContactATAAuditDetails(rowData.customerContactATAMappingId).subscribe(res => {
            this.auditHistoryATA = res;
        })
    }

    getColorCodeForHistoryATA(i, field, value) {
        const data = this.auditHistoryATA;
        const dataLength = data.length;
        if (i >= 0 && i <= dataLength) {
            if ((i + 1) === dataLength) {
                return true;
            } else {
                return data[i + 1][field] === value
            }
        }
    }

    private saveFailedHelper(error: any) {
        this.isSpinnerVisible = false;	
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
    }
    dismissDocumentPopupModel(type) {
        this.closeMyModel(type);
        }
  
    closeMyModel(type) {
        $(type).modal("hide");
    }
    closeATAModel()
    {
        this.activeModal.close();
    }
    getDeleteListByStatus(value){
		if(value){
			this.currentDeletedstatus=true;
		}else{
			this.currentDeletedstatus=false;
		}
		this.getMappedTaxTypeRateDetails(this.customerId);
  }
}