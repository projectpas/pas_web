import { Component, OnInit, Input, EventEmitter, OnChanges } from '@angular/core';
import { WorkOrderService } from '../../../../../../services/work-order/work-order.service';
import { WorkOrderLabor, AllTasks} from '../../../../../../models/work-order-labor.modal';
import { getObjectById } from '../../../../../../generic/autocomplete';
declare var $ : any;
import { AlertService, MessageSeverity } from '../../../../../../services/alert.service';

@Component({
    selector: 'app-shipping-wo-summarization',
    templateUrl: 'shipping.component.html',
    styleUrls: ['./shipping.component.scss']
})

export class SummarizedShippingComponent implements OnInit, OnChanges {
    @Input() value;
    gridData: any[] = [];
    isOpenedAll: boolean = false;
    isSpinnerVisible: boolean = false;
    constructor(private workOrderService: WorkOrderService){

    }

    ngOnInit(){
    }
    ngOnChanges(){
        this.gridData = []
        if(this.value){
            this.value.forEach(
                (x) => {
                    if(x.workOrderShippingId != 0){
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
        this.workOrderService.getShippingData(node.data.workOrderShippingId)
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

    detailView(){
        this.isOpenedAll = !this.isOpenedAll;
        this.gridData.forEach(
            (x)=>{
                if(x.data.workOrderShippingId != 0 && this.isOpenedAll){
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