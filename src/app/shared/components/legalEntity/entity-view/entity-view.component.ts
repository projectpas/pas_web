import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as $ from 'jquery';
import { AlertService } from '../../../../services/alert.service';
import { fadeInOut } from '../../../../services/animations';
import { CommonService } from '../../../../services/common.service';
import { ConfigurationService } from '../../../../services/configuration.service';
import { CustomerService } from '../../../../services/customer.service';
import { DBkeys } from '../../../../services/db-Keys';
import { EmployeeService } from '../../../../services/employee.service';
import { LegalEntityService } from '../../../../services/legalentity.service';
import { LocalStoreManager } from '../../../../services/local-store-manager.service';

 


 



@Component({
    selector: 'app-entity-view',
    templateUrl: './entity-view.component.html',
    styleUrls: ['./entity-view.component.scss'],
     animations: [fadeInOut]
})
/** entityView component*/
export class EntityViewComponent implements OnInit  {
interShippingauditHisory:any;
shippingauditHisory:any;  
sourceViewforInterShipping: any;
sourceViewforInterShippingVia: any;
sourceViewforDomesticShippingVia: any;
sourceViewforShipping:any;
legalEntityName:any;
legalEntityCode:any;
saveFailedHelper:any;
legalEntityService:any;
id:number;
billingauditHisory:any;
viewData:any;
modal: NgbModalRef;
auditHistory:any;
sourceViewforContact:any;
    @Input() legalEntityId;
    viewDataGeneralInformation: any = {};
    viewDataclassification: any[];
    customerContactsColumns: any[];
    pageSize: number = 10;
    aircraftListDataValues: any = [];
    ataListDataValues: any = [];
    billingInfoList: any = [];
    waringInfoList: any = [];
    DocumentsList: any = [];
    domesticShippingData: any;
    internationalShippingData: any = [];
    // loader:boolean=true;
    ataloader: boolean = true;
    salesloader: boolean = true;
    warningsloader: boolean = true;
    lockboxing: any = {};
    filterKeysByValue: object = {};
    taxTypeRateMapping: any = [];
    restrictedPMAParts: any = [];
    restrictedDERParts: any = [];
    disableRestrictedPMA: boolean = false;
    classificationIds: any[];
    viewDataIntegration: any;
    allCustomerFinanceDocumentsList: any = [];
    countOfRestrictDerParts: any = 0;
    countOfRestrictPMAParts: any = 0;
    employeeListOriginal: any = [];
    globalSettings: any = {};
    sourceViewforDocumentList: any = [];
    sourceViewforDocumentListColumns = [
        { field: 'fileName', header: 'File Name' },
    ];
    global_lang: string;
    customerDocumentsColumns = [

        { field: 'docName', header: 'Name' },
        { field: 'docDescription', header: 'Description' },
        { field: 'documents', header: 'Documents' },
        { field: 'docMemo', header: 'Memo' }
    ];

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

    /** entityView ctor */
    constructor(private modalService: NgbModal,
       public workFlowtService: LegalEntityService,private alertService: AlertService,
          public customerService: CustomerService, private commonService: CommonService, private entityService: LegalEntityService,
        private activeModal: NgbActiveModal,
        private configurations: ConfigurationService,
        public employeeService: EmployeeService,
        private localStorage: LocalStoreManager) {
    }
    ngOnInit(): void {
        let legalEntityId = this.legalEntityId;
        this.entityService.getEntityDataById(legalEntityId).subscribe(res => {
       // this.customerService.getCustomerdataById(customerId).subscribe(res => {
            this.salesloader = false;
            this.viewDataGeneralInformation = res;
            this.editlegalEntityLogo(res.attachmentId, legalEntityId);
        }, err => {
            this.salesloader = false; 
        })
    }
    getGlobalSettings() {
        this.globalSettings = this.localStorage.getDataObject<any>(DBkeys.GLOBAL_SETTINGS) || {};
        this.global_lang = this.globalSettings.cultureName;
    }
    formatCreditLimit(val) {
        if (val) {
            if (isNaN(val) == true) {
                val = Number(val.replace(/[^0-9.-]+/g, ""));
            }
            this.viewDataGeneralInformation.creditLimit = new Intl.NumberFormat(this.global_lang, { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val)
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
    getEntityLockBoxDataById(legalEntityId) {
        this.entityService.getEntityLockboxDataById(legalEntityId).subscribe(res => {
            if (res != null) {
                this.lockboxing = {
                    ...this.lockboxing,
                    poBox: res.poBox,
                    bankStreetaddress1: res.address1,
                    bankStreetaddress2: res.address2,
                    bankCity: res.city,
                    bankProvince: res.stateOrProvince,
                    bankcountry: res.country,
                    bankpostalCode: res.postalCode
                };
            }
        })
        this.getEntityDomesticwireDataById(legalEntityId);
    }
    getEntityDomesticwireDataById(legalEntityId) {
        this.entityService.getEntityDomesticDataById(legalEntityId).subscribe(res => {
            if ( res != null) {
                this.lockboxing = {
                    ...this.lockboxing,
                    domesticBankName: res.bankName,
                    domesticIntermediateBank: res.intermediaryBankName,
                    domesticBenficiaryBankName: res.benificiaryBankName,
                    domesticBankAccountNumber: res.accountNumber,
                    domesticABANumber: res.aba
                }
            }

        })

        this.getInternationalwireDataById(legalEntityId);

    }

    getInternationalwireDataById(legalEntityId) {
        this.entityService.getEntityInternalDataById(legalEntityId).subscribe(res => {
            const response = res;
            if ( res != null) {
                this.lockboxing = {
                    ...this.lockboxing,
                    internationalBankName: res.bankName,
                    internationalIntermediateBank: res.intermediaryBank,
                    internationalBenficiaryBankName: res.beneficiaryBank,
                    internationalBankAccountNumber: res.beneficiaryBankAccount,
                    internationalSWIFTID: res.swiftCode
                }
            }
        })
        this.getEntityACHDataById(legalEntityId);
    }


    getEntityACHDataById(legalEntityId) {
        this.entityService.getEntityAchDataById(legalEntityId).subscribe(res => {
            const response = res;
            if ( res != null) {
                this.lockboxing = {
                    ...this.lockboxing,
                    achBankName: res.bankName,
                    achIntermediateBank: res.intermediateBankName,
                    achBenficiaryBankName: res.beneficiaryBankName,
                    achBankAccountNumber: res.accountNumber,
                    achABANumber: res.aba,
                    achSWIFTID: res.swiftCode,
                }
            }
        })
    }
    async getDomesticShippingByCustomerId(customerId) {
        await this.entityService.getlegalEntityShipAddressGet(customerId).subscribe(res => {
            this.domesticShippingData = res[0] || [];
        })
    }
   
    // async getCustomerDocumentsByCustomerId(customerId) {

    //     await this.entityService.getDocumentList(customerId).subscribe(res => {
    //         this.DocumentsList = res || [];
    //     })
    // }

    editlegalEntityLogo(attachmentId, legalEntityId) {
        this.entityService.toGetUploadDocumentsList(attachmentId, legalEntityId, 41).subscribe(res => {

            this.sourceViewforDocumentList = res;

        });
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

 
        viewSelectedRow(rowData) {
        this.sourceViewforContact = rowData;
        console.log("It is", rowData )

    }
    getAuditHistoryById(rowData) {
        this.workFlowtService.getCustomerContactAuditDetails1(rowData.legalEntityContactId, rowData.legalEntityId).subscribe(res => {
            this.auditHistory = res;
            console.log("this is test History contact", res);
        })
    
    }
   getAuditHistoryById1(rowData) {
      this.workFlowtService.getlegalEntityBillingHistory(rowData.legalEntityId, rowData.legalEntityBillingAddressId).subscribe(res => {
            this.auditHistory = res;
          
        })
    }

    getColorCodeForHistory(i, field, value) {
        const data = this.auditHistory;
        const dataLength = data.length;
        if (i >= 0 && i <= dataLength) {
            if ((i + 1) === dataLength) {
                return true;
            } else {
                return data[i + 1][field] === value
            }
        }
    }



    getColorCodeForHistory1(i, field, value) {
        const data = this.auditHistory;
        const dataLength = data.length;
        if (i >= 0 && i <= dataLength) {
            if ((i + 1) === dataLength) {
                return true;
            } else {
                return data[i + 1][field] === value
            }
        }
    }


    openBillingView(data) {
        console.log(data);
        this.viewData = data;
    }

 openShippinggView(rowData) {
        this.sourceViewforShipping = rowData;
    }

    //for shipping history
    openInterShippingView(rowData) {
        this.sourceViewforInterShipping = rowData;
    }
    openInterShippingViewVia(rowData) {
        this.sourceViewforInterShippingVia = rowData;
    }
    openDomesticShippingViewVia(rowData) {
        this.sourceViewforDomesticShippingVia = rowData;
    }

      openShipaddressHistoryDomestic(i, field, value) {
        const data = this.shippingauditHisory;
        const dataLength = data.length;
        if (i >= 0 && i <= dataLength) {
            if ((i + 1) === dataLength) {
                return true;
            } else {
                return data[i + 1][field] === value
            }
        }
    }

      getColorCodeForInterHistory(i, field, value) {
        const data = this.interShippingauditHisory;
        const dataLength = data.length;
        if (i >= 0 && i <= dataLength) {
            if ((i + 1) === dataLength) {
                return true;
            } else {
                return data[i + 1][field] === value
            }
        }
    }   
    
    deleteItemAndCloseModel() {}
}