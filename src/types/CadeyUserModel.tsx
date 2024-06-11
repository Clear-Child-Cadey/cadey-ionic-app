type CadeyUserModel = {
  authId: string | null;
  cadeyUserEmail: string | null;
  cadeyUserId: number; // integer($int32) is represented as number in TypeScript
  cadeyUserDeviceId: string | null;
  cadeyUserAuthExpiration: string | null; // NOTE: This is now returning a date arbitrarily far in the future. The app isn't using this, but the website is as of 6/11/24.
  cadeyUserIsActive: boolean;
  oneSignalId: string | null;
  ageGroup: number; // integer($int32) is represented as number in TypeScript
  companyId: number | null; // integer($int32) is represented as number in TypeScript
  companyName: string | null;
  authStatus: AuthStatus;
  regStatus: RegStatus;
} | null;

// Enum for authStatus
// Successful = 0,
// FailedExpired = 1,
// FailedNotActive = 2,
// FailedNotRegistered = 3,
enum AuthStatus {
  Status0 = 0,
  Status1 = 1,
  Status2 = 2,
  Status3 = 3,
}

// Enum for regStatus
// Registered = 0,
// NotFound = 1,
// FoundNotRegistered = 2,
enum RegStatus {
  Status0 = 0,
  Status1 = 1,
  Status2 = 2,
}

export default CadeyUserModel;
