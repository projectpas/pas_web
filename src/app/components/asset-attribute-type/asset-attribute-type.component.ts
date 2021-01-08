import { OnInit, Component } from "@angular/core";
import { fadeInOut } from "../../services/animations";
import { AlertService, MessageSeverity } from "../../services/alert.service";
// import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "../../services/auth.service";
import { AuditHistory } from '../../models/audithistory.model';
import { SingleScreenBreadcrumbService } from "../../services/single-screens-breadcrumb.service";
import { AssetAttributeType } from "../../models/asset-attribute-type.model";
import { AssetAttributeTypeService } from "../../services/asset-attribute-type/asset-attribute-type.service";
import { ModeOfOperation } from "../../models/ModeOfOperation.enum";
import { GlAccountService } from '../../services/glAccount/glAccount.service';
import { GlAccount } from '../../models/GlAccount.model';
import { AssetTypeService } from "../../services/asset-type/asset-type.service";
import { AssetType } from "../../models/asset-type.model";
import { MasterCompany } from '../../models/mastercompany.model';
import { LegalEntityService } from '../../services/legalentity.service';
import { validateRecordExistsOrNot, getObjectById, selectedValueValidate, editValueAssignByCondition } from '../../generic/autocomplete';
import { PercentService } from '../../services/percent.service';
import { DepriciationMethodService } from '../../services/depriciation-method/depriciation.service';
import { DepriciationMethod } from '../../models/depriciation-method.model';
import { CommonService } from '../../services/common.service';
import { ConfigurationService } from '../../services/configuration.service';
import { UploadTag } from "../../models/UploadTag.enum";

 
import { NgbModal,NgbModalRef, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'app-asset-attribute-type',
    templateUrl: './asset-attribute-type.component.html',
    styleUrls: ['./asset-attribute-type.component.scss'],
    animations: [fadeInOut]
})
export class AssetAttributeTypeComponent implements OnInit {
    itemList: any[] = [];
    columnHeaders: any[];
    itemDetails: any;
    currentRow: AssetAttributeType;
    currentRowData: AssetAttributeType;
    currentModeOfOperation: ModeOfOperation;
    rowName: string;
    header: string;
    disableSave: boolean = false;
    recordExists: boolean = false;
    loadingIndicator: boolean;
    totalRecords: any;
    pageIndex: number = 0;
    pageSize: number = 10;
    totalPages: number;
    modal: NgbModalRef;
    selectedColumns: any[];
    auditHistory: any[];
    allGlInfo: any[] = [];
    allAssetTypes: any[] = [];
    assetAttrType: any = {};
    filteredGLAccountList: any[] = [];
    filteredAssetTypeList: any[] = [];
    filteredDepriciationMethod: any[] = [];
    percentageList: any[] = [];
    filteredPercentageList: any[] = [];

    currentstatus: string = 'Active';

    companyList: any[];
    companyListData: any[] = [];
    buList: any[];
    divisionList: any[];
    departmentList: any[];
    selectedCompanyID: any = [];
    selectedBUId: number = 0;
    selectedDivisionID: number = 0;
    selectedDeptID: number = 0;
    allmgmtData: any[];
    mgmtStructureId: any;
    disableForMgmtStructure: boolean = false;
    depriciationMethodList: any[] = [];
    conventionTypeList: any[] = [];
    objectKeys = Object.keys;
    depreciationFreq: any[] = [];
    assetSaleList: any[] = [];
    filteredAssetSaleList: any[] = [];
    assetWriteOffList: any[] = [];
    filteredWriteOffList: any[] = [];
    assetWriteDownList: any[] = [];
    filteredAssetWriteDownList: any[] = [];
    formData: FormData;

    constructor(private breadCrumb: SingleScreenBreadcrumbService,
        private commonService: CommonService,
         private alertService: AlertService, private configurations: ConfigurationService,
          private depriciationMethodService: DepriciationMethodService, 
          private coreDataService: AssetAttributeTypeService, private assetTypeService: AssetTypeService, private glAccountService: GlAccountService, public legalEntityService: LegalEntityService, public percentService: PercentService, private modalService: NgbModal, private authService: AuthService
        ,private commonservice: CommonService) {
    }
    ngOnInit(): void {
        //gather up all the required data to be displayed on the screen 
        this.loadData();
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

    private onGlAccountLoad(getGlList: GlAccount[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.allGlInfo = getGlList;
        this.loadSelectedNames();
    }

    //loading all AssetTypes//
    private getAssetTypeList() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.assetTypeService.getAll().subscribe(
            results => this.onAssetTypeLoad(results[0]),
            error => this.onDataLoadFailed(error)
        );
    }

    private onAssetTypeLoad(getAssetTypeList: AssetType[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.allAssetTypes = getAssetTypeList;
        this.loadSelectedNames();
    }

    private onDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

    }
    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }

    filterAssetType(event): void {
        this.filteredAssetTypeList = this.allAssetTypes;
        const ASSETADATA = [...this.allAssetTypes.filter(x => {
            return x.assetTypeName.toLowerCase().includes(event.query.toLowerCase())
        })]
        this.filteredAssetTypeList = ASSETADATA;
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
            return x.accountCode.toLowerCase().includes(event.query.toLowerCase())
        })]
        this.filteredAssetSaleList = GLADATA;
    }

    filterAssetWriteOff(event): void {
        this.filteredWriteOffList = this.allGlInfo;
        const GLADATA = [...this.allGlInfo.filter(x => {
            return x.accountCode.toLowerCase().includes(event.query.toLowerCase())
        })]
        this.filteredWriteOffList = GLADATA;
    }

    filterAssetWriteDown(event): void {
        this.filteredAssetWriteDownList = this.allGlInfo;
        const GLADATA = [...this.allGlInfo.filter(x => {
            return x.accountCode.toLowerCase().includes(event.query.toLowerCase())
        })]
        this.filteredAssetWriteDownList = GLADATA;
    }

    filterDepriciationMethod(event): void {
        this.filteredDepriciationMethod = this.depriciationMethodList;
        const DEPDATA = [...this.depriciationMethodList.filter(x => {
            return x.name.toLowerCase().includes(event.query.toLowerCase())
        })]
        this.filteredDepriciationMethod = DEPDATA;
    }

    loadManagementdata() {
        this.legalEntityService.getManagemententity().subscribe(
            results => this.loadHierarchy(results[0]),
            error => this.onDataLoadFailed(error)
        );
    }

    loadHierarchy(mgmtStructureData) {
        this.allmgmtData = mgmtStructureData;
        this.companyListData = [];
        this.companyList = this.allmgmtData.filter(c => c.parentId == null);
        if (this.companyList.length > 0) {
            for (let i = 0; i < this.companyList.length; i++ ) {
                this.companyListData.push(
                    { value: this.companyList[i].managementStructureId, label: this.companyList[i].code },
                );
            }
        }
        //console.log('companyListData', this.companyListData);
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

    loadDepricationMethod() {
        this.depriciationMethodService.getAll().subscribe(depriciationmethods => {
            this.depriciationMethodList = depriciationmethods[0].columnData;
            this.loadSelectedNames();
        });
        ////console.log(this.depriciationMethodList);
    }

    companySelected(): void {
        console.log(`Company Id :${this.selectedCompanyID}`);

        if (this.selectedCompanyID != undefined && this.selectedCompanyID.length > 0) {
            //this.mgmtStructureId = this.selectedCompanyID;
            this.disableForMgmtStructure = false;
        }
        else {
            this.disableForMgmtStructure = true;
        }
        /*this.divisionList = [];
        this.departmentList = [];
        this.selectedBUId = 0;
        this.selectedDeptID = 0;
        this.selectedDivisionID = 0;
        this.buList = this.allmgmtData.filter(c => c.parentId === this.selectedCompanyID);*/
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

    getAllPercentage() {
        this.commonservice.smartDropDownList('[Percent]', 'PercentId', 'PercentValue').subscribe(res => {
            //////console.log('res: '+res);
            this.percentageList = res;
        });
        //////console.log('percentge list : ', this.percentageList);
    }

    getAllFrequency() {
        this.commonservice.smartDropDownList('[AssetDepreciationFrequency]', 'AssetDepreciationFrequencyId', 'Name').subscribe(res => {
            this.depreciationFreq = res;
            this.loadSelectedNames();
        })
    }

    getAllConventionTypes() {
        this.commonservice.smartDropDownList('[ConventionType]', 'ConventionTypeId', 'Name').subscribe(res => {
            this.conventionTypeList = res;
            ////console.log('conventionTypeList', this.conventionTypeList);
            this.loadSelectedNames();
        });
        //console.log('itemList',this.itemList);
    }

    filterPercentage(event) {
        ////console.log(parseInt(event.query));
        this.filteredPercentageList = this.percentageList;

        this.filteredPercentageList = [...this.percentageList.filter(x => {
            ////console.log(x);

            return x.percentValue.includes(parseInt(event.query))
        })]
    }

    //for auditing
    get userName(): string {
        //to-do:fix the empty username
        return this.authService.currentUser ? this.authService.currentUser.userName : "admin";
    }

    //Step E1: Open row up for editing
    addNewItem(): void {
        this.currentRow = new AssetAttributeType();
        this.currentRow.isDelete = false;
        this.currentRow.residualValue = 1;
        this.currentRow.residualPercentage = 0;
        this.currentRow.isActive = true;
        //this.currentRow.managementStructureId= 1;
        this.currentRow.selectedCompanyIds = "";
        this.selectedCompanyID = [];
        this.selectedBUId = 0;
        this.selectedDivisionID = 0;
        this.selectedDeptID = 0;
        this.recordExists = false;
        this.disableForMgmtStructure = true;
        ////console.log(new AssetAttributeType().assetAttributeTypeName);
        ////console.log(this.currentRow.assetAttributeTypeName);
        this.currentModeOfOperation = ModeOfOperation.Add;
    }

    //Functionality for pagination.
    //to-do: Build lazy loading
    changePage(event: { first: any; rows: number }) {
        const pageIndex = (event.first / event.rows);
        this.pageIndex = pageIndex;
        this.pageSize = event.rows;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    }

    //Check if asset attr type exists before add/delete
    checkItemExists(rowData): boolean {
        //this.getItemList();
        return true;
        /*
        let item = rowData as AssetAttributeType;
        const exists = this.itemList.some(existingItem =>
            existingItem.assetAttributeTypeId == item.assetAttributeTypeId
            &&
            existingItem.assetAttributeTypeName == item.assetAttributeTypeName &&
            existingItem.description == item.description &&
            existingItem.conventionType == item.conventionType &&
            existingItem.depreciationMethod == item.depreciationMethod &&
            existingItem.residualPercentage == item.residualPercentage &&
            existingItem.residualValue == item.residualValue &&
            existingItem.assetLife == item.assetLife &&
            existingItem.depreciationFrequencyId == item.depreciationFrequencyId &&
            existingItem.acquiredGLAccountId == item.acquiredGLAccountId &&
            existingItem.deprExpenseGLAccountId == item.deprExpenseGLAccountId &&
            existingItem.adDepsGLAccountId == item.adDepsGLAccountId &&
            existingItem.assetSale == item.assetSale &&
            existingItem.assetWriteOff == item.assetWriteOff &&
            existingItem.assetWriteDown == item.assetWriteDown
        );
        return exists; */
    }

    //Open the confirmation to delete
    confirmItemDelete(rowData) {
        this.currentRow = rowData as AssetAttributeType;
        this.currentModeOfOperation = ModeOfOperation.Delete;
    }

    //calls API to soft-delete
    deleteItem() {
        let item = this.currentRow;
        var itemExists = this.checkItemExists(item);
        if (itemExists) {
            this.currentModeOfOperation = ModeOfOperation.Update;
            item.updatedBy = this.userName;
            //item.isDelete = true;
            this.coreDataService.remove(item.assetAttributeTypeId).subscribe(response => {
                this.alertService.showMessage('Success', this.rowName + " removed successfully.", MessageSeverity.success);
                this.getItemList();
            });
        }
        this.dismissModal();
    }

    //Close open modal
    dismissModal() {
        this.currentRow = new AssetAttributeType();
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
            this.loadDepricationMethod();
            this.glList();
            this.getAssetTypeList();
            this.loadManagementdata();
            this.getAllPercentage();
            this.getAllFrequency();
            this.getAllConventionTypes();
        });
    }

    newItem(rowData): AssetAttributeType {
        let userName = this.userName || "admin";
        rowData.updatedBy = rowData.updatedBy || userName;
        rowData.isActive = rowData.isActive || false;
        rowData.isDelete = rowData.isDelete || false;
        rowData.residualPercentage = rowData.residualPercentage || 0;
        let item = new AssetAttributeType(rowData.assetAttributeTypeId, rowData.assetTypeId, rowData.description,
            rowData.assetAttributeTypeName, rowData.conventionType, rowData.depreciationMethod, rowData.residualPercentage,
            rowData.residualValue, rowData.assetLife, rowData.depreciationFrequencyId, rowData.acquiredGLAccountId,
            rowData.deprExpenseGLAccountId, rowData.adDepsGLAccountId, rowData.assetSale, rowData.assetWriteOff, rowData.assetWriteDown,
            rowData.selectedCompanyIds,
            rowData.createdBy, rowData.createdDate, rowData.updatedDate, rowData.updatedBy, rowData.isActive, rowData.isDelete);
        debugger;
        return item;
    }

    /*
    openItemForEdit(rowData): void {
        ////console.log('adDepsGLAccountId = '+rowData.adDepsGLAccountId);
        this.currentRow = {
            ...rowData,
            acquiredGLAccountId: getObjectById('acquiredGLAccountId', rowData.acquiredGLAccountId, this.allGlInfo)
        };
        ////console.log("acquiredGLAccountId = "+this.currentRow.acquiredGLAccountId);
        this.currentModeOfOperation = ModeOfOperation.Update;
    }*/

    saveNewItem(): void {
        this.currentModeOfOperation = ModeOfOperation.Add;
        //console.log(this.currentRow);
        const data = {
            ...this.currentRow, createdBy: this.userName, updatedBy: this.userName,
            acquiredGLAccountId: editValueAssignByCondition('glAccountId', this.currentRow.acquiredGLAccountId),
            adDepsGLAccountId: editValueAssignByCondition('glAccountId', this.currentRow.adDepsGLAccountId),
            deprExpenseGLAccountId: editValueAssignByCondition('glAccountId', this.currentRow.deprExpenseGLAccountId),
            assetTypeId: editValueAssignByCondition('assetTypeId', this.currentRow.assetTypeId),
            conventionType: editValueAssignByCondition('value', this.currentRow.conventionType),
            residualPercentage: editValueAssignByCondition('value', this.currentRow.residualPercentage),
            depreciationFrequencyId: editValueAssignByCondition('value', this.currentRow.depreciationFrequencyId),
            depreciationMethod: editValueAssignByCondition('assetDepreciationMethodId', this.currentRow.depreciationMethod),
            assetSale: editValueAssignByCondition('glAccountId', this.currentRow.assetSale),
            assetWriteOff: editValueAssignByCondition('glAccountId', this.currentRow.assetWriteOff),
            assetWriteDown: editValueAssignByCondition('glAccountId', this.currentRow.assetWriteDown),
            managementStructureId: editValueAssignByCondition('managementStructureId', this.mgmtStructureId),
            //managementStructureId: 115,
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
        let item = rowData as AssetAttributeType;
        ////console.log('saveExistingItem:',item);
        var itemExists = this.checkItemExists(item);
        if (itemExists) {
            this.currentModeOfOperation = ModeOfOperation.Update;
            const data = {
                ...item, updatedBy: this.userName,
                acquiredGLAccountId: editValueAssignByCondition('glAccountId', this.currentRow.acquiredGLAccountId),
                adDepsGLAccountId: editValueAssignByCondition('glAccountId', this.currentRow.adDepsGLAccountId),
                deprExpenseGLAccountId: editValueAssignByCondition('glAccountId', this.currentRow.deprExpenseGLAccountId),
                assetTypeId: editValueAssignByCondition('assetTypeId', this.currentRow.assetTypeId),
                conventionType: editValueAssignByCondition('value', this.currentRow.conventionType),
                residualPercentage: editValueAssignByCondition('value', this.currentRow.residualPercentage),
                depreciationFrequencyId: editValueAssignByCondition('value', this.currentRow.depreciationFrequencyId),
                depreciationMethod: editValueAssignByCondition('assetDepreciationMethodId', this.currentRow.depreciationMethod),
                assetSale: editValueAssignByCondition('glAccountId', this.currentRow.assetSale),
                assetWriteOff: editValueAssignByCondition('glAccountId', this.currentRow.assetWriteOff),
                assetWriteDown: editValueAssignByCondition('glAccountId', this.currentRow.assetWriteDown),
                managementStructureId: editValueAssignByCondition('managementStructureId', this.mgmtStructureId),
                //managementStructureId: 115,
                MasterCompanyId: 1,
                selectedCompanyIds: this.selectedCompanyID.join(", "),
            };
            //console.log('saveExistingItem:', data);
            this.coreDataService.update(data).subscribe(response => {
                this.alertService.showMessage('Success', this.rowName + " updated successfully.", MessageSeverity.success);
                this.getItemList();
            });
        } else {
            //console.log('going for insert');
            this.saveNewItem();
        }
        this.dismissModal();
    }

    //Open the audit history modal.
    showHistory(rowData): void {
        this.currentModeOfOperation = ModeOfOperation.Audit;
        let item = rowData as AssetAttributeType;
        this.coreDataService.getItemAuditById(item.assetAttributeTypeId).subscribe(audits => {
            if (audits[0].length > 0) {
                this.auditHistory = audits[0];
            }
        });
    }

    selectedAssetType(object) {
        //console.log('selectedAssetType.assetTypeName', this.currentRow.assetTypeId);
        //console.log('selectedAssetType.memo', object.assetTypeMemo);
        
        console.log(object.assetTypeId);
        for (let i = 0; i < this.itemList.length; i++) {
            if ((this.itemList[i].assetTypeId === object.assetTypeId && this.currentModeOfOperation == 2)
                || (this.itemList[i].assetTypeId === object.assetTypeId && this.currentModeOfOperation == 3 &&
                this.currentRow.assetAttributeTypeId != this.itemList[i].assetAttributeTypeId)
            ) {
                this.recordExists = true;
                this.disableSave = true;
                return;
            }
        }
        this.disableSave = false;
        this.recordExists = false;
        this.currentRow.description = object.assetTypeMemo;
    }

    showItemEdit(rowData): void {
        this.currentModeOfOperation = ModeOfOperation.Update;
        //this.disableSave = true;
        this.recordExists = false;
        console.log('rowData', rowData);
        this.currentRowData = rowData;
        this.currentRow = {
            ...rowData,
            assetTypeId: getObjectById('assetTypeId', rowData.assetTypeId, this.allAssetTypes),
            acquiredGLAccountId: getObjectById('glAccountId', rowData.acquiredGLAccountId, this.allGlInfo),
            deprExpenseGLAccountId: getObjectById('glAccountId', rowData.deprExpenseGLAccountId, this.allGlInfo),
            adDepsGLAccountId: getObjectById('glAccountId', rowData.adDepsGLAccountId, this.allGlInfo),
            depreciationMethod: getObjectById('assetDepreciationMethodId', rowData.depreciationMethod, this.depriciationMethodList),
            depreciationFrequencyId: getObjectById('value', rowData.depreciationFrequencyId, this.depreciationFreq),
            conventionType: getObjectById('value', rowData.conventionType, this.conventionTypeList),
            residualPercentage: getObjectById('value', rowData.residualPercentage, this.percentageList),
            assetSale: getObjectById('glAccountId', rowData.assetSale, this.allGlInfo),
            assetWriteOff: getObjectById('glAccountId', rowData.assetWriteOff, this.allGlInfo),
            assetWriteDown: getObjectById('glAccountId', rowData.assetWriteDown, this.allGlInfo),
            selectedCompanyID: (rowData.selectedCompanyIds != null && rowData.selectedCompanyIds != undefined) ? rowData.selectedCompanyIds.split(",") : "",
        };
        this.currentRow = { ...this.currentRow };
        this.mgmtStructureId = this.currentRow.managementStructureId;
        this.selectedCompanyID = (rowData.selectedCompanyIds != null && rowData.selectedCompanyIds != undefined) ? rowData.selectedCompanyIds.split(",") : [];
        console.log('rowData', rowData);
        if (this.selectedCompanyID.length > 0)
            this.disableForMgmtStructure = false;
        else
            this.disableForMgmtStructure = true;
        //this.populateMgmtStructure(this.currentRow.managementStructureId);
        //console.log("conventionType = " + this.currentRow);
    }

    //turn the item active/inActive
    toggleActiveStatus(rowData) {
        this.currentRow = rowData as AssetAttributeType;
        this.selectedCompanyID = (rowData.selectedCompanyIds != null && rowData.selectedCompanyIds != undefined) ? rowData.selectedCompanyIds.split(",") : [];
        this.saveExistingItem(this.currentRow);
    }

    updateItem(): void {
        this.saveExistingItem(this.currentRow);
    }

    viewItemDetails(rowData) {
        this.itemDetails = rowData;
    }

    loadSelectedNames() {
        //console.log('loadSelectedNames', this.itemList.length);
        for (let i = 0; i < this.itemList.length; i++) {
            let companies = "";
            this.itemList[i].assetTypeName = this.getAssetTypeNameById(this.itemList[i].assetTypeId);
            //console.log(this.itemList[i].assetTypeName);
            this.itemList[i].conventionTypeName = this.getConvNameById(this.itemList[i].conventionType);
            this.itemList[i].depreciationMethodName = this.getDeprMethodNameById(this.itemList[i].depreciationMethod);
            this.itemList[i].depreciationFrequencyName = this.getFreqLabelById(this.itemList[i].depreciationFrequencyId);
            this.itemList[i].acquiredGLAccountName = this.getAccCodeById(this.itemList[i].acquiredGLAccountId);
            this.itemList[i].deprExpenseGLAccountName = this.getAccCodeById(this.itemList[i].deprExpenseGLAccountId);
            this.itemList[i].adDepsGLAccountName = this.getAccCodeById(this.itemList[i].adDepsGLAccountId);
            this.itemList[i].assetSaleName = this.getAccCodeById(this.itemList[i].assetSale);
            this.itemList[i].assetWriteOffName = this.getAccCodeById(this.itemList[i].assetWriteOff);
            this.itemList[i].assetWriteDownName = this.getAccCodeById(this.itemList[i].assetWriteDown);
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

    getFreqLabelById(value) {
        for (let i = 0; i < this.depreciationFreq.length; i++) {
            let accId = this.depreciationFreq[i].value;
            if (accId == value) {
                return this.depreciationFreq[i].label;
            }
        }
        return "";
    }

    getAssetTypeNameById(value) {
        for (let i = 0; i < this.allAssetTypes.length; i++) {
            let accId = this.allAssetTypes[i].assetTypeId;
            if (accId == value) {
                return this.allAssetTypes[i].assetTypeName;
            }
        }
        return "";
    }

    getDeprMethodNameById(value) {
        for (let i = 0; i < this.depriciationMethodList.length; i++) {
            let accId = this.depriciationMethodList[i].assetDepreciationMethodId;
            if (accId == value) {
                return this.depriciationMethodList[i].name;
            }
        }
        return "";
    }

    getConvNameById(value) {
        for (let i = 0; i < this.conventionTypeList.length; i++) {
            let accId = this.conventionTypeList[i].value;
            if (accId == value) {
                return this.conventionTypeList[i].label;
            }
        }
        return "";
    }

    //Step x: load all the required data for the page to function
    private loadData() {
        this.getItemList();
        console.log(this.itemList);
        this.rowName = "Asset Attribute Type";
        this.header = "Asset Attribute Type";
        this.breadCrumb.currentUrl = '/singlepages/singlepages/app-asset-attribute-type';
        this.breadCrumb.bredcrumbObj.next(this.breadCrumb.currentUrl);

        //Step x: Add the required details for dropdown options/column header
        this.columnHeaders = [
            { field: 'assetTypeName', header: 'Asset Class', index: 1, showByDefault: true },
            { field: 'description', header: 'Description', index: 1, showByDefault: true },
            { field: 'assetAttributeTypeName', header: 'Name', index: 1, showByDefault: true },
            { field: 'conventionTypeName', header: 'Convention Type', index: 1, showByDefault: true },
            { field: 'depreciationMethodName', header: 'Depreciation Method', index: 1, showByDefault: true },
            { field: 'residualPercentage', header: 'Residual Percentage', index: 1, showByDefault: true },
            //{ field: 'residualValue', header: 'Residual Value', index: 1, showByDefault: true },
            { field: 'assetLife', header: 'Asset Life', index: 1, showByDefault: true },
            { field: 'depreciationFrequencyName', header: 'Depreciation Frequency', index: 1, showByDefault: true },
            { field: 'acquiredGLAccountName', header: 'Acquired GL Account', index: 1, showByDefault: true },
            { field: 'deprExpenseGLAccountName', header: 'Depr Expense GL Account', index: 1, showByDefault: true },
            { field: 'adDepsGLAccountName', header: 'AdDepsGLAccountId', index: 1, showByDefault: true },
            { field: 'assetSaleName', header: 'Asset Sale', index: 1, showByDefault: true },
            { field: 'assetWriteOffName', header: 'Asset Write Off', index: 1, showByDefault: true },
            { field: 'assetWriteDownName', header: 'Asset Write Down', index: 1, showByDefault: true },
            { field: 'selectedCompanyNames', header: 'Legal Entity', index: 1, showByDefault: true },
        ];
        this.currentModeOfOperation = ModeOfOperation.None;
        this.selectedColumns = this.columnHeaders;
        this.currentRow = new AssetAttributeType();
        this.currentRow.isActive = true;
        this.getItemList();
    }

    resetFromData() {
        this.selectedCompanyID = [];
        this.selectedBUId = 0;
        this.selectedDivisionID = 0;
        this.selectedDeptID = 0;
        this.currentRow = new AssetAttributeType();
    }

    onChangeSelectField(object, field) {
        /*
        if (this.currentModeOfOperation = ModeOfOperation.Update) {
            if (this.currentRowData[field] == object[field]) {
                this.disableSave = true;
            }
            else {
                this.disableSave = false;
            }
        }
        */
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

    sampleExcelDownload() {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=AssetAttributeType&fileName=AssetAttributeType.xlsx`;
        window.location.assign(url);
    }

    customExcelUpload(event) {
        this.formData = new FormData();
        const file = event.target.files;
        //console.log(file[0]);
        if (file.length > 0) {
            this.formData.append('file', file[0]);
            console.log(this.formData);
            this.coreDataService.bulkUpload(this.formData).subscribe(response => {
                event.target.value = '';
                this.formData = new FormData();
                console.log(response);
                this.alertService.showMessage(
                    'Success',
                    `Successfully Uploaded  `,
                    MessageSeverity.success
                );
                //let bulkUploadResult = response;
                this.showBulkUploadResult(response);
            })
        }
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
            this.commonService.updatedeletedrecords('AssetAttributeType',
            'AssetAttributeTypeId',this.restorerecord.assetAttributeTypeId, ).subscribe(res => {
                this.currentDeletedstatus=true;
                this.modal.close();
                // this.geListByStatus(this.status ? this.status : 'Active');
                this.loadData();
    
                this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
            })
        }
 

    showBulkUploadResult(items: any) {
        if (items) {
            console.log(items);
            let successCount = items.filter(item => item.UploadTag == UploadTag.Success);
            let failedCount = items.filter(item => item.UploadTag == UploadTag.Failed);
            let duplicateCount = items.filter(item => item.UploadTag == UploadTag.Duplicate);

            if (successCount)
                this.alertService.showMessage('Success', `${successCount} ${this.rowName}${successCount > 1 ? 's' : ''} uploaded successfully.`,
                    MessageSeverity.success);

            if (failedCount)
                this.alertService.showMessage('Error', `${failedCount} ${this.rowName}${
                    failedCount > 1 ? 's' : ''} failed to upload.`, MessageSeverity.error);

            if (duplicateCount)
                this.alertService.showMessage('Info', `${duplicateCount} ${duplicateCount > 1 ? 'duplicates' : 'duplicate'} ignored.`,
                    MessageSeverity.info);
        }
        this.getItemList();
    }
}