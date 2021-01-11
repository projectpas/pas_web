import { Component, OnInit, AfterViewInit, ViewChild, Input, OnChanges } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
declare var $ : any;
import { CommunicationService } from '../../../../../shared/services/communication.service';
import { EmployeeService } from '../../../../../services/employee.service';
import { DBkeys } from '../../../../../services/db-Keys';



@Component({
    selector: 'app-m-memo',
    templateUrl: './memo.component.html',
    styleUrls: ['./memo.component.scss']
})

export class MemoComponent implements OnInit, OnChanges {

    @Input() isView: boolean = false;

    @Input() selectedParts: any = {};

    @Input() customerInfoFromSalesQuote: any = {};
    @Input() customerContactList: any;
    @Input() SalesOrderId: any = null;
    @Input() salesQuoteId: any = null;
    lazyLoadEventData: any;
    pageSize: number = 10;
    pageIndex: number = 0;
    totalRecords: number = 0;
    totalPages: number;
    moduleId: number = 0;
    referenceId: number = 0;
    partNo: number = 0;
    data: any = [];
    headers = [
        // { field: 'memoId', header: 'Memo Id' },
        // { field: 'SERIAL_NO', header: 'Memo Id' },
        { field: 'description', header: 'Memo' },
        { field: 'updatedBy', header: 'Updated By' },
        { field: 'updatedDate', header: 'Updated Date' }
    ]
    selectedColumns = this.headers;
    addList: any = [];
    isEdit: any;
    employees: any[];
    newdata: any;
    constructor(private activeModal: NgbActiveModal, private employeeService: EmployeeService, private communicationService: CommunicationService) { }

    ngOnInit(): void {

        console.log(this.customerContactList);


        if (this.salesQuoteId != null) {
            this.partNo = this.selectedParts.partNumber;
            this.moduleId = DBkeys.SALES_ORDER_QUOTE_MODULE_ID;
            this.referenceId = this.salesQuoteId;
            this.getAllMemoList(this.referenceId, this.moduleId, this.partNo);
            this.getAllEmployees();
        }
        else if (this.SalesOrderId != null) {
            this.partNo = 0;
            this.moduleId = DBkeys.SALES_ORDER__MODULE_ID;
            this.referenceId = this.SalesOrderId;
            console.log(this.partNo);
            console.log(this.moduleId);
            console.log(this.referenceId);
            this.getAllMemoList(this.referenceId, this.moduleId, this.partNo);
            this.getAllEmployees();
        }

    }


    ngOnChanges(): void {

        console.log(this.customerContactList);
        this.getAllMemoList(this.referenceId, this.moduleId, this.partNo);
        this.getAllEmployees();
    }

    dismissModel() {
        this.activeModal.close();
    }

    loadData(event) {

        this.lazyLoadEventData = event;
        const pageIndex = parseInt(event.first) / event.rows;;
        this.pageIndex = pageIndex;
        this.pageSize = event.rows;
        event.first = pageIndex;
        // this.getList(event)

        console.log(event);
    }

    addMemo() {
        this.addList = [];
        this.addList.push({ memoId: '', description: '' })
    }

    saveMemo() {
        if (this.isEdit) {
            let payload = this.formData(this.addList);
            this.communicationService.updateMemo(payload)
                .subscribe(
                    (res) => {
                        this.getAllMemoList(this.referenceId, this.moduleId, this.partNo);
                        $('#addNewMemo').modal('hide');
                    }
                )
        }
        else {
            $('#addNewMemo').modal('hide');
            let payload = this.formData(this.addList);
            this.communicationService.saveMemo(payload)
                .subscribe(
                    (res) => {
                        this.getAllMemoList(this.referenceId, this.moduleId, this.partNo);
                    }
                )
        }
        this.addList = [];
    }

    formData(data) {
        let returnData = {
            "MemoCode": 0,
            "Description": data[0].description,
            "ModuleId": this.moduleId,
            "ReferenceId": this.referenceId,
            "WorkOrderPartNo": 0,
            "MasterCompanyId": 1,
            "CreatedBy": "admin",
            "UpdatedBy": "admin",
            "CreatedDate": new Date(),
            "UpdatedDate": new Date(),
            "IsActive": true,
            "IsDeleted": false
        }
        if (this.isEdit) {
            returnData["MemoId"] = data[0].memoId;
        }
        return returnData;

    }

    getAllEmployees() {
        this.employeeService.getEmployeeList()
            .subscribe(
                (res: any[]) => {
                    this.employees = res[0];
                    console.log(this.employees);
                }
            )
    }

    getAllMemoList(referenceId, moduleId, PartId) {
        this.communicationService.getMemoList(referenceId, moduleId, PartId)
            .subscribe(
                (res) => {
                    if (res && res.length > 0) {


                        this.newdata = res.reverse().map((currentValue, Index) => {
                            currentValue.SERIAL_NO = Index + 1;
                            return currentValue
                        })
                    }
                    this.data = this.newdata.reverse();
                    // = res;
                    this.totalRecords = res.length;
                    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
                    console.log("dayata", this.data)
                }
            )
    }

    edit(rowData, index) {
        this.isEdit = true;
        this.addList = [rowData];
    }

    deleteMemo(rowData) {
        this.communicationService.deleteMemoList(rowData.memoId)
            .subscribe(
                res => {
                    this.getAllMemoList(this.referenceId, this.moduleId, this.partNo);
                }
            )
    }

    pageIndexChange(event) {
        this.pageSize = event.rows;
    }

    getHtml(data, field) {
        if (field == 'description') {
            return $.parseHTML(data)[0];
        }
        return data;
    }

    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }
}