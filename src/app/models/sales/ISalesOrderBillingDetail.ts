export interface ISalesOrderBillingDetail {
    billToSiteName: string;
    billToAddress1: string;
    billToAddress2: string;
    billToAddress3: string;
    billToCity: string;
    billToState: string;
    billToPostalCode: string;
    billToCountry: string;
    billToContactId: number;
    billToContactName: string;
    billToMemo: string;
    shipToUserTypeId: number;
    shipToUserId: number;
    shipToAddressId: number;
    billToUserTypeId: number;
    billToUserId: number;
    billToAddressId: number;
}