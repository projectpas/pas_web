import { WorkOrderPickticketComponent } from './../work-order-pickticket/work-order-pickticket.component';
import { Component, Input, Output, EventEmitter, ChangeDetectorRef, OnInit, OnDestroy, ElementRef, ViewChild, SimpleChanges } from '@angular/core';
import { fadeInOut } from '../../../../services/animations';
import { ItemClassificationService } from '../../../../services/item-classfication.service';
import { UnitOfMeasureService } from '../../../../services/unitofmeasure.service';
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
import { WorkOrderService } from '../../../../services/work-order/work-order.service';
declare var $: any;
import { AuthService } from '../../../../services/auth.service';
import { Subscription, Subject } from 'rxjs';
import { timer } from 'rxjs/observable/timer';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { formatNumberAsGlobalSettingsModule } from '../../../../generic/autocomplete';
import { CommonService } from '../../../../services/common.service';
import { takeUntil } from 'rxjs/operators';
// import { AuditComponentComponent } from '../../../../shared/components/audit-component/audit-component.component';
import { workOrderGeneralInfo } from '../../../../models/work-order-generalInformation.model';
import { Router } from '@angular/router';
import { StocklineViewComponent } from '../../../../shared/components/stockline/stockline-view/stockline-view.component';

@Component({
    selector: 'app-work-order-complete-material-list',
    templateUrl: './work-order-complete-material-list.component.html',
    styleUrls: ['./work-order-complete-material-list.component.scss'],
    animations: [fadeInOut]
})
export class WorkOrderCompleteMaterialListComponent implements OnInit, OnDestroy {

    @ViewChild("timerAlertNotfi", { static: false }) public timerAlertNotfi: ElementRef;
    @ViewChild("addPart", { static: false }) addPart: ElementRef;
    //@ViewChild(WorkOrderPickticketComponent, { static: false }) public workOrderPickticketComponent: WorkOrderPickticketComponent;
    @ViewChild("tabRedirectConfirmationModal", { static: false }) public tabRedirectConfirmationModal: ElementRef;
    @Input() isView: boolean = false;
    @Input() workOrderMaterialList;
    @Input() employeesOriginalData;
    @Input() isWorkOrder;
    @Input() workFlowObject;
    @Input() savedWorkOrderData;
    @Input() taskList: any[] = [];
    @Input() materialStatus;
    @Input() mpnId;
    @Input() workOrderId;
    @Input() workFlowWorkOrderId;

    @Input() fromWoList: false;
    @Input() mpnPartNumbersList: any = [];
    @Input() isSubWorkOrder: any = false;
    @Input() subWorkOrderDetails: any = {};
    @Input() subWOPartNoId;
    @Output() saveMaterialListForWO = new EventEmitter();
    @Output() updateMaterialListForWO = new EventEmitter();
    @Output() saveRIParts = new EventEmitter();
    @Output() refreshData = new EventEmitter();
    @Input() customerId;
    @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() saveMaterialsData = new EventEmitter();
    @Output() updateMaterialsData = new EventEmitter();
    @Output() isSubWorkorder = new EventEmitter();
    @Input() workOrderNumberStatus: any;
    statusId = null;
    ispickticket: boolean = false;
    minDateValue: Date = new Date();
    addNewMaterial: boolean = false;
    reservedList: any;
    alternatePartData: any = [];
    checkedParts: any = [];
    isEdit: boolean = false;
    isSpinnerVisible: boolean = false;
    editData: any;
    isShowEqPN: boolean = false;
    isShowAlternatePN: boolean = false;
    eqPartData: any[] = [];
    pageIndex: number = 1;
    pageSize: number = 10;
    interTotalRecords: number = 0;
    interTotalPages: number = 0;
    isSpinnerVisibleReserve: boolean = false;
    customer: any;
    addPartModal: NgbModalRef;
    show: boolean;
    clearData = false;
    isVisible:boolean=false;
    cols = [
        { field: 'taskName', header: 'Task', align: 0 },
        { field: 'isFromWorkFlow', header: 'Is From WorkFlow', align: 0, width: "110px" },
        { field: 'line', header: 'Line Num', align: 0, width: "64px" },
        { field: 'partNumber', header: 'PN', align: 0 },
        { field: 'partDescription', header: 'PN Description', align: 0 },
        { field: 'serialNumber', header: 'Serial Num', align: 0 },
        { field: 'condition', header: 'Cond', align: 0, width: "100px" },
        { field: 'stockLineNumber', header: 'Stk Line Num', align: 0 },
        { field: 'mandatoryOrSupplemental', header: 'Request Type', align: 0 },
        { field: 'provision', header: 'Provision', align: 0, width: "120px" },
        { field: 'quantity', header: 'Qty Req', align: 1, width: "60px" },
        { field: 'quantityReserved', header: 'Qty Res', align: 1, width: "60px" },
        { field: 'quantityIssued', header: 'Qty Iss', align: 1, width: "60px" },
        { field: 'qunatityTurnIn', header: 'Qty Turned In', align: 1, width: "83px" },
        { field: 'partQuantityOnHand', header: 'Qty OH', align: 1, width: "60px" },
        { field: 'partQuantityAvailable', header: 'Qty Avail', align: 1, width: "60px" },
        { field: 'qunatityRemaining', header: 'Qty Rem', align: 1, width: "60px" },
        { field: 'uom', header: 'UOM', align: 0, width: "70px" },
        { field: 'stockType', header: 'Stk Type', align: 0, width: "70px" }, //oem
        { field: 'altEquiv', header: 'Alt/Equiv', align: 0 },
        { field: 'itemClassification', header: 'Classification', align: 0 },
        { field: 'partQuantityOnOrder', header: 'Qty On Order', align: 1, width: "82px" },
        { field: 'qunatityBackOrder', header: 'Qty on BK Order', align: 1, width: "100px" },
        { field: 'needDate', header: 'Need Date', align: 0 },
        { field: 'controlNo', header: 'Cntl Num', align: 0 },
        { field: 'controlId', header: 'Cntl ID', align: 0 },
        { field: 'currency', header: 'Cur', align: 1, width: "60px" },
        { field: 'unitCost', header: 'Unit Cost', align: 1, width: "61px" },
        { field: 'extendedCost', header: 'Extended Cost', align: 1, width: "90px" },
        { field: 'costDate', header: 'Cost Date', align: 0 },
        { field: 'purchaseOrderNumber', header: 'PO Num', align: 0, width: "100px" },
        { field: 'poNextDlvrDate', header: 'PO Next Dlvr Date', align: 0 },
        { field: 'repairOrderNumber', header: 'RO Num', align: 0, width: "100px" },
        { field: 'roNextDlvrDate', header: 'RO Next Dlvr Date', align: 0 },
        { field: 'receiver', header: 'Rec Num', align: 0, width: "100px" },
        { field: 'workOrderNumber', header: 'WO Num', align: 0, width: "100px" },
        { field: 'subWorkOrder', header: 'Sub-WO Num', align: 0, width: "100px" },
        { field: 'salesOrder', header: 'SO Num', align: 0, width: "100px" },
        { field: 'figure', header: 'Figure', align: 0 },
        { field: 'site', header: 'Site', align: 0 },
        { field: 'wareHouse', header: 'Warehouse', align: 0 },
        { field: 'location', header: 'Location', align: 0 },
        { field: 'shelf', header: 'Shelf', align: 0 },
        { field: 'bin', header: 'Bin', align: 0 },
        { field: 'employeename', header: 'Employee ', align: 0 },
        { field: 'defered', header: 'Deferred', align: 0, width: "60px" },
        { field: 'memo', header: 'Memo', align: 0, width: "250px" }
    ]
    auditHistory = [
        { field: 'taskName', header: 'Task' },
        { field: 'partNumber', header: 'PN' },
        { field: 'partDescription', header: 'PN Description' },
        { field: 'serialNumber', header: 'Serial Num' },
        { field: 'condition', header: 'Cond' },
        { field: 'stockLineNumber', header: 'Stk Line Num' },
        { field: 'mandatoryOrSupplemental', header: 'Request Type' },
        { field: 'provision', header: 'Provision' },
        { field: 'quantity', header: 'Qty Req' },
        { field: 'quantityReserved', header: 'Qty Res' },
        { field: 'quantityIssued', header: 'Qty Iss' },
        { field: 'qunatityTurnIn', header: 'Qty Turned In' },
        { field: 'partQuantityOnHand', header: 'Qty OH' },
        { field: 'partQuantityAvailable', header: 'Qty Avail' },
        { field: 'qunatityRemaining', header: 'Qty Rem' },
        { field: 'uom', header: 'UOM' },
        { field: 'stockType', header: 'Stk Type' }, //oem
        { field: 'altEquiv', header: 'Alt/Equiv' },
        { field: 'itemClassification', header: 'Classification' },
        // { field: 'partQuantityOnOrder', header: 'Qty On Order' },
        // { field: 'qunatityBackOrder', header: 'Qty on BK Order' },
        { field: 'needDate', header: 'Need Date' },
        { field: 'controlNo', header: 'Cntl Num' },
        { field: 'controlId', header: 'Cntl ID' },
        { field: 'currency', header: 'Cur' },
        { field: 'unitCost', header: 'Unit Cost' },
        { field: 'extendedCost', header: 'Extended Cost' },
        { field: 'costDate', header: 'Cost Date' },
        // { field: 'purchaseOrderNumber', header: 'PO Num' },
        // { field: 'poNextDlvrDate', header: 'PO Next Dlvr Date' },
        // { field: 'repairOrderNumber', header: 'RO Num' },
        // { field: 'roNextDlvrDate', header: 'RO Next Dlvr Date' },
        { field: 'receiver', header: 'Rec Num' },
        { field: 'workOrderNumber', header: 'WO Num' },
        { field: 'subWorkOrderNo', header: 'Sub-WO Num' },
        { field: 'salesOrder', header: 'SO Num' },
        { field: 'figure', header: 'Figure' },
        { field: 'site', header: 'Site' },
        { field: 'wareHouse', header: 'Warehouse' },
        { field: 'location', header: 'Location' },
        { field: 'shelf', header: 'Shelf' },
        { field: 'bin', header: 'Bin' },
        { field: 'defered', header: 'Deferred' },
        { field: 'memo', header: 'Memo' }
    ]
    pickTicketItemInterfaceheader = [
        { field: "partNumber", header: "PN", width: "100px" },
        { field: "stockLineNumber", header: "Stk Line Num", width: "200px" },
        { field: "qtyOnHand", header: "Qty On Hand", width: "50px" },
        { field: "qtyAvailable", header: "Qty Avail", width: "80px" },
        { field: "qtyToShip", header: "Qty To Pick", width: "100px" },
        { field: "serialNumber", header: "Serial Num", width: "100px" },
        { field: "stkLineManufacturer", header: "Manufacturer", width: "100px" },
        { field: "stockType", header: "Stock Type", width: "100px" },
        { field: "tracableToName", header: "Tracable To", width: "100px" },
    ];
    isStockLine: boolean = true;
    isStockView: boolean = true;
    savebutonDisabled: boolean = false;
    roleUpMaterialList: any = [];
    isAllow: any = false;
    parentInputvalue: any;
    totalChildValuesSum: any;
    totalChildValuesSum2: any;
    totalChildValuesSum1: any;
    countDownDate: any;
    releasePartsList: any[];
    parentMaterialList: any[];
    employeeList: any = [];
    modal: NgbModalRef;
    showEqParts: any;
    workOrderGeneralInformation: workOrderGeneralInfo = new workOrderGeneralInfo();
    currentRow: any = {};
    handelParts: any = [];
    countDown: Subscription;
    counter = 600;
    tick = 1000;
    subWoRecord: any = {};
    viewSubWolist: boolean = false;
    moduleName: any = '';
    workorderSettings: any;
    private onDestroy$: Subject<void> = new Subject<void>();
    enablePickTicket: boolean = false;
    isViewItem: boolean = false;
    stockLineId: any;
     enumPartStatus:any= {
        Reserve:1,
        Issued:2,
        Reserveandissued:3,
        Unissued:4,
        Unreserved:5
    }
    constructor(
        private workOrderService: WorkOrderService,
        public itemClassService: ItemClassificationService,
        public unitofmeasureService: UnitOfMeasureService,
        private authService: AuthService,
        private cdRef: ChangeDetectorRef,
        private modalService: NgbModal,
        private alertService: AlertService,
        public router: Router,
        private commonService: CommonService
    ) { this.show = true; 
    
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }
    ngOnInit() {
 this.enumPartStatus=this.enumPartStatus;
        this.initColumns();
        if (this.savedWorkOrderData && this.isSubWorkOrder == false) {
            if (!this.savedWorkOrderData.isSinglePN && this.mpnPartNumbersList) {
                for (let mpn of this.mpnPartNumbersList) {
                    if (mpn['value']['workOrderPartNumberId'] == this.mpnId) {
                        this.workFlowWorkOrderId = mpn['value']['workOrderWorkFlowId'];
                    }
                }
            }
            else {
                this.workFlowWorkOrderId = this.savedWorkOrderData.workFlowWorkOrderId;
            }
        } else {
            this.workFlowWorkOrderId = this.subWOPartNoId;
        }
        this.getWorkOrderDefaultSetting();
        this.setStatusForSubWo();
    }
    getWorkOrderDefaultSetting(value?) {
        const value1 = value ? value : this.workOrderGeneralInformation.workOrderTypeId;
        this.commonService.workOrderDefaultSettings(this.currentUserMasterCompanyId, value1).pipe(takeUntil(this.onDestroy$)).subscribe(res => {
            if (res.length > 0) {
                this.workorderSettings = res[0];
                let pickTicketAllowed = this.workorderSettings.enforcePickTicket;
                let pickTicketDate = new Date(this.workorderSettings.pickTicketEffectiveDate);
                let todayDate: Date = new Date();
                this.enablePickTicket = (pickTicketAllowed && todayDate >= pickTicketDate);
            }
        })
    }
    ngOnChanges(changes: SimpleChanges) {
        this.enumPartStatus=this.enumPartStatus;
        if (this.savedWorkOrderData && this.isSubWorkOrder == false) {
            if (!this.savedWorkOrderData.isSinglePN && this.mpnPartNumbersList) {
                for (let mpn of this.mpnPartNumbersList) {
                    if (mpn['value']['workOrderPartNumberId'] == this.mpnId) {
                        this.workFlowWorkOrderId = mpn['value']['workOrderWorkFlowId'];
                    }
                }
            }
            else {
                this.workFlowWorkOrderId = this.savedWorkOrderData.workFlowWorkOrderId;
            }
        } else {
            this.workFlowWorkOrderId = this.subWOPartNoId;
        }
    }
    ngOnDestroy() {
        this.countDown = null;
    }
    closeAddNew() {
        this.addNewMaterial = false;
    }
    onClosePartSearchPopUp() {
        this.close.emit(true);
        this.show = false;
    }
    setmaterialListForSave(data) {
        this.saveMaterialsData.emit(data)
        this.show = false;
    }
    setmaterialListForUpdate(data) {
        this.show = false;
        this.updateMaterialsData.emit(data)
        this.isSubWorkorder.emit(this.isSubWorkOrder);
    }
    createNew() {
        this.ispickticket = false;
        this.isEdit = false;
        this.editData = undefined;
        this.addNewMaterial = true;
        this.taskList = this.taskList;
        this.workFlowObject.materialList = [];
        const newRow: any = {}
        newRow.conditionCodeId = 1;
        newRow.extendedCost = "0.00";
        newRow.extraCost = "0.00";
        newRow.itemClassificationId = "";
        newRow.itemMasterId = "";
        newRow.materialMandatoriesId = 1;
        newRow.partDescription = "";
        newRow.partItem = "";
        newRow.isDeferred = false;
        newRow.memo = "";
        newRow.price = "0.00";
        newRow.provisionId = "";
        newRow.quantity = "";
        newRow.unitCost = "0.00";
        newRow.unitOfMeasureId = null;
        newRow.isDeleted = false;
        newRow.extendedPrice = '';
        newRow.updatedBy = this.userName;
        newRow.createdBy = this.userName;
        newRow.createdDate = new Date();
        newRow.masterCompanyId = this.currentUserMasterCompanyId;
        this.workFlowObject.materialList.push(newRow)
    }
    get currentUserMasterCompanyId(): number {
        return this.authService.currentUser ? this.authService.currentUser.masterCompanyId : null;
    }
    edit(rowData) {
        this.editData = undefined;
        this.cdRef.detectChanges();
        this.isEdit = true;
        this.addNewMaterial = true;
        this.editData = { ...rowData, unitOfMeasure: rowData.uom, partItem: { partId: rowData.itemMasterId, partName: rowData.partNumber } };
    }
    editNew(rowData) {
        this.isViewItem = false;
        this.editData = undefined;
        this.cdRef.detectChanges();
        this.isEdit = true;
        this.addNewMaterial = true;
        this.editData = { ...rowData, unitOfMeasure: rowData.uom, partItem: { partId: rowData.itemMasterId, partName: rowData.partNumber } };
        let contentPart = this.addPart;
        this.addPartModal = this.modalService.open(contentPart, { windowClass: "myCustomModalClass", backdrop: 'static', keyboard: false });
    }
    viewItem(rowData) {
        this.editData = undefined;
        this.cdRef.detectChanges();
        this.isEdit = true;
        this.addNewMaterial = true;
        this.isViewItem = true;
        this.editData = { ...rowData, unitOfMeasure: rowData.uom, partItem: { partId: rowData.itemMasterId, partName: rowData.partNumber } };
        let contentPart = this.addPart;
        this.addPartModal = this.modalService.open(contentPart, { windowClass: "myCustomModalClass", backdrop: 'static', keyboard: false });
    }
    viewStockSelectedRow(rowData) {
        this.stockLineId = undefined;
        this.stockLineId = rowData.stockLineId;
        this.modal = this.modalService.open(StocklineViewComponent, { windowClass: "myCustomModalClass", backdrop: 'static', keyboard: false });
        this.modal.componentInstance.stockLineId = rowData.stockLineId;
    }
    editStockLine(rowData, parentRow) {
        this.editData = undefined;
        this.isEdit = true;
        this.editData = { ...rowData, unitOfMeasure: rowData.uom, partItem: { partId: rowData.itemMasterId, partName: rowData.partNumber } };
        this.editData.method = 'StockLine';
        this.editData.quantity = parentRow.quantity;
        $("#showStockLineDetails").modal("show");
    }
    openPartNumber() {
        this.isEdit = false;
        this.editData = undefined;
        this.isViewItem = false;
        let contentPart = this.addPart;
        this.ispickticket=false;
        this.addPartModal = this.modalService.open(contentPart, { windowClass: "myCustomModalClass", backdrop: 'static', keyboard: false });
    }
    openDelete(content, row) {
        this.currentRow = row;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }
    deleteStockLine(content, row) {
        this.currentRow = row;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }
    deleteStock() {
        if (this.isSubWorkOrder == true) {
            this.workOrderService.deletesubWorkOrderMaterialStocklineById(this.currentRow.subWorkOrderMaterialsId, this.currentRow.stockLineId, this.userName).subscribe(res => {
                this.refreshData.emit();
                this.alertService.showMessage(
                    '',
                    'Deleted WorkOrder Material Successfully',
                    MessageSeverity.success
                );
            },
                err => {
                })
        } else {
            this.workOrderService.deleteWorkOrderMaterialStocklineById(this.currentRow.workOrderMaterialsId, this.currentRow.stockLineId, this.userName).subscribe(res => {
                this.refreshData.emit();
                this.alertService.showMessage(
                    '',
                    'Deleted WorkOrder Material Successfully',
                    MessageSeverity.success
                );
            },
                err => {
                })
        }
        this.modal.close();
    }
    delete() {
        if (this.isSubWorkOrder == true) {
            this.workOrderService.deleteSubWorkOrderMaterialList(this.currentRow.subWorkOrderMaterialsId, this.userName).subscribe(res => {
                this.refreshData.emit();
                this.alertService.showMessage(
                    '',
                    'Deleted WorkOrder Material Successfully',
                    MessageSeverity.success
                );
            },
                err => {
                })
        } else {
            this.workOrderService.deleteWorkOrderMaterialList(this.currentRow.workOrderMaterialsId, this.userName).subscribe(res => {
                this.refreshData.emit();
                this.alertService.showMessage(
                    '',
                    'Deleted WorkOrder Material Successfully',
                    MessageSeverity.success
                );
            },
                err => {
                })
        }
        this.modal.close();
    }
    getRollupMaterialList(currentRecord, materialindex) {
        currentRecord.isShowPlus = false;
        if (this.isSubWorkOrder == true) {
            this.isSpinnerVisible = true;
            this.workOrderService.getSubWoMaterialRoleUps(currentRecord.subWorkOrderMaterialsId).subscribe((res: any[]) => {
                res.forEach((element, index) => {
                    element.myindex = materialindex;
                    if (element.currency) element.currency = element.currency.symbol;
                    element.quantity = null;
                    element.qunatityRemaining = null;
                    element.line = (materialindex + 1) + '.' + (index + 1)
                    this.getValues(element);
                    this.isSpinnerVisible = false;
                }, err => {
                    this.isSpinnerVisible = false;
                });

                this.roleUpMaterialList = res;
                for (var i = 0; i < this.roleUpMaterialList.length; i++) {
                    this.workOrderMaterialList.splice(materialindex + i + 1, 0, this.roleUpMaterialList[i])
                }
            },
                err => {
                })
        } else {
            this.isSpinnerVisible = true;
            this.workOrderService.getWorkOrderRolMaterialList(currentRecord.workOrderMaterialsId).subscribe((res: any[]) => {
                res.forEach((element, index) => {
                    element.myindex = materialindex;
                    if (element.currency) element.currency = element.currency.symbol;
                    element.quantity = null;
                    element.qunatityRemaining = null;
                    element.line = (materialindex + 1) + '.' + (index + 1)
                    this.getValues(element);
                });
                this.roleUpMaterialList = res;
                for (var i = 0; i < this.roleUpMaterialList.length; i++) {
                    this.workOrderMaterialList.splice(materialindex + i + 1, 0, this.roleUpMaterialList[i])
                }
                this.isSpinnerVisible = false;
            },
                err => {
                    this.isSpinnerVisible = false;
                })
        }
    }
    onClose(event) {
        this.show = false;
        this.addPartModal.close();
    }
    removeRollUpList(currentRecord, index) {
        currentRecord.isShowPlus = true;
        if (this.isSubWorkOrder == true) {
            this.workOrderService.getSubWoMaterialRoleUps(currentRecord.subWorkOrderMaterialsId).subscribe((res: any[]) => {
                this.workOrderMaterialList.splice(index + 1, res.length);
            },
                err => {
                })
        } else {
            this.workOrderService.getWorkOrderRolMaterialList(currentRecord.workOrderMaterialsId).subscribe((res: any[]) => {
                this.workOrderMaterialList.splice(index + 1, res.length);
            },
                err => {
                })
        }
    }
    getValues(element) {
        if (element.stockLineNumber) {
            if (element.stockLineNumber.indexOf(',') > -1) {
                element.isMultipleStockLine = 'Multiple';
            } else {
                element.isMultipleStockLine = 'Single';
            }
        }
        if (element.controlNo) {
            if (element.controlNo.indexOf(',') > -1) {
                element.isMultipleControlNo = 'Multiple';
            } else {
                element.isMultipleControlNo = 'Single';
            }
        }
        if (element.controlId) {
            if (element.controlId.indexOf(',') > -1) {
                element.isMultiplecontrolId = 'Multiple';
            } else {
                element.isMultiplecontrolId = 'Single';
            }
        }
        if (element.receiver) {
            if (element.receiver.indexOf(',') > -1) {
                element.isMultiplereceiver = 'Multiple';
            } else {
                element.isMultiplereceiver = 'Single';
            }
        }
    }
    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }

    saveMaterialList(event) {
        this.addNewMaterial = false;
        this.saveMaterialListForWO.emit(event);
        $('#addNewMaterials').modal('hide');
    }
    updateMaterialList(event) {
        this.updateMaterialListForWO.emit(event);
        $('#addNewMaterials').modal('hide');
        this.isEdit = false;
    }
    restrictMinus(e) {
        var inputKeyCode = e.keyCode ? e.keyCode : e.which;
        if (inputKeyCode != null) {
            if (inputKeyCode == 45) e.preventDefault();
        }
    }
    validatePartsQuantity(event, data) {
        if (event.target.value == null || event.target.value == '' || event.target.value == undefined || event.target.value == 0) {
            this.savebutonDisabled = false;
        } else {
            this.savebutonDisabled = true;
        }
        if (this.statusId === 1) {
            if (data.quantityReserved > data.quantityAvailable) {
                this.alertService.showMessage(
                    '',
                    ' Qty Actually Reserving Cant be greater than Qty Available',
                    MessageSeverity.warn
                );
                data.quantityReserved = null;
                this.savebutonDisabled = false;
            } else if (data.quantityReserved > data.qtyToBeReserved) {
                this.alertService.showMessage(
                    '',
                    ' Qty Actually Reserving Cant be greater than Qty To Be Reserved',
                    MessageSeverity.warn
                );
                data.quantityReserved = null;
                this.savebutonDisabled = false;
            }
        } else if (this.statusId === 2) {
            if (data.quantityIssued > data.quantityAlreadyReserved) {
                this.alertService.showMessage(
                    '',
                    ' Qty Actually Issuing Cant be greater than Qty Reserved',
                    MessageSeverity.warn
                );
                data.quantityIssued = 0;
                this.savebutonDisabled = false;
            }
        } else if (this.statusId === 3) {
            if (data.quantityIssued > data.quantityAvailable) {
                this.alertService.showMessage(
                    '',
                    ' Qty Actually Resver & Issue Cant be greater than Qty Available',
                    MessageSeverity.warn
                );
                data.quantityIssued = null;
                this.savebutonDisabled = false;
            } else if (data.quantityIssued > data.qtyToBeReserved) {
                this.alertService.showMessage(
                    '',
                    ' Qty Actually Resver & Issue Cant be greater than Qty To Be Reserved',
                    MessageSeverity.warn
                );
                data.quantityIssued = null;
                this.savebutonDisabled = false;
            }
        } else if (this.statusId === 4) {
            if (data.quantityIssued > data.quantityAlreadyIssued) {
                this.alertService.showMessage(
                    '',
                    'Qty Actually UnIssuing  Cant be greater than Qty Issued',
                    MessageSeverity.warn
                );
                data.quantityIssued = null;
                this.savebutonDisabled = false;
            }
        } else if (this.statusId === 5) {
            if (data.quantityReserved > data.quantityAlreadyReserved) {
                this.alertService.showMessage(
                    '',
                    'Qty Actually Reserving Cant be greater the Qty Reserved',
                    MessageSeverity.warn
                );
                data.quantityReserved = null;
                this.savebutonDisabled = false;
            }
        }
    }
    childPartValidate(value, currentRecord, type) {
        if (this.statusId == 1 || this.statusId == 3) {
            this.parentInputvalue = 0;
            this.totalChildValuesSum = 0;
            this.reservedList.map(x => {
                if (x.partNumber == currentRecord.parentPartNo) {
                    if (this.statusId == 1) {

                        this.parentInputvalue = x.quantityReserved;
                    } else {
                        this.parentInputvalue = x.quantityIssued;
                    }
                }
            });
            if (this.statusId == 1) {

                this.totalChildValuesSum1 = this.alternatePartData.reduce(function (prev, cur) {
                    return prev + cur.quantityReserved;
                }, 0);
                this.totalChildValuesSum2 = this.eqPartData.reduce(function (prev, cur) {
                    return prev + cur.quantityReserved;
                }, 0);

            } else {
                this.totalChildValuesSum1 = this.alternatePartData.reduce(function (prev, cur) {
                    return prev + cur.quantityIssued;
                }, 0);
                this.totalChildValuesSum2 = this.eqPartData.reduce(function (prev, cur) {
                    return prev + cur.quantityIssued;
                }, 0);
            }
            this.totalChildValuesSum = (this.totalChildValuesSum1 ? this.totalChildValuesSum1 : 0) + (this.totalChildValuesSum2 ? this.totalChildValuesSum2 : 0)
            if ((this.parentInputvalue + this.totalChildValuesSum) > currentRecord.quantity) {
                this.alertService.showMessage(
                    '',
                    ' Total Qty Actually Reserving Cant be greater than Qty Required',
                    MessageSeverity.warn
                );
                currentRecord.quantityReserved = 0;
            }
        }
    }
    allowAll(value) {
        if (value == true) {
            this.reservedList = this.reservedList.map(x => {
                if (x.woReservedIssuedAltParts && x.woReservedIssuedAltParts.length > 0) {
                    x.woReservedIssuedAltParts.map(x => {
                        // x.isChildSelected = true;
                        if (value == true && (this.statusId === 1 || this.statusId === 5) && x.quantityReserved != 0) {
                            x.isChildSelected = true;
                        }
                        if (value == true && (this.statusId === 2 || this.statusId === 3 || this.statusId === 4) && x.quantityIssued != 0) {
                            x.isChildSelected = true;
                        }
                    })
                } else if (x.woReservedIssuedEquParts && x.woReservedIssuedEquParts.length > 0) {
                    x.woReservedIssuedEquParts.map(x => {
                        // x.isChildSelected = true;
                        if (value == true && (this.statusId === 1 || this.statusId === 5) && x.quantityReserved != 0) {
                            x.isChildSelected = true;
                        }
                        if (value == true && (this.statusId === 2 || this.statusId === 3 || this.statusId === 4) && x.quantityIssued != 0) {
                            x.isChildSelected = true;
                        }
                    })
                }
                if (value == true && (this.statusId === 1 || this.statusId === 5) && x.quantityReserved != 0) {
                    x.isParentSelected = true;
                }
                if (value == true && (this.statusId === 2 || this.statusId === 3 || this.statusId === 4) && x.quantityIssued != 0) {
                    x.isParentSelected = true;
                }
                return {
                    ...x,

                }
            });

            this.isAllow = value;
            if (this.reservedList && this.reservedList.length != 0) {
                this.reservedList.forEach(element => {
                    if (element.isParentSelected) {
                        this.savebutonDisabled = true;
                    }
                });
            }
        } else {
            this.reservedList = this.reservedList.map(x => {
                if (x.woReservedIssuedAltParts && x.woReservedIssuedAltParts.length > 0) {
                    x.woReservedIssuedAltParts.map(x => {
                        x.isChildSelected = false;
                    })
                } else if (x.woReservedIssuedEquParts && x.woReservedIssuedEquParts.length > 0) {
                    x.woReservedIssuedEquParts.map(x => {
                        x.isChildSelected = false;
                    })
                }
                return {
                    ...x,
                    isParentSelected: false,

                }

            });
            this.isAllow = value;
            this.savebutonDisabled = false;
        }

    }

    filterEmployee(event): void {
        this.employeeList = this.employeesOriginalData;
        if (event.query !== undefined && event.query !== null) {
            const employee = [...this.employeesOriginalData.filter(x => {
                return x.label.toLowerCase().includes(event.query.toLowerCase())
            })]
            this.employeeList = employee;
        }
    }
    id: any;
    onclickpicktiket() {
        this.ispickticket = true;
        this.workOrderId = 64;
        let a = document.getElementsByClassName('card-body')[1];
        if (a) {
            a.scrollIntoView();
        }
        //this.workOrderPickticketComponent.refresh(this.id);
    }

    partsIssueRI(statusId) {
        this.ispickticket = false;
        this.savebutonDisabled = false;
        this.checkActiveStatus = true;
        this.countDown = null;
        this.counter = 600;
        this.tick = 1000;
        this.startTimerplus();
        this.statusId = statusId;
        this.reservedList = [];
        this.alternatePartData = [];
        this.eqPartData = [];
        this.isShowEqPN = false;
        this.isShowAlternatePN = false;
        if (this.workFlowWorkOrderId) {
            this.isSpinnerVisibleReserve = true;
            this.workOrderService.getReservedPartsByWorkFlowWOId(this.workFlowWorkOrderId, this.savedWorkOrderData.workOrderId, statusId, this.authService.currentUser.userName, this.isSubWorkOrder, this.authService.currentUser.masterCompanyId).subscribe(res => {
                if (res && res.length != 0) {
                    this.reservedList = res.map(x => {
                        x.masterCompanyId = this.authService.currentUser.masterCompanyId;
                        x.createdBy = x.createdBy ? x.createdBy : this.authService.currentUser.userName;
                        x.updatedBy = this.authService.currentUser.userName;
                        this.setdefaultValues(x);
                        if (this.statusId == 2 || this.statusId == 4 || this.statusId == 5) {
                            //    this.savebutonDisabled = true;
                            if (x.woReservedIssuedAltParts && x.woReservedIssuedAltParts.length > 0) {
                                this.isShowAlternatePN = true;
                                x.isParentSelected = false;
                                x.showAlternateParts = true;
                            } else if (x.woReservedIssuedEquParts && x.woReservedIssuedEquParts.length > 0) {
                                this.isShowEqPN = true;
                                x.isParentSelected = false;
                                x.showEqParts = true;
                            } else {
                                x.isParentSelected = false;
                                x.showAlternateParts = false;
                                x.showEqParts = false;
                            }
                        } else if (this.statusId == 1 || this.statusId == 3) {
                            x.isParentSelected = false;
                            x.showAlternateParts = false;
                            x.showEqParts = false;
                        }
                        return {
                            ...x,
                            reservedDate: new Date(),
                            issuedDate: new Date(),
                            reservedById: this.authService.currentEmployee,
                            issuedById: this.authService.currentEmployee,
                            woReservedIssuedAltParts: x.woReservedIssuedAltParts.map(y => {
                                this.setdefaultValuesForChild(y);
                                return {
                                    ...y,
                                    reservedDate: new Date(),
                                    issuedDate: new Date(),
                                    reservedById: this.authService.currentEmployee,
                                    issuedById: this.authService.currentEmployee,
                                    masterCompanyId: this.authService.currentUser.masterCompanyId,
                                    createdBy: y.createdBy ? y.createdBy : this.authService.currentUser.userName,
                                    updatedBy: this.authService.currentUser.userName
                                }
                            }),
                            woReservedIssuedEquParts: x.woReservedIssuedEquParts.map(y => {
                                this.setdefaultValuesForChild(y);
                                return {
                                    ...y,
                                    reservedDate: new Date(),
                                    issuedDate: new Date(),
                                    reservedById: this.authService.currentEmployee,
                                    issuedById: this.authService.currentEmployee,
                                    masterCompanyId: this.authService.currentUser.masterCompanyId,
                                    createdBy: y.createdBy ? y.createdBy : this.authService.currentUser.userName,
                                    updatedBy: this.authService.currentUser.userName
                                }
                            })
                        }

                    });
                } else {
                    this.reservedList = []
                }
                this.isSpinnerVisibleReserve = false;
            },
                err => {
                    this.reservedList = []
                    this.isSpinnerVisibleReserve = false;
                })
        }
    }

    setdefaultValues(currentRecord) {
        if (this.statusId == 1) {
            if (currentRecord.qtyToBeReserved > currentRecord.quantityAvailable) {
                currentRecord.quantityReserved = currentRecord.quantityAvailable ? currentRecord.quantityAvailable : 0;
            } else {
                currentRecord.quantityReserved = currentRecord.qtyToBeReserved ? currentRecord.qtyToBeReserved : 0;
            }
        } else if (this.statusId == 2) {
            currentRecord.quantityIssued = currentRecord.quantityAlreadyReserved ? currentRecord.quantityAlreadyReserved : 0;
        }
        else if (this.statusId == 3) {
            if (currentRecord.qtyToBeReserved > currentRecord.quantityAvailable) {
                currentRecord.quantityIssued = currentRecord.quantityAvailable ? currentRecord.quantityAvailable : 0;
            } else {
                currentRecord.quantityIssued = currentRecord.qtyToBeReserved ? currentRecord.qtyToBeReserved : 0;
            }
        }
        else if (this.statusId == 4) {
            currentRecord.quantityIssued = currentRecord.quantityAlreadyIssued ? currentRecord.quantityAlreadyIssued : 0;
        }
        else if (this.statusId == 5) {
            currentRecord.quantityReserved = currentRecord.quantityAlreadyReserved ? currentRecord.quantityAlreadyReserved : 0;
        }
    }

    setdefaultValuesForChild(currentRecord) {
        if (this.statusId == 2) {
            currentRecord.quantityIssued = currentRecord.qtyToBeIssued;
        }

        else if (this.statusId == 4) {
            currentRecord.quantityIssued = currentRecord.quantityAlreadyIssued;
        }
        else if (this.statusId == 5) {
            currentRecord.quantityReserved = currentRecord.qtyToBeIssued;
        }
    }

    resetAlternateParts(event) {
        this.alternatePartData = [];
        this.reservedList = this.reservedList.map(x => {
            return {
                ...x,
                showAlternateParts: false,
                woReservedIssuedAltParts: x.woReservedIssuedAltParts.map(y => {
                    return {
                        ...y,
                        isChildSelected: false
                    }
                }),
            }
        });
    }

    resetEqParts(event) {
        this.eqPartData = [];
        this.reservedList = this.reservedList.map(x => {
            return {
                ...x,
                showEqParts: false,
                woReservedIssuedEquParts: x.woReservedIssuedEquParts.map(y => {
                    return {
                        ...y,
                        isChildSelected: false
                    }
                })
            }
        });
    }
    setStatusForSubWo() {
        localStorage.setItem('woStatus', this.workOrderNumberStatus);
    }
    uncheckAltEqlPartCall(data) {
        this.parentMaterialList = [];
        data.map(x => {
            this.parentMaterialList.push({ parentWorkOrderMaterialsId: x.parentWorkOrderMaterialsId });
            this.workOrderService.reservereleasestoclineqty(this.parentMaterialList).subscribe((res: any[]) => {
            },
                err => {
                })
        })
    }

    showAlternateParts(isChecked, childPart) {
        this.handelParts = [];
        this.alternatePartData = [];
        this.alternatePartData = childPart;
        this.handelParts = childPart;
        childPart.forEach(element => {
            element.reservedById = this.authService.currentEmployee,
                element.issuedById = this.authService.currentEmployee,
                element.createdBy = this.authService.currentUser.userName,
                element.updatedBy = this.authService.currentUser.userName
        });
        this.handelParts.map(element => {
            element.reservedById = this.authService.currentEmployee.value,
                element.issuedById = this.authService.currentEmployee.value
        });
        if ((isChecked === true) && (this.statusId == 1 || this.statusId == 3)) {
            if (this.isSubWorkOrder == true) {
                this.workOrderService.reserveSubWoAltPartData(this.handelParts).subscribe((res: any[]) => {
                },
                    err => {
                    })
            } else {
                this.workOrderService.reserveAltPartData(this.handelParts).subscribe((res: any[]) => {
                },
                    err => {
                    })
            }

        }
        childPart.forEach(element => {
            element.reservedById = this.authService.currentEmployee,
                element.issuedById = this.authService.currentEmployee,
                element.createdBy = this.authService.currentUser.userName,
                element.updatedBy = this.authService.currentUser.userName
        });
        this.alternatePartData = childPart;
        if (isChecked === false) {
            this.alternatePartData = []
            this.uncheckAltEqlPartCall(childPart)
        }
    }

    showEquantParts(isChecked, childPart) {
        this.eqPartData = [];
        this.eqPartData = childPart;
        childPart.forEach(element => {
                element.reservedById = this.authService.currentEmployee,
                element.issuedById = this.authService.currentEmployee,
                element.createdBy = this.authService.currentUser.userName,
                element.updatedBy = this.authService.currentUser.userName
        });
        this.eqPartData.map(element => {
                element.reservedById = this.authService.currentEmployee.value,
                element.issuedById = this.authService.currentEmployee.value
        });
        if ((isChecked === true) && (this.statusId == 1 || this.statusId == 3)) {
            if (this.isSubWorkOrder == true) {
                this.workOrderService.reserveSubWoEqlPartData(this.eqPartData).subscribe((res: any[]) => {
                },
                    err => {
                    })
            } else {
                this.workOrderService.reserveEqlPartData(this.eqPartData).subscribe((res: any[]) => {
                },
                    err => {
                    })
            }
        }
        childPart.forEach(element => {
            element.reservedById = this.authService.currentEmployee,
                element.issuedById = this.authService.currentEmployee,
                element.createdBy = this.authService.currentUser.userName,
                element.updatedBy = this.authService.currentUser.userName
        });
        this.eqPartData = childPart;
        if (isChecked === false) {
            this.eqPartData = [];
            this.uncheckAltEqlPartCall(childPart)
        }
    }
    handleQty(currentRecord) {
        //     console.log("current recor",currentRecord)
        //     if (this.statusId === 1 || this.statusId === 5) {
        //         if(currentRecord.quantityReserved==null){
        //     if (this.statusId === 1) {
        //     if(currentRecord.quantityAvailable > currentRecord.qtyToBeReserved){

        //         currentRecord.quantityReserved=currentRecord.qtyToBeReserved;
        //     }else{
        //         currentRecord.quantityReserved=currentRecord.quantityAvailable;
        //     }
        // }else if ( this.statusId === 5) {
        //     currentRecord.quantityReserved=currentRecord.quantityAlreadyReserved;
        // }
        //         }
        //     }
        //   if (this.statusId === 2 || this.statusId === 3 || this.statusId === 4) {
        //             if(currentRecord.quantityIssued==null){
        //                 if (this.statusId === 2) {
        //                 if(currentRecord.quantityAvailable > currentRecord.quantityAlreadyReserved){

        //                     currentRecord.quantityIssued=currentRecord.quantityAlreadyReserved;
        //                 }else{
        //                     currentRecord.quantityIssued=currentRecord.quantityAvailable;
        //                 }
        //             }else if ( this.statusId === 4) {
        //                 currentRecord.quantityIssued=currentRecord.quantityAlreadyIssued;
        //             }
        //                     }
        //         }
    }
    selectedParts(currentRecord, event) {
        if (this.statusId === 1 || this.statusId === 5) {
            if (currentRecord.isParentSelected == true && currentRecord.quantityReserved != 0) {
                this.savebutonDisabled = true;
            } else {
                this.savebutonDisabled = false;
            }
        }
        if (this.statusId === 2 || this.statusId === 3 || this.statusId === 4) {
            if (currentRecord.isParentSelected == true && currentRecord.quantityIssued != 0) {
                this.savebutonDisabled = true;
            } else {
                this.savebutonDisabled = false;
            }
        }

        this.checkedParts = [];
        this.reservedList.map(x => {
            if (x.isParentSelected) {
                const { woReservedIssuedAltParts, ...rest } = x
                this.checkedParts.push({ ...rest, partStatusId: this.statusId });
            }
            x.woReservedIssuedAltParts.map(c => {
                if (c.isChildSelected) {
                    this.checkedParts.push({
                        ...c,
                        itemMasterId: c.altPartId,
                        partNumber: c.altPartNumber,
                        partStatusId: this.statusId
                    });
                }

            })
            x.woReservedIssuedEquParts.map(c => {
                if (c.isChildSelected) {
                    this.checkedParts.push({
                        ...c,
                        equPartId: c.altPartId,
                        equPartNumber: c.altPartNumber,
                        partStatusId: this.statusId
                    });
                }

            })

        })
        if (event.target.checked == false) {
            // if (this.statusId == 1) {
            //     currentRecord.quantityReserved = 0
            //     // currentRecord.qtyToBeReserved;
            // } else if (this.statusId == 2) {
            //     currentRecord.quantityIssued =0
            //     //  currentRecord.quantityAlreadyReserved;
            // } else if (this.statusId == 3) {
            // } else if (this.statusId == 4) {
            //     currentRecord.quantityIssued = 0
            //     // currentRecord.quantityAlreadyIssued;
            // } else if (this.statusId == 5) {
            //     currentRecord.quantityReserved = 0
            //     currentRecord.quantityAlreadyReserved;
            // }
            if (this.statusId === 1 || this.statusId === 5) {
                if (currentRecord.quantityReserved == null) {
                    if (this.statusId === 1) {
                        if (currentRecord.quantityAvailable > currentRecord.qtyToBeReserved) {

                            currentRecord.quantityReserved = currentRecord.qtyToBeReserved;
                        } else {
                            currentRecord.quantityReserved = currentRecord.quantityAvailable;
                        }
                    } else if (this.statusId === 5) {
                        currentRecord.quantityReserved = currentRecord.quantityAlreadyReserved;
                    }
                }
            }
            if (this.statusId === 2 || this.statusId === 3 || this.statusId === 4) {
                if (currentRecord.quantityIssued == null) {
                    if (this.statusId === 2) {
                        if (currentRecord.quantityAvailable > currentRecord.quantityAlreadyReserved) {

                            currentRecord.quantityIssued = currentRecord.quantityAlreadyReserved;
                        } else {
                            currentRecord.quantityIssued = currentRecord.quantityAvailable;
                        }
                    } else if (this.statusId === 4) {
                        currentRecord.quantityIssued = currentRecord.quantityAlreadyIssued;
                    }
                }
            }
        }
    }

    pageIndexChange(event) {
        this.pageIndex = parseInt(event.first) / event.rows;
        this.pageSize = event.rows;
    }
    parsedText(text) {
        if (text) {
            const dom = new DOMParser().parseFromString(
                '<!doctype html><body>' + text,
                'text/html');
            const decodedString = dom.body.textContent;
            return decodedString;
        }
    }
    releaseStock() {
        if (this.statusId == 1 || this.statusId == 3) {
            this.releasePartsList = [];
            if (this.isSubWorkOrder == true) {
                this.reservedList.map(x => {
                    this.releasePartsList.push({ subWorkOrderMaterialId: x.subWorkOrderMaterialsId });
                })
            } else {
                this.reservedList.map(x => {
                    this.releasePartsList.push({ workOrderMaterialsId: x.workOrderMaterialsId });
                })
            }

            if (this.isSubWorkOrder == true) {
                this.workOrderService.reservereleaseSubWostoclineqty(this.releasePartsList).subscribe((res: any[]) => {
                    this.refreshData.emit();
                },
                    err => {
                        this.refreshData.emit();
                    })
            } else {
                this.workOrderService.reservereleasestoclineqty(this.releasePartsList).subscribe((res: any[]) => {
                    this.refreshData.emit();
                },
                    err => {
                        this.refreshData.emit();
                    })
            }
        }
    }

    saveRIPart() {
        $('#reserve').modal("hide");
        this.checkedParts = []
        this.checkedParts = [];
        this.reservedList.map(x => {
            x.issuedById = x.issuedById.value
            x.reservedById = x.reservedById.value
            if (x.isParentSelected) {
                const { woReservedIssuedAltParts, ...rest } = x
                this.checkedParts.push({ ...rest, partStatusId: this.statusId, createdBy: (rest.createdBy) ? rest.createdBy : this.authService.currentUser.userName, updatedBy: this.authService.currentUser.userName });
            }
            x.woReservedIssuedAltParts.map(c => {
                c.issuedById = c.issuedById.value
                c.reservedById = c.reservedById.value
                if (c.isChildSelected) {
                    this.checkedParts.push({
                        ...c,
                        itemMasterId: c.altPartId,
                        partNumber: c.altPartNumber,
                        partStatusId: this.statusId
                    });
                }
            })
            x.woReservedIssuedEquParts.map(c => {
                c.issuedById = c.issuedById.value
                c.reservedById = c.reservedById.value
                if (c.isChildSelected) {
                    this.checkedParts.push({
                        ...c,
                        equPartId: c.altPartId,
                        equPartNumber: c.altPartNumber,
                        partStatusId: this.statusId
                    });
                }
            })
        })

        // this.refreshData.emit();
        this.checkActiveStatus = true;
        if (this.countDown) {
            this.countDown.unsubscribe();
        }
        this.countDown = null;
        this.savebutonDisabled = false;
        this.isAllow = false;
        this.saveRIParts.emit(this.checkedParts);

    }

    createNewPoWorkOrder(rowData) {
        localStorage.setItem("itemMasterId", rowData.itemMasterId);
        localStorage.setItem("partNumber", rowData.partNumber);
        localStorage.setItem("lsWoId", this.workOrderId);
        localStorage.setItem("lsconditionId", rowData.conditionCodeId);
        localStorage.setItem("lsqty", rowData.quantity);
        if (this.isSubWorkOrder == true) {
            localStorage.setItem("lsSubWoId", this.subWOPartNoId);
            // this.router.navigateByUrl(`vendorsmodule/vendorpages/app-purchase-setup/vendor/`);```
            //window.open(`/vendorsmodule/vendorpages/workorder-po-create/${0}/${0}/${rowData.subWorkOrderMaterialsId}`)
            // window.open(`/vendorsmodule/vendorpages/app-purchase-setup`);
            this.router.navigateByUrl(
                `/vendorsmodule/vendorpages/app-purchase-setup`
            );

        } else {
            // window.open(`/vendorsmodule/vendorpages/workorder-po-create/${0}/${rowData.workOrderMaterialsId}`)
            // window.open(`/vendorsmodule/vendorpages/app-purchase-setup`);
            this.router.navigateByUrl(
                `vendorsmodule/vendorpages/app-purchase-setup`
            );


        } 
    }
    createNewROWorkOrder(childRowData, rowData) {
        debugger
        localStorage.setItem("itemMasterId", rowData.itemMasterId);
        localStorage.setItem("partNumber", rowData.partNumber);
        localStorage.setItem("lsWoId", this.workOrderId);        
        localStorage.setItem("lsconditionId", rowData.conditionCodeId);
        localStorage.setItem("lsSubWoId", rowData.subWorkOrderId);        
        localStorage.setItem("lsqty", childRowData.stocklineQuantity);
        localStorage.setItem("lsstocklineId", childRowData.stockLineId);
        if (this.isSubWorkOrder == true) {
            localStorage.setItem("lsSubWoId", this.subWOPartNoId);
            // this.router.navigateByUrl(`vendorsmodule/vendorpages/app-purchase-setup/vendor/`);```
            //window.open(`/vendorsmodule/vendorpages/workorder-po-create/${0}/${0}/${rowData.subWorkOrderMaterialsId}`)
            // window.open(`/vendorsmodule/vendorpages/app-purchase-setup`);
            this.router.navigateByUrl(
                `/vendorsmodule/vendorpages/app-ro-setup`
            );

        } else {
            // window.open(`/vendorsmodule/vendorpages/workorder-po-create/${0}/${rowData.workOrderMaterialsId}`)
            // window.open(`/vendorsmodule/vendorpages/app-purchase-setup`);
            this.router.navigateByUrl(
                `vendorsmodule/vendorpages/app-ro-setup`
            );


        }
    }


    checkActiveStatus: boolean = false;
    closeMaterial() {
        this.checkActiveStatus = true;
        if (this.countDown) {
            this.countDown.unsubscribe();
        }
        this.countDown = null;
        this.savebutonDisabled = false;
        this.isAllow = false;
        this.releaseStock();
    }

    startTimerplus() {
        this.countDown = timer(0, this.tick).subscribe(() => {
            --this.counter
            if (this.counter == 80) {
                this.opentimerAlertModel()
            }
            if (this.counter == 0) {
                setTimeout(() => {
                    $('#reserve').modal("hide");
                    if (this.countDown) {
                        this.countDown.unsubscribe();
                    }
                    this.countDown = null;
                    $('#timerAlertNotfi').modal("hide");
                    this.modal.close();
                    this.releaseStock();
                }, 1000)
            }
        },
            err => {
            });
    }



    openPartNumberClear(viewMode) {
        this.clearData = viewMode;
        let contentPart = this.addPart;
        this.addPartModal = this.modalService.open(contentPart, { windowClass: "myCustomModalClass", backdrop: 'static', keyboard: false });
    }

    opentimerAlertModel() {
        let content = this.timerAlertNotfi;
        this.modal = this.modalService.open(content, { size: "sm" });
    }

    actionTimerReset() {
        this.counter = 600;
        this.tick = 1000;
        this.countDown.unsubscribe();
        this.startTimerplus();
        $('#timerAlertNotfi').modal("hide");
        this.modal.close();
    }

    dismissTimerAlert() {
        $('#timerAlertNotfi').modal("hide");
        this.modal.close();
    }

    // create sub work order
    editSubWo(currentRecord) {
        const subworkorderid = currentRecord.subWorkOrderId ? currentRecord.subWorkOrderId : 0
        // window.open(`/workordersmodule/workorderspages/app-sub-work-order?workorderid=${currentRecord.workOrderId}&mpnid=${this.mpnId}&subworkorderid=${subworkorderid}&workOrderMaterialsId=${currentRecord.workOrderMaterialsId}`);
        // &workOrderStatus=${this.workOrderNumberStatus}
        this.router.navigateByUrl(
            `workordersmodule/workorderspages/app-sub-work-order?workorderid=${currentRecord.workOrderId}&mpnid=${this.mpnId}&subworkorderid=${subworkorderid}&workOrderMaterialsId=${currentRecord.workOrderMaterialsId}`
        );


    }

    public dismissModel() {
        this.modal.close();
    }

    public dismissModel2() {
        this.modal.close();
        setTimeout(() => {
            this.viewSubWolist = false;
        }, 1000)
    }

    subWoClick(currentRecord) {
        this.subWoRecord = {};
        this.subWoRecord = currentRecord;
        let content = this.tabRedirectConfirmationModal;
        this.modal = this.modalService.open(content, { size: "sm" });
    }

    createNewSubWo() {
        this.dismissModel();
        const subworkorderid = 0;
        // window.open(`/workordersmodule/workorderspages/app-sub-work-order?workorderid=${this.subWoRecord.workOrderId}&mpnid=${this.mpnId}&subworkorderid=${subworkorderid}&workOrderMaterialsId=${this.subWoRecord.workOrderMaterialsId}`);

        this.router.navigateByUrl(
            `workordersmodule/workorderspages/app-sub-work-order?workorderid=${this.subWoRecord.workOrderId}&mpnid=${this.mpnId}&subworkorderid=${subworkorderid}&workOrderMaterialsId=${this.subWoRecord.workOrderMaterialsId}`
        );


    }

    addToExistingSubWo() {
        this.viewSubWolist = true;
        this.dismissModel();
    }

    clearautoCompleteInput(workOrderGeneralInformation, employeeId) { }

    auditHistoryList: any = []
    isSpinnerVisibleHistory: boolean = false;
    openMaterialAudit(row) {
        this.auditHistoryList = [];
        this.isSpinnerVisibleHistory = true;
        this.workOrderService.getMaterialHistory(this.isSubWorkOrder ? row.subWorkOrderMaterialsId : row.workOrderMaterialsId, this.isSubWorkOrder).subscribe(res => {
            this.isSpinnerVisibleHistory = false;
            this.auditHistoryList = res.reverse();

            if (this.auditHistoryList && this.auditHistoryList.length > 0) {
                this.auditHistoryList = this.auditHistoryList.map(x => {
                    return {
                        ...x,
                        unitCost: x.unitCost ? formatNumberAsGlobalSettingsModule(x.unitCost, 2) : '0.00',
                        extendedCost: x.extendedCost ? formatNumberAsGlobalSettingsModule(x.extendedCost, 2) : '0.00'
                    }
                })
            }
        }, err => {
            this.isSpinnerVisibleHistory = false;
        })
    }
    //     openStocklineAudit(row) {

    //   if(row.workOrderMaterialsId && row.workOrderMaterialsId !=0){
    //     this.isSpinnerVisible = true;
    //     this.stockLineService.getStocklineAudit(row.workOrderMaterialsId).subscribe(response => {
    //         this.isSpinnerVisible = false;
    //         this.auditHistory = response.map(res => {
    //             return {
    //                 ...res,
    //                 quantityOnHand: (res.quantityOnHand || res.quantityOnHand == 0) ? formatNumberAsGlobalSettingsModule(res.quantityOnHand, 0) : '',
    //                 quantityReserved: (res.quantityReserved || res.quantityReserved == 0) ? formatNumberAsGlobalSettingsModule(res.quantityReserved, 0) : '',
    //                 quantityIssued: (res.quantityIssued || res.quantityIssued == 0) ? formatNumberAsGlobalSettingsModule(res.quantityIssued, 0) : '',
    //                 quantityAvailable: (res.quantityAvailable || res.quantityAvailable == 0) ? formatNumberAsGlobalSettingsModule(res.quantityAvailable, 0) : '',
    //                 purchaseOrderUnitCost: res.purchaseOrderUnitCost ? formatNumberAsGlobalSettingsModule(res.purchaseOrderUnitCost, 2) : '',
    //                 repairOrderUnitCost: res.repairOrderUnitCost ? formatNumberAsGlobalSettingsModule(res.repairOrderUnitCost, 2) : '',
    //                 unitSalesPrice: res.unitSalesPrice ? formatNumberAsGlobalSettingsModule(res.unitSalesPrice, 2) : '',
    //                 coreUnitCost: res.coreUnitCost ? formatNumberAsGlobalSettingsModule(res.coreUnitCost, 2) : '',
    //                 lotCost: res.lotCost ? formatNumberAsGlobalSettingsModule(res.lotCost, 2) : '',
    //             }
    //         })

    //     }, error => {
    //         this.isSpinnerVisible = false;
    //     })
    //   }
    //     }

    getColorCodeForHistory(i, field, value) {
        const data = this.auditHistoryList;
        const dataLength = data.length;
        if (i >= 0 && i <= dataLength) {
            if ((i + 1) === dataLength) {
                return true;
            } else {
                return data[i + 1][field] === value
            }
        }
    }
    // checkIsSeclected(){
    //     if(this.reservedList &&  this.reservedList.length !=0){
    //        this.reservedList.forEach(element => {
    //         if (element.isParentSelected) {
    //             return false;
    //         }
    //     });
    //   }
    // }  
    summaryColumns: any = [];
    childColumnsData: any = [];
    initColumns() {


        if (!this.isView) {
            this.childColumnsData.push({ header: "Notes", width: "120px" });
        }



        this.summaryColumns = [
            { field: 'line', header: 'Line Num', align: 0, width: "64px" },
            { field: 'taskName', header: 'Task', align: 0, width: "100px" },
            { field: 'isFromWorkFlow', header: 'Is From WorkFlow', align: 0, width: "110px" },
            { field: 'partNumber', header: 'PN', align: 0, width: "160px" },
            { field: 'partDescription', header: 'PN Description', align: 0, width: "200px" },
            // { field: 'serialNumber', header: 'Serial Num', align: 0 },
            { field: 'condition', header: 'Cond', align: 0, width: "100px" },
            // { field: 'stockLineNumber', header: 'Stk Line Num', align: 0 },
            { field: 'mandatoryOrSupplemental', header: 'Request Type', align: 0, width: "110px" },
            { field: 'provision', header: 'Provision', align: 0, width: "120px" },
            { field: 'quantity', header: 'Qty Req', align: 1, width: "60px" },
            { field: 'quantityReserved', header: 'Qty Res', align: 1, width: "60px" },
            { field: 'quantityIssued', header: 'Qty Iss', align: 1, width: "60px" },
            { field: 'qunatityTurnIn', header: 'Qty Turned In', align: 1, width: "90px" },
            { field: 'partQuantityOnHand', header: 'Qty OH', align: 1, width: "60px" },
            { field: 'partQuantityAvailable', header: 'Qty Avail', align: 1, width: "66px" },
            { field: 'qunatityRemaining', header: 'Qty Rem', align: 1, width: "60px" },
          
            { field: 'uom', header: 'UOM', align: 0, width: "70px" },
            { field: 'stockType', header: 'Stk Type', align: 0, width: "70px" }, //oem
            // { field: 'altEquiv', header: 'Alt/Equiv', align: 0 },
            { field: 'itemClassification', header: 'Classification', align: 0, width: "150px" },
            { field: 'needDate', header: 'Need Date', align: 0 },
            // { field: 'controlNo', header: 'Cntl Num', align: 0 },
            // { field: 'controlId', header: 'Cntl ID', align: 0 },
            { field: 'currency', header: 'Cur', align: 1, width: "60px" },
            { field: 'unitCost', header: 'Unit Cost', align: 1, width: "68px" },
            { field: 'extendedCost', header: 'Extended Cost', align: 1, width: "96px" },
            // { field: 'costDate', header: 'Cost Date', align: 0 },
   
            // { field: 'repairOrderNumber', header: 'RO Num', align: 0, width: "100px" },
            // { field: 'roNextDlvrDate', header: 'RO Next Dlvr Date', align: 0 },
            // { field: 'receiver', header: 'Rec Num', align: 0, width: "100px" },
            { field: 'workOrderNumber', header: 'WO Num', align: 0, width: "100px" },
            { field: 'subWorkOrderNo', header: 'Sub-WO Num', align: 0, width: "100px" },
            // { field: 'salesOrder', header: 'SO Num', align: 0, width: "100px" },
            // { field: 'figure', header: 'Figure', align: 0 },
            // { field: 'site', header: 'Site', align: 0 },
            // { field: 'wareHouse', header: 'Warehouse', align: 0 },
            // { field: 'location', header: 'Location', align: 0 },
            // { field: 'shelf', header: 'Shelf', align: 0 },
            // { field: 'bin', header: 'Bin', align: 0 },
            { field: 'employeename', header: 'Employee ', align: 0, width: "150px" },
            { field: 'memo', header: 'Memo', align: 0, width: "250px" },
            { field: 'isDeferred', header: 'Deferred', align: 0, width: "90px" },
            { field: 'qtyOnOrder', header: 'Qty On Order', align: 1, width: "86px" },
            { field: 'qtyOnBkOrder', header: 'Qty on BK Order', align: 1, width: "110px" },
            { field: 'poNum', header: 'PO Num' },
            { field: 'poNextDlvrDate', header: 'PO Next Dlvr Date',width: "115px" },
        ]

        this.childColumnsData = [
            { field: 'line', header: ' ', align: 0, width: "64px" },
            //   { field: 'taskName', header: 'Task', align: 0, width: "100px"},
            //   { field: 'isFromWorkFlow', header: 'Is From WorkFlow', align: 0, width: "110px" },
            { field: 'stockLineNumber', header: 'Stk Line Num', align: 0, width: "83px" },
            { field: 'serialNumber', header: 'Serial Num', align: 0, width: "70px" },
            { field: 'partNumber', header: 'PN', align: 0, width: "160px" },
            { field: 'partDescription', header: 'PN Description', align: 0, width: "200px" },
            { field: 'condition', header: 'Cond', align: 0, width: "100px" },
            { field: 'mandatoryOrSupplemental', header: 'Request Type', align: 0, width: "110px" },
            { field: 'provision', header: 'Provision', align: 0, width: "100px" },
            { field: 'stocklineQuantity', header: 'Qty Req', align: 1, width: "60px" },
            { field: 'stocklineQtyReserved', header: 'Qty Res', align: 1, width: "60px" },
            { field: 'stocklineQtyIssued', header: 'Qty Iss', align: 1, width: "60px" },
            { field: 'partQuantityTurnIn', header: 'Qty Turned In', align: 1, width: "83px" },
            { field: 'stockLineQuantityOnHand', header: 'Qty OH', align: 1, width: "60px" },
            { field: 'stockLineQuantityAvailable', header: 'Qty Avail', align: 1, width: "60px" },
            { field: 'stocklineQtyRemaining', header: 'Qty Rem', align: 1, width: "60px" },
            { field: 'uom', header: 'UOM', align: 0, width: "70px" },
            { field: 'stockType', header: 'Stk Type', align: 0, width: "70px" }, //oem
            // { field: 'altEquiv', header: 'Alt/Equiv', align: 0 },
            { field: 'itemClassification', header: 'Classification', align: 0,width: "200px" },
            { field: 'needDate', header: 'Need Date', align: 0 , width: "70px"},
            { field: 'currency', header: 'Cur', align: 1, width: "60px" },
            { field: 'stocklineUnitCost', header: 'Unit Cost', align: 1, width: "61px" },
            { field: 'stocklineExtendedCost', header: 'Extended Cost', align: 1, width: "90px" },
            { field: 'controlNo', header: 'Cntl Num', align: 0, width: "70px" },
            { field: 'controlId', header: 'Cntl ID', align: 0, width: "70px" },
            { field: 'employeename', header: 'Employee ', align: 0, width: "150px" },
            //   { field: 'defered', header: 'Deferred', align: 0, width: "60px" },
            { field: 'memo', header: 'Memo', align: 0, width: "250px" },
            // { field: 'partQuantityOnOrder', header: 'Qty On Order', align: 1, width: "82px" },
            // { field: 'qunatityBackOrder', header: 'Qty on BK Order', align: 1, width: "100px" },

            { field: 'costDate', header: 'Cost Date', align: 0, width: "70px" },
            // { field: 'purchaseOrderNumber', header: 'PO Num', align: 0, width: "100px" },
            // { field: 'poNextDlvrDate', header: 'PO Next Dlvr Date', align: 0, width: "120px" },
            { field: 'repairOrderNumber', header: 'RO Num', align: 0, width: "100px" },
            { field: 'roNextDlvrDate', header: 'RO Next Dlvr Date', align: 0, width: "120px" },
            { field: 'receiver', header: 'Rec Num', align: 0, width: "100px" },
            { field: 'workOrderNumber', header: 'WO Num', align: 0, width: "100px" },
            { field: 'subWorkOrderNo', header: 'Sub-WO Num', align: 0, width: "100px" },
            { field: 'salesOrder', header: 'SO Num', align: 0, width: "100px" },
            { field: 'figure', header: 'Figure', align: 0, width: "70px" },
            { field: 'site', header: 'Site', align: 0, width: "100px" },
            { field: 'wareHouse', header: 'Warehouse', align: 0, width: "100px" },
            { field: 'location', header: 'Location', align: 0, width: "100px" },
            { field: 'shelf', header: 'Shelf', align: 0, width: "100px" },
            { field: 'bin', header: 'Bin', align: 0, width: "100px" },
         
            // { field: 'repairOrderNumber', header: 'RO Num' },
            // { field: 'roNextDlvrDate', header: 'RO Next Dlvr Date' },

        ]

    }


    //   updateMaterialListForWO
    //   updateMaterialList(event) {
    //     this.updateMaterialListForWO.emit(event);
    //     $('#addNewMaterials').modal('hide');
    //     this.isEdit = false;
    // }
    // setmaterialListForUpdate(data){
    //     this.show = false;
    //     this.updateMaterialListForWO.emit(data)
    //     // this.addPartModal.close();
    //     // $('#addPart').modal("hide");
    // }
    parts: any[] = [];
    qtyToPick: number = 0;
    pickticketItemInterface(rowData, pickticketieminterface) {
        const itemMasterId = rowData.itemMasterId;
        const conditionId = rowData.conditionCodeId;
        const workOrderId = rowData.workOrderId;
        const workOrderMaterialsId = rowData.workOrderMaterialsId;
        this.qtyToPick = rowData.quantityReserved - rowData.qunatityPicked; 

        this.modal = this.modalService.open(pickticketieminterface, { size: "lg", backdrop: 'static', keyboard: false });
        this.workOrderService
            .getStockLineforPickTicket(itemMasterId, conditionId, workOrderId)
            .subscribe((response: any) => {
                this.isSpinnerVisible = false;
                this.parts = response;
                for (let i = 0; i < this.parts.length; i++) {
                    if (this.parts[i].oemDer == null)
                        this.parts[i].oemDer = this.parts[i].stockType;
                    this.parts[i]['isSelected'] = false;
                    this.parts[i]['workOrderId'] = workOrderId;
                    this.parts[i]['workOrderMaterialsId'] = workOrderMaterialsId;
                    this.parts[i].qtyToShip = this.qtyToPick;
                    if (this.parts[i].qtyToReserve == 0) {
                        this.parts[i].qtyToReserve = null
                    }
                }
            }, error => {
                this.isSpinnerVisible = false;
            });
    }
    get employeeId() {
        return this.authService.currentUser
            ? this.authService.currentUser.employeeId
            : "";
    }
    savepickticketiteminterface(parts) {
        let tempParts = [];
        let invalidQty = false;
        parts.filter(x => {
            x.createdBy = this.userName;
            x.updatedBy = this.userName;
            x.pickedById = this.employeeId;
            x.masterCompanyId = this.currentUserMasterCompanyId;
            if (x.isSelected == true) {
                tempParts.push(x)
            }
        })
        parts = [];
        parts = tempParts;
        for (let i = 0; i < parts.length; i++) {
            let selectedItem = parts[i];
            var errmessage = '';
            if (selectedItem.qtyToShip > this.qtyToPick) {
                this.isSpinnerVisible = false;
                invalidQty = true;
                errmessage = errmessage + '<br />' + "You cannot pick more than Qty To Pick"
            }
        }
        if (invalidQty) {
            this.isSpinnerVisible = false;
            this.alertService.showMessage(
                'Work Order',
                'You cannot pick more than Qty To Pick',
                MessageSeverity.warn
            );
            //   this.alertService.resetStickyMessage();
            //   this.alertService.showStickyMessage('Work Order', errmessage, MessageSeverity.error);
        }
        else {
            this.disableSubmitButton = true;
            this.workOrderService
                .savepickticketiteminterface(parts)
                .subscribe(data => {
                    this.alertService.stopLoadingMessage();
                    this.alertService.showMessage(
                        "Success",
                        `Item Picked Successfully..`,
                        MessageSeverity.success
                    );
                    this.dismissModel();
                    //   this.onSearch();
                }, error => this.isSpinnerVisible = false);
        }
    }
    onCloseMaterial(data) {
        $('#showStockLineDetails').modal("hide");
    }
    disableSubmitButton: boolean = true;
    onChangeOfPartSelection(event) {
        let selectedPartsLength = 0;
        for (let i = 0; i < this.parts.length; i++) {
            if (event == true) {
                selectedPartsLength = selectedPartsLength + 1;
            }
            else {
                if (selectedPartsLength != 0) {
                    selectedPartsLength = selectedPartsLength - 1;
                }
            }
        }

        if (selectedPartsLength == 0) {
            this.disableSubmitButton = true;
        } else {
            this.disableSubmitButton = false;
        }
    }

}

// min-width: 81px !important;
// min-width: 91px !important;
// min-width: 88px !important;
// min-width: 84px !important;
// min-width: 72px !important;
// min-width: 78px !important;