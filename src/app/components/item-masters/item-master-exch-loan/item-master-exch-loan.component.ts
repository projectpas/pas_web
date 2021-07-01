import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { CurrencyService } from '../../../services/currency.service';
import { Currency } from '../../../models/currency.model';
import { ItemMasterLoanExchange } from '../../../models/item-master-loan-exchange.model';
import { AuthService } from '../../../services/auth.service';
import { ItemMasterService } from '../../../services/itemMaster.service';
import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { CommonService } from '../../../services/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DBkeys } from '../../../services/db-Keys';
@Component({
    selector: 'app-item-master-exch-loan',
    templateUrl: './item-master-exch-loan.component.html',
    styleUrls: ['./item-master-exch-loan.component.scss']
})

export class ItemMasterExchangeLoanComponent implements OnInit {
    upateBTn = true;
    legalEntityId: number;
    @ViewChild("tabRedirectConfirmationModal",{static:false}) public tabRedirectConfirmationModal: ElementRef;
    @ViewChild('exchLoan',{static:false}) formdata: any;
    stopmulticlicks: boolean;
    nextOrPreviousTab: any ="Next";
    modal: NgbModalRef;
    isSpinnerVisible: Boolean = false;
    exchCurrencyInfo: any = [];
    loanCurrencyInfo: any = [];

    constructor(private currencyService: CurrencyService, private authService: AuthService, private _actRoute: ActivatedRoute,
        private itemMasterService: ItemMasterService, private modalService: NgbModal, private alertService: AlertService, public commonService: CommonService,) { }
    showExchange: boolean = false;
    showLoan: boolean = false;
    currentItem: ItemMasterLoanExchange;
    @Input() itemMasterId: number;
    @Input() allCurrencyInfo: any;
    @Output() onTabChange = new EventEmitter<string>();
    arrayCurrancylist:any[] = [];

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
        if(this.itemMasterId == undefined || this.itemMasterId == 0)
        {
            this.itemMasterId = this._actRoute.snapshot.params['id'];
            this.CurrencyData();
            this.loadData(this.itemMasterId);
        }
    }

    CurrencyData(strText = '') {
        if(this.arrayCurrancylist.length == 0) {			
            this.arrayCurrancylist.push(0); }
          this.commonService.autoSuggestionSmartDropDownList('Currency', 'CurrencyId', 'Code', strText, false, 200, this.arrayCurrancylist.join(),this.authService.currentUser.masterCompanyId).subscribe(res => {
            this.allCurrencyInfo = res;
            this.exchCurrencyInfo = this.allCurrencyInfo;
            this.loanCurrencyInfo = this.allCurrencyInfo;
          }, error => this.saveFailedHelper(error));
    }

    loadData(id: number): void {
        
        if(this.itemMasterId == undefined || this.itemMasterId == 0)
        {
            this.itemMasterId = this._actRoute.snapshot.params['id'];
        }
        else{
            this.itemMasterId = id;
        }
        if(this.itemMasterId > 0)
        {
            this.alertService.startLoadingMessage();
            if (this.itemMasterId) {
                this.itemMasterService.getExchangeLoan(this.itemMasterId).subscribe(c => {
                    const res = c[0];
                    if (res != null) {
                            this.arrayCurrancylist.push(res.exchangeCurrencyId);
                            this.arrayCurrancylist.push(res.loanCurrencyId);
                            this.commonService.autoSuggestionSmartDropDownList('Currency', 'CurrencyId', 'Code', '', false, 200, this.arrayCurrancylist.join(),this.authService.currentUser.masterCompanyId).subscribe(curres => {
                                this.allCurrencyInfo = curres;
                                this.exchCurrencyInfo = this.allCurrencyInfo;
                                this.loanCurrencyInfo = this.allCurrencyInfo;
                                this.currentItem = {
                                    ...res,
                                    exchangeCurrencyId: this.getInactiveObjectOnEdit('value', res.exchangeCurrencyId, this.exchCurrencyInfo, 'Currency', 'CurrencyId', 'Code', 'exch'),
                                    loanCurrencyId: this.getInactiveObjectOnEdit('value', res.loanCurrencyId, this.loanCurrencyInfo, 'Currency', 'CurrencyId', 'Code', 'loan'),
                                };
                            }, error => this.saveFailedHelper(error));
                        this.showExchange = this.currentItem.isExchange;
                        this.showLoan = this.currentItem.isLoan;
                        this.isSpinnerVisible = false;
                    }
                    this.alertService.stopLoadingMessage();
                    this.isSpinnerVisible = false;
                },
                error => this.saveFailedHelper(error));
            }
            else
            {
                //this.alertService.stopLoadingMessage();
                this.isSpinnerVisible = false;
            }
        }        
    }

    getInactiveObjectOnEdit(string, id, originalData, tableName, primaryColumn, description, currName) {
        if(id) {
            if(originalData != undefined || originalData != '' || originalData != null)
            {
                for(let i=0; i < originalData.length; i++) {
                    if(originalData[i][string] == id) {
                        return id;
                    } 
                }
            }
            
            let obj: any = {};
            this.commonService.smartDropDownGetObjectById(tableName, primaryColumn, description, primaryColumn, id,this.authService.currentUser.masterCompanyId).subscribe(res => {
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
        this.currentItem.masterCompanyId = this.authService.currentUser.masterCompanyId;

        if (this.currentItem.itemMasterLoanExchId) {
            this.itemMasterService.updateExchangeLoan(this.currentItem).subscribe(() => {
                this.alertService.showMessage(
                    'Success',
                    `Saved Exchange  and loans Successfully `,
                    MessageSeverity.success
                );
                this.upateBTn = true;
            })
        } else {
            this.itemMasterService.AddExchangeLoan(this.currentItem).subscribe((data) => {
                this.alertService.showMessage(
                    'Success',
                    `Saved Exchange  and loans Successfully `,
                    MessageSeverity.success
                );
                this.currentItem.itemMasterLoanExchId = data.itemMasterLoanExchId;
                this.upateBTn = true;
            });
        }
    }

    getDefaultCurrency() {
        this.legalEntityId = 19;
        this.commonService.getDefaultCurrency(this.legalEntityId,this.authService.currentUser.masterCompanyId).subscribe(res => {
        })
    }

    nextOrPreviousClick(nextOrPrevious) {
        this.nextOrPreviousTab = nextOrPrevious;
        if (!this.upateBTn) {
            let content = this.tabRedirectConfirmationModal;
            this.modal = this.modalService.open(content, { size: 'sm' });
        }
        else {
            if(this.nextOrPreviousTab == "Next"){
                this.moveTab('ExportInfo')
            }
            if(this.nextOrPreviousTab == "Previous"){
                this.moveTab('NhaTlaAlternateTab')
            }
            setTimeout(() => {
                this.stopmulticlicks = false;
            }, 500)
        }
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
            this.saveAndMove();
        }
        if(this.nextOrPreviousTab == "Previous"){
            this.modal.close()
            this.moveTab('NhaTlaAlternateTab')
            this.saveAndMove();
        }
    }
    onNoClick(){
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
        // this.alertService.stopLoadingMessage();
        // this.alertService.showStickyMessage(error, null, MessageSeverity.error);
        // setTimeout(() => this.alertService.stopLoadingMessage(), 5000);
    }
}