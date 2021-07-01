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
        private purchaseOrderService: PurchaseOrderService) {
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
        this.posettingModel.effectivedate = new Date();

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
        // this.purchaseOrderService.getPurchaseOrderSettingMasterData(currentUserMasterCompanyId);
        this.purchaseOrderService.getPurchaseOrderSettingMasterData(currentUserMasterCompanyId).subscribe(res => {
            if (res) {
                this.posettingModel.PurchaseOrderSettingId = res.purchaseOrderSettingId;
                this.posettingModel.IsResale = res.isResale;
                this.posettingModel.IsDeferredReceiver = res.isDeferredReceiver;
                this.posettingModel.IsEnforceApproval = res.isEnforceApproval;
                if (res.effectivedate) {
                    this.posettingModel.effectivedate = new Date(res.effectivedate);
                }
            }
        }, err => {
            this.isSpinnerVisible = false;
            //this.errorMessageHandler(errorLog);
        });
    }

    savePurchaseOrderSetting() {
        if (this.posettingModel.IsEnforceApproval) {
            if (this.posettingModel.effectivedate == null || this.posettingModel.effectivedate == '') {
                this.alertService.showMessage(
                    'Error',
                    `Effectivedate Date Require!`,
                    MessageSeverity.error
                );
                return false;
            }
        }
        this.isSpinnerVisible = true;
        var headerInfoObj = {
            PurchaseOrderSettingId: this.posettingModel.PurchaseOrderSettingId,
            IsResale: this.posettingModel.IsResale,
            IsDeferredReceiver: this.posettingModel.IsDeferredReceiver,
            IsEnforceApproval: this.posettingModel.IsEnforceApproval,
            masterCompanyId: this.currentUserMasterCompanyId,
            createdDate: this.posettingModel.createdDate,
            updatedDate: this.posettingModel.updatedDate,
            createdBy: this.posettingModel.createdBy ? this.posettingModel.createdBy : this.userName,
            updatedBy: this.posettingModel.updatedBy ? this.posettingModel.updatedBy : this.userName,
            effectivedate: this.posettingModel.effectivedate,
        }

        if (headerInfoObj.effectivedate) {
            let d = new Date(headerInfoObj.effectivedate);
            headerInfoObj.effectivedate = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;;
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
    closeErrorMessage() { }
}
