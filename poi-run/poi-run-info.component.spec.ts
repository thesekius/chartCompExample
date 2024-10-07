import { HttpClient, HttpHandler } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import FileSaver from 'file-saver';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { POIChartRepository } from '../model/poi-chart.repository';
import { POIChartService } from '../model/poi-chart.service';
import { POIQuery } from '../model/poi-query';
import { POITiming } from '../model/poi-responses.model';
import { POIRunInfo } from './model/poi-run-info.model';
import { POIRunInfoRepository } from './model/poi-run-info.repository';
import { POIRunInfoService } from './model/poi-run-info.service';
import { POIRunInfoComponent } from './poi-run-info.component';

const mockPOITiming: POITiming = {
    version: '20.0.2398',
    filtered_duration: 0.321151,
    date: 132452309097404450,
    result_hash: 169841558,
    build_id_major: 20,
    build_id_minor: 2398,
    team: 'master',
};

const mockPOIRunInfo = {
    XMLReport: '<xml>...</xml>',
    testCase: 'Case here',
    testCaseName: 'Отрисовка компонента',
    buildVersion: '20.0.2398',
    buildDuration: 0.321151,
    comment: 'Comment here',
    renderOption: 'Render option here',
    PCName: 'PCName here',
    hardware: 'Hardware here',
    etalonDuration: 0.322711,
    tolerance: 0.377289,
    branch: 'master',
    date: 132452309097404450,
    commitMessage: 'Commit message here',
};

class MockPOIRunInfoRepository {
    _POIRunInfo: POIRunInfo | null = null;
    fetchPOIRunInfo(pointInfo: POITiming) {
        this._POIRunInfo = mockPOIRunInfo;
    }

    get POIRunInfo(): POIRunInfo | null {
        return this._POIRunInfo;
    }
}

describe('POIRunInfoComponent', () => {
    let component: POIRunInfoComponent;
    let fixture: ComponentFixture<POIRunInfoComponent>;
    let mockRepository: MockPOIRunInfoRepository;

    beforeEach(() => {
        mockRepository = new MockPOIRunInfoRepository();

        TestBed.configureTestingModule({
            declarations: [POIRunInfoComponent],
            providers: [
                { provide: POIRunInfoRepository, useValue: mockRepository },
                POIChartRepository,
                POIRunInfoService,
                POIChartService,
                POIQuery,
                provideHttpClientTesting(),
                HttpClient,
                HttpHandler,
            ],
            imports: [FieldsetModule, ButtonModule, BrowserAnimationsModule],
        }).compileComponents();

        fixture = TestBed.createComponent(POIRunInfoComponent);
        component = fixture.componentInstance;
        component.pointInfo = mockPOITiming;
        fixture.detectChanges();
    });

    it('should create a component', () => {
        expect(component).toBeTruthy();
    });

    it('should display POIRunInfo data', () => {
        const buildDurationElement = fixture.debugElement.query(
            By.css('.row:nth-child(1) .col'),
        );
        const etalonDurationElement = fixture.debugElement.query(
            By.css('.row:nth-child(2) .col'),
        );

        expect(buildDurationElement.nativeElement.textContent).toContain(
            mockPOIRunInfo.buildDuration,
        );
        expect(etalonDurationElement.nativeElement.textContent).toContain(
            mockPOIRunInfo.etalonDuration,
        );
    });

    it('should call downloadReport method when button is clicked', () => {
        component.ngOnInit();
        fixture.detectChanges();

        spyOn(component, 'downloadReport').and.callThrough();
        const button = fixture.debugElement.query(
            By.css('p-button'),
        ).nativeElement;
        button.click();

        expect(component.downloadReport).toHaveBeenCalled();
    });

    it('should download report when downloadReport method is called', () => {
        spyOn(FileSaver, 'saveAs');
        component.downloadReport();

        expect(FileSaver.saveAs).toHaveBeenCalledWith(
            jasmine.any(Blob),
            'report.xml',
        );
    });
});
