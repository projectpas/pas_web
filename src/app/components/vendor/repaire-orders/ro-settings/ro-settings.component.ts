import { Component, OnInit } from '@angular/core';
import { VendorService } from '../../../../services/vendor.service';
import { MenuItem } from 'primeng/api';
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
import { AuthService } from '../../../../services/auth.service';
import { RepairOrderService } from '../../../../services/repair-order.service';


@Component({
  selector: 'app-ro-settings',
  templateUrl: './ro-settings.component.html',
  styleUrls: ['./ro-settings.component.css']
})
export class RoSettingsComponent implements OnInit {

  breadcrumbs: MenuItem[];
  home: any;
  isSpinnerVisible: boolean = false;
  rosettingModel: any = {};
  enableHeaderSaveBtn: boolean = false;
  errorMessages: any;

  constructor(
    private vendoreService: VendorService,
    private alertService: AlertService,
    private authService: AuthService,
    private repairOrderService: RepairOrderService
  ) {
    this.vendoreService.ShowPtab = false;
  }

  ngOnInit() {
    this.breadcrumbs = [
      { label: 'Repaire Order' },
      { label: 'RO Setting' },
    ];
    this.getPurchaseOrderMasterData();
  }

  get userName(): string {
    return this.authService.currentUser ? this.authService.currentUser.userName : "";
  }

  get currentUserMasterCompanyId(): number {
    return this.authService.currentUser
      ? this.authService.currentUser.masterCompanyId
      : null;
  }

  ROSettingId: number = 0;

  getPurchaseOrderMasterData() {    
    this.repairOrderService.getRepairOrderSettingMasterData().subscribe(res => {
      if (res) {        
        this.rosettingModel.RepairOrderSettingId = res.repairOrderSettingId;
        this.ROSettingId = res.repairOrderSettingId;
        this.rosettingModel.IsResale = res.isResale;
        this.rosettingModel.IsDeferredReceiver = res.isDeferredReceiver;
        this.rosettingModel.IsEnforceApproval = res.isEnforceApproval;        
      }
    }, err => {
      this.isSpinnerVisible = false;
      const errorLog = err;
    });
  }

  saveRepaireOrderSetting() {
    this.isSpinnerVisible = true;
    var headerInfoObj = {
      RepairOrderSettingId: this.ROSettingId,
      IsResale: this.rosettingModel.IsResale,
      IsDeferredReceiver: this.rosettingModel.IsDeferredReceiver,
      IsEnforceApproval: this.rosettingModel.IsEnforceApproval,
      masterCompanyId: this.currentUserMasterCompanyId,
      createdDate: this.rosettingModel.createdDate,
      updatedDate: this.rosettingModel.updatedDate,
      createdBy: this.rosettingModel.createdBy ? this.rosettingModel.createdBy : this.userName,
      updatedBy: this.rosettingModel.updatedBy ? this.rosettingModel.updatedBy : this.userName
    }    
    this.repairOrderService.saveRepaireOrderSettings(headerInfoObj).subscribe(saveddata => {
      this.isSpinnerVisible = false;
      this.enableHeaderSaveBtn = false;
      if (this.ROSettingId) {
        this.alertService.showMessage(
          'Success',
          'Updated RO Setting Successfully',
          MessageSeverity.success
        );
      } else {
        this.alertService.showMessage(
          'Success',
          'Created RO Setting Successfully',
          MessageSeverity.success
        );
      }
      this.getPurchaseOrderMasterData();
    }, err => {
      this.isSpinnerVisible = false;
      //const errorLog = err;
      //this.errorMessageHandler(errorLog);
      //this.toggle_po_header = true;
      this.enableHeaderSaveBtn = true;
    });
  }


  enableHeaderSave() {
    this.enableHeaderSaveBtn = true;
  }

  closeErrorMessage() {}
}
