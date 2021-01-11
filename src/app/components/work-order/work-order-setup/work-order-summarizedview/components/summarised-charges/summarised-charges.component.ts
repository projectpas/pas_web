import { Component, OnInit, Input, EventEmitter, OnChanges } from '@angular/core';
import { WorkOrderService } from '../../../../../../services/work-order/work-order.service';
import { WorkOrderLabor, AllTasks} from '../../../../../../models/work-order-labor.modal';
import { formatNumberAsGlobalSettingsModule } from '../../../../../../generic/autocomplete';
declare var $ : any;
import { AlertService, MessageSeverity } from '../../../../../../services/alert.service';

@Component({
    selector: 'app-charges-wo-summarization',
    templateUrl: 'summarised-charges.component.html',
    styleUrls: ['./summarised-charges.component.scss']
})

export class SummarizedChargesComponent implements OnInit, OnChanges {
    @Input() value;
    gridData: any[] = [];
    isOpenedAll: boolean = false;
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
        if(this.value){
            this.value.forEach(
                (x) => {
                    if(x.workFlowWorkOrderId != 0){
                        this.gridData.push({'data': x, 'children': [{'data': []}]});
                    }
                    else{
                        this.gridData.push({'data': x});
                    }
                }
            )
        }
        this.gridData = [...this.gridData];
    }

    getShippingData(node){
        this.isSpinnerVisible = true;
        this.workOrderService.getChargesDataForSummarisedView(node.data.workFlowWorkOrderId)
        .subscribe(
            (res: any [])=> {
                this.isSpinnerVisible = false;
                node['children'] = []
                res.forEach((x=>{
                    node['children'].push({"data": x})
                }))
                if(!res || res.length == 0){
                    node['children'] = [{'data': []}]
                }
                this.gridData = [...this.gridData];
            },
            err => {
                this.isSpinnerVisible = false;
                node['children'] = [{'data': []}]
                this.gridData = [...this.gridData];
            }
        )
    }

    globalizeAmount(data){
        return formatNumberAsGlobalSettingsModule(data, '0')+'.00';
    }

    detailView(){
        this.isOpenedAll = !this.isOpenedAll;
        this.gridData.forEach(
            (x)=>{
                if(x.data.workFlowWorkOrderId != 0 && this.isOpenedAll){
                    x.expanded = true;
                    this.getShippingData(x);
                }
                else{
                    x.expanded = false;
                    this.gridData = [...this.gridData]
                }
            }
        )
    }

}