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
    posUserId:             ClosedBy;
    retailerId:            number;
    distributorId:         number;
    closedBy:              ClosedBy;
    closedDate:            Date;
    status?:               Status;
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
    initiatedBy?:          ClosedBy;
    inState?:              string;
    customerEmail?:        string;
}

export enum ClosedBy {
    ClosedByKhadheejaNajiya = "Khadheeja.najiya",
    KhadheejaNajiya = "khadheeja.najiya",
    Khadheejanajiya = "khadheejanajiya",
}

export enum Status {
    Closed = "Closed",
}
