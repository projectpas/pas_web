/// <reference path="../../../node_modules/@types/jasmine/index.d.ts" />
// ===============================
// info@ebenmonney.com
// www.ebenmonney.com/quickapp-pro
// ===============================

import { assert } from 'chai';

import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';

describe('AdminComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                FormsModule,
                RouterTestingModule,
            ],
            declarations: [
                
            ],
            providers: [
                
            ]
        }).compileComponents();
    }));
});
