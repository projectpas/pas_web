
import { Component, Input, EventEmitter, Output, ViewChild, ElementRef, OnInit, SimpleChanges } from '@angular/core';
import { CustomerService } from '../../../services/customer.service';
import { AuthService } from '../../../services/auth.service';
import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { CustomerShippingModel } from '../../../models/customer-shipping.model';
import { CustomerInternationalShippingModel, CustomerInternationalShipVia } from '../../../models/customer-internationalshipping.model';
import { getValueFromObjectByKey, getObjectById, formatNumberAsGlobalSettingsModule, editValueAssignByCondition, getObjectByValue } from '../../../generic/autocomplete';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;
import { ConfigurationService } from '../../../services/configuration.service';
import { CommonService } from '../../../services/common.service';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-customer-shipping-information',
    templateUrl: './customer-shipping-information.component.html',
    styleUrls: ['./customer-shipping-information.component.scss'],
    providers: [DatePipe]
})
/** anys component*/
export class CustomerShippingInformationComponent implements OnInit {

    // [x: string]: any;
    @ViewChild('tabRedirectConfirmationModal', { static: false })
    public tabRedirectConfirmationModal: ElementRef;
    nextOrPreviousTab: string;

    @Input() savedGeneralInformationData;
    @Input() collapsed;
    @Input() countryListOriginal;
    @Input() editGeneralInformationData;
    @Input() editMode;
    @Output() tab = new EventEmitter();
    @Input() selectedCustomerTab: string = "";
    @Input() customerDataFromExternalComponents: any;
    disableSave: boolean = true;
    disableSaveShipViaDomestic: boolean = true;
    disableSaveShipViaInternational: boolean = true;
    isSpinnerVisible: Boolean = false;
    domesticShippingInfo = new CustomerShippingModel()
    domesticShippingOriginalInfo = new CustomerShippingModel()
    internationalShippingInfo = new CustomerInternationalShippingModel()
    internationalShippingViaData: any = [];
    demosticShippingViaData: any = [];
    totalRecordsForInternationalShipVia: any;
    isEditInternationalShipVia: boolean = false;
    isEditDomesticShipVia: boolean = false;
    countrycollection: any[];
    customerShippingAddressId: number;
    selectedRowForDelete: any;
    selectedRowForDeleteInter: any;
    public sourceCustomer: any = {}
    internationalShippingId: number;
    customerInternationalShippingId: number;
    shippingauditHisory: any[];
    shippingViaauditHisory: any[];
    intershippingViaauditHisory: any[];
    interShippingauditHisory: any[];
    formData = new FormData();
    domesticShippingHeaders = [
        { field: 'tagName', header: 'Tag' },
        { field: 'attention', header: 'Attention' },
        { field: 'siteName', header: 'Site Name' },
        { field: 'address1', header: 'Address1' },
        { field: 'address2', header: 'Address2' },
        { field: 'city', header: 'City' },
        { field: 'stateOrProvince', header: 'State / Prov' },
        { field: 'postalCode', header: 'Postal Code' },
        { field: 'countryName', header: 'Country' },
        { field: 'isPrimary', header: 'IsPrimary' }
    ]
    internationalShippingHeaders = [
        { field: 'exportLicense', header: 'Export License' },
        { field: 'description', header: 'Description' },
        { field: 'startDate', header: 'Start Date' },
        { field: 'createdDate', header: 'Created Date' },
        { field: 'updatedDate', header: 'Updated Date' },
        { field: 'createdBy', header: 'Created By' },
        { field: 'updatedBy', header: 'Updated By' },
        { field: 'expirationDate', header: 'Expiration Date' },
        { field: 'amount', header: 'Amount', width: "80px" },
        { field: 'shipToCountry', header: 'Country' },
        { field: 'isPrimary', header: 'IsPrimary' }
    ]
    selectedColumnsForDomesticTable = this.domesticShippingHeaders;
    selectedColumnsForInternationTable = this.internationalShippingHeaders;
    domesticShippingData: any[] = [];
    sourceViewforShipping: any;
    isEditDomestic: boolean = false;
    isEditInternational: boolean = false;
    internationalShippingData: any[] = [];
    selectedrowsFromDomestic: any;
    selectedrowsFromInternational: any;
    customerDomensticShippingIdForShipVia: any;
    customerIntenationalShippingIdForShipVia: any;
    pageIndexForInternational: number = 0;
    pageIndexForInternationalShipVia: number = 0;
    pageSizeForInternationalShipVia: number = 10;
    totalRecordsForInternationalShipping: any;
    sourceViewforInterShipping: any;
    sourceViewforInterShippingVia: any;
    sourceViewforDomesticShippingVia: any;
    shipViaInternational = new CustomerInternationalShipVia();
    shipViaDomestic = new CustomerInternationalShipVia();
    editableRowIndexForIS: any;
    id: number;
    modal: NgbModalRef;
    totalRecords: any;
    pageIndex: number = 0;
    pageSize: number = 10;
    pageSizeForDomestic: number = 10;
    totalPages: number;
    totalRecordsInter: any;
    totalPagesInter: number;
    textDomesticMemo: any;
    textInternationalMemo: any;
    disableShipVia: boolean = false;
    disableEditor: any = true;
    totalRecordsShipVia: any;
    totalPagesShipVia: number;
    interTotalRecords: number = 0;
    interTotalPages: number = 0;
    selectedColumnsForInternationShipViaTable = [
        { field: 'shipViaName', header: 'Ship Via' },
        { field: 'shippingAccountInfo', header: 'Shipping Account' },
        { field: 'memo', header: 'Memo' }
    ];
    selectedShipViaInternational: any;
    selectedShipViaDomestic: any;
    customerCode: any;
    customerName: any;
    DomesticSiteName: any;
    InternationalExportLicName: any;
    isDeleteMode: boolean = false;
    customerShippingId: number;
    shippingViaDetailsId: number;
    selectedRowForDeleteVia: any;
    selectedRowForRestoreShipVia: any;
    selectedRowForRestoreIntShipVia: any;
    selectedRowForDeleteInterVia: any;
    selectedColumnsForDomesticShipVia = this.selectedColumnsForInternationShipViaTable;
    isViewMode: boolean = false;
    totalRecordsInternationalShipping: any = 0;
    totalPagesInternationalShipping: number = 0;
    customerDomensticShippingShipViaId: number = 0;
    customerDomensticShippingId: number = 0;
    customerInternationalShippingShipViaId: number = 0;
    loaderForDomestic: boolean = false;
    pageSizeForInt: number = 10;
    pageSizeForShipViaDomestic: number = 10;
    pageSizeForShipViaInt: number = 10;
    currentDate = new Date();
    shipViaDropdownList: any;
    isprimarydata: any;
    selectedSitename: any;
    isprimarydomesticdata: any;
    isprimaryInternationaldata: any;
    isprimarydomesticshipdata: any;
    isprimaryIntShipiviadata: any;
    currentstatus1: string = 'Active';
    currentstatus2: string = 'Active';
    domesticSieList: any[];
    domesticSieListOriginal: any[];
    arrayDomesricShipIdlist: any[] = [];
    changeName: boolean = false;
    isSiteNameAlreadyExists: boolean = false;
    disableSaveSiteName: boolean;
    arrayCountrylist: any[] = [];
    currentDeletedstatusShipVia: boolean = false;
    currentDeletedstatusIntShipVia: boolean = false;
    shipviaInfo = [];
    constructor(private customerService: CustomerService, private authService: AuthService,
        private alertService: AlertService, private activeModal: NgbActiveModal, private modalService: NgbModal, private configurations: ConfigurationService,
        private commonService: CommonService,
        private router: ActivatedRoute,
        private datePipe: DatePipe
    ) {
        this.id = this.router.snapshot.params['id'];
    }
    ngOnInit() {
        if (this.editMode) {
            //this.id = this.editGeneralInformationData.customerId;
            this.customerCode = this.editGeneralInformationData.customerCode;
            this.customerName = this.editGeneralInformationData.name;
            this.isViewMode = false;
        } else {
            if (this.customerDataFromExternalComponents) {
                //this.id = this.customerDataFromExternalComponents.customerId;
                this.customerCode = this.customerDataFromExternalComponents.customerCode;
                this.customerName = this.customerDataFromExternalComponents.name;
                this.isViewMode = true;
            } else {
                //this.id = this.savedGeneralInformationData.customerId;
                this.customerCode = this.savedGeneralInformationData.customerCode;
                this.customerName = this.savedGeneralInformationData.name;
                this.isViewMode = false;
            }
        }
        // if (this.id) {
        //     this.getDomesticShippingByCustomerId();
        //     this.getInternationalShippingByCustomerId();
        // }
    }
    ngOnChanges(changes: SimpleChanges) {
        for (let property in changes) {
            if (property == 'customerDataFromExternalComponents') {
                if (changes[property].currentValue != {}) {

                    this.id = this.customerDataFromExternalComponents.customerId;
                    this.customerCode = this.customerDataFromExternalComponents.customerCode;
                    this.customerName = this.customerDataFromExternalComponents.name;
                    this.isViewMode = true;
                    if (this.id) {
                        this.getDomesticShippingByCustomerId();
                        this.getInternationalShippingByCustomerId();
                    }
                }
            }
            if (property == 'selectedCustomerTab') {
                if (changes[property].currentValue != {} && changes.selectedCustomerTab.currentValue == "Shipping") {
                    this.getAllDomesticSiteSmartDropDown();
                    this.getshipvialistList();
                    if (this.id) {
                        this.getDomesticShippingByCustomerId();
                        this.getInternationalShippingByCustomerId();
                    }
                }
            }
        }
    }

    getAllCountries(strText = '') {
        if (this.arrayCountrylist.length == 0) {
            this.arrayCountrylist.push(0);
        }

        this.commonService.autoSuggestionSmartDropDownList('Countries', 'countries_id', 'nice_name', strText, true, 0, this.arrayCountrylist.join(), this.currentUserMasterCompanyId).subscribe(res => {
            this.countryListOriginal = res.map(x => {
                return {
                    nice_name: x.label, countries_id: x.value
                }
            })
            this.countrycollection = this.countryListOriginal;
            this.countrycollection = [...this.countryListOriginal.filter(x => {
                return x.nice_name.toLowerCase().includes(strText.toLowerCase())
            })]
        })
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
    // memoType:any;
    onSaveDomesticMemo() {
        this.shipViaDomestic.memo = this.textDomesticMemo;
        this.textDomesticMemo = '';
        this.disableShipVia = false;
        $("#textarea-popup1").modal("hide");

    }

    onSaveInternationalMemo() {
        this.shipViaInternational.memo = this.textInternationalMemo;
        this.textInternationalMemo = '';
        $("#textarea-popup2").modal("hide");
        this.disableShipVia = false;
    }
    onAddDomesticMemo() {
        this.textDomesticMemo = this.shipViaDomestic.memo;
        this.disableEditor = true;
        this.disableSaveShipViaDomestic = false;
    }
    onAddInternationalmemo() {
        this.textInternationalMemo = this.shipViaInternational.memo;
        this.disableEditor = true;

    }

    onCloseTextAreaInfo(type) {
        if (type == 1) {
            $("#textarea-popup1").modal("hide");
        } else if (type == 2) {
            $("#textarea-popup2").modal("hide");
        }
    }
    editorgetmemo() {
        this.disableEditor = false;
        this.disableShipVia = false;
    }

    getshipvialistList() {
        this.isSpinnerVisible = true;
        //this.commonService.smartDropDownList('ShippingVia', 'ShippingViaId', 'Name').subscribe(res => {
        this.commonService.autoSuggestionSmartDropDownList('ShippingVia', 'ShippingViaId', 'Name', '', true, 0, this.arrayCountrylist.join(), this.currentUserMasterCompanyId).subscribe(res => {
            const data = res.map(x => {
                return {
                    ...x,
                    id: x.value,
                    name: x.label
                }
            });
            this.shipviaInfo = [
                { label: '-- Select --', value: 0, id: 0, name: '-- Select --' }
            ];
            this.shipViaDropdownList = [...this.shipviaInfo, ...data];
            this.isSpinnerVisible = false;
        }, error => { this.isSpinnerVisible = false; })
    }
    getDeleteListByStatusDomestic(value) {
        if (value) {
            this.currentDeletedstatus1 = true;
        } else {
            this.currentDeletedstatus1 = false;
        }
        this.geListByStatusDomsetic(this.status1 ? this.status1 : this.currentstatus1)
    }
    getDeleteListByStatusIntern(value) {
        if (value) {
            this.currentDeletedstatus2 = true;
        } else {
            this.currentDeletedstatus2 = false;
        }
        this.geListByStatusInternational(this.status2 ? this.status2 : this.currentstatus2)
    }
    originalTableDataDomestic: any = [];
    originalTableDataInternanl: any = []
    currentDeletedstatus1: boolean = false;
    currentDeletedstatus2: boolean = false;
    status1: any = "Active";
    status2: any = "Active";
    geListByStatusDomsetic(status) {
        const newarry = [];
        if (status == 'Active') {
            this.status1 = status;
            if (this.currentDeletedstatus1 == false) {
                this.originalTableDataDomestic.forEach(element => {
                    if (element.isActive == true && element.isDeleted == false) {
                        newarry.push(element);
                    }
                });
            } else {
                this.originalTableDataDomestic.forEach(element => {
                    if (element.isActive == true && element.isDeleted == true) {
                        newarry.push(element);
                    }
                });
            }
            this.domesticShippingData = newarry;
        } else if (status == 'InActive') {
            this.status1 = status;
            if (this.currentDeletedstatus1 == false) {
                this.originalTableDataDomestic.forEach(element => {
                    if (element.isActive == false && element.isDeleted == false) {
                        newarry.push(element);
                    }
                });
            } else {
                this.originalTableDataDomestic.forEach(element => {
                    if (element.isActive == false && element.isDeleted == true) {
                        newarry.push(element);
                    }
                });
            }
            this.domesticShippingData = newarry;
        } else if (status == 'ALL') {
            this.status1 = status;

            if (this.currentDeletedstatus1 == false) {
                this.originalTableDataDomestic.forEach(element => {
                    if (element.isDeleted == false) {
                        newarry.push(element);
                    }
                });
            } else {
                this.originalTableDataDomestic.forEach(element => {
                    if (element.isDeleted == true) {
                        newarry.push(element);
                    }
                });
            }
            this.domesticShippingData = newarry;
        }
        this.totalRecords = this.domesticShippingData.length;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    }
    geListByStatusInternational(status) {
        const newarry = [];
        if (status == 'Active') {
            this.status2 = status;
            if (this.currentDeletedstatus2 == false) {
                this.originalTableDataInternanl.forEach(element => {
                    if (element.isActive == true && element.isDeleted == false) {
                        element.amount = element.amount ? formatNumberAsGlobalSettingsModule(element.amount, 2) : '';
                        newarry.push(element);
                    }
                });
            } else {
                this.originalTableDataInternanl.forEach(element => {
                    if (element.isActive == true && element.isDeleted == true) {
                        element.amount = element.amount ? formatNumberAsGlobalSettingsModule(element.amount, 2) : '';
                        newarry.push(element);
                    }
                });
            }
            this.internationalShippingData = newarry.map(x => {
                return {
                    ...x,
                    createdDate: x.createdDate ? this.datePipe.transform(x.createdDate, 'MM/dd/yyyy hh:mm a') : '',
                    updatedDate: x.updatedDate ? this.datePipe.transform(x.updatedDate, 'MM/dd/yyyy hh:mm a') : '',
                    startDate: x.startDate ? this.datePipe.transform(x.startDate, 'MM/dd/yyyy hh:mm a') : '',
                    expirationDate: x.expirationDate ? this.datePipe.transform(x.expirationDate, 'MM/dd/yyyy hh:mm a') : '',
                }
            });
        } else if (status == 'InActive') {
            this.status2 = status;
            if (this.currentDeletedstatus2 == false) {
                this.originalTableDataInternanl.forEach(element => {
                    if (element.isActive == false && element.isDeleted == false) {
                        element.amount = element.amount ? formatNumberAsGlobalSettingsModule(element.amount, 2) : '';
                        newarry.push(element);
                    }
                });
            } else {
                this.originalTableDataInternanl.forEach(element => {
                    if (element.isActive == false && element.isDeleted == true) {
                        element.amount = element.amount ? formatNumberAsGlobalSettingsModule(element.amount, 2) : '';
                        newarry.push(element);
                    }
                });
            }
            this.internationalShippingData = newarry.map(x => {
                return {
                    ...x,
                    createdDate: x.createdDate ? this.datePipe.transform(x.createdDate, 'MM/dd/yyyy hh:mm a') : '',
                    updatedDate: x.updatedDate ? this.datePipe.transform(x.updatedDate, 'MM/dd/yyyy hh:mm a') : '',
                    startDate: x.startDate ? this.datePipe.transform(x.startDate, 'MM/dd/yyyy hh:mm a') : '',
                    expirationDate: x.expirationDate ? this.datePipe.transform(x.expirationDate, 'MM/dd/yyyy hh:mm a') : '',
                }
            });
        } else if (status == 'ALL') {
            this.status2 = status;
            if (this.currentDeletedstatus2 == false) {
                this.originalTableDataInternanl.forEach(element => {
                    if (element.isDeleted == false) {
                        element.amount = element.amount ? formatNumberAsGlobalSettingsModule(element.amount, 2) : '';
                        newarry.push(element);
                    }
                });
            } else {
                this.originalTableDataInternanl.forEach(element => {
                    if (element.isDeleted == true) {
                        element.amount = element.amount ? formatNumberAsGlobalSettingsModule(element.amount, 2) : '';
                        newarry.push(element);
                    }
                });

            }
            this.internationalShippingData = newarry.map(x => {
                return {
                    ...x,
                    startDate: x.startDate ? this.datePipe.transform(x.startDate, 'MM/dd/yyyy hh:mm a') : '',
                    expirationDate: x.expirationDate ? this.datePipe.transform(x.expirationDate, 'MM/dd/yyyy hh:mm a') : '',
                    createdDate: x.createdDate ? this.datePipe.transform(x.createdDate, 'MM/dd/yyyy hh:mm a') : '',
                    updatedDate: x.updatedDate ? this.datePipe.transform(x.updatedDate, 'MM/dd/yyyy hh:mm a') : ''
                }
            });
        }
        this.totalRecords = this.internationalShippingData.length;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    }
    restore1(content, rowData) {
        this.restorerecord1 = rowData;
        this.selectedRowForDelete = rowData;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }
    restore2(content, rowData) {
        this.restorerecord2 = rowData;
        this.selectedRowForDeleteInter = rowData;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }
    restorerecord1: any = {};
    restorerecord2: any = {}
    restoreRecordDomestic() {
        this.isSpinnerVisible = true;
        this.commonService.updatedeletedrecords('CustomerDomensticShipping', 'CustomerDomensticShippingId', this.restorerecord1.customerDomensticShippingId).subscribe(res => {
            this.currentDeletedstatus1 = true;
            this.modal.close();
            this.getDomesticShippingByCustomerId()
            this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
            this.isSpinnerVisible = false;
        }, error => { this.isSpinnerVisible = false; })
    }
    restoreRecordIntern() {
        this.isSpinnerVisible = true;
        this.commonService.updatedeletedrecords('CustomerInternationalShipping', 'CustomerInternationalShippingId', this.restorerecord2.customerInternationalShippingId).subscribe(res => {
            this.currentDeletedstatus1 = true;
            this.modal.close();
            this.getInternationalShippingByCustomerId();
            this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
            this.isSpinnerVisible = false;
        }, error => { this.isSpinnerVisible = false; })
    }


    enableSave() {
        this.disableSave = false;
    }

    enableSaveShipViaDomestic() {
        this.disableSaveShipViaDomestic = false;
    }
    enableSaveShipViaInternational() {
        this.disableSaveShipViaInternational = false;
    }
    closeMyModel(type) {
        $(type).modal("hide");
        this.disableSave = true;
    }
    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }
    get currentUserMasterCompanyId(): number {
        return this.authService.currentUser
            ? this.authService.currentUser.masterCompanyId
            : null;
    }
    //Need to Delete After Confirm
    // filterCountriesold(event) {
    //     this.countrycollection = this.countryListOriginal;
    //     this.countrycollection = [...this.countryListOriginal.filter(x => {
    //         return x.nice_name.toLowerCase().includes(event.query.toLowerCase())
    //     })]
    // }

    filterCountries(event) {
        if (event.query !== undefined && event.query !== null) {
            this.getAllCountries(event.query);
        }
    }

    // save Domestic Shipping
    saveDomesticShipping() {
        if (this.domesticShippingData && this.domesticShippingData.length == 0) {
            this.domesticShippingInfo.isPrimary = true;
        }
        const data = {
            ...this.domesticShippingInfo,
            createdBy: this.userName,
            updatedBy: this.userName,
            siteName: editValueAssignByCondition('siteName', this.domesticShippingInfo.siteName),
            countryId: getValueFromObjectByKey('countries_id', this.domesticShippingInfo.countryId),
            masterCompanyId: this.currentUserMasterCompanyId,
            customerId: this.id,
            tagName: editValueAssignByCondition('tagName', this.domesticShippingInfo.tagName),
            contactTagId: editValueAssignByCondition('contactTagId', this.domesticShippingInfo.tagName),
        }
        // create shipping
        if (!this.isEditDomestic) {
            this.isSpinnerVisible = true;
            this.customerService.newShippingAdd(data).subscribe(() => {
                this.shipViaDomestic = new CustomerInternationalShipVia();
                this.alertService.showMessage(
                    'Success',
                    `Saved  Shipping Information Sucessfully `,
                    MessageSeverity.success
                );
                this.getDomesticShippingByCustomerId();
                this.isSpinnerVisible = false;
            }, error => { this.isSpinnerVisible = false; })
        } else {
            // update shipping
            this.isSpinnerVisible = true;
            this.customerService.updateshippinginfo(data).subscribe(() => {
                this.shipViaDomestic = new CustomerInternationalShipVia();
                this.alertService.showMessage(
                    'Success',
                    `Updated  Shipping Information Sucessfully `,
                    MessageSeverity.success
                );
                this.getDomesticShippingByCustomerId();
                this.isSpinnerVisible = false;
            }, error => { this.isSpinnerVisible = false; })
        }
        $("#addShippingInfo").modal("hide");
        this.disableSave = true;
    }
    // get domestic shipping by customer Id
    getDomesticShippingByCustomerId() {
        this.isSpinnerVisible = true;
        this.loaderForDomestic = true;
        this.customerService.getCustomerShipAddressGet(this.id).subscribe(res => {
            this.originalTableDataDomestic = res[0];
            this.loaderForDomestic = false;
            this.geListByStatusDomsetic(this.status1 ? this.status1 : "Active")
            //this.geListByStatusDomsetic(this.status1 ? this.status1 : 'Active')
            this.isSpinnerVisible = false;
        }, err => {
            this.loaderForDomestic = false;
            this.isSpinnerVisible = false;
        })
    }
    // View Details  data
    openShippinggView(rowData) {
        this.sourceViewforShipping = rowData;
        this.selectedDomesticForShipVia(rowData)
    }
    // edit Domestic details data
    openEditDomestic(rowData) {
        this.arrayDomesricShipIdlist = [];

        this.isprimarydomesticdata = rowData.isPrimary
        this.isEditDomestic = true;
        this.isSiteNameAlreadyExists = false;
        this.domesticShippingInfo = rowData;
        this.selectedSitename = rowData.siteName;
        if (rowData.contactTagId > 0) {
            this.arrayTagNamelist.push(rowData.contactTagId);
            this.getAllTagNameSmartDropDown('', rowData.contactTagId);
        }
        if (rowData.customerDomensticShippingId > 0) {
            this.arrayDomesricShipIdlist.push(rowData.customerDomensticShippingId);
        }

        if (this.arrayDomesricShipIdlist.length == 0) {
            this.arrayDomesricShipIdlist.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownListWtihColumn('CustomerDomensticShipping', 'CustomerDomensticShippingId', 'SiteName', '', 'CustomerId', this.id, 0, this.arrayDomesricShipIdlist.join(),this.currentUserMasterCompanyId).subscribe(response => {
            //this.commonService.autoSuggestionSmartDropDownList('CustomerDomensticShipping', 'CustomerDomensticShippingId', 'SiteName','',true,20,this.arrayDomesricShipIdlist.join(),this.currentUserMasterCompanyId).subscribe(response => {
            this.domesticSieListOriginal = response.map(x => {
                return {
                    siteName: x.label, value: x.value
                }
            })
            this.domesticSieList = [...this.domesticSieListOriginal];
            //this.arrayDomesricShipIdlist = [];
            //this.isprimarydomesticdata=rowData.isPrimary
            //this.isEditDomestic = true;
            //this.domesticShippingInfo = rowData;
            this.domesticShippingInfo = {
                ...this.domesticShippingInfo,
                //countryId: getObjectById('countries_id', rowData.countryId, this.countryListOriginal),
                siteName: getObjectByValue('siteName', rowData.siteName, this.domesticSieListOriginal),
                //tagName:  getObjectByValue('tagName', rowData.tagName, this.tagNamesList)
            };
            this.domesticShippingOriginalInfo = this.domesticShippingInfo;
        }, err => {
            this.isSpinnerVisible = false;
        });

        if (rowData.countryId > 0)
            this.arrayCountrylist.push(rowData.countryId);

        this.commonService.autoSuggestionSmartDropDownList('Countries', 'countries_id', 'nice_name', '', true, 0, this.arrayCountrylist.join(), this.currentUserMasterCompanyId).subscribe(res => {
            this.countryListOriginal = res.map(x => {
                return {
                    nice_name: x.label, countries_id: x.value
                }
            })
            this.domesticShippingInfo = {
                ...this.domesticShippingInfo,
                countryId: getObjectById('countries_id', rowData.countryId, this.countryListOriginal),
            };
        })
    }

    addDomesticShipping() {
        this.isSiteNameAlreadyExists = false;
        this.selectedSitename = "";
        this.isEditDomestic = false;
        this.domesticShippingInfo = new CustomerShippingModel();
        this.arrayTagNamelist = [];
		this.getAllTagNameSmartDropDown('');
    }
    addInternationalShipping() {
        this.isEditInternational = false;
        this.internationalShippingInfo = new CustomerInternationalShippingModel();
    }

    deleteDomesticShipping(content, rowData) {
        if (!rowData.isPrimary) {

            this.isDeleteMode = true;
            this.currentstatus1 = rowData.isActive;
            this.selectedRowForDelete = rowData;
            this.customerShippingAddressId = rowData.customerDomensticShippingId

            this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        } else {
            $('#deleteoopsShipping').modal('show');
        }
    }
    deleteItemAndCloseModel() {
        const obj = {
            addressStatus: false,
            updatedBy: this.userName,
            customerShippingAddressId: this.customerShippingAddressId,
            isActive: this.currentstatus1
        }
        if (this.customerShippingAddressId > 0) {
            this.customerService.updateStatusHipping(obj).subscribe(
                response => this.saveCompleted(this.sourceCustomer),
                error => { this.isSpinnerVisible = false; })
        }
        this.modal.close();
    }
    private saveCompleted(user?: any) {
        if (this.isDeleteMode == true) {
            this.alertService.showMessage("Success", `Action was deleted successfully`, MessageSeverity.success);
            this.isDeleteMode = false;
        }
        else {
            this.alertService.showMessage("Success", `Action was edited successfully`, MessageSeverity.success);
            this.saveCompleted
        }
        this.getDomesticShippingByCustomerId();
    }
    private saveFailedHelper(error: any) {
        this.isSpinnerVisible = false;
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
        setTimeout(() => this.alertService.stopLoadingMessage(), 5000);
    }
    deleteInternationalShipping(content, rowData) {
        if (!rowData.isPrimary) {
            this.isDeleteMode = true;
            this.selectedRowForDeleteInter = rowData;
            this.customerInternationalShippingId = rowData.customerInternationalShippingId

            this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        } else {
            $('#deleteoopsShipping').modal('show');
        }
    }
    deleteItemAndCloseModel1() {
        if (this.customerInternationalShippingId > 0) {

            this.customerService.deleteInternationalShipping(this.customerInternationalShippingId, this.userName).subscribe(
                response => this.saveCompleted1(this.sourceCustomer),
                error => { this.isSpinnerVisible = false; })
        }
        this.modal.close();
    }
    private saveCompleted1(user?: any) {
        if (this.isDeleteMode == true) {
            this.alertService.showMessage("Success", `Action was deleted successfully`, MessageSeverity.success);
            this.isDeleteMode = false;
        }
        else {
            this.alertService.showMessage("Success", `Action was edited successfully`, MessageSeverity.success);
            this.saveCompleted
        }
        this.getInternationalShippingByCustomerId();
    }
    private saveFailedHelper1(error: any) {
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
    }
    deleteShipVia(content, rowData) {
        if (!rowData.isPrimary) {
            this.isDeleteMode = true;
            this.selectedRowForDeleteVia = rowData.shipViaName;
            this.customerShippingAddressId = rowData.customerShippingAddressId;
            this.customerShippingId = rowData.customerShippingId;
            this.customerDomensticShippingShipViaId = rowData.customerDomensticShippingShipViaId;
            this.customerDomensticShippingId = rowData.customerDomensticShippingId;

            this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
            this.modal.result.then(() => {

            }, () => { })
        } else {
            $('#deleteoopsShipping').modal('show');
        }
    }
    deleteItemAndCloseModel2() {
        if (this.customerDomensticShippingShipViaId > 0) {
            this.customerService.deleteShipViaDetails(this.customerDomensticShippingShipViaId, this.userName).subscribe(
                response => this.saveCompleted2(this.sourceCustomer),
                error => { this.isSpinnerVisible = false; })
        }
        this.modal.close();
    }

    restoreShipVia(content, rowData) {

        this.selectedRowForRestoreShipVia = rowData.shipViaName;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.customerShippingAddressId = rowData.customerShippingAddressId;
        this.customerShippingId = rowData.customerShippingId;
        this.customerDomensticShippingShipViaId = rowData.customerDomensticShippingShipViaId;
        this.customerDomensticShippingId = rowData.customerDomensticShippingId;
    }

    restoreItemAndCloseModel() {
        if (this.customerDomensticShippingShipViaId > 0) {
            this.customerService.restoreShipViaDetails(this.customerDomensticShippingShipViaId, this.userName).subscribe(
                response => {
                    this.alertService.showMessage("Success", `Action was Restored successfully`, MessageSeverity.success);
                    this.getShipViaByDomesticShippingId(this.customerDomensticShippingId)
                },
                error => { this.isSpinnerVisible = false; })
        }
        this.modal.close();
    }

    restoreIternationalShipVia(content, rowData) {

        this.selectedRowForRestoreIntShipVia = rowData.shipViaName;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.customerInternationalShippingShipViaId = rowData.customerInternationalShippingShipViaId;
    }

    restoreIternationalItemAndCloseModel() {

        if (this.customerInternationalShippingShipViaId > 0) {
            this.customerService.restoreInternationalShipViaId(this.customerInternationalShippingShipViaId, this.userName).subscribe(
                response => {
                    this.alertService.showMessage("Success", `Action was Restored successfully`, MessageSeverity.success);
                    this.getShipViaDataByInternationalShippingId();
                },
                error => { this.isSpinnerVisible = false; })
        }
        this.modal.close();

    }

    private saveCompleted2(user?: any) {
        if (this.isDeleteMode == true) {
            this.alertService.showMessage("Success", `Action was deleted successfully`, MessageSeverity.success);
            this.isDeleteMode = false;
        }
        else {
            this.alertService.showMessage("Success", `Action was edited successfully`, MessageSeverity.success);
            this.saveCompleted
        }
        this.getShipViaByDomesticShippingId(this.customerDomensticShippingId)
    }
    private saveFailedHelper2(error: any) {
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
    }
    deleteInternationalShippingVia(content, rowData) {
        if (!rowData.isPrimary) {
            this.isDeleteMode = true;
            this.selectedRowForDeleteInterVia = rowData.shipViaName;
            this.shippingViaDetailsId = rowData.shippingViaDetailsId;
            this.customerInternationalShippingShipViaId = rowData.customerInternationalShippingShipViaId;
            this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
            this.modal.result.then(() => {

            }, () => { })
        } else {
            $('#deleteoopsShipping').modal('show');
        }

    }
    deleteItemAndCloseModel3() {
        if (this.customerInternationalShippingShipViaId > 0) {
            this.customerService.deleteInternationalShipViaId(this.customerInternationalShippingShipViaId, this.userName).subscribe(
                response => this.saveCompleted3(this.sourceCustomer),
                error => { this.isSpinnerVisible = false; })
        }
        this.modal.close();
    }
    private saveCompleted3(user?: any) {

        if (this.isDeleteMode == true) {
            this.alertService.showMessage("Success", `Action was deleted successfully`, MessageSeverity.success);
            this.isDeleteMode = false;
        }
        else {
            this.alertService.showMessage("Success", `Action was edited successfully`, MessageSeverity.success);
            this.saveCompleted
        }
        this.getShipViaDataByInternationalShippingId();
    }
    private saveFailedHelper3(error: any) {

        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
    }

    dismissModel() {
        this.modal.close();
    }
    saveInternationalShipping() {
        if (this.internationalShippingData && this.internationalShippingData.length == 0) {
            this.internationalShippingInfo.isPrimary = true;
        }
        const data = {
            ...this.internationalShippingInfo,
            shipToCountryId: getValueFromObjectByKey('countries_id', this.internationalShippingInfo.shipToCountryId),
            amount: this.internationalShippingInfo.amount == null || this.internationalShippingInfo.amount == undefined ? 0 : this.internationalShippingInfo.amount,
            createdBy: this.userName,
            updatedBy: this.userName,
            masterCompanyId: this.currentUserMasterCompanyId,
            isActive: true,
            isDeleted: false,
            customerId: this.id
        }
        if (!this.isEditInternational) {
            // save International SDhipping
            this.isSpinnerVisible = true;
            this.customerService.postInternationalShippingPost(data).subscribe((res) => {
                this.shipViaInternational = new CustomerInternationalShipVia();
                this.getInternationalShippingByCustomerId()
                this.alertService.showMessage(
                    'Success',
                    `Saved International Shipping Information Sucessfully `,
                    MessageSeverity.success
                );
                this.isSpinnerVisible = false;
            }, error => { this.isSpinnerVisible = false; })
        } else {
            // update international
            this.isSpinnerVisible = true;
            this.customerService.updateInternationalShipping(data).subscribe(res => {
                this.shipViaInternational = new CustomerInternationalShipVia();
                this.getInternationalShippingByCustomerId()
                this.isEditInternational = false;
                this.alertService.showMessage(
                    'Success',
                    `Saved International Shipping Information Sucessfully `,
                    MessageSeverity.success
                );
                this.isSpinnerVisible = false;
            }, error => { this.isSpinnerVisible = false; })
        }
        $("#addInternationalShippingInfo").modal("hide");
        this.disableSave = true;
    }
    // get International shipping by customer id
    getInternationalShippingByCustomerId() {
        this.isSpinnerVisible = true;
        this.loaderForDomestic = true;
        this.customerService.getInternationalShippingByCustomerId(this.id).subscribe(res => {

            this.loaderForDomestic = false;
            this.originalTableDataInternanl = res.map(x => {
                return {
                    ...x,
                    amount: x.amount ? formatNumberAsGlobalSettingsModule(x.amount, 2) : '0.00'

                }
            });
            this.geListByStatusInternational(this.status2 ? this.status2 : this.currentstatus2);
            this.isSpinnerVisible = false;
        }, err => {
            this.loaderForDomestic = false;
            this.isSpinnerVisible = false;
        })
    }

    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }
    pageIndexChangeForDomestic(event) {
        this.pageSizeForDomestic = event.rows;
    }
    pageIndexChangeForInt(event) {
        this.pageSizeForInt = event.rows;
    }

    pageIndexChangeForShipViaDom(event) {
        this.pageSizeForShipViaDomestic = event.rows;
    }
    pageIndexChangeForShipViaInt(event) {
        this.pageSizeForShipViaInt = event.rows;
    }

    internationalShippingPagination(event: { first: any; rows: number }) {
        const pageIndex = parseInt(event.first) / event.rows;
        this.getInternationalShippingByCustomerId();
    }
    updateActiveorInActiveForIS(rowData) {
        this.isSpinnerVisible = true;
        this.customerService.updateStatusForInternationalShippings(rowData.customerInternationalShippingId, rowData.isActive, this.userName).subscribe(res => {
            this.getInternationalShippingByCustomerId();
            this.alertService.showMessage(
                'Success',
                `Sucessfully Updated  International Shipping Status`,
                MessageSeverity.success
            );
            this.isSpinnerVisible = false;
        }, error => { this.isSpinnerVisible = false; })
    }
    updateActiveorInActiveShipViaForIS(rowData) {
        this.isSpinnerVisible = true;
        this.customerService.updateStatusForInternationalShippingsVia(rowData.customerInternationalShippingShipViaId, rowData.isActive, this.userName).subscribe(res => {
            this.getShipViaDataByInternationalShippingId();

            this.alertService.showMessage(
                'Success',
                `Sucessfully Updated  International Shipping Via Status`,
                MessageSeverity.success
            );
            this.isSpinnerVisible = false;
        }, error => { this.isSpinnerVisible = false; })
    }
    updateActiveorInActiveForS(rowData) {
        this.isSpinnerVisible = true;
        this.customerService.Shippingdetailsviastatus(rowData.customerDomensticShippingShipViaId, rowData.isActive, this.userName).subscribe(res => {
            this.getShipViaByDomesticShippingId(rowData.customerDomensticShippingId)
            this.alertService.showMessage(
                'Success',
                `Sucessfully Updated   Shipping Via Status`,
                MessageSeverity.success
            );
            this.isSpinnerVisible = false;
        }, error => { this.isSpinnerVisible = false; })
    }
    openInterShippingView(rowData) {
        this.sourceViewforInterShipping = rowData;
        this.selectedInternationalShipForShipVia(rowData)
    }
    openInterShippingViewVia(rowData) {
        this.sourceViewforInterShippingVia = rowData;
    }
    openDomesticShippingViewVia(rowData) {
        this.sourceViewforDomesticShippingVia = rowData;
    }
    toggledbldisplayShipCia(data) {
        this.sourceViewforDomesticShippingVia = data;
        $('#viewDomesticVia').modal('show');
    }
    viewSelectedRowdbl(data) {
        this.sourceViewforShipping = data;
        $('#viewShipping').modal('show');
    }
    viewInterShipping(data) {
        this.sourceViewforInterShipping = data;
        $('#viewInter').modal('show');

    }
    toggledbldisplay(data) {
        this.sourceViewforDomesticShippingVia = data;
        $('#viewDomesticVia').modal('show');
    }
    toggledbldisplayShipVia(data) {
        this.sourceViewforInterShippingVia = data;
        $('#viewInterVia').modal('show');
    }
    // async getInternationalShippingById(rowData) {
    //     this.isprimarydata=rowData.isPrimary
    //     await this.customerService.getInternationalShippingById(rowData.internationalShippingId).subscribe(res => {
    //         this.isEditInternational = true;
    //         this.internationalShippingInfo = {
    //             ...res,
    //             amount: res.amount ? formatNumberAsGlobalSettingsModule(res.amount, 2) : '',
    //             startDate: new Date(res.startDate),
    //             expirationDate: new Date(res.expirationDate),
    //             createdDate: new Date(res.expirationDate),
    //             updatedDate: new Date(res.expirationDate),
    //             shipToCountryId: getObjectById('countries_id', res.shipToCountryId, this.countryListOriginal)
    //         };
    //     })
    // }

    // edit International details data
    openEditIntenational(rowData) {
        this.isprimaryInternationaldata = rowData.isPrimary
        this.isEditInternational = true;

        this.internationalShippingInfo = {
            ...rowData,
            amount: rowData.amount ? formatNumberAsGlobalSettingsModule(rowData.amount, 2) : '',
            startDate: rowData.startDate ? new Date(rowData.startDate) : null,
            expirationDate: rowData.expirationDate ? new Date(rowData.expirationDate) : null,
            createdDate: new Date(rowData.createdDate),
            updatedDate: new Date(rowData.updatedDate),
        };

        if (rowData.shipToCountryId > 0)
            this.arrayCountrylist.push(rowData.shipToCountryId);

        this.commonService.autoSuggestionSmartDropDownList('Countries', 'countries_id', 'nice_name', '', true, 0, this.arrayCountrylist.join(), this.currentUserMasterCompanyId).subscribe(res => {
            this.countryListOriginal = res.map(x => {
                return {
                    nice_name: x.label, countries_id: x.value
                }
            })

            this.internationalShippingInfo = {
                ...this.internationalShippingInfo,
                shipToCountryId: getObjectById('countries_id', rowData.shipToCountryId, this.countryListOriginal)
            };

        })

    }

    selectedInternationalShipForShipVia(rowData) {
        this.selectedShipViaInternational = rowData;
        this.InternationalExportLicName = rowData.exportLicense;
        this.customerIntenationalShippingIdForShipVia = rowData.customerInternationalShippingId;
        this.getShipViaDataByInternationalShippingId();
    }
    selectedDomesticForShipVia(rowData) {
        this.selectedShipViaDomestic = rowData;
        this.DomesticSiteName = rowData.siteName;
        this.customerDomensticShippingIdForShipVia = rowData.customerDomensticShippingId;
        this.getShipViaByDomesticShippingId(rowData.customerDomensticShippingId)

    }
    closeInternationalModal() {
        this.isEditInternational = false;
        this.internationalShippingInfo = new CustomerInternationalShippingModel()
    }
    formateNumber(obj) {
        obj.amount = obj.amount ? formatNumberAsGlobalSettingsModule(obj.amount, 2) : '';
    }
    async saveshipViaInternational() {
        if (this.internationalShippingViaData && this.internationalShippingViaData.length == 0) {
            this.shipViaInternational.isPrimary = true;
        }
        if (!this.shipViaInternational.shipViaId && !this.shipViaInternational.shippingAccountInfo) {
            this.alertService.showMessage(
                'Error',
                `Please Add Atleast one value Ship via or Shipping Account Info`,
                MessageSeverity.error
            );
            this.isSpinnerVisible = false;
            return;
        }
        const data = {
            ...this.shipViaInternational,
            internationalShippingId: this.selectedShipViaInternational.internationalShippingId,
            customerInternationalShippingId: this.selectedShipViaInternational.customerInternationalShippingId,
            customerId: this.id,
            masterCompanyId: this.currentUserMasterCompanyId,
            createdBy: this.userName,
            updatedBy: this.userName,
        }
        if (!this.isEditInternationalShipVia) {
            this.isSpinnerVisible = true;
            await this.customerService.postInternationalShipVia(data).subscribe(res => {
                this.getShipViaDataByInternationalShippingId();

                this.shipViaInternational = new CustomerInternationalShipVia()
                this.alertService.showMessage(
                    'Success',
                    `Sucessfully Added Ship via for InternationalShipping`,
                    MessageSeverity.success
                );
                this.isSpinnerVisible = false;
                this.disableSaveShipViaInternational = true;
            }, error => { this.isSpinnerVisible = false; })
        } else {
            this.isSpinnerVisible = true;
            await this.customerService.updateShipViaInternational(data).subscribe(res => {
                this.getShipViaDataByInternationalShippingId();
                this.isEditInternationalShipVia = false;

                this.shipViaInternational = new CustomerInternationalShipVia()
                this.alertService.showMessage(
                    'Success',
                    `Sucessfully Updated Ship via for InternationalShipping`,
                    MessageSeverity.success
                );
                this.isSpinnerVisible = false;
                this.disableSaveShipViaInternational = true;
            }, error => { this.isSpinnerVisible = false; })
        }
    }
    saveshipViaDomestic() {
        this.isSpinnerVisible = true;
        if (this.demosticShippingViaData && this.demosticShippingViaData.length == 0) {
            this.shipViaDomestic.isPrimary = true;
        }
        if (!this.shipViaDomestic.shipViaId && !this.shipViaDomestic.shippingAccountInfo) {
            this.alertService.showMessage(
                'Error',
                `Please Add Atleast one value Ship via or Shipping Account Info`,
                MessageSeverity.error
            );
            this.isSpinnerVisible = false;
            return;
        }
        const data = {
            ...this.shipViaDomestic,
            customerShippingAddressId: this.selectedShipViaDomestic.customerShippingAddressId,
            CustomerDomensticShippingId: this.selectedShipViaDomestic.customerDomensticShippingId,
            customerId: this.id,
            masterCompanyId: this.currentUserMasterCompanyId,
            createdBy: this.userName,
            updatedBy: this.userName,
        }
        if (!this.isEditDomesticShipVia) {

            this.customerService.newShippingViaAdd(data).subscribe(res => {
                this.getShipViaByDomesticShippingId(this.selectedShipViaDomestic.customerDomensticShippingId)
                this.shipViaDomestic = new CustomerInternationalShipVia()
                this.alertService.showMessage(
                    'Success',
                    `Sucessfully Added Ship via for Shipping`,
                    MessageSeverity.success
                );
                this.isSpinnerVisible = false;
                this.disableSaveShipViaDomestic = true;
            }, error => { this.isSpinnerVisible = false; })
        } else {
            this.isSpinnerVisible = true;
            this.customerService.updateCustomershippingViainfo(data).subscribe(res => {
                this.getShipViaByDomesticShippingId(this.selectedShipViaDomestic.customerDomensticShippingId);
                this.isEditDomesticShipVia = false;
                this.shipViaDomestic = new CustomerInternationalShipVia();
                this.alertService.showMessage(
                    'Success',
                    `Sucessfully Updated Ship via for Shipping`,
                    MessageSeverity.success
                );
                this.isSpinnerVisible = false;
                this.disableSaveShipViaDomestic = true;
            }, error => { this.isSpinnerVisible = false; })
        }
    }
    getShipViaByDomesticShippingId(customerDomensticShippingId) {
        this.customerService.getShipViaByDomesticShippingId(customerDomensticShippingId, this.currentDeletedstatusShipVia).subscribe(res => {
            this.demosticShippingViaData = res;
        }, err => {
        })
    }

    getDomesticShipViaListByStatus(value) {
        if (value) {
            this.currentDeletedstatusShipVia = true;
        } else {
            this.currentDeletedstatusShipVia = false;
        }
        this.getShipViaByDomesticShippingId(this.customerDomensticShippingIdForShipVia)
    }

    getInternationalShipViaListByStatus(value) {
        if (value) {
            this.currentDeletedstatusIntShipVia = true;
        } else {
            this.currentDeletedstatusIntShipVia = false;
        }
        this.getShipViaDataByInternationalShippingId();
    }

    getShipViaDataByInternationalShippingId() {
        this.customerService.getInternationalShipViaByInternationalShippingId(this.selectedShipViaInternational.customerInternationalShippingId, this.currentDeletedstatusIntShipVia
        ).subscribe(res => {
            this.internationalShippingViaData = res;

            if (this.internationalShippingViaData.length > 0) {
                this.interTotalRecords = this.internationalShippingViaData.length;
                this.interTotalPages = Math.ceil(this.interTotalRecords / this.pageSize);
            }
        }, err => {
        })
    }
    internationalShippingViaPagination(event: { first: any; rows: number }) {
        const pageIndex = parseInt(event.first) / event.rows;
        this.pageIndexForInternationalShipVia = pageIndex;
        this.pageSizeForInternationalShipVia = this.pageSizeForInternationalShipVia;
        this.getShipViaDataByInternationalShippingId();
    }
    editInternationalShipVia(rowData) {
        this.isprimaryIntShipiviadata = rowData.isPrimary
        this.isEditInternationalShipVia = true;
        this.shipViaInternational = { ...rowData };
    }
    editDomesticShipVia(rowData) {
        this.isprimarydomesticshipdata = rowData.isPrimary;
        this.isEditDomesticShipVia = true;
        this.shipViaDomestic = { ...rowData };
    }
    resetShipViaInternational() {
        this.shipViaInternational = new CustomerInternationalShipVia();
        this.isEditInternationalShipVia = false;
        this.disableSaveShipViaInternational = true;
        this.currentDeletedstatusIntShipVia = false;
    }
    resetShipViaDomestic() {
        this.shipViaDomestic = new CustomerInternationalShipVia();
        this.disableSaveShipViaDomestic = true;
        this.isEditDomesticShipVia = false;
        this.currentDeletedstatusShipVia = false;
    }

    nextClick(nextOrPreviousTab) {
        this.nextOrPreviousTab = nextOrPreviousTab;
        if (this.nextOrPreviousTab == 'Next') {
            this.tab.emit('Sales');
        }
        if (this.nextOrPreviousTab == 'Previous') {
            this.tab.emit('Billing');
        }

        //let content = this.tabRedirectConfirmationModal;
        //this.modal = this.modalService.open(content, { size: 'sm' });
    }
    redirectToTab() {
        this.dismissModel();
        if (this.nextOrPreviousTab == 'Next') {
            this.tab.emit('Sales');
        }
        if (this.nextOrPreviousTab == 'Previous') {
            this.tab.emit('Billing');
        }
    }
    updateActiveorInActiveForShipping(rowData) {
        this.isSpinnerVisible = true;
        this.customerService.updateStatusForShippingDetails(rowData.customerDomensticShippingId, rowData.isActive, this.userName).subscribe(res => {
            this.getDomesticShippingByCustomerId();
            this.alertService.showMessage(
                'Success',
                `Sucessfully Updated   Shipping Status`,
                MessageSeverity.success
            );
            this.isSpinnerVisible = false;
        }, error => { this.isSpinnerVisible = false; })
    }
    openShipaddressHistory(content, row) {
        this.alertService.startLoadingMessage();
        this.customerService.getCustomerShippingHistory(this.id, row.customerDomensticShippingId).subscribe(
            results => this.onAuditHistoryLoadSuccessful(results, content),
            error => { this.isSpinnerVisible = false; })
    }
    private onAuditHistoryLoadSuccessful(auditHistory, content) {
        this.alertService.stopLoadingMessage();
        this.shippingauditHisory = auditHistory;
        this.isSpinnerVisible = false;
        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
        }, () => { })
    }
    getColorCodeForHistory(i, field, value) {
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
    openInterShippingHistory(content, row) {
        //const { internationalShippingId } = row;
        this.alertService.startLoadingMessage();
        this.customerService.getCustomerInterShippingHistory(this.id, row.customerInternationalShippingId).subscribe(
            results => this.onInterAuditHistoryLoadSuccessful(results, content),
            error => { this.isSpinnerVisible = false; })
    }
    private onInterAuditHistoryLoadSuccessful(auditHistory, content) {
        this.alertService.stopLoadingMessage();
        this.interShippingauditHisory = auditHistory;
        this.isSpinnerVisible = false;
        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
        }, () => { })
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
    getColorCodeForShipViaHistory(i, field, value) {
        const data = this.shippingViaauditHisory;
        const dataLength = data.length;
        if (i >= 0 && i <= dataLength) {
            if ((i + 1) === dataLength) {
                return true;
            } else {
                return data[i + 1][field] === value
            }
        }
    }
    openShipViaHistory(content, rowData) {
        this.alertService.startLoadingMessage();
        this.customerService.getCustomerShipViaHistory(this.id, rowData.customerDomensticShippingId, rowData.customerDomensticShippingShipViaId).subscribe(
            results => this.onAuditShipViaHistoryLoadSuccessful(results, content),
            error => { this.isSpinnerVisible = false; })
    }
    private onAuditShipViaHistoryLoadSuccessful(auditHistory, content) {
        this.alertService.stopLoadingMessage();
        this.shippingViaauditHisory = auditHistory;
        this.isSpinnerVisible = false;
        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
    }

    openInterShipViaHistory(content, rowData) {
        this.alertService.startLoadingMessage();
        this.customerService.getCustomerInterShipViaHistory(this.id, rowData.customerInternationalShippingId, rowData.customerInternationalShippingShipViaId).subscribe(
            results => this.onAuditInterShipViaHistoryLoadSuccessful(results, content),
            error => { this.isSpinnerVisible = false; })
    }
    private onAuditInterShipViaHistoryLoadSuccessful(auditHistory, content) {
        this.alertService.stopLoadingMessage();
        this.intershippingViaauditHisory = auditHistory;
        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
    }
    getColorCodeForInterShipViaHistory(i, field, value) {
        const data = this.intershippingViaauditHisory;
        const dataLength = data.length;
        if (i >= 0 && i <= dataLength) {
            if ((i + 1) === dataLength) {
                return true;
            } else {
                return data[i + 1][field] === value
            }
        }
    }
    sampleExcelDownload() {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=CustomerShippingAddress&fileName=CustomerShippingAddress.xlsx`;
        window.location.assign(url);
    }
    customShippingExcelUpload(event) {
        const file = event.target.files;
        if (file.length > 0) {
            this.isSpinnerVisible = true;
            this.formData.append('file', file[0])
            this.customerService.ShippingFileUpload(this.formData, this.id).subscribe(res => {
                event.target.value = '';

                this.formData = new FormData();
                this.getDomesticShippingByCustomerId();
                this.alertService.showMessage(
                    'Success',
                    `Successfully Uploaded  `,
                    MessageSeverity.success
                );
                this.isSpinnerVisible = false;
            }, error => { this.isSpinnerVisible = false; })
        }
    }
    sampleExcelDownloadForInternationalShipping() {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=CustomerInternationalShipping&fileName=CustomerInternationalShipping.xlsx`;
        window.location.assign(url);
    }
    customInternationalShippingExcelUpload(event) {
        const file = event.target.files;
        if (file.length > 0) {
            this.formData.append('file', file[0])
            this.isSpinnerVisible = true;
            this.customerService.InternationalShippingUpload(this.formData, this.id).subscribe(res => {
                event.target.value = '';
                this.formData = new FormData();
                this.getInternationalShippingByCustomerId();
                this.alertService.showMessage(
                    'Success',
                    `Successfully Uploaded  `,
                    MessageSeverity.success
                );
                this.isSpinnerVisible = false;
            }, error => { this.isSpinnerVisible = false; })
        }
    }

    filterDomessticSite(event) {
        if (event.query !== undefined && event.query !== null) {
            this.getAllDomesticSiteSmartDropDown(event.query);
        }
    }

    //selectedDomessticSite(event){}     

    getAllDomesticSiteSmartDropDown(strText = '') {
        if (this.arrayDomesricShipIdlist.length == 0) {
            this.arrayDomesricShipIdlist.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownListWtihColumn('CustomerDomensticShipping', 'CustomerDomensticShippingId', 'SiteName', strText, 'CustomerId', this.id, 0, this.arrayDomesricShipIdlist.join(),this.currentUserMasterCompanyId).subscribe(response => {
            // this.commonService.autoSuggestionSmartDropDownList('CustomerDomensticShipping', 'CustomerDomensticShippingId', 'SiteName',strText,true,20,this.arrayDomesricShipIdlist.join(),this.currentUserMasterCompanyId).subscribe(response => {
            this.domesticSieListOriginal = response.map(x => {
                return {
                    siteName: x.label, value: x.value
                }
            })
            this.domesticSieList = [...this.domesticSieListOriginal];
            this.arrayDomesricShipIdlist = [];
        }, err => {
            this.isSpinnerVisible = false;
        });
    }

    checkSiteNameExist(value) {
        this.changeName = true;
        this.isSiteNameAlreadyExists = false;
        this.disableSaveSiteName = false;
        if (value != this.selectedSitename) {
            for (let i = 0; i < this.domesticSieList.length; i++) {
                if (this.domesticShippingOriginalInfo.siteName == this.domesticSieList[i].siteName || value == this.domesticSieList[i].siteName) {
                    this.isSiteNameAlreadyExists = true;
                    this.disableSaveSiteName = true;
                    return;
                }
            }
        }
    }

    selectedDomessticSite() {
        const siteName = editValueAssignByCondition('siteName', this.domesticShippingInfo.siteName);
        if (siteName == this.selectedSitename) {
            this.isSiteNameAlreadyExists = false;
            if (this.isEditDomestic)
                this.disableSaveSiteName = false;
        }
        else {
            this.isSiteNameAlreadyExists = true;
            if (this.isEditDomestic)
                this.disableSaveSiteName = true;
        }
    }

    arrayTagNamelist: any[] = [];
    tagNamesList: any;

    getAllTagNameSmartDropDown(strText = '', contactTagId = 0) {
        if (this.arrayTagNamelist.length == 0) {
            this.arrayTagNamelist.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('ContactTag', 'ContactTagId', 'TagName', strText, true, 0, this.arrayTagNamelist.join(), this.currentUserMasterCompanyId).subscribe(res => {
            this.tagNamesList = res.map(x => {
                return {
                    tagName: x.label, contactTagId: x.value
                }
            })
            if (contactTagId > 0) {
                this.domesticShippingInfo = {
                    ...this.domesticShippingInfo,
                    tagName: getObjectById('contactTagId', contactTagId, this.tagNamesList)
                }
            }
        })
    }

    filterTagNames(event) {
        if (event.query !== undefined && event.query !== null) {
            this.getAllTagNameSmartDropDown(event.query);
        }
    }

}
