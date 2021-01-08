/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { GlAccountClassComponent } from './gl-account-class.component';

let component: GlAccountClassComponent;
let fixture: ComponentFixture<GlAccountClassComponent>;

describe('GlAccountClass component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ GlAccountClassComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(GlAccountClassComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});



//<reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
//import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
//import { BrowserModule, By } from "@angular/platform-browser";
//import { Manufacturer1Component } from './manufacturer1.component';

//let component: Manufacturer1Component;
//let fixture: ComponentFixture<Manufacturer1Component>;

//describe('manufacturer1 component', () => {
//	beforeEach(async(() => {
//		TestBed.configureTestingModule({
//			declarations: [Manufacturer1Component],
//			imports: [BrowserModule],
//			providers: [
//				{ provide: ComponentFixtureAutoDetect, useValue: true }
//			]
//		});
//		fixture = TestBed.createComponent(Manufacturer1Component);
//		component = fixture.componentInstance;
//	}));

//	it('should do something', async(() => {
//		expect(true).toEqual(true);
//	}));
//});