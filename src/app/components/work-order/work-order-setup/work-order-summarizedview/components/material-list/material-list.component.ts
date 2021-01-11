import { Component, OnInit, Input, EventEmitter, OnChanges } from '@angular/core';
import { WorkOrderService } from '../../../../../../services/work-order/work-order.service';
import { WorkOrderLabor, AllTasks} from '../../../../../../models/work-order-labor.modal';
import { getObjectById } from '../../../../../../generic/autocomplete';
declare var $ : any;
import { AlertService, MessageSeverity } from '../../../../../../services/alert.service';

@Component({
    selector: 'app-materiallist-wo-summarization',
    templateUrl: 'material-list.component.html',
    styleUrls: ['./material-list.component.scss']
})

export class MaterialListSummarisedComponent implements OnInit, OnChanges {
    @Input() value;
    gridData: any[] = [];
    isSpinnerVisible: boolean = false;
    isOpenedAll: boolean = false;
    constructor(private workOrderService: WorkOrderService){

    }
    ngOnChanges(){
        this.gridData = []
        if(this.value){
            this.value.forEach(
                (x) => {
                    if(x.workFlowWorkOrderId){
                        this.gridData.push({'data': x, 'children': [{'data': []}]});
                    }
                    else{
                        this.gridData.push({'data': x});
                    }
                }
            )
        }
        console.log(this.gridData);
    }
    ngOnInit(){

    }

    getMateialListData(node){
        if(node.data.workOrderMaterialsId){
            this.isSpinnerVisible = true;
            this.workOrderService.getWorkOrderRolMaterialList(node.data.workOrderMaterialsId)
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
        else if(node.data.workFlowWorkOrderId){
            this.isSpinnerVisible = true;
            this.workOrderService.getMateialListDetailsForSummarisedData(node.data.workFlowWorkOrderId)
            .subscribe(
                (res: any [])=> {
                    this.isSpinnerVisible = false;
                    node['children'] = []
                    res.forEach((x=>{
                        if(x.workOrderMaterialsId){
                            node['children'].push({"data": x, 'children': [{'data': []}]})
                        }
                        else{
                            node['children'].push({"data": x});
                        }
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
    }

    detailView(){
        this.isOpenedAll = !this.isOpenedAll;
        this.gridData.forEach(
            (x)=>{
                if(x.data.workFlowWorkOrderId != 0 && this.isOpenedAll){
                    x.expanded = true;
                    this.openSubPart(x);
                }
                else{
                    x.expanded = false;
                    this.gridData = [...this.gridData]
                }
            }
        )
    }

    openAll(node){
        if(node.data.workOrderMaterialsId){
            this.isSpinnerVisible = true;
            this.workOrderService.getWorkOrderRolMaterialList(node.data.workOrderMaterialsId)
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
        else if(node.data.workFlowWorkOrderId){
            
        }
    }

    openSubPart(node){
        this.isSpinnerVisible = true;
        this.workOrderService.getMateialListDetailsForSummarisedData(node.data.workFlowWorkOrderId)
        .subscribe(
            (res: any [])=> {
                this.isSpinnerVisible = false;
                node['children'] = []
                res.forEach((x=>{
                    if(x.workOrderMaterialsId){
                        node['children'].push({"data": x, 'children': [{'data': []}]})
                        this.openAll(node);
                    }
                    else{
                        node['children'].push({"data": x});
                    }
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
}