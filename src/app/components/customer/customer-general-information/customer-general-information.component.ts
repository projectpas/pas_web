import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { fadeInOut } from '../../../services/animations';
import { AuthService } from '../../../services/auth.service';
import { MessageSeverity, AlertService } from '../../../services/alert.service';
import { CustomerService } from '../../../services/customer.service';
import { CustomerClassificationService } from '../../../services/CustomerClassification.service';
import { IntegrationService } from '../../../services/integration-service';
import { AtaMainService } from '../../../services/atamain.service';
import { VendorService } from '../../../services/vendor.service';
import { Currency } from '../../../models/currency.model';
import { CurrencyService } from '../../../services/currency.service';
import { CustomerGeneralInformation } from '../../../models/customer-general.model';
import { getValueFromObjectByKey, getObjectByValue, validateRecordExistsOrNot, editValueAssignByCondition, getObjectById, selectedValueValidate } from '../../../generic/autocomplete';
import { ItemMasterService } from '../../../services/itemMaster.service';
import { CommonService } from '../../../services/common.service';
import { emailPattern, urlPattern, phonePattern } from '../../../validations/validation-pattern';
import { Router, ActivatedRoute } from '@angular/router';
declare var $ : any;

@Component({
    selector: 'app-customer-general-information',
    templateUrl: './customer-general-information.component.html',
    styleUrls: ['./customer-general-information.component.scss'],
    animations: [fadeInOut]
})

export class CustomerGeneralInformationComponent implements OnInit {
    allowNextView: boolean = false;
    @Input() countryListOriginal;
    @Input() editCustomerId;
    @Input() editMode;
    // @Input() customerListOriginal;
    // @Input() customerallListOriginal;
    @Output() tab = new EventEmitter<any>();
    @Output() saveGeneralInformationData = new EventEmitter<any>();
    @Output() editGeneralInformation = new EventEmitter<any>();


    customerListOriginal: any;;
    customerallListOriginal: any;;
    isSpinnerVisible: Boolean = false;
    generalInformation = new CustomerGeneralInformation();
    originalGenralInformation = new CustomerGeneralInformation();
    nextOrPreviousTab: any = "Next";
    generalInformation1 = new CustomerGeneralInformation();
    emailPattern = emailPattern();
    urlPattern = urlPattern();
    phonePattern = phonePattern();
    customertypes: any[];
    disableSaveMemo: boolean = true;
    customerNames: { customerId: any; name: any; }[];
    disableSaveForEdit: boolean = true;
    countrycollection: any[];
    allcustomerclassificationInfo;
    integrationOriginalList = [
    ];
    allCurrencyInfo: Currency[];
    memoPopupContent: any;
    memoPopupValue: any;
    isCustomerNameAlreadyExists: boolean = false;
    isCustomerCodeAlreadyExists: boolean = false;
    classificationNew = {
        description: '',
        isActive: true
    }
    addNewclassification = { ...this.classificationNew }
    classificationList: any;
    isClassificationAlreadyExists: boolean = false;
    intergrationNew = {
        isActive: true,
        description: '',
        memo: '',
        portalURL: '',
    }
    addNewIntergation = { ...this.intergrationNew }
    isIntegrationAlreadyExists: boolean = false;
    integrationList: any[];
    selectedIntegrations = []
    isEdit: any = false;
    id: number;
    editData: any;
    partListForPMA: any;
    partListForDER: any;
    partListOriginal: any;
    selectedActionName: any;
    disableSaveCustomerName: boolean;
    disableSaveParentName: boolean = false;
    countryExists: boolean;
    countryExistsNow: boolean;
    customerPhoneLengthValid: boolean = false;
    disableRestrictedDER: boolean = false;
    disableRestrictedPMA: boolean = false;
    currantDeletedStatusDER: boolean = false;
    currantDeletedStatusPMA: boolean = false;
    restictDERtempList: any = [];
    restictPMAtempList: any = [];
    restrictedDERParts: any = [];
    restrictedPMAParts: any = [];
    restrictHeaders = [
        { field: 'partNumber', header: 'PN' },
        { field: 'partDescription', header: 'Description' },
        { field: 'manufacturerName', header: 'Manufacturer' },

    ];
    selectedClassificationRecordForEdit: any;
    tempClassifciatonIds: any = [];
    tempIntegrationIds: any = [];
    changeName: boolean = false;
    ataListDataValues: any;
    selectedRowForDeleteRestrictPMA: any = {};
    selectedRowForRestoreRestrictPMA: any = {};
    selectedRowForRestoreRestrictDER: any = {};
    selectedRowForDeleteRestrictDER: any = {};
    disableAccountType: boolean = false;
    modal: NgbModalRef;
    selectedParentId: any;
    selectedCustomer: any;
    parentCustomer = [];
    parentCustomerOriginal = []
    stopmulticlicks: boolean;
    arrayCustlist: any[] = [];
    arrayCountrylist: any[] = [];
    arrayCustomerTypelist: any[] = [];
    arrayItemMasterlist: any[] = [];
    arayCustParentlist: any[] = [];
    arrayIntegrationlist: any[] = [];
    arrayCustomerClassificationlist: any[] = [];
    editCountryId: number;
    itemMasterIdPMA: number;
    itemMasterIdDER: number;
    disableAddPMA: boolean = false;
    disableAddDER: boolean = false;
    @ViewChild("generalInfoForm", { static: false }) formdata;
    @ViewChild("tabRedirectConfirmationModal", { static: false }) public tabRedirectConfirmationModal: ElementRef;
    customerCode: any;
    customerName: any;
    selectedDERItem: any;
    integrationCollection: any;
    integrationName: any;
    sourceAction: any;
    allAircraftinfo: any;

    constructor(public integrationService: IntegrationService, private modalService: NgbModal, public customerClassificationService: CustomerClassificationService, public ataservice: AtaMainService, private authService: AuthService, private alertService: AlertService,
        public customerService: CustomerService, public itemService: ItemMasterService, public vendorser: VendorService, private currencyService: CurrencyService, private commonService: CommonService, private router: Router) {
        this.stopmulticlicks = false;
    }

    ngOnInit() {
        this.isSpinnerVisible = true;
        this.id = this.editCustomerId;
        this.isEdit = this.editMode;

        this.getAllPartListSmartDropDown();
        this.getAllIntegrations();

        if (this.isEdit) {
            this.disableSaveForEdit = true;
            this.isSpinnerVisible = true;
            this.customerService.getCustomerdataById(this.id).subscribe(response => {
                this.allowNextView = true;
                const res = response[0];
                this.editGeneralInformation.emit(res);
                this.editData = res;
                this.selectedCustomer = res.name;
                this.selectedParentId = res.parentId;

                this.customerCode = res.customerCode;
                this.customerName = res.name;

                if (res.customerTypeId > 0)
                    this.arrayCustomerTypelist.push(res.customerTypeId);

                this.getAllCustomerTypes();

                if (res.countryId > 0) {
                    this.arrayCountrylist.push(res.countryId);
                    this.editCountryId = res.countryId;
                    this.getAllCountries(res.countryName);
                }

                if (res.parentId > 0)
                    this.arayCustParentlist.push(res.parentId);

                this.loadcustomerData();
                this.loadcustomerParentsData();

                this.generalInformation = {
                    ...this.editData,
                    name: getObjectByValue('name', res.name, this.customerallListOriginal),
                    countryId: getObjectById('countries_id', res.countryId, this.countryListOriginal),
                    customerAffiliationId: String(res.customerAffiliationId)
                };
                this.originalGenralInformation = JSON.parse(JSON.stringify(this.generalInformation));
                this.generalInformation1 = {
                    ...this.editData,
                    countryId: getObjectById('countries_id', res.countryId, this.countryListOriginal),
                };
                if (this.generalInformation.customerAffiliationId == 1 || this.generalInformation.customerAffiliationId == 3) {
                    this.disableAccountType = true;
                }
                this.isSpinnerVisible = false;
            }, error => this.saveFailedHelper(error));

            setTimeout(async () => {
                await this.getCustomerRestrictedPMAByCustomerId();
                this.originalGenralInformation = JSON.parse(JSON.stringify(this.generalInformation));
            }, 1000);
            setTimeout(async () => {
                await this.getCustomerRestrictedDERByCustomerId();
                this.originalGenralInformation = JSON.parse(JSON.stringify(this.generalInformation));
            }, 1000);
            setTimeout(async () => {
                await this.getCustomerClassificationByCustomerId();
                this.originalGenralInformation = JSON.parse(JSON.stringify(this.generalInformation));
            }, 1000);
            setTimeout(async () => {
                await this.getCustomerIntegrationTypesByCustomerId();
                this.originalGenralInformation = JSON.parse(JSON.stringify(this.generalInformation));
            }, 1000);
        } else {
            this.loadcustomerParentsData();
            //this.getAllIntegrations();
            this.getAllCustomerTypes();
            this.getAllCustomerClassification();

            this.generalInformation = {
                ...this.generalInformation,
                customerAffiliationId: String(this.generalInformation.customerAffiliationId),
                customerCode: this.generalInformation.customerCode == null || this.generalInformation.customerCode == '' || this.generalInformation.customerCode == undefined ? 'Creating' : this.generalInformation.customerCode,
            }
            this.parentCustomerOriginal = this.customerListOriginal;
            this.isSpinnerVisible = false;
        }
    }


    ngOnChanges(changes: SimpleChanges) {
        for (let property in changes) {
            if (property == 'selectedCustomerTab') {
                if (changes[property].currentValue != {} && changes.selectedCustomerTab.currentValue == "General") {
                }
            }
        }
    }

    async getCustomerClassificationByCustomerId() {
        await this.customerService.getCustomerClassificationMapping(this.id).subscribe(res => {
            this.generalInformation.customerClassificationIds = res.map(x => x.customerClassificationId);
            this.arrayCustomerClassificationlist.push(this.generalInformation.customerClassificationIds);
            this.getAllCustomerClassification();
        }, error => this.saveFailedHelper(error));
    }

    async getCustomerIntegrationTypesByCustomerId() {
        if (this.id > 0) {
            await this.commonService.getIntegrationMapping(this.id, 1).subscribe(res => {
                this.generalInformation.integrationPortalId = res.map(x => x.integrationPortalId);
                this.arrayIntegrationlist.push(this.generalInformation.integrationPortalId);
                this.getAllIntegrations();
            }, error => this.saveFailedHelper(error));
        }
    }

    async getCustomerRestrictedPMAByCustomerId() {
        this.isSpinnerVisible = true;
        await this.commonService.getRestrictedPartsWithDesc(1, this.id, 'PMA', this.currantDeletedStatusPMA).subscribe(res => {
            this.generalInformation.restrictedPMAParts = res;
            if (res) {
                if (this.generalInformation.restrictedPMAParts.length > 0) {
                    this.disableRestrictedPMA = true;
                }

                for (let i = 0; i < this.generalInformation.restrictedPMAParts.length; i++) {
                    this.generalInformation.restrictedPMAParts[i]['itemMasterId'] = this.generalInformation.restrictedPMAParts[i]['masterPartId']
                }
                this.isSpinnerVisible = false;
            }
            else {
                this.isSpinnerVisible = false;
            }
        }, error => this.saveFailedHelper(error))
    }

    getPMAPartListByStatus(value) {
        if (value) {
            this.currantDeletedStatusPMA = true;
        } else {
            this.currantDeletedStatusPMA = false;
        }
        this.getCustomerRestrictedPMAByCustomerId();
    }

    getDERPartListByStatus(value) {
        if (value) {
            this.currantDeletedStatusDER = true;
        } else {
            this.currantDeletedStatusDER = false;
        }
        this.getCustomerRestrictedDERByCustomerId();
    }

    async getCustomerRestrictedDERByCustomerId() {
        this.isSpinnerVisible = true;
        await this.commonService.getRestrictedPartsWithDesc(1, this.id, 'DER', this.currantDeletedStatusDER).subscribe(res => {
            if (res) {
                this.generalInformation.restrictedDERParts = res;
                if (this.generalInformation.restrictedDERParts.length > 0) {
                    this.disableRestrictedDER = true;
                }
                for (let i = 0; i < this.generalInformation.restrictedDERParts.length; i++) {
                    this.generalInformation.restrictedDERParts[i]['itemMasterId'] = this.generalInformation.restrictedDERParts[i]['masterPartId']
                }
                this.restictDERtempList = res.map(x => x.rescrictedPartId);
                this.isSpinnerVisible = false;
            }
            else {
                this.isSpinnerVisible = false;
            }
        }, error => this.saveFailedHelper(error))
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    get currentUserMasterCompanyId(): number {
        return this.authService.currentUser
            ? this.authService.currentUser.masterCompanyId
            : null;
    }

    getAllPartListSmartDropDown(strText = '') {
        if (this.arrayItemMasterlist.length == 0) {
            this.arrayItemMasterlist.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('ItemMaster', 'ItemMasterId', 'PartNumber', strText, true, 20, this.arrayItemMasterlist.join()).subscribe(response => {
            this.partListOriginal = response.map(x => {
                return {
                    partNumber: x.label, itemMasterId: x.value
                }
            })

            if (this.generalInformation.restrictedPMAParts != undefined && this.generalInformation.restrictedPMAParts.length > 0) {
                this.partListForPMA = this.generalInformation.restrictedPMAParts.reduce((acc, obj) => {
                    return acc.filter(x => x.itemMasterId !== obj.itemMasterId)
                }, this.partListOriginal)
            }
            else {
                this.partListForPMA = [...this.partListOriginal];
            }

            if (this.generalInformation.restrictedDERParts != undefined && this.generalInformation.restrictedDERParts.length > 0) {
                this.partListForDER = this.generalInformation.restrictedDERParts.reduce((acc, obj) => {
                    return acc.filter(x => x.itemMasterId !== obj.itemMasterId)
                }, this.partListOriginal)
            }
            else {
                this.partListForDER = [...this.partListOriginal];
            }

        }, err => {
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        });
    }

    filterpartListForPMA(event) {
        if (event.query !== undefined && event.query !== null) {
            this.getAllPartListSmartDropDown(event.query);
        }
    }


    filterpartListForDER(event) {
        if (event.query !== undefined && event.query !== null) {
            this.getAllPartListSmartDropDown(event.query);
        }
    }

    selectedDERParts(event) {
        if (event.itemMasterId !== undefined && event.itemMasterId !== null) {
            this.itemMasterIdDER = event.itemMasterId;
            this.disableAddDER = true;
        }
    }

    selectedPMAParts(event) {
        if (event.itemMasterId !== undefined && event.itemMasterId !== null) {
            this.itemMasterIdPMA = event.itemMasterId;
            this.disableAddPMA = true;
        }
    }

    async getAllIntegrations() {
        if (this.arrayIntegrationlist.length == 0) {
            this.arrayIntegrationlist.push(0);
        }
        await this.commonService.autoSuggestionSmartDropDownList('IntegrationPortal', 'IntegrationPortalId', 'Description', '', true, 100, this.arrayIntegrationlist.join()).subscribe(res => {
            this.integrationOriginalList = res.map(x => {
                return {
                    label: x.label, value: x.value
                }
            })
        }, error => this.saveFailedHelper(error));
    }

    async getAllCustomerTypes() {
        if (this.arrayCustomerTypelist.length == 0) {
            this.arrayCustomerTypelist.push(0);
        }
        await this.commonService.autoSuggestionSmartDropDownList('CustomerType', 'CustomerTypeId', 'Description', '', true, 50, this.arrayCustomerTypelist.join()).subscribe(res => {
            this.customertypes = res.map(x => {
                return {
                    description: x.label, customerTypeId: x.value
                }
            })
        }, error => this.saveFailedHelper(error));
    }

    getAllCountries(strText = '') {
        if (this.arrayCountrylist.length == 0) {
            this.arrayCountrylist.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('Countries', 'countries_id', 'nice_name', strText, true, 20, this.arrayCountrylist.join()).subscribe(res => {
            this.countryListOriginal = res.map(x => {
                return {
                    nice_name: x.label, countries_id: x.value
                }
            })
            this.countrycollection = this.countryListOriginal;
            this.countrycollection = [...this.countryListOriginal.filter(x => {
                return x.nice_name.toLowerCase().includes(strText.toLowerCase())
            })]
            if (this.editCountryId > 0) {
                this.generalInformation = {
                    ...this.generalInformation,
                    countryId: getObjectById('countries_id', this.editCountryId, this.countryListOriginal)
                };
                this.editCountryId = 0;
            }
        })
    }

    addclassification() {
        this.isClassificationAlreadyExists = false;
        this.addNewclassification.description = '';
    }

    async loadcustomerData(strText = '') {
        if (this.id > 0)
            this.arrayCustlist.push(this.id);
        if (this.arrayCustlist.length == 0) {
            this.arrayCustlist.push(0);
        }

        await this.commonService.autoSuggestionSmartDropDownList('Customer', 'CustomerId', 'Name', strText, true, 20, this.arrayCustlist.join()).subscribe(response => {

            this.customerListOriginal = response.map(x => {
                return {
                    name: x.label, value: x.value //, customerId: x.value
                }
            })
            this.customerallListOriginal = response.map(x => {
                return {
                    name: x.label, value: x.value //, customerId: x.value
                }
            })
            this.customerNames = response;
            this.customerNames = this.customerallListOriginal.reduce((acc, obj) => {
                return acc.filter(x => x.value !== this.selectedParentId)
            }, this.customerallListOriginal)

            if (this.id > 0) {
                this.generalInformation = {
                    ...this.generalInformation,
                    name: getObjectById('value', this.id, this.customerallListOriginal),
                };
            }
        }, err => {
            const errorLog = err;
            this.errorMessageHandler(errorLog);
            this.isSpinnerVisible = false;
        });
    }

    async loadcustomerEditData(strText = '') {
        if (this.id > 0)
            this.arrayCustlist.push(this.id);
        if (this.arrayCustlist.length == 0) {
            this.arrayCustlist.push(0);
        }

        await this.commonService.autoSuggestionSmartDropDownList('Customer', 'CustomerId', 'Name', strText, true, 20, this.arrayCustlist.join()).subscribe(response => {

            this.customerListOriginal = response.map(x => {
                return {
                    name: x.label, value: x.value //, customerId: x.value
                }
            })
            this.customerallListOriginal = response.map(x => {
                return {
                    name: x.label, value: x.value //, customerId: x.value
                }
            })
            this.customerNames = response;
            this.customerNames = this.customerallListOriginal.reduce((acc, obj) => {
                return acc.filter(x => x.value !== this.selectedParentId)
            }, this.customerallListOriginal)
        }, err => {
            const errorLog = err;
            this.errorMessageHandler(errorLog);
            this.isSpinnerVisible = false;
        });
    }

    async loadcustomerParentsData(strText = '') {
        if (this.arayCustParentlist.length == 0) {
            this.arayCustParentlist.push(0);
        }
        await this.commonService.autoSuggestionSmartDropDownList('Customer', 'CustomerId', 'Name', strText, true, 20, this.arayCustParentlist.join()).subscribe(response => {

            this.parentCustomerOriginal = response.map(x => {
                return {
                    name: x.label, value: x.value //, customerId: x.value
                }
            })

            this.parentCustomer = this.parentCustomerOriginal.reduce((acc, obj) => {
                return acc.filter(x => x.name !== this.selectedCustomer)
            }, this.parentCustomerOriginal)

            this.generalInformation = {
                ...this.generalInformation,
                parentId: getObjectById('value', this.generalInformation.parentId, this.parentCustomerOriginal),
            };
        }, err => {
            const errorLog = err;
            this.errorMessageHandler(errorLog);
            this.isSpinnerVisible = false;
        });
    }

    async getAllCustomerClassification() {
        if (this.arrayCustomerClassificationlist.length == 0) {
            this.arrayCustomerClassificationlist.push(0);
        }
        await this.commonService.autoSuggestionSmartDropDownList('CustomerClassification', 'CustomerClassificationId', 'Description', '', true, 200, this.arrayCustomerClassificationlist.join()).subscribe(response => {
            this.allcustomerclassificationInfo = response;
        }, error => this.saveFailedHelper(error));
    }

    selectedPartForPMA(event) {

    }

    restrictPMAClick(event: any) {
        if (!this.generalInformation.restrictPMA) {
            this.generalInformation.restrictedPMAParts = [];
        }
    }

    restrictDERClick(event: any) {

        if (!this.generalInformation.restrictDER) {
            this.generalInformation.restrictedDERParts = [];
        }
    }

    restrictPBHClick(event: any) {
        if (!this.generalInformation.isPBHCustomer) {
            this.generalInformation.pbhCustomerMemo = "";
        }
    }

    addRestrictPMA() {
        if (this.generalInformation.restrictedPMAParts == undefined) {
            this.generalInformation.restrictedPMAParts = []
        }

        if (this.itemMasterIdPMA > 0) {
            this.isSpinnerVisible = true;
            this.itemService.getItemMasterByItemMasterId(this.itemMasterIdPMA).subscribe(res => {
                if (res) {
                    this.restictPMAtempList = res[0];
                    if (this.restictPMAtempList.length > 0) {
                        this.disableRestrictedPMA = true;
                        for (let i = 0; i < this.restictPMAtempList.length; i++) {
                            if (this.restictPMAtempList[i] != undefined) {
                                this.generalInformation.restrictedPMAParts = [...this.generalInformation.restrictedPMAParts, this.restictPMAtempList[i]];
                            }
                        }
                        this.generalInformation.restrictedPMAParts = this.generalInformation.restrictedPMAParts.slice();
                        this.partListForPMA = this.generalInformation.restrictedPMAParts.reduce((acc, obj) => {
                            return acc.filter(x => x.itemMasterId !== obj.itemMasterId)
                        }, this.partListOriginal)

                        this.restictPMAtempList = [];
                    }
                    this.itemMasterIdPMA = 0;
                    this.disableAddPMA = false;
                    this.isSpinnerVisible = false;
                }
                else {
                    this.itemMasterIdPMA = 0;
                    this.disableAddPMA = false;
                    this.isSpinnerVisible = false;
                }

            }, error => this.saveFailedHelper(error))
        }
    }

    deleteRestirctPMA() {
        if (this.selectedRowForDeleteRestrictPMA.restrictedPartId > 0) {
            this.isSpinnerVisible = true;
            this.customerService.deleteRestrictedPartsById(this.selectedRowForDeleteRestrictPMA.restrictedPartId, this.userName).subscribe(res => {
                this.alertService.showMessage(
                    'Success',
                    `Sucessfully Deleted Restricted Part`,
                    MessageSeverity.success
                );
                this.isSpinnerVisible = false;
            }, error => this.saveFailedHelper(error))
        }

        this.partListForPMA = [{ label: this.selectedRowForDeleteRestrictPMA.partNumber, value: this.selectedRowForDeleteRestrictPMA }, ...this.partListForPMA];

        this.generalInformation.restrictedPMAParts.splice(this.selectedRowForDeleteRestrictPMA.index, 1);
        this.dismissModel()

        if (this.generalInformation.restrictedPMAParts.length == 0) {
            this.disableRestrictedPMA = false;
        }
    }

    openPopupForRestoreRestrictPMA(i, rowData, content) {
        this.selectedRowForRestoreRestrictPMA = rowData;
        this.selectedRowForRestoreRestrictPMA['index'] = i;

        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    openPopupForRestoreRestrictDER(i, rowData, content) {
        this.selectedRowForRestoreRestrictDER = rowData;
        this.selectedRowForRestoreRestrictDER['index'] = i;

        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    openPopupForDeleteRestrictPMA(i, rowData, content) {
        this.selectedRowForDeleteRestrictPMA = rowData;
        this.selectedRowForDeleteRestrictPMA['index'] = i;

        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    openPopupForDeleteRestrictDER(i, rowData, content) {
        this.selectedRowForDeleteRestrictDER = rowData;
        this.selectedRowForDeleteRestrictDER['index'] = i;

        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });

    }

    patternMobilevalidationWithSpl(event: any) {
        const pattern = /[0-9\+\-()\ ]/;

        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) {
            event.preventDefault();
        }
    }

    patternCustomerNamevalidation(event: any) {
        const pattern = /[a-zA-Z ]/;

        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) {
            event.preventDefault();
        }
    }

    checkaddress() {

        this.generalInformation.isAddressForBilling = true;
        this.generalInformation.isAddressForShipping = true;
    }

    addRestrictDER() {
        if (this.generalInformation.restrictedDERParts == undefined) {
            this.generalInformation.restrictedDERParts = []
        }

        if (this.itemMasterIdDER > 0) {
            this.isSpinnerVisible = true;
            this.itemService.getItemMasterByItemMasterId(this.itemMasterIdDER).subscribe(res => {
                if (res) {
                    this.restictDERtempList = res[0];
                    if (this.restictDERtempList.length > 0) {
                        this.disableRestrictedDER = true;
                        for (let i = 0; i < this.restictDERtempList.length; i++) {
                            if (this.restictDERtempList[i] != undefined) {
                                this.generalInformation.restrictedDERParts = [...this.generalInformation.restrictedDERParts, this.restictDERtempList[i]];
                            }
                        }
                        this.generalInformation.restrictedDERParts = this.generalInformation.restrictedDERParts.slice();
                        this.partListForDER = this.generalInformation.restrictedDERParts.reduce((acc, obj) => {
                            return acc.filter(x => x.itemMasterId !== obj.itemMasterId)
                        }, this.partListOriginal)

                        this.restictDERtempList = [];
                    }
                    this.itemMasterIdDER = 0;
                    this.disableAddDER = false;
                    this.isSpinnerVisible = false;
                }
                else {
                    this.itemMasterIdDER = 0;
                    this.disableAddDER = false;
                    this.isSpinnerVisible = false;
                }
            }, error => this.saveFailedHelper(error))
        }
    }

    restoreRestirctPMA() {
        if (this.selectedRowForRestoreRestrictPMA.restrictedPartId > 0) {
            this.isSpinnerVisible = true;
            this.customerService.restoreRestrictedPartsById(this.selectedRowForRestoreRestrictPMA.restrictedPartId, this.userName).subscribe(res => {
                this.alertService.showMessage(
                    'Success',
                    `Sucessfully Restored Restricted Part`,
                    MessageSeverity.success
                );
                this.getCustomerRestrictedPMAByCustomerId();
                this.isSpinnerVisible = false;
            }, error => this.saveFailedHelper(error))
        }
        this.dismissModel()
    }

    restoreRestirctDER() {
        if (this.selectedRowForRestoreRestrictDER.restrictedPartId > 0) {
            this.isSpinnerVisible = true;
            this.customerService.restoreRestrictedPartsById(this.selectedRowForRestoreRestrictDER.restrictedPartId, this.userName).subscribe(res => {
                this.alertService.showMessage(
                    'Success',
                    `Sucessfully Restored Restricted Part`,
                    MessageSeverity.success
                );
                this.getCustomerRestrictedDERByCustomerId();
                this.isSpinnerVisible = false;
            }, error => this.saveFailedHelper(error))
        }
        this.dismissModel()
    }

    deleteRestirctDER() {
        if (this.selectedRowForDeleteRestrictDER.restrictedPartId > 0) {
            this.isSpinnerVisible = true;
            this.customerService.deleteRestrictedPartsById(this.selectedRowForDeleteRestrictDER.restrictedPartId, this.userName).subscribe(res => {
                this.alertService.showMessage(
                    'Success',
                    `Sucessfully Deleted Restricted Part`,
                    MessageSeverity.success
                );
                this.isSpinnerVisible = false;
            }, error => this.saveFailedHelper(error))
        }
        this.dismissModel()
        this.partListForDER = [{ label: this.selectedRowForDeleteRestrictDER.partNumber, value: this.selectedRowForDeleteRestrictDER }, ...this.partListForDER];
        this.generalInformation.restrictedDERParts.splice(this.selectedRowForDeleteRestrictDER.index, 1);


        if (this.generalInformation.restrictedDERParts.length == 0) {
            this.disableRestrictedDER = false;
        }
    }

    filterclassifications(event) {
        this.classificationList = this.allcustomerclassificationInfo;
        this.classificationList = [...this.allcustomerclassificationInfo.filter(x => {
            return x.label.toLowerCase().includes(event.query.toLowerCase());
        })
        ];
    }

    filterCustomerNames(event) {
        if (event.query !== undefined && event.query !== null) {
            this.loadcustomerEditData(event.query);
        }
    }

    filterCustomerParentNames(event) {
        if (event.query !== undefined && event.query !== null) {
            this.loadcustomerParentsData(event.query);
        }
    }

    filterCountries(event) {
        if (event.query !== undefined && event.query !== null) {
            this.getAllCountries(event.query);
        }
    }
    onClickPBHCustomer(value) {
        if (value == 'PBHCustomer') {
            this.memoPopupContent = this.generalInformation.pbhCustomerMemo;
            this.disableSaveMemo = true;
        }
        this.memoPopupValue = value;

    }
    enableSaveMemo() {
        this.disableSaveMemo = false;
    }
    onClickPopupSave() {
        if (this.memoPopupValue == 'PBHCustomer') {
            this.generalInformation.pbhCustomerMemo = this.memoPopupContent;
        }
        this.memoPopupContent = '';
    }
    selectedCustomerName() {
        const name = editValueAssignByCondition('name', this.generalInformation.name);
        if (name == this.selectedCustomer)
            this.isCustomerNameAlreadyExists = false;
        else
            this.isCustomerNameAlreadyExists = true;
    }
    selectedCustomerCode() {
        this.isCustomerCodeAlreadyExists = true;
    }

    checkCustomerNameExist(value) {
        this.changeName = true;
        this.isCustomerNameAlreadyExists = false;
        this.disableSaveCustomerName = false;
        if (value != this.selectedCustomer) {
            if (this.customerallListOriginal != undefined && this.customerallListOriginal != null) {
                for (let i = 0; i < this.customerallListOriginal.length; i++) {
                    if (this.generalInformation.name == this.customerallListOriginal[i].name || value == this.customerallListOriginal[i].name) {
                        this.isCustomerNameAlreadyExists = true;
                        this.disableSaveCustomerName = true;
                        return;
                    }
                }
            }
        }
    }

    selectedParentName(event) {
        if (this.changeName == false) {
            if (event.name === this.generalInformation1.name) {
                this.disableSaveParentName = true;
            }
            else {
                this.disableSaveParentName = false;
            }
        }
        else {
            if (event.name === this.generalInformation.name) {
                this.disableSaveParentName = true;
            }
            else {
                this.disableSaveParentName = false;
            }
        }
    }

    checkWithName(event) {
        if (this.changeName == false) {
            if (event === this.generalInformation1.name) {
                this.disableSaveParentName = true;
            }
            else {
                this.disableSaveParentName = false;
            }
        }
        else {
            if (event === this.generalInformation.name) {
                this.disableSaveParentName = true;
            }
            else {
                this.disableSaveParentName = false;
            }
        }
    }

    checkCountryNow(value) {
        if (value.length > 0)
            this.countryExistsNow = false
        else
            this.countryExistsNow = true
    }

    checkcustomerPhoneLength(value) {
        if (value.length >= 6)
            this.customerPhoneLengthValid = false
        else
            this.customerPhoneLengthValid = true
    }

    checkCountry(value) {
        if (value.length < 1) {
            this.countryExists = false
        }
        if (value.length > 0) {
            this.countryExists = true
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

    saveConformation() {
        if (this.generalInformation.isCustomerAlsoVendor && this.isEdit) {
            this.saveGeneralInformation();
        } else if (this.generalInformation.isCustomerAlsoVendor == false) {
            this.saveGeneralInformation();
        } else if (this.generalInformation.isCustomerAlsoVendor && this.isEdit == false) {
            $('#isAlsoaVendor').modal('show');
        }
        this.allowNextView = true;
    }

    isCustomerAlsoaVendor(value) {
        if (value === 'Yes') {
            this.generalInformation.isCustomerAlsoVendor = true;
        } else {
            this.generalInformation.isCustomerAlsoVendor = false;

        }
        this.saveGeneralInformation();
    }

    saveGeneralInformation() {
        if (this.generalInformation.customerAffiliationId == "3" || this.generalInformation.customerAffiliationId == "1") {
            if (this.generalInformation.integrationPortalId == undefined || this.generalInformation.integrationPortalId.length <= 0) {
                this.alertService.showMessage(
                    'Validation Error',
                    `Integration with Selection is Required. When Customer Type is Internal Or Affliliate.`,
                    MessageSeverity.error)
                return;
            }
        }

        this.isSpinnerVisible = true;
        this.stopmulticlicks = true;

        if (!this.isEdit) {
            this.customerService.newAction({
                ...this.generalInformation,
                countryId: getValueFromObjectByKey('countries_id', this.generalInformation.countryId),
                restrictedDERParts: (typeof this.generalInformation.restrictedDERParts === 'undefined') ? null : this.generalInformation.restrictedDERParts.map(x => { return { ...x, partType: 'DER' } }),
                restrictedPMAParts: typeof this.generalInformation.restrictedPMAParts === 'undefined' ? null : this.generalInformation.restrictedPMAParts.map(x => { return { ...x, partType: 'PMA' } }),
                parentId: this.generalInformation.parentId != undefined ? this.generalInformation.parentId['value'] : null,
                createdBy: this.userName, updatedBy: this.userName, masterCompanyId: this.currentUserMasterCompanyId
            }).subscribe(res => {
                if (res) {
                    this.selectedCustomer = res.name;
                    this.selectedParentId = res.parentId
                    this.generalInformation = { ...this.generalInformation, customerCode: res.customerCode }
                    this.saveGeneralInformationData.emit(res);
                    this.id = res.customerId;
                    this.editCountryId = res.countryId;
                    this.editData = res;
                    this.isEdit = true;
                    this.isSpinnerVisible = false;
                    this.alertService.showMessage(
                        'Success',
                        `Saved Customer General Information Sucessfully `,
                        MessageSeverity.success
                    );
                    this.disableSaveForEdit = true;
                    this.formdata.reset();
                    this.router.navigateByUrl(`customersmodule/customerpages/app-customer-edit/${this.id}`);
                }
            }, error => { this.isSpinnerVisible = false; })
            //},error => this.saveFailedHelper(error))

        } else {

            this.customerService.updateAction({
                ...this.generalInformation,
                addressId: this.editData.addressId,
                customerId: this.id,

                restrictedDERParts: (typeof this.generalInformation.restrictedDERParts === 'undefined') ? null : this.generalInformation.restrictedDERParts.map(x => { return { ...x, partType: 'DER' } }),
                restrictedPMAParts: typeof this.generalInformation.restrictedPMAParts === 'undefined' ? null : this.generalInformation.restrictedPMAParts.map(x => { return { ...x, partType: 'PMA' } }),
                name: editValueAssignByCondition('name', this.generalInformation.name),
                countryId: getValueFromObjectByKey('countries_id', this.generalInformation.countryId),
                parentId: this.generalInformation.parentId != undefined ? this.generalInformation.parentId['value'] : null,
                createdBy: this.userName, updatedBy: this.userName, masterCompanyId: this.currentUserMasterCompanyId
            }).subscribe(res => {
                if (res) {
                    this.selectedCustomer = res.name;
                    this.selectedParentId = res.parentId
                    this.editGeneralInformation.emit(res);
                    this.id = res.customerId;
                    this.editData = res;
                    this.editCountryId = res.countryId;
                    this.isEdit = true;
                    this.isSpinnerVisible = false;
                    this.alertService.showMessage(
                        'Success',
                        `Updated Customer General Information Sucessfully `,
                        MessageSeverity.success
                    );
                    this.disableSaveForEdit = true;
                }
            }, error => { this.isSpinnerVisible = false; })
            //},error => this.saveFailedHelper(error))
        }
        setTimeout(() => {
            this.stopmulticlicks = false;
        }, 500)
    }
    checkClassificationExists(field, value) {

        const exists = validateRecordExistsOrNot(field, value, this.allcustomerclassificationInfo, this.selectedClassificationRecordForEdit);
        if (exists.length > 0) {
            this.isClassificationAlreadyExists = true;
        }
        else {
            this.isClassificationAlreadyExists = false;
        }
    }

    selectedClassification(object) {
        const exists = selectedValueValidate('label', object, this.selectedClassificationRecordForEdit)
        this.isClassificationAlreadyExists = !exists;
    }

    addClassification() {
        const data = {
            ...this.addNewclassification,
            masterCompanyId: this.currentUserMasterCompanyId,
            createdBy: this.userName,
            updatedBy: this.userName,
        }
        this.isSpinnerVisible = true;
        this.customerClassificationService.newAddcustomerclass(data).subscribe(res => {
            this.getAllCustomerClassification();
            this.resetClassificationPopUp();
            this.alertService.showMessage(
                'Success',
                `Added New Classification  Sucessfully `,
                MessageSeverity.success
            );
            this.isSpinnerVisible = false;
        }, error => this.saveFailedHelper(error))
    }

    resetClassificationPopUp() {
        this.addNewclassification = { ...this.classificationNew }
    }
    filterIntegrations(event) {
        this.integrationList = this.integrationOriginalList;
        this.integrationList = [...this.integrationOriginalList.filter(x => {
            return x.label.toLowerCase().includes(event.query.toLowerCase())
        })]
    }
    checkIntergationExists(field, value) {

        const exists = validateRecordExistsOrNot(field, value, this.integrationOriginalList)
        if (exists.length > 0) {

            this.isIntegrationAlreadyExists = true;
        } else {
            this.isIntegrationAlreadyExists = false;
        }
    }
    selectedWebSite() {
        this.isIntegrationAlreadyExists = true;
    }
    newIntegrationAdd() {
        const data = {
            ...this.addNewIntergation,
            masterCompanyId: this.currentUserMasterCompanyId,
            createdBy: this.userName,
            updatedBy: this.userName
        }
        this.isSpinnerVisible = true;
        this.integrationService.newAction(data).subscribe(() => {
            this.getAllIntegrations()
            this.resetIntegrationPopUp()
            this.alertService.showMessage(
                'Success',
                `Added New Integration  Sucessfully `,
                MessageSeverity.success
            );
            this.isSpinnerVisible = false;
        }, error => this.saveFailedHelper(error))

    }
    resetIntegrationPopUp() {
        this.addNewIntergation = { ...this.intergrationNew }
    }

    // // Close Model Popup
    public dismissModel() {
        this.selectedRowForDeleteRestrictPMA = {};
        this.modal.close();
    }

    selectedCustomerType(event) {
        if (event == 1 || event == 3) {
            this.generalInformation.customerTypeId = 3;
            this.disableAccountType = true;
        }
        else {
            this.disableAccountType = false;
        }
    }

    onClearParent() {
        this.generalInformation.parentId = undefined;
    }

    nextClick(nextOrPrevious) {
        this.nextOrPreviousTab = nextOrPrevious;
        if (this.formdata.form.dirty) {
            let content = this.tabRedirectConfirmationModal;
            this.modal = this.modalService.open(content, { size: "sm" });
        }
        else {
            this.stopmulticlicks = true;
            this.tab.emit('Contacts');
            setTimeout(() => {
                this.stopmulticlicks = false;
            }, 500)
        }
    }

    redirectToTabWithoutSave() {
        this.dismissModel();
        this.stopmulticlicks = true;
        this.tab.emit('Contacts');

        setTimeout(() => {
            this.stopmulticlicks = false;
        }, 500)
    }

    redirectToTab() {
        this.dismissModel();
        this.stopmulticlicks = true;
        this.tab.emit('Contacts');
        if (!this.disableSaveForEdit) {
            this.saveGeneralInformation()
        }
        setTimeout(() => {
            this.stopmulticlicks = false;
        }, 500)
    }

    private saveFailedHelper(error: any) {
        this.isSpinnerVisible = false;
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
        setTimeout(() => this.alertService.stopLoadingMessage(), 5000);
    }

    enableSave() {
        this.disableSaveForEdit = false;
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

    editItemIntegrationalCloseModel() {}
    saveSelectedModel(col, i) {}
    getSelectedItem(col, $event) {}
    dismissAircraftModel() {}
}