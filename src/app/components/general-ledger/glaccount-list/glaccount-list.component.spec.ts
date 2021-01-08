/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { GlaccountListComponent } from './glaccount-list.component';

let component: GlaccountListComponent;
let fixture: ComponentFixture<GlaccountListComponent>;

describe('GLAccountList component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ GlaccountListComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(GlaccountListComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});