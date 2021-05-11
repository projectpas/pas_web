import { Component, OnInit, AfterViewInit, ViewChild,ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { fadeInOut } from '../../../../services/animations';
import { MasterComapnyService } from '../../../../services/mastercompany.service';
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
import { AuditHistory } from '../../../../models/audithistory.model';
import { AuthService } from '../../../../services/auth.service';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { MasterCompany } from '../../../../models/mastercompany.model';
import { EmployeeService } from '../../../../services/employee.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AppTranslationService } from '../../../../services/app-translation.service';
import { CertificationtypeService } from '../../../../services/certificationtype.service';
// import { CertificationType } from '../../../../models/certificationtype.model';
import { DatePipe } from '@angular/common';
import { editValueAssignByCondition } from '../../../../generic/autocomplete';
import { CommonService } from '../../../../services/common.service';
import { ModuleConstants, PermissionConstants } from 'src/app/generic/ModuleConstant';

@Component({
    selector: 'app-employee-certification',
    templateUrl: './employee-certification.component.html',
    styleUrls: ['./employee-certification.component.scss'],
    animations: [fadeInOut],
    providers: [DatePipe]
})
export class EmployeeCertificationComponent implements OnInit, AfterViewInit {
    @ViewChild("tabRedirectConfirmationModal2",{static:false}) public tabRedirectConfirmationModal2: ElementRef;
    @ViewChild("empform",{static:false}) formdata;
    activeIndex: number;
    isEnableNext:any=false;
    isSpinnerVisible: boolean = false;
    data: any;
    disablesave: boolean;
    selecteddescription: any;
    allCertification: any[];
    descriptioncolle: any[] = [];
    description: any;
    certificationtypeCollection: any[];
    display: boolean;
    modelValue: boolean;
    employeeCertificationTypeId: any;
    certificationTypeId: any;
    @ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
    @ViewChild(MatSort,{static:false}) sort: MatSort;
    displayedColumns = ['employeeId', 'createdBy', 'updatedBy', 'updatedDate', 'createdDate'];
    dataSource: MatTableDataSource<any>;
    allEmployeeinfo: any[] = [];
    allComapnies: MasterCompany[] = [];
    private isSaving: boolean;
    public sourceAction: any = {};
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
    local: any;
    modal: NgbModalRef;
    employeeName: string;
    filteredBrands: any[];
    localCollection: any[] = [];
    public nextbuttonEnable = false;
    today = new Date();
    curcertificationDate = new Date();
    /** Actions ctor */
    public isEditMode: boolean = false;
    private isDeleteMode: boolean = false;
    enableSaveBtn: boolean = false;
    Active: string = "Active";
    public empId: any;
    public empcode: any;
    public firstName: any;
    public lastName: any;
    public allWorkFlows: any[] = [];
    arrayCertificationlist : any = [];
    employeeId: any;
    nextOrPreviousTab: any;
    isEditContent: boolean = false;
    isAdd: boolean=true;
    isEdit: boolean=true;
    isNextVisible:Boolean=true;
    constructor(private route: ActivatedRoute,
        private translationService: AppTranslationService,
        private datePipe: DatePipe,
        public certificationser: CertificationtypeService, 
        private router: Router, public authService: AuthService,
        private modalService: NgbModal,
        private activeModal: NgbActiveModal,
        private _fb: FormBuilder, private alertService: AlertService,
        public employeeService: EmployeeService, private dialog: MatDialog,
        private masterComapnyService: MasterComapnyService,
        public commonService: CommonService) {
        this.displayedColumns.push('action');
        this.dataSource = new MatTableDataSource();
        this.isAdd = this.authService.checkPermission([ModuleConstants.Employees_Certification + '.' + PermissionConstants.Add]);
        this.isEdit = this.authService.checkPermission([ModuleConstants.Employees_Certification + '.' + PermissionConstants.Update]);
        this.isNextVisible=this.authService.ShowTab("Create Employee",'Training');
    }
    ngOnInit(): void { 
        this.loadDataforCertification('');        
        this.employeeId = this.route.snapshot.paramMap.get('id');
        this.isSpinnerVisible = true;
        if (this.employeeId) {
            this.employeeService.employeeId =  this.employeeId;    
            this.isEditContent = true;
            this.employeeService.employeeId =  this.employeeId;    
            if(this.empId == null || this.empId == undefined ) {
                this.employeeService.toGetEmployeeDetailsByEmpId(this.employeeId).subscribe(res => {
                    if(res) {
                                                         
                        this.sourceEmployee = res;
                        if(this.sourceEmployee.employeeCertificationTypeId == null)
                            this.sourceEmployee.employeeCertificationTypeId = 0;
                        this.route.queryParams
                        .filter(params => params.order)
                        .subscribe(params => {               
                            this.empId = params.order;
                            if (this.empId) {
                                this.nextbuttonEnable = true;
                            }
                            else {
                            }                          
                            this.firstName = params.firstname;
                            this.lastName = params.lastname;
                             });      
                        }
                        this.empId = this.sourceEmployee.employeeId;
                        this.empcode = this.sourceEmployee.employeeCode;
                        
                        this.firstName = this.sourceEmployee.firstName;
                        this.lastName = this.sourceEmployee.lastName;
                        this.isEnableNext=true;
                        if (this.sourceEmployee.employeeId) {
                            this.nextbuttonEnable = true;
                        } 
                        this.employeeService.bredcrumbObj.next(this.employeeService.currentUrl);
                        this.employeeService.ShowPtab = true;
                        this.employeeService.alertObj.next(this.employeeService.ShowPtab); //steps

                        setTimeout(() => {				
                            this.isSpinnerVisible = true;
                            this.getwithemployeeLicensureId();
                            this.isSpinnerVisible = false;
                            
						},							 
						1200); 	 
                });
            }
            this.employeeService.currentUrl =  this.employeeService.currentUrl = `/employeesmodule/employeepages/app-employee-certification-edit/${this.employeeId}`;
        }else{            
            this.loadDataforCertification(''); 
            this.isSpinnerVisible = false;
            this.employeeService.currentUrl = '/employeesmodule/employeepages/app-employee-certification';
        }
        
    }
    sourceEmployee: any = {};
    ngAfterViewInit() {
        //this.loadCerertifcationByempId();
        //this.dataSource.paginator = this.paginator;
        //this.dataSource.sort = this.sort;
    }
    changeDateEv(date) {
        if(date){
            this.curcertificationDate = date;
    
        }else{
            this.curcertificationDate  = new Date(); 
        }

        
    }
    setExpireDate:any=new Date();
    enableSave() {
        this.enableSaveBtn = true;
    }

    loadCerertifcationByempId() { 
        this.isSpinnerVisible = true;
        this.employeeService.getEmployeeCertifications(this.employeeId).subscribe(
            data => {
                this.bindData(data[0]);
                this.isSpinnerVisible = false;
                
            },err => {
                this.isSpinnerVisible = false;
                //const errorLog = err;
               // this.errorMessageHandler(errorLog);		
            });
    }
       
    bindData(data: any) {           
            if (this.sourceEmployee.expirationDate == undefined) {
                this.sourceEmployee.expirationDate = "";
            }
            else {         
                this.sourceEmployee.expirationDate =  this.datePipe.transform(data.t.expirationDate, "MM/dd/yyyy")
                // this.sourceEmployee.expirationDate=new Date(data.workOrderDiscovery.inspectorDate)
            }   
            if(this.sourceEmployee.isExpirationDate == undefined)
            {
                this.sourceEmployee.isExpirationDate = false;
            }
            else{
                this.sourceEmployee.isExpirationDate = data.t.isExpirationDate;
            }
    }

    saveCertificateData() { 
        
        this.isSpinnerVisible = true;
        if (this.sourceEmployee.isExpirationDate == undefined) {
            this.sourceEmployee.isExpirationDate = false;
        }
        if (this.sourceEmployee.isCertificationInForce == undefined) {
            this.sourceEmployee.isCertificationInForce = false;
        }       
        this.isSaving = true;    
        if(this.sourceEmployee.expirationDate < this.setExpireDate){
            this.setExpireDate= new Date();
        }else{
            this.setExpireDate = this.sourceEmployee.expirationDate;   
        }    
        if (!this.sourceEmployee.employeeCertificationId) {        
            this.sourceEmployee.createdBy = this.userName;
            this.sourceEmployee.updatedBy = this.userName;
            this.sourceEmployee.isActive = true;
            this.sourceEmployee.masterCompanyId = this.currentUserMasterCompanyId;
            this.sourceEmployee.employeeId = this.empId;
            if (this.sourceEmployee.certificationDate != null) {
                let d=new Date(this.sourceEmployee.certificationDate);
                this.sourceEmployee.certificationDate = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`; 
            }            
            if (this.sourceEmployee.expirationDate != null) {
                let d=new Date(this.sourceEmployee.expirationDate);
                this.sourceEmployee.expirationDate = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
            }
            // this.sourceEmployee.certificationDate = this.datePipe.transform(this.sourceEmployee.certificationDate, "MM/dd/yyyy");
            // this.sourceEmployee.expirationDate = this.datePipe.transform(this.sourceEmployee.expirationDate, "MM/dd/yyyy");
            this.employeeService.newAddCertification(this.sourceEmployee).subscribe(
                data => {         
                    this.getwithemployeeLicensureId();                    
                    this.isEnableNext=true;
                    this.isEditContent = true;
                    this.nextbuttonEnable=true;
                    this.alertService.showMessage("Success",'Employee Certification Added Successfully.', MessageSeverity.success);                  
                    if(data.employeeId){
                        this.isEnableNext=true;  
                    }
                    this.employeeService.generalCollection = this.local;
                    this.enableSaveBtn = false;
                    this.isSpinnerVisible = false;
                })
        }
        else {
            this.sourceEmployee.updatedBy = this.userName;
            this.sourceEmployee.masterCompanyId = this.currentUserMasterCompanyId;
            
            this.sourceEmployee['expirationDateTemp'] = this.sourceEmployee.expirationDate;
            
            if (this.sourceEmployee.certificationDate != null) {
                let d=new Date(this.sourceEmployee.certificationDate);
                this.sourceEmployee.certificationDate = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`; 
            }            
            if (this.sourceEmployee.expirationDate != null) {
                let d=new Date(this.sourceEmployee.expirationDate);
                this.sourceEmployee.expirationDate = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
            }
            this.employeeService.updateCertificationDetails(this.sourceEmployee).subscribe(data => {
                this.getwithemployeeLicensureId();  
                this.alertService.showMessage("Success",'Employee Certification updated successfully.', MessageSeverity.success);
                this.employeeService.generalCollection = this.local;
                this.enableSaveBtn = false;
                this.isSpinnerVisible = false;
            })      
            var data = { "empId": this.empId, "firstName": this.firstName, "lastName": this.lastName };
            var stringData = JSON.stringify(data);
            var encryptedData = btoa(JSON.stringify(data));
        }
    }
    get currentUserMasterCompanyId(): number {
		return this.authService.currentUser
		  ? this.authService.currentUser.masterCompanyId
		  : null;
    }
    // Load Employee lcience data//
    private getwithemployeeLicensureId() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.employeeService.getCertificationList(this.empId).subscribe(
            results => this.onCertifywithEmpId(results[0]),
            error => {this.isSpinnerVisible = false } //this.onDataLoadFailed(error)
        );
        this.cols = [
            { field: 'certificationNumber', header: 'Certification' },
            { field: 'employeeCertificationTypeId', header: 'Certification Type' },
            { field: 'certifyingInstitution', header: 'Certification Institution' },
            { field: 'certificationDate', header: 'certification Date' },
            { field: 'isCertificationInForce', header: 'Certification In Force' },
            { field: 'createdBy', header: 'Created By' },
            { field: 'updatedBy', header: 'Updated By' },
            { field: 'updatedDate', header: 'Updated Date' },
            { field: 'createdDate', header: 'Created Date' }
        ];
        this.selectedColumns = this.cols;
    }
    // Load Emp list
    private loadData() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.employeeService.getEmployeeList().subscribe(
            results => this.onDataLoadSuccessful(results[0]),
            error => {this.isSpinnerVisible = false }//this.onDataLoadFailed(error)
        );
    }
    // Load Master Cpmpanies
    private loadMasterCompanies() {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.masterComapnyService.getMasterCompanies().subscribe(
            results => this.onDataMasterCompaniesLoadSuccessful(results[0]),
            error => {this.isSpinnerVisible = false } //this.onDataLoadFailed(error)
        );

    }

    public applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue;
    }

    private refresh() {
        // Causes the filter to refresh there by updating with recently added data.
        this.applyFilter(this.dataSource.filter);
    }

    private onDataLoadSuccessful(getCertificationList: any[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.dataSource.data = getCertificationList;
        this.allEmployeeinfo = getCertificationList;
    }
    // private loadDataforCertification() {
    //     this.alertService.startLoadingMessage();
    //     this.loadingIndicator = true;
    //     this.certificationser.getWorkFlows().subscribe(
    //         results => this.onDataLoadSuccessfulforCertification(results[0]),
    //         error => this.onDataLoadFailed(error)
    //     );
    // }

    private loadDataforCertification(strText = '') {
         this.alertService.startLoadingMessage();
         this.loadingIndicator = true;
		if(this.arrayCertificationlist.length == 0) {			
			this.arrayCertificationlist.push(0); }
		this.commonService.autoSuggestionSmartDropDownList('EmployeeCertificationType', 'EmployeeCertificationTypeId', 'description',strText,true,20000,this.arrayCertificationlist.join(),this.currentUserMasterCompanyId).subscribe(response => {
            this.alertService.stopLoadingMessage();
            this.loadingIndicator = false;
            this.allCertification = response;           			
		},err => {
            this.alertService.stopLoadingMessage();
            this.loadingIndicator = false;
			this.isSpinnerVisible = false;
			//const errorLog = err;
			//this.errorMessageHandler(errorLog);		
		});
    }
    
    private onDataLoadSuccessfulforCertification(allWorkFlows: any[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.allCertification = allWorkFlows;
    }

    private onCertifywithEmpId(certfilist: any) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.dataSource.data = certfilist;
        this.data = certfilist;
        if (this.data.length > 0) {
            this.sourceEmployee = this.data[0].t;            
            if (this.sourceEmployee.certificationDate != null) {
                this.sourceEmployee.certificationDate = new Date(this.sourceEmployee.certificationDate);
            }            
            if (this.sourceEmployee.expirationDate != null) {
                this.sourceEmployee.expirationDate = new Date(this.sourceEmployee.expirationDate);
            }
            if(this.sourceEmployee.employeeCertificationTypeId  && this.sourceEmployee.employeeCertificationTypeId > 0) {
                this.arrayCertificationlist.push(this.sourceEmployee.employeeCertificationTypeId);
            }
            this.loadDataforCertification('');
        }
    }

    private onHistoryLoadSuccessful(auditHistory: AuditHistory[], content) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.auditHisory = auditHistory;
        this.modal = this.modalService.open(content, { size: 'lg' });
        this.modal.result.then(() => {
        }, () => {  })
    }

    private onDataMasterCompaniesLoadSuccessful(allComapnies: MasterCompany[]) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;
        this.allComapnies = allComapnies;
    }

    private onDataLoadFailed(error: any) {
        this.alertService.stopLoadingMessage();
        this.loadingIndicator = false;

    }

    handleChange(rowData, e) {
        if (e.checked == false) {
            this.sourceAction = rowData;
            this.sourceAction.updatedBy = this.userName;
            this.Active = "In Active";
            this.sourceAction.isActive == false;
            this.employeeService.updateEmployee(this.sourceAction).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => {this.isSpinnerVisible = false }); //this.saveFailedHelper(error));

        }
        else {
            this.sourceAction = rowData;
            this.sourceAction.updatedBy = this.userName;
            this.Active = "Active";
            this.sourceAction.isActive == true;
            this.employeeService.updateEmployee(this.sourceAction).subscribe(
                response => this.saveCompleted(this.sourceAction),
                error => {this.isSpinnerVisible = false }); //this.saveFailedHelper(error));
        }
    }

    open(content) {
        this.isEditMode = false;
        this.isDeleteMode = false;
        this.isSaving = true;
        this.loadMasterCompanies();
        this.sourceAction.isActive = true;
        this.employeeName = "";
        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(() => {
        }, () => {  })
    }

    openDelete(content, row) {
        this.isEditMode = false;
        this.isDeleteMode = true;
        this.sourceAction = row;
        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(() => {
        }, () => {  })
    }

    openEdit(content, row) {
        this.isEditMode = true;
        this.isSaving = true;
        this.loadMasterCompanies();
        this.sourceAction = row;
        this.employeeName = this.sourceAction.employeeName;
        this.loadMasterCompanies();
        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(() => {
        }, () => {  })
    }

    openHelpText(content) {
        this.modal = this.modalService.open(content, { size: 'sm' });
        this.modal.result.then(() => {
        }, () => {  })
    }

    openHist(content, row) {
        this.alertService.startLoadingMessage();
        this.loadingIndicator = true;
        this.sourceAction = row;
        this.employeeService.historyEmployee(this.sourceAction.employeeId).subscribe(
            results => this.onHistoryLoadSuccessful(results[0], content),
            //error => this.saveFailedHelper(error));
            error =>{this.isSpinnerVisible=true})
    }

    editItemAndCloseModel() {
        this.isSaving = true;
        if (!this.sourceEmployee.employeeCertificationId) {
            this.sourceEmployee.createdBy = this.userName;
            this.sourceEmployee.updatedBy = this.userName;
            this.sourceEmployee.isActive = true;
            this.sourceEmployee.masterCompanyId = this.currentUserMasterCompanyId;
            this.sourceEmployee.employeeId = this.local.employeeId;
            this.employeeService.newAddCertification(this.sourceEmployee).subscribe(
                data => {
                    this.alertService.showMessage('Employee Certification Added successfully.');
                    this.localCollection = data;
                    //this.employeeService.generalCollection = this.local;
                })

            response => this.saveCompleted(this.sourceEmployee)
            this.activeIndex = 1;
            this.employeeService.indexObj.next(this.activeIndex);
        }
        else {
            this.sourceEmployee.updatedBy = this.userName;
            this.sourceEmployee.masterCompanyId = this.currentUserMasterCompanyId;
            this.employeeService.updateCertificationDetails(this.sourceEmployee).subscribe(data => {
                //this.alertService.showMessage('Employee Certification updated successfully.');
                this.alertService.showMessage("Success",'Employee Certification updated successfully.', MessageSeverity.success);
                //this.employeeService.generalCollection = this.local;
            })

            response => this.saveCompleted(this.sourceEmployee)
            this.activeIndex = 1;
            this.employeeService.indexObj.next(this.activeIndex);

        }
    }

    deleteItemAndCloseModel() {
        this.isSaving = true;
        this.sourceAction.updatedBy = this.userName;
        this.employeeService.deleteEmployee(this.sourceAction.employeeId).subscribe(
            response => this.saveCompleted(this.sourceAction),
            error => {this.isSpinnerVisible = false})//  this.saveFailedHelper(error));
        this.modal.close();
    }

    filterEmployees(event) {
        this.localCollection = [];
        for (let i = 0; i < this.allEmployeeinfo.length; i++) {
            let employeeName = this.allEmployeeinfo[i].employeeName;
            if (employeeName.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.localCollection.push(employeeName);
            }
        }
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

    private saveSuccessHelper(role?: any) {
        this.isSaving = false;
        this.alertService.showMessage("Success", `Action was created successfully`, MessageSeverity.success);
        this.loadData();
    }

    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    private saveFailedHelper(error: any) {
        this.isSaving = false;
        this.alertService.stopLoadingMessage();
        this.alertService.showStickyMessage("Save Error", "The below errors occured whilst saving your changes:", MessageSeverity.error, error);
        this.alertService.showStickyMessage(error, null, MessageSeverity.error);
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    gotnextClick() {        
        this.activeIndex = 2;
        this.employeeService.indexObj.next(this.activeIndex);       
        if(this.employeeId){
            this.router.navigateByUrl(`/employeesmodule/employeepages/app-employee-training-edit/${this.employeeId}`);
        }else{            
            this.router.navigate(['/employeesmodule/employeepages/app-employee-training'], { queryParams: { order: this.empId, 'firstName': this.firstName, 'lastName': this.lastName } });
        }
    }

    previousClick() {        
        // this.employeeService.listCollection = this.local;       
        this.activeIndex = 0;
        this.employeeService.indexObj.next(this.activeIndex);
        if(this.employeeId){
            this.router.navigateByUrl(`employeesmodule/employeepages/app-employee-general-information-edit/${this.employeeId}`);
        }else{
            this.router.navigate(['/employeesmodule/employeepages/app-employee-general-information'], { queryParams: { order: this.empId, 'firstName': this.firstName, 'lastName': this.lastName } });
        }
        // this.router.navigateByUrl('/employeesmodule/employeepages/app-employee-general-information');
    }

    certificationType(event) {
        if (this.allCertification) {
            for (let i = 0; i < this.allCertification.length; i++) {
                if (event == this.allCertification[i].description) {
                    this.disablesave = true;
                    this.selecteddescription = event;
                }
            }
        }
    }

    certificationHandlerHandler(event) {
        if (event.target.value != "") {
            let value = event.target.value.toLowerCase();
            if (this.selecteddescription) {
                if (value == this.selecteddescription.toLowerCase()) {
                    this.disablesave = true;
                }
                else {
                    this.disablesave = false;
                }
            }
        }
    }

    filtercertificationType(event) {
        this.certificationtypeCollection = [];
        for (let i = 0; i < this.allCertification.length; i++) {
            let description = this.allCertification[i].description;
            if (description.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.descriptioncolle.push([{
                    "employeeCertificationId": this.allCertification[i].employeeCertificationId,
                    "description": description
                }]),
                    this.certificationtypeCollection.push(description);
            }
        }
    }

    saveCertification() {
        this.isSaving = true;
        if (this.isEditMode == false) {
            this.sourceEmployee.createdBy = this.userName;
            this.sourceEmployee.updatedBy = this.userName;
            this.sourceEmployee.description = this.description;
            this.sourceEmployee.masterCompanyId = this.currentUserMasterCompanyId;           
            this.certificationser.newCertificationtype(this.sourceEmployee).subscribe(data => {
                this.getwithemployeeLicensureId();
                this.loadDataforCertification('');
                this.isEnableNext=true;  
                this.nextbuttonEnable=true;
                this.sourceEmployee.employeeCertificationId = data.employeeCertificationId;
            });
        }
        else {
            this.sourceEmployee.updatedBy = this.userName;
            this.sourceEmployee.description = this.description;
            this.sourceEmployee.masterCompanyId = this.currentUserMasterCompanyId;
            this.certificationser.updateCertificationtype(this.sourceEmployee).subscribe(
                response => {
                    // this.router.navigate(['/employeesmodule/employeepages/app-employee-training']);
                    this.isEnableNext=true;  
                    this.saveCompleted(this.sourceEmployee),
                        error =>{this.isSpinnerVisible=true} //this.saveFailedHelper(error)
                });
        }
        this.modal.close();
    }

    openCertification(content) {
        this.disablesave = false;
        this.isEditMode = false;
        this.isDeleteMode = false;
        this.disablesave = false;
        this.isSaving = true;
        this.loadMasterCompanies();
        this.description = "";
        this.sourceEmployee.isActive = true;
        this.modal = this.modalService.open(content, { size: 'sm', backdrop : 'static', keyboard : false });
        this.modal.result.then(() => {
        }, () => {  })
    }

    nextClick(nextOrPrevious) {       
        this.nextOrPreviousTab = nextOrPrevious;
        // if (this.formdata.form.dirty) {  
        if (this.enableSaveBtn == true) {           
        let content = this.tabRedirectConfirmationModal2;
        this.modal = this.modalService.open(content, { size: "sm" });}
        else {
            if(this.nextOrPreviousTab == 'Previous'){
                this.previousClick();
                }else{
                    this.gotnextClick()
                }
        }    
    }

    redirectToTabWithoutSave(){
        this.dismissModel();
        if(this.nextOrPreviousTab == 'Previous'){
        this.previousClick();
        }else{
            this.gotnextClick()
        }
    }
    
    redirectToTab(){
        this.saveCertificateData();
        this.dismissModel();
        if(this.nextOrPreviousTab == 'Previous'){
        this.previousClick();
        }else{
            this.gotnextClick()
        }
    }
}