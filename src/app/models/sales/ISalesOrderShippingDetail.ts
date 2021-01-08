export interface ISalesOrderShippingDetail {
    shipToSiteName: string;
    shipToAddress1: string;
    shipToAddress2: string;
    shipToAddress3: string;
    shipToCity: string;
    shipToState: string;
    shipToPostalCode: string;
    shipToCountry: string;
    shipToContactId: number;
    shipToContactName: string;
    shipViaId: number;
    shipViaName: string;
    shipViaShippingAccountInfo: string;
    shippingId: string;
    shippingURL: string;
    shipViaMemo: string;
    shipViaShippingURL: string;
}