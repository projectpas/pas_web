export interface IInvoicePayments {
  paymentId: number;
  customerId: number;
  soBillingInvoicingId: number;
  isMultiplePaymentMethod: boolean;
  isCheckPayment: boolean;
  isWireTransfer: boolean;
  isEFT: boolean;
  isCCDCPayment: boolean;
  paymentAmount: number;
  discAmount: number;
  discType: string;
  bankFeeAmount: number;
  bankFeeType: string;
  otherAdjustAmt: number;
  reason: string;
  remainingBalance: number;
  status: string;
  masterCompanyId: number;
  createdBy: string;
  updatedBy: string;
  createdDate: Date;
  updatedDate: Date;
  isActive: boolean;
  isDeleted: boolean;
}