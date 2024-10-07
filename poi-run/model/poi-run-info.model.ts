export interface POIRunInfo {
    testCase: string;
    testCaseName: string;
    buildVersion: string;
    buildDuration: number;
    comment: string;
    renderOption: string;
    PCName: string;
    hardware: string;
    etalonDuration: number;
    tolerance: number;
    branch: string;
    date: number;
    commitMessage: string;
    XMLReport: string;
}

export interface RunQueryOptions {
    testCase: string;
    environmentId: string;
    branch: string;
    resultHash: number;
    buildIdMajor: number;
    buildIdMinor: number;
}
