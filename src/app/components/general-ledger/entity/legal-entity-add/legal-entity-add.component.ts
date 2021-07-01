/// <reference path="../../../../validations/validation-pattern.ts" />
/// <reference path="../../../../validations/validation-pattern.ts" />
import { Component, ViewChild, OnInit, Output, EventEmitter, Input, ElementRef } from '@angular/core';
import { fadeInOut } from '../../../../services/animations';
import { AuthService } from '../../../../services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
import { LegalEntityService } from '../../../../services/legalentity.service';
import { CommonService } from '../../../../services/common.service';
import { editValueAssignByCondition, getObjectById, validateRecordExistsOrNot, selectedValueValidate, getObjectByValue } from '../../../../generic/autocomplete';
import { ActivatedRoute } from '@angular/router';
import { ConfigurationService } from '../../../../services/configuration.service';
import { GlAccount } from '../../../../models/GlAccount.model';
import { phonePattern } from '../../../../validations/validation-pattern';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ModuleConstants, PermissionConstants } from 'src/app/generic/ModuleConstant';
@Component({
    selector: 'app-legal-entity-add',
    templateUrl: './legal-entity-add.component.html',
    styleUrls: ['./legal-entity-add.component.scss'],
    animations: [fadeInOut]
})

export class EntityAddComponent implements OnInit {
    isSpinnerVisible: boolean = false;
    isCustomerCodeAlreadyExists: boolean;
    generalInformation: any = {};
    dellogo: any;
    isDeleteMode: boolean;
    @Input() customerListOriginal;
    @Input() editMode;
    @Output() tab = new EventEmitter<any>();
    @Output() savedGeneralInformationData = new EventEmitter<any>();
    @Output() editGeneralInformationData = new EventEmitter<any>();
    @Input() GeneralInformationData
    @ViewChild('fileUploadInput', { static: false }) fileUploadInput: any;
    parentLegalEntityList: any = [];
    parentLegalEntity: any = [];
    phonePattern = phonePattern();
    countrycollection: any = [];
    isEditMode: boolean = false;
    filetransction: boolean = false;
    nextOrPreviousTab: any = "Next";
    legalEntityId: number;
    formData = new FormData()
    tagName: any;
    tagNames: any = [];
    tagNamesColumns = [
        { field: 'tagName', header: 'Tag Name' },
    ]
    pageSize: number = 10;
    pageSizeTax: number = 10;
    modal; any;
    totalRecords: number = 0;
    loadingIndicator: boolean;
    totalPages: number = 0;
    customerallListOriginal: any;
    selectedTagNameForEdit = {};
    isUploadLogo: boolean = false;
    isEntityNameAlreadyExists: boolean = false;
    disableSaveForEdit: boolean = false;
    stopmulticlicks: boolean;
    tagdata: any;
    allLedgerInfo: GlAccount[];
    sourceViewforDocumentList: any = [];
    sourceViewforDocumentListColumns = [
        { field: 'fileName', header: 'File Name' },
    ];
    attachmentId: any;
    companycodingeditmode: boolean;
    disableUpdatebutton: boolean = true;
    companyCodes: { legalentityId: any; companyCode: any; }[];
    @ViewChild("tabRedirectConfirmationModal", { static: false }) public tabRedirectConfirmationModal: ElementRef;
    arrayEntitylist: any[] = [];
    allowNextView: boolean = false;
    countryExistsNow: boolean;
    allCurrencyInfo: any = [];
    countryListOriginal: any = [];
    isAdd:boolean=true;
    isEdit:boolean=true;
    isNextVisible: Boolean=true;
    constructor(
        private authService: AuthService,
        private commonService: CommonService,
        private legalEntityService: LegalEntityService,
        private modalService: NgbModal,
        private alertService: AlertService,
        private location: Location,
        private _actRoute: ActivatedRoute,
        private configurations: ConfigurationService,
        private route: Router,) {
            this.isAdd=this.authService.checkPermission([ModuleConstants.LegalEntity_GeneralInformation+"."+PermissionConstants.Add]);
            this.isEdit=this.authService.checkPermission([ModuleConstants.LegalEntity_GeneralInformation+"."+PermissionConstants.Update]);
            this.isNextVisible=this.authService.ShowTab('Create Legal Entity','Contacts');
    }

    ngOnInit() {
        if (this.GeneralInformationData && this.GeneralInformationData.legalEntityId) {
            this.legalEntityId = this.GeneralInformationData.legalEntityId;
        } else {
            this.legalEntityId = this._actRoute.snapshot.params['id'];
        }
        if (this.legalEntityId != undefined && this.legalEntityId != null) {
            this.isEditMode = this.editMode ? this.editMode : true;
            this.LoadData();
        } else {
            this.generalInformation.isAddressForBilling = true;
            this.generalInformation.isAddressForShipping = true;
            this.generalInformation.isBalancingEntity = true;
            this.generalInformation.companyCode = "";
            this.CurrencyData('');
            this.CountryData('');
            this.getLegalEntityList('');
            this.getAllLedgerList('');
        }
        this.disableUpdatebutton = true;
        this.generalInformation.invoiceAddressPosition = '1';
        this.generalInformation.invoiceFaxPhonePosition = '1';
    }

    private LoadData() {        
        if (this.legalEntityId) {
            this.isSpinnerVisible = true;
            this.companycodingeditmode = true;
            setTimeout(() => {
                this.isSpinnerVisible = true;
                this.getEntityDataById(this.legalEntityId);
                this.isSpinnerVisible = false;
            }, 1500);
            this.allowNextView = true;
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

    onFilterLedgername(value) {
        this.getAllLedgerList(value)
    }

    getAllLedgerList(value) {
        this.setEditArray = [];
        if (this.isEditMode == true) {
            this.setEditArray.push(this.generalInformation.ledgerId ? this.generalInformation.ledgerId : 0);

        } else {
            this.setEditArray.push(0);
        }
        const strText = value ? value : '';
        this.commonService.autoSuggestionSmartDropDownList("Ledger", "LedgerId", "LedgerName", strText, true, 20, this.setEditArray.join(),this.currentUserMasterCompanyId).subscribe(res => {
            if (res && res.length != 0) {
                this.allLedgerInfo = res;
            }
        }, err => {            
            this.isSpinnerVisible = false;
        });
    }

    getLegalEntityList(strText = '') {
        
        if (this.legalEntityId > 0)
            this.arrayEntitylist.push(this.legalEntityId);
        if (this.arrayEntitylist.length == 0) {
            this.arrayEntitylist.push(0);
        }
        this.commonService.autoSuggestionSmartDropDownList('LegalEntity', 'LegalEntityId', 'Name', strText, true, 20, this.arrayEntitylist.join(),this.currentUserMasterCompanyId).subscribe(response => {
            this.parentLegalEntityList = response;
            this.parentLegalEntity = this.parentLegalEntityList;
            this.parentLegalEntity = [...this.parentLegalEntityList.filter(x => {
                return x.label.toLowerCase().includes(strText.toLowerCase())
            })]
            this.arrayEntitylist = [];
        }, err => {
            this.isSpinnerVisible = false;
        });
    }   

    getEntityDataById(id) {
        this.legalEntityService.getEntityDataById(id).subscribe(res => {
            this.editGeneralInformationData.emit(res);
            this.generalInformation = {
                ...res,
                name: { label: res.name, value: res.legalEntityId },
                // name: getObjectById('value', res.legalEntityId, this.parentLegalEntityList),
                invoiceAddressPosition: res.invoiceAddressPosition.toString(),
                // legalEntityId: getObjectById('value', res.legalEntityId, this.parentLegalEntityList),
                invoiceFaxPhonePosition: res.invoiceFaxPhonePosition.toString(),
                attachmentId: res.attachmentId,
            }
            this.isSpinnerVisible = false;

            if (res.tagNames.length > 0) {
                this.tagNames = res.tagNames;
                this.onAddTagNameOnEdit();
            }
            this.editlegalEntityLogo();
            this.CurrencyData('');
            this.CountryData('');
            this.getLegalEntityList('');
            this.getAllLedgerList('');
        }, err => {
            this.isSpinnerVisible = false;
        })
    }

    // filterParentLegalEntity(event) {
    //     this.parentLegalEntity = this.parentLegalEntityList;
    //     this.parentLegalEntity = [...this.parentLegalEntityList.filter(x => {
    //         return x.label.toLowerCase().includes(event.query.toLowerCase())
    //     })]
    // }

    filterParentLegalEntity(event) {
		if (event.query !== undefined && event.query !== null) {
			this.getLegalEntityList(event.query);
		}
	}

    checkCountryNow(value) {
        if (value.length > 0)
            this.countryExistsNow = false
        else
            this.countryExistsNow = true
    }

    patternMobilevalidationWithSpl(event: any) {
        const pattern = /[0-9\+\-()\ ]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) {
            event.preventDefault();
        }
    }

    downloadFileUpload(rowData) {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadattachedfile?filePath=${rowData.link}`;
        window.location.assign(url);
    }

    onAddTagName() {
        if (this.tagNames && this.tagNames.length != 0) {
            this.tagNames.forEach(element => {
                if (element.tagName == this.tagName) {
                    this.alertService.showMessage("Warning", 'Tag Name Already Exist', MessageSeverity.warn);
                    this.tagName = "";
                    return;
                }
            });
        }
        if (this.tagName != "") {
            this.tagNames.push({
                tagName: this.tagName
            });
            this.tagNames.map(x => {
                return {
                    ...x
                }
            })
            this.tagName = '';
            this.totalRecords = this.tagNames.length;
            this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            this.disableUpdatebutton = false;
            this.alertService.showMessage(
                'Success',
                'Created Tag Name Successfully',
                MessageSeverity.success
            );
        }
    }

    onAddTagNameOnEdit() {
        this.tagNames = this.tagNames.map(x => {
            return {
                tagName: x
            }
        });
        this.totalRecords = this.tagNames.length;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    }

    tagName1: any;
    onAddTagNameEdit() {
        if (this.tagNames && this.tagNames.length != 0) {
            this.tagNames.forEach(element => {
                if (element.tagName == this.tagName1) {
                    this.alertService.showMessage("Warning", 'Tag Name Already Exist', MessageSeverity.warn);
                    this.tagName1 = "";
                    this.tageNameValiDate = true;
                    return;
                }
            });
        }
        if (this.tagName1 == null || this.tagName1.replace(/\s/g, "").toLowerCase() == "" || this.tagName1 == undefined) {
            return;
        }
        else {
            // this.tagNames.splice(this.selectedTagNameForEdit, 1);
            // this.tagNames.push({
            //     tagName: this.tagName
            // });

            // if (~this.tagIndex) {
            //     this.tagNames[this.tagIndex] = this.tagName1;
            // }
            if (this.tagIndex !== -1) {
                this.tagNames[this.tagIndex].tagName = this.tagName1;
            }
        }
        // this.tagNames=[...this.tagNames]
        // this.tagName1 = '';
        this.totalRecords = this.tagNames.length;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        this.alertService.showMessage(
            'Success',
            'Updated Tag Name Successfully',
            MessageSeverity.success
        );
        this.disableUpdatebutton = false;
        this.modal.close();
    }

    dismissModel() {
        this.modal.close();
    }

    redirectToTab() {
        this.dismissModel();
        this.stopmulticlicks = true;
        this.tab.emit('Contacts');
        this.editGeneralInformationData.emit(this.generalInformation);
        setTimeout(() => {
            this.stopmulticlicks = false;
        }, 500)
        if (this.disableUpdatebutton == false) {
            this.saveGeneralInformation();
        }
    }

    dismissModelPermission() {
        this.dismissModel();
        this.stopmulticlicks = true;
        this.tab.emit('Contacts');
        this.editGeneralInformationData.emit(this.generalInformation);
        setTimeout(() => {
            this.stopmulticlicks = false;
        }, 500)
    }

    onEditTagName(content, rowData, index) {
        this.tagIndex = index;
        this.tagdata = true;
        this.selectedTagNameForEdit = rowData.tagName;
        this.tagName1 = rowData.tagName;
        this.tageNameValiDate = true;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    checkCustomerNameExists(field, value) {
        const exists = validateRecordExistsOrNot(field, value, this.parentLegalEntityList)
        if (exists.length > 0) {
            this.isEntityNameAlreadyExists = true;
            this.disableSaveForEdit = true;
        } else {
            this.isEntityNameAlreadyExists = false;
            this.disableSaveForEdit = false;
        }
    }

    selectedCustomerName(object) {
        const exists = selectedValueValidate('label', object, this.isEditMode)
        this.isEntityNameAlreadyExists = !exists;
        this.disableSaveForEdit = true;
    }

    checkCustomerNameExist(value) {
        this.isEntityNameAlreadyExists = false;
        for (let i = 0; i < this.parentLegalEntityList.length; i++) {
            if (value == this.parentLegalEntityList[i].label) {
                this.isEntityNameAlreadyExists = true;
                this.disableSaveForEdit = true;
                return;
            } else {
                this.disableSaveForEdit = false;
            }
        }
    }

    selected(object) {
        const exists = selectedValueValidate('label', object, this.isEditMode)
        this.isEntityNameAlreadyExists = !exists;
    }

    changePage(event: { first: any; rows: number }) {
        this.pageSizeTax = event.rows;
        // this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    }

    getTaxPageCount(totalNoofRecordsT, pageSizeT) {
        return Math.ceil(totalNoofRecordsT / pageSizeT);
    }

    editlegalEntityLogo() {
        if (this.generalInformation.attachmentId != null && this.generalInformation.attachmentId != undefined) {
            this.legalEntityService.toGetUploadDocumentsList(this.generalInformation.attachmentId, this.legalEntityId, 41).subscribe(res => {
                this.sourceViewforDocumentList = res;
            }, err => {
                this.isSpinnerVisible=false;
                //const errorLog = err;
                //this.errorMessageHandler(errorLog);
            });
        }
    }

    saveGeneralInformation() {
        this.generalInformation.tagNames = [];
        this.tagNames.map(x => {
            this.generalInformation.tagNames.push(x.tagName)
        });
        if (!this.isEditMode) {
            const generalInfo = {
                ...this.generalInformation,
                createdBy: this.userName,
                updatedBy: this.userName,
                name: this.generalInformation.name,
                // legalEntityId: editValueAssignByCondition('label', this.generalInformation.legalEntityId),
                companyCode: this.generalInformation.companyCode,
                masterCompanyId: this.currentUserMasterCompanyId,
            }
            this.isSpinnerVisible = true;
            this.legalEntityService.newAddEntity(generalInfo).subscribe(data => {
                this.editGeneralInformationData.emit(data);
                this.legalEntityId = data.legalEntityId;
                this.generalInformation.name = { label: data.name, value: data.legalEntityId };
                this.generalInformation.companyCode = data.companyCode;
                this.generalInformation.legalEntityId = data.legalEntityId;
                this.isEditMode = true;
                this.isSpinnerVisible = false;
                this.disableUpdatebutton = true;
                this.allowNextView = true;
                this.uploadLogo();
                this.alertService.showMessage(
                    'Success',
                    'Legal Entity Saved Successfully',
                    MessageSeverity.success
                );
                // this.route.navigateByUrl(`generalledgermodule/generalledgerpage/app-legal-entity-edit/${this.legalEntityId}`); 
                this.location.replaceState(`generalledgermodule/generalledgerpage/app-legal-entity-edit/${this.legalEntityId}`);
                // this.LoadData();
            }, err => {               
                this.isSpinnerVisible=false;
            });

        }
        else {
            const generalInfo = {
                ...this.generalInformation,
                createdBy: this.userName,
                updatedBy: this.userName,
                name: this.generalInformation.name,
                // legalEntityId: editValueAssignByCondition('value', this.generalInformation.legalEntityId),
                companyCode: this.generalInformation.companyCode,
                masterCompanyId: this.currentUserMasterCompanyId,
            }
            this.generalInformation = {
                ...generalInfo,
                name: editValueAssignByCondition('label', this.generalInformation.name),
                companyCode: editValueAssignByCondition('label', this.generalInformation.companyCode),
                companyName: this.generalInformation.companyName,
            }
            this.isSpinnerVisible = true;
            this.generalInformation.ledgerId = this.generalInformation.ledgerId != 0 ? this.generalInformation.ledgerId : null;
            this.legalEntityService.updateLegalEntity(this.generalInformation).subscribe(data => {
                this.generalInformation.name = { label: data.name, value: data.legalEntityId };
                this.disableUpdatebutton = true;
                this.isSpinnerVisible = false;
                if (this.uploadFiles == true) {

                    this.uploadLogo();
                }
                this.alertService.showMessage(
                    'Success',
                    'Legal Entity Updated Successfully',
                    MessageSeverity.success
                );
                // this.route.navigateByUrl(`generalledgermodule/generalledgerpage/app-legal-entity-edit/${this.legalEntityId}`);
                // this.LoadData();
            }, err => {
                this.getEntityDataById(this.legalEntityId)
                this.isSpinnerVisible=false;
            });
        }
    }

    logoRecord: any = {};
    openDeletes(content, row) {
        this.logoRecord = row;
        this.dellogo = row.attachmentDetailId;
        // this.isEditMode = false;
        this.isDeleteMode = true;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    tagIndex: any;
    tagRowData: any;
    openDeletesTag(content, rowData, row) {
        this.tagIndex = row;
        this.tagRowData = rowData;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    onDeleteTagName() {
        this.tagNames.splice(this.tagIndex, 1);
        this.modal.close();
        this.disableUpdatebutton = false;
        this.alertService.showMessage(
            'Success',
            'Deleted Tag Name Successfully',
            MessageSeverity.success
        );
    }

    filterCustomerCode(event) {
        this.companyCodes = this.customerallListOriginal;
        this.companyCodes = [...this.customerallListOriginal.filter(x => {
            return x.label.toLowerCase().includes(event.query.toLowerCase())
        })]
    }

    checkcompanyCodeExist(value) {
        this.isCustomerCodeAlreadyExists = false;
        for (let i = 0; i < this.customerallListOriginal.length; i++) {
            if (value == this.customerallListOriginal[i].label) {
                this.isCustomerCodeAlreadyExists = true;
                return;
            }
        }
    }

    getmemo() {
        this.tagNames.length = 0;
    }

    numberonly(event) {
        var k;
        k = event.charCode;
        return ((k >= 48 && k <= 57));
    }

    selectedCustomerCode() {
        this.isCustomerCodeAlreadyExists = true;
    }

    deleteItemAndCloseModel() {
        this.legalEntityService.deleteLogo(this.dellogo).subscribe(
            data => {
                this.editlegalEntityLogo();
            }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            })
        this.modal.close();
    }

    fileUpload(event) {
        if (event.files.length == 0) {
            return // this.disableSave = true;
        } else {
            //this.disableSave = false;
            this.disableUpdatebutton = false;
        }
        for (let file of event.files) {
            this.filetransction = true;
            var flag = false;
            // for (var i = 0; i < this.sourceViewforDocumentList.length; i++) {
            //     if (this.sourceViewforDocumentList[i].fileName == file.name) {
            //         flag = true;
            //         this.alertService.showMessage(
            //             'Duplicate',
            //             `Already Exists this file `,
            //             MessageSeverity.warn
            //         );
            //         if (this.fileUploadInput) {
            //             this.fileUploadInput.clear()
            //         }
            //     }
            // }
            this.formData.append(file.name, file);
        }
        this.uploadFiles = true;
    }

    uploadFiles: any = false;
    removeFile(event) {
        this.formData.delete(event.file.name);
        this.disableUpdatebutton = false;
    }

    nextClick(nextOrPrevious) {
        //this.nextOrPreviousTab = nextOrPrevious;
        //let content = this.tabRedirectConfirmationModal;
        //this.modal = this.modalService.open(content, { size: "sm" });
        this.nextOrPreviousTab = nextOrPrevious;
        if (!this.disableSaveForEdit) {
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

    uploadLogo() {
        const data = {
            legalEntityId: this.legalEntityId,
            updatedBy: this.userName,
            masterCompanyId: this.authService.currentUser.masterCompanyId
        }
        for (var key in data) {
            this.formData.append(key, data[key]);
        }
        if (this.filetransction == true) {
            this.legalEntityService.uploadLegalEntityLogo(this.formData).subscribe(res => {
                this.formData = new FormData();
                this.generalInformation.attachmentId = res.attachmentId;
                this.uploadFiles = false;
                this.editlegalEntityLogo();
                this.fileUploadInput.clear();
            }, err => {
                this.isSpinnerVisible=false;
            })
        }
    }

    setEditArray: any = [];
    private CurrencyData(value) {
        this.setEditArray = [];
        if (this.isEditMode == true) {
            this.setEditArray.push(this.generalInformation.functionalCurrencyId ? this.generalInformation.functionalCurrencyId : 0, this.generalInformation.reportingCurrencyId ? this.generalInformation.reportingCurrencyId : 0);
        } else {
            this.setEditArray.push(0);
        }
        const strText = value ? value : '';
        this.commonService.autoSuggestionSmartDropDownList('Currency', 'CurrencyId', 'Code', strText, true, 20, this.setEditArray.join(),this.currentUserMasterCompanyId).subscribe(res => {
            this.allCurrencyInfo = res;
        }, err => {
            this.isSpinnerVisible=false;
        });
    }

    onFilterCurrency(value) {
        this.CurrencyData(value);
    }

    onFilterCountry(value) {
        this.CountryData(value);
    }

    setvaliDate() {
        this.disableUpdatebutton = false;
    }

    CountryData(value) {
        this.setEditArray = [];
        if (this.isEditMode == true) {
            this.setEditArray.push(this.generalInformation.countryId ? this.generalInformation.countryId : 0);
        } else {
            this.setEditArray.push(0);
        }
        const strText = value ? value : '';
        //this.commonService.smartDropDownList('Countries', 'countries_id', 'nice_name').subscribe(res => {
          this.commonService.autoSuggestionSmartDropDownList('Countries', 'countries_id', 'nice_name', strText, true, 20, this.setEditArray.join(),this.currentUserMasterCompanyId).subscribe(res => {
            this.countryListOriginal = res;
        }, err => {            
            this.isSpinnerVisible = false;
        });
    }

    errorMessageHandler(log) {
        // this.isSpinnerEnable = false;
        this.isSpinnerVisible = false;
        // this.alertService.showMessage(
        //     'Error',
        //     log,
        //     MessageSeverity.error
        // ); 
    }

    tageNameValiDate: any = true;
    setvaliDateTag() {
        this.tageNameValiDate = false;
    }

    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }

}