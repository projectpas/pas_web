export class InvoiceWireTransferPayment {
  WireTransferId: number;
  PaymentId: number;
  SOBillingInvoicingId: number;
  CustomerId: number;
  WireDate: Date;
  Amount: number;
  CurrencyId: number;
  BankName: string;
  ReferenceNo: string;
  IMAD_OMADNo: string;
  BankAccount: number;
  GLAccountNumber: number;
  Memo: string;
  MasterCompanyId: number;
  CreatedBy: string;
  UpdatedBy: string;
  CreatedDate: Date;
  UpdatedDate: Date;
  IsActive: boolean;
  IsDeleted: boolean;
}