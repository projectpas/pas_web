import { Component, OnInit, Input } from '@angular/core';
import { fadeInOut } from '../../../../../../services/animations';
import { SalesOrderService } from '../../../../../../services/salesorder.service';
import { SalesOrderBillingAndInvoicing } from '../../../../../../models/sales/salesOrderBillingAndInvoicing';
import { CommonService } from '../../../../../../services/common.service';
import { AlertService, MessageSeverity } from '../../../../../../services/alert.service';
import { AddressModel } from '../../../../../../models/address.model';
import { getObjectById } from '../../../../../../generic/autocomplete';
import { CustomerService } from '../../../../../../services/customer.service';
import { AuthService } from '../../../../../../services/auth.service';
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
    invoiceTypeList = [];
    revisionTypeList = [];
    currencyList = [];
    selectedColumns;
    headers = [];
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

    constructor(public salesOrderService: SalesOrderService,
        public commonService: CommonService,
        public alertService: AlertService,
        public customerService: CustomerService,
        public authService: AuthService) {
    }

    ngOnInit() {
        this.initColumns();
    }

    initColumns() {
        this.headers = [
            { field: "invoiceDate", header: "Invoice Date", width: "100px" },
            { field: "partNumber", header: "PN", width: "130px" },
            { field: "partDescription", header: "PN Description", width: "150px" },
            { field: "stockLineNumber", header: "Stk Line Num", width: "120px" },
            { field: "serialNumber", header: "Ser Num", width: "100px" },
            { field: "conditionDescription", header: "Cond", width: "100px" },
            { field: "currencyDescription", header: "Curr", width: "100px" },
            { field: "totalSales", header: "Billing Amount", width: "120px" },
        ];
        this.selectedColumns = this.headers;
    }

    refresh(parts) {
        this.initColumns();
        let savedParts = [];
        let partsForBilling = [];
        this.partsForBilling = [];
        this.parts = parts;
        if (this.parts && this.parts.length > 0) {
            this.parts.forEach(part => {
                if (part.salesOrderPartId) {
                    this.partsForBilling.push(part);
                }
            });
        }
        this.totalRecords = this.partsForBilling.length;
        this.showPaginator = this.totalRecords > 0;
    }

    onSelectPartNumber(rowData) {
        if (rowData.salesOrderPartId != 0) {
            this.getBillingAndInvoicingForSelectedPart(rowData.salesOrderPartId);
        }
    }

    filterCustomerName(event) {
        const value = event.query.toLowerCase()
        this.isSpinnerVisible = true;
        this.commonService.getCustomerNameandCode(value, 1).subscribe(res => {
            this.customerNamesList = res;
            this.isSpinnerVisible = false;
        },
            err => {
                this.isSpinnerVisible = false;
            })
    }

    getBillingAndInvoicingForSelectedPart(partNumber) {
        this.isSpinnerVisible = true;
        this.selectedPartNumber = partNumber;
        this.salesOrderService.getSalesOrderBilling(this.salesOrderId, partNumber).subscribe(result => {
            this.isSpinnerVisible = false;
            if (result) {
                this.billingorInvoiceForm = result;
            } else {
                this.billingorInvoiceForm = new SalesOrderBillingAndInvoicing();
            }
            this.getCurrencyList();
            this.getInvoiceList();
            this.getRevisionTypeList();
            this.getShipViaByCustomerId();
        }, error => {
            this.isSpinnerVisible = false;
        })
    }

    getInvoiceList() {
        this.isSpinnerVisible = true;
        this.commonService.smartDropDownList('InvoiceType', 'InvoiceTypeId', 'Description').subscribe(res => {
            this.invoiceTypeList = res;
            this.isSpinnerVisible = false;
        },
            err => {
                this.isSpinnerVisible = false;
            })
    }

    getRevisionTypeList() {
        this.isSpinnerVisible = true;
        this.commonService.smartDropDownList('RevisionType', 'RevisionTypeId', 'Description').subscribe(res => {
            this.revisionTypeList = res;
            this.isSpinnerVisible = false;
        },
            err => {
                this.isSpinnerVisible = false;
            })
    }

    getCurrencyList() {
        this.isSpinnerVisible = true;
        this.commonService.smartDropDownList('Currency', 'CurrencyId', 'code', '', '').subscribe(
            results => {
                this.currencyList = results
                this.isSpinnerVisible = false;
            },
            err => {
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
                },
                err => {
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
        },
            err => {
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
        },
            err => {
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
        },
            err => {
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
}