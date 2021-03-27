export class InvoiceCheckPayment {
  checkPaymentId: number;
  paymentId: number;
  soBillingInvoicingId: number;
  customerId: number;
  paymentMethod: string;
  checkDate: Date;
  amount: number;
  currencyId: number;
  checkNumber: string;
  payorsBank: string;
  bankAccount: string;
  glAccountNumber: number;
  memo: string;
  masterCompanyId: number;
  createdBy: string;
  updatedBy: string;
  createdDate: Date;
  ppdatedDate: Date;
  isActive: boolean;
  isDeleted: boolean;
}