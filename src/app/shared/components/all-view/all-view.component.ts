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
declare var $: any;
import { formatNumberAsGlobalSettingsModule, editValueAssignByCondition } from '../../../generic/autocomplete';
import { MenuItem } from 'primeng/api';
import { ReceivingService } from '../../../services/receiving/receiving.service';
import { RepairOrderService } from '../../../services/repair-order.service';
import { PurchaseOrder, PurchaseOrderPart, StockLine, StockLineDraft, DropDownData, TimeLife, ReceiveParts, TimeLifeDraft } from '../../../components/receiving/po-ro/receivng-po/PurchaseOrder.model';
import { ManagementStructure } from '../../../components/receiving/po-ro/receivng-po/managementstructure.model';


@Component({
  selector: 'app-all-view',
  templateUrl: './all-view.component.html',
  styleUrls: ['./all-view.component.scss'],
  animations: [fadeInOut],
  providers: [DatePipe],

})
export class AllViewComponent implements OnInit {

  poHeaderAdd: any = {};
  roHeaderAdd: any = {};
  headerManagementStructureWithName: any = {};
  vendorCapesInfo: any = [];
  headerManagementStructure: any = {};
  poPartsList: any = [];
  roPartsList: any = [];
  isSpinnerVisible: boolean = false;
  loadingIndicator: boolean;
  poApprovaltaskId: number = 0;
  roApprovaltaskId: number = 0;
  ApprovedstatusId: number = 0;
  internalApproversList: any = [];
  rointernalApproversList: any = [];

  approvalProcessList: any = [];
  tabindex: number = 0;
  OrderTypes: string;
  isPoViewMode: boolean = false;
  capvendorId: number;
  selectedPurchaseOrderId: any;
  selectedRepairOrderId: any;
  moduleName: any = "PurchaseOrder";
  romoduleName: any = "RepairOrder";

  isViewMode: boolean = true;
  vendorIdByParams: number;
  @Input() OrderId: any;
  @Input() OrderType: any;
  @Input() PovendorId: any;
  @Input() vendorId: number;
  @Input() isReceivingpo: boolean;
  roTotalCost: number;

  addressType: any = 'PO';
  showAddresstab: boolean = false;
  id: number;

  //showPartListtab: boolean = false;
  showVendorCaptab: boolean = false;
  purchaseOrderData: PurchaseOrder;

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
  poApproverStatusList: any;
  roApproverStatusList: any;

  constructor(private commonService: CommonService,
    private activeModal: NgbActiveModal,
    private alertService: AlertService,
    private modalService: NgbModal,
    private purchaseOrderService: PurchaseOrderService,
    private vendorCapesService: VendorCapabilitiesService,
    private repairOrderService: RepairOrderService,
    private receivingService: ReceivingService,
    private authService: AuthService,
    private route: Router,
  ) { }

  ngOnInit() {
    this.selectedPurchaseOrderId = this.OrderId;
    this.selectedRepairOrderId = this.OrderId;
    let OrderId = this.OrderId;
    this.OrderTypes = this.OrderType;
    this.id = this.OrderId;
    let PovendorId = this.vendorId;
    this.vendorIdByParams = this.PovendorId;
    let isReceivingpo = this.isReceivingpo;
    this.isPoViewMode = true;
    this.vendorId = this.PovendorId;
    this.capvendorId = this.PovendorId;
    if (this.OrderTypes == 'Purchase Order') {
      this.loadingIndicator = true;
      this.getPOViewById(OrderId);
      this.getPOPartsViewById(OrderId);
      this.getApproversListById(OrderId);
      this.getApprovalProcessListById(OrderId);            
      this.tabindex = 0;     
      if(isReceivingpo == true)
      this.viewPurchaseOrder(OrderId);
    } else if (this.OrderTypes == 'Repair Order') {
      this.getROViewById(OrderId);
      this.getROPartsViewById(OrderId);
      this.getRoApproversListById(OrderId);
      this.getRoApprovalProcessListById(OrderId);
      this.tabindex = 0;
    }
  }

  get employeeId() {
    return this.authService.currentUser ? this.authService.currentUser.employeeId : 0;
  }

  onChangeTabView(event) {

    if (event.index == 0) {
      //this.showPartListtab = true;
      //this.getPOPartsViewById(this.OrderId);      
    }
    if (event.index == 1) {
    }
    if (event.index == 2) {
      //this.getApproversListById(this.OrderId);
    }
    if (event.index == 3) {
      //	this.getApproversListById(this.OrderId);
      //  this.getApprovalProcessListById(this.OrderId);
      //	this.enableApproverSaveBtn = false;     
      this.showVendorCaptab = true;
      const id = editValueAssignByCondition('vendorId', this.vendorId);
    }
    if (event.index == 4) {
      //this.showVendorCaptab = true;
      //const id = editValueAssignByCondition('vendorId', this.headerInfo.vendorId);
      this.showAddresstab = true;
      this.id = this.OrderId;
    }
    if (event.index == 5) {
      //this.showDocumenttab = true;
    }
    if (event.index == 6) {
      //this.showComunicationtab = true;
    }

  }


  getPOViewById(poId) {
    this.purchaseOrderService.getPOViewById(poId).subscribe(res => {
      this.poHeaderAdd = {
        ...res,
        shippingCost: res.shippingCost ? formatNumberAsGlobalSettingsModule(res.shippingCost, 2) : '0.00',
        handlingCost: res.handlingCost ? formatNumberAsGlobalSettingsModule(res.handlingCost, 2) : '0.00',
      };
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
        this.poPartsList.push(partList);
      });
    }, err => {
      this.isSpinnerVisible = false;
    });
  }

  viewPurchaseOrder(purchaseOrderId: number): void {
    this.receivingService.getPurchaseOrderDataForViewById(purchaseOrderId).subscribe(
      results => {
        this.purchaseOrderData = results[0];
        this.purchaseOrderData.openDate = new Date(results[0].openDate).toLocaleDateString();
        this.purchaseOrderData.needByDate = new Date(results[0].needByDate);
        this.purchaseOrderData.dateApproved = new Date(results[0].dateApproved).toLocaleDateString();
        var allParentParts = this.purchaseOrderData.purchaseOderPart.filter(x => x.isParent == true);

        for (let parent of allParentParts) {
          parent.currentSLIndex = 0;
          parent.currentTLIndex = 0;
          parent.currentSERIndex = 0;
          parent.isDisabledTLboxes = false;
          parent.quantityRejected = 0;
          var splitParts = this.purchaseOrderData.purchaseOderPart.filter(x => x.parentId == parent.purchaseOrderPartRecordId);
          if (splitParts.length > 0) {
            parent.hasChildren = true;
            parent.quantityOrdered = 0;
            for (let childPart of splitParts) {
              parent.stockLineCount += childPart.stockLineCount;
              parent.quantityRejected += childPart.quantityRejected != null ? childPart.quantityRejected : 0;
              childPart.managementStructureId = parent.managementStructureId;
              childPart.managementStructureName = parent.managementStructureName;
              parent.quantityOrdered += childPart.quantityOrdered;
            }
          }
          else {
            parent.hasChildren = false;
          }
        }

        for (let part of this.purchaseOrderData.purchaseOderPart) {
          part.toggleIcon = false;
          part.currentSLIndex = 0;
          part.currentTLIndex = 0;
          part.currentSERIndex = 0;
          part.currentSLIndexDraft = 0;
          part.currentTLIndexDraft = 0;
          part.currentSERIndexDraft = 0;
          part.visible = false;
          part.showStockLineGrid = false;
          part.showStockLineGridDraft = false;
          part.isEnabled = false;
          part.conditionId = 0;

          if (part.stockLine != null) {
            for (var SL of part.stockLine) {
              SL.isEnabled = false;
            }
          }
        }
        this.purchaseOrderData.dateRequested = new Date(); //new Date(this.purchaseOrderData.dateRequested);
        this.purchaseOrderData.dateApprovied = new Date(this.purchaseOrderData.dateApprovied);
        this.purchaseOrderData.needByDate = new Date(); //new Date(this.purchaseOrderData.needByDate);

      },
      error => {
        //this.alertService.showMessage(this.pageTitle, "Something went wrong while loading the Purchase Order detail", MessageSeverity.error);
        //return this.route.navigate(['/receivingmodule/receivingpages/app-purchase-order']);
      }
    );
  }

  getROViewById(roId) {
    this.repairOrderService.getROViewById(roId).subscribe(res => {
      this.roHeaderAdd = {
        ...res,
        shippingCost: res.shippingCost ? formatNumberAsGlobalSettingsModule(res.shippingCost, 2) : '0.00',
        handlingCost: res.handlingCost ? formatNumberAsGlobalSettingsModule(res.handlingCost, 2) : '0.00',
      };
    }, err => { });
  }

  getROPartsViewById(roId) {
    this.roPartsList = [];
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
          this.roPartsList.push(partList);
        });
      }
    }, err => { });
  }

  getRepairOrderSplit(partList) {
    if (partList.roPartSplits) {
      return partList.roPartSplits.map(y => {
        const splitpart = {
          ...y,
        }
        //this.getManagementStructureCodesChild(splitpart);
        return splitpart;
      })
    }
  }

  getPurchaseOrderSplit(partList) {
    if (partList.purchaseOrderSplitParts) {
      return partList.purchaseOrderSplitParts.map(y => {
        const splitpart = {
          ...y,
        }
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
      });
    }
    else {
      this.getApproversByTask(poId)
    }
  }

  getRoApproversListById(roId) {
    this.isSpinnerVisible = true;
    if (this.roApprovaltaskId == 0) {
      this.commonService.smartDropDownList('ApprovalTask', 'ApprovalTaskId', 'Name').subscribe(response => {
        if (response) {
          response.forEach(x => {
            if (x.label.toUpperCase() == "RO APPROVAL") {
              this.roApprovaltaskId = x.value;
            }
          });
          this.getroApproversByTask(roId)
        }
      }, err => {
        this.isSpinnerVisible = false;
      });
    }
    else {
      this.getroApproversByTask(roId)
    }

  }

  getroApproversByTask(roId) {
    this.rointernalApproversList = [];
    this.isSpinnerVisible = true;
    this.repairOrderService.approverslistbyTaskId(this.roApprovaltaskId, roId).subscribe(res => {
      this.rointernalApproversList = res;
      // this.internalApproversList.map(x => {
      //   this.apporoverEmailList = x.approverEmails;
      //   this.apporoverNamesList.push(x.approverName);
      // })
      this.isSpinnerVisible = false;
    },
      err => {
        this.isSpinnerVisible = false;
      });
  }

  getApproversByTask(poId) {
    this.isSpinnerVisible = true;
    this.purchaseOrderService.approverslistbyTaskId(this.poApprovaltaskId, poId).subscribe(res => {
      this.internalApproversList = res;
      this.isSpinnerVisible = false;
    }, err => {
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
      }
    }, err => {
      this.isSpinnerVisible = false;
    });
  }

  getRoApprovalProcessListById(roId) {
    this.isSpinnerVisible = true;
    this.repairOrderService.getROApprovalListById(roId).subscribe(res => {
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
      this.isSpinnerVisible = false;
    }, err => {
      this.isSpinnerVisible = false;
    })
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

  formatePrice(value) {
    if (value) {
      return formatNumberAsGlobalSettingsModule(value, 2);
    }
    return '0.00';
  }

  getStatusvalue(status, val) { }

  onStatusChange(approver) { }
}
