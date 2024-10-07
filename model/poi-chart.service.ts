import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { POIEtalon, POITiming, ChartInfoResp } from './poi-responses.model';
import { TestResultResources } from 'src/app/common/model/resources/testresult-resources';
import { ChartQueryOptions } from './poi-chart.model';
import { POIQuery } from './poi-query';

@Injectable()
export class POIChartService {
    private _url: string = environment.urlTestResultApi;

    constructor(private _http: HttpClient, private _poiQuery: POIQuery) {}

    public getPOITimings(options: ChartQueryOptions): Observable<POITiming[]> {
        const url = `${this._url}/${this._poiQuery.makeQueryString(options)}`;

        return this._http.get<POITiming[]>(url);
    }

    public getEtalon(options: ChartQueryOptions): Observable<POIEtalon[]> {
        let url = '';

        return this._http.get<POIEtalon[]>(url);
    }

    public fetchAllPOIData(
        options: ChartQueryOptions,
    ): Observable<ChartInfoResp> {
        return forkJoin({
            poiTimings: this.getPOITimings(options),
            etalons: this.getEtalon(options),
        });
    }
}
