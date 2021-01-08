import { OnInit, Component, AfterViewInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute } from "@angular/router";
import { LazyLoadEvent, SortEvent, MenuItem } from 'primeng/api';
import { Master1099Service } from '../../../services/master-1099.service';
import { fadeInOut } from "../../../services/animations";
import { AlertService, MessageSeverity } from "../../../services/alert.service";
import { GlAccount } from "../../../models/GlAccount.model";
import { GlAccountService } from "../../../services/glAccount/glAccount.service";
import { CurrencyService } from "../../../services/currency.service";
import { GLAccountClassService } from "../../../services/glaccountclass.service";
import { GlCashFlowClassificationService } from "../../../services/gl-cash-flow-classification.service";
import { LegalEntityService } from "../../../services/legalentity.service";
import { AuthService } from "../../../services/auth.service";
import { Router } from "@angular/router";
import { NodeSetupService } from "../../../services/node-setup/node-setup.service";
import { POROCategoryService } from "../../../services/porocategory/po-ro-category.service";
import { GlCashFlowClassification } from "../../../models/glcashflowclassification.model";
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ModalService } from "../../../services/Index";
import { CommonService } from '../../../services/common.service';
import { NodeTypeService } from '../../../services/node-Type.service';
import { AccountListingService } from '../../../services/account-listing/account-listing.service';

import { getValueFromObjectByKey, getObjectByValue, validateRecordExistsOrNot, editValueAssignByCondition, getObjectById, selectedValueValidate } from '../../../generic/autocomplete';

 
@Component({
    selector: 'app-account-listing-create',
    templateUrl: './account-listing-create.component.html',
    styleUrls: ['./account-listing-create.component.scss'],
    animations: [fadeInOut]
})
/** Account List component*/
export class AccountListingCreateComponent implements OnInit {

    currentGLAccount: GlAccount;
    glAccountList: GlAccount[];
    updateMode: boolean;
    poroCategoryReq: boolean;
    allCurrencyInfo: any[] = [];
    allGLAccountClassInfo: any[] = [];
    nodeSetupList: any[] = [];
    allGLCashFlowClassInfo: any[] = [];
    allManagemtninfo: any[] = [];
    companyList: any[] = [];
    miscData: any[] = [];
    poroCategoryList: any[] = [];
    modal: NgbModalRef;
    disableSave: boolean;
    loadingIndicator: boolean;
    GLClassFlowClassificationName: string;
    public sourceglcashflowclassification: any = {}
    isEditMode: boolean;
    isSaving: boolean;
    isDeleteMode: boolean;
    isSpinnerVisible:boolean=false;
    display: boolean = false;
    accountListCreateForm: FormGroup;
    accountId: any;
    editMode = false;
    accountData: any[];
    leafNodeNameObj: any[];
    entitiesObj: any[];
    entityIds:any=[];
    accountTitle = "Create GL Accounts";
    selectedBalanceType = [];
    balanceTypeCheckBoxReq = false;
    glAccountObj: any = {};
    ledgerNameObject: any[] = [];
    customerNames: { glaccountid: any; name: any; }[];
    accountCodeObject: any[];
    accountNameObject: any[];
    accountTypeObject: any[];
    ledgerNameObjectData: any[];
    accountCodeObjectData: any[];
    accountNameObjectData: any[];
    accountTypeObjectData: any[];
    setEditArray: any = [];
    ischeckLedgerNameExists: boolean = false;
    isAccountCodeExists: boolean = false;
    isAccountNameExists: boolean = false;
    isAccountTypeExists: boolean = false;
    submittedValue: any;
    disableSaveGLCFName: boolean = false;
    home: any;
    breadcrumbs: MenuItem[];
    ledgerNameValue: string;
    constructor(private route: ActivatedRoute,
        private accountListingService: AccountListingService,
        private formBuilder: FormBuilder, private legalEntityservice: LegalEntityService, private modalService: NgbModal,
        private poroCategoryService: POROCategoryService, private nodeSetupService: NodeSetupService, private router: Router,
        private authService: AuthService, private glcashFlowClassifcationService: GlCashFlowClassificationService,
        private alertService: AlertService, private glAccountService: GlAccountService, private master1099Services: Master1099Service,
        private nodetypeservices: NodeTypeService, private commonService: CommonService,
        private currencyService: CurrencyService, public glAccountClassService: GLAccountClassService) {
        if (this.glAccountService.glAccountEditCollection) {
            this.currentGLAccount = this.glAccountService.glAccountEditCollection;
        }
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    saveUpdateBtn: any;
    ngOnInit(): void {
    
        this.route.paramMap.subscribe(params => {
            this.saveUpdateBtn = params.get('id')
            if (params.get('id') == null) {
                this.createAccountData();
                this.getLedgerObject('');
                this.load1099Miscdata('');
                this.getLeafNodeObject('');
                this.loadEntityData('');
                this.loadGLAccountTypeData('');
                this.loadGLCashFlowClassification('');
                this.loadPOCategory('');
                this.loadcurrencyData('');
            } else {
                this.accountId = params.get("id")
                if (this.accountId) {
                    this.editMode = true
                    this.accountTitle = "Edit GL Accounts"
                    this.updateAccountData(this.accountId)

                }
            }

        }, err => {
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        });
        
       
        this.breadcrumbs = [
            { label: 'Accounting' },
            { label: this.editMode ? 'Edit GL Account' : 'Create GL Account' },
        ];

        if (this.glAccountService.glAccountEditCollection == null) {
            this.currentGLAccount = new GlAccount();
        }
        
        if (this.glAccountService.glAccountEditCollection == null) {
         
            this.currentGLAccount.allowManualJE = true;
        }

        let formatted_date = this.formatDateTime(null)

        this.glAccountObj = {
            createdBy: this.userName,
            updatedBy: this.userName,
            createdDate: formatted_date,
        };
    }

 
    updateAccountData(id) {
        this.disableSave=true;
        this.isSpinnerVisible=true;
        this.accountListingService.getGlAccountById(id).subscribe(
            glAccountData => {
                const data = glAccountData[0];

                this.glAccountObj =
                {
                    ...data,

                    ledgerName:data.ledgerId,
                    glAccountTypeId: data.glAccountTypeId ? data.glAccountTypeId: 0,
                    pOROCategoryId: data.poroCategoryId ? data.poroCategoryId: 0,
                    gLAccountNodeId: data.glAccountNodeId ? data.glAccountNodeId: 0,

                    //glAccountTypeId: data.glAccountTypeId ? data.glAccountTypeId: 0,
                    //poroCategoryId: data.poroCategoryId ? data.poroCategoryId: 0,
                    //glAccountNodeId: data.glAccountNodeId ? data.glAccountNodeId: 0,

                   glAccountLedgerId: data.glAccountLedgerId,
                    category1099Id: data.category1099Id ? data.category1099Id:0,
                    interCompany: data.interCompany ? data.interCompany: false,
                    allowManualJE: data.allowManualJE ? data.allowManualJE: false,
                    glClassFlowClassificationId: data.glClassFlowClassificationId ? data.glClassFlowClassificationId: 0,
                    nodeTypeName: data.glAccountNodeId ? data.glAccountNodeId : 0,
                    activeFlag: data.isActive,
                    shareWithEntityIds:data.shareWithEntityIds
                }
                this.isSpinnerVisible=false;
                this.getLedgerObject('');  
                this.load1099Miscdata('');
                this.getLeafNodeObject('');
                this.loadEntityData('');
                this.loadGLAccountTypeData('');
                this.loadGLCashFlowClassification('');
                this.loadPOCategory('');
                this.loadcurrencyData('');
            },
            error => {
                this.isSpinnerVisible=false;
                const errorLog = error;
                this.errorMessageHandler(errorLog);
            }

        );
    }


    get currentUserMasterCompanyId(): number {
        return this.authService.currentUser
            ? this.authService.currentUser.masterCompanyId
            : null;
    }



    saveglaccount() {

        this.balanceTypeCheckBoxReq = false;
        if (this.glAccountObj.ledgerName == "" || this.glAccountObj.accountCode == "" || this.glAccountObj.accountName == "" || this.glAccountObj.glAccountTypeId == ""

        //if (this.glAccountObj.ledgerId == 0 || this.glAccountObj.accountCode == "" || this.glAccountObj.accountName == "" || this.glAccountObj.glAccountTypeId == ""



            || this.glAccountObj.glClassFlowClassificationId == "") {
            this.alertService.showMessage("Warning", 'Please Enter Required Fields.', MessageSeverity.warn);

        }


        else {
            const formValue = {

                masterCompanyId: this.currentUserMasterCompanyId,
                ...this.glAccountObj,
                updatedBy: this.userName,
             
            }

            if (this.editMode) {
                this.glAccountObj = {
                    ...this.glAccountObj,
                    masterCompanyId: this.currentUserMasterCompanyId,
                    updatedBy: this.userName,
                };
                this.glAccountObj.poroCategoryId=this.glAccountObj.poroCategoryId!=0 ?this.glAccountObj.poroCategoryId : null;
                this.glAccountObj.category1099Id=this.glAccountObj.category1099Id!=0 ?this.glAccountObj.category1099Id : null;
                 this.glAccountObj.glAccountNodeId=this.glAccountObj.glAccountNodeId!=0 ?this.glAccountObj.glAccountNodeId : null;
                
                    this.accountListingService.updateGlAccount(this.glAccountObj).subscribe(response => {
                        this.alertService.showMessage('Success','GLAccount Updated successfully.', MessageSeverity.success);
                        this.router.navigateByUrl('/generalledgermodule/generalledgerpage/app-account-listing');
                    }, err => {
                        const errorLog = err;
                        this.errorMessageHandler(errorLog);
                    });
                    
            } else {
                this.ledgerNameObjectData.forEach(element => {
                 if(element.value==formValue.ledgerId){
                     formValue.ledgerName=element.label;
                 }
                });
                this.accountListingService.createGlAccount1(formValue).subscribe(response => {
                    this.alertService.showMessage('Success', 'GLAccount Created successfully.', MessageSeverity.success);
                    this.router.navigateByUrl('/generalledgermodule/generalledgerpage/app-account-listing');
                }, (errorLog) => {
                         this.errorMessageHandler(errorLog);
               });
            }
         
        }
    }
    errorMessageHandler(log) {
        var msg = '';
        if (typeof log.error == 'string') {
            this.alertService.showMessage(
                'Error',
                log.error,
                MessageSeverity.error
            );

        }
    }
     updateFormPayload(value, list) {
        if(value!=undefined && value!=0){
       return list.find((item) => item.value == value).label;
       }
     }
    formatDateTime(dateTime) {
        let formattedDateTime;
        if (dateTime) {
            dateTime = new Date(dateTime)
            if (dateTime instanceof Date)
                formattedDateTime = (dateTime.getMonth() + 1) + "/" + dateTime.getDate() + "/" + dateTime.getFullYear()
            else
                this.formatDateTime(null)
        } else {
            dateTime = new Date()
            formattedDateTime = (dateTime.getMonth() + 1) + "/" + dateTime.getDate() + "/" + dateTime.getFullYear()
        }
        return formattedDateTime
    }

    loadLedgerNames(event) {
        this.ledgerNameObject = this.ledgerNameObjectData
    }

    filterCustomerNames(event) {
        this.ledgerNameObject = this.ledgerNameObjectData;
        this.ledgerNameObject = [...this.ledgerNameObjectData.filter(x => {
            return x.name.toLowerCase().includes(event.query.toLowerCase())
        })]
    }

    checkLedgerNameExists(field, value) {
        const exists = validateRecordExistsOrNot(field, value, this.ledgerNameObjectData)
        if (exists.length > 0) {
            this.ischeckLedgerNameExists = true;
            this.disableSave = true;
        } else {
            this.ischeckLedgerNameExists = false;
            this.disableSave = false;
        }
    }

    selectedLedgerName() {
        this.ischeckLedgerNameExists = true;
    }

    loadAccountCode(event) {

        this.accountCodeObject = [...this.accountCodeObjectData.filter(x => {
            return x.name.toLowerCase().includes(event.query.toLowerCase())
        })]
    }

    checkAccountCodeExists(field, value) {
        const exists = validateRecordExistsOrNot(field, value, this.accountCodeObjectData)
        if (exists.length > 0) {

            this.isAccountCodeExists = true;
        } else {

            this.isAccountCodeExists = false;
        }

    }

    selectedAccountCode() {
        this.isAccountCodeExists = true;
    }

    loadAccountName(event) {

        this.accountNameObject = [...this.accountNameObjectData.filter(x => {
            return x.name.toLowerCase().includes(event.query.toLowerCase())
        })]
    }

    checkAccountNameExists(field, value) {
        const exists = validateRecordExistsOrNot(field, value, this.accountNameObjectData)
        if (exists.length > 0) {

            this.isAccountNameExists = true;
        } else {

            this.isAccountNameExists = false;
        }

    }

    selectedAccountName() {
        this.isAccountNameExists = true;
    }


    loadAccountType(event) {

        this.accountTypeObject = [...this.accountTypeObjectData.filter(x => {
            return x.name.toLowerCase().includes(event.query.toLowerCase())
        })]
    }

    checkAccountTypeExists(field, value) {
        const exists = validateRecordExistsOrNot(field, value, this.accountTypeObjectData)
        if (exists.length > 0) {

            this.isAccountTypeExists = true;
        } else {

            this.isAccountTypeExists = false;
        }

    }

    selectedAccountType() {
        this.isAccountTypeExists = true;
    }

    
    createAccountData() {
            this.glAccountObj = {
                ledgerId: 0,
                oldAccountCode: '',
                accountDescription: '',
                glAccountTypeId: null,
                interCompany: false,
                shareWithEntityIds: [],
                allowManualJE: false,
                category1099Id: null,
                glClassFlowClassificationId: 0,
                poroCategoryId: 0,
                createdBy: this.userName,
                updatedBy: this.userName,
                createdDate: this.formatDateTime(null)
            }
   
                }

    addGLAccount() {
        if (!(this.currentGLAccount.accountCode && this.currentGLAccount.accountName && this.currentGLAccount.glAccountTypeId && this.currentGLAccount.glAccountNodeId && this.currentGLAccount.glClassFlowClassificationId && this.currentGLAccount.poroCategoryId && (this.currentGLAccount.balanceTypeActual || this.currentGLAccount.balanceTypeBudget || this.currentGLAccount.balanceTypeForecast)
        )) {
            this.display = true;
        }
        if (!this.display) {
            this.currentGLAccount.createdBy = this.userName;
            this.currentGLAccount.updatedBy = this.userName;
            this.currentGLAccount.interCompany = this.currentGLAccount.interCompany ? this.currentGLAccount.interCompany: false;
            this.currentGLAccount.allowManualJE =this.currentGLAccount.allowManualJE ? this.currentGLAccount.allowManualJE :false;
            this.currentGLAccount.nodeTypeName = this.currentGLAccount.nodeTypeName ? this.currentGLAccount.nodeTypeName: '';
            this.currentGLAccount.shareWithEntityIds =this.currentGLAccount.shareWithEntityIds ? this.currentGLAccount.shareWithEntityIds :[];
            this.currentGLAccount.glAccountNodeId =this.currentGLAccount.glAccountNodeId ? this.currentGLAccount.glAccountNodeId :null;
            this.currentGLAccount.category1099Id =this.currentGLAccount.category1099Id != null ? this.currentGLAccount.category1099Id :null;
            if (!this.currentGLAccount.glAccountId) {
                this.isSpinnerVisible=true;
                this.glAccountService.add(this.glAccountObj).subscribe(glData => {
                    this.currentGLAccount = glData;
                    this.alertService.showMessage('Success','GLAccount added successfully.',MessageSeverity.success);
                    this.isSpinnerVisible=false;
                    this.glAccountService.getAll().subscribe(glAccountData => {
                        this.glAccountList = glAccountData[0];
                        this.router.navigateByUrl('/generalledgermodule/generalledgerpage/app-glaccount-list');
                    }, err => {
                        const errorLog = err;
                        this.errorMessageHandler(errorLog);
                    });
                }, err => {
                    const errorLog = err;
                    this.errorMessageHandler(errorLog);
                });
            }
            else {
                this.currentGLAccount.updatedBy = this.userName;
                this.isSpinnerVisible=true;
                this.glAccountService.update(this.currentGLAccount).subscribe(glAccount => {
                    this.alertService.showMessage('Success','GLAccount updated successfully.',MessageSeverity.success);
                    this.isSpinnerVisible=false;
                    this.glAccountService.getAll().subscribe(glAccounts => {
                        this.glAccountList = glAccounts[0];
                    }, err => {
                        const errorLog = err;
                        this.errorMessageHandler(errorLog);
                    });
                    this.updateMode = false;
                }, err => {
                    const errorLog = err;
                    this.errorMessageHandler(errorLog);
                });
            }
        }
    }

   
    closeClick(){
        this.router.navigateByUrl('/generalledgermodule/generalledgerpage/app-account-listing');
    }
    

    private loadPOCategory(value) {
        this.setEditArray = [];
        if (this.isEditMode == true) {
            this.setEditArray.push(this.glAccountObj.poroCategoryId ? this.glAccountObj.poroCategoryId : 0);

        } else {
            this.setEditArray.push(0);
        }
        const strText = value ? value : '';
        this.commonService.autoSuggestionSmartDropDownList('POROCategory','poroCategoryId','CategoryName',strText, true, 20, this.setEditArray.join()).subscribe(res => {
            if (res && res.length != 0) {
                this.poroCategoryList = res;
            }
        }, err => {
                const errorLog = err;
                   this.errorMessageHandler(errorLog);
                });
    }




    private loadcurrencyData(value) {
        this.setEditArray = [];
        if (this.isEditMode == true) {
            this.setEditArray.push(this.glAccountObj.currencyId ? this.glAccountObj.currencyId : 0);
        } else {
            this.setEditArray.push(0);
        }
        const strText = value ? value : '';
        this.commonService.autoSuggestionSmartDropDownList('Currency', 'CurrencyId', 'Code', strText, true, 20, this.setEditArray.join()).subscribe(res => {
            this.allCurrencyInfo = res;
        }, err => {
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        });
    }


    loadGLAccountTypeData(value) {
        this.setEditArray = [];
        if (this.isEditMode == true) {
            this.setEditArray.push(this.glAccountObj.glAccountTypeId ? this.glAccountObj.glAccountTypeId : 0);

        } else {
            this.setEditArray.push(0);
        }
        const strText = value ? value : '';
        this.commonService.autoSuggestionSmartDropDownList("GLAccountClass", "GLAccountClassId", "GLAccountClassName", strText, true, 20, this.setEditArray.join()).subscribe(res => {
            if (res && res.length != 0) {
                this.accountTypeObject = res;
            }
        })
    }


    loadEntityData(value) {
        this.setEditArray = [];
        if (this.isEditMode == true) {
            this.setEditArray.push(this.glAccountObj.shareWithEntityIds ? this.glAccountObj.shareWithEntityIds : 0);

        } else {
            this.setEditArray.push(0);
        }
        const strText = value ? value : '';
        this.commonService.autoSuggestionSmartDropDownList("LegalEntity", "LegalEntityId", "Name", strText, true, 20, this.setEditArray.join()).subscribe(res => {
            if (res && res.length != 0) {
                this.entitiesObj = res;
                
            }
            
        }, err => {
                    const errorLog = err;
                 this.errorMessageHandler(errorLog);
                });
        
    }
    

    private loadGLCashFlowClassification(value) {
        this.setEditArray = [];
        if (this.isEditMode == true) {
            this.setEditArray.push(this.glAccountObj.glClassFlowClassificationId ? this.glAccountObj.glClassFlowClassificationId : 0);

        } else {
            this.setEditArray.push(0);
        }
        const strText = value ? value : '';
        this.commonService.autoSuggestionSmartDropDownList('GLCashFlowClassification','glClassFlowClassificationId','GLClassFlowClassificationName',strText, true, 20, this.setEditArray.join()).subscribe(res => {
            if (res && res.length != 0) {               
                this.allGLCashFlowClassInfo = res;
            }
        }, err => {
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        });
    }



    getLedgerObject(value) {
        this.setEditArray = [];
        if (this.isEditMode == true) {
            this.setEditArray.push(this.glAccountObj.ledgerId ? this.glAccountObj.ledgerId: 0);

        } else {
            this.setEditArray.push(0);
        }
        const strText = value ? value : '';
        this.commonService.autoSuggestionSmartDropDownList("Ledger", "LedgerId", "LedgerName", strText, true, 20, this.setEditArray.join()).subscribe(res => {
            if (res && res.length != 0) {
                this.ledgerNameObjectData = res;
            }
            
        }, err => {
            const errorLog = err;
            this.errorMessageHandler(errorLog);
        });
    }

    



           getLeafNodeObject(value) {
            this.setEditArray = [];
            if (this.isEditMode == true) {
                this.setEditArray.push(this.glAccountObj.nodeTypeName ? this.glAccountObj.nodeTypeName : 0);
    
            } else {
                this.setEditArray.push(0);
            }
            const strText = value ? value : '';
            this.commonService.autoSuggestionSmartDropDownList("Nodetype", "NodetypeId", "NodetypeName", strText, true, 20, this.setEditArray.join()).subscribe(res => {
                if (res && res.length != 0) {
                    this.leafNodeNameObj = res;
                }
            }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            });
        }
    

    load1099Miscdata(value) {
 
            this.setEditArray = [];
            if (this.isEditMode == true) {
                this.setEditArray.push(this.glAccountObj.category1099Id ? this.glAccountObj.category1099Id : 0);
    
            } else {
                this.setEditArray.push(0);
            }
            const strText = value ? value : '';
            this.commonService.autoSuggestionSmartDropDownList("Master1099", "Master1099Id", "Name", strText, true, 20, this.setEditArray.join()).subscribe(res => {
                if (res && res.length != 0) {
                    this.miscData = res;
                }
            }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            })
        }
    


    resetAssetStatus(): void {
        this.updateMode = false;
        this.currentGLAccount = new GlAccount();
    }


    open(content) {
        this.sourceglcashflowclassification = new GlCashFlowClassification();
        this.GLClassFlowClassificationName = "";
        this.sourceglcashflowclassification.isActive = true;
        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(() => {
        }, () => { 
          //  console.log('Backdrop click') 
        })
    }

    saveGlcahsFlow() {
        this.isSaving = true;
        if (!this.sourceglcashflowclassification.glCashFlowClassificationId) {

            this.sourceglcashflowclassification.createdBy = this.userName;
            this.sourceglcashflowclassification.updatedBy = this.userName;
            this.sourceglcashflowclassification.masterCompanyId = 1;
            this.glcashFlowClassifcationService.newGlCashFlowClassification(this.sourceglcashflowclassification).subscribe(cashFlow => {
                this.loadGLCashFlowClassification('');
                this.currentGLAccount.glClassFlowClassificationId = cashFlow.glClassFlowClassificationId;
                this.alertService.showMessage('C-Flow added successfully.');
            }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            }
            );
        }
        else {

            this.sourceglcashflowclassification.updatedBy = this.userName;
            this.sourceglcashflowclassification.masterCompanyId = 1;
            this.glcashFlowClassifcationService.updateCashFlowClassification(this.sourceglcashflowclassification).subscribe(cashFlow => {
                this.alertService.showMessage('C-Flow Updated successfully.');
            }, err => {
                const errorLog = err;
                this.errorMessageHandler(errorLog);
            }
            );
        }
        this.modal.close();
    }

    dismissModel() {
        this.isDeleteMode = false;
        this.isEditMode = false;
        this.modal.close();
    }

    onCheckboxChagen(event, value) {
        if (event.checked) {
            this.selectedBalanceType.push(value);
        }

        if (!event.checked) {
            let index = this.selectedBalanceType.indexOf(value);
            if (index > -1) {
                this.selectedBalanceType.splice(index, 1);
            }
        }
        
    }


    selectedCustomerName() {
        this.disableSaveGLCFName = true;
    }
    selectedGLCFName(object) {
        const exists = selectedValueValidate('label', object, this.isEditMode)
        this.disableSaveGLCFName = !exists;
        this.disableSave = !exists;;
    }
    getmemo($event){
        this.disableSave=false;
    }

}