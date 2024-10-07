export interface POITiming {
    version: string;
    filtered_duration: number;
    date: number;
    result_hash: number;
    build_id_major: number;
    build_id_minor: number;
    team: string;
}

export interface POIEtalon {
    test_case: string;
    environment_id: number;
    pois_duration: number;
    tolerance: number;
    filter: string;
}

export interface ChartInfoResp {
    poiTimings: POITiming[];
    etalons: POIEtalon[];
}
