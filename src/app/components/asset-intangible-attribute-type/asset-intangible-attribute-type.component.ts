import { OnInit, Component, OnChanges, SimpleChanges, ChangeDetectionStrategy, ElementRef } from "@angular/core";
import { fadeInOut } from "../../services/animations";
import { AlertService, MessageSeverity } from "../../services/alert.service";
// import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "../../services/auth.service";
import { AuditHistory } from '../../models/audithistory.model';
import { SingleScreenBreadcrumbService } from "../../services/single-screens-breadcrumb.service";
import { AssetIntangibleAttributeType } from "../../models/asset-intangible-attribute-type.model";
import { AssetIntangibleType } from "../../models/asset-intangible-type.model";
import { AssetIntangibleTypeService } from "../../services/asset-intangible-type/asset-intangible-type.service";
import { AssetIntangibleAttributeTypeService } from "../../services/asset-intangible-attribute-type/asset-intangible-attribute-type.service";
import { ModeOfOperation } from "../../models/ModeOfOperation.enum";
import { ConfigurationService } from '../../services/configuration.service';
import { validateRecordExistsOrNot, editValueAssignByCondition, getObjectById, selectedValueValidate, getObjectByValue } from '../../generic/autocomplete';
import { CommonService } from '../../services/common.service';
import { GlAccountService } from '../../services/glAccount/glAccount.service';
import { GlAccount } from '../../models/GlAccount.model';
import { LegalEntityService } from '../../services/legalentity.service';
import { UploadTag } from "../../models/UploadTag.enum";

import { Table } from 'primeng/table';

import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';


@Component({
    selector: 'app-asset-intangible-attribute-type',
    templateUrl: './asset-intangible-attribute-type.component.html',
    styleUrls: ['asset-intangible-attribute-type.component.scss'],
    animations: [fadeInOut]
})
export class AssetIntangibleAttributeTypeComponent implements OnInit {

    itemList: any[] = [];
    filteredItemList: AssetIntangibleAttributeType[];
    allAssetIntangibleTypes: AssetIntangibleType[];
    filteredAssetIntangibleTypes: AssetIntangibleType[];
    filteredGLAccountList: any[] = [];
    filteredAssetSaleList: any[] = [];
    assetWriteOffList: any[] = [];
    filteredWriteOffList: any[] = [];
    assetWriteDownList: any[] = [];
    filteredAssetWriteDownList: any[] = [];
    columnHeaders: any[];
    itemDetails: any;
    companyListData: any[] = [];
    currentRow: AssetIntangibleAttributeType;
    selectedRow: AssetIntangibleAttributeType;
    currentModeOfOperation: ModeOfOperation;
    rowName: string;
    header: string;
    disableSave: boolean = false;
    totalRecords: any;
    pageIndex: number = 0;
    pageSize: number = 10;
    totalPages: number;
    modal: NgbModalRef;
    private table: Table;
    allGlInfo: any[] = [];
    selectedColumns: any[];
    auditHistory: any[] = [];
    formData = new FormData();
    existingRecordsResponse: Object;
    allAssetIntangibleAttributeTypes: any[] = [];
    localCollection: any[] = [];
    selectedAssetIntangible: any;
    sourceAction: AssetIntangibleAttributeType;
    private isEditMode: boolean = false;
    private isDeleteMode: boolean = false;
    loadingIndicator: boolean;
    closeResult: string;
    depreciationFreqList: any[] = [];
    depreciationMethodList: any[] = [];
    percentageList: any[] = [];
    companyList: any[];
    buList: any[];
    divisionList: any[];
    departmentList: any[];
    selectedCompanyID: any = [];
    selectedBUId: number = 0;
    selectedDivisionID: number = 0;
    selectedDeptID: number = 0;
    allmgmtData: any[];
    mgmtStructureId: any;
    disableForMgmtStructure: boolean;
    filteredDepriciationMethod: any[] = [];
    recordExists: boolean = false;


    currentstatus: string = 'Active';


    constructor(private breadCrumb: SingleScreenBreadcrumbService,
        private commonService: CommonService, private commonservice: CommonService, private glAccountService: GlAccountService, public legalEntityService: LegalEntityService, private configurations: ConfigurationService, private alertService: AlertService, private coreDataService: AssetIntangibleAttributeTypeService, private modalService: NgbModal, private authService: AuthService, private assetIntangibleTypeService: AssetIntangibleTypeService) {
        this.loadData();
    }
    ngOnInit(): void {
        //gather up all the required data to be displayed on the screen 
        this.loadData();
    }
    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }
    //for auditing
    get userName(): string {
        //to-do:fix the empty username
        return this.authService.currentUser ? this.authService.currentUser.userName : "admin";
    }
    columnsChanges() {
        this.refreshList();
    }
    refreshList() {
        this.table.reset();

        // this.table.sortOrder = 0;
        // this.table.sortField = '';

        this.getItemList();
    }
    //Step E1: Open row up for editing
    addNewItem(): void {
        this.disableSave = false;
        this.currentRow = this.newItem(0);
        let selectedCompanyIDs: any[] = [];
        this.selectedCompanyID = [];
        this.disableForMgmtStructure = true;
        this.currentModeOfOperation = ModeOfOperation.Add;
    }

    //loading all IntangibleType list//
    private getIntangibleTypeList() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.assetIntangibleTypeService.getAll().subscribe(
            results => this.onIntangibleTypeLoad(results[0]),
            error => this.onDataLoadFailed(error),
        );

    }

    private onIntangibleTypeLoad(getAssetTypeList: AssetIntangibleType[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.allAssetIntangibleTypes = getAssetTypeList;
        this.allAssetIntangibleAttributeTypes = getAssetTypeList;
        //this.loadSelectedNames();
    }

    //loading GlAccount from generalLedger//
    private glList() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.glAccountService.getAll().subscribe(
            results => this.onGlAccountLoad(results[0]),
            error => this.onDataLoadFailed(error)
        );
    }

    private onDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

    }


    private onGlAccountLoad(getGlList: GlAccount[]) {
         this.alertService.stopLoadingMessage();
       this.loadingIndicator = false;
        this.allGlInfo = getGlList;
  
   this.loadSelectedNames();
    }

    filterIntangibleType(event): void {
        this.filteredAssetIntangibleTypes = this.allGlInfo;
        const GLADATA = [...this.allAssetIntangibleTypes.filter(x => {
            return x.assetIntangibleName.toLowerCase().includes(event.query.toLowerCase())
        })]
        this.filteredAssetIntangibleTypes = GLADATA;
    }

    filterGLAccount(event): void {
        this.filteredGLAccountList = this.allGlInfo;
        const GLADATA = [...this.allGlInfo.filter(x => {
            return x.accountName.toLowerCase().includes(event.query.toLowerCase())
        })]
        this.filteredGLAccountList = GLADATA;
    }

    filterAssetSale(event): void {
        this.filteredAssetSaleList = this.allGlInfo;
        const GLADATA = [...this.allGlInfo.filter(x => {
            return x.accountName.toLowerCase().includes(event.query.toLowerCase())
        })]
        this.filteredAssetSaleList = GLADATA;
    }

    filterAssetWriteOff(event): void {
        this.filteredWriteOffList = this.allGlInfo;
        const GLADATA = [...this.allGlInfo.filter(x => {
            return x.accountName.toLowerCase().includes(event.query.toLowerCase())
        })]
        this.filteredWriteOffList = GLADATA;
    }

    filterAssetWriteDown(event): void {
        this.filteredAssetWriteDownList = this.allGlInfo;
        const GLADATA = [...this.allGlInfo.filter(x => {
            return x.accountName.toLowerCase().includes(event.query.toLowerCase())
        })]
        this.filteredAssetWriteDownList = GLADATA;
    }

    getAllPercentage() {
        this.commonservice.smartDropDownList('[Percent]', 'PercentId', 'PercentValue').subscribe(res => {
            //////console.log('res: '+res);
            this.percentageList = res;
        });
        //////console.log('percentge list : ', this.percentageList);
    }

    getAllFrequency() {
        this.commonservice.smartDropDownList('[AssetDepreciationFrequency]', 'AssetDepreciationFrequencyId', 'Name').subscribe(res => {
            this.depreciationFreqList = res;
            //this.loadSelectedNames();
        })
    }

    getAllDepreMthod() {
        this.commonservice.smartDropDownList('[AssetDepreciationMethod]', 'AssetDepreciationMethodId', 'AssetDepreciationMethodName').subscribe(res => {
            this.depreciationMethodList = res;
            //this.loadSelectedNames();
        })
    }
    loadSelectedNames() {
        //console.log('loadSelectedNames', this.itemList.length);
        for (let i = 0; i < this.itemList.length; i++) {
            let companies = "";
            this.itemList[i].depreciationMethodName = this.getDeprMethodNameById(this.itemList[i].assetDepreciationMethodId);
            this.itemList[i].assetIntangibleName = this.itemId(this.itemList[i].assetIntangibleTypeId);
            this.itemList[i].Name = this.getAmortFrequencyById(this.itemList[i].assetAmortizationIntervalId);
            this.itemList[i].accAmortdeprGL = this.getAccCodeById(this.itemList[i].accAmortDeprGLAccountId);
            this.itemList[i].amortExpenseGL = this.getAccCodeById(this.itemList[i].amortExpenseGLAccountId);
            this.itemList[i].intangibleGL = this.getAccCodeById(this.itemList[i].intangibleGLAccountId);
            this.itemList[i].intangiblewritedoffGL = this.getAccCodeById(this.itemList[i].intangibleWriteOffGLAccountId);
            this.itemList[i].intangiblewritedDownGL = this.getAccCodeById(this.itemList[i].intangibleWriteDownGLAccountId);

            if (this.itemList[i].selectedCompanyIds != null && this.itemList[i].selectedCompanyIds != undefined) {
                let arr = this.itemList[i].selectedCompanyIds.split(",");
                for (let i = 0; i < arr.length; i++) {
                    if (companies == "")
                        companies = companies + this.getCompanyName(arr[i]);
                    else
                        companies = companies + ", " + this.getCompanyName(arr[i]);
                }
            }
            //console.log('companies', companies);
            this.itemList[i].selectedCompanyNames = companies;
        }
    }

    getAccNameById(value) {
        for (let i = 0; i < this.allGlInfo.length; i++) {
            let accId = this.allGlInfo[i].glAccountId;
            if (accId == value) {
                return this.allGlInfo[i].accountName;
            }
        }
        return "";
    }

    getAccCodeById(value) {
        for (let i = 0; i < this.allGlInfo.length; i++) {
            let accId = this.allGlInfo[i].glAccountId;
            if (accId == value) {
                return this.allGlInfo[i].accountCode;
            }
        }
        return "";
    }

    getDeprMethodNameById(value) {
        for (let i = 0; i < this.depreciationMethodList.length; i++) {
            let accId = this.depreciationMethodList[i].value;
            if (accId == value) {
                return this.depreciationMethodList[i].label;
            }
        }
        return "";
    }

    getAmortFrequencyById(value) {
        for (let i = 0; i < this.depreciationFreqList.length; i++) {
            let accId = this.depreciationFreqList[i].value;
            if (accId == value) {
                return this.depreciationFreqList[i].label;
            }
        }
        return "";
    }

    selectedIntangibleType(object) {
        //console.log('selectedAssetType.assetTypeName', this.currentRow.assetTypeId);
        //console.log('selectedAssetType.memo', object.assetTypeMemo);

        console.log(object.assetIntangibleTypeId);
        for (let i = 0; i < this.itemList.length; i++) {
            if ((this.itemList[i].assetIntangibleTypeId === object.assetIntangibleTypeId && this.currentModeOfOperation == 2)
                || (this.itemList[i].assetIntangibleTypeId === object.assetIntangibleTypeId && this.currentModeOfOperation == 3 &&
                    this.currentRow.assetIntangibleAttributeTypeId != this.itemList[i].assetIntangibleAttributeTypeId)
            ) {
                this.recordExists = true;
                this.disableSave = true;
                return;
            }
        }
        this.disableSave = false;
        this.recordExists = false;
    }

    companySelected(): void {
        ////console.log(`Company Id :${this.selectedCompanyID}`);

        if (this.selectedCompanyID != undefined && this.selectedCompanyID.length > 0) {
            //this.mgmtStructureId = this.selectedCompanyID;
            this.disableForMgmtStructure = false;
        }
        else {
            this.disableForMgmtStructure = true;
        }
        if (this.isEditMode == true &&
            this.selectedCompanyID != undefined && this.selectedCompanyID.length > 0) {
            this.disableSave = false;
        }
        //this.divisionList = [];
        //this.departmentList = [];
        //this.selectedBUId = 0;
        //this.selectedDeptID = 0;
        //this.selectedDivisionID = 0;
        //this.buList = this.allmgmtData.filter(c => c.parentId === this.selectedCompanyID);
    }

    buSelected(): void {
        ////console.log(`BU :${this.selectedBUId}`);
        this.mgmtStructureId = this.selectedBUId;
        if (this.selectedBUId.toString() !== "0") {
            this.mgmtStructureId = this.selectedBUId;
        } else {
            this.mgmtStructureId = this.selectedCompanyID;
        }

        this.departmentList = [];
        this.selectedDeptID = 0;
        this.selectedDivisionID = 0;
        this.divisionList = this.allmgmtData.filter(c => c.parentId === this.selectedBUId);
    }

    divisionSelected(): void {
        ////console.log(`Division id :${this.selectedDivisionID}`);
        if (this.selectedDivisionID.toString() !== "0") {
            this.mgmtStructureId = this.selectedDivisionID;
        } else {
            this.mgmtStructureId = this.selectedBUId;
        }
        this.departmentList = this.allmgmtData.filter(c => c.parentId === this.selectedDivisionID);
    }

    departmentSelected(): void {
        if (this.selectedDeptID.toString() !== "0") {
            this.mgmtStructureId = this.selectedDeptID;
        } else {
            this.mgmtStructureId = this.selectedDivisionID;
        }

    }

    populateMgmtStructure(mgmtStructureId: number): void {
        // find the record first
        let mgmtRecord = this.findmgmtRecord(mgmtStructureId);
        let level0siblings: any[] = null;
        let level0parent: any = null;
        let level1siblings: any[] = null;
        let level1parent: any = null;
        let level2siblings: any[] = null;
        let level2parent: any = null;
        let level3siblings: any[] = null;
        let level3parent: any = null;
        let level4siblings: any[] = null;
        let level4parent: any = null;
        if (mgmtRecord != undefined && mgmtRecord !== null && mgmtRecord.parentId !== null) {
            level0siblings = this.findmgmtSiblingRecords(mgmtRecord.parentId);
            level0parent = this.findmgmtRecord(mgmtRecord.parentId);
        }
        if (level0parent != undefined && level0parent != null && level0parent.parentId !== null) {
            level1siblings = this.findmgmtSiblingRecords(level0parent.parentId);
            level1parent = this.findmgmtRecord(level0parent.parentId);
        }
        if (level1parent != undefined && level1parent != null && level1parent.parentId !== null) {
            level2siblings = this.findmgmtSiblingRecords(level1parent.parentId);
            level2parent = this.findmgmtRecord(level1parent.parentId);
        }
        if (level2parent != undefined && level2parent != null && level2parent.parentId !== null) {
            level3siblings = this.findmgmtSiblingRecords(level2parent.parentId);
            level3parent = this.findmgmtRecord(level2parent.parentId);
        }
        if (level3parent != undefined && level3parent != null && level3parent.parentId !== null) {
            level4siblings = this.findmgmtSiblingRecords(level3parent.parentId);
            level4parent = this.findmgmtRecord(level3parent.parentId);
        }

        //means this is a company that is selected hence it has no parent
        if (level0parent == undefined || level0parent === null) {
            this.selectedCompanyID = mgmtStructureId;
            this.selectedBUId = 0;
            this.selectedDivisionID = 0;
            this.selectedDeptID = 0;
            return;
        }
        // this means bu is selected as Bu will have a level0 parent but nothing abobie
        if (level1parent == undefined || level1parent === null) {
            this.buList = level0siblings;
            this.selectedBUId = mgmtStructureId;
            this.selectedCompanyID = level0parent.managementStructureId;
            this.selectedDivisionID = 0;
            this.selectedDeptID = 0;
            return;
        }
        // this means division is selected as Bu will have a level0 parent but nothing abobie
        if (level2parent == undefined || level2parent === null) {
            this.divisionList = level0siblings
            this.selectedDivisionID = mgmtStructureId;
            this.buList = level1siblings;
            this.selectedBUId = level0parent.managementStructureId;
            this.selectedCompanyID = level1parent.managementStructureId;
            this.selectedDeptID = 0;
            return;
        }
        // this means dept is selected
        if (level3parent == undefined || level3parent === null) {

            this.departmentList = level0siblings;
            this.selectedDeptID = mgmtStructureId;
            this.divisionList = level1siblings;
            this.selectedDivisionID = level0parent.managementStructureId;
            this.buList = level2siblings;
            this.selectedBUId = level1parent.managementStructureId;
            this.selectedCompanyID = level2parent.managementStructureId;
            return;
        }

    }

    findmgmtRecord(id: number): any {
        return this.allmgmtData.find(c => c.managementStructureId === id);
    }

    findmgmtSiblingRecords(parentid: number): any[] {
        return this.allmgmtData.filter(c => c.parentId == parentid);
    }

    //Functionality for pagination.
    //to-do: Build lazy loading
    changePage(event: { first: any; rows: number }) {
        const pageIndex = (event.first / event.rows);
        this.pageIndex = pageIndex;
        this.pageSize = event.rows;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    }

    //Check if asset type exists before add/delete
    checkItemExists(rowData): boolean {
        //this.getItemList();
        //let item = this.newItem(rowData);
        //const exists = this.itemList.some(existingItem => existingItem.assetintangibleAttributeTypeId === item.assetintangibleAttributeTypeId);
        //return exists;
        return true;
    }

    //Open the confirmation to delete
    confirmItemDelete(rowData) {
        this.currentRow = rowData as AssetIntangibleAttributeType;
        this.currentModeOfOperation = ModeOfOperation.Delete;
    }

    //calls API to soft-delete
    deleteItem() {
        let item = this.currentRow;
        console.log('item', item);
        var itemExists = this.checkItemExists(item);
        console.log('itemExists : ', itemExists);
        if (itemExists) {
            this.currentModeOfOperation = ModeOfOperation.Update;
            item.updatedBy = this.userName;
            item.isDelete = true;
            this.coreDataService.remove(item.assetIntangibleAttributeTypeId).subscribe(response => {
                this.alertService.showMessage('Success', this.rowName + " removed successfully.", MessageSeverity.success);
                this.getItemList();
            });
        }
        this.dismissModal();
    }

    //Close open modal
    dismissModal() {
        this.currentRow = this.newItem(0);
        this.auditHistory = [];
        this.currentModeOfOperation = ModeOfOperation.None;
    }

    //Get the page's grid data
    getItemList() {
        this.coreDataService.getAll().subscribe(res => {
            this.originalTableData=res[0];
            this.getListByStatus(this.status ? this.status :this.currentstatus)

            
            // const responseData = res[0];
            // this.itemList = responseData;
            // this.totalRecords = responseData.length;
            // this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            // this.loadSelectedNames();
        })
    }

    newItem(rowData): AssetIntangibleAttributeType {
        let item = new AssetIntangibleAttributeType();
        this.disableForMgmtStructure = true;
        let defaultUserName = "admin";
        if (rowData) {
            item.assetIntangibleAttributeTypeId = rowData.assetIntangibleAttributeTypeId || 0;
            item.updatedBy = this.userName || defaultUserName;
            item.createdBy = this.userName || defaultUserName;
            item.isActive = rowData.isActive || false;
            item.isDelete = rowData.isDelete || false;
            item.isDeleted = rowData.isDeleted || false;
        }
        else {
            item.isActive = true;
            this.selectedCompanyID = 0;
            this.selectedBUId = 0;
            this.selectedDivisionID = 0;
            this.selectedDivisionID = 0;
        }
        this.recordExists = false;
        return item;
    }

    openItemForEdit(rowData): void {
        console.log(rowData.assetIntangibleAttributeTypeId);
        this.currentRow = this.newItem(rowData);
        this.recordExists = false;
        this.currentRow = {
            ...rowData,
            assetIntangibleAttributeName: getObjectById('assetIntangibleAttributeTypeId', rowData.assetIntangibleAttributeTypeId, this.itemList)
        };
        console.log(this.currentRow);
        this.currentModeOfOperation = ModeOfOperation.Update;
    }

    //to-do:onchange 
    //reorderValues(event) {
    //    this.columnHeaders.sort(function (a: any, b: any) { return (a.index > b.index) ? 1 : ((b.index > a.index) ? -1 : 0); });
    //}

    saveNewItem(): void {
        this.currentModeOfOperation = ModeOfOperation.Add;
        const data = {
            ...this.currentRow, createdBy: this.userName, updatedBy: this.userName, IsActive: this.currentRow.isActive, IsDeleted: this.currentRow.isDelete,
            assetIntangibleTypeId: editValueAssignByCondition('assetIntangibleTypeId', this.currentRow.assetIntangibleTypeId),
            assetDepreciationMethodId: editValueAssignByCondition('value', this.currentRow.assetDepreciationMethodId),
            intangibleLifeYears: editValueAssignByCondition('IntangibleLifeYears', this.currentRow.intangibleLifeYears),
            assetAmortizationIntervalId: editValueAssignByCondition('value', this.currentRow.assetAmortizationIntervalId),
            intangibleGLAccountId: editValueAssignByCondition('glAccountId', this.currentRow.intangibleGLAccountId),
            amortExpenseGLAccountId: editValueAssignByCondition('glAccountId', this.currentRow.amortExpenseGLAccountId),
            accAmortDeprGLAccountId: editValueAssignByCondition('glAccountId', this.currentRow.accAmortDeprGLAccountId),
            intangibleWriteDownGLAccountId: editValueAssignByCondition('glAccountId', this.currentRow.intangibleWriteDownGLAccountId),
            intangibleWriteOffGLAccountId: editValueAssignByCondition('glAccountId', this.currentRow.intangibleWriteOffGLAccountId),
            //managementStructureId: editValueAssignByCondition('managementStructureId', this.mgmtStructureId),
            managementStructureId: this.companyListData[0].value,
            MasterCompanyId: 1,
            selectedCompanyIds: this.selectedCompanyID.join(", "),
        };
        this.coreDataService.add(data).subscribe(response => {
            this.alertService.showMessage('Success', this.rowName + " added successfully.", MessageSeverity.success);
            this.getItemList();
        });
        this.currentModeOfOperation = ModeOfOperation.None;
    }

    saveExistingItem(rowData): void {
        let item = this.newItem(rowData);
        var itemExists = this.checkItemExists(item);
        if (itemExists) {
            this.currentModeOfOperation = ModeOfOperation.Update;
            item.updatedBy = this.userName;
            const data = {
                ...this.currentRow, updatedBy: this.userName,
                IsActive: this.currentRow.isActive, IsDeleted: this.currentRow.isDelete,
                assetIntangibleTypeId: editValueAssignByCondition('assetIntangibleTypeId', this.currentRow.assetIntangibleTypeId),
                assetDepreciationMethodId: editValueAssignByCondition('value', this.currentRow.assetDepreciationMethodId),
                intangibleLifeYears: editValueAssignByCondition('IntangibleLifeYears', this.currentRow.intangibleLifeYears),
                assetAmortizationIntervalId: editValueAssignByCondition('value', this.currentRow.assetAmortizationIntervalId),
                intangibleGLAccountId: editValueAssignByCondition('glAccountId', this.currentRow.intangibleGLAccountId),
                amortExpenseGLAccountId: editValueAssignByCondition('glAccountId', this.currentRow.amortExpenseGLAccountId),
                accAmortDeprGLAccountId: editValueAssignByCondition('glAccountId', this.currentRow.accAmortDeprGLAccountId),
                intangibleWriteDownGLAccountId: editValueAssignByCondition('glAccountId', this.currentRow.intangibleWriteDownGLAccountId),
                intangibleWriteOffGLAccountId: editValueAssignByCondition('glAccountId', this.currentRow.intangibleWriteOffGLAccountId),
                //managementStructureId: editValueAssignByCondition('managementStructureId', this.mgmtStructureId),
                managementStructureId: this.companyListData[0].value,
                MasterCompanyId: 1,
                selectedCompanyIds: this.selectedCompanyID.join(","),
            };
            console.log('data', data);
            this.coreDataService.update(data).subscribe(response => {
                this.alertService.showMessage('Success', this.rowName + " updated successfully.", MessageSeverity.success);
                this.getItemList();
            });
        } else {
            this.saveNewItem();
        }
        this.dismissModal();
    }

    //Open the audit history modal.
    showHistory(rowData): void {
        this.currentModeOfOperation = ModeOfOperation.Audit;
        let item = this.newItem(rowData);
        this.coreDataService.getItemAuditById(item.assetIntangibleAttributeTypeId).subscribe(audits => {
            if (audits[0].length > 0) {
                this.auditHistory = audits[0];
            }
        });
    }

    showItemEdit(rowData): void {
        console.log(rowData);
        this.disableSave = false;
        this.recordExists = false;
        this.isEditMode = true;
        //this.currentRow = this.newItem(rowData);
        this.currentRow = {
            ...rowData,
            assetIntangibleTypeId: getObjectById('assetIntangibleTypeId', rowData.assetIntangibleTypeId, this.allAssetIntangibleAttributeTypes),
            assetDepreciationMethodId: getObjectById('value', rowData.assetDepreciationMethodId, this.depreciationMethodList),
            assetAmortizationIntervalId: getObjectById('value', rowData.assetAmortizationIntervalId, this.depreciationFreqList),
            amortizationFrequency: rowData.assetAmortizationIntervalId,
            amortExpenseGLAccountId: getObjectById('glAccountId', rowData.amortExpenseGLAccountId, this.allGlInfo),
            accAmortDeprGLAccountId: getObjectById('glAccountId', rowData.accAmortDeprGLAccountId, this.allGlInfo),
            intangibleGLAccountId: getObjectById('glAccountId', rowData.intangibleGLAccountId, this.allGlInfo),
            intangibleWriteDownGLAccountId: getObjectById('glAccountId', rowData.intangibleWriteDownGLAccountId, this.allGlInfo),
            intangibleWriteOffGLAccountId: getObjectById('glAccountId', rowData.intangibleWriteOffGLAccountId, this.allGlInfo)
        };
        console.log(this.currentRow);
        this.currentRow = { ...this.currentRow };
        this.mgmtStructureId = this.currentRow.managementStructureId;
        this.populateMgmtStructure(this.currentRow.managementStructureId);
        this.selectedCompanyID = (rowData.selectedCompanyIds != null && rowData.selectedCompanyIds != undefined) ? rowData.selectedCompanyIds.split(",") : [];
        if (rowData.selectedCompanyIds != "")
            this.disableForMgmtStructure = false;
        else
            this.disableForMgmtStructure = true;
        for (let i = 0; i < this.itemList.length; i++) {
            if (this.itemList[i].assetIntangibleAttributeTypeId == this.currentRow.assetIntangibleAttributeTypeId) {
                this.selectedRow = this.itemList[i];
            }
        }

        this.currentModeOfOperation = ModeOfOperation.Update;
    }

    //turn the item active/inActive
    toggleActiveStatus(rowData) {
        this.currentRow = rowData as AssetIntangibleAttributeType;
        this.selectedCompanyID = (rowData.selectedCompanyIds != null && rowData.selectedCompanyIds != undefined) ? rowData.selectedCompanyIds.split(",") : [];
        this.saveExistingItem(rowData);
    }

    updateItem(): void {
        this.saveExistingItem(this.currentRow);
    }

    viewItemDetails(rowData) {
        this.itemDetails = rowData;
    }
    //AssetIntangibleAttributeTypeModel
    loadManagementdata() {
        this.legalEntityService.getManagemententity().subscribe(
            res => {
                this.loadHierarchy(res[0])
            });
    }

    loadHierarchy(mgmtStructureData) {
        this.allmgmtData = mgmtStructureData;
        this.companyListData = [];
        this.companyList = this.allmgmtData.filter(c => c.parentId == null);
        if (this.companyList.length > 0) {
            for (let i = 0; i < this.companyList.length; i++) {
                this.companyListData.push(
                    { value: this.companyList[i].managementStructureId, label: this.companyList[i].code },
                );
            }
        }
    }

    getCompanyName(managementStructureId) {
        let label = "";
        for (let i = 0; i < this.companyListData.length; i++) {
            if (this.companyListData[i].value == managementStructureId) {
                label = this.companyListData[i].label
                break;
            }
        }
        return label;
    }

    //Step x: load all the required data for the page to function
    private loadData() {
        this.glList();
        this.getAllFrequency();
        this.getAllDepreMthod();
        this.loadManagementdata();
        this.getIntangibleTypeList();
        this.getItemList();
        console.log(this.itemList);

        this.rowName = "Intangible Attribute Type";
        this.header = "Intangible Attribute  Type";
        this.breadCrumb.currentUrl = '/singlepages/singlepages/app-asset-intangible-attribute-type';
        this.breadCrumb.bredcrumbObj.next(this.breadCrumb.currentUrl);
        //Step x: Add the required details for dropdown options/column header
        this.columnHeaders = [
            //{ field: 'companyName', header: 'Company', index: 1, showByDefault: true },
            //{ field: 'buName', header: 'BU', index: 2, showByDefault: true },
            //{ field: 'divisionName', header: 'Division', index: 3, showByDefault: true },
            //{ field: 'deptName', header: 'Dept', index: 4, showByDefault: true },
            { field: 'intangibleClass', header: 'Intangible Class', index: 1, showByDefault: true },
            { field: 'amortizationMethod', header: 'Amortization Method', index: 1, showByDefault: true },
            { field: 'intangibleLifeYears', header: 'Intangible Life', index: 1, showByDefault: true },
            { field: 'amortFrequency', header: 'Amort Frequency', index: 1, showByDefault: true },
            { field: 'amortExpenseGL', header: 'Amort Expense GL', index: 1, showByDefault: true },
            { field: 'accAmortDeprGL', header: 'Acc Amort Depr GL', index: 1, showByDefault: true },
            { field: 'intangibleGL', header: 'Intangible GL', index: 1, showByDefault: true },
            { field: 'intangibleWriteDownGL', header: 'Intangible Write Down GL', index: 1, showByDefault: true },
            { field: 'intangibleWriteOffGL', header: 'Intangible Write Off GL', index: 1, showByDefault: true },
            { field: 'selectedCompanyNames', header: 'Legal Entity', index: 1, showByDefault: true },
        ];
        this.currentModeOfOperation = ModeOfOperation.None;
        this.selectedColumns = this.columnHeaders;
        this.currentRow = new AssetIntangibleAttributeType();
        this.currentRow.isActive = true;
        this.getItemList();
    }

    sampleExcelDownload() {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=AssetIntangibleAttributeType&fileName=AssetIntangibleAttributeType.xlsx`;

        window.location.assign(url);
    }

    customExcelUpload(
        event) {
        const file = event.target.files;

        console.log(file);
        if (file.length > 0) {

            this.formData.append('file', file[0])
            this.coreDataService.bulkUpload(this.formData).subscribe(res => {
                event.target.value = '';

                this.formData = new FormData();
                console.log(res);
                this.existingRecordsResponse = res;
                this.showBulkUploadResult(res);
                this.getItemList();
                this.alertService.showMessage(
                    'Success',
                    `Successfully Uploaded  `,
                    MessageSeverity.success
                );

                // $('#duplicateRecords').modal('show');
                // document.getElementById('duplicateRecords').click();

            });
            console.log(this.existingRecordsResponse);
        }

    }

    showBulkUploadResult(items: any) {
        let successCount = items.filter(item => item.UploadTag == UploadTag.Success);
        let failedCount = items.filter(item => item.UploadTag == UploadTag.Failed);
        let duplicateCount = items.filter(item => item.UploadTag == UploadTag.Duplicate);
        this.alertService.showMessage('Success', `${successCount} ${this.rowName}${successCount > 1 ? 's' : ''} uploaded successfully.`, MessageSeverity.success);
        this.alertService.showMessage('Error', `${failedCount} ${this.rowName}${failedCount > 1 ? 's' : ''} failed to upload.`, MessageSeverity.error);
        this.alertService.showMessage('Info', `${duplicateCount} ${duplicateCount > 1 ? 'duplicates' : 'duplicate'} ignored.`, MessageSeverity.info);
    }

    eventHandler(event) {
        let value = event.target.value.toLowerCase()
        if (this.selectedAssetIntangible) {
            if (value == this.selectedAssetIntangible.toLowerCase()) {
                this.disableSave = true;
            }
            else {
                this.disableSave = false;
            }
        }
    }

    itemId(event) {
        for (let i = 0; i < this.allAssetIntangibleAttributeTypes.length; i++) {
            if (event == this.allAssetIntangibleAttributeTypes[i].assetIntangibleTypeId) {
                this.disableSave = true;
                this.selectedAssetIntangible = event;
                return this.allAssetIntangibleAttributeTypes[i].assetIntangibleName;
            }
        }
        return "";
    }
    selectedName(object) {
        const exists = selectedValueValidate('assetIntangibleName', object, this.currentRow);
        this.disableSave = !exists;
    }

    filterAssetIntangibleName(event) {
        this.filteredAssetIntangibleTypes = this.allAssetIntangibleTypes;

        const IntangibleData = [...this.allAssetIntangibleTypes.filter(x => {
            return x.assetIntangibleName.toLowerCase().includes(event.query.toLowerCase())
        })]
        this.allAssetIntangibleTypes = IntangibleData;
    }

    filterIntangibleNames(event) {
        this.localCollection = [];
        for (let i = 0; i < this.itemList.length; i++) {
            let assetIntangibleName = this.allAssetIntangibleTypes[i].assetIntangibleName;
            if (assetIntangibleName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.allAssetIntangibleAttributeTypes.push([{
                    //"AssetIntangibleAttributeTypeId": this.itemList[i].AssetIntangibleAttributeTypeId,
                    "assetIntangibleName": assetIntangibleName
                }]),
                    this.localCollection.push(assetIntangibleName);
            }
        }
        console.log('this.localCollection', this.localCollection);
    }

    checkReasonCodeExists(field, value) {
        const exists = validateRecordExistsOrNot(field, value, this.itemList, this.currentRow);
        if (exists.length > 0) {
            this.disableSave = true;
        }
        else {
            this.disableSave = false;
        }

    }

    viewItemDetailsClick(content, row) {
        //console.log(content);
        this.itemDetails = row;
        //this.loadMasterCompanies();
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }

    dismissModel() {
        this.currentModeOfOperation = ModeOfOperation.None;
        this.modal.close();
    }

    onBlurCheck(event, field) {
        //console.log(field);
        //console.log(event);
        //console.log(this.selectedRow);

        //console.log(this.code);
        if (this.isEditMode) {
            for (let attr in this.currentRow as AssetIntangibleAttributeType) {
                //console.log(attr, field);
                if (attr == 'assetIntangibleTypeId') {
                    let oldValue = editValueAssignByCondition('assetIntangibleTypeId', this.selectedRow.assetIntangibleTypeId);
                    let newValue = editValueAssignByCondition('assetIntangibleTypeId', this.currentRow.assetIntangibleTypeId);
                    if (oldValue != newValue)
                        this.disableSave = false;
                }
                else if (attr == 'assetDepreciationMethodId') {
                    //console.log('assetDepreciationMethodId');
                    let oldValue = editValueAssignByCondition('value', this.selectedRow.assetDepreciationMethodId);
                    let newValue = editValueAssignByCondition('value', this.currentRow.assetDepreciationMethodId);
                    //console.log(oldValue, newValue);
                    if (oldValue != newValue)
                        this.disableSave = false;
                }
                else if (attr == 'intangibleLifeYears') {
                    let oldValue = this.selectedRow.intangibleLifeYears;
                    let newValue = this.currentRow.intangibleLifeYears;
                    if (oldValue != newValue)
                        this.disableSave = false;
                }
                else if (attr == 'assetAmortizationIntervalId') {
                    let oldValue = editValueAssignByCondition('value', this.selectedRow.assetAmortizationIntervalId);
                    let newValue = editValueAssignByCondition('value', this.currentRow.assetAmortizationIntervalId);
                    if (oldValue != newValue)
                        this.disableSave = false;
                }
                else if (attr == 'amortExpenseGLAccountId') {
                    let oldValue = editValueAssignByCondition('glAccountId', this.selectedRow.amortExpenseGLAccountId);
                    let newValue = editValueAssignByCondition('glAccountId', this.currentRow.amortExpenseGLAccountId);
                    if (oldValue != newValue)
                        this.disableSave = false;
                }
                else if (attr == 'amortExpenseGLAccountId') {
                    let oldValue = editValueAssignByCondition('glAccountId', this.selectedRow.amortExpenseGLAccountId);
                    let newValue = editValueAssignByCondition('glAccountId', this.currentRow.amortExpenseGLAccountId);
                    if (oldValue != newValue)
                        this.disableSave = false;
                }
                else if (attr == 'accAmortDeprGLAccountId') {
                    let oldValue = editValueAssignByCondition('glAccountId', this.selectedRow.accAmortDeprGLAccountId);
                    let newValue = editValueAssignByCondition('glAccountId', this.currentRow.accAmortDeprGLAccountId);
                    if (oldValue != newValue)
                        this.disableSave = false;
                }
                else if (attr == 'intangibleGLAccountId') {
                    let oldValue = editValueAssignByCondition('glAccountId', this.selectedRow.intangibleGLAccountId);
                    let newValue = editValueAssignByCondition('glAccountId', this.currentRow.intangibleGLAccountId);
                    if (oldValue != newValue)
                        this.disableSave = false;
                }
                else if (attr == 'intangibleWriteDownGLAccountId') {
                    let oldValue = editValueAssignByCondition('glAccountId', this.selectedRow.intangibleWriteDownGLAccountId);
                    let newValue = editValueAssignByCondition('glAccountId', this.currentRow.intangibleWriteDownGLAccountId);
                    if (oldValue != newValue)
                        this.disableSave = false;
                }
                else if (attr == 'intangibleWriteOffGLAccountId') {
                    let oldValue = editValueAssignByCondition('glAccountId', this.selectedRow.intangibleWriteOffGLAccountId);
                    let newValue = editValueAssignByCondition('glAccountId', this.currentRow.intangibleWriteOffGLAccountId);
                    console.log(oldValue, newValue);
                    if (oldValue != newValue)
                        this.disableSave = false;
                }
            }
        }
        console.log(this.disableSave);
    }

    onActiveClick() {
        if (this.isEditMode == true)
            this.disableSave = false;
    }

    getDeleteListByStatus(value){
        if(value){
            this.currentDeletedstatus=true;
        }else{
            this.currentDeletedstatus=false;
        }
        this.getListByStatus(this.status ? this.status : this.currentstatus)
            }
            
	originalTableData:any=[];
    currentDeletedstatus:boolean=false;
    status:any="Active";
    getListByStatus(status) {
        const newarry=[];
        if(status=='Active'){ 
            this.status=status;
			if(this.currentDeletedstatus==false){
			   this.originalTableData.forEach(element => {
				if(element.isActive ==true && element.isDeleted ==false){
				newarry.push(element);
				}
			   });
	       }else{
		        this.originalTableData.forEach(element => {
				if(element.isActive ==true && element.isDeleted ==true){
			     newarry.push(element);
				}
			   });
	   }
         this.itemList=newarry;
        }else if(status=='InActive' ){
            this.status=status;
			if(this.currentDeletedstatus==false){
				this.originalTableData.forEach(element => {
				 if(element.isActive ==false && element.isDeleted ==false){
				 newarry.push(element);
				 }
				});
			}else{
				 this.originalTableData.forEach(element => {
				 if(element.isActive ==false && element.isDeleted ==true){
				  newarry.push(element);
				 }
				});
		}
              this.itemList = newarry; 
        }else if(status== 'ALL'){
            this.status=status;
			if(this.currentDeletedstatus==false){
                // this.billingInfoList=this.originalTableData;
                this.originalTableData.forEach(element=>{
					if(element.isDeleted==false){
						newarry.push(element);
					}
				});
				this.itemList= newarry;
			}else{
				this.originalTableData.forEach(element=>{
					if(element.isDeleted==true){
						newarry.push(element);
					}
				});
				this.itemList= newarry;
			}
        }
        this.totalRecords = this.itemList.length ;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        }
        restore(content, rowData) {
            this.restorerecord = rowData;
            this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
            this.modal.result.then(() => {
                console.log('When user closes');
            }, () => { console.log('Backdrop click') })
        }
        restorerecord:any={}
        restoreRecord(){  
            this.commonService.updatedeletedrecords('AssetIntangibleType',
            'AssetIntangibleTypeId',this.restorerecord.assetIntangibleAttributeTypeId, ).subscribe(res => {
                this.currentDeletedstatus=true;
                this.modal.close();
                // this.geListByStatus(this.status ? this.status : 'Active');
                this.loadData();
    
                this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
            })
        }
 
}