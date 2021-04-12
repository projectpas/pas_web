import { TestBed, async, ComponentFixture, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { BrowserModule, By } from "@angular/platform-browser";
import { CreateARSettingsComponent } from './create-account-receivable-settings.component';

let component: CreateARSettingsComponent;
let fixture: ComponentFixture<CreateARSettingsComponent>;

describe('create-account-receivable-settings component', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CreateARSettingsComponent],
            imports: [BrowserModule],
            providers: [
                { provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        });
        fixture = TestBed.createComponent(CreateARSettingsComponent);
        component = fixture.componentInstance;
    }));

    it('should do something', async(() => {
        expect(true).toEqual(true);
    }));
});