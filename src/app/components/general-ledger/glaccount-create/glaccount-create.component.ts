import { OnInit, Component } from "@angular/core";
import { fadeInOut } from "../../../services/animations";
import { AlertService } from "../../../services/alert.service";
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
@Component({
    selector: 'app-glaccount-create',
    templateUrl: './glaccount-create.component.html',
    styleUrls: ['./glaccount-create.component.scss'],
    animations: [fadeInOut]
})
/** GLAccountCreate component*/
export class GlaccountCreateComponent implements OnInit {
    /** GLAccountCreate ctor */
    currentGLAccount: GlAccount;
    glAccountList: GlAccount[];
    updateMode: boolean;
    allCurrencyInfo: any[] = [];
    allGLAccountClassInfo: any[] = [];
    allGLCashFlowClassInfo: any[] = [];
    allManagemtninfo: any[] = [];
    companyList: any[] = [];
    miscData: any[] = [];
    nodeSetupList: any[] = [];
    poroCategoryList: any[] = [];
    modal: NgbModalRef;
    disableSave: boolean;
    loadingIndicator: boolean;
    GLClassFlowClassificationName: string;
    public sourceglcashflowclassification: any = {}
    isEditMode: boolean;
    isSaving: boolean;
    isDeleteMode: boolean;
    display: boolean = false; 
    constructor(private legalEntityservice: LegalEntityService, private modalService: NgbModal, private poroCategoryService: POROCategoryService, private nodeSetupService: NodeSetupService, private router: Router, private authService: AuthService, private glcashFlowClassifcationService: GlCashFlowClassificationService, private alertService: AlertService, private glAccountService: GlAccountService, private currencyService: CurrencyService, public glAccountClassService: GLAccountClassService) {
        if (this.glAccountService.glAccountEditCollection) {
            this.currentGLAccount = this.glAccountService.glAccountEditCollection;
        }      
    }

    ngOnInit(): void {
        if (this.glAccountService.glAccountEditCollection == null) {
            this.currentGLAccount = new GlAccount();
        }
        this.glAccountService.getAll().subscribe(glAccountData => {
            this.glAccountList = glAccountData[0];
        });
        this.loadcurrencyData();
        this.loadGLAccountTypeData();
        this.loadCompaniesData();
        this.load1099Miscdata();
        this.loadGLCashFlowClassification();
        this.loadNodeSetup();
        this.loadPOCategory();
        if (this.glAccountService.glAccountEditCollection == null) {
            this.currentGLAccount.activeFlag = true;
            this.currentGLAccount.allowManualJE = true;
        }
    }

    addGLAccount(): void {
        if (!(this.currentGLAccount.accountCode && this.currentGLAccount.accountName && this.currentGLAccount.glAccountTypeId && this.currentGLAccount.glAccountNodeId && this.currentGLAccount.glClassFlowClassificationId && this.currentGLAccount.poroCategoryId && (this.currentGLAccount.balanceTypeActual || this.currentGLAccount.balanceTypeBudget || this.currentGLAccount.balanceTypeForecast )
        )) {
            this.display = true;
        }
        if (!this.display) { 
        this.currentGLAccount.createdBy = this.userName;
        this.currentGLAccount.updatedBy = this.userName;
        if (!this.currentGLAccount.glAccountId) {
            this.glAccountService.add(this.currentGLAccount).subscribe(glData => {
                this.currentGLAccount = glData;
                this.alertService.showMessage('GLAccount added successfully.');
                this.glAccountService.getAll().subscribe(glAccountData => {
                    this.glAccountList = glAccountData[0];
                    this.router.navigateByUrl('/generalledgermodule/generalledgerpage/app-glaccount-list');
                });
            });
        }
        else {
            this.currentGLAccount.updatedBy = this.userName;
            this.glAccountService.update(this.currentGLAccount).subscribe(glAccount => {
                this.alertService.showMessage('GLAccount updated successfully.');
                this.glAccountService.getAll().subscribe(glAccounts => {
                    this.glAccountList = glAccounts[0];
                });
                this.updateMode = false;
            });
        }
    }
    }
    private loadNodeSetup() {
        this.nodeSetupService.getAll().subscribe(nodes => {
            this.nodeSetupList = nodes[0];
        })
    }
    private loadPOCategory() {
    
        let poroCategoryList = [];
        this.poroCategoryService.getAll().subscribe(poroCategory => {
            this.poroCategoryList = poroCategory[0];
            
        })
    }
    private loadcurrencyData() {
        this.currencyService.getCurrencyList().subscribe(currencydata => {
            this.allCurrencyInfo = currencydata[0];
        });
    }

    private loadGLAccountTypeData() {
        this.glAccountClassService.getGlAccountClassList().subscribe(Glaccountdata => {
            this.allGLAccountClassInfo = Glaccountdata[0];
        })
    }

    private loadGLCashFlowClassification() {
        this.glcashFlowClassifcationService.getWorkFlows().subscribe(cahsFlowClassdata => {
            this.allGLCashFlowClassInfo = cahsFlowClassdata[0];
        })
    }

    private loadCompaniesData() {
        this.legalEntityservice.getEntityList().subscribe(entitydata => {
            this.companyList = entitydata[0];
        });
    }

    private load1099Miscdata() {
        this.glAccountService.getMiscdata().subscribe(miscData => {
            this.miscData = miscData[0];
        });
    } 

   
    resetAssetStatus(): void {
        this.updateMode = false;
        this.currentGLAccount = new GlAccount();
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }
    open(content) {
        this.sourceglcashflowclassification = new GlCashFlowClassification();
        this.GLClassFlowClassificationName = "";
        this.sourceglcashflowclassification.isActive = true;
        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(() => {
            console.log('When user closes');
        }, () => { console.log('Backdrop click') })
    }

    saveGlcahsFlow() {
        this.isSaving = true;
        if (!this.sourceglcashflowclassification.glCashFlowClassificationId) {

            this.sourceglcashflowclassification.createdBy = this.userName;
            this.sourceglcashflowclassification.updatedBy = this.userName;
            this.sourceglcashflowclassification.masterCompanyId = 1;
            this.glcashFlowClassifcationService.newGlCashFlowClassification(this.sourceglcashflowclassification).subscribe(cashFlow => {
                this.loadGLCashFlowClassification();
                this.currentGLAccount.glClassFlowClassificationId = cashFlow.glClassFlowClassificationId;
                this.alertService.showMessage('C-Flow added successfully.');
            }
            );
        }
        else {

            this.sourceglcashflowclassification.updatedBy = this.userName;
            this.sourceglcashflowclassification.masterCompanyId = 1;
            this.glcashFlowClassifcationService.updateCashFlowClassification(this.sourceglcashflowclassification).subscribe(cashFlow => {
                this.alertService.showMessage('C-Flow Updated successfully.');
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
}