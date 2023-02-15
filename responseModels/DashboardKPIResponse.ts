export interface DashboardKPI {
    responseBody: DashboardKPIRespArr[][]
}

export interface DashboardKPIRespArr {
    kpi: string,
    kpiType?:string,
    addDate: string,
    posCode: string,
    ftd: string,
    mtd: string,
    lmtd: string,
    lm: string,
    target: string
}