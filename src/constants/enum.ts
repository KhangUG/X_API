export enum UserVerifyStatus {
  Unverified, // chưa xác thực email, mặc định = 0
  Verified, // đã xác thực email
  Banned // bị khóa
}
export enum tokenType {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  RESET_PASSWORD_TOKEN,
  EMAIL_VERIFY_TOKEN
}
