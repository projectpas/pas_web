import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  Input,
  SimpleChanges,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
// declare var $ : any;
declare var $: any;
import { NgbModal, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "../../../../services/auth.service";
import { FormBuilder } from "@angular/forms";
import {
  AlertService,
  MessageSeverity,
} from "../../../../services/alert.service";
import { LegalEntityService } from "../../../../services/legalentity.service";

import { MasterComapnyService } from "../../../../services/mastercompany.service";
import { CustomerService } from "../../../../services/customer.service";
import { CustomerContactModel } from "../../../../models/customer-contact.model";
import { MatDialog } from "@angular/material";
import {
  getValueFromObjectByKey,
  getObjectById,
  editValueAssignByCondition,
  listSearchFilterObjectCreation,
} from "../../../../generic/autocomplete";
import { AtaSubChapter1Service } from "../../../../services/atasubchapter1.service";

import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap/modal/modal-ref";

import {
  emailPattern,
  urlPattern,
  titlePattern,
  phonePattern,
} from "../../../../validations/validation-pattern";
import { ConfigurationService } from "../../../../services/configuration.service";
import * as moment from "moment";
import { CommonService } from "../../../../services/common.service";
import { DatePipe } from "@angular/common";
import {
  ModuleConstants,
  PermissionConstants,
} from "src/app/generic/ModuleConstant";

@Component({
  selector: "app-legal-entity-contact",
  templateUrl: "./legal-entity-contact.component.html",
  styleUrls: ["./legal-entity-contact.component.scss"],
  providers: [DatePipe],
})

/** EntityContactComponent component*/
export class EntityContactComponent implements OnInit {
  @Input() savedGeneralInformationData;
  @Input() editMode;
  @Input() editGeneralInformationData;
  @Input() add_ataChapterList;
  phonePattern = phonePattern();
  @Input() legalEntityDataFromExternalComponents: any;
  // @Input() ataListDataValues;
  @Output() tab = new EventEmitter<any>();
  @Output() refreshCustomerContactMapped = new EventEmitter();
  @Input() customerDataFromExternalComponents: any;
  isPrimatyContactData: any;
  disableSave: boolean = true;
  totalRecordsContacts: any;
  pageIndex: number = 0;
  pageSize: number = 10;
  totalPages: number;
  contactsListOriginal: any;
  firstNamesList: any;
  middleNamesList: any;
  lastNamesList: any;
  isDeleteMode: boolean = false;
  public sourceCustomer: any = {};
  contactInformation = new CustomerContactModel();
  entityContacts: any = [];
  selectedRowforDelete: any;
  selectedAtappedRowforDelete: any;
  selectedFirstName: any;
  memoPopupContent: any;
  titlePattern = titlePattern();
  disablesaveForFirstname: boolean;
  disableSaveMiddleName: boolean;
  disableSaveLastName: boolean;
  enableUpdateButton: boolean = false;
  disablesaveForlastname: boolean;
  test: any;
  formData = new FormData();
  entityContactsColumns = [
    { field: "tag", header: "Tag" },
    { field: "attention", header: "Attention" },
    { field: "firstName", header: "First Name" },
    { field: "middleName", header: "Middle Name" },
    { field: "lastName", header: "Last Name" },
    { field: "contactTitle", header: "Contact Title" },
    { field: "email", header: "Email" },
    { field: "workPhone", header: "Work Phone" },
    { field: "mobilePhone", header: "Mobile Phone" },
    { field: "fax", header: "Fax" },
    { field: "isDefaultContact", header: "Primary" },
    // { field: 'isDefaultContact', header: 'Primary Contact' },
    // { field: 'notes', header: 'Memo' },
    { field: "createdDate", header: "Created Date" },
    { field: "createdBy", header: "Created By" },
    { field: "updatedDate", header: "Updated Date" },
    { field: "updatedBy", header: "Updated By" },
  ];
  selectedColumns = this.entityContactsColumns;
  selectedColumn: any;
  ediData: any;
  isEditButton: boolean = false;
  id: number;
  contactId: number;
  customerContactId: number;
  contactATAId: number;
  customerCode: any;
  customerName: any;
  modal: NgbModalRef;
  localCollection: any;

  emailPattern = emailPattern();
  urlPattern = urlPattern();

  // emailPattern = "[a-zA-Z0-9.-]{1,}@[a-zA-Z0-9.-]{2,}[.]{1}[a-zA-Z0-9]{2,}";
  // urlPattern = "^((ht|f)tp(s?))\://([0-9a-zA-Z\-]+\.)+[a-zA-Z]{2,6}(\:[0-9]+)?(/\S*)?$";
  sourceViewforContact: any;
  add_SelectedId: any;
  add_SelectedModels: any;
  add_ataSubChapterList: any;
  selectedContact: any;
  ataHeaders = [
    { field: "ataChapterName", header: "ATA Chapter" },
    { field: "ataSubChapterDescription", header: "ATA Sub-Chapter" },
  ];
  ataListDataValues = [];
  auditHistory: any[] = [];
  companyName: string;
  companyCode: string;
  @ViewChild("ATAADD", { static: false }) myModal;
  isViewMode: boolean = false;
  entityContactsOriginal: any;

  isAdd: boolean = true;
  isEdit: boolean = true;
  isDelete: boolean = true;
  isDownload: boolean = true;
  isView: boolean = true;
  isNextVisible: Boolean=true;
  constructor(
    private router: ActivatedRoute,
    public legalEntityService: LegalEntityService,
    private route: Router,
    private authService: AuthService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private _fb: FormBuilder,
    private alertService: AlertService,
    private datePipe: DatePipe,
    public customerService: CustomerService,
    private dialog: MatDialog,
    private atasubchapter1service: AtaSubChapter1Service,
    private commonService: CommonService,
    private masterComapnyService: MasterComapnyService,
    private configurations: ConfigurationService
  ) {
    this.isAdd = this.authService.checkPermission([
      ModuleConstants.LegalEntity_Contacts + "." + PermissionConstants.Add,
    ]);
    this.isEdit = this.authService.checkPermission([
      ModuleConstants.LegalEntity_Contacts + "." + PermissionConstants.Update,
    ]);
    this.isDelete = this.authService.checkPermission([
      ModuleConstants.LegalEntity_Contacts + "." + PermissionConstants.Delete,
    ]);
    this.isDownload = this.authService.checkPermission([
      ModuleConstants.LegalEntity_Contacts + "." + PermissionConstants.Download,
    ]);
    this.isView = this.authService.checkPermission([
      ModuleConstants.LegalEntity_Contacts + "." + PermissionConstants.View,
    ]);
    this.isNextVisible=this.authService.ShowTab('Create Legal Entity','Banking Information');
  }

  ngOnInit() {
    this.statusForContact = "Active";
    this.status = "Active";

    if (this.isViewMode == false) {
      if (this.editMode) {
        this.id = this.editGeneralInformationData.legalEntityId;
        if (typeof this.editGeneralInformationData.name != "string") {
          this.companyName = this.editGeneralInformationData.name.label;
        } else {
          this.companyName = this.editGeneralInformationData.name;
        }
        this.companyCode = this.editGeneralInformationData.companyCode;
      } else {
        if (this.customerDataFromExternalComponents) {
          this.id = this.customerDataFromExternalComponents.legalEntityId;
          this.companyCode = this.customerDataFromExternalComponents.companyCode;
          if (typeof this.customerDataFromExternalComponents.name != "string") {
            this.companyName = this.customerDataFromExternalComponents.name.label;
          } else {
            this.companyName = this.customerDataFromExternalComponents.name;
          }
        } else {
          if (this.savedGeneralInformationData) {
            this.id = this.savedGeneralInformationData.legalEntityId;
            this.companyCode = this.savedGeneralInformationData.companyCode;
            if (typeof this.savedGeneralInformationData.name != "string") {
              this.companyName = this.savedGeneralInformationData.name.label;
            } else {
              this.companyName = this.savedGeneralInformationData.name;
            }
          }
        }
      }
    }
  }

  legalEntityCode: any;
  legalEntityName: any;
  ngOnChanges(changes: SimpleChanges) {
    for (let property in changes) {
      if (property == "legalEntityDataFromExternalComponents") {
        if (changes[property].currentValue != {}) {
          this.id = this.legalEntityDataFromExternalComponents.legalEntityId;
          this.companyCode = this.legalEntityDataFromExternalComponents.legalEntityCode;
          this.companyName = this.legalEntityDataFromExternalComponents.name;
          this.isViewMode = true;
          this.currentstatusForCotnact = "Active";
          this.statusForContact = "Active";

          setTimeout(() => {
            if (this.isViewMode == false) {
              this.billingStatusForContact(this.statusForContact);
            }
          }, 1200);
        }
      }
    }
  }

  get userName(): string {
    return this.authService.currentUser
      ? this.authService.currentUser.userName
      : "";
  }

  get currentUserMasterCompanyId(): number {
    return this.authService.currentUser
      ? this.authService.currentUser.masterCompanyId
      : null;
  }

  setEditArray: any = [];
  getAllContacts(value, type) {
    this.setEditArray = [];
    this.setEditArray.push(0);
    const strText = value ? value : "";
    if (type == 1) {
      this.contactName = "FirstName";
    } else if (type == 2) {
      this.contactName = "MiddleName";
    } else if (type == 3) {
      this.contactName = "LastName";
    }
    if (this.contactName != undefined) {
      // this.commonService.autoSuggestionSmartDropDownList('Contact', 'ContactId', this.contactName, strText, true, 20, this.setEditArray.join()).subscribe(res => {
      //this.commonService.autoSuggestionSmartDropDownContactList(this.contactName, strText, true, this.setEditArray.join(), this.currentUserMasterCompanyId).subscribe(res => {
      this.commonService
        .autoSuggestionSmartDropDownSelfLEContactList(
          this.contactName,
          strText,
          true,
          this.setEditArray.join(),
          this.currentUserMasterCompanyId,
          this.id
        )
        .subscribe(
          (res) => {
            this.contactsListOriginal = res;
            // .filter((v,i,a)=>a.findIndex(t=>(t.value == v.value))==i);
            this.firstNamesList = [];
            this.middleNamesList = [];
            this.lastNamesList = [];
            if (type == 1) {
              this.firstNamesList = [...this.contactsListOriginal];
              if (this.isEditButton == true) {
                this.firstNamesList.forEach((element) => {
                  if (element.label == this.contactInformation.firstName) {
                    this.contactInformation.firstName = element;
                  }
                });
              }
            } else if (type == 2) {
              this.middleNamesList = [...this.contactsListOriginal];
              if (this.isEditButton == true) {
                this.middleNamesList.forEach((element) => {
                  if (element.label == this.contactInformation.middleName) {
                    this.contactInformation.middleName = element;
                  }
                });
              }
            } else if (type == 3) {
              this.lastNamesList = [...this.contactsListOriginal];
              if (this.isEditButton == true) {
                this.lastNamesList.forEach((element) => {
                  if (element.label == this.contactInformation.lastName) {
                    this.contactInformation.lastName = element;
                  }
                });
              }
            }
          },
          (err) => {
            this.isSpinnerVisible = false;
            //const errorLog = err;
            //this.errorMessageHandler(errorLog);
          }
        );
    }
  }

  contactName: any;
  filterFirstNames(event) {
    if (event.query != undefined && event.query != "") {
      this.getAllContacts(event.query, 1);
    } else {
      this.getAllContacts("", 1);
    }
  }

  filterMiddleNames(event) {
    if (event.query != undefined && event.query != "") {
      this.getAllContacts(event.query, 2);
    } else {
      this.getAllContacts("", 2);
    }
  }

  filterLastNames(event) {
    if (event.query != undefined && event.query != "") {
      this.getAllContacts(event.query, 3);
    } else {
      this.getAllContacts("", 3);
    }
  }

  patternMobilevalidationWithSpl(event: any) {
    const pattern = /[0-9\+\-()\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  parsedText(text) {
    if (text) {
      const dom = new DOMParser().parseFromString(
        "<!doctype html><body>" + text,
        "text/html"
      );
      const decodedString = dom.body.textContent;
      return decodedString;
    }
  }

  async saveContactInformation() {
    // create a new contact in the contact table
    if (
      this.contactInformation.firstName &&
      typeof this.contactInformation.firstName != "string"
    ) {
      this.contactInformation.firstName = editValueAssignByCondition(
        "label",
        this.contactInformation.firstName
      );
    }
    if (
      this.contactInformation.middleName &&
      typeof this.contactInformation.middleName != "string"
    ) {
      this.contactInformation.middleName = editValueAssignByCondition(
        "label",
        this.contactInformation.middleName
      );
    }
    if (
      this.contactInformation.lastName &&
      typeof this.contactInformation.lastName != "string"
    ) {
      this.contactInformation.lastName = editValueAssignByCondition(
        "label",
        this.contactInformation.lastName
      );
    }
    // if(this.contactInformation.tag){
    // 	this.contactInformation.tag = editValueAssignByCondition('tagName', this.contactInformation.tag),
    // 	this.contactInformation.contactTagId = this.contactInformation.tag == "NA" ? null : editValueAssignByCondition('contactTagId', this.contactInformation.tag)
    // }
    const data = {
      ...this.contactInformation,
      createdBy: this.userName,
      updatedBy: this.userName,
      isActive: true,
      masterCompanyId: this.currentUserMasterCompanyId,
      legalEntityId: this.id,
      tag: editValueAssignByCondition("tagName", this.contactInformation.tag),
      contactTagId:
        this.contactInformation.tag == "NA"
          ? null
          : editValueAssignByCondition(
              "contactTagId",
              this.contactInformation.tag
            ),
    };
    await this.legalEntityService.newAddContactInfo(data).subscribe(
      (res) => {
        const responseForCustomerCreate = res;
        this.billingStatusForContact(this.statusForContact);
        // this.refreshCustomerContactMapped.emit(this.id);
        this.test = res;
        $("#addContactDetails").modal("hide");
        this.alertService.showMessage(
          "Success",
          `Sucessfully Created Contact`,
          MessageSeverity.success
        );
      },
      (err) => {
        this.isEditButton = false;
        this.isSpinnerVisible = false;
        //const errorLog = err;
        //this.errorMessageHandler(errorLog);
      }
    );
  }

  viewSelectedRow(rowData) {
    this.sourceViewforContact = rowData;
  }

  viewSelectedRowdbl(content, rowData) {
    if (rowData && rowData.contactId) {
      this.legalEntityService
        .getLegalEntityContactById(rowData.contactId)
        .subscribe(
          (res) => {
            this.sourceViewforContact = {
              ...res[0],
            };
            this.modal = this.modalService.open(content, {
              size: "sm",
              backdrop: "static",
              keyboard: false,
            });
          },
          (err) => {
            //const errorLog = err;
            //this.errorMessageHandler(errorLog);
            this.isSpinnerVisible = false;
          }
        );
    }
  }

  onAddContactInfo() {
    this.isEditButton = false;
    this.contactInformation = new CustomerContactModel();
  }

  ismemohideOnSave: boolean = false;
  onClickMemo() {
    this.memoPopupContent = this.contactInformation.notes;
    this.ismemohideOnSave = true;
  }

  onClickPopupSave() {
    this.enableUpdateButton = true;
    this.contactInformation.notes = this.memoPopupContent;
  }

  enableSaveText() {
    this.ismemohideOnSave = false;
    if (this.memoPopupContent == "") {
      this.ismemohideOnSave = true;
    }
  }

  editContactId: any;
  editCustomerContact(rowData) {
    this.disableSave = true;
    this.isPrimatyContactData = rowData.isDefaultContact;
    this.legalEntityService
      .getLegalEntityContactById(rowData.contactId)
      .subscribe(
        (res) => {
          this.isEditButton = true;
          this.contactInformation = res[0];
          this.getAllContacts(rowData.firstName, 1);
          this.getAllContacts(rowData.middleName, 2);
          this.getAllContacts(rowData.lastName, 3);
          this.editContactId = res[0].contactId;
          if (rowData.contactTagId > 0) {
            this.arrayTagNamelist.push(rowData.contactTagId);
            this.getAllTagNameSmartDropDown("", rowData.contactTagId);
          }
          this.sourceViewforContact = "";
        },
        (err) => {
          this.isSpinnerVisible = false;
        }
      );
  }

  openTag(content) {
    this.modal = this.modalService.open(content, {
      size: "sm",
      backdrop: "static",
      keyboard: false,
    });
  }

  updateCustomerContact() {
    if (
      this.contactInformation.firstName &&
      typeof this.contactInformation.firstName != "string"
    ) {
      this.contactInformation.firstName = editValueAssignByCondition(
        "label",
        this.contactInformation.firstName
      );
    }
    if (
      this.contactInformation.middleName &&
      typeof this.contactInformation.middleName != "string"
    ) {
      this.contactInformation.middleName = editValueAssignByCondition(
        "label",
        this.contactInformation.middleName
      );
    }
    if (
      this.contactInformation.lastName &&
      typeof this.contactInformation.lastName != "string"
    ) {
      this.contactInformation.lastName = editValueAssignByCondition(
        "label",
        this.contactInformation.lastName
      );
    }
    const data = {
      ...this.contactInformation,
      masterCompanyId: this.currentUserMasterCompanyId,
      contactId: this.editContactId,
      tag: editValueAssignByCondition("tagName", this.contactInformation.tag),
      contactTagId:
        this.contactInformation.tag == "NA"
          ? null
          : editValueAssignByCondition(
              "contactTagId",
              this.contactInformation.tag
            ),
    };
    this.legalEntityService.updateLegalEntityContact(data).subscribe(
      (res) => {
        // this.getAllEntityContact();
        this.billingStatusForContact(this.statusForContact);
        this.test = res;
        // this.modal.close();
        $("#addContactDetails").modal("hide");
        this.alertService.showMessage(
          "Success",
          `Sucessfully Updated Contact`,
          MessageSeverity.success
        );
      },
      (err) => {
        this.isEditButton = false;
        this.isSpinnerVisible = false;
      }
    );
    // $("#addContactDetails").modal("hide");
    this.disableSave = true;
  }

  CloserCOnatcHistory() {
    $("#contentHist").modal("hide");
  }

  openDelete(content, rowData) {
    if (!rowData.isDefaultContact) {
      this.selectedRowforDelete = rowData;
      this.sourceViewforContact = "";
      this.isDeleteMode = true;
      this.contactId = rowData.contactId;
      this.customerContactId = rowData.contactId;
      this.modal = this.modalService.open(content, {
        size: "sm",
        backdrop: "static",
        keyboard: false,
      });
    } else {
      $("#deleteoops").modal("show");
    }
  }

  deleteItemAndCloseModel() {
    let contactId = this.contactId;
    let customerContactId = this.customerContactId;
    if (contactId > 0) {
      this.legalEntityService
        .deleteLegalEntityContact(customerContactId, this.userName)
        .subscribe(
          (response) => {
            this.saveCompleted(this.sourceCustomer);
            this.billingStatusForContact(this.statusForContact);
            this.refreshCustomerContactMapped.emit(this.id);
          },
          (err) => {
            this.isSpinnerVisible = false;
          }
        );
    }
    this.modal.close();
  }

  addATAChapter(rowData) {
    this.sourceViewforContact = "";
    this.add_SelectedModels = undefined;
    this.add_SelectedId = undefined;
    this.selectedContact = rowData;
    this.ataListDataValues = [];
    this.add_ataSubChapterList = "";
  }

  dismissModel() {
    this.modal.close();
  }
  // get subchapter by Id in the add ATA Mapping
  getATASubChapterByATAChapter() {
    const selectedATAId = getValueFromObjectByKey(
      "ataChapterId",
      this.add_SelectedId
    );
    this.atasubchapter1service
      .getATASubChapterListByATAChapterId(selectedATAId)
      .subscribe(
        (atasubchapter) => {
          const responseData = atasubchapter[0];
          this.add_ataSubChapterList = responseData.map((x) => {
            return {
              label: x.description,
              value: x,
            };
          });
        },
        (err) => {
          this.isSpinnerVisible = false;
        }
      );
  }

  deleteATAMapped(content, rowData) {
    this.selectedAtappedRowforDelete = rowData;
    this.sourceViewforContact = "";
    this.isDeleteMode = true;
    this.contactATAId = rowData.customerContactATAMappingId;
    this.modal = this.modalService.open(content, {
      size: "sm",
      backdrop: "static",
      keyboard: false,
    });
  }

  isSpinnerVisibleHistory: boolean = false;
  getAuditHistoryById(rowData) {
    this.isSpinnerVisibleHistory = true;
    this.legalEntityService
      .getLegalEntityContactHistoryById(rowData.contactId, this.id)
      .subscribe(
        (res) => {
          this.auditHistory = res;
          this.isSpinnerVisibleHistory = false;
        },
        (err) => {
          this.isSpinnerVisibleHistory = false;
        }
      );
  }

  getColorCodeForHistory(i, field, value) {
    const data = this.auditHistory;
    const dataLength = data.length;
    if (i >= 0 && i <= dataLength) {
      if (i + 1 === dataLength) {
        return true;
      } else {
        return data[i + 1][field] === value;
      }
    }
  }

  nextClick() {
    this.tab.emit("Banking");
  }

  backClick() {
    this.tab.emit("General");
  }

  private saveCompleted(user?: any) {
    if (this.isDeleteMode == true) {
      this.alertService.showMessage(
        "Success",
        `Action was deleted successfully`,
        MessageSeverity.success
      );
      this.isDeleteMode = false;
    } else {
      this.alertService.showMessage(
        "Success",
        `Action was edited successfully`,
        MessageSeverity.success
      );
      this.saveCompleted;
    }
  }

  private saveFailedHelper(error: any) {
    this.alertService.stopLoadingMessage();
    this.alertService.showStickyMessage(
      "Save Error",
      "The below errors occured whilst saving your changes:",
      MessageSeverity.error,
      error
    );
    this.alertService.showStickyMessage(error, null, MessageSeverity.error);
  }

  onFirstNameSelected() {
    //this.disablesaveForFirstname = true;
  }

  onMiddleNameSelected() {
    //this.disableSaveMiddleName = true;
  }

  onLastNameSelected() {
    //this.disableSaveLastName = true;
  }

  getPageCount(totalNoofRecords, pageSize) {
    return Math.ceil(totalNoofRecords / pageSize);
  }

  sampleExcelDownloadForContact() {
    const url = `${this.configurations.baseUrl}/api/FileUpload/downloadsamplefile?moduleName=LegalEntityContact&fileName=LegalEntityContact.xlsx`;
    window.location.assign(url);
  }

  enableSave() {
    this.disableSave = false;
  }

  closeMyModel() {
    $("#addContactDetails").modal("hide");
    this.disableSave = true;
  }

  lazyLoadEventDataInput: any;
  lazyLoadEventData: Event;
  status: string = "Active";
  currentstatusForCotnact: string = "Active";
  filterText: any = "";
  currentDeletedstatusCOntact: boolean = false;
  isSpinnerVisible: boolean = false;
  handleChange(rowData) {
    this.sourceViewforContact = "";
    const data = { ...rowData, updatedBy: this.userName };
    data.status = data.isActive == true ? "Active" : "InActive";
    this.legalEntityService.updateLegalEntitytContactStatus(data).subscribe(
      (res) => {
        this.billingStatusForContact(this.statusForContact);
        this.alertService.showMessage(
          "Success",
          `Successfully Updated Status`,
          MessageSeverity.success
        );
      },
      (err) => {
        this.isSpinnerVisible = false;
      }
    );
  }

  // currentstatusForCotnact: any = 'Active'
  loadDatas(event) {
    if (this.isView == true) {
      this.lazyLoadEventData = event;
      const pageIndex = parseInt(event.first) / event.rows;
      this.pageIndex = pageIndex;
      this.pageSize = event.rows;
      event.first = pageIndex != null ? pageIndex : 0;
      this.lazyLoadEventDataInput = event;
      this.lazyLoadEventDataInput.legalEntityId = this.id;
      this.lazyLoadEventDataInput.filters = {
        ...this.lazyLoadEventDataInput.filters,
        status: this.statusForContact ? this.statusForContact : "Active",
      };
      this.currentstatusForCotnact = this.statusForContact
        ? this.statusForContact
        : "Active";
      // if(this.isViewMode==false){
      if (this.filterText == "") {
        this.getList(this.lazyLoadEventDataInput);
      } else {
        this.globalSearch(this.filterText);
      }
    }
    // }
  }

  first: any = 0;
  billingStatusForContact(status) {
    const pageIndex = 0;
    this.pageIndex = pageIndex;
    if (this.isViewMode == false) {
      this.pageSize = this.lazyLoadEventDataInput.rows;
      this.lazyLoadEventDataInput.first = pageIndex;
    } else {
      this.pageSize = 0;
      this.lazyLoadEventDataInput.first = 0;
    }
    this.lazyLoadEventDataInput.legalEntityId = this.id;
    this.statusForContact = status;
    this.lazyLoadEventDataInput.filters = {
      ...this.lazyLoadEventDataInput.filters,
      status: status,
    };
    const PagingData = {
      ...this.lazyLoadEventDataInput,
      filters: listSearchFilterObjectCreation(
        this.lazyLoadEventDataInput.filters
      ),
    };
    this.first = 0;
    PagingData.page = 1;
    console.log("Call");
    this.getList(PagingData);
  }

  globalSearch(value) {
    this.pageIndex =
      this.lazyLoadEventDataInput.rows > 10
        ? parseInt(this.lazyLoadEventDataInput.first) /
          this.lazyLoadEventDataInput.rows
        : 0;
    this.pageSize = this.lazyLoadEventDataInput.rows;
    this.lazyLoadEventDataInput.first = this.pageIndex;
    this.lazyLoadEventDataInput.legalEntityId = this.id;
    this.lazyLoadEventDataInput.globalFilter = value;
    this.filterText = value;
    this.lazyLoadEventDataInput.filters = {
      ...this.lazyLoadEventDataInput.filters,
      status: this.statusForContact,
    };
    this.getList(this.lazyLoadEventDataInput);
  }

  getDeleteListByStatusContact(value) {
    this.currentDeletedstatusCOntact = true;
    const pageIndex = 0;
    this.pageIndex = pageIndex;
    this.pageSize = this.lazyLoadEventDataInput.rows;
    this.lazyLoadEventDataInput.first = pageIndex;
    if (value == true) {
      this.currentDeletedstatusCOntact = true;
      this.lazyLoadEventDataInput.filters = {
        ...this.lazyLoadEventDataInput.filters,
        status: this.statusForContact,
      };
      this.getList(this.lazyLoadEventDataInput);
    } else {
      this.currentDeletedstatusCOntact = false;
      this.lazyLoadEventDataInput.filters = {
        ...this.lazyLoadEventDataInput.filters,
        status: this.statusForContact,
      };
      this.getList(this.lazyLoadEventDataInput);
    }
  }

  statusForContact: any = "Active";
  getList(data) {
    const isdelete = this.currentDeletedstatusCOntact ? true : false;
    data.filters.isDeleted = isdelete;
    const PagingData = {
      ...data,
      filters: listSearchFilterObjectCreation(data.filters),
      legalEntityId: this.id,
    };
    if (this.id != undefined) {
      // PagingData.first=PagingData.first ==NaN ? 0 :PagingData.first;
      if (this.isViewMode == true) {
        PagingData.first = 0;
        PagingData.rows = 10;
        this.pageSize = 10;
      }
      this.isSpinnerVisible = true;
      this.legalEntityService.getContacts(PagingData).subscribe(
        (res) => {
          this.alertService.stopLoadingMessage();
          const data = res;
          // setTimeout(() => {
          this.isSpinnerVisible = false;
          // }, 1200);
          this.entityContacts = data[0]["results"];
          this.entityContactsOriginal = data[0]["results"];
          if (this.entityContacts.length > 0) {
            this.totalRecordsContacts = data[0]["totalRecordsCount"];
            this.totalPages = Math.ceil(
              this.totalRecordsContacts / this.pageSize
            );
          } else {
            this.totalRecordsContacts = 0;
            this.totalPages = 0;
          }
        },
        (err) => {
          this.isSpinnerVisible = false;
        }
      );
    }
  }

  // omit_special_char(event){
  //     var k;
  //     k = event.charCode;
  //     return((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57) || k == 45 || k == 95 );
  //  }
  numberonly(event) {
    var k;
    k = event.charCode; //         k = event.keyCode;  (Both can be used)
    return k >= 48 && k <= 57;
    //    (k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 ||
  }
  restorerecord: any = {};

  restoreRecord() {
    this.legalEntityService
      .restoreCOntact(this.restorerecord.contactId, this.userName)
      .subscribe(
        (res) => {
          this.isSpinnerVisible = false;
          this.billingStatusForContact(this.statusForContact);
          this.modal.close();
        },
        (err) => {
          this.isSpinnerVisible = false;
        }
      );
  }

  restore(content, rowData) {
    this.restorerecord = rowData;
    this.modal = this.modalService.open(content, {
      size: "sm",
      backdrop: "static",
      keyboard: false,
    });
  }

  closeHistoryModal() {
    $("#legalEntityHistory").modal("hide");
  }

  allAssetInfoOriginal: any = [];
  dateObject: any = {};
  dateFilterForTable(date, field) {
    if (date !== "" && moment(date).format("MMMM DD YYYY")) {
      this.entityContacts = this.entityContactsOriginal;
      const data = [
        ...this.entityContacts.filter((x) => {
          if (
            moment(x.createdDate).format("MMMM DD YYYY") ===
              moment(date).format("MMMM DD YYYY") &&
            field === "createdDate"
          ) {
            return x;
          } else if (
            moment(x.updatedDate).format("MMMM DD YYYY") ===
              moment(date).format("MMMM DD YYYY") &&
            field === "updatedDate"
          ) {
            return x;
          }
        }),
      ];
      this.entityContacts = data;
    } else {
      this.entityContacts = this.entityContactsOriginal;
    }
  }

  customContactExcelUpload(event) {
    const file = event.target.files;
    if (file.length > 0) {
      this.formData.append("file", file[0]);
      this.formData.append(
        "masterCompanyId",
        this.currentUserMasterCompanyId.toString()
      );
      this.formData.append("createdBy", this.userName);
      this.formData.append("updatedBy", this.userName);
      this.formData.append("isActive", "true");
      this.formData.append("isDeleted", "false");
      const data = {
        masterCompanyId: this.currentUserMasterCompanyId,
        createdBy: this.userName,
        updatedBy: this.userName,
        isActive: true,
        isDeleted: false,
      };
      this.legalEntityService
        .legalEntityContactFileUpload(this.formData, this.id)
        .subscribe(
          (res) => {
            event.target.value = "";
            this.formData = new FormData();
            this.billingStatusForContact(this.statusForContact);
            this.alertService.showMessage(
              "Success",
              `Successfully Uploaded  `,
              MessageSeverity.success
            );
          },
          (err) => {
            this.isSpinnerVisible = false;
          }
        );
    }
  }

  // checkfirstNameExist(value) {
  // 	//this.disablesaveForFirstname = false;
  // 	for (let i = 0; i < this.contactsListOriginal.length; i++) {
  // 		if (this.contactInformation.firstName == this.contactsListOriginal[i].firstName || value == this.contactsListOriginal[i].firstName) {
  // 			//this.disablesaveForFirstname = true;
  // 			return;
  // 		}
  // 	}
  // }
  // checkmiddleNameExist(value) {
  // 	//this.disableSaveMiddleName = false;
  // 	for (let i = 0; i < this.contactsListOriginal.length; i++) {
  // 		if (this.contactInformation.middleName == this.contactsListOriginal[i].middleName || value == this.contactsListOriginal[i].middleName) {
  // 			//this.disableSaveMiddleName = true;
  // 			return;
  // 		}
  // 	}
  // 	if (value == "") {
  // 		//this.disableSaveMiddleName = false;
  // 	}
  // }
  // checklastNameExist(value) {
  // 	//this.disableSaveLastName = false;
  // 	for (let i = 0; i < this.contactsListOriginal.length; i++) {
  // 		if (this.contactInformation.lastName == this.contactsListOriginal[i].lastName || value == this.contactsListOriginal[i].lastName) {
  // 			//	this.disableSaveLastName = true;
  // 			return;
  // 		}
  // 	}
  // }
  patternValidate(event: any) {
    const pattern = /[0-9\+\-()\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  arrayTagNamelist: any = [];
  tagNamesList: any = [];
  getAllTagNameSmartDropDown(strText = "", contactTagId = 0) {
    if (this.arrayTagNamelist.length == 0) {
      this.arrayTagNamelist.push(0);
    }
    this.commonService
      .autoSuggestionSmartDropDownList(
        "ContactTag",
        "ContactTagId",
        "TagName",
        strText,
        true,
        20,
        this.arrayTagNamelist.join(),
        this.currentUserMasterCompanyId
      )
      .subscribe((res) => {
        this.tagNamesList = res.map((x) => {
          return {
            tagName: x.label,
            contactTagId: x.value,
          };
        });
        if (contactTagId > 0) {
          this.contactInformation = {
            ...this.contactInformation,
            tag: getObjectById("contactTagId", contactTagId, this.tagNamesList),
          };
        }
      });
  }

  filterTagNames(event) {
    if (event.query !== undefined && event.query !== null) {
      this.getAllTagNameSmartDropDown(event.query);
    }
  }
}
