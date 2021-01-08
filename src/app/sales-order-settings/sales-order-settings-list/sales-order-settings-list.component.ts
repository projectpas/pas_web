import { Component, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Subject } from "rxjs";
import { SalesQuoteService } from '../../services/salesquote.service';
import { takeUntil } from 'rxjs/operators';
import { AlertService, MessageSeverity } from "../../services/alert.service";
import { AuthService } from "../../services/auth.service";
import { SalesOrderService } from "../../services/salesorder.service";
import { SOSettingsModel } from "../../components/sales/quotes/models/verify-sales-quote-model";
import { DatePipe } from "@angular/common";
import * as $ from "jquery";
@Component({
    selector: 'app-sales-order-settings-list',
    templateUrl: './sales-order-settings-list.component.html',
    styleUrls: ['./sales-order-settings-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
/** sales-order-settings-list component*/
export class SalesOrderSettingsListComponent {
    title: string = "SO settings";
    soqSettingsList: any = [];
    auditHistory: any = [];
    modal: NgbModalRef;
    isSpinnerVisible = false;
    targetData: any;
    private onDestroy$: Subject<void> = new Subject<void>();
    selectedGridColumn: any[];
    disableCreateNewSettings = false;
    selectedGridColumns: any[] = [
        { field: 'typeName', header: 'SO Type' },
        { field: 'prefix', header: 'Prefix' },
        { field: 'sufix', header: 'Suffix' },
        { field: 'startCode', header: 'Start Code' },
        { field: 'defaultStatusName', header: 'SO Status' },
        { field: 'defaultPriorityName', header: 'Priority' }
    ];
    gridColumns = [
        { field: 'typeName', header: 'SO Type' },
        { field: 'prefix', header: 'Prefix' },
        { field: 'sufix', header: 'Suffix' },
        { field: 'startCode', header: 'Start Code' },
        { field: 'defaultStatusName', header: 'SO Status' },
        { field: 'defaultPriorityName', header: 'Priority' }
    ];
    pageSize: number = 10;
    pageIndex: number = 0;
    first = 0;
    data: any;
    filteredText: string;
    totalRecords: number = 0;
    totalPages: number = 0;
    selected;
    selectedOnly: boolean = false;

    constructor(private router: ActivatedRoute,
        public customerService: CustomerService,
        public salesQuoteService: SalesQuoteService,
        public salesOrderService: SalesOrderService,
        public alertService: AlertService,
        private modalService: NgbModal,
        public authService: AuthService,
        private route: Router,
        private datePipe: DatePipe) {
    }

    ngOnInit() {
        this.selectedGridColumns = this.gridColumns;
        this.getAllSOSettings();
    }

    closeModal() {
        $("#downloadConfirmation").modal("hide");
    }
    ngOnChange() {
    }

    columnsChanges() {
        // this.refreshList();
    }

    globalSearch(value) {
        this.pageIndex = 0;
        this.filteredText = value;
        this.customerService.getGlobalSearch(value, this.pageIndex, this.pageSize).subscribe(res => {
            this.data = res;
            if (res.length > 0) {
                this.totalRecords = res[0].totalRecords;
                this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            }
        })
    }

    getAuditHistoryById(rowData) {
        this.isSpinnerVisible = true;
        this.salesOrderService.getSOSettingHistory(rowData.salesOrderSettingId)
            .subscribe(
                (res: any[]) => {
                    this.isSpinnerVisible = false;
                    this.auditHistory = res;
                }, error => {
                    this.isSpinnerVisible = false;
                }
            )
    }

    get userName(): string {
        return this.authService.currentUser
            ? this.authService.currentUser.userName
            : "";
    }

    edit(rowData) {
        this.salesOrderService.isEditSOSettingsList = true;
        let editeddRow = this.soqSettingsList.find(setting => setting.accountTypeId == rowData.accountTypeId);
        this.salesOrderService.soSettingsData = editeddRow;
        this.route.navigateByUrl(`salesordersettingsmodule/salesordersettings/app-create-sales-order-settings`);
    }

    deleteSettings() {
        this.isSpinnerVisible = true;
        this.salesOrderService.deleteSoSetting(this.selected, this.userName).subscribe(response => {
            this.isSpinnerVisible = false;
            this.getAllSOSettings();
            this.dismissModel();
            this.salesOrderService.soSettingsData = new SOSettingsModel();
            this.alertService.showMessage(
                'SO Settings',
                `Succesfully deleted setting`,
                MessageSeverity.success
            );
        }, error => {
            this.dismissModel();
            this.isSpinnerVisible = false;
            this.alertService.showMessage(
                'SO Settings',
                error,
                MessageSeverity.error
            );
        })
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

    getAllSOSettings(): void {
        // this.soqSettingsList = [];
        this.isSpinnerVisible = true;
        this.salesOrderService.getAllSalesOrderSettings().pipe(takeUntil(this.onDestroy$)).subscribe(
            result => {
                this.isSpinnerVisible = false;
                let response: any = result;
                this.soqSettingsList = response;
                if (response && response.length > 0) {
                    this.totalRecords = response.length;
                    this.disableCreateNewSettings = true;
                } else {
                    this.totalRecords = 0;
                    this.disableCreateNewSettings = false;
                }

                this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
            }, error => {
                this.isSpinnerVisible = false;
            }
        );
    }

    dismissModel() {
        if (this.modal != undefined)
            this.modal.close();
    }

    AddPage() {
        this.route.navigateByUrl('/salesordersettingsmodule/salesordersettings/app-create-sales-order-settings');
    }
    openEdit(row) {
        this.route.navigateByUrl('/salesordersettingsmodule/salesordersettings/app-create-sales-order-settings');
    }

    openDelete(content, rowData) {
        this.selected = rowData.salesOrderSettingId;
        this.modal = this.modalService.open(content, { size: "sm", backdrop: 'static', keyboard: false });
        this.modal.result.then(
            () => {
                console.log("When user closes");
            },
            () => {
                console.log("Backdrop click");
            }
        );
    }
    exportCSV(dt) {
        this.isSpinnerVisible = true;
        this.salesOrderService
            .getAllSalesOrderSettings().subscribe(res => {
                let response: any = res;
                const vList = response.map(x => {
                    return {
                        ...x,
                        createdDate: x.createdDate ? this.datePipe.transform(x.createdDate, 'MMM-dd-yyyy hh:mm a') : '',
                    }
                });

                dt._value = vList;
                dt.exportCSV();
                dt.value = this.soqSettingsList;
                this.isSpinnerVisible = false;
            }, err => {
                this.isSpinnerVisible = false;
                const errorLog = err;
                this.onDataLoadFailed(errorLog);
            });

    }

    onDataLoadFailed(log) {
        // this.isSpinnerVisible = false;
        const errorLog = log;
        var msg = '';
        if (errorLog.message) {
            if (errorLog.error && errorLog.error.errors.length > 0) {
                for (let i = 0; i < errorLog.error.errors.length; i++) {
                    msg = msg + errorLog.error.errors[i].message + '<br/>'
                }
            }
            this.alertService.showMessage(
                errorLog.error.message,
                msg,
                MessageSeverity.error
            );
        }
        else {
            this.alertService.showMessage(
                'Error',
                log.error,
                MessageSeverity.error
            );
        }
    }
}