import { Component, OnInit } from '@angular/core';
import { VendorService } from '../../../../services/vendor.service';
import { dashCaseToCamelCase } from '@angular/compiler/src/util';
import { Router } from '@angular/router';
import { PriorityService } from '../../../../services/priority.service';
import { AlertService } from '../../../../services/alert.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-create-ro',
	templateUrl: './create-ro.component.html',
	styleUrls: ['./create-ro.component.scss']
})
/** create-ro component*/
export class CreateRoComponent implements OnInit {

	isCreateRO: boolean = true;
	constructor()  {

	}
	ngOnInit() {

	}

}

	/*first: number = 0;
	isEditMode: boolean=false;
	vendorCode: any = "";
	vendorname: any = "";
	vendorEmail: any = "";
	VendorTypeId: any = "";
	allgeneralInfo: any[];
	collection: any;
	//vendorCode: any = "";
	memo: any = "";
	createdBy: any = "";
	updatedBy: any = "";
	createddate: any = "";
	updatedDate: any = "";
	sub: any;
	local: any;
	vendorName: any;
	lastName: any = "";
	firstName: any = "";
	contactTitle: any = "";
	email: any = "";
	mobilePhone: number;
	fax: any = "";
	vendorTypeId: any = "";
	doingBusinessAsName: any = "";
	parent: any = "";
	address1: any = "";
	address2: any = "";
	address3: any = "";
	city: any = "";
	stateOrProvince: any = "";
	postal: any = "";
	country: any = "";
	classificationName: any = "";
	isPreferredVendor: any = "";
	vendorContractReference: any = "";
	licenseNumber: any = "";
	capabilityId: any = "";
	vendorURL: any = "";
	postalCode: any = "";
	vendorClassificationId: any = "";
	creditlimit: any = "";
	creditTermsId: any = "";
	currencyId: any = "";
	discountLevel: any = "";
	is1099Required: any = "";
	allPriorityInfo: any[]=[];
	vendorList: any = [];
	sourcePo: any = {};
    vendorCodes: any[];
    vendorNames: any[];
    allActions: any[]=[];
    VendorNamecoll: any[]=[];
    disableSaveVenName: boolean;
    selectedActionName: any;
    loadingIndicator: boolean;
    vendorId: any;
    selectedVendorCode: any;
    disableSaveVenderName: boolean;
    VendorCodesColl: any[]=[];
    disableSave: boolean;
	//allgeneralInfo: any[];
	showGeneralData: boolean = true;
	showcontactdata: boolean = true;
	showfinancialdata: boolean = true;
	modal: NgbModalRef;
    activeIndex: number;
	allContacts: any[] = [];
	allpayments: any[] = [];
	allShippings: any[]=[];
	paymentcols: any[];
	shippingCol: any[];
	contactcols: any[];
    selectedShippingColumns: any[];
    selectedContactColumns: any[];
    selectedPaymentColumns: any[];
    cols: any[];
    selectedColumn: any[];

	constructor(public workFlowtService: VendorService, public _router: Router, private modalService: NgbModal, public priority: PriorityService, private alertService: AlertService, private route: Router)  {
		this.workFlowtService.currentUrl = '/vendorsmodule/vendorpages/app-create-po';
		this.workFlowtService.bredcrumbObj.next(this.workFlowtService.currentUrl);
	}
	ngOnInit() {
		this.sourcePo.vendorName = ''
		this.sourcePo.vendorCode = '';
		this.sourcePo.vendorContact = ''
		this.sourcePo.contactPhone = ''
		this.sourcePo.city = ''
		this.sourcePo.state = ''
        this.sourcePo.postalCode = ''
        this.cols = [
            { field: 'vendorName', header: 'Vendor Name' },
            { field: 'vendorCode', header: 'Vendor Code' },
            { field: 'firstName', header: 'Full Name' },
            { field: 'vendorContact', header: 'Vendor Contact' },
            { field: 'vendorType', header: 'Vendor Type' },
            { field: 'contactPhone', header: 'Contact Phone' },
            { field: 'email', header: 'Email' },
            { field: 'city', header: 'City' },
            { field: 'stateOrProvince', header: 'State' },
            { field: 'postalCode', header: 'Postal Code' },
        ];
        this.getListByDetails();

		this.loadData();
		// debugger;
		
		//this.workFlowtService.currentUrl = 'vendorsmodule/vendorpages/app-create-po';
		//this.workFlowtService.bredcrumbObj.next(this.workFlowtService.currentUrl);

		this.workFlowtService.ShowPtab = false;

		this.workFlowtService.alertObj.next(this.workFlowtService.ShowPtab);

	}
	getListByDetails() {
		//debugger;
		this.vendorList = [];
		this.workFlowtService.getVendordataForPo(this.sourcePo).subscribe(data => {
			const getlist = data[0];
			console.log(getlist);			
            this.vendorList = getlist.map(x => {
                return {
					vendorId: x.vendorId,
                    vendorName: x.vendorName === null ? '-' : x.vendorName,
                    vendorCode: x.vendorCode === null ? '-' : x.vendorCode,
                    firstName: x.firstName === null ? '-' : x.firstName,
                    vendorContact: x.im.vendorContact === null ? '-' : x.im.vendorContact,
                    vendorType: this.getVendorType(x.im.vendorTypeId),
                    contactPhone: x.im.vendorPhone === null ? '-' : x.im.vendorPhone,
                    email: x.email === null ? '-' : x.email,
                    city: x.city === null ? '-' : x.city,
                    stateOrProvince: x.stateOrProvince === null ? '-' : x.stateOrProvince,
					//postalCode: x.ps.postalCode === null ? '-' : x.ps.postalCode,
                }
			})
		});
			
    }

    getVendorType(id) {
        if (id !== null) {
            if (id === 1) {
                return 'Internal';
            }
            if (id === 2) {
                return 'External';
            }
            if (id === 3) {
                return 'Affliate';
            }
        }

    }
	private priorityData() {
	
		this.priority.getPriorityList().subscribe(
			results => this.onprioritySuccessful(results[0]),
			error => this.onDataLoadFailed(error)
		);
	}
	private onprioritySuccessful(getPriorityList: any[]) {
		// alert('success');
		//this.alertService.stopLoadingMessage();
		//this.loadingIndicator = false;
		// this.dataSource.data = getPriorityList;
		this.allPriorityInfo = getPriorityList;
	}
	gotoCreateRO(rowData) {
		//this.workFlowtService.purchasepartcollection = [];
		//this.workFlowtService.isEditMode = true;
		//this.workFlowtService.vendorForPoCollection=data;
		//this._router.navigateByUrl('/vendorsmodule/vendorpages/app-purchase-setup');
		console.log(rowData);		
        const { vendorId } = rowData;
        this._router.navigateByUrl(`vendorsmodule/vendorpages/app-ro-setup/vendor/${vendorId}`);
	}
	private onDataLoadFailed(error: any) {
		// alert(error);
		//this.alertService.stopLoadingMessage();
		//this.loadingIndicator = false;

	}
	onVendorselected(event) {
		//debugger;
		for (let i = 0; i < this.VendorNamecoll.length; i++) {
			if (event == this.VendorNamecoll[i][0].vendorName) {
				//alert("Action Name already Exists");
				this.disableSaveVenName = true;
				this.disableSave = true;
				this.disableSaveVenderName = true;
				this.selectedActionName = event;
			}

		}
		//this.workFlowtService.getvendorList(event).subscribe(
		//	results => this.onvendorloadsuccessfull(results[0]),
		//	error => this.onDataLoadFailed(error)
		//);
	}

	eventHandler(event) {
		if (event.target.value != "") {
			let value = event.target.value.toLowerCase();
			if (this.selectedActionName) {
				if (value == this.selectedActionName.toLowerCase()) {
					//alert("Action Name already Exists");
					this.disableSaveVenderName = true;
					this.disableSaveVenName = true;
				}
				else {
					this.disableSaveVenderName = false;
					this.disableSaveVenName = false;
				}
			}

		}
	}

	filterVendorNames(event) {

		this.vendorNames = [];
		for (let i = 0; i < this.allActions.length; i++) {
			let vendorName = this.allActions[i].vendorName;
			if (vendorName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
				//this.vendorNames.push(vendorName);
				this.VendorNamecoll.push([{
					"vendorId": this.allActions[i].vendorClassificationId,
					"vendorName": vendorName
				}]),
					this.vendorNames.push(vendorName);
			}
		}
	}

	private onDataLoadSuccessful(allWorkFlows: any[]) {

		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		//this.dataSource.data = allWorkFlows;
		this.allActions = allWorkFlows;
		this.vendorId = this.allActions[0].vendorId;
		//console.log(this.allActions);


	}
	private loadData() {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.workFlowtService.getWorkFlows().subscribe(
			results => this.onDataLoadSuccessful(results[0]),
			error => this.onDataLoadFailed(error)
		);


	}

	eventvendorHandler(event) {
		if (event.target.value != "") {
			let value = event.target.value.toLowerCase();
			if (this.selectedVendorCode) {
				if (value == this.selectedVendorCode.toLowerCase()) {
					//alert("Action Name already Exists");
					this.disableSaveVenName = true;
					this.disableSaveVenderName = true;

				}
				else {
					this.disableSaveVenName = false;
					this.disableSaveVenderName = false;

				}
			}

		}


	}

	onVendorCodeselected(event) {
		//debugger;
		for (let i = 0; i < this.VendorCodesColl.length; i++) {
			if (event == this.VendorCodesColl[i][0].vendorCode) {

				this.disableSaveVenName = true;
				this.disableSaveVenderName = true;
				this.selectedVendorCode = event;
			}
		}
	}

	filterVendorCodes(event) {

		this.vendorCodes = [];
		for (let i = 0; i < this.allActions.length; i++) {
			let vendorCode = this.allActions[i].vendorCode;

			if (vendorCode.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
				//this.vendorCodes.push(vendorCode);
				this.VendorCodesColl.push([{
					"vendorId": this.allActions[i].vendorClassificationId,
					"vendorCode": vendorCode
				}]),
					this.vendorCodes.push(vendorCode);

			}
		}
	}

	private ongeneralDataLoadSuccessful(allWorkFlows: any[]) {

		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		//this.dataSource.data = allWorkFlows;
		this.allgeneralInfo = allWorkFlows;
		//this.vendorname = this.allgeneralInfo[0].vendorName;
		//this.vendorCode = this.allgeneralInfo[0].vendorCode;
		//console.log(this.allgeneralInfo);


	}

	//openContactList() {
	//	this.activeIndex = 1;
	//	this.workFlowtService.indexObj.next(this.activeIndex);
	//	this.route.navigateByUrl('/vendorsmodule/vendorpages/app-vendor-contacts');
	//	//this.saveCompleted(this.sourceVendor);


	//}

	openContactList(content,row) {
		
		this.loadContactDataData(row.vendorId);
		this.modal = this.modalService.open(content, { size: 'lg' });
		this.modal.result.then(() => {
			console.log('When user closes');
		}, () => { console.log('Backdrop click') })
	}

	openView(content, row) {
		
		//this.sourceVendor = row;
		this.vendorCode = row.im.vendorCode;
		this.vendorName = row.im.vendorName;
		this.vendorTypeId = row.im.vendorTypeId;
		this.doingBusinessAsName = row.im.doingBusinessAsName;
		this.parent = row.im.parent;
		this.address1 = row.ps.line1;
		this.address2 = row.ps.line2;
		this.address3 = row.ps.line3;
		this.city = row.ps.city;
		this.stateOrProvince = row.ps.stateOrProvince;
		this.postalCode = row.ps.postalCode;
		this.country = row.ps.country;
		this.vendorEmail = row.im.vendorEmail;
		this.vendorClassificationId = row.im.vendorClassificationId;
		this.vendorContractReference = row.im.vendorContractReference;
		this.isPreferredVendor = row.im.isPreferredVendor;
		this.licenseNumber = row.im.licenseNumber;
		this.capabilityId = row.im.capabilityId;
		this.vendorURL = row.im.vendorURL;
		this.sourcePo = row;
		this.creditlimit = row.im.creditlimit;
		this.creditTermsId = row.im.creditTermsId;
		this.currencyId = row.im.currencyId;
		this.discountLevel = row.im.discountLevel;
		this.is1099Required = row.im.is1099Required;
		this.loadContactDataData(row.vendorId);
		this.loadPayamentData(row.vendorId);
		this.loadShippingData(row.vendorId);
		this.modal = this.modalService.open(content, { size: 'lg' });
		this.modal.result.then(() => {
			console.log('When user closes');
		}, () => { console.log('Backdrop click') })

		
	}
	dismissModel() {
		this.modal.close();
	}
	private loadContactDataData(id) {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.workFlowtService.getContacts(id).subscribe(
			results => this.onContactDataLoadSuccessful(results[0]),
			error => this.onDataLoadFailed(error)
		);

		this.contactcols = [
			//{ field: 'actionId', header: 'Action Id' },
			{ field: 'firstName', header: 'First Name' },
			{ field: 'lastName', header: 'Last  Name' },
			{ field: 'contactTitle', header: 'Contact Title' },
			{ field: 'email', header: 'Email' },
			{ field: 'mobilePhone', header: 'Mobile Phone' },
			{ field: 'fax', header: 'Fax' },
			{ field: 'createdBy', header: 'Created By' },
			{ field: 'updatedBy', header: 'Updated By' },
			{ field: 'updatedDate', header: 'Updated Date' },
			{ field: 'createdDate', header: 'Created Date' }

		];

		this.selectedContactColumns = this.contactcols;

	}
	private onContactDataLoadSuccessful(allWorkFlows: any[]) {

		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		//this.dataSource.data = allWorkFlows;
		this.allContacts = allWorkFlows;
	}

	private loadPayamentData(id) {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.workFlowtService.getCheckPaymentobj(id).subscribe(
			results => this.onPaymentDataLoadSuccessful(results[0]),
			error => this.onDataLoadFailed(error)
		);



		this.paymentcols = [
			//{ field: 'actionId', header: 'Action Id' },
			{ field: 'siteName', header: 'Site Name' },
			{ field: 'address1', header: 'Address' },
			{ field: 'city', header: 'City' },
			{ field: 'stateOrProvince', header: 'State/Prov' },
			{ field: 'postalCode', header: 'Postal Code' },
			{ field: 'country', header: 'Country' }

		];

		this.selectedPaymentColumns = this.paymentcols;

	}

	private onPaymentDataLoadSuccessful(allWorkFlows: any[]) {

		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		//this.dataSource.data = allWorkFlows;
		this.allpayments = allWorkFlows;


	}

	private loadShippingData(id) {
		this.alertService.startLoadingMessage();
		this.loadingIndicator = true;

		this.workFlowtService.getVendorShipAddressGet(id).subscribe(
			results => this.onShippingDataLoadSuccessful(results[0]),
			error => this.onDataLoadFailed(error)
		);

		this.shippingCol = [

			{ field: 'siteName', header: 'Site Name' },
			{ field: 'address1', header: 'Address1' },
			{ field: 'address2', header: 'Address2' },
			{ field: 'address3', header: 'Address3' },
			{ field: 'city', header: 'City' },
			{ field: 'stateOrProvince', header: 'State/Prov' },
			{ field: 'postalCode', header: 'Postal Code' },
			{ field: 'country', header: 'Country' }

		];

		this.selectedShippingColumns = this.shippingCol;

	}

	private onShippingDataLoadSuccessful(allWorkFlows: any[]) {

		this.alertService.stopLoadingMessage();
		this.loadingIndicator = false;
		//this.dataSource.data = allWorkFlows;
		this.allShippings = allWorkFlows;


	}

	openGeneralInfo() {
		this.showGeneralData = true;
		this.showcontactdata = false;
		this.showfinancialdata = false;
	}
	openFinancialInfo() {
		this.showGeneralData = false;
		this.showcontactdata = false;
		this.showfinancialdata = true;
    }

    onCreateRO() {
        this._router.navigateByUrl('/vendorsmodule/vendorpages/app-ro-setup');
	}

}

// 	vendorCode: any = "";
// 	vendorname: any = "";
// 	vendorEmail: any = "";
// 	VendorTypeId: any = "";
// 	allgeneralInfo: any[];
// 	collection: any;
// 	//vendorCode: any = "";
// 	memo: any = "";
// 	createdBy: any = "";
// 	updatedBy: any = "";
// 	createddate: any = "";
// 	updatedDate: any = "";
// 	sub: any;
// 	local: any;
// 	vendorName: any;
// 	lastName: any = "";
// 	firstName: any = "";
// 	contactTitle: any = "";
// 	email: any = "";
// 	mobilePhone: number;
// 	fax: any = "";
// 	vendorTypeId: any = "";
// 	doingBusinessAsName: any = "";
// 	parent: any = "";
// 	address1: any = "";
// 	address2: any = "";
// 	address3: any = "";
// 	city: any = "";
// 	stateOrProvince: any = "";
// 	postal: any = "";
// 	country: any = "";
// 	classificationName: any = "";
// 	isPreferredVendor: any = "";
// 	vendorContractReference: any = "";
// 	licenseNumber: any = "";
// 	capabilityId: any = "";
// 	vendorURL: any = "";
// 	postalCode: any = "";
// 	vendorClassificationId: any = "";
// 	creditlimit: any = "";
// 	creditTermsId: any = "";
// 	currencyId: any = "";
// 	discountLevel: any = "";
// 	is1099Required: any = "";
// 	allPriorityInfo: any[] = [];
// 	vendorList: any[] = [];
// 	/** create-po ctor */
// 	sourcePo: any = {};
// 	vendorCodes: any[];
// 	vendorNames: any[];
// 	allActions: any[] = [];
// 	VendorNamecoll: any[] = [];
// 	disableSaveVenName: boolean;
// 	selectedActionName: any;
// 	loadingIndicator: boolean;
// 	vendorId: any;
// 	selectedVendorCode: any;
// 	disableSaveVenderName: boolean;
// 	VendorCodesColl: any[] = [];
// 	disableSave: boolean;
// 	//allgeneralInfo: any[];
// 	showGeneralData: boolean = true;
// 	showcontactdata: boolean = true;
// 	showfinancialdata: boolean = true;
// 	modal: NgbModalRef;
// 	activeIndex: number;
// 	allContacts: any[] = [];
// 	allpayments: any[] = [];
// 	allShippings: any[] = [];
// 	paymentcols: any[];
// 	shippingCol: any[];
// 	contactcols: any[];
// 	selectedShippingColumns: any[];
// 	selectedContactColumns: any[];
// 	selectedPaymentColumns: any[];
//     itemTypeId: number;
// 	constructor(public workFlowtService: VendorService, public _router: Router, private modalService: NgbModal, public priority: PriorityService, private alertService: AlertService, private route: Router) {

// 		this.workFlowtService.ShowPtab = false;
// 		this.itemTypeId = 0;
// 		this.workFlowtService.alertObj.next(this.workFlowtService.ShowPtab);

// 	}
// 	ngOnInit() {
// 		this.sourcePo.vendorName = ''
// 		this.sourcePo.vendorCode = '';
// 		this.sourcePo.vendorContact = ''
// 		this.sourcePo.contactPhone = ''
// 		this.sourcePo.city = ''
// 		this.sourcePo.state = ''
// 		this.sourcePo.postalCode = ''

// 		this.loadData();
// 		// debugger;

// 		//this.workFlowtService.currentUrl = 'vendorsmodule/vendorpages/app-create-po';
// 		//this.workFlowtService.bredcrumbObj.next(this.workFlowtService.currentUrl);

// 		this.workFlowtService.ShowPtab = false;

// 		this.workFlowtService.alertObj.next(this.workFlowtService.ShowPtab);

// 	}
// 	getListByDetails() {
// 		//debugger;
// 		this.workFlowtService.getVendordataForPo(this.sourcePo).subscribe(data => {
// 			let getlist = data[0];
//             if (getlist.length >= 0) {
//                 this.vendorList = [];
// 				for (let i = 0; i < getlist.length; i++) {
// 					this.vendorList.push(getlist[i])
// 				}
// 			}
// 			console.log(this.vendorList)
// 		});


// 	}
// 	private priorityData() {

// 		this.priority.getPriorityList().subscribe(
// 			results => this.onprioritySuccessful(results[0]),
// 			error => this.onDataLoadFailed(error)
// 		);
// 	}
// 	private onprioritySuccessful(getPriorityList: any[]) {
// 		// alert('success');
// 		//this.alertService.stopLoadingMessage();
// 		//this.loadingIndicator = false;
// 		// this.dataSource.data = getPriorityList;
// 		this.allPriorityInfo = getPriorityList;
// 	}
// 	gotoCreatePO(data) {
// 		this.workFlowtService.repairecollection = data;
// 		this._router.navigateByUrl('/vendorsmodule/vendorpages/app-ro-setup');
// 	}
// 	private onDataLoadFailed(error: any) {
// 		// alert(error);
// 		//this.alertService.stopLoadingMessage();
// 		//this.loadingIndicator = false;

//     }
//     openHist() {
//         alert("Functionality Not Yet Developed");
//         return;
//     }
// 	onVendorselected(event) {
// 		//debugger;
// 		for (let i = 0; i < this.VendorNamecoll.length; i++) {
// 			if (event == this.VendorNamecoll[i][0].vendorName) {
// 				//alert("Action Name already Exists");
// 				this.disableSaveVenName = true;
// 				this.disableSave = true;
// 				this.disableSaveVenderName = true;
// 				this.selectedActionName = event;
// 			}

// 		}
// 		//this.workFlowtService.getvendorList(event).subscribe(
// 		//	results => this.onvendorloadsuccessfull(results[0]),
// 		//	error => this.onDataLoadFailed(error)
// 		//);
// 	}

// 	eventHandler(event) {
// 		if (event.target.value != "") {
// 			let value = event.target.value.toLowerCase();
// 			if (this.selectedActionName) {
// 				if (value == this.selectedActionName.toLowerCase()) {
// 					//alert("Action Name already Exists");
// 					this.disableSaveVenderName = true;
// 					this.disableSaveVenName = true;
// 				}
// 				else {
// 					this.disableSaveVenderName = false;
// 					this.disableSaveVenName = false;
// 				}
// 			}

// 		}
// 	}

// 	filterVendorNames(event) {

// 		this.vendorNames = [];
// 		for (let i = 0; i < this.allActions.length; i++) {
// 			let vendorName = this.allActions[i].vendorName;
// 			if (vendorName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
// 				//this.vendorNames.push(vendorName);
// 				this.VendorNamecoll.push([{
// 					"vendorId": this.allActions[i].vendorClassificationId,
// 					"vendorName": vendorName
// 				}]),
// 					this.vendorNames.push(vendorName);
// 			}
// 		}
// 	}

// 	private onDataLoadSuccessful(allWorkFlows: any[]) {

// 		this.alertService.stopLoadingMessage();
// 		this.loadingIndicator = false;
// 		//this.dataSource.data = allWorkFlows;
// 		this.allActions = allWorkFlows;
// 		this.vendorId = this.allActions[0].vendorId;
// 		//console.log(this.allActions);


// 	}
// 	private loadData() {
// 		this.alertService.startLoadingMessage();
// 		this.loadingIndicator = true;

// 		this.workFlowtService.getWorkFlows().subscribe(
// 			results => this.onDataLoadSuccessful(results[0]),
// 			error => this.onDataLoadFailed(error)
// 		);


// 	}

// 	eventvendorHandler(event) {
// 		if (event.target.value != "") {
// 			let value = event.target.value.toLowerCase();
// 			if (this.selectedVendorCode) {
// 				if (value == this.selectedVendorCode.toLowerCase()) {
// 					//alert("Action Name already Exists");
// 					this.disableSaveVenName = true;
// 					this.disableSaveVenderName = true;

// 				}
// 				else {
// 					this.disableSaveVenName = false;
// 					this.disableSaveVenderName = false;

// 				}
// 			}

// 		}


// 	}

// 	onVendorCodeselected(event) {
// 		//debugger;
// 		for (let i = 0; i < this.VendorCodesColl.length; i++) {
// 			if (event == this.VendorCodesColl[i][0].vendorCode) {

// 				this.disableSaveVenName = true;
// 				this.disableSaveVenderName = true;
// 				this.selectedVendorCode = event;
// 			}
// 		}
// 	}

// 	filterVendorCodes(event) {

// 		this.vendorCodes = [];
// 		for (let i = 0; i < this.allActions.length; i++) {
// 			let vendorCode = this.allActions[i].vendorCode;

// 			if (vendorCode.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
// 				//this.vendorCodes.push(vendorCode);
// 				this.VendorCodesColl.push([{
// 					"vendorId": this.allActions[i].vendorClassificationId,
// 					"vendorCode": vendorCode
// 				}]),
// 					this.vendorCodes.push(vendorCode);

// 			}
// 		}
// 	}

// 	private ongeneralDataLoadSuccessful(allWorkFlows: any[]) {

// 		this.alertService.stopLoadingMessage();
// 		this.loadingIndicator = false;
// 		//this.dataSource.data = allWorkFlows;
// 		this.allgeneralInfo = allWorkFlows;
// 		//this.vendorname = this.allgeneralInfo[0].vendorName;
// 		//this.vendorCode = this.allgeneralInfo[0].vendorCode;
// 		//console.log(this.allgeneralInfo);


// 	}

// 	//openContactList() {
// 	//	this.activeIndex = 1;
// 	//	this.workFlowtService.indexObj.next(this.activeIndex);
// 	//	this.route.navigateByUrl('/vendorsmodule/vendorpages/app-vendor-contacts');
// 	//	//this.saveCompleted(this.sourceVendor);


// 	//}

// 	openContactList(content, row) {


// 		this.loadContactDataData(row.vendorId);
// 		this.modal = this.modalService.open(content, { size: 'lg' });
// 		this.modal.result.then(() => {
// 			console.log('When user closes');
// 		}, () => { console.log('Backdrop click') })


// 	}

// 	openView(content, row) {

// 		//this.sourceVendor = row;
// 		this.vendorCode = row.im.vendorCode;
// 		this.vendorName = row.im.vendorName;
// 		this.vendorTypeId = row.im.vendorTypeId;
// 		this.doingBusinessAsName = row.im.doingBusinessAsName;
// 		this.parent = row.im.parent;
// 		this.address1 = row.ps.line1;
// 		this.address2 = row.ps.line2;
// 		this.address3 = row.ps.line3;
// 		this.city = row.ps.city;
// 		this.stateOrProvince = row.ps.stateOrProvince;
// 		this.postalCode = row.ps.postalCode;
// 		this.country = row.ps.country;
// 		this.vendorEmail = row.im.vendorEmail;
// 		this.vendorClassificationId = row.im.vendorClassificationId;
// 		this.vendorContractReference = row.im.vendorContractReference;
// 		this.isPreferredVendor = row.im.isPreferredVendor;
// 		this.licenseNumber = row.im.licenseNumber;
// 		this.capabilityId = row.im.capabilityId;
// 		this.vendorURL = row.im.vendorURL;
// 		this.sourcePo = row;
// 		this.creditlimit = row.im.creditlimit;
// 		this.creditTermsId = row.im.creditTermsId;
// 		this.currencyId = row.im.currencyId;
// 		this.discountLevel = row.im.discountLevel;
// 		this.is1099Required = row.im.is1099Required;
// 		this.loadContactDataData(row.vendorId);
// 		this.loadPayamentData(row.vendorId);
// 		this.loadShippingData(row.vendorId);
// 		this.modal = this.modalService.open(content, { size: 'lg' });
// 		this.modal.result.then(() => {
// 			console.log('When user closes');
// 		}, () => { console.log('Backdrop click') })


// 	}
// 	dismissModel() {
// 		this.modal.close();
// 	}
// 	private loadContactDataData(id) {
// 		this.alertService.startLoadingMessage();
// 		this.loadingIndicator = true;

// 		this.workFlowtService.getContacts(id).subscribe(
// 			results => this.onContactDataLoadSuccessful(results[0]),
// 			error => this.onDataLoadFailed(error)
// 		);

// 		this.contactcols = [
// 			//{ field: 'actionId', header: 'Action Id' },
// 			{ field: 'firstName', header: 'First Name' },
// 			{ field: 'lastName', header: 'Last  Name' },
// 			{ field: 'contactTitle', header: 'Contact Title' },
// 			{ field: 'email', header: 'Email' },
// 			{ field: 'mobilePhone', header: 'Mobile Phone' },
// 			{ field: 'fax', header: 'Fax' },
// 			{ field: 'createdBy', header: 'Created By' },
// 			{ field: 'updatedBy', header: 'Updated By' },
// 			{ field: 'updatedDate', header: 'Updated Date' },
// 			{ field: 'createdDate', header: 'Created Date' }

// 		];

// 		this.selectedContactColumns = this.contactcols;

// 	}
// 	private onContactDataLoadSuccessful(allWorkFlows: any[]) {

// 		this.alertService.stopLoadingMessage();
// 		this.loadingIndicator = false;
// 		//this.dataSource.data = allWorkFlows;
// 		this.allContacts = allWorkFlows;
// 	}

// 	private loadPayamentData(id) {
// 		this.alertService.startLoadingMessage();
// 		this.loadingIndicator = true;

// 		this.workFlowtService.getCheckPaymentobj(id).subscribe(
// 			results => this.onPaymentDataLoadSuccessful(results[0]),
// 			error => this.onDataLoadFailed(error)
// 		);



// 		this.paymentcols = [
// 			//{ field: 'actionId', header: 'Action Id' },
// 			{ field: 'siteName', header: 'Site Name' },
// 			{ field: 'address1', header: 'Address' },
// 			{ field: 'city', header: 'City' },
// 			{ field: 'stateOrProvince', header: 'State/Prov' },
// 			{ field: 'postalCode', header: 'Postal Code' },
// 			{ field: 'country', header: 'Country' }

// 		];

// 		this.selectedPaymentColumns = this.paymentcols;

// 	}

// 	private onPaymentDataLoadSuccessful(allWorkFlows: any[]) {

// 		this.alertService.stopLoadingMessage();
// 		this.loadingIndicator = false;
// 		//this.dataSource.data = allWorkFlows;
// 		this.allpayments = allWorkFlows;


// 	}

// 	private loadShippingData(id) {
// 		this.alertService.startLoadingMessage();
// 		this.loadingIndicator = true;

// 		this.workFlowtService.getVendorShipAddressGet(id).subscribe(
// 			results => this.onShippingDataLoadSuccessful(results[0]),
// 			error => this.onDataLoadFailed(error)
// 		);

// 		this.shippingCol = [

// 			{ field: 'siteName', header: 'Site Name' },
// 			{ field: 'address1', header: 'Address1' },
// 			{ field: 'address2', header: 'Address2' },
// 			{ field: 'address3', header: 'Address3' },
// 			{ field: 'city', header: 'City' },
// 			{ field: 'stateOrProvince', header: 'State/Prov' },
// 			{ field: 'postalCode', header: 'Postal Code' },
// 			{ field: 'country', header: 'Country' }

// 		];

// 		this.selectedShippingColumns = this.shippingCol;

// 	}

// 	private onShippingDataLoadSuccessful(allWorkFlows: any[]) {

// 		this.alertService.stopLoadingMessage();
// 		this.loadingIndicator = false;
// 		//this.dataSource.data = allWorkFlows;
// 		this.allShippings = allWorkFlows;


// 	}

// 	openGeneralInfo() {
// 		this.showGeneralData = true;
// 		this.showcontactdata = false;
// 		this.showfinancialdata = false;
// 	}
// 	openFinancialInfo() {
// 		this.showGeneralData = false;
// 		this.showcontactdata = false;
// 		this.showfinancialdata = true;
// 	}

// }
