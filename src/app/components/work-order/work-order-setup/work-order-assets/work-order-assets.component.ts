import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { WorkOrderService } from '../../../../services/work-order/work-order.service';
import { AuthService } from '../../../../services/auth.service';
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
import { getValueFromObjectByKey, editValueAssignByCondition, getObjectById } from '../../../../generic/autocomplete';
import * as $ from 'jquery'
import { NgForm } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
@Component({
    selector: 'app-work-order-assets',
    templateUrl: './work-order-assets.component.html',
    styleUrls: ['./work-order-assets.component.css']
})
export class WorkOrderAssetsComponent implements OnInit {
    //@Input() workOrderAssetList: any;
    modal: NgbModalRef;
    @Input() isView : boolean = false;
    @Input() savedWorkOrderData: any
    @Input() workOrderAssetList: any
    @Input() isWorkOrder;
    @Input() employeesOriginalData;
    @Input() workFlowObject;
    @Output() refreshData = new EventEmitter();
    @Output() saveEquipmentListForWO = new EventEmitter();
    @Output() updateEquipmentListForWO = new EventEmitter();
    @Input() subWorkOrderDetails:any;
    @Input() subWOPartNoId:any;
    @Input() isSubWorkOrder:boolean=false;
    @Input() woNumber;
    @Input() customerName;
    @Input() woOperDate;
    @Input() workOrderPartNumberId;
    @Input() workOrderId;
    assetChekinCheckoutheaders = [
        { header: "",field: "checkbox"},
        { header: "Tool Name",field: "assetName"},
        { header: "Tool ID",field: "assetId"},
        { header: "Inventory Num",field: "inventoryNumber"},
        { header: "Tool Type",field: "assetType"},
        { header: "Manufacturer",field: "manufacturer"},
        { header: "Serial Num",field: "serialNo"},
        { header: "Location",field: "assetLocation"},
        { header: "Status",field: "inventoryStatus"},
        { header: "Checked Out by",field: "checkOutById"},
        { header: "Checked Out Date",field: "checkOutDate"},
        { header: "Checked In by",field: "checkInById"},
        { header: "Checked In Date",field: "checkInDate"},
        { header: "Notes",field: "notes"},
    ]
    // workOrderCheckInCheckOutList:any=[1,2];
    moduleName = "Tool";
    assetRecordId: any;
    assets = {
        description: '',
        assetIdNumber: null,
        employeeId: null,
        checkInEmpId: null,
        checkOutEmpId: null,
        date: new Date(),
        assetId: null,
        assetStatus: null,
        quantity:null,
        checkInQty:null,
        checkOutQty:null,
    }
    assetsform = { ...this.assets }
    status: any;
    currentRecord: any;
    employeeList: any;
    generalInfoForm: NgForm;
    isEdit: boolean = false;
    editData: any;
    assetAuditHistory: any;
    addNewEquipment: boolean = false;

    ngOnInit(): void {
        // console.log(this.workFlowObject);

        // this.getWorkOrderAssetList();
        // console.log(this.workOrderAssetList)
    }

    constructor(private workOrderService: WorkOrderService, private authService: AuthService,
        private alertService: AlertService,  private modalService: NgbModal,private cdRef: ChangeDetectorRef) {


    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    get employeeId() {
        return this.authService.currentUser ? this.authService.currentUser.employeeId : 0;
    }

    filterEmployee(event): void {

        this.employeeList = this.employeesOriginalData;

        if (event.query !== undefined && event.query !== null) {
            const employee = [...this.employeesOriginalData.filter(x => {
                return x.label.toLowerCase().includes(event.query.toLowerCase())
            })]
            this.employeeList = employee;
        }
    }
    assetInventoryId:any=0;
    viewAsstes(rowData) {
        this.assetRecordId = rowData.assetRecordId;
        // this.assetInventoryId=rowData.assetInventoryId;
    }
    workOrderCheckInCheckOutList:any=[];
    AvailableCount:any;
showcheckInOutlist=false;
    openGrid(){
        this.showcheckInOutlist=true;
        this.workOrderCheckInCheckOutList=[];
        this.AvailableCount=0;
if(this.status=='checkIn'){

    this.workOrderService.checkInAseetInventoryList(this.currentRecord.workOrderAssetId).subscribe(res=>{

this.workOrderCheckInCheckOutList=res;
if(this.workOrderCheckInCheckOutList && this.workOrderCheckInCheckOutList.length !=0){
this.workOrderCheckInCheckOutList.map(element => {
    element.checkOutDate=element.checkOutDate? new Date(element.checkOutDate) :new Date();
    element.checkInDate=element.checkInDate? new Date(element.checkInDate) :new Date();
    element.isSelected=false; 
    element.checkInById=this.authService.currentEmployee;
    if(element.inventoryStatus=='Available'){
        this.AvailableCount+1;
    }
});
}
console.log("res chekin",res)
    })
}else if(this.status=='checkOut'){
    this.workOrderService.checkOutAseetInventoryList(this.currentRecord.workOrderAssetId,this.workOrderId,this.workOrderPartNumberId,this.currentRecord.assetRecordId,'admin',1).subscribe(res=>{
        console.log("res chekin",res)
        this.workOrderCheckInCheckOutList=res;
   if(this.workOrderCheckInCheckOutList && this.workOrderCheckInCheckOutList.length !=0){
    this.workOrderCheckInCheckOutList.map(element => {
        element.checkOutDate=element.checkOutDate? new Date(element.checkOutDate) :new Date();
        element.checkInDate=element.checkInDate? new Date(element.checkInDate) :new Date();
        element.isSelected=false; 
        element.checkOutById=this.authService.currentEmployee;
        if(element.inventoryStatus=='Available'){
            this.AvailableCount=this.AvailableCount+1;
        }
    });
   }
        console.log("res chekout",res)
    })
}   
    }

    checkStatus(rowData, value) {
        this.showcheckInOutlist=false;
// checkOutAseetInventoryList(workOrderAssetId,workOrderId,woPartNoId,assetRecordId,createdBy,masterCompanyId)
        this.assetsform = {
            ...this.assetsform, description: rowData.description,
            assetIdNumber: rowData.rowData, assetId: rowData.assetId, assetStatus: value,
            quantity:rowData.quantity,
            checkInQty:rowData.checkInQty,
            checkOutQty:rowData.checkOutQty,
            checkInEmpId: getObjectById('value', this.employeeId, this.employeesOriginalData),
            checkOutEmpId: getObjectById('value', this.employeeId, this.employeesOriginalData),
        }
        this.currentRecord = rowData;
        this.status = value;
        console.log("asset check in data",rowData,)
    }
    finalAssetArray:any=[];
    quantitySelected:any=0;
    checkValue(array){
array.forEach(element => {
   if(element.isChecked==true){
    this.quantitySelected=this.quantitySelected+1;
   }else{
       if(this.quantitySelected >0){
           this.quantitySelected=this.quantitySelected-1;   

       }else{
        this.quantitySelected=0; 
       }
   } 
});
    }
    // get userName(): string {
    //     return this.authService.currentUser ? this.authService.currentUser.userName : "";
    // }
    saveAssets(formData) {
        // getValueFromObjectByKey
        this.finalAssetArray=[];
        console.log("chekc date", formData);


        const data = {
            ...this.assetsform,
            employeeId: editValueAssignByCondition('value', this.assetsform.employeeId),                        
        }
        // console.log("data assets", data)
        if (this.status === 'checkIn') {
            formData.forEach(element => {
                element.checkInById=element.checkInById.value;
                element.createdBy= this.userName;
                element.UpdatedBy=this.userName;
                element.masterCompanyId=1;
                if(element.isChecked==true){
                    this.finalAssetArray.push(element);
                }
            });
            // const assetcheckin = {
            //     workOrderAssetId: this.currentRecord.workOrderAssetId,
            //     checkedInById: data.employeeId,
            //     checkedInDate: data.date,
            //     updatedBy: this.userName,
            //     checkInOutStatus: 2,
            //     checkInQty:data.checkInQty,
            //     checkInEmpId: editValueAssignByCondition('value', this.assetsform.checkInEmpId),
               

            // }
            // console.log("checkindata", assetcheckin)
            if(this.finalAssetArray && this.finalAssetArray.length !=0){
            this.workOrderService.saveCheckInInventory(this.finalAssetArray).subscribe(res => {
                // this.assetsform = { ...this.assets };
                this.refreshData.emit();
                this.alertService.showMessage(
                    '',
                    'Inventory Checked-In successfully!',
                    MessageSeverity.success
                );
            },
            err => {
                if(err && err.error.text=='Inventory Checked-In successfully!' ){
                    this.alertService.showMessage(
                        '',
                        'Inventory Checked-In successfully!',
                        MessageSeverity.success
                    );
                }else{
                    this.errorHandling(err);
                }
            })
        }
        } else {

            // const assetcheckout = {
            //     workOrderAssetId: this.currentRecord.workOrderAssetId,
            //     checkedOutById: data.employeeId,
            //     checkedOutDate: data.date,
            //     updatedBy: this.userName,
            //     checkInOutStatus: 1,
            //     checkInQty:data.checkInQty,
            //     checkOutQty:data.checkOutQty,
            //     checkOutEmpId: editValueAssignByCondition('value', this.assetsform.checkOutEmpId),
                
            // }
            console.log("checkindata", formData)
// debugger;
            formData.forEach(element => {
                element.checkOutById=element.checkOutById.value;
                if(element.inventoryStatus=='Available'){
                    this.finalAssetArray.push(element);
                }
            });
            if(this.finalAssetArray && this.finalAssetArray.length !=0){
            this.workOrderService.saveCheckOutInventory(this.finalAssetArray).subscribe(res => {
                console.log("response",res);
                // this.assetsform = { ...this.assets };
                this.refreshData.emit();
                this.alertService.showMessage(
                    '',
                    'Inventory Checked-Out successfully!',
                    MessageSeverity.success
                );
            },
            err => {
                if(err && err.error.text=='Inventory Checked-Out successfully!' ){
                    this.alertService.showMessage(
                        '',
                        'Inventory Checked-Out successfully!',
                        MessageSeverity.success
                    );
                }else{
                    this.errorHandling(err);
                }
                console.log("response",err);
                // this.isSpinnerVisible = false;
              
            })
        }
        }
        // this.showcheckInOutlist=false;
    } 
    releaseData:any=[];
    releaseInventory(){
        this.releaseData=[]; 
        if(this.assetsform.assetStatus == 'checkOut'){
    
        if(this.workOrderCheckInCheckOutList && this.workOrderCheckInCheckOutList.length !=0){
            this.workOrderCheckInCheckOutList.forEach(element => {
                element.checkOutById=element.checkOutById.value;
                if(element.inventoryStatus=='Available'){
                   this.releaseData.push(element); 
                }
            });
            if(this.releaseData && this.releaseData.length !=0){
            this.workOrderService.releaseAssetInventoryList(this.releaseData).subscribe(res =>{
        });
    }
    }
    }
    }
    closeAddNew() {
        this.addNewEquipment = false;
    }


    createNew() {
        this.isEdit = false;
        this.editData = undefined;
        this.addNewEquipment = true;
    }
    edit(rowData) {
        this.createNew();
        this.cdRef.detectChanges();
        this.isEdit = true;
        this.addNewEquipment = true;
        this.editData = rowData;
    }
    getAuditHistoryById(rowData) {
        const { workOrderAssetId } = rowData;
        this.workOrderService.assetsHistoryByWorkOrderAssetId(workOrderAssetId).subscribe(res => {
            this.assetAuditHistory = res;
            // console.log("assets history", res);

        },
        err => {
            // this.isSpinnerVisible = false;
            this.errorHandling(err);
        })

    }
    currentRow:any={};
    openDelete(content, row) {
  this.currentRow=row;
      this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
      this.modal.result.then(() => {
          
      }, () => {  })
  }
    delete() {
        
        // const { workOrderAssetId } = this.currentRow;
        this.workOrderService.deleteWorkOrderAssetByAssetId(this.isSubWorkOrder ? this.currentRow.subWorkOrderAssetId :   this.currentRow.workOrderAssetId, this.userName,this.isSubWorkOrder).subscribe(res => {
            this.refreshData.emit();
            this.alertService.showMessage(
                '',
                'Deleted WorkOrder Asset  Successfully',
                MessageSeverity.success
            );
        },
        err => {
            // this.isSpinnerVisible = false;
            this.errorHandling(err);
        })
        this.modal.close();
    }

    public dismissModel() {
        this.modal.close();
    }
    saveEquipmentList(event) {
        this.saveEquipmentListForWO.emit(event)
        $('#addNewEquipments').modal('hide');
        this.addNewEquipment = false; 
    }
    // closeEvent(event){
    //     this.addNewEquipment = false;  
    // }
    updateEquipmentList(event) {
        this.updateEquipmentListForWO.emit(event)
        this.isEdit = false;
        $('#addNewEquipments').modal('hide');
        this.addNewEquipment = false;
    }

    getColorCodeForHistory(i, field, value) {
        const data = this.assetAuditHistory;
        const dataLength = data.length;
        if (i >= 0 && i <= dataLength) {
            if ((i + 1) === dataLength) {
                return true;
            } else {
                return data[i + 1][field] === value
            }
        }
    }

    // getWorkOrderAssetList(): void {
    //     this.workOrderService.getWorkOrderAssetList(7).subscribe(
    //         result => {
    //             this.workOrderAssetList = result;
    //         }
    //     );
    // }
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
    handleError(err){
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

    memoIndex;
    onAddTextAreaInfo(row, index) {
        this.memoIndex = index;
        // console.log("memolist", material, index);
        this.textAreaInfo = row.notes;
    }
    textAreaInfo: any;
    onSaveTextAreaInfo(notes) {
        if (notes) {
            this.textAreaInfo = notes;
            this.workOrderCheckInCheckOutList[this.memoIndex].notes = this.textAreaInfo;


        }
        $("#textarea-popup").modal("hide");
    }
    onCloseTextAreaInfo() {
        $("#textarea-popup").modal("hide");
    }
}
