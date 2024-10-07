export interface ChartQueryOptions {
    testCase: string;
    testCaseName: string;
    environmentId: string;
    branch: string;
}

export interface EtalonTimings {
    etalon: number;
    tolerance: number;
}
