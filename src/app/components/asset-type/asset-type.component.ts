import { OnInit, Component } from "@angular/core";
import { fadeInOut } from "../../services/animations";
import { AlertService, MessageSeverity } from "../../services/alert.service";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "../../services/auth.service";
import { AuditHistory } from '../../models/audithistory.model';
import { SingleScreenBreadcrumbService } from "../../services/single-screens-breadcrumb.service";
//
import { MasterComapnyService } from '../../services/mastercompany.service';
import { MasterCompany } from '../../models/mastercompany.model';
import { AssetTypeService } from "../../services/asset-type/asset-type.service";
import { AssetType } from "../../models/asset-type.model";
import { ModeOfOperation } from "../../models/ModeOfOperation.enum";
import { UploadTag } from "../../models/UploadTag.enum";
import { validateRecordExistsOrNot, editValueAssignByCondition, getObjectById, selectedValueValidate, getObjectByValue } from '../../generic/autocomplete';
import { ConfigurationService } from '../../services/configuration.service';


import { CommonService } from '../../services/common.service';
//
@Component({
    selector: 'app-asset-type',
    templateUrl: './asset-type.component.html',
    styleUrls: ['./asset-type.component.scss'],
    animations: [fadeInOut]
})
export class AssetTypeComponent implements OnInit {
    display = true;
    auditHistory: any[];
    columnHeaders: any[];
    currentModeOfOperation: ModeOfOperation;
    disableSave: boolean = false;
    disableSaveForAsset: boolean = false;
    header: string;
    itemList: AssetType[] = [];
    allComapnies: MasterCompany[] = [];
    filteredItemList: AssetType[];
    itemDetails: any;
    modal: NgbModalRef;
    pageIndex: number = 0;
    pageSize: number = 10;
    rowName: string;
    selectedColumns: any[];
    selectedRowforDelete: any;
    selectedRowforEdit: any;
    totalRecords: any;
    totalPages: number;
    formData: FormData;
    uploadedRecords: Object;
    localCollection: any[] = [];
    allAssetTypes: any[] = [];
    isEdit: boolean = false;
    loadingIndicator: boolean;
    currentstatus: string = 'Active';


    new = {
        assetTypeName: "",
        assetTypeMemo: "",
        masterCompanyId: 1,
        isActive: true,
        memo: "",
    }
    addNew = { ...this.new };

    constructor(private breadCrumb: SingleScreenBreadcrumbService,
        private commonService: CommonService,
        private alertService: AlertService,
        private masterComapnyService: MasterComapnyService,
        private configurations: ConfigurationService,
        private coreDataService: AssetTypeService, private modalService: NgbModal,
        private authService: AuthService) {
    }
    ngOnInit(): void {
        //Get page-rendering payload
        this.getItemList();
        this.rowName = "Asset Class";
        this.header = "Asset Class";
        this.breadCrumb.currentUrl = '/singlepages/singlepages/app-asset-type';
        this.breadCrumb.bredcrumbObj.next(this.breadCrumb.currentUrl);
        //Required details for dropdown options/column header
        this.columnHeaders = [
            { field: 'assetTypeName', header: 'Name', index: 1, showByDefault: true },
            { field: 'assetTypeMemo', header: 'Memo', index: 2, showByDefault: true }
        ];
        this.currentModeOfOperation = ModeOfOperation.None;
        this.selectedColumns = this.columnHeaders;
        this.selectedRowforEdit = new AssetType();
    }

    //for auditing
    get userName(): string {
        //to-do:fix the empty username
        return this.authService.currentUser ? this.authService.currentUser.userName : "admin";
    }
    private loadMasterCompanies() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.masterComapnyService.getMasterCompanies().subscribe(
            results => this.onDataMasterCompaniesLoadSuccessful(results[0]),
            error => this.onDataLoadFailed(error)
        );
    }

    private onDataLoadFailed(error: any) {
        // alert(error);
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        //
    }
    private onDataMasterCompaniesLoadSuccessful(allComapnies: MasterCompany[]) {
        // alert('success');
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.allComapnies = allComapnies;
    }
    addNewItem(): void {
        this.selectedRowforEdit = new AssetType();
        this.selectedRowforEdit.createdBy = this.userName;
        this.selectedRowforEdit.updatedBy = this.userName;
        this.selectedRowforEdit.mastercompanyid = this.allComapnies[0];
        this.selectedRowforEdit.isActive = true;
        this.currentModeOfOperation = ModeOfOperation.Add;
    }
    getChange() {


        this.disableSave = false;
        this.disableSaveForAsset = false;

    }

    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }

    bulkUpload(event) {
        this.formData = new FormData();
        const file = event.target.files;
        //console.log(file[0]);
        if (file.length > 0) {
            this.formData.append('file', file[0]);
            this.coreDataService.bulkUpload(this.formData).subscribe(response => {

                this.alertService.showMessage(
                    'Success',
                    `Successfully Uploaded  `,
                    MessageSeverity.success
                );
                this.formData = new FormData();
                //let bulkUploadResult = response;
                //this.showBulkUploadResult(response);
                this.getItemList();
            })
        }

    }

    //to-do: Build lazy loading
    changePage(event: { first: any; rows: number }) {
        const pageIndex = (event.first / event.rows);
        this.pageIndex = pageIndex;
        this.pageSize = event.rows;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    }

    //Check if item exists before add/delete
    checkItemExists(rowData): boolean {
        this.getItemList();
        const exists = this.itemList.some(item => item.assetTypeName == rowData.assetTypeName);
        return exists;
    }

    confirmItemDelete(rowData) {
        this.selectedRowforDelete = rowData;
        this.currentModeOfOperation = ModeOfOperation.Delete;
    }

    //Step D3: calls API to soft-delete
    deleteItem() {
        let rowData = this.selectedRowforDelete;
        let itemExists = this.checkItemExists(rowData);
        if (itemExists) {
            this.currentModeOfOperation = ModeOfOperation.Delete;
            //
            this.coreDataService.remove(this.selectedRowforDelete.assetTypeId).subscribe(response => {
                this.alertService.showMessage('Success', this.rowName + " removed successfully.", MessageSeverity.success);
                this.getItemList();
            });
        }
        this.dismissModal();
    }

    //Reset the modal
    dismissModal() {
        this.selectedRowforEdit = new AssetType();
        this.selectedRowforEdit.isActive = true;
        this.selectedRowforDelete = new AssetType();
        this.auditHistory = [];
        this.currentModeOfOperation = ModeOfOperation.None;
    }

    getItemList() {
        this.coreDataService.getAll().subscribe(res => {

            this.originalTableData = res[0];
            this.getListByStatus(this.status ? this.status : this.currentstatus)
            // const responseData = res[0];
            // this.itemList = responseData;
            // this.totalRecords = responseData.length;
            // this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        })
    }

    //Filters the grid data
    filterAssetTypes(event) {
        const AssetTypeData = [...this.itemList.filter(x => {
            //change filter conditions if required. currently filters by name
            return x.assetTypeName.toLowerCase().includes(event.query.toLowerCase())
        })]
        this.itemList = AssetTypeData;
    }

    openItemForEdit(rowData): void {
        console.log(rowData);
        this.addNew = {
            ...rowData,
            assetTypeName: getObjectById('assetTypeId', rowData.assetTypeId, this.itemList),
        };

        this.selectedRowforEdit = { ...this.addNew }
        this.currentModeOfOperation = ModeOfOperation.Update;
    }

    //
    reorderValues(event) {
        this.columnHeaders.sort(function (a: any, b: any) { return (a.index > b.index) ? 1 : ((b.index > a.index) ? -1 : 0); });
    }

    saveNewItem(): void {
        this.currentModeOfOperation = ModeOfOperation.Add;
        this.coreDataService.add(this.selectedRowforEdit).subscribe(response => {
            this.alertService.showMessage('Success', this.rowName + " added successfully.", MessageSeverity.success);
            this.getItemList();
        });
        this.currentModeOfOperation = ModeOfOperation.None;
    }

    saveExistingItem(rowData): void {
        //console.log('update',rowData);
        //var itemExists = this.checkItemExists(rowData);
        //if (itemExists) {
        this.currentModeOfOperation = ModeOfOperation.Update;
        rowData.updatedBy = this.userName;
        const data = { ...rowData, assetTypeName: editValueAssignByCondition('assetTypeName', rowData.assetTypeName), };
        //console.log(data);
        this.coreDataService.update(data).subscribe(response => {
            this.alertService.showMessage('Success', this.rowName + " updated successfully.", MessageSeverity.success);
            this.getItemList();
        });
        /*} else {
            this.saveNewItem();
        }*/
        this.dismissModal();
    }

    showBulkUploadResult(items: any) {
        if (items) {
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
    }

    showHistory(rowData): void {
        this.currentModeOfOperation = ModeOfOperation.Audit;
        //
        this.coreDataService.getItemAuditById(rowData.assetTypeId).subscribe(audits => {
            if (audits[0].length > 0) {
                this.auditHistory = audits[0];
            }
        });
        console.log(this.auditHistory);
    }

    showItemEdit(rowData): void {
        this.isEdit = true;
        this.disableSaveForAsset = true;
        console.log(rowData);
        this.addNew = {
            ...rowData,
            assetTypeName: getObjectById('assetTypeId', rowData.assetTypeId, this.itemList),
        };

        this.selectedRowforEdit = { ...this.addNew }
        this.currentModeOfOperation = ModeOfOperation.Update;
    }

    toggleActiveStatus(rowData) {
        this.selectedRowforEdit = rowData;
        this.saveExistingItem(rowData);
    }

    updateItem(): void {
        this.saveExistingItem(this.selectedRowforEdit);
    }

    viewItemDetails(rowData) {
        this.itemDetails = rowData;
    }

    checkReasonCodeExists(field, value) {
        const exists = validateRecordExistsOrNot(field, value, this.itemList, this.selectedRowforEdit);
        if (exists.length > 0) {
            this.disableSave = true;
            this.disableSaveForAsset = true;
        }
        else {
            this.disableSave = false;
            this.disableSaveForAsset = false;
        }

    }

    filterAssetTypeName(event) {
        this.filteredItemList = this.itemList;

        const ReasonCodeData = [...this.itemList.filter(x => {
            return x.assetTypeName.toLowerCase().includes(event.query.toLowerCase())
        })]
        this.filteredItemList = ReasonCodeData;
    }

    onBlur(event) {
        //console.log(event.target.value);
        //console.log(this.addNew);

        const value = event.target.value;
        this.disableSave = false;
        for (let i = 0; i < this.itemList.length; i++) {
            let assetTypeName = this.itemList[i].assetTypeName;
            let assetTypeId = this.itemList[i].assetTypeId;
            if (assetTypeName.toLowerCase() == value.toLowerCase()) {
                if (!this.isEdit) {
                    this.disableSave = true;
                }
                else if (assetTypeId != this.selectedRowforEdit.assetTypeId) {
                    this.disableSave = true;
                }
                else {
                    this.disableSave = false;
                }
                console.log('assetTypeName :', assetTypeName);
                break;
            }
        }


    }

    sampleExcelDownload() {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=AssetClass&fileName=AssetClass.xlsx`;
        window.location.assign(url);
    }

    selectedAssetType(object) {
        console.log('selectedAssetType', object);
        const exists = selectedValueValidate('AssetTypeName', object, this.selectedRowforEdit)
        if (this.currentModeOfOperation == 2 || this.currentModeOfOperation == 3 && object.assetTypeId != this.selectedRowforEdit.assetTypeId) {
            this.disableSave = !exists;
            this.disableSaveForAsset = !exists;
        }
        else {
            this.disableSave = false;
            this.disableSaveForAsset = false;
        }

    }

    viewItemDetailsClick(content, row) {
        //console.log(content);
        this.itemDetails = row;
        this.loadMasterCompanies();
        //this.loadMasterCompanies();
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }

    dismissModel() {
        this.isEdit = false;
        this.modal.close();
    }

    getDeleteListByStatus(value) {
        if (value) {
            this.currentDeletedstatus = true;
        } else {
            this.currentDeletedstatus = false;
        }
        this.getListByStatus(this.status ? this.status : this.currentstatus)
    }

    originalTableData: any = [];
    currentDeletedstatus: boolean = false;
    status: any = "Active";
    getListByStatus(status) {
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
            this.itemList = newarry;
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
            this.itemList = newarry;
        } else if (status == 'ALL') {
            this.status = status;
            if (this.currentDeletedstatus == false) {
                // this.billingInfoList=this.originalTableData;
                this.originalTableData.forEach(element => {
                    if (element.isDeleted == false) {
                        newarry.push(element);
                    }
                });
                this.itemList = newarry;
            } else {
                this.originalTableData.forEach(element => {
                    if (element.isDeleted == true) {
                        newarry.push(element);
                    }
                });
                this.itemList = newarry;
            }
        }
        this.totalRecords = this.itemList.length;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    }
    restore(content, rowData) {
        this.restorerecord = rowData;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }
    restorerecord: any = {}
    restoreRecord() {
        this.commonService.updatedeletedrecords('AssetType',
            'AssetTypeId', this.restorerecord.assetTypeId).subscribe(res => {
                this.currentDeletedstatus = true;
                this.modal.close();
                // this.geListByStatus(this.status ? this.status : 'Active');
                this.getItemList();

                this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
            })
    }
}