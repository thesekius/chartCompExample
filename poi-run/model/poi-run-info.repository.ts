import { Injectable } from '@angular/core';
import { ChartQueryOptions, EtalonTimings } from '../../model/poi-chart.model';
import { POIChartRepository } from '../../model/poi-chart.repository';
import { POITiming } from '../../model/poi-responses.model';
import { POIRunInfo, RunQueryOptions } from './poi-run-info.model';
import { POIRunInfoService } from './poi-run-info.service';
import { RunInfoResp } from './poi-run-resps.model';

@Injectable()
export class POIRunInfoRepository {
    private _POIRunInfo: POIRunInfo | null = null;
    private _runQueryOptions: RunQueryOptions | null = null;

    constructor(
        private _POIRunInfoService: POIRunInfoService,
        private _POIChartRepository: POIChartRepository,
    ) {}

    public fetchPOIRunInfo(pointInfo: POITiming) {
        if (this.chartQueryOptions === null) return;
        this.makeRunQueryOptions(pointInfo);
        if (this.runQueryOptions === null) return;
        this._POIRunInfoService
            .fetchAllPOIRunData(this.runQueryOptions)
            .subscribe({
                next: (resp) => {
                    if (resp) {
                        this.fillPOIRunInfo(
                            resp,
                            pointInfo,
                            this.chartQueryOptions,
                            this.etalonTimings,
                        );
                    }
                },
                // TODO: добавить обработку ошибок
            });
    }

    private makeRunQueryOptions(pointInfo: POITiming): void {
        this._runQueryOptions = {
            testCase: this.chartQueryOptions?.testCase ?? '',
            environmentId: this.chartQueryOptions?.environmentId ?? '',
            branch: pointInfo.team ?? '',
            resultHash: pointInfo.result_hash,
            buildIdMajor: pointInfo.build_id_major,
            buildIdMinor: pointInfo.build_id_minor,
        };
    }

    get runQueryOptions(): RunQueryOptions | null {
        return this._runQueryOptions;
    }

    get chartQueryOptions(): ChartQueryOptions | null {
        return this._POIChartRepository.chartQueryOptions;
    }

    get POITimings(): POITiming[] {
        return this._POIChartRepository.POITimingsArray;
    }

    get etalonTimings(): EtalonTimings | null {
        return this._POIChartRepository.etalonTimings;
    }

    get POIRunInfo(): POIRunInfo | null {
        return this._POIRunInfo;
    }

    private fillPOIRunInfo(
        runInfoResp: RunInfoResp,
        pointInfo: POITiming,
        chartQueryOptions: ChartQueryOptions | null,
        etalonTimings: EtalonTimings | null,
    ) {
        this._POIRunInfo = {
            testCase: chartQueryOptions?.testCase ?? '',
            testCaseName: chartQueryOptions?.testCaseName ?? '',
            buildVersion: pointInfo.version ?? 0,
            buildDuration: pointInfo.filtered_duration ?? 0,

            comment:
                runInfoResp.testComments.length > 0
                    ? (runInfoResp.testComments[0]?.comment ?? '')
                    : '',

            renderOption:
                runInfoResp.renderOptions.length > 0
                    ? (runInfoResp.renderOptions[0]?.options ?? '')
                    : '',

            PCName:
                runInfoResp.testPCs?.length > 0
                    ? (runInfoResp.testPCs[0]?.name ?? '')
                    : '',

            hardware:
                runInfoResp.testPCs.length > 0
                    ? (runInfoResp.testPCs[0]?.hardware ?? '')
                    : '',

            etalonDuration: etalonTimings?.etalon ?? 0,
            tolerance: etalonTimings?.tolerance ?? 0,
            branch: chartQueryOptions?.branch ?? '',
            date: pointInfo.date ?? 0,

            commitMessage:
                runInfoResp.commitMessages?.length > 0
                    ? (runInfoResp.commitMessages[0]?.commits ?? '')
                    : '',

            XMLReport:
                runInfoResp.XMLReports?.length > 0
                    ? (runInfoResp.XMLReports[0]?.result_xml ?? '')
                    : '',
        };
    }
}
