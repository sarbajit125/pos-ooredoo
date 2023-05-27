interface OrderDetailLineItem {
  id: number;
  transferredQuantity: number;
  requestedQuantity: number;
  acceptedQuantity: number;
  orderId: number;
  lineNo: number;
  inventoryTypeId: number;
  unitTypeId: number;
  startSerial?: string;
  endSerial?: string;
}

interface OrderHistory {
  id: number;
  orderId: number;
  actionBy: string;
  actionDate: string;
  actionValue: string;
  remarks?: string;
}

export interface InventoryOrderDetailsResponse {
  orderId: number;
  orderDate: string;
  transferTypeId: number;
  sourceChannelId: number;
  targetChannelId: number;
  sourceChannelName: string;
  targetChannelName: string;
  initiatedBy: string;
  lastUpdatedBy: string;
  orderStatusId: number;
  orderMode: string;
  lastUpdatedByName: string;
  lineItems: OrderDetailLineItem[];
  orderHistory: OrderHistory[];
  grns?: Grn[];
  nextStatus: number;
  nextActionBy: string;
  workflow: string;
  uploadFilePath: string;
  nextAction?: string;
}

interface Grn {
  grnDetailList: GrnDetail[];
}
interface GrnDetail {
  grnId: string;
  allocatedQuantity: number;
  startSeries: string;
  endSeries: string;
  inventoryCount: number;
  status: string;
  remarksVal: any;
  inventoryTypeId: number;
  inventoryType: string;
  erpInventoryId: string;
  unitType: number;
  unitTypeDesc: any;
  serial: string;
  acceptedQuantity: any;
  lineNumber: number;
  allocationDate: string;
}

export interface POSInventoryCatelogResponse {
  value: number;
  text: string;
  pricePerUnit?: number;
  serialised: AutoRenewalFlag;
  discount?: number;
  inventoryMasterPrices: InventoryMaster;
  inventoryMasterDiscounts: InventoryMaster;
  autoRenewalFlag: AutoRenewalFlag;
  taxPlan?: number;
  category: string;
  erpInventoryId: string;
  inventorySubType: InventorySubType;
  changedDate: string;
  subcategory?: string;
  minOrderQty?: number;
  availableDate?: Date;
  expiryDate?: Date;
  status?: string;
  minVariance?: number;
  maxVariance?: number;
}

export enum AutoRenewalFlag {
  N = "N",
  Y = "Y",
}

export interface InventoryMaster {
  id: number;
  inventoryTypeId: number;
  discount?: number;
  startDate: Date;
  endDate: Date;
  dealerPrice?: number;
}

export enum InventorySubType {
  L = "L",
  P = "P",
}
