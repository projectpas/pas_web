import { Component, OnInit } from '@angular/core';
import { VendorService } from '../../../../services/vendor.service';
import { MenuItem } from 'primeng/api';
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
import { AuthService } from '../../../../services/auth.service';
import { PurchaseOrderService } from '../../../../services/purchase-order.service';

@Component({
    selector: 'app-po-settings',
    templateUrl: './po-settings.component.html',
    styleUrls: ['./po-settings.component.css']
})
export class PoSettingsComponent implements OnInit {

    breadcrumbs: MenuItem[];
    home: any;
	isSpinnerVisible: boolean = true;
    posettingModel: any = {};
    enableHeaderSaveBtn: boolean = false;
    errorMessages: any;

    constructor(private vendoreService: VendorService,
        private alertService: AlertService, private authService: AuthService,
        private purchaseOrderService:PurchaseOrderService) {
        this.vendoreService.ShowPtab = false;
    }


    ngOnInit() {
        this.breadcrumbs = [
            { label: 'Purchase Order' },
            { label: 'PO Setting' },
        ];

        this.posettingModel.IsResale = false;
        this.posettingModel.IsDeferredReceiver = false;
		this.posettingModel.IsEnforceApproval = false;
        this.isSpinnerVisible = false;
        this.getPurchaseOrderMasterData(this.currentUserMasterCompanyId);
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    get currentUserMasterCompanyId(): number {
        return this.authService.currentUser
            ? this.authService.currentUser.masterCompanyId
            : null;
    }

    enableHeaderSave() {
            this.enableHeaderSaveBtn = true;
    }

    getPurchaseOrderMasterData(currentUserMasterCompanyId) {
        this.purchaseOrderService.getPurchaseOrderSettingMasterData(currentUserMasterCompanyId);
        this.purchaseOrderService.getPurchaseOrderSettingMasterData(currentUserMasterCompanyId).subscribe(res => {
            if (res) {
                this.posettingModel.PurchaseOrderSettingId = res.purchaseOrderSettingId;
                this.posettingModel.IsResale = res.isResale;
                this.posettingModel.IsDeferredReceiver = res.isDeferredReceiver;
                this.posettingModel.IsEnforceApproval = res.isEnforceApproval;
            }
        }, err => {
            this.isSpinnerVisible = false;
            const errorLog = err;
            //this.errorMessageHandler(errorLog);
        });
    }

    savePurchaseOrderSetting() {
		this.isSpinnerVisible = true;

        var headerInfoObj = {
            PurchaseOrderSettingId : this.posettingModel.PurchaseOrderSettingId,
			IsResale: this.posettingModel.IsResale,
			IsDeferredReceiver: this.posettingModel.IsDeferredReceiver,
			IsEnforceApproval: this.posettingModel.IsEnforceApproval,
			masterCompanyId: this.currentUserMasterCompanyId,
            createdDate: this.posettingModel.createdDate,
            updatedDate: this.posettingModel.updatedDate,
            createdBy: this.posettingModel.createdBy ? this.posettingModel.createdBy : this.userName,
            updatedBy: this.posettingModel.updatedBy ? this.posettingModel.updatedBy : this.userName
        }

        this.purchaseOrderService.savePurchaseOrderSettingMasterDate({ ...headerInfoObj }).subscribe(saveddata => {
            this.isSpinnerVisible = false;
            this.enableHeaderSaveBtn = false;
            this.alertService.showMessage(
                'Success',
                `Updated PO Setting Successfully`,
                MessageSeverity.success
            );
        }, err => {
            this.isSpinnerVisible = false;
            //const errorLog = err;
            //this.errorMessageHandler(errorLog);
            //this.toggle_po_header = true;
            this.enableHeaderSaveBtn = true;
        });
    }

    //errorMessageHandler(log) {
    //    const errorLog = log;
    //    var msg = '';
    //    if (errorLog.message) {
    //        if (errorLog.error && errorLog.error.errors.length > 0) {
    //            for (let i = 0; i < errorLog.error.errors.length; i++) {
    //                msg = msg + errorLog.error.errors[i].message + '<br/>'
    //            }
    //        }
    //        this.alertService.showMessage(
    //            errorLog.error.message,
    //            msg,
    //            MessageSeverity.error
    //        );
    //    }
    //    else {
    //        this.alertService.showMessage(
    //            'Error',
    //            log.error,
    //            MessageSeverity.error
    //        );
    //    }
    //}
    closeErrorMessage() {}
}
