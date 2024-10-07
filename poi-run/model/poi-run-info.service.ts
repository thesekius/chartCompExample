import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { TestResultResources } from 'src/app/common/model/resources/testresult-resources';
import { environment } from 'src/environments/environment';
import { RunQueryOptions } from './poi-run-info.model';
import {
    CommitMessage,
    RenderOptions,
    RunInfoResp,
    TestComment,
    TestPC,
    XMLReport,
} from './poi-run-resps.model';

@Injectable()
export class POIRunInfoService {
    private url: string = environment.urlTestResultApi;

    constructor(private http: HttpClient) {}

    public getTestComment(testCase: string): Observable<TestComment[]> {
        let url = '';

        return this.http.get<TestComment[]>(url);
    }

    public getRenderOptions(
        environmentId: string,
    ): Observable<RenderOptions[]> {
        let url = '';

        return this.http.get<RenderOptions[]>(url);
    }

    public getTestPC(environmentId: string): Observable<TestPC[]> {
        let url = '';

        return this.http.get<TestPC[]>(url);
    }

    public getCommitMessage(
        team: string,
        buildIdMajor: number,
        buildIdMinor: number,
    ): Observable<CommitMessage[]> {
        let url = '';

        return this.http.get<CommitMessage[]>(url);
    }

    public getXMLReport(resultHash: number): Observable<XMLReport[]> {
        let url = '';

        return this.http.get<XMLReport[]>(url);
    }

    public fetchAllPOIRunData(
        options: RunQueryOptions,
    ): Observable<RunInfoResp> {
        return forkJoin({
            testComments: this.getTestComment(options.testCase),
            renderOptions: this.getRenderOptions(options.environmentId),
            testPCs: this.getTestPC(options.environmentId),
            commitMessages: this.getCommitMessage(
                options.branch,
                options.buildIdMajor,
                options.buildIdMinor,
            ),
            XMLReports: this.getXMLReport(options.resultHash),
        });
    }
}
