type CadeyUserModel = {
  authId: string | null;
  cadeyUserEmail: string | null;
  cadeyUserId: number; // integer($int32) is represented as number in TypeScript
  cadeyUserDeviceId: string | null;
  cadeyUserAuthExpiration: string | null; // Assuming ISO 8601 date-time string
  cadeyUserIsActive: boolean;
  oneSignalId: string | null;
  ageGroup: number; // integer($int32) is represented as number in TypeScript
  companyId: number | null; // integer($int32) is represented as number in TypeScript
  companyName: string | null;
  authStatus: AuthStatus;
  regStatus: RegStatus;
} | null;

// Enum for authStatus
enum AuthStatus {
  Status0 = 0,
  Status1 = 1,
  Status2 = 2,
  Status3 = 3,
}

// Enum for regStatus
enum RegStatus {
  Status0 = 0,
  Status1 = 1,
  Status2 = 2,
}

export default CadeyUserModel;
