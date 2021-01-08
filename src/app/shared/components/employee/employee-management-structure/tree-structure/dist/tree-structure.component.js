"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.TreeStructureComponent = void 0;
var core_1 = require("@angular/core");
var TreeStructureComponent = /** @class */ (function () {
    function TreeStructureComponent(employeeService) {
        // console.log(this.gridData);
        this.employeeService = employeeService;
        this.isSpinnerVisible = false;
    }
    TreeStructureComponent.prototype.storeLegalEntity = function (structure, chldPrnt) {
        // debugger;
        var findIndex = -1;
        this.employeeService.legalEnityList.forEach(function (legEntity, index) {
            if (legEntity.managementStructureId == structure.data.managementStructureId) {
                findIndex = index;
            }
        });
        if (findIndex != -1) {
            this.employeeService.legalEnityList.splice(findIndex, 1);
            document.getElementById("" + structure.data.managementStructureId)['checked'] = false;
            var children;
            if (structure.children) {
                children = structure.children;
                for (var i = 0; i < children.length; i++) {
                    this.removeMS(children[i].data.managementStructureId);
                    if (children[i].children) {
                        this.removeChildrenMS(children[i].children);
                    }
                }
            }
        }
        else {
            document.getElementById("" + structure.data.managementStructureId)['checked'] = true;
            this.employeeService.legalEnityList.push({
                managementStructureId: structure.data.managementStructureId,
                isActive: structure.data.isActive,
                checked: true,
                chldParent: structure.data.name,
                isDeleted: structure.data.isDeleted
            });
            if (structure.children) {
                var children = structure.children;
                for (var i = 0; i < children.length; i++) {
                    this.addMS(children[i].data.managementStructureId);
                    if (children[i].children) {
                        this.addChildrenMS(children[i].children);
                    }
                }
            }
        }
    };
    TreeStructureComponent.prototype.addMS = function (msId) {
        var i = -1;
        this.employeeService.legalEnityList.forEach(function (legEntity, index) {
            if (legEntity.managementStructureId == msId) {
                i = index;
            }
        });
        if (i == -1) {
            document.getElementById("" + msId)['checked'] = true;
            this.employeeService.legalEnityList.push({
                managementStructureId: msId,
                isActive: true,
                checked: true,
                chldParent: 'test',
                isDeleted: false
            });
        }
    };
    TreeStructureComponent.prototype.addChildrenMS = function (children) {
        for (var i = 0; i < children.length; i++) {
            this.addMS(children[i].data.managementStructureId);
            if (children[i].children) {
                this.addChildrenMS(children[i].children);
            }
        }
    };
    TreeStructureComponent.prototype.removeMS = function (msId) {
        var i = -1;
        this.employeeService.legalEnityList.forEach(function (legEntity, index) {
            if (legEntity.managementStructureId == msId) {
                i = index;
            }
        });
        if (i != -1) {
            this.employeeService.legalEnityList.splice(i, 1);
            document.getElementById("" + msId)['checked'] = false;
        }
    };
    TreeStructureComponent.prototype.removeChildrenMS = function (children) {
        for (var i = 0; i < children.length; i++) {
            this.removeMS(children[i].data.managementStructureId);
            if (children[i].children) {
                this.removeChildrenMS(children[i].children);
            }
        }
    };
    TreeStructureComponent.prototype.ngOnInit = function () {
        this.structureInit();
    };
    TreeStructureComponent.prototype.structureInit = function () {
        var toggler = document.getElementsByClassName("caret");
        var i;
        for (i = 0; i < toggler.length; i++) {
            toggler[i].addEventListener("click", function () {
                this.parentElement.querySelector(".nested").classList.toggle("active");
                this.classList.toggle("caret-down");
            });
        }
    };
    TreeStructureComponent.prototype.checkLegalEntityExist = function (id) {
        this.employeeService.legalEnityList.forEach(function (le) {
            if (document.getElementById("" + le.managementStructureId) != null) {
                document.getElementById("" + le.managementStructureId)['checked'] = true;
                // console.log(this.employeeService.legalEnityList,'data1');
            }
        });
        this.employeeService.legalEnityList.forEach(function (legEntity, index) {
            if (id == legEntity.managementStructureId) {
                return true;
            }
        });
        return false;
    };
    __decorate([
        core_1.Input()
    ], TreeStructureComponent.prototype, "gridData");
    TreeStructureComponent = __decorate([
        core_1.Component({
            selector: 'app-tree-structure',
            templateUrl: './tree-structure.component.html',
            styleUrls: ['./tree-structure.component.scss']
        })
        /** employees-list component*/
    ], TreeStructureComponent);
    return TreeStructureComponent;
}());
exports.TreeStructureComponent = TreeStructureComponent;
