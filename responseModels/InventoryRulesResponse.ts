export interface InventoryRulesResponse {
  value: string;
  text: string;
}

export interface InventoryProductResponse {
  inventoryTypeid: number;
  inventoryTypeDescription: string;
  sequencial: string;
  erpInventoryId: string;
  currentStock: number;
}

export interface AvailableSerialsResponse {
  inventoryTypeId: number;
  inventorySerialNo: string;
  statusId: number;
}
export interface AvailableSerialsRequest {
    invCategory:   string;
    inventoryType: string;
    poDateFrom:    string;
    poDateTo:      string;
}
