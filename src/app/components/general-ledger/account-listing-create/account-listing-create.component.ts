import { OnInit, Component } from "@angular/core";
import { FormGroup} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { MenuItem } from "primeng/api";
import { fadeInOut } from "../../../services/animations";
import { AlertService, MessageSeverity } from "../../../services/alert.service";
import { GlAccount } from "../../../models/GlAccount.model";
import { GlAccountService } from "../../../services/glAccount/glAccount.service";
import { GLAccountClassService } from "../../../services/glaccountclass.service";
import { GlCashFlowClassificationService } from "../../../services/gl-cash-flow-classification.service";
import { AuthService } from "../../../services/auth.service";
import { Router } from "@angular/router";
import { GlCashFlowClassification } from "../../../models/glcashflowclassification.model";
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CommonService } from "../../../services/common.service";
import { AccountListingService } from "../../../services/account-listing/account-listing.service";
import { getValueFromObjectByKey, getObjectByValue, validateRecordExistsOrNot, selectedValueValidate } from "../../../generic/autocomplete";
import { ModuleConstants, PermissionConstants } from 'src/app/generic/ModuleConstant';

@Component({
  selector: "app-account-listing-create",
  templateUrl: "./account-listing-create.component.html",
  styleUrls: ["./account-listing-create.component.scss"],
  animations: [fadeInOut],
})
/** Account List component*/
export class AccountListingCreateComponent implements OnInit {
  currentGLAccount: GlAccount;
  glAccountList: GlAccount[];
  updateMode: boolean;
  poroCategoryReq: boolean;  
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
  public sourceglcashflowclassification: any = {};
  isEditMode: boolean;
  isSaving: boolean;
  isDeleteMode: boolean;
  isSpinnerVisible: boolean = false;
  display: boolean = false;
  accountListCreateForm: FormGroup;
  accountId: any;
  editMode = false;
  accountData: any[];
  leafNodeNameObj: any[];
  entitiesObj: any[];
  entityIds: any = [];
  accountTitle = "Create GL Accounts";
  selectedBalanceType = [];
  balanceTypeCheckBoxReq = false;
  glAccountObj: any = {};
  ledgerNameObject: any[] = [];
  customerNames: { glaccountid: any; name: any }[];
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
  isAdd:boolean=true;
  isEdit:boolean=true;
  constructor(
    private route: ActivatedRoute,
    private accountListingService: AccountListingService,  
    private modalService: NgbModal, 
    private router: Router,
    private authService: AuthService,
    private glcashFlowClassifcationService: GlCashFlowClassificationService,
    private alertService: AlertService,
    private glAccountService: GlAccountService,  
    private commonService: CommonService,    
    public glAccountClassService: GLAccountClassService) {
    if (this.glAccountService.glAccountEditCollection) {
      this.currentGLAccount = this.glAccountService.glAccountEditCollection;
    }
    this.isAdd=this.authService.checkPermission([ModuleConstants.GLAccount+'.'+PermissionConstants.Add])
    this.isEdit=this.authService.checkPermission([ModuleConstants.GLAccount+'.'+PermissionConstants.Update])
  }

  get userName(): string {
    return this.authService.currentUser
      ? this.authService.currentUser.userName
      : "";
  }

    saveUpdateBtn: any;
    ngOnInit(): void {
    
        this.route.paramMap.subscribe(params => {
            this.saveUpdateBtn = params.get('id')
            if (params.get('id') == null) {
                this.createAccountData();
                this.getLedgerObject('');
                this.load1099Miscdata('');
                this.loadEntityData('');
                this.loadGLCashFlowClassification('');
                this.loadGLAccountTypeData('');                
                this.getLeafNodeObject('');               
                this.loadPOCategory('');                
            } else {
                this.accountId = params.get("id")
                if (this.accountId) {
                    this.editMode = true;
                    this.isEditMode = true;
                    this.accountTitle = "Edit GL Accounts"
                    this.updateAccountData(this.accountId)
                }
            }

        }, err => {
            const errorLog = err;           
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
            allowManualJE : 1
        };
    }

    ////// Master Drop Down start
    getLedgerObject(value) {
        this.setEditArray = [];
        if (this.isEditMode == true) { 
            this.setEditArray.push(this.glAccountObj.ledgerIds && this.glAccountObj.ledgerIds[0] ? this.glAccountObj.ledgerIds : 0);
        } else {
            this.setEditArray.push(0);
        }        
        const strText = value ? value : '';
        this.commonService.autoSuggestionSmartDropDownList("Ledger", "LedgerId", "LedgerName", strText, true, 0, this.setEditArray.join(),this.currentUserMasterCompanyId).subscribe(res => {
            if (res && res.length != 0) {
                this.ledgerNameObjectData = res;
            }            
        }, err => {
            this.isSpinnerVisible = false;
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
        this.commonService.autoSuggestionSmartDropDownList("Master1099", "Master1099Id", "Name", strText, true, 0, this.setEditArray.join(),this.currentUserMasterCompanyId).subscribe(res => {
            if (res && res.length != 0) {
                this.miscData = res;
            }
        }, err => {
            this.isSpinnerVisible = false;
        })
    }

    loadEntityData(value) {
        this.setEditArray = [];
        if (this.isEditMode == true) {
            this.setEditArray.push(this.glAccountObj.shareWithEntityIds && this.glAccountObj.shareWithEntityIds.lenght > 0 ? this.glAccountObj.shareWithEntityIds : 0);
        } else {
            this.setEditArray.push(0);
        }
        const strText = value ? value : '';
        this.commonService.autoSuggestionSmartDropDownList("LegalEntity", "LegalEntityId", "Name", strText, true, 0, this.setEditArray.join(),this.currentUserMasterCompanyId).subscribe(res => {
            if (res && res.length != 0) {
                this.entitiesObj = res;                
            }            
        }, err => {
            this.isSpinnerVisible = false;
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
        this.commonService.autoSuggestionSmartDropDownList('GLCashFlowClassification','glClassFlowClassificationId','GLClassFlowClassificationName',strText, true, 0, this.setEditArray.join(),this.currentUserMasterCompanyId).subscribe(res => {
            if (res && res.length != 0) {               
                this.allGLCashFlowClassInfo = res;
            }
        }, err => {
            this.isSpinnerVisible = false;
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
        this.commonService.autoSuggestionSmartDropDownList("GLAccountClass", "GLAccountClassId", "GLAccountClassName", strText, true, 0, this.setEditArray.join(),this.currentUserMasterCompanyId).subscribe(res => {
            if (res && res.length != 0) {
                this.accountTypeObject = res;
            }
        })
    }

    getLeafNodeObject(value) {
        this.setEditArray = [];
        if (this.isEditMode == true) {
            this.setEditArray.push(this.glAccountObj.nodeTypeName ? this.glAccountObj.nodeTypeName : 0);

        } else {
            this.setEditArray.push(0);
        }
        const strText = value ? value : '';
        this.commonService.autoSuggestionSmartDropDownList("Nodetype", "NodetypeId", "NodetypeName", strText, true, 0, this.setEditArray.join(),this.currentUserMasterCompanyId).subscribe(res => {
            if (res && res.length != 0) {
                this.leafNodeNameObj = res;
            }
        }, err => {
            this.isSpinnerVisible = false;	
        });
    }

    private loadPOCategory(value) {
        this.setEditArray = [];
        if (this.isEditMode == true) {
            this.setEditArray.push(this.glAccountObj.poroCategoryId ? this.glAccountObj.poroCategoryId : 0);

        } else {
            this.setEditArray.push(0);
        }
        const strText = value ? value : '';
        this.commonService.autoSuggestionSmartDropDownList('POROCategory','poroCategoryId','CategoryName',strText, true, 0, this.setEditArray.join(),this.currentUserMasterCompanyId).subscribe(res => {
            if (res && res.length != 0) {
                this.poroCategoryList = res;
            }
        }, err => { this.isSpinnerVisible = false;});
    }

    ////// Master Drop Down End

    saveglaccount() {
        this.balanceTypeCheckBoxReq = false;
        if(!this.glAccountObj.ledgerIds){
            this.alertService.showMessage("Warning", 'Please Select Ledger Name.', MessageSeverity.warn);
            return false;
        }
        if (//this.glAccountObj.ledgerId == "" || 
              this.glAccountObj.accountCode == "" 
           || this.glAccountObj.accountName == ""
           || this.glAccountObj.glAccountTypeId == "" 
           || this.glAccountObj.glClassFlowClassificationId == "") {
            this.alertService.showMessage("Warning", 'Please Enter Required Fields.', MessageSeverity.warn);
        } else {
            var LedgerName = "";
            this.ledgerNameObjectData.forEach(element => {
                if(element.value==this.glAccountObj.ledgerId){
                   LedgerName = element.label;
              }
            }); 
            this.glAccountObj = {
                ...this.glAccountObj,
                masterCompanyId: this.currentUserMasterCompanyId,
                updatedBy: this.userName,
                ledgerName: LedgerName,               
            };
            if (this.editMode) {
                 this.glAccountService.update(this.glAccountObj).subscribe(response => {
                        this.alertService.showMessage('Success','GLAccount Updated successfully.', MessageSeverity.success);
                        this.router.navigateByUrl('/generalledgermodule/generalledgerpage/app-account-listing');
                        this.isSpinnerVisible = false;
                    }, err => {
                        this.isSpinnerVisible = false;
                    });                    
            } 
            else {
              
                this.isSpinnerVisible = true;
                this.glAccountService.add(this.glAccountObj).subscribe(response => {
                    this.alertService.showMessage('Success', 'GLAccount Created successfully.', MessageSeverity.success);
                    this.router.navigateByUrl('/generalledgermodule/generalledgerpage/app-account-listing');
                    this.isSpinnerVisible = false;
                }, (errorLog) => {
                    this.isSpinnerVisible = false;
               });
            }
         
        }
    }


 
    updateAccountData(id) {
        this.disableSave=true;
        this.isSpinnerVisible=true;
        this.glAccountService.getById(id).subscribe(
            glAccountData => {
                const data = glAccountData[0];
                this.glAccountObj =
                {
                    ...data,
                    ledgerId: data.ledgerId ?data.ledgerId  : 0 ,
                    glAccountTypeId: data.glAccountTypeId ? data.glAccountTypeId: 0,
                    poroCategoryId: data.poroCategoryId ? data.poroCategoryId: 0,
                    glAccountNodeId: data.glAccountNodeId ? data.glAccountNodeId: 0,
                    glAccountLedgerId: data.glAccountLedgerId,
                    category1099Id: data.category1099Id ? data.category1099Id:null,
                    interCompany: data.interCompany ? data.interCompany: false,
                    allowManualJE: data.allowManualJE ? data.allowManualJE: false,
                    glClassFlowClassificationId: data.glClassFlowClassificationId ? data.glClassFlowClassificationId: 0,
                    nodeTypeName: data.glAccountNodeId ? data.glAccountNodeId : 0,
                    activeFlag: data.isActive,
                    shareWithEntityIds:data.shareWithEntityIds,
                    ledgerIds : data.ledgerIds,
                }                
                this.isSpinnerVisible=false;
                this.getLedgerObject('');  
                this.load1099Miscdata('');
                this.getLeafNodeObject('');
                this.loadEntityData('');
                this.loadGLAccountTypeData('');
                this.loadGLCashFlowClassification('');
                this.loadPOCategory('');
            },
            error => {
                this.isSpinnerVisible=false;               
            }

        );
    }
    get currentUserMasterCompanyId(): number {
        return this.authService.currentUser
            ? this.authService.currentUser.masterCompanyId
            : null;
    }
   
    // errorMessageHandler(log) {
    //     var msg = '';
    //     if (typeof log.error == 'string') {
    //         this.alertService.showMessage(
    //             'Error',
    //             log.error,
    //             MessageSeverity.error
    //         );
    //     }
    // }

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
                ledgerName: '',
                oldAccountCode: '',
                accountDescription: '',
                glAccountTypeId: null,
                interCompany: false,
                shareWithEntityIds: [],
                ledgerIds: [],
                allowManualJE: false,
                category1099Id: null,
                glClassFlowClassificationId: 0,
                poroCategoryId: 0,
                createdBy: this.userName,
                updatedBy: this.userName,
                createdDate: this.formatDateTime(null)
            }
    }
   
    closeClick(){
        this.router.navigateByUrl('/generalledgermodule/generalledgerpage/app-account-listing');
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
            this.sourceglcashflowclassification.masterCompanyId = this.currentUserMasterCompanyId;
            this.glcashFlowClassifcationService.newGlCashFlowClassification(this.sourceglcashflowclassification).subscribe(cashFlow => {
                this.loadGLCashFlowClassification('');
                this.currentGLAccount.glClassFlowClassificationId = cashFlow.glClassFlowClassificationId;
                this.alertService.showMessage('C-Flow added successfully.');
            }, err => {});
        }
        else {

            this.sourceglcashflowclassification.updatedBy = this.userName;
            this.sourceglcashflowclassification.masterCompanyId = this.currentUserMasterCompanyId;
            this.glcashFlowClassifcationService.updateCashFlowClassification(this.sourceglcashflowclassification).subscribe(cashFlow => {
                this.alertService.showMessage('C-Flow Updated successfully.');
            }, err => { });
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