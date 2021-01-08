import { Component, Input, OnChanges, OnInit, EventEmitter, Output } from "@angular/core";
import { IWorkFlow } from "../Workflow/WorkFlow";
import { ActionService } from "../Workflow/ActionService";
import { IExclusionEstimatedOccurance } from "../Workflow/ExclusionEstimatedOccurance";
import { IExclusion } from "../Workflow/Exclusion";
import { ItemMasterService } from "../services/itemMaster.service";
import { AlertService, MessageSeverity } from "../services/alert.service";
import * as $ from 'jquery'
import { WorkOrderQuoteService } from "../services/work-order/work-order-quote.service";
import { ItemClassificationService } from "../services/item-classfication.service";
import { VendorService } from "../services/vendor.service";
import { formatNumberAsGlobalSettingsModule } from "../generic/autocomplete";
import { CommonService } from "../services/common.service";
@Component({
    selector: 'grd-exclusions',
    templateUrl: './Exclusions-Create.component.html',
    styleUrls: ['./Exclusions-Create.component.css']
})
export class ExclusionsCreateComponent implements OnInit, OnChanges {
    @Input() isWorkOrder = false;
    @Input() workFlow: IWorkFlow;
    @Input() UpdateMode: boolean;
    @Input() isEdit = false;
    @Input() isQuote = false;
    @Input() markupList;
    @Input() editData;
    @Input() taskList: any = [];
    @Input() isWorkFlow: boolean = false;
    @Output() saveExclusionsListForWO = new EventEmitter();
    @Output() updateExclusionsListForWO = new EventEmitter();

    @Output() notify: EventEmitter<IWorkFlow> =
        new EventEmitter<IWorkFlow>();

    exclusionEstimatedOccurances: any = [];
    row: any;
    allPartnumbersInfo: any[] = [];
    itemclaColl: any[];
    partCollection: any[];
    errorMessage: string;
    currentPage: number = 1;
    itemsPerPage: number = 10;
    allPartDetails: any = [];
    itemClassInfo: any;
    materialCondition: any;
    defaultConditionId: any;
    partListData: any = [];
    conditionList: any=[];


    constructor(private actionService: ActionService,
        private workOrderQuoteService: WorkOrderQuoteService,
        private itemClassService: ItemClassificationService,
        private vendorService: VendorService,
        private itemser: ItemMasterService, private alertService: AlertService,
        private commonService: CommonService,) {
        for (var i = 0; i <= 100; i++) {
            this.exclusionEstimatedOccurances.push({ id: i, name: String(i) });
        }
    }

    ngOnInit(): void {
        this.loadItemClassData();
        this.loadPartData();        
        if (this.isEdit) {
            this.workFlow.exclusions = [];
            const data = {
                ...this.editData,
                partDescription: this.editData.epnDescription,
                partNumber: this.editData.epn,
                estimtPercentOccurrance:(this.isQuote)?this.editData.exstimtPercentOccuranceId:this.editData.exstimtPercentOccurance
            } 
            console.log("edit data",this.editData)
            this.workFlow.exclusions.push(data);
            this.reCalculate();
            if (this.isWorkOrder){
                // this.getPNDetails(data); 
                this.workFlow.exclusions.map((x, index) => {
                    this.getPartConditions(x, index),
                        this.getPNDetails(x);
                })
            }
        } else {
            if (!this.UpdateMode) {
                this.workFlow.exclusions = [];
                this.row = this.workFlow.exclusions[0];
                this.workFlow.exclusions = [];
                this.addRow();
            }
        }

        if (this.isWorkOrder) {
            this.row = this.workFlow.exclusions[0];

            // this.row = this.workFlow.exclusions[0];
            // this.addRow();

        } else {
            this.row = this.workFlow.exclusions[0];
            if (this.row == undefined) {
                this.row = {};
            }
            this.workFlow.exclusions.map((x, index) => {
                this.getPartConditions(x, index),
                    this.getPNDetails(x);
            })
            if (!this.isQuote) {
                this.row.taskId = this.workFlow.taskId;

            }
        }
        this.ptnumberlistdata();
        if (this.UpdateMode) {
            this.reCalculate();
        }
        this.getConditionsList();
    }


    ngOnChanges(): void {
        // if(this.workFlow) {
        //     if(this.workFlow.exclusions.length > 0) {
        //         this.workFlow.exclusions = this.workFlow.charges.map(x => {
        //             return {
        //                 ...x,
        //                 quantity: x.quantity ? formatNumberAsGlobalSettingsModule(x.quantity, 0) : '0',
        //                 unitCost: x.unitCost ? formatNumberAsGlobalSettingsModule(x.unitCost, 2) : '0.00',
        //                 extendedCost: x.extendedCost ? formatNumberAsGlobalSettingsModule(x.extendedCost, 2) : '0.00'
        //             }
        //         })
        //     }
        // }
        if (this.UpdateMode) {
            this.reCalculate();
        }
        if (!this.isWorkFlow) {
            this.workFlow.exclusions = [];
            this.addRow();
        }
    }

    getConditionsList(){
        this.commonService.smartDropDownList('Condition', 'ConditionId', 'Description').subscribe(res => {
            this.conditionList = res;
            console.log(res);
        })
    }
    reCalculate() {
        this.calculateQtySummation();
        this.calculateExtendedCostSummation();
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

    addRow(): void {
        var newRow = Object.assign({}, this.row);
        newRow.workflowExclusionId = "0";
        // newRow.taskId = this.workFlow.taskId;
        if (this.taskList) {
            this.taskList.forEach(
                task => {
                    if (task.description == "Assemble") {
                        newRow.taskId = task.taskId;
                    }
                }
            )
        }
        newRow.partDescription = "";

        newRow.conditionCodeId = '';
        newRow.itemClassificationId = '';
        newRow.stockType = '';
        newRow.estimtPercentOccurrance = "";
        newRow.extendedCost = "";
        newRow.partName = "";
        newRow.partNumber = null;
        newRow.itemMasterId = "";
        newRow.quantity = "";
        newRow.unitCost = "";
        newRow.memo = "";
        newRow.itemMasterId = "";
        // newRow.estimtPercentOccurranceId = '';
        newRow.isDelete = false;
        this.workFlow.exclusions.push(newRow);
    }

    onTaskChange(task) {
        this.taskList.forEach((t)=>{
            if(t.taskId == task.taskId){
                task['taskName'] = t.description;
            }
        })
    }

    clearValue(object, index) {
        object.partNumber = null;
    }
    deleteRow(index): void {
        if (this.workFlow.exclusions[index].workflowExclusionId == undefined || this.workFlow.exclusions[index].workflowExclusionId == "0" || this.workFlow.exclusions[index].workflowExclusionId == "") {
            this.workFlow.exclusions.splice(index, 1);
        }
        else {
            this.workFlow.exclusions[index].isDelete = true;
        }
        this.reCalculate();
    }

    onPartSelect(event, exclusion, index) {
        console.log("current record", exclusion, index);
        var isEpnExist = this.workFlow.exclusions.filter(x => x.partNumber == exclusion.partNumber && x.taskId == this.workFlow.taskId);

        if (isEpnExist.length > 1) {
            exclusion.itemMasterId = "";
            exclusion.partDescription = "";
            exclusion.partNumber = "";
            exclusion.itemClassificationId = '';
            event = "";
            this.alertService.showMessage("Workflow", "EPN is already in use in Exclusion List.", MessageSeverity.error);
            return;
        }
        else {
            if (this.itemclaColl) {
                for (let i = 0; i < this.itemclaColl.length; i++) {
                    if (event == this.itemclaColl[i][0].partName) {
                        exclusion.itemMasterId = this.itemclaColl[i][0].partId;
                        exclusion.partDescription = this.itemclaColl[i][0].description;
                        exclusion.partNumber = this.itemclaColl[i][0].partName;
                        exclusion.itemClassificationId = this.itemclaColl[i][0].itemClassificationId;
                    }
                }
                this.getPNDetails(exclusion);
            }
        }
        this.getPartConditions(exclusion, index)
    }

    filterpartItems(event) {
        this.partCollection = [];
        this.itemclaColl = [];
        if (this.allPartnumbersInfo != undefined && this.allPartnumbersInfo.length > 0) {
            for (let i = 0; i < this.allPartnumbersInfo.length; i++) {
                let partName = this.allPartnumbersInfo[i].partNumber;

                let isMaterialListPart: any;
                if (this.workFlow.materialList != undefined && this.workFlow.materialList.length > 0) {
                    isMaterialListPart = this.workFlow.materialList.find(x => x.itemMasterId == this.allPartnumbersInfo[i].itemMasterId);
                    if (isMaterialListPart != undefined)
                        continue;
                }

                if (partName.toLowerCase().indexOf(event.query.toLowerCase()) == 0 && isMaterialListPart == undefined) {
                    this.itemclaColl.push([{
                        "partId": this.allPartnumbersInfo[i].itemMasterId,
                        "partName": partName,
                        "description": this.allPartnumbersInfo[i].partDescription,
                        "itemClassificationId": this.allPartnumbersInfo[i].itemClassificationId,
                    }]);

                    this.partCollection.push(partName);
                }
            }
        }
    }

    validateQuantity(event, exclusion): void {
        // event.target.value = event.target.value == '' ? '' : parseInt(exclusion.quantity);
        if (event.target.value != '') {
            exclusion.quantity = formatNumberAsGlobalSettingsModule(exclusion.quantity, 0);
        }
    }

    calculateExtendedCost(exclusion): void {
        exclusion.unitCost = exclusion.unitCost ? formatNumberAsGlobalSettingsModule(exclusion.unitCost ,2) : '';
        exclusion.quantity = exclusion.quantity ? exclusion.quantity.toString().replace(/\,/g,'') : 0;
        var value: any = parseFloat(exclusion.quantity) * parseFloat(exclusion.unitCost.toString().replace(/\,/g,''));
        if (value > 0) {
            exclusion.extendedCost = formatNumberAsGlobalSettingsModule(value, 2);
            this.calculateExtendedCostSummation()
        }
        else {
            exclusion.extendedCost = "";
        }

    }
    getPNDetails(part) {
        console.log("get pnDetails", part)
        if (part && part.partNumber && part.conditionCodeId) {
            this.allPartDetails.forEach(
                pn => {
                    if (pn.partNumber == part.partNumber) {
                        this.workOrderQuoteService.getPartDetails(pn.itemMasterId, part.conditionCodeId)
                            .subscribe(
                                partDetail => {
                                    if (partDetail) {
                                        part.unitCost = partDetail["pP_UnitPurchasePrice"];
                                        part.unitCost = part.unitCost ? formatNumberAsGlobalSettingsModule(part.unitCost, 2) : '0.00';
                                        part.billingRate = partDetail["sP_FSP_FlatPriceAmount"];
                                        part.markupPercentageId = partDetail["sP_CalSPByPP_MarkUpPercOnListPrice"];
                                        part.stockType = partDetail["stockType"];
                                        part.price = partDetail["salePrice"];
                                        this.calculateExtendedCost(part);
                                    }
                                }
                            )
                    }
                }
            )
        }
    }
    getDynamicVariableData(variable, index) {
        return this[variable + index];
    }
    async getPartConditions(part, index) {
        // this.materialCondition = [];
        console.log("index", index)
        if (part) {
            await this.workOrderQuoteService.getPartConditions(part.itemMasterId).subscribe(
                res => {
                    this.materialCondition = res;
                    console.log("res", res);
                    console.log("this.exclusions",this.workFlow)
                    if (this.materialCondition && this.materialCondition.length > 0) {

                        this['partconditionsList' + index] = this.materialCondition;
                        var defaultCondition = this['partconditionsList' + index].find(x => x.condition.trim().toLowerCase() == "new");
                        this.defaultConditionId = defaultCondition != undefined ? defaultCondition.conditionId : this.materialCondition[0].conditionId;
                        console.log("conditionid", this.defaultConditionId);
                        if ((this.workFlow.workflowId == undefined || this.workFlow.workflowId == '0') && !this.isEdit && this.workFlow.exclusions[index] != undefined) {
                            this.workFlow.exclusions[index].conditionCodeId = this.defaultConditionId;
                            console.log("this.exclusions22",this.workFlow)
                        }
                        this.getPNDetails(this.workFlow.exclusions[index]);
                    } else {
                        this['partconditionsList' + index] = [];
                    }
                    if (this.isEdit) {
                        this.workFlow.exclusions[index].conditionCodeId = part.conditionCodeId ? part.conditionCodeId :this.defaultConditionId;
                        console.log("this.exclusions33",this.workFlow)
                    }else{
                        this.workFlow.exclusions[index].conditionCodeId = part.conditionCodeId ? part.conditionCodeId :this.defaultConditionId;
                        console.log("this.exclusions55",this.workFlow)
                    }
                    console.log("this.exclusions44",this.workFlow)
                }
            )
        }
    }
    private loadItemClassData() {
        this.itemClassService.getWorkFlows().subscribe(data => { this.itemClassInfo = data[0] });
    }

    // sum of the qty
    calculateQtySummation() {
        this.workFlow.sumofQty = this.workFlow.exclusions.filter(x => x.isDelete != true).reduce((acc, x) => {
            return acc + parseFloat(x.quantity == undefined || x.quantity === '' ? 0 : x.quantity)
        }, 0);

    }
    // sum of extended cost
    calculateExtendedCostSummation() {
        this.workFlow.sumofExtendedCost = this.workFlow.exclusions.filter(x => x.isDelete != true).reduce((acc, x) => {
            return acc + parseFloat(x.extendedCost == undefined || x.extendedCost === '' ? 0 : x.extendedCost.toString().replace(/\,/g,''))
        }, 0);
        this.workFlow.sumofExtendedCost = this.workFlow.sumofExtendedCost ? formatNumberAsGlobalSettingsModule(this.workFlow.sumofExtendedCost, 2) : '';
    }

    private ptnumberlistdata() {
        this.itemser.getPrtnumberslistList().subscribe(
            results => this.onptnmbersSuccessful(results[0])
            //error => this.onDataLoadFailed(error)
        );
    }
    private onptnmbersSuccessful(allWorkFlows: any[]) {
        this.allPartnumbersInfo = allWorkFlows;
    }
    memoIndex;
    onAddTextAreaInfo(material, index) {
        this.memoIndex = index;
        console.log("memolist", material, index);
        this.textAreaInfo = material.memo;
    }
    textAreaInfo: any;
    onSaveTextAreaInfo(memo) {
        if (memo) {
            this.textAreaInfo = memo;
            console.log("hello cjkf", this.workFlow.exclusions)
            this.workFlow.exclusions[this.memoIndex].memo = this.textAreaInfo;
            console.log("index", this.workFlow.exclusions);
            // items.indexOf(3452)

        }
        $("#textarea-popupexclusion").modal("hide");
    }
    onCloseTextAreaInfo() {
        $("#textarea-popupexclusion").modal("hide");
    }
    saveExclusionsWorkOrder() {

        this.saveExclusionsListForWO.emit(this.workFlow)
        this.workFlow.exclusions = [];
        this.addRow();
        this.workFlow.sumofQty = 0;
        this.workFlow.sumofExtendedCost = 0;
    }
    closeExclusionTab(){
        this.workFlow.exclusions = [];
        this.addRow();
    }
    updateExclusionsWorkOrder() {
        this.updateExclusionsListForWO.emit(this.workFlow);
        this.workFlow.exclusions = [];
        this.addRow();
        this.workFlow.sumofQty = 0;
        this.workFlow.sumofExtendedCost = 0;
    }

    markupChanged(matData) {
        try {
            this.markupList.forEach((markup) => {

                if (markup.value == Number(matData.markUpPercentageId)) {
                    matData.costPlusAmount = (matData.extendedPrice) + (((matData.extendedPrice) / 100) * Number(markup.label))
                }
            })
        }
        catch (e) {
            console.log(e);
        }
    }

    close() {
        this.isEdit = false;
        this.editData = undefined;
        this.workFlow.exclusions = [];
        this.addRow();
        this.workFlow.sumofQty = 0;
        this.workFlow.sumofExtendedCost = 0;
        $('#addNewExclusions').modal('hide');
    }

}