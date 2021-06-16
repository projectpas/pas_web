import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { fadeInOut } from '../../../../services/animations';
import { CustomerService } from '../../../../services/customer.service';
import { CommonService } from '../../../../services/common.service';
import { StocklineService } from '../../../../services/stockline.service';
import { ItemMasterService } from '../../../../services/itemMaster.service';
import { NgbModal, NgbActiveModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { formatNumberAsGlobalSettingsModule } from '../../../../generic/autocomplete';
import * as moment from 'moment';
import { ConfigurationService } from '../../../../services/configuration.service';

@Component({
    selector: 'app-stockline-view',
    templateUrl: './stockline-view.component.html',
    styleUrls: ['./stockline-view.component.scss'],
    animations: [fadeInOut],
    providers: [DatePipe]
})

export class StocklineViewComponent implements OnInit {

    @Input() stockLineId;

    viewSLInfo: any = {};
    sourceTimeLife: any = {};
    managementStructure: any = {};
    isSpinnerVisible: boolean = true;
    timeLifeCyclesId: number;
    allDocumentsList: any = [];
    alDocumentsListOriginal: any = [];
    deletedDocumentList: any[] = [];
    isShowDeletedList: boolean = false;
    documentTableColumns: any[] = [
        { field: "docName", header: "Name" },
        { field: "docDescription", header: "Description" },
        { field: "docMemo", header: "Memo" },

        { field: "fileName", header: "File Name" },
        { field: "fileSize", header: "File Size" },

        { field: 'createdDate', header: 'Created Date' },
        { field: 'createdBy', header: 'CreatedBy' },
        { field: 'updatedDate', header: 'Updated Date' },
        { field: 'updatedBy', header: 'UpdatedBy' },
        { field: 'download', header: 'Actions' },
    ];
    sourceViewforDocumentAudit: any = [];
    pageSize: number = 3;

    constructor(private workFlowtService: StocklineService
        , private activeModal: NgbActiveModal, private itemMasterService: ItemMasterService,
        private commonService: CommonService, private datePipe: DatePipe, private configurations: ConfigurationService) {

    }
    ngOnInit(): void {
        this.load(this.stockLineId);
    }
    dismissModel() {
        this.activeModal.close();
    }

    load(stockLineId: any): void {
        this.isSpinnerVisible = true;
        this.viewSLInfo = {};
        this.sourceTimeLife = {};
        this.workFlowtService.getStockLineDetailsById(stockLineId).subscribe(res => {
            this.viewSLInfo = {
                ...res,
                certifiedDate: res.certifiedDate ? this.datePipe.transform(res.certifiedDate, "MM/dd/yyyy") : '',
                certifiedDueDate: res.certifiedDueDate ? this.datePipe.transform(res.certifiedDueDate, "MM/dd/yyyy") : '',
                manufacturingDate: res.manufacturingDate ? this.datePipe.transform(res.manufacturingDate, "MM/dd/yyyy") : '',
                orderDate: res.orderDate ? this.datePipe.transform(res.orderDate, "MM/dd/yyyy") : '',
                receivedDate: res.receivedDate ? this.datePipe.transform(res.receivedDate, "MM/dd/yyyy") : '',
                inspectionDate: res.inspectionDate ? this.datePipe.transform(res.inspectionDate, "MM/dd/yyyy") : '',
                entryDate: res.entryDate ? this.datePipe.transform(res.entryDate, "MM/dd/yyyy") : '',
                expirationDate: res.expirationDate ? this.datePipe.transform(res.expirationDate, "MM/dd/yyyy") : '',
                tagDate: res.tagDate ? this.datePipe.transform(res.tagDate, "MM/dd/yyyy") : '',
                shelfLifeExpirationDate: res.shelfLifeExpirationDate ? this.datePipe.transform(res.shelfLifeExpirationDate, "MM/dd/yyyy") : '',
                receiverNumber: res.receiver,
                purchaseUnitOfMeasureId:res.purchaseUnitOfMeasureId ,
                unitOfMeasure:res.unitOfMeasure,
                vendorId:res.vendorId,
                serialNumber:res.serialNumber,
                quantityOnHand: (res.quantityOnHand || res.quantityOnHand == 0) ? formatNumberAsGlobalSettingsModule(res.quantityOnHand, 0) : '',
                quantityReserved: (res.quantityReserved || res.quantityReserved == 0) ? formatNumberAsGlobalSettingsModule(res.quantityReserved, 0) : '',
                quantityIssued: (res.quantityIssued || res.quantityIssued == 0) ? formatNumberAsGlobalSettingsModule(res.quantityIssued, 0) : '',
                quantityAvailable: (res.quantityAvailable || res.quantityAvailable == 0) ? formatNumberAsGlobalSettingsModule(res.quantityAvailable, 0) : '',
                purchaseOrderUnitCost: res.purchaseOrderUnitCost ? formatNumberAsGlobalSettingsModule(res.purchaseOrderUnitCost, 2) : '0.00',
                repairOrderUnitCost: res.repairOrderUnitCost ? formatNumberAsGlobalSettingsModule(res.repairOrderUnitCost, 2) : '0.00',
                unitSalesPrice: res.unitSalesPrice ? formatNumberAsGlobalSettingsModule(res.unitSalesPrice, 2) : '0.00',
                coreUnitCost: res.coreUnitCost ? formatNumberAsGlobalSettingsModule(res.coreUnitCost, 2) : '0.00',
                lotCost: res.lotCost ? formatNumberAsGlobalSettingsModule(res.lotCost, 2) : '0.00',
                unitCost: res.unitCost ? formatNumberAsGlobalSettingsModule(res.unitCost, 2) : '0.00',
            }

            this.onPartNumberSelectedOnEdit(res.itemMasterId);

            this.getManagementStructureNameandCodes(res.managementStructureId);
            this.toGetVendorCertifiedDocumentsList(stockLineId);
            this.getDeletedList(stockLineId);

            if (res.timelIfeData != null && res.timelIfeData != 0 && res.timelIfeData != undefined) {
                this.timeLifeCyclesId = res.timelIfeData.timeLifeCyclesId;
                this.sourceTimeLife = res.timelIfeData;
            }

            this.isSpinnerVisible = false;
        }, error => this.saveFailedHelper(error));
    }

    onPartNumberSelectedOnEdit(itemMasterId) {
		this.itemMasterService.getDataForStocklineByItemMasterId(itemMasterId).subscribe(res => {
			const partDetails = res;
			this.viewSLInfo.tagDays = partDetails.tagDays;
			this.viewSLInfo.manufacturingDays = partDetails.manufacturingDays;
			this.viewSLInfo.daysReceived = partDetails.daysReceived;
			this.viewSLInfo.openDays = partDetails.openDays;
			this.viewSLInfo.timeLife = partDetails.isTimeLife;
			this.viewSLInfo.revisedPart = partDetails.revisedPart;
			this.viewSLInfo.itemGroup = partDetails.itemGroup;
			this.viewSLInfo.glAccountName = partDetails.glAccount;
			this.viewSLInfo.isSerialized = partDetails.isSerialized;
		}, error => this.saveFailedHelper(error));
	}

    getManagementStructureNameandCodes(id) {
        this.commonService.getManagementStructureNameandCodes(id).subscribe(res => {
            if (res.Level1) {
                this.managementStructure.level1 = res.Level1;
            } else {
                this.managementStructure.level1 = '-';
            }
            if (res.Level2) {
                this.managementStructure.level2 = res.Level2;
            } else {
                this.managementStructure.level2 = '-';
            }
            if (res.Level3) {
                this.managementStructure.level3 = res.Level3;
            } else {
                this.managementStructure.level3 = '-';
            }
            if (res.Level4) {
                this.managementStructure.level4 = res.Level4;
            } else {
                this.managementStructure.level4 = '-';
            }
        }, error => this.saveFailedHelper(error))
    }

    toGetVendorCertifiedDocumentsList(stockLineId) {
        var moduleId = 53;
        this.commonService.GetDocumentsListNew(stockLineId, moduleId).subscribe(res => {
            this.allDocumentsList = res;
            this.alDocumentsListOriginal = res;
        }, error => this.saveFailedHelper(error))
    }

    getDeletedList(id) {
		var moduleId = 53;
        this.commonService.GetDocumentsListNew(id, moduleId, true).subscribe(res => {
            this.deletedDocumentList = res || [];

            if (this.deletedDocumentList.length > 0) {
                this.deletedDocumentList.forEach(item => {
                    item["isFileFromServer"] = true;
                    item["moduleId"] = 53;
                })
            }
        })
	}

    dateFilterForTable(date, field) {

        if (date !== '' && moment(date).format('MMMM DD YYYY')) {
            this.allDocumentsList = this.alDocumentsListOriginal;
            const data = [...this.allDocumentsList.filter(x => {
                console.log(moment(x.createdDate).format('MMMM DD YYYY'), moment(date).format('MMMM DD YYYY'));

                if (moment(x.createdDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'createdDate') {
                    return x;
                } else if (moment(x.updatedDate).format('MMMM DD YYYY') === moment(date).format('MMMM DD YYYY') && field === 'updatedDate') {
                    return x;
                }
            })]
            this.allDocumentsList = data;
        } else {
            this.allDocumentsList = this.alDocumentsListOriginal;
        }
    }

    downloadFileUpload(rowData) {
        const url = `${this.configurations.baseUrl}/api/FileUpload/downloadattachedfile?filePath=${rowData.link}`;
        window.location.assign(url);
    }

    getPageCount(totalNoofRecords, viewPageSize) {
        return Math.ceil(totalNoofRecords / viewPageSize)
    }

    openHistoryDoc(rowData) {
        this.commonService.GetAttachmentAudit(rowData.attachmentDetailId).subscribe(
            res => {
                this.sourceViewforDocumentAudit = res;
            }, error => this.saveFailedHelper(error))
    }
    getColorCodeForHistoryDoc(i, field, value) {
        const data = this.sourceViewforDocumentAudit;
        const dataLength = data.length;
        if (i >= 0 && i <= dataLength) {
            if ((i + 1) === dataLength) {
                return true;
            } else {
                return data[i + 1][field] === value
            }
        }
    }

    private saveFailedHelper(error: any) {
        this.isSpinnerVisible = false;
    }

}