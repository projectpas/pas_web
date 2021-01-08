import { Component, ViewChild, OnInit, ElementRef, Input } from '@angular/core';
import {  MatTableDataSource,} from '@angular/material';
 
import { NgbModal,NgbModalRef, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { fadeInOut } from '../../../services/animations';
import { AuthService } from '../../../services/auth.service';
import { MessageSeverity, AlertService } from '../../../services/alert.service';
import { VendorService } from '../../../services/vendor.service';
import { Router, ActivatedRoute } from '@angular/router';
import { editValueAssignByCondition } from '../../../generic/autocomplete';
import { CommonService } from '../../../services/common.service';

@Component({
    selector: 'app-vendor-warnings',
    templateUrl: './vendor-warnings.component.html',
    styleUrls: ['./vendor-warnings.component.scss'],
    animations: [fadeInOut]
})
/** VendorWarnings component*/
export class VendorWarningsComponent implements OnInit {
    isOnlyReas: boolean = false;
    @Input() isViewMode: boolean = false;
    @Input() vendorId: number;
    isReas: boolean = true;
    isReClose: boolean = true;
    isReadOpens: boolean = true;
    isOnlyClose: boolean = true;
    isopen: boolean = true;
    isOnlyReads: boolean = true;
    isReads: boolean = true;
    isOnlyRead: boolean = true;
    isRead: boolean = true;
    disableUpdate:boolean=true;
    disableSave:boolean=true;
    allwarningData: any;
    localcollection: any[];
    checkbox: boolean;
    dataSource: MatTableDataSource<{}>;
    local: any = {};
    isReadOnly: boolean = true;
    isOnly: boolean = true;
    viewName: string = "Create";
    sourceWarning: any = {};
    sourePo: any = {};
    soureRMA: any = {};
    sourceRo: any = {};
    sourceEdi: any = {};
    sourceAero: any = {};
    sourceNet: any = {};
    activeIndex: number = 9;
    isSaving: boolean;
    isDeleteMode: boolean;
    sourcePOQuote: any = {};
    sourceROQuote: any = {};
    sourcePR: any = {};
    isvendorEditMode: any;
    isPOQuoteReadOnly: boolean = true;
    isPOQuoteOnlyReas: boolean = true;
    isROQuoteReadOnly: boolean = true;
    isROQuoteOnlyReas: boolean = true;
    isPROnly: boolean = true;
    isPRReadOnlyReas: boolean = true;
     types: any[] = [];
    warningMessages: any = [];
    warningsUpdateBoolean: boolean = false;
    isAllow = false;
	isRestrict = false;
    isWarning = false;
    vendorWarningData: any = [];
    nextOrPreviousTab: string;
    modal: NgbModalRef;
    enableUpdate: boolean = false;
    isSpinnerVisible: Boolean = false;
    isCheckAllow: boolean = true;
    isCheckWarning: boolean = true;
    stopmulticlicks: boolean= false;
    @ViewChild("tabRedirectConfirmationModal",{static:false}) public tabRedirectConfirmationModal: ElementRef;

    constructor(private authService: AuthService,private activeRoute: ActivatedRoute, private router: Router, private vendorService: VendorService, private alertService: AlertService, private commonService: CommonService, private modalService: NgbModal) {
        if(window.localStorage.getItem('vendorService')){
            var obj = JSON.parse(window.localStorage.getItem('vendorService'));
            if(obj.listCollection && this.activeRoute.snapshot.params['id']){
                this.vendorService.checkVendorEditmode(true);
                this.vendorService.isEditMode = true;
                this.vendorService.listCollection = obj.listCollection;
                this.vendorService.indexObj.next(obj.activeIndex);
                this.vendorService.enableExternal = true;
                this.vendorId = this.activeRoute.snapshot.params['id'];
                this.vendorService.vendorId = this.vendorId;
                this.vendorService.listCollection.vendorId = this.vendorId; 
                this.vendorService.getVendorCodeandNameByVendorId(this.vendorId).subscribe(
                    res => {
                            this.local = res[0];
                    },err => {
                        const errorLog = err;
                        this.saveFailedHelper(errorLog);
                    });
            }
        }
        if (this.vendorService.listCollection !== undefined) {
            this.vendorService.isEditMode = true;
        }
        if (this.vendorService.shippingCollection) {
            this.local = this.vendorService.shippingCollection;
            this.vendorService.ShowPtab = true;
        }
        this.dataSource = new MatTableDataSource();                
    }

    ngOnInit() {
        if(this.vendorId){
            this.local['vendorId'] = this.vendorId
        }
        this.vendorId = this.vendorId ? this.vendorId :this.activeRoute.snapshot.params['id'];
        this.getTypesOfWarnings();
        this.vendorService.currentEditModeStatus.subscribe(message => {
            this.isvendorEditMode = message;
        });
        this.vendorService.currentUrl = '/vendorsmodule/vendorpages/app-vendor-warnings';
        this.vendorService.bredcrumbObj.next(this.vendorService.currentUrl);
        if (this.vendorService.listCollection && this.vendorService.isEditMode == true) {
            this.viewName = "Edit";
            this.local = this.vendorService.listCollection;
            //this.enableUpdate = true;
        }
    }

    async getTypesOfWarnings(){
	    await	this.commonService.smartDropDownList('VendorWarningList','vendorWarningListId', 'Name').subscribe(data => {
            this.types = data;
            this.allowAll(true)
            this.loadData();
		}, error => this.saveFailedHelper(error))
    }

    private loadData() {
        if (this.isvendorEditMode) {
            this.disableUpdate=true;
            this.disableSave = true;
            this.vendorId = this.local.vendorId ? this.local.vendorId :this.activeRoute.snapshot.params['id'];
            this.isSpinnerVisible = true;
			this.vendorService.getVendorWarnings(this.vendorId).subscribe(res => {
                this.localcollection = res[0][0];
                this.vendorWarningData = res[0][0];
				const warningsData = res[0][0].warningsData;
				if (warningsData.length > 0) {
                    this.enableUpdate = true;
					this.warningsUpdateBoolean = true;
					this.warningMessages = warningsData;
					this.isAllow = this.vendorWarningData.isAllow;
					this.isRestrict = this.vendorWarningData.isRestrict;
                    this.isWarning = this.vendorWarningData.isWarning;

                    this.warningMessages.forEach((warning) => {
						this.types.forEach((type) => {
							if(warning.vendorWarningListId == type.value){
								warning.sourceModule = type.label;
							} 
						})
                    })
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
							vendorId: this.local.vendorId ? this.local.vendorId :this.activeRoute.snapshot.params['id'],
							vendorWarningListId: type.value
						});
					  }
					  })

				} else {
                    this.enableUpdate = false;
					this.warningMessages = this.types.map(x => {
						return {
                            sourceModule: x.label,
                            sourceModuleId: x.value,
							allow: true,
							warning: false,
							restrict: false,
							warningMessage: '',
                            restrictMessage: '',
                            vendorId: this.local.vendorId ? this.local.vendorId :this.activeRoute.snapshot.params['id'],
                            vendorWarningListId: x.value
						}
					})
                }
                this.isSpinnerVisible = false;
			}, error => this.saveFailedHelper(error))

		} else {
           this.vendorId =this.local.vendorId ? this.local.vendorId :this.activeRoute.snapshot.params['id'];
            this.vendorService.getVendorWarnings(this.vendorId).subscribe(res => {
                this.localcollection = res[0][0];
                this.vendorWarningData = res[0][0];
				const warningsData = res[0][0].warningsData;
				if (warningsData.length > 0) {
                    //this.enableUpdate = true;
					this.warningsUpdateBoolean = true;
					this.warningMessages = warningsData;
					this.isAllow = this.vendorWarningData.isAllow;
					this.isRestrict = this.vendorWarningData.isRestrict;
                    this.isWarning = this.vendorWarningData.isWarning;
                    this.warningMessages.forEach((warning) => {
						this.types.forEach((type) => {
							if(warning.vendorWarningListId == type.value){
								warning.sourceModule = type.label;
							} 
						})
                    })
                    this.types.forEach((type) => {
						const index = this.warningMessages.findIndex((warning) => type.label == warning.sourceModule);
						if(index === -1) {
						  this.warningMessages.push({
							sourceModule: type.label,
							sourseModuleId: type.value,
							allow:   true,
							warning: false,
							restrict: false,
							warningMessage: '',
							restrictMessage: '',
							vendorId: this.local.vendorId ? this.local.vendorId :this.activeRoute.snapshot.params['id'],
							vendorWarningListId: type.value
						});
					  }
					  })

				} else {
					this.warningMessages = this.types.map(x => {
						return {
                            sourceModule: x.label,
                            sourceModuleId: x.value,
							allow: true,
							warning: false,
							restrict: false,
							warningMessage: '',
                            restrictMessage: '',
                            vendorId: this.local.vendorId ? this.local.vendorId :this.activeRoute.snapshot.params['id'],
                            vendorWarningListId: x.value
						}
					})
                }
			}, error => this.saveFailedHelper(error))
        }     
    }

    private saveFailedHelper(error: any) {
		this.isSaving = false;
		this.alertService.showStickyMessage("Save Error", "The below errors occured while saving your changes:", MessageSeverity.error, error);
		this.alertService.showStickyMessage(error, null, MessageSeverity.error);
		this.isSpinnerVisible = false;
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
                    warning: false,
                    warningMessage : ''
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
                    restrict: true                   
				}
			})
			this.isRestrict = value;

		} else {
			this.warningMessages = this.warningMessages.map(x => {
				return {
					...x,
                    restrict: false,
                    restrictMessage : ''
				}
			})
			this.isRestrict = value;
		}
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

	onWarningClick($event, i){		
		if($event.target.checked == false){            
            this.isWarning = false;
            this.warningMessages[i].warningMessage = '';
        }
		this.isCheckWarning = true;
		this.warningMessages.forEach((warning) => {
			if(warning.warning == false){
				this.isCheckWarning = false;
			} 
		})

		this.isWarning = this.isCheckWarning == true ? true : false;
    }
    
    onRestrictClick($event, i){
		if($event.target.checked == true){
			this.warningMessages[i].warning = false;
            this.warningMessages[i].allow = false;            
		}else {
            this.warningMessages[i].allow = true;
            this.warningMessages[i].restrictMessage = '';
		}	
	}
    
    saveDetails() {
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
                vendorWarningId: x.vendorWarningId,
                sourceModule: x.vendorWarningListId
			}
		})
		const warningsData = {
			warningsData: [...data],
            isAllow: this.isAllow,
            masterCompanyId: this.currentUserMasterCompanyId,
			isRestrict: this.isRestrict,
			isWarning: this.isWarning,
			vendorId: this.local.vendorId ? this.local.vendorId :this.activeRoute.snapshot.params['id'],
            updatedBy: this.userName,
            createdBy: this.userName
		}

		if (!this.warningsUpdateBoolean) {
			this.vendorService.saveVendorwarnings(warningsData).subscribe(res => {
                this.alertService.showMessage(
                    'Success',
                    `Saved  Warning Messages Sucessfully `,
                    //`${this.warningsUpdateBoolean ? 'Updated' : 'Saved'}  Warning Messages Sucessfully `,
                    MessageSeverity.success
                );         
                this.isSpinnerVisible = false;      
                this.warningsUpdateBoolean = true;
                this.loadData();
            }, error => this.saveFailedHelper(error))
            this.enableUpdate = true;
		} else {
			this.vendorService.updateVendorWarnings(warningsData).subscribe(res => {
                this.alertService.showMessage(
                    'Success',
                    `Updated Warning Messages Sucessfully `,
                    MessageSeverity.success
                );
                this.isSpinnerVisible = false; 
            }, error => this.saveFailedHelper(error))
        }
        this.disableUpdate=true;
        this.disableSave = false;
    }

    enableUpdateButton(){
        this.disableUpdate=false;
        this.disableSave = false;
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }    

    get currentUserMasterCompanyId(): number {
		return this.authService.currentUser
		  ? this.authService.currentUser.masterCompanyId
		  : null;
    }

    nextClick() {
        this.activeIndex = 10;
        this.vendorService.changeofTab(this.activeIndex);
        this.alertService.showMessage(
            'Success',
            `${this.isvendorEditMode ? 'Updated' : 'Saved'}  Warning Messages Sucessfully `,
            MessageSeverity.success
        );
    }

    previousOrNextTab(previousOrNext){
        this.nextOrPreviousTab = previousOrNext;
        let content = this.tabRedirectConfirmationModal;
        this.modal = this.modalService.open(content, { size: "sm" });
    }

    redirectToTab(){
        if(!this.disableUpdate){
            this.saveDetails();
        }
        setTimeout(() => {
			this.stopmulticlicks = false;
        }, 500)
        
        this.dismissModel();

		if(this.nextOrPreviousTab == "Previous"){
            this.activeIndex = 8;
            this.vendorService.changeofTab(this.activeIndex);
        } else {
            this.activeIndex = 10;
        this.vendorService.changeofTab(this.activeIndex);
        }
    }

    dismissModel() {
        this.modal.close();
        if(this.nextOrPreviousTab == "Previous"){
            this.activeIndex = 8;
            this.vendorService.changeofTab(this.activeIndex);
        } else {
            this.activeIndex = 10;
        this.vendorService.changeofTab(this.activeIndex);
        }
    }

    getVendorName() {
        if (this.local !== undefined) {
            return editValueAssignByCondition('vendorName', this.local.vendorName) === undefined ? '' : editValueAssignByCondition('vendorName', this.local.vendorName);
        } else {
            return '';
        }
    }
}