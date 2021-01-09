﻿import { Component, Input, EventEmitter, Output, OnInit, SimpleChanges } from '@angular/core';
import { LegalEntityService } from '../../../../services/legalentity.service';
import { AuthService } from '../../../../services/auth.service';
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
import { legalEntityShippingModel } from '../../../../models/legalEntity-shipping.model';
import { legalEntityInternationalShippingModel, legalEntityInternationalShipVia } from '../../../../models/legalEntity-internationalshipping.model';
import { getValueFromObjectByKey, getObjectById, editValueAssignByCondition, listSearchFilterObjectCreation, formatNumberAsGlobalSettingsModule } from '../../../../generic/autocomplete';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as $ from 'jquery';
import { CommonService } from '../../../../services/common.service';
import { ConfigurationService } from '../../../../services/configuration.service';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
@Component({
    selector: 'app-legal-entity-shipping',
    templateUrl: './legal-entity-shipping.component.html',
    styleUrls: ['./legal-entity-shipping.component.scss'],
    providers: [DatePipe]
})
export class EntityShippingComponent implements OnInit {
    @Input() savedGeneralInformationData;
    @Input() editGeneralInformationData;
    @Input() editMode;
    @Output() tab = new EventEmitter();

    @Input() selectedlegalEntityTab: string = "";
    @Input() legalEntityDataFromExternalComponents: any;
    disableSave: boolean = true;
    domesticShippingInfo = new legalEntityShippingModel()
    internationalShippingInfo = new legalEntityInternationalShippingModel()

    internationalShippingViaData: any = [];
    demosticShippingViaData: any = [];

    totalRecordsForInternationalShipVia: any;
    isEditInternationalShipVia: boolean = false;
    isEditDomesticShipVia: boolean = false;
    countryListOriginal: any[];
    countrycollection: any[];
    legalEntityShippingAddressId: number;
    selectedRowForDelete: any;
    selectedRowForDeleteInter: any;
    public sourcelegalEntity: any = {}
    internationalShippingId: number;
    shippingauditHisory: any[];
    shippingViaauditHisory: any[];
    intershippingViaauditHisory: any[];
    interShippingauditHisory: any[];
    mindate: any;
    formData = new FormData();

    domesticShippingHeaders = [
        { field: 'siteName', header: 'Site Name' },
        { field: 'address1', header: 'Address1' },
        { field: 'address2', header: 'Address2' },

        { field: 'city', header: 'City' },
        { field: 'state', header: 'State / Prov' },
        { field: 'postalCode', header: 'Postal Code' },
        { field: 'country', header: 'Country' },
        { field: 'createdDate', header: 'Created Date' },
        { field: 'createdBy', header: 'Created By' },
        { field: 'updatedDate', header: 'Updated Date' },
        { field: 'updatedBy', header: 'Updated By' },
    ]
    internationalShippingHeaders = [
        { field: 'exportLicense', header: 'Export License' },
        { field: 'description', header: 'Description' },
        { field: 'startDate', header: 'Start Date' },
        { field: 'expirationDate', header: 'Expiration Date' },
        { field: 'amount', header: 'Amount' },
        { field: 'country', header: 'Country' },
        { field: 'createdDate', header: 'Created Date' },
        { field: 'createdBy', header: 'Created By' },
        { field: 'updatedDate', header: 'Updated Date' },
        { field: 'updatedBy', header: 'Updated By' },

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
    pageIndexForInternational: number = 0;
    pageSizeForInternational: number = 10;
    pageIndexForInternationalShipVia: number = 0;
    pageSizeForInternationalShipVia: number = 10;
    totalRecordsForInternationalShipping: any;
    sourceViewforInterShipping: any;
    sourceViewforInterShippingVia: any;
    sourceViewforDomesticShippingVia: any;
    shipViaInternational = new legalEntityInternationalShipVia();
    shipViaDomestic = new legalEntityInternationalShipVia();
    editableRowIndexForIS: any;
    id: number;
    modal: NgbModalRef;
    totalRecords: any;
    pageIndex: number = 0;
    pageSize: number = 10;
    totalPages: number;
    totalRecordsInter: any;
    totalPagesInter: number;
    textDomesticMemo: any;
    textInternationalMemo: any;
    totalRecordsShipVia: any;
    totalPagesShipVia: number;
    interTotalRecords: number = 0;
    interTotalPages: number = 0;
    selectedColumnsForInternationShipViaTable = [
        { field: 'shipvia', header: 'Ship Via' },
        { field: 'shipAccountinfo', header: 'Shipping AccountInfo' },
        { field: 'memo', header: 'Memo' },
        // { field: 'isPrimary', header: 'Primary' },
        { field: 'createdDate', header: 'Created Date' },
        { field: 'createdBy', header: 'Created By' },
        { field: 'updatedDate', header: 'Updated Date' },
        { field: 'updatedBy', header: 'Updated By' },

    ];
    selectedShipViaInternational: any = {};
    selectedShipViaDomestic: any = {};
    shipViaDropdownList: any;
    legalEntityCode: any;
    legalEntityName: any;
    isDeleteMode: boolean = false;
    legalEntityShippingId: number;
    shippingViaDetailsId: number;
    selectedRowForDeleteVia: any;
    selectedRowForDeleteInterVia: any;
    selectedColumnsForDomesticShipVia = this.selectedColumnsForInternationShipViaTable;
    isViewMode: boolean = false;
    totalRecordsInternationalShipping: any = 0;
    totalPagesInternationalShipping: number = 0;
    currentDate = new Date();
    auditHisory: any;
    isEditMode: boolean;
    sourceAction: any;

    constructor(private legalEntityService: LegalEntityService, private authService: AuthService,
        private alertService: AlertService, private activeModal: NgbActiveModal, private modalService: NgbModal, private configurations: ConfigurationService,
        private commonService: CommonService, private datePipe: DatePipe,
    ) { }

    ngOnInit() {

        if (this.isViewMode == false) {
            if (this.editMode) {
                this.id = this.editGeneralInformationData.legalEntityId;

                if (typeof this.editGeneralInformationData.name != 'string') {
                    this.legalEntityName = this.editGeneralInformationData.name.label;
                } else {
                    this.legalEntityName = this.editGeneralInformationData.name;
                }
                this.legalEntityCode = this.editGeneralInformationData.companyCode;
                this.isViewMode = false;
            }
            else {
                if (this.legalEntityDataFromExternalComponents) {
                    this.id = this.legalEntityDataFromExternalComponents.legalEntityId;
                    this.legalEntityCode = this.legalEntityDataFromExternalComponents.companyCode;
                    this.isViewMode = true;
                    if (typeof this.legalEntityDataFromExternalComponents.name != 'string') {
                        this.legalEntityName = this.legalEntityDataFromExternalComponents.name.label;
                    } else {
                        this.legalEntityName = this.legalEntityDataFromExternalComponents.name;
                    }
                }
                else {
                    if (this.savedGeneralInformationData) {
                        this.id = this.savedGeneralInformationData.legalEntityId;
                        this.legalEntityCode = this.savedGeneralInformationData.companyCode;
                        this.isViewMode = false;
                        if (typeof this.savedGeneralInformationData.name != 'string') {
                            this.legalEntityName = this.savedGeneralInformationData.name.label;
                        } else {
                            this.legalEntityName = this.savedGeneralInformationData.name;

                        }
                    }
                }

                if (this.isViewMode == false) {
                    this.CountryData('');
                }
            }
        }

        if (this.isViewMode == false) {
            this.getshipvialistList('');
            this.getAllSites('');
        }
    }
    ngOnChanges(changes: SimpleChanges) {
        for (let property in changes) {
            if (property == 'selectedlegalEntityTab') {
                if (changes[property].currentValue == "Shipping") {
                    this.CountryData('');
                }
            }
            if (property == 'legalEntityDataFromExternalComponents') {

                if (changes[property].currentValue != {}) {
                    this.id = this.legalEntityDataFromExternalComponents.legalEntityId;
                    this.legalEntityCode = this.legalEntityDataFromExternalComponents.legalEntityCode;
                    this.legalEntityName = this.legalEntityDataFromExternalComponents.name;
                    this.isViewMode = true;
                    this.statusForDomestic = 'Active';
                    this.currentStatusForDomestic = 'Active';
                    this.currentStatusForInternational = 'Active';
                    setTimeout(() => {
                        if (!this.isViewMode) {
                            this.geListByStatusForDomestic(this.statusForDomestic);
                            this.geListByStatusForInternational(this.currentStatusForInternational);
                        }
                    }, 1200);
                }
            }
        }

    }
    getshipvialistList(value) {
        this.setEditArray = [];
        if (this.isEditDomesticShipVia == true || this.isEditInternationalShipVia) {
            this.setEditArray.push(this.shipViaDomestic.shipViaId ? this.shipViaDomestic.shipViaId : 0, this.shipViaInternational.shipViaId ? this.shipViaInternational.shipViaId : 0);
        } else {
            this.setEditArray.push(0);
        }
        const strText = value ? value : '';
        this.commonService.autoSuggestionSmartDropDownList('ShippingVia', 'ShippingViaId', 'Name', strText, true, 20, this.setEditArray.join()).subscribe(res => {
            this.shipViaDropdownList = res.map(x => {
                return {
                    ...x,
                    id: x.value,
                    name: x.label
                }
            });
        }, err => {
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        });


    }

    enableSave() {

        if (this.internationalShippingInfo.startDate != null || this.internationalShippingInfo.startDate != undefined) {
            this.mindate = this.internationalShippingInfo.startDate;
        }

        this.disableSave = false;

    }
    closeMyModel(type) {
        $(type).modal("hide");
        this.disableSave = true;
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    filterCountries(event) {
        this.countrycollection = this.countryListOriginal;

        this.countrycollection = [...this.countryListOriginal.filter(x => {
            return x.nice_name.toLowerCase().includes(event.query.toLowerCase())
        })]

    }
    // save Domestic Shipping 
    saveDomesticShipping() {
        const data = {
            ...this.domesticShippingInfo,
            createdBy: this.userName,
            updatedBy: this.userName,
            masterCompanyId: 1,
            legalEntityId: this.id
        }
        // create shipping 
        if (!this.isEditDomestic) {
            if (data.siteName && typeof data.siteName != 'string') {
                data.siteName = editValueAssignByCondition('label', data.siteName);
            }
            this.legalEntityService.newShippingAdd(data).subscribe(() => {
                this.shipViaDomestic = new legalEntityInternationalShipVia();
                this.alertService.showMessage(
                    'Success',
                    `Saved  Shipping Information Sucessfully `,
                    MessageSeverity.success
                );
                this.geListByStatusForDomestic(this.statusForDomestic);
            }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            })
        } else {
            // update shipping 
            if (data.siteName && typeof data.siteName != 'string') {
                data.siteName = editValueAssignByCondition('label', data.siteName);
            }
            this.legalEntityService.updateshippinginfo(data).subscribe(() => {
                this.shipViaDomestic = new legalEntityInternationalShipVia();
                this.alertService.showMessage(
                    'Success',
                    `Updated  Shipping Information Sucessfully `,
                    MessageSeverity.success
                );
                this.geListByStatusForDomestic(this.statusForDomestic);
            }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            })
        }

        $("#addShippingInfo").modal("hide");
        this.disableSave = true;

    }



    // View Details  data
    openShippinggView(rowData) {
        this.sourceViewforShipping = rowData;
    }


    patternMobilevalidationWithSpl(event: any) {
        const pattern = /[0-9\+\-()\ ]/;

        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) {
            event.preventDefault();
        }

    }
    editisPrimary: boolean = false;


    // edit Domestic details data 
    openEditDomestic(rowData) {
        this.editisPrimary = rowData.isPrimary;
        this.isEditDomestic = true;
        this.domesticShippingInfo = rowData;
        this.domesticShippingInfo = {
            ...rowData, stateOrProvince: rowData.state, countryId: rowData.countryid

        };
        this.legalEntityShippingAddressId = rowData.legalEntityShippingAddressId;
        if (this.isViewMode == false) {
            this.CountryData('');
            this.getAllSites(this.domesticShippingInfo.siteName);
        }
    }
    addDomesticShipping() {
        this.editisPrimary = false;
        this.isEditDomestic = false;
        this.domesticShippingInfo = new legalEntityShippingModel();
    }
    addInternationalShipping() {
        this.editisPrimary2 = false;
        this.isEditInternational = false;
        this.internationalShippingInfo = new legalEntityInternationalShippingModel();
        this.internationalShippingInfo.amount = '0.00';
    }

    deleteDomesticShipping(content, rowData) {
        if (!rowData.isPrimary) {
            this.isDeleteMode = true;
            this.selectedRowForDelete = rowData;
            this.selectedRowForDelete.updatedBy = this.userName,
                this.legalEntityShippingAddressId = rowData.legalEntityShippingAddressId

            this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });

        }
        else {
            $('#deleteoopsShipping').modal('show');
        }
    }
    deleteItemAndCloseModel() {
        const obj = {
            isActive: false,
            addressStatus: false,
            updatedBy: this.userName,
            legalEntityShippingAddressId: this.legalEntityShippingAddressId
        }

        if (this.legalEntityShippingAddressId > 0) {

            this.legalEntityService.updateStatusHipping(this.selectedRowForDelete).subscribe(
                response => this.saveCompleted(this.sourcelegalEntity), err => {
                    const errorLog = err;
                    this.errorMessageHandler(errorLog);
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
        this.geListByStatusForDomestic(this.statusForDomestic);
    }
    private saveFailedHelper(error: any) {

        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
    }
    deleteInternationalShipping(content, rowData) {
        if (!rowData.isPrimary) {
            this.isDeleteMode = true;
            this.selectedRowForDeleteInter = rowData;
            this.internationalShippingId = rowData.legalEntityInternationalShippingId

            this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });

        }
        else {
            $('#deleteoopsShipping').modal('show');
        }
    }
    deleteItemAndCloseModel1() {

        if (this.internationalShippingId > 0) {

            this.legalEntityService.deleteInternationalShipping(this.internationalShippingId, this.userName).subscribe(
                response => this.saveCompleted1(this.sourcelegalEntity), err => {
                    const errorLog = err;
                    this.errorMessageHandler(errorLog);
                });
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
        this.geListByStatusForInternational(this.currentStatusForInternational);
    }
    private saveFailedHelper1(error: any) {

        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
    }

    deleteShipVia(content, rowData) {
        if (!rowData.isPrimary) {
            this.isDeleteMode = true;
            this.selectedRowForDeleteVia = rowData;
            this.legalEntityShippingAddressId = rowData.legalEntityShippingAddressId;
            this.legalEntityShippingId = rowData.legalEntityShippingId

            this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });

        }
        else {
            $('#deleteoopsShipping').modal('show');
        }
    }
    deleteItemAndCloseModel2() {

        if (this.legalEntityShippingId > 0) {

            this.legalEntityService.deleteShipViaDetails(this.legalEntityShippingId, this.userName).subscribe(
                response => this.saveCompleted2(this.sourcelegalEntity), err => {
                    const errorLog = err;
                    this.errorMessageHandler(errorLog);
                });
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
        this.geListByStatusForDomesticShipVia(this.statusForDomesticVia);
    }
    private saveFailedHelper2(error: any) {

        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
    }

    deleteInternationalShippingVia(content, rowData) {

        if (!rowData.isPrimary) {
            this.isDeleteMode = true;
            this.selectedRowForDeleteInterVia = rowData;
            this.shippingViaDetailsId = rowData.shippingViaDetailsId;

            this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });

        }
        else {
            $('#deleteoopsShipping').modal('show');
        }
    }
    deleteItemAndCloseModel3() {

        if (this.shippingViaDetailsId > 0) {

            this.legalEntityService.deleteInternationalShipViaId(this.shippingViaDetailsId, this.userName).subscribe(
                response => this.saveCompleted3(this.sourcelegalEntity), err => {
                    const errorLog = err;
                    this.errorMessageHandler(errorLog);
                });
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
        this.geListByStatusForinternationalShipVia(this.statusForinternationalVia);
    }
    private saveFailedHelper3(error: any) {

        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
    }

    dismissModel() {
        this.modal.close();
    }
    openTag1(content) {

        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }
    saveInternationalShipping() {
        const data = {
            ...this.internationalShippingInfo,
            createdBy: this.userName,
            updatedBy: this.userName,
            masterCompanyId: 1,
            isActive: true,
            isDeleted: false,
            legalEntityId: this.id

        }
        if (!this.isEditInternational) {
            // save International SDhipping 
            this.legalEntityService.postInternationalShippingPost(data).subscribe((res) => {
                this.shipViaInternational = new legalEntityInternationalShipVia();
                this.geListByStatusForInternational(this.currentStatusForInternational);
                this.alertService.showMessage(
                    'Success',
                    `Saved International Shipping Information Sucessfully `,
                    MessageSeverity.success
                );
            }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            })
        } else {
            // update international 
            this.legalEntityService.updateInternationalShipping(data).subscribe(res => {
                this.shipViaInternational = new legalEntityInternationalShipVia();
                this.geListByStatusForInternational(this.currentStatusForInternational);
                this.isEditInternational = false;
                this.alertService.showMessage(
                    'Success',
                    `Saved International Shipping Information Sucessfully `,
                    MessageSeverity.success
                );
            }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            })

        }
        $("#addInternationalShippingInfo").modal("hide");
        this.disableSave = true;
    }


    openTag2(content) {

        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }


    internationalShippingPagination(event: { first: any; rows: number }) {
        const pageIndex = parseInt(event.first) / event.rows;
        this.pageIndexForInternational = pageIndex;
        this.pageSizeForInternational = event.rows;
    }

    async updateActiveorInActiveForIS(rowData) {

        rowData.status = rowData.isActive == true ? 'Active' : 'InActive';
        await this.legalEntityService.updateStatusForInternationalShippings(rowData.legalEntityInternationalShippingId, rowData.status, this.userName).subscribe(res => {

            this.geListByStatusForInternational(this.currentStatusForInternational);
            this.alertService.showMessage(
                'Success',
                `Sucessfully Updated  International Shipping Status`,
                MessageSeverity.success
            );
        }, err => {
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        })
    }
    async updateActiveorInActiveShipViaForIS(rowData) {
        rowData.status = rowData.isActive == true ? 'Active' : 'InActive';

        await this.legalEntityService.updateStatusForInternationalShippingsVia(rowData.shippingViaDetailsId, rowData.status, this.userName).subscribe(res => {
            this.geListByStatusForinternationalShipVia(this.statusForinternationalVia);

            this.alertService.showMessage(
                'Success',
                `Sucessfully Updated  International Shipping Via Status`,
                MessageSeverity.success
            );
        }, err => {
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        })
    }
    openTag3(content) {

        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }
    async updateActiveorInActiveForS(rowData) {

        // alert(JSON.stringify(rowData.isActive));
        rowData.status = rowData.isActive == true ? 'Active' : 'InActive';
        await this.legalEntityService.Shippingdetailsviastatus(rowData.legalEntityShippingId, rowData.status, this.userName).subscribe(res => {
            this.geListByStatusForDomesticShipVia(this.statusForDomesticVia);
            this.alertService.showMessage(
                'Success',
                `Sucessfully Updated   Shipping Via Status`,
                MessageSeverity.success
            );
        }, err => {
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        })
    }
    openInterShippingView(rowData) {
        this.sourceViewforInterShipping = rowData;
    }
    openInterShippingViewVia(rowData) {
        this.sourceViewforInterShippingVia = rowData;
    }
    openDomesticShippingViewVia(rowData) {
        this.sourceViewforDomesticShippingVia = rowData;
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
    openTag4(content) {

        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }
    editisPrimary2: boolean = false;
    getInternationalShippingById(rowData) {
        this.legalEntityService.getInternationalShippingById(rowData.legalEntityInternationalShippingId).subscribe(res => {
            this.isEditInternational = true;
            this.editisPrimary2 = rowData.isPrimary;
            this.internationalShippingInfo = {
                ...res,
                startDate: new Date(res.startDate),
                expirationDate: new Date(res.expirationDate),
                createdDate: new Date(res.expirationDate),
                updatedDate: new Date(res.expirationDate),
                amount: res.amount ? formatNumberAsGlobalSettingsModule(res.amount, 2) : '0.00'
            };
            this.CountryData('');
        }, err => {
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        })
    }
    selectedInternationalShipForShipVia(rowData) {
        this.selectedShipViaInternational = rowData;
        this.editisPrimary4 = false;
        this.statusForinternationalVia = 'Active';
        this.currentStatusForinternationalShipVia = 'Active';
        this.currentDeletedstatusinternationalShipVia = false;
        this.geListByStatusForinternationalShipVia(this.statusForinternationalVia);
    }
    selectedDomesticForShipVia(rowData) {
        this.editisPrimary3 = false;
        this.selectedShipViaDomestic = rowData;
        this.currentStatusForDomesticShipVia = 'Active';
        this.currentDeletedstatusShipVia = false;
        this.statusForDomesticVia = 'Active';
        this.geListByStatusForDomesticShipVia(this.currentStatusForDomesticShipVia);

    }
    closeInternationalModal() {
        $("#viewInter").modal("hide");
        this.isEditInternational = false;
        this.internationalShippingInfo = new legalEntityInternationalShippingModel()
    }
    closeDomesticSipViaView() {
        $("#viewDomesticVia").modal("hide");
    }
    async saveshipViaInternational() {
        const data = {
            ...this.shipViaInternational,
            legalEntityInternationalShippingId: this.selectedShipViaInternational.legalEntityInternationalShippingId,
            legalEntityId: this.id,
            masterCompanyId: 1,
            createdBy: this.userName,
            updatedBy: this.userName,

        }

        if (!this.isEditInternationalShipVia) {
            await this.legalEntityService.postInternationalShipVia(data).subscribe(res => {
                this.geListByStatusForinternationalShipVia(this.statusForinternationalVia);

                this.shipViaInternational = new legalEntityInternationalShipVia()
                this.alertService.showMessage(
                    'Success',
                    `Sucessfully Added Ship via for InternationalShipping`,
                    MessageSeverity.success
                );
            }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            })
        } else {
            this.disableShipVia = true;
            await this.legalEntityService.updateShipViaInternational(data).subscribe(res => {
                this.geListByStatusForinternationalShipVia(this.statusForinternationalVia);
                this.isEditInternationalShipVia = false;

                this.shipViaInternational = new legalEntityInternationalShipVia()
                this.alertService.showMessage(
                    'Success',
                    `Sucessfully Updated Ship via for InternationalShipping`,
                    MessageSeverity.success
                );
            }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            })
        }
        this.editisPrimary4 = false;

    }

    async saveshipViaDomestic() {
        const data = {
            ...this.shipViaDomestic,
            legalEntityShippingAddressId: this.selectedShipViaDomestic.legalEntityShippingAddressId,
            legalEntityId: this.id,
            masterCompanyId: 1,
            createdBy: this.userName,
            updatedBy: this.userName,

        }
        if (!this.isEditDomesticShipVia) {
            await this.legalEntityService.newShippingViaAdd(data).subscribe(res => {
                this.geListByStatusForDomesticShipVia(this.statusForDomesticVia);

                this.shipViaDomestic = new legalEntityInternationalShipVia()
                this.alertService.showMessage(
                    'Success',
                    `Sucessfully Added Ship via for Shipping`,
                    MessageSeverity.success
                );
            }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            })
        } else {
            this.disableShipVia = true;
            await this.legalEntityService.updateshippingViainfo(data).subscribe(res => {
                this.geListByStatusForDomesticShipVia(this.statusForDomesticVia);
                this.isEditDomesticShipVia = false;

                this.shipViaDomestic = new legalEntityInternationalShipVia()
                this.alertService.showMessage(
                    'Success',
                    `Sucessfully Updated Ship via for Shipping`,
                    MessageSeverity.success
                );
            }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            })
        }
        this.editisPrimary3 = false;
    }





    internationalShippingViaPagination(event: { first: any; rows: number }) {

        const pageIndex = parseInt(event.first) / event.rows;
        this.pageIndexForInternationalShipVia = pageIndex;
        this.pageSizeForInternationalShipVia = this.pageSizeForInternationalShipVia;

    }
    editisPrimary4: boolean = false;
    editInternationalShipVia(rowData) {
        this.editisPrimary4 = rowData.isPrimary;
        this.disableShipVia = true;
        this.isEditInternationalShipVia = true;
        this.shipViaInternational = { ...rowData, shippingAccountInfo: rowData.shipAccountinfo, shipViaId: rowData.shipviaId };



    }
    editisPrimary3: boolean = false;

    editDomesticShipVia(rowData) {
        this.editisPrimary3 = rowData.isPrimary;
        this.disableShipVia = true;
        this.isEditDomesticShipVia = true;
        this.shipViaDomestic = { ...rowData, shippingAccountInfo: rowData.shipAccountinfo, shipViaId: rowData.shipviaId };


    }
    closeInternationalModalView() {
        $("#viewInterViaView").modal("hide");
    }
    closeInternationalModalShiVia() {
        $("#addInternationShipVia").modal("hide");
    }
    closIntSHipVia() {
        $("#interSipvia").modal("hide");
    }
    resetShipViaInternational() {
        $("#addInternationShipVia").modal("hide");
        this.shipViaInternational = new legalEntityInternationalShipVia();
    }
    resetShipViaDomestic() {
        this.shipViaDomestic = new legalEntityInternationalShipVia();
        $("#addDomesticShipVia").modal("hide");
    }
    closeDomesticViaModel() {
        $("#addDomesticShipVia").modal("hide");
    }
    closeDomesticView() {
        $("#viewShipping").modal("hide");
    }
    nextClick() {
        this.tab.emit('Documents');
    }
    backClick() {
        this.tab.emit('Billing');
    }


    async updateActiveorInActiveForShipping(rowData) {

        rowData.status = rowData.isActive == true ? 'Active' : 'InActive';
        await this.legalEntityService.updateStatusForShippingDetails(rowData.legalEntityShippingAddressId, rowData.status, this.userName).subscribe(res => {
            this.geListByStatusForDomestic(this.statusForDomestic);
            this.alertService.showMessage(
                'Success',
                `Sucessfully Updated   Shipping Status`,
                MessageSeverity.success
            );
        }, err => {
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        })
    }
    openShipaddressHistory(content, row) {

        this.legalEntityService.getlegalEntityShippingHistory(this.id, row.legalEntityShippingAddressId).subscribe(
            results => this.onAuditHistoryLoadSuccessful(results, content), err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            });
    }
    private onAuditHistoryLoadSuccessful(auditHistory, content) {


        this.shippingauditHisory = auditHistory;

        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false, windowClass: 'assetMange' });

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

        this.legalEntityService.getlegalEntityInterShippingHistory(this.id, row.legalEntityInternationalShippingId).subscribe(
            results => this.onInterAuditHistoryLoadSuccessful(results, content), err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            });
    }
    private onInterAuditHistoryLoadSuccessful(auditHistory, content) {
        this.interShippingauditHisory = auditHistory;
        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false, windowClass: 'assetMange' });

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

    openShipViaHistory(content, rowData) {

        this.legalEntityService.getlegalEntityShipViaHistory(this.id, rowData.legalEntityShippingAddressId, rowData.legalEntityShippingId).subscribe(
            results => this.onAuditShipViaHistoryLoadSuccessful(results, content), err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            });
    }
    private onAuditShipViaHistoryLoadSuccessful(auditHistory, content) {


        this.shippingViaauditHisory = auditHistory;

        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false, windowClass: 'assetMange' });

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

    openInterShipViaHistory(content, rowData) {
        this.legalEntityService.getlegalEntityInterShipViaHistory(this.id, rowData.legalEntityInternationalShippingId, rowData.shippingViaDetailsId).subscribe(
            results => this.onAuditInterShipViaHistoryLoadSuccessful(results, content), err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            });
    }
    private onAuditInterShipViaHistoryLoadSuccessful(auditHistory, content) {


        this.intershippingViaauditHisory = auditHistory;

        this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false, windowClass: 'assetMange' });

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
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=legalEntityShippingAddress&fileName=legalEntityShippingAddress.xlsx`;
        window.location.assign(url);
    }
    customShippingExcelUpload(event) {
        const file = event.target.files;

        if (file.length > 0) {
            this.formData.append('file', file[0])
            this.formData.append('masterCompanyId', this.authService.currentUser.masterCompanyId.toString())
            this.formData.append('createdBy', this.userName);
            this.formData.append('updatedBy', this.userName);
            this.formData.append('isActive', 'true');
            this.formData.append('isDeleted', 'false');
            const data = {
                'masterCompanyId': this.authService.currentUser.masterCompanyId,
                'createdBy': this.userName,
                'updatedBy': this.userName,
                'isActive': true,
                'isDeleted': false
            }
            this.legalEntityService.ShippingFileUpload(this.formData, this.id).subscribe(res => {
                event.target.value = '';
                this.formData = new FormData();
                this.geListByStatusForDomestic(this.statusForDomestic);
                this.alertService.showMessage(
                    'Success',
                    `Successfully Uploaded  `,
                    MessageSeverity.success
                );
            }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            })
        }
    }

    sampleExcelDownloadForInternationalShipping() {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=LegalEntityInternationalShippingAddress&fileName=LegalEntityInternationalShippingAddress.xlsx`;
        window.location.assign(url);
    }
    customInternationalShippingExcelUpload(event) {
        const file = event.target.files;

        if (file.length > 0) {
            this.formData.append('file', file[0])
            this.formData.append('masterCompanyId', this.authService.currentUser.masterCompanyId.toString())
            this.formData.append('createdBy', this.userName);
            this.formData.append('updatedBy', this.userName);
            this.formData.append('isActive', 'true');
            this.formData.append('isDeleted', 'false');
            const data = {
                'masterCompanyId': this.authService.currentUser.masterCompanyId,
                'createdBy': this.userName,
                'updatedBy': this.userName,
                'isActive': true,
                'isDeleted': false
            }
            this.legalEntityService.InternationalShippingUpload(this.formData, this.id).subscribe(res => {
                event.target.value = '';
                this.formData = new FormData();
                this.geListByStatusForInternational(this.currentStatusForInternational);
                this.alertService.showMessage(
                    'Success',
                    `Successfully Uploaded  `,
                    MessageSeverity.success
                );
            }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            })
        }
    }
    setEditArray: any = [];
    onFilterCountry(value) {
        this.CountryData(value);
    }
    CountryData(value) {
        if (this.isViewMode == false) {
            this.setEditArray = [];
            if (this.isEditDomestic == true) {
                this.setEditArray.push(this.domesticShippingInfo.countryId ? this.domesticShippingInfo.countryId : 0);
            } else if (this.isEditInternational == true) {
                this.setEditArray.push(this.internationalShippingInfo.shipToCountryId ? this.internationalShippingInfo.shipToCountryId : 0);
            } else {
                this.setEditArray.push(0);
            }
            const strText = value ? value : '';
            this.commonService.smartDropDownList('Countries', 'countries_id', 'nice_name').subscribe(res => {
                // this.commonService.autoSuggestionSmartDropDownList('Countries', 'countries_id', 'nice_name', strText, true, 20, this.setEditArray.join()).subscribe(res => {
                this.countryListOriginal = res.map(x => {
                    return {
                        ...x,
                        countryId: x.value,
                        nice_name: x.label
                    }
                });;
            }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            });
        }
    }


    //Domestic shipping

    lazyLoadEventDataInput: any;
    lazyLoadEventData: Event;
    statusForDomestic: string = 'Active';
    currentStatusForDomestic: string = 'Active';
    filterText: any = '';
    currentDeletedstatus: boolean = false;
    isSpinnerVisible: boolean = false;
    loadDataForDomestic(event) {
        this.lazyLoadEventData = event;

        const pageIndex = parseInt(event.first) / event.rows;;
        this.pageIndex = pageIndex;
        this.pageSize = event.rows;
        event.first = pageIndex;
        this.lazyLoadEventDataInput = event;
        this.lazyLoadEventDataInput.legalEntityId = this.id;
        this.lazyLoadEventDataInput.filters = {
            ...this.lazyLoadEventDataInput.filters,
            status: this.statusForDomestic ? this.statusForDomestic : 'Active',
        }

        // if(this.isViewMode==false){ 
        if (this.filterText == '') {
            this.getListForDomestic(this.lazyLoadEventDataInput);
        } else {
            this.globalSearchForDomestic(this.filterText);
        }
        // }
    }
    first: any = 0;
    geListByStatusForDomestic(status) {

        const pageIndex = 0;
        this.pageIndex = pageIndex;
        this.pageSize = this.lazyLoadEventDataInput ? this.lazyLoadEventDataInput.rows : 10;
        this.lazyLoadEventDataInput.first = pageIndex;
        this.statusForDomestic = status;
        this.currentStatusForDomestic = status;
        this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: status };
        const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
        this.first = 0;
        PagingData.page = 1;
        this.getListForDomestic(PagingData);
    }
    globalSearchForDomestic(value) {
        this.pageIndex = this.lazyLoadEventDataInput.rows > 10 ? parseInt(this.lazyLoadEventDataInput.first) / this.lazyLoadEventDataInput.rows : 0;
        this.pageSize = this.lazyLoadEventDataInput.rows;
        this.lazyLoadEventDataInput.first = this.pageIndex;
        this.lazyLoadEventDataInput.legalEntityId = this.id;
        this.lazyLoadEventDataInput.globalFilter = value;
        this.filterText = value;
        this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.statusForDomestic };
        this.getListForDomestic(this.lazyLoadEventDataInput);
    }
    getDeleteListByStatusForDomestic(value) {

        this.currentDeletedstatus = true;
        const pageIndex = 0;
        this.pageIndex = pageIndex;
        this.pageSize = this.lazyLoadEventDataInput.rows;
        this.lazyLoadEventDataInput.first = pageIndex;
        if (value == true) {
            this.currentDeletedstatus = true;
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.statusForDomestic };

            this.getListForDomestic(this.lazyLoadEventDataInput);
        } else {
            this.currentDeletedstatus = false;
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.statusForDomestic };

            this.getListForDomestic(this.lazyLoadEventDataInput);
        }
    }

    getListForDomestic(data) {

        const isdelete = this.currentDeletedstatus ? true : false;
        data.filters.isDeleted = isdelete
        const PagingData = { ...data, filters: listSearchFilterObjectCreation(data.filters), legalEntityId: this.id }
        if (this.id != undefined) {
            this.isSpinnerVisible = true;
            PagingData.legalEntityId = this.id;
            this.legalEntityService.getDomesticShipList(PagingData).subscribe(res => {
                const data = res;
                this.isSpinnerVisible = false;
                this.domesticShippingData = data[0]['results'].map(x => {
                    return {
                        ...x,
                        createdDate: x.createdDate ? this.datePipe.transform(x.createdDate, 'MM/dd/yyyy hh:mm a') : '',
                        updatedDate: x.updatedDate ? this.datePipe.transform(x.updatedDate, 'MM/dd/yyyy hh:mm a') : '',
                    }
                });
                if (this.domesticShippingData.length > 0) {
                    this.totalRecords = data[0]['totalRecordsCount'];
                    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
                }
                else {
                    this.totalRecords = 0;
                    this.totalPages = 0;
                }
            }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            })
        }
    }

    restorerecord: any = {}



    closeHistoryModal() {
        $("#legalEntityHistory").modal("hide");
    }

    allAssetInfoOriginal: any = [];
    dateObject: any = {}
    dateFilterForTable(date, field) {
        this.dateObject = {}
        date = moment(date).format('MM/DD/YYYY'); moment(date).format('MM/DD/YY');
        if (date != "" && moment(date, 'MM/DD/YYYY', true).isValid()) {
            if (field == 'createdDate') {
                this.dateObject = { 'createdDate': date }
            } else if (field == 'updatedDate') {
                this.dateObject = { 'updatedDate': date }
            }

            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, ...this.dateObject };
            const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
            this.getListForDomestic(PagingData);
        } else {
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, ...this.dateObject };
            if (this.lazyLoadEventDataInput.filters && this.lazyLoadEventDataInput.filters.createdDate) {
                delete this.lazyLoadEventDataInput.filters.createdDate;
            }
            if (this.lazyLoadEventDataInput.filters && this.lazyLoadEventDataInput.filters.updatedDate) {
                delete this.lazyLoadEventDataInput.filters.updatedDate;
            }
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, ...this.dateObject };
            const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
            this.getListForDomestic(PagingData);
        }

    }






    //International shipping



    statusForInternational: string = 'Active';
    currentStatusForInternational: string = 'Active';

    currentDeletedstatusForInternational: boolean = false;
    loadDataForInternational(event) {
        this.lazyLoadEventData = event;
        const pageIndex = parseInt(event.first) / event.rows;;
        this.pageIndex = pageIndex;
        this.pageSize = event.rows;
        event.first = pageIndex;
        this.lazyLoadEventDataInput = event;
        this.lazyLoadEventDataInput.legalEntityId = this.id;
        this.lazyLoadEventDataInput.filters = {
            ...this.lazyLoadEventDataInput.filters,
            status: this.statusForInternational ? this.statusForInternational : 'Active',
        }
        if (this.filterText == '') {
            this.getListForInternational(this.lazyLoadEventDataInput);
        } else {
            this.globalSearchForInternational(this.filterText);
        }
    }

    geListByStatusForInternational(status) {
        const pageIndex = 0;
        this.pageIndex = pageIndex;
        this.pageSize = this.lazyLoadEventDataInput.rows;
        this.lazyLoadEventDataInput.legalEntityId = this.id;
        this.lazyLoadEventDataInput.first = pageIndex;
        this.statusForInternational = status;
        this.currentStatusForInternational = status;
        this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: status };
        const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
        this.first = 0;
        PagingData.page = 1;
        this.getListForInternational(PagingData);
    }
    globalSearchForInternational(value) {
        this.pageIndex = this.lazyLoadEventDataInput.rows > 10 ? parseInt(this.lazyLoadEventDataInput.first) / this.lazyLoadEventDataInput.rows : 0;
        this.pageSize = this.lazyLoadEventDataInput.rows;
        this.lazyLoadEventDataInput.first = this.pageIndex;
        this.lazyLoadEventDataInput.legalEntityId = this.id;
        this.lazyLoadEventDataInput.globalFilter = value;
        this.filterText = value;
        this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.statusForInternational };
        this.getListForInternational(this.lazyLoadEventDataInput);
    }
    getDeleteListByStatusForInternational(value) {
        this.currentDeletedstatusForInternational = true;
        const pageIndex = 0;
        this.pageIndex = pageIndex;
        this.pageSize = this.lazyLoadEventDataInput.rows;
        this.lazyLoadEventDataInput.first = pageIndex;
        if (value == true) {
            this.currentDeletedstatusForInternational = true;
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.statusForInternational };

            this.getListForInternational(this.lazyLoadEventDataInput);
        } else {
            this.currentDeletedstatusForInternational = false;
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.statusForInternational };

            this.getListForInternational(this.lazyLoadEventDataInput);
        }
    }

    checkvalid(event) {
        var k;
        k = event.charCode;
        return ((k >= 48 && k <= 57));
    }
    getListForInternational(data) {

        const isdelete = this.currentDeletedstatusForInternational ? true : false;
        data.filters.isDeleted = isdelete
        const PagingData = { ...data, filters: listSearchFilterObjectCreation(data.filters), legalEntityId: this.id }
        if (this.id != undefined) {
            this.isSpinnerVisible = true;
            this.legalEntityService.getinternationalShippingData(PagingData).subscribe(res => {
                const data = res;
                this.isSpinnerVisible = false;
                this.internationalShippingData = data[0]['results'].map(x => {
                    return {
                        ...x,
                        createdDate: x.createdDate ? this.datePipe.transform(x.createdDate, 'MM/dd/yyyy hh:mm a') : '',
                        updatedDate: x.updatedDate ? this.datePipe.transform(x.updatedDate, 'MM/dd/yyyy hh:mm a') : '',
                        startDate: x.startDate ? this.datePipe.transform(x.startDate, 'MM/dd/yyyy hh:mm a') : '',
                        expirationDate: x.expirationDate ? this.datePipe.transform(x.expirationDate, 'MM/dd/yyyy hh:mm a') : '',
                    }
                });
                if (this.internationalShippingData.length > 0) {
                    this.totalRecordsForInternationalShipping = data[0]['totalRecordsCount'];
                    this.totalPages = Math.ceil(this.totalRecordsForInternationalShipping / this.pageSize);
                }
                else {
                    this.totalRecordsForInternationalShipping = 0;
                    this.totalPages = 0;
                }
            }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            })
        }
    }




    dateFilterForTableForInternational(date, field) {
        this.dateObject = {}
        date = moment(date).format('MM/DD/YYYY'); moment(date).format('MM/DD/YY');
        if (date != "" && moment(date, 'MM/DD/YYYY', true).isValid()) {
            if (field == 'createdDate') {
                this.dateObject = { 'createdDate': date }
            } else if (field == 'updatedDate') {
                this.dateObject = { 'updatedDate': date }
            } else if (field == 'startDate') {
                this.dateObject = { 'startDate': date }
            } else if (field == 'expirationDate') {
                this.dateObject = { 'expirationDate': date }
            }

            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, ...this.dateObject };
            const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
            this.getListForInternational(PagingData);
        } else {
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, ...this.dateObject };
            if (this.lazyLoadEventDataInput.filters && this.lazyLoadEventDataInput.filters.createdDate) {
                delete this.lazyLoadEventDataInput.filters.createdDate;
            }
            if (this.lazyLoadEventDataInput.filters && this.lazyLoadEventDataInput.filters.updatedDate) {
                delete this.lazyLoadEventDataInput.filters.updatedDate;
            }
            if (this.lazyLoadEventDataInput.filters && this.lazyLoadEventDataInput.filters.startDate) {
                delete this.lazyLoadEventDataInput.filters.startDate;
            }
            if (this.lazyLoadEventDataInput.filters && this.lazyLoadEventDataInput.filters.expirationDate) {
                delete this.lazyLoadEventDataInput.filters.expirationDate;
            }
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, ...this.dateObject };
            const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
            this.getListForInternational(PagingData);
        }

    }



    //Domestic shipping  Via 


    loadDataForDomesticShipVia(event) {
        this.lazyLoadEventData = event;
        const pageIndex = parseInt(event.first) / event.rows;;
        this.pageIndex = pageIndex;
        this.pageSize = event.rows;
        event.first = pageIndex;
        this.lazyLoadEventDataInput = event;
        this.lazyLoadEventDataInput.legalEntityId = this.id;
        this.lazyLoadEventDataInput.filters = {
            ...this.lazyLoadEventDataInput.filters,
            status: this.statusForDomestic ? this.statusForDomestic : 'Active',
        }

        //  if(this.isViewMode==false){
        if (this.filterText == '') {
            this.getListForDomesticShipVia(this.lazyLoadEventDataInput);
        } else {
            this.globalSearchForDomesticShipVia(this.filterText);
        }
        //  }
    }
    currentStatusForDomesticShipVia: any = 'Active';
    statusForDomesticVia: string = 'Active';
    currentDeletedstatusShipVia: boolean = false;
    geListByStatusForDomesticShipVia(status) {
        const pageIndex = 0;
        this.pageIndex = pageIndex;
        this.pageSize = this.lazyLoadEventDataInput.rows;
        this.lazyLoadEventDataInput.legalEntityId = this.id;
        this.lazyLoadEventDataInput.first = pageIndex;
        this.statusForDomesticVia = status;
        this.currentStatusForDomesticShipVia = status;
        this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: status };
        const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
        this.first = 0;
        PagingData.page = 1;
        this.getListForDomesticShipVia(PagingData);
    }
    globalSearchForDomesticShipVia(value) {
        this.pageIndex = this.lazyLoadEventDataInput.rows > 10 ? parseInt(this.lazyLoadEventDataInput.first) / this.lazyLoadEventDataInput.rows : 0;
        this.pageSize = this.lazyLoadEventDataInput.rows;
        this.lazyLoadEventDataInput.first = this.pageIndex;
        this.lazyLoadEventDataInput.legalEntityId = this.id;
        this.lazyLoadEventDataInput.globalFilter = value;
        this.filterText = value;
        this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.statusForDomesticVia };
        this.getListForDomesticShipVia(this.lazyLoadEventDataInput);
    }
    getDeleteListByStatusForDomesticShipVia(value) {

        this.currentDeletedstatusShipVia = true;
        const pageIndex = 0;
        this.pageIndex = pageIndex;
        this.pageSize = this.lazyLoadEventDataInput.rows;
        this.lazyLoadEventDataInput.first = pageIndex;
        if (value == true) {
            this.currentDeletedstatusShipVia = true;
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.statusForDomesticVia };

            this.getListForDomesticShipVia(this.lazyLoadEventDataInput);
        } else {
            this.currentDeletedstatusShipVia = false;
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.statusForDomesticVia };

            this.getListForDomesticShipVia(this.lazyLoadEventDataInput);
        }
    }
    isSpinnerVisibleDomesticShivia: boolean = false;
    totalRecordsForDomesticShipVia: any;
    getListForDomesticShipVia(data) {

        const isdelete = this.currentDeletedstatusShipVia ? true : false;
        data.filters.isDeleted = isdelete
        const PagingData = { ...data, filters: listSearchFilterObjectCreation(data.filters), legalEntityShippingAddressId: this.selectedShipViaDomestic.legalEntityShippingAddressId }
        if (this.selectedShipViaDomestic && this.selectedShipViaDomestic.legalEntityShippingAddressId != undefined) {
            this.isSpinnerVisibleDomesticShivia = true;
            this.legalEntityService.getDomesticShipViaList(PagingData).subscribe(res => {
                const data = res;
                this.isSpinnerVisibleDomesticShivia = false;
                this.demosticShippingViaData = data[0]['results'].map(x => {
                    return {
                        ...x,
                        createdDate: x.createdDate ? this.datePipe.transform(x.createdDate, 'MM/dd/yyyy hh:mm a') : '',
                        updatedDate: x.updatedDate ? this.datePipe.transform(x.updatedDate, 'MM/dd/yyyy hh:mm a') : '',
                    }
                });
                if (this.demosticShippingViaData.length > 0) {
                    this.totalRecordsForDomesticShipVia = data[0]['totalRecordsCount'];
                    this.totalPages = Math.ceil(this.totalRecordsForDomesticShipVia / this.pageSize);
                }
                else {
                    this.totalRecordsForDomesticShipVia = 0;
                    this.totalPages = 0;
                }
            }, err => {
                this.isSpinnerVisibleDomesticShivia = false;
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            })
        }
    }

    dateFilterForTableDomesticShipVia(date, field) {
        this.dateObject = {}
        date = moment(date).format('MM/DD/YYYY'); moment(date).format('MM/DD/YY');
        if (date != "" && moment(date, 'MM/DD/YYYY', true).isValid()) {
            if (field == 'createdDate') {
                this.dateObject = { 'createdDate': date }
            } else if (field == 'updatedDate') {
                this.dateObject = { 'updatedDate': date }
            }

            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, ...this.dateObject };
            const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
            this.getListForDomesticShipVia(PagingData);
        } else {
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, ...this.dateObject };
            if (this.lazyLoadEventDataInput.filters && this.lazyLoadEventDataInput.filters.createdDate) {
                delete this.lazyLoadEventDataInput.filters.createdDate;
            }
            if (this.lazyLoadEventDataInput.filters && this.lazyLoadEventDataInput.filters.updatedDate) {
                delete this.lazyLoadEventDataInput.filters.updatedDate;
            }
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, ...this.dateObject };
            const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
            this.getListForDomesticShipVia(PagingData);
        }


    }
    //International  shipping  Via 

    loadDatasInternationalShipVia(event) {
        event.filters.status = this.currentStatusForinternationalShipVia ? this.currentStatusForinternationalShipVia : 'Active'
        this.lazyLoadEventData = event;
        const pageIndex = parseInt(event.first) / event.rows;
        this.pageIndex = pageIndex;
        this.pageSize = event.rows;
        event.first = pageIndex;
        this.lazyLoadEventDataInput = event;
        this.lazyLoadEventDataInput.legalEntityId = this.id;
        this.lazyLoadEventDataInput.filters = {
            ...this.lazyLoadEventDataInput.filters,
            status: this.currentStatusForinternationalShipVia ? this.currentStatusForinternationalShipVia : 'Active',
        }
        if (this.filterText == '') {
            this.geListByStatusForinternationalShipVia(this.lazyLoadEventDataInput);
        } else {
            this.globalSearchForinternationalShipVia(this.filterText);
        }
    }
    currentStatusForinternationalShipVia: any = 'Active';
    statusForinternationalVia: string = 'Active';
    currentDeletedstatusinternationalShipVia: boolean = false;
    geListByStatusForinternationalShipVia(status) {
        const pageIndex = 0;
        this.pageIndex = pageIndex;
        this.pageSize = this.lazyLoadEventDataInput.rows;
        this.lazyLoadEventDataInput.legalEntityId = this.id;
        this.lazyLoadEventDataInput.first = pageIndex;
        if (typeof status === 'string') {
            this.statusForinternationalVia = status;
            this.currentStatusForinternationalShipVia = status;
        } else {
            this.statusForinternationalVia = this.statusForinternationalVia;
            this.currentStatusForinternationalShipVia = this.currentStatusForinternationalShipVia;
        }
        this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.currentStatusForinternationalShipVia ? this.currentStatusForinternationalShipVia : status };
        const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
        this.first = 0;
        PagingData.page = 1;
        this.getListForinternationalShipVia(PagingData);
    }
    globalSearchForinternationalShipVia(value) {

        this.pageIndex = this.lazyLoadEventDataInput.rows > 10 ? parseInt(this.lazyLoadEventDataInput.first) / this.lazyLoadEventDataInput.rows : 0;
        this.pageSize = this.lazyLoadEventDataInput.rows;
        this.lazyLoadEventDataInput.first = this.pageIndex;
        this.lazyLoadEventDataInput.legalEntityId = this.id;
        this.lazyLoadEventDataInput.globalFilter = value;
        this.filterText = value;
        this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.statusForinternationalVia };
        this.getListForinternationalShipVia(this.lazyLoadEventDataInput);




    }
    getDeleteListByStatusForinternationalShipVia(value) {

        this.currentDeletedstatusinternationalShipVia = true;
        const pageIndex = 0;
        this.pageIndex = pageIndex;
        this.pageSize = this.lazyLoadEventDataInput.rows;
        this.lazyLoadEventDataInput.first = pageIndex;
        if (value == true) {
            this.currentDeletedstatusinternationalShipVia = true;
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.statusForinternationalVia };

            this.getListForinternationalShipVia(this.lazyLoadEventDataInput);
        } else {
            this.currentDeletedstatusinternationalShipVia = false;
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.statusForinternationalVia };

            this.getListForinternationalShipVia(this.lazyLoadEventDataInput);
        }
    }
    isSpinnerVisibleInernShipVia: any = false;
    totalRecordsForInterShipVia: any;
    getListForinternationalShipVia(data) {
        const isdelete = this.currentDeletedstatusinternationalShipVia ? this.currentDeletedstatusinternationalShipVia : false;
        data.filters.isDeleted = isdelete;
        // debugger;
        const PagingData = { ...data, filters: listSearchFilterObjectCreation(data.filters), legalEntityInternationalShippingId: this.selectedShipViaInternational.legalEntityInternationalShippingId }
        if (this.selectedShipViaInternational && this.selectedShipViaInternational.legalEntityInternationalShippingId != undefined) {
            this.isSpinnerVisibleInernShipVia = true;
            this.legalEntityService.getInternationalShipViaList(PagingData).subscribe(res => {
                const data = res;
                this.isSpinnerVisibleInernShipVia = false;
                this.internationalShippingViaData = data[0]['results'].map(x => {
                    return {
                        ...x,
                        createdDate: x.createdDate ? this.datePipe.transform(x.createdDate, 'MM/dd/yyyy hh:mm a') : '',
                        updatedDate: x.updatedDate ? this.datePipe.transform(x.updatedDate, 'MM/dd/yyyy hh:mm a') : '',
                    }
                });
                if (this.internationalShippingViaData.length > 0) {
                    this.totalRecordsForInterShipVia = data[0]['totalRecordsCount'];
                    this.totalPages = Math.ceil(this.totalRecordsForInterShipVia / this.pageSize);
                }
                else {
                    this.totalRecordsForInterShipVia = 0;
                    this.totalPages = 0;
                }
            }, err => {
                this.isSpinnerVisibleInernShipVia = false;
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            })
        }
    }

    dateFilterForTableinternationalShipVia(date, field) {
        this.dateObject = {}
        date = moment(date).format('MM/DD/YYYY'); moment(date).format('MM/DD/YY');
        if (date != "" && moment(date, 'MM/DD/YYYY', true).isValid()) {
            if (field == 'createdDate') {
                this.dateObject = { 'createdDate': date }
            } else if (field == 'updatedDate') {
                this.dateObject = { 'updatedDate': date }
            }

            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, ...this.dateObject };
            const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
            this.getListForinternationalShipVia(PagingData);
        } else {
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, ...this.dateObject };
            if (this.lazyLoadEventDataInput.filters && this.lazyLoadEventDataInput.filters.createdDate) {
                delete this.lazyLoadEventDataInput.filters.createdDate;
            }
            if (this.lazyLoadEventDataInput.filters && this.lazyLoadEventDataInput.filters.updatedDate) {
                delete this.lazyLoadEventDataInput.filters.updatedDate;
            }
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, ...this.dateObject };
            const PagingData = { ...this.lazyLoadEventDataInput, filters: listSearchFilterObjectCreation(this.lazyLoadEventDataInput.filters) }
            this.getListForinternationalShipVia(PagingData);
        }

    }


    tableName: any;
    tableColumnId: any;
    restoreIdForGet;

    restoreRecord() {
        if (this.restoreTypeId == 1) {
            this.tableName = "LegalEntityShippingAddress";
            this.tableColumnId = "LegalEntityShippingAddressId";
            this.restoreIdForGet = this.restorerecord.legalEntityShippingAddressId;
        } else if (this.restoreTypeId == 2) {
            this.tableName = "LegalEntityInternationalShipping";
            this.tableColumnId = "LegalEntityInternationalShippingId";
            this.restoreIdForGet = this.restorerecord.legalEntityInternationalShippingId;
        } else if (this.restoreTypeId == 3) {
            this.tableName = "LegalEntityShipping";
            this.tableColumnId = "LegalEntityShippingId";
            this.restoreIdForGet = this.restorerecord.legalEntityShippingId;
        } else if (this.restoreTypeId == 4) {
            this.tableName = "LegalEntityInterShipViaDetails";
            this.tableColumnId = "ShippingViaDetailsId";
            this.restoreIdForGet = this.restorerecord.shippingViaDetailsId;
        }
        if (this.restoreTypeId != 1) {
            this.commonService.updatedeletedrecords(this.tableName, this.tableColumnId, this.restoreIdForGet).subscribe(res => {
                if (this.restoreTypeId == 2) {
                    this.getDeleteListByStatusForInternational(true);
                } else if (this.restoreTypeId == 3) {
                    this.getDeleteListByStatusForDomesticShipVia(true);
                } else if (this.restoreTypeId == 4) {
                    this.getDeleteListByStatusForinternationalShipVia(true);
                }


                this.modal.close();
                this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
            }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            });
        } else {
            this.legalEntityService.restoreDomesticShippingRecord(this.restoreIdForGet, this.userName).subscribe(res => {
                this.getDeleteListByStatusForDomestic(true);
                this.modal.close();
                this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
            }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            });
        }
    }
    onChangeCertDefaultCost() {
        this.internationalShippingInfo.amount = this.internationalShippingInfo.amount ? formatNumberAsGlobalSettingsModule(this.internationalShippingInfo.amount, 2) : '0.00';
    }
    restoreTypeId: any;
    restore(content, rowData, type) {
        this.restoreTypeId = type;
        this.restorerecord = rowData;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    errorMessageHandler(log) {
        this.isSpinnerVisible = false;

    }


    filterSiteNamesDomestic(event) {
        this.sitesNamesListDomestic = this.sitesOriginalDomestic ? this.sitesOriginalDomestic : [];
        if (event.query != undefined && event.query != "") {
            this.getAllSites(event.query)
        } else {
            this.getAllSites('')
        }
    }
    // setEditArray: any = [];
    sitesOriginalDomestic: any = [];
    sitesNamesListDomestic: any = [];
    getAllSites(value) {
        if (this.isViewMode == false) {
            this.setEditArray = [];
            const strText = value ? value : '';
            if (this.isEditDomestic == true) {
                this.setEditArray.push(this.legalEntityShippingAddressId ? this.legalEntityShippingAddressId : 0);
            } else {
                this.setEditArray.push(0);
            }
            if (this.id != undefined) {
                this.commonService.autoSuggestionSmartDropDownListWtihColumn('LegalEntityShippingAddress', 'LegalEntityShippingAddressId', 'SiteName', strText, 'LegalEntityId', this.id, 20, this.setEditArray.join()).subscribe(res => {
                    this.sitesOriginalDomestic = res;
                    this.sitesNamesListDomestic = [];
                    this.sitesNamesListDomestic = [...this.sitesOriginalDomestic];
                    if (this.isEditDomestic == true && this.sitesNamesListDomestic && this.sitesNamesListDomestic.length != 0) {
                        this.sitesNamesListDomestic.forEach(element => {
                            if (element.label == this.domesticShippingInfo.siteName) {
                                this.domesticShippingInfo.siteName = element
                            }
                        });

                    }


                }, err => {
                    const errorLog = err;
                    this.errorMessageHandler(errorLog);
                });
            }
        }
    }


    showExistMsg: any = false;
    onSiteNameSelectedDomestic() {
        this.showExistMsg = true;
    }
    checkfirstNameExistDomestic(event) {

        if (this.domesticShippingInfo.siteName == '') {
            this.showExistMsg = false;
        }

        if (event) {
            if (event == "") {
                this.showExistMsg = false;
            }
        }

        if (event != "") {
            this.sitesNamesListDomestic.forEach(element => {
                if (element.label == event) {
                    this.showExistMsg = true;
                } else {
                    this.showExistMsg = false;
                }
            });
        }
    }
    disableShipVia: boolean = false;
    enableSave2() {
        this.disableShipVia = false;
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
    }
    onAddInternationalmemo() {
        this.textInternationalMemo = this.shipViaInternational.memo;
        this.disableEditor = true;

    }

    disableEditor: any = true;
    editorgetmemo() {
        this.disableEditor = false;
        this.disableShipVia = false;
    }

    onCloseTextAreaInfo(type) {
        if (type == 1) {
            $("#textarea-popup1").modal("hide");
        } else if (type == 2) {
            $("#textarea-popup2").modal("hide");
        }
    }

    saveCountry() {}

    filtercountry($event) {}
}







