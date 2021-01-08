import { Component, Input, OnInit } from '@angular/core';
import { EmployeeService } from '../../../../../services/employee.service';
import { EmployeesManagementStructureComponent } from '../employees-management-structure.component';


@Component({
    selector: 'app-tree-structure',
    templateUrl: './tree-structure.component.html',
    styleUrls: ['./tree-structure.component.scss']
})
/** employees-list component*/
export class TreeStructureComponent implements OnInit{
    @Input() gridData:any[];
    isSpinnerVisible: boolean = false;
    constructor(public employeeService: EmployeeService){
        // console.log(this.gridData);
        
    }
    storeLegalEntity(structure, chldPrnt) {
        this.employeeService.enableUpdateButton = true;
        // debugger;
        var findIndex = -1;
        this.employeeService.legalEnityList.forEach((legEntity, index)=>{
            if(legEntity.managementStructureId == structure.data.managementStructureId){
                findIndex = index;
            }
        })
        if(findIndex != -1){
            this.employeeService.legalEnityList.splice(findIndex, 1);
            document.getElementById(`${structure.data.managementStructureId}`)['checked'] = false;
            var children;           
            if (structure.children) {                
                children = structure.children;
                for (let i = 0; i < children.length; i++) {
                    this.removeMS(children[i].data.managementStructureId);
                    if (children[i].children) {
                        this.removeChildrenMS(children[i].children);
                    }
                }
            }
          
        }
        else {
            document.getElementById(`${structure.data.managementStructureId}`)['checked'] = true;
            this.employeeService.legalEnityList.push({
                managementStructureId: structure.data.managementStructureId,
                isActive: structure.data.isActive,
                checked: true,
                chldParent: structure.data.name,
                isDeleted: structure.data.isDeleted
            });          
            if (structure.children) {
                    var children = structure.children;
                    for (let i = 0; i < children.length; i++)
                    {
                        this.addMS(children[i].data.managementStructureId);
                        if (children[i].children)
                        {
                            this.addChildrenMS(children[i].children);
                        }
                    }
                }        
        }

            
    }
    addMS(msId) {
        var i = -1;
        this.employeeService.legalEnityList.forEach((legEntity, index) => {
            if (legEntity.managementStructureId == msId) {
                i = index;
            }
        });
        if (i == -1) {
            document.getElementById(`${msId}`)['checked'] = true;
            this.employeeService.legalEnityList.push({
                managementStructureId: msId,
                isActive: true,
                checked: true,
                chldParent: 'test',
                isDeleted: false
            });
        }
    }
    addChildrenMS(children) {
        for (let i = 0; i < children.length; i++) {
            this.addMS(children[i].data.managementStructureId);
            if (children[i].children) {
                this.addChildrenMS(children[i].children);
            }
        }
    }
    removeMS(msId) {
        var i = -1;
        this.employeeService.legalEnityList.forEach((legEntity, index) => {
            if (legEntity.managementStructureId == msId) {
                i = index;
            }
        });
        if (i != -1) {
            this.employeeService.legalEnityList.splice(i, 1);
            document.getElementById(`${msId}`)['checked'] = false;
        }
    }
    removeChildrenMS(children) {
        for (let i = 0; i < children.length; i++) {
            this.removeMS(children[i].data.managementStructureId);
            if (children[i].children) {
                this.removeChildrenMS(children[i].children);
            }
        }
    }

    ngOnInit(){
        this.structureInit();
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

    checkLegalEntityExist(id){
        this.employeeService.legalEnityList.forEach((le)=>{
            if(document.getElementById(`${le.managementStructureId}`) != null){
                document.getElementById(`${le.managementStructureId}`)['checked'] = true;
                // console.log(this.employeeService.legalEnityList,'data1');
            }
        })
        this.employeeService.legalEnityList.forEach((legEntity, index)=>{
            if(id == legEntity.managementStructureId){
                return true;
            }
        })
        return false;
    }
}