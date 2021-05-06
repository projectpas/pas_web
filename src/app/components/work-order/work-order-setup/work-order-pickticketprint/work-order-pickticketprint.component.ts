import { IPickTicketParameter } from '../../../../models/IPickTicketParameter';
import { Component, OnInit, Input, EventEmitter ,ViewEncapsulation} from "@angular/core";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { NavigationExtras } from "@angular/router";

@Component({
  selector: 'app-work-order-pickticketprint',
  templateUrl: './work-order-pickticketprint.component.html',
  styleUrls: ['./work-order-pickticketprint.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WorkOrderPickticketprintComponent implements OnInit {

  @Input('modal-reference') modalReference: NgbModalRef;
  @Input('on-confirm') onConfirm: EventEmitter<NavigationExtras> = new EventEmitter<NavigationExtras>();
  //@Input() salesOrderoView: SalesOrderPickTicketView;
  OrderoView : any;
  //salesOrderCopyParameters: IPickTicketParameter;
  pickTicketParamete: IPickTicketParameter;
  //salesOrder: any = [];
  OrderData: any = [];
  todayDate: Date = new Date();
  parts: any = [];
  management: any = {};
  // salesOrderpartConditionDescription: any;
  // salesOrderId: number;
  // salesOrderPartId: number;
  // soPickTicketId: number;

  OrderpartConditionDescription: any;
  referenceId: number;
  orderPartId: number;
  pickTicketId: number;
  endPointURL: any;
  constructor() { }

  ngOnInit() {
  }

}
