/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { JobTypeComponent } from './job-type.component';

let component: JobTypeComponent;
let fixture: ComponentFixture<JobTypeComponent>;

describe('JobType component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [JobTypeComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(JobTypeComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});