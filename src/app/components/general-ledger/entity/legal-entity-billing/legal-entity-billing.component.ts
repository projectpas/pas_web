import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
import { legalEntityBillingAddressModel } from '../../../../models/legalEntity-billing-address.model';
import { AuthService } from '../../../../services/auth.service';
import { listSearchFilterObjectCreation, editValueAssignByCondition } from '../../../../generic/autocomplete';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AuditHistory } from '../../../../models/audithistory.model';
// declare var $ : any;
declare var $ : any;
import { ConfigurationService } from '../../../../services/configuration.service';
import { CommonService } from '../../../../services/common.service';
import { LegalEntityService } from '../../../../services/legalentity.service';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { ModuleConstants, PermissionConstants } from 'src/app/generic/ModuleConstant';
@Component({
    selector: 'app-legal-entity-billing',
    templateUrl: './legal-entity-billing.component.html',
    styleUrls: ['./legal-entity-billing.component.scss'],
    providers: [DatePipe]
})
export class EntityBillingComponent {
    @Input() savedGeneralInformationData;
    @Input() editGeneralInformationData;
    @Input() editMode;
    @Output() tab = new EventEmitter<any>();
    @Input() selectedlegalEntityTab: string = "";
    @Input() legalEntityDataFromExternalComponents: any;
    countryList: any[];
    selectedRowForDelete: any;
    billingInfo = new legalEntityBillingAddressModel()
    billingInfoList: any = [];
    billingInfoTableHeaders = [
        { field: 'siteName', header: 'Site Name' },
        { field: 'attention', header: 'Attention' },
        { field: 'address1', header: 'Address1' },
        { field: 'address2', header: 'Address2' },
        { field: 'city', header: 'City' },
        { field: 'state', header: 'State / Prov' },
        { field: 'postalCode', header: 'Postal Code' },
        { field: 'country', header: 'Country' },
        { field: 'isPrimary', header: 'Primary' },
        { field: 'createdDate', header: 'Created Date' },
        { field: 'createdBy', header: 'Created By' },
        { field: 'updatedDate', header: 'Updated Date' },
        { field: 'updatedBy', header: 'Updated By' },
    ]
    selectedColumns = this.billingInfoTableHeaders;
    viewData: any;
    id: number;
    legalEntityCode: any;
    legalEntityName: any;
    isEditMode: boolean = false;
    billingHistoryData: Object;
    modal: NgbModalRef;
    isDeleteMode: boolean = false;
    legalEntityBillingAddressId: number;
    public sourcelegalEntity: any = {}
    public auditHisory: AuditHistory[] = [];
    billingauditHisory: any[];
    totalRecords: any;
    disableSave: boolean = true;
    pageIndex: number = 0;
    pageSize: number = 10;
    totalPages: number;
    formData = new FormData();
    isViewMode: boolean = false;
    billingInfoListOriginal: any;
    isAdd: boolean= true;
    isEdit: boolean= true;
    isDelete: boolean= true;
    isDownload: boolean= true;
    isView:boolean=true;
    isNextVisible: Boolean=true;
    isPrevVisible: Boolean=true;
    constructor(public legalEntityService: LegalEntityService, private datePipe: DatePipe, private authService: AuthService, private alertService: AlertService, private modalService: NgbModal, private configurations: ConfigurationService,
        private activeModal: NgbActiveModal, private commonService: CommonService, public workFlowtService: LegalEntityService,) {

            this.isAdd=this.authService.checkPermission([ModuleConstants.LegalEntity_BillingInformation+'.'+PermissionConstants.Add]);
			this.isEdit=this.authService.checkPermission([ModuleConstants.LegalEntity_BillingInformation+'.'+PermissionConstants.Update]);
			this.isDelete=this.authService.checkPermission([ModuleConstants.LegalEntity_BillingInformation+'.'+PermissionConstants.Delete]);
			this.isDownload=this.authService.checkPermission([ModuleConstants.LegalEntity_BillingInformation+'.'+PermissionConstants.Download]);
            this.isView=this.authService.checkPermission([ModuleConstants.LegalEntity_BillingInformation+'.'+PermissionConstants.View]);
            this.isNextVisible=this.authService.ShowTab('Create Legal Entity','Shipping Information');
			this.isPrevVisible=this.authService.ShowTab('Create Legal Entity','Banking Information');
    }

    ngOnInit(): void {
        if (this.isViewMode == false) {
            if (this.editMode) {
                this.id = this.editGeneralInformationData.legalEntityId;
                // this.legalEntityName = this.editGeneralInformationData.name;
                this.legalEntityCode = this.editGeneralInformationData.companyCode;
                if (typeof this.editGeneralInformationData.name != 'string') {
                    this.legalEntityName = this.editGeneralInformationData.name.label;
                } else {
                    this.legalEntityName = this.editGeneralInformationData.name;
                }
            } else {
                this.id = this.savedGeneralInformationData ? this.savedGeneralInformationData.legalEntityId : undefined;
                // this.legalEntityName = this.savedGeneralInformationData ? this.savedGeneralInformationData.name : '';
                this.legalEntityCode = this.savedGeneralInformationData ? this.savedGeneralInformationData.companyCode : '';
                if (this.savedGeneralInformationData) {
                    if (typeof this.savedGeneralInformationData.name != 'string') {
                        this.legalEntityName = this.savedGeneralInformationData.name.label;
                    } else {
                        this.legalEntityName = this.savedGeneralInformationData.name;

                    }
                }
                if (this.isViewMode == false) {
                    this.CountryData('');
                }
            }
            if (this.isViewMode == false) {
                this.getAllSites('');
            }
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        for (let property in changes) {
            if (property == 'selectedlegalEntityTab') {
                if (changes[property].currentValue == "Billing") {
                    // this.getBillingDataById();
                    // this.CountryData('');

                }
            }
            if (property == 'legalEntityDataFromExternalComponents') {
                this.isViewMode = true;
                if (changes[property].currentValue != {}) {
                    this.legalEntityCode = this.savedGeneralInformationData ? this.savedGeneralInformationData.companyCode : '';
                    //     if(this.savedGeneralInformationData){
                    //     if(typeof   this.savedGeneralInformationData.name != 'string'){
                    //         this.legalEntityName = this.savedGeneralInformationData.name.label;	
                    //     }else{
                    //         this.legalEntityName = this.savedGeneralInformationData.name;

                    //     }
                    // }
                    setTimeout(() => {
                        this.id = this.legalEntityDataFromExternalComponents.legalEntityId;
                        this.legalEntityCode = this.legalEntityDataFromExternalComponents.legalEntityCode;
                        this.legalEntityName = this.legalEntityDataFromExternalComponents.name;

                        this.isViewMode = true;
                        this.currentStatusEmp = 'Active';
                        this.billingStatus = 'Active';
                        // if(!this.isViewMode){
                        if(this.isView){
                        this.geListByStatusForBillingList(this.billingStatus);
                        }
                        // }
                    }, 1200);
                }
            }
        }

    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    get currentUserMasterCompanyId(): number {
		return this.authService.currentUser
			? this.authService.currentUser.masterCompanyId
			: null;
	}

    saveBillingInformation() {
        const data = {
            ...this.billingInfo,
            createdBy: this.userName,
            updatedBy: this.userName,
            // countryId: getValueFromObjectByKey('countries_id', this.billingInfo.countryId),
            masterCompanyId: this.currentUserMasterCompanyId,
            isActive: true,
            legalEntityId: this.id
        }
        if (!this.isEditMode) {
            if (data.siteName && typeof data.siteName != 'string') {
                data.siteName = editValueAssignByCondition('label', data.siteName);
            }
            this.legalEntityService.newBillingAdd(data).subscribe(() => {
                //  this.billingInfo = new legalEntityBillingAddressModel();
                this.geListByStatusForBillingList(this.billingStatus);
                this.alertService.showMessage(
                    'Success',
                    `Saved  Billing Information Sucessfully `,
                    MessageSeverity.success
                );
                // this.getBillingDataById();
            }, err => {
                this.isSpinnerVisible = false
            })
        } else {
            // update shipping 
            if (data.siteName && typeof data.siteName != 'string') {
                data.siteName = editValueAssignByCondition('label', data.siteName);
            }
            this.legalEntityService.updateBillinginfo(data).subscribe(() => {
                this.geListByStatusForBillingList(this.billingStatus);
                this.alertService.showMessage(
                    'Success',
                    `Updated  Billing Information Sucessfully `,
                    MessageSeverity.success
                );
                // this.getBillingDataById();
            }, err => {
                this.isSpinnerVisible = false
            })
        }
        $("#addBillingInfo").modal("hide");
        this.disableSave = true;
    }

    dismissModelView() {
        $("#view").modal("hide");
    }

    addBillingIfo() {
        this.editisPrimary = false;
        this.isEditMode = false;
        this.billingInfo = new legalEntityBillingAddressModel();
        this.CountryData('');
    }

    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }

    pageIndexChange(event) {
        this.pageSize = event.rows;
    }

    isSpinnerVisibleView: boolean = false;
    openBillingView(data) {
        this.isSpinnerVisibleView = true;
        this.viewData = data;
        setTimeout(() => {
            this.isSpinnerVisibleView = false;
        }, 1000);
    }

    toggledbldisplay(data) {
        this.viewData = data;
        $('#view').modal('show');
    }

    nextClick() {
        this.tab.emit('Shipping');
    }

    backClick() {
        this.tab.emit('Banking');
    }

    editisPrimary: boolean = false
    openEdit(rowData) {
        this.editisPrimary = rowData.isPrimary;
        this.showExistMsg = false;
        this.isEditMode = true;
        this.billingInfo = {
            ...rowData, stateOrProvince: rowData.state
            //  countryId: getObjectByValue('countries_id', rowData.countryId, this.countryListOriginal)
        };
        this.legalEntityBillingAddressId = rowData.legalEntityBillingAddressId;
        this.CountryData('');
        this.getAllSites(this.billingInfo.siteName);
    }

    enableSave() {
        this.disableSave = false;
    }

    getlegalEntityBillingHistory(content, row) {
        const { legalEntityBillingAddressId } = row;
        this.alertService.startLoadingMessage();
        this.legalEntityService.getlegalEntityBillingHistory(this.id, legalEntityBillingAddressId).subscribe(
            results => this.onAuditHistoryLoadSuccessful(results, content), err => {
                this.isSpinnerVisible = false
            });
    }

    private onAuditHistoryLoadSuccessful(auditHistory, content) {
        this.alertService.stopLoadingMessage();
        this.billingauditHisory = auditHistory;
        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false, windowClass: 'assetMange' });
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
        if (!rowData.isPrimary) {
            const status = rowData.isActive == true ? 'Active' : 'InActive';
            await this.legalEntityService.legalEntitysBillingUpdateforActive(rowData.legalEntityBillingAddressId, status, this.userName).subscribe(res => {
                this.geListByStatusForBillingList(this.billingStatus);
                // this.getBillingDataById();
                this.alertService.showMessage(
                    'Success',
                    `Sucessfully Updated  Billing Status`,
                    MessageSeverity.success
                );
            }, err => {
                this.isSpinnerVisible = false
            })
        }
    }

    dismissModel() {
        this.modal.close();
    }

    deleteBillingInfo(content, rowData) {
        if (!rowData.isPrimary) {
            this.selectedRowForDelete = rowData;
            this.isDeleteMode = true;
            this.legalEntityBillingAddressId = rowData.legalEntityBillingAddressId;
            this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        } else {
            $('#deleteoopsBilling').modal('show');
        }
    }

    deleteItemAndCloseModel() {
        const obj = {
            isActive: false,
            addressStatus: false,
            updatedBy: this.userName,
            legalEntityBillingAddressId: this.legalEntityBillingAddressId
        }
        if (this.legalEntityBillingAddressId > 0) {
            this.legalEntityService.updateDeleteBillinginfo(obj.legalEntityBillingAddressId, this.userName).subscribe(
                response => {
                    this.saveCompleted(this.sourcelegalEntity)
                    this.geListByStatusForBillingList(this.billingStatus);
                }, err => {
                    this.isSpinnerVisible = false
                });
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
        // this.getBillingDataById();
    }

    private saveFailedHelper(error: any) {
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
    }

    sampleExcelDownload() {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=legalEntityBillingAddress&fileName=legalEntityBillingAddress.xlsx`;
        window.location.assign(url);
    }

    customExcelUpload(event) {
        const file = event.target.files;
        if (file.length > 0) {
            this.formData.append('file', file[0])
            this.formData.append('masterCompanyId', this.currentUserMasterCompanyId.toString())
            this.formData.append('createdBy', this.userName);
            this.formData.append('updatedBy', this.userName);
            this.formData.append('isActive', 'true');
            this.formData.append('isDeleted', 'false');
            const data = {
                'masterCompanyId': this.currentUserMasterCompanyId,
                'createdBy': this.userName,
                'updatedBy': this.userName,
                'isActive': true,
                'isDeleted': false
            }
            this.legalEntityService.BillingFileUpload(this.formData, this.id).subscribe(res => {
                event.target.value = '';
                this.formData = new FormData();
                // this.getBillingDataById();
                this.alertService.showMessage(
                    'Success',
                    `Successfully Uploaded  `,
                    MessageSeverity.success
                );
                this.geListByStatusForBillingList(this.billingStatus);
            }, err => {
                this.isSpinnerVisible = false
            })
        }
    }
    
    closeMyModel(type) {
        $(type).modal("hide");
        this.disableSave = true;
    }

    lazyLoadEventDataInput: any;
    lazyLoadEventData: Event;
    status: string = 'Active';
    currentStatusEmp: string = 'Active';
    filterText: any = '';
    currentDeletedstatusBilling: boolean = false;
    isSpinnerVisible: boolean = false;
    loadDatas(event) {
        this.lazyLoadEventData = event;
        const pageIndex = parseInt(event.first) / event.rows;;
        this.pageIndex = pageIndex;
        this.pageSize = event.rows;
        event.first = pageIndex;
        this.lazyLoadEventDataInput = event;
        this.lazyLoadEventDataInput.legalEntityId = this.id;
        this.lazyLoadEventDataInput.filters = {
            ...this.lazyLoadEventDataInput.filters,
            status: this.billingStatus ? this.billingStatus : 'Active',
        }
        // if(this.isViewMode==false){
        if (this.filterText == '') {
            this.getList(this.lazyLoadEventDataInput);
        } else {
            this.globalSearch(this.filterText);
        }
        // }
    }

    first: any = 0;
    billingStatus: any = 'Active'
    geListByStatusForBillingList(status) {
        this.currentStatusEmp = status ? status : 'Active';
        const pageIndex = 0;
        this.pageIndex = pageIndex;
        this.pageSize = this.lazyLoadEventDataInput ? this.lazyLoadEventDataInput.rows : 0;
        this.lazyLoadEventDataInput.legalEntityId = this.id;
        this.lazyLoadEventDataInput.first = pageIndex;
        this.billingStatus = status ? status : 'Active';
        this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: status };
        const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
        this.first = 0;
        PagingData.page = 1;
        this.getList(PagingData);
    }

    globalSearch(value) {
        // this.isSpinnerVisible = true;
        this.pageIndex = this.lazyLoadEventDataInput.rows > 10 ? parseInt(this.lazyLoadEventDataInput.first) / this.lazyLoadEventDataInput.rows : 0;
        this.pageSize = this.lazyLoadEventDataInput.rows;
        this.lazyLoadEventDataInput.first = this.pageIndex;
        this.lazyLoadEventDataInput.legalEntityId = this.id;
        this.lazyLoadEventDataInput.globalFilter = value;
        this.filterText = value;
        this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.billingStatus };
        this.getList(this.lazyLoadEventDataInput);
    }

    getDeleteListByStatusBilling(value) {
        this.currentDeletedstatusBilling = true;
        const pageIndex = 0;
        this.pageIndex = pageIndex;
        this.pageSize = this.lazyLoadEventDataInput.rows;
        this.lazyLoadEventDataInput.first = pageIndex;
        if (value == true) {
            this.currentDeletedstatusBilling = true;
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.billingStatus };
            // this.isSpinnerVisible = true;
            this.getList(this.lazyLoadEventDataInput);
        } else {
            this.currentDeletedstatusBilling = false;
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.billingStatus };
            // this.isSpinnerVisible = true;
            this.getList(this.lazyLoadEventDataInput);
        }
    }

    getList(data) {
        const isdelete = this.currentDeletedstatusBilling ? true : false;
        data.filters.isDeleted = isdelete
        const PagingData = { ...data, filters: listSearchFilterObjectCreation(data.filters), legalEntityId: this.id }
        if (this.id != undefined) {
            this.isSpinnerVisible = true;
            this.legalEntityService.getBillingList(PagingData).subscribe(res => {
                this.alertService.stopLoadingMessage();
                const data = res;
                this.isSpinnerVisible = false;
                this.billingInfoList = data[0]['results'].map(x => {
                    return {
                        ...x,
                        createdDate: x.createdDate ? this.datePipe.transform(x.createdDate, 'MM/dd/yyyy hh:mm a') : '',
                        updatedDate: x.updatedDate ? this.datePipe.transform(x.updatedDate, 'MM/dd/yyyy hh:mm a') : '',
                    }
                });
                this.billingInfoListOriginal=this.billingInfoList;
                if (this.billingInfoList.length > 0) {
                    this.totalRecords = data[0]['totalRecordsCount'];
                    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
                }
                else {
                    this.totalRecords = 0;
                    this.totalPages = 0;
                }
            }, err => {
                this.isSpinnerVisible = false;               
            })
        }
    }

    exportCSV(dt) {
        this.isSpinnerVisible = true;
        const isdelete = this.currentDeletedstatusBilling ? true : false;
        let PagingData = { "legalEntityId": this.id, "first": 0, "rows": dt.totalRecords, "sortOrder": 1, "filters": { "status": this.billingStatus, "isDeleted": isdelete }, "globalFilter": "" }
        let filters = Object.keys(dt.filters);
        filters.forEach(x => {
            PagingData.filters[x] = dt.filters[x].value;
        });
        this.legalEntityService.getBillingList(PagingData).subscribe(res => {
            this.alertService.stopLoadingMessage();
            const data = res;
            this.isSpinnerVisible = false;
            const vList = res[0]['results'].map(x => {
                return {
                    ...x,
                    createdDate: x.createdDate ? this.datePipe.transform(x.createdDate, 'MMM-dd-yyyy hh:mm a') : '',
                    updatedDate: x.updatedDate ? this.datePipe.transform(x.updatedDate, 'MMM-dd-yyyy hh:mm a') : '',
                }
            });
            dt._value = vList;
            dt.exportCSV();
            dt.value = this.billingInfoList;
            this.dismissModel();
            if (this.billingInfoList.length > 0) {
                this.totalRecords = data[0]['totalRecordsCount'];
                this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            }
            else {
                this.totalRecords = 0;
                this.totalPages = 0;
            }
        }, err => {
            this.isSpinnerVisible = false;           
        })
    }

    restorerecord: any = {}
    restoreRecord() {
        this.legalEntityService.restorebillingRecord(this.restorerecord.legalEntityBillingAddressId, this.userName).subscribe(res => {
            this.getDeleteListByStatusBilling(true)
            this.geListByStatusForBillingList(this.billingStatus);
            this.modal.close();
            this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
        }, err => {
            this.isSpinnerVisible = false;            
        });
    }

    restore(content, rowData) {
        this.restorerecord = rowData;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    closeHistoryModal() {
        $("#legalEntityHistory").modal("hide");
    }

    allAssetInfoOriginal: any = [];
    dateObject: any = {}
    dateFilterForTable(date, field) {
        if (date !== '' && moment(date).format('MMMM DD YYYY')) {
            this.billingInfoList = this.billingInfoListOriginal;
            const data = [...this.billingInfoList.filter(x => {
                if (moment(x.createdDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'createdDate') {
                    return x;
                } else if (moment(x.updatedDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'updatedDate') {
                    return x;
                }
            })]
            this.billingInfoList = data;
        } else {
            this.billingInfoList = this.billingInfoListOriginal;
        }
    }

    onFilterCountry(value) {
        this.CountryData(value);
    }
    
    setEditArray: any = [];
    countrycollection: any = []
    CountryData(value) {
        if (this.isViewMode == false) {
            this.setEditArray = [];
            if (this.isEditMode == true) {
                this.setEditArray.push(this.billingInfo.countryId ? this.billingInfo.countryId : 0);
            } else {
                this.setEditArray.push(0);
            }
            const strText = value ? value : '';
            this.commonService.smartDropDownList('Countries', 'countries_id', 'nice_name').subscribe(res => {
                // this.commonService.autoSuggestionSmartDropDownList('Countries', 'countries_id', 'nice_name', strText, true, 20, this.setEditArray.join()).subscribe(res => {
                this.countrycollection = res;
            }, err => {
                this.isSpinnerVisible = false
            });
        }
    }

    openTag(content) {
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    filterSiteNames(event) {
        this.sitesNamesList = this.sitesOriginal ? this.sitesOriginal : [];
        if (event.query != undefined && event.query != "") {
            this.getAllSites(event.query)
        } else {
            this.getAllSites('')
        }
    }
    // setEditArray: any = [];
    sitesOriginal: any = [];
    sitesNamesList: any = [];
    getAllSites(value) {
        // if(this.isViewMode==false){
        this.setEditArray = [];
        if (this.isViewMode == false) {
            const strText = value ? value : '';
            if (this.isEditMode == true) {
                this.setEditArray.push(this.legalEntityBillingAddressId ? this.legalEntityBillingAddressId : 0);
            } else {
                this.setEditArray.push(0);
            }
            if (this.id != undefined) {
                this.commonService.autoSuggestionSmartDropDownListWtihColumn('LegalEntityBillingAddress', 'LegalEntityBillingAddressId', 'SiteName', strText, 'LegalEntityId', this.id, 20, this.setEditArray.join(),this.currentUserMasterCompanyId).subscribe(res => {
                    this.sitesOriginal = res;
                    this.sitesNamesList = [];
                    this.sitesNamesList = [...this.sitesOriginal];
                    if (this.isEditMode == true && this.sitesNamesList && this.sitesNamesList.length != 0) {
                        this.sitesNamesList.forEach(element => {
                            if (element.label == this.billingInfo.siteName) {
                                this.billingInfo.siteName = element
                            }
                        });
                    }
                }, err => {
                    this.isSpinnerVisible = false
                });
            }
        }       
    }

    checkvalid(event) {
        var k;
        k = event.charCode;
        return ((k >= 48 && k <= 57));
    }

    showExistMsg: any = false;
    onSiteNameSelected() {
        this.showExistMsg = true;
    }

    checkfirstNameExist(event) {
        if (this.billingInfo.siteName == '') {
            this.showExistMsg = false;
        }
        if (event) {
            if (event == "") {
                this.showExistMsg = false;
            }
        }
        if (event != "") {
            this.sitesNamesList.forEach(element => {
                if (element.label == event) {
                    this.showExistMsg = true;
                } else {
                    this.showExistMsg = false;
                }
            });
        }
    }

    changeStatus(rowData) {}
}




