import { Component, Input, OnChanges, OnInit, EventEmitter, Output } from "@angular/core";
import { IWorkFlow } from "../Workflow/WorkFlow";
import { ActionService } from "../Workflow/ActionService";
import { IEquipmentAssetType } from "../Workflow/EquipmentAssetType";
import { VendorService } from "../services/vendor.service";
import { AssetService } from "../services/asset/Assetservice";
import { MessageSeverity, AlertService } from "../services/alert.service";
import { WorkOrderService } from "../services/work-order/work-order.service";
import { CommonService } from "../services/common.service";
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { getObjectById } from '../generic/autocomplete';

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
    @Input() UpdateMode: boolean;
    @Input() moduleName = 'Tool'
    @Output() saveEquipmentListForWO = new EventEmitter();
    @Output() closeEvent = new EventEmitter();
    @Output() updateEquipmentListForWO = new EventEmitter();
    @Output() notify: EventEmitter<IWorkFlow> = new EventEmitter<IWorkFlow>();

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
    equipmentIds: any[] = [];


    constructor(private commonService: CommonService, private workOrderService: WorkOrderService,
        private actionService: ActionService, private vendorService: VendorService, private modalService: NgbModal,
        private assetService: AssetService, private alertService: AlertService) {
    }

    ngOnInit(): void {
        if (this.isWorkOrder) {
            this.workFlow = this.workFlowObject;
            this.row = this.workFlow.equipments[0];
            if (this.isEdit) {
                this.workFlow.equipments = [];
                const data = {
                    ...this.editData,
                    assetRecordId: this.editData.assetId,
                    description: this.editData.assetDescription,
                    assetTypeId: this.editData.assetTypeId,
                    name: this.editData.assetName,
                    assetTypeName: this.editData.assetTypeName,
                    partNumber: this.editData.assetId,
                    assetId: this.editData.assetId,
                    assetDescription: this.editData.description,
                }
                this.workFlow.equipments.push(data);
            } else {
                this.workFlow.equipments = [];
                this.row = this.workFlow.equipments[0];
                this.addRow();
            }
        } else {
            this.row = this.workFlow.equipments[0];
            for (var i = 0; i < this.workFlow.equipments.length; i++) {
                this.equipmentIds.push(this.workFlow.equipments[i].assetTypeId);
                this.workFlow.equipments[i].partNumber = { value: this.workFlow.equipments[i].assetId, label: this.workFlow.equipments[i].partNumber }
            }

            this.ptnumberlistdata('');

            if (this.row == undefined) {
                this.row = {};
            }
            this.row.taskId = this.workFlow.taskId;
        }
        this.workFlow.equipments.forEach(ev => {
            ev.partNumber = { name: ev.assetName, assetId: ev.assetId }
        })
        this.ptnumberlistdata('');
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
    clearautoCompleteInput(currentRecord) {
        currentRecord.partNumber = undefined;
    }
    onPartSelect(event, equipment, index) {
        this.workFlow.equipments[index].assetId = event.assetId;
        this.workFlow.equipments[index].partNumber = event;
        this.workFlow.equipments[index].assetDescription = event.description;
        this.workFlow.equipments[index].assetTypeId = event.assetTypeId;
        this.workFlow.equipments[index].assetName = event.name,
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
        else {
            for (let i = 0; i < this.itemclaColl.length; i++) {
                if (event.name == this.itemclaColl[i][0].name) {
                    equipment.assetId = this.itemclaColl[i][0].assetId;
                    //equipment.partNumber = this.itemclaColl[i][0].name;
                    equipment.assetDescription = this.itemclaColl[i][0].description;
                    equipment.assetTypeId = this.itemclaColl[i][0].assetTypeId;
                    equipment.assetName = this.itemclaColl[i][0].name,
                        equipment.assetTypeName = this.itemclaColl[i][0].assetTypeName,
                        equipment.partNumber = getObjectById('value', this.itemclaColl[i][0].assetRecordId, this.allPartnumbersInfo)
                }
            };
        }
    }


    filterpartItems(event) {
        if (event.query !== undefined && event.query !== null) {
            this.ptnumberlistdata(event.query);
        }
    }

    assignTools() {
        if (this.allPartnumbersInfo) {
            if (this.allPartnumbersInfo.length > 0) {
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
                    if (assetId) {
                        this.itemclaColl.push([{
                            "assetRecordId": this.allPartnumbersInfo[i].assetRecordId,
                            "assetId": this.allPartnumbersInfo[i].value,
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
        }
    }

    private ptnumberlistdata(strvalue = '') {
        this.isSpinnerVisible = true;
        if (this.equipmentIds.length == 0) {
            this.equipmentIds.push(0);
        }
        this.commonService.autoCompleteSmartDropDownAssetList(strvalue, true, 20, this.equipmentIds.join())
            .subscribe(results => {
                this.isSpinnerVisible = false;
                this.allPartnumbersInfo = results;
                this.partCollection = this.allPartnumbersInfo;

                if (this.allPartnumbersInfo) {
                    if (this.allPartnumbersInfo.length > 0) {
                        this.itemclaColl = [];
                        this.itemclaColl.push([{
                            "assetRecordId": "",
                            "assetId": "Select",
                            "assetTypeId": "",
                            "assetTypeName": "",
                            "description": "",
                            "assetName": "",
                            "name": "",
                        }]);
                        for (let i = 0; i < this.allPartnumbersInfo.length; i++) {
                            let assetId = this.allPartnumbersInfo[i].name;
                            if (assetId) {
                                this.itemclaColl.push([{
                                    "assetRecordId": this.allPartnumbersInfo[i].assetRecordId,
                                    "assetId": this.allPartnumbersInfo[i].value,
                                    "assetTypeId": this.allPartnumbersInfo[i].tangibleClassId,
                                    "assetTypeName": this.allPartnumbersInfo[i].assetAttributeTypeName,
                                    "description": this.allPartnumbersInfo[i].description,
                                    "name": this.allPartnumbersInfo[i].name,
                                    "class": this.allPartnumbersInfo[i].assetAttributeTypeName,
                                }]);
                            }
                        }
                    }
                }


            }, error => {
                this.isSpinnerVisible = false;
            });
    }

    saveEquipmentWorkOrder() {
        this.saveEquipmentListForWO.emit(this.workFlow)
    }

    updateEquipmentWorkOrder() {
        this.updateEquipmentListForWO.emit(this.workFlow)
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

    dismissModel() {
        this.modal.close();
    }
    deletedRowIndex: any;
    deleteRowRecord: any = {};
    openDelete(content, row, index) {
        this.deletedRowIndex = index;
        this.deleteRowRecord = row;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    deleteRow(): void {
        if (this.workFlow.equipments[this.deletedRowIndex].workflowEquipmentListid == undefined || this.workFlow.equipments[this.deletedRowIndex].workflowEquipmentListid == "0" || this.workFlow.equipments[this.deletedRowIndex].workflowEquipmentListid == "") {
            this.workFlow.equipments.splice(this.deletedRowIndex, 1);
        }
        else {
            this.workFlow.equipments[this.deletedRowIndex].isDelete = true;
        }
        this.dismissModel();
    }

}
