import { Component, OnInit, Input, EventEmitter, OnChanges } from '@angular/core';
import { WorkOrderService } from '../../../../../../services/work-order/work-order.service';
import { WorkOrderLabor, AllTasks} from '../../../../../../models/work-order-labor.modal';
import { formatNumberAsGlobalSettingsModule } from '../../../../../../generic/autocomplete';
declare var $ : any;
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
            // this.value.forEach(
            //     (x) => {
            //         this.gridData.push({'data': x});
            //     }
            // )
            this.gridData=  this.value.map(x => {
                return {'data': x}
            })
        }
    }
    ngOnChanges(){
        this.gridData = []
        if(this.value){
            // this.value.forEach(
            //     (x) => {
            //         this.gridData.push({'data': x});
            //     }
            // )
            this.gridData=  this.value.map(x => {
                return {'data': x}
            })
        }
        switch(this.type){
            case 'woAnalysis':{
                this.fields = [
                { field: 'partNumber', header: 'Part Number',width:"120px" },
                { field: 'revisedPartNo', header: 'Revised PN',width:"100px" },
                { field: 'partDescription', header: 'PN Description',width:"250px" },
                { field: 'workOrderNum', header: 'WO Num',width:"100px" },
                { field: 'stage', header: 'Stage',width:"100px" },
                { field: 'revenue', header: 'Revenue',width:"100px" },
                { field: 'materialCost', header: 'Parts Cost' ,width:"100px"},
                { field: 'materialRevenuePercentage', header: 'Parts Rev %' ,width:"100px"},
                { field: 'laborCost', header: 'Labor Cost',width:"100px" },
                { field: 'laborRevenuePercentage', header: 'Labor Rev %',width:"100px" },
                { field: 'overHeadCost', header: 'Overhead Cost',width:"110px" },
                { field: 'overHeadCostRevenuePercentage', header: 'Overhead Cost %' ,width:"130px"},
                { field: 'otherCost', header: 'Other Cost',width:"100px" },
                { field: 'freightCost', header: 'Freight Cost',width:"100px" },
                { field: 'directCost', header: 'Direct Cost',width:"100px" },
                { field: 'directCostRevenuePercentage', header: 'Direct Cost Rev %',width:"120px" },
                { field: 'margin', header: 'Margin',width:"100px" },
                { field: 'marginPercentage', header: 'Margin %',width:"100px" },
                { field: 'customerName', header: 'Customer',width:"120px" },
                { field: 'status', header: 'Status',width:"100px" }
            ]
                // this.fields = [
                //     {
                //         header: 'Part Number',
                //         field: 'partNumber'
                //     },
                //     {
                //         header: 'Part Description',
                //         field: 'partDescription'
                //     },
                //     {
                //         header: 'Revised PN',
                //         field: 'revisedPN'
                //     },
                //     {
                //         header: 'Workorder Num',
                //         field: 'workOrderNum'
                //     },
                //     {
                //         header: 'Stage',
                //         field: 'stage'
                //     },
                //     {
                //         header: 'Status',
                //         field: 'status',
                //         width:"60px"
                //     },
                //     {
                //         header: 'Customer Name',
                //         field: 'customerName'
                //     },
                //     {
                //         header: 'Revenue',
                //         field: 'revenue',
                //         width:"60px"
                //     },
                //     {
                //         header: 'Material Revenue',
                //         field: 'materialRevenue',
                //         width:"100px"
                //     },
                //     {
                //         header: 'Material Cost',
                //         field: 'materialCost',
                //         width:"70px",
                //     },
                //     {
                //         header: 'Material Revenue Percentage',
                //         field: 'materialRevenuePercentage'
                //     },
                //     {
                //         header: 'Total Labor Cost',
                //         field: 'totalLaborCost',
                //         width:"70px"
                //     },
                //     {
                //         header: 'Labor Revenue Percentage',
                //         field: 'laborRevenuePercentage'
                //     },
                //     {
                //         header: 'OverHead Cost',
                //         field: 'overHeadCost',
                //         width:"80px"
                //     },
                //     {
                //         header: 'OverHead Cost Revenue Percentage',
                //         field: 'overHeadCostRevenuePercentage'
                //     },
                //     {
                //         header: 'Charges Cost',
                //         field: 'chargesCost',
                //         width:"70px"
                //     },
                //     {
                //         header: 'Freight Cost',
                //         field: 'freightCost',
                //         width:"70px"
                //     },
                //     {
                //         header: 'Other Cost',
                //         field: 'otherCost',
                //         width:"70px"
                //     },
                //     {
                //         header: 'DirectCost',
                //         field: 'directCost',
                //         width:"70px"
                //     },
                //     {
                //         header: 'Direct Cost Revenue Percentage',
                //         field: 'directCostRevenuePercentage'
                //     },
                //     {
                //         header: 'Margin',
                //         field: 'margin',
                //         width:"70px"
                //     },
                //     {
                //         header: 'Margin Percentage',
                //         field: 'marginPercentage'
                //     }
                // ] 
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
                        header: 'Cust Name',
                        field: 'customerName'
                    },
                    {
                        header: 'Revenue',
                        field: 'revenue',
                        width:"70px"
                    },
                    {
                        header: 'Material Revenue',
                        field: 'materialRevenue'
                    },
                    {
                        header: 'Material Cost',
                        field: 'materialCost',
                        width:"80px"
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
                        field: 'chargesCost',
                        width:"70px"
                    },
                    {
                        header: 'Freight Cost',
                        field: 'freightCost',
                        width:"70px"
                    },
                    {
                        header: 'Other Cost',
                        field: 'otherCost',
                        width:"70px"
                    },
                    {
                        header: 'DirectCost',
                        field: 'directCost',
                        width:"70px" 
                    },
                    {
                        header: 'Direct Cost Rev Percentage',
                        field: 'directCostRevenuePercentage'
                    },
                    {
                        header: 'Margin',
                        field: 'margin',
                        width:"70px"
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
                        header: 'WO Num',
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
        if(data && (field == 'adjustedHours' || field =='directCostRevenuePercentage' || field == 'hours' || field == 'directCost' || field == 'directCostRevenuePercentage' || field == 'freightCost' || field == 'chargesCost' || field == 'laborCost' || field == 'laborRevenuePercentage' || field == 'margin' || field == 'marginPercentage' || field == 'materialCost' || field == 'materialRevenue' || field == 'materialRevenuePercentage' || field == 'otherCost' || field == 'overHeadCost' || field == 'overHeadCostRevenuePercentage' || field == 'revenue' || field == 'totalLaborCost' || field == 'margin' || field == 'marginPercentage')){
            return formatNumberAsGlobalSettingsModule(data, '0')+'.00'
        }
        return data;
    }

}