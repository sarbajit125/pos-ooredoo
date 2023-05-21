import * as DocumentPicker from "expo-document-picker";
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
  lineItems?: InventoryLineItem[];
  targetChannelId: number;
  transferTypeId: number;
}
export interface InventoryLineItem {
  lineNo: number;
  startSerial?: string;
  unitTypeId: number;
  inventoryTypeId: number;
  inventoryTypeDescription: string;
  requestedQuantity: number;
  poNo?: string;
  serialType?: string;
  endSerial?: string;
}

export interface InventoryOrderResponse {
  orderId: number
}

export interface InventoryOrderListResponse {
  orderId: number;
  orderDate: string;
  transferTypeId: number;
  sourceChannelId: number;
  targetChannelId: number;
  initiatedBy: string;
  orderStatusId: number;
  orderMode: string;
  nextStatus: number;
  nextActionBy: string;
  nextAction: string;
  workflow: string;
  isSimulationFlow: boolean;
  ifApp: boolean;
}

export interface  UploadMemoResponse {
  status: string
}

export interface UploadMemoReq {
  selectedDoc: DocumentPicker.DocumentResult,
  orderId: number
}