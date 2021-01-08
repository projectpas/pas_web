import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { fadeInOut } from '../../services/animations';
import { PageHeaderComponent } from '../../shared/page-header.component';
import { ActionService } from '../../services/action.service';
import { MasterComapnyService } from '../../services/mastercompany.service';
import { AlertService, DialogType, MessageSeverity } from '../../services/alert.service';
import { TaskAttribute } from '../../models/taskattribute.model';
import { AuthService } from '../../services/auth.service';

 
import { NgbModal,NgbModalRef, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MasterCompany } from '../../models/mastercompany.model';
import { TaskAttributeService } from '../../services/taskattribute.service';

import { TableModule, Table } from 'primeng/table'
import { ButtonModule } from 'primeng/button'
import { SelectButtonModule } from 'primeng/selectbutton'
import { InputTextModule } from 'primeng/inputtext'
import { MultiSelectModule } from 'primeng/multiselect'

import { AuditHistory } from '../../models/audithistory.model';
import { MenuItem } from 'primeng/api';//bread crumb
import { SingleScreenBreadcrumbService } from "../../services/single-screens-breadcrumb.service";
import { SingleScreenAuditDetails } from '../../models/single-screen-audit-details.model';
import { validateRecordExistsOrNot, selectedValueValidate, editValueAssignByCondition, getObjectByValue } from '../../generic/autocomplete';
@Component({
    selector: 'app-action-attributes',
    templateUrl: './task-attributes.component.html',
    styleUrls: ['./task-attributes.component.scss'],
    animations: [fadeInOut]
})
/** ActionsAttribute component*/
export class TaskAttributesComponent implements OnInit {
    originalData: any;
    isEdit: boolean = false;
    totalRecords: any;
    pageIndex: number = 0;
    pageSize: number = 10;
    totalPages: number;
    headers = [        
        { field: 'description', header: 'Task Attribute Name' },
        {field : 'sequence', header:'Sequence'},
        { field: 'memo', header: 'Memo' },
    ]
    selectedColumns = this.headers;
    formData = new FormData()
    @ViewChild('dt',{static:false})

    private table: Table;
    auditHistory: any[] = [];
    disableSaveGroupId: boolean = false;
    PortalList: any;
    disableSaveForDescription: boolean = false;
    descriptionList: any;
    ataList: any;
    new = {
     
        description: "", 
        sequence : null,    
        masterCompanyId: 1,
        isActive: true,
        memo: "",
    }
    addNew = { ...this.new };
    selectedRecordForEdit: any;
    viewRowData: any;
    selectedRowforDelete: any;
    existingRecordsResponse = []
    constructor(private breadCrumb: SingleScreenBreadcrumbService,
        private authService: AuthService,
        private modalService: NgbModal,
        private activeModal: NgbActiveModal,
        private _fb: FormBuilder,
        private alertService: AlertService,
        public actionattributeService: TaskAttributeService,
        private dialog: MatDialog, private masterComapnyService: MasterComapnyService) {
    }
    ngOnInit(): void {
        this.getList();
        this.breadCrumb.currentUrl = '/singlepages/singlepages/app-action-attributes';
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

        // this.table.sortOrder = 0;
        // this.table.sortField = '';

        this.getList();
    }

    customExcelUpload(event) {
        // const file = event.target.files;

        // console.log(file);
        // if (file.length > 0) {

        //     this.formData.append('file', file[0])
        //     this.unitofmeasureService.UOMFileUpload(this.formData).subscribe(res => {
        //         event.target.value = '';

        //         this.formData = new FormData();
        //         this.existingRecordsResponse = res;
        //         this.getList();
        //         this.alertService.showMessage(
        //             'Success',
        //             `Successfully Uploaded  `,
        //             MessageSeverity.success
        //         );

        //     })
        // }

    }
    sampleExcelDownload() {
        // const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=UnitOfMeasure&fileName=uom.xlsx`;

        // window.location.assign(url);
    }

    getList() {
        this.actionattributeService.getWorkFlows().subscribe(res => {
            const responseData = res[0];
            this.originalData = responseData;
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


    checkGroupDescriptionExists(field, value) {
        console.log(this.selectedRecordForEdit);
        const exists = validateRecordExistsOrNot(field, value, this.originalData, this.selectedRecordForEdit);
        if (exists.length > 0) {
            this.disableSaveForDescription = true;
        }
        else {
            this.disableSaveForDescription = false;
        }

    }
    filterDescription(event) {
        this.descriptionList = this.originalData;

        const descriptionData = [...this.originalData.filter(x => {
            return x.description.toLowerCase().includes(event.query.toLowerCase())
        })]
        this.descriptionList = descriptionData;
    }
    selectedDescription(object) {
        const exists = selectedValueValidate('description', object, this.selectedRecordForEdit)

        this.disableSaveForDescription = !exists;
    }

    save() {
        const data = {
            ...this.addNew, createdBy: this.userName, updatedBy: this.userName,
            description: editValueAssignByCondition('description', this.addNew.description)
        };
        console.log(data)
        if (!this.isEdit) {
            this.actionattributeService.newAction(data).subscribe(() => {
                this.resetForm();
                this.getList();
                this.alertService.showMessage(
                    'Success',
                    `Added  New Task Attribute Successfully  `,
                    MessageSeverity.success
                );
            })
        } else {

            this.actionattributeService.updateAction(data).subscribe(() => {
                this.selectedRecordForEdit = undefined;
                this.isEdit = false;
                this.resetForm();
                this.getList();
                this.alertService.showMessage(
                    'Success',
                    `Added  New Task Attribute Successfully  `,
                    MessageSeverity.success
                );
            })
        }
    }

    resetForm() {
        this.isEdit = false;
        this.selectedRecordForEdit = undefined;
        this.addNew = { ...this.new };
    }


    edit(rowData) {
        console.log(rowData);
        this.isEdit = true;
        this.disableSaveGroupId = false;
        this.disableSaveForDescription = false;


        this.addNew = {
            ...rowData,
            description: getObjectByValue('description', rowData.description, this.originalData),
        };
        this.selectedRecordForEdit = { ...this.addNew }

    }

    changeStatus(rowData) {
        console.log(rowData);
        const data = { ...rowData }
        this.actionattributeService.updateAction(data).subscribe(() => {
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
            this.actionattributeService.deleteAcion(this.selectedRowforDelete.taskAttributeId, this.userName).subscribe(() => {
                this.getList();
                this.alertService.showMessage(
                    'Success',
                    `Deleted Task Attribute Successfully  `,
                    MessageSeverity.success
                );
            })
        } else {
            this.selectedRowforDelete = undefined;
        }
    }

    getAuditHistoryById(rowData) {
        this.actionattributeService.getTaskAttributeAuditeDetails(rowData.taskAttributeId).subscribe(res => {
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
  

}



