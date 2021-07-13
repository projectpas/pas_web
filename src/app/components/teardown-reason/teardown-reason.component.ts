import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { fadeInOut } from '../../services/animations';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { MasterComapnyService } from '../../services/mastercompany.service';
import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';

import { AuthService } from '../../services/auth.service';

import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { MasterCompany } from '../../models/mastercompany.model';
import { Integration } from '../../models/integration.model';
import { AuditHistory } from '../../models/audithistory.model';
import { MenuItem } from 'primeng/api';//bread crumb
import { SingleScreenBreadcrumbService } from "../../services/single-screens-breadcrumb.service";
import { SingleScreenAuditDetails } from '../../models/single-screen-audit-details.model';
import { getObjectByValue, validateRecordExistsOrNot, selectedValueValidate, editValueAssignByCondition, getObjectById } from '../../generic/autocomplete';
import { Table } from 'primeng/table';
import { ConfigurationService } from '../../services/configuration.service';
import { TeardownReasonService } from '../../services/teardown-reason.service';
import { CommonService } from '../../services/common.service';



@Component({
    selector: 'app-teardown-reason',
    templateUrl: './teardown-reason.component.html',
    styleUrls: ['./teardown-reason.component.scss'],
    animations: [fadeInOut]
})
/** teardown-reason component*/
export class TeardownReasonComponent implements OnInit {

    originalData: any = [];
    isEdit: boolean = false;
    totalRecords: any;
    pageIndex: number = 0;
    pageSize: number = 10;
    totalPages: number;
    headers = [
        { field: 'teardownType', header: 'Type' },
        { field: 'reason', header: 'Reason' },
        { field: 'memo', header: 'Memo' },
    ]
    selectedColumns = this.headers;
    formData = new FormData()
    @ViewChild('dt', { static: false })
    modal: NgbModalRef;
    private table: Table;
    auditHistory: any[] = [];
    disableSaveGroupId: boolean = false;
    existingRecordsResponse: any;
    PortalList: any;
    disableSaveForEdit: boolean = false;
    descriptionList: any;
    disableSaveForDescriptionmsg: boolean = false;
    currentstatus: string = 'Active';
    new = {
        teardownTypeId: '',
        reason: "",
        masterCompanyId: 1,
        isActive: true,
        memo: "",
    }
    addNew = { ...this.new };
    selectedRecordForEdit: any;
    viewRowData: any;
    selectedRowforDelete: any;
    teadownTypesList: any;
    AuditDetails: any;
    constructor(private breadCrumb: SingleScreenBreadcrumbService,
        private authService: AuthService,
        private modalService: NgbModal,
        private activeModal: NgbActiveModal,
        private _fb: FormBuilder,
        private alertService: AlertService,
        private commonService: CommonService,
        public teardownReasonService: TeardownReasonService, private dialog: MatDialog, private masterComapnyService: MasterComapnyService, private configurations: ConfigurationService) {

    }


    ngOnInit(): void {
        this.getList();
        this.getTearDowntypes();
        this.breadCrumb.currentUrl = '/singlepages/singlepages/app-teardown-reason';
        this.breadCrumb.bredcrumbObj.next(this.breadCrumb.currentUrl);

    }

    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }

    dismissModel() {
        // this.isDeleteMode = false;
        // this.isEditMode = false;
        this.modal.close();
    }
    async getTearDowntypes() {
        await this.commonService.smartDropDownList('TeardownType', 'TeardownTypeId', 'Name', 0).subscribe(res => {
            console.log("tearodown types list", res);
            //   this.teadownTypesList=res;
            this.teadownTypesList = res.map(x => {
                return {
                    ...x,
                    teardownTypeId: x.value,
                    name: x.label
                }
            });
        })
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }
    columnsChanges() {
        this.refreshList();
    }
    refreshList() {
        this.table.reset();

        // this.table.sortOrder = 0;
        // this.table.sortField = '';

        this.getList();
    }

    //customExcelUpload(event) {
    //    // const file = event.target.files;

    //    // console.log(file);
    //    // if (file.length > 0) {

    //    //     this.formData.append('file', file[0])
    //    //     this.unitofmeasureService.UOMFileUpload(this.formData).subscribe(res => {
    //    //         event.target.value = '';

    //    //         this.formData = new FormData();
    //    //         this.existingRecordsResponse = res;
    //    //         this.getList();
    //    //         this.alertService.showMessage(
    //    //             'Success',
    //    //             `Successfully Uploaded  `,
    //    //             MessageSeverity.success
    //    //         );

    //    //     })
    //    // }

    //}
    //sampleExcelDownload() {
    //    // const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=UnitOfMeasure&fileName=uom.xlsx`;

    //    // window.location.assign(url);
    //}

    getList() {
        this.teardownReasonService.getAll().subscribe(res => {
            // const responseData = res[0];            
            // this.originalData = responseData;

            this.originalTableData = res[0];
            this.getListByStatus(this.status ? this.status : this.currentstatus)


            // this.totalRecords = responseData.length;
            // this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        })
    }
    changePage(event: { first: any; rows: number }) {
        console.log(event);
        const pageIndex = (event.first / event.rows);

        this.pageSize = event.rows;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    }

    getmemo() {
        // if (this.disableSaveForDescriptionmsg == false) {
        //     this.disableSaveForDescription = false;
        // }

        this.disableSaveForEdit = false;

    }
    //checkGroupDescriptionExists(field, value) {
    //    console.log(this.selectedRecordForEdit);
    //    const exists = validateRecordExistsOrNot(field, value, this.originalData, this.selectedRecordForEdit);
    //    if (exists.length > 0) {
    //        this.disableSaveForDescription = true;
    //    }
    //    else {
    //        this.disableSaveForDescription = false;
    //    }

    //}
    filterDescription(event) {
        this.descriptionList = this.originalData;

        const descriptionData = [...this.originalData.filter(x => {
            return x.reason.toLowerCase().includes(event.query.toLowerCase())
        })]
        this.descriptionList = descriptionData;
    }
    // selectedDescription(object) {
    //    // alert('hi');
    //     if (object.description !== this.selectedRecordForEdit) {
    //         const exists = selectedValueValidate('Reason', object, this.selectedRecordForEdit)
    //         this.disableSaveForDescription = true;
    //         this.disableSaveForDescriptionmsg = true;
    //     }
    //     else {
    //         this.disableSaveForDescription = false;
    //         this.disableSaveForDescriptionmsg = false;
    //     }

    // }
    selectedDescription(rowData): void {
        const exists = selectedValueValidate('Reason', rowData, this.selectedRecordForEdit)

        this.disableSaveForDescriptionmsg = !exists;
    }

    checkGroupDescriptionExists(value) {
        // alert(value);
        for (let i = 0; i < this.originalData.length; i++) {

            if (value == this.originalData[i].Reason) {
                const exists = selectedValueValidate('Reason', value, this.selectedRecordForEdit)

                this.disableSaveForDescriptionmsg = true;

                return;
            }
            else {
                this.disableSaveForDescriptionmsg = false;
            }

        }

    }


    save() {
        const data = {
            ...this.addNew, createdBy: this.userName, updatedBy: this.userName,
            reason: editValueAssignByCondition('reason', this.addNew.reason)
        };
        console.log("tearDown add", data);
        if (!this.isEdit) {
            this.teardownReasonService.add(data).subscribe(() => {
                this.resetForm();
                this.getList();
                this.alertService.showMessage(
                    'Success',
                    `Added  New Teardown Reason Successfully  `,
                    MessageSeverity.success
                );
            })
        } else {
            this.teardownReasonService.updateAction(data).subscribe(() => {
                this.selectedRecordForEdit = undefined;
                this.isEdit = false;
                this.resetForm();
                this.getList();
                this.alertService.showMessage(
                    'Success',
                    `Added  New Teardown Reason Successfully  `,
                    MessageSeverity.success
                );
            })
        }
    }

    resetForm() {
        this.isEdit = false;
        this.selectedRecordForEdit = undefined;
        this.disableSaveForDescriptionmsg = false;
        this.addNew = { ...this.new };
    }


    edit(rowData) {
        console.log(rowData);
        this.isEdit = true;
        // this.disableSaveGroupId = false;
        this.disableSaveForEdit = true;
        this.disableSaveForDescriptionmsg = false;


        this.addNew = {
            ...rowData,
            reason: getObjectByValue('reason', rowData.reason, this.originalData),
        };
        this.selectedRecordForEdit = { ...this.addNew }

    }

    changeStatus(rowData) {
        console.log(rowData);
        const data = { ...rowData }
        this.teardownReasonService.updateAction(data).subscribe(() => {
            this.getList();
            this.alertService.showMessage(
                'Success',
                `Updated Status Successfully  `,
                MessageSeverity.success
            );
        })

    }
    viewSelectedRow(rowData) {
        console.log(rowData);
        console.log('this.viewRowData');
        console.log(this.viewRowData);
        this.viewRowData = rowData;
    }
    resetViewData() {
        this.viewRowData = undefined;
    }
    delete(rowData) {
        this.selectedRowforDelete = rowData;
        console.log(this.selectedRowforDelete + 'selectedRowforDelete');

    }
    deleteConformation(value) {
        if (value === 'Yes') {
            this.teardownReasonService.deleteAcion(this.selectedRowforDelete.teardownReasonId, this.userName).subscribe(() => {
                this.getList();
                this.alertService.showMessage(
                    'Success',
                    `Deleted Teardown Reason Successfully  `,
                    MessageSeverity.success
                );
            })
        } else {
            this.selectedRowforDelete = undefined;
        }
    }

    getAuditHistoryById(rowData) {
        this.teardownReasonService.history(rowData.teardownReasonId).subscribe(res => {
            this.auditHistory = res;
            console.log(this.auditHistory);
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

    sampleExcelDownload() {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=TeardownReason&fileName=TeardownReason.xlsx`;

        window.location.assign(url);
    }

    customExcelUpload(event) {
        // const file = event.target.files;

        // console.log(file);
        // if (file.length > 0) {

        //     this.formData.append('file', file[0])
        //     this.teardownReasonService.IntegrationCustomUpload(this.formData).subscribe(res => {
        //         event.target.value = '';

        //         this.formData = new FormData();
        //         this.existingRecordsResponse = res;
        //         this.getList();
        //         this.alertService.showMessage(
        //             'Success',
        //             `Successfully Uploaded  `,
        //             MessageSeverity.success
        //         );

        //         // $('#duplicateRecords').modal('show');
        //         // document.getElementById('duplicateRecords').click();

        //     })
        //  }

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
            this.originalData = newarry;
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
            this.originalData = newarry;
        } else if (status == 'ALL') {
            this.status = status;
            if (this.currentDeletedstatus == false) {
                // this.billingInfoList=this.originalTableData;
                this.originalTableData.forEach(element => {
                    if (element.isDeleted == false) {
                        newarry.push(element);
                    }
                });
                this.originalData = newarry;
            } else {
                this.originalTableData.forEach(element => {
                    if (element.isDeleted == true) {
                        newarry.push(element);
                    }
                });
                this.originalData = newarry;
            }
        }
        this.totalRecords = this.originalData.length;
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
        this.commonService.updatedeletedrecords('TeardownReason',
            'TeardownReasonId', this.restorerecord.teardownReasonId).subscribe(res => {
                this.currentDeletedstatus = true;
                this.modal.close();
                // this.geListByStatus(this.status ? this.status : 'Active');
                this.getList();

                this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
            })
    }

}