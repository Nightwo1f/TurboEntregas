export type OcrResult = {
  rawText: string;
  extractedAddress?: string;
};

export async function extractAddressFromImage(_imageUrl: string): Promise<OcrResult> {
  return {
    rawText: "",
    extractedAddress: undefined
  };
}
