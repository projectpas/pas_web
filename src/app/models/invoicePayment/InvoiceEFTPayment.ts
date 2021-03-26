export class InvoiceEFTPayment {
  EFTId: number;
  PaymentId: number;
  SOBillingInvoicingId: number;
  CustomerId: number;
  EFTDate: Date;
  Amount: number;
  CurrencyId: number;
  BankName: string;
  ReferenceNo: string;
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