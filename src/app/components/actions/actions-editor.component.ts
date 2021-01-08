
import { Component, Input, ViewChild,OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';

import {Subject} from 'rxjs';
import { fadeInOut } from '../../services/animations';

import { AlertService, MessageSeverity } from '../../services/alert.service';
import { AccountService } from "../../services/account.service";
import { Role } from '../../models/role.model';
import { Permission } from '../../models/permission.model';
import { Action } from '../../models/action.model';

@Component({
    selector: 'actions-editor',
    animations: [fadeInOut],
    templateUrl: './actions-editor.component.html'
})

export class ActionsEditorComponent implements OnInit {
    employeeForm: FormGroup;
    title: string = "Create";
    id: number;
    errorMessage: any;

    constructor(private _fb: FormBuilder) {
        
        this.employeeForm = this._fb.group({
            id: 0,
            name: ['', [Validators.required]],
            gender: ['', [Validators.required]],
            department: ['', [Validators.required]],
            city: ['', [Validators.required]]
        })
    }

    ngOnInit() {
        if (this.id > 0) {
           
        }
    }

    save() {

        alert('sucess');
        if (!this.employeeForm.valid) {
            return;
        }

      
    }
    
    get name() { return this.employeeForm.get('name'); }
    get gender() { return this.employeeForm.get('gender'); }
    get department() { return this.employeeForm.get('department'); }
    get city() { return this.employeeForm.get('city'); }
}