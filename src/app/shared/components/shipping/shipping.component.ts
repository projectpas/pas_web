import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { CustomerService } from '../../../services/customer.service';
import { CommonService } from '../../../services/common.service';
import { WorkOrderService } from '../../../services/work-order/work-order.service';
import { AddressModel } from '../../../models/address.model';
import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { AuthService } from '../../../services/auth.service';
import { editValueAssignByCondition } from '../../../generic/autocomplete';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SalesOrderMultiPackagingLabelComponent } from 'src/app/components/sales/order/sales-order-multi-Packaging-Label/sales-order-multi-packaging-label.component';
import { SalesMultiShippingLabelComponent } from 'src/app/components/sales/order/sales-order-multi-shipping-label/sales-order-multi-shipping-label.component';

@Component({
    selector: 'app-shipping',
    templateUrl: './shipping.component.html',
    styleUrls: ['./shipping.component.scss']
})
export class ShippingComponent implements OnInit {
    @Input() customerId = 0;
    @Input() workOrderGeneralInformation;
    @Input() workOrderPartNumberId: any = 0;
    @Input() isView: boolean = false;
    @Input() managementStructureId: any;
    quoteForm: any = {};
    orignSiteNames: any = [];
    validFor: any;
    expirationDate: any;
    quoteDueDate: any;
    customerNamesList: any;
    id: number;
    CustomerId: number;
    customerListOriginal: any;
    customerallListOriginal: any;;
    arrayCustlist: any[] = [];
    packagingSlips : any[]=[];
    shippingLabels : any[]=[];
    customerNames: { customerId: any; name: any; }[];
    soldCustomerAddress: any = new AddressModel();
    shipCustomerAddress: any = new AddressModel();
    addCustomerInfo: boolean = false;
    isMultipleSelected: boolean = false;
    customerDetails:any;
    workOrderPartId:number;
    woShippingId:number;
    woPickTicketId : number;
    packagingSlipId; number
    modal: NgbModalRef;
    shippingHeader: any = {
        "workOrderShippingId": 0,
        "woShippingStatusId": 1,
        "openDate": new Date(),
        "shipDate": new Date(),
        "isActive": true,
        "isDeleted": false,
        "workOrderCustomsInfo": {
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
    siteList: any = [];
    moduleName: any = 'Shipping';
    isSpinnerVisible: boolean = false;
    allWeightUnitOfMeasureInfo: any = [];
    shipUsertype: number = 0;
    workOrderId: number = 0;
    soldCustomerSiteList = [];
    soldCustomerShippingOriginalData: any[];
    billingSieListOriginal: any[];
    billToSite: any;
    shippingSieListOriginal: any[];
    shipToSite: any;
    headers = [];
    selectedColumns;
    workorderpackage: boolean = false;
    workordershipping: boolean = false;
    workordersinglepacking: boolean = false;
    workordersingleshipping: boolean = false;
    isEditModeAdd: boolean = false;
    partSelected = false;
    disableGeneratePackagingBtn: boolean = true;
    isViewShipping: boolean = false;
    currwOPickTicketId: number;
    currQtyToShip: number;

    constructor(public customerService: CustomerService, private commonService: CommonService,
        private workorderService: WorkOrderService, private alertService: AlertService, private authService: AuthService,private modalService: NgbModal) {
    }

    ngOnInit(): void {
        this.disableGeneratePackagingBtn = true;
        if (this.workOrderGeneralInformation) {
            this.workOrderId = this.workOrderGeneralInformation.workOrderId;
            this.CustomerId = this.workOrderGeneralInformation['customerDetails']['customerId'];
        }
        this.initColumns();
        this.getShippingList();
        this.getShipVia();
        this.getCountriesList();
        this.getShippingData();
        this.loadcustomerData('');
        this.getUnitOfMeasure();

        if (this.workOrderGeneralInformation) {
            this.workOrderId = this.workOrderGeneralInformation.workOrderId;
            this.CustomerId = this.workOrderGeneralInformation.customerId;
        }

        if (this.workOrderGeneralInformation) {
            this.shippingHeader['soldToName'] = this.workOrderGeneralInformation['customerDetails']['customerName'];
            this.shippingHeader['shipToName'] = this.workOrderGeneralInformation['customerDetails']['customerName'];
            this.shippingHeader['customerId'] = this.workOrderGeneralInformation['customerDetails']['customerId'];
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.managementStructureId != undefined) {
            this.getOriginSiteNames();
        }
    }

    initColumns() {
        this.headers = [
            { field: "workOrderNumber", header: "WO Num", width: "100px" },
            { field: "partNumber", header: "PN", width: "100px" },
            { field: "partDescription", header: "PN Description", width: "100px" },
            { field: "qtyToShip", header: "Qty Picked", width: "65px" },
            { field: "qtyShipped", header: "Qty Shipped", width: "65px" },
            { field: "qtyRemaining", header: "Qty Remaining", width: "90px" },
            { field: "status", header: "Status", width: "90px" },
        ];
        this.selectedColumns = this.headers;
    }

    shippingList: any[] = [];
    getShippingList() {
        this.isSpinnerVisible = true;
        this.workorderService
            .getShippingDataList(this.workOrderId)
            .subscribe((response: any) => {
                this.isSpinnerVisible = false;
                this.shippingList = response[0];
                this.checkIsChecked();
            }, error => {
                this.isSpinnerVisible = false;
            });
    }

    checked(evt, ship) {
        ship.selected = evt.target.checked;
        this.checkIsChecked();
    }
    generatePackagingSlip() {
        let packagingSlipItems: PackagingSlipItems[] = [];

        this.shippingList.filter(a => {
            for (let i = 0; i < a.woshippingchildviewlist.length; i++) {
                if (a.woshippingchildviewlist[i].selectedToGeneratePackaging == true) {
                    if (a.woshippingchildviewlist[i].packagingSlipId === undefined || a.woshippingchildviewlist[i].packagingSlipId == 0) {
                        var p = new PackagingSlipItems;
                        p.WOPickTicketId = a.woshippingchildviewlist[i].wOPickTicketId;
                        p.currQtyToShip = a.woshippingchildviewlist[i].qtyToShip;
                        p.WOPartNoId = a.woshippingchildviewlist[i].workOrderPartId;
                        p.WorkOrderId = this.workOrderId;
                        p.masterCompanyId = this.currentUserMasterCompanyId;
                        p.createdBy = this.userName;
                        p.updatedBy = this.userName;
                        p.createdDate = new Date().toDateString();
                        p.updatedDate = new Date().toDateString();

                        packagingSlipItems.push(p);
                    }
                }
            }
        });
        this.isSpinnerVisible = true;

        this.workorderService.generatePackagingSlip(packagingSlipItems)
            .subscribe(
                (res: any) => {
                    this.isSpinnerVisible = false;
                    this.isEditModeAdd = false;

                    this.alertService.showMessage(
                        'Sales Order',
                        'Packaging Slip created Succesfully',
                        MessageSeverity.success
                    );
                    this.partSelected = false;
                    this.getShippingList();
                    this.disableGeneratePackagingBtn = true;
                }, err => {
                    this.isSpinnerVisible = false;
                });
    }
printSelectedPackagingSlip()
{
   this.workorderpackage=true;

    let packagingSlipsToPrint: MultiPackagingSlips[] = [];
        this.shippingList.forEach(a => {
            a.woshippingchildviewlist.forEach(ele => {
                if (ele.selectedToGeneratePackaging && ele.packagingSlipId > 0) {
                    var items = new MultiPackagingSlips;
                    items.WorkOrderId = ele.workOrderId;
                    items.WOPartNoId = ele.workOrderPartId;
                    items.WOPickTicketId = ele.woPickTicketId;
                    items.PackagingSlipId = ele.packagingSlipId;

                    packagingSlipsToPrint.push(items);
                }
            });
        });

        let packagingSlips1: any[] = [];

        packagingSlips1 = packagingSlipsToPrint;
        //const packagingSlip

        this.packagingSlips =[];
        this.packagingSlips =[...packagingSlips1];
        console.log(this.packagingSlips);
        // this.modal = this.modalService.open(SalesOrderMultiPackagingLabelComponent, { size: "lg" });
        // let instance: SalesOrderMultiPackagingLabelComponent = (<SalesOrderMultiPackagingLabelComponent>this.modal.componentInstance)
        // instance.modalReference = this.modal;

        // instance.onConfirm.subscribe($event => {
        //     if (this.modal) {
        //         this.modal.close();
        //     }
        // });

        // instance.packagingSlips = packagingSlips;
}

printSelectedShippingLabel()
{
    this.workordershipping=true;

    let shippingItemsToPrint: MultiShippingLabels[] = [];
    this.shippingList.forEach(a => {
        a.woshippingchildviewlist.forEach(ele => {
            if (ele.selectedToGeneratePackaging) {
                var items = new MultiShippingLabels;
                items.WorkOrderId = ele.workOrderId;
                items.WOPartNoId = ele.workOrderPartId;
                items.WOShippingId = ele.workOrderShippingId;

                shippingItemsToPrint.push(items);
            }
        });
    });

    let shippingLabels1: any[] = [];

    //shippingLabels['shippingLabels'] = shippingItemsToPrint;

    this.shippingLabels =[];
        this.shippingLabels =[...shippingLabels1];
        console.log(this.shippingLabels);

    // this.modal = this.modalService.open(SalesMultiShippingLabelComponent, { size: "lg" });
    // let instance: SalesMultiShippingLabelComponent = (<SalesMultiShippingLabelComponent>this.modal.componentInstance)
    // instance.modalReference = this.modal;

    // instance.onConfirm.subscribe($event => {
    //     if (this.modal) {
    //         this.modal.close();
    //     }
    // });

    // instance.salesshippingLabels = shippingLabels;
}

PerformShipping()
{
    this.clearData();
    this.isViewShipping = false;
    this.isMultipleSelected = true;
    this.partSelected = true;
    this.bindData();
}

printShippingLabel(rowData: any) {
    this.workordersingleshipping=true;
    this.workOrderId = rowData.workOrderId;
    this.workOrderPartId = rowData.workOrderPartId;
    this.woShippingId = rowData.workOrderShippingId;
}

printPackagingLabel(rowData: any) 
{
    this.workordersinglepacking=true;
    this.workOrderId = rowData.workOrderId;
    this.workOrderPartId = rowData.workOrderPartId;
    this.woPickTicketId = rowData.woPickTicketId;
    this.packagingSlipId = rowData.packagingSlipId;
}

onSelectPartNumber(rowData) {
    this.currwOPickTicketId = rowData.woPickTicketId;
    this.currQtyToShip = rowData.qtyToShip;
    this.workOrderPartId = rowData.workOrderPartId;
    this.partSelected = true;
    this.isMultipleSelected = false;
    this.isViewShipping = false;
    this.clearData();
    this.bindData();
}

bindData() {
    this.getShippingList();
    this.getShipVia();
    this.getCountriesList();
    this.getOriginSiteNames();
    this.getUnitOfMeasure();
    //this.getAddressById(this.salesOrderId);

    if (this.customerDetails) {
        this.shippingHeader['soldToName'] = this.customerDetails['name'];
        this.shippingHeader['shipToName'] = this.customerDetails['name'];
        this.shippingHeader['customerId'] = this.customerDetails['customerId'];
    }
    this.shippingHeader['soShippingNum'] = 'Creating';
}

clearData() {
    this.clearShipToAddress();
    //this.clearOriginAddress();
    this.clearSoldToAddress();
    this.isEditModeAdd = false;
    this.shippingHeader.airwayBill = '';
    this.shippingHeader.weight = 0;
    this.shippingHeader.shipWeight = 0;
    this.shippingHeader.shipWeightUnit = 0;
    this.shippingHeader.shipSizeLength = 0;
    this.shippingHeader.shipSizeWidth = 0;
    this.shippingHeader.shipSizeHeight = 0;
    this.shippingHeader.shipSizeUnitOfMeasureId = 0;
    this.shippingHeader.salesOrderShippingId = 0;
    this.shippingHeader['salesOrderCustomsInfo']['entryType'] = '';
    this.shippingHeader['salesOrderCustomsInfo']['entryNumber'] = '';
    this.shippingHeader['salesOrderCustomsInfo']['commodityCode'] = '';
    this.shippingHeader['salesOrderCustomsInfo']['epu'] = '';
    this.shippingHeader['salesOrderCustomsInfo']['ucr'] = '';
    this.shippingHeader['salesOrderCustomsInfo']['masterUCR'] = '';
    this.shippingHeader['salesOrderCustomsInfo']['movementRefNo'] = '';
    this.shippingHeader['salesOrderCustomsInfo']['customsValue'] = '';
    this.shippingHeader['salesOrderCustomsInfo']['netMass'] = '';
    this.shippingHeader['salesOrderCustomsInfo']['vatValue'] = '';
    this.shippingHeader['salesOrderCustomsInfo']['salesOrderCustomsInfoId'] = 0;
    this.addCustomerInfo = false;
}

AddCustomInfo() {
    this.addCustomerInfo = !this.addCustomerInfo;
}
checkedToGenerate(evt, ship) {
    ship.selectedToGeneratePackaging = evt.target.checked;
    this.checkIsCheckedToGenerate();
}
    disableCreateShippingBtn: boolean = true;
    checkIsChecked() {
        this.shippingList.forEach(a => {
            a.woshippingchildviewlist.forEach(ele => {
                if (ele.selected)
                    this.disableCreateShippingBtn = false;
                else
                    this.disableCreateShippingBtn = true;
            });
        });
    }
    checkIsCheckedToGenerate() {
        var keepGoing = true;
        this.shippingList.forEach(a => {
            a.woshippingchildviewlist.forEach(ele => {
                if (keepGoing) {
                    if (ele.selectedToGeneratePackaging) {
                        this.disableGeneratePackagingBtn = false;
                        keepGoing = false;
                    }
                    else
                        this.disableGeneratePackagingBtn = true;
                }
            });
        });
    }


    getOriginSiteNames() {
        this.orignSiteNames = [];
        this.commonService.getSitesbymanagementstructrue(this.managementStructureId).subscribe(res => {
            if (res && res.length > 0) {

                this.orignSiteNames = res;
                console.log("this.orignnames", this.orignSiteNames[0])
            }
        }, err => {
            this.errorHandling(err);
        });
    }

    getCustomerNameList() {
        this.commonService.getCustomerNameandCode("", 1).subscribe(res => {
            this.customerNamesList = res;
        }, err => {
            this.errorHandling(err);
        });
    }

    getShipVia() {
        this.commonService.smartDropDownList('ShippingVia', 'ShippingViaId', 'Name')
            .subscribe(
                (res) => {
                    this.shipViaList = res;
                }, err => {
                    this.errorHandling(err);
                });
    }

    getUnitOfMeasure() {
        this.commonService.smartDropDownList('UnitOfMeasure', 'UnitOfMeasureId', 'shortName').subscribe((res) => {
            this.allWeightUnitOfMeasureInfo = res;
        }, err => {
        });
    }

    btnChange() {
        const isExportWeight = this.shippingHeader.shipWeight ? (this.shippingHeader.shipWeightUnit ? 1 : 0) : 1;
        const isEExportSize = this.shippingHeader.shipSizeLength || this.shippingHeader.shipSizeWidth || this.shippingHeader.shipSizeHeight ? (this.shippingHeader.shipSizeUnitOfMeasureId ? 1 : 0) : 1;
    }

    getSiteName(customerId, siteid) {
        const AddressType = 'Bill';
        const billUsertype = 1;

        this.commonService.getworkorderaddressdetailsbyuser(billUsertype, customerId, AddressType, siteid)
            .subscribe(
                res => {
                    this.siteList = res;
                    if (!this.shippingHeader.soldToSiteId) {
                        this.siteList.forEach(
                            x => {
                                if (x.isPrimary) {
                                    this.shippingHeader.soldToSiteId = x.siteID;

                                    this.setSoldToAddress();
                                }
                            }
                        )
                    }
                }, err => {
                    this.errorHandling(err);
                });
    }

    getCountriesList() {
        this.commonService.smartDropDownList('Countries', 'countries_id', 'nice_name')
            .subscribe(
                res => {
                    this.countryList = res;
                }, err => {
                    this.errorHandling(err);
                });
    }

    setShipToAddress() {
        this.shipCustomerSiteList.forEach(site => {
            if (site.siteID == this.shippingHeader.shipToSiteId) {
                this.shippingHeader['shipToAddress1'] = site.address1;
                this.shippingHeader['shipToAddress2'] = site.address2;
                this.shippingHeader['shipToCity'] = site.city;
                this.shippingHeader['shipToState'] = site.stateOrProvince;
                this.shippingHeader['shipToZip'] = site.postalCode;
                this.shippingHeader['shipToCountryId'] = site.countryId;
                this.shippingHeader['shipToSiteName'] = site.siteName;
                this.shippingHeader['shipToCountryName'] = site.country;
                this.shippingHeader['shipToCountryId'] = site.countryId;
            }
        });
    }

    setOriginToAddress(value) {
        console.log("orignsiteId", value)
        console.log("sitenames", this.orignSiteNames);
        this.orignSiteNames.forEach(site => {
            if (site.originSiteId == value) {
                this.shippingHeader['originName'] = site.originName;
                this.shippingHeader['originAddress1'] = site.originAddress1;
                this.shippingHeader['originAddress2'] = site.originAddress2;
                this.shippingHeader['originCity'] = site.originCity;
                this.shippingHeader['originState'] = site.originState;
                this.shippingHeader['originZip'] = site.originZip;
                this.shippingHeader['originCountryName'] = site.originCountryName;
                this.shippingHeader['originCountryId'] = site.originCountryId;
                console.log("shipping heder", this.shippingHeader)
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

    setSoldToAddress() {
        this.siteList.forEach(site => {
            if (site.siteID == this.shippingHeader.soldToSiteId) {
                this.shippingHeader['soldToAddress1'] = site.address1;
                this.shippingHeader['soldToAddress2'] = site.address2;
                this.shippingHeader['soldToCity'] = site.city;
                this.shippingHeader['soldToState'] = site.stateOrProvince;
                this.shippingHeader['soldToZip'] = site.postalCode;
                this.shippingHeader['soldToCountryId'] = site.countryId;
                this.shippingHeader['soldToSiteName'] = site.siteName;
                this.shippingHeader['soldToCountryName'] = site.country;
            }
        });
    }

    assignDetails(value) {
        if (value == true) {
            this.shippingHeader.shipToCustomerId = this.workOrderGeneralInformation['customerDetails'];
            this.getSiteNamesByShipCustomerId(this.workOrderGeneralInformation['customerDetails'], 0);
            this.shippingHeader['shipToSiteId'] = this.shippingHeader.soldToSiteId;
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
        const value = event.query.toLowerCase()
        this.commonService.getCustomerNameandCode(value, 1).subscribe(res => {
            this.customerNamesList = res;
        }, err => {
            this.errorHandling(err);
        });
    }

    async loadcustomerEditData(strText = '') {
        if (this.id > 0)
            this.arrayCustlist.push(this.id);
        if (this.arrayCustlist.length == 0) {
            this.arrayCustlist.push(0);
        }

        await this.commonService.autoSuggestionSmartDropDownList('Customer', 'CustomerId', 'Name', strText, true, 20, this.arrayCustlist.join(), this.currentUserMasterCompanyId).subscribe(response => {
            this.customerNamesList = response.map(x => {
                return {
                    customerName: x.label, customerId: x.value
                }
            })
        }, err => {
            this.isSpinnerVisible = false;
        });
    }

    filterCustomerNames(event) {
        if (event.query !== undefined && event.query !== null) {
            this.loadcustomerData(event.query);
        }
    }

    onselectcustomergetsite(object) {
        const { customerId } = object;
        this.getSiteNamesByShipCustomerId(customerId, 0);

    }
    async getSiteNamesByShipCustomerId(customerId, siteid) {
        this.clearShipToAddress();
        const AddressType = 'Ship';
        const billUsertype = 1;

        await this.commonService.getworkorderaddressdetailsbyuser(billUsertype, customerId, AddressType, siteid).subscribe(res => {
            if (res) {
                this.shipCustomerShippingOriginalData = res;
                this.shipCustomerSiteList = res;
                if (siteid > 0) {
                    this.shipCustomerShippingOriginalData.forEach(
                        x => {
                            if (x.siteID == siteid) {
                                this.shippingHeader.shipToSiteId = x.siteID;
                                this.setShipToAddress();
                            }
                        }
                    )
                } else {
                    this.shipCustomerShippingOriginalData.forEach(
                        x => {
                            if (x.isPrimary) {
                                this.shippingHeader.shipToSiteId = x.siteID;
                                this.setShipToAddress();
                            }
                        }
                    )
                }
            }
        }, err => {
            this.errorHandling(err);
        });
    }

    clearAddress(type, value) {
        if (value === '' && type === 'SoldTo') {
            this.soldCustomerAddress = new AddressModel();
        } else if (value === '' && type === 'ShipTo') {
            this.shipCustomerAddress = new AddressModel();
        }
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

    setSoldToAddresses() {
        this.soldCustomerSiteList.forEach(site => {
            if (site.siteID == Number(this.shippingHeader.soldToSiteId)) {
                this.shippingHeader['soldToAddress1'] = site.address1;
                this.shippingHeader['soldToAddress2'] = site.address2;
                this.shippingHeader['soldToCity'] = site.city;
                this.shippingHeader['soldToState'] = site.stateOrProvince;
                this.shippingHeader['soldToZip'] = site.postalCode;
                this.shippingHeader['soldToCountryId'] = site.countryId;
                this.shippingHeader['soldToSiteName'] = site.siteName;
                this.shippingHeader['soldToCountryName'] = site.country;
                this.shippingHeader['soldToCountryId'] = site.countryId;
            }
        });
    }

    getShippingData() {
        this.isSpinnerVisible = true;
        this.workorderService.getShippingForWorkOrderPart(this.workOrderPartNumberId)
            .subscribe(
                res => {
                    this.isSpinnerVisible = false;
                    if (res) {
                        if (!res['response']) {
                            this.getSiteNamesByShipCustomerId(res.shipToCustomerId, res.shipToSiteId);
                            this.getSiteName(this.workOrderGeneralInformation['customerDetails']['customerId'], res.soldToSiteId)
                            console.log('this.shipCustomerSiteList', this.shipCustomerSiteList);
                            this.shippingHeader = res;
                            this.shippingHeader['openDate'] = new Date(this.shippingHeader['openDate']);
                            this.shippingHeader['shipDate'] = new Date(this.shippingHeader['shipDate']);
                            this.shippingHeader['shipToCustomerId'] = { customerId: res.shipToCustomerId, customerName: res.shipToCustomer };
                            this.id = res.shipToCustomerId
                        }
                        else {
                            this.shippingHeader.shipToCustomerId = this.workOrderGeneralInformation['customerDetails'];
                            this.getSiteNamesByShipCustomerId(this.workOrderGeneralInformation['customerDetails']['customerId'], 0);
                            this.getSiteName(this.workOrderGeneralInformation['customerDetails']['customerId'], 0)
                        }
                    }
                }, err => {
                    this.isSpinnerVisible = false;
                    this.errorHandling(err);
                });
    }

    async getEditSiteData(customerId) {
        await this.customerService.getCustomerShipAddressGet(customerId).subscribe(res => {
            this.shipCustomerSiteList = res[0];
        }, err => {
            this.errorHandling(err);
        });
    }

    async loadcustomerData(strText = '') {
        if (this.id > 0)
            this.arrayCustlist.push(this.id);
        if (this.arrayCustlist.length == 0) {
            this.arrayCustlist.push(0);
        }

        await this.commonService.autoSuggestionSmartDropDownList('Customer', 'CustomerId', 'Name', strText, true, 20, this.arrayCustlist.join(), this.currentUserMasterCompanyId).subscribe(response => {
            this.customerNamesList = response.map(x => {
                return {
                    customerName: x.label, customerId: x.value
                }
            });
        }, err => {
            this.isSpinnerVisible = false;
        });
    }

    get currentUserMasterCompanyId(): number {
        return this.authService.currentUser
            ? this.authService.currentUser.masterCompanyId
            : null;
    }

    save() {
        this.shippingHeader['workOrderId'] = this.workOrderGeneralInformation['workOrderId'];
        this.shippingHeader['workOrderPartNoId'] = this.workOrderPartNumberId;
        this.shippingHeader['masterCompanyId'] = this.workOrderGeneralInformation['masterCompanyId'];
        this.shippingHeader['workOrderCustomsInfo']['masterCompanyId'] = this.workOrderGeneralInformation['masterCompanyId'];
        this.shippingHeader['createdBy'] = this.userName;
        this.shippingHeader['updatedBy'] = this.userName;
        this.shippingHeader['createdDate'] = new Date().toDateString();
        this.shippingHeader['updatedDate'] = new Date().toDateString();
        this.shippingHeader['workOrderCustomsInfo']['createdDate'] = new Date().toDateString();
        this.shippingHeader['workOrderCustomsInfo']['updatedDate'] = new Date().toDateString();
        this.shippingHeader['shipToCustomerId'] = editValueAssignByCondition('customerId', this.shippingHeader['shipToCustomerId']);
        this.isSpinnerVisible = true;
        this.workorderService.saveWorkOrderShipping(this.shippingHeader)
            .subscribe(
                res => {
                    this.isSpinnerVisible = false;
                    this.getEditSiteData(res.shipToCustomerId);
                    this.shippingHeader = res;
                    this.shippingHeader['openDate'] = new Date(this.shippingHeader['openDate']);
                    this.shippingHeader['shipDate'] = new Date(this.shippingHeader['shipDate']);
                    this.shippingHeader['shipToCustomerId'] = { customerId: res.shipToCustomerId, customerName: res.shipToCustomer };
                    this.customerNamesList.forEach(
                        x => {
                            if (x.customerId == res['shipToCustomerId']) {
                                this.shippingHeader['shipToCustomerId'] = x;
                            }
                        }
                    )
                    this.alertService.showMessage(
                        'Work Order',
                        'Work Order Shipping created Succesfully',
                        MessageSeverity.success
                    );
                    this.getShippingData();
                }, err => {
                    this.isSpinnerVisible = false;
                    this.errorHandling(err)
                });
    }

    errorHandling(err) {
        if (err['error']['errors']) {
            err['error']['errors'].forEach(x => {
                this.alertService.showMessage(
                    this.moduleName,
                    x['message'],
                    MessageSeverity.error
                );
            })
        }
        else {
            this.alertService.showMessage(
                this.moduleName,
                'Saving data Failed due to some input error',
                MessageSeverity.error
            );
        }
    }
    
    handleError(err) {
        if (err['error']['errors']) {
            err['error']['errors'].forEach(x => {
                this.alertService.showMessage(
                    this.moduleName,
                    x['message'],
                    MessageSeverity.error
                );
            })
        }
        else {
            this.alertService.showMessage(
                this.moduleName,
                'Saving data Failed due to some input error',
                MessageSeverity.error
            );
        }
    }
    get userName(): string {
        return this.authService.currentUser
            ? this.authService.currentUser.userName
            : "";
    }

    viewShippingData(ship) {
        this.isView = true;
    }
}

export class ShippingItems {
    SOPickTicketId: number;
    currQtyToShip: number;
    salesOrderPartId: number;
}

export class PackagingSlipItems {
    WOPickTicketId: number;
    currQtyToShip: number;
    WOPartNoId: number;
    WorkOrderId: number;
    masterCompanyId: number;
    createdBy: string;
    updatedBy: string;
    createdDate: string;
    updatedDate: string;
}

export class MultiShippingLabels {
    WorkOrderId: number;
    WOPartNoId: number;
    WOShippingId: number;
}

export class MultiPackagingSlips {
    WorkOrderId: number;
    WOPartNoId: number;
    WOPickTicketId: number;
    PackagingSlipId: number;
}