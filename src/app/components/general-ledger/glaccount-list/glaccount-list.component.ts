import { Component, OnInit } from "@angular/core";
import { GlAccountService } from "../../../services/glAccount/glAccount.service";
import { GlAccount } from "../../../models/GlAccount.model";
import { Router } from "@angular/router";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { AlertService } from "../../../services/alert.service";
import { GLAccountClassService } from "../../../services/glaccountclass.service";
import { POROCategoryService } from "../../../services/porocategory/po-ro-category.service";
import { GlCashFlowClassificationService } from "../../../services/gl-cash-flow-classification.service";

@Component({
  selector: "app-glaccount-list",
  templateUrl: "./glaccount-list.component.html",
  styleUrls: ["./glaccount-list.component.scss"],
})
/** GLAccountList component*/
export class GlaccountListComponent implements OnInit {
  glAccountList: GlAccount[];
  glaccountToRemove: any;
  assetTypeCollection: any[] = [];
  allGLAccountClassInfo: any[] = [];
  modal: NgbModalRef;
  glAccountObj: any;
  Active: string;
  glAccountViewData: any;
  poroCategoryList: any[] = [];
  allGLCashFlowClassInfo: any[] = [];

  /** GLAccountList ctor */
  constructor(
    public glAccountClassService: GLAccountClassService,
    private glAccountService: GlAccountService,
    private poroCategoryService: POROCategoryService,
    private router: Router,
    private modalService: NgbModal,
    private alertService: AlertService,
    private glcashFlowClassifcationService: GlCashFlowClassificationService
  ) {}

  ngOnInit(): void {
    this.loadGLAccountTypeData();
    this.loadPOCategory();
    this.loadGLCashFlowClassification();
    this.glAccountService.glAccountEditCollection = null;
    this.glAccountService.getAll().subscribe((glAccountData) => {
      this.glAccountList = glAccountData[0];
    });
  }

  private loadGLAccountTypeData() {
    this.glAccountClassService
      .getGlAccountClassList()
      .subscribe((Glaccountdata) => {
        this.allGLAccountClassInfo = Glaccountdata[0];
      });
  }

  private loadPOCategory() {
    this.poroCategoryService.getAll().subscribe((poroCategory) => {
      this.poroCategoryList = poroCategory[0];
    });
  }

  private loadGLCashFlowClassification() {
    this.glcashFlowClassifcationService
      .getWorkFlows()
      .subscribe((cahsFlowClassdata) => {
        this.allGLCashFlowClassInfo = cahsFlowClassdata[0];
      });
  }
  public glAccountEdit(glAccount) {
    this.glAccountService.glAccountEditCollection = glAccount;
    this.router.navigateByUrl(
      "/generalledgermodule/generalledgerpage/app-glaccount-create"
    );
  }

  confirmDelete(content, id) {
    this.glaccountToRemove = Object.assign(
      {},
      this.glAccountList.filter(function (glAccount) {
        return glAccount.glAccountId == id;
      })[0]
    );
    this.modal = this.modalService.open(content, { size: "sm" });
  }
  removeAssetType(): void {
    this.glAccountService
      .remove(this.glaccountToRemove.glAccountId)
      .subscribe((response) => {
        this.alertService.showMessage("Asset Status removed successfully.");
        this.glAccountService.getAll().subscribe((glAccounts) => {
          this.glAccountList = glAccounts[0];
          this.modal.close();
        });
      });
  }
  dismissModel() {
    if (this.modal != undefined) {
      this.modal.close();
    }
  }

  toggleIsActive(intangibleType: any, e) {
    if (e.checked == false) {
      this.glAccountObj = intangibleType;
      this.Active = "In Active";
      this.glAccountObj.isActive == false;
      this.glAccountService.update(this.glAccountObj).subscribe((glAccount) => {
        this.alertService.showMessage("GlAccount  updated successfully.");
        this.glAccountService.getAll().subscribe((glAccount) => {
          this.glAccountList = glAccount[0];
        });
      });
    } else {
      this.glAccountObj = intangibleType;
      this.Active = "Active";
      this.glAccountObj.isActive == true;
      this.glAccountService.update(this.glAccountObj).subscribe((glAccount) => {
        this.alertService.showMessage("GlAccount Type updated successfully.");
        this.glAccountService.getAll().subscribe((glAccount) => {
          this.glAccountList = glAccount[0];
        });
      });
    }
  }
  showViewData(viewContent, glAccount) {
    // debugger;
    this.glAccountService.getById(glAccount.glAccountId).subscribe((data) => {
      this.glAccountViewData = data[0][0];
      this.modal = this.modalService.open(viewContent, { size: "lg" });
    });
  }
}
