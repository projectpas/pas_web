import { Component, OnInit, Input } from '@angular/core';
import { fadeInOut } from '../../../../../../services/animations';
import { SalesOrderService } from '../../../../../../services/salesorder.service';
import { SalesOrderBillingAndInvoicing } from '../../../../../../models/sales/salesOrderBillingAndInvoicing';
import { CommonService } from '../../../../../../services/common.service';
import { AlertService } from '../../../../../../services/alert.service';
import { AddressModel } from '../../../../../../models/address.model';
import { getObjectById, formatNumberAsGlobalSettingsModule,editValueAssignByCondition, getValueFromObjectByKey, getObjectByValue, } from '../../../../../../generic/autocomplete';
import { CustomerService } from '../../../../../../services/customer.service';
import { AuthService } from '../../../../../../services/auth.service';
import { AppModuleEnum } from '../../../../../../enum/appmodule.enum';
import { AddressTypeEnum } from '../../../../../../shared/components/address-component/Address-type-enum';

@Component({
    selector: 'app-sales-order-billing',
    templateUrl: './sales-order-billing.component.html',
    styleUrls: ['./sales-order-billing.component.scss'],
    animations: [fadeInOut]
})
/** WorkOrderBilling component*/
export class SalesOrderBillingComponent implements OnInit {
    isViewMode = false;
    @Input() parts: any = [];
    @Input() salesOrderId;
    @Input() salesOrder: any;
    @Input() customerDetails: any;
    invoiceTypeList = [];
    revisionTypeList = [];
    currencyList = [];
    selectedColumns;
    headers = [];
    billingChildHeader = [];
    shipViaList = [];
    selectedPartNumber = 0;
    isSpinnerVisible = false;
    partsForBilling: any = [];
    totalRecords: number = 0;
    totalPages: number = 0;
    pageSize: number = 10;
    pageIndex: number = 0;
    first = 0;
    showPaginator: boolean = false;
    soldCustomerAddress: any = new AddressModel();
    shipCustomerAddress: any = new AddressModel();
    billCustomerAddress: any = new AddressModel();
    billingorInvoiceForm: SalesOrderBillingAndInvoicing;
    loadingSpinner: Boolean = false;
    soldCustomerShippingOriginalData: any[];
    shipCustomerShippingOriginalData: any[];
    billCustomerShippingOriginalData: any[];
    shipViaData: any;
    soldCustomerSiteList = [];
    shipCustomerSiteList = [];
    billCustomerSiteList = [];
    customerNamesList: Object;
    isEditBilling: any;
    billingList: any[] = [];
    partSelected: boolean = false;

    constructor(public salesOrderService: SalesOrderService,
        public commonService: CommonService,
        public alertService: AlertService,
        public customerService: CustomerService,
        public authService: AuthService) {
    }

    ngOnInit() {
        this.initColumns();
    }

    // initColumns() {
    //     this.headers = [
    //         { field: "invoiceDate", header: "Invoice Date", width: "100px" },
    //         { field: "partNumber", header: "PN", width: "130px" },
    //         { field: "partDescription", header: "PN Description", width: "150px" },
    //         { field: "stockLineNumber", header: "Stk Line Num", width: "120px" },
    //         { field: "serialNumber", header: "Ser Num", width: "100px" },
    //         { field: "conditionDescription", header: "Cond", width: "100px" },
    //         { field: "currencyDescription", header: "Curr", width: "100px" },
    //         { field: "totalSales", header: "Billing Amount", width: "120px" },
    //     ];
    //     this.selectedColumns = this.headers;
    // }
    initColumns() {
        this.headers = [
            // { field: "itemNo", header: "Item #", width: "100px" },
            { field: "salesOrderNumber", header: "SO Num", width: "100px" },
            { field: "partNumber", header: "PN", width: "100px" },
            { field: "partDescription", header: "PN Description", width: "100px" },
            { field: "qtyToBill", header: "Qty Shipped", width: "110px" },
            { field: "qtyBilled", header: "Qty Billed", width: "90px" },
            { field: "qtyRemaining", header: "Qty Remaining", width: "90px" },
            { field: "status", header: "Status", width: "90px" },
        ];
        this.selectedColumns = this.headers;
    }

    refresh(id) {
        //this.initColumns();
        // this.partsForBilling = [];
        // this.parts = parts;
        // if (this.parts && this.parts.length > 0) {
        //     this.parts.forEach(part => {
        //         if (part.salesOrderPartId) {
        //             this.partsForBilling.push(part);
        //         }
        //     });
        // }
        // this.totalRecords = this.partsForBilling.length;
        // this.showPaginator = this.totalRecords > 0;
        this.billingorInvoiceForm = null;
        this.salesOrderId = id;
        this.getShippingList();
        this.getCountriesList();
        //this.getAddressById(this.salesOrderId);
    }

    getCustomerDetails(){
        if(this.salesOrder.customerId > 0){
            this.customerService.getCustomerdataById(this.salesOrder.customerId).subscribe(response => {
                console.log("response",response);
                const res = response[0];
                this.billingorInvoiceForm.soldToCustomerId = res.customerId;
                this.billingorInvoiceForm.soldToCustomerName = res.name;
                this.soldCustomerAddress.line1 = res.address1;
                this.soldCustomerAddress.line2 = res.address2;
                this.soldCustomerAddress.city = res.city;
                this.soldCustomerAddress.stateOrProvince = res.stateOrProvince;
                this.soldCustomerAddress.postalCode = res.postalCode;
                this.soldCustomerAddress.country = res.countryName;
            });
        }
    }

    formateCurrency(amount) {
        return amount ? formatNumberAsGlobalSettingsModule(amount, 2) : '0.00';
    }

    getShippingList() {
        this.isSpinnerVisible = true;
        this.salesOrderService
            .getBillingInvoiceList(this.salesOrderId)
            .subscribe((response: any) => {
                this.isSpinnerVisible = false;
                this.billingList = response[0];
            }, error => {
                this.isSpinnerVisible = false;
            });
    }

    onSelectPartNumber(rowData) {
        if (rowData.salesOrderPartId != 0 && rowData.salesOrderShippingId != 0) {
            this.partSelected = true;
            this.getBillingAndInvoicingForSelectedPart(rowData.salesOrderPartId,rowData.salesOrderShippingId);
        }
    }

    filterCustomerName(event) {
        const value = event.query.toLowerCase()
        this.isSpinnerVisible = true;
        this.commonService.getCustomerNameandCode(value, 1).subscribe(res => {
            this.customerNamesList = res;
            this.isSpinnerVisible = false;
        }, err => {
            this.isSpinnerVisible = false;
        })
    }

    getBillingAndInvoicingForSelectedPart(partNumber,salesOrderShippingId) {
        this.isSpinnerVisible = true;
        this.selectedPartNumber = partNumber;
        //this.salesOrderService.getSalesOrderBilling(this.salesOrderId, partNumber,salesOrderShippingId).subscribe(result => {
        this.salesOrderService.getSalesOrderBillingByShipping(this.salesOrderId, partNumber,salesOrderShippingId).subscribe(result => {
            this.isSpinnerVisible = false;
            if (result) {
                this.billingorInvoiceForm = result;
                this.billingorInvoiceForm.shipDate = new Date(result.shipDate);
                this.billingorInvoiceForm.openDate = new Date(result.openDate);
                this.billingorInvoiceForm.printDate = new Date();
                this.billingorInvoiceForm.invoiceDate = new Date();
            } else {
                this.billingorInvoiceForm = new SalesOrderBillingAndInvoicing();
            }
            this.getAddressById(this.salesOrderId);
            this.getCurrencyList();
            this.getInvoiceList();
            this.getRevisionTypeList();
            this.getShipViaByCustomerId();
            this.getCustomerDetails();
        }, error => {
            this.isSpinnerVisible = false;
        })
    }

    getInvoiceList() {
        this.isSpinnerVisible = true;
        this.commonService.smartDropDownList('InvoiceType', 'InvoiceTypeId', 'Description').subscribe(res => {
            this.invoiceTypeList = res;
            this.billingorInvoiceForm.invoiceTypeId = res[5].value;
            this.isSpinnerVisible = false;
        }, err => {
            this.isSpinnerVisible = false;
        })
    }

    getRevisionTypeList() {
        this.isSpinnerVisible = true;
        this.commonService.smartDropDownList('RevisionType', 'RevisionTypeId', 'Description').subscribe(res => {
            this.revisionTypeList = res;
            this.isSpinnerVisible = false;
        }, err => {
            this.isSpinnerVisible = false;
        })
    }

    getCurrencyList() {
        this.isSpinnerVisible = true;
        this.commonService.smartDropDownList('Currency', 'CurrencyId', 'code', '', '').subscribe(
            results => {
                this.currencyList = results
                this.isSpinnerVisible = false;
            }, err => {
                this.isSpinnerVisible = false;
            }
        );
    }

    moduleName: any = '';
    getShipViaByCustomerId() {
        this.isSpinnerVisible = true;
        this.commonService.smartDropDownList('ShippingVia', 'ShippingViaId', 'Name')
            .subscribe(
                (res) => {
                    this.isSpinnerVisible = false;
                    this.shipViaList = res;
                }, err => {
                    this.isSpinnerVisible = false;
                }
            )
    }

    async getSiteNamesBySoldCustomerId(object) {
        const { customerId } = object;
        this.isSpinnerVisible = true;
        await this.customerService.getCustomerShipAddressGet(customerId).subscribe(res => {
            this.isSpinnerVisible = false;
            this.soldCustomerShippingOriginalData = res[0];
            this.soldCustomerSiteList = res[0].map(x => {
                return {
                    label: x.siteName,
                    value: x.customerShippingAddressId
                }
            });
            this.soldCustomerShippingOriginalData.forEach(
                x => {
                    if (x.isPrimary) {
                        this.billingorInvoiceForm.soldToSiteId = x.customerShippingAddressId;
                        this.changeOfSoldSiteName(x.customerShippingAddressId);
                    }
                }
            )
        }, err => {
            this.isSpinnerVisible = false;
        });
    }

    changeOfSoldSiteName(value) {
        const data = getObjectById('customerShippingAddressId', value, this.soldCustomerShippingOriginalData);
        if (data) {
            this.soldCustomerAddress.line1 = data.address1;
            this.soldCustomerAddress.line2 = data.address2;
            this.soldCustomerAddress.country = data.countryName;
            this.soldCustomerAddress.postalCode = data.postalCode;
            this.soldCustomerAddress.stateOrProvince = data.stateOrProvince;
            this.soldCustomerAddress.city = data.city;
        } else {
            this.soldCustomerAddress = new AddressModel();
        }
    }

    changeOfShipVia(value) {
        const data = getObjectById('shippingViaId', value, this.shipViaData);
        if (data) {
            // this.billingorInvoiceForm.shipAccountInfo = data.shippingAccountInfo;
        }
    }

    clearAddress(type, value) {
        if (value === '' && type === 'SoldTo') {
            this.soldCustomerAddress = new AddressModel();
        } else if (value === '' && type === 'shipTo') {
            this.shipCustomerAddress = new AddressModel();
        } else if (value === '' && type === 'BillTo') {
            this.shipCustomerAddress = new AddressModel();
        }
    }

    async getSiteNamesByShipCustomerId(object) {
        const { customerId } = object;
        await this.customerService.getCustomerShipAddressGet(customerId).subscribe(res => {
            this.shipCustomerShippingOriginalData = res[0];
            this.shipCustomerSiteList = res[0].map(x => {
                return {
                    label: x.siteName,
                    value: x.customerShippingAddressId
                }
            });
            this.shipCustomerShippingOriginalData.forEach(
                x => {
                    if (x.isPrimary) {
                        this.billingorInvoiceForm.shipToSiteId = x.customerShippingAddressId
                        this.changeOfShipSiteName(x.customerShippingAddressId);
                    }
                }
            )
        }, err => {
            this.isSpinnerVisible = false;
        })
    }

    async getSiteNamesByBillCustomerId(object) {
        const { customerId } = object;
        await this.customerService.getCustomerShipAddressGet(customerId).subscribe(res => {
            this.billCustomerShippingOriginalData = res[0];
            this.billCustomerSiteList = res[0].map(x => {
                return {
                    label: x.siteName,
                    value: x.customerShippingAddressId
                }
            });
            this.billCustomerShippingOriginalData.forEach(
                x => {
                    if (x.isPrimary) {
                        this.billingorInvoiceForm.billToSiteId = x.customerShippingAddressId
                        this.changeOfBillSiteName(x.customerShippingAddressId);
                    }
                }
            )
        }, err => {
            this.isSpinnerVisible = false;
        })
    }

    changeOfShipSiteName(value) {
        const data = getObjectById('customerShippingAddressId', value, this.shipCustomerShippingOriginalData);

        if (data) {
            this.shipCustomerAddress.line1 = data.address1;
            this.shipCustomerAddress.line2 = data.address2;
            this.shipCustomerAddress.country = data.countryName;
            this.shipCustomerAddress.postalCode = data.postalCode;
            this.shipCustomerAddress.stateOrProvince = data.stateOrProvince;
            this.shipCustomerAddress.city = data.city;
        } else {
            this.shipCustomerAddress = new AddressModel();
        }
    }

    changeOfBillSiteName(value) {
        const data = getObjectById('customerShippingAddressId', value, this.billCustomerShippingOriginalData);

        if (data) {
            this.billCustomerAddress.line1 = data.address1;
            this.billCustomerAddress.line2 = data.address2;
            this.billCustomerAddress.country = data.countryName;
            this.billCustomerAddress.postalCode = data.postalCode;
            this.billCustomerAddress.stateOrProvince = data.stateOrProvince;
            this.billCustomerAddress.city = data.city;
        } else {
            this.billCustomerAddress = new AddressModel();
        }
    }

    get userName(): string {
        return this.authService.currentUser
            ? this.authService.currentUser.userName
            : "";
    }

    saveSalesOrderBilling() {
        let billingorInvoiceFormTemp = JSON.parse(JSON.stringify(this.billingorInvoiceForm));
        this.billingorInvoiceForm.soldToCustomerId = billingorInvoiceFormTemp.soldToCustomerId['customerId']
        this.billingorInvoiceForm.shipToCustomerId = billingorInvoiceFormTemp.shipToCustomerId['customerId'];
        this.billingorInvoiceForm.billToCustomerId = billingorInvoiceFormTemp.billToCustomerId['customerId'];
        this.billingorInvoiceForm.billToSiteId = billingorInvoiceFormTemp.billToCustomerId['billToSiteId'];
        this.billingorInvoiceForm.shipToSiteId = billingorInvoiceFormTemp.shipToCustomerId['billToSiteId'];
        this.billingorInvoiceForm.soldToSiteId = billingorInvoiceFormTemp.soldToCustomerId['billToSiteId'];
        this.billingorInvoiceForm.createdDate = new Date();
        this.billingorInvoiceForm.updatedDate = new Date();
        this.billingorInvoiceForm.createdBy = this.userName;
        this.billingorInvoiceForm.updatedBy = this.userName;
        this.billingorInvoiceForm.salesOrderId = this.salesOrderId;
        this.billingorInvoiceForm.salesOrderPartId = this.selectedPartNumber;
        this.billingorInvoiceForm.invoiceNo = "test";
        this.salesOrderService.createBilling(this.billingorInvoiceForm).subscribe(result => {
        }, err => {
        });
    }

    convertDate(key, data) {
        return data[key];
    }

    loadData(event) {
    }

    updateWorkOrderBilling() { }

    sourceSOApproval: any = {};
    shipToAddress: any = {};
    billToAddress: any = {};
    shipvia:any={};
    shiptomoduleTypeId:number;
    billtomoduleTypeId:number;
    shipUsertype:number = 0; 
    billUsertype:number = 0;
    userShipingList: any[] = [];
    userShipingIdList: any[] = [];
    userBillingList: any[] = [];
    userBillingIdList: any[] = [];
    billToUserId:any=0;
    shipToUserId:any=0;
    shipToSite: any;
    billToSite: any;
    billingSieListOriginal: any[];
    countryList: any = [];
    shippingSieListOriginal: any[];

    getCountriesList() {
        this.commonService.smartDropDownList('Countries', 'countries_id', 'nice_name').subscribe(res => {
            this.countryList = res;
        }, err => {
        });
    }

    getShipCustomerNameList(usertype) {
        let userShipingIdList = [];
        userShipingIdList.push(0);
        //this.commonService.autoSuggestionSmartuserDropDownList(1, '', true, 20, userShipingIdList.join()).subscribe(res => {
        this.commonService.autoSuggestionSmartuserDropDownList(usertype, '', true, 20, userShipingIdList.join()).subscribe(res => {
            this.userShipingList = res;
        }, err => {
        });
    }

    getSoldCustomerNameList(usertype) {
        let userBillinngIdList = [];
        userBillinngIdList.push(0);
        //this.commonService.autoSuggestionSmartuserDropDownList(1, '', true, 20, userShipingIdList.join()).subscribe(res => {
        this.commonService.autoSuggestionSmartuserDropDownList(usertype, '', true, 20, userBillinngIdList.join()).subscribe(res => {
            this.userBillingList = res;
            //this.bindShippingInformation();
        }, err => {
        });
    }

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
            if(this.sourceSOApproval.shipToUserTypeId > 0)
            {
                this.shipUsertype = this.sourceSOApproval.shipToUserTypeId;
                if(this.shipUsertype == AppModuleEnum.Customer){
                    this.shiptomoduleTypeId = AppModuleEnum.Customer;
                }else if(this.shipUsertype == AppModuleEnum.Vendor){
                    this.shiptomoduleTypeId = AppModuleEnum.Vendor;
                }else if(this.shipUsertype == AppModuleEnum.Company){
                    this.shiptomoduleTypeId = AppModuleEnum.Company;
                }
                this.getShipCustomerNameList(this.sourceSOApproval.shipToUserTypeId);
            }
            if(this.sourceSOApproval.billToUserTypeId > 0)
            {
                this.billUsertype = this.sourceSOApproval.billToUserTypeId;
                if(this.billUsertype == AppModuleEnum.Customer){
                    this.billtomoduleTypeId = AppModuleEnum.Customer;
                }else if(this.billUsertype == AppModuleEnum.Vendor){
                    this.billtomoduleTypeId = AppModuleEnum.Vendor;
                }else if(this.billUsertype == AppModuleEnum.Company){
                    this.billtomoduleTypeId = AppModuleEnum.Company;
                }
                this.getSoldCustomerNameList(this.sourceSOApproval.billToUserTypeId);
            }
            // if(this.sourceSOApproval.shipToUserTypeId > 0 && this.sourceSOApproval.billToUserTypeId > 0)
            // {
            //     //this.bindShippingInformation();
            // }
            setTimeout(() => {
                this.bindShippingInformation();
            }, 1000);

            //this.bindShippingInformation();
        });
    }

    bindShippingInformation() {
        if (this.billToAddress !== undefined) {
            let customer = getObjectByValue('userID', this.billToAddress.userId, this.userBillingList);
            this.billingorInvoiceForm.billToCustomerId = customer;
            //this.setSiteNamesBySoldCustomerId(customer, this.billToAddress.siteId);
            this.setBillToSelectedSite(this.billToAddress.userId,this.billToAddress.siteId);
            //this.shippingHeader.soldToSiteId = this.billToAddress.siteId;
            this.billCustomerAddress.line1 = this.billToAddress.address1;
            this.billCustomerAddress.line2 = this.billToAddress.address2;
            this.billCustomerAddress.city = this.billToAddress.city;
            this.billCustomerAddress.stateOrProvince = this.billToAddress.stateOrProvince;
            this.billCustomerAddress.country = this.billToAddress.country;
            this.billCustomerAddress.postalCode = this.billToAddress.postalCode;
        }

        if (this.shipToAddress !== undefined) {
            let shipcustomer = getObjectByValue('userID', this.shipToAddress.userId, this.userShipingList);
            this.billingorInvoiceForm.shipToCustomerId = shipcustomer;
            //this.shippingHeader.shipToSiteId = this.shipToAddress.siteId;
            //this.setSiteNamesByShipCustomerId(shipcustomer, this.shipToAddress.siteId);
            this.setShipToSelectedSite(this.shipToAddress.userId,this.shipToAddress.siteId);
            this.shipCustomerAddress.line1 = this.shipToAddress.address1;
            this.shipCustomerAddress.line2 = this.shipToAddress.address2;
            this.shipCustomerAddress.city = this.shipToAddress.city;
            this.shipCustomerAddress.stateOrProvince = this.shipToAddress.stateOrProvince;
            this.shipCustomerAddress.country = this.shipToAddress.country;
            this.shipCustomerAddress.postalCode = this.shipToAddress.postalCode;
        }

        // if (this.shipvia !== undefined) {
        //     this.shippingHeader.shipviaId = this.shipvia.shipviaId;
        // }
        this.isSpinnerVisible = false;
    }

    onBillToSelected(res?) {
        this.clearBillToAddress();   
        //let customerId = res.userID;
        this.billToUserId = res.userID;
        // const moduleId = ModuleId > 0 ? ModuleId : this.sourcePoApproval.shipToUserTypeId;
         const userId = res.userID;
        const AddressType = 'Bill';		
        if(userId > 0) {
          this.commonService.getaddressdetailsbyuser(this.billUsertype, userId, AddressType,this.salesOrderId).subscribe(
            returnddataforbill => {
                this.billCustomerShippingOriginalData = returnddataforbill.address;
                this.billCustomerSiteList = returnddataforbill.address; 
                // this.soldCustomerShippingOriginalData.forEach(
                //     x => {
                //         if (x.isPrimary) {
                //             this.shippingHeader.soldToSiteId = x.customerDomensticShippingId;
                //             this.setSoldToAddresses();
                //         }
                //     }
                // )
    
                this.billToSite = returnddataforbill.address;
                    if(this.billToSite && this.billToSite.length !=0){
                             this.billingSieListOriginal = this.billToSite.map(x => {
                        return {
                            siteName: x.siteName, siteId: x.siteID
                        }
                    })
                }	 
    
                //this.setSoldToAddresses();
        }, err => {
            this.isSpinnerVisible = false;
            const errorLog = err;
            //this.errorMessageHandler(errorLog);		
        });
    }
      }

    filterCustomerNameBill(event) {
        const value = event.query.toLowerCase();
        //let userShipingIdList = [];
        //userShipingIdList.push(0);
        this.commonService.autoSuggestionSmartuserDropDownList(this.billUsertype, value, true, 20, this.userBillingIdList.join()).subscribe(res => {
            this.userBillingList = res;
        }, err => {
        });
    }

    filterCustomerShip(event) {
        const value = event.query.toLowerCase();
        //let userShipingIdList = [];
        //userShipingIdList.push(0);
        this.commonService.autoSuggestionSmartuserDropDownList(this.shipUsertype, value, true, 20, this.userShipingIdList.join()).subscribe(res => {
            this.userShipingList = res;
        }, err => {
        });
    }

    setBillToSelectedSite(userID, siteId?) {
        this.clearBillToAddress();   
        //let customerId = res.userID;
        this.billToUserId = userID;
        // const moduleId = ModuleId > 0 ? ModuleId : this.sourcePoApproval.shipToUserTypeId;
         const userId = userID;
        const AddressType = 'Bill';		
        if(userId > 0) {
          this.commonService.getaddressdetailsbyuser(this.billUsertype, userId, AddressType,this.salesOrderId).subscribe(
            returnddataforbill => {
                this.billCustomerShippingOriginalData = returnddataforbill.address;
                this.billCustomerSiteList = returnddataforbill.address; 
    
                this.billToSite = returnddataforbill.address;
                    if(this.billToSite && this.billToSite.length !=0){
                             this.billingSieListOriginal = this.billToSite.map(x => {
                        return {
                            //siteName: x.siteName, siteId: x.customerBillingAddressId
                            siteName: x.siteName, siteId: x.siteID
                        }
                    })
                }	 
    
                //this.setSoldToAddresses();
         if(siteId > 0) {
            if(this.billToSite && this.billToSite.length !=0){
            for(var i =0; i < this.billToSite.length; i++) {
                if(this.billToSite[i].siteID == siteId ) {			
                    this.billingorInvoiceForm.billToSiteId = this.billToSite[i].siteID;
                    this.setSoldToAddresses();
                }
                }
            }
         }
             
        }, err => {
            this.isSpinnerVisible = false;
            const errorLog = err;
            //this.errorMessageHandler(errorLog);		
         });
        }
    }

    setSoldToAddresses() {
        this.billCustomerSiteList.forEach(site => {
            //if (site.customerDomensticShippingId == Number(this.shippingHeader.soldToSiteId)) {
            //if (site.customerBillingAddressId == Number(this.shippingHeader.soldToSiteId)) {  
            if (site.siteID == Number(this.billingorInvoiceForm.billToSiteId)) {
                this.billCustomerAddress.line1 = site.address1;
                this.billCustomerAddress.line2 = site.address2;
                this.billCustomerAddress.city = site.city;
                this.billCustomerAddress.stateOrProvince = site.stateOrProvince;
                this.billCustomerAddress.postalCode = site.postalCode;
                //this.billCustomerAddress['soldToCountryId'] = site.countryId;
                //this.billCustomerAddress['soldToSiteName'] = site.siteName;
                //this.billCustomerAddress['soldToCountryName'] = site.countryName;
                this.billCustomerAddress.country = site.country;
            }
        });
    }

    clearBillToAddress() {
        this.billCustomerSiteList = [];
        this.billCustomerAddress.line1 = "";
        this.billCustomerAddress.line2 = "";
        this.billCustomerAddress.city = "";
        this.billCustomerAddress.stateOrProvince = "";
        this.billCustomerAddress.postalCode = "";
        this.billCustomerAddress.country = "";
    }
    clearShipToAddress() {
        this.shipCustomerSiteList = [];
        this.shipCustomerAddress.line1 = "";
        this.shipCustomerAddress.line2 = "";
        this.shipCustomerAddress.city = "";
        this.shipCustomerAddress.stateOrProvince = "";
        this.shipCustomerAddress.postalCode = "";
        this.shipCustomerAddress.country = "";
    }

    onShipToSelected(res?) {
        this.clearShipToAddress();
        //let customerId = res.userID;
        this.shipToUserId = res.userID;
        // const moduleId = ModuleId > 0 ? ModuleId : this.sourcePoApproval.shipToUserTypeId;
         const userId = res.userID;
        const AddressType = 'Ship';
        if(userId > 0) {
          this.commonService.getaddressdetailsbyuser(this.shipUsertype, userId, AddressType,this.salesOrderId).subscribe(
            returnddataforbill => {
                this.shipCustomerShippingOriginalData = returnddataforbill.address;
                this.shipCustomerSiteList = returnddataforbill.address;
                // this.shipCustomerShippingOriginalData.forEach(
                //     x => {
                //         if (x.isPrimary) {
                //             this.shippingHeader.shipToSiteId = x.customerDomensticShippingId;
                //             this.setShipToAddress();
                //         }
                //     }
                // )
                //this.setShipToAddress();
    
                this.shipToSite = returnddataforbill.address;
                if(this.shipToSite && this.shipToSite.length !=0){
                this.shippingSieListOriginal = this.shipToSite.map(x => {
                        return {
                            siteName: x.siteName, siteId: x.siteID
                        }
                    });
                }
            });
        }
    }

    setShipToSelectedSite(userID, siteId?) {
        this.clearShipToAddress();
        //let customerId = res.userID;
        this.shipToUserId = userID;
        // const moduleId = ModuleId > 0 ? ModuleId : this.sourcePoApproval.shipToUserTypeId;
         const userId = userID;
        const AddressType = 'Ship';
        if(userId > 0) {
          this.commonService.getaddressdetailsbyuser(this.shipUsertype, userId, AddressType,this.salesOrderId).subscribe(
            returnddataforbill => {
                this.shipCustomerShippingOriginalData = returnddataforbill.address;
                this.shipCustomerSiteList = returnddataforbill.address;
                // this.shipCustomerShippingOriginalData.forEach(
                //     x => {
                //         if (x.isPrimary) {
                //             this.shippingHeader.shipToSiteId = x.customerDomensticShippingId;
                //             this.setShipToAddress();
                //         }
                //     }
                // )
                //this.setShipToAddress();
    
                this.shipToSite = returnddataforbill.address;
                if(this.shipToSite && this.shipToSite.length !=0){
                this.shippingSieListOriginal = this.shipToSite.map(x => {
                        return {
                            siteName: x.siteName, siteId: x.siteID
                        }
                    });
                }

        if(siteId > 0) {
            if(this.shipToSite && this.shipToSite.length !=0){
            for(var i =0; i < this.shipToSite.length; i++) {
                if(this.shipToSite[i].siteID == siteId ) {			
                    this.billingorInvoiceForm.shipToSiteId = this.shipToSite[i].siteID;
                    this.setShipToAddress();
                }
            }
            }
            }
         });
        }
    }

    setShipToAddress() {
        this.shipCustomerSiteList.forEach(site => {
            //if (site.customerDomensticShippingId == Number(this.shippingHeader.shipToSiteId)) {
            if (site.siteID == Number(this.billingorInvoiceForm.shipToSiteId)) {
                this.shipCustomerAddress.line1 = site.address1;
                this.shipCustomerAddress.line2 = site.address2;
                this.shipCustomerAddress.city = site.city;
                this.shipCustomerAddress.stateOrProvince = site.stateOrProvince;
                this.shipCustomerAddress.postalCode = site.postalCode;
                //this.shipCustomerAddress['soldToCountryId'] = site.countryId;
                //this.shipCustomerAddress['soldToSiteName'] = site.siteName;
                //this.shipCustomerAddress['soldToCountryName'] = site.countryName;
                this.shipCustomerAddress.country = site.country;
            }
        });
    }

    checked(evt, ship) {
        ship.selected = evt.target.checked;
        this.checkIsChecked();
    }

    disableCreateInvoiceBtn: boolean = true;

    checkIsChecked() {
        this.billingList.forEach(a => {
            a.salesOrderBillingInvoiceChild.forEach(ele => {
                if (ele.selected)
                    this.disableCreateInvoiceBtn = false;
                else
                    this.disableCreateInvoiceBtn = true;
            });
        });
    }
}