export interface TestComment {
    test_case: string;
    comment: string;
}

export interface RenderOptions {
    id: number;
    options: string;
    environment_id: number;
}

export interface TestPC {
    environment_id: number;
    hardware: string;
    name: string;
}

export interface CommitMessage {
    team: string;
    build_id_major: number;
    build_id_minor: number;
    commits: string;
}

export interface XMLReport {
    result_hash: number;
    result_xml: string;
}

export interface RunInfoResp {
    testComments: TestComment[];
    renderOptions: RenderOptions[];
    testPCs: TestPC[];
    commitMessages: CommitMessage[];
    XMLReports: XMLReport[];
}
