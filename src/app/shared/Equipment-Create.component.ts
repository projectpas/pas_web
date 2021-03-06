import { Component, Input, OnChanges, OnInit, EventEmitter, Output } from "@angular/core";
import { IWorkFlow } from "../Workflow/WorkFlow";
import { IEquipmentAssetType } from "../Workflow/EquipmentAssetType";
import { MessageSeverity, AlertService } from "../services/alert.service";
import { WorkOrderService } from "../services/work-order/work-order.service";
import { CommonService } from "../services/common.service";
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from "../services/auth.service";
declare var $ : any; 
@Component({
    selector: 'grd-equipment',
    templateUrl: './Equipment-Create.component.html',
    styleUrls: ['./Equipment-Create.component.css']
})
export class EquipmentCreateComponent implements OnInit, OnChanges {
    partCollection: any[];
    @Input() workFlowObject;
    @Input() isWorkOrder: boolean = false;
    @Input() workFlow: IWorkFlow;
    @Input() isEdit = false;
    @Input() editData;
    @Input() isWorkFlow:boolean=false;
    @Input() UpdateMode: boolean;
    @Input() moduleName = 'Tool'
    @Output() saveEquipmentListForWO = new EventEmitter();
    @Output() closeEvent = new EventEmitter();
    @Output() updateEquipmentListForWO = new EventEmitter();
    @Output() notify: EventEmitter<IWorkFlow> =  new EventEmitter<IWorkFlow>();

    allUomdata: any[] = [];
    itemClassInfo: any[] = [];
    allconditioninfo: any;
    allPartDetails: any[] = [];
    partListData: any;
    equipmentAssetType: IEquipmentAssetType[];
    errorMessage: string;
    row: any;
    itemclaColl: any[];
    allPartnumbersInfo: any[] = [];
    currentPage: number = 1;
    itemsPerPage: number = 10;
    isSpinnerVisible = false;
    modal: NgbModalRef;
    disableUpdate:boolean=true;
    constructor(private commonService: CommonService, private workOrderService: WorkOrderService, 
         private modalService: NgbModal,   private authService: AuthService,
        private alertService: AlertService) {
    }

    ngOnInit(): void {  
        if (this.isWorkOrder) {
            this.workFlow = this.workFlowObject;
            this.row = this.workFlow.equipments[0];
            if (this.isEdit) {
                this.workFlow.equipments = [];
                const data = {
                    ...this.editData,
                    assetRecordId: this.editData.assetRecordId,
                    description: this.editData.assetDescription,
                    assetTypeId: this.editData.assetTypeId,
                    name: this.editData.name,
                    assetTypeName: this.editData.assetTypeName,
                    partNumber: this.editData.assetId,
                    // partNumber: {name:this.editData.assetName,assetId:this.editData.assetId},
                    assetId: this.editData.assetId,
                    assetDescription: this.editData.description,
                    assetIdName:this.editData.assetId
                }
                this.disableUpdate=true;
                this.workFlow.equipments.push(data);
                this.workFlow.equipments.forEach(ev=>{
                    ev.partNumber={name:ev.name,assetId:ev.assetRecordId}
                })
            } else {
                this.workFlow.equipments = [];
                this.row = this.workFlow.equipments[0];
                this.addRow();
            }

        } else {
            this.row = this.workFlow.equipments[0];
            if (this.row == undefined) {
                this.row = {};
            }
            this.row.taskId = this.workFlow.taskId;
            this.workFlow.equipments.forEach(ev=>{
                ev.partNumber={name:ev.assetName,assetId:ev.assetId}
            })
        }
      
        this.ptnumberlistdata('');
    }

    ngOnChanges(): void {
        if (this.isWorkOrder) { 
            this.workFlow = this.workFlowObject;
            this.workFlow.equipments = [];
            this.row = this.workFlow.equipments[0]; 
            this.addRow();
        }else{
            this.workFlow.equipments.forEach(ev=>{
                ev.partNumber={name:ev.assetName,assetId:ev.assetId}
            })
        }
    }

    addRow(): void {
        var newRow = Object.assign({}, this.row);
        newRow.workflowEquipmentListid = "0";
        newRow.taskId = this.workFlow.taskId;
        newRow.assetName = '';
        newRow.assetTypeName = '';
        newRow.assetDescription = "";
        newRow.assetId = "";
        newRow.assetTypeId = "";
        newRow.quantity = "";
        newRow.memo = "";
        newRow.quantity = "";
        newRow.unitCost = "";
        newRow.unitPrice = "";
        newRow.vendorUnitPrice = "";
        newRow.workflowChargeTypeId = "";
        newRow.partNumber = "";
        newRow.isDeleted = false;
        newRow.assetIdName="";
        newRow.assetRecordId=0;
        this.workFlow.equipments.push(newRow);
    }
    clearautoCompleteInput(currentRecord) {
        currentRecord.partNumber = undefined;
    }
    onPartSelect(event, equipment,index) { 
        this.workFlow.equipments[index].assetRecordId = event.assetRecordId;
            this.workFlow.equipments[index].assetId = event.assetId;
            this.workFlow.equipments[index].partNumber = event;
            this.workFlow.equipments[index].assetDescription = event.description;
            this.workFlow.equipments[index].assetTypeId = event.assetTypeId;
            this.workFlow.equipments[index].assetName = event.name,
            this.workFlow.equipments[index].assetIdName = event.assetIdName,
            this.workFlow.equipments[index].assetTypeName = event.assetTypeName
            var anyEquipment = this.workFlow.equipments.filter(ev =>
                ev.taskId == this.workFlow.taskId && ev.assetId == event.assetId);
            if (anyEquipment.length > 1) {
                equipment.assetId = "";
                equipment.partNumber = undefined; 
                equipment.assetDescription = "";
                equipment.assetTypeId = "";
                equipment.assetName = "";
                equipment.assetTypeName = "";
                event = "";
                this.alertService.showMessage("Workflow", "Asset Id is already in use in Tool List", MessageSeverity.error);
            }

                     

    }
    partCollectionList:any=[];
    filterpartItems(event) { 
		if (event.query !== undefined && event.query !== null) {
            this.ptnumberlistdata(event.query)
        }else{
            // this.ptnumberlistdata('');
        }
    }
    get currentUserMasterCompanyId(): number {
        return this.authService.currentUser ? this.authService.currentUser.masterCompanyId : null;
    }

    private ptnumberlistdata(value) {
        this.isSpinnerVisible = true;
        let equipmentIds = [];
        equipmentIds.push(0);
        if(this.editData){
        if (this.isEdit || this.UpdateMode) {
           equipmentIds.push(this.editData? this.editData.assetRecordId:0);
        }
    }
        if (this.UpdateMode && this.isWorkFlow) {
            this.workFlow.equipments.forEach(acc => {
                 equipmentIds.push(acc.assetRecordId);
             })
            }
        this.commonService.autoCompleteSmartDropDownAssetList(value, true, 20, equipmentIds,this.currentUserMasterCompanyId)
            .subscribe(results => {
                this.isSpinnerVisible = false;
                this.allPartnumbersInfo = results.map(x => {
                    return {
                               "assetRecordId": x.assetRecordId,
                                "assetId": x.value,
                                "assetTypeId": x.tangibleClassId,
                                "assetTypeName": x.assetAttributeTypeName,
                                "description": x.description,
                                "name": x.name,
                                "class": x.assetAttributeTypeName,
                                'assetIdName':x.assetId
                    }
                }); 
            }, error => {
                this.isSpinnerVisible = false;
            });
    }

    saveEquipmentWorkOrder() {
        this.saveEquipmentListForWO.emit(this.workFlow)
    }

    updateEquipmentWorkOrder() {
        this.updateEquipmentListForWO.emit(this.workFlow)
        // this.disableUpdate=true;
    }

    checkQuantityAvailability() {
        let result = false;
        this.workFlow.equipments.forEach(
            eq => {
                if (!eq.quantity || Number(eq.quantity) <= 0) {
                    result = true;
                }
            }
        )
        return result;
    }

    onDataLoadFailed(log) {
        const errorLog = log;
        var msg = '';
        if (errorLog.message) {
            if (errorLog.error && errorLog.error.errors.length > 0) {
                for (let i = 0; i < errorLog.error.errors.length; i++) {
                    msg = msg + errorLog.error.errors[i].message + '<br/>'
                }
            }
            this.alertService.showMessage(
                errorLog.error.message,
                msg,
                MessageSeverity.error
            );
        }
        else {
            this.alertService.showMessage(
                'Error',
                log.error,
                MessageSeverity.error
            );
        }
    }
    dismissModel() {
        this.modal.close();
    }
    deletedRowIndex:any;
    deleteRowRecord:any={};
    openDelete(content, row,index) {
        this.deletedRowIndex=index;
      this.deleteRowRecord = row;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    deleteRow(): void {
        if (this.workFlow.equipments[this.deletedRowIndex].workflowEquipmentListid == undefined || this.workFlow.equipments[this.deletedRowIndex].workflowEquipmentListid == "0" || this.workFlow.equipments[this.deletedRowIndex].workflowEquipmentListid == "") {
            this.workFlow.equipments.splice(this.deletedRowIndex, 1);
        }
        else {
            this.workFlow.equipments[this.deletedRowIndex].isDeleted = true;
            this.workFlow.equipments[this.deletedRowIndex].isDeleted = true;
        }
        this.dismissModel();
    }
    getActive(){
    this.disableUpdate=false;
  }

  textAreaInfo: any;
  memoIndex;
  disableEditor: any = true;
  onAddTextAreaInfo(material, index) {
      this.disableEditor = true;
      this.memoIndex = index;
      this.textAreaInfo = material.memo;
  }
  onSaveTextAreaInfo(memo) {
      if (memo) {
          this.textAreaInfo = memo;
          this.workFlow.equipments[this.memoIndex].memo = this.textAreaInfo;
      }
      this.disableEditor = true;
      $("#textarea-popup5").modal("hide");
      // this.disableUpdateButton = false;
  }
  onCloseTextAreaInfo() {
      this.disableEditor = true;
      $("#textarea-popup5").modal("hide");
  }
  parsedText(text) {
      if (text) {
          const dom = new DOMParser().parseFromString(
              '<!doctype html><body>' + text,
              'text/html');
          const decodedString = dom.body.textContent;
          return decodedString;
      }
  }
  editorgetmemo(ev) {
      this.disableEditor = false;
  }
  close() {
    this.isEdit = false;
    this.editData = undefined;
    this.workFlow.equipments = []; 
    this.closeEvent.emit(true)
}

allowNumberOnly(evt) {
  
    // Only ASCII charactar in that range allowed
    var ASCIICode = (evt.which) ? evt.which : evt.keyCode
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
        return false;
    return true;
}
}




