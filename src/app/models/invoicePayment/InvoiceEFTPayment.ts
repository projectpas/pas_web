export class InvoiceEFTPayment {
  eftId: number;
  paymentId: number;
  soBillingInvoicingId: number;
  customerId: number;
  eftDate: Date;
  amount: number;
  currencyId: number;
  bankName: string;
  referenceNo: string;
  bankAccount: string;
  glAccountNumber: number;
  memo: string;
  masterCompanyId: number;
  createdBy: string;
  updatedBy: string;
  createdDate: Date;
  updatedDate: Date;
  isActive: boolean;
  isDeleted: boolean;
}