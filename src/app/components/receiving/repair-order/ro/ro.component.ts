import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { AuditHistory } from '../../../../models/audithistory.model';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatIcon } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MasterCompany } from '../../../../models/mastercompany.model';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../../services/auth.service';
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
import { MasterComapnyService } from '../../../../services/mastercompany.service';
import { VendorService } from '../../../../services/vendor.service';
import { fadeInOut } from '../../../../services/animations';
import { Router } from '@angular/router';
import { ReceivingService } from '../../../../services/receiving/receiving.service';
import { RepairOrder, DropDownData, StockLine, RepairOrderPart } from '../receiving-ro/RepairOrder.model';
import { LegalEntityService } from '../../../../services/legalentity.service';
import { ManagementStructure } from '../receiving-ro/managementstructure.model';
import { Manufacturer } from '../../../../models/manufacturer.model';
import { ManufacturerService } from '../../../../services/manufacturer.service';
import { UnitOfMeasureService } from '../../../../services/unitofmeasure.service';
import { ConditionService } from '../../../../services/condition.service';
import { GlAccount } from '../../../../models/GlAccount.model';
import { GlAccountService } from '../../../../services/glAccount/glAccount.service';
import { SiteService } from '../../../../services/site.service';
import { ShippingService } from '../../../../services/shipping/shipping-service';
import { BinService } from '../../../../services/bin.service';
//import { PurchaseOrderService } from '../../../../services/purchase-order.service';
import { VendorCapabilitiesService } from '../../../../services/vendorcapabilities.service';
import { CommonService } from '../../../../services/common.service';
import { listSearchFilterObjectCreation, formatNumberAsGlobalSettingsModule } from '../../../../generic/autocomplete';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-ro',
    templateUrl: './ro.component.html',
    styleUrls: ['./ro.component.scss'],
    animations: [fadeInOut]
})

export class RoComponent implements OnInit {

    cols: any[];
    roHeaderAdd: any = {};
    headerManagementStructure: any = {};
    roPartsList: any = [];
    approveList: any = [];
    vendorCapesInfo: any = [];
    vendorCapesCols: any[];
    selectedColumns: any[];
    selectedColumn: any[];
    allROlistInfo: any;
    repairOrderData: RepairOrderPart[] = [];
    managementStructure: ManagementStructure[];

    selectedRow: any;
    //purchaseOrderNumber: any = "";
    requestedBy: any = "";
    dateApprovied: any = "";
    approver: any = "";
    createdBy: any = "";
    updatedBy: any = "";
    createdDate: any = "";
    updatedDate: any = "";
    selectedActionName: any;
    disableSave: boolean;
    actionamecolle: any[] = [];
    poStatus: any[] = [];

    auditHisory: AuditHistory[];
    Active: string = "Active";

    @ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
    @ViewChild(MatSort,{static:false}) sort: MatSort;

    Status: string[] = ['Open', 'Pending', 'Fulfilling', 'Closed'];

    displayedColumns = ['currencyId', 'code', 'symbol', 'displayName', 'createdBy', 'updatedBy', 'updatedDate', 'createdDate'];
    dataSource: MatTableDataSource<any>;
    allCurrencyInfo: any[] = [];
    sourceAction: any = {};

    loadingIndicator: boolean;

    actionForm: FormGroup;
    title: string = "Create";
    id: number;

    private isEditMode: boolean = false;
    private isDeleteMode: boolean = false;
    allComapnies: MasterCompany[];
    private isSaving: boolean;
    modal: NgbModalRef;
    currencyName: string;
    filteredBrands: any[];
    localCollection: any[] = [];
    //allPurchaseorderInfo: PurchaseOrder;
    toggle_po_header: boolean = false;

    pageTitle: string = 'Purchase Order';
    ManufacturerList: DropDownData[];
    UOMList: any[];
    managementInfo: any[] = [];
    GLAccountList: GlAccount[];
    SiteList: any[];
    ShippingViaList: DropDownData[];
    lazyLoadEventData: any;
    pageSize: number = 10;
    pageIndex: number = 0;
    first = 0;
    totalRecords: number = 0;
    totalPages: number = 0;
    filterText: string = '';
    currentStatusRO: string = 'Open';
    lazyLoadEventDataInput: any;
    isSpinnerVisible: boolean = true;
    vendorCapesGeneralInfo: any = {};
    aircraftListDataValues: any;
    colsaircraftLD: any[] = [
        { field: "aircraft", header: "Aircraft" },
        { field: "model", header: "Model" },
        { field: "dashNumber", header: "Dash Numbers" },
        { field: "memo", header: "Memo" }
    ];
    breadcrumbs: MenuItem[];
    home: any;

    constructor(private receivingService: ReceivingService,
        private authService: AuthService,
        private _fb: FormBuilder,
        public _router: Router,
        private alertService: AlertService,
        private masterComapnyService: MasterComapnyService,
        private modalService: NgbModal,
        public vendorService: VendorService,
        private dialog: MatDialog,
        private legalEntityService: LegalEntityService,
        private manufacturerService: ManufacturerService,
        private uomService: UnitOfMeasureService,
        private conditionService: ConditionService,
        private glAccountService: GlAccountService,
        private siteService: SiteService,
        private shippingService: ShippingService,
        private binservice: BinService,
        //private purchaseOrderService: PurchaseOrderService,
        private vendorCapesService: VendorCapabilitiesService,
        private commonService: CommonService
    ) {

        //this.displayedColumns.push('action');
        //this.dataSource = new MatTableDataSource();
        this.vendorService.ShowPtab = false;
        this.vendorService.alertObj.next(this.vendorService.ShowPtab);
        this.vendorService.currentUrl = '/vendorsmodule/vendorpages/app-polist';
        this.vendorService.bredcrumbObj.next(this.vendorService.currentUrl);
    }

    ngOnInit() {
        // this.loadData();
        this.breadcrumbs = [
            { label: 'Receiving' },
            { label: 'Repair Order' },
        ];
        this.cols = [
            { field: 'repairOrderNumber', header: 'RO Num' },
            { field: 'status', header: 'Status' },
            { field: 'openDate', header: 'Open Date' },
            //{ field: 'closedDate', header: 'Closed/Cancelled Date' },
            { field: 'vendorName', header: 'Vendor Name' },
            { field: 'vendorCode', header: 'Vendor Code' },
            { field: 'vendorContact', header: 'Vendor Contact' },
            { field: 'requestedBy', header: 'Requested By' },
            { field: 'approvedBy', header: 'Approved By' },
        ];
        this.selectedColumns = this.cols;
        this.getStatus();
        this.vendorCapesCols = [
            { field: 'ranking', header: 'Ranking' },
            { field: 'partNumber', header: 'PN' },
            { field: 'partDescription', header: 'PN Description' },
            { field: 'capabilityType', header: 'Capability Type' },
            { field: 'cost', header: 'Cost' },
            { field: 'tat', header: 'TAT' },
            { field: 'name', header: 'PN Mfg' },
        ];
    }

    // ngAfterViewInit() {
    //     // this.dataSource.paginator = this.paginator;
    //     // this.dataSource.sort = this.sort;
    // }

    loadData(event) {
        this.lazyLoadEventData = event;
        const pageIndex = parseInt(event.first) / event.rows;;
        this.pageIndex = pageIndex;
        this.pageSize = event.rows;
        event.first = pageIndex;
        this.lazyLoadEventDataInput = event;

        event.filters = { ...event.filters, status: this.currentStatusRO }
        if(this.filterText == '') {
            this.getList(event);
        } else {
            this.globalSearch(this.filterText);
        }
        // this.allROlistInfo = [
        //     {'repairOrderNumber': 'RO1', 'statusId': 3},
        //     {'repairOrderNumber': 'RO2', 'statusId': 3},
        //     {'repairOrderNumber': 'RO3', 'statusId': 2}
        // ]
    //  this.vendorService.getReceivingROList().subscribe(res => {
    //         this.allROlistInfo = res;
    //     });
    }

    getList(data) {
        const PagingData = { ...data, filters: listSearchFilterObjectCreation(data.filters) }
        this.vendorService.getAllReceivingROList(PagingData).subscribe(res => {
            console.log(res);            
            this.allROlistInfo = res.results;
            if (this.allROlistInfo.length > 0) {
                this.totalRecords = res.totalRecordsCount;
                this.totalPages = Math.ceil(this.totalRecords / res.rows);
            } else {
                this.totalRecords = 0;
                this.totalPages = 0;
            }
            this.isSpinnerVisible = false;
        }, err => {
            this.isSpinnerVisible = false;
        })
    }

    onChangeInputField(value, el) {
        if (value === '') { el.classList.add("hidePlaceHolder"); }
        else el.classList.remove("hidePlaceHolder");
    }

    globalSearch(value) {
        this.pageIndex = 0;
        const pageIndex = parseInt(this.lazyLoadEventDataInput.first) / this.lazyLoadEventDataInput.rows;;
        this.pageIndex = pageIndex;
        this.pageSize = this.lazyLoadEventDataInput.rows;
        this.lazyLoadEventDataInput.first = pageIndex;
        this.lazyLoadEventDataInput.globalFilter = value;
        this.filterText = value;

        this.lazyLoadEventDataInput.filters = { ...this.lazyLoadEventDataInput.filters, status: this.currentStatusRO };
        this.getList(this.lazyLoadEventDataInput);

    //    this.pageIndex = 0;
    //    this.filterText = value;
    //    const PagingData = { ...this.lazyLoadEventData, filters: {}, globalFilter: value }
    //    this.vendorService.getReceivingROListGlobal(PagingData).subscribe(res => {
    //        console.log(res);            
    //        this.allROlistInfo = res.results;
    //        if (this.allROlistInfo.length > 0) {
    //            this.totalRecords = res.totalRecordsCount;
    //            this.totalPages = Math.ceil(this.totalRecords / res.rows);
    //        } else {
    //            this.totalRecords = 0;
    //            this.totalPages = 0;
    //        }
    //    })
   }

    getROListByStatus(status) {
        this.currentStatusRO = status;
        const pageIndex = 0;
        this.pageIndex = pageIndex;
        this.pageSize = this.lazyLoadEventData.rows;
        this.lazyLoadEventData.first = pageIndex; 
        this.lazyLoadEventData.filters = { ...this.lazyLoadEventData.filters, status: this.currentStatusRO };  
        this.getList(this.lazyLoadEventData);
    }

    openCreateRO() {
        this._router.navigateByUrl('/vendorsmodule/vendorpages/app-create-ro');
    }

    // editSelectedRO(rowData) {
    //     this._router.navigateByUrl(`/receivingmodule/receivingpages/app-edit-ro?repairOrderId=${rowData.repairOrderId}`);
    // }

    viewSelectedRow(rowData) {
        this.isSpinnerVisible = true;
        this.repairOrderData = [];
        this.getROViewById(rowData.repairOrderId);
        this.getROPartsViewById(rowData.repairOrderId);
        this.getApproversListById(rowData.repairOrderId);
        this.viewRepairOrder(rowData.repairOrderId);
    }

    public getSelectedRow(rowData) {
        //this.receivingService.purchaseOrderId = rowData.purchaseOrderId;
        // this._router.navigateByUrl('/receivingmodule/receivingpages/app-receiving-ro');
        this._router.navigateByUrl(`/receivingmodule/receivingpages/app-receiving-ro?repairOrderId=${rowData.repairOrderId}`);
    }

    getROViewById(roId) {
        this.vendorService.getROViewById(roId).subscribe(res => {
            console.log(res);
            this.roHeaderAdd = {
                ...res,
                shippingCost: res.shippingCost ? formatNumberAsGlobalSettingsModule(res.shippingCost, 2) : '0.00',
                handlingCost: res.handlingCost ? formatNumberAsGlobalSettingsModule(res.handlingCost, 2) : '0.00',
            };
            this.getVendorCapesByID(this.roHeaderAdd.vendorId);
            this.getManagementStructureCodes(res.managementStructureId);
            this.isSpinnerVisible = false;
        }, err => {
            this.isSpinnerVisible = false;
        });
    }
    getROPartsViewById(roId) {
		this.roPartsList = [];
        this.vendorService.getROPartsViewById(roId).subscribe(res => {
            console.log(res);  
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
        });
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
		this.vendorService.getROApproverList(roId).subscribe(response => {
			console.log(response);			
			this.approveList = response;
        });
    }

    getVendorCapesByID(vendorId) {
		this.vendorCapesService.getVendorCapesById(vendorId).subscribe(res => {
			this.vendorCapesInfo = res;
		})
	}

    getManagementStructureCodes(id) {
        this.commonService.getManagementStructureCodes(id).subscribe(res => {
            if (res.Level1) {
                this.headerManagementStructure.level1 = res.Level1;
            }
            if (res.Level2) {
                this.headerManagementStructure.level2 = res.Level2;
            }
            if (res.Level3) {
                this.headerManagementStructure.level3 = res.Level3;
            }
            if (res.Level4) {
                this.headerManagementStructure.level4 = res.Level4;
            }
        })
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
        })
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
        })
    }

    public editStockLine(rowData) {
        //this.receivingService.purchaseOrderId = rowData.purchaseOrderId;
        //return this._router.navigate(['/receivingmodule/receivingpages/app-edit-ro']);
        this._router.navigateByUrl(`/receivingmodule/receivingpages/app-edit-ro?repairOrderId=${rowData.repairOrderId}`);
    }

    public viewSummary(rowData) {
        this._router.navigateByUrl(`/receivingmodule/receivingpages/app-view-ro?repairOrderId=${rowData.repairOrderId}`);
    }


    // public applyFilter(filterValue: string) {
    //     this.dataSource.filter = filterValue;
    // }

    // private refresh() {
    //     // Causes the filter to refresh there by updating with recently added data.
    //     this.applyFilter(this.dataSource.filter);
    // }

    // private onDataLoadSuccessful(purchaseOrderList: any[]) {
    //     this.alertService.stopLoadingMessage();
    //     this.loadingIndicator = false;

    //     for (let purchaseOrder of purchaseOrderList) {
    //         let partIds: string[] = [];
    //         for (let part of purchaseOrder) {
    //             if (partIds.indexOf(part.itemMasterId) == -1) {
    //                 partIds.push(part.itemMasterId);
    //             }
    //         }
    //         purchaseOrder.noOfItems = partIds.length;
    //         purchaseOrder.statusId = purchaseOrder.statusId == null ? 0 : purchaseOrder.statusId;
    //         purchaseOrder.status = this.Status[purchaseOrder.statusId - 1];

    //         if (purchaseOrder.vendor != null && purchaseOrder.vendor.vendorContact != null && purchaseOrder.vendor.vendorContact.length > 0) {
    //             purchaseOrder.vendorName = purchaseOrder.vendor.vendorName;
    //             purchaseOrder.reference = purchaseOrder.vendor.vendorContractReference;

    //             let defaultContact = purchaseOrder.vendor.vendorContact.filter(x => x.isDefaultContact == true);
    //             if (defaultContact != null && defaultContact.length > 0 && defaultContact[0].contact != null) {

    //                 purchaseOrder.contactPhone = defaultContact[0].contact.mobilePhone;  //  ', header: 'Vendor Contact' },
    //                 purchaseOrder.vendorContact = defaultContact[0].contact.suffix +
    //                     defaultContact[0].contact.firstName + " " +
    //                     defaultContact[0].contact.middleName + " " +
    //                     defaultContact[0].contact.lastName;
    //             }
    //             else {
    //                 if (purchaseOrder.vendor.vendorContact[0].contact != null) {
    //                     purchaseOrder.contactPhone = purchaseOrder.vendor.vendorContact[0].contact.mobilePhone;  //  ', header: 'Vendor Contact' },
    //                     purchaseOrder.vendorContact = purchaseOrder.vendor.vendorContact[0].contact.prefix +
    //                         purchaseOrder.vendor.vendorContact[0].contact.firstName + " " +
    //                         purchaseOrder.vendor.vendorContact[0].contact.middleName + " " +
    //                         purchaseOrder.vendor.vendorContact[0].contact.lastName;
    //                 }
    //             }
    //         }

    //     }

    //     this.dataSource.data = purchaseOrderList;
    //     this.allROlistInfo = purchaseOrderList;
    // }

    private onDataLoadFailed(error: any) {
        // alert(error);
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

    }

    // private onDataMasterCompaniesLoadSuccessful(allComapnies: MasterCompany[]) {
    //     // alert('success');
    //     this.alertService.stopLoadingMessage();
    //     this.loadingIndicator = false;
    //     this.allComapnies = allComapnies;

    // }

    // public getSelectedRow(rowData) {
    //     this.receivingService.purchaseOrderId = rowData.purchaseOrderId;
    //     this._router.navigateByUrl('/receivingmodule/receivingpages/app-receivng-po');
    // }

    // private onDataLoadordrSuccessful(purchaseOrder: PurchaseOrder) {
    //     this.allPurchaseorderInfo = purchaseOrder;
    //     this.receivingService.selectedPurchaseorderCollection = this.allPurchaseorderInfo;
    //     this.vendorService.selectedPoCollection = this.allPurchaseorderInfo;
    // }

    // open() {

    //     this._router.navigateByUrl('/vendorsmodule/vendorpages/app-create-po')
    // }

    // openDelete(content, row) {

    //     this.isEditMode = false;
    //     this.isDeleteMode = true;
    //     this.sourceAction = row;
    //     this.modal = this.modalService.open(content, { size: 'sm' });
    //     this.modal.result.then(() => {
    //         console.log('When user closes');
    //     }, () => { console.log('Backdrop click') })
    // }

    // private loadMasterCompanies() {
    //     this.alertService.startLoadingMessage();
    //     this.loadingIndicator = true;

    //     this.masterComapnyService.getMasterCompanies().subscribe(
    //         results => this.onDataMasterCompaniesLoadSuccessful(results[0]),
    //         error => this.onDataLoadFailed(error)
    //     );

    // }

    // openEdit(row) {
    //     //this.vendorService.getpurchasevendorlist(row.purchaseOrderId).subscribe(
    //     //	results => this.onDataLoadordrSuccessful(results[0]),
    //     //	error => this.onDataLoadFailed(error)
    //     //);
    //     //this.modal = this.modalService.open(content, { size: 'sm' });
    //     //this.modal.result.then(() => {
    //     //	console.log('When user closes');
    //     //}, () => { console.log('Backdrop click') })
    // }

    // private onHistoryLoadSuccessful(auditHistory: AuditHistory[], content) {


    //     this.alertService.stopLoadingMessage();
    //     this.loadingIndicator = false;

    //     this.auditHisory = auditHistory;


    //     this.modal = this.modalService.open(content, { size: 'lg' });

    //     this.modal.result.then(() => {
    //         console.log('When user closes');
    //     }, () => { console.log('Backdrop click') })


    // }

    // openHelpText(content) {
    //     this.modal = this.modalService.open(content, { size: 'sm' });
    //     this.modal.result.then(() => {
    //         console.log('When user closes');
    //     }, () => { console.log('Backdrop click') })
    // }

    // eventHandler(event) {
    //     let value = event.target.value.toLowerCase();
    //     if (this.selectedActionName) {
    //         if (value == this.selectedActionName.toLowerCase()) {
    //             //alert("Action Name already Exists");
    //             this.disableSave = true;
    //         }
    //         else {
    //             this.disableSave = false;
    //         }
    //     }
    // }

    // partnmId(event) {
    //     //debugger;
    //     for (let i = 0; i < this.actionamecolle.length; i++) {
    //         if (event == this.actionamecolle[i][0].currencyName) {
    //             //alert("Action Name already Exists");
    //             this.disableSave = true;
    //             this.selectedActionName = event;
    //         }
    //     }
    // }

    // filterCurrency(event) {

    //     this.localCollection = [];
    //     for (let i = 0; i < this.allCurrencyInfo.length; i++) {
    //         let currencyName = this.allCurrencyInfo[i].code;
    //         if (currencyName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
    //             this.actionamecolle.push([{
    //                 "currencyId": this.allCurrencyInfo[i].currencyId,
    //                 "currencyName": currencyName
    //             }]),
    //                 this.localCollection.push(currencyName);
    //         }
    //     }
    // }

    // dismissModel() {
    //     this.isDeleteMode = false;
    //     this.isEditMode = false;
    //     this.modal.close();
    // }

    // private saveCompleted(user?: any) {
    //     this.isSaving = false;

    //     if (this.isDeleteMode == true) {
    //         this.alertService.showMessage("Success", `Action was deleted successfully`, MessageSeverity.success);
    //         this.isDeleteMode = false;
    //     }
    //     else {
    //         this.alertService.showMessage("Success", `Action was edited successfully`, MessageSeverity.success);

    //     }

    //     this.loadData();
    // }

    // private saveSuccessHelper(role?: any) {
    //     this.isSaving = false;
    //     this.alertService.showMessage("Success", `Action was created successfully`, MessageSeverity.success);

    //     this.loadData();

    // }

    // get userName(): string {
    //     return this.authService.currentUser ? this.authService.currentUser.userName : "";
    // }

    // private saveFailedHelper(error: any) {
    //     this.isSaving = false;
    //     this.alertService.stopLoadingMessage();
    //     this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
    //     this.alertService.showStickyMessage(error, null, MessageSeverity.error);
    // }

    private getStatus() {
        this.commonService.smartDropDownList('ROStatus', 'ROStatusId', 'Description').subscribe(response => {
            this.poStatus = response;
            this.poStatus = this.poStatus.sort((a,b) => (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0));
        });
        // this.poStatus = [];
        // this.poStatus.push(<DropDownData>{ Key: '1', Value: 'Open' });
        // this.poStatus.push(<DropDownData>{ Key: '2', Value: 'Pending Approval' });
        // this.poStatus.push(<DropDownData>{ Key: '3', Value: 'Approved' });
        // this.poStatus.push(<DropDownData>{ Key: '4', Value: 'Rejected' });
        // this.poStatus.push(<DropDownData>{ Key: '4', Value: 'Fulfilled' });
    }

    // //////////////////View Functionality///////////////////////////////

    // private dismissViewModel(): void {
    //     this.modal.close();
    // }

    private viewRepairOrder(repairOrderId: number): void {
        this.receivingService.getReceivingROPartsForViewById(repairOrderId).subscribe(
            results => {
                console.log(results);                
                this.repairOrderData = results;
                // this.repairOrderData.openDate = new Date(results[0].openDate).toLocaleDateString();
                // this.repairOrderData.needByDate = new Date(results[0].needByDate);
                // this.repairOrderData.dateApproved = new Date(results[0].dateApproved).toLocaleDateString();

                this.getManagementStructure().subscribe(
                    results => {
                        this.managementStructure = results[0];
                        var allParentParts = this.repairOrderData.filter(x => x.isParent == true);
                        for (let parent of allParentParts) {
                            var splitParts = this.repairOrderData.filter(x => !x.isParent && x.itemMaster.partNumber == parent.itemMaster.partNumber);

                            if (splitParts.length > 0) {

                                parent.hasChildren = true;
                                parent.quantityOrdered = 0;
                                for (let childPart of splitParts) {
                                    parent.stockLineCount += childPart.stockLineCount;
                                    childPart.managementStructureId = parent.managementStructureId;
                                    childPart.managementStructureName = parent.managementStructureName;
                                    parent.quantityOrdered += childPart.quantityOrdered;
                                }
                            }
                            else {
                                parent.hasChildren = false;
                            }
                        }


                        for (let part of this.repairOrderData) {
                            part.toggleIcon = false;
                            part.currentSLIndex = 0;
                            part.currentTLIndex = 0;
                            part.currentSERIndex = 0;
                            part.visible = false;
                            part.showStockLineGrid = false;

                            part.isEnabled = false;
                            part.conditionId = 0;
                            let managementHierarchy: ManagementStructure[][] = [];
                            let selectedManagementStructure: ManagementStructure[] = [];
                            this.getManagementStructureHierarchy(part.managementStructureId, managementHierarchy, selectedManagementStructure);
                            managementHierarchy.reverse();
                            selectedManagementStructure.reverse();

                            if (managementHierarchy[0] != undefined && managementHierarchy[0].length > 0) {
                                part.companyId = selectedManagementStructure[0].managementStructureId;
                                var management = managementHierarchy[0].filter(x => x.managementStructureId == part.companyId)[0];
                                part.companyText = management != undefined ? management.code : '';

                                part.CompanyList = [];
                                for (let managementStruct of managementHierarchy[0]) {
                                    var dropdown = new DropDownData();
                                    dropdown.Key = managementStruct.managementStructureId.toLocaleString();
                                    dropdown.Value = managementStruct.code;
                                    part.CompanyList.push(dropdown);
                                }
                            }
                            if (managementHierarchy[1] != undefined && managementHierarchy[1].length > 0) {
                                part.businessUnitId = selectedManagementStructure[1].managementStructureId;
                                var management = managementHierarchy[1].filter(x => x.managementStructureId == part.businessUnitId)[0];
                                part.businessUnitText = management != undefined ? management.code : '';

                                part.BusinessUnitList = [];
                                for (let managementStruct of managementHierarchy[1]) {
                                    var dropdown = new DropDownData();
                                    dropdown.Key = managementStruct.managementStructureId.toLocaleString();
                                    dropdown.Value = managementStruct.code;
                                    part.BusinessUnitList.push(dropdown);
                                }
                            }
                            if (managementHierarchy[2] != undefined && managementHierarchy[2].length > 0) {
                                part.divisionId = selectedManagementStructure[2].managementStructureId;
                                var management = managementHierarchy[2].filter(x => x.managementStructureId == part.divisionId)[0];
                                part.divisionText = management != undefined ? management.code : '';
                                part.DivisionList = [];
                                for (let managementStruct of managementHierarchy[2]) {
                                    var dropdown = new DropDownData();
                                    dropdown.Key = managementStruct.managementStructureId.toLocaleString();
                                    dropdown.Value = managementStruct.code;
                                    part.DivisionList.push(dropdown);
                                }
                            }
                            if (managementHierarchy[3] != undefined && managementHierarchy[3].length > 0) {
                                part.departmentId = selectedManagementStructure[3].managementStructureId;
                                var management = managementHierarchy[3].filter(x => x.managementStructureId == part.departmentId)[0];
                                part.departmentText = management != undefined ? management.code : '';

                                part.DepartmentList = [];
                                for (let managementStruct of managementHierarchy[3]) {
                                    var dropdown = new DropDownData();
                                    dropdown.Key = managementStruct.managementStructureId.toLocaleString();
                                    dropdown.Value = managementStruct.code;
                                    part.DepartmentList.push(dropdown);
                                }
                            }

                            if (part.stockLine != null) {
                                for (var SL of part.stockLine) {
                                    console.log(SL.managementStructureEntityId);
                                    this.commonService.getManagementStructureCodes(SL.managementStructureEntityId).subscribe(res => {
                                        if (res.Level1) {
                                            SL.companyText = res.Level1;
                                        }
                                        if (res.Level2) {
                                            SL.businessUnitText = res.Level2;
                                        }
                                        if (res.Level3) {
                                            SL.divisionText = res.Level3;
                                        }
                                        if (res.Level4) {
                                            SL.departmentText = res.Level4;
                                        }
                                    })
                                    
                                    // SL.isEnabled = false;
                                    // let stockLinemanagementHierarchy: ManagementStructure[][] = [];
                                    // let stockLineSelectedManagementStructure: ManagementStructure[] = [];
                                    // this.getManagementStructureHierarchy(SL.managementStructureEntityId, stockLinemanagementHierarchy, stockLineSelectedManagementStructure);
                                    // stockLinemanagementHierarchy.reverse();
                                    // stockLineSelectedManagementStructure.reverse();

                                    // if (stockLinemanagementHierarchy[0] != undefined && stockLinemanagementHierarchy[0].length > 0) {
                                    //     SL.companyId = stockLineSelectedManagementStructure[0].managementStructureId;
                                    //     var management = managementHierarchy[0].filter(x => x.managementStructureId == part.companyId)[0];
                                    //     SL.companyText = management != undefined ? management.code : '';

                                    //     SL.CompanyList = [];
                                    //     for (let managementStruct of stockLinemanagementHierarchy[0]) {
                                    //         var dropdown = new DropDownData();
                                    //         dropdown.Key = managementStruct.managementStructureId.toLocaleString();
                                    //         dropdown.Value = managementStruct.code;
                                    //         SL.CompanyList.push(dropdown);
                                    //     }
                                    // }
                                    // if (stockLinemanagementHierarchy[1] != undefined && stockLinemanagementHierarchy[1].length > 0) {

                                    //     SL.businessUnitId = stockLineSelectedManagementStructure[1].managementStructureId;
                                    //     var management = managementHierarchy[1].filter(x => x.managementStructureId == part.businessUnitId)[0];
                                    //     SL.businessUnitText = management != undefined ? management.code : '';

                                    //     SL.BusinessUnitList = [];
                                    //     for (let managementStruct of stockLinemanagementHierarchy[1]) {
                                    //         var dropdown = new DropDownData();
                                    //         dropdown.Key = managementStruct.managementStructureId.toLocaleString();
                                    //         dropdown.Value = managementStruct.code;
                                    //         SL.BusinessUnitList.push(dropdown);
                                    //     }
                                    // }
                                    // if (stockLinemanagementHierarchy[2] != undefined && stockLinemanagementHierarchy[2].length > 0) {
                                    //     SL.divisionId = stockLineSelectedManagementStructure[2].managementStructureId;
                                    //     var management = managementHierarchy[2].filter(x => x.managementStructureId == part.divisionId)[0];
                                    //     SL.divisionText = management != undefined ? management.code : '';

                                    //     SL.DivisionList = [];
                                    //     for (let managementStruct of stockLinemanagementHierarchy[2]) {
                                    //         var dropdown = new DropDownData();
                                    //         dropdown.Key = managementStruct.managementStructureId.toLocaleString();
                                    //         dropdown.Value = managementStruct.code;
                                    //         SL.DivisionList.push(dropdown);
                                    //     }
                                    // }
                                    // if (stockLinemanagementHierarchy[3] != undefined && stockLinemanagementHierarchy[3].length > 0) {
                                    //     SL.departmentId = stockLineSelectedManagementStructure[3].managementStructureId;
                                    //     var management = managementHierarchy[3].filter(x => x.managementStructureId == part.departmentId)[0];
                                    //     SL.departmentText = management != undefined ? management.code : '';

                                    //     SL.DepartmentList = [];
                                    //     for (let managementStruct of stockLinemanagementHierarchy[3]) {
                                    //         var dropdown = new DropDownData();
                                    //         dropdown.Key = managementStruct.managementStructureId.toLocaleString();
                                    //         dropdown.Value = managementStruct.code;
                                    //         SL.DepartmentList.push(dropdown);
                                    //     }
                                    // }                                                               
                                }

                            }

                        }

                        // this.repairOrderData.dateRequested = new Date(); //new Date(this.repairOrderData.dateRequested);
                        // this.repairOrderData.dateApprovied = new Date(this.repairOrderData.dateApprovied);
                        // this.repairOrderData.needByDate = new Date(); //new Date(this.repairOrderData.needByDate);
                        // this.getStatus();
                        // this.getUOMList();
                        // this.getAllSite();
                        // this.getAllGLAccount();
                    },
                    error => this.onDataLoadFailed(error)
                );
            },
            error => {
                this.alertService.showMessage(this.pageTitle, "Something went wrong while loading the Repair Order detail", MessageSeverity.error);
                //return this.route.navigate(['/receivingmodule/receivingpages/app-purchase-order']);
            }
        );
    }

    private getManagementStructure() {
        return this.legalEntityService.getManagemententity();
    }

    // private getUOMList() {
    //     this.uomService.getUnitOfMeasureList().subscribe(
    //         result => {
    //             this.UOMList = result[0];
    //             for (var part of this.repairOrderData) {
    //                 var uom = this.UOMList.filter(x => x.unitOfMeasureId == part.uomId)[0];
    //                 if (uom != undefined) {
    //                     part.UOMText = uom.shortName;
    //                 }
    //             }
    //         }
    //     );
    // }

    private getManagementStructureHierarchy(managementStructureId: number, managementStructureHierarchy: ManagementStructure[][], selectedManagementStructure: ManagementStructure[]) {

        var selectedManagementStructures = this.managementStructure.filter(function (management) {
            return management.managementStructureId == managementStructureId;
        });

        if (selectedManagementStructures != undefined && selectedManagementStructures.length > 0) {
            var selectedMangStruc = selectedManagementStructures[0];

            if (selectedMangStruc.parentId != null) {
                var selectedMSList = this.managementStructure.filter(function (management) {
                    return management.parentId == selectedMangStruc.parentId;
                });

                if (managementStructureHierarchy != null) {
                    managementStructureHierarchy.push(selectedMSList);
                }

                if (selectedManagementStructure != null) {
                    selectedManagementStructure.push(selectedMangStruc);
                }

                this.getManagementStructureHierarchy(selectedMangStruc.parentId, managementStructureHierarchy, selectedManagementStructure);
            }
            else {
                var selectedMSList = this.managementStructure.filter(function (management) {
                    return management.parentId == null;
                });

                if (managementStructureHierarchy != null) {
                    managementStructureHierarchy.push(selectedMSList);
                }

                if (selectedManagementStructure != null) {
                    selectedManagementStructure.push(selectedMangStruc);
                }
            }
        }
    }

    // private getAllSite(): void {
    //     this.siteService.getSiteList().subscribe(
    //         results => {
    //             this.SiteList = results[0];
    //             for (var part of this.repairOrderData) {
    //                 if (part.stockLine) {
    //                     part.siteId = 0;
    //                     part.warehouseId = 0;
    //                     part.locationId = 0;
    //                     part.shelfId = 0;
    //                     part.binId = 0;
    //                     part.SiteList = [];
    //                     for (var site of results[0]) {
    //                         var row = new DropDownData();
    //                         row.Key = site.siteId.toLocaleString();
    //                         row.Value = site.name;
    //                         part.SiteList.push(row);
    //                     }

    //                     for (var SL of part.stockLine) {
    //                         SL.SiteList = [];

    //                         for (var site of results[0]) {
    //                             var row = new DropDownData();
    //                             row.Key = site.siteId.toLocaleString();
    //                             row.Value = site.name;
    //                             SL.SiteList.push(row);
    //                         }
    //                         //var filterSite = SL.SiteList.filter(x => x.Key == SL.siteId.toString())[0];

    //                         //if (filterSite) {
    //                         //    SL.siteText = filterSite.Value;
    //                         //}

    //                         if (SL.warehouseId > 0) {
    //                             this.getStockLineWareHouse(SL, true);
    //                         }

    //                         if (SL.locationId > 0) {
    //                             this.getStockLineLocation(SL, true);
    //                         }
    //                         //var filterWareHouse = SL.WareHouseList.filter(x => x.Key == SL.warehouseId.toString())[0];
    //                         //if (filterWareHouse) {
    //                         //    SL.wareHouseText = filterWareHouse.Value;
    //                         //}
    //                         if (SL.shelfId > 0) {
    //                             this.getStockLineShelf(SL, true);
    //                         }

    //                         //var filterLocation = SL.LocationList.filter(x => x.Key == SL.locationId.toString())[0];
    //                         //if (filterLocation) {
    //                         //    SL.locationText = filterLocation.Value;
    //                         //}

    //                         if (SL.binId > 0) {
    //                             this.getStockLineBin(SL, true);
    //                         }

    //                         //var filterShelf = SL.ShelfList.filter(x => x.Key == SL.shelfId.toString())[0];
    //                         //if (filterShelf) {
    //                         //    SL.shelfText = filterShelf.Value;
    //                         //}

    //                     }
    //                 }
    //             }
    //         },
    //         error => this.onDataLoadFailed(error)
    //     );
    // }

    // private getAllGLAccount(): void {
    //     this.glAccountService.getAll().subscribe(glAccountData => {
    //         this.GLAccountList = glAccountData[0];

    //         for (var part of this.repairOrderData) {
    //             if (part.stockLine) {
    //                 for (var SL of part.stockLine) {
    //                     if (SL.glAccountId > 0) {
    //                         var glAccount = this.GLAccountList.filter(x => x.glAccountId == SL.glAccountId)[0];
    //                         SL.glAccountText = glAccount.accountCode + "-" + glAccount.accountName;
    //                     }
    //                 }
    //             }
    //         }

    //     });
    // }

    private getStockLineWareHouse(stockLine: StockLine, onPageLoad: boolean): void {
        stockLine.WareHouseList = [];
        stockLine.LocationList = [];
        stockLine.ShelfList = [];
        stockLine.BinList = [];

        if (!onPageLoad) {
            stockLine.warehouseId = 0;
            stockLine.locationId = 0;
            stockLine.shelfId = 0;
            stockLine.binId = 0;
        }

        this.binservice.getWareHouseBySiteId(stockLine.siteId).subscribe(
            results => {
                for (let wareHouse of results) {
                    var dropdown = new DropDownData();
                    dropdown.Key = wareHouse.warehouseId.toLocaleString();
                    dropdown.Value = wareHouse.warehouseName;
                    stockLine.WareHouseList.push(dropdown);
                }
            },
            error => this.onDataLoadFailed(error)
        );
    }

    private getStockLineLocation(stockLine: StockLine, onPageLoad: boolean): void {
        stockLine.LocationList = [];
        stockLine.ShelfList = [];
        stockLine.BinList = [];

        if (!onPageLoad) {
            stockLine.locationId = 0;
            stockLine.shelfId = 0;
            stockLine.binId = 0;
        }

        this.binservice.getLocationByWareHouseId(stockLine.warehouseId).subscribe(
            results => {
                console.log(results);
                for (let loc of results) {
                    var dropdown = new DropDownData();
                    dropdown.Key = loc.locationId.toLocaleString();
                    dropdown.Value = loc.name;
                    stockLine.LocationList.push(dropdown);
                }
            },
            error => this.onDataLoadFailed(error)
        );
    }

    private getStockLineShelf(stockLine: StockLine, onPageLoad: boolean): void {
        stockLine.ShelfList = [];
        stockLine.BinList = [];

        if (!onPageLoad) {
            stockLine.shelfId = 0;
            stockLine.binId = 0;
        }

        this.binservice.getShelfByLocationId(stockLine.locationId).subscribe(
            results => {

                for (let shelf of results) {
                    var dropdown = new DropDownData();
                    dropdown.Key = shelf.shelfId.toLocaleString();
                    dropdown.Value = shelf.name;
                    stockLine.ShelfList.push(dropdown);
                }
            },
            error => this.onDataLoadFailed(error)
        );
    }

    private getStockLineBin(stockLine: StockLine, onPageLoad: boolean): void {
        stockLine.BinList = [];

        if (!onPageLoad) {
            stockLine.binId = 0;
        }

        this.binservice.getBinByShelfId(stockLine.shelfId).subscribe(
            results => {
                for (let bin of results) {
                    var dropdown = new DropDownData();
                    dropdown.Key = bin.binId.toLocaleString();
                    dropdown.Value = bin.name;
                    stockLine.BinList.push(dropdown);
                }
            },
            error => this.onDataLoadFailed(error)
        );
    }

    resetROForView() {
        this.repairOrderData = [];
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
		})
	}
    
}