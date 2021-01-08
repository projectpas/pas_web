/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { JobTitleComponent } from './job-title.component';

let component: JobTitleComponent;
let fixture: ComponentFixture<JobTitleComponent>;

describe('JobTitle component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ JobTitleComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(JobTitleComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});