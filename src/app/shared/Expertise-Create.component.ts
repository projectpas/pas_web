import { Component, Input, OnChanges, OnInit, EventEmitter, Output } from "@angular/core";
import { IWorkFlow } from "../Workflow/WorkFlow";
import { formatNumberAsGlobalSettingsModule } from "../generic/autocomplete";
import { CommonService } from "../services/common.service";
import { AlertService, MessageSeverity } from "../services/alert.service";
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap'; 
import { WorkFlowtService } from "../services/workflow.service";
declare var $ : any;
@Component({
    selector: 'grd-expertise',
    templateUrl: './Expertise-Create.component.html',
    styleUrls: ['./Expertise-Create.component.css']
})
export class ExpertiseCreateComponent implements OnInit, OnChanges {
    @Input() workFlow: IWorkFlow;
    @Input() UpdateMode: boolean;
    @Output() notify: EventEmitter<IWorkFlow> =
        new EventEmitter<IWorkFlow>();
    expertiseTypes: any[] = [];
    row: any;
    errorMessage: string;
    currentPage: number = 1;
    itemsPerPage: number = 10;
    isSpinnerVisible = false;
    modal: NgbModalRef;

    constructor(private alertService: AlertService,
        private commonService: CommonService, private modalService: NgbModal, private wflwService:WorkFlowtService) {
    }

    ngOnInit(): void {
        this.row = this.workFlow.expertise[0];
        if (this.row == undefined) {
            this.row = {};
        }
        this.row.taskId = this.workFlow.taskId;
        this.getExpertiseData();
    }

    getExpertiseData() {
        let expertiseIds = [];
       this.workFlow.expertise.forEach(acc => {
          expertiseIds.push(acc.expertiseTypeId);
        })
        // if(expertiseIds&& expertiseIds.length ==0){
            expertiseIds.push(0)
        // }
        this.isSpinnerVisible = true;
        this.commonService.autoSuggestionSmartDropDownList('EmployeeExpertise', 'EmployeeExpertiseId', 'Description', '', true, 100, expertiseIds)
            .subscribe(res => {
                this.isSpinnerVisible = false;
                this.expertiseTypes = res.map(x => {
                    return {
                        ...x,
                        employeeExpertiseId: x.value,
                        description: x.label
                    }
                });
            }, error => {
                this.isSpinnerVisible = false;
            });
    }

    ngOnChanges(): void {
        if (this.workFlow) {
            if (this.workFlow.expertise.length > 0) {
                this.workFlow.expertise = this.workFlow.expertise.map(x => {
                    return {
                        ...x,
                        estimatedHours: x.estimatedHours ? formatNumberAsGlobalSettingsModule(x.estimatedHours, 2) : '0.00',
                        laborDirectRate: x.laborDirectRate ? formatNumberAsGlobalSettingsModule(x.laborDirectRate, 2) : '0.00',
                        directLaborRate: x.directLaborRate ? formatNumberAsGlobalSettingsModule(x.directLaborRate, 2) : '0.00',
                        overheadBurden: x.overheadBurden ? formatNumberAsGlobalSettingsModule(x.overheadBurden, 2) : '0.00',
                        overheadCost: x.overheadCost ? formatNumberAsGlobalSettingsModule(x.overheadCost, 2) : '',
                        laborOverheadCost: x.laborOverheadCost ? formatNumberAsGlobalSettingsModule(x.laborOverheadCost, 2) : '0.00'
                    }
                })
            }
        }
        if (this.UpdateMode) {
            this.reCalculate();
        }
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
            this.workFlow.expertise[this.memoIndex].memo = this.textAreaInfo;
        }
        this.disableEditor = true;
        $("#textarea-popup2").modal("hide");
        // this.disableUpdateButton = false;
    }
    onCloseTextAreaInfo() {
        this.disableEditor = true;
        $("#textarea-popup2").modal("hide");
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
    reCalculate() {
        this.calculateEstimatedHoursSummation();
        this.calculateLabourDirectCost();
        this.calculateOHCostSummation();
        this.calculateLabourOHCostSummation();
    }

    addRow(): void {
        var newRow = Object.assign({}, this.row);
        newRow.workflowExpertiseListId = "0";
        newRow.taskId = this.workFlow.taskId;
        newRow.estimatedHours = "";
        newRow.expertiseTypeId = "";
        newRow.directLaborRate = "";
        newRow.laborDirectRate = "";
        newRow.laborOverheadCost = "";
        newRow.overheadBurden = "";
        newRow.overheadCost = "";
        newRow.standardRate = "";
        newRow.memo = "";
        newRow.isDeleted = false;
        this.workFlow.expertise.push(newRow);
    }


    calculateLabourCost(expertise): void {
        expertise.estimatedHours = expertise.estimatedHours ? formatNumberAsGlobalSettingsModule(expertise.estimatedHours, 2) : '';
        expertise.laborDirectRate = expertise.laborDirectRate ? formatNumberAsGlobalSettingsModule(expertise.laborDirectRate, 2) : '';
        var value = parseFloat(expertise.estimatedHours.toString().replace(/\,/g, '')) * parseFloat(expertise.laborDirectRate.toString().replace(/\,/g, ''));
        if (value > 0) {
            expertise.directLaborRate = formatNumberAsGlobalSettingsModule(value, 2);
        }
        else {
            expertise.directLaborRate = "0.00";
        }
        this.calculateEstimatedHoursSummation();
        this.calculateLabourDirectCost();
    }

    // sum of the estimated Hrs
    calculateEstimatedHoursSummation() {
        this.workFlow.sumofestimatedhrs = this.workFlow.expertise.reduce((acc, x) => {
            return acc + parseFloat(x.estimatedHours === undefined || x.estimatedHours === '' ? 0 : x.estimatedHours.toString().replace(/\,/g, ''))
        }, 0);
        this.workFlow.sumofestimatedhrs = this.workFlow.sumofestimatedhrs ? formatNumberAsGlobalSettingsModule(this.workFlow.sumofestimatedhrs, 2) : '0.00';
    }

    // sum of labour direct cost 
    calculateLabourDirectCost() {
        this.workFlow.sumofLabourDirectCost = this.workFlow.expertise.reduce((acc, x) => {
            return acc + parseFloat(x.directLaborRate === undefined || x.directLaborRate === '' ? 0 : x.directLaborRate.toString().replace(/\,/g, ''))
        }, 0);
        this.workFlow.sumofLabourDirectCost = this.workFlow.sumofLabourDirectCost ? formatNumberAsGlobalSettingsModule(this.workFlow.sumofLabourDirectCost, 2) : '0.00';
    }

    calculateOHCost(expertise): void {
        expertise.overheadBurden = expertise.overheadBurden ? formatNumberAsGlobalSettingsModule(expertise.overheadBurden, 2) : '0.00';
        const percentageCal = (parseFloat(expertise.directLaborRate.toString().replace(/\,/g, '')) * parseFloat(expertise.overheadBurden.toString().replace(/\,/g, ''))) / 100;
        if (percentageCal > 0) {
            expertise.overheadCost = formatNumberAsGlobalSettingsModule(percentageCal, 2);
        }
        else {
            expertise.overheadCost = '0.00';
        }

        this.calculateLabourOHCost(expertise);
        this.calculateOHCostSummation();
    }

    calculateOHCostSummation() {
        this.workFlow.sumOfOHCost = this.workFlow.expertise.reduce((acc, x) => {
            return acc + parseFloat(x.overheadCost === undefined || x.overheadCost === '' ? 0 : x.overheadCost.toString().replace(/\,/g, ''))
        }, 0);

        this.workFlow.sumOfOHCost = formatNumberAsGlobalSettingsModule(this.workFlow.sumOfOHCost, 2);
    }

    // used to calculate the LabourOH cost 
    calculateLabourOHCost(expertise): void {
        expertise.overheadCost = expertise.overheadCost ? formatNumberAsGlobalSettingsModule(expertise.overheadCost, 2) : '0.00';
        const sumOfLabourOHCost = parseFloat(expertise.directLaborRate.toString().replace(/\,/g, '')) + parseFloat(expertise.overheadCost.toString().replace(/\,/g, ''));
        if (sumOfLabourOHCost > 0) {
            expertise.laborOverheadCost = formatNumberAsGlobalSettingsModule(sumOfLabourOHCost, 2);
        }
        else {
            expertise.laborOverheadCost = '0.00';
        }

        this.calculateLabourOHCostSummation();
    }

    calculateLabourOHCostSummation() {
        this.workFlow.totalExpertiseCost = this.workFlow.expertise.reduce((acc, x) => {
            return acc + parseFloat(x.laborOverheadCost === undefined || x.laborOverheadCost === '' ? 0 : x.laborOverheadCost.toString().replace(/\,/g, ''))
        }, 0);

        this.workFlow.totalExpertiseCost = this.workFlow.totalExpertiseCost ? formatNumberAsGlobalSettingsModule(this.workFlow.totalExpertiseCost, 2) : '';
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
        this.expertiseTypes.forEach(element => {
            if(element.employeeExpertiseId==row.expertiseTypeId){
                row.expertiseType=element.label;
            }
        });
      this.deleteRowRecord = row;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    deleteRow(): void {
        if (this.workFlow.expertise[this.deletedRowIndex].workflowExpertiseListId != undefined || this.workFlow.expertise[this.deletedRowIndex].workflowExpertiseListId == "0" || this.workFlow.expertise[this.deletedRowIndex].workflowExpertiseListId == "") {
            this.workFlow.expertise.splice(this.deletedRowIndex, 1);
        }
        else {
            this.workFlow.expertise[this.deletedRowIndex].isDeleted = true;
            this.workFlow.expertise[this.deletedRowIndex].isDeleted = true;
        }
        this.reCalculate();
        this.dismissModel();
    }

    setIsUpdate(value,index){
if(value){
        this.wflwService.getemployeeExpertiseById(value).subscribe(res => {
     if(res){
        this.workFlow.expertise[index].laborDirectRate = res.avglaborrate;
        this.workFlow.expertise[index].overheadBurden = res.overheadburden;
     }
        });
        
    }
    }
    }


    



