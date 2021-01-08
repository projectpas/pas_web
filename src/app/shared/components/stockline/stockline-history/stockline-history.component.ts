import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { fadeInOut } from '../../../../services/animations';
import { CustomerService } from '../../../../services/customer.service';
import { CommonService } from '../../../../services/common.service';
import { StocklineService } from '../../../../services/stockline.service';
import { NgbModal, NgbActiveModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import * as $ from 'jquery';



@Component({
    selector: 'app-stockline-history',
    templateUrl: './stockline-history.component.html',
    styleUrls: ['./stockline-history.component.scss'],
    animations: [fadeInOut]
})

export class StocklineHistoryComponent implements OnInit {

    @Input() stockLineId;
    @Input() stockLineNumber: string;

    totalRecords: number = 0;
    totalPages: number = 0;
    pageSize: number = 20;
    data: any;
    constructor(private workFlowtService: StocklineService, private activeModal: NgbActiveModal, ) {


    }
    ngOnInit(): void {
        this.getStocklineListById(this.stockLineId);
    }
    dismissModel() {
        this.activeModal.close();
    }

    getStocklineListById(stockLineId) {
        this.workFlowtService.getStocklineListById(stockLineId).subscribe(res => {
            this.data = res[0];

        });

    }






}