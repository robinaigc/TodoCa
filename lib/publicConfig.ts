const configuredSupportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim();

export const SUPPORT_EMAIL =
  configuredSupportEmail || "robin990083@gmail.com";
