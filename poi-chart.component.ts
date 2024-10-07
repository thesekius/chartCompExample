import {
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ECElementEvent, EChartsOption } from 'echarts';
import { Subscription } from 'rxjs';
import { POIChartRepository } from './model/poi-chart.repository';
import { POIRunInfoComponent } from './poi-run/poi-run-info.component';

@Component({
    selector: 'app-poi-chart',
    templateUrl: './poi-chart.component.html',
    styleUrls: ['./poi-chart.component.scss'],
})
export class POIChartComponent implements OnInit, OnDestroy {
    private _subscriptions: Subscription[] = [];

    @ViewChild('runInfoContainer', { read: ViewContainerRef })
    runInfoContainer: ViewContainerRef | null = null;

    constructor(
        private _POIChartRepo: POIChartRepository,
        private _activeRoute: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        this._subscriptions.push(
            this._activeRoute.queryParamMap.subscribe((params) => {
                this._POIChartRepo.fetchPOIChartInfo({
                    testCase: params.get('testCase') ?? '',
                    testCaseName: params.get('testCaseName') ?? '',
                    environmentId: params.get('environmentId') ?? '',
                    branch: params.get('branch') ?? '',
                });
            }),
        );
    }

    ngOnDestroy(): void {
        this._subscriptions.forEach((sub) => sub.unsubscribe);
        this._subscriptions = [];
    }

    get chartOption(): EChartsOption {
        return this._POIChartRepo.chartOption;
    }

    handleChartEvent(event: ECElementEvent) {
        // если в пришедшем ивенте нет данных точки, return
        if (
            !event.data ||
            !Array.isArray(event.data) ||
            event.data?.length < 8 ||
            !this.runInfoContainer
        )
            return;

        // очищаем контейнер с инфой о точке
        this.runInfoContainer.clear();

        // создаем компонент с инфой о точке
        this.runInfoContainer
            .createComponent(POIRunInfoComponent)
            .setInput('pointInfo', {
                version: event.data[1],
                filtered_duration: event.data[2],
                date: event.data[3],
                result_hash: event.data[4],
                build_id_major: event.data[5],
                build_id_minor: event.data[6],
                team: event.data[7],
            });
    }
}
