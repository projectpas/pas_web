import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { PageHeaderComponent } from '../../shared/page-header.component';

import { ShipViaService } from '../../services/shipVia.service';
import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { Condition } from '../../models/condition.model';
declare var $ : any;
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSort, MatPaginator, MatDialog, MatTableDataSource } from '@angular/material';
import { MasterCompany } from '../../models/mastercompany.model';
import { MasterComapnyService } from '../../services/mastercompany.service';
import { AuthService } from '../../services/auth.service';
// import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AuditHistory } from '../../models/audithistory.model';
import { MenuItem } from 'primeng/api';//bread crumb
import { SingleScreenBreadcrumbService } from "../../services/single-screens-breadcrumb.service";
import { SingleScreenAuditDetails, AuditChanges } from "../../models/single-screen-audit-details.model";
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { validateRecordExistsOrNot, getObjectById, getObjectByValue, selectedValueValidate, editValueAssignByCondition } from '../../generic/autocomplete';
import { ConfigurationService } from '../../services/configuration.service';
import { ItemMasterService } from '../../services/itemMaster.service';
import { ItemGroupService } from '../../services/item-group.service';
import { DBkeys } from '../../services/db-Keys';

import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { CommonService } from '../../services/common.service';

@Component({
    selector: 'app-item-group',
    templateUrl: './item-group.component.html',
    styleUrls: ['./item-group.component.scss'],
    animations: [fadeInOut]
})
/** Actions component*/
export class ItemGroupComponent implements OnInit {
    selectedActionName: any;
    actionamecolle: any[] = [];

    AuditDetails: SingleScreenAuditDetails[];
    auditHisory: AuditHistory[] = [];
    selectedColumns: any[];
    id: number;
    errorMessage: any;

    public isEditMode: boolean = false;

    private isDeleteMode: boolean = false;
    allComapnies: MasterCompany[];
    private isSaving: boolean;
    modal: NgbModalRef;
    selectedColumn: Condition[];
    formData = new FormData();
    existingRecordsResponse: Object;
    filteredBrands: any[];
    localCollection: any[] = [];
    Active: string = "Active";


    viewRowData: any;
    auditHistory: any = [];
    selectedRowforDelete: any;

    itemGroupData: any = [];
    itemGroupList: any = [];
    itemGroupHeaders = [
        { field: 'itemGroupCode', header: 'Item Group ID' },
        { field: 'description', header: 'Item Group Name' },
        { field: 'memo', header: 'Memo' },

    ];
    totalRecords: any;
    pageIndex: number = 0;
    pageSize: number = 10;
    totalPages: number;
    @ViewChild('dt', { static: false })
    private table: Table;
    selectedRecordForEdit: any;
    newItemGroup =
        {
            itemGroupCode: "",
            description: "",
            masterCompanyId: DBkeys.MASTER_COMPANY_ID,
            isActive: true,
            isDeleted: false,
            memo: ""
        };
    itemGroup: any = { ...this.newItemGroup };
    disableSaveForCondition: boolean;
    disableSaveForConditionMsg: boolean;
    itemGroupDescList: any;
    disableSaveForItemDescMsg: boolean = false;
    disableSaveForItemGroupCodeMsg: boolean = false;
    disableSaveForEdit: boolean = false;
    isDeleted: boolean = false;
    currentstatus: string = 'Active';

    constructor(private itemMasterService: ItemMasterService,
        private commonService: CommonService, public router: Router,
        private breadCrumb: SingleScreenBreadcrumbService, private authService: AuthService, private _fb: FormBuilder, private alertService: AlertService,
        private masterComapnyService: MasterComapnyService, private modalService: NgbModal, public shipViaService: ShipViaService, private dialog: MatDialog, private configurations: ConfigurationService,
        private itemGroupService: ItemGroupService
    ) {


    }
    ngOnInit(): void {
        this.selectedColumns = this.itemGroupHeaders;
        this.getItemGroupList();
        this.breadCrumb.currentUrl = '/singlepages/singlepages/app-item-group';
        this.breadCrumb.bredcrumbObj.next(this.breadCrumb.currentUrl);
    }

    // columnsChanges() {
    //     this.refreshList();
    // }
    private getItemGroupList() {
        this.itemMasterService.getItemGroupList().subscribe(res => {
            const respData = res;
            if (respData.length > 0) {
                // this.itemGroupData = respData;
                this.originalTableData = res;
                this.getListByStatus(this.status ? this.status : this.currentstatus)
                // this.totalRecords = respData.length;
                // this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            } else {
                this.totalRecords = 0;
                this.totalPages = 0;
            }

        });
    }
    dismissModel() {
        // this.isDeleteMode = false;
        // this.isEditMode = false;
        this.modal.close();
    }
    // onBlur(event) {
    //     const value = event.target.value;
    //     this.disableSaveForConditionMsg = false;
    //     for (let i = 0; i < this.shipViaData.length; i++) {
    //         let name = this.shipViaData[i].name;
    //         let shippingViaId = this.shipViaData[i].shippingViaId;
    //         if (name.toLowerCase() == value.toLowerCase()) {
    //             if (!this.isEditMode  || this.isEditMode) {
    //                 this.disableSaveForConditionMsg = true;
    //                 this.disableSaveForCondition = true;
    //             }
    //             else if (shippingViaId != this.selectedRecordForEdit.shippingViaId) {
    //                 this.disableSaveForConditionMsg = true;
    //                 this.disableSaveForCondition = false;
    //             }
    //             else {
    //                 this.disableSaveForConditionMsg = false;
    //                 this.disableSaveForCondition = false;
    //             }
    //             break;
    //         }
    //     }
    // }

    resetItemGroupForm() {
        this.isEditMode = false;
        this.disableSaveForItemGroupCodeMsg = false;
        this.disableSaveForItemDescMsg = false;

        this.selectedRecordForEdit = undefined;
        this.itemGroup = { ...this.newItemGroup };
    }

    changeStatus(rowData) {
        console.log(rowData);
        const data = { ...rowData }
        this.itemGroupService.updateAction(rowData).subscribe(() => {
            this.alertService.showMessage(
                'Success',
                `Updated Status Successfully`,
                MessageSeverity.success
            );
            this.getItemGroupList();

        })
    }

    filterItemGroupCode(event) {
        this.itemGroupList = this.originalTableData;

        const itemGroupData = [...this.originalTableData.filter(x => {
            return x.itemGroupCode.toLowerCase().includes(event.query.toLowerCase())
        })]
        this.itemGroupList = itemGroupData;
    }
    filterItemGroupDesc(event) {
        this.itemGroupDescList = this.originalTableData;

        const itemGData = [...this.originalTableData.filter(x => {
            return x.description.toLowerCase().includes(event.query.toLowerCase())

        })]
        this.itemGroupDescList = itemGData;
    }

    getmemo() {
        this.disableSaveForEdit = false;
    };

    checkItemDescExists(field, value) {
        const exists = validateRecordExistsOrNot(field, value, this.originalTableData, this.selectedRecordForEdit);
        if (exists.length > 0) {
            this.disableSaveForItemDescMsg = true;

        }
        else {

            this.disableSaveForItemDescMsg = false;
        }
        // for (let i = 0; i < this.itemGroupData.length; i++) {
        //     if (this.itemGroup.description == this.itemGroupData[i].description || value == this.itemGroupData[i].description) {                
        //         if(this.selectedRecordForEdit){ //to check in edit mode
        //             if(this.selectedRecordForEdit.description.description == value){
        //                 this.disableSaveForItemDescMsg = false;
        //                 return;
        //             }
        //             else {
        //                 this.disableSaveForItemDescMsg = true;
        //                 return;
        //             }   
        //         }
        //         else {
        //             this.disableSaveForItemDescMsg = true;
        //             return;
        //         }             
        //     } else {
        //         this.disableSaveForItemDescMsg = false;
        // }

        // }
    }

    checkItemGroupCodeExists(field, value) {
        for (let i = 0; i < this.originalTableData.length; i++) {
            if (this.itemGroup.itemGroupCode == this.originalTableData[i].itemGroupCode || value == this.originalTableData[i].itemGroupCode) {
                if (this.selectedRecordForEdit) {
                    if (this.selectedRecordForEdit.itemGroupCode.itemGroupCode == value) {
                        this.disableSaveForItemGroupCodeMsg = false;
                        return;
                    }
                    else {
                        this.disableSaveForItemGroupCodeMsg = true;
                        return;
                    }
                }
                else {
                    this.disableSaveForItemGroupCodeMsg = true;
                    return;
                }
            } else {
                this.disableSaveForItemGroupCodeMsg = false;
            }

        }

        // const exists = validateRecordExistsOrNot(field, value, this.itemGroupData, this.selectedRecordForEdit);
        // if (exists.length > 0) {
        //     this.disableSaveForConditionMsg = true;
        //     this.disableSaveForCondition = true;
        // }
        // else {
        //     this.disableSaveForConditionMsg = false;
        //     this.disableSaveForCondition = false;
        // }
        // for (var i = 0; i < this.shipViaData.length; i++) {
        //     if (value.toLowerCase() == this.shipViaData[i].name.toLowerCase()) {
        //         this.disableSaveForConditionMsg = true;
        //         this.disableSaveForCondition = true;
        //     } else {
        //         this.disableSaveForConditionMsg = false;
        //         this.disableSaveForCondition = false;
        //     }
        // }
    }
    selectedItemGroupCode(value) {
        if (this.originalTableData.find
            (x => x.itemGroupCode ===
                value.itemGroupCode)) {
            if (this.selectedRecordForEdit.itemGroupCode.itemGroupCode == value.itemGroupCode) {
                this.disableSaveForItemGroupCodeMsg = false;
            } else {
                this.disableSaveForItemGroupCodeMsg = true;
            }
        }
        else {
            this.disableSaveForItemGroupCodeMsg = false;
        }
    }
    selectedItemGroupDesc(value) {
        if (this.originalTableData.find
            (x => x.description ===
                value.description)) {
            if (this.selectedRecordForEdit.description.description == value.description) {
                this.disableSaveForItemDescMsg = false;
            } else {
                this.disableSaveForItemDescMsg = true;
            }
        }
        else {
            this.disableSaveForItemDescMsg = false;
        }
    }

    // refreshList() {
    //     this.table.reset();
    //     this.getShipViaList();
    // }


    delete(rowData) {
        this.selectedRowforDelete = rowData;
    }
    deleteConformation(value) {
        if (value === 'Yes') {
            this.itemGroupService.deleteAcion(this.selectedRowforDelete.itemGroupId).subscribe(() => {
                this.getItemGroupList();
                this.alertService.showMessage(
                    'Success',
                    `Deleted Item Group Successfully`,
                    MessageSeverity.success
                );
            })
        } else {
            this.selectedRowforDelete = undefined;
        }
    }

    viewSelectedRow(rowData) {
        console.log(rowData);
        this.viewRowData = rowData;
    }

    resetViewData() {
        this.viewRowData = undefined;
    }
    edit(rowData) {
        console.log(rowData);
        this.isEditMode = true;
        this.disableSaveForEdit = true;

        this.disableSaveForConditionMsg = false;
        // this.itemGroupData = rowData;
        this.itemGroup = {
            ...rowData,
            itemGroupCode: getObjectByValue('itemGroupCode', rowData.itemGroupCode, this.itemGroupData),
            description: getObjectByValue('description', rowData.description, this.itemGroupData)
        };
        this.selectedRecordForEdit = { ...this.itemGroup }


        console.log(this.itemGroupData, "this.itemGroupData+++")

    }

    saveItemGroup() {
        const data = {
            ...this.itemGroup, createdBy: this.userName, updatedBy: this.userName,
            itemGroupCode: editValueAssignByCondition('itemGroupCode', this.itemGroup.itemGroupCode),
            description: editValueAssignByCondition('description', this.itemGroup.description)
        };
        if (!this.isEditMode) {
            this.itemGroupService.newAction(data).subscribe(() => {
                this.resetItemGroupForm();
                this.getItemGroupList();
                this.alertService.showMessage(
                    'Success',
                    `Added  New Item Group Successfully`,
                    MessageSeverity.success
                );
            })
        } else {
            this.itemGroupService.updateAction(data).subscribe(() => {
                this.selectedRecordForEdit = undefined;
                this.isEditMode = false;
                this.resetItemGroupForm();
                this.getItemGroupList();
                this.alertService.showMessage(
                    'Success',
                    `Updated Item Group Successfully`,
                    MessageSeverity.success
                );
            })
        }
    }

    openHelpText(content) {
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    getAuditHistoryById(rowData) {
        this.itemGroupService.historyAcion(rowData.itemGroupId).subscribe(res => {
            this.auditHistory = res;
        })
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

    changePage(event: { first: any; rows: number }) {
        console.log(event);
        const pageIndex = (event.first / event.rows);
        // this.pageIndex = pageIndex;
        this.pageSize = event.rows;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    }

    customExcelUpload(event) {
        const file = event.target.files;

        console.log(file);
        if (file.length > 0) {

            this.formData.append('file', file[0])
            this.itemGroupService.ItemGroupCustomUpload(this.formData).subscribe(res => {
                event.target.value = '';

                this.formData = new FormData();
                this.existingRecordsResponse = res;
                this.getItemGroupList();
                this.alertService.showMessage(
                    'Success',
                    `Successfully Uploaded  `,
                    MessageSeverity.success
                );
            })
        }
    }

    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }

    sampleExcelDownload() {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=ItemGroup&fileName=itemgroup.xlsx`;
        window.location.assign(url);
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
            this.itemGroupData = newarry;
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
            this.itemGroupData = newarry;
        } else if (status == 'ALL') {
            this.status = status;
            if (this.currentDeletedstatus == false) {
                // this.billingInfoList=this.originalTableData;
                this.originalTableData.forEach(element => {
                    if (element.isDeleted == false) {
                        newarry.push(element);
                    }
                });
                this.itemGroupData = newarry;
            } else {
                this.originalTableData.forEach(element => {
                    if (element.isDeleted == true) {
                        newarry.push(element);
                    }
                });
                this.itemGroupData = newarry;
            }
        }
        this.totalRecords = this.itemGroupData.length;
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
        this.commonService.updatedeletedrecords('ItemGroup',
            'ItemGroupId', this.restorerecord.itemGroupId).subscribe(res => {
                this.currentDeletedstatus = true;
                this.modal.close();
                // this.geListByStatus(this.status ? this.status : 'Active');
                this.getItemGroupList();

                this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
            })
    }

    columnsChanges() {}
}