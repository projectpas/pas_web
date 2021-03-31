export class InvoiceWireTransferPayment {
  wireTransferId: number;
  paymentId: number;
  soBillingInvoicingId: number;
  customerId: number;
  wireDate: Date;
  amount: number;
  currencyId: number;
  bankName: string;
  referenceNo: string;
  imad_OMADNo: string;
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