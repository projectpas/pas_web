import { Component, OnInit, AfterViewInit, ViewChild, Input, OnChanges } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
declare var $ : any;
import { EmployeeService } from '../../../services/employee.service';
import { CommunicationService } from '../../services/communication.service';
import { AlertService, MessageSeverity } from '../../../services/alert.service';



@Component({
    selector: 'app-memo',
    templateUrl: './memo.component.html',
    styleUrls: ['./memo.component.scss']
})

export class MemoComponent implements OnInit, OnChanges {
    @Input() workOrderId: any;
    @Input() isView: boolean = false;
    @Input() savedWorkOrderData: any = [];
    @Input() selectedPartNumber: any = {};
    @Input() customerContactList: any;
    @Input() subWorkOrderDetails;
    @Input() isSubWorkOrder:any=false;
    @Input() subWOPartNoId;
    lazyLoadEventData: any;
    pageSize: number = 10;
    pageIndex: number = 0;
    totalRecords: number = 0;
    totalPages: number;
    data: any = [];
    headers = [
        // { field: 'memoId', header: 'Memo Id' },
        { field: 'SERIAL_NO', header: 'Memo Id' },
        { field: 'description', header: 'Memo' },
        { field: 'updatedBy', header: 'Updated By' },
        { field: 'updatedDate', header: 'Updated Date' }
    ]
    selectedColumns = [
        // { field: 'memoId', header: 'Memo Id' },
        { field: 'SERIAL_NO', header: 'Memo Id' },
        { field: 'descriptionData', header: 'Memo' },
        { field: 'updatedBy', header: 'Updated By' },
        { field: 'updatedDate', header: 'Updated Date' }
    ];
    addList: any = [];
    isEdit: any;
    employees: any[];
    newdata: any;
    moduleName: any = "Communication";
    isSpinnerVisible: boolean = false;
    deletingRow: any;
    constructor(private activeModal: NgbActiveModal, private employeeService: EmployeeService, private communicationService: CommunicationService, private alertService: AlertService) {}
    
    ngOnInit(): void {
        // if(this.isSubWorkOrder){
            // this.customerInfoFromSalesQuote= this.subWorkOrderDetails;
            // this.moduleId=60;
            // this.selectedPartNumber=this.subWOPartNoId;
            // this.referenceId=this.subWorkOrderDetails.subWorkOrderId;
        //  }
         if(this.isSubWorkOrder==true){
            this.workOrderId= this.subWorkOrderDetails.subWorkOrderId ? this.subWorkOrderDetails.subWorkOrderId : this.workOrderId;
            this.moduleId=60;
            this.partNo=this.subWOPartNoId;
        }else{
            this.moduleId=38;
            this.partNo=this.selectedPartNumber.workOrderPartNumberId
        }
        console.log(this.selectedPartNumber);
        console.log(this.savedWorkOrderData);
        console.log(this.customerContactList);
        this.getAllMemoList();
        // this.getAllEmployees();
    }

    ngOnChanges(): void {
        console.log(this.selectedPartNumber);
        console.log(this.savedWorkOrderData);
        console.log(this.customerContactList);
        // this.getAllMemoList();
        // this.getAllEmployees();
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

    addMemo(){
        this.isEdit = false;
        this.addList = [];
        this.addList.push({memoId: '', description: ''})
    }
    edit(rowData, index){
        this.isEdit = true;
        this.addList = [rowData];
        console.log("this.addList",this.addList)
    }

    deleteMemo(rowData){
        this.communicationService.deleteMemoList(rowData.memoId)
        .subscribe(
            res => {
                this.alertService.showMessage(
                    this.moduleName,
                    'Deleted Succesfully',
                    MessageSeverity.success
                ); 
                this.getAllMemoList();
            },
            err => {
                this.errorHandling(err);
            }
        )
    }

    deleteMemoConfirmation(rowData){
        this.deletingRow = rowData;
        $('#deleteRowConfirmation').modal('show');
    }

    saveMemo(){
        if(this.isEdit){
            $('#addNewMemo').modal('hide');
            let payload = this.formData(this.addList[0]);
            this.isSpinnerVisible = true;
            this.communicationService.updateMemo(payload)
            .subscribe(
                (res)=>{
                    this.isSpinnerVisible = false;
                    this.getAllMemoList();
                },
                err => {
                    this.isSpinnerVisible = false;
                    this.errorHandling(err)
                }
            )
        }
        else{
            $('#addNewMemo').modal('hide');
            let payload = this.formData(this.addList[0]);
            this.isSpinnerVisible = true;
            this.communicationService.saveMemo(payload)
            .subscribe(
                (res)=>{
                    this.isSpinnerVisible = false;
                    this.getAllMemoList();
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
        console.log("data",data);
        if(this.isSubWorkOrder==true){
            this.moduleId=60;
        }else{
            this.moduleId=38;
        }
        let returnData = {
            "MemoCode":0,
            "ModuleId":this.moduleId,
            "ReferenceId":this.workOrderId,
            "WorkOrderPartNo": this.partNo,
            "MasterCompanyId":1,
            "CreatedBy":"admin",
            "UpdatedBy":"admin",
            "CreatedDate":new Date(),
            "UpdatedDate":new Date(),
            "IsActive":true,
            "IsDeleted":false,
            "Description": data.description
        }
        if(this.isEdit){
            returnData["MemoId"] = data.memoId;
        }
        return returnData;

    }
    
    getAllEmployees(){
        this.employeeService.getEmployeeList()
        .subscribe(
            (res: any[])=>{
                this.employees = res[0];
                console.log(this.employees);
            },
            err => {
                this.errorHandling(err);
            }
        )
    }
moduleId:any;
partNo:any;
    getAllMemoList(){
        this.data=[];
console.log("this.work order details",this.subWorkOrderDetails);
if(this.workOrderId ==undefined){
    this.workOrderId=this.subWorkOrderDetails.subWorkOrderId;
}
        this.communicationService.getMemoList(this.workOrderId, this.moduleId, this.partNo)
        .subscribe(
            (res)=>{
                if(res && res.length>0){
                res = res.map(x=>{ return {...x, 'descriptionData': this.getString(x.description)}})
            
                this.newdata = res.reverse().map((currentValue, Index)=> {
                    currentValue.SERIAL_NO = Index+1;
                    return currentValue
                 })
                 this.data=(this.newdata)?this.newdata.reverse():[];
                }else{
                    this.data=[];
                }
                // = res;
                this.totalRecords = res.length;
                this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
           console.log("dayata",this.data);
            },
            err => {
                this.errorHandling(err);
            }
        )
    }

    pageIndexChange(event) {
        this.pageSize = event.rows;
    }

    getHtml(data,field){
        if(field == 'description'){
            return $.parseHTML(data)[0];
        }
        return data;
    }

    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
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
    getString(data){
        var temporalDivElement = document.createElement("div");
        // Set the HTML content with the providen
        temporalDivElement.innerHTML = data;
        // Retrieve the text property of the element (cross-browser support)
        return temporalDivElement.textContent || temporalDivElement.innerText || "";
    }
}