/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { SupervisorComponent } from './supervisor.component';

let component: SupervisorComponent;
let fixture: ComponentFixture<SupervisorComponent>;

describe('Supervisor component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ SupervisorComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(SupervisorComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});