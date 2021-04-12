import { Component, ViewEncapsulation } from "@angular/core";
import { Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Subject } from "rxjs";
import { takeUntil } from 'rxjs/operators';
import { AlertService, MessageSeverity } from "../../services/alert.service";
import { AuthService } from "../../services/auth.service";
import { SOSettingsModel } from "../../components/sales/quotes/models/verify-sales-quote-model";
import { DatePipe } from "@angular/common";
import * as $ from "jquery";
import { CustomerPaymentsService } from "../../services/customer-payment.service";

@Component({
    selector: 'app-account-receivable-settings-list',
    templateUrl: './account-receivable-settings-list.component.html',
    styleUrls: ['./account-receivable-settings-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ARSettingsListComponent {
    title: string = "AR settings";
    soqSettingsList: any = [];
    auditHistory: any = [];
    modal: NgbModalRef;
    isSpinnerVisible = false;
    targetData: any;
    private onDestroy$: Subject<void> = new Subject<void>();
    selectedGridColumn: any[];
    disableCreateNewSettings = false;
    selectedGridColumns: any[] = [
        { field: 'account', header: 'Trade Receivable' }
    ];
    gridColumns = [
        { field: 'account', header: 'Trade Receivable' },
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
    noDatavailable: any;

    constructor(public customerService: CustomerService,
        public ARService: CustomerPaymentsService,
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
        this.ARService.getARSettingHistory(rowData.salesOrderSettingId)
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
        this.ARService.isEditARSettingsList = true;
        let editeddRow = this.soqSettingsList.find(setting => setting.arSettingId == rowData.arSettingId);
        this.ARService.arSettingsData = editeddRow;
        this.route.navigateByUrl(`accountreceivablesettingsmodule/arsettings/app-create-account-receivable-settings`);
    }

    deleteSettings() {
        this.isSpinnerVisible = true;
        this.ARService.deleteARSetting(this.selected, this.userName).subscribe(response => {
            this.isSpinnerVisible = false;
            this.getAllSOSettings();
            this.dismissModel();
            this.ARService.arSettingsData = new SOSettingsModel();
            this.alertService.showMessage(
                'AR Settings',
                `Succesfully deleted setting`,
                MessageSeverity.success
            );
        }, error => {
            this.dismissModel();
            this.isSpinnerVisible = false;
            this.alertService.showMessage(
                'AR Settings',
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
        this.isSpinnerVisible = true;
        this.ARService.getAllARSettings().pipe(takeUntil(this.onDestroy$)).subscribe(
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
        this.route.navigateByUrl('/accountreceivablesettingsmodule/arsettings/app-create-account-receivable-settings');
    }

    openEdit(row) {
        this.route.navigateByUrl('/accountreceivablesettingsmodule/arsettings/app-create-account-receivable-settings');
    }

    openDelete(content, rowData) {
        this.selected = rowData.arSettingId;
        this.modal = this.modalService.open(content, { size: "sm", backdrop: 'static', keyboard: false });
    }

    exportCSV(dt) {
        this.isSpinnerVisible = true;
        this.ARService
            .getAllARSettings().subscribe(res => {
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
            });
    }
}