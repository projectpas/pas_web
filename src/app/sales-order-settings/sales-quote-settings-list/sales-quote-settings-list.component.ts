import { Component, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Subject } from "rxjs";
import { SalesQuoteService } from '../../services/salesquote.service';
import { takeUntil } from 'rxjs/operators';
import { AlertService, MessageSeverity } from "../../services/alert.service";
import { AuthService } from "../../services/auth.service";
@Component({
    selector: 'app-sales-quote-settings-list',
    templateUrl: './sales-quote-settings-list.component.html',
    styleUrls: ['./sales-quote-settings-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
/** sales-order-settings-list component*/
export class SalesQuoteSettingsListComponent {
    title: string = "SO Quote settings";
    soqSettingsList: any = [];
    auditHistory: any = [];
    modal: NgbModalRef;
    isSpinnerVisible = false;
    private onDestroy$: Subject<void> = new Subject<void>();
    selectedGridColumn: any[];
    disableCreateNewSettings = false;
    selectedGridColumns: any[] = [
        { field: 'quoteTypeName', header: 'SO Type' },
        { field: 'prefix', header: 'Prefix' },
        { field: 'sufix', header: 'Suffix' },
        { field: 'startCode', header: 'Start Code' },
        { field: 'defaultStatusName', header: 'Status' },
        { field: 'defaultPriorityName', header: 'Priority' },
        { field: 'validDays', header: 'Valid Days' }
    ];
    gridColumns = [
        { field: 'quoteTypeName', header: 'SO Type' },
        { field: 'prefix', header: 'Prefix' },
        { field: 'sufix', header: 'Suffix' },
        { field: 'startCode', header: 'Start Code' },
        { field: 'defaultStatusName', header: 'Status' },
        { field: 'defaultPriorityName', header: 'Priority' },
        { field: 'validDays', header: 'Valid Days' }
    ];
    pageSize: number = 10;
    pageIndex: number = 0;
    first = 0;
    data: any;
    filteredText: string;
    totalRecords: number = 0;
    totalPages: number = 0;
    selected;

    constructor(private router: ActivatedRoute,
        public customerService: CustomerService,
        public salesQuoteService: SalesQuoteService,
        public alertService: AlertService,
        public authService: AuthService,
        public modalService: NgbModal,
        private route: Router) {
    }

    ngOnInit() {
        this.selectedGridColumns = this.gridColumns;
        this.getAllSOQuoteSettings();
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
        this.salesQuoteService.getSOQuoteSettingHistory(rowData.salesOrderQuoteSettingId)
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
        this.salesQuoteService.isEditSOQuoteSettingsList = true;
        let editeddRow = this.soqSettingsList.find(setting => setting.accountTypeId == rowData.accountTypeId);
        this.salesQuoteService.soQuoteSettingsData = editeddRow;
        this.route.navigateByUrl(`salesordersettingsmodule/salesordersettings/app-create-sales-quote-settings`);
    }

    deleteQuoteSetting(rowData) {
        this.isSpinnerVisible = true;
        this.salesQuoteService.deleteSoqSetting(this.selected, this.userName).subscribe(response => {
            this.isSpinnerVisible = false;
            this.dismissModel();
            this.getAllSOQuoteSettings();
            this.alertService.showMessage(
                'SO Quote Settings',
                `Succesfully deleted setting`,
                MessageSeverity.success
            );
        }, error => {
            this.isSpinnerVisible = false;
            this.dismissModel();
            this.alertService.showMessage(
                'SO Quote Settings',
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

    getAllSOQuoteSettings(): void {
        // this.soqSettingsList = [];
        this.isSpinnerVisible = true;
        this.salesQuoteService.getAllSalesOrderQuoteSettings().pipe(takeUntil(this.onDestroy$)).subscribe(
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
        this.route.navigateByUrl('/salesordersettingsmodule/salesordersettings/app-create-sales-quote-settings');
    }
    openEdit(row) {
        this.route.navigateByUrl('/salesordersettingsmodule/salesordersettings/app-create-sales-quote-settings');
    }

    openDelete(content, rowData) {
        this.selected = rowData.salesOrderQuoteSettingId;
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
}