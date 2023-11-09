
export class ReportGenericResultDto {
    reportName: string;
    xslxFile: any;
}

export class ReportResultDto extends ReportGenericResultDto {
    completedCount?: number;
    failedCount?: number;
}

export class ReportPagamentosVencidosResultDto extends ReportGenericResultDto {
    vencendoEm7Dias?: number;
    vencendoEm3Dias?: number;
    vencendoEm1Dias?: number;
    vencidos?: number;
}