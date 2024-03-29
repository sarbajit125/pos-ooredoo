export interface HistoryListResponse {
    orderId:               string;
    posOrderId:            string;
    orderDate:             Date;
    orderStatus:           number;
    totalAmount:           number;
    taxAmount:             number;
    discountAmount:        number;
    vatAmount?:            number;
    exciseAmount?:         number;
    customerId?:           string;
    customerName?:         string;
    customerContactNumber: string;
    posUserId:             string;
    retailerId:            number;
    distributorId:         number;
    closedBy:              string;
    closedDate:            Date;
    status?:               string;
    receiptNumber:         string;
    orderType:             string;
    ifApp:                 boolean;
    ratePlan?:             string;
    ratePlanDeposit?:      string;
    ratePlanAdvance?:      string;
    connectionType?:       string;
    provisioningMsisdn?:   string;
    orderSubType?:         string;
    referenceOrderId?:     string;
    mfaisaWallet?:         string;
    cafPath?:              string;
    initiatedBy?:          string;
    inState?:              string;
    customerEmail?:        string;
}

export interface dropdownsOrderedByIdResp {
    id: number;
    fieldId: string;
    value: string;
    text: string;
}