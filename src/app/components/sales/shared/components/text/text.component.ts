import { Component, OnInit, AfterViewInit, ViewChild, Input, OnChanges } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
declare var $ : any;
import { CommunicationService } from '../../../../../shared/services/communication.service';
import { EmployeeService } from '../../../../../services/employee.service';
import { CommonService } from '../../../../../services/common.service'

import { getObjectById } from '../../../../../generic/autocomplete';
import { DBkeys } from '../../../../../services/db-Keys';

@Component({
    selector: 'app-text',
    templateUrl: './text.component.html',
    styleUrls: ['./text.component.scss']
})

export class TextComponent implements OnInit, OnChanges {
    @Input() workOrderId: any;
    @Input() isView: boolean = false;
    @Input() savedWorkOrderData: any = [];
    @Input() selectedPartNumber: any = {};
    @Input() selectedParts: any = {};
    @Input() customerInfoFromSalesQuote: any = {};
    @Input() customerContactList: any;
    @Input() SalesOrderId: any = null;
    @Input() salesQuoteId: any = null;
    isEdit: any;
    lazyLoadEventData: any;
    pageSize: number = 10;
    pageIndex: number = 0;
    totalRecords: number = 0;
    totalPages: number;
    employees: any = [];
    employeeList: any = [];
    data: any = [];
    moduleId: number;
    referenceId: number;
    partNo: number;
    headers = [
        { field: 'mobile', header: 'Mobile' },
        { field: 'contactBy', header: 'Contacted By' },
        { field: 'notes', header: 'Notes' }
    ]
    selectedColumns = this.headers;
    addList: any = [];
    constructor(private activeModal: NgbActiveModal, private communicationService: CommunicationService, private employeeService: EmployeeService, private commonService: CommonService ) {}
    
    ngOnInit(): void {
        if (this.salesQuoteId) {
            this.partNo = this.selectedParts.partNumber;
            this.moduleId = DBkeys.SALES_ORDER_QUOTE_MODULE_ID;
            this.referenceId = this.salesQuoteId;
            this.getAllTextList(this.referenceId, this.moduleId, this.partNo);
            this.getAllEmployees();
        }
        else if (this.SalesOrderId) {
            this.partNo = this.selectedParts.partNumber;
            this.moduleId = DBkeys.SALES_ORDER__MODULE_ID;
            this.referenceId = this.SalesOrderId;
            this.getAllTextList(this.referenceId, this.moduleId, this.partNo);
            this.getAllEmployees();
        }
       
        
    }

    ngOnChanges(): void {
        this.getAllEmployees();
        this.getAllTextList(this.referenceId, this.moduleId, this.partNo);
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
    addText(){
        this.addList = [];
        this.addList.push({mobile: '', contactId: '', notes: ''})
    }

    edit(rowData, index){
        this.isEdit = true;
        this.addList = [{
            ...rowData,
            contactId: getObjectById('employeeId', rowData.contactId, this.employees)
        }];
    }

    savePhone(){
        if(this.isEdit){
            let payload = this.formData(this.addList);
            this.communicationService.updateText(payload)
            .subscribe(
                (res)=>{
                    this.getAllTextList(this.referenceId, this.moduleId, this.partNo);
                    // $('#addNewText').modal('hide');
                    this.isEdit = false;
                }
            )
        }
        else{
            let payload = this.formData(this.addList);
            this.communicationService.saveText(payload)
            .subscribe(
                (res)=>{
                    this.getAllTextList(this.referenceId, this.moduleId, this.partNo);
                    // $('#addNewText').modal('hide');
                }
            )
        }
        this.addList = [];
    }

    formData(data){
        return data.map((x)=>{
            let toData =  {
                "Mobile":x.mobile,
                "Notes":x.notes,
                "ContactById":this.getEmpId(x.contactId),
                "WorkOrderPartNo": 0,
                "ModuleId": this.moduleId,
                "ReferenceId": this.referenceId,
                "MasterCompanyId":1,
                "CreatedBy":"admin",
                "UpdatedBy":"admin",
                "CreatedDate":"2019-12-31T04:30:28.21",
                "UpdatedDate":"2019-12-31T04:30:28.21",
                "IsActive":true,
                "IsDeleted":false
                }
                if(this.isEdit){
                    toData['communicationTextId'] = x.communicationTextId;
                }
                return toData;
        })
    }

    getEmpId(obj) {
        if (obj.employeeId) {
			return obj.employeeId;
		} else {
			return null;
		}
    }

    getAllEmployees(){
        this.commonService.smartDropDownList('Employee', 'EmployeeId', 'FirstName').subscribe(res => {
            console.log("REs",res);
            this.employees = res.map(x => {
                return {
                    ...x,
                    employeeId: x.value,
                    name: x.label
                }
            });
        })
    }

    getAllTextList(referenceId,moduleId,PartNo){
        this.communicationService.getTextList(referenceId, moduleId, PartNo)
        .subscribe(
            (res)=>{
                this.data = res;
                this.totalRecords = res.length;
                this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            }
        )
    }

    deleteText(rowData){
        this.communicationService.deleteTextList(rowData.communicationTextId)
        .subscribe(
            res => {
                this.getAllTextList(this.referenceId, this.moduleId, this.partNo);
            }
        )
    }

    pageIndexChange(event) {
        this.pageSize = event.rows;
    }

    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }

    filterEmployee(event): void {
        this.employeeList = this.employees;
        if (event.query !== undefined && event.query !== null) {
            const employee = [...this.employees.filter(x => {
                return x.label.toLowerCase().includes(event.query.toLowerCase())
            })]
            this.employeeList = employee;
        }
    }
}