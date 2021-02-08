import { Component, Input, Output, EventEmitter, ChangeDetectorRef, OnInit, OnDestroy, ElementRef, ViewChild, SimpleChanges } from '@angular/core';
import { fadeInOut } from '../../../../services/animations';
import { ItemClassificationService } from '../../../../services/item-classfication.service';
import { UnitOfMeasureService } from '../../../../services/unitofmeasure.service';
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
import { WorkOrderService } from '../../../../services/work-order/work-order.service';
declare var $: any;
import { AuthService } from '../../../../services/auth.service';
import { Subscription } from 'rxjs';
import { timer } from 'rxjs/observable/timer';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
@Component({
    selector: 'app-work-order-complete-material-list',
    templateUrl: './work-order-complete-material-list.component.html',
    styleUrls: ['./work-order-complete-material-list.component.scss'],
    animations: [fadeInOut]
})
/** WorkOrderCompleteMaterialList component*/
export class WorkOrderCompleteMaterialListComponent implements OnInit, OnDestroy {
    @ViewChild("timerAlertNotfi", { static: false }) public timerAlertNotfi: ElementRef;
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
    @Input() fromWoList: false;
    @Input() mpnPartNumbersList: any = [];
    @Input() isSubWorkOrder: any = false;
    @Input() subWorkOrderDetails: any = {};
    @Input() subWOPartNoId;
    @Output() saveMaterialListForWO = new EventEmitter();
    @Output() updateMaterialListForWO = new EventEmitter();
    @Output() saveRIParts = new EventEmitter();
    @Output() refreshData = new EventEmitter();
    statusId = null;
    minDateValue: Date = new Date();
    addNewMaterial: boolean = false;
    workFlowWorkOrderId: any;
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
    cols = [
        { field: 'taskName', header: 'Task' },
        { field: 'line', header: 'Line Num' },
        { field: 'partNumber', header: 'PN' },
        { field: 'partDescription', header: 'PN Description' },
        { field: 'serialNumber', header: 'Serial Num' },
        { field: 'condition', header: 'Cond' },
        { field: 'stockLineNumber', header: 'SL Num' },
        { field: 'mandatoryOrSupplemental', header: 'Request Type' },
        { field: 'provision', header: 'Provision' },
        { field: 'quantity', header: 'Qty Req', align: 1 },
        { field: 'quantityReserved', header: 'Qty Res', align: 1 },
        { field: 'quantityIssued', header: 'Qty Iss', align: 1 },
        { field: 'qunatityTurnIn', header: 'Qty Turned In' },
        { field: 'partQuantityOnHand', header: 'Qty OH', align: 1 },
        { field: 'partQuantityAvailable', header: 'Qty Avail', align: 1 },
        { field: 'qunatityRemaining', header: 'Qty Rem', align: 1 },
        { field: 'uom', header: 'UOM' },
        { field: 'stockType', header: 'Stk Type' }, //oem
        { field: 'altEquiv', header: 'Alt/Equiv' },
        { field: 'itemClassification', header: 'Classification' },
        { field: 'partQuantityOnOrder', header: 'Qty On Order', align: 1 },
        { field: 'qunatityBackOrder', header: 'Qty on BK Order', align: 1 },
        { field: 'needDate', header: 'Need Date' },
        { field: 'controlNo', header: 'Cntl Num' },
        { field: 'controlId', header: 'Cntl ID' },
        { field: 'currency', header: 'Curr' },
        { field: 'unitCost', header: 'Unit Cost', align: 1 },
        { field: 'extendedCost', header: 'Extended Cost', align: 1 },
        { field: 'costDate', header: 'Cost Date' },
        { field: 'purchaseOrderNumber', header: 'PO Num' },
        { field: 'poNextDlvrDate', header: 'PO Next Dlvr Date' },
        { field: 'repairOrderNumber', header: 'RO Num' },
        { field: 'roNextDlvrDate', header: 'RO Next Dlvr Date' },
        { field: 'receiver', header: 'Rec Num' },
        { field: 'workOrderNumber', header: 'WO Num' },
        { field: 'subWorkOrder', header: 'Sub-WO Num' },
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
    workOrderGeneralInformation: any;
    /** WorkOrderCompleteMaterialList ctor */
    constructor(
        private workOrderService: WorkOrderService,
        public itemClassService: ItemClassificationService,
        public unitofmeasureService: UnitOfMeasureService,
        private authService: AuthService,
        private cdRef: ChangeDetectorRef,
        private modalService: NgbModal,
        private alertService: AlertService) {
    }
    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }
    ngOnInit() {
        // handel work order and sub work order for subWOPartNoId and  workFlowWorkOrderId
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
    ngOnChanges(changes: SimpleChanges) {
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
    createNew() {
        this.isEdit = false;
        this.editData = undefined;
        this.addNewMaterial = true;
        this.taskList = this.taskList;
    }
    edit(rowData) {
        this.editData = undefined;
        this.cdRef.detectChanges();
        this.isEdit = true;
        this.addNewMaterial = true;
        this.editData = { ...rowData };
    }
    currentRow: any = {};
    openDelete(content, row) {
        this.currentRow = row;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {

        }, () => { })
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
        if (value) {
            this.reservedList = this.reservedList.map(x => {
                if (x.woReservedIssuedAltParts && x.woReservedIssuedAltParts.length > 0) {
                    x.woReservedIssuedAltParts.map(x => {
                        x.isChildSelected = true;
                    })
                } else if (x.woReservedIssuedEquParts && x.woReservedIssuedEquParts.length > 0) {
                    x.woReservedIssuedEquParts.map(x => {
                        x.isChildSelected = true;
                    })
                }
                return {
                    ...x,
                    isParentSelected: true,
                }
            });

            this.isAllow = value;
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
        }
        this.savebutonDisabled = true;
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
    // used to get Parts from the Servers Bases on the Status Id
    partsIssueRI(statusId) {
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
           this.workOrderService.getReservedPartsByWorkFlowWOId(this.workFlowWorkOrderId, this.savedWorkOrderData.workOrderId, statusId, this.authService.currentUser.userName, this.isSubWorkOrder).subscribe(res => {
                this.reservedList = res.map(x => {
                 x.masterCompanyId = this.authService.currentUser.masterCompanyId
                    this.setdefaultValues(x);
                    if (this.statusId == 2 || this.statusId == 4 || this.statusId == 5) {
                        this.savebutonDisabled = true;
                        if (x.woReservedIssuedAltParts && x.woReservedIssuedAltParts.length > 0) {
                            this.isShowAlternatePN = true;
                            x.isParentSelected = true;
                            x.showAlternateParts = true;
                        } else if (x.woReservedIssuedEquParts && x.woReservedIssuedEquParts.length > 0) {
                            this.isShowEqPN = true;
                            x.isParentSelected = true;
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
                            }
                        })
                    }

                });
            },
                err => {
                    this.reservedList = []
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
    handelParts: any = []
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
        if (isChecked === false) {
            this.eqPartData = [];
            this.uncheckAltEqlPartCall(childPart)
        }
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

    }
    pageIndexChange(event) {
        this.pageIndex = parseInt(event.first) / event.rows;
        this.pageSize = event.rows;

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
                },
                    err => {
                    })
            } else {
                this.workOrderService.reservereleasestoclineqty(this.releasePartsList).subscribe((res: any[]) => {
                },
                    err => {
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
        this.saveRIParts.emit(this.checkedParts);
        this.isAllow = false;
        this.savebutonDisabled = false;
    }
    createNewPoWorkOrder(rowData) {
       if (this.isSubWorkOrder == true) {
            window.open(`/vendorsmodule/vendorpages/workorder-po-create/${0}/${0}/${rowData.subWorkOrderMaterialsId}`)
        } else {
            window.open(`/vendorsmodule/vendorpages/workorder-po-create/${0}/${rowData.workOrderMaterialsId}`)
        }
    }

    closeMaterial() {

        if (this.countDown) {
            this.countDown.unsubscribe();
        }
        this.countDown = null;
        this.savebutonDisabled = false;
        this.isAllow = false;
        this.releaseStock();
    }
    countDown: Subscription;
    counter = 600;
    tick = 1000;
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

    opentimerAlertModel() {
        let content = this.timerAlertNotfi;
        this.modal = this.modalService.open(content, { size: "sm" });
        this.modal.result.then(
            () => {
            },
            () => {
            }
        );
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
       window.open(`/workordersmodule/workorderspages/app-sub-work-order?workorderid=${currentRecord.workOrderId}&mpnid=${this.mpnId}&subworkorderid=${subworkorderid}&workOrderMaterialsId=${currentRecord.workOrderMaterialsId}`);
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
    subWoRecord: any = {}
    subWoClick(currentRecord) {
        this.subWoRecord = {};
        this.subWoRecord = currentRecord;
        let content = this.tabRedirectConfirmationModal;
        this.modal = this.modalService.open(content, { size: "sm" });
        this.modal.result.then(
            () => {
            },
            () => {
            }
        );
    }
    createNewSubWo() {
        this.dismissModel();
        const subworkorderid = 0;
        window.open(`/workordersmodule/workorderspages/app-sub-work-order?workorderid=${this.subWoRecord.workOrderId}&mpnid=${this.mpnId}&subworkorderid=${subworkorderid}&workOrderMaterialsId=${this.subWoRecord.workOrderMaterialsId}`);

    }
    viewSubWolist: boolean = false;
    addToExistingSubWo() {
        this.viewSubWolist = true;
        this.dismissModel();
    }
    moduleName: any = '';
    clearautoCompleteInput(workOrderGeneralInformation, employeeId) { }
}

