import { Component, OnInit} from '@angular/core';
import { fadeInOut } from '../../../services/animations';
import { AuthService } from '../../../services/auth.service';
import { MessageSeverity, AlertService } from '../../../services/alert.service';
import { VendorService } from '../../../services/vendor.service';
import { Router, ActivatedRoute } from '@angular/router';
import { editValueAssignByCondition } from '../../../generic/autocomplete';
declare var $ : any;

@Component({
	selector: 'app-vendor-memo',
	templateUrl: './vendor-memo.component.html',
	styleUrls: ['./vendor-memo.component.scss'],
	animations: [fadeInOut]
})
/** VendorMemo component*/
export class VendorMemoComponent implements OnInit {
	isSpinnerVisible: Boolean = false;
	allVendorPOList: any[];
	allVendorROList: any[];
	allVendorPOROList: any[];
	activeIndex: any = 10;
	isvendorEditMode: any;
	local: any;
	private isEditMode: boolean = false;
	private isSaving: boolean;
	totalRecords: number = 0;
	pageIndex: number = 0;
	pageSize: number = 10;
	selectedOnly: boolean = false;
    targetData: any;
	totalPages: number = 0;
	vendorId:any;
	memoCols = [
		{ field: 'module', header: 'Module' },
		{ field: 'orderNumber', header: 'ID' },
	];
	selectedColumns = this.memoCols;
	memoPopupContent: any;

	/** VendorMemo ctor */
	constructor(public vendorService: VendorService,private activeRoute: ActivatedRoute, private router: Router, private alertService: AlertService, private authService: AuthService, ) {
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
				if(this.vendorId > 0)
				{
					this.vendorService.getVendorCodeandNameByVendorId(this.vendorId).subscribe(
						res => {
								this.local = res[0];
						},err => {
							const errorLog = err;
							this.saveFailedHelper(errorLog);
					});
				}				
            }
        }
		if (this.vendorService.listCollection !== undefined) {
			this.vendorService.isEditMode = true;
		}
		if (this.vendorService.listCollection && this.vendorService.isEditMode == true) {
			this.local = this.vendorService.listCollection;
		}
	}

	ngOnInit(): void {
		this.vendorService.currentEditModeStatus.subscribe(message => {
			this.isvendorEditMode = message;
		});
		this.vendorService.currentUrl = '/vendorsmodule/vendorpages/app-vendor-memo';
		this.vendorService.bredcrumbObj.next(this.vendorService.currentUrl);

		this.vendorService.ShowPtab = true;
		this.vendorService.alertObj.next(this.vendorService.ShowPtab);

		if (this.local) {
			this.VendorPOMemolist();
			this.VendorROMemolist();
		}
	}

	onClickMemo(rowData) {
		this.memoPopupContent = {...rowData};
	}
	closeDeleteModal() {
		$("#downloadConfirmation").modal("hide");
	}
	onClickPopupSave() {
		for (var i = 0; i < this.allVendorPOList.length; i++) {
			if (this.allVendorPOList[i].orderNumberId == this.memoPopupContent.orderNumberId){
				this.allVendorPOList[i].notes = this.memoPopupContent.notes;
			}
		}
	}

	get userName(): string {
		return this.authService.currentUser ? this.authService.currentUser.userName : "";
	}

	async  VendorPOMemolist() {
		this.isSpinnerVisible = true;
		this.vendorId =this.local.vendorId ? this.local.vendorId :this.activeRoute.snapshot.params['id'];
		await this.vendorService.getVendorPOMemolist(this.vendorId).subscribe(
			res => {
				this.allVendorPOList = res;
				this.allVendorPOROList = res;
				this.isSpinnerVisible = false;
			},
			err => {
				this.isSpinnerVisible = false;
				this.onDataLoadFailed(err);
			});
	}

	async  VendorROMemolist() {
		this.isSpinnerVisible = true;
		this.vendorId =this.local.vendorId ? this.local.vendorId :this.activeRoute.snapshot.params['id'];
		await this.vendorService.getVendorROMemolist(this.vendorId).subscribe(
			res => {
				this.allVendorROList = res;

				for (let value of this.allVendorROList) {
					this.allVendorPOROList.push(value);
				}
				this.isSpinnerVisible = false;
			},
			err => {
				this.isSpinnerVisible = false;
				this.onDataLoadFailed(err);
			});
	}

	updateMemoTxext(row, e) {
		this.isEditMode = true;
		this.isSaving = true;
		var name = this.userName;
		this.isSpinnerVisible = true;
		this.vendorService.updateVendorPOROmemolist(row.orderNumberId, row.module, row.notes, name).subscribe(
			res => {
				this.VendorPOMemolist();
				this.VendorROMemolist();
				this.alertService.showMessage(
					'Success',
					`Saved Memo Successfully `,
					MessageSeverity.success
				);
				this.isSpinnerVisible = false;
			}, error => this.saveFailedHelper(error)
		)
	}

	NextClick() {
		this.vendorService.contactCollection = this.local;
		this.activeIndex = 11;
		this.vendorService.changeofTab(this.activeIndex);
	}

	backClick() {
		this.activeIndex = 9;
		this.vendorService.changeofTab(this.activeIndex);
	}

	private onDataLoadFailed(error: any) {
		this.alertService.stopLoadingMessage();
		this.alertService.showStickyMessage(error, null, MessageSeverity.error);
		this.isSpinnerVisible = false;
	}

	private saveFailedHelper(error: any) {
		this.isSaving = false;
		this.alertService.stopLoadingMessage();
		this.alertService.showStickyMessage(error, null, MessageSeverity.error);
		this.isSpinnerVisible = false;
	}

	getVendorName() {
		if (this.local !== undefined) {
			return editValueAssignByCondition('vendorName', this.local.vendorName) === undefined ? '' : editValueAssignByCondition('vendorName', this.local.vendorName);
		} else {
			return '';
		}
	}

	getPageCount(totalNoofRecords, pageSize) {
		return Math.ceil(totalNoofRecords / pageSize)
	}
}   