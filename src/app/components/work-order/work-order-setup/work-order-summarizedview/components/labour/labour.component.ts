import { Component, OnInit, Input, EventEmitter, OnChanges } from '@angular/core';
import { WorkOrderService } from '../../../../../../services/work-order/work-order.service';
import { WorkOrderLabor, AllTasks} from '../../../../../../models/work-order-labor.modal';
import { getObjectById } from '../../../../../../generic/autocomplete';
import * as $ from 'jquery';
import { AlertService, MessageSeverity } from '../../../../../../services/alert.service';

@Component({
    selector: 'app-labour-wo-summarization',
    templateUrl: 'labour.component.html',
    styleUrls: ['./labour.component.scss']
})

export class LabourComponent implements OnInit, OnChanges {
    @Input() value;
    @Input() type;
    @Input() partNumber;
    gridData: any[] = [];
    fields: any[] = []
    isSpinnerVisible: boolean = false;
    constructor(private workOrderService: WorkOrderService){

    }
    ngOnInit(){
        if(this.value){
            this.value.forEach(
                (x) => {
                    this.gridData.push({'data': x, 'children': {'data': []}});
                }
            )
        }
    }
    ngOnChanges(){
        this.gridData = []
        this.fields = [
            {
                header: 'Task',
                field: 'task'
            },
            {
                header: 'Expertise',
                field: 'expertise'
            },
            {
                header: 'Employee',
                field: 'employee'
            },
            {
                header: 'Billable',
                field: 'billable'
            },
            // {
            //     header: 'AdjustedHours',
            //     field: 'adjustedHours'
            // }
        ]
        if(this.value){
            this.value.forEach(
                (x) => {
                    this.gridData.push({'data': x});
                }
            )
            if(this.gridData[0].data.labourHours == 'Labour Clock In/Out'){
                this.fields.push({
                    header: 'Start Date',
                    field: 'startDate'
                })
                this.fields.push(
                    {
                        header: 'End Date',
                        field: 'endDate'
                    }
                )
            }
            this.fields.push(
                {
                    header: 'AdjustedHours',
                    field: 'adjustedHours'
                }
            )
        }
    }
}