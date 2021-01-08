import { Component, Input, OnChanges, OnInit, EventEmitter, Output } from "@angular/core";
import { IWorkFlow } from "../Workflow/WorkFlow";
import { IMeasurement } from "../Workflow/Measurement";
import { ItemMasterService } from "../services/itemMaster.service";
import { ActionService } from "../Workflow/ActionService";
import { ActivatedRoute, Router } from "@angular/router";
import { EmployeeExpertiseService } from "../services/employeeexpertise.service";
import { ItemClassificationService } from "../services/item-classfication.service";
import { UnitOfMeasureService } from "../services/unitofmeasure.service";
import { ConditionService } from "../services/condition.service";
import { VendorService } from "../services/vendor.service";
import { AlertService, MessageSeverity } from "../services/alert.service";

@Component({
    selector: 'grd-measurement',
    templateUrl: './Measurement-Create.component.html',
    styleUrls: ['./Measurement-Create.component.css']
})
export class MeasurementCreateComponent implements OnInit, OnChanges {
    allPartnumbersInfo: any[] = [];
    itemclaColl: any[];
    partCollection: any[];
    @Input() workFlow: IWorkFlow;
    @Input() UpdateMode: boolean;
    @Output() notify: EventEmitter<IWorkFlow> =
        new EventEmitter<IWorkFlow>();
    row: any;
    currentPage: number = 1;
    itemsPerPage: number = 10;

    constructor(private actionService: ActionService, private route: ActivatedRoute, private router: Router, private expertiseService: EmployeeExpertiseService, public itemClassService: ItemClassificationService, public unitofmeasureService: UnitOfMeasureService, private conditionService: ConditionService, private itemser: ItemMasterService, private vendorService: VendorService, private alertService: AlertService) {
    }

    ngOnInit(): void {
        this.row = this.workFlow.measurements[0];
        if (this.row == undefined) {
            this.row = {};
        }
        this.row.taskId = this.workFlow.taskId;
        this.ptnumberlistdata();
    }

    ngOnChanges(): void {

    }

    addRow(): void {
        var newRow = Object.assign({}, this.row);
        newRow.workflowMeasurementId = "0";
        newRow.taskId = this.workFlow.taskId;
        newRow.partNumber = "";
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

    deleteRow(index): void {

        if (this.workFlow.measurements[index].workflowMeasurementId == "0" || this.workFlow.measurements[index].workflowMeasurementId == "") {
            this.workFlow.measurements.splice(index, 1);
        }
        else {
            this.workFlow.measurements[index].isDelete = true;
        }
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
            if (this.itemclaColl) {
                for (let i = 0; i < this.itemclaColl.length; i++) {
                    if (event == this.itemclaColl[i][0].partName) {
                        measurement.partNumber = this.itemclaColl[i][0].partId;
                        measurement.partDescription = this.itemclaColl[i][0].partName;
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

                for (let i = 0; i < this.allPartnumbersInfo.length; i++) {
                    let partName = this.allPartnumbersInfo[i].partNumber;
                    if (partName) {
                        if (partName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                            this.itemclaColl.push([{
                                "partId": this.allPartnumbersInfo[i].itemMasterId,
                                "partName": partName,
                                "description": this.allPartnumbersInfo[i].partDescription
                            }]);

                            this.partCollection.push(partName);
                        }
                    }
                }
            }
        }
    }

    private ptnumberlistdata() {
        this.itemser.getPartDetailsDropdown().subscribe(
            results => {
                this.allPartnumbersInfo = results;
            }
        );
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
}