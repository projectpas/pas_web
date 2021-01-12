import { Component, OnInit, AfterViewInit, ViewChild, Input, EventEmitter, Output, ɵConsole } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AuditHistory } from '../../../models/audithistory.model';
import { MatDialog } from '@angular/material';
import { FormBuilder } from '@angular/forms';
import { NgbModalRef, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../services/auth.service';
import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { VendorService } from '../../../services/vendor.service';
import { fadeInOut } from '../../../services/animations';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { PurchaseOrderService } from '../../../services/purchase-order.service';
import { VendorCapabilitiesService } from '../../../services/vendorcapabilities.service';
import { CommonService } from '../../../services/common.service';
import * as $ from 'jquery';
import { formatNumberAsGlobalSettingsModule } from '../../../generic/autocomplete';
import { MenuItem } from 'primeng/api';
import { ReceivingService } from '../../../services/receiving/receiving.service';
import { RepairOrderService } from '../../../services/repair-order.service';


@Component({
  selector: 'app-all-view',
  templateUrl: './all-view.component.html',
  styleUrls: ['./all-view.component.scss'],
  animations: [fadeInOut],
  providers: [DatePipe]
})
export class AllViewComponent implements OnInit {

  poHeaderAdd: any = {};
  roHeaderAdd: any = {};
  headerManagementStructureWithName: any = {};
  vendorCapesInfo: any = [];
  headerManagementStructure: any = {};
  poPartsList: any = [];
  isSpinnerVisible: boolean = false;
  loadingIndicator: boolean;
  poApprovaltaskId: number = 0;
  ApprovedstatusId: number = 0;
  internalApproversList: any = [];
  approvalProcessList: any = [];
  tabindex: number = 0;
  OrderTypes: string;
  isPoViewMode: boolean = false;  
  capvendorId: number;
  selectedPurchaseOrderId: any;
  moduleName:any="PurchaseOrder";
  isViewMode: boolean = true;
  vendorIdByParams: boolean = false;
  @Input() OrderId;
  @Input() OrderType;
  @Input() PovendorId;
  @Input() vendorId: number;

  approvalProcessHeader = [
    {
      header: 'Action',
      field: 'actionStatus'
    },
    {
      header: 'Send Date',
      field: 'sentDate'
    }, {
      header: 'Status',
      field: 'status'
    }, {
      header: 'Memo',
      field: 'memo'
    }, {
      header: 'Approved By',
      field: 'approvedBy'
    }, {
      header: 'Approved Date',
      field: 'approvedDate'
    }, {
      header: 'Rejected By',
      field: 'rejectedBy'
    }, {
      header: 'Rejected Date',
      field: 'rejectedDate'
    }, {
      header: 'PN',
      field: 'partNumber'
    }, {
      header: 'PN Desc',
      field: 'partDescription'
    }, {
      header: 'ALT/Equiv PN',
      field: 'altEquiPartNumber'
    }, {
      header: 'ALT/Equiv PN Desc',
      field: 'altEquiPartDescription'
    }, {
      header: 'Item Type',
      field: 'itemType'
    }, {
      header: 'Stock Type',
      field: 'stockType'
    }, {
      header: 'Qty',
      field: 'qty'
    }, {
      header: 'Unit Cost',
      field: 'unitCost'
    }, {
      header: 'Ext Cost',
      field: 'extCost'
    }
  ];

  constructor(private commonService: CommonService,
    private activeModal: NgbActiveModal,
    private alertService: AlertService,
    private modalService: NgbModal,
    private purchaseOrderService: PurchaseOrderService,
    private vendorCapesService: VendorCapabilitiesService,
    private repairOrderService: RepairOrderService,
  ) { }

  ngOnInit() {
    this.selectedPurchaseOrderId = this.OrderId;
    let OrderId = this.OrderId;
    this.OrderTypes = this.OrderType;
    let PovendorId = this.PovendorId;      
    if (this.OrderTypes == 'Purchase Order') {
      this.loadingIndicator = true;      
      this.getPOViewById(OrderId);
      this.getPOPartsViewById(OrderId);
      this.getApproversListById(OrderId);
      this.getApprovalProcessListById(OrderId);
      this.tabindex = 0;
      if (PovendorId) {
        setTimeout(() => {
          this.isPoViewMode = true;
          this.vendorId = PovendorId;
          this.capvendorId = PovendorId;
          this.warnings(PovendorId);
        }, 1200);
      }
    } else if (this.OrderTypes == 'Repair Order') {
      this.getROViewById(OrderId);
      this.getROPartsViewById(OrderId);
      this.getApproversListById(OrderId);
      this.getApprovalProcessListById(OrderId);
    }
  }

  

  getPOViewById(poId) {
    this.purchaseOrderService.getPOViewById(poId).subscribe(res => {
      this.poHeaderAdd = {
        ...res,
        shippingCost: res.shippingCost ? formatNumberAsGlobalSettingsModule(res.shippingCost, 2) : '0.00',
        handlingCost: res.handlingCost ? formatNumberAsGlobalSettingsModule(res.handlingCost, 2) : '0.00',
      };
      this.getVendorCapesByID(this.poHeaderAdd.vendorId);          
    }, err => {
      this.isSpinnerVisible = false;
    });
  }

  getPOPartsViewById(poId) {
    this.poPartsList = [];
    this.purchaseOrderService.getPOPartsViewById(poId).subscribe(res => {
      res.map(x => {
        const partList = {
          ...x,
          unitCost: x.unitCost ? formatNumberAsGlobalSettingsModule(x.unitCost, 2) : '0.00',
          vendorListPrice: x.vendorListPrice ? formatNumberAsGlobalSettingsModule(x.vendorListPrice, 2) : '0.00',
          discountPercent: x.discountPercent ? formatNumberAsGlobalSettingsModule(x.discountPercent, 2) : '0.00',
          discountPerUnit: x.discountPerUnit ? formatNumberAsGlobalSettingsModule(x.discountPerUnit, 2) : '0.00',
          discountAmount: x.discountAmount ? formatNumberAsGlobalSettingsModule(x.discountAmount, 2) : '0.00',
          extendedCost: x.extendedCost ? formatNumberAsGlobalSettingsModule(x.extendedCost, 2) : '0.00',
          foreignExchangeRate: x.foreignExchangeRate ? formatNumberAsGlobalSettingsModule(x.foreignExchangeRate, 5) : '0.00',
          purchaseOrderSplitParts: this.getPurchaseOrderSplit(x)
        }
        //this.getManagementStructureCodesParent(partList);
        this.poPartsList.push(partList);
      });
    }, err => {
      this.isSpinnerVisible = false;
    });
  }

  getVendorCapesByID(vendorId) {
    this.vendorCapesInfo = [];
    this.vendorCapesService.getVendorCapesById(vendorId).subscribe(res => {
      this.vendorCapesInfo = res;
    }, err => {
      this.isSpinnerVisible = false;
      const errorLog = err;
      this.errorMessageHandler(errorLog);
    });
  }

  getROViewById(roId) {
    this.repairOrderService.getROViewById(roId).subscribe(res => {
      this.roHeaderAdd = {
        ...res,
        shippingCost: res.shippingCost ? formatNumberAsGlobalSettingsModule(res.shippingCost, 2) : '0.00',
        handlingCost: res.handlingCost ? formatNumberAsGlobalSettingsModule(res.handlingCost, 2) : '0.00',
      };
      this.getVendorCapesByID(this.roHeaderAdd.vendorId);
      //this.getManagementStructureCodes(res.managementStructureId);
    }, err => {
    }
    );
  }

  getROPartsViewById(roId) {
    this.poPartsList = [];
    this.repairOrderService.getROPartsViewById(roId).subscribe(res => {
      if (res) {
        res.map(x => {
          const partList = {
            ...x,
            unitCost: x.unitCost ? formatNumberAsGlobalSettingsModule(x.unitCost, 2) : '0.00',
            discountPercent: x.discountPercent ? formatNumberAsGlobalSettingsModule(x.discountPercent, 2) : '0.00',
            discountPerUnit: x.discountPerUnit ? formatNumberAsGlobalSettingsModule(x.discountPerUnit, 2) : '0.00',
            discountAmount: x.discountAmount ? formatNumberAsGlobalSettingsModule(x.discountAmount, 2) : '0.00',
            extendedCost: x.extendedCost ? formatNumberAsGlobalSettingsModule(x.extendedCost, 2) : '0.00',
            foreignExchangeRate: x.foreignExchangeRate ? formatNumberAsGlobalSettingsModule(x.foreignExchangeRate, 5) : '0.00',
            repairOrderSplitParts: this.getRepairOrderSplit(x)
          }
          //this.getManagementStructureCodesParent(partList);
          this.poPartsList.push(partList);
        });
      }
    }, err => {
    });
  }

  getRepairOrderSplit(partList) {
    if (partList.repairOrderSplitParts) {
      return partList.repairOrderSplitParts.map(y => {
        const splitpart = {
          ...y,
        }
        //this.getManagementStructureCodesChild(splitpart);
        return splitpart;
      })
    }
  }

  WarningsList: any;
  WarningListId: any;
  getWarningsList(): void {
    this.commonService.smartDropDownList('VendorWarningList', 'VendorWarningListId ', 'Name').subscribe(res => {
      res.forEach(element => {
        if (element.label == 'Create Purchase Order') {
          this.WarningListId = element.value;
          return;
        }
      });
    }, err => {
      this.isSpinnerVisible = false;
      const errorLog = err;
      this.errorMessageHandler(errorLog);
    });
  }

  warningMessage: any;
  warningID: any = 0;
  warnings(Id) {
    if (Id) {
      this.commonService.vendorWarnings(Id, this.WarningListId).subscribe((res: any) => {
        if (res) {
          this.warningMessage = res.warningMessage;
          this.warningID = res.vendorWarningId;
        }
      }, err => {
        this.isSpinnerVisible = false;
        const errorLog = err;
        this.errorMessageHandler(errorLog);
      });
    }
  }  

  getPurchaseOrderSplit(partList) {
    if (partList.purchaseOrderSplitParts) {
      return partList.purchaseOrderSplitParts.map(y => {
        const splitpart = {
          ...y,
        }
        //this.getManagementStructureCodesChild(splitpart);
        return splitpart;
      })
    }
  }

  getApproversListById(poId) {
    this.isSpinnerVisible = true;
    if (this.poApprovaltaskId == 0) {
      this.commonService.smartDropDownList('ApprovalTask', 'ApprovalTaskId', 'Name').subscribe(response => {
        if (response) {
          response.forEach(x => {
            if (x.label.toUpperCase() == "PO APPROVAL") {
              this.poApprovaltaskId = x.value;
            }
          });
          this.getApproversByTask(poId)
        }
      }, err => {
        this.isSpinnerVisible = false;
        const errorLog = err;
        this.errorMessageHandler(errorLog);
      });
    }
    else {
      this.getApproversByTask(poId)
    }

  }

  getApproversByTask(poId) {
    this.isSpinnerVisible = true;
    this.purchaseOrderService.approverslistbyTaskId(this.poApprovaltaskId, poId).subscribe(res => {
      this.internalApproversList = res;      
      this.isSpinnerVisible = false;
    },err => {
        this.isSpinnerVisible = false;
      });
  }

  getApprovalProcessListById(poId) {
    this.isSpinnerVisible = true;
    this.purchaseOrderService.getPOApprovalListById(poId).subscribe(res => {
      this.isSpinnerVisible = false;
      const arrayLen = res.length;
      let count = 0;
      this.approvalProcessList = res.map(x => {
        if (x.actionId == this.ApprovedstatusId) {
          count++;
        }
        return {
          ...x,
          sentDate: x.sentDate ? new Date(x.sentDate) : null,
          approvedDate: x.approvedDate ? new Date(x.approvedDate) : null,
          unitCost: x.unitCost ? formatNumberAsGlobalSettingsModule(x.unitCost, 2) : '0.00',
          extCost: x.extCost ? formatNumberAsGlobalSettingsModule(x.extCost, 2) : '0.00'
        }
      });
      if (this.approvalProcessList && this.approvalProcessList.length > 0) {
        var approvalProcessListWithChild: any[] = [];
        this.approvalProcessList = this.approvalProcessList.forEach(element => {
          if (element.isParent) {
            approvalProcessListWithChild.push(element);
            this.approvalProcessList.filter(x => x.parentId == element.purchaseOrderPartId).forEach(
              child => {
                approvalProcessListWithChild.push(child);
              }
            );
          }
        });
        this.approvalProcessList = approvalProcessListWithChild;
        console.log(this.approvalProcessList)
      }      
    }, err => {
      this.isSpinnerVisible = false;    
    });
  }

  getTotalDiscAmount(array) {
    let totalDiscAmount = 0;
    if (array) {
      array.map(x => {
        x.tempDiscAmt = x.discountAmount ? parseFloat(x.discountAmount.toString().replace(/\,/g, '')) : 0;
        totalDiscAmount += x.tempDiscAmt;
      })
      totalDiscAmount = totalDiscAmount ? formatNumberAsGlobalSettingsModule(totalDiscAmount, 2) : '0.00';
    }
    return totalDiscAmount;
  }

  getTotalExtCost(array) {
    let totalExtCost = 0;
    if (array) {
      array.map(x => {
        x.tempExtCost = x.extendedCost ? parseFloat(x.extendedCost.toString().replace(/\,/g, '')) : 0;
        totalExtCost += x.tempExtCost;
      })
      totalExtCost = totalExtCost ? formatNumberAsGlobalSettingsModule(totalExtCost, 2) : '0.00';
    }
    return totalExtCost;
  }

  dismissModel() {
    this.activeModal.close();
  }

  errorMessageHandler(log) {
    this.alertService.showMessage(
      'Error',
      log.error,
      MessageSeverity.error
    );
  }

  formatePrice(value) {
    if (value) {
      return formatNumberAsGlobalSettingsModule(value, 2);
    }
    return '0.00';
  }

}
