/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { WorkScopeComponent } from './work-scope.component';

let component: WorkScopeComponent;
let fixture: ComponentFixture<WorkScopeComponent>;

describe('WorkScope component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ WorkScopeComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(WorkScopeComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});