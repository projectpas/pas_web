import { Component, OnInit, ViewChild } from '@angular/core';
import { fadeInOut } from '../../services/animations';
import { JobTypeService } from '../../services/job-type.service';
import { AlertService, MessageSeverity } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { SingleScreenBreadcrumbService } from "../../services/single-screens-breadcrumb.service";
import { validateRecordExistsOrNot, editValueAssignByCondition, getObjectById, selectedValueValidate, getObjectByValue } from '../../generic/autocomplete';
import { Table } from 'primeng/table';
import { ConfigurationService } from '../../services/configuration.service';
import { CommonService } from '../../services/common.service';

@Component({
    selector: 'app-job-type',
    templateUrl: './job-type.component.html',
    styleUrls: ['./job-type.component.scss'],
    animations: [fadeInOut]
})
/** Vendor Classification component*/
export class JobTypeComponent implements OnInit {
    jobTypeData: any;
    viewRowData: any;
    selectedRowforDelete: any;
    disableSaveForJobTypeMSG : boolean = false;
    newJobType =
        {
            jobTypeName: "",
            jobTypeMemo: "",
            masterCompanyId: 1,
            isActive: true,
            isDeleted: false
        }
    addNewJobType = { ...this.newJobType };
    disableSaveForJobType: boolean = false;
    jobTypeList: any;
    isEdit: boolean = false;
    totalRecords: any;
    pageIndex: number = 0;
    pageSize: number = 10;
    totalPages: number;
    jobTypeHeaders = [
        { field: 'jobTypeName', header: 'Job Type' },
        { field: 'jobTypeMemo', header: 'Memo' },
    ]
    selectedColumns = this.jobTypeHeaders;
    formData = new FormData()
    @ViewChild('dt',{static:false})

    private table: Table;
    auditHistory: any[] = [];
    existingRecordsResponse: Object;
    selectedRecordForEdit: any;
    disableSaveForShortName: boolean = false;
    shortNameList: any;
    AuditDetails: any;
    constructor(private breadCrumb: SingleScreenBreadcrumbService,
        private commonService: CommonService,
        private configurations: ConfigurationService, private authService: AuthService, private alertService: AlertService, private jobTypeService: JobTypeService) {

    }

    ngOnInit(): void {
        this.getJobTypeList();
        this.breadCrumb.currentUrl = '/singlepages/singlepages/app-job-title';
        this.breadCrumb.bredcrumbObj.next(this.breadCrumb.currentUrl);
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    columnsChanges() {
        this.refreshList();
    }

    refreshList() {
        this.table.reset();
        this.getJobTypeList();
    }

    customExcelUpload(event) {
        const file = event.target.files;
        console.log(file);
        if (file.length > 0) {
            this.formData.append('ModuleName', 'JobType');
            this.formData.append('file', file[0]);
            this.commonService.smartExcelFileUpload(this.formData).subscribe(res => {
                this.formData = new FormData();
                this.getJobTypeList();
                this.alertService.showMessage(
                    'Success',
                    `Successfully Uploaded  `,
                    MessageSeverity.success
                );
            });
        }
    }

    sampleExcelDownload() {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=JobType&fileName=JobType.xlsx`;
        window.location.assign(url);
    }

    onBlur(event) {
        const value = event.target.value;
        this.disableSaveForJobTypeMSG = false;
        for (let i = 0; i < this.jobTypeData.length; i++) {
            let jobTypeName = this.jobTypeData[i].jobTypeName;
            let JobTypeId = this.jobTypeData[i].JobTypeId;
            if (jobTypeName.toLowerCase() == value.toLowerCase()) {
                if (!this.isEdit || this.isEdit) {
                    this.disableSaveForJobType = true;
                    this.disableSaveForJobTypeMSG = true;
                }
                else if (JobTypeId != this.selectedRecordForEdit.JobTypeId) {
                    this.disableSaveForJobType = false;
                    this.disableSaveForJobTypeMSG = true;
                }
                else {
                    this.disableSaveForJobType = false;
                    this.disableSaveForJobTypeMSG = false;
                }
                break;
            }
        }
    }

    getJobTypeList() {
        this.jobTypeService.getAllJobTypeList().subscribe(res => {
            const responseData = res[0];           
            this.jobTypeData = responseData;
            this.totalRecords = responseData.length;
            this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        })
    }

    changePage(event: { first: any; rows: number }) {
        console.log(event);
        const pageIndex = (event.first / event.rows);
        this.pageSize = event.rows;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    }

    checkJobTypeExists(field, value) {
        const exists = validateRecordExistsOrNot(field, value, this.jobTypeData, this.selectedRecordForEdit);
        if (exists.length > 0) {
            this.disableSaveForJobType = true;
            this.disableSaveForJobTypeMSG = true;
        }
        else {
            this.disableSaveForJobType = false;
            this.disableSaveForJobTypeMSG = false;
        }

    }

    filterJobTypes(event) {
        this.jobTypeList = this.jobTypeData;
        const jobTypeData = [...this.jobTypeData.filter(x => {
            return x.jobTypeName.toLowerCase().includes(event.query.toLowerCase())
        })]
        this.jobTypeList = jobTypeData;
    }

    selectedJobType(object) {
        const exists = selectedValueValidate('jobTypeMemo', object, this.selectedRecordForEdit)
        this.disableSaveForJobType = !exists;
        this.disableSaveForJobTypeMSG = !exists;
    }

    saveJobType() {
        const data = {
            ...this.addNewJobType, createdBy: this.userName, updatedBy: this.userName,
            jobTypeName: editValueAssignByCondition('jobTypeName', this.addNewJobType.jobTypeName),
            jobTypeMemo: editValueAssignByCondition('jobTypeMemo', this.addNewJobType.jobTypeMemo)
        };
        if (!this.isEdit) {
            this.jobTypeService.newJobType(data).subscribe(() => {
                this.resetJobTypeForm();
                this.getJobTypeList();
                this.alertService.showMessage(
                    'Success',
                    `Added  New Job Type Successfully`,
                    MessageSeverity.success
                );
            })
        } else {
            this.jobTypeService.updateAction(data).subscribe(() => {
                this.selectedRecordForEdit = undefined;
                this.isEdit = false;
                this.resetJobTypeForm();
                this.getJobTypeList();
                this.alertService.showMessage(
                    'Success',
                    `Updated Job Type Successfully`,
                    MessageSeverity.success
                );
            })
        }
    }

    resetJobTypeForm() {
        this.isEdit = false;
        this.disableSaveForJobType = false;
        this.disableSaveForJobTypeMSG = false;
        this.selectedRecordForEdit = undefined;
        this.addNewJobType = { ...this.newJobType };
    }


    editJobType(rowData) {
        console.log(rowData);
        this.isEdit = true;
        this.disableSaveForJobType = true;

        this.addNewJobType = {
            ...rowData, jobTypeName: getObjectById('jobTypeId', rowData.jobTypeId, this.jobTypeData)
        };
        this.selectedRecordForEdit = { ...this.addNewJobType }

    }

    changeStatus(rowData) {
        console.log(rowData);
        const data = { ...rowData }
        this.jobTypeService.updateAction(data).subscribe(() => {
            // this.getvendorClassificationList();
            this.alertService.showMessage(
                'Success',
                `Updated Status Successfully  `,
                MessageSeverity.success
            );
        })

    }

    viewSelectedRow(rowData) {
        console.log(rowData);
        this.viewRowData = rowData;
    }

    resetViewData() {
        this.viewRowData = undefined;
    }

    delete(rowData) {
        this.selectedRowforDelete = rowData;

    }

    deleteConformation(value) {
        if (value === 'Yes') {
            this.jobTypeService.deleteAcion(this.selectedRowforDelete.jobTypeId).subscribe(() => {
                this.getJobTypeList();
                this.alertService.showMessage(
                    'Success',
                    `Deleted Job Type Successfully  `,
                    MessageSeverity.success
                );
            })
        } else {
            this.selectedRowforDelete = undefined;
        }
    }

    
    getAuditHistoryById(rowData) {
        this.jobTypeService.getJobTypeAudit(rowData.jobTypeId).subscribe(res => {
            this.auditHistory = res[0].result;
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

}