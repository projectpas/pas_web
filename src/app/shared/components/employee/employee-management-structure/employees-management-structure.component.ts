import { Component, ElementRef,ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { fadeInOut } from '../../../../services/animations';
import { AlertService, MessageSeverity } from '../../../../services/alert.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { EmployeeService } from '../../../../services/employee.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LegalEntityService } from '../../../../services/legalentity.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
    selector: 'app-employees-management-structure',
    templateUrl: './employees-management-structure.component.html',
    styleUrls: ['./employees-management-structure.component.scss'],
    animations: [fadeInOut]
})
/** employees-list component*/
export class EmployeesManagementStructureComponent implements OnInit,AfterViewInit{
    @ViewChild("tabRedirectConfirmationModal4",{static:false}) public tabRedirectConfirmationModal4: ElementRef;
    selectedRoles: any = [];
    memoText: string;
    employeeRolesList: object[];
    employeeRoleLabel = [];
    allManagemtninfo: any[];
    tagNameCollection: any[] = [];
    public empcode: any;
    isSpinnerVisible: boolean = false;
    empId: any;
    firstName: any;
    lastName: any;
    local: any;
    modal: NgbModalRef;
    employeeName: string;
    filteredBrands: any[];
    localCollection: any[] = [];
    sourceEmployee: any = {};
    memoData:any;
    dropdownSettings = {
        singleSelection: false,
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 1,
        allowSearchFilter: false
    };
    gridData = [];
    employeeId: any;
    nextOrPreviousTab: any;
    empDetailsData: any;
    isEditContent: boolean = false;
    memoPopupContent: any;
   
    
    constructor(private router: Router, private route: ActivatedRoute, 
        private modalService: NgbModal,
        public authService: AuthService,
        public employeeService: EmployeeService, private legalEntityService: LegalEntityService, private alertService: AlertService){

       
        if (this.employeeService.generalCollection) {
            this.local = this.employeeService.generalCollection;
        }
        if (this.employeeService.listCollection && this.employeeService.isEditMode == true) {
            this.sourceEmployee = this.employeeService.listCollection;
            this.employeeId = this.sourceEmployee.employeeId;   
            this.firstName=this.employeeService.listCollection.firstName;
            this.lastName=this.employeeService.listCollection.lastName;            
            this.local = this.employeeService.listCollection;
        }       
    } 

    ngOnInit(){
        this.employeeId = this.route.snapshot.paramMap.get('id');
        if (this.employeeId) {
            this.employeeService.employeeId =  this.employeeId; 
                this.employeeService.toGetEmployeeDetailsByEmpId(this.employeeId).subscribe(res => {
                    if(res) {
                        this.employeeService.enableUpdateButton = false;
                        this.sourceEmployee = res;
                        this.empId = this.sourceEmployee.employeeId;
                        this.empcode = this.sourceEmployee.employeeCode;
                        this.firstName = this.sourceEmployee.firstName;
                        this.lastName = this.sourceEmployee.lastName;
                        this.employeeService.legalEnityList = [];
                        this.employeeService.employeeId =  this.employeeId;
                }
                });            
            this.isEditContent = true;
            this.employeeService.currentUrl = `/employeesmodule/employeepages/app-employees-management-structure-edit/${this.employeeId}`;
        }else{
            this.employeeService.currentUrl = '/employeesmodule/employeepages/app-employees-management-structure';
        }
        this.employeeService.bredcrumbObj.next(this.employeeService.currentUrl);
		this.employeeService.ShowPtab = true;
		this.employeeService.alertObj.next(this.employeeService.ShowPtab); //steps
        this.structureInit();
        this.loadEmployeeRoles();
      
        if (this.employeeService.listCollection != null && this.employeeService.isEditMode == true) {           
            this.employeeService.toGetEmployeeDetailsByEmpId(this.employeeId).subscribe(res => {
                this.empDetailsData = res;
                if(this.empDetailsData.memo && this.empDetailsData.memo != undefined 
                    && this.empDetailsData.memo != ''  && this.empDetailsData.memo != null) {
                this.memoText = this.empDetailsData.memo;}
                else {this.memoText = '';}
            });
        }
    }

    ngAfterViewInit() {
        this.route.queryParams
        .filter(params => params.order)
        .subscribe(params => {
            this.empId = params.order;

            this.empId = params.order;
            this.firstName = params.firstname;
            this.lastName = params.lastname;
        });
    }
    onClickMemo() {
        this.disableEditor=true;
        this.memoPopupContent = this.memoText;
    }
    disableEditor:any=true;
    editorgetmemo(ev){
        this.disableEditor=false;
    }

    parsedText(text) {
        if (text) {
            const dom = new DOMParser().parseFromString(
                '<!doctype html><body>' + text,
                'text/html');
            const decodedString = dom.body.textContent;
            return decodedString;
        }
    }
    onClickPopupSave() {
        this.employeeService.enableUpdateButton = true;
        this.memoText = this.memoPopupContent;
    }
    onItemSelect(item: any) {
        this.employeeService.enableUpdateButton = true;
    }
    onSelectAll(items: any) {
        this.employeeService.enableUpdateButton = true;
    }
    onmsSelect() {
        this.employeeService.enableUpdateButton = true;
    } 

    getManagementStructureData(){
        this.isSpinnerVisible = true;
        let roles = [];
        this.employeeService.getStoredEmployeeRoles(this.employeeId)
        .subscribe(
            (employeeList: any[])=>{
                this.employeeRolesList.forEach(mainRole => {
                    employeeList.forEach(role => {
                        if(role.roleId == mainRole['id']){
                            roles.push(mainRole['name']);
                        }
                    });
                });
                this.selectedRoles = roles;
                this.isSpinnerVisible = false;
            },err => {
                this.isSpinnerVisible = false;
                const errorLog = err;
                this.errorMessageHandler(errorLog);		
            }
        )
        this.isSpinnerVisible = true;
        this.employeeService.getStoredEmployeeManagementStructure(this.employeeId)
        .subscribe(
            (managementStructureList: any[])=>{
                this.isSpinnerVisible = false;
                if (managementStructureList && managementStructureList.length > 0)  {                    
                this.employeeService.legalEnityList = managementStructureList;
                     if(this.allManagemtninfo && this.allManagemtninfo.length == managementStructureList.length)
                     {
                        this.employeeService.legalEnityList.push({
                            managementStructureId:0,
                            isActive: true,
                            checked: true,
                            chldParent: 'test',
                            isDeleted: false
                        });
                     }                
                }
                else {
                    this.employeeService.legalEnityList = [];
                }
            },err => {
                this.isSpinnerVisible = false;
                const errorLog = err;
                this.errorMessageHandler(errorLog);		
            }
        )
    }

    structureInit(){
        var toggler = document.getElementsByClassName("caret");
        var i;

        for (i = 0; i < toggler.length; i++) {
        toggler[i].addEventListener("click", function() {
            this.parentElement.querySelector(".nested").classList.toggle("active");
            this.classList.toggle("caret-down");
        });
        }
    }
    loadEmployeeRoles(){
        this.isSpinnerVisible = true;
        this.employeeService.getAllRolesOfEmployee().subscribe(
            results => {
                this.employeeRolesList = results;
                this.employeeRoleLabel = this.employeeRolesList.map((emp)=>{ return emp['name']})
                this.loadManagementStructure();
                this.isSpinnerVisible = false;
            },err => {
                this.isSpinnerVisible = false;
                const errorLog = err;
                this.errorMessageHandler(errorLog);		
            }
        );
    }
    loadManagementStructure(){
        this.isSpinnerVisible = true;
        this.legalEntityService.getManagemententity().subscribe(
            (results: any)=>{
                this.onManagemtntdataLoad(results[0])
                this.getManagementStructureData();
                this.isSpinnerVisible = false;
            }
            ,err => {
                this.isSpinnerVisible = false;
                const errorLog = err;
                this.errorMessageHandler(errorLog);		
            }
        )
    }

    errorMessageHandler(log) {
        this.isSpinnerVisible = false;
        const errorLog = log;
        if (errorLog.error) {
            this.alertService.showMessage(
                "Validation Failed",
                errorLog.error,
                MessageSeverity.error
            );
            return;
        }
		var msg = '';
		if(errorLog.message) {
		  if (errorLog.error && errorLog.error.errors.length > 0) {
					for (let i = 0; i < errorLog.error.errors.length; i++){
						msg = msg + errorLog.error.errors[i].message + '<br/>'
					}
				}
				this.alertService.showMessage(
                    errorLog.error.message,
					msg,
					MessageSeverity.error
				);
		   }
		   else {
			this.alertService.showMessage(
				'Error',
				log.error,
				MessageSeverity.error
			); }
	}

    private onManagemtntdataLoad(getAtaMainList: any[]) {
        this.isSpinnerVisible = true;
		this.allManagemtninfo = getAtaMainList;
		for (let i = 0; i < this.allManagemtninfo.length; i++) {
			if (this.allManagemtninfo[i].tagName != null) {
				this.tagNameCollection.push(this.allManagemtninfo[i]);
			}
		}		
		if (this.allManagemtninfo)
		{
			
            this.gridData = [{
                data: {
                    fullName: this.allManagemtninfo[0].companyName,
                    isRoot: true,
                    managementStructureId: 0                   
                },
                children: this.makeNestedObj(this.allManagemtninfo, null),
                isCheckboxNotDisable: false
            }];
            // this.employeeService.structureData = this.gridData;
        }
        this.isSpinnerVisible = false;
    }
    makeNestedObj(arr, parent) {
		var out = []
		for (var i in arr) {
			if (arr[i].parentId == parent) {
				var children = this.makeNestedObj(arr, arr[i].managementStructureId)
				arr[i] = { "data": arr[i] };
				if (children.length) {
					arr[i].children = children
				}
				out.push(arr[i])
			}
		}
		return out
    }
    
    saveManagementStructure(){
        
        //this.employeeService.employeeStored['memo'] = this.memoText;

        //this.employeeService.updateEmployee(this.employeeService.employeeStored).subscribe(
            this.isSpinnerVisible = true;
            this.employeeService.updateEmployeeMemo(this.employeeId,this.memoText).subscribe(
            results => {
                this.employeeService.storeEmployeeRoles(this.getEmployeeRolesList()).subscribe(
                    (result)=>{
                        this.employeeService.storeEmployeeManagementStructure(this.getLegalEntityList()).subscribe(
                            (result) => {
                                this.isSpinnerVisible = false;
                                this.employeeService.enableUpdateButton = false;
                                this.alertService.showMessage("Success", "Management Strcture Updated Sucessfully", MessageSeverity.success);
                                //this.router.navigateByUrl('/employeesmodule/employeepages/app-employees-list');
                            },
                            (error)=>{
                            }
                        )
                    },
                    (error)=>{
                    }
                )
            },

        );
        
    }
    getEmployeeRolesList(){
        let result = [];
        this.employeeRolesList.forEach((role)=>{
            if(this.selectedRoles.indexOf(role['name']) != -1){
                result.push(
                    {
                        "employeeId": this.employeeId,
                        "roleId": role['id'],
                        "createdBy": "admin",
                        "updatedBy": "admin",
                        "isActive": role['isActive'],
                        "isDeleted": role['isDeleted']
                    }
                )
            }
        })
        return result;
    }
    get userName(): string {
        return this.authService.currentUser ? this.authService.currentUser.userName : "";
    }

    get currentUserMasterCompanyId(): number {
		return this.authService.currentUser
		  ? this.authService.currentUser.masterCompanyId
		  : null;
    }

    getLegalEntityList(){
        let result = [];
        this.employeeService.legalEnityList.forEach((ele, index)=>{
            this.employeeService.legalEnityList[index]['isActive'] = true;
            this.employeeService.legalEnityList[index]['isDeleted'] = false;
            this.employeeService.legalEnityList[index]['employeeId'] = this.employeeId;
            this.employeeService.legalEnityList[index]['masterCompanyId'] = this.currentUserMasterCompanyId;            
            this.employeeService.legalEnityList[index]['createdBy'] = this.userName;
            this.employeeService.legalEnityList[index]['UpdatedBy'] = this.userName;
        })
        var findIndex = -1;        
        this.employeeService.legalEnityList.forEach((legEntity, index)=>{
            if(legEntity.managementStructureId == 0){
                findIndex = index;
            }
        });
        if(findIndex != -1){
        this.employeeService.legalEnityList.splice(findIndex, 1);
        }
        return this.employeeService.legalEnityList;
    }

    previousClick(){
		this.employeeService.indexObj.next(2);
		//this.saveCompleted(this.sourceCustomer);
        
    
        if(this.employeeService.isEditMode==true){
            this.router.navigateByUrl(`/employeesmodule/employeepages/app-employee-training-edit/${this.employeeId}`);
        }else{
            
            this.router.navigate(['/employeesmodule/employeepages/app-employee-training'], { queryParams: { order: this.employeeId, 'firstName': this.firstName, 'lastName': this.lastName } });
        }
    }
     
    nextClick(nextOrPrevious) {
        if(this.employeeService.enableUpdateButton == true) {
            this.nextOrPreviousTab = nextOrPrevious;
            let content = this.tabRedirectConfirmationModal4;
            this.modal = this.modalService.open(content, { size: "sm" });    
        } else {
            this.previousClick();
        }
    }
    dismissModel() {
        this.modal.close();
    }
    redirectToTabWithoutSave()  
    {
        this.dismissModel();
        this.previousClick();
    }  

    redirectToTab(){
        this.dismissModel();
        this.saveManagementStructure();
        if(this.nextOrPreviousTab == 'Previous'){
                this.previousClick();
        }else{
            // this.gotnextClick()
        }
    }
}