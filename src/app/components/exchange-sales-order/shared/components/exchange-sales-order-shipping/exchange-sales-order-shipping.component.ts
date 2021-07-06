import { Component, OnInit, Input } from '@angular/core';
import { AddressModel } from '../../../../../models/address.model';
import { ExchangeSalesOrderShipping } from '../../../../../models/exchange/exchangeSalesOrderShipping';
import { AlertService, MessageSeverity } from '../../../../../services/alert.service';
import { fadeInOut } from '../../../../../services/animations';
import { ExchangeSalesOrderService } from '../../../../../services/exchangesalesorder.service';
import * as moment from 'moment';
import { CommonService } from '../../../../../services/common.service';
import { WorkOrderService } from '../../../../../services/work-order/work-order.service';
import { CustomerService } from '../../../../../services/customer.service';
import { editValueAssignByCondition, getValueFromObjectByKey, getObjectByValue, formatNumberAsGlobalSettingsModule } from '../../../../../generic/autocomplete';
import { AuthService } from '../../../../../services/auth.service';
import { AddressTypeEnum } from '../../../../../shared/components/address-component/Address-type-enum';
import { AppModuleEnum } from '../../../../../enum/appmodule.enum';
import { CustomerShippingModel } from '../../../../../models/customer-shipping.model';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { SalesShippingLabelComponent } from '../../sales-order-shipping-label/sales-order-shipping-label.component'
// import { SalesOrderPackagingLabelComponent } from '../../../sales-order-Packaging-Label/sales-order-packaging-label.component';
// import { SalesMultiShippingLabelComponent } from '../../../sales-order-multi-shipping-label/sales-order-multi-shipping-label.component';
// import { SalesOrderMultiPackagingLabelComponent } from '../../../sales-order-multi-Packaging-Label/sales-order-multi-packaging-label.component';
@Component({
  selector: 'app-exchange-sales-order-shipping',
  templateUrl: './exchange-sales-order-shipping.component.html',
  styleUrls: ['./exchange-sales-order-shipping.component.scss'],
  animations: [fadeInOut]
})
export class ExchangeSalesOrderShippingComponent {
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
  shippingForm: ExchangeSalesOrderShipping = new ExchangeSalesOrderShipping();
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
    "exchangeSalesOrderShippingId": 0,
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
  salesOrderPartId: number;
  ModuleID: Number;
  isEditModeAdd: boolean = false;
  modal: NgbModalRef;
  isMultipleSelected: boolean = false;
  addCustomerInfo: boolean = false;
  disableGeneratePackagingBtn: boolean = true;
  isViewShipping: boolean = false;
  disableCreateShippingBtn: boolean = true;
  sourceSOApproval: any = {};
  shipToAddress: any = {};
  billToAddress: any = {};
  shipvia: any = {};
  shiptomoduleTypeId: number;
  billtomoduleTypeId: number;
  constructor(public exchangeSalesOrderService: ExchangeSalesOrderService,
    public alertService: AlertService,
    public commonService: CommonService,
    public workorderService: WorkOrderService,
    public customerService: CustomerService,
    public authService: AuthService,
    private modalService: NgbModal) { }

  initColumns() {
    this.headers = [
      { field: "salesOrderNumber", header: "SO Num", width: "100px" },
      { field: "partNumber", header: "PN", width: "100px" },
      { field: "partDescription", header: "PN Description", width: "100px" },
      { field: "qtyToShip", header: "Qty Picked", width: "65px" },
      { field: "qtyShipped", header: "Qty Shipped", width: "65px" },
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
    this.disableGeneratePackagingBtn = true;
    this.disableCreateShippingBtn = true;
    this.commonService.getAddressById(this.salesOrderId, AddressTypeEnum.SalesOrder, AppModuleEnum.SalesOrder).subscribe(res => {
      if (res[0].ShipToSiteId == 0 && res[0].BillToSiteId == 0) {
        this.alertService.resetStickyMessage();
        this.alertService.showMessage('Sales Order Shipping', "Please Save 'Bill To' and 'Ship To' address from address tab", MessageSeverity.default);
      }
      else {
        this.initColumns();
        this.bindData();
      }
    });
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

  userShipingList: any[] = [];
  userShipingIdList: any[] = [];
  userBillingList: any[] = [];
  userBillingIdList: any[] = [];
  shipUsertype: number = 0;
  billUsertype: number = 0;

  onSelectPartNumber(rowData) {
    this.currSOPickTicketId = rowData.soPickTicketId;
    this.currQtyToShip = rowData.qtyToShip;
    this.salesOrderPartId = rowData.salesOrderPartId;
    this.partSelected = true;
    this.isMultipleSelected = false;
    this.isViewShipping = false;
    //this.clearData();
    this.bindData();
  }

  getShippingForSelectedPart(partNumber) {
    this.isSpinnerVisible = true;
    this.exchangeSalesOrderService.getExchangeSalesOrderShipping(this.salesOrderId, partNumber).subscribe(result => {
      this.isSpinnerVisible = false;
      if (result) {
        this.shippingForm = result;
      } else {
        this.shippingForm = new ExchangeSalesOrderShipping();
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

  getShipCustomerNameList(usertype) {
    let userShipingIdList = [];
    if (this.shipToAddress.userId != null) {
      userShipingIdList.push(this.shipToAddress.userId);
    }
    else {
      userShipingIdList.push(0);
    }

    this.commonService.autoSuggestionSmartuserDropDownList(usertype, '', true, 20, userShipingIdList.join()).subscribe(res => {
      this.customerNamesList = res;
    }, err => {
    });
  }

  getSoldCustomerNameList(usertype) {
    let userBillinngIdList = [];
    if (this.billToAddress.userId != null) {
      userBillinngIdList.push(this.billToAddress.userId);
    }
    else {
      userBillinngIdList.push(0);
    }

    this.commonService.autoSuggestionSmartuserDropDownList(usertype, '', true, 20, userBillinngIdList.join()).subscribe(res => {
      this.userBillingList = res;
    }, err => {
    });
  }

  arrayShipVialist: any[] = [];
  getShipVia() {
    if (this.arrayShipVialist.length == 0) {
      this.arrayShipVialist.push(0);
    }
    this.commonService.autoSuggestionSmartDropDownList('ShippingVia', 'ShippingViaId', 'Name', '', true, 20, this.arrayShipVialist.join(), this.currentUserMasterCompanyId).subscribe((res) => {
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
              }
            }
          )
        }
      }, err => {
      });
  }

  arrayCountrieslist: any[] = [];
  getCountriesList() {
    if (this.arrayCountrieslist.length == 0) {
      this.arrayCountrieslist.push(0);
    }
    this.commonService.autoSuggestionSmartDropDownList('Countries', 'countries_id', 'nice_name', '', true, 20, this.arrayCountrieslist.join(), this.currentUserMasterCompanyId).subscribe(res => {
      this.countryList = res;
    }, err => {
    });
  }

  arrayUOMlist: any[] = [];
  getUnitOfMeasure() {
    if (this.arrayUOMlist.length == 0) {
      this.arrayUOMlist.push(0);
    }
    this.commonService.autoSuggestionSmartDropDownList('UnitOfMeasure', 'UnitOfMeasureId', 'shortName', '', true, 20, this.arrayUOMlist.join(), this.currentUserMasterCompanyId).subscribe((res) => {
      this.allWeightUnitOfMeasureInfo = res;
    }, err => {
    });
  }

  setShipToAddress() {
    this.shipCustomerSiteList.forEach(site => {
      if (site.siteID == Number(this.shippingHeader.shipToSiteId)) {
        this.shippingHeader['shipToAddress1'] = site.address1;
        this.shippingHeader['shipToAddress2'] = site.address2;
        this.shippingHeader['shipToCity'] = site.city;
        this.shippingHeader['shipToState'] = site.stateOrProvince;
        this.shippingHeader['shipToZip'] = site.postalCode;
        this.shippingHeader['shipToSiteName'] = site.siteName;
        this.shippingHeader['shipToCountryName'] = site.country;
        this.shippingHeader['shipToCountryId'] = site.countryId;
      }
    });
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
      this.shippingHeader.shipToCustomerId = this.shippingHeader.soldToName;
      this.getSiteNamesByShipCustomerId(this.shippingHeader.soldToName);
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
    const value = event.query.toLowerCase();
    this.commonService.autoSuggestionSmartuserDropDownList(this.shipUsertype, value, true, 20, this.userShipingIdList.join()).subscribe(res => {
      this.customerNamesList = res;
    }, err => {
    });
  }

  filterCustomerNameSold(event) {
    const value = event.query.toLowerCase();
    this.commonService.autoSuggestionSmartuserDropDownList(this.billUsertype, value, true, 20, this.userBillingIdList.join()).subscribe(res => {
      this.userBillingList = res;
    }, err => {
    });
  }
  shipToUserId: any = 0;
  async getSiteNamesByShipCustomerId(object) {
    this.clearShipToAddress();
    let customerId = object.userID;
    this.shipToUserId = object.userID;
    await this.customerService.getCustomerShipAddressGet(customerId).subscribe(res => {
      this.shipCustomerShippingOriginalData = res[0];
      this.shipCustomerSiteList = res[0];
      this.setShipToAddress();

      this.shipToSite = res[0];;
      if (this.shipToSite && this.shipToSite.length != 0) {
        this.shippingSieListOriginal = this.shipToSite.map(x => {
          return {
            siteName: x.siteName, siteId: x.siteId
          }
        });
      }
    }, err => {
    });
  }

  billToUserId: any = 0;
  async getSiteNamesBySoldCustomerId(object) {
    this.clearSoldToAddress();
    let customerId = object.userID;
    this.billToUserId = object.userID;
    await this.customerService.getCustomerBillAddressGet(customerId).subscribe(res => {
      this.soldCustomerShippingOriginalData = res[0];
      this.soldCustomerSiteList = res[0];
      this.billToSite = res[0];

      if (this.billToSite && this.billToSite.length != 0) {
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

  addressFormForShipping = new CustomerShippingModel();
  lstfilterShippingSite: any[];
  shippingSieListOriginal: any[];
  shipToSite: any;
  isShippingSiteNameAlreadyExists: boolean = false;
  ShipAddbutton: boolean = false;
  isEditModeShipping: boolean = false;

  async setSiteNamesByShipCustomerId(object, siteId) {
    this.clearShipToAddress();
    let customerId = object.userID;
    this.shipToUserId = object.userID;
    await this.customerService.getCustomerShipAddressGet(customerId).subscribe(res => {
      this.shipCustomerShippingOriginalData = res[0];
      this.shipCustomerSiteList = res[0];
      this.shippingHeader.shipToSiteId = siteId;

      this.shipToSite = res[0];;
      if (this.shipToSite && this.shipToSite.length != 0) {
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

  async setSiteNamesBySoldCustomerId(object, siteId) {
    this.clearSoldToAddress();
    let customerId = object.userID;
    this.billToUserId = object.userID;
    await this.customerService.getCustomerBillAddressGet(customerId).subscribe(res => {
      this.soldCustomerSiteList = res[0];
      this.soldCustomerShippingOriginalData = res[0];
      this.shippingHeader.soldToSiteId = siteId;
      this.billToSite = res[0];

      if (this.billToSite && this.billToSite.length != 0) {
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
  shippingList: any[] = [];
  save() {
    let shippingItems: ShippingItems[] = [];

    if (this.isMultipleSelected) {
      this.shippingList.filter(a => {
        for (let i = 0; i < a.soshippingchildviewlist.length; i++) {
          if (a.soshippingchildviewlist[i].selected == true) {
            var p = new ShippingItems;
            p.SOPickTicketId = a.soshippingchildviewlist[i].soPickTicketId;
            p.currQtyToShip = a.soshippingchildviewlist[i].qtyToShip;
            p.exchangeSalesOrderPartId = a.soshippingchildviewlist[i].exchangeSalesOrderPartId;

            shippingItems.push(p);
          }
        }
      });
    }
    else {
      var p = new ShippingItems;
      p.SOPickTicketId = this.currSOPickTicketId;
      p.currQtyToShip = this.currQtyToShip;
      p.exchangeSalesOrderPartId = this.salesOrderPartId;

      shippingItems.push(p);
    }

    this.shippingHeader['exchangeSalesOrderId'] = this.salesOrderId;
    this.shippingHeader['masterCompanyId'] = this.currentUserMasterCompanyId;
    this.shippingHeader['createdBy'] = this.userName;
    this.shippingHeader['updatedBy'] = this.userName;
    this.shippingHeader['createdDate'] = new Date().toDateString();
    this.shippingHeader['updatedDate'] = new Date().toDateString();
    this.shippingHeader['shipToName'] = this.shippingHeader.shipToCustomerId.userName;
    this.shippingHeader['shipToCustomerId'] = editValueAssignByCondition('userID', this.shippingHeader['shipToCustomerId']);
    this.shippingHeader['soldToName'] = this.shippingHeader.soldToName.userName;
    this.shippingHeader['shippingItems'] = shippingItems;
    this.isSpinnerVisible = true;

    this.exchangeSalesOrderService.createShipping(this.shippingHeader)
      .subscribe(
        (res: any) => {
          this.isSpinnerVisible = false;
          this.isEditModeAdd = false;

          this.alertService.showMessage(
            'Exchange Sales Order',
            'Exchange Sales Order Shipping created Succesfully',
            MessageSeverity.success
          );
          this.partSelected = false;
          //this.getShippingList();
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
  getShippingList() {
    this.isSpinnerVisible = true;
    this.exchangeSalesOrderService
      .getShippingDataList(this.salesOrderId)
      .subscribe((response: any) => {
        this.isSpinnerVisible = false;
        this.shippingList = response[0];
        //this.checkIsChecked();
      }, error => {
        this.isSpinnerVisible = false;
      });
  }
}

export class ShippingItems {
  SOPickTicketId: number;
  currQtyToShip: number;
  exchangeSalesOrderPartId: number;
}

export class PackagingSlipItems {
  SOPickTicketId: number;
  currQtyToShip: number;
  exchangeSalesOrderPartId: number;
  exchangeSalesOrderId: number;
  masterCompanyId: number;
  createdBy: string;
  updatedBy: string;
  createdDate: string;
  updatedDate: string;
}

export class MultiShippingLabels {
  ExchangeSalesOrderId: number;
  ExchangeSalesOrderPartId: number;
  SOShippingId: number;
}

export class MultiPackagingSlips {
  ExchangeSalesOrderId: number;
  ExchangeSalesOrderPartId: number;
  SOPickTicketId: number;
  PackagingSlipId: number;
}