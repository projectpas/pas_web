import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { CurrencyService } from '../../../services/currency.service';
import { Currency } from '../../../models/currency.model';
import { ItemMasterLoanExchange } from '../../../models/item-master-loan-exchange.model';
import { AuthService } from '../../../services/auth.service';
import { ItemMasterService } from '../../../services/itemMaster.service';
import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { CommonService } from '../../../services/common.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
    selector: 'app-item-master-exch-loan',
    templateUrl: './item-master-exch-loan.component.html',
    styleUrls: ['./item-master-exch-loan.component.scss']
})

export class ItemMasterExchangeLoanComponent implements OnInit {
    upateBTn = true;
    legalEntityId: number;
    @ViewChild("tabRedirectConfirmationModal",{static:false}) public tabRedirectConfirmationModal: ElementRef;
    nextOrPreviousTab: any ="Next";
    modal: NgbModalRef;
    isSpinnerVisible: Boolean = false;
    exchCurrencyInfo: any = [];
    loanCurrencyInfo: any = [];

    constructor(private currencyService: CurrencyService, private authService: AuthService,
        private itemMasterService: ItemMasterService, private modalService: NgbModal, private alertService: AlertService, public commonService: CommonService,) { }
    showExchange: boolean = false;
    showLoan: boolean = false;
    currentItem: ItemMasterLoanExchange;
    @Input() itemMasterId: number;
    @Input() allCurrencyInfo: any;
    @Output() onTabChange = new EventEmitter<string>();

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    moveTab(tabName) {

        this.onTabChange.emit(tabName);
    }
    ngOnInit() {
        this.currentItem = {
            ...new ItemMasterLoanExchange(), itemMasterId: this.itemMasterId, createdBy: this.userName, isActive: true, isDeleted: false, isExchange: true, isLoan: true
        };         
        this.getDefaultCurrency();
        this.loadData(this.itemMasterId);
    }

    loadData(id: number): void {
        this.isSpinnerVisible = true;
        this.itemMasterId = id;
        this.exchCurrencyInfo = this.allCurrencyInfo;
        this.loanCurrencyInfo = this.allCurrencyInfo;
        this.alertService.startLoadingMessage();
        if (this.itemMasterId) {
            this.itemMasterService.getExchangeLoan(this.itemMasterId).subscribe(c => {
                const res = c[0];
                if (res != null) {
                    this.currentItem = {
                        ...res,
                        exchangeCurrencyId: this.getInactiveObjectOnEdit('value', res.exchangeCurrencyId, this.exchCurrencyInfo, 'Currency', 'CurrencyId', 'Code', 'exch'),
                        loanCurrencyId: this.getInactiveObjectOnEdit('value', res.loanCurrencyId, this.loanCurrencyInfo, 'Currency', 'CurrencyId', 'Code', 'loan'),
                    };
                    this.showExchange = this.currentItem.isExchange;
                    this.showLoan = this.currentItem.isLoan;
                    this.isSpinnerVisible = false;
                }
                this.alertService.stopLoadingMessage();
                this.isSpinnerVisible = false;
                
            },
            error => this.saveFailedHelper(error));
        }
    }

    getInactiveObjectOnEdit(string, id, originalData, tableName, primaryColumn, description, currName) {
        if(id) {
            for(let i=0; i < originalData.length; i++) {
                if(originalData[i][string] == id) {
                    return id;
                } 
            }
            let obj: any = {};
            this.commonService.smartDropDownGetObjectById(tableName, primaryColumn, description, primaryColumn, id).subscribe(res => {
                obj = res[0];
                if(currName == 'exch') {
                    this.exchCurrencyInfo = [...originalData, obj];
                }
                else if(currName == 'loan') {
                    this.loanCurrencyInfo = [...originalData, obj];
                }
            });
            return id;
            
        } else {
            return null;
        }
    }
    
    handleExchangeCheck(): void {
        if (!this.showExchange) {
            // clear the values
            this.currentItem.isExchange = false;
            this.currentItem.exchangeCoreCost = null;
            this.currentItem.exchangeCorePrice = null;
            this.currentItem.exchangeCurrencyId = 0;
            this.currentItem.exchangeListPrice = null;
            this.currentItem.exchangeOutrightPrice = null;
            this.currentItem.exchangeOverhaulPrice = null;
            this.currentItem.exchangeOverhaulCost = null;
        }
    }

    handleLoanCheck(): void {
        if (!this.showLoan) {
            // clear the values
            this.currentItem.isLoan = false;
            this.currentItem.loanCorePrice = null;
            this.currentItem.loanFees = null;
            this.currentItem.loanCurrencyId = 0;
            this.currentItem.loanOutrightPrice = null;
        }
    }
    saveAndMove(): void {
        this.currentItem.updatedBy = this.userName;
        this.currentItem.isExchange = this.showExchange;
        this.currentItem.isLoan = this.showLoan;
        this.currentItem.itemMasterId = this.itemMasterId;
        if (this.currentItem.itemMasterLoanExchId) {
            this.itemMasterService.updateExchangeLoan(this.currentItem).subscribe(() => {
                //Show the message
                this.alertService.showMessage(
                    'Success',
                    `Saved Exchange  and loans Successfully `,
                    MessageSeverity.success
                );
                
            })
        } else {
            // Add new item
            this.itemMasterService.AddExchangeLoan(this.currentItem).subscribe((data) => {
                //Show the message
                this.alertService.showMessage(
                    'Success',
                    `Saved Exchange  and loans Successfully `,
                    MessageSeverity.success
                );
                this.currentItem.itemMasterLoanExchId = data.itemMasterLoanExchId;
            });
        }
        //save or update and then move to next tab

    }
    getDefaultCurrency() {
        this.legalEntityId = 19;
        this.commonService.getDefaultCurrency(this.legalEntityId).subscribe(res => {
            // this.currentItem.exchangeCurrencyId = res.currencyId;
            // this.currentItem.loanCurrencyId = res.currencyId;
        })
    }
    nextOrPreviousClick(nextOrPrevious) {
        this.nextOrPreviousTab = nextOrPrevious;
        let content = this.tabRedirectConfirmationModal;
        this.modal = this.modalService.open(content, { size: "sm" });
    }

    dismissModel(){
        this.modal.close();
    }

    updateBtnChange(){
        this.upateBTn = false;
    }

    redirectToTab(){
        if(this.nextOrPreviousTab == "Next"){
            this.modal.close()
            this.moveTab('ExportInfo')
        }
        if(this.nextOrPreviousTab == "Previous"){
            this.modal.close()
            this.moveTab('NhaTlaAlternateTab')
        }

    }

    private saveFailedHelper(error: any) {
        this.isSpinnerVisible = false;
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
        setTimeout(() => this.alertService.stopLoadingMessage(), 5000);
    }
}