import { Component, Input, OnChanges, OnInit, EventEmitter, Output } from "@angular/core";
import { IWorkFlow } from "../Workflow/WorkFlow";
import { ItemMasterService } from "../services/itemMaster.service";
import { ActivatedRoute, Router } from "@angular/router";
import { EmployeeExpertiseService } from "../services/employeeexpertise.service";
import { ItemClassificationService } from "../services/item-classfication.service";
import { UnitOfMeasureService } from "../services/unitofmeasure.service";
import { ConditionService } from "../services/condition.service";
import { VendorService } from "../services/vendor.service";
import { AlertService, MessageSeverity } from "../services/alert.service";
import { CommonService } from "../services/common.service";
declare var $ : any;
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap'; 

@Component({ 
    selector: 'grd-measurement',
    templateUrl: './Measurement-Create.component.html',
    styleUrls: ['./Measurement-Create.component.css']
})

export class MeasurementCreateComponent implements OnInit, OnChanges {
    allPartnumbersInfo: any[] = [];
    itemclaColl: any[];
    partCollection: any[];
    @Input() workFlow:any={};
    @Input() UpdateMode: boolean;
    @Output() notify: EventEmitter<IWorkFlow> = new EventEmitter<IWorkFlow>();
    row: any;
    currentPage: number = 1;
    itemsPerPage: number = 10;
    isSpinnerVisible = false;
    memoIndex;
    textAreaInfo: any;    
    modal: NgbModalRef;
    deleteRowRecord:any={};
    deletedRowIndex:any;

    constructor(private commonService: CommonService,   private modalService: NgbModal, private route: ActivatedRoute, private router: Router, private expertiseService: EmployeeExpertiseService, public itemClassService: ItemClassificationService, public unitofmeasureService: UnitOfMeasureService, private conditionService: ConditionService, private itemser: ItemMasterService, private vendorService: VendorService, private alertService: AlertService) {
    }

    ngOnInit(): void {
        this.row = this.workFlow.measurements[0];
        if (this.row == undefined) {
            this.row = {};
        }
        this.row.taskId = this.workFlow.taskId;
        if(this.workFlow.measurements && this.workFlow.measurements.length !=0){
            this.workFlow.measurements.map((x, index) => {
                    this.workFlow.measurements[index].partName=x; 
            })
        }
    }

    ngOnChanges(): void {
    }

    addRow(): void {
        var newRow = Object.assign({}, this.row);
        newRow.workflowMeasurementId = "0";
        newRow.taskId = this.workFlow.taskId;
        newRow.partNumber = "";
        newRow.partName="";
        newRow.partDescription = "";
        newRow.sequence = "";
        newRow.stage = "";
        newRow.min = "";
        newRow.max = "";
        newRow.expected = "";
        newRow.memo = "";
        newRow.diagramURL = "";
        newRow.isDelete = false;
        this.workFlow.measurements.push(newRow);
    }

    onPartSelect(event, measurement) {
        var anyMeasurement = this.workFlow.measurements.filter(measurement =>
            measurement.taskId == this.workFlow.taskId && measurement.partDescription == event);

        if (anyMeasurement.length > 1) {
  
            measurement.partNumber = "";
            measurement.partDescription = "";
            event = "";
            this.alertService.showMessage("Workflow", "PN in measurement is already in use", MessageSeverity.error);
            return;
        }
        else {
            // if (this.itemclaColl) {
            //     for (let i = 0; i < this.itemclaColl.length; i++) {
            //         if (event == this.itemclaColl[i].partName) {
            //             measurement.partNumber = this.itemclaColl[i].partId;
            //             measurement.partDescription = this.itemclaColl[i].partDescription;
            //         }
            //     };
            // }
            measurement.itemMasterId = event.partId;
            measurement.partNumber = event.partNumber;
                        measurement.partDescription = event.partDescription;
        }
    } 

    loapartItems(strvalue = '', initialCall = false) {
        this.isSpinnerVisible = true;
        let measurementIds = [];
        if (this.UpdateMode) {
            measurementIds = this.workFlow.measurements.reduce((acc, x) => {
                return measurementIds.push(acc.partId);
            }, 0)
        }
        this.commonService.autoCompleteSmartDropDownItemMasterList(strvalue, true, 20, measurementIds)
            .subscribe(res => {
                this.isSpinnerVisible = false;
                this.partCollection = res.map(x => {
                    return {
                        ...x,
                        partId: x.value,
                        partDescription: x.partDescription,
                        partNumber: x.label,
                        partName: x.label
                    }
                });
                this.partCollection.forEach(element => {
             if(element.partId==this.workFlow.itemMasterId){
                this.partCollection.splice(element, 1); 
             }
            });
                this.itemclaColl = this.partCollection;
            }, error => {
                this.isSpinnerVisible = false;
            });
    }

    filterpartItems(event) {
        if (event.query !== undefined && event.query !== null) {
            this.loapartItems(event.query);
        }
    }

    private ptnumberlistdata() {
        this.isSpinnerVisible = true;
        this.itemser.getPartDetailsDropdown().subscribe(
            results => {
                this.isSpinnerVisible = false;
                this.allPartnumbersInfo = results;
            }, error => {
                this.isSpinnerVisible = false;
            });
    }

    checkDuplicateSequence(event, measurements: any): void {
        if (this.workFlow.measurements != undefined && this.workFlow.measurements.length > 0) {
            var duplicate = this.workFlow.measurements.filter(d => d.sequence == measurements.sequence && measurements.taskId == this.workFlow.taskId);
            if (duplicate.length > 1) {
                this.alertService.showMessage('Work Flow', 'Duplicate Sequence are not allowed Measurement.', MessageSeverity.error);
                measurements.sequence = '';
                event.target.value = '';
            }
        }
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

    onAddTextAreaInfo(material, index) {
        this.memoIndex = index;
        this.textAreaInfo = material.memo;
        $("#textareapopupMemo").modal("show");
    }

    onSaveTextAreaInfo(memo) {
        if (memo) {
            this.textAreaInfo = memo;
            this.workFlow.measurements[this.memoIndex].memo = this.textAreaInfo;
        }
        $("#textareapopupMemo").modal("hide");
    }

    onCloseTextAreaInfo() {
        $("#textareapopupMemo").modal("hide");
    }
    validateMaxMin(event,measurement){
       if(measurement && measurement.min && measurement.max){
        if(measurement.min > measurement.max){
            measurement.max="";
            this.alertService.showMessage('Work Flow', 'Enter maximum Value.', MessageSeverity.error);
        }
       }
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
        if (this.workFlow.measurements[this.deletedRowIndex].workflowMeasurementId == "0" || this.workFlow.measurements[this.deletedRowIndex].workflowMeasurementId == undefined || this.workFlow.measurements[this.deletedRowIndex].workflowMeasurementId == "") {
            this.workFlow.measurements.splice(this.deletedRowIndex, 1);
        }
        else {
            this.workFlow.measurements[this.deletedRowIndex].isDeleted = true;
        }
        this.dismissModel();
    }
}