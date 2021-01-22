import { Component, Input, OnChanges, OnInit, EventEmitter, Output } from "@angular/core";
import { IWorkFlow } from "../Workflow/WorkFlow";
import { ActionService } from "../Workflow/ActionService";
import { ItemMasterService } from "../services/itemMaster.service";
import { AlertService, MessageSeverity } from "../services/alert.service";
declare var $ : any;
import { WorkOrderQuoteService } from "../services/work-order/work-order-quote.service";
import { ItemClassificationService } from "../services/item-classfication.service";
import { VendorService } from "../services/vendor.service";
import { formatNumberAsGlobalSettingsModule } from "../generic/autocomplete";
import { CommonService } from "../services/common.service";
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from "../services/auth.service";

@Component({
    selector: 'grd-exclusions',
    templateUrl: './Exclusions-Create.component.html',
    styleUrls: ['./Exclusions-Create.component.css']
})
export class ExclusionsCreateComponent implements OnInit, OnChanges {
    @Input() isWorkOrder = false;
    @Input() workFlow:any={};
    @Input() UpdateMode: boolean;
    @Input() isEdit = false;
    @Input() isQuote = false;
    @Input() markupList;
    @Input() editData;
    @Input() taskList: any = [];
    @Input() isWorkFlow: boolean = false;
    @Output() saveExclusionsListForWO = new EventEmitter();
    @Output() updateExclusionsListForWO = new EventEmitter();
    @Output() notify: EventEmitter<IWorkFlow> = new EventEmitter<IWorkFlow>();

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
    conditionList: any = [];
    isSpinnerVisible = false;
    textAreaInfo: any;
    memoIndex;
    modal: NgbModalRef;
    deleteRowRecord:any={};
    deletedRowIndex:any;
    disabledMemo: boolean = false;
    @Input() masterItemMasterId:any;
    constructor(private actionService: ActionService,
        private workOrderQuoteService: WorkOrderQuoteService,
        private itemClassService: ItemClassificationService,
        private authService: AuthService,
        private vendorService: VendorService,
        private modalService: NgbModal,
        private itemser: ItemMasterService, private alertService: AlertService,
        private commonService: CommonService,) {
        for (var i = 0; i <= 100; i++) {
            this.exclusionEstimatedOccurances.push({ id: i, name: String(i) });
        }
    }

    ngOnInit(): void {
        if (this.isEdit) {
            this.workFlow.exclusions = [];
            const data = {
                ...this.editData,
                partDescription: this.editData.epnDescription,
                // partNumber: this.editData.epn,
                estimtPercentOccurrance: (this.isQuote) ? this.editData.exstimtPercentOccuranceId : this.editData.exstimtPercentOccurance
            }
            this.workFlow.exclusions.push(data);
            this.reCalculate();
            if (this.isWorkOrder) {
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
        } else {
            this.row = this.workFlow.exclusions[0];
            if (this.row == undefined) {
                this.row = {};
            }
            if (!this.isQuote) {
                this.row.taskId = this.workFlow.taskId;
            }
        }
        if (this.UpdateMode) {
            this.reCalculate();
        }
        if(this.workFlow.exclusions && this.workFlow.exclusions.length !=0){
        this.workFlow.exclusions.map((x, index) => {
            // this.masterItemMasterId= this.workFlow.itemMasterId
            this.workFlow.exclusions[index].partNameRef=x.partNumber;
                this.workFlow.exclusions[index].partName={partNumber:x.partNumber,itemMasterId:x.itemMasterId};
                this.workFlow.exclusions[index].conditionId=x.conditionCodeId ? x.conditionCodeId : x.conditionId;
                x.unitCost = x.unitCost ?   formatNumberAsGlobalSettingsModule(x.unitCost, 2) : '0.00';
                        x.extendedCost =  x.extendedCost ? formatNumberAsGlobalSettingsModule(x.extendedCost, 2):'0.00';
        })
    }
        this.getConditionsList();
    }

    ngOnChanges(): void {
        if (this.UpdateMode) {
            this.reCalculate();
        }
        if (!this.isWorkFlow) {
            this.workFlow.exclusions = [];
            this.addRow();
        }
        this.masterItemMasterId=this.masterItemMasterId;
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    get currentUserMasterCompanyId(): number {
		return this.authService.currentUser ? this.authService.currentUser.masterCompanyId : null;
    }
    
    enableSaveMemo() {
        this.disabledMemo = false;
    }

    getConditionsList() { 
        this.isSpinnerVisible = true;
        let consitionIds = [];
        if (this.UpdateMode) {
            consitionIds = this.workFlow.exclusions.reduce((acc, x) => {
                return consitionIds.push(acc.conditionId);
            }, 0)
        }
        if(consitionIds && consitionIds.length ==0){
            consitionIds.push(0)
        }
        this.commonService.autoSuggestionSmartDropDownList('Condition', 'ConditionId', 'Description', '', true, 20, consitionIds)
            .subscribe(res => {
                this.isSpinnerVisible = false;
                this.conditionList = res;
            }, error => {
                this.isSpinnerVisible = false;
            });
    }

    reCalculate() {
        this.calculateQtySummation();
        this.calculateExtendedCostSummation();
    }

    loapartItems(strvalue = '') {
        this.isSpinnerVisible = true;
        let exclusionsIds = [];
        if (this.UpdateMode) {
            exclusionsIds.push(0)
            exclusionsIds = this.workFlow.exclusions.forEach(acc => {
               exclusionsIds.push(acc.itemMasterId);
            })
        } 
        this.commonService.autoCompleteSmartDropDownItemMasterList(strvalue, true, 20, exclusionsIds)
            .subscribe(res => {
                this.isSpinnerVisible = false;
                this.partCollection = res.map(x => {
                    return {
                        partId: x.value,
                        itemMasterId: x.value,
                        partDescription: x.partDescription,
                        partNumber: x.label,
                        itemClassificationId: x.itemClassificationId,
                        itemClassification: x.itemClassification,
                        partName: x.label,
                        conditionId:x.conditionId
                    }
                // }
                });
                this.partCollection.forEach(element => { 
                    if(element.itemMasterId==this.masterItemMasterId){
                       this.partCollection.splice(element, 1); 
                    }
                   });
                this.itemclaColl = this.partCollection;
            }, error => {
                this.isSpinnerVisible = false;
            });
    }
    // masterItemMasterId:any;
    addRow(): void {
        var newRow = Object.assign({}, this.row);
        newRow.workflowExclusionId = "0";
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
        newRow.conditionId = '';
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
        newRow.isDeleted = false;
        newRow.updatedBy = this.userName;
        newRow.createdBy = this.userName;
        newRow.masterCompanyId = this.currentUserMasterCompanyId;
        this.workFlow.exclusions.push(newRow);
    }

    onTaskChange(task) {
        this.taskList.forEach((t) => {
            if (t.taskId == task.taskId) {
                task['taskName'] = t.description;
            }
        })
    }
    clearValue(object, index) {
        object.partNumber = null;
    }

    onPartSelect(event, exclusion, index) {
        var isEpnExist = this.workFlow.exclusions.filter(x => x.partNumber == event.partNumber && x.taskId == this.workFlow.taskId);
        if (isEpnExist.length > 1) {
            exclusion.itemMasterId = "";
            exclusion.partDescription = "";
            exclusion.partNumber = "";
            exclusion.partName = "";
            exclusion.itemClassificationId = '';
            exclusion.createdBy = this.userName;
            event = "";
            this.alertService.showMessage("Workflow", "EPN is already in use in Exclusion List.", MessageSeverity.error);
            return;
        }
        else { 
            if (this.itemclaColl) {
                for (let i = 0; i < this.itemclaColl.length; i++) {
                    if (event.partName == this.itemclaColl[i].partName) {
                        exclusion.itemMasterId = this.itemclaColl[i].partId;
                        exclusion.partDescription = this.itemclaColl[i].partDescription;
                        exclusion.partNumber = event.partNumber;
                        exclusion.partName = event;
                        exclusion.conditionId = event.conditionId;
                        exclusion.itemClassificationId = this.itemclaColl[i].itemClassificationId;
                        exclusion.itemClassification = this.itemclaColl[i].itemClassification;
                        exclusion.createdBy = this.userName;
                    }
                }
            }
           
            this.getPNDetails(exclusion); 
        }
    }

    filterpartItems(event) {
        if (event.query !== undefined && event.query !== null) {
            this.loapartItems(event.query);
        }
    }

    validateQuantity(event, exclusion): void {
        if (event.target.value != '') {
            exclusion.quantity = formatNumberAsGlobalSettingsModule(exclusion.quantity, 0);
        }
    }

    calculateExtendedCost(exclusion): void {
        exclusion.unitCost = exclusion.unitCost ?   formatNumberAsGlobalSettingsModule(exclusion.unitCost, 2) : '0.00';
        exclusion.quantity = exclusion.quantity ? formatNumberAsGlobalSettingsModule(exclusion.quantity, 0) : '0';

        var value: any = parseFloat(exclusion.quantity) * parseFloat(exclusion.unitCost.toString().replace(/\,/g, ''));
        if (value > 0) {
            exclusion.extendedCost = formatNumberAsGlobalSettingsModule(value, 2);
            this.calculateExtendedCostSummation()
        }
        else {
            exclusion.extendedCost = "";
        }
    }

    getPNDetails(part) {
        part.conditionId=part.conditionId?part.conditionId :1;
        part.conditionCodeId=part.conditionId;
        // part.unitCost = part.unitCost ? formatNumberAsGlobalSettingsModule(part.unitCost, 2) : '0.00';
        if (part && part.partNumber && part.conditionId) {
                        this.isSpinnerVisible = true;
                        this.workOrderQuoteService.getPartDetails(part.itemMasterId, part.conditionId)
                            .subscribe(
                                partDetail => {
                                    this.isSpinnerVisible = false;
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
                                , error => {
                                    this.isSpinnerVisible = false;
                                });

            this.reCalculate();
        }
        
    }

    getDynamicVariableData(variable, index) {
        return this[variable + index];
    }

    async getPartConditions(part, index) {
        if (part) {
            this.isSpinnerVisible = true;
            await this.workOrderQuoteService.getPartConditions(part.itemMasterId).subscribe(
                res => {
                    this.isSpinnerVisible = false;
                    this.materialCondition = res;
                    if (this.materialCondition && this.materialCondition.length > 0) {
                        this['partconditionsList' + index] = this.materialCondition;
                        var defaultCondition = this['partconditionsList' + index].find(x => x.condition.trim().toLowerCase() == "new");
                        this.defaultConditionId = defaultCondition != undefined ? defaultCondition.conditionId : this.materialCondition[0].conditionId;
                        if ((this.workFlow.workflowId == undefined || this.workFlow.workflowId == '0') && !this.isEdit && this.workFlow.exclusions[index] != undefined) {
                            this.workFlow.exclusions[index].conditionId = this.defaultConditionId;
                        }
                        this.getPNDetails(this.workFlow.exclusions[index]);
                    } else {
                        this['partconditionsList' + index] = [];
                    }
                    if (this.isEdit) {
                        this.workFlow.exclusions[index].conditionId = part.conditionId ? part.conditionId : this.defaultConditionId;
                    } else {
                        this.workFlow.exclusions[index].conditionId = part.conditionId ? part.conditionId : this.defaultConditionId;
                    }
                }, error => {
                    this.isSpinnerVisible = false;
                });
        }
    }

    private loadItemClassData() {
        this.isSpinnerVisible = true;
        this.itemClassService.getWorkFlows().subscribe(data => {
            this.isSpinnerVisible = false;
            this.itemClassInfo = data[0]
        }, error => {
            this.isSpinnerVisible = false;
        });
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
            return acc + parseFloat(x.extendedCost == undefined || x.extendedCost === '' ? 0 : x.extendedCost.toString().replace(/\,/g, ''))
        }, 0);
        this.workFlow.sumofExtendedCost = this.workFlow.sumofExtendedCost ? formatNumberAsGlobalSettingsModule(this.workFlow.sumofExtendedCost, 2) : '';
    }
   
    onAddTextAreaInfo(material, index) {
        this.memoIndex = index;
        this.textAreaInfo = material.memo;
        this.disabledMemo = true;
    }
    
    onSaveTextAreaInfo(memo) {
        if (memo) {
            this.textAreaInfo = memo;
            this.workFlow.exclusions[this.memoIndex].memo = this.textAreaInfo;
        }
        $("#textarea-popupexclusion").modal("hide");
        this.disabledMemo = true;
    }

    onCloseTextAreaInfo() {
        $("#textarea-popupexclusion").modal("hide");
        this.disabledMemo = true;
    }

    saveExclusionsWorkOrder() {
        this.saveExclusionsListForWO.emit(this.workFlow)
        this.workFlow.exclusions = [];
        this.addRow();
        this.workFlow.sumofQty = 0;
        this.workFlow.sumofExtendedCost = 0;
    }

    closeExclusionTab() {
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

    dismissModel() {
        this.modal.close();
    }


    openDelete(content, row,index) {
        this.deletedRowIndex=index;
        this.deleteRowRecord = row;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    deleteRow(): void {
        if (this.workFlow.exclusions[this.deletedRowIndex].workflowExclusionId == undefined || this.workFlow.exclusions[this.deletedRowIndex].workflowExclusionId == "0" || this.workFlow.exclusions[this.deletedRowIndex].workflowExclusionId == "") {
            this.workFlow.exclusions.splice(this.deletedRowIndex, 1);
        }
        else {
            this.workFlow.exclusions[this.deletedRowIndex].isDelete = true;
        }
        this.reCalculate();
        this.modal.close();
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
            this.workFlow.exclusions[this.deletedRowIndex].isDelete = true;
        }
        this.reCalculate();
        this.dismissModel();
    }
}