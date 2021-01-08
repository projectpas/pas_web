import { Component, Input, OnChanges, OnInit, EventEmitter, Output, AfterContentChecked, AfterViewInit, DoCheck } from "@angular/core";
import { IWorkFlow } from "../Workflow/WorkFlow";
import { ActionService } from "../Workflow/ActionService";
import { IEquipmentAssetType } from "../Workflow/EquipmentAssetType";
import { IEquipmentList } from "../Workflow/EquipmentList";
import { VendorService } from "../services/vendor.service";
import { ItemMasterService } from "../services/itemMaster.service";
import { AssetService } from "../services/asset/Assetservice";
import { MessageSeverity, AlertService } from "../services/alert.service";
import { WorkOrderService } from "../services/work-order/work-order.service";

@Component({
    selector: 'grd-equipment',
    templateUrl: './Equipment-Create.component.html',
    styleUrls: ['./Equipment-Create.component.css']
})
export class EquipmentCreateComponent implements OnInit,OnChanges {
    partCollection: any[];
    @Input() workFlowObject;
    //@Input() isWorkOrder = false;
    @Input() isWorkOrder: boolean = false;
    @Input() workFlow: IWorkFlow;
    @Input() isEdit = false;
    @Input() editData;
    @Input() UpdateMode: boolean;
    @Input() moduleName = 'Tool'
    @Output() saveEquipmentListForWO = new EventEmitter();
    @Output() closeEvent = new EventEmitter();
    @Output() updateEquipmentListForWO = new EventEmitter();

    @Output() notify: EventEmitter<IWorkFlow> =
        new EventEmitter<IWorkFlow>();
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

    constructor(private itemser: ItemMasterService,     private workOrderService: WorkOrderService, private actionService: ActionService, private vendorService: VendorService, private assetService: AssetService, private alertService: AlertService) {
    }

    ngOnInit(): void { 
        console.log(this.editData);
        if (this.isWorkOrder) {
            this.workFlow = this.workFlowObject;
            this.row = this.workFlow.equipments[0];
            if (this.isEdit) {
                this.workFlow.equipments = [];
                const data = {
                    ...this.editData,
                    // partNumber: this.editData.assetId,
                    partNumber: this.editData.name,
                    assetDescription: this.editData.description,
                    assetTypeId: this.editData.assetTypeId,
                    assetName: this.editData.name,
                }
                this.workFlow.equipments.push(data);
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
        }

        // console.log(this.workFlow);


        this.actionService.getEquipmentAssetType().subscribe(
            equipmentAssetType => {
                this.equipmentAssetType = equipmentAssetType;
            },
            error => this.errorMessage = <any>error
        );
        this.ptnumberlistdata();

    }
    ngOnChanges(): void {
    if (this.isWorkOrder) {
        this.workFlow = this.workFlowObject;
        this.workFlow.equipments = [];
        this.row = this.workFlow.equipments[0];
        this.addRow();
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

        newRow.isDelete = false;
        this.workFlow.equipments.push(newRow);
    }

    private loadPartData() {

        this.vendorService.getPartDetails().subscribe(
            data => {
                this.allPartDetails = data[0];

                if (this.vendorService.isEditMode == false) {

                    for (let i = 0; i < this.partListData.length; i++) {
                        this.partListData[i].partListObj = this.allPartDetails;
                    }
                }
            })
    }


    deleteRow(index): void {
        if (this.workFlow.equipments[index].workflowEquipmentListid == undefined || this.workFlow.equipments[index].workflowEquipmentListid == "0" || this.workFlow.equipments[index].workflowEquipmentListid == "") {
            this.workFlow.equipments.splice(index, 1);
        }
        else {
            this.workFlow.equipments[index].isDelete = true;
        }
    }

    onPartSelect(event, equipment) {
        console.log("event",event,equipment)
        if (this.itemclaColl) {

            var anyEquipment = this.workFlow.equipments.filter(equipment =>
                equipment.taskId == this.workFlow.taskId && equipment.partNumber == event);

            if (anyEquipment.length > 1) {
                equipment.assetId = "";
                equipment.partNumber = "Select";
                equipment.assetDescription = "";
                equipment.assetTypeId = "";
                equipment.assetName = "";
                equipment.assetTypeName = "";
                event = "";

                this.alertService.showMessage("Workflow", "Asset Id is already in use in Tool List", MessageSeverity.error);
            }
            else {
                for (let i = 0; i < this.itemclaColl.length; i++) {
                    if (event == this.itemclaColl[i][0].name) {
                        equipment.assetId = this.itemclaColl[i][0].assetRecordId;
                        equipment.partNumber = this.itemclaColl[i][0].assetId;
                        equipment.assetDescription = this.itemclaColl[i][0].description;
                        equipment.assetTypeId = this.itemclaColl[i][0].assetTypeId;
                        equipment.assetName = this.itemclaColl[i][0].name,
                            equipment.assetTypeName = this.itemclaColl[i][0].assetTypeName
                    }
                };
            }


        }
    }
    filterpartItems(event) {

        this.partCollection = [];
        this.itemclaColl = [];
        if (this.allPartnumbersInfo) {
            if (this.allPartnumbersInfo.length > 0) {
                this.partCollection.push("Select");

                this.itemclaColl.push([{
                    "assetRecordId": "",
                    "assetId": "Select",
                    "assetTypeId": "",
                    "assetTypeName": "",
                    "description": "",
                    "assetName": "",
                }]);

                for (let i = 0; i < this.allPartnumbersInfo.length; i++) {
                    let assetId = this.allPartnumbersInfo[i].name;
                    // let isActiveAsset = this.allPartnumbersInfo[i].isActive;
                    // if (assetId && isActiveAsset) {
                    if (assetId) {
                        if (assetId.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                            this.itemclaColl.push([{
                                "assetRecordId": this.allPartnumbersInfo[i].assetRecordId,
                                "assetId": this.allPartnumbersInfo[i].assetId,
                                "assetTypeId": this.allPartnumbersInfo[i].tangibleClassId,
                                "assetTypeName": this.allPartnumbersInfo[i].assetAttributeTypeName,
                                "description": this.allPartnumbersInfo[i].description,
                                "name": this.allPartnumbersInfo[i].name,
                                "class": this.allPartnumbersInfo[i].assetAttributeTypeName,
                            }]);

                            this.partCollection.push(assetId);

                        }
                    }
                }
                console.log("asset Data",this.partCollection);
            }
        }
    }
    private ptnumberlistdata() {
        // this.assetService.getAllAssetList().subscribe(results => {
        //     console.log("assetListDrop2",results)
        //     this.onptnmbersSuccessful(results[0]);
        // });
        this.workOrderService.getWorkOrderAssetListForDropDown().subscribe(results => {
            // this.onptnmbersSuccessful(results[0]);
            console.log("assetListDrop",results)
            this.allPartnumbersInfo = results;
        });
    }
    // private onptnmbersSuccessful(allWorkFlows: any[]) {

    //     this.allPartnumbersInfo = allWorkFlows;

    // }

    saveEquipmentWorkOrder() {
        this.saveEquipmentListForWO.emit(this.workFlow)
        // $('#addNewEquipments').modal('hide'); 
        // this.workFlow = this.workFlowObject;
        // this.workFlow.equipments = [];
        // this.row = this.workFlow.equipments[0];
        // this.addRow();
    }
    // close(evnt){
    //     this.closeEvent.emit(evnt) 
    // }
    updateEquipmentWorkOrder() {
        this.updateEquipmentListForWO.emit(this.workFlow)
    }
    checkQuantityAvailability(){
        let result = false;
        this.workFlow.equipments.forEach(
            eq => {
                if(!eq.quantity || Number(eq.quantity)<=0){
                    result = true;
                }
            }
        )
        return result;
    }
}
