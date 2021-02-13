﻿import { Component, Input } from '@angular/core';
import { AddressModel } from '../../../../../../models/address.model';
import { SalesOrderShipping } from '../../../../../../models/sales/salesOrderShipping';
import { AlertService, MessageSeverity } from '../../../../../../services/alert.service';
import { fadeInOut } from '../../../../../../services/animations';
import { SalesOrderService } from '../../../../../../services/salesorder.service';
import * as moment from 'moment';
import { CommonService } from '../../../../../../services/common.service';
import { WorkOrderService } from '../../../../../../services/work-order/work-order.service';
import { CustomerService } from '../../../../../../services/customer.service';
import { editValueAssignByCondition } from '../../../../../../generic/autocomplete';
import { AuthService } from '../../../../../../services/auth.service';

@Component({
    selector: 'app-sales-order-shipping',
    templateUrl: './sales-order-shipping.component.html',
    styleUrls: ['./sales-order-shipping.component.scss'],
    animations: [fadeInOut]
})
export class SalesOrderShippingComponent {
    @Input() parts: any = [];
    @Input() salesOrderId;
    @Input() salesOrder: any;
    selectedColumns;
    headers = [];
    selectedPartNumber = 0;
    isSpinnerVisible = false;
    partsForBilling: any = [];
    totalRecords: number = 0;
    totalPages: number = 0;
    pageSize: number = 10;
    pageIndex: number = 0;
    first = 0;
    showPaginator: boolean = false;
    shippingForm: SalesOrderShipping = new SalesOrderShipping();
    @Input() customerId = 0;
    @Input() salesOrderPartNumberId: any = 0;
    @Input() isView: boolean = false;
    @Input() managementStructureId: any;
    @Input() customerDetails: any;
    partSelected = false;
    quoteForm: any = {};
    orignSiteNames: any = [];
    updateBtnExp = false;
    validFor: any;
    expirationDate: any;
    quoteDueDate: any;
    customerNamesList: any;
    soldCustomerAddress: any = new AddressModel();
    shipCustomerAddress: any = new AddressModel();
    shippingHeader: any = {
        "salesOrderShippingId": 0,
        "soShippingStatusId": 1,
        "openDate": new Date(),
        "shipDate": new Date(),
        "isActive": true,
        "isDeleted": false,
        "salesOrderCustomsInfo": {
            "masterCompanyId": 1,
            "createdBy": "admin",
            "updatedBy": "admin",
            "isActive": true,
            "isDeleted": false
        }
    };
    shipViaList: any = [];
    countryList: any = [];
    shipCustomerShippingOriginalData: any[];
    shipCustomerSiteList = [];
    soldCustomerSiteList = [];
    siteList: any = [];
    allWeightUnitOfMeasureInfo: any = [];
    allSizeUnitOfMeasureInfo: any = [];
    currSOPickTicketId: number;
    currQtyToShip: number;

    constructor(public salesOrderService: SalesOrderService,
        public alertService: AlertService,
        public commonService: CommonService,
        public workorderService: WorkOrderService,
        public customerService: CustomerService,
        public authService: AuthService) {
    }

    initColumns() {
        // this.headers = [
        //     { field: "shipDate", header: "Ship Date", width: "100px" },
        //     { field: "partNumber", header: "PN", width: "100px" },
        //     { field: "partDescription", header: "PN Description", width: "100px" },
        //     { field: "stockLineNumber", header: "Stk Line Num", width: "110px" },
        //     { field: "serialNumber", header: "Ser Num", width: "90px" },
        //     { field: "controlNumber", header: "Cntrl Num", width: "90px" },
        //     { field: "idNumber", header: "Cntrl ID", width: "90px" },
        //     { field: "promisedDate", header: "Promised Date ", width: "100px" },
        //     { field: "estimatedShipDate", header: "Est Shipped Date", width: "100px" },
        //     { field: "shippingRef", header: "Shipping  Ref", width: "100px" },
        //     { field: "pickTicketRef", header: "Pick Ticket Ref", width: "150px" }
        // ];
        // this.selectedColumns = this.headers;

        this.headers = [
            { field: "salesOrderNumber", header: "SO Num", width: "100px" },
            { field: "partNumber", header: "PN", width: "100px" },
            { field: "partDescription", header: "PN Description", width: "100px" },
            { field: "qtyToShip", header: "Qty Picked", width: "110px" },
            { field: "qtyShipped", header: "Qty Shipped", width: "90px" },
            { field: "qtyRemaining", header: "Qty Remaining", width: "90px" },
            { field: "status", header: "Status", width: "90px" },
        ];
        this.selectedColumns = this.headers;
    }

    btnChange() {
        const isExportWeight = this.shippingForm.shipWeight ? (this.shippingForm.shipWeightUnit ? 1 : 0) : 1;
        const isEExportSize = this.shippingForm.shipSizeLength || this.shippingForm.shipSizeWidth || this.shippingForm.shipSizeHeight ? (this.shippingForm.shipSizeUnitOfMeasureId ? 1 : 0) : 1;

        if (this.shippingForm.exportECCN && isExportWeight && isEExportSize) {
            this.updateBtnExp = false;
        }
        else {
            this.updateBtnExp = true;
        }
    }

    refresh(parts) {
        this.initColumns();
        this.getShippingList();
        this.getShipVia();
        this.getCountriesList();
        this.getSiteName();
        this.getCustomerNameList();
        this.getOriginSiteNames();
        this.getUnitOfMeasure();

        if (this.customerDetails) {
            this.shippingHeader['soldToName'] = this.customerDetails['name'];
            this.shippingHeader['shipToName'] = this.customerDetails['name'];
            if (!this.shippingHeader.shipToCustomerId) {
                this.shippingHeader.shipToCustomerId = this.customerDetails;
                this.getSiteNamesByShipCustomerId(this.customerDetails['name']);
            }
            this.shippingHeader['customerId'] = this.customerDetails['customerId'];
        }
    }

    onSelectPartNumber(rowData) {
        // if (rowData.salesOrderPartId != 0) {
        //     if (rowData.selected) {
        this.currSOPickTicketId = rowData.soPickTicketId;
        this.currQtyToShip = rowData.qtyToShip;
        this.partSelected = true;
        // } else {
        //     this.partSelected = false;
        // }
        // this.getShippingForSelectedPart(rowData.salesOrderPartId);
        //}
    }

    getShippingForSelectedPart(partNumber) {
        this.isSpinnerVisible = true;
        this.salesOrderService.getSalesOrderShipping(this.salesOrderId, partNumber).subscribe(result => {
            this.isSpinnerVisible = false;
            if (result) {
                this.shippingForm = result;
            } else {
                this.shippingForm = new SalesOrderShipping();
            }
        }, error => {
            this.isSpinnerVisible = false;
        });
    }

    convertDate(key, data) {
        if ((key === 'shipDate' || key === 'promisedDate' || key === 'estimatedShipDate') && data[key]) {
            return moment(data[key]).format('MM-DD-YYYY');
        } else {
            return data[key];
        }
    }

    getOriginSiteNames() {
        this.orignSiteNames = [];
        this.commonService.getSitesbymanagementstructrue(this.managementStructureId).subscribe(res => {
            if (res && res.length > 0) {
                this.orignSiteNames = res;
            }
        }, err => {
        });
    }

    calculateExpiryDate() {
    }

    getCustomerNameList() {
        let userShipingIdList = [];
        userShipingIdList.push(0);
        this.commonService.autoSuggestionSmartuserDropDownList(1, '', true, 20, userShipingIdList.join()).subscribe(res => {
            this.customerNamesList = res;
        }, err => {
        });
    }

    getShipVia() {
        this.commonService.smartDropDownList('ShippingVia', 'ShippingViaId', 'Name').subscribe((res) => {
            this.shipViaList = res;
        }, err => {
        });
    }

    getSiteName(customerId = 0) {
        this.workorderService.getSiteByCustomerId(customerId == 0 ? this.customerDetails['customerId'] : customerId)
            .subscribe(res => {
                this.siteList = res;
                if (!this.shippingHeader.soldToSiteId) {
                    this.siteList.forEach(
                        x => {
                            if (x.isPrimary) {
                                this.shippingHeader.soldToSiteId = x.customerDomensticShippingId;
                                //this.setSoldToAddress();
                                if (customerId == 0) this.setOriginAddress();
                            }
                        }
                    )
                }
            }, err => {
            });
    }

    getCountriesList() {
        this.commonService.smartDropDownList('Countries', 'countries_id', 'nice_name').subscribe(res => {
            this.countryList = res;
        }, err => {
        });
    }

    getUnitOfMeasure() {
        this.commonService.smartDropDownList('UnitOfMeasure', 'UnitOfMeasureId', 'shortName').subscribe((res) => {
            this.allWeightUnitOfMeasureInfo = res;
        }, err => {
        });
    }

    setShipToAddress() {
        this.shipCustomerSiteList.forEach(site => {
            if (site.customerDomensticShippingId == Number(this.shippingHeader.shipToSiteId)) {
                this.shippingHeader['shipToAddress1'] = site.address1;
                this.shippingHeader['shipToAddress2'] = site.address2;
                this.shippingHeader['shipToCity'] = site.city;
                this.shippingHeader['shipToState'] = site.stateOrProvince;
                this.shippingHeader['shipToZip'] = site.postalCode;
                this.shippingHeader['shipToCountryId'] = site.countryId;
                this.shippingHeader['shipToSiteName'] = site.siteName;
                this.shippingHeader['shipToCountryName'] = site.countryName;
                this.shippingHeader['shipToCountryId'] = site.countryId;
            }
        });
    }

    setSoldToAddresses() {
        this.soldCustomerSiteList.forEach(site => {
            if (site.customerDomensticShippingId == Number(this.shippingHeader.soldToSiteId)) {
                this.shippingHeader['soldToAddress1'] = site.address1;
                this.shippingHeader['soldToAddress2'] = site.address2;
                this.shippingHeader['soldToCity'] = site.city;
                this.shippingHeader['soldToState'] = site.stateOrProvince;
                this.shippingHeader['soldToZip'] = site.postalCode;
                this.shippingHeader['soldToCountryId'] = site.countryId;
                this.shippingHeader['soldToSiteName'] = site.siteName;
                this.shippingHeader['soldToCountryName'] = site.countryName;
                this.shippingHeader['soldToCountryId'] = site.countryId;
            }
        });
    }

    clearShipToAddress() {
        this.shipCustomerSiteList = [];
        this.shippingHeader['shipToAddress1'] = "";
        this.shippingHeader['shipToAddress2'] = "";
        this.shippingHeader['shipToCity'] = "";
        this.shippingHeader['shipToState'] = "";
        this.shippingHeader['shipToZip'] = "";
        this.shippingHeader['shipToCountryId'] = "";
        this.shippingHeader['shipToSiteName'] = "";
        this.shippingHeader['shipToCountryName'] = "";
        this.shippingHeader['shipToCountryId'] = "";
    }

    clearSoldToAddress() {
        this.soldCustomerSiteList = [];
        this.shippingHeader['soldToAddress1'] = "";
        this.shippingHeader['soldToAddress2'] = "";
        this.shippingHeader['soldToCity'] = "";
        this.shippingHeader['soldToState'] = "";
        this.shippingHeader['soldToZip'] = "";
        this.shippingHeader['soldToCountryId'] = "";
        this.shippingHeader['soldToSiteName'] = "";
        this.shippingHeader['soldToCountryName'] = "";
        this.shippingHeader['soldToCountryId'] = "";
    }

    setSoldToAddress() {
        this.siteList.forEach(site => {
            if (site.customerDomensticShippingId == Number(this.shippingHeader.soldToSiteId)) {
                this.shippingHeader['soldToAddress1'] = site.address1;
                this.shippingHeader['soldToAddress2'] = site.address2;
                this.shippingHeader['soldToCity'] = site.city;
                this.shippingHeader['soldToState'] = site.stateOrProvince;
                this.shippingHeader['soldToZip'] = site.postalCode;
                this.shippingHeader['soldToCountryId'] = site.countryId;
                this.shippingHeader['soldToSiteName'] = site.siteName;
                this.shippingHeader['soldToCountryName'] = site.countryName;
            }
        });
    }

    setOriginAddress() {
        this.siteList.forEach(site => {
            if (site.isPrimary) {
                this.shippingHeader['originAddress1'] = site.address1;
                this.shippingHeader['originAddress2'] = site.address2;
                this.shippingHeader['originCity'] = site.city;
                this.shippingHeader['originState'] = site.stateOrProvince;
                this.shippingHeader['originZip'] = site.postalCode;
                this.shippingHeader['originCountryId'] = site.countryId;
                this.shippingHeader['originName'] = site.siteName;
                this.shippingHeader['originCountryName'] = site.countryName;
            }
        });
    }

    assignDetails(value) {
        if (value == true) {
            //this.shippingHeader.shipToCustomerId = this.customerDetails;
            this.shippingHeader.shipToCustomerId = this.shippingHeader.soldToName;
            //this.getSiteNamesByShipCustomerId(this.customerDetails);
            this.getSiteNamesByShipCustomerId(this.shippingHeader.soldToName);
            this.shippingHeader['shipToSiteId'] = this.shippingHeader.soldToSiteId;
            // this.shippingHeader.shipToSiteId=this.
            this.shippingHeader['shipToAddress1'] = this.shippingHeader.soldToAddress1;
            this.shippingHeader['shipToAddress2'] = this.shippingHeader.soldToAddress2;
            this.shippingHeader['shipToCity'] = this.shippingHeader.soldToCity;
            this.shippingHeader['shipToState'] = this.shippingHeader.soldToState;
            this.shippingHeader['shipToZip'] = this.shippingHeader.soldToZip;
            this.shippingHeader['shipToCountryId'] = this.shippingHeader.countryId;
            this.shippingHeader['shipToSiteName'] = this.shippingHeader.soldToSiteName;
            this.shippingHeader['shipToCountryName'] = this.shippingHeader.soldToCountryName;
            this.shippingHeader['shipToCountryId'] = this.shippingHeader.soldToCountryId;
        }
    }

    filterCustomerName(event) {
        const value = event.query.toLowerCase();
        let userShipingIdList = [];
        userShipingIdList.push(0);
        this.commonService.autoSuggestionSmartuserDropDownList(1, value, true, 20, userShipingIdList.join()).subscribe(res => {
            this.customerNamesList = res;
        }, err => {
        });
    }

    async getSiteNamesByShipCustomerId(object) {
        this.clearShipToAddress();
        let customerId = object.userID;
        await this.customerService.getCustomerShipAddressGet(customerId).subscribe(res => {
            this.shipCustomerShippingOriginalData = res[0];
            this.shipCustomerSiteList = res[0];
            this.shipCustomerShippingOriginalData.forEach(
                x => {
                    if (x.isPrimary) {
                        this.shippingHeader.shipToSiteId = x.customerDomensticShippingId;
                        this.setShipToAddress();
                    }
                }
            )
        }, err => {
        });
    }

    async getSiteNamesBySoldCustomerId(object) {
        this.clearSoldToAddress();
        let customerId = object.userID;
        //this.getSiteName(customerId);
        await this.customerService.getCustomerShipAddressGet(customerId).subscribe(res => {
            this.soldCustomerSiteList = res[0];
            this.shipCustomerShippingOriginalData = res[0];
            this.shipCustomerShippingOriginalData.forEach(
                x => {
                    if (x.isPrimary) {
                        this.shippingHeader.soldToSiteId = x.customerDomensticShippingId;
                        this.setSoldToAddresses();
                    }
                }
            )
        }, err => {
        });
    }

    clearAddress(type, value) {
        if (value === '' && type === 'SoldTo') {
            this.soldCustomerAddress = new AddressModel();
        } else if (value === '' && type === 'ShipTo') {
            this.shipCustomerAddress = new AddressModel();
        }
    }

    async getEditSiteData(customerId) {
        await this.customerService.getCustomerShipAddressGet(customerId).subscribe(res => {
            this.shipCustomerSiteList = res[0];
        }, err => {
        });
    }

    save() {
        this.shippingHeader['salesOrderId'] = this.salesOrderId;
        this.shippingHeader['salesOrderPartId'] = this.salesOrderPartNumberId;
        this.shippingHeader['masterCompanyId'] = this.salesOrder['masterCompanyId'];
        this.shippingHeader['salesOrderCustomsInfo']['masterCompanyId'] = this.salesOrder['masterCompanyId'];
        this.shippingHeader['createdBy'] = this.userName;
        this.shippingHeader['updatedBy'] = this.userName;
        this.shippingHeader['createdDate'] = new Date().toDateString();
        this.shippingHeader['updatedDate'] = new Date().toDateString();
        this.shippingHeader['salesOrderCustomsInfo']['createdDate'] = new Date().toDateString();
        this.shippingHeader['salesOrderCustomsInfo']['updatedDate'] = new Date().toDateString();
        this.shippingHeader['trackingNum'] = 23;
        this.shippingHeader['houseAirwayBill'] = 349;
        this.shippingHeader['shipToCustomerId'] = editValueAssignByCondition('userID', this.shippingHeader['shipToCustomerId']);
        this.shippingHeader['soldToName'] = this.shippingHeader.soldToName.userName;
        this.shippingHeader['sOPickTicketId'] = this.currSOPickTicketId;
        this.shippingHeader['qtyShipped'] = this.currQtyToShip;
        this.isSpinnerVisible = true;
        this.salesOrderService.createShipping(this.shippingHeader)
            .subscribe(
                (res: any) => {
                    this.isSpinnerVisible = false;
                    //this.getEditSiteData(res.shipToCustomerId);
                    // this.shippingHeader = res;
                    // this.shippingHeader['openDate'] = new Date(this.shippingHeader['openDate']);
                    // this.shippingHeader['shipDate'] = new Date(this.shippingHeader['shipDate']);
                    // this.shippingHeader['shipToCustomerId'] = { userID: res.shipToCustomerId, userName: res.shipToCustomer };
                    // this.customerNamesList.forEach(
                    //     x => {
                    //         if (x.userID == res['shipToCustomerId']) {
                    //             this.shippingHeader['shipToCustomerId'] = x;
                    //         }
                    //     }
                    // )
                    this.alertService.showMessage(
                        'Sales Order',
                        'Sales Order Shipping created Succesfully',
                        MessageSeverity.success
                    );
                    this.partSelected = false;
                    this.getShippingList();
                }, err => {
                    this.isSpinnerVisible = false;
                });
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    shippingList: any[] = [];

    getShippingList() {
        this.isSpinnerVisible = true;
        this.salesOrderService
            .getShippingDataList(this.salesOrderId)
            .subscribe((response: any) => {
                this.isSpinnerVisible = false;
                this.shippingList = response[0];
                //this.showPaginator = this.totalRecords > 0;
            }, error => {
                this.isSpinnerVisible = false;
            });
    }

    checked(event, poindex) {
        this.shippingList[0].soshippingchildviewlist[0].selected = true;
    }

    // setOriginToAddress(value) {
    //     this.orignSiteNames.forEach(site => {
    //         if (site.originSiteId == value) {
    //             this.shippingHeader['originName'] = site.originName;
    //             this.shippingHeader['originAddress1'] = site.originAddress1;
    //             this.shippingHeader['originAddress2'] = site.originAddress2;
    //             this.shippingHeader['originCity'] = site.originCity;
    //             this.shippingHeader['originState'] = site.originState;
    //             this.shippingHeader['originZip'] = site.originZip;
    //             // this.shippingHeader['shipToCountryId'] = site.countryId;
    //             // this.shippingHeader['shipToSiteName'] = site.siteName;
    //             this.shippingHeader['originCountryName'] = site.originCountryName;
    //             this.shippingHeader['originCountryId'] = site.originCountryId;
    //         }
    //     });
    // }

    // getShippingData() {
    //     this.isSpinnerVisible = true;
    //     this.salesOrderService.getSalesOrderShipping(this.salesOrderId, this.salesOrderPartNumberId)
    //         .subscribe(
    //             (res: any) => {
    //                 this.isSpinnerVisible = false;
    //                 if (res) {
    //                     if (!res['response']) {
    //                         this.getEditSiteData(res.shipToCustomerId);
    //                         this.shippingHeader = res;
    //                         this.shippingHeader['openDate'] = new Date(this.shippingHeader['openDate']);
    //                         this.shippingHeader['shipDate'] = new Date(this.shippingHeader['shipDate']);
    //                         this.shippingHeader['shipToCustomerId'] = { userID: res.shipToCustomerId, userName: res.shipToCustomer };
    //                     }
    //                 }
    //             },
    //             err => {
    //                 this.isSpinnerVisible = false;
    //             });
    // }

    // loadData(event) {
    // }
}