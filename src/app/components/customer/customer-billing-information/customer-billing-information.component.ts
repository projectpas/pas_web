import { Component, Input, Output, EventEmitter, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { CustomerService } from '../../../services/customer.service';
import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { CustomerBillingAddressModel } from '../../../models/customer-billing-address.model';
import { AuthService } from '../../../services/auth.service';
import { getValueFromObjectByKey, getObjectByValue, getObjectById, editValueAssignByCondition } from '../../../generic/autocomplete';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuditHistory } from '../../../models/audithistory.model';
declare var $: any;
import { DatePipe } from '@angular/common';
import { ConfigurationService } from '../../../services/configuration.service';
import { CommonService } from '../../../services/common.service';
import { Params, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-customer-billing-information',
    templateUrl: './customer-billing-information.component.html',
    styleUrls: ['./customer-billing-information.component.scss'],
    providers: [DatePipe]
})

/** anys component*/
export class CustomerBillingInformationComponent {
    @ViewChild('tabRedirectConfirmationModal', { static: false })
    public tabRedirectConfirmationModal: ElementRef;
    nextOrPreviousTab: string;
    @Input() savedGeneralInformationData: any = {};
    @Input() countryListOriginal;
    @Input() editGeneralInformationData;
    @Input() editMode;
    @Output() tab = new EventEmitter<any>();
    @Input() selectedCustomerTab: string = "";
    @Input() customerDataFromExternalComponents: any;
    disableSave: boolean = true;
    countryList: any[];
    selectedRowForDelete: any;
    billingInfo = new CustomerBillingAddressModel()
    billingInfoOriginal = new CustomerBillingAddressModel()
    billingInfoList: any = [];
    billingInfoTableHeaders = [
        { field: 'siteName', header: 'Site Name' },
        { field: 'tagName', header: 'Tag Name' },
        { field: 'attention', header: 'Attention' },
        { field: 'address1', header: 'Address1' },
        { field: 'address2', header: 'Address2' },
        { field: 'city', header: 'City' },
        { field: 'stateOrProvince', header: 'State / Prov' },
        { field: 'postalCode', header: 'Postal Code' },
        { field: 'countryName', header: 'Country' },
        { field: 'isPrimary', header: 'IsPrimary' }
    ]
    selectedColumns = this.billingInfoTableHeaders;
    viewData: any;
    id: number;
    customerCode: any;
    customerName: any;
    selectedOnly: boolean = false;
    targetData: any;
    isEditMode: boolean = false;
    billingHistoryData: Object;
    modal: NgbModalRef;
    isDeleteMode: boolean = false;
    customerBillingAddressId: number;
    public sourceCustomer: any = {}
    public auditHisory: AuditHistory[] = [];
    billingauditHisory: any[];
    totalRecords: any;
    pageIndex: number = 0;
    pageSize: number = 10;
    totalPages: number;
    formData = new FormData();
    isViewMode: boolean = false;
    //loader: boolean = true;
    isprimaryData: any;
    currentstatus: string = 'Active';
    isSpinnerVisible: boolean = false;
    restorerecord: any = {}
    originalTableData: any = [];
    currentDeletedstatus: boolean = false;
    status: any = "Active";
    arrayShipingIdlist: any[] = [];
    arrayCountrylist: any[] = [];
    billingSieList: any[];
    billingSieListOriginal: any[];
    changeName: boolean = false;
    isSiteNameAlreadyExists: boolean = false;
    disableSaveSiteName: boolean;
    selectedSitename: any

    constructor(public customerService: CustomerService, private authService: AuthService, private alertService: AlertService,
        private modalService: NgbModal, private configurations: ConfigurationService,
        private activeModal: NgbActiveModal,
        private datePipe: DatePipe,
        private commonService: CommonService,
        private router: ActivatedRoute) {
        this.id = this.router.snapshot.params['id'];
    }

    ngOnInit(): void {

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
        //     this.getBillingDataById()
        // }
    }

    ngOnChanges(changes: SimpleChanges) {
        for (let property in changes) {
            if (property == 'selectedCustomerTab') {
                if (changes[property].currentValue != {} && changes[property].currentValue == "Billing") {
                    if (this.id) {
                        this.getBillingDataById()
                    }
                }
            }
            if (property == 'customerDataFromExternalComponents') {
                if (changes[property].currentValue != {}) {
                    this.id = this.customerDataFromExternalComponents.customerId;
                    this.customerCode = this.customerDataFromExternalComponents.customerCode;
                    this.customerName = this.customerDataFromExternalComponents.name;
                    if (this.id) {
                        this.getBillingDataById()
                    }
                    this.isViewMode = true;
                }
            }
        }
    }
    closeDeleteModal() {
        $("#downloadBilling").modal("hide");
    }

    checkBillingSiteNameSelect() {
        if (this.isEditMode != editValueAssignByCondition('siteName', this.billingInfo.siteName)) {
            this.isSiteNameAlreadyExists = true;
            this.disableSaveSiteName = true;
        }
        else {
            this.isSiteNameAlreadyExists = false;
            this.disableSaveSiteName = false;
        }
    }

    exportCSV(dt) {
        dt._value = dt._value.map(x => {
            return {
                ...x,
                createdDate: x.createdDate ? this.datePipe.transform(x.createdDate, 'MMM-dd-yyyy hh:mm a') : '',
                updatedDate: x.updatedDate ? this.datePipe.transform(x.updatedDate, 'MMM-dd-yyyy hh:mm a') : '',
            }
        });
        dt.exportCSV();
    }

    getDeleteListByStatus(value) {
        if (value) {
            this.currentDeletedstatus = true;
        } else {
            this.currentDeletedstatus = false;
        }
        if (this.isViewMode == true) {
            this.isSpinnerVisible = true;
            this.customerService.getCustomerBillViaDetails(this.id).subscribe(res => {
                if (res) {
                    const newarry = [];
                    this.originalTableData = res[0];
                    if (this.currentDeletedstatus == false) {
                        this.originalTableData.forEach(element => {
                            if (element.isDeleted == false) {
                                newarry.push(element);
                            }
                        });
                    } else {
                        this.originalTableData.forEach(element => {
                            if (element.isDeleted == true) {
                                newarry.push(element);
                            }
                        });
                    }
                    this.billingInfoList = newarry;
                }
                //this.loader = false;
                this.isSpinnerVisible = false;
            }, err => {
                //this.loader = false;
                this.isSpinnerVisible = false;
            })
        }
        else
            this.geListByStatus(this.status ? this.status : this.currentstatus)
    }

    geListByStatus(status) {
        this.currentstatus = status;
        const newarry = [];
        if (status == 'Active') {
            this.status = status;
            if (this.currentDeletedstatus == false) {
                this.originalTableData.forEach(element => {
                    if (element.isActive == true && element.isDeleted == false) {
                        newarry.push(element);
                    }
                });
            } else {
                this.originalTableData.forEach(element => {
                    if (element.isActive == true && element.isDeleted == true) {
                        newarry.push(element);
                    }
                });
            }
            this.billingInfoList = newarry;
        } else if (status == 'InActive') {
            this.status = status;
            if (this.currentDeletedstatus == false) {
                this.originalTableData.forEach(element => {
                    if (element.isActive == false && element.isDeleted == false) {
                        newarry.push(element);
                    }
                });
            } else {
                this.originalTableData.forEach(element => {
                    if (element.isActive == false && element.isDeleted == true) {
                        newarry.push(element);
                    }
                });
            }
            this.billingInfoList = newarry;
        } else if (status == 'ALL') {
            this.status = status;
            if (this.currentDeletedstatus == false) {
                this.originalTableData.forEach(element => {
                    if (element.isDeleted == false) {
                        newarry.push(element);
                    }
                });
                this.billingInfoList = newarry;
            } else {
                this.originalTableData.forEach(element => {
                    if (element.isDeleted == true) {
                        newarry.push(element);
                    }
                });
                this.billingInfoList = newarry;
            }
        }
        this.totalRecords = this.billingInfoList.length;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    }

    restore(content, rowData) {
        this.restorerecord = rowData;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    restoreRecord() {
        this.isSpinnerVisible = true;
        this.commonService.updatedeletedrecords('CustomerBillingAddress', 'CustomerBillingAddressId', this.restorerecord.customerBillingAddressId).subscribe(res => {
            this.currentDeletedstatus = true;
            this.modal.close();
            this.getBillingDataById();
            this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
            this.isSpinnerVisible = false;
        }, error => { this.isSpinnerVisible = false; })
    }

    enableSave() {
        this.disableSave = false;
    }

    closeMyModel() {
        $("#addBillingInfo").modal("hide");
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
    // filtercountryold(event) {
    //     this.countryList = this.countryListOriginal;
    //     const countryData = [...this.countryListOriginal.filter(x => {
    //         return x.countries_name.toLowerCase().includes(event.query.toLowerCase())
    //     })]
    //     this.countryList = countryData;

    // }

    filtercountry(event) {
        if (event.query !== undefined && event.query !== null) {
            this.getAllCountries(event.query);
        }
    }

    saveBillingInformation() {
        this.isSpinnerVisible = true;
        if (this.billingInfoList && this.billingInfoList.length == 0) {
            this.billingInfo.isPrimary = true;
        }
        const data = {
            ...this.billingInfo,
            createdBy: this.userName,
            updatedBy: this.userName,
            countryId: getValueFromObjectByKey('countries_id', this.billingInfo.countryId),
            siteName: editValueAssignByCondition('siteName', this.billingInfo.siteName),
            tagName: editValueAssignByCondition('tagName', this.billingInfo.tagName),
            contactTagId: editValueAssignByCondition('contactTagId', this.billingInfo.tagName),
            masterCompanyId: this.currentUserMasterCompanyId,
            customerId: this.id
        }
        // create shipping 
        if (!this.isEditMode) {
            this.customerService.newBillingAdd(data).subscribe(() => {
                this.billingInfo = new CustomerBillingAddressModel();
                this.isSpinnerVisible = false;
                this.alertService.showMessage(
                    'Success',
                    `Saved  Billing Information Sucessfully `,
                    MessageSeverity.success
                );
                this.getBillingDataById();
            }, error => { this.isSpinnerVisible = false; })
        } else {
            // update shipping 
            this.customerService.updateBillinginfo(data).subscribe(() => {
                this.billingInfo = new CustomerBillingAddressModel();
                this.isSpinnerVisible = false;
                this.alertService.showMessage(
                    'Success',
                    `Updated  Billing Information Sucessfully `,
                    MessageSeverity.success
                );
                this.getBillingDataById();
            }, error => { this.isSpinnerVisible = false })
        }
        $("#addBillingInfo").modal("hide");
        this.disableSave = true;
    }

    addBillingIfo() {
        this.isEditMode = false;
        this.isSiteNameAlreadyExists = false;
        this.selectedSitename = "";
        this.arrayCountrylist = [];
        this.billingInfo = new CustomerBillingAddressModel();
    }

    selectedItems: any;

    getBillingDataById() {
        this.isSpinnerVisible = true;
        this.customerService.getCustomerBillViaDetails(this.id).subscribe(res => {
            this.originalTableData = res[0];
            //this.loader = false;
            this.geListByStatus(this.status ? this.status : this.currentstatus)
            this.isSpinnerVisible = false;
        }, err => {
            //this.loader = false;
            this.isSpinnerVisible = false;
        })
        //this.loader = false;
    }

    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }
    pageIndexChange(event) {
        this.pageSize = event.rows;
    }

    openBillingView(data) {
        this.viewData = data;
    }
    toggledbldisplay(data) {
        this.viewData = data;
        $('#viewBilling').modal('show');
    }
    nextClick(nextOrPreviousTab) {
        this.nextOrPreviousTab = nextOrPreviousTab;
        if (this.nextOrPreviousTab == 'Next') {
            this.tab.emit('Shipping');
        }
        if (this.nextOrPreviousTab == 'Previous') {
            this.tab.emit('Financial');
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
            this.countryList = this.countryListOriginal;
            this.countryList = [...this.countryListOriginal.filter(x => {
                return x.nice_name.toLowerCase().includes(strText.toLowerCase())
            })]

            this.arrayCountrylist = [];
        })

    }


    redirectToTab() {
        this.dismissModel();
        if (this.nextOrPreviousTab == 'Next') {
            this.tab.emit('Shipping');
        }
        if (this.nextOrPreviousTab == 'Previous') {
            this.tab.emit('Financial');
        }
    }
    openEdit(rowData) {
        this.arrayShipingIdlist = [];

        this.isprimaryData = rowData.isPrimary
        this.isEditMode = true;
        this.billingInfo = {
            ...rowData
        };
        this.selectedSitename = rowData.siteName
        this.isSiteNameAlreadyExists = false;
        if (rowData.contactTagId > 0) {
            this.arrayTagNamelist.push(rowData.contactTagId);
            this.getAllTagNameSmartDropDown('', rowData.contactTagId);
        }
        if (rowData.customerBillingAddressId > 0) {
            this.arrayShipingIdlist.push(rowData.customerBillingAddressId);
        }

        if (this.arrayShipingIdlist.length == 0) {
            this.arrayShipingIdlist.push(0);
        }

        if (rowData.countryId > 0)
            this.arrayCountrylist.push(rowData.countryId);

        this.commonService.autoSuggestionSmartDropDownList('Countries', 'countries_id', 'nice_name', '', true, 0, this.arrayCountrylist.join(), this.currentUserMasterCompanyId).subscribe(res => {
            this.countryListOriginal = res.map(x => {
                return {
                    nice_name: x.label, countries_id: x.value
                }
            })
            this.billingInfo = {
                ...this.billingInfo,
                countryId: getObjectByValue('countries_id', rowData.countryId, this.countryListOriginal)
            };

            this.billingInfoOriginal = this.billingInfo;
            //this.arrayCountrylist = [];
        })

        this.commonService.autoSuggestionSmartDropDownList('CustomerBillingAddress', 'CustomerBillingAddressId', 'SiteName', '', true, 0, this.arrayShipingIdlist.join(), this.currentUserMasterCompanyId).subscribe(response => {
            this.billingSieListOriginal = response.map(x => {
                return {
                    siteName: x.label, value: x.value
                }
            })
            //this.billingSieList = [...this.billingSieListOriginal];
            //this.isprimaryData = rowData.isPrimary
            //this.isEditMode = true;
            this.billingInfo = {
                ...this.billingInfo,
                siteName: getObjectByValue('siteName', rowData.siteName, this.billingSieListOriginal)
            };
            this.billingInfoOriginal = this.billingInfo;
            //this.arrayShipingIdlist = [];
        }, err => {
            this.isSpinnerVisible = false;
        });

        //this.billingSieList = [...this.billingSieListOriginal];
        //this.isprimaryData = rowData.isPrimary
        //this.isEditMode = true;
        // this.billingInfo = { 
        //     ...rowData, 
        //     //countryId: getObjectByValue('countries_id', rowData.countryId, this.countryListOriginal),
        //     //siteName:  getObjectByValue('siteName', rowData.siteName, this.billingSieListOriginal)        
        // };
        //this.billingInfoOriginal = this.billingInfo;
        //this.arrayShipingIdlist = [];

    }

    getCustomerBillingHistory(content, row) {
        const { customerBillingAddressId } = row;
        this.alertService.startLoadingMessage();
        this.customerService.getCustomerBillingHistory(this.id, customerBillingAddressId).subscribe(
            results => this.onAuditHistoryLoadSuccessful(results, content),
            error => { this.isSpinnerVisible = false; });
    }
    private onAuditHistoryLoadSuccessful(auditHistory, content) {
        this.alertService.stopLoadingMessage();
        this.billingauditHisory = auditHistory;
        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false, windowClass: "popup-blur" });
    }

    getColorCodeForHistory(i, field, value) {
        const data = this.billingauditHisory;
        const dataLength = data.length;
        if (i >= 0 && i <= dataLength) {
            if ((i + 1) === dataLength) {
                return true;
            } else {
                return data[i + 1][field] === value
            }
        }
    }

    async updateActiveorInActiveForBilling(rowData) {
        this.isSpinnerVisible = true;
        await this.customerService.CustomersBillingUpdateforActive(rowData.customerBillingAddressId, rowData.isActive, this.userName).subscribe(res => {
            this.getBillingDataById();
            this.alertService.showMessage(
                'Success',
                `Sucessfully Updated  Billing Status`,
                MessageSeverity.success
            );
            this.isSpinnerVisible = false;
        }, error => { this.isSpinnerVisible = false; })
    }

    dismissModel() {
        this.modal.close();
    }

    deleteBillingInfo(content, rowData) {
        if (!rowData.isPrimary) {
            this.selectedRowForDelete = rowData;
            this.isDeleteMode = true;
            this.customerBillingAddressId = rowData.customerBillingAddressId
            this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        } else {
            $('#deleteoopsBilling').modal('show');
        }
    }

    deleteItemAndCloseModel() {
        const obj = {
            addressStatus: false,
            updatedBy: this.userName,
            customerBillingAddressId: this.customerBillingAddressId,
            masterCompanyId: this.currentUserMasterCompanyId,
        }
        if (this.customerBillingAddressId > 0) {
            this.customerService.deleteBillinginfo(obj).subscribe(
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
        this.getBillingDataById();
    }

    private saveFailedHelper(error: any) {
        this.isSpinnerVisible = false;
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
        setTimeout(() => this.alertService.stopLoadingMessage(), 5000);
    }

    sampleExcelDownload() {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=CustomerBillingAddress&fileName=CustomerBillingAddress.xlsx`;
        window.location.assign(url);
    }

    customExcelUpload(event) {
        const file = event.target.files;
        if (file.length > 0) {
            this.formData.append('file', file[0])
            this.customerService.BillingFileUpload(this.formData, this.id).subscribe(res => {
                event.target.value = '';
                this.formData = new FormData();
                this.getBillingDataById();
                this.alertService.showMessage(
                    'Success',
                    `Successfully Uploaded  `,
                    MessageSeverity.success
                );
            }, error => { this.isSpinnerVisible = false; })
        }
    }

    filterBillingSite(event) {
        if (event.query !== undefined && event.query !== null) {
            this.getAllBillingSiteSmartDropDown(event.query);
        }
    }

    getAllBillingSiteSmartDropDown(strText = '') {
        if (this.arrayShipingIdlist.length == 0) {
            this.arrayShipingIdlist.push(0);
        }
        //this.commonService.autoSuggestionSmartDropDownList('CustomerBillingAddress', 'CustomerBillingAddressId', 'SiteName',strText,true,20,this.arrayShipingIdlist.join(),this.currentUserMasterCompanyId).subscribe(response => {
        this.commonService.autoSuggestionSmartDropDownListWtihColumn('CustomerBillingAddress', 'CustomerBillingAddressId', 'SiteName', strText, 'CustomerId', this.id, 20, this.arrayShipingIdlist.join(),this.currentUserMasterCompanyId).subscribe(response => {
            this.billingSieListOriginal = response.map(x => {
                return {
                    siteName: x.label, value: x.value
                }
            })
            this.billingSieList = [...this.billingSieListOriginal];
            this.arrayShipingIdlist = [];
        }, err => {
            this.isSpinnerVisible = false;
        });
    }

    checkSiteNameExist(value) {
        this.changeName = true;
        this.isSiteNameAlreadyExists = false;
        this.disableSaveSiteName = false;
        if (value != this.selectedSitename) {
            for (let i = 0; i < this.billingSieList.length; i++) {
                if (this.billingInfo.siteName == this.billingSieList[i].siteName || value == this.billingSieList[i].siteName) {
                    this.isSiteNameAlreadyExists = true;
                    this.disableSaveSiteName = true;
                    return;
                }
            }
        }
    }

    selectedsiteNameData() {
        const siteName = editValueAssignByCondition('siteName', this.billingInfo.siteName);
        if (siteName == this.selectedSitename) {
            this.isSiteNameAlreadyExists = false;
            if (this.isEditMode)
                this.disableSaveSiteName = false;
        }
        else {
            this.isSiteNameAlreadyExists = true;
            if (this.isEditMode)
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
                this.billingInfo = {
                    ...this.billingInfo,
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