import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { WorkOrderService } from '../../../../services/work-order/work-order.service';
import { AuthService } from '../../../../services/auth.service';
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
import { editValueAssignByCondition, getObjectById, listSearchFilterObjectCreation } from '../../../../generic/autocomplete';
declare var $: any;
import { NgForm } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../../services/common.service';
import { DatePipe } from "@angular/common";
import{AssetInventoryViewComponent} from '../../../Asset-Management/asset-inventory-view/asset-inventory-view.component'
@Component({
    selector: 'app-work-order-assets',
    templateUrl: './work-order-assets.component.html',
    styleUrls: ['./work-order-assets.component.css']
})
export class WorkOrderAssetsComponent implements OnInit {
    modal: NgbModalRef;
    @Input() isView: boolean = false;
    @Input() savedWorkOrderData: any;
    @Input() workOrderAssetList: any;
    @Input() workFlowWorkOrderId: any;
    @Input() isWorkOrder;
    @Input() employeesOriginalData;
    @Input() workFlowObject;
    @Output() refreshData = new EventEmitter();
    @Output() saveEquipmentListForWO = new EventEmitter();
    @Output() updateEquipmentListForWO = new EventEmitter();
    @Input() subWorkOrderDetails: any;
    @Input() subWOPartNoId: any;
    @Input() isSubWorkOrder: boolean = false;
    @Input() woNumber;
    @Input() customerName;
    @Input() woOperDate;
    @Input() workOrderPartNumberId;
    @Input() workOrderId;
    textAreaInfo: any;
    memoIndex;
    pageSize: number = 10;
    pageIndex: number = 0;
    totalRecords: number = 0;
    totalPages: number = 0;
    isGlobalFilter: boolean = false;
    filterText: any = '';
    filteredText: any = '';
    lazyLoadEventData: any;
    currentDeletedstatus: boolean = false;
    assetChekinCheckoutheaders = [
        { header: "", field: "checkbox" },
        { header: "Tool Name", field: "assetName" },
        { header: "Tool ID", field: "assetId" },
        { header: "Inventory Num", field: "inventoryNumber" },
        { header: "Tool Class", field: "assetType" },
        { header: "Manufacturer", field: "manufacturer" },
        { header: "Serial Num", field: "serialNo" },
        { header: "Location", field: "assetLocation" },
        { header: "Status", field: "inventoryStatus" },
        { header: "Checked Out by", field: "checkOutById" },
        { header: "Checked Out Date", field: "checkOutDate" },
        { header: "Checked In by", field: "checkInById" },
        { header: "Checked In Date", field: "checkInDate" },
        { header: "Notes", field: "notes" },
    ]
    headers = [
        { field: 'name', header: 'Tool Name' ,width:"130px"},
        { field: 'assetId', header: 'Tool Id',width:"130px" },
        { field: 'description', header: 'Tool Description',width:"130px" },
        { field: 'assetTypeName', header: 'Tool Class' ,width:"130px"},
        { field: 'quantity', header: 'Qty',width:"60px" },
        { field: "createdDate", header: "Created Date", width: "130px" },
        { field: "createdBy", header: "CreatedBy", width: "130px" },
        { field: "updatedDate", header: "Updated Date", width: "130px" },
        { field: "updatedBy", header: "UpdatedBy", width: "130px" }
    ]
    disableSaveForEdit:boolean=false; 
    selectedColumns = this.headers;
    moduleName = "Tool";
    assetRecordId: any;
    assets = {
        description: '',
        assetIdNumber: null,
        employeeId: null,
        checkInEmpId: null,
        checkOutEmpId: null,
        date: new Date(),
        assetId: null,
        assetStatus: null,
        quantity: null,
        checkInQty: null,
        checkOutQty: null,
    }
    assetsform = { ...this.assets }
    status: any;
    currentRecord: any;
    employeeList: any;
    generalInfoForm: NgForm;
    isEdit: boolean = false;
    editData: any;
    assetAuditHistory: any;
    addNewEquipment: boolean = false;
    //customerName:any;

    ngOnInit(): void {
      // this.customerName="A Pusapkraj";
    }
    constructor(private workOrderService: WorkOrderService, private authService: AuthService, private datePipe: DatePipe, private commonService: CommonService,
        private alertService: AlertService, private modalService: NgbModal, private cdRef: ChangeDetectorRef) {

    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    get employeeId() {
        return this.authService.currentUser ? this.authService.currentUser.employeeId : 0;
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
    assetInventoryId: any = 0;
    viewAsstes(rowData) {
        this.assetRecordId = rowData.assetRecordId;
    }
viewAsstesInventory(rowData){
    // this.assetRecordId = rowData.assetInventoryId;
    this.modal = this.modalService.open(AssetInventoryViewComponent, { size: 'lg', backdrop: 'static', keyboard: false,windowClass: 'assetMange'  });
    this.modal.componentInstance.assetInventoryId = rowData.assetInventoryId;
}
    workOrderCheckInCheckOutList: any = [];
    AvailableCount: any;
    showcheckInOutlist = false;
    togglePlus:boolean=false;
    openGrid() {
        this.togglePlus=true;
        this.showcheckInOutlist = true;
        this.workOrderCheckInCheckOutList = [];
        this.AvailableCount = 0;
        if (this.status == 'checkIn') {
            this.workOrderService.checkInAseetInventoryList(this.isSubWorkOrder ? this.currentRecord.subWorkOrderAssetId :this.currentRecord.workOrderAssetId,this.isSubWorkOrder,this.authService.currentUser.masterCompanyId).subscribe(res => {
                this.workOrderCheckInCheckOutList = res;
                if (this.workOrderCheckInCheckOutList && this.workOrderCheckInCheckOutList.length != 0) {
                    this.workOrderCheckInCheckOutList.map(element => {
                        element.checkOutDate = element.checkOutDate ? new Date(element.checkOutDate) : new Date();
                        element.checkInDate = element.checkInDate ? new Date(element.checkInDate) : new Date();
                        element.isSelected = false;
                        element.checkInById = this.authService.currentEmployee;
                        if (element.inventoryStatus == 'Available') {
                            this.AvailableCount + 1;
                        }
                    });
                }
            })
        } else if (this.status == 'checkOut') {
            this.workOrderService.checkOutAseetInventoryList(this.isSubWorkOrder ? this.currentRecord.subWorkOrderAssetId :this.currentRecord.workOrderAssetId,this.workOrderId,this.isSubWorkOrder ? this.currentRecord.subWOPartNoId : this.workOrderPartNumberId, this.currentRecord.assetRecordId, this.authService.currentUser.userName, this.currentUserMasterCompanyId,this.isSubWorkOrder ? this.currentRecord.subWorkOrderId : this.workOrderId,this.isSubWorkOrder).subscribe(res => {
                this.workOrderCheckInCheckOutList = res;
                if (this.workOrderCheckInCheckOutList && this.workOrderCheckInCheckOutList.length != 0) {
                    this.workOrderCheckInCheckOutList.map(element => {
                        element.checkOutDate = element.checkOutDate ? new Date(element.checkOutDate) : new Date();
                        element.checkInDate = element.checkInDate ? new Date(element.checkInDate) : new Date();
                        element.isSelected = false;
                        element.checkOutById = this.authService.currentEmployee;
                        if (element.inventoryStatus == 'Available') {
                            this.AvailableCount = this.AvailableCount + 1;
                        }
                    });
                }
            })
        }
    }

    checkStatus(rowData, value) {
        this.togglePlus=false;
        this.showcheckInOutlist = false;
        this.assetsform = {
            ...this.assetsform, description: rowData.description,
            assetIdNumber: rowData.rowData, assetId: rowData.assetId, assetStatus: value,
            quantity: rowData.quantity,
            checkInQty: rowData.checkInQty,
            checkOutQty: rowData.checkOutQty,
            checkInEmpId: getObjectById('value', this.employeeId, this.employeesOriginalData),
            checkOutEmpId: getObjectById('value', this.employeeId, this.employeesOriginalData),
        }
        this.currentRecord = rowData;
        this.status = value;
    }
    finalAssetArray: any = [];
    quantitySelected: any = 0;
    checkValue(array) {
        array.forEach(element => {
            if (element.isChecked == true) {
                this.quantitySelected = this.quantitySelected + 1;
            } else {
                if (this.quantitySelected > 0) {
                    this.quantitySelected = this.quantitySelected - 1;

                } else {
                    this.quantitySelected = 0;
                }
            }
        });
    }
    saveAssets(formData) {
        this.finalAssetArray = [];
        const data = {
            ...this.assetsform,
            employeeId: editValueAssignByCondition('value', this.assetsform.employeeId),
        }
        this.quantitySelected = 0;
       if(this.isSubWorkOrder){
           console.log("check in ")
        if (this.status === 'checkIn') {
            formData.forEach(element => {
                element.checkInById = element.checkInById.value;
                element.createdBy = this.userName;
                element.UpdatedBy = this.userName;
                element.masterCompanyId = 1;
                if (element.isChecked == true) {
                    this.finalAssetArray.push(element);
                }
            });
            if (this.finalAssetArray && this.finalAssetArray.length != 0) {
                this.workOrderService.savesubwocheckininventory(this.finalAssetArray).subscribe(res => {
                    // this.refreshData.emit();
            
                    this.alertService.showMessage(
                        '',
                        'Inventory Checked-In successfully!',
                        MessageSeverity.success
                    );
                },
                    err => {
                    })
            }
        } else {
            formData.forEach(element => {
                element.checkOutById = element.checkOutById.value;
                if (element.inventoryStatus == 'Available') {
                    this.finalAssetArray.push(element);
                }
            });
            if (this.finalAssetArray && this.finalAssetArray.length != 0) {
                this.workOrderService.savesubwocheckoutinventory(this.finalAssetArray).subscribe(res => {
                    // this.refreshData.emit();
                    this.alertService.showMessage(
                        '',
                        'Inventory Checked-Out successfully!',
                        MessageSeverity.success
                    );
                },
                    err => { })
            }
        }
       }else{
        if (this.status === 'checkIn') {
            formData.forEach(element => {
                element.checkInById = element.checkInById.value;
                element.createdBy = this.userName;
                element.UpdatedBy = this.userName;
                element.masterCompanyId = 1;
                if (element.isChecked == true) {
                    this.finalAssetArray.push(element);
                }
            });
            if (this.finalAssetArray && this.finalAssetArray.length != 0) {
                this.workOrderService.saveCheckInInventory(this.finalAssetArray).subscribe(res => {
                    // this.refreshData.emit();
            
                    this.alertService.showMessage(
                        '',
                        'Inventory Checked-In successfully!',
                        MessageSeverity.success
                    );
                },
                    err => {
                    })
            }
        } else {
            formData.forEach(element => {
                element.checkOutById = element.checkOutById.value;
                if (element.inventoryStatus == 'Available') {
                    this.finalAssetArray.push(element);
                }
            });
            if (this.finalAssetArray && this.finalAssetArray.length != 0) {
                this.workOrderService.saveCheckOutInventory(this.finalAssetArray).subscribe(res => {
                    // this.refreshData.emit();
                    this.alertService.showMessage(
                        '',
                        'Inventory Checked-Out successfully!',
                        MessageSeverity.success
                    );
                },
                    err => { })
            }
        }
       }
    }
    releaseData: any = [];
    releaseInventory() {
        this.togglePlus=false;
        this.releaseData = [];
        this.quantitySelected = 0;
   if(this.isSubWorkOrder){
    if (this.assetsform.assetStatus == 'checkOut') {

        if (this.workOrderCheckInCheckOutList && this.workOrderCheckInCheckOutList.length != 0) {
            this.workOrderCheckInCheckOutList.forEach(element => {
                element.checkOutById = element.checkOutById.value;
                if (element.inventoryStatus == 'Available') {
                    this.releaseData.push(element);
                }
            });
            if (this.releaseData && this.releaseData.length != 0) {
                this.workOrderService.releasesubwocheckoutinventory(this.releaseData).subscribe(res => {
                });
            }
        }
    }
   }else{
    if (this.assetsform.assetStatus == 'checkOut') {

        if (this.workOrderCheckInCheckOutList && this.workOrderCheckInCheckOutList.length != 0) {
            this.workOrderCheckInCheckOutList.forEach(element => {
                element.checkOutById = element.checkOutById.value;
                if (element.inventoryStatus == 'Available') {
                    this.releaseData.push(element);
                }
            });
            if (this.releaseData && this.releaseData.length != 0) {
                this.workOrderService.releaseAssetInventoryList(this.releaseData).subscribe(res => {
                });
            }
        }
    }
   }
    }
    closeAddNew() {
        this.addNewEquipment = false;
    }
    closerefreshview(){
        this.addNewEquipment = false;
        $('#addNewEquipments').modal('hide');
    }
    closePopupmodel(divid) {
		$("#"+divid+"").modal("hide");
	}

    createNew() {
        this.isEdit = false;
        this.editData = undefined;
        this.addNewEquipment = true;
    }
    edit(rowData) {
        this.createNew();
        // this.cdRef.detectChanges();
        this.isEdit = true;
        this.addNewEquipment = true;
        this.editData = rowData;
    }
    getAuditHistoryById(rowData) {
        const { workOrderAssetId } = rowData;
        const { subWorkOrderAssetId } = rowData;
        this.workOrderService.assetsHistoryByWorkOrderAssetId(this.isSubWorkOrder ? subWorkOrderAssetId: workOrderAssetId,this.isSubWorkOrder).subscribe(res => {
            this.assetAuditHistory = res;

        },
            err => {
            })

    }
    currentRow: any = {};
    openDelete(content, row) {
        this.currentRow = row;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
        this.modal.result.then(() => {

        }, () => { })
    }
    delete() {

        this.workOrderService.deleteWorkOrderAssetByAssetId(this.isSubWorkOrder ? this.currentRow.subWorkOrderAssetId : this.currentRow.workOrderAssetId, this.userName, this.isSubWorkOrder).subscribe(res => {
            // this.refreshData.emit();
            this.lazyLoadEventData.filters = { ...this.lazyLoadEventData.filters };
            this.getAllWorkOrderList(this.lazyLoadEventData);
            this.alertService.showMessage(
                '',
                'Deleted WorkOrder Tools  Successfully',
                MessageSeverity.success
            );
        },
            err => {
            })
        this.modal.close();
    }

    public dismissModel() {
        this.modal.close();
    }


    getColorCodeForHistory(i, field, value) {
        const data = this.assetAuditHistory;
        const dataLength = data.length;
        if (i >= 0 && i <= dataLength) {
            if ((i + 1) === dataLength) {
                return true;
            } else {
                return data[i + 1][field] === value
            }
        }
    }

    // onAddTextAreaInfo(row, index) {
    //     this.memoIndex = index;
    //     this.textAreaInfo = row.notes;
    // }

    // onSaveTextAreaInfo(notes) {
    //     if (notes) {
    //         this.textAreaInfo = notes;
    //         this.workOrderCheckInCheckOutList[this.memoIndex].notes = this.textAreaInfo;


    //     }
    //     $("#textarea-popup").modal("hide");
    // }
    // onCloseTextAreaInfo() {
    //     $("#textarea-popup").modal("hide");
    // }
    onAddTextAreaInfo(material,index) {
        this.memoIndex = index;
        this.textAreaInfo = material;
        this.disableEditor=true;
    }
    // textAreaInfo: any;
    disableEditor:any=true;
    editorgetmemo(ev){
        this.disableEditor=false;
                    }
    onSaveTextAreaInfo(memo) {
        this.disableSaveForEdit=false;
        if (memo) {
            this.textAreaInfo = memo;
            this.workOrderCheckInCheckOutList[this.memoIndex].notes = memo;
        }
        $("#textarea-popup").modal("hide");
    }
    onCloseTextAreaInfo() {
        $("#textarea-popup").modal("hide");
    }
    parsedText(text) {
    
        if(text){
            const dom = new DOMParser().parseFromString(
                '<!doctype html><body>' + text,
                'text/html');
                const decodedString = dom.body.textContent;
                return decodedString;
        }
          }
    getPageCount(totalNoofRecords, pageSize) {
        return Math.ceil(totalNoofRecords / pageSize)
    }

    pageIndexChange(event) {
        this.pageSize = event.rows;
    }

    globalSearch(value) {
        this.pageIndex = 0;
        this.filteredText = value;
        if (this.filteredText != "" && this.filteredText != null && this.filteredText != undefined) {
            this.isGlobalFilter = true;
        }
        else {
            this.isGlobalFilter = false;
        }
        const pageIndex = parseInt(this.lazyLoadEventData.first) / this.lazyLoadEventData.rows;;
        this.pageIndex = pageIndex;
        this.pageSize = this.lazyLoadEventData.rows;
        this.lazyLoadEventData.first = pageIndex;
        this.lazyLoadEventData.globalFilter = value;
        this.filterText = value;
        this.lazyLoadEventData.filters = { ...this.lazyLoadEventData.filters };
        this.getAllWorkOrderList(this.lazyLoadEventData);
    }
    loadData(event) {
        this.lazyLoadEventData = event;
        const pageIndex = parseInt(event.first) / event.rows;
        this.pageIndex = pageIndex;
        this.pageSize = event.rows;
        event.first = pageIndex;
        // if (this.viewType && this.currentStatus) {
        this.lazyLoadEventData.filters = {
            ...this.lazyLoadEventData.filters,
            // workOrderStatus: this.lazyLoadEventData.filters.workOrderStatus == undefined ? this.currentStatus : this.lazyLoadEventData.filters.workOrderStatus,
            // viewType: this.viewType
            // }
        }

        if (!this.isGlobalFilter) {
            this.getAllWorkOrderList(event);
        } else {
            this.globalSearch(this.filterText)
        }
    }
    getDeleteListByStatus(value) {
        this.currentDeletedstatus = true;
        this.pageIndex = this.lazyLoadEventData.rows > 10 ? parseInt(this.lazyLoadEventData.first) / this.lazyLoadEventData.rows : 0;
        this.pageSize = this.lazyLoadEventData.rows;
        this.lazyLoadEventData.first = this.pageIndex;
        if (value == true) {
            this.lazyLoadEventData.filters = { ...this.lazyLoadEventData.filters };
            this.getAllWorkOrderList(this.lazyLoadEventData);
        } else {
            this.currentDeletedstatus = false;
            this.lazyLoadEventData.filters = { ...this.lazyLoadEventData.filters };
            this.getAllWorkOrderList(this.lazyLoadEventData);
        }
    }

    restoreRecord() {
        const table= this.isSubWorkOrder? 'SubWorkOrderAsset' :'WorkOrderAssets';
       const column= this.isSubWorkOrder? 'SubWorkOrderAssetId' : 'workOrderAssetId';
       
        this.commonService.updatedeletedrecords(table, column, this.isSubWorkOrder? this.restorerecord.subWorkOrderAssetId : this.restorerecord.workOrderAssetId).subscribe(res => {
            this.getDeleteListByStatus(true)
            this.modal.close();
            this.alertService.showMessage("Success", `Record was Restored Successfully.`, MessageSeverity.success);
        }, err => {
        });
    }
    restorerecord: any = {};
    restore(content, rowData) {
        this.restorerecord = rowData;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }
    openDownload(content) {
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }
    closeModal() {
        this.modal.close();
    }
    exportCSV(dt) {
        const isdelete = this.currentDeletedstatus ? true : false;
        let PagingData = { "first": 0, "rows": dt.totalRecords, "sortOrder": 1, "filters": {isDeleted:isdelete,masterCompanyId : this.currentUserMasterCompanyId ,workOrderWfId : this.workFlowWorkOrderId}, "globalFilter": "" }
        let filters = Object.keys(dt.filters);
        filters.forEach(x => {
            PagingData.filters[x] = dt.filters[x].value;
            
        });
        this.workOrderService.getWorkOrderAssetList(this.isSubWorkOrder, PagingData).subscribe(res => {
                const vList = res['results'].map(x => {
                    return {
                        ...x,
                        updatedDate: x.updatedDate ? this.datePipe.transform(x.updatedDate, 'MMM-dd-yyyy hh:mm a') : '',
                        createdDate: x.createdDate ? this.datePipe.transform(x.createdDate, 'MMM-dd-yyyy hh:mm a') : '',
                    }
                });
                dt._value = vList;
                dt.exportCSV();
                dt.value = this.workOrderAssetList;
                this.modal.close();
            }, err => {
            });
    }
    get currentUserMasterCompanyId(): number {
        return this.authService.currentUser ? this.authService.currentUser.masterCompanyId : null;
    }
    fieldSearch(field) {
        this.isGlobalFilter = false;
    }
    isSpinnerVisible: boolean = false;
    getAllWorkOrderList(data) {
        const isdelete = this.currentDeletedstatus ? true : false;
        data.filters.isDeleted = isdelete;
        data.filters.masterCompanyId = this.currentUserMasterCompanyId;
        // data.filters.employeeId= this.employeeId;
        data.filters.workOrderWfId = this.workFlowWorkOrderId;
        if(this.isSubWorkOrder)
        {
            data.filters.SubWOPartNoId = this.subWOPartNoId;
        }
        const PagingData = { ...data, filters: listSearchFilterObjectCreation(data.filters) }
        this.isSpinnerVisible = true;
        this.workOrderService.getWorkOrderAssetList(this.isSubWorkOrder, PagingData).subscribe(res => {
            this.workOrderAssetList = res['results'].map(x => {
                return {
                    ...x,
                    createdDate: x.createdDate ? this.datePipe.transform(x.createdDate, 'MM/dd/yyyy hh:mm a') : '',
                    updatedDate: x.updatedDate ? this.datePipe.transform(x.updatedDate, 'MM/dd/yyyy hh:mm a') : '',
                }
            });

            if (res.results.length > 0) {
                this.totalRecords = res.totalRecordsCount;
                this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            } else {
                this.totalRecords = 0;
                this.totalPages = 0;
            }
            this.isSpinnerVisible = false;
        }, err => {
            this.isSpinnerVisible = false;
        })
    }

    //create and update  work order asset
    saveEquipmentList(event) {
        // this.saveEquipmentListForWO.emit(event)
        this.saveWorkOrderEquipmentList(event)

        $('#addNewEquipments').modal('hide');
        this.addNewEquipment = false;
    }
    updateEquipmentList(event) {
        // this.updateEquipmentListForWO.emit(event)
        this.updateWorkOrderEquipmentList(event)
        this.isEdit = false;
        $('#addNewEquipments').modal('hide');
        this.addNewEquipment = false;
    }
    saveWorkOrderEquipmentList(data) {
        this.equipmentArr = [];
        if (this.isSubWorkOrder) {
            this.equipmentArr = data.equipments.map(x => {
                return {
                    ...x,
                    masterCompanyId: this.authService.currentUser.masterCompanyId,
                    isActive: true,
                    createdBy: this.userName,
                    updatedBy: this.userName,
                    workFlowWorkOrderId: this.workFlowWorkOrderId,
                    subWOPartNoId: this.subWOPartNoId,
                    workOrderId: this.subWorkOrderDetails.workOrderId,
                    subWorkOrderId: this.subWorkOrderDetails.subWorkOrderId ? this.subWorkOrderDetails.subWorkOrderId : this.workOrderId
                }
            })
        } else {
            this.equipmentArr = data.equipments.map(x => {
                return {
                    ...x,
                    masterCompanyId: this.authService.currentUser.masterCompanyId,
                    isActive: true,
                    createdBy: this.userName,
                    updatedBy: this.userName,
                    workOrderId: this.workOrderId, workFlowWorkOrderId: this.workFlowWorkOrderId
                }
            })
        }
        this.isSpinnerVisible = true;
        this.workOrderService.createWorkOrderEquipmentList(this.equipmentArr, this.isSubWorkOrder).subscribe(res => {
            this.isSpinnerVisible = false;
            this.workFlowObject.equipments = [];
            this.alertService.showMessage(
                this.moduleName,
                'Saved Work Order Tools Succesfully',
                MessageSeverity.success
            );
            this.lazyLoadEventData.filters = { ...this.lazyLoadEventData.filters };
            this.getAllWorkOrderList(this.lazyLoadEventData);
        },
            err => {
                this.isSpinnerVisible = false;
                // this.errorHandling(err)
            })
    }
    equipmentArr: any = [];
    updateWorkOrderEquipmentList(data) {
        this.equipmentArr = [];
        if (this.isSubWorkOrder) {
             const equipmentArr = data.equipments.map(x => {
                return {
                    ...x,
                    masterCompanyId: this.authService.currentUser.masterCompanyId,
                    isActive: true,
                    createdBy: this.userName,
                    updatedBy: this.userName,
                    workFlowWorkOrderId: this.workFlowWorkOrderId,
                    subWOPartNoId: this.subWOPartNoId,
                    workOrderId: this.subWorkOrderDetails.workOrderId,
                    assetTypeId: x.assetTypeId ="undefined"? null:  x.assetTypeId,
                    assetTypeName: x.assetTypeName ="undefined"? null:  x.assetTypeName,
                    subWorkOrderId: this.subWorkOrderDetails.subWorkOrderId ? this.subWorkOrderDetails.subWorkOrderId : this.workOrderId
                }
            })

            this.isSpinnerVisible = true;
            this.workOrderService.createWorkOrderEquipmentList(equipmentArr, this.isSubWorkOrder).subscribe(res => {
                this.isSpinnerVisible = false;
                this.workFlowObject.equipments = [];
                this.alertService.showMessage(
                    this.moduleName,
                    'Updated Work Order Tools Succesfully',
                    MessageSeverity.success
                );
                this.lazyLoadEventData.filters = { ...this.lazyLoadEventData.filters };
                this.getAllWorkOrderList(this.lazyLoadEventData);
            },
                err => {
                    this.isSpinnerVisible = false;
                })
        } else {
            const equipmentArr = data.equipments.map(x => {
                return {
                    ...x,
                    masterCompanyId: this.authService.currentUser.masterCompanyId,
                    isActive: true,
                    createdBy: this.userName,
                    updatedBy: this.userName,
                    workOrderId: this.workOrderId, workFlowWorkOrderId: this.workFlowWorkOrderId
                }
            })
            this.isSpinnerVisible = true;
            this.workOrderService.updateWorkOrderEquipmentList(equipmentArr).subscribe(res => {
                this.isSpinnerVisible = false;
                this.workFlowObject.equipments = [];
                this.alertService.showMessage(
                    this.moduleName,
                    'Updated  Work Order Tools Succesfully',
                    MessageSeverity.success
                );
                this.lazyLoadEventData.filters = { ...this.lazyLoadEventData.filters };
                this.getAllWorkOrderList(this.lazyLoadEventData);
            },
                err => {
                    this.isSpinnerVisible = false;
                })
        }
    }
}