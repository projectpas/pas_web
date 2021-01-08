"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.EmployeeStepsPrimeNgComponent = void 0;
var core_1 = require("@angular/core");
var EmployeeStepsPrimeNgComponent = /** @class */ (function () {
    /** employee-steps-primeNg ctor */
    function EmployeeStepsPrimeNgComponent(router, acRouter, route, employeeService) {
        var _this = this;
        this.router = router;
        this.acRouter = acRouter;
        this.route = route;
        this.employeeService = employeeService;
        this.editMode = false;
        this.msgs = [];
        this.isEditMode = false;
        this.isDisabledSteps = false;
        var currentUrl = this.route.url;
        this.employeeService.alertChangeObject$.subscribe(function (value) {
            _this.showComponentPTab = value;
        });
        this.employeeService.indexObjChangeObject$.subscribe(function (value) {
            _this.activeIndex = value;
        });
    }
    EmployeeStepsPrimeNgComponent.prototype.ngOnInit = function () {
        var _this = this;
        // ?this.acRouter.snapshot.paramMap.get('id') :
        this.showComponentPTab = this.employeeService.ShowPtab;
        this.currentUrl = this.route.url;
        //debugger
        if (this.currentUrl.includes('/employeesmodule/employeepages/app-employees-list')) {
            this.employeeService.isEditMode = false;
            this.activeIndex = 0;
        }
        else {
            this.employeeService.isEditMode = true;
        }
        if (this.currentUrl.includes('/employeesmodule/employeepages/app-employee-general-information')) {
            this.activeIndex = 0;
            this.isDisabledSteps = true;
            this.showComponentPTab = true;
            this.getEmployeeId();
        }
        else if (this.currentUrl.includes('/employeesmodule/employeepages/app-employee-certification')) {
            this.showComponentPTab = true;
            this.activeIndex = 1;
            this.getEmployeeId();
        }
        else if (this.currentUrl.includes('/employeesmodule/employeepages/app-employee-training')) {
            this.showComponentPTab = true;
            this.activeIndex = 2;
            this.getEmployeeId();
        }
        else if (this.currentUrl.includes('/employeesmodule/employeepages/app-employees-management-structure')) {
            this.showComponentPTab = true;
            this.activeIndex = 3;
            this.getEmployeeId();
        }
        // if(this.showComponentPTab ==true){
        this.items = [{
                label: 'General Information',
                step: 1,
                index: 0,
                command: function (event) {
                    _this.activeIndex = 0;
                    _this.msgs.length = 0;
                    _this.msgs.push({ severity: 'info', summary: 'General Information', detail: event.label });
                    if (_this.employeeService.isEditMode == true) {
                        var emp = _this.acRouter.params.subscribe(function (params) { return console.log(params); });
                        _this.employeeId = _this.employeeService.employeeId;
                        _this.route.navigateByUrl("/employeesmodule/employeepages/app-employee-general-information-edit/" + _this.employeeId);
                    }
                    else {
                        _this.route.navigateByUrl('/employeesmodule/employeepages/app-employee-general-information');
                    }
                }
            },
            {
                label: 'Certification',
                step: 2,
                index: 1,
                command: function (event) {
                    _this.activeIndex = 1;
                    _this.msgs.length = 0;
                    _this.msgs.push({ severity: 'info', summary: 'Contacts', detail: event.label });
                    if (_this.employeeService.isEditMode == true) {
                        var emp = _this.acRouter.params.subscribe(function (params) { return console.log(params); });
                        _this.employeeId = _this.employeeService.employeeId;
                        _this.route.navigateByUrl("/employeesmodule/employeepages/app-employee-certification-edit/" + _this.employeeId);
                    }
                    else {
                        _this.route.navigateByUrl('/employeesmodule/employeepages/app-employee-certification');
                    }
                }
            },
            {
                label: 'Training',
                step: 3,
                index: 2,
                command: function (event) {
                    _this.activeIndex = 2;
                    _this.msgs.length = 0;
                    _this.msgs.push({ severity: 'info', summary: 'Financial Information', detail: event.label });
                    if (_this.employeeService.isEditMode == true) {
                        var emp = _this.acRouter.params.subscribe(function (params) { return console.log(params); });
                        _this.employeeId = _this.employeeService.employeeId;
                        _this.route.navigateByUrl("/employeesmodule/employeepages/app-employee-training-edit/" + _this.employeeId);
                    }
                    else {
                        _this.route.navigateByUrl('/employeesmodule/employeepages/app-employee-training');
                    }
                }
            },
            {
                label: 'Management Structure',
                step: 4,
                index: 3,
                command: function (event) {
                    _this.activeIndex = 3;
                    _this.msgs.length = 0;
                    _this.msgs.push({ severity: 'info', summary: 'Management Structure', detail: event.label });
                    if (_this.employeeService.isEditMode == true) {
                        var emp = _this.acRouter.params.subscribe(function (params) { return console.log(params); });
                        _this.employeeId = _this.employeeService.employeeId;
                        _this.route.navigateByUrl("/employeesmodule/employeepages/app-employees-management-structure-edit/" + _this.employeeId);
                    }
                    else {
                        _this.route.navigateByUrl('/employeesmodule/employeepages/app-employees-management-structure');
                    }
                }
            }
        ];
        // }
    };
    EmployeeStepsPrimeNgComponent.prototype.getEmployeeId = function () {
        var emp = this.acRouter.params.subscribe(function (params) { return console.log(params); });
        this.employeeId = this.employeeService.employeeId;
        if (this.employeeId)
            this.employeeService.isEditMode = true;
    };
    EmployeeStepsPrimeNgComponent = __decorate([
        core_1.Component({
            selector: 'app-employee-steps-prime-ng',
            templateUrl: './employee-steps-prime-ng.component.html',
            styleUrls: ['./employee-steps-prime-ng.component.scss']
        })
        /** employee-steps-primeNg component*/
    ], EmployeeStepsPrimeNgComponent);
    return EmployeeStepsPrimeNgComponent;
}());
exports.EmployeeStepsPrimeNgComponent = EmployeeStepsPrimeNgComponent;
