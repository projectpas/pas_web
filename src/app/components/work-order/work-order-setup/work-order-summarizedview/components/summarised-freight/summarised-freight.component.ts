import { Component, OnInit, Input, EventEmitter, OnChanges } from '@angular/core';
import { WorkOrderService } from '../../../../../../services/work-order/work-order.service';
import { WorkOrderLabor, AllTasks} from '../../../../../../models/work-order-labor.modal';
import { getObjectById } from '../../../../../../generic/autocomplete';
declare var $ : any;
import { AlertService, MessageSeverity } from '../../../../../../services/alert.service';
import { formatNumberAsGlobalSettingsModule } from '../../../../../../generic/autocomplete';
import { AuthService } from '../../../../../../services/auth.service';

@Component({
    selector: 'app-freight-wo-summarization',
    templateUrl: 'summarised-freight.component.html',
    styleUrls: ['./summarised-freight.component.scss']
})

export class SummarizedFreightComponent implements OnInit, OnChanges {
    @Input() value;
    @Input() workOrderId
    gridData: any[] = [];
    isOpenedAll: boolean = false;
    isSpinnerVisible: boolean = false;
    workOrderFreightList:any=[];
    freightsListHeader = [
        {"header": "", "field": "plus",width:"30px"},
        {
            "header": "MPN",
            "field": "partNumber"
        },
        {
            "header": "Revised Part No",
            "field": "revisedPartNo"
        },
        {
            "header": "Part Description",
            "field": "partDescription"
        },
        {
            "header": "Ship Via",
            "field": "shipVia"
        },
        // {
        //     "header": "Dimention",
        //     "field": "dimention"
        // },
        // {
        //     "header": "Weight",
        //     "field": "weight"
        // },
        // {
        //     "header": "Memo",
        //     "field": "memo"
        // },
        {
            "header": "Amount",
            "field": "amount"
        }
    ];
    constructor(private workOrderService: WorkOrderService, private authService: AuthService){

    }
    ngOnInit(){
        if(this.value){
            this.value.forEach(
                (x) => {
                    if(x.workFlowWorkOrderId != 0){
                        this.gridData.push({'data': x, 'children': {'data': []}});
                    }
                    else{
                        this.gridData.push({'data': x});
                    }
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
        this.workOrderService.getFreightsDataForSummarisedView(node.data.workFlowWorkOrderId)
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

    globalizeAmount(data, field){
        if(data && (field == 'amount')){
            let result = formatNumberAsGlobalSettingsModule(data, '0')
            return result+".00"
        }
        else{
            return data;
        }
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
    getMaterialListData(materialMPN){
        this.workOrderFreightList=[];
            this.isSpinnerVisible = true;
            this.value.forEach(element => {
                element.isShowPlus=true;
            });
            materialMPN.isShowPlus=false;
            this.workOrderService.getWorkOrderFrieghtsList(materialMPN.workFlowWorkOrderId, this.workOrderId, false, 0,false,this.authService.currentUser.masterCompanyId).subscribe(res => {
                this.isSpinnerVisible = false;
                this.workOrderFreightList = res; 
            })
    }
    handelPlus(materialMPN){
        materialMPN.isShowPlus=true;
    }
    // get currentUserMasterCompanyId(): number {
    //     return this.authService.currentUser ? this.authService.currentUser.masterCompanyId : null;
    // }
}