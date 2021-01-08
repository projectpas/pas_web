
import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { ReceivingpagesComponent } from './receivingpages.component';

let component: ReceivingpagesComponent;
let fixture: ComponentFixture<ReceivingpagesComponent>;

describe('receivingpages component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ReceivingpagesComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(ReceivingpagesComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});