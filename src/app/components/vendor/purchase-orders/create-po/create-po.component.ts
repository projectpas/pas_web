import { Component, OnInit } from '@angular/core';
import { VendorService } from '../../../../services/vendor.service';
import { dashCaseToCamelCase } from '@angular/compiler/src/util';
import { Router } from '@angular/router';
import { PriorityService } from '../../../../services/priority.service';
import { AlertService } from '../../../../services/alert.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MatTableDataSource } from '@angular/material';
import $ from "jquery";
//import { PoApprovalComponent } from '../po-approval/po-approval.component';

@Component({
    selector: 'app-create-po',
    templateUrl: './create-po.component.html',
    styleUrls: ['./create-po.component.scss']
})
/** create-po component*/
export class CreatePoComponent implements OnInit {

	isCreatePO: boolean = true;
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
	vendorList: any[]=[];
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
	description: any = "";
	vendorParentName: any = "";
	vendorPhoneNo:any="";
	vendorClassificationName: any = "";
	vendorCapabilityName: any = "";
	billingInfoList: any[];
    selectedBillingColumns: any[];
    billingCol: any[];
    warningInfoList: any[];
    selectedWarningColumns: any[];
    warninggCol: any[];
    allVendorPOROList: any[];
    memoCols:any[];
    vendorDocumentsData: any=[];
	vendorDocumentsColumns :any[];
	dataSource: MatTableDataSource<any>;

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
	gotoCreatePO(rowData) {
		//this.workFlowtService.purchasepartcollection = [];
		//this.workFlowtService.isEditMode = true;
		//this.workFlowtService.vendorForPoCollection=data;
		//this._router.navigateByUrl('/vendorsmodule/vendorpages/app-purchase-setup');
		console.log(rowData);		
        const { vendorId } = rowData;
        this._router.navigateByUrl(`vendorsmodule/vendorpages/app-purchase-setup/vendor/${vendorId}`);
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
        this.vendorCode = row.vendorCode;
        this.vendorName = row.vendorName;
        // this.vendorTypeId = row.t.vendorTypeId;
        // this.description=row.description;
        // this.doingBusinessAsName = row.t.doingBusinessAsName;
        // this.parent = row.t.parent;
        // this.vendorParentName=row.t.vendorParentName;
    //     if (row.currency) {
    //         this.currencyId = row.currency.symbol;
    //     }
    //     else {
    //         this.currencyId = row.currencyId;
    //     }

    //     if (row.creditterms) {
    //         this.creditTermsId = row.creditterms.name;
    //     }
    //     else {
    //         this.creditTermsId = row.creditTermsId;
    //     }
       
    //     this.address1 = row.address1;
    //     this.address2 = row.address2;
    //    // this.address3 = row.address3;
    //     this.city = row.city;
    //     this.stateOrProvince = row.stateOrProvince;
    //     this.postalCode = row.postalCode;
    //     this.country = row.country;
    //     this.vendorPhoneNo=row.t.vendorPhone;
    //     this.vendorEmail = row.vendorEmail;
    //     //this.vendorClassificationId = row.t.vendorClassificationId;
    //     this.vendorClassificationName = row.classificationName;
    //     this.vendorContractReference = row.t.vendorContractReference;
    //     this.isPreferredVendor = row.t.isPreferredVendor;
    //     this.licenseNumber = row.t.licenseNumber;
    //     this.capabilityId = row.capabilityId;
    //     this.vendorCapabilityName=row.vendorCapabilityName;
    //     this.vendorURL = row.t.vendorURL;
    //     this.creditlimit = row.t.creditLimit;        
    //     this.discountLevel = row.discountLevel;
    //     this.is1099Required = row.t.is1099Required;
        this.loadContactDataData(row.vendorId);
        this.loadPayamentData(row.vendorId);
        this.loadShippingData(row.vendorId);
        this.loadBillingData(row.vendorId);
        this.loadWarningsData(row.vendorId);
        this.loadMemosData(row.vendorId);
        this.loadVendorDocumentsData(row.vendorId);
        this.modal = this.modalService.open(content, { size: 'lg' });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }
	
	dismissModel() {
		this.modal.close();
	}
	private loadContactDataData(vendorId) {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.workFlowtService.getContacts(vendorId).subscribe(
            results => this.onContactDataLoadSuccessful(results[0]),
            error => this.onDataLoadFailed(error)
        );

        this.contactcols = [
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

	private loadPayamentData(vendorId) {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.workFlowtService.getCheckPaymentobj(vendorId).subscribe(
            results => this.onPaymentDataLoadSuccessful(results[0]),
            error => this.onDataLoadFailed(error)
        );
        this.paymentcols = [
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

	private loadShippingData(vendorId) {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.workFlowtService.getVendorShipAddressGet(vendorId).subscribe(
            results => this.onShippingDataLoadSuccessful(results[0]),
            error => this.onDataLoadFailed(error)
        );

        this.shippingCol = [
            { field: 'siteName', header: 'Site Name' },
            { field: 'address1', header: 'Address1' },
            { field: 'address2', header: 'Address2' },
            //{ field: 'address3', header: 'Address3' },
            { field: 'city', header: 'City' },
            { field: 'stateOrProvince', header: 'State/Prov' },
            { field: 'postalCode', header: 'Postal Code' },
            { field: 'country', header: 'Country' }
        ];

        this.selectedShippingColumns = this.shippingCol;
	}
	
	private loadBillingData(vendorId) {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.workFlowtService.getVendorBillAddressGet(vendorId).subscribe(
            results => this.onBillingDataLoadSuccessful(results[0]),
            error => this.onDataLoadFailed(error)
        );
      
        this.billingCol = [
            { field: 'siteName', header: 'Site Name' },
            { field: 'address1', header: 'Address1' },
            { field: 'address2', header: 'Address2' },           
            { field: 'city', header: 'City' },
            { field: 'stateOrProvince', header: 'State/Prov' },
            { field: 'postalCode', header: 'Postal Code' },
            { field: 'country', header: 'Country' }
        ];

        this.selectedBillingColumns = this.billingCol;
	}

	private loadWarningsData(vendorId) {
        this.workFlowtService.getVendorWarnings(vendorId).subscribe(
            data => {
             this.warningInfoList = data[0].map(x => {
            return {
                ...x,
                sourceModule: `${x.t.sourceModule == null ?'': x.t.sourceModule}`, 
                warningMessage: `${x.t.warningMessage == null ?'': x.t.warningMessage}`,    
                restrictMessage: `${x.t.restrictMessage == null ?'': x.t.restrictMessage}`   
                };
            });              
            });

            this.warninggCol = [
                { field: 'sourceModule', header: 'Module' },
                { field: 'warningMessage', header: 'Warning Message' },
                { field: 'restrictMessage', header: 'Restrict Message' }          
              
            ];    
            this.selectedWarningColumns = this.warninggCol;
	}
	
	private loadMemosData(vendorId) {
		this.workFlowtService.getVendorPOMemolist(vendorId).subscribe(
			  res => {             
				  this.allVendorPOROList = res;              
		  });
  
		  this.workFlowtService.getVendorROMemolist(vendorId).subscribe(
			  res => {        
				  for (let value of res) {
					  this.allVendorPOROList.push(value);
				  }                    
		  });
  
	  this.memoCols = [
		  { field: 'module', header: 'Module' },			
		  { field: 'orderNumber', header: 'Id' },
		  { field: 'notes', header: 'Memo text' }  
		  ];    
	 }

	 private loadVendorDocumentsData(vendorId){
		this.workFlowtService.getDocumentList(vendorId).subscribe(res => {
			this.vendorDocumentsData = res;			
		});
	
		this.vendorDocumentsColumns = [
			{ field: 'docName', header: 'Name' },
			{ field: 'docDescription', header: 'Description' },
			//{ field: 'documents', header: 'Documents' },
			{ field: 'docMemo', header: 'Memo' }
		];
	   }
	
	private onBillingDataLoadSuccessful(allWorkFlows: any[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.dataSource.data = allWorkFlows;
        this.billingInfoList = allWorkFlows;      
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

    onCreatePO() {
        this._router.navigateByUrl('/vendorsmodule/vendorpages/app-purchase-setup');
	}

	expandAllVendorDetailsModel()
    {
        $('#step1').collapse('show');
        $('#step2').collapse('show');
        $('#step3').collapse('show');
        $('#step4').collapse('show');
        $('#step5').collapse('show');
        $('#step6').collapse('show');
        $('#step7').collapse('show');

        $('#step9').collapse('show');
        $('#step10').collapse('show');
    }
    closeAllVendorDetailsModel()
    {
        $('#step1').collapse('hide');
        $('#step2').collapse('hide');
        $('#step3').collapse('hide');
        $('#step4').collapse('hide');
        $('#step5').collapse('hide');
        $('#step6').collapse('hide');
        $('#step7').collapse('hide');

        $('#step9').collapse('hide');
        $('#step10').collapse('hide');
    }

}
*/