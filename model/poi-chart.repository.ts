import { Injectable } from '@angular/core';
import { EChartsOption } from 'echarts';
import { convertFileTime } from 'src/app/common/model/common-features';
import { ChartQueryOptions, EtalonTimings } from './poi-chart.model';
import { POIChartService } from './poi-chart.service';
import { ChartInfoResp, POITiming } from './poi-responses.model';

@Injectable()
export class POIChartRepository {
    private _POITimingsArray: POITiming[] = [];
    private _etalonTimings: EtalonTimings | null = null;
    private _chartOption: EChartsOption = {};
    private _chartQueryOptions: ChartQueryOptions | null = null;

    constructor(private _POIChartService: POIChartService) {}

    public fetchPOIChartInfo(options: ChartQueryOptions) {
        this._chartQueryOptions = options;
        this._POIChartService.fetchAllPOIData(options).subscribe({
            next: (data) => {
                if (data) {
                    this.fillPOIChartInfo(data);
                    this._chartOption = this.buildChartOption(
                        this.POITimingsArray,
                        this.etalonTimings,
                        options,
                    );
                }
            },
            // TODO: добавить обработку ошибок
        });
    }

    get POITimingsArray(): POITiming[] {
        return this._POITimingsArray;
    }

    get etalonTimings(): EtalonTimings | null {
        return this._etalonTimings;
    }

    get chartOption(): EChartsOption {
        return this._chartOption;
    }

    get chartQueryOptions(): ChartQueryOptions | null {
        return this._chartQueryOptions;
    }

    private buildChartOption(
        POITimingsArray: POITiming[],
        etalonTimings: EtalonTimings | null,
        options: ChartQueryOptions,
    ): EChartsOption {
        const etalon: number = etalonTimings?.etalon ?? 0;
        const tolerance: number = etalonTimings?.tolerance ?? 0;
        return {
            dataset: {
                dimensions: [
                    'id',
                    'version',
                    'filtered_duration',
                    'date',
                    'result_hash',
                    'build_id_major',
                    'build_id_minor',
                    'team',
                ],
                source: POITimingsArray.map((item, index) => [
                    index,
                    item.version,
                    item.filtered_duration,
                    item.date,
                    item.result_hash,
                    item.build_id_major,
                    item.build_id_minor,
                    item.team,
                ]),
            },
            xAxis: {
                type: 'category',
                name: 'Build',
                data: POITimingsArray.map(
                    (item) => `${item.version}  ${convertFileTime(item.date)}`,
                ), // для прогонов на одном билде
            },
            yAxis: {
                type: 'value',
                name: 'Time(s)',
            },
            tooltip: {
                trigger: 'item',
            },
            toolbox: {
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none',
                    },
                    restore: {},
                    saveAsImage: {},
                },
            },
            legend: {
                data: [`${options.testCase} ${options.testCaseName}`],
            },
            dataZoom: [
                {
                    type: 'inside',
                    start: this.calcLastRuns(POITimingsArray.length),
                    end: 100,
                },
                {
                    start: this.calcLastRuns(POITimingsArray.length),
                    end: 100,
                },
            ],
            series: [
                {
                    name: `${options.testCase} ${options.testCaseName}`,
                    type: 'line',
                    encode: {
                        x: 'id', // id прогона тестов
                        y: 'filtered_duration', // результат прогона
                    },
                    markLine: {
                        symbol: ['none', 'none'],
                        label: { show: true },
                        silent: true,
                        data: [
                            {
                                name: 'Avg',
                                type: 'average',
                                label: {
                                    formatter: '{b}: {c}',
                                    position: 'start',
                                },
                            },
                        ],
                    },
                },
                {
                    data: [],
                    name: 'Etalon',
                    type: 'line',
                    markLine: {
                        symbol: ['none', 'none'],
                        label: { show: true },
                        silent: true,
                        lineStyle: { color: '#25D500' },
                        data: [
                            {
                                name: 'Etalon',
                                yAxis: etalon,
                                label: { formatter: '{b}' },
                            },
                        ],
                    },
                },
                {
                    data: [],
                    name: 'Tolerance',
                    type: 'line',
                    markLine: {
                        symbol: ['none', 'none'],
                        silent: true,
                        lineStyle: { color: '#FFB600' },
                        data: [
                            {
                                name: '',
                                yAxis: etalon + tolerance,
                                label: { formatter: '{b}' },
                            },
                            {
                                name: '',
                                yAxis: etalon - tolerance,
                                label: { formatter: '{b}' },
                            },
                        ],
                    },
                },
            ],
        };
    }

    private fillPOIChartInfo(data: ChartInfoResp): void {
        this._POITimingsArray = data.poiTimings;
        this._etalonTimings =
            data.etalons.length > 0
                ? {
                      etalon: data.etalons?.[0]?.pois_duration ?? 0,
                      tolerance: data.etalons?.[0]?.tolerance ?? 0,
                  }
                : {
                      etalon: 0,
                      tolerance: 0,
                  };
    }
}
