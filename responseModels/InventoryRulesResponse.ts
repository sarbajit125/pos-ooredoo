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

export interface InventoryOrderReq {
  orderMode: string;
  sourceChannelId: number;
  lineItems: InventoryLineItem[];
  targetChannelId: number;
  transferTypeId: number;
}
export interface InventoryLineItem {
  lineNo: number;
  startSerial: string;
  unitTypeId: number;
  inventoryTypeId: number;
  inventoryTypeDescription: string;
  requestedQuantity: number;
  poNo: string;
  serialType: string;
  endSerial: string;
}

export interface InventoryOrderResponse {
  orderId: number
}