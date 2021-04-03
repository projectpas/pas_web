import { Component, Input, EventEmitter, Output, ViewChild, ElementRef, OnInit, SimpleChanges } from '@angular/core';
import { fadeInOut } from '../../../services/animations';
import { Router } from '@angular/router';
import { CustomerService } from '../../../services/customer.service';
import { AuthService } from '../../../services/auth.service';
import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { CommonService } from '../../../services/common.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PermissionConstants, ModuleConstants } from 'src/app/generic/ModuleConstant';

@Component({
	selector: 'app-customer-warnings',
	templateUrl: './customer-warnings.component.html',
	styleUrls: ['./customer-warnings.component.scss'],
	animations: [fadeInOut]
})
export class CustomerWarningsComponent implements OnInit {
	@Input() savedGeneralInformationData;
	@Input() editGeneralInformationData;
	@Input() editMode;
	@Input() selectedCustomerTab: string = '';
	@Output() tab = new EventEmitter();
    types : any[] = [];
	warningMessages: any[] = [];
	isAllow: boolean = false;
	isRestrict: boolean = false;
	isWarning: boolean = false;
	isCheckAllow: boolean = true;
	isCheckWarning: boolean = true;
	isCheckRestrict: boolean = true;
	disableSave: boolean = true;
	id: any;
	customerWarningId: any;
	customerWarningsId: any;
	customerCode: any;
	customerName: any;
	customerWarningData: any = [];
	warningsUpdateBoolean: boolean = false;
	nextOrPreviousTab: string;
	modal: NgbModalRef;
	isSpinnerVisible: Boolean = false;
	@ViewChild("tabRedirectConfirmationModal",{static:false}) public tabRedirectConfirmationModal: ElementRef;
	@ViewChild("WarningsForm",{static:false}) formdata;
	stopmulticlicks: boolean;
	isWarningAdd:boolean=true;
	isWarningUpdate:boolean=true;
	isWarningDelete:boolean=true;	
	isSalesPersonInfoAdd:boolean=true;
	isSalesPersonInfoEdit:boolean=true;
	isDocumentAdd:boolean=true;
	isDocumentEdit:boolean=true;
	
	constructor(public customerService: CustomerService, private authService: AuthService, private alertService: AlertService, private router: Router, private commonService: CommonService, 
		private modalService: NgbModal
		) {
			this.isWarningAdd=this.authService.checkPermission([ModuleConstants.Customers_Warnings+'.'+PermissionConstants.Add])
			this.isWarningUpdate=this.authService.checkPermission([ModuleConstants.Customers_Warnings+'.'+PermissionConstants.Update])  
			this.isWarningDelete=this.authService.checkPermission([ModuleConstants.Customers_Warnings+'.'+PermissionConstants.Update]) 
			//Next
			this.isDocumentAdd=this.authService.checkPermission([ModuleConstants.Customers_Documents+'.'+PermissionConstants.Add])
            this.isDocumentEdit=this.authService.checkPermission([ModuleConstants.Customers_Documents+'.'+PermissionConstants.Update])
            //Privious
			this.isSalesPersonInfoAdd=this.authService.checkPermission([ModuleConstants.Customers_SalesPersonInformation+'.'+PermissionConstants.Add])
            this.isSalesPersonInfoEdit=this.authService.checkPermission([ModuleConstants.Customers_SalesPersonInformation+'.'+PermissionConstants.Update])        
		}

	ngOnInit() {
	}

	ngOnChanges(changes: SimpleChanges) {
        for (let property in changes) {            
            if (property == 'selectedCustomerTab') {
                if (changes[property].currentValue != {} && changes.selectedCustomerTab.currentValue == "Warnings") {
					this.getTypesOfWarnings();
                }
            }
        }
    }

	getTypesOfWarnings(){
		this.isSpinnerVisible = true;
		//this.commonService.smartDropDownList('CustomerWarningType','CustomerWarningTypeId', 'Name').subscribe(data => {
		this.commonService.autoSuggestionSmartDropDownList('CustomerWarningType', 'CustomerWarningTypeId', 'Name','',true,200,'',this.currentUserMasterCompanyId).subscribe(data => {
			this.types = data;			
			if (!this.editMode) {
				this.warningMessages = this.types.map(x => {
					return {
						sourceModule: x.label,
						sourseModuleId: x.value,
						allow: true,
						warning: false,
						restrict: false,
						warningMessage: '',
						restrictMessage: '',
						customerWarningTypeId: x.value
					}
				})				
				this.allowAll(true);
			}
			else{
				this.initWarningData();
			}	
			this.isSpinnerVisible = false;
		}, error => {this.isSpinnerVisible = false;})
	}

	onRestrictClick($event, i){
		if($event.target.checked == true){
			this.warningMessages[i].warning = false;
			this.warningMessages[i].allow = false;			
		}else {
			this.warningMessages[i].allow = true;
		}

		if($event.target.checked == false){
			this.isRestrict = false;
		}

		this.isCheckRestrict = true;
		this.warningMessages.forEach((warning) => {
			if(warning.restrict == false){
				this.isCheckRestrict = false;
			} 
		})

		this.isRestrict = this.isCheckRestrict == true ? true : false;
	}

	onAllowClick($event){		
		if($event.target.checked == false){
			this.isAllow = false;
		}
		this.isCheckAllow = true;
		this.warningMessages.forEach((warning) => {
			if(warning.allow == false){
				this.isCheckAllow = false;
			} 
		})

		this.isAllow = this.isCheckAllow == true ? true : false;
	}

	onWarningClick($event){		
		if($event.target.checked == false){
			this.isWarning = false;
		}
		this.isCheckWarning = true;
		this.warningMessages.forEach((warning) => {
			if(warning.warning == false){
				this.isCheckWarning = false;
			} 
		})

		this.isWarning = this.isCheckWarning == true ? true : false;
	}

	initWarningData(){
		this.isCheckAllow = true;
		this.isCheckWarning = true;
		this.isCheckRestrict = true;
		this.isSpinnerVisible = true;
		if (this.editMode) {		

			this.disableSave = true;
			this.id = this.editGeneralInformationData.customerId
			this.savedGeneralInformationData = this.editGeneralInformationData;
			this.customerCode = this.editGeneralInformationData.customerCode;
			this.customerName = this.editGeneralInformationData.name;

			this.customerService.getCustomerWarningsById(this.id).subscribe(res => {
				if(res[0])
				{
				this.customerWarningData = res[0];
				const warningsData = res[0].warningsData;
		
				if (warningsData.length > 0) {
					this.warningsUpdateBoolean = true;
					this.warningMessages = warningsData;
					this.isAllow = this.customerWarningData.isAllow;
					this.isRestrict = this.customerWarningData.isRestrict;
					this.isWarning = this.customerWarningData.isWarning;

					this.warningMessages.forEach((warning) => {
						this.types.forEach((type) => {
							if(warning.customerWarningTypeId == type.value){
								warning.sourceModule = type.label;
							} 
						})
						if(warning.allow == false){
							this.isCheckAllow = false;
						} 

						if(warning.warning == false){
							this.isCheckWarning = false;
						} 

						if(warning.restrict == false){
							this.isCheckRestrict = false;
						} 
					})

					this.isAllow = this.customerWarningData.isAllow == false && this.isCheckAllow == true ? true : this.customerWarningData.isAllow;
					this.isWarning = this.customerWarningData.isWarning == false && this.isCheckWarning == true ? true : this.customerWarningData.isWarning;
					this.isRestrict = this.customerWarningData.isRestrict == false && this.isCheckRestrict == true ? true : this.customerWarningData.isRestrict;

					this.types.forEach((type) => {
						const index = this.warningMessages.findIndex((warning) => type.label == warning.sourceModule);
						if(index === -1) {
						  this.warningMessages.push({
							sourceModule: type.label,
							sourseModuleId: type.value,
							allow: false,
							warning: false,
							restrict: false,
							warningMessage: '',
							restrictMessage: '',
							customerId: this.id,
							customerWarningTypeId: type.value
						});
					  }
					  })
					 

				} else {
					this.warningMessages = this.types.map(x => {
						return {
							sourceModule: x.label,
							sourseModuleId: x.value,
							allow: false,
							warning: false,
							restrict: false,
							warningMessage: '',
							restrictMessage: '',
							customerWarningTypeId: x.value
						}
					})
				}
				}
				else {
					this.warningMessages = this.types.map(x => {
						return {
							sourceModule: x.label,
							sourseModuleId: x.value,
							allow: false,
							warning: false,
							restrict: false,
							warningMessage: '',
							restrictMessage: '',
							customerWarningTypeId: x.value
						}
					})
					this.allowAll(true);
				}
				this.isSpinnerVisible = false;
			}, error => {this.isSpinnerVisible = false;})

		} 
		else {
			this.id = this.savedGeneralInformationData.customerId;
			this.customerCode = this.savedGeneralInformationData.customerCode;
			this.customerName = this.savedGeneralInformationData.name;
			this.warningMessages = this.types.map(x => {
				return {
					sourceModule: x.label,
					sourseModuleId: x.value,
					allow: true,
					warning: false,
					restrict: false,
					warningMessage: '',
					restrictMessage: '',
					customerWarningTypeId : x.value
				}
			})
			this.allowAll(true);
			this.isSpinnerVisible = false;
		}
		this.isSpinnerVisible = false;
	}

	get userName(): string {
		return this.authService.currentUser ? this.authService.currentUser.userName : "";
	}

	get currentUserMasterCompanyId(): number {
		return this.authService.currentUser
		  ? this.authService.currentUser.masterCompanyId
		  : null;
    }

	async getCustomerWarningsData() {
		this.isSpinnerVisible = true;
		await this.customerService.getCustomerWarningsById(this.id).subscribe(res => {
			this.customerWarningData = res;
			this.isSpinnerVisible = false;
		}, error => {this.isSpinnerVisible = false;})
	}

	allowAll(value) {
		if (value) {
			this.warningMessages = this.warningMessages.map(x => {

				return {
					...x,
					allow: true,
				}
			});
			this.isAllow = value;
		} else {
			this.warningMessages = this.warningMessages.map(x => {

				return {
					...x,
					allow: false,
				}
			});
			this.isAllow = value;
		}
	}

	warningAll(value) {
		if (value) {
			this.warningMessages = this.warningMessages.map(x => {
				return {
					...x,
					warning: true
				}
			})
			this.isWarning = value;
		} else {
			this.warningMessages = this.warningMessages.map(x => {
				return {
					...x,
					warning: false
				}
			})
			this.isWarning = value;
		}
	}

	restrictAll(value) {
		if (value) {
			this.warningMessages = this.warningMessages.map(x => {
				return {
					...x,
					restrict: true,
					warning: false,
					allow: false,
				}
			})
			this.isRestrict = value;
			this.isWarning = false;
			this.isAllow =false;

		} else {
			this.warningMessages = this.warningMessages.map(x => {
				return {
					...x,
					restrict: false,
					warning: false,
					allow: false,
				}
			})
			this.isRestrict = value;
			this.isWarning = false;
			this.isAllow =false;
		}
	}

	saveWarnings() {
		this.isSpinnerVisible = true;
		const data = this.warningMessages.map(x => {
			return {
				...x,				
				masterCompanyId: this.currentUserMasterCompanyId,
				createdBy: this.userName,
				updatedBy: this.userName,
				createdDate: new Date(),
				updatedDate: new Date(),
				isActive: true,
				customerWarningId: x.customerWarningId,
				sourceModule: x.customerWarningTypeId,
				customerWarningTypeId : x.customerWarningTypeId
			}
		})
		const warningsData = {
			warningsData: [...data],
			customerWarningsId: this.customerWarningsId == null || this.customerWarningsId == undefined ? 0 : this.customerWarningsId,
			isAllow: this.isAllow,
			isRestrict: this.isRestrict,
			isWarning: this.isWarning,
			customerId: this.id,
			updatedBy: this.userName,
		}

			this.customerService.saveCustomerwarnings(warningsData).subscribe(res => {
				this.customerWarningData = res;
				this.warningMessages = res.warningsData;				
				this.customerWarningsId = res.customerWarningsId;
				if (!this.warningsUpdateBoolean) {
					this.alertService.showMessage(
						'Success',
						`Saved Warning Messages Successfully `,
						MessageSeverity.success
					);
				}
				else{
					this.alertService.showMessage(
			 			'Success',
						`Updated Warning Messages Successfully `,
						MessageSeverity.success
					);
				}
				this.initWarningData();
				this.warningsUpdateBoolean = true;
				this.isSpinnerVisible = false;
				this.disableSave = true;				
				//this.formdata.reset();
			}, error => {this.isSpinnerVisible = false;})
	}

	enableSave() {
		this.disableSave = false;
	}

	backClick() {
        this.tab.emit('Sales');
	}

	nextClick(nextOrPrevious) {
		this.nextOrPreviousTab = nextOrPrevious;
		if (!this.disableSave == true) {
			let content = this.tabRedirectConfirmationModal;
			this.modal = this.modalService.open(content, { size: 'sm' });
		}
		else {
			this.stopmulticlicks = true;
			this.formdata.reset();
			if (this.nextOrPreviousTab == 'Next') {
			  this.tab.emit('Documents');
			}
			if (this.nextOrPreviousTab == 'Previous') {
			  this.tab.emit('Sales');
			}
			setTimeout(() => {
				this.stopmulticlicks = false;
			}, 500)
		}
	  }
	
    redirectToTab(){
		if(!this.disableSave)
        {
        this.saveWarnings();
        }    
		this.dismissModel();
		this.formdata.reset();
        if(this.nextOrPreviousTab == "Next"){
            this.tab.emit('Documents');
        }
        if(this.nextOrPreviousTab == "Previous"){
            this.tab.emit('Sales');
        }
	}
	
    dismissModel() {
		this.modal.close();
		this.formdata.reset();
		if(this.nextOrPreviousTab == "Next"){
            this.tab.emit('Documents');
        }
        if(this.nextOrPreviousTab == "Previous"){
            this.tab.emit('Sales');
        }
	}
	
	private saveFailedHelper(error: any) {
        this.isSpinnerVisible = false;
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
        setTimeout(() => this.alertService.stopLoadingMessage(), 5000);        
    }
}
