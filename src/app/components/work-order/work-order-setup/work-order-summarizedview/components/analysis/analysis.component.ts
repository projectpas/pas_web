import { Component, OnInit, Input, EventEmitter, OnChanges } from '@angular/core';
import { WorkOrderService } from '../../../../../../services/work-order/work-order.service';
import { WorkOrderLabor, AllTasks} from '../../../../../../models/work-order-labor.modal';
import { formatNumberAsGlobalSettingsModule } from '../../../../../../generic/autocomplete';
import * as $ from 'jquery';
import { AlertService, MessageSeverity } from '../../../../../../services/alert.service';

@Component({
    selector: 'app-analysis-wo-summarization',
    templateUrl: 'analysis.component.html',
    styleUrls: ['./analysis.component.scss']
})

export class AnalysisComponent implements OnInit, OnChanges {
    @Input() value;
    @Input() type;
    @Input() workOrderId;
    fields: any[];
    gridData: any[] = [];
    constructor(private workOrderService: WorkOrderService){

    }
    ngOnInit(){
        if(this.value){
            this.value.forEach(
                (x) => {
                    this.gridData.push({'data': x});
                }
            )
        }
    }
    ngOnChanges(){
        this.gridData = []
        if(this.value){
            this.value.forEach(
                (x) => {
                    this.gridData.push({'data': x});
                }
            )
        }
        switch(this.type){
            case 'woAnalysis':{
                this.fields = [
                    {
                        header: 'Part Number',
                        field: 'partNumber'
                    },
                    {
                        header: 'Part Description',
                        field: 'partDescription'
                    },
                    {
                        header: 'Revised PN',
                        field: 'revisedPN'
                    },
                    {
                        header: 'Workorder Num',
                        field: 'workOrderNum'
                    },
                    {
                        header: 'Stage',
                        field: 'stage'
                    },
                    {
                        header: 'Status',
                        field: 'status'
                    },
                    {
                        header: 'Customer Name',
                        field: 'customerName'
                    },
                    {
                        header: 'Revenue',
                        field: 'revenue'
                    },
                    {
                        header: 'Material Revenue',
                        field: 'materialRevenue'
                    },
                    {
                        header: 'Material Cost',
                        field: 'materialCost'
                    },
                    {
                        header: 'Material Revenue Percentage',
                        field: 'materialRevenuePercentage'
                    },
                    {
                        header: 'Total Labor Cost',
                        field: 'totalLaborCost'
                    },
                    {
                        header: 'Labor Revenue Percentage',
                        field: 'laborRevenuePercentage'
                    },
                    {
                        header: 'OverHead Cost',
                        field: 'overHeadCost'
                    },
                    {
                        header: 'OverHead Cost Revenue Percentage',
                        field: 'overHeadCostRevenuePercentage'
                    },
                    {
                        header: 'Charges Cost',
                        field: 'chargesCost'
                    },
                    {
                        header: 'Freight Cost',
                        field: 'freightCost'
                    },
                    {
                        header: 'Other Cost',
                        field: 'otherCost'
                    },
                    {
                        header: 'DirectCost',
                        field: 'directCost'
                    },
                    {
                        header: 'Direct Cost Revenue Percentage',
                        field: 'directCostRevenuePercentage'
                    },
                    {
                        header: 'Margin',
                        field: 'margin'
                    },
                    {
                        header: 'Margin Percentage',
                        field: 'marginPercentage'
                    }
                ]
                break;
            }
            case 'quoteAnalysis':{
                this.fields = [
                    {
                        header: 'Part Number',
                        field: 'partNumber'
                    },
                    {
                        header: 'Part Description',
                        field: 'partDescription'
                    },
                    {
                        header: 'Revised PN',
                        field: 'revisedPN'
                    },
                    {
                        header: 'Workorder Num',
                        field: 'workOrderNum'
                    },
                    {
                        header: 'Stage',
                        field: 'stage'
                    },
                    {
                        header: 'Status',
                        field: 'status'
                    },
                    {
                        header: 'Customer Name',
                        field: 'customerName'
                    },
                    {
                        header: 'Revenue',
                        field: 'revenue'
                    },
                    {
                        header: 'Material Revenue',
                        field: 'materialRevenue'
                    },
                    {
                        header: 'Material Cost',
                        field: 'materialCost'
                    },
                    {
                        header: 'Material Revenue Percentage',
                        field: 'materialRevenuePercentage'
                    },
                    {
                        header: 'Total Labor Cost',
                        field: 'totalLaborCost'
                    },
                    {
                        header: 'Labor Cost',
                        field: 'laborCost'
                    },
                    {
                        header: 'Labor Revenue Percentage',
                        field: 'laborRevenuePercentage'
                    },
                    {
                        header: 'OverHead Cost',
                        field: 'overHeadCost'
                    },
                    {
                        header: 'OverHead Cost Revenue Percentage',
                        field: 'overHeadCostRevenuePercentage'
                    },
                    {
                        header: 'Charges Cost',
                        field: 'chargesCost'
                    },
                    {
                        header: 'Freight Cost',
                        field: 'freightCost'
                    },
                    {
                        header: 'Other Cost',
                        field: 'otherCost'
                    },
                    {
                        header: 'DirectCost',
                        field: 'directCost'
                    },
                    {
                        header: 'Direct Cost Revenue Percentage',
                        field: 'directCostRevenuePercentage'
                    },
                    {
                        header: 'Margin',
                        field: 'margin'
                    },
                    {
                        header: 'Margin Percentage',
                        field: 'marginPercentage'
                    }
                ]
                break;
            }
            case 'labourAnalysis':{
                this.fields = [
                    {
                        header: 'Part Number',
                        field: 'partNumber'
                    },
                    {
                        header: 'Part Description',
                        field: 'partDescription'
                    },
                    {
                        header: 'Revised PN',
                        field: 'revisedPN'
                    },
                    {
                        header: 'Workorder Num',
                        field: 'workOrderNum'
                    },
                    {
                        header: 'Stage',
                        field: 'stage'
                    },
                    {
                        header: 'Status',
                        field: 'status'
                    },
                    {
                        header: 'Customer',
                        field: 'customer'
                    },
                    {
                        header: 'Action',
                        field: 'action'
                    },
                    {
                        header: 'Expertise',
                        field: 'expertise'
                    },
                    {
                        header: 'Hours',
                        field: 'hours'
                    }
                ]
                break;
            }
            case 'billingAndInvoice': {
                this.fields = [
                    {
                        header: 'Part Number',
                        field: 'partNumber'
                    },
                    {
                        header: 'Part Description',
                        field: 'partDescription'
                    },
                    {
                        header: 'SN',
                        field: 'serialNumber'
                    },
                    {
                        header: 'Item Group',
                        field: 'itemGroup'
                    },
                    {
                        header: 'Stage',
                        field: 'stage'
                    },
                    {
                        header: 'Status',
                        field: 'mpnStatus'
                    },
                    {
                        header: 'Work Order Num',
                        field: 'workOrderNum'
                    },
                    {
                        header: 'Revenue',
                        field: 'revenue'
                    },
                    {
                        header: 'Notes',
                        field: 'notes'
                    } 
                ]
                break;
            }
        }
    }

    getDate(date){
        if(date != 'Various' && date != '' && date){
            let newDate = new Date(date);
            return `${newDate.getDate()}/${newDate.getMonth()}/${newDate.getFullYear()}`
        }
        return date;
    }

    globalizeAmount(data, field){
        if(data && (field == 'adjustedHours' || field == 'hours' || field == 'directCost' || field == 'directCostRevenuePercentage' || field == 'freightCost' || field == 'chargesCost' || field == 'laborCost' || field == 'laborRevenuePercentage' || field == 'margin' || field == 'marginPercentage' || field == 'materialCost' || field == 'materialRevenue' || field == 'materialRevenuePercentage' || field == 'otherCost' || field == 'overHeadCost' || field == 'overHeadCostRevenuePercentage' || field == 'revenue' || field == 'totalLaborCost' || field == 'margin' || field == 'marginPercentage')){
            return formatNumberAsGlobalSettingsModule(data, '0')+'.00'
        }
        return data;
    }

}