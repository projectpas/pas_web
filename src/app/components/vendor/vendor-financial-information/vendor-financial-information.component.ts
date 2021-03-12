import { Component, ViewChild, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { FormBuilder } from '@angular/forms';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { fadeInOut } from '../../../services/animations';
import { MasterCompany } from '../../../models/mastercompany.model';
import { AuditHistory } from '../../../models/audithistory.model';
import { AuthService } from '../../../services/auth.service';
import { MessageSeverity, AlertService } from '../../../services/alert.service';
import { VendorService } from '../../../services/vendor.service';
import { MasterComapnyService } from '../../../services/mastercompany.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Currency } from '../../../models/currency.model';
import { CurrencyService } from '../../../services/currency.service';
import { CreditTerms } from '../../../models/credit-terms.model';
import { CreditTermsService } from '../../../services/Credit Terms.service';
import { ChangeDetectorRef } from '@angular/core';
import { DiscountValue } from '../../../models/discountvalue';
import { CommonService } from '../../../services/common.service';
import { validateRecordExistsOrNot, getObjectById, selectedValueValidate, editValueAssignByCondition } from '../../../generic/autocomplete';
import { emailPattern, urlPattern, phonePattern } from '../../../validations/validation-pattern';

@Component({
    selector: 'app-vendor-financial-information',
    templateUrl: './vendor-financial-information.component.html',
    styleUrls: ['./vendor-financial-information.component.scss'],
    animations: [fadeInOut]
})
/** anys component*/
export class VendorFinancialInformationComponent implements OnInit, AfterViewInit {
    modelValue: boolean;
    display: boolean;
    activeIndex: any = 5;
    showCurrency: boolean;
    showCreditTearms: boolean;
    showCreditLimit: boolean;
    vendorsList: any[];
    creditTermsCollection: any[];
    creditTermName: any;
    allcreditTermInfo: any[];
    currencyName: any;
    allCurrencyInfo: any[];
    currencyCollection: any[];
    vendorId: any;
    vendorCode: any;
    vendorname: any;
    allgeneralInfo: any[];
    local: any;
    action_name: any = "";
    memo: any = "";
    createdBy: any = "";
    updatedBy: any = "";
    createddate: any = "";
    updatedDate: any = "";
    viewName: string = "Create";
    sub: any;
    actionamecolle: any[] = [];
    alldiscountvalueInfo: DiscountValue[] = [];
    discountcollection: any[] = [];
    namecolle: any[] = [];
    selectedConsume: any;
    disableSaveConsume: boolean;
    disableSave: boolean;
    selectedActionName: any;
    creditTermsId: any;
    disableSaveCurrency: boolean;
    SelectedCurrencyInfo: any;
    vendorProcess1099Data: any;
    SelectedvendorProcess1099Data: any;
    checkedCheckboxesList: any = [];
    listOfErrors: any[];
    @ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
    @ViewChild(MatSort,{static:false}) sort: MatSort;
    filteredBrands: any[];
    displayedColumns = ['actionId', 'companyName', 'description', 'memo', 'createdBy', 'updatedBy', 'updatedDate', 'createdDate'];
    dataSource: MatTableDataSource<any>;
    allActions: any[] = [];
    allComapnies: MasterCompany[] = [];
    private isSaving: boolean;
    sourceVendor: any = {};
    public sourceAction: any = [];
    public auditHisory: AuditHistory[] = [];
    private bodyText: string;
    loadingIndicator: boolean;
    closeResult: string;
    selectedColumn: any[];
    selectedColumns: any[];
    cols: any[];
    title: string = "Create";
    id: number;
    errorMessage: any;
    modal: NgbModalRef;
    actionName: string;
    Active: string = "Active";
    length: number;
    localCollection: any;
    discontValue: string;
    public allWorkFlows: any[] = [];
    private isEditMode: boolean = false;
    private isDeleteMode: boolean = false;
    percentageList: any = [];
    disableCreditTerms: boolean = true;
    disableCurrency: boolean = true;
    isvendorEditMode: any;
    discountList: any = [];
    nextOrPreviousTab: string;
    isRadioChecked: boolean = false;
    enableUpdate: boolean = false;
    disableUpdate: boolean = true;
    isSpinnerVisible: Boolean = false;
    stopmulticlicks: boolean= false;
    isVendorAlsoCustomer : boolean = false;
    emailPattern = emailPattern()
    urlPattern = urlPattern()
    phonePattern = phonePattern();
    @ViewChild("tabRedirectConfirmationModal",{static:false}) public tabRedirectConfirmationModal: ElementRef;
    vendorCodeandName: any;
    arrayListDiscountId:any[] = [];
    arrayListCurrancyId:any[] = [];
    arrayListPercentageId:any[] = [];
    showAllowNettingOfAPAR: boolean = false;

    constructor(private cdRef: ChangeDetectorRef, public CreditTermsService: CreditTermsService, public currencyService: CurrencyService, private router: ActivatedRoute, private route: Router, private authService: AuthService, private modalService: NgbModal, private activeModal: NgbActiveModal, private _fb: FormBuilder, private alertService: AlertService, public vendorService: VendorService, private dialog: MatDialog, private masterComapnyService: MasterComapnyService, private commonservice: CommonService) {
        if(window.localStorage.getItem('vendorService')){
            var obj = JSON.parse(window.localStorage.getItem('vendorService'));
            if(obj.listCollection && this.router.snapshot.params['id']){
                this.vendorService.checkVendorEditmode(true);
                this.vendorService.isEditMode = true;
                this.vendorService.listCollection = obj.listCollection;
                this.vendorService.indexObj.next(obj.activeIndex);
                this.vendorService.enableExternal = true;
                this.vendorId = this.router.snapshot.params['id'];
                this.vendorService.vendorId = this.vendorId;
                this.vendorService.listCollection.vendorId = this.vendorId; 
                this.vendorService.getVendorCodeandNameByVendorId(this.vendorId).subscribe(
                    res => {
                            this.local = res[0];
                            this.vendorCodeandName = res[0];
                            this.isVendorAlsoCustomer = res[0].isVendorAlsoCustomer;
                            if(this.isVendorAlsoCustomer){
                                this.sourceVendor.isAllowNettingAPAR = true;
                                this.showAllowNettingOfAPAR = true;
                            }
                    },err => {
                        this.isSpinnerVisible=false;
                        //const errorLog = err;
                        //this.saveFailedHelper(errorLog);
                });
            }
        }
        else
        {
            this.getVendorCodeandNameByVendorId();
        }
        if (this.vendorService.listCollection !== undefined) {
            this.vendorService.isEditMode = true;
            this.sourceVendor.vendorId = this.vendorService.listCollection.vendorId;
        }
        if (this.vendorService.contactCollection) {
            this.local = this.vendorService.contactCollection;
            this.sourceVendor = this.local;
        }
        this.dataSource = new MatTableDataSource();
        this.getVendorProcess1099();

        if (this.vendorService.listCollection && this.vendorService.isEditMode == true) {
            this.viewName = "Edit";
            this.local = this.vendorService.listCollection;
            this.sourceVendor = this.vendorService.listCollection;
            this.getVendorProcess1099FromTransaction(this.sourceVendor.vendorId);
            if(!this.sourceVendor.creditLimit){
                this.sourceVendor.creditLimit = 0;
            }
        }
        else {
            this.sourceVendor.creditLimit = 0;
            this.sourceVendor.creditTermsId = 0;
            this.sourceVendor.currencyId = 0;
        }
    }

    ngOnInit(): void {
        this.vendorService.currentEditModeStatus.subscribe(message => {
            this.isvendorEditMode = message;
        });
        this.vendorService.currentUrl = '/vendorsmodule/vendorpages/app-vendor-financial-information';
        this.vendorService.bredcrumbObj.next(this.vendorService.currentUrl);
        this.loadCreditTermsData();
        this.sourceVendor.v1099RentDefault = true;
        this.sourceVendor.is1099Required = false;
        if(this.vendorId == undefined || this.vendorId == 0 || this.vendorId == null)
        {
            this.vendorId = this.router.snapshot.params['id'];
            this.vendorService.vendorId = this.vendorId;
            this.vendorService.listCollection.vendorId = this.vendorId;
        }        
        if (this.local) {
             this.getVendorsList();
        }
        else
        {
            this.getAllDiscountDropdownList(0);
            this.loadCurrencyData(0);
        }
        this.validateCreditTerms(this.sourceVendor.creditTermsId);
        this.validateCurrency(this.sourceVendor.currencyId);
    }

    private getVendorsList() {
        this.isSpinnerVisible = true;
        this.vendorService.getVendordata(this.local.vendorId).subscribe(
            results => this.onVendorsLoadSuccssfull(results),
            error => this.isSpinnerVisible=false//this.saveFailedHelper(error)
        );
    }

    patternMobilevalidationWithSpl(event: any) {
        const pattern = /[0-9.\+\-()\ ]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) {
            event.preventDefault();
        }
    }

    getAllPercentage() {
        //this.commonservice.smartDropDownList('[Percent]', 'PercentId', 'PercentValue').subscribe(res => {
        this.commonservice.autoSuggestionSmartDropDownList('[Percent]', 'PercentId', 'PercentValue', '', '', 20, '', this.currentUserMasterCompanyId).subscribe(res => {
            this.percentageList = res;
        },
        error => this.isSpinnerVisible=false)//this.saveFailedHelper(error))
    }

    getVendorCodeandNameByVendorId()
    {
        if(this.vendorId > 0)
        {
            this.vendorService.getVendorCodeandNameByVendorId(this.vendorId).subscribe(
                res => {
                        this.vendorCodeandName = res[0];
                },err => {
                      this.isSpinnerVisible=false
                    //const errorLog = err;
                    //this.saveFailedHelper(errorLog);
            });
        }        
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    private loadData() {
        this.isSpinnerVisible = true;
        this.vendorService.getWorkFlows().subscribe(
            results => this.onDataLoadSuccessful(results[0]),
            error => this.isSpinnerVisible=false//this.saveFailedHelper(error)
        );
    }

    private loadMasterCompanies() {
        this.isSpinnerVisible = true;
        this.masterComapnyService.getMasterCompanies().subscribe(
            results => this.onDataMasterCompaniesLoadSuccessful(results[0]),
            error => this.isSpinnerVisible=false//this.saveFailedHelper(error)
        );
    }

    public applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue;
    }

    private getVendorProcess1099() {
        let companyId = this.currentUserMasterCompanyId;
        this.isSpinnerVisible = true;
        this.vendorService.getVendorProcess1099Data(companyId).subscribe(res => {
            this.vendorProcess1099Data = res[0].map(x => {
                return {
                    ...x,
                    isDefaultCheck: false,
                    isDefaultRadio: false,
                    isRadioDisabled: true
                }
            });
            this.isSpinnerVisible = false;
        },
        error => this.isSpinnerVisible=false)//this.saveFailedHelper(error))
    }

    private getVendorProcess1099FromTransaction(vendorId) {
        this.isSpinnerVisible = true;
        this.vendorService.getVendorProcess1099DataFromTransaction(vendorId).subscribe(res => {
            if (res[0].length != 0) {
                this.sourceVendor.is1099Required = true;
                this.vendorProcess1099Data = res[0].map(x => {
                    return {
                        ...x
                    }
                });
                for (let j = 0; j < this.vendorProcess1099Data.length; j++) {
                    if (this.vendorProcess1099Data[j].isDefaultRadio == true || this.vendorProcess1099Data[j].isDefaultRadio == "true") {
                        this.vendorProcess1099Data[j].isDefaultRadio = this.vendorProcess1099Data[j].description
                    }
                    if (this.vendorProcess1099Data[j].isDefaultCheck == true) {
                        this.checkedCheckboxesList.push(j);
                    }
                }
            } else {
                this.getVendorProcess1099();
            }
            this.isSpinnerVisible = false;
        }, error => this.isSpinnerVisible=false )// this.saveFailedHelper(error))
    }

    handleChange(rowData, e) {
        if (e.checked == false) {
            this.sourceVendor = rowData;
            this.Active = "In Active";
        }
        else {
            this.sourceVendor = rowData;
            this.Active = "Active";
        }
    }

    private onDataLoadSuccessful(allWorkFlows: any[]) {
        this.isSpinnerVisible = false;
        this.dataSource.data = allWorkFlows;
        this.allActions = allWorkFlows;
    }

    private onVendorsLoadSuccssfull(allVendors: any) {
        this.isSpinnerVisible = false;
        this.dataSource.data = allVendors;
        if(this.dataSource.data != undefined || this.dataSource.data != null)
        {
            if(this.dataSource.data[0].creditTermsId > 0)
            {
                this.enableUpdate = true;
                this.sourceVendor.creditLimit =  this.dataSource.data[0].creditLimit;
                this.sourceVendor.creditTermsId =  this.dataSource.data[0].creditTermsId;
                this.sourceVendor.isAllowNettingAPAR =  this.dataSource.data[0].isAllowNettingAPAR;
                if(this.sourceVendor.isAllowNettingAPAR){                   
                    this.showAllowNettingOfAPAR = true;
                }
                this.arrayListDiscountId.push(this.dataSource.data[0].discountId);
                this.getAllDiscountDropdownList(this.dataSource.data[0].discountId);
                this.arrayListCurrancyId.push(this.dataSource.data[0].currencyId);
                this.loadCurrencyData(this.dataSource.data[0].currencyId);
            }
            else
            {
                this.getAllDiscountDropdownList(0);
                this.loadCurrencyData(0);
                this.sourceVendor.creditLimit =  0;
                this.sourceVendor.creditTermsId =  0;
            }
        }
    }

    filterActions(event) {
        this.localCollection = [];
        for (let i = 0; i < this.allActions.length; i++) {
            let actionName = this.allActions[i].description;
            if (actionName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.localCollection.push(actionName);
            }
        }
    }

    private onDataMasterCompaniesLoadSuccessful(allComapnies: MasterCompany[]) {
        this.allComapnies = allComapnies;
        this.isSpinnerVisible = false;
    }

    private onDataLoadFailed(error: any) {
        this.isSpinnerVisible = false;
    }

    open(content) {
        this.disableSave = false;
        this.isEditMode = false;
        this.isDeleteMode = false;
        this.disableSaveCurrency = false;
        this.isSaving = true;
        this.loadMasterCompanies();
        this.actionName = "";
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }


    openDelete(content, row) {
        this.isEditMode = false;
        this.isDeleteMode = true;
        this.sourceVendor = row;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    openEdit(content, row) {
        this.isEditMode = true;
        this.disableSave = false;
        this.isSaving = true;
        this.sourceVendor = row;
        this.loadMasterCompanies();
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    openView(content, row) {
        this.sourceVendor = row;
        this.action_name = row.description;
        this.memo = row.memo;
        this.createdBy = row.createdBy;
        this.updatedBy = row.updatedBy;
        this.createddate = row.createdDate;
        this.updatedDate = row.updatedDate;
        this.loadMasterCompanies();
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    openHelpText(content) {
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    openHist(content, row) {
        this.sourceVendor = row;
    }

    onBlurMethod(data) {
        if (data == 'creditLimit') {
            this.showCreditLimit = false;
        }
        if (data == 'creditTearms') {
            this.showCreditTearms = false;
        }
        if (data == 'currency') {
            this.showCurrency = false;
        }
    }

    changeCheck1099Required(event, index) {
        if (event.target.checked) {
            this.checkedCheckboxesList.push(index);
            this.vendorProcess1099Data[index].isRadioDisabled = false;
            if (this.checkedCheckboxesList.length == 1) {
                this.vendorProcess1099Data[index].isDefaultRadio = event.target.value;
            }
        } else {
            let checkedArrayIndex;
            this.vendorProcess1099Data[index].isDefaultRadio = false;
            checkedArrayIndex = this.checkedCheckboxesList.indexOf(index);
            this.checkedCheckboxesList.splice(checkedArrayIndex, 1);
            this.vendorProcess1099Data[index].isRadioDisabled = true;
            if (this.checkedCheckboxesList.length >= 1) {
                this.checkedCheckboxesList = this.checkedCheckboxesList.sort();
                this.vendorProcess1099Data[this.checkedCheckboxesList[0]].isRadioDisabled = false;
                this.vendorProcess1099Data[this.checkedCheckboxesList[0]].isDefaultRadio = this.vendorProcess1099Data[this.checkedCheckboxesList[0]].description;
            } else {
                for (let i = 0; i < this.vendorProcess1099Data.length; i++) {
                    this.vendorProcess1099Data[i].isDefaultRadio = false;
                }
            }
        }
    }

    changevalue(event, index) {
        for (let i = 0; i < this.vendorProcess1099Data.length; i++) {
            this.vendorProcess1099Data[i].isDefaultRadio = false;
        }
        this.vendorProcess1099Data[index].isDefaultRadio = this.vendorProcess1099Data[index].description;
    }

    editItemAndCloseModel(isGoNxt?: boolean) {
        this.isSaving = true;
        var errmessage = '';
        this.alertService.resetStickyMessage();
        if(this.sourceVendor.creditLimit == 0 || this.sourceVendor.creditLimit == null) {	
            this.isSpinnerVisible = false;	
            errmessage = errmessage + "Credit Limit values must be greater than zero."
        }
        if(this.sourceVendor.creditTermsId == 0 || this.sourceVendor.creditTermsId == null) {	
            this.isSpinnerVisible = false;	
            if(errmessage != '') {
                errmessage = errmessage + '<br />' + "Please Select Creadit Tearms."
            }
            else
            {
                errmessage = errmessage + "Please Select Creadit Tearms."
            }	
        }
        if(this.sourceVendor.currencyId == 0 || this.sourceVendor.currencyId == null) {	
            this.isSpinnerVisible = false;	
            if(errmessage != '') {
                errmessage = errmessage + '<br />' + "Please Select Currency"
            }
            else
            {
                errmessage = errmessage + "Please Select Currency"
            }	
        }
        if(errmessage != '') {
            this.alertService.showStickyMessage("Validation failed", errmessage, MessageSeverity.error, errmessage);
            return;
        }
        if(this.sourceVendor.discountId == 0 || this.sourceVendor.discountId == null) {
            this.sourceVendor.discountId = null;
        }
        if (this.sourceVendor.country != null) {
            this.sourceVendor.country = "99";
        }
        if (!this.creditTermName) {
            this.showCreditTearms = true;
        }
        if ((this.sourceVendor.creditLimit || this.sourceVendor.creditLimit == 0)  && this.sourceVendor.creditTermsId && this.sourceVendor.currencyId) {

            if (this.sourceVendor.v1099RentDefault == true) {
                this.sourceVendor.v1099RentDefault = true;
            }
            else if (this.sourceVendor.v1099RoyaltiesDefault == true) {
                this.sourceVendor.v1099RoyaltiesDefault = true;
            }
            else if (this.sourceVendor.v1099OtherIncomeDefault == true) {
                this.sourceVendor.v1099OtherIncomeDefault = true;
            }
            else if (this.sourceVendor.v1099RoyaltiesDefault == true) {
                this.sourceVendor.v1099RoyaltiesDefault = true;
            }
            else if (this.sourceVendor.v1099NonEmployeeCompDefault == true) {
                this.sourceVendor.v1099NonEmployeeCompDefault = true;
            }
            else if (this.sourceVendor.v1099GoldenParachuteDefault == true) {
                this.sourceVendor.v1099GoldenParachuteDefault = true;
            }
            else if (this.sourceVendor.v1099GrossProceedsPaidToAttorneyDefault == true) {
                this.sourceVendor.v1099GrossProceedsPaidToAttorneyDefault = true;
            }
            else {
                this.sourceVendor.v1099RentDefault = true;
            }

            if (this.sourceVendor.v1099RentDefault == 1) {
                this.sourceVendor.v1099RentDefault = true;
            }
            if (this.sourceVendor.v1099RoyaltiesDefault == 2) {
                this.sourceVendor.v1099RoyaltiesDefault = true;
            }
            if (this.sourceVendor.v1099OtherIncomeDefault == 3) {
                this.sourceVendor.v1099OtherIncomeDefault = true;
            }
            if (this.sourceVendor.v1099RoyaltiesDefault == 4) {
                this.sourceVendor.v1099RoyaltiesDefault = true;
            }
            if (this.sourceVendor.v1099NonEmployeeCompDefault == 5) {
                this.sourceVendor.v1099NonEmployeeCompDefault = true;
            }
            if (this.sourceVendor.v1099GoldenParachuteDefault == 6) {
                this.sourceVendor.v1099GoldenParachuteDefault = true;
            }
            if (this.sourceVendor.v1099GrossProceedsPaidToAttorneyDefault == 7) {
                this.sourceVendor.v1099GrossProceedsPaidToAttorneyDefault = true;
            }
            this.sourceVendor.masterCompanyId = this.currentUserMasterCompanyId;
            this.isSpinnerVisible = true;

            if (this.sourceVendor.vendorId) {
                this.sourceVendor.createdBy = this.userName;
                this.sourceVendor.updatedBy = this.userName;
                for (let i = 0; i < this.vendorProcess1099Data.length; i++) {
                    if (this.vendorProcess1099Data[i].isDefaultRadio != true && this.vendorProcess1099Data[i].isDefaultRadio != false) {
                        this.vendorProcess1099Data[i].isDefaultRadio = true;
                    }
                }
                if(this.vendorProcess1099Data) {
                    this.sourceVendor.master1099s = [];
                    this.vendorProcess1099Data.map(x => {
                        //if(x.isDefaultCheck) {
                            this.sourceVendor.master1099s.push(x);
                        //}
                    });
                }
                const financialInfo = {
                    master1099s: this.sourceVendor.master1099s,
                    creditLimit: this.sourceVendor.creditLimit,
                    creditTermsId: this.sourceVendor.creditTermsId,
                    currencyId: this.sourceVendor.currencyId,
                    discountId: this.sourceVendor.discountId,
                    createdBy: this.sourceVendor.createdBy,
                    updatedBy: this.sourceVendor.updatedBy,
                    isActive: true,
                    is1099Required: this.sourceVendor.is1099Required ? this.sourceVendor.is1099Required : false,
                    masterCompanyId: this.sourceVendor.masterCompanyId,
                    isAllowNettingAPAR : this.sourceVendor.isAllowNettingAPAR
                }
                if (this.sourceVendor.is1099Required) {
                    if (this.sourceVendor.master1099s.length !=0) {
                        for (var i = 0; i < this.sourceVendor.master1099s.length; i++) {
                            if (this.sourceVendor.master1099s[i].isDefaultRadio === true) {
                                this.isRadioChecked = this.sourceVendor.master1099s[i].isDefaultRadio;
                                break;
                            }
                            }
                        if (this.isRadioChecked === true) {
                            this.vendorService.updatefinanceinfo(financialInfo, this.sourceVendor.vendorId).subscribe(data => {
                                this.localCollection = data;
                                this.vendorService.financeCollection = this.local;
                                this.getVendorProcess1099FromTransaction(this.sourceVendor.vendorId);
                                this.savesuccessCompleted(this.sourceVendor, isGoNxt);
                                this.enableUpdate = true;
                                this.disableUpdate = true;
                                this.isSpinnerVisible = false;
                            },
                            error => this.isSpinnerVisible=false )// this.saveFailedHelper(error))
                        } else {
                            this.alertService.showMessage("Failure", `Must select a radio option`, MessageSeverity.error);
                            this.isSpinnerVisible = false;
                        }
                    } else {
                        this.alertService.showMessage("Failure", `Must select a radio option`, MessageSeverity.error);
                        this.isSpinnerVisible = false;
                    }

                } else {
                    this.vendorService.updatefinanceinfo(financialInfo, this.sourceVendor.vendorId).subscribe(data => {
                        this.localCollection = data;
                        this.vendorService.financeCollection = this.local;
                        this.getVendorProcess1099FromTransaction(this.sourceVendor.vendorId);
                        this.savesuccessCompleted(this.sourceVendor, isGoNxt);
                        this.enableUpdate = true;
                        this.disableUpdate = true;
                        this.isSpinnerVisible = false;

                    }, error => this.isSpinnerVisible=false )// this.saveFailedHelper(error))
                }
            }
            else {
                this.sourceVendor.updatedBy = this.userName;
                this.vendorService.updatefinanceinfo(this.sourceVendor, this.local.vendorId).subscribe(data => {
                    this.localCollection = data;
                    this.saveCompleted(this.sourceVendor);
                    this.vendorService.financeCollection = this.local;
                    this.enableUpdate = true;
                    this.disableUpdate = true;
                    this.isSpinnerVisible = false;
                },error => this.isSpinnerVisible=false )// this.saveFailedHelper(error))
            }
        }
        else {
            this.isSpinnerVisible = false;
        }
    }

    deleteItemAndCloseModel() {
        this.isSaving = true;
    }

    NextClick() {
        this.vendorService.contactCollection = this.local;
        this.activeIndex = 6;
        this.vendorService.changeofTab(this.activeIndex);
    }
    previousClick() {
        this.activeIndex = 4;
        this.vendorService.changeofTab(this.activeIndex);
    }

    dismissModel() {
        this.isDeleteMode = false;
        this.isEditMode = false;
        this.modal.close();
    }

    private saveCompleted(user?: any) {
        this.isSaving = false;
        if (this.isDeleteMode == true) {
            this.alertService.showMessage("Success", `Action was deleted successfully`, MessageSeverity.success);
            this.isDeleteMode = false;
        }
        else {
            this.alertService.showMessage("Success", `Action was edited successfully`, MessageSeverity.success);

        }
        this.loadData();
    }
    private savesuccessCompleted(user?: any, isGoNxt?: boolean) {
        this.isSaving = false;
        this.alertService.showMessage(
            'Success',
            ` ${this.enableUpdate ? 'Updated' : 'Saved'} Financial Information Sucessfully `,
            MessageSeverity.success
        );
        this.loadData();
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    get currentUserMasterCompanyId(): number {
		return this.authService.currentUser
		  ? this.authService.currentUser.masterCompanyId
		  : null;
    }

    public saveFailedHelper(error: any) {
        this.isSaving = false;
        //this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
        this.isSpinnerVisible = false;
    }
    
    openCurrency(content) {
        this.isEditMode = false;
        this.isDeleteMode = false;
        this.disableSaveCurrency = false;
        this.isSaving = true;
        this.loadMasterCompanies();
        this.sourceAction = new Currency();
        this.sourceAction.isActive = true;
        this.currencyName = "";
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    openCrediTerms(content) {
        this.isEditMode = false;
        this.isDeleteMode = false;
        this.disableSave = false;
        this.isSaving = true;
        this.loadMasterCompanies();
        this.sourceAction = new CreditTerms();
        this.sourceAction.isActive = true;
        this.sourceAction.isDeleted = false;
        this.creditTermName = "";
        this.creditTermsId = "";
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    loadCurrencyData(CurrencyId){
        if(this.arrayListCurrancyId.length == 0) {
			this.arrayListCurrancyId.push(0); }
        this.commonservice.autoSuggestionSmartDropDownList('Currency', 'CurrencyId', 'Code','',true,500,this.arrayListCurrancyId.join(),this.currentUserMasterCompanyId).subscribe(res => {
              this.allCurrencyInfo = res.map(x => {
                  return {
                      ...x,
                      currencyId: x.value,
                      code: x.label
                  }
              });
              this.dataSource.data = this.allCurrencyInfo;
              if(CurrencyId > 0){
                    this.sourceVendor.currencyId = CurrencyId;
              }
              else{
                this.sourceVendor.currencyId = 0;
              }
        }, error => this.isSpinnerVisible=false ) //this.saveFailedHelper(error))
    }

    saveCurrency() {
        this.isSaving = true;

        if (this.isEditMode == false) {
            this.sourceAction.createdBy = this.userName;
            this.sourceAction.updatedBy = this.userName;
            this.sourceAction.code = this.currencyName;
            this.sourceAction.masterCompanyId = this.currentUserMasterCompanyId;
            this.currencyService.newAddcurrency(this.sourceAction).subscribe(data => {
                this.loadCurrencyData(data.currencyId);
                this.sourceVendor.currencyId = data.currencyId;
            });
        }
        else {

            this.sourceAction.updatedBy = this.userName;
            this.sourceAction.code = this.currencyName;
            this.sourceAction.masterCompanyId = this.currentUserMasterCompanyId;
            this.currencyService.updatecurrency(this.sourceAction).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => this.isSpinnerVisible=false )//this.saveFailedHelper(error));
        }
        this.modal.close();
    }

    filterCurrency(event) {
        this.currencyCollection = [];
        for (let i = 0; i < this.allCurrencyInfo.length; i++) {
            let currencyName = this.allCurrencyInfo[i].code;
            if (currencyName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.actionamecolle.push([{
                    "currencyId": this.allCurrencyInfo[i].currencyId,
                    "currencyName": currencyName
                }]),
                    this.currencyCollection.push(currencyName);
            }
        }
    }

    

    CurrencyInfo(event) {
        if (this.allCurrencyInfo) {
            for (let i = 0; i < this.allCurrencyInfo.length; i++) {
                if (event == this.allCurrencyInfo[i].code) {
                    this.sourceVendor.code = this.allCurrencyInfo[i].code;
                    this.disableSaveCurrency = true;
                    this.SelectedCurrencyInfo = event;
                }
            }
        }
    }    

    private loadCreditTermsData() {
        //this.alertService.startLoadingMessage();
        //this.loadingIndicator = true;
        this.CreditTermsService.getCreditTermsList(this.currentUserMasterCompanyId).subscribe(
            results => this.onCreditTermsdata(results[0]),
            error => this.isSpinnerVisible=false //this.saveFailedHelper(error)
        );
    }

    private onCreditTermsdata(getCreditTermsList: any) {
        //this.alertService.stopLoadingMessage();
        //this.loadingIndicator = false;
        this.dataSource.data = getCreditTermsList;
        this.allcreditTermInfo = getCreditTermsList.columnData.filter(x => {
            if (x.isActive === true) {
                return x;
            }
        });
    }

    private loadDiscountData() {
        //this.alertService.startLoadingMessage();
        //this.loadingIndicator = true;
        this.vendorService.getDiscountList().subscribe(
            results => this.onDataLoadClassifiSuccessful(results[0]),
            error => this.isSpinnerVisible=false//this.saveFailedHelper(error)
        );

    }

    private onDataLoadClassifiSuccessful(getDiscountList) {
        //this.alertService.stopLoadingMessage();
        //this.loadingIndicator = false;
        this.dataSource.data = getDiscountList;
        this.alldiscountvalueInfo = getDiscountList.filter(x => {
            if (x.isActive === true) {
                return x;
            }
        });
    }

    getAllDiscountDropdownList(DiscountId){
		if(this.arrayListDiscountId.length == 0) {
			this.arrayListDiscountId.push(0); }
        this.commonservice.autoSuggestionSmartDropDownList('[Discount]', 'DiscountId', 'DiscontValue','',true,500,this.arrayListDiscountId.join(),this.currentUserMasterCompanyId).subscribe(response => {
            this.discountList = response;
            if(DiscountId > 0){
                this.sourceVendor.discountId = DiscountId;
            }
            else{
                this.sourceVendor.discountId = 0;
            }
		},err => {
            this.isSpinnerVisible=false
			//const errorLog = err;
			//this.saveFailedHelper(errorLog);
		});
    }

    openDiscount(content) {
        this.isEditMode = false;
        this.isDeleteMode = false;
        this.isSaving = true;
        this.loadMasterCompanies();
        this.sourceAction = new DiscountValue();
        this.sourceAction.isActive = true;
        this.discontValue = "";
        this.modal = this.modalService.open(content, { size: 'sm', backdrop: 'static', keyboard: false });
    }

    discountvaluedesc(event) {
        const value = getObjectById('discountId', event, this.alldiscountvalueInfo);
        const exists = selectedValueValidate('discontValue', value, event);

        this.disableSaveConsume = !exists;
    }

    validateCreditTerms(value) {
        if (value != 0) {
            this.disableCreditTerms = false;
        } else {
            this.disableCreditTerms = true;
        }
    }

    getVendorName() {
        if (this.local !== undefined) {
            return editValueAssignByCondition('vendorName', this.local.vendorName) === undefined ? '' : editValueAssignByCondition('vendorName', this.local.vendorName);
        } else {
            return '';
        }
    }

    validateCurrency(value) {
        if (value != 0) {
            this.disableCurrency = false;
        } else {
            this.disableCurrency = true;
        }
    }

    previousOrNextTab(previousOrNext){
        this.nextOrPreviousTab = previousOrNext;
        let content = this.tabRedirectConfirmationModal;
        this.modal = this.modalService.open(content, { size: "sm" });
    }

    redirectToTab(){
        this.dismissModel();

        if(!this.disableUpdate)
        {
            this.editItemAndCloseModel(true);
        }    
		setTimeout(() => {
			this.stopmulticlicks = false;
		}, 500)
        
		if(this.nextOrPreviousTab == "Previous"){
            this.activeIndex = 4;
            this.vendorService.changeofTab(this.activeIndex);
        } else {
            this.activeIndex = 6;
        this.vendorService.changeofTab(this.activeIndex);
        }
    }

    redirectToTabWithoutSave(){
        this.dismissModel();
        
		if(this.nextOrPreviousTab == "Previous"){
            this.activeIndex = 4;
            this.vendorService.changeofTab(this.activeIndex);
        } else {
            this.activeIndex = 6;
        this.vendorService.changeofTab(this.activeIndex);
        }
    }

    enableSave() {
        if (this.local != undefined) {
            this.disableUpdate = false
        } else {
            this.disableUpdate = true;
        }

    }

    // Not In Use
    // private getgeneralInnfo() {
    //     this.alertService.startLoadingMessage();
    //     this.loadingIndicator = true;

    //     this.vendorService.getWorkFlows().subscribe(
    //         results => this.ongeneralDataLoadSuccessful(results[0]),
    //         error => this.onDataLoadFailed(error)
    //     );
    // }

    // currencyHandler(event) {
    //     if (event.target.value != "") {
    //         let value = event.target.value.toLowerCase();
    //         if (this.SelectedCurrencyInfo) {
    //             if (value == this.SelectedCurrencyInfo.toLowerCase()) {
    //                 this.disableSaveCurrency = true;
    //             }
    //             else {
    //                 this.disableSaveCurrency = false;
    //             }
    //         }

    //     }
    // }

    // private ongeneralDataLoadSuccessful(allWorkFlows: any[]) {
    //     this.alertService.stopLoadingMessage();
    //     this.loadingIndicator = false;
    //     this.dataSource.data = allWorkFlows;
    //     this.allgeneralInfo = allWorkFlows;
    //     if (this.vendorService.isCOntact == true) {
    //         this.vendorname = this.allgeneralInfo[0].vendorName;
    //         this.vendorCode = this.allgeneralInfo[0].vendorCode;
    //     }
    //     this.isEditMode = true;
    //     this.vendorId = this.allgeneralInfo[0].vendorId;
    // }
    
    // private loadFinalObject() {
    //     this.alertService.startLoadingMessage();
    //     this.loadingIndicator = true;
    //     this.vendorService.getFinalObj().subscribe(
    //         results => this.onFinalObjUrl(results[0]),
    //         error => this.onDataLoadFailed(error)
    //     );
    // }

    // private onFinalObjUrl(allWorkFlows: any) {
    //     this.alertService.stopLoadingMessage();
    //     this.loadingIndicator = false;
    //     this.dataSource.data = allWorkFlows;
    //     this.sourceVendor = allWorkFlows;
    // }

    // private refresh() {
    //     this.applyFilter(this.dataSource.filter);
    // }

    // private onHistoryLoadSuccessful(auditHistory: AuditHistory[], content) {
    //     this.alertService.stopLoadingMessage();
    //     this.loadingIndicator = false;
    //     this.auditHisory = auditHistory;
    //     this.modal = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
    // }

    // discountvalueHandler(value) {
    //     const exists = validateRecordExistsOrNot('discontValue', parseInt(value), this.alldiscountvalueInfo);
    //     if (exists.length > 0) {
    //         this.disableSaveConsume = true;
    //     }
    //     else {
    //         this.disableSaveConsume = false;
    //     }
    // }

    // saveCreditTermsdata() {
    //     this.isSaving = true;
    //     if (this.creditTermsId.toLowerCase().trim() == "") {
    //         this.alertService.showMessage("Empty", 'Cannot Submit Empty', MessageSeverity.warn);
    //         return;
    //     }
    //     for (let i = 0; i < this.allcreditTermInfo.length; i++) {
    //         if (this.allcreditTermInfo[i].name.toLowerCase().localeCompare(this.creditTermsId.toLowerCase()) == 0) {
    //             this.alertService.showMessage("Duplicate", 'Already Exist', MessageSeverity.warn);
    //             return;
    //         }
    //         else {
    //         }
    //     }
    //     if (this.isEditMode == false) {
    //         this.sourceAction.createdBy = this.userName;
    //         this.sourceAction.updatedBy = this.userName;
    //         this.sourceAction.name = this.creditTermsId;
    //         this.sourceAction.masterCompanyId = 1;
    //         this.CreditTermsService.newAddcreditterms(this.sourceAction).subscribe(data => {
    //             this.loadCreditTermsData();
    //             this.sourceVendor.creditTermsId = data.creditTermsId;
    //         }, error => this.saveFailedHelper(error))
    //     }
    //     else {
    //         this.sourceAction.updatedBy = this.userName;
    //         this.sourceAction.name = this.creditTermsId;
    //         this.sourceAction.masterCompanyId = 1;
    //         this.CreditTermsService.updatecreditterms(this.sourceAction).subscribe(
    //             response => this.saveCompleted(this.sourceAction),
    //             error => this.saveFailedHelper(error));
    //         this.loadCreditTermsData();
    //     }
    //     this.modal.close();
    // }

    // saveDiscountPercent() {
    //     this.isSaving = true;
        
    //     if (this.isEditMode == false) {
    //         this.sourceAction.createdBy = this.userName;
    //         this.sourceAction.updatedBy = this.userName;
    //         this.sourceAction.discontValue = this.discontValue;
    //         this.vendorService.newAddDiscount(this.sourceAction).
    //             subscribe(data => {
    //                 this.loadDiscountData()
    //             }, error => this.saveFailedHelper(error))
    //     }
    //     else {
    //         this.sourceAction.updatedBy = this.userName;
    //         this.sourceAction.discontValue = this.discontValue;
    //         this.sourceAction.masterCompanyId = 1;
    //         this.vendorService.updatediscount(this.sourceAction).subscribe(
    //             response => this.saveCompleted(this.sourceAction),
    //             error => this.saveFailedHelper(error));
    //     }
    //     this.modal.close();
    // }

    // filtercreditTerms(event) {
    //     this.creditTermsCollection = [];

    //     for (let i = 0; i < this.allcreditTermInfo.length; i++) {
    //         let creditTermName = this.allcreditTermInfo[i].name;
    //         if (creditTermName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
    //             this.actionamecolle.push([{
    //                 "creditTermsId": this.allcreditTermInfo[i].creditTermsId,
    //                 "creditTermName": creditTermName
    //             }]),
    //                 this.creditTermsCollection.push(creditTermName);
    //         }
    //     }
    // }

    // onSelectCreditTerm(event) {
    //     if (this.allcreditTermInfo) {
    //         for (let i = 0; i < this.allcreditTermInfo.length; i++) {
    //             if (event == this.allcreditTermInfo[i].name) {
    //                 this.sourceVendor.creditTermName = this.allcreditTermInfo[i].creditTermName;
    //                 this.disableSave = true;
    //                 this.selectedActionName = event;
    //             }
    //         }
    //     }
    // }

    // eventHandler(event) {
    //     let value = event.target.value.toLowerCase();
    //     if (this.selectedActionName) {
    //         if (value == this.selectedActionName.toLowerCase()) {
    //             this.disableSave = true;
    //         }
    //         else {
    //             this.disableSave = false;
    //         }
    //     }
    // }

    // filterDiscountvalue(event) {
    //     this.discountcollection = [];
    //     for (let i = 0; i < this.alldiscountvalueInfo.length; i++) {
    //         let discontValue = this.alldiscountvalueInfo[i].discontValue;
    //         this.discountcollection.push(discontValue);
    //     }
    // }

    // changevalue(value) {
    //     debugger
    //     this.sourceVendor.v1099RentDefault = false;
    //     this.sourceVendor.v1099RoyaltiesDefault = false;
    //     this.sourceVendor.v1099OtherIncomeDefault = false;
    //     this.sourceVendor.v1099MedicalHealthPaymentsDefault = false;
    //     this.sourceVendor.v1099NonEmployeeCompDefault = false;
    //     this.sourceVendor.v1099GoldenParachuteDefault = false;
    //     this.sourceVendor.v1099GrossProceedsPaidToAttorneyDefault = false;

    //     if (value == "sourceVendor.v1099RentDefault") {
    //         this.sourceVendor.v1099RentDefault = true;            
    //     }
    //     else if (value == "sourceVendor.v1099RoyaltiesDefault") {
    //         this.sourceVendor.v1099RoyaltiesDefault = true;          
    //     }
    //     else if (value == "sourceVendor.v1099OtherIncomeDefault") {
    //         this.sourceVendor.v1099OtherIncomeDefault = true;            
    //     }
    //     else if (value == "sourceVendor.v1099MedicalHealthPaymentsDefault") {
    //         this.sourceVendor.v1099MedicalHealthPaymentsDefault = true;            
    //     }
    //     else if (value == "sourceVendor.v1099NonEmployeeCompDefault") {
    //         this.sourceVendor.v1099NonEmployeeCompDefault = true;            
    //     }
    //     else if (value == "sourceVendor.v1099GoldenParachuteDefault") {
    //         this.sourceVendor.v1099GoldenParachuteDefault = true;          
    //     }
    //     else if (value == "sourceVendor.v1099GrossProceedsPaidToAttorneyDefault") {
    //         this.sourceVendor.v1099GrossProceedsPaidToAttorneyDefault = true;         
    //     }
    //     else{
    //         this.sourceVendor.v1099RentDefault = true;   
    //     }
    // }

    // private saveSuccessHelper(role?: any) {
    //     this.isSaving = false;
    //     this.alertService.showMessage("Success", `Action was created successfully`, MessageSeverity.success);
    //     this.loadData();
    // }

    // private getDismissReason(reason: any): string {
    //     if (reason === ModalDismissReasons.ESC) {
    //         return 'by pressing ESC';
    //     } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    //         return 'by clicking on a backdrop';
    //     } else {
    //         return `with: ${reason}`;
    //     }
    // }

    // private loadCurrencyDataOld() {
    //     this.alertService.startLoadingMessage();
    //     this.loadingIndicator = true;
    //     this.currencyService.getCurrencyList().subscribe(
    //         results => this.onCurrecyLoad(results[0]),
    //         error => this.onDataLoadFailed(error)
    //     );
    // }

    // private onCurrecyLoad(getCurrencyList: Currency[]) {
    //     this.alertService.stopLoadingMessage();
    //     this.loadingIndicator = false;
    //     this.dataSource.data = getCurrencyList;
    //     this.allCurrencyInfo = getCurrencyList;
    // }
}









