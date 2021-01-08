"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.EmployeePagesComponent = void 0;
var core_1 = require("@angular/core");
var EmployeePagesComponent = /** @class */ (function () {
    function EmployeePagesComponent(router, route, employeeService) {
        var _this = this;
        this.router = router;
        this.route = route;
        this.employeeService = employeeService;
        this.employeeService.bredcrumbObjChangeObject$.subscribe(function (value) {
            //debugger
            _this.otherurl = value;
            _this.loadmethod(_this.otherurl);
        });
    }
    EmployeePagesComponent.prototype.ngOnInit = function () {
        this.currentUrl = this.route.url;
        this.loadmethod(this.currentUrl);
    };
    EmployeePagesComponent.prototype.loadmethod = function (url) {
        this.currentUrl = url;
        if (this.currentUrl) {
            if (this.currentUrl.includes('/employeesmodule/employeepages/app-employees-list')) {
                this.items = [
                    { label: 'Employee' },
                    { label: 'Employee List' }
                ];
            }
            else if (this.currentUrl.includes('/employeesmodule/employeepages/app-employee-general-information-edit')) {
                this.items = [
                    { label: 'Employee' },
                    { label: 'Edit Employee' }
                ];
            }
            else if (this.currentUrl.includes('/employeesmodule/employeepages/app-employee-certification-edit')) {
                this.items = [
                    { label: 'Employee' },
                    { label: 'Edit Employee' }
                ];
            }
            else if (this.currentUrl.includes('/employeesmodule/employeepages/app-employee-training-edit')) {
                this.items = [
                    { label: 'Employee' },
                    { label: 'Edit Employee' }
                ];
            }
            else if (this.currentUrl.includes('/employeesmodule/employeepages/app-employees-management-structure-edit')) {
                this.items = [
                    { label: 'Employee' },
                    { label: 'Edit Employee' }
                ];
            }
            else if (this.currentUrl.includes('/employeesmodule/employeepages/app-employee-general-information')) {
                this.items = [
                    { label: 'Employee' },
                    { label: 'Create Employee' }
                ];
            }
            else if (this.currentUrl.includes('/employeesmodule/employeepages/app-employee-certification')) {
                this.items = [
                    { label: 'Employee' },
                    { label: 'Create Employee' }
                ];
            }
            else if (this.currentUrl.includes('/employeesmodule/employeepages/app-employee-training')) {
                this.items = [
                    { label: 'Employee' },
                    { label: 'Create Employee' }
                ];
            }
            else if (this.currentUrl.includes('/employeesmodule/employeepages/app-employees-management-structure')) {
                this.items = [
                    { label: 'Employee' },
                    { label: 'Create Employee' }
                ];
            }
        }
        if (this.otherurl) {
            if (this.currentUrl.includes('/employeesmodule/employeepages/app-employees-list')) {
                this.items = [
                    { label: 'Employee' },
                    { label: 'Employee List' }
                ];
            }
            else if (this.currentUrl.includes('/employeesmodule/employeepages/app-employee-general-information-edit')) {
                this.items = [
                    { label: 'Employee' },
                    { label: 'Edit Employee' }
                ];
            }
            else if (this.currentUrl.includes('/employeesmodule/employeepages/app-employee-certification-edit')) {
                this.items = [
                    { label: 'Employee' },
                    { label: 'Edit Employee' }
                ];
            }
            else if (this.currentUrl.includes('/employeesmodule/employeepages/app-employee-training-edit')) {
                this.items = [
                    { label: 'Employee' },
                    { label: 'Edit Employee' }
                ];
            }
            else if (this.currentUrl.includes('/employeesmodule/employeepages/app-employees-management-structure-edit')) {
                this.items = [
                    { label: 'Employee' },
                    { label: 'Edit Employee' }
                ];
            }
            else if (this.currentUrl.includes('/employeesmodule/employeepages/app-employee-general-information')) {
                this.items = [
                    { label: 'Employee' },
                    { label: 'Create Employee' }
                ];
            }
            else if (this.currentUrl.includes('/employeesmodule/employeepages/app-employee-certification')) {
                this.items = [
                    { label: 'Employee' },
                    { label: 'Create Employee' }
                ];
            }
            else if (this.currentUrl.includes('/employeesmodule/employeepages/app-employee-training')) {
                this.items = [
                    { label: 'Employee' },
                    { label: 'Create Employee' }
                ];
            }
            else if (this.currentUrl.includes('/employeesmodule/employeepages/app-employees-management-structure')) {
                this.items = [
                    { label: 'Employee' },
                    { label: 'Create Employee' }
                ];
            }
        }
    };
    EmployeePagesComponent = __decorate([
        core_1.Component({
            selector: 'quickapp-pro-employee',
            templateUrl: './employeepages.component.html'
        })
        /** Vendorpages component*/
    ], EmployeePagesComponent);
    return EmployeePagesComponent;
}());
exports.EmployeePagesComponent = EmployeePagesComponent;
