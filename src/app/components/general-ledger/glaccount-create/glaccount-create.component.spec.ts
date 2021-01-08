/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { GlaccountCreateComponent } from './glaccount-create.component';

let component: GlaccountCreateComponent;
let fixture: ComponentFixture<GlaccountCreateComponent>;

describe('GLAccountCreate component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ GlaccountCreateComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(GlaccountCreateComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});