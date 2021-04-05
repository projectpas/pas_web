import { InvoiceCheckPayment } from "./InvoiceCheckPayment";
import { InvoiceWireTransferPayment } from "./InvoiceWireTransferPayment";
import { InvoiceCreditDebitCardPayments } from "./InvoiceCreditDebitCardPayments";
import { InvoicePayments } from "./InvoicePayments";
import { CustomerPayments } from "../sales/CustomerPayments.model";

export class CustomerReceiptInfo {
  customerPayments: CustomerPayments;
  checkPayments: InvoiceCheckPayment;
  wirePayments: InvoiceWireTransferPayment;
  ccPayments: InvoiceCreditDebitCardPayments;
  invoices: InvoicePayments[];
  customerId: number;
}