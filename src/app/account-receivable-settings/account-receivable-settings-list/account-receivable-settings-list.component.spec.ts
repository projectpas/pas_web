import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { ARSettingsListComponent } from './account-receivable-settings-list.component';

let component: ARSettingsListComponent;
let fixture: ComponentFixture<ARSettingsListComponent>;

describe('account-receivable-settings-list component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ARSettingsListComponent],
            imports: [BrowserModule],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(ARSettingsListComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});