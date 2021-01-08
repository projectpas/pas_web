import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { LegalEntityGeneralInformationComponent } from './legal-entity-general-information.component';

let component: LegalEntityGeneralInformationComponent;
let fixture: ComponentFixture<LegalEntityGeneralInformationComponent>;

describe('VendorGeneralInformation component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LegalEntityGeneralInformationComponent ],
            imports: [ BrowserModule ],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(LegalEntityGeneralInformationComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});