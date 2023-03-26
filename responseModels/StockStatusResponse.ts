export interface StockStatusResponse {
    errorCode?:    string;
    errorMessage?: string;
    status?:       string;
    userMessage?:  string;
    responseBody?: StockStatusBody[];
}

export interface StockStatusBody {
    whCode?:        string;
    dealerId:      string;
    itemCode?:      string;
    currentStock?:  number;
    paymentMethod?: string;
}