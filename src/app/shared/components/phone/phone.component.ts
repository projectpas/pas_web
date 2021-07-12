import { Component, OnInit, AfterViewInit, ViewChild, Input, OnChanges } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CommunicationService } from '../../services/communication.service';
import { EmployeeService } from '../../../services/employee.service';
import { CommonService } from '../../../services/common.service';

declare var $ : any;
import { getObjectById } from '../../../generic/autocomplete';
import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { AuthService } from '../../../services/auth.service';


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
    @Input() customerContactList: any;
    @Input() subWorkOrderDetails;
    @Input() isSubWorkOrder:any=false;
    @Input() subWOPartNoId;
    phoneViewData: any={};
    isEdit: boolean = false;
    lazyLoadEventData: any;
    pageSize: number = 10;
    viewPageSize: number = 10;
    pageIndex: number = 0;
    viewPageIndex: number = 0;
    totalRecords: number = 0;
    viewTotalRecords: number = 0;
    totalPages: number;
    viewTotalPages: number;
    employees: any = [];
    employeeList: any = [];
    data: any = [];
    viewdata: any = [];
    headers = [
        { field: 'phoneNo', header: 'Phone',width:'100px' },
        { field: 'contactBy', header: 'Contacted By',width:'100px' },
        { field: 'notes', header: 'Notes',width:'200px' },
        { field: 'createdDate', header: 'Created Date',width:'130px' },
        { field: 'createdBy', header: 'Created By',width:'130px' }
    ]
    selectedColumns = [
        { field: 'phoneNo', header: 'Phone',width:'100px' },
        { field: 'contactBy', header: 'Contacted By',width:'100px' },
        { field: 'notesData', header: 'Notes',width:'200px' },
        { field: 'createdDate', header: 'Created Date',width:'130px' },
        { field: 'createdBy', header: 'Created By',width:'130px' }
    ];
    addList: any = [];
    cusContactList: any;
    customerContact: any;
    moduleName: any = "Communication";
    isSpinnerVisible: boolean = false;
    deletingRecord: any;
    constructor(private activeModal: NgbActiveModal, private communicationService: CommunicationService, private employeeService: EmployeeService, private commonService: CommonService, private alertService: AlertService, private authService: AuthService,) {}
    
    ngOnInit(): void {
        if(this.isSubWorkOrder==true){
            this.savedWorkOrderData=this.subWorkOrderDetails;
            this.workOrderId=this.subWorkOrderDetails.subWorkOrderId;
            this.moduleId=60;
            this.partNo=this.subWOPartNoId;
        }else{
            this.moduleId=38;
            this.partNo=this.selectedPartNumber.workOrderPartNumberId
        }
        this.getAllPhoneList();
        this.getAllEmployees()
    }

    ngOnChanges(): void {
        // this.getAllPhoneList();
        // this.getAllEmployees();
    }

    filterCustomerContact(event): void {
        this.cusContactList = this.customerContactList;
        if (event.query !== undefined && event.query !== null && event.query !== "") {
            const customers = [...this.customerContactList.filter(x => {
                return x.name.toLowerCase().includes(event.query.toLowerCase())
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
        if(rowData.contactId==this.authService.currentEmployee.employeeId){
            rowData.contactId=this.authService.currentEmployee;
        }else{
            rowData.contactId=getObjectById('employeeId', rowData.contactId, this.employees);
        }
        this.addList = [{
            ...rowData
        }];
    }
    moduleId:any;
    partNo:any;
    getAllPhoneList(){
        this.isSpinnerVisible = true;
        this.communicationService.getPhoneList(this.workOrderId, this.moduleId, this.partNo,this.authService.currentUser.masterCompanyId)
        .subscribe(
            (res)=>{
                res = res.map(x=>{ return {...x, 'notesData': this.getString(x.notes)}})
                this.isSpinnerVisible = false;
                this.data = res;
                this.totalRecords = res.length;
                this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            },
            (err)=>{
                this.errorHandling(err);
                this.isSpinnerVisible = false;
            }
        )
    }

    getString(data){
        var temporalDivElement = document.createElement("div");
        // Set the HTML content with the providen
        temporalDivElement.innerHTML = data;
        // Retrieve the text property of the element (cross-browser support)
        return temporalDivElement.textContent || temporalDivElement.innerText || "";
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
        this.addList.push({phoneNo: '', contactId: this.authService.currentEmployee, notes: ''})
        this.customerContactList.forEach(
            (cc)=>{
                if(cc.isDefaultContact){
                    this.customerContact = cc;
                    this.addList[0].phoneNo = cc.workPhone.trim();
                }
            }
        )
    }
    savePhone(){
        if(this.isEdit){
            let payload = this.formData(this.addList);
            this.isSpinnerVisible = true;
            this.communicationService.updatePhone(payload)
            .subscribe(
                (res)=>{
                    this.isSpinnerVisible = false;
                    this.getAllPhoneList();
                    // $('#addNewPhone').modal('hide');
                    this.isEdit = false;
                },
                err => {
                    this.isSpinnerVisible = false;
                    this.errorHandling(err)
                }
            )
        }
        else{
            let payload = this.formData(this.addList);
            this.isSpinnerVisible = true;
            this.communicationService.savePhone(payload)
            .subscribe(
                (res)=>{
                    this.isSpinnerVisible = false;
                    // $('#addNewPhone').modal('hide');
                    this.getAllPhoneList();
                },
                err => {
                    this.isSpinnerVisible = false;
                    this.errorHandling(err)
                }
            )
        }
        this.addList = [];
    }

    formData(data){
        if(this.isSubWorkOrder==true){
            this.moduleId=60;
        }else{
            this.moduleId=38;
        }
            let toData =  {
                "PhoneNo":data[0].phoneNo,
                "Notes":data[0].notes,
                "ContactById":this.getEmpId(data[0].contactId),
                "WorkOrderPartNo": this.partNo,
                "customerContactId": this.customerContact.contactId,
                "ModuleId":this.moduleId,
                "ReferenceId":this.workOrderId,
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
        // let phone=data.phoneNo.split(" "); phone?phone[0]:0
        this.communicationService.getPhoneData(this.workOrderId,this.partNo,this.moduleId,data.phoneNo)
        .subscribe(
            res => {
                this.viewdata = res;
                this.viewTotalRecords = res.length;
                this.viewTotalPages = Math.ceil(this.totalRecords / this.pageSize);
            },
            err => {
                this.errorHandling(err);
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

    get currentUserMasterCompanyId(): number {
        return this.authService.currentUser ? this.authService.currentUser.masterCompanyId : null;
    }

    getAllEmployees(){
        this.commonService.smartDropDownList('Employee', 'EmployeeId', 'FirstName', this.currentUserMasterCompanyId).subscribe(res => {
            console.log("REs",res);
            this.employees = res.map(x => {
                return {
                    ...x,
                    employeeId: x.value,
                    name: x.label
                }
            });
        },
        err => {
            this.errorHandling(err);
        })
    }

    showDeletePhoneConfirmation(rowData){
        this.deletingRecord = rowData;
        $('#deleteRowConfirmation').modal('show');
    }

    deletePhone(rowData){
        this.isSpinnerVisible = true;
        this.communicationService.deletePhoneList(rowData.communicationPhoneId)
        .subscribe(
            res => {
                this.isSpinnerVisible = false;
                this.alertService.showMessage(
                    this.moduleName,
                    'Deleted Succesfully',
                    MessageSeverity.success
                ); 
                this.getAllPhoneList();
            },
            (err)=>{
                this.errorHandling(err);
                this.isSpinnerVisible = false;
            }
        )
    }

    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }

    pageIndexChange(event) {
        this.pageSize = event.rows;
    }

    viewPageIndexChange(event) {
        this.viewPageSize = event.rows;
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
        this.getPhoneData(data);
    }
    errorHandling(err){
        if(err['error']['errors']){
            err['error']['errors'].forEach(x=>{
                this.alertService.showMessage(
                    this.moduleName,
                    x['message'],
                    MessageSeverity.error
                );
            })
        }
        else{
            this.alertService.showMessage(
                this.moduleName,
                'Saving data Failed due to some input error',
                MessageSeverity.error
            );
        }
    }
}