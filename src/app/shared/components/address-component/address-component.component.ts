import { RepairOrder } from './../../../components/receiving/repair-order/receiving-ro/RepairOrder.model';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
declare var $: any;
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { CustomerShippingModel } from '../../../models/customer-shipping.model';
import { CustomerInternationalShipVia } from '../../../models/customer-internationalshipping.model';
import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { CommonService } from '../../../services/common.service';
import { CustomerService } from '../../../services/customer.service';
import { AuthService } from '../../../services/auth.service';
import { PurchaseOrderService } from '../../../services/purchase-order.service';
import { SalesQuoteService } from '../../../services/salesquote.service';
import { AddressTypeEnum } from './Address-type-enum';
import { editValueAssignByCondition, getValueFromArrayOfObjectById, getObjectByValue, getObjectById, formatNumberAsGlobalSettingsModule, getValueFromObjectByKey } from '../../../generic/autocomplete';
import { AppModuleEnum } from '../../../enum/appmodule.enum';

@Component({
	selector: 'app-address-component',
	templateUrl: './address-component.component.html',
	styleUrls: ['./address-component.component.scss']
})
export class AddressComponentComponent implements OnInit {

	@Input() addressType: any;
	@Input() id: any;
	@ViewChild('createPOAddressForm', { static: true }) createPOAddressForm: NgForm;
	shipToUserTypeValidCheck: boolean;
	firstNamesShipTo: any[] = [];
	firstNamesBillTo: any[] = [];
	shipToAddressList: any[] = [];
	shipToContactDataList: any[] = [];
	billToContactDataList: any[] = [];
	billToAddressList: any[] = [];
	sourcePoApprovalObj: any = {};
	sourcePoApproval: any = {};
	shipToAddress: any = {};
	shipViaList: any = [];
	shipToSite: any[] = [];
	shipToContactData: any = [];
	vendorSelected: any[] = [];
	companySiteList_Shipping: any;
	billToAddress: any = {};
	billToSite: any;
	vendorSelectedForBillTo: any;
	companySiteList_Billing: any;
	managementValidCheck: boolean;
	shipToSiteNameValidCheck: boolean;
	shipViaValidCheck: boolean;
	billToUserTypeValidCheck: boolean;
	billToSiteNameValidCheck: boolean;
	shipToSelectedvalue: any;
	isSpinnerVisible: boolean = false;
	isEditMode: boolean;
	userTypes: any = [];
	companyModuleId: number;
	vendorModuleId: number;
	customerModuleId: number;
	userShipingList: any[] = [];
	userShipingIdList: any[] = [];
	userBillingList: any[] = [];
	userBillingIdList: any[] = [];
	isEditModeAdd: boolean = false;
	inputValidCheckAdd: any;
	enableAddSaveBtn: boolean = false;
	addressMemoLabel: string;
	tempMemo: any;
	isEditModeShipping: boolean = false;
	isEditModeShippingPoOnly: boolean = false;
	isEditModeBilling: boolean = false;
	isEditModeBillingPoOnly: boolean = false;
	isEditModeShipVia: boolean = false;
	shippingModuleName: string = "Company";
	billingingModuleName: string = "Company";
	addressSiteNameHeader: string = "";
	addressFormForShipping = new CustomerShippingModel();
	addressFormForBilling = new CustomerShippingModel();
	billingSieListOriginal: any[];
	lstfilterBillingSite: any[];
	allCountriesList: any = [];
	countriesList: any = [];
	addShipViaFormForShipping = new CustomerInternationalShipVia()
	allShipViaInfo: any = [];
	billingSieList: any[];
	arrayBillingIdlist: any[] = [];
	changeName: boolean = false;
	isSiteNameAlreadyExists: boolean = false;
	editSiteName: string = '';

	shippingSieListOriginal: any[];
	lstfilterShippingSite: any[];
	shippingSieList: any[];
	arrayShippingIdlist: any[] = [];
	isShippingSiteNameAlreadyExists: boolean = false;
	showIsPoOnlyButton: boolean;

	tempAddshipViaMemo: any = {};
	ShipViaHeader: string = "";
	ShipViabutton: boolean = false;
	ShipAddbutton: boolean = false;
	billAddbutton: boolean = false;
	defaultMSCOMPANYID: number = 0;
	ModuleID: Number;
	constructor(
		private alertService: AlertService,
		private commonService: CommonService,
		private customerService: CustomerService,
		private _actRoute: ActivatedRoute,
		private authService: AuthService,
		private purchaseOrderService: PurchaseOrderService,
		private salesQuoteService: SalesQuoteService,
	) { }

	ngOnInit() {
		this.loadModuleListForVendorComp();
		this.getCountriesList();
		this.loadShippingViaList();
		this.showIsPoOnlyButton = this.addressType == AddressTypeEnum.PurchaseOrder;
		this.sourcePoApproval.shipToUserTypeId = this.vendorModuleId;
		this.sourcePoApproval.billToUserTypeId = this.vendorModuleId;

		if (this.id !== 0 && this.id !== undefined) {
			if (this.addressType == AddressTypeEnum.PurchaseOrder) {
				this.ModuleID = AppModuleEnum.PurchaseOrder;
				this.commonService.getAllAddEditID(this.id, this.ModuleID).subscribe(res => {
					this.getShipToBillToDropDown(res)
				});
			}
			else if (this.addressType == AddressTypeEnum.SalesOrderQuote) {
				this.ModuleID = AppModuleEnum.SalesQuate;
				this.commonService.getAllAddEditID(this.id, this.ModuleID).subscribe(res => {
					this.getShipToBillToDropDown(res)
				});
			}
			else if (this.addressType == AddressTypeEnum.SalesOrder) {
				this.ModuleID = AppModuleEnum.SalesOrder;
				this.commonService.getAllAddEditID(this.id, this.ModuleID).subscribe(res => {
					this.getShipToBillToDropDown(res)
				});
			}
			else if (this.addressType == AddressTypeEnum.RepairOrder) {
				this.ModuleID = AppModuleEnum.RepairOrder;
				this.commonService.getAllAddEditID(this.id, this.ModuleID).subscribe(res => {
					this.getShipToBillToDropDown(res)
				});
			}
			else if (this.addressType == AddressTypeEnum.ExchangeQUote) {
				this.ModuleID = AppModuleEnum.ExchangeQuote;
				this.commonService.getAllAddEditID(this.id, this.ModuleID).subscribe(res => {
					this.getShipToBillToDropDown(res)
				});
			}
			else if (this.addressType == AddressTypeEnum.ExchangeSalesOrder) {
				this.ModuleID = AppModuleEnum.ExchangeSalesOrder;
				this.commonService.getAllAddEditID(this.id, this.ModuleID).subscribe(res => {
					this.getShipToBillToDropDown(res)
				});
			}
		}

	}


	getShipToBillToDropDown(res) {
		const result = res;
		var shipUsertype = 2;
		var billUsertype = 2;
		if (result && result.length > 0) {
			result.forEach(x => {
				if (x.label == "SHIP_TYPE") {
					shipUsertype = x.value;
					this.sourcePoApproval.shipToUserTypeId = x.value;
				}
				else if (x.label == "BILL_TYPE") {
					billUsertype = x.value;
					this.sourcePoApproval.billToUserTypeId = x.value;
				}
				else if (x.label == "BILL_USERID") {
					this.userBillingIdList.push(x.value);
				}
				else if (x.label == "SHIP_USERID") {
					this.userShipingIdList.push(x.value);
				}
				else if (x.label == "MSCOMPANYID") {
					this.defaultMSCOMPANYID = x.value;
					this.userBillingIdList.push(x.value);
					this.userShipingIdList.push(x.value);
				}
				else if (x.label == "VENDORID") {
					this.defaultMSCOMPANYID = x.value;
					this.userBillingIdList.push(x.value);
					this.userShipingIdList.push(x.value);
				}
				else if (x.label == "CUST_ADDID") {
					shipUsertype = 1;
					billUsertype = 1;
					this.companyModuleId = 1;
					this.defaultMSCOMPANYID = x.value;
					this.userBillingIdList.push(x.value);
					this.userShipingIdList.push(x.value);
				}
			});

			this.isSpinnerVisible = true;
			if (this.userShipingIdList && this.userShipingIdList.length == 0) {
				this.userShipingIdList.push(0);
			}
			this.commonService.autoSuggestionSmartuserDropDownList(shipUsertype, '', true, 20, this.userShipingIdList.join()).subscribe(res => {
				this.userShipingList = res;
				if (this.userBillingIdList && this.userBillingIdList.length == 0) {
					this.userBillingIdList.push(0);
				}
				this.commonService.autoSuggestionSmartuserDropDownList(billUsertype, '', true, 20, this.userBillingIdList.join()).subscribe(res => {
					this.userBillingList = res;
					this.getAddressById(this.id);
					this.isSpinnerVisible = false;
				}, err => {
					this.isSpinnerVisible = false;

				});
			}, err => {
				this.isSpinnerVisible = false;

			});

		}
	}


	get userName(): string {
		return this.authService.currentUser ? this.authService.currentUser.userName : "";
	}

	get currentUserMasterCompanyId(): number {
		return this.authService.currentUser
			? this.authService.currentUser.masterCompanyId
			: null;
	}

	onAddShipMemo() {
		this.tempAddshipViaMemo = this.addShipViaFormForShipping.memo;
	}

	onSaveTextAreaInfo() {
		this.addShipViaFormForShipping.memo = this.tempAddshipViaMemo;
		this.ShipViabutton = true;
		$('#ship-via-memo').modal('hide');
	}

	filterBillingSite(event) {
		this.lstfilterBillingSite = this.billingSieListOriginal;

		if (event.query !== undefined && event.query !== null) {
			const billingSite = [...this.billingSieListOriginal.filter(x => {
				return x.siteName.toLowerCase().includes(event.query.toLowerCase())
			})]
			this.lstfilterBillingSite = billingSite;

		}

	}

	//   getAllBillingSiteSmartDropDown(strText = ''){
	// 	if(this.arrayBillingIdlist.length == 0) {			
	// 		this.arrayBillingIdlist.push(0); }
	// 	this.commonService.autoSuggestionSmartDropDownList('CustomerBillingAddress', 'CustomerBillingAddressId', 'SiteName',strText,true,20,this.arrayBillingIdlist.join()).subscribe(response => {
	// 		this.billingSieListOriginal = response.map(x => {
	// 			return {
	// 				siteName: x.label, siteId: x.value
	// 			}
	// 		})
	// 		this.billingSieList = [...this.billingSieListOriginal];
	// 		this.arrayBillingIdlist = [];
	// 	},err => {
	// 		const errorLog = err;
	// 		this.errorMessageHandler(errorLog);		
	// 	});
	//




	checkShippingSiteNameExist(value) {
		if (this.isEditModeShippingPoOnly == false && this.isEditModeShipping == false) {
			this.changeName = true;
			this.isShippingSiteNameAlreadyExists = false;
			this.ShipAddbutton = true;
			if (value != undefined && value != null) {
				if (this.shippingSieListOriginal && this.shippingSieListOriginal.length != 0) {
					for (let i = 0; i < this.shippingSieListOriginal.length; i++) {
						if ((this.addressFormForShipping.siteName == this.shippingSieListOriginal[i].siteName
							|| value.toLowerCase() == this.shippingSieListOriginal[i].siteName.toLowerCase())
							&& this.addressFormForShipping.siteName != '') {
							this.isShippingSiteNameAlreadyExists = true;
							this.ShipAddbutton = false;
							return;
						}
					}
				}
			}
		} else {
			this.changeName = true;
			this.isShippingSiteNameAlreadyExists = false;
			this.ShipAddbutton = true;
			if (value != undefined && value != null && value != this.editSiteName) {
				if (this.shippingSieListOriginal && this.shippingSieListOriginal.length != 0) {
					for (let i = 0; i < this.shippingSieListOriginal.length; i++) {
						if ((this.addressFormForShipping.siteName == this.shippingSieListOriginal[i].siteName
							|| value.toLowerCase() == this.shippingSieListOriginal[i].siteName.toLowerCase())
							&& this.addressFormForShipping.siteName != '') {
							this.isShippingSiteNameAlreadyExists = true;
							this.ShipAddbutton = false;
							return;
						}
					}
				}
			}
		}
	}



	checkShippingSiteNameSelect() {

		if (this.isEditModeShippingPoOnly == false && this.isEditModeShipping == false) {
			this.isShippingSiteNameAlreadyExists = true;
			this.ShipAddbutton = false;
		}
		else {
			if (this.editSiteName != editValueAssignByCondition('siteName', this.addressFormForShipping.siteName)) {
				this.isShippingSiteNameAlreadyExists = true;
				this.ShipAddbutton = false;
			} else {
				this.isShippingSiteNameAlreadyExists = false;
				this.ShipAddbutton = true;
			}

		}
	}

	filterShippingSite(event) {
		this.lstfilterShippingSite = this.shippingSieListOriginal;
		if (event.query !== undefined && event.query !== null) {
			const shippingSite = [...this.shippingSieListOriginal.filter(x => {
				return x.siteName.toLowerCase().includes(event.query.toLowerCase())
			})]
			this.lstfilterShippingSite = shippingSite;
		}
	}

	checkSiteNameExist(value) {
		if (this.isEditModeBillingPoOnly == false && this.isEditModeBilling == false) {
			this.changeName = true;
			this.isSiteNameAlreadyExists = false;
			this.billAddbutton = true;
			if (value != undefined && value != null) {
				if (this.billingSieListOriginal && this.billingSieListOriginal.length != 0) {
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
			}
		}
		else {
			this.changeName = true;
			this.isSiteNameAlreadyExists = false;
			this.billAddbutton = true;
			if (value != undefined && value != null && value != this.editSiteName) {
				if (this.billingSieListOriginal && this.billingSieListOriginal.length != 0) {
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
			}
		}
	}

	checkSiteNameSelect() {
		if (this.isEditModeBillingPoOnly == false && this.isEditModeBilling == false) {
			this.isSiteNameAlreadyExists = true;
			this.billAddbutton = false;
		}
		else {
			if (this.editSiteName != editValueAssignByCondition('siteName', this.addressFormForBilling.siteName)) {
				this.isSiteNameAlreadyExists = true;
				this.billAddbutton = false;
			} else {
				this.isSiteNameAlreadyExists = false;
				this.billAddbutton = true;
			}

		}
	}


	loadShippingViaList() {
		this.commonService.smartDropDownList('ShippingVia', 'ShippingViaId', 'Name').subscribe(res => {
			this.allShipViaInfo = res;
		}, err => {
			this.isSpinnerVisible = false;
			// const errorLog = err;
			// this.errorMessageHandler(errorLog);
		});
	}

	getCountriesList() {
		this.commonService.smartDropDownList('Countries', 'countries_id', 'nice_name').subscribe(res => {
			this.allCountriesList = res;
		}, err => {
			this.isSpinnerVisible = false;
			// const errorLog = err;
			// this.errorMessageHandler(errorLog);
		})
	}

	filterCountries(event) {
		this.countriesList = this.allCountriesList;
		if (event.query !== undefined && event.query !== null) {
			const countries = [...this.allCountriesList.filter(x => {
				return x.label.toLowerCase().includes(event.query.toLowerCase())
			})]
			this.countriesList = countries;
		}
	}
	loadModuleListForVendorComp() {
		///Commentig this as we are getting addressType Dynamic
		//const addressType = 'PO';
		this.commonService.getModuleListByUserType(this.addressType).subscribe(res => {
			this.userTypes = res;
			this.userTypes.map(x => {
				if (x.moduleName.toUpperCase() == 'COMPANY') {
					this.companyModuleId = x.moduleId;
				}
				else if (x.moduleName.toUpperCase() == 'VENDOR') {
					this.vendorModuleId = x.moduleId;
				}
				else if (x.moduleName.toUpperCase() == 'CUSTOMER') {
					this.customerModuleId = x.moduleId;
				}
			});
		}
			, err => {
				this.isSpinnerVisible = false;
				//const errorLog = err;
				//this.errorMessageHandler(errorLog);
			});
	}

	// errorMessageHandler(log) {
	// 	const errorLog = log;
	// 	var msg = '';
	// 	if (errorLog.message) {
	// 		if (errorLog.error && errorLog.error.errors && errorLog.error.errors.length > 0) {
	// 			for (let i = 0; i < errorLog.error.errors.length; i++) {
	// 				msg = msg + errorLog.error.errors[i].message + '<br/>'
	// 			}
	// 		}
	// 		this.alertService.showMessage(
	// 			errorLog.error.message,
	// 			msg,
	// 			MessageSeverity.error
	// 		);
	// 	}
	// 	else {
	// 		this.alertService.showMessage(
	// 			'Error',
	// 			log.error,
	// 			MessageSeverity.error
	// 		);
	// 	}
	// }

	onModuleTypeChange() {
		if (this.sourcePoApproval.shipToUserTypeId == 9) {
			this.shippingModuleName = 'Company';
		} else if (this.sourcePoApproval.shipToUserTypeId == 2) {
			this.shippingModuleName = 'Vendor';
		}
		else if (this.sourcePoApproval.shipToUserTypeId == 1) {
			this.shippingModuleName = 'Customer';
		}
	}
	onModuleBillTypeChange() {
		if (this.sourcePoApproval.billToUserTypeId == 9) {
			this.billingingModuleName = 'Company';
		} else if (this.sourcePoApproval.billToUserTypeId == 2) {
			this.billingingModuleName = 'Vendor';
		}
		else if (this.sourcePoApproval.billToUserTypeId == 1) {
			this.billingingModuleName = 'Customer';
		}
	}

	clearInputShipTo() {
		this.sourcePoApproval.shipToUserId = 0;
		this.sourcePoApproval.shipToAddressId = 0;
		this.sourcePoApproval.shipToContactId = 0;
		this.sourcePoApproval.shipToMemo = '';
		this.sourcePoApproval.shipViaId = 0;
		this.sourcePoApproval.shippingViaId = 0;
		this.sourcePoApproval.shippingAccountNo = '';
		this.shipToAddress = {};
		this.shipViaList = [];
		this.shipToSite = [];
		this.vendorSelected = [];
		this.companySiteList_Shipping = [];
		//this.ShippingModuleName
	}

	clearInputBillTo() {
		this.sourcePoApproval.billToUserId = 0;
		this.sourcePoApproval.billToAddressId = 0;
		this.sourcePoApproval.billToContactId = 0;
		this.billToAddress = {};
		this.sourcePoApproval.billToMemo = '';
		this.billToSite = [];
		this.vendorSelectedForBillTo = [];
		this.companySiteList_Billing = [];
	}

	clearInputOnClickUserIdShipTo() {
		this.sourcePoApproval.shipToSiteId = 0;
		this.sourcePoApproval.shipToAddressId = 0;
		this.sourcePoApproval.shipToContactId = 0;
		this.shipToAddress = {};
		this.shipViaList = [];
		this.shipToSite = [];
		this.vendorSelected = [];
	}

	clearInputOnClickUserIdBillTo() {
		this.sourcePoApproval.billToSiteId = 0;
		this.sourcePoApproval.billToAddressId = 0;
		this.sourcePoApproval.billToContactId = 0;
		this.billToSite = [];
		this.vendorSelected = [];
	}

	shipViaChange() {
		this.ShipViabutton = true;
	}

	shipAddChange() {
		this.ShipAddbutton = true;
	}

	billAddChange() {
		this.billAddbutton = true;
	}



	onEditShipVia(value, id) {
		if (value == 'Add') {
			this.ShipViaHeader = "Add Ship Via";
			this.resetAddressShipViaForm();
			this.ShipViabutton = true;
		}
		else {
			this.ShipViaHeader = "Edit Ship Via";
			if (this.shipViaList && this.shipViaList.length != 0) {
				for (var i = 0; i < this.shipViaList.length; i++) {
					if (this.shipViaList[i].shippingViaId == id) {
						this.addShipViaFormForShipping.ShippingViaId = this.shipViaList[i].shippingViaId;
						this.addShipViaFormForShipping.shipViaId = this.shipViaList[i].shipViaId;
						this.addShipViaFormForShipping.shipVia = this.shipViaList[i].name;
						this.addShipViaFormForShipping.shippingAccountInfo = this.shipViaList[i].shippingAccountInfo;
						this.addShipViaFormForShipping.shippingId = '';
						this.addShipViaFormForShipping.shippingURL = '';
						this.addShipViaFormForShipping.memo = this.shipViaList[i].memo;
						this.addShipViaFormForShipping.isPrimary = this.shipViaList[i].isPrimary;
					}
				}
			}

			this.ShipViabutton = false;
			this.isEditModeShipVia = true;
		}

	}

	async saveShipViaForShipTo() {
		this.sourcePoApproval.shipViaId = 0;
		this.sourcePoApproval.shippingAccountNo = '';
		const data = {
			...this.addShipViaFormForShipping,
			name: getValueFromArrayOfObjectById('label', 'value', this.addShipViaFormForShipping.shipViaId, this.allShipViaInfo),
			createdBy: this.userName,
			updatedBy: this.userName,
			masterCompanyId: this.currentUserMasterCompanyId,
			isActive: true,
			UserType: parseInt(this.sourcePoApproval.shipToUserTypeId)
		}
		const customerData = {
			...data,
			ReferenceId: this.sourcePoApproval.shipToUserId.userID,
			AddressId: this.sourcePoApproval.shipToSiteId ? this.sourcePoApproval.shipToSiteId : 0
		}
		if (!this.isEditModeShipVia) {
			await this.commonService.createShipVia(customerData).subscribe(response => {
				this.onShipToSelected(this.sourcePoApproval.shipToUserId, 0, 0, 0, 0, response.shipViaId);
				this.enableAddSaveBtn = true;
				this.alertService.showMessage(
					'Success',
					`Saved Ship Via Information Sucessfully `,
					MessageSeverity.success
				);
			}, err => {
				this.isSpinnerVisible = false;
				//const errorLog = err;
				//this.errorMessageHandler(errorLog);
			});
		} else {
			await this.commonService.createShipVia(customerData).subscribe(response => {
				this.onShipToSelected(this.sourcePoApproval.shipToUserId, 0, 0, 0, 0, response.shipViaId);
				this.enableAddSaveBtn = true;
				this.alertService.showMessage(
					'Success',
					`Updated Ship Via Information Sucessfully`,
					MessageSeverity.success
				);
			}, err => {
				this.isSpinnerVisible = false;
				//const errorLog = err;
				//this.errorMessageHandler(errorLog);
			})
		}


		$('#shipToShipVia').modal('hide');
	}
	parsedText(text) {
		if (text) {
			const dom = new DOMParser().parseFromString(
				'<!doctype html><body>' + text,
				'text/html');
			const decodedString = dom.body.textContent;
			return decodedString;
		}
	}
	getShipViaDetailsForShipTo(id?) {
		this.commonService.getShipViaDetailsByModule(this.sourcePoApproval.shipToUserTypeId, this.shipToSelectedvalue, this.authService.currentUser.masterCompanyId).subscribe(response => {
			this.shipViaList = response;
			if (this.shipViaList && this.shipViaList.length != 0) {
				for (var i = 0; i < this.shipViaList.length; i++) {
					if (this.shipViaList[i].isPrimary) {
						this.sourcePoApproval.shipViaId = this.shipViaList[i].shipViaId;
						this.getShipViaDetailsold(this.sourcePoApproval.shipViaId);
					}
				}
			}
			if (id) {
				this.sourcePoApproval.shipViaId = id;
				this.getShipViaDetailsold(id);
			}
		},
			err => {
				this.isSpinnerVisible = false;
				///const errorLog = err;
				//this.errorMessageHandler(errorLog);
			})
	}

	getShipViaDetailsold(id) {

		this.sourcePoApproval.shippingAccountNo = '';
		var userType = this.sourcePoApproval.shipToUserTypeId ? parseInt(this.sourcePoApproval.shipToUserTypeId) : 0;
		const shippingViaId = id ? getValueFromArrayOfObjectById('shippingViaId', 'shipViaId', id, this.shipViaList) : 0;
		if (shippingViaId != 0 && shippingViaId != null) {

			this.commonService.getShipViaDetailsById(shippingViaId, userType).subscribe(res => {
				const responseData = res;
				this.sourcePoApproval.shippingAccountNo = responseData.shippingAccountInfo;
				this.sourcePoApproval.shipVia = responseData.shipVia;

			}, err => {
				this.isSpinnerVisible = false;
				//const errorLog = err;
				//this.errorMessageHandler(errorLog);
			})
		}
	}

	checkValidOnChange(condition, value) {
		if (condition != null && condition != 0 && value == "companyId") {
			this.managementValidCheck = false;
		}
		if (condition != null && condition != 0 && value == "shipToUserTypeId") {
			this.shipToUserTypeValidCheck = false;
		}
		if (condition != null && condition != 0 && value == "shipToSiteId") {
			this.shipToSiteNameValidCheck = false;
		}
		if (condition != null && condition != 0 && value == "shipViaId") {
			this.shipViaValidCheck = false;
		}
		if (condition != null && condition != 0 && value == "billToUserTypeId") {
			this.billToUserTypeValidCheck = false;
		}
		if (condition != null && condition != 0 && value == "billToSiteId") {
			this.billToSiteNameValidCheck = false;
		}
	}
	clearShipToContact() { }

	onShipToSelectedEdit(res?, ModuleId?, UserId?) {
		const moduleId = ModuleId > 0 ? ModuleId : this.sourcePoApproval.shipToUserTypeId;
		const userId = UserId > 0 ? UserId : res.userID;
		const AddressType = 'Ship';
		if (userId > 0) {
			this.commonService.getaddressdetailsbyuser(moduleId, userId, AddressType, this.id).subscribe(
				returnddataforbill => {
					this.shipViaList = returnddataforbill.shipVia;
					this.shipToAddressList = returnddataforbill.address;
					this.shipToAddress = returnddataforbill.address[0];
					this.shipToContactDataList = returnddataforbill.contacts;
					if (moduleId == 9) {
						this.shippingModuleName = 'Company'
					} else if (moduleId == 2) {
						this.shippingModuleName = 'Vendor'
					}
					else if (moduleId == 1) {
						this.shippingModuleName = 'Customer'
					}
					this.shipToSite = returnddataforbill.site;

					if (this.shipToSite && this.shipToSite.length != 0) {
						this.shippingSieListOriginal = this.shipToSite.map(x => {
							return {
								siteName: x.siteName, siteId: x.siteId
							}
						});
					}
					if (this.sourcePoApproval.shipToSiteId) {
						this.onShipToGetAddress(this.sourcePoApproval.shipToSiteId);
					}

					if (this.sourcePoApproval.shippingViaId) {
						this.getShipViaDetails(this.sourcePoApproval.shippingViaId);
					}

				}, err => {
					this.isSpinnerVisible = false;
					//const errorLog = err;
					//this.errorMessageHandler(errorLog);
				});
		}
	}

	onBillToSelectedEdit(res?, ModuleId?, UserId?) {
		const moduleId = ModuleId > 0 ? ModuleId : this.sourcePoApproval.billToUserTypeId;
		const userId = UserId > 0 ? UserId : res.userID;
		const AddressType = 'Bill';
		if (userId > 0) {
			this.commonService.getaddressdetailsbyuser(moduleId, userId, AddressType, this.id).subscribe(
				returnddataforbill => {
					this.billToAddressList = returnddataforbill.address;
					this.billToAddress = returnddataforbill.address[0];
					this.billToContactDataList = returnddataforbill.contacts;
					if (moduleId == 9) {
						this.billingingModuleName = 'Company'
					} else if (moduleId == 2) {
						this.billingingModuleName = 'Vendor'
					}
					else if (moduleId == 1) {
						this.billingingModuleName = 'Customer'
					}



					this.billToSite = returnddataforbill.site;
					if (this.sourcePoApproval.billToSiteId) {
						this.onBillToGetAddress(this.sourcePoApproval.billToSiteId);
					}
					if (this.billToSite && this.billToSite.length != 0) {
						this.billingSieListOriginal = this.billToSite.map(x => {
							return {
								siteName: x.siteName, siteId: x.siteId
							}
						})
					}
				}, err => {
					this.isSpinnerVisible = false;
					//const errorLog = err;
					//this.errorMessageHandler(errorLog);
				});
		}
	}



	onShipToSelected(res?, ModuleId?, UserId?, siteId?, poonly?, Shippingid?) {
		this.clearInputOnClickUserIdShipTo();
		const moduleId = ModuleId > 0 ? ModuleId : this.sourcePoApproval.shipToUserTypeId;
		const userId = UserId > 0 ? UserId : res.userID;
		const AddressType = 'Ship';
		if (userId > 0) {
			this.commonService.getaddressdetailsbyuser(moduleId, userId, AddressType, this.id).subscribe(
				returnddataforbill => {
					this.shipViaList = returnddataforbill.shipVia;
					this.shipToAddressList = returnddataforbill.address;
					// this.shipToAddress = returnddataforbill.address[0];
					//   this.firstNamesShipTo = returnddataforbill.contacts[0];
					this.shipToContactDataList = returnddataforbill.contacts;
					if (moduleId == 9) {
						this.shippingModuleName = 'Company'
					} else if (moduleId == 2) {
						this.shippingModuleName = 'Vendor'
					}
					else if (moduleId == 1) {
						this.shippingModuleName = 'Customer'
					}

					this.shipToSite = returnddataforbill.site;

					if (siteId > 0) {
						if (this.shipToSite && this.shipToSite.length != 0) {
							for (var i = 0; i < this.shipToSite.length; i++) {
								if (this.shipToSite[i].siteId == siteId) {
									this.sourcePoApproval.shipToSiteId = this.shipToSite[i].siteId;
									this.sourcePoApproval.shipToAddressId = this.shipToSite[i].addressId;
									this.onShipToGetAddress(this.shipToSite[i].siteId)
								}
							}
						}
					}
					else {
						if (this.shipToSite && this.shipToSite.length != 0) {
							for (var i = 0; i < this.shipToSite.length; i++) {
								if (this.shipToSite[i].isPrimary) {
									this.sourcePoApproval.shipToSiteId = this.shipToSite[i].siteId;
									this.sourcePoApproval.shipToAddressId = this.shipToSite[i].addressId;
									this.onShipToGetAddress(this.shipToSite[i].siteId)
								}
							}
						}
					}
					if (this.shipToContactDataList && this.shipToContactDataList.length > 0) {
						this.sourcePoApproval.shipToContactId = this.shipToContactDataList[0].contactId;
						this.shipToContactDataList.forEach(
							x => {
								if (x.isPrimary) {
									this.sourcePoApproval.shipToContactId = x.contactId;
								}
							}
						)
					}

					if (this.shipViaList && this.shipViaList.length > 0) {
						this.sourcePoApproval.shippingViaId = this.shipViaList[0].shippingViaId;
						this.shipViaList.forEach(
							x => {
								if (x.isPrimary) {
									this.sourcePoApproval.shippingViaId = x.shippingViaId;
								}
							}
						)
						this.getShipViaDetails(this.sourcePoApproval.shippingViaId);
					}

					if (Shippingid > 0) {
						if (this.shipViaList && this.shipViaList.length != 0) {
							for (let i = 0; i < this.shipViaList.length; i++) {
								if (this.shipViaList[i].shipViaId == Shippingid) {
									this.sourcePoApproval.shippingViaId = this.shipViaList[i].shippingViaId;
									this.sourcePoApproval.shipViaId = this.shipViaList[i].shipViaId;
									this.sourcePoApproval.shipVia = this.shipViaList[i].name;
									this.sourcePoApproval.shippingAccountNo = this.shipViaList[i].shippingAccountInfo;
								}
							}
						}
					}

					if (this.shipToSite && this.shipToSite.length != 0) {
						this.shippingSieListOriginal = this.shipToSite.map(x => {
							return {
								siteName: x.siteName, siteId: x.siteId
							}
						});

					}


					this.enableAddSaveBtn = true;

				}, err => {
					this.isSpinnerVisible = false;
					//const errorLog = err;
					//this.errorMessageHandler(errorLog);
				});
		}
	}
	saveShipToShipViaDetailsToPO() {

	}

	closeMemoModel() {
		$('#ship-via-memo').modal('hide');
	}

	onBillToSelected(res?, ModuleId?, UserId?, siteId?, poonly?) {
		this.clearInputOnClickUserIdBillTo();
		const moduleId = ModuleId > 0 ? ModuleId : this.sourcePoApproval.billToUserTypeId;
		const userId = UserId > 0 ? UserId : res.userID;
		const AddressType = 'Bill';
		if (userId > 0) {
			this.commonService.getaddressdetailsbyuser(moduleId, userId, AddressType, this.id).subscribe(
				returnddataforbill => {
					this.billToAddressList = returnddataforbill.address;
					// this.billToAddress = returnddataforbill.address[0];		
					this.billToContactDataList = returnddataforbill.contacts;
					if (moduleId == 9) {
						this.billingingModuleName = 'Company'
					} else if (moduleId == 2) {
						this.billingingModuleName = 'Vendor'
					}
					else if (moduleId == 1) {
						this.billingingModuleName = 'Customer'
					}

					this.billToSite = returnddataforbill.site;

					if (siteId > 0) {
						if (this.billToSite && this.billToSite.length != 0) {
							for (var i = 0; i < this.billToSite.length; i++) {
								if (this.billToSite[i].siteId == siteId) {
									this.sourcePoApproval.billToSiteId = this.billToSite[i].siteId;
									this.sourcePoApproval.billToAddressId = this.billToSite[i].addressId;
									this.onBillToGetAddress(this.billToSite[i].siteId)
								}
							}
						}
					} else {
						if (this.billToSite && this.billToSite.length != 0) {
							for (var i = 0; i < this.billToSite.length; i++) {
								if (this.billToSite[i].isPrimary) {
									this.sourcePoApproval.billToSiteId = this.billToSite[i].siteId;
									this.sourcePoApproval.billToAddressId = this.billToSite[i].addressId;
									this.onBillToGetAddress(this.billToSite[i].siteId)
								}
							}
						}
					}



					if (this.billToContactDataList && this.billToContactDataList.length > 0) {
						this.sourcePoApproval.billToContactId = this.billToContactDataList[0].contactId;
						this.billToContactDataList.forEach(
							x => {
								if (x.isPrimary) {
									this.sourcePoApproval.billToContactId = x.contactId;
								}
							}
						)
					}

					this.billingSieListOriginal = this.billToSite.map(x => {
						return {
							siteName: x.siteName, siteId: x.siteId
						}
					})

					this.enableAddSaveBtn = true;

				}, err => {
					this.isSpinnerVisible = false;
					//const errorLog = err;
					//this.errorMessageHandler(errorLog);
				});
		}
	}
	onShipToGetAddress(id) {
		if (this.shipToAddressList && this.shipToAddressList.length != 0) {
			for (let i = 0; i < this.shipToAddressList.length; i++) {
				if (this.shipToAddressList[i].siteID == id) {
					this.shipToAddress = this.shipToAddressList[i];
					this.sourcePoApproval.shipAddIsPoOnly = this.shipToAddressList[i].isPoOnly;
					this.sourcePoApproval.shipToSiteName = this.shipToAddressList[i].siteName;
					this.sourcePoApproval.shipToAddressId = this.shipToAddressList[i].addressId;
					this.sourcePoApproval.shipToAddress1 = this.shipToAddressList[i].address1;
					this.sourcePoApproval.shipToAddress2 = this.shipToAddressList[i].address2;
					this.sourcePoApproval.shipToCity = this.shipToAddressList[i].city;
					this.sourcePoApproval.shipToStateOrProvince = this.shipToAddressList[i].stateOrProvince;
					this.sourcePoApproval.shipToPostalCode = this.shipToAddressList[i].postalCode;
					this.sourcePoApproval.shipToCountryId = getObjectByValue('value', this.shipToAddressList[i].countryId, this.allCountriesList);
					this.sourcePoApproval.shipToCountry = this.shipToAddressList[i].country;
					return
				}
				else {
					this.shipToAddress = {};
					this.sourcePoApproval.shipAddIsPoOnly = false;
					this.sourcePoApproval.shipToSiteName = '';
					this.sourcePoApproval.shipToAddressId = 0;
					this.sourcePoApproval.shipToAddress1 = '';
					this.sourcePoApproval.shipToAddress2 = '';
					this.sourcePoApproval.shipToCity = '';
					this.sourcePoApproval.shipToStateOrProvince = '';
					this.sourcePoApproval.shipToPostalCode = '';
					this.sourcePoApproval.shipToCountryId = 0;
					this.sourcePoApproval.shipToCountry = '';
				}

			}
		}
	}

	onBillToGetAddress(id) {
		if (this.billToAddressList && this.billToAddressList.length != 0) {
			for (let i = 0; i < this.billToAddressList.length; i++) {
				if (this.billToAddressList[i].siteID == id) {
					this.billToAddress = this.billToAddressList[i];
					this.sourcePoApproval.billAddIsPoOnly = this.billToAddressList[i].isPoOnly;
					this.sourcePoApproval.billToSiteName = this.billToAddressList[i].siteName;
					this.sourcePoApproval.billToAddressId = this.billToAddressList[i].addressId;
					this.sourcePoApproval.billToAddress1 = this.billToAddressList[i].address1;
					this.sourcePoApproval.billToAddress2 = this.billToAddressList[i].address2;
					this.sourcePoApproval.billToCity = this.billToAddressList[i].city;
					this.sourcePoApproval.billToStateOrProvince = this.billToAddressList[i].stateOrProvince;
					this.sourcePoApproval.billToPostalCode = this.billToAddressList[i].postalCode;
					this.sourcePoApproval.billToCountryId = getObjectByValue('value', this.billToAddressList[i].countryId, this.allCountriesList);
					this.sourcePoApproval.billToCountry = this.billToAddressList[i].country;
					return;
				} else {
					this.billToAddress = {};
					this.sourcePoApproval.billAddIsPoOnly = false;
					this.sourcePoApproval.billToSiteName = '';
					this.sourcePoApproval.billToAddressId = 0;
					this.sourcePoApproval.billToAddress1 = '';
					this.sourcePoApproval.billToAddress2 = '';
					this.sourcePoApproval.billToCity = '';
					this.sourcePoApproval.billToStateOrProvince = '';
					this.sourcePoApproval.billToPostalCode = '';
					this.sourcePoApproval.billToCountryId = 0;
					this.sourcePoApproval.billToCountry = '';
				}

			}
		}
	}


	filterContactsForShipTo(event) {
		this.firstNamesShipTo = this.shipToContactDataList;
		if (event.query !== undefined && event.query !== null) {
			const customerContacts = [...this.shipToContactDataList.filter(x => {
				return x.name.toLowerCase().includes(event.query.toLowerCase())
			})]
			this.firstNamesShipTo = customerContacts;
		}
	}

	filterUsersForShiping(event, moduleId) {
		if (event.query !== undefined && event.query !== null) {
			this.getUserShipingList(event.query, moduleId);
		}
	}

	getUserShipingList(strText = '', moduleId) {
		if (this.userShipingIdList && this.userShipingIdList.length == 0) {
			this.userShipingIdList.push(0);
		}
		this.commonService.autoSuggestionSmartuserDropDownList(moduleId, strText, true, 20, this.userShipingIdList.join()).subscribe(res => {
			this.userShipingList = res;
		}, err => {
			this.isSpinnerVisible = false;
			//const errorLog = err;
			//this.errorMessageHandler(errorLog);
		});
	}



	filterUsersForBilling(event, moduleId) {
		if (event.query !== undefined && event.query !== null) {
			this.getUserBillingList(event.query, moduleId);
		}
	}

	getUserBillingList(strText = '', moduleId) {
		if (this.userBillingIdList && this.userBillingIdList.length == 0) {
			this.userBillingIdList.push(0);
		}
		this.commonService.autoSuggestionSmartuserDropDownList(moduleId, strText, true, 20, this.userBillingIdList.join()).subscribe(res => {
			this.userBillingList = res;
		}, err => {
			this.isSpinnerVisible = false;
			//const errorLog = err;
			//this.errorMessageHandler(errorLog);
		});
	}

	// filterContactsForBillTo(event){
	// 	this.firstNamesBillTo = this.billToContactDataList;
	// 	if (event.query !== undefined && event.query !== null) {
	// 		const customerContacts = [...this.billToContactDataList.filter(x => {
	// 			return x.name.toLowerCase().includes(event.query.toLowerCase())
	// 		})]
	// 		this.firstNamesBillTo = customerContacts;
	// 	}
	// }

	clearBillToContact() { }


	getAddressById(poId) {
		this.isSpinnerVisible = true;
		this.commonService.getAddressById(poId, this.addressType, this.ModuleID).subscribe(res => {
			this.sourcePoApproval = {
				shipToPOAddressId: res[0].ShipToPOAddressId,
				shipToUserTypeId: res[0].ShipToUserType,
				//shipToUserId: res[0].ShipToUserId,	
				//ShiipToUserId: //this.getShipToUserIdEdit(res[0]),
				shipToSiteId: res[0].ShipToSiteId,
				shipToSiteName: res[0].ShipToSiteName,

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
				shipToCountryId: res[0].ShipToCountryId ? getObjectByValue('value', res[0].ShipToCountryId, this.allCountriesList) : 0,
				shipToCountry: res[0].ShipToCountryName,
				poShipViaId: res[0].POShipViaId,
				billToPOAddressId: res[0].BillToPOAddressId,
				billToUserTypeId: res[0].BillToUserType,
				//billToUserId: res[0].BillToUserId,
				//billToUserId: this.getBillToUserIdEdit(res),
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
				billToCountryId: res[0].BillToCountryId ? getObjectByValue('value', res[0].BillToCountryId, this.allCountriesList) : 0,
				billToCountry: res[0].BillToCountryName,
				shippingViaId: res[0].ShippingViaId,
				shipViaId: res[0].ShipViaId,
				shipVia: res[0].ShipVia,
				shippingCost: formatNumberAsGlobalSettingsModule(res[0].ShippingCost, 2),
				handlingCost: formatNumberAsGlobalSettingsModule(res[0].HandlingCost, 2),
				shippingAccountNo: res[0].ShippingAccountNo
			};

			this.shipToAddress = {
				address1: this.sourcePoApproval.shipToAddress1,
				address2: this.sourcePoApproval.shipToAddress2,
				city: this.sourcePoApproval.shipToCity,
				stateOrProvince: this.sourcePoApproval.shipToStateOrProvince,
				country: this.sourcePoApproval.ShipToCountry,
				countryId: getValueFromObjectByKey('value', this.sourcePoApproval.ShipToCountryId),
				postalCode: this.sourcePoApproval.shipToPostalCode,
			}

			this.billToAddress = {
				address1: this.sourcePoApproval.billToAddress1,
				address2: this.sourcePoApproval.billToAddress2,
				city: this.sourcePoApproval.billToCity,
				stateOrProvince: this.sourcePoApproval.billToStateOrProvince,
				country: this.sourcePoApproval.billToCountry,
				countryId: getValueFromObjectByKey('value', this.sourcePoApproval.billToCountryId),
				postalCode: this.sourcePoApproval.billToPostalCode,
			}

			if (this.sourcePoApproval && this.sourcePoApproval.shipToUsertypeId) {
				this.sourcePoApproval.shipToUsertypeId = this.sourcePoApproval.shipToUsertypeId;
			}
			if (this.sourcePoApproval && this.sourcePoApproval.billToUsertypeId) {
				this.sourcePoApproval.billToUsertypeId = this.sourcePoApproval.billToUsertypeId;
			}

			if (res[0].ShipToUserId && res[0].ShipToUserId > 0 && res[0].ShipToUserType && res[0].ShipToUserType > 0) {
				this.sourcePoApproval.shipToUserId = getObjectById('userID', res[0].ShipToUserId, this.userShipingList);
				// if(this.sourcePoApproval.shipToUserId 
				// 	&& this.sourcePoApproval.shipToUserId.userID 
				// 	&& this.sourcePoApproval.shipToUserId.userID > 0 ) {
				this.onShipToSelectedEdit(null, res[0].ShipToUserType, res[0].ShipToUserId);
				// }
			}

			if (res[0].BillToUserId && res[0].BillToUserId > 0 && res[0].BillToUserType && res[0].BillToUserType > 0) {
				this.sourcePoApproval.billToUserId = getObjectById('userID', res[0].BillToUserId, this.userBillingList);
				// if(this.sourcePoApproval.billToUserId 
				// 	&& this.sourcePoApproval.billToUserId.userID 
				// 	&& this.sourcePoApproval.billToUserId.userID > 0 ) {
				//this.onBillToSelectedEdit(this.sourcePoApproval.billToUserId);
				this.onBillToSelectedEdit(null, res[0].BillToUserType, res[0].BillToUserId);
				// }
			}


			if (this.sourcePoApproval && res[0].ShipToPOAddressId > 0) {
				this.isEditModeAdd = true;
				this.isSpinnerVisible = false;
			} else {
				this.isEditModeAdd = false;
				if (this.ModuleID == AppModuleEnum.SalesOrder || this.ModuleID == AppModuleEnum.SalesQuate || this.ModuleID == AppModuleEnum.ExchangeQuote) {
					this.sourcePoApproval.shipToUserTypeId = 1;
					this.sourcePoApproval.billToUserTypeId = 1;
				}
				else {
					this.sourcePoApproval.shipToUserTypeId = this.vendorModuleId;
					this.sourcePoApproval.billToUserTypeId = this.vendorModuleId;
				}
				if (this.defaultMSCOMPANYID > 0) {
					this.sourcePoApproval.shipToUserId = getObjectById('userID', this.defaultMSCOMPANYID, this.userShipingList),
						this.sourcePoApproval.billToUserId = getObjectById('userID', this.defaultMSCOMPANYID, this.userBillingList);
					if (this.sourcePoApproval.billToUserId
						&& this.sourcePoApproval.billToUserId.userID
						&& this.sourcePoApproval.billToUserId.userID > 0) {
						this.onBillToSelected(this.sourcePoApproval.billToUserId);
					}
					if (this.sourcePoApproval.shipToUserId
						&& this.sourcePoApproval.shipToUserId.userID
						&& this.sourcePoApproval.shipToUserId.userID > 0) {
						this.onShipToSelected(this.sourcePoApproval.shipToUserId);
					}
				}

			}
			this.isSpinnerVisible = false;

		}, err => {
			this.isSpinnerVisible = false;
			//const errorLog = err;
			//this.errorMessageHandler(errorLog);
		})

	}

	resetAddressShippingForm() {
		this.addressFormForShipping = new CustomerShippingModel();
		this.isEditModeShipping = false;
		this.isEditModeShippingPoOnly = false;
	}

	resetAddressBillingForm() {
		this.addressFormForBilling = new CustomerShippingModel();
		this.isEditModeBilling = false;
		this.isEditModeBillingPoOnly = false;
	}




	getShipToUserIdEdit(data) {
		this.getUserShipingList(data, data.moduleId);
	}

	enableAddSave() {
		this.enableAddSaveBtn = true;
	}

	onClickBillSiteName(value, data?) {
		this.resetAddressBillingForm();
		if (value === 'Add') {
			this.addressSiteNameHeader = 'Add Ship To ' + this.billingingModuleName + ' Details';
			this.billAddbutton = true;
			this.editSiteName = '';
			this.isEditModeBillingPoOnly = false;
			this.isEditModeBilling = false;
		}
		if (value === 'Edit') {

			this.addressSiteNameHeader = 'Edit Ship To ' + this.billingingModuleName + ' Details';
			this.billAddbutton = false;
			if (this.sourcePoApproval.billAddIsPoOnly)
				this.isEditModeBillingPoOnly = true;
			else
				this.isEditModeBilling = true;
			if (this.billToAddressList && this.billToAddressList.length != 0) {
				for (let i = 0; i < this.billToAddressList.length; i++) {
					if (this.billToAddressList[i].siteID == this.sourcePoApproval.billToSiteId) {
						this.addressFormForBilling.isPrimary = this.billToAddressList[i].isPrimary;
						this.addressFormForBilling.siteId = this.billToAddressList[i].siteID;
						this.editSiteName = this.billToAddressList[i].siteName;
						this.addressFormForBilling.siteName = getObjectByValue('siteName', this.billToAddressList[i].siteName, this.billingSieListOriginal);
						this.addressFormForBilling.addressID = this.billToAddressList[i].addressId;
						this.addressFormForBilling.address1 = this.billToAddressList[i].address1;
						this.addressFormForBilling.address2 = this.billToAddressList[i].address2;
						this.addressFormForBilling.city = this.billToAddressList[i].city;
						this.addressFormForBilling.stateOrProvince = this.billToAddressList[i].stateOrProvince;
						this.addressFormForBilling.postalCode = this.billToAddressList[i].postalCode;
						this.addressFormForBilling.countryId = getObjectByValue('value', this.billToAddressList[i].countryId, this.allCountriesList);
						return;
					}
				}
			}
		}
	}
	onClickShipSiteName(value, data?) {
		this.resetAddressShippingForm();
		if (value === 'Add') {
			this.addressSiteNameHeader = 'Add Ship To ' + this.shippingModuleName + ' Details';
			this.ShipAddbutton = true;
			this.editSiteName = '';
			this.isEditModeShippingPoOnly = false;
			this.isEditModeShipping = false;
		}
		if (value === 'Edit') {
			this.ShipAddbutton = false;
			this.addressSiteNameHeader = 'Edit Ship To ' + this.shippingModuleName + ' Details';
			if (this.sourcePoApproval.shipAddIsPoOnly)
				this.isEditModeShippingPoOnly = true;
			else
				this.isEditModeShipping = true;
			if (this.shipToAddressList && this.shipToAddressList.length != 0) {
				for (let i = 0; i < this.shipToAddressList.length; i++) {
					if (this.shipToAddressList[i].siteID == this.sourcePoApproval.shipToSiteId) {
						this.addressFormForShipping.isPrimary = this.shipToAddressList[i].isPrimary;
						this.addressFormForShipping.siteId = this.shipToAddressList[i].siteID;
						this.editSiteName = this.shipToAddressList[i].siteName;
						this.addressFormForShipping.siteName = getObjectByValue('siteName', this.shipToAddressList[i].siteName, this.shippingSieListOriginal);
						this.addressFormForShipping.addressID = this.shipToAddressList[i].addressId;
						this.addressFormForShipping.address1 = this.shipToAddressList[i].address1;
						this.addressFormForShipping.address2 = this.shipToAddressList[i].address2;
						this.addressFormForShipping.city = this.shipToAddressList[i].city;
						this.addressFormForShipping.stateOrProvince = this.shipToAddressList[i].stateOrProvince;
						this.addressFormForShipping.postalCode = this.shipToAddressList[i].postalCode;
						this.addressFormForShipping.countryId = getObjectByValue('value', this.shipToAddressList[i].countryId, this.allCountriesList);
						return;
					}
				}

			}
		}
	}


	saveShippingAddressToPO() {
		const data = {
			...this.addressFormForShipping,
			createdBy: this.userName,
			updatedBy: this.userName,
			masterCompanyId: this.currentUserMasterCompanyId,
			isActive: true,
		}
		const addressData = {
			...data,
			purchaseOrderID: this.id,
			isPoOnly: true,
			siteName: editValueAssignByCondition('siteName', data.siteName),
			userTypeId: this.sourcePoApproval.shipToUserTypeId,
			userId: this.sourcePoApproval.shipToUserId.userID,
			countryId: getValueFromObjectByKey('value', data.countryId)
		}

		if (!this.isEditModeShippingPoOnly) {
			this.commonService.createAllAddres(addressData).subscribe(response => {
				if (response) {
					this.onShipToSelected(this.sourcePoApproval.shipToUserId, 0, 0, response, true);
					this.alertService.showMessage(
						'Success',
						`Saved Shipping Information Successfully`,
						MessageSeverity.success
					);
				}
				else {
					this.alertService.showMessage(
						'Error',
						`Eroor While Saving Shipping Address`,
						MessageSeverity.error
					);
				}
			}, err => {
				this.isSpinnerVisible = false;
				//const errorLog = err;
				//this.errorMessageHandler(errorLog);
			});
		} else {
			this.commonService.createAllAddres(addressData).subscribe(response => {
				if (response) {
					this.onShipToSelected(this.sourcePoApproval.shipToUserId, 0, 0, response);
					this.alertService.showMessage(
						'Success',
						`Shipping Information Updated Successfully`,
						MessageSeverity.success
					);
				} else {
					this.alertService.showMessage(
						'Error',
						`Eroor While Saving Shipping Address`,
						MessageSeverity.error
					);
				}
			}, err => {
				this.isSpinnerVisible = false;
				//const errorLog = err;
				//this.errorMessageHandler(errorLog);
			});
		}
	}



	saveShippingAddress() {

		const data = {
			...this.addressFormForShipping,
			createdBy: this.userName,
			updatedBy: this.userName,
			masterCompanyId: this.currentUserMasterCompanyId,
			isActive: true,
		}
		const addressData = {
			...data,
			userTypeId: this.sourcePoApproval.shipToUserTypeId,
			userId: this.sourcePoApproval.shipToUserId.userID,
			siteName: editValueAssignByCondition('siteName', data.siteName),
			countryId: getValueFromObjectByKey('value', data.countryId)
		}

		if (!this.isEditModeShipping) {
			this.commonService.createAllAddres(addressData).subscribe(response => {
				if (response) {
					this.onShipToSelected(this.sourcePoApproval.shipToUserId, 0, 0, response);
					this.alertService.showMessage(
						'Success',
						`Saved Shipping Information Successfully`,
						MessageSeverity.success
					);
				}
				else {
					this.alertService.showMessage(
						'Error',
						`Eroor While Saving Shipping Address`,
						MessageSeverity.error
					);
				}
			}, err => {
				this.isSpinnerVisible = false;
				//const errorLog = err;
				//this.errorMessageHandler(errorLog);
			});
		} else {
			this.commonService.createAllAddres(addressData).subscribe(response => {
				if (response) {
					this.onShipToSelected(this.sourcePoApproval.shipToUserId, 0, 0, response);
					this.alertService.showMessage(
						'Success',
						`Shipping Information Updated Successfully`,
						MessageSeverity.success
					);
				} else {
					this.alertService.showMessage(
						'Error',
						`Eroor While Saving Shipping Address`,
						MessageSeverity.error
					);
				}
			}, err => {
				this.isSpinnerVisible = false;
				//const errorLog = err;
				//this.errorMessageHandler(errorLog);
			});
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
		const addressData = {
			...data,
			siteName: editValueAssignByCondition('siteName', data.siteName),
			userTypeId: this.sourcePoApproval.billToUserTypeId,
			userId: this.sourcePoApproval.billToUserId.userID,
			countryId: getValueFromObjectByKey('value', data.countryId),
			addressType: 'Bill'
		}

		if (!this.isEditModeBilling) {
			this.commonService.createAllAddres(addressData).subscribe(response => {
				if (response) {
					this.onBillToSelected(this.sourcePoApproval.billToUserId, 0, 0, response);
					this.alertService.showMessage(
						'Success',
						`Saved Shipping Information Successfully`,
						MessageSeverity.success
					);
				} else {
					this.alertService.showMessage(
						'Error',
						`Eroor While Saving Shipping Address`,
						MessageSeverity.error
					);
				}
			}, err => {
				this.isSpinnerVisible = false;
				//const errorLog = err;
				//this.errorMessageHandler(errorLog);
			});
		} else {
			this.commonService.createAllAddres(addressData).subscribe(response => {
				if (response) {
					this.onBillToSelected(this.sourcePoApproval.billToUserId, 0, 0, response);
					this.alertService.showMessage(
						'Success',
						`Shipping Information Updated Successfully`,
						MessageSeverity.success
					);
				} else {
					this.alertService.showMessage(
						'Error',
						`Eroor While Saving Shipping Address`,
						MessageSeverity.error
					);
				}
			}, err => {
				this.isSpinnerVisible = false;
				//const errorLog = err;
				//this.errorMessageHandler(errorLog);
			});
		}
	}

	saveBillingAddressToPO() {
		const data = {
			...this.addressFormForBilling,
			createdBy: this.userName,
			updatedBy: this.userName,
			masterCompanyId: this.currentUserMasterCompanyId,
			isActive: true,
		}
		const addressData = {
			...data,
			purchaseOrderID: this.id,
			isPoOnly: true,
			siteName: editValueAssignByCondition('siteName', data.siteName),
			userTypeId: this.sourcePoApproval.billToUserTypeId,
			userId: this.sourcePoApproval.billToUserId.userID,
			countryId: getValueFromObjectByKey('value', data.countryId),
			addressType: 'Bill'
		}

		if (!this.isEditModeShippingPoOnly) {
			this.commonService.createAllAddres(addressData).subscribe(response => {
				if (response) {
					this.onBillToSelected(this.sourcePoApproval.billToUserId, 0, 0, response, true);
					this.alertService.showMessage(
						'Success',
						`Saved Shipping Information Successfully`,
						MessageSeverity.success
					);
				} else {
					this.alertService.showMessage(
						'Error',
						`Eroor While Saving Shipping Address`,
						MessageSeverity.error
					);
				}
			}, err => {
				this.isSpinnerVisible = false;
				//const errorLog = err;
				//this.errorMessageHandler(errorLog);
			});
		} else {
			this.commonService.createAllAddres(addressData).subscribe(response => {
				if (response) {
					this.onBillToSelected(this.sourcePoApproval.billToUserId, 0, 0, response);
					this.alertService.showMessage(
						'Success',
						`Shipping Information Updated Successfully`,
						MessageSeverity.success
					);
				} else {
					this.alertService.showMessage(
						'Error',
						`Eroor While Saving Shipping Address`,
						MessageSeverity.error
					);
				}
			}, err => {
				this.isSpinnerVisible = false;
				//const errorLog = err;
				//this.errorMessageHandler(errorLog);
			});
		}
	}






	onChangeShippingHandlingCost(str) {
		this.sourcePoApproval[str] = this.sourcePoApproval[str] ? formatNumberAsGlobalSettingsModule(this.sourcePoApproval[str], 2) : '0.00';
	}
	getShipViaDetails(id) {
		if (this.shipViaList && this.shipViaList.length != 0) {
			for (let i = 0; i < this.shipViaList.length; i++) {
				if (this.shipViaList[i].shippingViaId == id) {
					this.sourcePoApproval.shippingViaId = this.shipViaList[i].shippingViaId;
					this.sourcePoApproval.shipViaId = this.shipViaList[i].shipViaId;
					this.sourcePoApproval.shipVia = this.shipViaList[i].name;
					this.sourcePoApproval.shippingAccountNo = this.shipViaList[i].shippingAccountInfo;
				}
			}
		}
	}
	resetAddressShipViaForm() {
		this.addShipViaFormForShipping = new CustomerInternationalShipVia();
		this.isEditModeShipVia = false;
	}



	postSiteNameForBilling(moduleId, currentbillToAddressId) {
		if (moduleId !== undefined && currentbillToAddressId !== undefined) {
			moduleId = parseInt(moduleId)
			return getValueFromArrayOfObjectById('siteName', 'siteId', currentbillToAddressId, this.billToSite);
		}
	}

	postSiteNameForShipping(moduleId, currentshipToAddressId) {
		if (moduleId !== undefined && currentshipToAddressId !== undefined) {
			moduleId = parseInt(moduleId)
			return getValueFromArrayOfObjectById('siteName', 'siteId', currentshipToAddressId, this.shipToSite);
		}
	}

	savePurchaseOrderAddress() {

		if (this.createPOAddressForm.invalid ||
			this.sourcePoApproval.shipToUserTypeId == 0 || this.sourcePoApproval.shipToUserTypeId == null
			|| this.sourcePoApproval.shipToUserId.userID == 0 || this.sourcePoApproval.shipToUserId.userID == null
			|| this.sourcePoApproval.shipToSiteId == 0 || this.sourcePoApproval.shipToSiteId == null
			|| this.sourcePoApproval.shipToContactId == 0 || this.sourcePoApproval.shipToContactId == null
			|| this.sourcePoApproval.shippingViaId == 0 || this.sourcePoApproval.shippingViaId == null
			|| this.sourcePoApproval.billToUserTypeId == 0 || this.sourcePoApproval.billToUserTypeId == null
			|| this.sourcePoApproval.billToUserId.userID == 0 || this.sourcePoApproval.billToUserId.userID == null
			|| this.sourcePoApproval.billToSiteId == 0 || this.sourcePoApproval.billToSiteId == null
			|| this.sourcePoApproval.billToContactId == 0 || this.sourcePoApproval.billToContactId == null) {
			this.alertService.showMessage('Address', "Please enter required highlighted fields for Address!", MessageSeverity.error);
			this.inputValidCheckAdd = true;
			if (this.sourcePoApproval.shipToUserTypeId == 0) {
				this.shipToUserTypeValidCheck = true;
			}
			if (this.sourcePoApproval.shipToSiteId == 0) {
				this.shipToSiteNameValidCheck = true;
			}
			if (this.sourcePoApproval.shippingViaId == 0) {
				this.shipViaValidCheck = true;
			}
			if (this.sourcePoApproval.billToUserTypeId == 0) {
				this.billToUserTypeValidCheck = true;
			}
			if (this.sourcePoApproval.billToAddressId == 0) {
				this.billToSiteNameValidCheck = true;
			}
		}
		else {
			this.isSpinnerVisible = true;
			this.getShipViaDetails(this.sourcePoApproval.shippingViaId);
			this.sourcePoApprovalObj = {
				purchaseOrderId: this.id,
				// reffranceId: this.id,
				moduleId: this.ModuleID,
				shipToPOAddressId: this.sourcePoApproval.shipToPOAddressId ? this.sourcePoApproval.shipToPOAddressId : 0,
				shipToUserTypeId: this.sourcePoApproval.shipToUserTypeId ? parseInt(this.sourcePoApproval.shipToUserTypeId) : 0,
				shipToUserTypeName: getValueFromArrayOfObjectById('moduleName', 'moduleId', this.sourcePoApproval.shipToUserTypeId, this.userTypes),
				shipToUserId: this.sourcePoApproval.shipToUserId && this.sourcePoApproval.shipToUserId.userID ? this.sourcePoApproval.shipToUserId.userID : 0,
				shipToUserName: getValueFromArrayOfObjectById('userName', 'userID', this.sourcePoApproval.shipToUserId.userID, this.userShipingList),
				shipToSiteId: this.sourcePoApproval.shipToSiteId ? this.sourcePoApproval.shipToSiteId : 0,
				shipToSiteName: this.postSiteNameForShipping(this.sourcePoApproval.shipToUserTypeId, this.sourcePoApproval.shipToSiteId),
				shipToMemo: this.sourcePoApproval.shipToMemo ? this.sourcePoApproval.shipToMemo : '',
				shipToContactId: this.sourcePoApproval.shipToContactId ? editValueAssignByCondition('contactId', this.sourcePoApproval.shipToContactId) : 0,
				shipToContact: this.sourcePoApproval.shipToContactId ? getValueFromArrayOfObjectById('name', 'contactId', this.sourcePoApproval.shipToContactId, this.shipToContactDataList) : '',
				shipAddIsPoOnly: this.sourcePoApproval.shipAddIsPoOnly,
				shipToAddressId: this.shipToAddress.addressId ? this.shipToAddress.addressId : 0,
				shipToAddress1: this.shipToAddress.address1,
				shipToAddress2: this.shipToAddress.address2,
				shipToAddress3: this.shipToAddress.address3,
				shipToCity: this.shipToAddress.city,
				shipToStateOrProvince: this.shipToAddress.stateOrProvince,
				shipToPostalCode: this.shipToAddress.postalCode,
				shipToCountry: this.shipToAddress.country,
				shipToCountryId: this.shipToAddress.countryId,
				billToPOAddressId: this.sourcePoApproval.billToPOAddressId ? this.sourcePoApproval.billToPOAddressId : 0,
				billToUserTypeId: this.sourcePoApproval.billToUserTypeId ? parseInt(this.sourcePoApproval.billToUserTypeId) : 0,
				billToUserTypeName: getValueFromArrayOfObjectById('moduleName', 'moduleId', this.sourcePoApproval.billToUserTypeId, this.userTypes),
				billToUserId: this.sourcePoApproval.billToUserId && this.sourcePoApproval.billToUserId.userID ? this.sourcePoApproval.billToUserId.userID : 0,
				billToUserName: getValueFromArrayOfObjectById('userName', 'userID', this.sourcePoApproval.billToUserId.userID, this.userBillingList),
				billToSiteId: this.sourcePoApproval.billToSiteId ? this.sourcePoApproval.billToSiteId : 0,
				billToSiteName: this.postSiteNameForBilling(this.sourcePoApproval.billToUserTypeId, this.sourcePoApproval.billToSiteId),
				billToMemo: this.sourcePoApproval.billToMemo ? this.sourcePoApproval.billToMemo : '',
				billToContactId: this.sourcePoApproval.billToContactId ? editValueAssignByCondition('contactId', this.sourcePoApproval.billToContactId) : 0,
				billToContact: this.sourcePoApproval.billToContactId ? getValueFromArrayOfObjectById('name', 'contactId', this.sourcePoApproval.billToContactId, this.billToContactDataList) : '',
				billAddIsPoOnly: this.sourcePoApproval.billAddIsPoOnly,
				billToAddressId: this.billToAddress.addressId ? this.billToAddress.addressId : 0,
				billToAddress1: this.billToAddress.address1,
				billToAddress2: this.billToAddress.address2,
				billToCity: this.billToAddress.city,
				billToStateOrProvince: this.billToAddress.stateOrProvince,
				billToPostalCode: this.billToAddress.postalCode,
				billToCountry: this.billToAddress.country,
				billToCountryId: this.billToAddress.countryId,
				poShipViaId: this.sourcePoApproval.poShipViaId ? this.sourcePoApproval.poShipViaId : 0,
				shipViaId: this.sourcePoApproval.shipViaId,
				shippingCost: this.sourcePoApproval.shippingCost ? parseFloat(this.sourcePoApproval.shippingCost.toString().replace(/\,/g, '')) : 0.00,
				handlingCost: this.sourcePoApproval.handlingCost ? parseFloat(this.sourcePoApproval.handlingCost.toString().replace(/\,/g, '')) : 0.00,
				shippingViaId: this.sourcePoApproval.shippingViaId,
				shipVia: this.sourcePoApproval.shipVia,
				shippingAccountNo: this.sourcePoApproval.shippingAccountNo,
				MasterCompanyId: this.currentUserMasterCompanyId,
				createdBy: this.userName,
				updatedBy: this.userName,
			}

			const poAddressEdit = { ...this.sourcePoApprovalObj, purchaseOrderId: parseInt(this.id) };
			// if(this.addressType == AddressTypeEnum.PurchaseOrder){
			// 	this.SavePurchaseOrderNew(poAddressEdit);
			// }
			// else if(this.addressType == AddressTypeEnum.SalesOrderQuote){
			// 	this.SaveSalesOrderQuoteNew(poAddressEdit);
			// }
			this.SaveAllAddress(poAddressEdit);
			//this.isSpinnerVisible=false;		
		}
	}

	SaveAllAddress(poAddressEdit) {
		this.commonService.saveAllAddress({ ...poAddressEdit }).subscribe(res => {
			if (res.shipToPOAddressId && res.shipToPOAddressId > 0) {
				this.sourcePoApproval = {
					shipToPOAddressId: res.shipToPOAddressId,
					shipToUserTypeId: res.shipToUserType,
					shipToUserId: getObjectById('userID', res.shipToUserId, this.userShipingList),				  // this.getShipToUserIdEdit(res),
					shipToSiteId: res.shipToSiteId,
					shipToSiteName: res.shipToSiteName,
					shipAddIsPoOnly: res.shipAddIsPoOnly,
					shipToContactId: res.shipToContactId,
					shipToContact: res.shipToContact,
					shipToMemo: res.shipToMemo,
					shipToAddressId: res.shipToAddressId,
					shipToAddress1: res.shipToAddress1,
					shipToAddress2: res.shipToAddress2,
					shipToCity: res.shipToCity,
					shipToStateOrProvince: res.shipToState,
					shipToPostalCode: res.shipToPostalCode,
					ShipToCountryId: res.shipToCountryId ? getObjectByValue('value', res.shipToCountryId, this.allCountriesList) : 0,
					poShipViaId: res.poShipViaId,

					billToPOAddressId: res.billToPOAddressId,
					billToUserTypeId: res.billToUserType,
					billToUserId: getObjectById('userID', res.billToUserId, this.userBillingList),//this.getBillToUserIdEdit(res),
					billToSiteId: res.billToSiteId,
					billToSiteName: res.billToSiteName,
					billAddIsPoOnly: res.billAddIsPoOnly,
					billToContactId: res.billToContactId,
					billToContactName: res.billToContactName,
					billToMemo: res.billToMemo,
					billToAddressId: res.billToAddressId,
					billToAddress1: res.billToAddress1,
					billToAddress2: res.billToAddress2,
					billToCity: res.billToCity,
					billToStateOrProvince: res.billToState,
					billToPostalCode: res.billToPostalCode,
					billToCountryId: res.billToCountryId ? getObjectByValue('value', res.billToCountryId, this.allCountriesList) : 0,

					shippingViaId: res.shippingViaId,
					shipViaId: res.shipViaId,
					shipVia: res.shipVia,
					shippingCost: formatNumberAsGlobalSettingsModule(res.shippingCost, 2),
					handlingCost: formatNumberAsGlobalSettingsModule(res.handlingCost, 2),
					shippingAccountNo: res.ShippingAccountNo
				};
				this.isEditModeAdd = true;
			} else {
				this.isEditModeAdd = false;
			}
			this.isSpinnerVisible = false;
			this.enableAddSaveBtn = false;
			this.getShipViaDetails(this.sourcePoApproval.shippingViaId);
			this.alertService.showMessage(
				'Success',
				`Address Saved Successfully`,
				MessageSeverity.success
			);
		}, err => {
			this.isSpinnerVisible = false;
		});
	}

	SavePurchaseOrderNew(poAddressEdit) {
		this.purchaseOrderService.savePurchaseOrderAddress({ ...poAddressEdit }).subscribe(res => {
			if (res.value.shipToPOAddressId && res.value.shipToPOAddressId > 0) {
				this.sourcePoApproval = {
					shipToPOAddressId: res.value.shipToPOAddressId,
					shipToUserTypeId: res.value.shipToUserType,
					shipToUserId: getObjectById('userID', res.value.shipToUserId, this.userShipingList),				  // this.getShipToUserIdEdit(res),
					shipToSiteId: res.value.shipToSiteId,
					shipToSiteName: res.value.shipToSiteName,
					shipAddIsPoOnly: res.value.shipAddIsPoOnly,
					shipToContactId: res.value.shipToContactId,
					shipToContact: res.value.shipToContact,
					shipToMemo: res.value.shipToMemo,
					shipToAddressId: res.value.shipToAddressId,
					shipToAddress1: res.value.shipToAddress1,
					shipToAddress2: res.value.shipToAddress2,
					shipToCity: res.value.shipToCity,
					shipToStateOrProvince: res.value.shipToState,
					shipToPostalCode: res.value.shipToPostalCode,
					ShipToCountryId: res.value.shipToCountryId ? getObjectByValue('value', res.value.shipToCountryId, this.allCountriesList) : 0,
					poShipViaId: res.value.poShipViaId,

					billToPOAddressId: res.value.billToPOAddressId,
					billToUserTypeId: res.value.billToUserType,
					billToUserId: getObjectById('userID', res.value.billToUserId, this.userBillingList),//this.getBillToUserIdEdit(res),
					billToSiteId: res.value.billToSiteId,
					billToSiteName: res.value.billToSiteName,
					billAddIsPoOnly: res.value.billAddIsPoOnly,
					billToContactId: res.value.billToContactId,
					billToContactName: res.value.billToContactName,
					billToMemo: res.value.billToMemo,
					billToAddressId: res.value.billToAddressId,
					billToAddress1: res.value.billToAddress1,
					billToAddress2: res.value.billToAddress2,
					billToCity: res.value.billToCity,
					billToStateOrProvince: res.value.billToState,
					billToPostalCode: res.value.billToPostalCode,
					billToCountryId: res.value.billToCountryId ? getObjectByValue('value', res.value.billToCountryId, this.allCountriesList) : 0,

					shippingViaId: res.value.shippingViaId,
					shipViaId: res.value.shipViaId,
					shipVia: res.value.shipVia,
					shippingCost: formatNumberAsGlobalSettingsModule(res.value.shippingCost, 2),
					handlingCost: formatNumberAsGlobalSettingsModule(res.value.handlingCost, 2),
					shippingAccountNo: res.value.ShippingAccountNo
				};
				this.isEditModeAdd = true;
			} else {
				this.isEditModeAdd = false;
			}
			this.isSpinnerVisible = false;
			this.enableAddSaveBtn = false;
			this.getShipViaDetails(this.sourcePoApproval.shippingViaId);
			this.alertService.showMessage(
				'Success',
				`Address Saved Successfully`,
				MessageSeverity.success
			);
		}, err => {
			this.isSpinnerVisible = false;
			//const errorLog = err;
			//this.errorMessageHandler(errorLog);
		});
	}

	SaveSalesOrderQuoteNew(poAddressEdit) {
		this.salesQuoteService.saveSalesOrderQuoteAddress({ ...poAddressEdit }).subscribe(res => {
			if (res.value.shipToPOAddressId && res.value.shipToPOAddressId > 0) {
				this.sourcePoApproval = {
					shipToPOAddressId: res.value.shipToPOAddressId,
					shipToUserTypeId: res.value.shipToUserType,
					shipToUserId: getObjectById('userID', res.value.shipToUserId, this.userShipingList),				  // this.getShipToUserIdEdit(res),
					shipToSiteId: res.value.shipToSiteId,
					shipToSiteName: res.value.shipToSiteName,
					shipAddIsPoOnly: res.value.shipAddIsPoOnly,
					shipToContactId: res.value.shipToContactId,
					shipToContact: res.value.shipToContact,
					shipToMemo: res.value.shipToMemo,
					shipToAddressId: res.value.shipToAddressId,
					shipToAddress1: res.value.shipToAddress1,
					shipToAddress2: res.value.shipToAddress2,
					shipToCity: res.value.shipToCity,
					shipToStateOrProvince: res.value.shipToState,
					shipToPostalCode: res.value.shipToPostalCode,
					ShipToCountryId: res.value.shipToCountryId ? getObjectByValue('value', res.value.shipToCountryId, this.allCountriesList) : 0,
					poShipViaId: res.value.poShipViaId,

					billToPOAddressId: res.value.billToPOAddressId,
					billToUserTypeId: res.value.billToUserType,
					billToUserId: getObjectById('userID', res.value.billToUserId, this.userBillingList),//this.getBillToUserIdEdit(res),
					billToSiteId: res.value.billToSiteId,
					billToSiteName: res.value.billToSiteName,
					billAddIsPoOnly: res.value.billAddIsPoOnly,
					billToContactId: res.value.billToContactId,
					billToContactName: res.value.billToContactName,
					billToMemo: res.value.billToMemo,
					billToAddressId: res.value.billToAddressId,
					billToAddress1: res.value.billToAddress1,
					billToAddress2: res.value.billToAddress2,
					billToCity: res.value.billToCity,
					billToStateOrProvince: res.value.billToState,
					billToPostalCode: res.value.billToPostalCode,
					billToCountryId: res.value.billToCountryId ? getObjectByValue('value', res.value.billToCountryId, this.allCountriesList) : 0,

					shippingViaId: res.value.shippingViaId,
					shipViaId: res.value.shipViaId,
					shipVia: res.value.shipVia,
					shippingCost: formatNumberAsGlobalSettingsModule(res.value.shippingCost, 2),
					handlingCost: formatNumberAsGlobalSettingsModule(res.value.handlingCost, 2),
					shippingAccountNo: res.value.ShippingAccountNo
				};
				this.isEditModeAdd = true;
			} else {
				this.isEditModeAdd = false;
			}
			this.isSpinnerVisible = false;
			this.enableAddSaveBtn = false;
			this.getShipViaDetails(this.sourcePoApproval.shippingViaId);
			this.alertService.showMessage(
				'Success',
				`Saved Address Successfully`,
				MessageSeverity.success
			);
		}, err => {
			this.isSpinnerVisible = false;
			//const errorLog = err;
			//this.errorMessageHandler(errorLog);
		});
	}

	onClickBillMemo() {
		this.addressMemoLabel = 'Edit Bill';
		this.tempMemo = this.sourcePoApproval.billToMemo;
	}

	onClickShipMemo() {
		this.addressMemoLabel = 'Edit Ship';
		this.tempMemo = this.sourcePoApproval.shipToMemo;
	}
	onSaveAddressMemo() {
		if (this.addressMemoLabel == 'Edit Ship') {
			this.sourcePoApproval.shipToMemo = this.tempMemo;
		}
		if (this.addressMemoLabel == 'Edit Bill') {
			this.sourcePoApproval.billToMemo = this.tempMemo;
		}
		this.enableAddSaveBtn = true;
	}


}
