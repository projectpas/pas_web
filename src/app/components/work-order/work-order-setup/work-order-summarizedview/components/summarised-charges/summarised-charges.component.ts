import { Component, OnInit, Input, EventEmitter, OnChanges } from '@angular/core';
import { WorkOrderService } from '../../../../../../services/work-order/work-order.service';
import { WorkOrderLabor, AllTasks} from '../../../../../../models/work-order-labor.modal';
import { formatNumberAsGlobalSettingsModule } from '../../../../../../generic/autocomplete';
declare var $ : any;
import { AlertService, MessageSeverity } from '../../../../../../services/alert.service';
import { AuthService } from '../../../../../../services/auth.service';

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
    @Input() workOrderId
    chargesListHeader = [
        {"header": "", "field": "plus",width:"30px"},
        {
            "header": "MPN",
            "field": "partNumber",
            width:"180px"
        },
        {
            "header": "Revised Part No",
            "field": "revisedPartNo"
        },
        {
            "header": "Part Description",
            "field": "partDescription",
            width:"250px"
        },
        {
            "header": "Item",
            "field": "chargeType"
        },
        {
            "header": "Vendor",
            "field": "vendor"
        },
        {
            "header": "QTY",
            "field": "quantity"
        },
        {
            "header": "RO Num",
            "field": "roNum"
        },
        {
            "header": "Ref Num",
            "field": "refNum"
        },
        {
            "header": "Invoice Num",
            "field": "invoiceNum"
        },
        // {
        //     "header": "Amount",
        //     "field": "unitPrice"
        // }
        {
            "header": "Unit Cost",
            "field": "unitCost"
        },
        {
            "header": "Extended Cost",
            "field": "extendedCost"
        }
    ]
    constructor(private workOrderService: WorkOrderService, private authService: AuthService){

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
    workOrderChargesList:any=[];
 


    getMaterialListData(materialMPN){
        this.workOrderChargesList=[];
        this.isSpinnerVisible = true;
        this.value.forEach(element => {
            element.isShowPlus=true;
        });
        materialMPN.isShowPlus=false;
                this.isSpinnerVisible = true;
                this.workOrderService.getWorkOrderChargesList(materialMPN.workFlowWorkOrderId, this.workOrderId,false,this.authService.currentUser.masterCompanyId).subscribe(res => {
                    this.isSpinnerVisible = false;

                    for (let charge in res) {
                        res[charge]['unitCost'] = res[charge]['unitCost'] ? formatNumberAsGlobalSettingsModule(res[charge]['unitCost'], 2) : '0.00';
                        res[charge]['extendedCost'] = res[charge]['extendedCost'] ? formatNumberAsGlobalSettingsModule(res[charge]['extendedCost'], 2) : '0.00';
                        res[charge]['unitPrice'] = res[charge]['unitPrice'] ? formatNumberAsGlobalSettingsModule(res[charge]['unitPrice'], 2) : '0.00';
                        res[charge]['extendedPrice'] = res[charge]['extendedPrice'] ? formatNumberAsGlobalSettingsModule(res[charge]['extendedPrice'], 2) : '0.00';
                    }
                    this.workOrderChargesList = res; 
                },
                    err => { 
                    })  
    }
    handelPlus(materialMPN){
        materialMPN.isShowPlus=true;
    }
}