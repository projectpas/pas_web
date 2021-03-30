import { InvoiceCheckPayment } from "./InvoiceCheckPayment";
import { InvoiceWireTransferPayment } from "./InvoiceWireTransferPayment";
import { InvoiceEFTPayment } from "./InvoiceEFTPayment";
import { InvoiceCreditDebitCardPayments } from "./InvoiceCreditDebitCardPayments";

export class InvoicePaymentViewModel {
  CustomerId: number;
  SOBillingInvoicingId: number;
  IsMultiplePaymentMethod: boolean;
  IsCheckPayment: boolean;
  IsWireTransfer: boolean;
  IsEFT: boolean;
  IsCCDCPayment: boolean;
  checkPayments: InvoiceCheckPayment;
	invoiceWireTransferPayment: InvoiceWireTransferPayment;
	invoiceEFTPayment: InvoiceEFTPayment;
	invoiceCreditDebitCardPayment: InvoiceCreditDebitCardPayments;
  MasterCompanyId: number;
  CreatedBy: string;
  UpdatedBy: string;
  CreatedDate: Date;
  UpdatedDate: Date;
  IsActive: boolean;
  IsDeleted: boolean;
}