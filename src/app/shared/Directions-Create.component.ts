import { Component, Input, OnInit, OnChanges, EventEmitter, Output } from "@angular/core";
import { IWorkFlow } from "../Workflow/WorkFlow";
import { ActionService } from "../Workflow/ActionService";
import { IDirections } from "../Workflow/Directions";
import { AlertService, MessageSeverity } from "../services/alert.service";

@Component({
    selector: 'grd-directions',
    templateUrl: './Directions-Create.component.html',
    styleUrls: ['./Directions-Create.component.css']
})
export class DirectionsCreateComponent implements OnInit, OnChanges {

    @Input() workFlow: IWorkFlow;
    @Input() UpdateMode: boolean;
    @Output() notify: EventEmitter<IWorkFlow> =
        new EventEmitter<IWorkFlow>();
    errorMessage: string;
    row: any;
    currentPage: number = 1;
    itemsPerPage: number = 10;

    constructor(private alertService: AlertService) {

    }

    ngOnInit(): void {
        this.row = this.workFlow.directions[0];
        if (this.row == undefined) {
            this.row = {};
        }
        this.row.taskId = this.workFlow.taskId;
    }

    ngOnChanges(): void {

    }

    addRow(): void {

        var newRow = Object.assign({}, this.row);
        newRow.workflowDirectionId = "0";
        newRow.taskId = this.workFlow.taskId;
        newRow.workflowDirectionId = "0";
        newRow.action = "";
        newRow.description = "";
        newRow.sequence = "";
        newRow.memo = "";
        newRow.isDelete = false;
        this.workFlow.directions.push(newRow);
    }

    deleteRow(index): void {
        if (this.workFlow.directions[index].workflowDirectionId == "0" || this.workFlow.directions[index].workflowDirectionId == "") {
            this.workFlow.directions.splice(index, 1);
        }
        else {
            this.workFlow.directions[index].isDelete = true;
        }
    }

    checkDuplicateSequence(event, direction: any): void {

        if (this.workFlow.directions != undefined && this.workFlow.directions.length > 0) {
            var duplicate = this.workFlow.directions.filter(d => d.sequence == direction.sequence && direction.taskId == this.workFlow.taskId && d.isDelete != true);
            if (duplicate.length > 1) {
                this.alertService.showMessage('Work Flow', 'Duplicate Sequence are not allowed Direction.', MessageSeverity.error);
                direction.sequence = '';
                event.target.value = '';
            }
        }
    }

}