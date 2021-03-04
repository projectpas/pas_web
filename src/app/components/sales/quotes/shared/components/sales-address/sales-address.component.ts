import { Component } from "@angular/core";
// import { ISalesQuote } from "../../../../../../models/sales/ISalesQuote.model";
// import { SalesQuote } from "../../../../../../models/sales/SalesQuote.model";
// import { ISalesOrderQuote } from "../../../../../../models/sales/ISalesOrderQuote";
// import { SalesOrderQuote } from "../../../../../../models/sales/SalesOrderQuote";
// import { SalesQuoteService } from "../../../../../../services/salesquote.service";
// import { CustomerService } from "../../../../../../services/customer.service";
// import { SiteService } from '../../../../../../services/site.service';
// import { Site } from '../../../../../../models/site.model';
// import { CustomerShippingModel } from '../../../../../../models/customer-shipping.model';
// import { CustomerInternationalShipVia } from '../../../../../../models/customer-internationalshipping.model';
// import { VendorService } from '../../../../../../services/vendor.service';
// import { CommonService } from '../../../../../../services/common.service';
// import { CompanyService } from '../../../../../../services/company.service';
// import { AlertService, MessageSeverity } from '../../../../../../services/alert.service';
// import { AuthService } from '../../../../../../services/auth.service';
// import { getValueFromObjectByKey, getObjectById, editValueAssignByCondition, getObjectByValue, getValueByFieldFromArrayofObject, getValueFromArrayOfObjectById } from '../../../../../../generic/autocomplete';
// import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
// import { ISalesQuoteView } from "../../../../../../models/sales/ISalesQuoteView";
// import { SalesOrderService } from "../../../../../../services/salesorder.service";
// import { ISalesOrderView } from "../../../../../../models/sales/ISalesOrderView";
// import { SalesOrder } from "../../../../../../models/sales/SalesOrder.model";
// import { ISalesOrder } from "../../../../../../models/sales/ISalesOrder.model";
// import { SalesOrderView } from "../../../../../../models/sales/SalesOrderView";
// import { forkJoin } from "rxjs/observable/forkJoin";


@Component({
	selector: "app-sales-address",
	templateUrl: "./sales-address.component.html",
	styleUrls: ["./sales-address.component.css"]
})
export class SalesAddressComponent {
// 	@Input() customerId: any;
// 	@Input() salesQuote: ISalesQuote;
// 	@Input() salesOrderQuote: ISalesOrderQuote;
// 	@ViewChild('shipToShipVia',{static:false}) public shipToShipVia: ElementRef;
// 	//salesQuote: ISalesQuote;
// 	// salesOrderQuote: ISalesOrderQuote;
// 	shipToShipViaModal: NgbModalRef;
// 	siteList: any[] = [];
// 	billToSiteList: any[] = [];
// 	allCustomer: any[];
// 	userNames: any[];
// 	billToUserNames: any[];
// 	tempMemo: any;
// 	tempMemoLabel: any;
// 	addressSiteNameHeader: string;
// 	addressSiteName: any = {};
// 	tempshipToAddress: any = {};
// 	tempbillToAddress: any = {};
// 	tempshipVia: any = {};
// 	billToAddress: any = {};
// 	shipToAddress: any = {};
// 	addressFormForShipping = new CustomerShippingModel()
// 	addressFormForBilling = new CustomerShippingModel()
// 	legalEntity: any;
// 	addShipViaFormForShipping = new CustomerInternationalShipVia();
// 	isEditModeShipping: boolean = false;
// 	isEditModeBilling: boolean = false;
// 	isEditModeShipVia: boolean = false;
// 	isEditMode: boolean = false;
// 	countriesList: any = [];
// 	allCountriesList: any = [];
// 	shipViaList: any = [];
// 	shipToSelectedvalue: any;
// 	billToSelectedvalue: any;
// 	billToContactData: any[] = [];
// 	shipToContactData: any = [];
// 	firstNamesShipTo: any = [];
// 	firstNamesBillTo: any = [];
// 	inputValidCheck: any;
// 	userList: any[] = [];
// 	billToUserList: any[] = [];
// 	vendorList: any[];
// 	allShipViaInfo: any = [];
// 	salesOrder: ISalesOrder;
// 	salesOrderId: number;
// 	isSpinnerVisible = false;
// 	@Input() salesQuoteView: ISalesQuoteView;
// 	@Input() salesOrderView: ISalesOrderView;
// 	@ViewChild("updatePNDetailsModal",{static:false})
// 	public updatePNDetailsModal: ElementRef;
// 	modal: NgbModalRef;
// 	constructor(private salesQuoteService: SalesQuoteService,
// 		private siteService: SiteService,
// 		private customerService: CustomerService,
// 		private companyService: CompanyService,
// 		private commonService: CommonService,
// 		public vendorService: VendorService,
// 		private alertService: AlertService,
// 		private modalService: NgbModal,
// 		private authService: AuthService, private salesOrderService: SalesOrderService) {
// 		// this.salesQuote = new SalesQuote();

// 	}


// 	ngOnInit(): void {

// 		// this.salesQuoteService
// 		// 	.getSalesOrderQuteInstance()
// 		// 	.subscribe(data => {
// 		// 		this.salesOrderQuote = data;
// 		// 	});

// 		// this.loadShippingViaList();
// 		// this.getLegalEntity();
// 		// this.getVendorList();
// 		// this.getCountriesList();

// 	}

// 	refresh(salesOrderQuote) {
// 		this.isSpinnerVisible = true;
// 		forkJoin(this.commonService.smartDropDownList('ShippingVia', 'ShippingViaId', 'Name'),
// 			this.commonService.smartDropDownList('LegalEntity', 'LegalEntityId', 'Name'),
// 			this.commonService.smartDropDownList('Customer', 'CustomerId', 'Name'),
// 			this.commonService.smartDropDownList('Countries', 'countries_id', 'nice_name'),
// 		).subscribe(response => {
// 			this.isSpinnerVisible = false;
// 			this.allShipViaInfo = this.checkResponse(response[0]);
// 			this.legalEntity = this.checkResponse(response[1]);
// 			this.allCustomer = this.checkResponse(response[2]);
// 			this.allCountriesList = this.checkResponse(response[3]);
// 			this.load(salesOrderQuote, this.allCustomer);
// 		}, error => {
// 			this.isSpinnerVisible = false;
// 		})
// 	}

// 	checkResponse(response) {
// 		if (response && response.length > 0) {
// 			return response;
// 		} else {
// 			return [];
// 		}
// 	}

// 	// loadShippingViaList() {
// 	// 	this.commonService.smartDropDownList('ShippingVia', 'ShippingViaId', 'Name').subscribe(res => {
// 	// 		this.allShipViaInfo = res;
// 	// 	})
// 	// }

// 	async load(salesOrderQuote: ISalesOrderQuote, allCustomer) {
// 		// this.allCustomer = response;
// 		this.salesOrderQuote = salesOrderQuote;
// 		if (salesOrderQuote) {
// 			if (this.salesOrderQuote.shipToUserTypeId) {
// 				this.isEditMode = true;
// 				this.onChangeShipToUserType();
// 			} else {
// 				this.salesOrderQuote.shipToUserTypeId = 1;
// 				this.salesOrderQuote.shipToUserId = this.customerId;

// 				this.onChangeShipToUserType();
// 				if (this.isEditMode == false) {
// 					this.onShipToUserSelected(this.customerId, this.salesOrderQuote, this.salesOrderQuote.shipToAddressId);
// 				}
// 				this.userList = this.allCustomer;

// 			}
// 			if (this.salesOrderQuote.billToUserTypeId) {
// 				this.onChangeBillToUserType();
// 				this.isEditMode = true;
// 			}
// 			else {
// 				this.salesOrderQuote.billToUserTypeId = 1
// 				this.salesOrderQuote.billToUserId = this.customerId;
// 				this.onChangeBillToUserType();
// 				if (this.isEditMode == false) {
// 					this.onBillToUserSelected(this.customerId, this.salesOrderQuote, this.salesOrderQuote.billToAddressId);
// 				}
// 				this.userList = this.allCustomer;
// 			}
// 		}
// 	}

// 	getDefaultShipping() {
// 		if (this.siteList) {
// 			if (this.siteList.length > 0) {
// 				for (let i = 0; i < this.siteList.length; i++) {
// 					let isPrimary = this.siteList[i].isPrimary;
// 					if (isPrimary) {
// 						this.salesOrderQuote.shipToSiteName = this.siteList[i].siteName;
// 						this.onShipSiteSelect(this.salesOrderQuote.shipToSiteName);
// 					}
// 				}
// 			}
// 		}
// 	}

// 	saveShippingAddressToPO() {

// 	}

// 	saveBillingAddressToPO() {

// 	}

// 	saveShipToShipViaDetailsToPO() {

// 	}

// 	getDefaultBilling() {
// 		if (this.billToSiteList) {
// 			if (this.billToSiteList.length > 0) {
// 				for (let i = 0; i < this.billToSiteList.length; i++) {
// 					let isPrimary = this.billToSiteList[i].isPrimary;
// 					if (isPrimary) {
// 						this.salesOrderQuote.billToSiteName = this.billToSiteList[i].siteName;
// 						this.onBillSiteSelect(this.salesOrderQuote.billToSiteName);
// 					}
// 				}
// 			}
// 		}
// 	}

// 	// async getCustomerList() {
// 	// 	await this.commonService.smartDropDownList('Customer', 'CustomerId', 'Name').subscribe(response => {
// 	// 		this.allCustomer = response;
// 	// 	});
// 	// }

// 	// private getVendorList() {
// 	// 	this.commonService.smartDropDownList('Vendor', 'VendorId', 'VendorName').subscribe(response => {
// 	// 		this.vendorList = response;

// 	// 	});
// 	// }

// 	// getLegalEntity() {
// 	// 	this.commonService.smartDropDownList('LegalEntity', 'LegalEntityId', 'Name').subscribe(res => {
// 	// 		this.legalEntity = res;
// 	// 	})
// 	// }

// 	// getCountriesList() {
// 	// 	this.commonService.smartDropDownList('Countries', 'countries_id', 'nice_name').subscribe(res => {
// 	// 		this.allCountriesList = res;
// 	// 	})
// 	// }

// 	filterUserNames(event) {
// 		this.userNames = this.userList;
// 		const customerListData = [...this.userList.filter(x => {
// 			return x.label.toLowerCase().includes(event.query.toLowerCase())
// 		})]
// 		this.userNames = customerListData;
// 	}

// 	filterBillToUserNames(event) {
// 		this.billToUserNames = this.billToUserList;
// 		const customerListData = [...this.billToUserList.filter(x => {
// 			return x.label.toLowerCase().includes(event.query.toLowerCase())
// 		})]
// 		this.billToUserNames = customerListData;
// 	}

// 	filterCountries(event) {
// 		this.countriesList = this.allCountriesList;
// 		if (event.query !== undefined && event.query !== null) {
// 			const countries = [...this.allCountriesList.filter(x => {
// 				return x.label.toLowerCase().includes(event.query.toLowerCase())
// 			})]
// 			this.countriesList = countries;
// 		}
// 	}

// 	filterCustomerContactsForShipTo(event) {
// 		this.firstNamesShipTo = this.shipToContactData;

// 		if (event.query !== undefined && event.query !== null) {
// 			const customerContacts = [...this.shipToContactData.filter(x => {
// 				return x.firstName.toLowerCase().includes(event.query.toLowerCase())
// 			})]
// 			this.firstNamesShipTo = customerContacts;
// 		}
// 	}

// 	filterCustomerContactsForBillTo(event) {
// 		this.firstNamesBillTo = this.billToContactData;
// 		if (event.query !== undefined && event.query !== null) {
// 			const customerContacts = [...this.billToContactData.filter(x => {
// 				return x.firstName.toLowerCase().includes(event.query.toLowerCase())
// 			})]
// 			this.firstNamesBillTo = customerContacts;
// 		}
// 	}

// 	onShipSiteSelect(event) {
// 		if (this.siteList) {
// 			for (let i = 0; i < this.siteList.length; i++) {
// 				if (event == this.siteList[i].siteName) {
// 					let ch = +this.salesOrderQuote.shipToUserTypeId;
// 					switch (ch) {
// 						case 1:
// 							this.salesOrderQuote.shipToAddressId = this.siteList[i].customerShippingAddressId;
// 							break;
// 						case 2:
// 							this.salesOrderQuote.shipToAddressId = this.siteList[i].vendorShippingAddressId;
// 							break;
// 						case 3:
// 							this.salesOrderQuote.shipToAddressId = this.siteList[i].legalEntityShippingAddressId;
// 							this.onShipToGetCompanyAddress(this.salesOrderQuote.shipToAddressId);
// 							break;

// 					}

// 					if (ch !== 3) {
// 						//this.getShipViaByDomesticShippingId(this.siteList[i].customerShippingAddressId);
// 						this.salesOrderQuote.shipToAddress1 = this.siteList[i].address1;
// 						this.salesOrderQuote.shipToAddress2 = this.siteList[i].address2;
// 						this.salesOrderQuote.shipToAddress3 = this.siteList[i].address3;
// 						this.salesOrderQuote.shipToCity = this.siteList[i].city;
// 						this.salesOrderQuote.shipToState = this.siteList[i].stateOrProvince;
// 						this.salesOrderQuote.shipToPostalCode = this.siteList[i].postalCode;
// 						this.salesOrderQuote.shipToCountry = this.siteList[i].countryName;
// 						this.salesOrderQuote.shipToCountryId = this.siteList[i].countryId;
// 					}
// 				}
// 			}
// 		}
// 	}

// 	onShipViaSelect(event) {
// 		if (this.shipViaList) {
// 			for (let i = 0; i < this.shipViaList.length; i++) {
// 				if (event == this.shipViaList[i].name) {
// 					this.salesOrderQuote.shipViaShippingAccountInfo = this.shipViaList[i].shippingAccountInfo;
// 					this.salesOrderQuote.shippingId = this.shipViaList[i].shippingId;
// 					this.salesOrderQuote.shipViaId = this.shipViaList[i].shippingViaId;

// 					// this.salesOrderQuote.shipViaMemo = this.shipViaList[i].memo;
// 					this.salesOrderQuote.shippingURL = this.shipViaList[i].shippingURL;
// 					this.salesOrderQuote.shipViaShippingURL = this.shipViaList[i].shippingURL;

// 				}
// 			}
// 		}
// 	}

// 	onBillSiteSelect(event) {
// 		if (this.billToSiteList) {
// 			for (let i = 0; i < this.billToSiteList.length; i++) {
// 				if (event == this.billToSiteList[i].siteName) {
// 					let ch = +this.salesOrderQuote.billToUserTypeId;
// 					switch (ch) {
// 						case 1:
// 							this.salesOrderQuote.billToAddressId = this.billToSiteList[i].customerBillingAddressId;
// 							break;
// 						case 2:
// 							this.salesOrderQuote.billToAddressId = this.billToSiteList[i].vendorBillingAddressId;
// 							this.onBillToGetVendorAddress(this.salesOrderQuote.billToAddressId);
// 							break;
// 						case 3:
// 							this.salesOrderQuote.billToAddressId = this.billToSiteList[i].legalEntityBillingAddressId;
// 							this.onBillToGetCompanyAddress(this.salesOrderQuote.billToAddressId);
// 							break;

// 					}
// 					if (ch == 1) {
// 						this.salesOrderQuote.billToAddress1 = this.billToSiteList[i].address1;
// 						this.salesOrderQuote.billToAddress2 = this.billToSiteList[i].address2;
// 						this.salesOrderQuote.billToAddress3 = this.billToSiteList[i].address3;
// 						this.salesOrderQuote.billToCity = this.billToSiteList[i].city;
// 						this.salesOrderQuote.billToState = this.billToSiteList[i].stateOrProvince;
// 						this.salesOrderQuote.billToPostalCode = this.billToSiteList[i].postalCode;
// 						this.salesOrderQuote.billToCountry = this.billToSiteList[i].countryName;
// 						this.salesOrderQuote.shipToCountryId = this.siteList[i].countryId;
// 					}

// 				}
// 			}
// 		}
// 	}

// 	onShipToGetCompanyAddress(id: number) {
// 		this.companyService.getShippingAddress(this.salesOrderQuote.shipToAddressId).subscribe(data => {
// 			if (data) {
// 				this.salesOrderQuote.shipToAddress1 = data.line1;
// 				this.salesOrderQuote.shipToAddress2 = data.line2;
// 				this.salesOrderQuote.shipToAddress3 = data.line3;
// 				this.salesOrderQuote.shipToCity = data.city;
// 				this.salesOrderQuote.shipToState = data.stateOrProvince;
// 				this.salesOrderQuote.shipToPostalCode = data.postalCode;
// 				this.salesOrderQuote.shipToCountry = data.country;
// 			}
// 			else {
// 				this.salesOrderQuote.shipToAddress1 = '';
// 				this.salesOrderQuote.shipToAddress2 = '';
// 				this.salesOrderQuote.shipToAddress3 = '';
// 				this.salesOrderQuote.shipToCity = '';
// 				this.salesOrderQuote.shipToState = '';
// 				this.salesOrderQuote.shipToPostalCode = '';
// 				this.salesOrderQuote.shipToCountry = '';
// 			}
// 		});
// 	}

// 	onBillToGetCompanyAddress(id) {
// 		this.companyService.getBillingAddress(id).subscribe(res => {
// 			const resp = res;
// 			if (resp) {
// 				this.salesOrderQuote.billToAddress1 = resp.line1;
// 				this.salesOrderQuote.billToAddress2 = resp.line2;
// 				//this.salesOrderQuote.billToAddress3 = resp.line3;
// 				this.salesOrderQuote.billToCity = resp.city;
// 				this.salesOrderQuote.billToState = resp.stateOrProvince;
// 				this.salesOrderQuote.billToPostalCode = resp.postalCode;
// 				this.salesOrderQuote.billToCountry = resp.country;
// 			} else {
// 				this.salesOrderQuote.billToAddress1 = '';
// 				this.salesOrderQuote.billToAddress2 = '';
// 				//this.billToAddress.billToAddress3 = '';
// 				this.salesOrderQuote.billToCity = '';
// 				this.salesOrderQuote.billToState = '';
// 				this.salesOrderQuote.billToPostalCode = '';
// 				this.salesOrderQuote.billToCountry = '';
// 			}
// 		})
// 	}

// 	parsedText(text) {
//         if (text) {
//             const dom = new DOMParser().parseFromString(
//                 '<!doctype html><body>' + text,
//                 'text/html');
//             const decodedString = dom.body.textContent;
//             return decodedString;
//         }
//     }

// 	onBillToGetVendorAddress(id) {
// 		this.vendorService.getVendorAddressById(id).subscribe(res => {
// 			const resp = res;
// 			if (resp) {
// 				this.salesOrderQuote.billToAddress1 = resp.line1;
// 				this.salesOrderQuote.billToAddress2 = resp.line2;
// 				//this.billToAddress.billToAddress3 = resp.line3;
// 				this.salesOrderQuote.billToCity = resp.city;
// 				this.salesOrderQuote.billToState = resp.stateOrProvince;
// 				this.salesOrderQuote.billToPostalCode = resp.postalCode;
// 				this.salesOrderQuote.billToCountry = resp.country;
// 			} else {
// 				this.salesOrderQuote.billToAddress1 = '';
// 				this.salesOrderQuote.billToAddress2 = '';
// 				//this.billToAddress.billToAddress3 = '';
// 				this.salesOrderQuote.billToCity = '';
// 				this.salesOrderQuote.billToState = '';
// 				this.salesOrderQuote.billToPostalCode = '';
// 				this.salesOrderQuote.billToCountry = '';
// 			}
// 		})
// 	}

// 	onAddDescription(value) {
// 		this.tempMemo = "";
// 		if (value == "shipViaMemo") {
// 			this.tempMemoLabel = "Ship Via Memo";
// 			this.tempMemo = this.salesOrderQuote.shipViaMemo;
// 		}
// 		if (value == "billToMemo") {
// 			this.tempMemoLabel = "Bill To Memo";
// 			this.tempMemo = this.salesOrderQuote.billToMemo;
// 		}
// 	}

// 	onSaveDescription() {
// 		if (this.tempMemoLabel == "Ship Via Memo") {
// 			this.salesOrderQuote.shipViaMemo = this.tempMemo;
// 		}
// 		if (this.tempMemoLabel == "Bill To Memo") {
// 			this.salesOrderQuote.billToMemo = this.tempMemo;
// 		}
// 	}

// 	resetAddressShippingForm() {
// 		this.addressFormForShipping = new CustomerShippingModel();
// 		this.isEditModeShipping = false;
// 	}

// 	resetAddressBillingForm() {
// 		this.addressFormForBilling = new CustomerShippingModel();
// 		this.isEditModeBilling = false;
// 	}

// 	onClickShipSiteName(value, data?) {
// 		this.resetAddressShippingForm();

// 		let ch = +this.salesOrderQuote.shipToUserTypeId;
// 		switch (ch) {
// 			case 1:
// 				if (value === 'AddSiteName') {
// 					this.addressSiteNameHeader = 'Add Ship To Customer Details';
// 				}
// 				if (value === 'EditSiteName') {
// 					this.addressSiteNameHeader = 'Edit Ship To Customer Details';
// 					this.isEditModeShipping = true;
// 					this.tempshipToAddress = getObjectById('customerShippingAddressId', data.shipToAddressId, this.siteList);
// 				}
// 				break;
// 			case 2:
// 				if (value === 'AddSiteName') {
// 					this.addressSiteNameHeader = 'Add Ship To Vendor Details';
// 				}
// 				if (value === 'EditSiteName') {
// 					this.addressSiteNameHeader = 'Edit Ship To Vendor Details';
// 					this.isEditModeShipping = true;
// 					this.tempshipToAddress = getObjectById('vendorShippingAddressId', data.shipToAddressId, this.siteList);
// 				}
// 				break;
// 			case 3:
// 				if (value === 'AddSiteName') {
// 					this.addressSiteNameHeader = 'Add Ship To Company Details';
// 				}
// 				if (value === 'EditSiteName') {
// 					this.addressSiteNameHeader = 'Edit Ship To Company Details';
// 					this.isEditModeShipping = true;
// 					this.tempshipToAddress = getObjectById('legalEntityShippingAddressId', data.shipToAddressId, this.siteList);
// 				}
// 				break;

// 		}

// 		if (value === 'EditSiteName') {
// 			if (typeof this.tempshipToAddress.countryId == 'number') {
// 				this.addressFormForShipping = { ...this.tempshipToAddress, countryId: getObjectByValue('value', this.tempshipToAddress.countryId, this.allCountriesList) };
// 			} else {
// 				this.addressFormForShipping = { ...this.tempshipToAddress, countryId: getObjectByValue('label', this.tempshipToAddress.countryId, this.allCountriesList) };
// 			}
// 		}

// 	}

// 	onClickBillSiteName(value, data?) {
// 		this.resetAddressBillingForm();

// 		let ch = +this.salesOrderQuote.billToUserTypeId;
// 		switch (ch) {
// 			case 1:
// 				if (value === 'AddSiteName') {
// 					this.addressSiteNameHeader = 'Add Bill To Customer Details';
// 				}
// 				if (value === 'EditSiteName') {
// 					this.addressSiteNameHeader = 'Edit Bill To Customer Details';
// 					this.isEditModeShipping = true;
// 					this.tempbillToAddress = getObjectById('customerBillingAddressId', data.billToAddressId, this.billToSiteList);

// 				}
// 				break;
// 			case 2:
// 				if (value === 'AddSiteName') {
// 					this.addressSiteNameHeader = 'Add Bill To Vendor Details';
// 				}
// 				if (value === 'EditSiteName') {
// 					this.addressSiteNameHeader = 'Edit Bill To Vendor Details';
// 					this.isEditModeShipping = true;
// 					this.tempbillToAddress = getObjectById('vendorBillingAddressId', data.billToAddressId, this.billToSiteList);
// 				}
// 				break;
// 			case 3:
// 				if (value === 'AddSiteName') {
// 					this.addressSiteNameHeader = 'Add Bill To Company Details';
// 				}
// 				if (value === 'EditSiteName') {
// 					this.addressSiteNameHeader = 'Edit Bill To Company Details';
// 					this.isEditModeShipping = true;
// 					this.tempbillToAddress = getObjectById('legalEntityBillingAddressId', data.billToAddressId, this.billToSiteList);
// 				}
// 				break;

// 		}

// 		if (value === 'EditSiteName') {
// 			if (typeof this.tempbillToAddress.country == 'number') {
// 				this.addressFormForBilling = { ...this.tempbillToAddress, countryId: getObjectByValue('value', this.tempbillToAddress.countryId, this.allCountriesList) };
// 			} else {
// 				this.addressFormForBilling = { ...this.tempbillToAddress, countryId: getObjectByValue('label', this.tempbillToAddress.countryId, this.allCountriesList) };
// 			}
// 		}

// 	}

// 	get userName(): string {
// 		return this.authService.currentUser ? this.authService.currentUser.userName : "";
// 	}

// 	onChangeShipToUserType() {
// 		this.clearInputShipAddressDetails();
// 		let ch = +this.salesOrderQuote.shipToUserTypeId;
// 		switch (ch) {
// 			case 1:
// 				this.userList = this.allCustomer;
// 				if (this.isEditMode == false) {
// 					this.salesOrderQuote.shipToUserId = this.customerId;
// 				}
// 				if (this.salesOrderQuote.shipToUserId == undefined) {
// 					this.salesOrderQuote.shipToUserId = this.customerId;
// 				}
// 				this.onShipToUserSelected(this.salesOrderQuote.shipToUserId, this.salesOrderQuote, this.salesOrderQuote.shipToAddressId);
// 				break;
// 			case 2:
// 				this.userList = this.vendorList;
// 				break;
// 			case 3:
// 				this.userList = this.legalEntity;
// 				break;

// 		}

// 		if (this.salesOrderQuote.shipToUserId) {
// 			let id = this.salesOrderQuote.shipToUserId;
// 			let tShiptToUserId = this.salesOrderQuote.shipToUserId;
// 			if (tShiptToUserId['value']) {
// 				tShiptToUserId = tShiptToUserId['value']
// 			}
// 			this.salesOrderQuote.shipToUserId = getObjectById('value', tShiptToUserId, this.userList);
// 			this.onShipToUserSelected(id, this.salesOrderQuote, this.salesOrderQuote.shipToAddressId);
// 		}

// 	}

// 	async saveShippingAddress() {
// 		const data = {
// 			...this.addressFormForShipping,
// 			createdBy: this.userName,
// 			updatedBy: this.userName,
// 			masterCompanyId: 1,
// 			isActive: true,
// 		}
// 		if (this.salesOrderQuote.shipToUserTypeId == 1) {
// 			const customerData = { ...data, isPrimary: true, customerId: getValueFromObjectByKey('value', this.salesOrderQuote.shipToUserId), countryId: getValueFromObjectByKey('value', data.countryId) }
// 			if (!this.isEditModeShipping) {
// 				await this.customerService.newShippingAdd(customerData).subscribe(response => {
// 					this.onShipToUserSelected(customerData.customerId, this.salesOrderQuote, response.customerShippingId);
// 					// this.addressFormForShipping = new CustomerShippingModel()
// 					this.alertService.showMessage(
// 						'Success',
// 						`Saved Shipping Information Successfully`,
// 						MessageSeverity.success
// 					);
// 				})
// 			} else {
// 				await this.customerService.newShippingAdd(customerData).subscribe(response => {
// 					this.onShipToUserSelected(customerData.customerId, this.salesOrderQuote, response.customerShippingId);
// 					this.alertService.showMessage(
// 						'Success',
// 						`Updated Shipping Information Successfully`,
// 						MessageSeverity.success
// 					);
// 				})
// 			}
// 		}
// 		if (this.salesOrderQuote.shipToUserTypeId == 2) {
// 			const vendorData = { ...data, vendorId: getValueFromObjectByKey('value', this.salesOrderQuote.shipToUserId), countryId: getValueFromObjectByKey('value', data.countryId) }
// 			if (!this.isEditModeShipping) {
// 				await this.vendorService.newShippingAdd(vendorData).subscribe(response => {
// 					this.onShipToUserSelected(vendorData.vendorId, this.salesOrderQuote, response.vendorShippingAddressId);
// 					// this.addressFormForShipping = new CustomerShippingModel()
// 					this.alertService.showMessage(
// 						'Success',
// 						`Saved Shipping Information Successfully `,
// 						MessageSeverity.success
// 					);

// 				})
// 			} else {
// 				await this.vendorService.newShippingAdd(vendorData).subscribe(response => {
// 					this.onShipToUserSelected(vendorData.vendorId, this.salesOrderQuote, response.vendorShippingAddressId);
// 					this.alertService.showMessage(
// 						'Success',
// 						`Updated Shipping Information Successfully`,
// 						MessageSeverity.success
// 					);
// 				})
// 			}
// 		}
// 		if (this.salesOrderQuote.shipToUserTypeId == 3) {
// 			const companyData = { ...data, legalentityId: getValueFromObjectByKey('value', this.salesOrderQuote.shipToUserId), countryId: getValueFromObjectByKey('value', data.countryId) }
// 			if (!this.isEditModeShipping) {
// 				await this.companyService.addNewShippingAddress(companyData).subscribe(response => {
// 					this.onShipToUserSelected(companyData.legalentityId, this.salesOrderQuote, response.legalEntityShippingAddressId);
// 					// this.addressFormForShipping = new CustomerShippingModel()
// 					this.alertService.showMessage(
// 						'Success',
// 						`Saved Shipping Information Successfully `,
// 						MessageSeverity.success
// 					);
// 				})
// 			} else {
// 				await this.companyService.addNewShippingAddress(companyData).subscribe(response => {
// 					this.onShipToUserSelected(companyData.legalentityId, this.salesOrderQuote, response.legalEntityShippingAddressId);
// 					this.alertService.showMessage(
// 						'Success',
// 						`Updated Shipping Information Successfully`,
// 						MessageSeverity.success
// 					);
// 				})
// 			}
// 		}
// 	}

// 	onShipToUserSelected(userId, res?, id?) {
// 		this.shipToSelectedvalue = userId;
// 		this.getShipViaDetailsForShipTo();
// 		let ch = +this.salesOrderQuote.shipToUserTypeId;
// 		switch (ch) {
// 			case 1:

// 				this.onShipToCustomerSelected(userId, res, id);

// 				break;
// 			case 2:
// 				this.onShipToVendorSelected(userId, res, id);
// 				break;
// 			case 3:
// 				this.onShipToCompanySelected(userId, res, id);
// 				break;
// 		}
// 		if (!this.salesOrderQuote.salesOrderQuoteId)
// 			this.getDefaultShipping();
// 	}


// 	onShipToCustomerSelected(customerId, res?, id?) {
// 		let tCustomerId = customerId;
// 		if (tCustomerId['value']) {
// 			tCustomerId = tCustomerId['value']
// 		}
// 		this.customerService.getCustomerShipAddressGet(tCustomerId).subscribe(
// 			returnddataforbill => {
// 				this.siteList = returnddataforbill[0];
// 				// if (id) {
// 				// 	res.shipToAddressId = id;
// 				// }
// 				if (this.isEditMode) {
// 					if (customerId == this.customerId) {
// 						res.shipToAddressId = id;
// 					} else {
// 						this.getDefaultShipping();
// 					}

// 					// res.shipToAddressId = this.siteList[i].customerShippingAddressId
// 					if (res.shipToAddressId == 0) {
// 						this.siteList.push({ customerShippingAddressId: 0, address1: res.shipToAddress1, address2: res.shipToAddress2, city: res.shipToCity, stateOrProvince: res.shipToStateOrProvince, postalCode: res.shipToPostalCode, country: res.shipToCountry, siteName: res.shipToSiteName })
// 					}
// 				} else {
// 					if (this.siteList.length > 0) {
// 						for (let i = 0; i < this.siteList.length; i++) {
// 							if (this.siteList[i].isPrimary == true) {
// 								res.shipToAddressId = this.siteList[i].customerShippingAddressId
// 							}
// 						}
// 					}
// 				}

// 				this.onShipToGetAddress(res, res.shipToAddressId);
// 			});

// 		this.customerService.getContacts(tCustomerId).subscribe(data => {
// 			this.shipToContactData = data[0];
// 			// if (this.isEditMode) {
// 			// 	if(res.shipToContactId){
// 			// 		let contactId;
// 			// 		if(res.shipToContactId.contactId){
// 			// 			 contactId = res.shipToContactId.contactId;
// 			// 		} else {
// 			// 			 contactId = res.shipToContactId;
// 			// 		}
// 			// 	this.salesOrderQuote.shipToContactId = getObjectById('contactId', contactId, this.shipToContactData);
// 			// 	}
// 			// } else {
// 			for (let i = 0; i < this.shipToContactData.length; i++) {
// 				if (this.shipToContactData[i].isDefaultContact == true || this.shipToContactData[i].isDefaultContact == 'true') {
// 					this.salesOrderQuote.shipToContactId = this.shipToContactData[i]
// 				}
// 			}
// 			// }
// 		});

// 	}

// 	onShipToVendorSelected(vendorId, res?, id?) {

// 		this.vendorService.getVendorShipAddressGet(vendorId).subscribe(
// 			returdaa => {
// 				this.siteList = returdaa[0];
// 				if (id) {
// 					res.shipToAddressId = id;
// 				}
// 				if (this.isEditMode) {
// 					if (res.shipToAddressId == 0) {
// 						this.siteList.push({ vendorShippingAddressId: 0, address1: res.shipToAddress1, address2: res.shipToAddress2, city: res.shipToCity, stateOrProvince: res.shipToStateOrProvince, postalCode: res.shipToPostalCode, country: res.shipToCountry, siteName: res.shipToSiteName })
// 					}
// 				}
// 				this.onShipToGetAddress(res, res.shipToAddressId);
// 			});
// 		this.vendorService.getContacts(vendorId).subscribe(data => {
// 			this.shipToContactData = data[0]; //vendorContactsForshipTo
// 			if (this.isEditMode) {
// 				if (res.shipToContactId) {
// 					// let contactId = res.shipToContactId.contactId;
// 					let contactId = res.shipToContactId;
// 					this.salesOrderQuote.shipToContactId = getObjectById('contactId', contactId, this.shipToContactData);
// 				}
// 			}
// 		});
// 	}

// 	onShipToCompanySelected(object?, res?, id?) {
// 		this.companyService.getShippingCompanySiteNames(this.shipToSelectedvalue).subscribe((response: any[]) => {
// 			this.siteList = response;
// 			for (var i = 0; i < this.siteList.length; i++) {
// 				if (this.siteList[i]["isPrimary"] && this.salesOrderQuote.shipToSiteName !== this.siteList[i]["siteName"]) {
// 					this.salesOrderQuote.shipToSiteName = this.siteList[i]["siteName"];
// 					id = this.siteList[i]["legalEntityShippingAddressId"];
// 					break;
// 				}
// 			}

// 			if (id) {
// 				res.shipToAddressId = id;
// 			}
// 			this.onShipToGetAddress(res, res.shipToAddressId);
// 		});

// 		this.companyService.getCompanyContacts(this.shipToSelectedvalue).subscribe(response => {
// 			this.shipToContactData = response;

// 			for (var i = 0; i < this.shipToContactData.length; i++) {
// 				if (this.shipToContactData[i]["isDefaultContact"] && this.salesOrderQuote.shipToContactId !== this.shipToContactData[i]["contactId"]) {
// 					this.salesOrderQuote.shipToContactId = this.shipToContactData[i]["contactId"];
// 					break;
// 				}
// 			}

// 			if (this.isEditMode) {
// 				if (res.shipToContactId) {
// 					// let contactId = res.shipToContactId.contactId;
// 					let contactId = res.shipToContactId;
// 					this.salesOrderQuote.shipToContactId = getObjectById('contactId', contactId, this.shipToContactData);
// 				}
// 			}
// 		})
// 	}

// 	onShipToGetAddress(data, id) {
// 		this.shipToAddress = {};
// 		if (data.shipToUserTypeId == 1 || data.shipToUserType == 1) {
// 			if (id) {
// 				this.shipToAddress = getObjectById('customerShippingAddressId', id, this.siteList);
// 			} else {
// 				this.getDefaultShipping()
// 			}

// 		} else if (data.shipToUserTypeId == 2 || data.shipToUserType == 2) {
// 			this.shipToAddress = getObjectById('vendorShippingAddressId', id, this.siteList);
// 		} else if (data.shipToUserTypeId == 3 || data.shipToUserType == 3) {
// 			this.shipToAddress = getObjectById('legalEntityShippingAddressId', id, this.siteList);
// 			this.onShipToGetCompanyAddress(this.salesOrderQuote.shipToAddressId);
// 		}
// 		//this.shipToAddress = { ...this.shipToAddress, country: this.shipToAddress.countryName ? this.shipToAddress.countryName : this.shipToAddress.country }
// 		if (id && data.shipToUserTypeId !== 3) {
// 			this.salesOrderQuote.shipToSiteName = this.shipToAddress.siteName;
// 			this.salesOrderQuote.shipToAddress1 = this.shipToAddress.address1;
// 			this.salesOrderQuote.shipToAddress2 = this.shipToAddress.address2;
// 			this.salesOrderQuote.shipToAddress3 = this.shipToAddress.address3;
// 			this.salesOrderQuote.shipToCity = this.shipToAddress.city;
// 			this.salesOrderQuote.shipToState = this.shipToAddress.stateOrProvince;
// 			this.salesOrderQuote.shipToPostalCode = this.shipToAddress.postalCode;
// 			this.salesOrderQuote.shipToCountry = this.shipToAddress.countryName;
// 			this.salesOrderQuote.shipToCountryId = this.shipToAddress.countryId;
// 		}

// 	}
// 	clearInputShipTo() {
// 		this.salesOrderQuote.shipToUserId = null;
// 		//this.salesOrderQuote.shipToAddressId = "null";
// 		this.salesOrderQuote.shipToContactId = null;
// 		//this.salesOrderQuote.shipToMemo = '';
// 		this.salesOrderQuote.shippingId = "null";
// 		this.salesOrderQuote.shipViaShippingAccountInfo = null;
// 		this.salesOrderQuote.shippingId = null;
// 		this.salesOrderQuote.shippingURL = '';
// 		this.salesOrderQuote.shipViaMemo = '';
// 		this.shipToAddress = {};
// 		this.shipViaList = [];
// 		this.siteList = [];
// 	}

// 	clearInputOnClickUserIdShipTo() {
// 		//	this.salesOrderQuote.shipToAddressId = "null";
// 		// this.salesOrderQuote.shipToContactId = null;
// 		//	this.salesOrderQuote.shipToMemo = '';
// 		//	this.salesOrderQuote.shipViaId = "null";
// 		this.salesOrderQuote.shipViaShippingAccountInfo = null;
// 		this.salesOrderQuote.shippingId = null;
// 		this.salesOrderQuote.shippingURL = '';
// 		this.shipToAddress = {};
// 		this.shipViaList = [];
// 		this.siteList = [];
// 		this.salesOrderQuote.shipToAddress1 = "";
// 		this.salesOrderQuote.shipToAddress2 = "";
// 		this.salesOrderQuote.shipToAddress3 = "";
// 		this.salesOrderQuote.shipToCity = "";
// 		this.salesOrderQuote.shipToState = "";
// 		this.salesOrderQuote.shipToPostalCode = "";
// 		this.salesOrderQuote.shipToCountry = "";
// 		this.salesOrderQuote.shipViaMemo = '';

// 	}

// 	clearInputShipAddressDetails() {
// 		this.salesOrderQuote.shipToAddress1 = "";
// 		this.salesOrderQuote.shipToAddress2 = "";
// 		this.salesOrderQuote.shipToAddress3 = "";
// 		this.salesOrderQuote.shipToCity = "";
// 		this.salesOrderQuote.shipToState = "";
// 		this.salesOrderQuote.shipToPostalCode = "";
// 		this.salesOrderQuote.shipToCountry = "";
// 		// this.salesOrderQuote.shipViaMemo = '';
// 	}


// 	getShipViaDetailsForShipTo(id?) {
// 		let tShipToUserTypeId = this.salesOrderQuote.shipToUserTypeId;
// 		if (tShipToUserTypeId['value']) {
// 			tShipToUserTypeId = tShipToUserTypeId['value']
// 		}
// 		let tshipToSelectedvalue = this.shipToSelectedvalue;
// 		if (tshipToSelectedvalue['value']) {
// 			tshipToSelectedvalue = tshipToSelectedvalue['value']
// 		}
// 		this.commonService.getShipViaDetailsByModule(tShipToUserTypeId, tshipToSelectedvalue).subscribe(response => {
// 			this.shipViaList = response;
// 			if (this.shipViaList.length > 0) {
// 				for (let i = 0; i < this.shipViaList.length; i++) {
// 					if (this.shipViaList[i].isPrimary == true) {
// 						this.salesOrderQuote.shipViaName = this.shipViaList[i].name;
// 						this.salesOrderQuote.shipViaShippingAccountInfo = this.shipViaList[i].shippingAccountInfo;
// 						this.salesOrderQuote.shippingId = this.shipViaList[i].shippingViaId
// 						// this.salesOrderQuote.shipViaMemo = this.shipViaList[i].memo;

// 					}
// 				}
// 			}


// 			if (id) {
// 				//	this.salesOrderQuote.shipViaId = id;
// 				this.getShipViaDetails(id);
// 			}
// 		})
// 	}

// 	getShipViaDetails(id) {
// 		this.salesOrderQuote.shipViaShippingAccountInfo = null;
// 		this.salesOrderQuote.shippingId = null;
// 		this.salesOrderQuote.shippingURL = '';
// 		// this.salesOrderQuote.shipViaMemo = '';
// 		this.salesOrderQuote.shipViaShippingURL = '';
// 		var userType = this.salesOrderQuote.shipToUserTypeId ? this.salesOrderQuote.shipToUserTypeId : 0;
// 		this.commonService.getShipViaDetailsById(id, userType).subscribe(res => {
// 			const responseData = res;
// 			this.salesOrderQuote.shipViaShippingAccountInfo = responseData.shippingAccountInfo;
// 			this.salesOrderQuote.shippingURL = responseData.shippingURL;
// 			this.salesOrderQuote.shipViaShippingURL = responseData.shippingURL;
// 			this.salesOrderQuote.shippingId = responseData.shippingId;
// 			this.salesOrderQuote.shipViaName = responseData.shipVia;
// 			// this.salesOrderQuote.shipViaMemo = responseData.shipVia;
// 		})
// 	}

// 	//Bill to
// 	onChangeBillToUserType() {
// 		this.clearInputOnClickUserIdBillTo();
// 		let ch = +this.salesOrderQuote.billToUserTypeId;
// 		switch (ch) {
// 			case 1:
// 				this.billToUserList = this.allCustomer;
// 				if (this.isEditMode == false) {
// 					this.salesOrderQuote.billToUserId = this.customerId;
// 				}
// 				let tBillToUserId = this.salesOrderQuote.billToUserId;
// 				if (tBillToUserId['value']) {
// 					tBillToUserId = tBillToUserId['value']
// 				}
// 				this.onBillToUserSelected(tBillToUserId, this.salesOrderQuote, this.salesOrderQuote.billToAddressId);
// 				break;
// 			case 2:
// 				this.billToUserList = this.vendorList;
// 				break;
// 			case 3:
// 				this.billToUserList = this.legalEntity;
// 				break;

// 		}
// 		if (this.salesOrderQuote.billToUserId) {
// 			let id = this.salesOrderQuote.billToUserId;
// 			let tBillToUserId = this.salesOrderQuote.billToUserId;
// 			if (tBillToUserId['value']) {
// 				tBillToUserId = tBillToUserId['value']
// 			}
// 			this.salesOrderQuote.billToUserId = getObjectById('value', tBillToUserId, this.billToUserList);
// 			this.onBillToUserSelected(id, this.salesOrderQuote, this.salesOrderQuote.billToAddressId);
// 		}
// 	}
// 	async saveBillingAddress() {
// 		const data = {
// 			...this.addressFormForBilling,
// 			createdBy: this.userName,
// 			updatedBy: this.userName,
// 			masterCompanyId: 1,
// 			isActive: true,
// 			isPrimary: true
// 		}
// 		if (this.salesOrderQuote.billToUserTypeId == 1) {
// 			const customerData = { ...data, customerId: getValueFromObjectByKey('value', this.salesOrderQuote.billToUserId), countryId: getValueFromObjectByKey('value', data.countryId) }
// 			if (!this.isEditModeBilling) {
// 				await this.customerService.newBillingAdd(customerData).subscribe(response => {
// 					this.onBillToCustomerSelected(customerData.customerId, this.salesOrderQuote, response.customerBillingAddressId);
// 					// this.addressFormForBilling = new CustomerShippingModel()
// 					this.alertService.showMessage(
// 						'Success',
// 						`Saved  Billing Information Sucessfully `,
// 						MessageSeverity.success
// 					);
// 				})
// 			} else {
// 				await this.customerService.newBillingAdd(customerData).subscribe(response => {
// 					this.onBillToCustomerSelected(customerData.customerId, this.salesOrderQuote, response.customerBillingAddressId);
// 					this.alertService.showMessage(
// 						'Success',
// 						`Updated Billing Information Successfully`,
// 						MessageSeverity.success
// 					);
// 				})
// 			}

// 		}
// 		if (this.salesOrderQuote.billToUserTypeId == 2) {

// 			const vendorData = { ...data, vendorId: getValueFromObjectByKey('vendorId', this.salesOrderQuote.billToUserId), countryId: getValueFromObjectByKey('label', data.countryId) }
// 			if (!this.isEditModeBilling) {
// 				await this.vendorService.addNewBillingAddress(vendorData).subscribe(response => {
// 					this.onBillToVendorSelected(vendorData.vendorId, this.salesOrderQuote, response.vendorBillingAddressId);
// 					//this.onBillCompanySelected();
// 					// this.addressFormForBilling = new CustomerShippingModel()
// 					this.alertService.showMessage(
// 						'Success',
// 						`Saved  Billing Information Sucessfully `,
// 						MessageSeverity.success
// 					);
// 				})
// 			} else {
// 				await this.vendorService.addNewBillingAddress(vendorData).subscribe(response => {
// 					this.onBillToVendorSelected(vendorData.vendorId, this.salesOrderQuote, response.vendorBillingAddressId);
// 					this.alertService.showMessage(
// 						'Success',
// 						`Updated Billing Information Successfully`,
// 						MessageSeverity.success
// 					);
// 				})
// 			}
// 		}
// 		if (this.salesOrderQuote.billToUserTypeId == 3) {
// 			const companyData = { ...data, legalentityId: getValueFromObjectByKey('value', this.salesOrderQuote.billToUserId), countryId: getValueFromObjectByKey('label', data.countryId) }
// 			if (!this.isEditModeBilling) {
// 				await this.companyService.addNewBillingAddress(companyData).subscribe(response => {
// 					this.onBillToCompanySelected(null, this.salesOrderQuote, response.legalEntityBillingAddressId);
// 					// this.addressFormForBilling = new CustomerShippingModel()
// 					this.alertService.showMessage(
// 						'Success',
// 						`Saved  Billing Information Sucessfully `,
// 						MessageSeverity.success
// 					);
// 				})
// 			} else {
// 				await this.companyService.addNewBillingAddress(companyData).subscribe(response => {
// 					this.onBillToCompanySelected(null, this.salesOrderQuote, response.legalEntityBillingAddressId);
// 					this.alertService.showMessage(
// 						'Success',
// 						`Updated Billing Information Successfully`,
// 						MessageSeverity.success
// 					);
// 				})
// 			}
// 		}
// 		// this.onBillCompanySelected();
// 	}

// 	onBillToUserSelected(userId, res?, id?) {
// 		this.clearInputOnClickUserIdBillTo();
// 		this.billToSelectedvalue = userId;
// 		let ch = +this.salesOrderQuote.billToUserTypeId;
// 		switch (ch) {
// 			case 1:
// 				this.onBillToCustomerSelected(userId, res, id);
// 				break;
// 			case 2:
// 				this.onBillToVendorSelected(userId, res, id);
// 				break;
// 			case 3:
// 				this.onBillToCompanySelected(userId, res, id);
// 				break;

// 		}
// 		if (!this.salesOrderQuote.salesOrderQuoteId)
// 			this.getDefaultBilling();
// 	}

// 	// bill to
// 	onBillToCustomerSelected(customerId, res?, id?) {
// 		if (customerId['value']) {
// 			customerId = customerId['value']
// 		}
// 		this.customerService.getCustomerBillViaDetails(customerId).subscribe(
// 			(returnddataforbill: any[]) => {
// 				this.billToSiteList = returnddataforbill[0];
// 				// if (id) {
// 				// 	res.billToAddressId = id;
// 				// }

// 				if (this.isEditMode) {
// 					if (customerId == this.customerId) {
// 						res.billToAddressId = id;
// 					} else {
// 						this.getDefaultBilling();
// 					}
// 					if (res.billToAddressId == 0) {
// 						this.billToSiteList.push({ customerBillingAddressId: 0, address1: res.billToAddress1, address2: res.billToAddress2, city: res.billToCity, stateOrProvince: res.billToStateOrProvince, postalCode: res.billToPostalCode, country: res.billToCountry, siteName: res.billToSiteName })
// 					}
// 				} else {
// 					if (this.billToSiteList.length > 0) {
// 						for (let i = 0; i < this.billToSiteList.length; i++) {
// 							if (this.billToSiteList[i].isPrimary == true) {
// 								res.billToAddressId = this.billToSiteList[i].customerBillingAddressId
// 							}
// 						}
// 					}
// 				}


// 				this.onBillToGetAddress(res, res.billToAddressId);
// 			});
// 		let tCustomerId = customerId;
// 		if (tCustomerId['value']) {
// 			tCustomerId = tCustomerId['value']
// 		}
// 		this.customerService.getContacts(tCustomerId).subscribe(data => {
// 			this.billToContactData = data[0];
// 			// if (this.isEditMode) {

// 			// 	if(res.billToContactId){
// 			// 		// let contactId = res.billToContactId.contactId;
// 			// 		let contactId = res.billToContactId;
// 			// 		this.salesOrderQuote.billToContactId = getObjectById('contactId', contactId, this.billToContactData);
// 			// 		}
// 			// }
// 			// if (this.isEditMode) {
// 			// 	if(res.billToContactId){
// 			// 		let contactId;
// 			// 		if(res.billToContactId.contactId){
// 			// 			 contactId = res.billToContactId.contactId;
// 			// 		} else {
// 			// 			 contactId = res.billToContactId;
// 			// 		}
// 			// 	this.salesOrderQuote.billToContactId = getObjectById('contactId', contactId, this.billToContactData);
// 			// 	}
// 			// } else {
// 			for (let i = 0; i < this.billToContactData.length; i++) {
// 				if (this.billToContactData[i].isDefaultContact == true || this.billToContactData[i].isDefaultContact == 'true') {
// 					this.salesOrderQuote.billToContactId = this.billToContactData[i]
// 				}
// 			}
// 			// }

// 		});
// 	}

// 	onBillToVendorSelected(vendorId, res?, id?) {
// 		//	this.showInput = true;
// 		this.vendorService.getVendorSiteNames(vendorId).subscribe(
// 			(returdaa: any[]) => {
// 				this.billToSiteList = returdaa;
// 				if (id) {
// 					res.billToAddressId = id;
// 					// this.onBillToGetAddress(res, res.billToAddressId);
// 				}
// 				if (this.isEditMode) {
// 					if (res.billToAddressId == 0) {
// 						this.billToSiteList.push({ vendorBillingAddressId: 0, siteName: res.billToSiteName });
// 					}
// 					//  else {
// 					// 	this.onBillToGetAddress(res, res.billToAddressId);
// 					// }
// 				}
// 				this.onBillToGetAddress(res, res.billToAddressId);

// 			})
// 		this.vendorService.getContacts(vendorId).subscribe(
// 			returdaa => {
// 				this.billToContactData = returdaa[0];
// 				if (this.isEditMode) {
// 					if (res.billToContactId) {
// 						// let contactId = res.billToContactId.contactId;
// 						let contactId = res.billToContactId;
// 						this.salesOrderQuote.billToContactId = getObjectById('contactId', contactId, this.billToContactData);
// 					}
// 				}
// 			})
// 	}

// 	onBillToCompanySelected(object?, response?, id?) {
// 		this.companyService.getBillingCompanySiteNames(this.billToSelectedvalue).subscribe((res: any[]) => {
// 			this.billToSiteList = res;
// 			for (var i = 0; i < this.billToSiteList.length; i++) {
// 				if (this.billToSiteList[i]["isPrimary"] && this.salesOrderQuote.billToSiteName !== this.billToSiteList[i]["siteName"]) {
// 					this.salesOrderQuote.billToSiteName = this.billToSiteList[i]["siteName"];
// 					id = this.billToSiteList[i]["legalEntityBillingAddressId"];
// 					break;
// 				}
// 			}

// 			if (id) {
// 				response.billToAddressId = id;
// 			}
// 			this.onBillToGetAddress(response, response.billToAddressId);
// 		})

// 		this.companyService.getCompanyContacts(this.billToSelectedvalue).subscribe((res: any[]) => {
// 			this.billToContactData = res;

// 			for (var i = 0; i < this.billToContactData.length; i++) {
// 				if (this.billToContactData[i]["isDefaultContact"] && this.salesOrderQuote.billToContactId !== this.billToContactData[i]["contactId"]) {
// 					this.salesOrderQuote.billToContactId = this.billToContactData[i]["contactId"];
// 					break;
// 				}
// 			}

// 			if (this.isEditMode) {
// 				if (response.billToContactId) {
// 					// let contactId = response.billToContactId.contactId;
// 					let contactId = response.billToContactId;
// 					this.salesOrderQuote.billToContactId = getObjectById('contactId', contactId, this.billToContactData);
// 				}
// 			}
// 		})
// 	}

// 	onBillToGetAddress(data, id) {
// 		this.billToAddress = {};
// 		if (data.billToUserTypeId == 1 || data.billToUserType == 1) {
// 			if (id) {
// 				this.billToAddress = getObjectById('customerBillingAddressId', id, this.billToSiteList);
// 			} else {
// 				this.getDefaultBilling();
// 			}

// 		} else if (data.billToUserTypeId == 2 || data.billToUserType == 2) {
// 			this.billToAddress = getObjectById('vendorBillingAddressId', id, this.billToSiteList);
// 			this.onBillToGetVendorAddress(id);
// 		} else if (data.billToUserTypeId == 3 || data.billToUserType == 3) {
// 			this.billToAddress = getObjectById('legalEntityBillingAddressId', id, this.billToSiteList);
// 			this.onBillToGetCompanyAddress(id);
// 		}
// 		if (data.billToUserTypeId == 1 || data.billToUserType == 1) {
// 			// this.billToAddress = { ...this.billToAddress, country: this.billToAddress.countryName ? this.billToAddress.countryName : this.billToAddress.country }
// 			this.salesOrderQuote.billToSiteName = this.billToAddress.siteName;
// 			this.salesOrderQuote.billToAddress1 = this.billToAddress.address1;
// 			this.salesOrderQuote.billToAddress2 = this.billToAddress.address2;
// 			this.salesOrderQuote.billToAddress3 = this.billToAddress.address3;
// 			this.salesOrderQuote.billToCity = this.billToAddress.city;
// 			this.salesOrderQuote.billToState = this.billToAddress.stateOrProvince;
// 			this.salesOrderQuote.billToPostalCode = this.billToAddress.postalCode;
// 			this.salesOrderQuote.billToCountry = this.billToAddress.countryName;
// 			this.salesOrderQuote.billToCountryId = this.billToAddress.countryId;
// 		}

// 	}



// 	clearInputBillTo() {
// 		this.salesOrderQuote.billToUserId = null;
// 		// this.salesOrderQuote.billToAddressId = null;
// 		this.salesOrderQuote.billToContactId = null;
// 		this.billToAddress = {};
// 		this.salesOrderQuote.billToMemo = '';
// 		this.billToSiteList = [];
// 	}
// 	clearInputBillAddressDetails() {
// 		this.salesOrderQuote.shipToAddress1 = "";
// 		this.salesOrderQuote.shipToAddress2 = "";
// 		this.salesOrderQuote.shipToAddress3 = "";
// 		this.salesOrderQuote.shipToCity = "";
// 		this.salesOrderQuote.shipToState = "";
// 		this.salesOrderQuote.shipToPostalCode = "";
// 		this.salesOrderQuote.shipToCountry = "";
// 		this.salesOrderQuote.shipViaMemo = '';
// 	}
// 	clearInputOnClickUserIdBillTo() {
// 		// this.salesOrderQuote.billToAddressId = null;
// 		// this.salesOrderQuote.billToContactId = null;
// 		this.billToAddress = {};
// 		// this.salesOrderQuote.billToMemo = '';
// 		this.billToSiteList = [];
// 		this.salesOrderQuote.billToAddress1 = "";
// 		this.salesOrderQuote.billToAddress2 = "";
// 		this.salesOrderQuote.billToAddress3 = "";
// 		this.salesOrderQuote.billToCity = "";
// 		this.salesOrderQuote.billToState = "";
// 		this.salesOrderQuote.billToPostalCode = "";
// 		this.salesOrderQuote.billToCountry = "";
// 		this.salesOrderQuote.billToMemo = '';
// 	}

// 	//Ship via 
// 	resetAddressShipViaForm() {
// 		this.addShipViaFormForShipping = new CustomerInternationalShipVia();
// 		this.isEditModeShipVia = false;

// 	}
// 	onEditShipVia(data) {
// 		//if(value == 'EditCustShipVia') {
// 		if (data.shipViaId) {
// 			this.tempshipVia = getObjectById('shippingViaId', data.shipViaId, this.shipViaList);
// 			this.addShipViaFormForShipping = { ...this.tempshipVia, shipVia: this.tempshipVia.name };
// 			this.isEditModeShipVia = true;
// 		}

// 		//}
// 		let content = this.shipToShipVia;
// 		this.shipToShipViaModal = this.modalService.open(content, { size: "sm" });
// 		this.shipToShipViaModal.result.then(
// 			() => {
// 				console.log("When user closes");
// 			},
// 			() => {
// 				console.log("Backdrop click");
// 			}
// 		);
// 	}

// 	clsoeShipViaModal() {
// 		this.shipToShipViaModal.close();
// 	}
// 	async saveShipViaForShipTo() {
// 		//this.salesOrderQuote.shipViaId = "null";
// 		this.salesOrderQuote.shipViaShippingAccountInfo = '';
// 		this.salesOrderQuote.shippingId = '';
// 		this.salesOrderQuote.shippingURL = '';
// 		const data = {
// 			...this.addShipViaFormForShipping,
// 			name: getValueFromArrayOfObjectById('label', 'value', this.addShipViaFormForShipping.shipViaId, this.allShipViaInfo),
// 			shipVia: name,
// 			createdBy: this.userName,
// 			updatedBy: this.userName,
// 			masterCompanyId: 1,
// 			isActive: true,
// 			UserType: this.salesOrderQuote.shipToUserTypeId
// 		}

// 		if (this.salesOrderQuote.shipToUserTypeId == 1) {
// 			const customerData = { ...data, ReferenceId: getValueFromObjectByKey('value', this.salesOrderQuote.shipToUserId), AddressId: this.salesOrderQuote.shipToAddressId ? this.salesOrderQuote.shipToAddressId : 0 }
// 			if (!this.isEditModeShipVia) {
// 				await this.commonService.createShipVia(customerData).subscribe(response => {
// 					this.getShipViaDetailsForShipTo(response.shippingViaId);
// 					// this.addressFormForShipping = new CustomerShippingModel()
// 					this.alertService.showMessage(
// 						'Success',
// 						`Saved Ship Via Information Sucessfully `,
// 						MessageSeverity.success
// 					);
// 					this.clsoeShipViaModal()
// 				})
// 			} else {
// 				await this.commonService.createShipVia(customerData).subscribe(response => {
// 					this.getShipViaDetailsForShipTo(response.shippingViaId);
// 					this.alertService.showMessage(
// 						'Success',
// 						`Updated Ship Via Information Sucessfully`,
// 						MessageSeverity.success
// 					);
// 					this.clsoeShipViaModal()
// 				})
// 			}
// 		}
// 		if (this.salesOrderQuote.shipToUserTypeId == 2) {
// 			const vendorData = { ...data, ReferenceId: getValueFromObjectByKey('vendorId', this.salesOrderQuote.shipToUserId), AddressId: this.salesOrderQuote.shipToAddressId ? this.salesOrderQuote.shipToAddressId : 0 }
// 			if (!this.isEditModeShipVia) {
// 				await this.commonService.createShipVia(vendorData).subscribe(response => {
// 					this.getShipViaDetailsForShipTo(response.shippingViaId);
// 					// this.addressFormForShipping = new CustomerShippingModel()
// 					this.alertService.showMessage(
// 						'Success',
// 						`Saved  Ship Via Information Sucessfully `,
// 						MessageSeverity.success
// 					);
// 					this.clsoeShipViaModal()
// 				})
// 			} else {
// 				await this.commonService.createShipVia(vendorData).subscribe(response => {
// 					this.getShipViaDetailsForShipTo(response.shippingViaId);
// 					this.alertService.showMessage(
// 						'Success',
// 						`Updated Ship Via Information Sucessfully`,
// 						MessageSeverity.success
// 					);
// 					this.clsoeShipViaModal()
// 				})
// 			}

// 		}

// 		if (this.salesOrderQuote.shipToUserTypeId == 3) {
// 			const companyData = { ...data, ReferenceId: getValueFromObjectByKey('value', this.salesOrderQuote.shipToUserId), AddressId: this.salesOrderQuote.shipToAddressId ? this.salesOrderQuote.shipToAddressId : 0 }
// 			if (!this.isEditModeShipVia) {
// 				await this.commonService.createShipVia(companyData).subscribe(response => {
// 					this.getShipViaDetailsForShipTo(response.shippingViaId);
// 					// this.addressFormForShipping = new CustomerShippingModel()
// 					this.alertService.showMessage(
// 						'Success',
// 						`Saved  Ship Via Information Sucessfully `,
// 						MessageSeverity.success
// 					);
// 					this.clsoeShipViaModal()
// 				})
// 			} else {
// 				await this.commonService.createShipVia(companyData).subscribe(response => {
// 					this.getShipViaDetailsForShipTo(response.shippingViaId);
// 					this.alertService.showMessage(
// 						'Success',
// 						`Updated Ship Via Information Sucessfully`,
// 						MessageSeverity.success
// 					);
// 					this.clsoeShipViaModal()
// 				})
// 			}
// 		}
// 	}
// 	openConfirmationModal() {

// 		this.modal = this.modalService.open(this.updatePNDetailsModal, { size: "sm" });
// 		this.modal.result.then(
// 			() => { },
// 			() => { }
// 		);

// 	}

// 	closeConfirmationModal() {
// 		if (this.modal) {
// 			this.modal.close();
// 		}
// 	}

// 	approve() {

// 		let partList: any = [];
// 		if (this.salesQuoteView == undefined) {
// 			// this.salesOrderView.approverList = [];
// 			this.salesOrderView.parts = [];
// 			this.salesOrderView.salesOrder.billToContactName = editValueAssignByCondition(
// 				"firstName",
// 				this.salesOrderQuote.billToContactId
// 			);
// 			this.salesOrderView.salesOrder.billToContactId = editValueAssignByCondition(
// 				"contactId",
// 				this.salesOrderQuote.billToContactId
// 			);
// 			this.salesOrderView.salesOrder.shipToContactName = editValueAssignByCondition(
// 				"firstName",
// 				this.salesOrderQuote.shipToContactId
// 			);
// 			this.salesOrderView.salesOrder.shipToContactId = editValueAssignByCondition(
// 				"contactId",
// 				this.salesOrderQuote.shipToContactId
// 			);
// 			this.salesOrderView.salesOrder.shipToUserId = editValueAssignByCondition(
// 				"value",
// 				this.salesOrderQuote.shipToUserId
// 			);
// 			this.salesOrderView.salesOrder.billToUserId = editValueAssignByCondition(
// 				"value",
// 				this.salesOrderQuote.billToUserId
// 			);
// 			//this.salesOrder.leadSourceId = this.salesQuote.leadSourceId;


// 			this.salesOrderView.salesOrder.shipToUserTypeId = this.salesOrderQuote.shipToUserTypeId;
// 			this.salesOrderView.salesOrder.shipToAddressId = this.salesOrderQuote.shipToAddressId;
// 			this.salesOrderView.salesOrder.shipViaId = this.salesOrderQuote.shipViaId;
// 			this.salesOrderView.salesOrder.shipToSiteName = this.salesOrderQuote.shipToSiteName;
// 			this.salesOrderView.salesOrder.shipToAddress1 = this.salesOrderQuote.shipToAddress1;
// 			this.salesOrderView.salesOrder.shipToAddress2 = this.salesOrderQuote.shipToAddress2;
// 			this.salesOrderView.salesOrder.shipToCity = this.salesOrderQuote.shipToCity;
// 			this.salesOrderView.salesOrder.shipToState = this.salesOrderQuote.shipToState;
// 			this.salesOrderView.salesOrder.shipToPostalCode = this.salesOrderQuote.shipToPostalCode;
// 			this.salesOrderView.salesOrder.shipToCountry = this.salesOrderQuote.shipToCountry;
// 			this.salesOrderView.salesOrder.shipToCountryId = this.salesOrderQuote.shipToCountryId;
// 			this.salesOrderView.salesOrder.shipViaName = this.salesOrderQuote.shipViaName;
// 			this.salesOrderView.salesOrder.shipViaShippingAccountInfo = this.salesOrderQuote.shipViaShippingAccountInfo;
// 			this.salesOrderView.salesOrder.shippingId = this.salesOrderQuote.shippingId;
// 			this.salesOrderView.salesOrder.shippingURL = this.salesOrderQuote.shippingURL;
// 			this.salesOrderView.salesOrder.shipViaMemo = this.salesOrderQuote.shipViaMemo;
// 			this.salesOrderView.salesOrder.shipViaShippingURL = this.salesOrderQuote.shipViaShippingURL;
// 			this.salesOrderView.salesOrder.billToUserTypeId = this.salesOrderQuote.billToUserTypeId;
// 			this.salesOrderView.salesOrder.billToAddressId = this.salesOrderQuote.billToAddressId;
// 			this.salesOrderView.salesOrder.billToSiteName = this.salesOrderQuote.billToSiteName;
// 			this.salesOrderView.salesOrder.billToAddress1 = this.salesOrderQuote.billToAddress1;
// 			this.salesOrderView.salesOrder.billToAddress2 = this.salesOrderQuote.billToAddress2;
// 			this.salesOrderView.salesOrder.billToCity = this.salesOrderQuote.billToCity;
// 			this.salesOrderView.salesOrder.billToState = this.salesOrderQuote.billToState;
// 			this.salesOrderView.salesOrder.billToPostalCode = this.salesOrderQuote.billToPostalCode;
// 			this.salesOrderView.salesOrder.billToCountry = this.salesOrderQuote.billToCountry;
// 			this.salesOrderView.salesOrder.billToCountryId = this.salesOrderQuote.billToCountryId;
// 			this.salesOrderView.salesOrder.billToMemo = this.salesOrderQuote.billToMemo;

// 			this.salesOrderQuote.salesOrderQuoteId = null;


// 			this.salesOrderView.salesOrder.updatedBy = this.userName;

// 			this.salesOrderView.salesOrder.updatedOn = new Date().toDateString();
// 			//this.salesOrderView = new SalesOrderView();
// 			//if (this.salesQuote.salesOrderQuoteId) {
// 			//	this.salesOrder.salesOrderQuoteId = this.salesQuote.salesOrderQuoteId;
// 			//}

// 			//this.salesOrderView.salesOrder = this.salesOrder;

// 			this.salesOrderService.update(this.salesOrderView).subscribe(data => {
// 				this.alertService.stopLoadingMessage();
// 				this.alertService.showMessage(
// 					"Success",
// 					`Address updated successfully.`,
// 					MessageSeverity.success
// 				);
// 			});

// 			this.closeConfirmationModal();
// 		}
// 		else {
// 			// this.salesQuoteView.approverList = [];
// 			this.salesQuoteView.parts = [];

// 			this.salesQuoteView.salesOrderQuote.billToContactName = editValueAssignByCondition(
// 				"firstName",
// 				this.salesOrderQuote.billToContactId
// 			);
// 			this.salesQuoteView.salesOrderQuote.billToContactId = editValueAssignByCondition(
// 				"contactId",
// 				this.salesOrderQuote.billToContactId
// 			);
// 			this.salesQuoteView.salesOrderQuote.shipToContactName = editValueAssignByCondition(
// 				"firstName",
// 				this.salesOrderQuote.shipToContactId
// 			);
// 			this.salesQuoteView.salesOrderQuote.shipToContactId = editValueAssignByCondition(
// 				"contactId",
// 				this.salesOrderQuote.shipToContactId
// 			);
// 			this.salesQuoteView.salesOrderQuote.shipToUserId = editValueAssignByCondition(
// 				"value",
// 				this.salesOrderQuote.shipToUserId
// 			);
// 			this.salesQuoteView.salesOrderQuote.billToUserId = editValueAssignByCondition(
// 				"value",
// 				this.salesOrderQuote.billToUserId
// 			);
// 			//this.salesOrder.leadSourceId = this.salesQuote.leadSourceId;


// 			this.salesQuoteView.salesOrderQuote.shipToUserTypeId = this.salesOrderQuote.shipToUserTypeId;
// 			this.salesQuoteView.salesOrderQuote.shipToAddressId = this.salesOrderQuote.shipToAddressId;
// 			this.salesQuoteView.salesOrderQuote.shipViaId = this.salesOrderQuote.shipViaId;
// 			this.salesQuoteView.salesOrderQuote.shipToSiteName = this.salesOrderQuote.shipToSiteName;
// 			this.salesQuoteView.salesOrderQuote.shipToAddress1 = this.salesOrderQuote.shipToAddress1;
// 			this.salesQuoteView.salesOrderQuote.shipToAddress2 = this.salesOrderQuote.shipToAddress2;
// 			this.salesQuoteView.salesOrderQuote.shipToCity = this.salesOrderQuote.shipToCity;
// 			this.salesQuoteView.salesOrderQuote.shipToState = this.salesOrderQuote.shipToState;
// 			this.salesQuoteView.salesOrderQuote.shipToPostalCode = this.salesOrderQuote.shipToPostalCode;
// 			this.salesQuoteView.salesOrderQuote.shipToCountry = this.salesOrderQuote.shipToCountry;
// 			this.salesQuoteView.salesOrderQuote.shipViaName = this.salesOrderQuote.shipViaName;
// 			this.salesQuoteView.salesOrderQuote.shipViaShippingAccountInfo = this.salesOrderQuote.shipViaShippingAccountInfo;
// 			this.salesQuoteView.salesOrderQuote.shippingId = this.salesOrderQuote.shippingId;
// 			this.salesQuoteView.salesOrderQuote.shippingURL = this.salesOrderQuote.shippingURL;
// 			this.salesQuoteView.salesOrderQuote.shipViaMemo = this.salesOrderQuote.shipViaMemo;
// 			this.salesQuoteView.salesOrderQuote.shipViaShippingURL = this.salesOrderQuote.shipViaShippingURL;
// 			this.salesQuoteView.salesOrderQuote.billToUserTypeId = this.salesOrderQuote.billToUserTypeId;
// 			this.salesQuoteView.salesOrderQuote.billToAddressId = this.salesOrderQuote.billToAddressId;
// 			this.salesQuoteView.salesOrderQuote.billToSiteName = this.salesOrderQuote.billToSiteName;
// 			this.salesQuoteView.salesOrderQuote.billToAddress1 = this.salesOrderQuote.billToAddress1;
// 			this.salesQuoteView.salesOrderQuote.billToAddress2 = this.salesOrderQuote.billToAddress2;
// 			this.salesQuoteView.salesOrderQuote.billToCity = this.salesOrderQuote.billToCity;
// 			this.salesQuoteView.salesOrderQuote.billToState = this.salesOrderQuote.billToState;
// 			this.salesQuoteView.salesOrderQuote.billToPostalCode = this.salesOrderQuote.billToPostalCode;
// 			this.salesQuoteView.salesOrderQuote.billToCountry = this.salesOrderQuote.billToCountry;
// 			this.salesQuoteView.salesOrderQuote.billToMemo = this.salesOrderQuote.billToMemo;
// 			this.salesQuoteView.salesOrderQuote.shipToCountryId = this.salesOrderQuote.shipToCountryId;
// 			this.salesQuoteView.salesOrderQuote.billToCountryId = this.salesOrderQuote.billToCountryId;


// 			this.salesOrderQuote.salesOrderQuoteId = null;


// 			this.salesQuoteView.salesOrderQuote.updatedBy = this.userName;

// 			this.salesQuoteView.salesOrderQuote.updatedOn = new Date().toDateString();

// 			this.salesQuoteService.update(this.salesQuoteView).subscribe(data => {
// 				this.alertService.stopLoadingMessage();
// 				this.alertService.showMessage(
// 					"Success",
// 					`Address updated successfully.`,
// 					MessageSeverity.success
// 				);
// 			});

// 			this.closeConfirmationModal();
// 		}


// 	}
}