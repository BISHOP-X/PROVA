// Nigerian bank codes for Squad Transfer API
export const NIGERIAN_BANKS: Record<string, string> = {
  "000001": "Sterling Bank",
  "000002": "Keystone Bank",
  "000003": "FCMB",
  "000004": "United Bank for Africa",
  "000005": "Diamond Bank",
  "000006": "JAIZ Bank",
  "000007": "Fidelity Bank",
  "000008": "Polaris Bank",
  "000009": "Citi Bank",
  "000010": "Ecobank Bank",
  "000011": "Unity Bank",
  "000012": "StanbicIBTC Bank",
  "000013": "GTBank Plc",
  "000014": "Access Bank",
  "000015": "Zenith Bank Plc",
  "000016": "First Bank of Nigeria",
  "000017": "Wema Bank",
  "000018": "Union Bank",
  "000019": "Enterprise Bank",
  "000020": "Heritage",
  "000021": "Standard Chartered",
  "000022": "Suntrust Bank",
  "000023": "Providus Bank",
  "000024": "Rand Merchant Bank",
  "000025": "Titan Trust Bank",
  "000026": "Taj Bank",
  "000027": "Globus Bank",
  "000028": "Central Bank of Nigeria",
  "000029": "Lotus Bank",
  "000031": "Premium Trust Bank",
  "000033": "eNaira",
  "000034": "Signature Bank",
  "000036": "Optimus Bank",
  "090267": "Kuda Microfinance Bank",
  "090328": "Eyowo",
}

export function isValidBankCode(bankCode: string): boolean {
  return bankCode in NIGERIAN_BANKS
}

export function getBankName(bankCode: string): string {
  return NIGERIAN_BANKS[bankCode] || "Unknown Bank"
}

export function validateAccountNumber(accountNumber: string): boolean {
  // Account number should be 10 digits
  const cleaned = accountNumber.replace(/\s/g, "")
  return /^\d{10}$/.test(cleaned)
}

export function formatAccountNumber(accountNumber: string): string {
  return accountNumber.replace(/\s/g, "")
}

export function generateApplicationId(): string {
  // Format: PROVA-[TIMESTAMP]-[RANDOM]
  // e.g. PROVA-1715732945-A3K7Z
  const timestamp = Math.floor(Date.now() / 1000)
  const random = Math.random().toString(36).substring(2, 7).toUpperCase()
  return `PROVA-${timestamp}-${random}`
}
