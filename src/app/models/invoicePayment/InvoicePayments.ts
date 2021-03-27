export class InvoicePayments {
  PaymentId: number;
  CustomerId: number;
  SOBillingInvoicingId: number;
  IsMultiplePaymentMethod: boolean;
  IsCheckPayment: boolean;
  IsWireTransfer: boolean;
  IsEFT: boolean;
  IsCCDCPayment: boolean;
  MasterCompanyId: number;
  CreatedBy: string;
  UpdatedBy: string;
  CreatedDate: Date;
  UpdatedDate: Date;
  IsActive: boolean;
  IsDeleted: boolean;
}