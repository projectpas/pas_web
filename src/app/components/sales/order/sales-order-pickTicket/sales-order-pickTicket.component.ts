import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { SalesOrderService } from "../../../../services/salesorder.service";
import { ISalesOrderView } from "../../../../models/sales/ISalesOrderView";
import { SalesOrderPickTicketView } from "../../../../models/sales/SalesOrderPickTicketView";
import { SalesOrderView } from "../../../../models/sales/SalesOrderView";
import { ISalesOrderCopyParameters } from "../models/isalesorder-copy-parameters";
import { SalesOrderCopyParameters } from "../models/salesorder-copy-parameters";

@Component({
    selector: "app-sales-order-pickTicket",
    templateUrl: "./sales-order-pickTicket.component.html",
    styleUrls: ["./sales-order-pickTicket.component.scss"]
})
export class SalesOrderpickTicketComponent implements OnInit {
    @Input('modal-reference') modalReference: NgbModalRef;
    @Input('on-confirm') onConfirm: EventEmitter<NavigationExtras> = new EventEmitter<NavigationExtras>();
    @Input() salesOrderoView: SalesOrderPickTicketView;
    //@Input() salesOrderView: SalesOrderView; 
    salesOrderCopyParameters: ISalesOrderCopyParameters;
    salesOrder: any = [];
    todayDate: Date = new Date();
    parts: any = [];
    management: any = {};
    salesOrderpartConditionDescription: any;

    constructor(private modalService: NgbModal, private salesOrderService: SalesOrderService,
        private router: Router) {
        this.salesOrderCopyParameters = new SalesOrderCopyParameters();
    }

    ngOnInit() {
        this.getSalesPickTicketView();
    }

    getSalesPickTicketView() {
        this.salesOrderService.getPickTicket(this.salesOrderCopyParameters.salesOrderId).subscribe(res => {
            this.salesOrderoView = res[0];

            this.salesOrder = res[0].soPickTicketViewModel;
            this.parts = res[0].soPickTicketPartViewModel;
            this.management = res[0].managementStructureHeaderData;
            console.log(this.parts);
            console.log(this.salesOrder);
        })
    }
    
    close() {
        if (this.modalReference) {
            this.modalReference.close();
        }
    }

    copy() {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                cp: this.salesOrderCopyParameters.copyParts,
                cia: this.salesOrderCopyParameters.copyInternalApprovals
            }
        };
        this.onConfirm.emit(navigationExtras);
    }
}