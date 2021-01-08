/// <reference path="../../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { TreeStructureComponent } from './tree-structure.component';

let component: TreeStructureComponent;
let fixture: ComponentFixture<TreeStructureComponent>;

describe('employees-management-structure component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ TreeStructureComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(TreeStructureComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});