import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxEchartsModule } from 'ngx-echarts';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { POIChartRepository } from './model/poi-chart.repository';
import { POIChartService } from './model/poi-chart.service';
import { POIQuery } from './model/poi-query';
import { POIChartComponent } from './poi-chart.component';
import { POIRunInfoRepository } from './poi-run/model/poi-run-info.repository';
import { POIRunInfoService } from './poi-run/model/poi-run-info.service';
import { POIRunInfoComponent } from './poi-run/poi-run-info.component';

const routes: Routes = [
    {
        path: '',
        component: POIChartComponent,
    },
];

@NgModule({
    providers: [
        POIChartRepository,
        POIChartService,
        POIQuery,
        POIRunInfoRepository,
        POIRunInfoService,
    ],
    declarations: [POIChartComponent, POIRunInfoComponent],
    imports: [
        CommonModule,
        NgxEchartsModule.forRoot({
            echarts: () => import('echarts'),
        }),
        RouterModule.forChild(routes),
        FieldsetModule,
        ButtonModule,
    ],
    exports: [POIChartComponent],
})
export class ChartModule {}
