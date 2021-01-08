import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AuditHistory } from '../../../../models/audithistory.model';
import { AuthService } from '../../../../services/auth.service';
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
import { VendorService } from '../../../../services/vendor.service';
import { fadeInOut } from '../../../../services/animations';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { RepairOrderService } from '../../../../services/repair-order.service';
import { VendorCapabilitiesService } from '../../../../services/vendorcapabilities.service';
import { CommonService } from '../../../../services/common.service';
import { formatNumberAsGlobalSettingsModule } from '../../../../generic/autocomplete';
import * as $ from 'jquery';
import { NgbModalRef, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MenuItem } from 'primeng/api';


@Component({
	selector: 'app-ro-list',
	templateUrl: './ro-list.component.html',
	styleUrls: ['./ro-list.component.scss'],
    animations: [fadeInOut],
    providers: [DatePipe]
})
/** Rolist component*/
export class RoListComponent implements OnInit {
	totalRecords: number = 0;
    totalPages: number = 0;
    breadcrumbs: MenuItem[];
    home: any;
    headers = [
		{ field: 'repairOrderNumber', header: 'RO Num' },
        { field: 'openDate', header: 'Open Date' },
        { field: 'closedDate', header: 'Closed/Cancelled Date' },
        { field: 'vendorName', header: 'Vendor Name' },
        { field: 'vendorCode', header: 'Vendor Code' },
        { field: 'status', header: 'Status' },
        { field: 'requestedBy', header: 'Requested By' },
        { field: 'approvedBy', header: 'Approved By' },
    ]
    selectedColumns = this.headers;
    data: any;
    pageSize: number = 10;
    pageIndex: number = 0;
    @ViewChild('dt',{static:false})
    private table: Table;
    lazyLoadEventData: any;
    lazyLoadEventDataInput: any;
    auditHistory: AuditHistory[];
    rowDataToDelete: any = {};
    roHeaderAdd: any = {};
    roPartsList: any = [];
    approveList: any = [];
    vendorCapesInfo: any = [];
    vendorCapesCols: any[];
    headerManagementStructure: any = {};
    repairOrderNoInput: any;
    openDateInput: any;
    closedDateInput: any;
    vendorNameInput: any;
    vendorCodeInput: any;
    statusIdInput: any;
    requestedByInput: any;
    approvedByInput: any;
    @Input() isEnableROList: boolean;
    @Input() vendorId: number;
    @Input() isApproverlist: boolean = false;   
    currentStatus: string = 'Open';
    filterText: any = '';
    selectedrepairOrderId: any;
    roStatusList: any = [];
    isSpinnerVisible: boolean = true;
    currentDeletedstatus: boolean = false;
    modal: NgbModalRef;
    vendorCapesGeneralInfo: any = {};
    aircraftListDataValues: any;
    ApprovedstatusId: number = 0;
    roApprovaltaskId: number = 0;
    colsaircraftLD: any[] = [
        { field: "aircraft", header: "Aircraft" },
        { field: "model", header: "Model" },
        { field: "dashNumber", header: "Dash Numbers" },
        { field: "memo", header: "Memo" }
    ];
    internalApproversList: any = [];
    roTotalCost: number;
    approvalProcessHeader = [        
        {
            header: 'Action',
            field: 'actionStatus'
        },
        {
            header: 'Sent Date',
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
            header: 'PN',
            field: 'partNumber'
        }, {
            header: 'PN Desc',
            field: 'partDescription'
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
    approvalProcessList: any = [];  

    constructor(private _route: Router,
        private authService: AuthService,
        private alertService: AlertService,
        public vendorService: VendorService,       
        private repairOrderService: RepairOrderService,        
        private vendorCapesService: VendorCapabilitiesService,
        private commonService: CommonService,
        private modalService: NgbModal,

        private datePipe: DatePipe) {
        this.vendorService.ShowPtab = false;     

    }

    ngOnInit() {
        this.loadROStatus();
        this.vendorService.currentUrl = '/vendorsmodule/vendorpages/app-ro-list';
        this.vendorService.bredcrumbObj.next(this.vendorService.currentUrl);        
        this.vendorCapesCols = [			
			{ field: 'ranking', header: 'Ranking' },
			{ field: 'partNumber', header: 'PN' },
			{ field: 'partDescription', header: 'PN Description' },
			{ field: 'capabilityType', header: 'Capability Type' },
			{ field: 'cost', header: 'Cost' },
			{ field: 'tat', header: 'TAT' },
			{ field: 'name', header: 'PN Mfg' },
        ];
        this.breadcrumbs = [
            { label: 'Repair Order' },
            { label: 'Repair Order List' },
        ];

      
    }

    loadROStatus() {
		this.commonService.smartDropDownList('ROStatus', 'ROStatusId', 'Description').subscribe(response => {
			this.roStatusList = response;
			this.roStatusList = this.roStatusList.sort((a,b) => (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0));
        },err => {const errorLog = err;
            this.isSpinnerVisible = false;
			this.errorMessageHandler(errorLog);});
	}
    getROListByStatus(status) {
        this.currentStatus = status;
        const pageIndex = 0;
        this.pageIndex = pageIndex;
        this.pageSize = this.lazyLoadEventDataInput.rows;
        this.lazyLoadEventDataInput.first = pageIndex;
        this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: status };
        this.isSpinnerVisible = true;
        this.getList(this.lazyLoadEventDataInput);
    }  

    getList(data) {
        const isdelete = this.currentDeletedstatus ? true : false;
        data.filters.isDeleted = isdelete;      
        this.repairOrderService.getROList(data).subscribe(res => {
            const vList = res[0]['results'];
            this.data = vList;
            if (this.data.length > 0) {
                this.totalRecords = res[0]['totalRecordsCount'];
                this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            }else {
                this.data=[];
                this.totalRecords=0;
                this.totalPages=0;
            } 
            this.isSpinnerVisible = false;
        },err => {const errorLog = err;           
			this.errorMessageHandler(errorLog);});
    }


    loadApprovalProcessStatus() {		
        this.commonService.smartDropDownList('ApprovalProcess', 'ApprovalProcessId', 'Name').subscribe(response => { 		        
		     response.forEach(x => {
                if (x.label.toUpperCase() == "APPROVED") {
                    this.ApprovedstatusId = x.value;
				}
            },err => {              
                const errorLog = err;
                this.errorMessageHandler(errorLog);		
            });
		});
	}

    getApprovalProcessListById(roId) {
		this.isSpinnerVisible = true;		
		this.repairOrderService.getROApprovalListById(roId).subscribe(res => {
			const arrayLen = res.length;
			let count = 0;
			this.approvalProcessList = res.map(x => {
				if(x.actionId == this.ApprovedstatusId) {
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
            const errorLog = err;
			this.errorMessageHandler(errorLog);
		})
	}
    
    errorMessageHandler(log) {
        this.isSpinnerVisible = false;
		this.alertService.showMessage(
			'Error',
			log.error,
			MessageSeverity.error
		);
	}

    getManagementStructureCodes(id) {
        this.commonService.getManagementStructureCodes(id).subscribe(res => {
			if (res.Level1) {
				this.headerManagementStructure.level1 = res.Level1;
            } else {
                this.headerManagementStructure.level1 = '-';
            }
            if (res.Level2) {
				this.headerManagementStructure.level2 = res.Level2;
            } else {
                this.headerManagementStructure.level2 = '-';
            }
            if (res.Level3) {
				this.headerManagementStructure.level3 = res.Level3;
            } else {
                this.headerManagementStructure.level3 = '-';
            }
            if (res.Level4) {
				this.headerManagementStructure.level4 = res.Level4;
			} else {
                this.headerManagementStructure.level4 = '-';
            }
		},err => {			
			const errorLog = err;
			this.errorMessageHandler(errorLog);})
    }
    
    getManagementStructureCodesParent(partList) {
        this.commonService.getManagementStructureCodes(partList.managementStructureId).subscribe(res => {
			if (res.Level1) {
				partList.level1 = res.Level1;
            }
            if (res.Level2) {
				partList.level2 = res.Level2;
            }
            if (res.Level3) {
				partList.level3 = res.Level3;
            }
            if (res.Level4) {
				partList.level4 = res.Level4;
			}
		},err => {const errorLog = err;           
			this.errorMessageHandler(errorLog);});
    }

    getManagementStructureCodesChild(partChild) {
        this.commonService.getManagementStructureCodes(partChild.managementStructureId).subscribe(res => {
			if (res.Level1) {
				partChild.level1 = res.Level1;
            }
            if (res.Level2) {
				partChild.level2 = res.Level2;
            }
            if (res.Level3) {
				partChild.level3 = res.Level3;
            }
            if (res.Level4) {
				partChild.level4 = res.Level4;
			}
		}, err => {			
			const errorLog = err;
			this.errorMessageHandler(errorLog);})
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    columnsChanges() {
        this.refreshList();
    }
    refreshList() {
        this.table.reset(); 

    }
    loadData(event) {
        this.lazyLoadEventData = event;
        const pageIndex = parseInt(event.first) / event.rows;;
        this.pageIndex = pageIndex;
        this.pageSize = event.rows;
        event.first = pageIndex;
        this.lazyLoadEventDataInput = event;
        this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.currentStatus };
        if(this.isEnableROList) {
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, vendorId: this.vendorId }
        }
        this.isSpinnerVisible = true;
        if(this.filterText == '') {
            this.getList(this.lazyLoadEventDataInput);
        } else {
            this.globalSearch(this.filterText);
        } 
                
        if(this.isApproverlist)
        {           
            this.currentStatus = 'Fulfilling';         
            this.getROListByStatus(this.currentStatus);
        }
    }

    onChangeInputField(value, field, el) {       
        if (value === '') { el.classList.add("hidePlaceHolder"); }
        else el.classList.remove("hidePlaceHolder");

        if(field == "repairOrderNumber") {
            this.repairOrderNoInput = value;
        }
        if(field == "openDate") {
            this.openDateInput = value;
        }
        if(field == "closedDate") {
            this.closedDateInput = value;
        }
        if(field == "vendorName") {
            this.vendorNameInput = value;
        }
        if(field == "vendorCode") {
            this.vendorCodeInput = value;
        }
        if(field == "status") {
            this.statusIdInput = value;
        }
        if(field == "requestedBy") {
            this.requestedByInput = value;
        }
        if(field == "approvedBy") {
            this.approvedByInput = value;
        }

        this.lazyLoadEventDataInput.filters = {
            repairOrderNo: this.repairOrderNoInput,
            openDate: this.openDateInput,
            closedDate: this.closedDateInput,
            vendorName: this.vendorNameInput,
            vendorCode: this.vendorCodeInput,
            status: this.statusIdInput ? this.statusIdInput : this.currentStatus,
            requestedBy: this.requestedByInput,
            approvedBy: this.approvedByInput,
            vendorId: this.vendorId ? this.vendorId : null
        }        
        this.getList(this.lazyLoadEventDataInput);
    }
   
    edit(rowData) {		
        const { repairOrderId } = rowData;
        this._route.navigateByUrl(`vendorsmodule/vendorpages/app-ro-setup/edit/${repairOrderId}`);
    }
    delete(rowData) {
        this.rowDataToDelete = rowData;
    }

    deleteRO() {
        const { repairOrderId } = this.rowDataToDelete;
        this.repairOrderService.deleteRO(repairOrderId, this.userName).subscribe(res => {
            this.getList(this.lazyLoadEventData);
            this.alertService.showMessage("Success", `Successfully Deleted Record`, MessageSeverity.success);
        },err => {const errorLog = err;            
                  this.errorMessageHandler(errorLog);});
    }

    viewSelectedRow(rowData) {       
        this.selectedrepairOrderId  = rowData.repairOrderId;
        this.getROViewById(rowData.repairOrderId);
        this.getROPartsViewById(rowData.repairOrderId);
        this.getApproversListById(rowData.repairOrderId);
        this.getApprovalProcessListById(rowData.repairOrderId);
    }

    viewSelectedRowdbl(rowData) {
        this.viewSelectedRow(rowData);
        $('#roView').modal('show');
    }

    getROViewById(roId) {
        this.repairOrderService.getROViewById(roId).subscribe(res => {            
            this.roHeaderAdd = {
                ...res,
                shippingCost: res.shippingCost ? formatNumberAsGlobalSettingsModule(res.shippingCost, 2) : '0.00',
                handlingCost: res.handlingCost ? formatNumberAsGlobalSettingsModule(res.handlingCost, 2) : '0.00',
            };
            this.getVendorCapesByID(this.roHeaderAdd.vendorId);
            this.getManagementStructureCodes(res.managementStructureId);
        }, err => {			
			const errorLog = err;
			this.errorMessageHandler(errorLog);}
        );
    }
    getROPartsViewById(roId) {
		this.roPartsList = [];
        this.repairOrderService.getROPartsViewById(roId).subscribe(res => {          
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
                this.getManagementStructureCodesParent(partList);
                this.roPartsList.push(partList);
            });
        }
        , err => {			
			const errorLog = err;
			this.errorMessageHandler(errorLog);});
    }

    getRepairOrderSplit(partList) {
        if(partList.repairOrderSplitParts) {
			return partList.repairOrderSplitParts.map(y => {
				const splitpart = {
					...y,					
				}
				this.getManagementStructureCodesChild(splitpart);
				return splitpart;
			})
		}
    }
    getApproversListById(roId) {
        if(this.roApprovaltaskId == 0) {
            this.commonService.smartDropDownList('ApprovalTask', 'ApprovalTaskId', 'Name').subscribe(response => { 		        
            if(response) {					
                response.forEach(x => {
                    if (x.label.toUpperCase() == "RO APPROVAL") {
                        this.roApprovaltaskId = x.value;
                    }              
                });
            }
            },err => {               
                const errorLog = err;
                this.errorMessageHandler(errorLog);		
            });
            }
		this.isSpinnerVisible = true;
		this.repairOrderService.getROTotalCostById(roId).subscribe(res => {
			if(res) {
				this.roTotalCost = res.totalCost;			
				this.repairOrderService.getApproversListByTaskIdModuleAmt(this.roApprovaltaskId, this.roTotalCost).subscribe(res => {
					this.internalApproversList = res;
				})
			}
			this.isSpinnerVisible = false;
		}, err => {           
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        });
    }

    getVendorCapesByID(vendorId) {
		this.vendorCapesService.getVendorCapesById(vendorId).subscribe(res => {
			this.vendorCapesInfo = res;
        }, err => {			
			const errorLog = err;
			this.errorMessageHandler(errorLog);}
        )
	}

    globalSearch(value) {     
        const pageIndex = parseInt(this.lazyLoadEventDataInput.first) / this.lazyLoadEventDataInput.rows;;
        this.pageIndex = pageIndex;
        this.pageSize = this.lazyLoadEventDataInput.rows;
        this.lazyLoadEventDataInput.first = pageIndex;
        this.lazyLoadEventDataInput.globalFilter = value;
        this.filterText = value;

        this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.currentStatus };
        if (this.isEnableROList) {
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, vendorId: this.vendorId }
        }
        this.getList(this.lazyLoadEventDataInput);        
    }

    getDeleteListByStatus(value) {
        this.currentDeletedstatus = true;    
        const pageIndex = parseInt(this.lazyLoadEventDataInput.first) / this.lazyLoadEventDataInput.rows;;
        this.pageIndex = pageIndex;
        this.pageSize = this.lazyLoadEventDataInput.rows;
        this.lazyLoadEventDataInput.first = pageIndex;
        this.isSpinnerVisible = true;
        if (value == true) {
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.currentStatus };
            this.getList(this.lazyLoadEventDataInput);
        } else {
            this.currentDeletedstatus = false;  
            this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.currentStatus };
            this.getList(this.lazyLoadEventDataInput);
        }
    }

    restorerecord: any = {}
    restoreRecord() {
        this.commonService.updatedeletedrecords('RepairOrder', 'RepairOrderId', this.restorerecord.repairOrderId).subscribe(res => {
            this.getDeleteListByStatus(true)
            this.modal.close();
            this.alertService.showMessage("Success", `Successfully Updated Status`, MessageSeverity.success);
        },err => {const errorLog = err;
            this.isSpinnerVisible = false;
                        this.errorMessageHandler(errorLog);});
    }
    restore(content, rowData) {
        this.restorerecord = rowData;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });      
    }
    dismissModel() {
        this.modal.close();
    }

    getAuditHistoryById(rowData) {
        this.repairOrderService.getROHistory(rowData.repairOrderId).subscribe(res => {                     
            this.auditHistory = res;
        }, err => {			
			const errorLog = err;
			this.errorMessageHandler(errorLog);});
    }
    getColorCodeForHistory(i, field, value) {
        const data = this.auditHistory;
        const dataLength = data.length;
        if (i >= 0 && i <= dataLength) {
            if ((i + 1) === dataLength) {
                return true;
            } else {
                return data[i + 1][field] === value
            }
        }
    }

    closeViewModal() {
        $("#roView").modal("hide");
    }

    closeHistoryModal() {
        $("#roHistory").modal("hide");
    }

    closeDeleteModal() {
        $("#roDelete").modal("hide");
    }

    viewSelectedCapsRow(rowData) {       
        const {vcId} = rowData;
        this.getVendorCapabilitiesView(vcId);     
        this.getVendorCapesAircraftView(vcId);     
    }

    getVendorCapabilitiesView(vendorCapesId) {
		this.vendorCapesService.getVendorCapabilitybyId(vendorCapesId).subscribe(res => {			
			this.vendorCapesGeneralInfo = res;
		})
	}

	getVendorCapesAircraftView(vendorCapesId) {
		this.vendorCapesService.getVendorAircraftGetDataByCapsId(vendorCapesId).subscribe(res => {          
            this.aircraftListDataValues = res.map(x => {
                return {
                    ...x,
                    aircraft: x.aircraftType,
                    model: x.aircraftModel,
                    dashNumber: x.dashNumber,
                    memo: x.memo,
                }
            })
		},err => {const errorLog = err;
            this.isSpinnerVisible = false;
                        this.errorMessageHandler(errorLog);});
	}
}
