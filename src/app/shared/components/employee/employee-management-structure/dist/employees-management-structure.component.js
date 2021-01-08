"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.EmployeesManagementStructureComponent = void 0;
var core_1 = require("@angular/core");
var animations_1 = require("../../../../services/animations");
var alert_service_1 = require("../../../../services/alert.service");
var EmployeesManagementStructureComponent = /** @class */ (function () {
    function EmployeesManagementStructureComponent(router, route, modalService, authService, employeeService, legalEntityService, alertService) {
        this.router = router;
        this.route = route;
        this.modalService = modalService;
        this.authService = authService;
        this.employeeService = employeeService;
        this.legalEntityService = legalEntityService;
        this.alertService = alertService;
        this.selectedRoles = [];
        this.employeeRoleLabel = [];
        this.tagNameCollection = [];
        this.isSpinnerVisible = false;
        this.localCollection = [];
        this.sourceEmployee = {};
        this.dropdownSettings = {
            singleSelection: false,
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: 1,
            allowSearchFilter: false
        };
        this.gridData = [];
        this.isEditContent = false;
        this.enableUpdateButton = false;
        if (this.employeeService.generalCollection) {
            this.local = this.employeeService.generalCollection;
        }
        if (this.employeeService.listCollection && this.employeeService.isEditMode == true) {
            this.sourceEmployee = this.employeeService.listCollection;
            this.employeeId = this.sourceEmployee.employeeId;
            this.firstName = this.employeeService.listCollection.firstName;
            this.lastName = this.employeeService.listCollection.lastName;
            this.local = this.employeeService.listCollection;
        }
    }
    EmployeesManagementStructureComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.employeeId = this.route.snapshot.paramMap.get('id');
        if (this.employeeId) {
            this.employeeService.employeeId = this.employeeId;
            this.employeeService.toGetEmployeeDetailsByEmpId(this.employeeId).subscribe(function (res) {
                if (res) {
                    _this.sourceEmployee = res;
                    _this.empId = _this.sourceEmployee.employeeId;
                    _this.firstName = _this.sourceEmployee.firstName;
                    _this.lastName = _this.sourceEmployee.lastName;
                    _this.employeeService.legalEnityList = [];
                    _this.employeeService.employeeId = _this.employeeId;
                }
            });
            this.isEditContent = true;
            this.employeeService.currentUrl = "/employeesmodule/employeepages/app-employees-management-structure-edit/" + this.employeeId;
        }
        else {
            this.employeeService.currentUrl = '/employeesmodule/employeepages/app-employees-management-structure';
        }
        this.employeeService.bredcrumbObj.next(this.employeeService.currentUrl);
        this.employeeService.ShowPtab = true;
        this.employeeService.alertObj.next(this.employeeService.ShowPtab); //steps
        this.structureInit();
        this.loadEmployeeRoles();
        if (this.employeeService.listCollection != null && this.employeeService.isEditMode == true) {
            this.employeeService.toGetEmployeeDetailsByEmpId(this.employeeId).subscribe(function (res) {
                _this.empDetailsData = res;
                _this.memoText = _this.empDetailsData.memo;
            });
        }
    };
    EmployeesManagementStructureComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.route.queryParams
            .filter(function (params) { return params.order; })
            .subscribe(function (params) {
            _this.empId = params.order;
            _this.empId = params.order;
            _this.firstName = params.firstname;
            _this.lastName = params.lastname;
        });
    };
    EmployeesManagementStructureComponent.prototype.onClickMemo = function () {
        this.memoPopupContent = this.memoText;
    };
    EmployeesManagementStructureComponent.prototype.onClickPopupSave = function () {
        this.enableUpdateButton = true;
        this.memoText = this.memoPopupContent;
    };
    EmployeesManagementStructureComponent.prototype.onItemSelect = function (item) {
        this.enableUpdateButton = true;
    };
    EmployeesManagementStructureComponent.prototype.onSelectAll = function (items) {
        this.enableUpdateButton = true;
    };
    EmployeesManagementStructureComponent.prototype.onmsSelect = function () {
        this.enableUpdateButton = true;
    };
    EmployeesManagementStructureComponent.prototype.getManagementStructureData = function () {
        var _this = this;
        this.isSpinnerVisible = true;
        var roles = [];
        this.employeeService.getStoredEmployeeRoles(this.employeeId)
            .subscribe(function (employeeList) {
            _this.employeeRolesList.forEach(function (mainRole) {
                employeeList.forEach(function (role) {
                    if (role.roleId == mainRole['id']) {
                        roles.push(mainRole['name']);
                    }
                });
            });
            _this.selectedRoles = roles;
            _this.isSpinnerVisible = false;
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
        this.isSpinnerVisible = true;
        this.employeeService.getStoredEmployeeManagementStructure(this.employeeId)
            .subscribe(function (managementStructureList) {
            _this.isSpinnerVisible = false;
            if (managementStructureList && managementStructureList.length > 0) {
                _this.employeeService.legalEnityList = managementStructureList;
                if (_this.allManagemtninfo && _this.allManagemtninfo.length == managementStructureList.length) {
                    _this.employeeService.legalEnityList.push({
                        managementStructureId: 0,
                        isActive: true,
                        checked: true,
                        chldParent: 'test',
                        isDeleted: false
                    });
                }
            }
            else {
                _this.employeeService.legalEnityList = [];
            }
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
    };
    EmployeesManagementStructureComponent.prototype.structureInit = function () {
        var toggler = document.getElementsByClassName("caret");
        var i;
        for (i = 0; i < toggler.length; i++) {
            toggler[i].addEventListener("click", function () {
                this.parentElement.querySelector(".nested").classList.toggle("active");
                this.classList.toggle("caret-down");
            });
        }
    };
    EmployeesManagementStructureComponent.prototype.loadEmployeeRoles = function () {
        var _this = this;
        this.isSpinnerVisible = true;
        this.employeeService.getAllRolesOfEmployee().subscribe(function (results) {
            _this.employeeRolesList = results;
            _this.employeeRoleLabel = _this.employeeRolesList.map(function (emp) { return emp['name']; });
            _this.loadManagementStructure();
            _this.isSpinnerVisible = false;
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
    };
    EmployeesManagementStructureComponent.prototype.loadManagementStructure = function () {
        var _this = this;
        this.isSpinnerVisible = true;
        this.legalEntityService.getManagemententity().subscribe(function (results) {
            _this.onManagemtntdataLoad(results[0]);
            _this.getManagementStructureData();
            _this.isSpinnerVisible = false;
        }, function (err) {
            _this.isSpinnerVisible = false;
            var errorLog = err;
            _this.errorMessageHandler(errorLog);
        });
    };
    EmployeesManagementStructureComponent.prototype.errorMessageHandler = function (log) {
        this.isSpinnerVisible = false;
        var errorLog = log;
        if (errorLog.error) {
            this.alertService.showMessage("Validation Failed", errorLog.error, alert_service_1.MessageSeverity.error);
            return;
        }
        var msg = '';
        if (errorLog.message) {
            if (errorLog.error && errorLog.error.errors.length > 0) {
                for (var i = 0; i < errorLog.error.errors.length; i++) {
                    msg = msg + errorLog.error.errors[i].message + '<br/>';
                }
            }
            this.alertService.showMessage(errorLog.error.message, msg, alert_service_1.MessageSeverity.error);
        }
        else {
            this.alertService.showMessage('Error', log.error, alert_service_1.MessageSeverity.error);
        }
    };
    EmployeesManagementStructureComponent.prototype.onManagemtntdataLoad = function (getAtaMainList) {
        this.isSpinnerVisible = true;
        this.allManagemtninfo = getAtaMainList;
        for (var i = 0; i < this.allManagemtninfo.length; i++) {
            if (this.allManagemtninfo[i].tagName != null) {
                this.tagNameCollection.push(this.allManagemtninfo[i]);
            }
        }
        if (this.allManagemtninfo) {
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
    };
    EmployeesManagementStructureComponent.prototype.makeNestedObj = function (arr, parent) {
        var out = [];
        for (var i in arr) {
            if (arr[i].parentId == parent) {
                var children = this.makeNestedObj(arr, arr[i].managementStructureId);
                arr[i] = { "data": arr[i] };
                if (children.length) {
                    arr[i].children = children;
                }
                out.push(arr[i]);
            }
        }
        return out;
    };
    EmployeesManagementStructureComponent.prototype.saveManagementStructure = function () {
        //this.employeeService.employeeStored['memo'] = this.memoText;
        var _this = this;
        //this.employeeService.updateEmployee(this.employeeService.employeeStored).subscribe(
        this.isSpinnerVisible = true;
        this.employeeService.updateEmployeeMemo(this.employeeId, this.memoText).subscribe(function (results) {
            _this.employeeService.storeEmployeeRoles(_this.getEmployeeRolesList()).subscribe(function (result) {
                _this.employeeService.storeEmployeeManagementStructure(_this.getLegalEntityList()).subscribe(function (result) {
                    _this.isSpinnerVisible = false;
                    _this.alertService.showMessage("Success", "Management Strcture Updated Sucessfully", alert_service_1.MessageSeverity.success);
                    //this.router.navigateByUrl('/employeesmodule/employeepages/app-employees-list');
                }, function (error) {
                });
            }, function (error) {
            });
        });
    };
    EmployeesManagementStructureComponent.prototype.getEmployeeRolesList = function () {
        var _this = this;
        var result = [];
        this.employeeRolesList.forEach(function (role) {
            if (_this.selectedRoles.indexOf(role['name']) != -1) {
                result.push({
                    "employeeId": _this.employeeId,
                    "roleId": role['id'],
                    "createdBy": "admin",
                    "updatedBy": "admin",
                    "isActive": role['isActive'],
                    "isDeleted": role['isDeleted']
                });
            }
        });
        return result;
    };
    Object.defineProperty(EmployeesManagementStructureComponent.prototype, "userName", {
        get: function () {
            return this.authService.currentUser ? this.authService.currentUser.userName : "";
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EmployeesManagementStructureComponent.prototype, "currentUserMasterCompanyId", {
        get: function () {
            return this.authService.currentUser
                ? this.authService.currentUser.masterCompanyId
                : null;
        },
        enumerable: false,
        configurable: true
    });
    EmployeesManagementStructureComponent.prototype.getLegalEntityList = function () {
        var _this = this;
        var result = [];
        this.employeeService.legalEnityList.forEach(function (ele, index) {
            _this.employeeService.legalEnityList[index]['isActive'] = true;
            _this.employeeService.legalEnityList[index]['isDeleted'] = false;
            _this.employeeService.legalEnityList[index]['employeeId'] = _this.employeeId;
            _this.employeeService.legalEnityList[index]['masterCompanyId'] = _this.currentUserMasterCompanyId;
            _this.employeeService.legalEnityList[index]['createdBy'] = _this.userName;
            _this.employeeService.legalEnityList[index]['UpdatedBy'] = _this.userName;
        });
        var findIndex = -1;
        this.employeeService.legalEnityList.forEach(function (legEntity, index) {
            if (legEntity.managementStructureId == 0) {
                findIndex = index;
            }
        });
        if (findIndex != -1) {
            this.employeeService.legalEnityList.splice(findIndex, 1);
        }
        return this.employeeService.legalEnityList;
    };
    EmployeesManagementStructureComponent.prototype.previousClick = function () {
        this.employeeService.indexObj.next(2);
        //this.saveCompleted(this.sourceCustomer);
        if (this.employeeService.isEditMode == true) {
            this.router.navigateByUrl("/employeesmodule/employeepages/app-employee-training-edit/" + this.employeeId);
        }
        else {
            this.router.navigate(['/employeesmodule/employeepages/app-employee-training'], { queryParams: { order: this.employeeId, 'firstName': this.firstName, 'lastName': this.lastName } });
        }
    };
    EmployeesManagementStructureComponent.prototype.nextClick = function (nextOrPrevious) {
        this.nextOrPreviousTab = nextOrPrevious;
        var content = this.tabRedirectConfirmationModal4;
        this.modal = this.modalService.open(content, { size: "sm" });
    };
    EmployeesManagementStructureComponent.prototype.dismissModel = function () {
        this.modal.close();
    };
    EmployeesManagementStructureComponent.prototype.redirectToTabWithoutSave = function () {
        this.dismissModel();
        this.previousClick();
    };
    EmployeesManagementStructureComponent.prototype.redirectToTab = function () {
        this.dismissModel();
        this.saveManagementStructure();
        if (this.nextOrPreviousTab == 'Previous') {
            this.previousClick();
        }
        else {
            // this.gotnextClick()
        }
    };
    __decorate([
        core_1.ViewChild("tabRedirectConfirmationModal4")
    ], EmployeesManagementStructureComponent.prototype, "tabRedirectConfirmationModal4");
    EmployeesManagementStructureComponent = __decorate([
        core_1.Component({
            selector: 'app-employees-management-structure',
            templateUrl: './employees-management-structure.component.html',
            styleUrls: ['./employees-management-structure.component.scss'],
            animations: [animations_1.fadeInOut]
        })
        /** employees-list component*/
    ], EmployeesManagementStructureComponent);
    return EmployeesManagementStructureComponent;
}());
exports.EmployeesManagementStructureComponent = EmployeesManagementStructureComponent;
