import { Component, OnInit, AfterViewInit, ViewChild, Input, OnChanges } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
declare var $ : any;
import { EmployeeService } from '../../../services/employee.service';
import { CommunicationService } from '../../services/communication.service';
import { CommonService } from '../../../services/common.service';
import { getObjectById } from '../../../generic/autocomplete';
import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { AuthService } from '../../../services/auth.service';

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
    @Input() customerContactList: any;
    @Input() subWorkOrderDetails;
    @Input() isSubWorkOrder:any=false;
    @Input() subWOPartNoId;
    isEdit: any;
    lazyLoadEventData: any;
    pageSize: number = 10;
    pageIndex: number = 0;
    totalRecords: number = 0;
    totalPages: number;
    employees: any = [];
    employeeList: any = [];
    data: any = [];
    headers = [
        { field: 'mobile', header: 'Mobile' },
        { field: 'contactBy', header: 'Contacted By' },
        { field: 'notes', header: 'Notes' }
    ]
    selectedColumns = [
        { field: 'mobile', header: 'Mobile' },
        { field: 'contactBy', header: 'Contacted By' },
        { field: 'notesData', header: 'Notes' }
    ];
    addList: any = [];
    moduleName: any = "Communication";
    viewdata: any = [];
    viewPageSize: number = 10;
    viewPageIndex: number = 0;
    viewTotalRecords: number = 0;
    viewTotalPages: number;
    moduleId: number;
    partNo: any;
    referenceId:any;
    isSpinnerVisible: boolean = false;
    deletingRecord: any;
    constructor(private activeModal: NgbActiveModal, private communicationService: CommunicationService, private employeeService: EmployeeService, private commonService: CommonService, private alertService: AlertService, private authService: AuthService ) {}
    
    ngOnInit(): void {
        if(this.isSubWorkOrder==true){
            // this.savedWorkOrderData= this.subWorkOrderDetails;
            this.referenceId= this.subWorkOrderDetails.subWorkOrderId ? this.subWorkOrderDetails.subWorkOrderId : this.workOrderId;
            this.moduleId=60;
            this.partNo=this.subWOPartNoId;
        }else{
            this.moduleId=38;
            this.partNo=this.selectedPartNumber.workOrderPartNumberId;
            this.referenceId=this.workOrderId;
        }
        this.getAllEmployees();
        this.getAllTextList();
    }

    ngOnChanges(): void {
        // this.getAllEmployees();
        // this.getAllTextList();
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
        console.log("current EMployeee",this.authService.currentEmployee)
        this.addList = [];
        this.addList.push({mobile: '', contactId: this.authService.currentEmployee, notes: ''})
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

    savePhone(){
        if(this.isEdit){
            let payload = this.formData(this.addList);
            this.isSpinnerVisible = true;
            this.communicationService.updateText(payload)
            .subscribe(
                (res)=>{
                    this.isSpinnerVisible = false;
                    this.getAllTextList();
                    // $('#addNewText').modal('hide');
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
            this.communicationService.saveText(payload)
            .subscribe(
                (res)=>{
                    this.isSpinnerVisible = false;
                    this.getAllTextList();
                    // $('#addNewText').modal('hide');
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
        return data.map((x)=>{
            let toData =  {
                "Mobile":x.mobile,
                "Notes":x.notes,
                "ContactById":this.getEmpId(x.contactId),
                "WorkOrderPartNo": this.partNo,
                "ModuleId":this.moduleId,
                "ReferenceId":this.referenceId,
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
    
    get currentUserMasterCompanyId(): number {
        return this.authService.currentUser ? this.authService.currentUser.masterCompanyId : null;
    }

    getAllEmployees(){
        this.isSpinnerVisible = true;
        this.commonService.smartDropDownList('Employee', 'EmployeeId', 'FirstName', this.currentUserMasterCompanyId).subscribe(res => {
            this.isSpinnerVisible = false;
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
            this.isSpinnerVisible = false;
        })
    }

    getAllTextList(){
        this.isSpinnerVisible = true;
        this.communicationService.getTextList(this.referenceId, this.moduleId, this.partNo,this.authService.currentUser.masterCompanyId)
        .subscribe(
            (res)=>{
                res = res.map(x=>{return {...x, notesData: this.getString(x.notes)}})
                this.isSpinnerVisible = false;
                this.data = res;
                this.totalRecords = res.length;
                this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            },
            (err) => {
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

    deleteText(rowData){
        this.isSpinnerVisible = true;
        this.communicationService.deleteTextList(rowData.communicationTextId)
        .subscribe(
            res => {
                this.isSpinnerVisible = false;
                this.alertService.showMessage(
                    this.moduleName,
                    'Deleted Succesfully',
                    MessageSeverity.success
                ); 
                this.getAllTextList();
            },
            err => {
                this.errorHandling(err);
                this.isSpinnerVisible = false;
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
    viewPageIndexChange(event) {
        this.viewPageSize = event.rows;
    }
    getViewData(data){
        this.isSpinnerVisible = true;
        this.communicationService.getTextData(this.referenceId,  this.partNo,this.moduleId,data.mobile)
        .subscribe(
            res => {
                this.isSpinnerVisible = false;
                this.viewdata = res;
                this.viewTotalRecords = res.length;
                this.viewTotalPages = Math.ceil(this.totalRecords / this.pageSize);
            },
            err => {
                this.errorHandling(err);
                this.isSpinnerVisible = false;
            }
        )
    }
}