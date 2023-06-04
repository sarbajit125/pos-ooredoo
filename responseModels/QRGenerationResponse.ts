export interface QRGenerationReq {
  latLong: string;
  beatPlan: string;
  qrCodeId: string;
  posId: string;
  addDate: string;
}

export interface QRGenerationResp extends QRGenerationReq {
  id: number;
}
