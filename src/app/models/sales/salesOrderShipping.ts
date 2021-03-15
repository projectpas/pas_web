export class SalesOrderShipping {
    salesOrderShippingId: 0;
    salesOrderId: 0;
    salesOrderPartId: 0;
    soShippingNum: string;
    soShippingStatusId: 0;
    openDate: Date;
    customerId: 0;
    shipviaId: 0;
    shipDate: Date;
    airwayBill: string;
    weight: 0;
    soldToName: string;
    soldToSiteId: 0
    soldToSiteName: string;
    soldToAddress1: string;
    soldToAddress2: string;
    soldToCity: string;
    soldToState: string;
    soldToZip: string;
    soldToCountryId: 0;
    shipToName: string;
    shipToSiteName: string;
    shipToSiteId: 0;
    shipToCustomerId: 0;
    shipToAddress1: string;
    shipToAddress2: string;
    shipToCity: string;
    shipToState: string;
    shipToZip: string;
    shipToCountryId: 0;
    originName: string;
    originAddress1: string;
    originAddress2: string;
    originCity: string;
    originState: string;
    originZip: string;
    originCountryId: 0;
    isSameForShipTo: true;
    shipment: string;
    shipToCustomer: string;
    masterCompanyId: 0;
    createdBy: string;
    createdDate: Date;
    updatedBy: string;
    updatedDate: Date;
    isActive: true;
    isDeleted: true;
    shipWeight: number;
    shipWeightUnit: number;
    shipSizeLength: number;
    shipSizeWidth: number;
    shipSizeHeight: number;
    shipSizeUnitOfMeasureId: number;
    exportECCN: number;
    trackingNum: number = 0;
    houseAirwayBill: number = 0;
    noOfContainer: number = 0;
}