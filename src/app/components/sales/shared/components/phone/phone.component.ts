import { Component, OnInit, AfterViewInit, ViewChild, Input, OnChanges } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CommunicationService } from '../../../../../shared/services/communication.service';
import { EmployeeService } from '../../../../../services/employee.service';
import { CommonService } from '../../../../../services/common.service'

import * as $ from 'jquery';
import { getObjectById } from '../../../../../generic/autocomplete';
import { DBkeys } from '../../../../../services/db-Keys';


@Component({
    selector: 'app-phone',
    templateUrl: './phone.component.html',
    styleUrls: ['./phone.component.scss']
})

export class PhoneComponent implements OnInit, OnChanges {
    @Input() workOrderId: any;
    @Input() isView: boolean = false;
    @Input() savedWorkOrderData: any = [];
    @Input() selectedPartNumber: any = {};
    @Input() selectedParts: any = {};
    @Input() customerInfoFromSalesQuote: any = {};
    @Input() customerContactList: any;
    @Input() SalesOrderId: any = null;
    @Input() salesQuoteId: any = null;
    phoneViewData: any={};
    isEdit: boolean = false;
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
        { field: 'phoneNo', header: 'Phone' },
        { field: 'contactBy', header: 'Contacted By' },
        { field: 'notes', header: 'Notes' }
    ]
    selectedColumns = this.headers;
    addList: any = [];
    cusContactList: any;
    customerContact: any;
    constructor(private activeModal: NgbActiveModal, private communicationService: CommunicationService, private employeeService: EmployeeService, private commonService: CommonService) {}
    
    ngOnInit(): void {
        if (this.salesQuoteId) {
            //0 = this.selectedParts.partNumber;
            this.moduleId = DBkeys.SALES_ORDER_QUOTE_MODULE_ID;
            this.referenceId = this.salesQuoteId;
            //console.log(0 );
            console.log(this.moduleId );
            console.log(this.referenceId);
            this.getAllPhoneList(this.referenceId, this.moduleId, 0);
            this.getAllEmployees();
            
        }
        else if (this.SalesOrderId) {
            //0 = this.selectedParts.partNumber;
            this.moduleId = DBkeys.SALES_ORDER__MODULE_ID;
            this.referenceId = this.SalesOrderId;
            //console.log(0);
            console.log(this.moduleId);
            console.log(this.referenceId);
            this.getAllPhoneList(this.referenceId, this.moduleId, 0);
            this.getAllEmployees();
        }
       
       
    }

    ngOnChanges(): void {
        this.getAllPhoneList(this.referenceId, this.moduleId, 0);
        this.getAllEmployees();
    }

    filterCustomerContact(event): void {
       
        this.cusContactList = this.customerContactList;
        if (event.query !== undefined && event.query !== null && event.query !== "") {
            const customers = [...this.customerContactList.filter(x => {
                return x.firstName.toLowerCase().includes(event.query.toLowerCase())
            })]
            this.cusContactList = customers;
        }
        // console.log("cust_mainID")
    }

    contactSelected(event){
        this.addList[0].phoneNo = event.workPhone.trim();
    }

    edit(rowData, index){
        this.isEdit = true;
        this.addList = [{
            ...rowData,
            contactId: getObjectById('employeeId', rowData.contactId, this.employees)
        }];
    }
     
    getAllPhoneList(refernceId,moduleId,PartNo){
        this.communicationService.getPhoneList(refernceId, moduleId, PartNo)
        .subscribe(
            (res)=>{
                this.data = res;
                this.totalRecords = res.length;
                this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            }
        )
    }

    dismissModel() {
        this.activeModal.close();
    }

    loadData(event) {

        this.lazyLoadEventData = event;
        const pageIndex = parseInt(event.first) / event.rows;;
        this.pageIndex = pageIndex;
        // this.pageSize = event.rows;
        event.first = pageIndex;
        // this.getList(event)

        console.log(event);
    }
    addPhone(){
        this.addList = [];
        this.addList.push({phoneNo: '', contactId: '', notes: ''})
    }
    savePhone(){
        if(this.isEdit){
            let payload = this.formData(this.addList);
            this.communicationService.updatePhone(payload)
            .subscribe(
                (res)=>{
                    this.getAllPhoneList(this.referenceId, this.moduleId, 0);
                    // $('#addNewPhone').modal('hide');
                    this.isEdit = false;
                }
            )
        }
        else{
            let payload = this.formData(this.addList);
            this.communicationService.savePhone(payload)
            .subscribe(
                (res)=>{
                    // $('#addNewPhone').modal('hide');
                    this.getAllPhoneList(this.referenceId, this.moduleId, 0);
                }
            )
        }
        this.addList = [];
    }

    formData(data) {
        console.log(this.customerContact);
            let toData =  {
                "PhoneNo":data[0].phoneNo,
                "Notes":data[0].notes,
                "ContactById":this.getEmpId(data[0].contactId),
                "WorkOrderPartNo": this.selectedPartNumber.workOrderPartNumberId,
                "customerContactId": this.customerContactList[0].customerContactId,
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
                    toData['communicationPhoneId'] = data[0].communicationPhoneId;
                }
                return [toData];
    }

    getPhoneData(data){
        this.communicationService.getPhoneData(this.referenceId,0,38,data.phoneNo)
        .subscribe(
            res => {
                console.log(res);
            }
        )
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

    deletePhone(rowData){
        this.communicationService.deletePhoneList(rowData.communicationPhoneId)
        .subscribe(
            res => {
                this.getAllPhoneList(this.referenceId, this.moduleId, 0);
            }
        )
    }

    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }

    pageIndexChange(event) {
        this.pageSize = event.rows;
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
    phoneView(data){
        this.phoneViewData=data;
    }
}