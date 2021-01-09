import { OnInit, Component } from "@angular/core";
import { fadeInOut } from "../../services/animations";
import { AlertService, MessageSeverity } from "../../services/alert.service";

import { AuthService } from "../../services/auth.service";
import { AuditHistory } from '../../models/audithistory.model';
import { SingleScreenBreadcrumbService } from "../../services/single-screens-breadcrumb.service";
import { GLAccountCategory } from "../../models/gl-account-category.model";
import { GLAccountCategoryService } from "../../services/gl-account-category/gl-account-category.service";
import { ModeOfOperation } from "../../models/ModeOfOperation.enum";
import { validateRecordExistsOrNot, selectedValueValidate, getObjectById, editValueAssignByCondition } from '../../generic/autocomplete';

import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { CommonService } from '../../services/common.service';

@Component({
    selector: 'app-gl-account-category',
    templateUrl: './gl-account-category.component.html',
    styleUrls: [],
    animations: [fadeInOut]
})
export class GLAccountCategoryComponent implements OnInit {
    itemList: GLAccountCategory[];
    columnHeaders: any[];
    itemDetails: any;
    currentRow: GLAccountCategory;
    currentModeOfOperation: ModeOfOperation;
    rowName: string;
    header: string;
    disableSave: boolean = false;
    totalRecords: any;
    pageIndex: number = 0;
    pageSize: number = 10;
    totalPages: number;
    modal: NgbModalRef;
    selectedColumns: any[];
    auditHistory: any[];
    disableSaveGLCategoryName: boolean = false;
    disableSaveCategorytype: boolean = false;
    glAccountCategoryList: any;
    currentstatus: string = 'Active';

    new = {
        glAccountCategoryName: "",
        glcid: null,
        masterCompanyId: 1,
        isActive: true,
        isDeleted: false
    }
    addNew = { ...this.new };
    selectedRecordForEdit: any;
    viewRowData: any;
    disableSaveCatagotytypeMsg: boolean = false;
    originalData: any;
    isEdit: boolean = false;
    AuditDetails: any;
    constructor(private breadCrumb: SingleScreenBreadcrumbService,
        private commonService: CommonService,
        private alertService: AlertService, private coreDataService: GLAccountCategoryService, private modalService: NgbModal, private authService: AuthService) {
    }
    ngOnInit(): void {
        //gather up all the required data to be displayed on the screen 
        this.loadData();
    }

    //for auditing
    get userName(): string {
        //to-do:fix the empty username
        return this.authService.currentUser ? this.authService.currentUser.userName : "admin";
    }

    //Step E1: Open row up for editing
    addNewItem(): void {
        //  this.currentRow = new GLAccountCategory();
        this.disableSaveGLCategoryName = false;
        this.currentModeOfOperation = ModeOfOperation.Add;
        // this.isEditMode = false;
        // this.selectedRecordForEdit = undefined;
        this.addNew = { ...this.new };
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
        this.getItemList();
        let item = rowData as GLAccountCategory;
        const exists = this.itemList.some(existingItem => existingItem.glcid === item.glcid && existingItem.glAccountCategoryName === item.glAccountCategoryName);
        return exists;
    }

    //Open the confirmation to delete
    confirmItemDelete(rowData) {
        this.currentRow = rowData as GLAccountCategory;
        this.currentModeOfOperation = ModeOfOperation.Delete;
    }

    //calls API to soft-delete
    deleteItem() {
        let item = this.currentRow;
        var itemExists = this.checkItemExists(item);
        if (itemExists) {
            this.currentModeOfOperation = ModeOfOperation.Update;
            item.updatedBy = this.userName;
            item.isDelete = true;
            this.coreDataService.update(item).subscribe(response => {
                this.alertService.showMessage('Success', this.rowName + " removed successfully.", MessageSeverity.success);
                this.getItemList();
            });
        }
        this.dismissModal();
    }


    getChange() {
        if (this.disableSaveCatagotytypeMsg == false) {
            this.disableSaveGLCategoryName = false;
        }
    }

    //Close open modal
    dismissModal() {
        this.currentRow = new GLAccountCategory();
        this.auditHistory = [];
        this.currentModeOfOperation = ModeOfOperation.None;
    }

    //Get the page's grid data
    getItemList() {
        this.coreDataService.getAll().subscribe(res => {

            this.originalTableData = res[0];
            this.getListByStatus(this.status ? this.status : this.currentstatus)


            // const responseData = res[0];
            // const itemList = [];
            // responseData.forEach(function (item) {
            //     let nItem = item as GLAccountCategory;
            //     itemList.push(nItem);
            // });
            // this.itemList = itemList;
            // this.originalData = responseData;
            // this.totalRecords = responseData.length;
            // this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        })
    }

    newItem(rowData): GLAccountCategory {
        let userName = this.userName || "admin";
        rowData.isActive = rowData.isActive || false;
        rowData.isDelete = rowData.isDelete || false;
        let item = new GLAccountCategory(rowData.glAccountCategoryId, rowData.glAccountCategoryName, rowData.glcid, rowData.createdBy, rowData.createdDate, rowData.updatedDate, userName, rowData.isActive, rowData.isDelete);
        debugger;
        return item;
    }

    openItemForEdit(rowData): void {
        this.currentRow = rowData as GLAccountCategory;
        this.currentModeOfOperation = ModeOfOperation.Update;
    }

    //to-do:onchange 
    //reorderValues(event) {
    //    this.columnHeaders.sort(function (a: any, b: any) { return (a.index > b.index) ? 1 : ((b.index > a.index) ? -1 : 0); });
    //}


    dismissModel() {

        this.viewRowData = undefined;
    }

    saveNewItem(): void {
        const data = {
            ...this.addNew, createdBy: this.userName, updatedBy: this.userName,
            name: editValueAssignByCondition('name', this.addNew.glAccountCategoryName)

        };
        // this.currentModeOfOperation = ModeOfOperation.Add;
        //  this.currentRow.glcid = this.addNew.glcid;
        // this.currentRow.glAccountCategoryName = this.addNew.glAccountCategoryName;
        this.coreDataService.add(data).subscribe(response => {
            this.alertService.showMessage('Success', this.rowName + " added successfully.", MessageSeverity.success);
            this.getItemList();
        });
        this.currentModeOfOperation = ModeOfOperation.None;
    }


    saveExistingItem(rowData): void {

        alert(
            JSON.stringify(rowData));

        const data = {
            ...this.addNew, createdBy: this.userName, updatedBy: this.userName,
            name: editValueAssignByCondition('glAccountCategoryName', this.addNew.glAccountCategoryName)

        };

        alert(JSON.stringify(data));
        this.coreDataService.update(data).subscribe(response => {
            this.getItemList();
            this.alertService.showMessage('Success', " updated successfully.", MessageSeverity.success);

        });

        this.dismissModal();
    }

    //Open the audit history modal.
    showHistory(rowData): void {
        this.currentModeOfOperation = ModeOfOperation.Audit;
        let item = rowData as GLAccountCategory;
        this.coreDataService.getItemAuditById(item.glAccountCategoryId).subscribe(audits => {
            if (audits[0].length > 0) {
                this.auditHistory = audits[0];
            }
        });
    }

    showItemEdit(rowData): void {
        this.disableSaveCatagotytypeMsg = false;
        this.disableSaveGLCategoryName = true;
        this.currentRow = rowData as GLAccountCategory;
        this.currentModeOfOperation = ModeOfOperation.Update;
        this.addNew = {
            ...rowData,
            glAccountCategoryName: getObjectById('glcid', rowData.glcid, this.originalData),
        };
    }

    //turn the item active/inActive
    toggleActiveStatus(rowData) {
        // this.currentRow = rowData as GLAccountCategory;
        const data = { ...rowData }
        // this.saveExistingItem(this.currentRow);
        this.coreDataService.update(data).subscribe(response => {
            //this.alertService.showMessage('Success', this.rowName + " updated successfully.", MessageSeverity.success);
            // this.getItemList();
            this.alertService.showMessage(
                'Success',
                `Updated Status Successfully  `,
                MessageSeverity.success
            );
        });
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

    updateItem(): void {
        this.saveExistingItem(this.currentRow);
    }

    viewItemDetails(rowData) {
        this.itemDetails = rowData;
    }

    //Step x: load all the required data for the page to function
    private loadData() {
        this.getItemList();
        this.rowName = "GL Account Category";
        this.header = "GL Account Category";
        this.breadCrumb.currentUrl = '/singlepages/singlepages/app-gl-account-category';
        this.breadCrumb.bredcrumbObj.next(this.breadCrumb.currentUrl);
        //Step x: Add the required details for dropdown options/column header
        this.columnHeaders = [
            { field: 'glcid', header: 'GLC Id', index: 1, showByDefault: true },
            { field: 'glAccountCategoryName', header: 'Name', index: 2, showByDefault: true }
        ];
        this.currentModeOfOperation = ModeOfOperation.None;
        this.selectedColumns = this.columnHeaders;
        this.currentRow = new GLAccountCategory();
    }


    checkGLACategoryTypeExists(field, value) {
        console.log('this.selectedRecordForEdit', this.selectedRecordForEdit);
        const exists = validateRecordExistsOrNot(field, value, this.originalData, this.selectedRecordForEdit);
        console.log(exists);
        if (exists.length > 0) {
            this.disableSaveGLCategoryName = true;
            this.disableSaveCatagotytypeMsg = true;
        }
        else {
            this.disableSaveGLCategoryName = false;
            this.disableSaveCatagotytypeMsg = false;
        }

    }
    filterGLACategoryType(event) {
        const certificationData = [...this.originalData.filter(x => {
            return event.query ? x.glAccountCategoryName.toLowerCase().includes(event.query.toLowerCase()) : this.originalData;
        })]
        this.glAccountCategoryList = certificationData;
    }
    selectedGLACategoryType(object) {
        const exists = selectedValueValidate('glAccountCategoryName ', object, this.selectedRecordForEdit)
        if (!this.isEdit || this.isEdit && object.glcid != this.selectedRecordForEdit.glcid) {
            this.disableSaveGLCategoryName = !exists;
        }
        else {
            this.disableSaveGLCategoryName = false;
        }
    }

    onBlur(event) {
        const value = event.target.value;
        this.disableSaveCatagotytypeMsg = false;
        for (let i = 0; i < this.originalData.length; i++) {
            let description = this.originalData[i].glAccountCategoryName;
            let glACategoryTypeId = this.originalData[i].glcid;
            if (description.toLowerCase() == value.toLowerCase()) {
                if (!this.isEdit || this.isEdit) {
                    this.disableSaveGLCategoryName = true;
                    this.disableSaveCatagotytypeMsg = true;
                }
                else if (glACategoryTypeId != this.selectedRecordForEdit.glcid) {
                    this.disableSaveGLCategoryName = false;
                    this.disableSaveCatagotytypeMsg = true;
                }
                else {
                    this.disableSaveGLCategoryName = false;
                    this.disableSaveCatagotytypeMsg = false;
                }
                break;
            }
        }

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
        this.commonService.updatedeletedrecords('GLAccountCategory',
            'GLAccountCategoryId', this.restorerecord.glAccountCategoryId).subscribe(res => {
                this.currentDeletedstatus = true;
                this.modal.close();
                // this.geListByStatus(this.status ? this.status : 'Active');
                this.loadData();

                this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
            })
    }

    //get validateAutocompleteText() {

    //    return this.addNew.glAccountCategoryName !== '' ? false : true;
    //}

    viewSelectedRow(rowData) {}
    changeStatus(rowData) {}
    sampleExcelDownload() {}
    bulkUpload($event) {}
}