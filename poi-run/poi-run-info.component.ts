import { Component, Input, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import { convertFileTime } from 'src/app/common/model/common-features';
import { POITiming } from '../model/poi-responses.model';
import { POIRunInfo } from './model/poi-run-info.model';
import { POIRunInfoRepository } from './model/poi-run-info.repository';
@Component({
    selector: 'app-poi-run-info',
    templateUrl: './poi-run-info.component.html',
    styleUrls: ['./poi-run-info.component.scss'],
})
export class POIRunInfoComponent implements OnInit {
    @Input({ required: true }) pointInfo!: POITiming;

    constructor(private _POIRunInfoRepo: POIRunInfoRepository) {}

    get POIRunInfo(): POIRunInfo | null {
        return this._POIRunInfoRepo.POIRunInfo;
    }

    ngOnInit(): void {
        this._POIRunInfoRepo.fetchPOIRunInfo(this.pointInfo);
    }

    public downloadReport() {
        if (
            this.POIRunInfo?.XMLReport &&
            this.POIRunInfo.XMLReport.length > 0
        ) {
            const blob = new Blob([this.POIRunInfo.XMLReport], {
                type: 'application/xml',
            });
            saveAs(blob, 'report.xml');
        }
    }

    public convertDate(date: number): string {
        return convertFileTime(date);
    }
}
