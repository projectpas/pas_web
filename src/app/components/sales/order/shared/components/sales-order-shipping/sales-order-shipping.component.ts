import { Component, Input } from '@angular/core';
import { AddressModel } from '../../../../../../models/address.model';
import { SalesOrderShipping } from '../../../../../../models/sales/salesOrderShipping';
import { AlertService, MessageSeverity } from '../../../../../../services/alert.service';
import { fadeInOut } from '../../../../../../services/animations';
import { SalesOrderService } from '../../../../../../services/salesorder.service';
import * as moment from 'moment';
import { CommonService } from '../../../../../../services/common.service';
import { WorkOrderService } from '../../../../../../services/work-order/work-order.service';
import { CustomerService } from '../../../../../../services/customer.service';
import { editValueAssignByCondition, getValueFromObjectByKey, getObjectByValue, formatNumberAsGlobalSettingsModule } from '../../../../../../generic/autocomplete';
import { AuthService } from '../../../../../../services/auth.service';
import { AddressTypeEnum } from '../../../../../../shared/components/address-component/Address-type-enum';
import { AppModuleEnum } from '../../../../../../enum/appmodule.enum';
import { CustomerShippingModel } from '../../../../../../models/customer-shipping.model';

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
    soldCustomerShippingOriginalData: any[];
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
            { field: "itemNo", header: "Item #", width: "100px" },
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
        this.partSelected = false;
        this.initColumns();
        this.getShippingList();
        this.getShipVia();
        this.getCountriesList();
        this.getSiteName();
        this.getCustomerNameList();
        this.getOriginSiteNames();
        this.getUnitOfMeasure();
        //this.getAddressById(this.salesOrderId);

        // if (this.customerDetails) {
        //     this.shippingHeader['soldToName'] = this.customerDetails['name'];
        //     this.shippingHeader['shipToName'] = this.customerDetails['name'];
        //     if (!this.shippingHeader.shipToCustomerId) {
        //         this.shippingHeader.shipToCustomerId = this.customerDetails;
        //         this.getSiteNamesByShipCustomerId(this.customerDetails['name']);
        //     }
        //     this.shippingHeader['customerId'] = this.customerDetails['customerId'];
        // }
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
            this.getAddressById(this.salesOrderId);
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
                                //if (customerId == 0) this.setOriginAddress();
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
                //this.shippingHeader['shipToCountryId'] = site.countryId;
                this.shippingHeader['shipToSiteName'] = site.siteName;
                this.shippingHeader['shipToCountryName'] = site.countryName;
                this.shippingHeader['shipToCountryId'] = site.countryId;
            }
        });
    }

    setSoldToAddresses() {
        this.soldCustomerSiteList.forEach(site => {
            //if (site.customerDomensticShippingId == Number(this.shippingHeader.soldToSiteId)) {
            if (site.customerBillingAddressId == Number(this.shippingHeader.soldToSiteId)) {  
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
    shipToUserId:any=0;
    async getSiteNamesByShipCustomerId(object) {
        this.clearShipToAddress();
        let customerId = object.userID;
        this.shipToUserId = object.userID;
        await this.customerService.getCustomerShipAddressGet(customerId).subscribe(res => {
            this.shipCustomerShippingOriginalData = res[0];
            this.shipCustomerSiteList = res[0];
            // this.shipCustomerShippingOriginalData.forEach(
            //     x => {
            //         if (x.isPrimary) {
            //             this.shippingHeader.shipToSiteId = x.customerDomensticShippingId;
            //             this.setShipToAddress();
            //         }
            //     }
            // )
            this.setShipToAddress();

            this.shipToSite = res[0];;
			if(this.shipToSite && this.shipToSite.length !=0){
			this.shippingSieListOriginal = this.shipToSite.map(x => {
				    return {
					    siteName: x.siteName, siteId: x.siteId
				    }
                });
            }
            
        }, err => {
        });
    }
    billToUserId:any=0;
    async getSiteNamesBySoldCustomerId(object) {
        this.clearSoldToAddress();
        let customerId = object.userID;
        this.billToUserId = object.userID;
        //this.getSiteName(customerId);
        //await this.customerService.getCustomerShipAddressGet(customerId).subscribe(res => {
        await this.customerService.getCustomerBillAddressGet(customerId).subscribe(res => {
            this.soldCustomerShippingOriginalData = res[0];
            this.soldCustomerSiteList = res[0]; 
            // this.soldCustomerShippingOriginalData.forEach(
            //     x => {
            //         if (x.isPrimary) {
            //             this.shippingHeader.soldToSiteId = x.customerDomensticShippingId;
            //             this.setSoldToAddresses();
            //         }
            //     }
            // )

            this.billToSite = res[0];
                if(this.billToSite && this.billToSite.length !=0){
                	     this.billingSieListOriginal = this.billToSite.map(x => {
		            return {
			            siteName: x.siteName, siteId: x.customerBillingAddressId
		            }
	            })
            }	 

            this.setSoldToAddresses();
        }, err => {
        });
    }
    
    async setSiteNamesByShipCustomerId(object, siteId) {
        this.clearShipToAddress();
        let customerId = object.userID;
        this.shipToUserId = object.userID;
        await this.customerService.getCustomerShipAddressGet(customerId).subscribe(res => {
            this.shipCustomerShippingOriginalData = res[0];
            this.shipCustomerSiteList = res[0];
            this.shippingHeader.shipToSiteId = siteId;

            this.shipToSite = res[0];;
			if(this.shipToSite && this.shipToSite.length !=0){
			this.shippingSieListOriginal = this.shipToSite.map(x => {
				    return {
					    siteName: x.siteName, siteId: x.siteId
				    }
                });
            }
            this.setShipToAddress();
        }, err => {
        });
    }

    async setSiteNamesBySoldCustomerId(object, siteId) {
        this.clearSoldToAddress();
        let customerId = object.userID;
        this.billToUserId = object.userID;
        //this.customerService.getCustomerShipAddressGet(customerId).subscribe(res => {
        await this.customerService.getCustomerBillAddressGet(customerId).subscribe(res => {
            this.soldCustomerSiteList = res[0];
            this.soldCustomerShippingOriginalData = res[0];
            this.shippingHeader.soldToSiteId = siteId;

            this.billToSite = res[0];
	        //if(this.sourcePoApproval.billToSiteId) {
	            //this.onBillToGetAddress(this.sourcePoApproval.billToSiteId);}
                    if(this.billToSite && this.billToSite.length !=0){
                	     this.billingSieListOriginal = this.billToSite.map(x => {
		            return {
			            siteName: x.siteName, siteId: x.customerBillingAddressId
		            }
	            })
            }
            this.setSoldToAddresses();
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
        //this.shippingHeader['salesOrderCustomsInfo']['masterCompanyId'] = this.salesOrder['masterCompanyId'];
        //this.shippingHeader['salesOrderCustomsInfo']['masterCompanyId'] = 1;
        this.shippingHeader['createdBy'] = this.userName;
        this.shippingHeader['updatedBy'] = this.userName;
        this.shippingHeader['createdDate'] = new Date().toDateString();
        this.shippingHeader['updatedDate'] = new Date().toDateString();
        //this.shippingHeader['salesOrderCustomsInfo']['createdDate'] = new Date().toDateString();
        //this.shippingHeader['salesOrderCustomsInfo']['updatedDate'] = new Date().toDateString();
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

    get currentUserMasterCompanyId(): number {
        return this.authService.currentUser
          ? this.authService.currentUser.masterCompanyId
          : null;
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

    setOriginToAddress(value) {
        this.orignSiteNames.forEach(site => {
            if (site.originSiteId == value) {
                this.shippingHeader['originSiteId'] = site.originSiteId;
                this.shippingHeader['originName'] = site.originName;
                this.shippingHeader['originAddress1'] = site.originAddress1;
                this.shippingHeader['originAddress2'] = site.originAddress2;
                this.shippingHeader['originCity'] = site.originCity;
                this.shippingHeader['originState'] = site.originState;
                this.shippingHeader['originZip'] = site.originZip;
                // this.shippingHeader['shipToCountryId'] = site.countryId;
                // this.shippingHeader['shipToSiteName'] = site.siteName;
                this.shippingHeader['originCountryName'] = site.originCountryName;
                this.shippingHeader['originCountryId'] = site.originCountryId;
            }
        });
    }

    sourceSOApproval: any = {};
    shipToAddress: any = {};
    billToAddress: any = {};
    shipvia:any={};

    getAddressById(salesOrderId) {
        this.isSpinnerVisible = true;
        this.commonService.getAddressById(salesOrderId, AddressTypeEnum.SalesOrder, AppModuleEnum.SalesOrder).subscribe(res => {
            this.sourceSOApproval = {
                shipToPOAddressId: res[0].ShipToPOAddressId,
                shipToUserTypeId: res[0].ShipToUserType,
                shipToSiteId: res[0].ShipToSiteId,
                shipToSiteName: res[0].ShipToSiteName,
                shipToUserId: res[0].ShipToUserId,
                shipAddIsPoOnly: res[0].ShipAddIsPoOnly,
                shipToContactId: res[0].ShipToContactId,
                shipToContact: res[0].ShipToContact,
                shipToMemo: res[0].ShipToMemo,
                shipToAddressId: res[0].ShipToAddressId,
                shipToAddress1: res[0].ShipToAddress1,
                shipToAddress2: res[0].ShipToAddress2,
                shipToCity: res[0].ShipToCity,
                shipToStateOrProvince: res[0].ShipToState,
                shipToPostalCode: res[0].ShipToPostalCode,
                shipToCountryId: res[0].ShipToCountryId ? getObjectByValue('value', res[0].ShipToCountryId, this.countryList) : 0,
                shipToCountry: res[0].ShipToCountryName,
                soShipViaId: res[0].POShipViaId,
                billToPOAddressId: res[0].BillToPOAddressId,
                billToUserTypeId: res[0].BillToUserType,
                billToUserId: res[0].BillToUserId,
                billToSiteId: res[0].BillToSiteId,
                billToSiteName: res[0].BillToSiteName,
                billAddIsPoOnly: res[0].BillAddIsPoOnly,
                billToContactId: res[0].BillToContactId,
                billToContactName: res[0].BillToContactName,
                billToMemo: res[0].BillToMemo,
                billToAddressId: res[0].BillToAddressId,
                billToAddress1: res[0].BillToAddress1,
                billToAddress2: res[0].BillToAddress2,
                billToCity: res[0].BillToCity,
                billToStateOrProvince: res[0].BillToState,
                billToPostalCode: res[0].BillToPostalCode,
                billToCountryId: res[0].BillToCountryId ? getObjectByValue('value', res[0].BillToCountryId, this.countryList) : 0,
                billToCountry: res[0].BillToCountryName,
                shippingViaId: res[0].ShippingViaId,
                shipViaId: res[0].ShipViaId,
                shipVia: res[0].ShipVia,
                shippingCost: formatNumberAsGlobalSettingsModule(res[0].ShippingCost, 2),
                handlingCost: formatNumberAsGlobalSettingsModule(res[0].HandlingCost, 2),
                shippingAccountNo: res[0].ShippingAccountNo
            };

            this.shipToAddress = {
                contact: this.sourceSOApproval.shipToContact,
                contactId: this.sourceSOApproval.shipToContactId,
                userId: this.sourceSOApproval.shipToUserId,
                siteId: this.sourceSOApproval.shipToSiteId,
                address1: this.sourceSOApproval.shipToAddress1,
                address2: this.sourceSOApproval.shipToAddress2,
                city: this.sourceSOApproval.shipToCity,
                stateOrProvince: this.sourceSOApproval.shipToStateOrProvince,
                country: this.sourceSOApproval.shipToCountry,
                countryId: getValueFromObjectByKey('value', this.sourceSOApproval.shipToCountryId),
                postalCode: this.sourceSOApproval.shipToPostalCode,
            }

            this.billToAddress = {
                contact: this.sourceSOApproval.billToContact,
                contactId: this.sourceSOApproval.billToContactId,
                userId: this.sourceSOApproval.billToUserId,
                siteId: this.sourceSOApproval.billToSiteId,
                address1: this.sourceSOApproval.billToAddress1,
                address2: this.sourceSOApproval.billToAddress2,
                city: this.sourceSOApproval.billToCity,
                stateOrProvince: this.sourceSOApproval.billToStateOrProvince,
                country: this.sourceSOApproval.billToCountry,
                countryId: getValueFromObjectByKey('value', this.sourceSOApproval.billToCountryId),
                postalCode: this.sourceSOApproval.billToPostalCode,
            }

            this.shipvia = {
                shipviaId: this.sourceSOApproval.shipViaId,
                shipvia: this.sourceSOApproval.shipVia,
            }

            this.bindShippingInformation();
        });
    }

    bindShippingInformation() {
        if (this.billToAddress !== undefined) {
            let customer = getObjectByValue('userID', this.billToAddress.userId, this.customerNamesList);
            this.shippingHeader.soldToName = customer;
            this.setSiteNamesBySoldCustomerId(customer, this.billToAddress.siteId);
            //this.shippingHeader.soldToSiteId = this.billToAddress.siteId;
            this.shippingHeader.soldToAddress1 = this.billToAddress.address1;
            this.shippingHeader.soldToAddress2 = this.billToAddress.address2;
            this.shippingHeader.soldToCity = this.billToAddress.city;
            this.shippingHeader.soldToState = this.billToAddress.stateOrProvince;
            this.shippingHeader.soldToCountryName = this.billToAddress.country;
            this.shippingHeader.soldToZip = this.billToAddress.postalCode;
        }

        if (this.shipToAddress !== undefined) {
            let shipcustomer = getObjectByValue('userID', this.shipToAddress.userId, this.customerNamesList);
            this.shippingHeader.shipToCustomerId = shipcustomer;
            //this.shippingHeader.shipToSiteId = this.shipToAddress.siteId;
            this.setSiteNamesByShipCustomerId(shipcustomer, this.shipToAddress.siteId);
            this.shippingHeader.shipToAddress1 = this.shipToAddress.address1;
            this.shippingHeader.shipToAddress2 = this.shipToAddress.address2;
            this.shippingHeader.shipToCity = this.shipToAddress.city;
            this.shippingHeader.shipToState = this.shipToAddress.stateOrProvince;
            this.shippingHeader.shipToCountryName = this.shipToAddress.country;
            this.shippingHeader.shipToZip = this.shipToAddress.postalCode;
        }

        if (this.shipvia !== undefined) {
            this.shippingHeader.shipviaId = this.shipvia.shipviaId;
        }
        this.isSpinnerVisible = false;
    }

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

    shippingEdit(rowData,pickticketieminterface){
        const salesOrderShippingId = rowData.salesOrderShippingId;
        this.currSOPickTicketId = rowData.soPickTicketId;
        this.currQtyToShip = rowData.qtyShipped;
        this.partSelected = true;
        //this.modal = this.modalService.open(pickticketieminterface, { size: "lg", backdrop: 'static', keyboard: false });
        this.salesOrderService
          .getShippingEdit(salesOrderShippingId)
          .subscribe((response: any) => {
            this.isSpinnerVisible = false;
            this.shippingHeader = response[0];
            this.shippingHeader['openDate'] = new Date(this.shippingHeader['openDate']);
            let shiptocustomerobj = getObjectByValue('userID', this.shippingHeader.shipToCustomerId, this.customerNamesList);
            this.shippingHeader.shipToCustomerId = shiptocustomerobj;
            this.shippingHeader['shipToSiteId'] = this.shippingHeader.shipToSiteId;
            this.getSiteNamesByShipCustomerId(shiptocustomerobj);

            let soldtocustomerobj = getObjectByValue('userName', this.shippingHeader.soldToName, this.customerNamesList);
            this.shippingHeader.soldToName = soldtocustomerobj;
            this.shippingHeader['soldToSiteId'] = this.shippingHeader.soldToSiteId;
            this.getSiteNamesBySoldCustomerId(soldtocustomerobj);
          }, error => {
            this.isSpinnerVisible = false;
          });
      }

      ngOnDestroy(){
        this.partSelected = false;
      }

      addressFormForBilling = new CustomerShippingModel();
      lstfilterBillingSite: any[];
      billingSieListOriginal: any[];
      billToSite: any;
      changeName: boolean = false;
      isSiteNameAlreadyExists: boolean = false;
      editSiteName: string = '';
      billAddbutton: boolean = false;
      isEditModeBilling: boolean = false;
      countriesList: any = [];

      filterBillingSite(event) {
        this.lstfilterBillingSite = this.billingSieListOriginal;
    
        if (event.query !== undefined && event.query !== null) {
            const billingSite = [...this.billingSieListOriginal.filter(x => {
                return x.siteName.toLowerCase().includes(event.query.toLowerCase())
            })]
            this.lstfilterBillingSite = billingSite;
        }
      }

      checkSiteNameSelect() {
        //if(this.isEditModeBillingPoOnly == false && this.isEditModeBilling == false) {
        if(this.isEditModeBilling == false) {
            this.isSiteNameAlreadyExists = true;
            this.billAddbutton = false;} 
        else {
                if(this.editSiteName  != editValueAssignByCondition('siteName', this.addressFormForBilling.siteName))
                {
                    this.isSiteNameAlreadyExists = true;
                    this.billAddbutton = false;
                }else
                {
                    this.isSiteNameAlreadyExists = false;
                    this.billAddbutton = true;
                }
        
            }
        }

        checkSiteNameExist(value) {
            // if(this.isEditModeBillingPoOnly == false && this.isEditModeBilling == false) {
            // this.changeName = true;
            // this.isSiteNameAlreadyExists = false;
            // this.billAddbutton = true;
            // if (value != undefined && value != null ) {
            //     if(this.billingSieListOriginal && this.billingSieListOriginal.length !=0){
            //     for (let i = 0; i < this.billingSieListOriginal.length; i++) {
            //         if ((this.addressFormForBilling.siteName == this.billingSieListOriginal[i].siteName 
            //             || value.toLowerCase() == this.billingSieListOriginal[i].siteName.toLowerCase())
            //             && this.addressFormForBilling.siteName != '') {
            //             this.isSiteNameAlreadyExists = true;
            //             this.billAddbutton = false;
            //             return;
            //         }
            //     }
            // }
            // }}
            // else {
                this.changeName = true;
                this.isSiteNameAlreadyExists = false;
                this.billAddbutton = true;
                if (value != undefined && value != null && value != this.editSiteName) {
                    if(this.billingSieListOriginal && this.billingSieListOriginal.length !=0){
                    for (let i = 0; i < this.billingSieListOriginal.length; i++) {
                        if ((this.addressFormForBilling.siteName == this.billingSieListOriginal[i].siteName 
                            || value.toLowerCase() == this.billingSieListOriginal[i].siteName.toLowerCase())
                            && this.addressFormForBilling.siteName != '') {
                            this.isSiteNameAlreadyExists = true;
                            this.billAddbutton = false;
                            return;
                        }
                    }
                }
                }}
        //}

        billAddChange(){
            this.billAddbutton = true;
        }

        onClickBillSiteName(value, data?){
			this.resetAddressBillingForm();
			if (value === 'Add') {
				//this.addressSiteNameHeader = 'Add Ship To ' + this.billingingModuleName +' Details';
				this.billAddbutton =  true;
				this.editSiteName = '';
				//this.isEditModeBillingPoOnly = false;
				this.isEditModeBilling = false;	
			}
			// if (value === 'Edit') {
				
			// 	this.addressSiteNameHeader = 'Edit Ship To ' + this.billingingModuleName +' Details';
			// 	this.billAddbutton =  false;				
			// 	if(this.sourcePoApproval.billAddIsPoOnly) 
			// 		this.isEditModeBillingPoOnly = true;
			// 	else
			// 		this.isEditModeBilling = true;	
            //         if(this.billToAddressList && this.billToAddressList.length!=0){
			// 		for(let i=0; i < this.billToAddressList.length; i++ ) {
			// 			if(this.billToAddressList[i].siteID == this.sourcePoApproval.billToSiteId ) {
			// 				this.addressFormForBilling.isPrimary = this.billToAddressList[i].isPrimary;								
			// 				this.addressFormForBilling.siteId = this.billToAddressList[i].siteID;	
			// 				this.editSiteName = this.billToAddressList[i].siteName;
			// 				this.addressFormForBilling.siteName = getObjectByValue('siteName',this.billToAddressList[i].siteName, this.billingSieListOriginal);
			// 				this.addressFormForBilling.addressID = this.billToAddressList[i].addressId;
			// 				this.addressFormForBilling.address1 = this.billToAddressList[i].address1;
			// 				this.addressFormForBilling.address2 = this.billToAddressList[i].address2;
			// 				this.addressFormForBilling.city =  this.billToAddressList[i].city;
			// 				this.addressFormForBilling.stateOrProvince = this.billToAddressList[i].stateOrProvince;
			// 				this.addressFormForBilling.postalCode = this.billToAddressList[i].postalCode;
			// 				this.addressFormForBilling.countryId= getObjectByValue('value',this.billToAddressList[i].countryId ,this.allCountriesList);
			// 				return;
			// 			} 
			// 		}
			// 	}				
			// }
        }
        
        filterCountries(event) {
            this.countriesList = this.countryList;
            if (event.query !== undefined && event.query !== null) {
                const countries = [...this.countryList.filter(x => {
                    return x.label.toLowerCase().includes(event.query.toLowerCase())
                })]
                this.countriesList = countries;
            }
        }

        saveBillingAddress() {
			const data = {
				...this.addressFormForBilling,
				createdBy: this.userName,
				updatedBy: this.userName,
				masterCompanyId: this.currentUserMasterCompanyId,
				isActive: true,
			}		
			const addressData = { ...data, 
									  siteName: editValueAssignByCondition('siteName', data.siteName),									 
									  userTypeId: AppModuleEnum.Customer, 
									  userId: this.billToUserId, 
									  countryId: getValueFromObjectByKey('value', data.countryId),
									  addressType: 'Bill' 
									}
			
			if (!this.isEditModeBilling) {
				 this.commonService.createAllAddres(addressData).subscribe(response => {  
					 if(response) {
                        //this.onBillToSelected(this.sourcePoApproval.billToUserId,0,0,response);                   			
                        let soldtocustomerobj = getObjectByValue('userID', this.shippingHeader.soldToName.userID, this.customerNamesList);
                        this.shippingHeader.soldToName = soldtocustomerobj;
                        this.setSiteNamesBySoldCustomerId(soldtocustomerobj,response);
						 this.alertService.showMessage(
							 'Success',
							 `Saved Shipping Information Successfully`,
							 MessageSeverity.success
						 );}else {
							this.alertService.showMessage(
								'Error',
								`Eroor While Saving Shipping Address`,
								MessageSeverity.error
							);
						 }
					 },err => {
						 this.isSpinnerVisible = false;
						 const errorLog = err;
						 //this.errorMessageHandler(errorLog);		
					});
				} else {
					 this.commonService.createAllAddres(addressData).subscribe(response => {  
						if(response) {
						//this.onBillToSelected(this.sourcePoApproval.billToUserId,0,0,response);						         			
						 this.alertService.showMessage(
							 'Success',
							 `Shipping Information Updated Successfully`,
							 MessageSeverity.success
						 ); }else {
							this.alertService.showMessage(
								'Error',
								`Eroor While Saving Shipping Address`,
								MessageSeverity.error
							);
						 }
					 },err => {
						 this.isSpinnerVisible = false;
						 const errorLog = err;
						 //this.errorMessageHandler(errorLog);		
					});
			     }
        }
        
        resetAddressBillingForm() {
			this.addressFormForBilling = new CustomerShippingModel();
			this.isEditModeBilling = false;
        }
        
        addressFormForShipping = new CustomerShippingModel();
        lstfilterShippingSite: any[];
        shippingSieListOriginal: any[];
        shipToSite: any;
        //changeName: boolean = false;
        isShippingSiteNameAlreadyExists: boolean = false;
        //editSiteName: string = '';
        ShipAddbutton: boolean = false;
        isEditModeShipping: boolean = false;

        filterShippingSite(event) {
            this.lstfilterShippingSite = this.shippingSieListOriginal;
            if (event.query !== undefined && event.query !== null) {
                const shippingSite = [...this.shippingSieListOriginal.filter(x => {
                    return x.siteName.toLowerCase().includes(event.query.toLowerCase())
                })]
                this.lstfilterShippingSite = shippingSite;	
            }
        }

        checkShippingSiteNameSelect() {
            //if(this.isEditModeShippingPoOnly == false && this.isEditModeShipping == false) {
            if(this.isEditModeShipping == false) {
                this.isShippingSiteNameAlreadyExists = true;
                this.ShipAddbutton = false;}
                else {
                    if(this.editSiteName  != editValueAssignByCondition('siteName', this.addressFormForShipping.siteName))
                    {
                        this.isShippingSiteNameAlreadyExists = true;
                        this.ShipAddbutton = false;
                    }else
                    {
                        this.isShippingSiteNameAlreadyExists = false;
                        this.ShipAddbutton = true;
                    }
                }
        }

        checkShippingSiteNameExist(value) {
            if(this.isEditModeShipping == false) {
            this.changeName = true;
            this.isShippingSiteNameAlreadyExists = false;
            this.ShipAddbutton = true;
            if (value != undefined && value != null ) {
                if(this.shippingSieListOriginal && this.shippingSieListOriginal.length !=0){
                for (let i = 0; i < this.shippingSieListOriginal.length; i++) {
                    if ((this.addressFormForShipping.siteName == this.shippingSieListOriginal[i].siteName 
                        || value.toLowerCase() == this.shippingSieListOriginal[i].siteName.toLowerCase())
                        &&  this.addressFormForShipping.siteName !=  '') {
                        this.isShippingSiteNameAlreadyExists = true;
                        this.ShipAddbutton = false;
                        return;
                    }
                }
            }
            }
            }else {
                this.changeName = true;
            this.isShippingSiteNameAlreadyExists = false;
            this.ShipAddbutton = true;
            if (value != undefined && value != null && value != this.editSiteName) {
                if(this.shippingSieListOriginal && this.shippingSieListOriginal.length !=0){
                for (let i = 0; i < this.shippingSieListOriginal.length; i++) {
                    if ((this.addressFormForShipping.siteName == this.shippingSieListOriginal[i].siteName 
                        || value.toLowerCase() == this.shippingSieListOriginal[i].siteName.toLowerCase())
                        &&  this.addressFormForShipping.siteName !=  '') {
                        this.isShippingSiteNameAlreadyExists = true;
                        this.ShipAddbutton = false;
                        return;
                    }
                }
            }
            }
          }
        }

        shipAddChange(){
            this.ShipAddbutton = true;
        }

        onClickShipSiteName(value, data?){			
			this.resetAddressShippingForm();
			if (value === 'Add') {
				//this.addressSiteNameHeader = 'Add Ship To ' + this.shippingModuleName +' Details';
				this.ShipAddbutton = true;
				this.editSiteName = '';
				//this.isEditModeShippingPoOnly = false;
				this.isEditModeShipping = false;	
			}
			// if (value === 'Edit') {
			// 	this.ShipAddbutton = false;
			// 	this.addressSiteNameHeader = 'Edit Ship To ' + this.shippingModuleName +' Details';				
			// 	if(this.sourcePoApproval.shipAddIsPoOnly) 
			// 		this.isEditModeShippingPoOnly = true;
			// 	else
			// 		this.isEditModeShipping = true;		
			// 		if(this.shipToAddressList && this.shipToAddressList.length!=0){
			// 	for(let i=0; i < this.shipToAddressList.length; i++ ) {
			// 			if(this.shipToAddressList[i].siteID == this.sourcePoApproval.shipToSiteId ) {
			// 				this.addressFormForShipping.isPrimary = this.shipToAddressList[i].isPrimary;								
			// 				this.addressFormForShipping.siteId = this.shipToAddressList[i].siteID;	
			// 				this.editSiteName = this.shipToAddressList[i].siteName;
			// 				this.addressFormForShipping.siteName = getObjectByValue('siteName',this.shipToAddressList[i].siteName, this.shippingSieListOriginal); 
			// 				this.addressFormForShipping.addressID = this.shipToAddressList[i].addressId;							
			// 				this.addressFormForShipping.address1 = this.shipToAddressList[i].address1;
			// 				this.addressFormForShipping.address2 = this.shipToAddressList[i].address2;
			// 				this.addressFormForShipping.city =  this.shipToAddressList[i].city;
			// 				this.addressFormForShipping.stateOrProvince = this.shipToAddressList[i].stateOrProvince;
			// 				this.addressFormForShipping.postalCode = this.shipToAddressList[i].postalCode;
			// 				this.addressFormForShipping.countryId= getObjectByValue('value',this.shipToAddressList[i].countryId ,this.allCountriesList);
			// 				return;
			// 			} 
			// 		}		
			
			// 		}
			// 	}
        }
        
        resetAddressShippingForm() {
			this.addressFormForShipping = new CustomerShippingModel();
			this.isEditModeShipping = false;
		}
        
        saveShippingAddress() {
			const data = {
				...this.addressFormForShipping,
				createdBy: this.userName,
				updatedBy: this.userName,
				masterCompanyId: this.currentUserMasterCompanyId,
				isActive: true,
			}		
			const addressData = { ...data, 									 
                                      userTypeId: AppModuleEnum.Customer,
                                      userId: this.shipToUserId,
									  siteName: editValueAssignByCondition('siteName', data.siteName),  
									  countryId: getValueFromObjectByKey('value', data.countryId) 
									}
			
			if (!this.isEditModeShipping) {
				 this.commonService.createAllAddres(addressData).subscribe(response => {  
					 if(response) {
                        //this.onShipToSelected(this.sourcePoApproval.shipToUserId,0,0,response);                   			
                        let shiptocustomerobj = getObjectByValue('userID', this.shippingHeader.shipToCustomerId.userID, this.customerNamesList);
                        this.shippingHeader.shipToCustomerId = shiptocustomerobj;
                        //this.shippingHeader['shipToSiteId'] = this.shippingHeader.shipToSiteId;
                        this.setSiteNamesByShipCustomerId(shiptocustomerobj,response);
						 this.alertService.showMessage(
							 'Success',
							 `Saved Shipping Information Successfully`,
							 MessageSeverity.success
						 ); }
						 else {
							this.alertService.showMessage(
								'Error',
								`Eroor While Saving Shipping Address`,
								MessageSeverity.error
							);
						 }
					 },err => {
						 this.isSpinnerVisible = false;
						 const errorLog = err;
						 //this.errorMessageHandler(errorLog);		
					});
				} else {
					 this.commonService.createAllAddres(addressData).subscribe(response => {  
						 if(response) {
						//this.onShipToSelected(this.sourcePoApproval.shipToUserId,0,0,response);						         			
						 this.alertService.showMessage(
							 'Success',
							 `Shipping Information Updated Successfully`,
							 MessageSeverity.success
						 );}else {
							this.alertService.showMessage(
								'Error',
								`Eroor While Saving Shipping Address`,
								MessageSeverity.error
							);
						 }
					 },err => {
						 this.isSpinnerVisible = false;
						 const errorLog = err;
						 //this.errorMessageHandler(errorLog);		
					});
			     }
		}
}