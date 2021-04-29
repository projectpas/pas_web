import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from "@angular/core";
import { MenuItem } from "primeng/components/common/menuitem";
import { SalesOrderActionType } from "../../sales-order-actions-emuns";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { SalesOrderConfirmationType } from "../../sales-confirmation-type.enum";
import { SalesOrderConfirmationModalComponent } from "../sales-order-confirmation-modal/sales-order-confirmation-modal.compoent";
import { SalesOrderEventArgs } from "../../sales-order-event-args";
import { SalesOrderCopyComponent } from "../sales-order-copy/sales-order-copy.component";
import { NavigationExtras, Router } from "@angular/router";
import { SalesOrderpickTicketComponent } from "../sales-order-pickTicket/sales-order-pickTicket.component";
import { ISalesQuote } from "../../../../models/sales/ISalesQuote.model";
import { SalesQuote } from "../../../../models/sales/SalesQuote.model";
import { ISalesOrderQuote } from "../../../../models/sales/ISalesOrderQuote";
import { ISalesQuoteView } from "../../../../models/sales/ISalesQuoteView";

@Component({
  selector: "app-sales-order-actions",
  templateUrl: "./sales-order-actions.component.html",
  styleUrls: ["./sales-order-actions.component.scss"]
})
export class SalesOrderActionsComponent implements OnInit {
  salesQuote: ISalesQuote;
  salesOrderQuote: ISalesOrderQuote;
  salesQuoteView: ISalesQuoteView;
  salesQuoteId: any;
  @Input("customer-id") customerId: number;
  @Input('sales-order-id') salesOrderId: number;
  @Input('is-edit-mode') isEditmode: boolean;
  @Input('control-settings') controlSettings: any;
  @Input('router') router: Router;
  @Output('on-click') onActionClick: EventEmitter<SalesOrderEventArgs> = new EventEmitter<SalesOrderEventArgs>();
  /*Action Items*/
  printItems: MenuItem[];
  communicationItems: MenuItem[];
  paymentItems: MenuItem[];
  actionItems: MenuItem[];
  @ViewChild("salesOrderConfirmationModal", { static: false })
  public salesOrderConfirmationModal: ElementRef;
  @ViewChild("printPickTicketModal", { static: false })
  public printPickTicketModal: ElementRef;
  @ViewChild("payment", { static: false }) payment: ElementRef;
  modal: NgbModalRef;
  salesOrderActionType = SalesOrderActionType;
  actionType: SalesOrderActionType = SalesOrderActionType.None;
  confirmationType: SalesOrderConfirmationType = SalesOrderConfirmationType.None;
  confirmationModal: any = {
    header: 'Confirm',
    body: {
      close: 'Do you want to close the sales order?',
      cancel: 'Do you want to cancel the sales order?',
      duplicate: 'Do you want to create duplicate sales order? '
    }
  }

  constructor(private modalService: NgbModal) {
  }

  ngOnInit() {
    this.initPrintActions();
    this.initActions();
    this.initCommunication();
    this.initPayment();
    this.salesQuote = new SalesQuote();
  }

  onClick(actionType: SalesOrderActionType): void {
    if (actionType == SalesOrderActionType.CancelSalesOrder) {
      this.openConfirmationModal(actionType, this.confirmationModal.header, this.confirmationModal.body.cancel);
    } else if (actionType == SalesOrderActionType.CloseSalesOrder) {
      this.openConfirmationModal(actionType, this.confirmationModal.header, this.confirmationModal.body.close);
    }
    else {
      this.onActionClick.emit(new SalesOrderEventArgs(actionType, SalesOrderConfirmationType.None));
    }
  }

  openConfirmationModal(actionType: SalesOrderActionType, header: string, body: string) {
    this.modal = this.modalService.open(SalesOrderConfirmationModalComponent, { size: "sm" });
    let instance: SalesOrderConfirmationModalComponent = (<SalesOrderConfirmationModalComponent>this.modal.componentInstance)
    instance.header = header;
    instance.body = body;
    instance.onConfirm.subscribe(this.onActionClick);
    instance.salesOrderActionType = actionType;
    instance.modalRef = this.modal;
  }

  onConfirm(eventArgs: SalesOrderEventArgs): void {
    this.onActionClick.emit(eventArgs);
  }

  openPaymentModal() {
    //this.modal = this.modalService.open(this.payment, { size: "lg", backdrop: 'static', keyboard: false });
  }

  initPrintActions(): void {
    this.printItems = [
      {
        label: 'Print SO', command: () => {
          //this.onActionClick.emit(new SalesOrderEventArgs(SalesOrderActionType.PrintSalesOrder, SalesOrderConfirmationType.None));
        }
      }
      // {
      //   label: 'Print Pick Ticket', command: () => {
      //     this.PrintTicket();
      //   }
      // },
      // {
      //   label: 'Print Labels', command: () => {
      //     this.onActionClick.emit(new SalesOrderEventArgs(SalesOrderActionType.PrintLabels, SalesOrderConfirmationType.None));
      //   }
      // }
    ];
  }

  initCommunication(): void {
    this.communicationItems = [
      {
        label: 'Memo', command: () => {
          this.onActionClick.emit(new SalesOrderEventArgs(SalesOrderActionType.Memo, SalesOrderConfirmationType.None));
        }
      },
      {
        label: 'Email', command: () => {
          this.onActionClick.emit(new SalesOrderEventArgs(SalesOrderActionType.Email, SalesOrderConfirmationType.None));

        }
      },
      {
        label: 'Phone', command: () => {
          this.onActionClick.emit(new SalesOrderEventArgs(SalesOrderActionType.Phone, SalesOrderConfirmationType.None));
        }
      },
      {
        label: 'Text', command: () => {
          this.onActionClick.emit(new SalesOrderEventArgs(SalesOrderActionType.Text, SalesOrderConfirmationType.None));
        }
      }
    ];
  }

  initPayment(): void {
    this.paymentItems = [
      {
        label: 'Make Payment', command: () => {
          this.openPaymentModal();
        }
      },
      {
        label: 'Partial Payment', command: () => {
          this.onActionClick.emit(new SalesOrderEventArgs(SalesOrderActionType.PartialPayment, SalesOrderConfirmationType.None));
        }
      },
      {
        label: 'Cash Sales', command: () => {
          this.onActionClick.emit(new SalesOrderEventArgs(SalesOrderActionType.CashSales, SalesOrderConfirmationType.None));
        }
      },
      {
        label: 'Deposit', command: () => {
          this.onActionClick.emit(new SalesOrderEventArgs(SalesOrderActionType.Deposit, SalesOrderConfirmationType.None));
        }
      }
    ];
  }

  initActions(): void {
    this.actionItems = [
      {
        label: 'Email SO', command: () => {
          this.onActionClick.emit(new SalesOrderEventArgs(SalesOrderActionType.EmailSalesOrder, SalesOrderConfirmationType.None));
        }
      },
      {
        label: 'Make Duplicate', command: () => {
          this.copySalesOrder();
        }
      },
      {
        label: 'Sales Register', command: () => {
          this.onActionClick.emit(new SalesOrderEventArgs(SalesOrderActionType.SalesRegister, SalesOrderConfirmationType.None));
        }
      },
      {
        label: 'Activity', command: () => {
          this.onActionClick.emit(new SalesOrderEventArgs(SalesOrderActionType.Activity, SalesOrderConfirmationType.None));
        }
      },
      {
        label: 'Authorize Return', command: () => {
          this.onActionClick.emit(new SalesOrderEventArgs(SalesOrderActionType.AuthorizeReturn, SalesOrderConfirmationType.None));
        }
      },
      {
        label: 'Refund', command: () => {
          this.onActionClick.emit(new SalesOrderEventArgs(SalesOrderActionType.Refund, SalesOrderConfirmationType.None));
        }
      }
    ];
  }

  copySalesOrder() {
    this.modal = this.modalService.open(SalesOrderCopyComponent, { size: "sm" });
    let instance: SalesOrderCopyComponent = (<SalesOrderCopyComponent>this.modal.componentInstance)
    instance.modalReference = this.modal;

    instance.onConfirm.subscribe($event => {
      this.navigate($event);
    });

    instance.salesOrderCopyParameters.customerId = this.customerId;
    instance.salesOrderCopyParameters.salesOrderId = this.salesOrderId;
  }

  PrintTicket() {
    this.modal = this.modalService.open(SalesOrderpickTicketComponent, { size: "lg" });
    let instance: SalesOrderpickTicketComponent = (<SalesOrderpickTicketComponent>this.modal.componentInstance)
    instance.modalReference = this.modal;

    instance.onConfirm.subscribe($event => {
      this.navigate($event);
    });
    instance.salesOrderCopyParameters.salesOrderId = this.salesOrderId;
  }

  Memo() {
    this.modal = this.modalService.open(SalesOrderpickTicketComponent, { size: "lg" });
    let instance: SalesOrderpickTicketComponent = (<SalesOrderpickTicketComponent>this.modal.componentInstance)
    instance.modalReference = this.modal;

    instance.onConfirm.subscribe($event => {
      this.navigate($event);
    });
    instance.salesOrderCopyParameters.salesOrderId = this.salesOrderId;
  }

  Email() {
    this.modal = this.modalService.open(SalesOrderpickTicketComponent, { size: "lg" });
    let instance: SalesOrderpickTicketComponent = (<SalesOrderpickTicketComponent>this.modal.componentInstance)
    instance.modalReference = this.modal;

    instance.onConfirm.subscribe($event => {
      this.navigate($event);
    });
    instance.salesOrderCopyParameters.salesOrderId = this.salesOrderId;
  }

  Phone() {
    this.modal = this.modalService.open(SalesOrderpickTicketComponent, { size: "lg" });
    let instance: SalesOrderpickTicketComponent = (<SalesOrderpickTicketComponent>this.modal.componentInstance)
    instance.modalReference = this.modal;

    instance.onConfirm.subscribe($event => {
      this.navigate($event);
    });
    instance.salesOrderCopyParameters.salesOrderId = this.salesOrderId;
  }

  Text() {
    this.modal = this.modalService.open(SalesOrderpickTicketComponent, { size: "lg" });
    let instance: SalesOrderpickTicketComponent = (<SalesOrderpickTicketComponent>this.modal.componentInstance)
    instance.modalReference = this.modal;

    instance.onConfirm.subscribe($event => {
      this.navigate($event);
    });
    instance.salesOrderCopyParameters.salesOrderId = this.salesOrderId;
  }

  navigate(navigationExtras: NavigationExtras) {
    if (this.modal) {
      this.modal.close();
    }

    let routeUrl: string = `/salesmodule/salespages/sales-order-copy/${this.customerId}/${this.salesOrderId}`;
    this.router.navigate([routeUrl], navigationExtras);
  }

  viewSelectedRow(content) {
    this.modal = this.modalService.open(content, { size: "lg" });
  }

  dismissModel() {
    this.modal.close();
  }
}