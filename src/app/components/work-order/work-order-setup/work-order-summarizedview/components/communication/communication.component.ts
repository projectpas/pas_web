import { Component, OnInit, Input, EventEmitter, OnChanges } from '@angular/core';
import { WorkOrderService } from '../../../../../../services/work-order/work-order.service';
import { WorkOrderLabor, AllTasks} from '../../../../../../models/work-order-labor.modal';
import { formatNumberAsGlobalSettingsModule } from '../../../../../../generic/autocomplete';
declare var $ : any;
import { AlertService, MessageSeverity } from '../../../../../../services/alert.service';

@Component({
    selector: 'app-communication-wo-summarization',
    templateUrl: 'communication.component.html',
    styleUrls: ['./communication.component.scss']
})

export class CommunicationComponent implements OnInit, OnChanges {
    @Input() value;
    @Input() type;
    @Input() workOrderId;
    fields: any[];
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
                    if(x.workOrderPartNo && x.workOrderPartNo != 0){
                        this.gridData.push({'data': x, 'children': [{'data': []}]});
                    }
                    else{
                        this.gridData.push({'data': x});
                    }
                }
            )
        }
        switch(this.type){
            case 'memo':{
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
                        header: 'Memo',
                        field: 'memo'
                    }
                ]
                break;
            }
            case 'email':{
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
                        header: 'Email Type',
                        field: 'emailType'
                    },
                    {
                        header: 'Subject',
                        field: 'subject'
                    },
                    {
                        header: 'Email Body',
                        field: 'emailBody'
                    },
                    {
                        header: 'Contact By',
                        field: 'contactBy'
                    },
                    {
                        header: 'Contact Date',
                        field: 'contactDate'
                    }
                ]
                break;
            }
            case 'phone':{
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
                        header: 'Phone',
                        field: 'phone'
                    },
                    {
                        header: 'Memo',
                        field: 'memo'
                    },
                    {
                        header: 'Contact By',
                        field: 'contactBy'
                    },
                    {
                        header: 'Contact Date',
                        field: 'contactDate'
                    }
                ]
                break;
            }
            case 'text':{
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
                        header: 'Mobile',
                        field: 'mobile'
                    },
                    {
                        header: 'Notes',
                        field: 'notes'
                    },
                    {
                        header: 'Contact By',
                        field: 'contactBy'
                    },
                    {
                        header: 'Contact Date',
                        field: 'contactDate'
                    }
                ]
                break;
            }
        }
    }

    getShippingData(node){
        this.isSpinnerVisible = true;
        let method = (this.type == 'memo')?'getCommunicationMemoForSummarisedView':(this.type == 'email')?'getCommunicationMailForSummarisedView':(this.type == 'phone')?'getCommunicationPhoneForSummarisedView':'getCommunicationTextForSummarisedView';
        this.workOrderService[method](this.workOrderId, node.data.workOrderPartNo)
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

    getDate(date){
        if(date != 'Various' && date != '' && date){
            let newDate = new Date(date);
            return `${newDate.getDate()}/${newDate.getMonth()}/${newDate.getFullYear()}`
        }
        return date;
    }

    globalizeAmount(data){
        if(data){
            return formatNumberAsGlobalSettingsModule(data, '0.00')
        }
    }

    detailView(){
        this.isOpenedAll = !this.isOpenedAll;
        this.gridData.forEach(
            (x)=>{
                if(x.data.workOrderPartNo != 0 && this.isOpenedAll){
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