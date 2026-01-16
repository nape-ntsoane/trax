export const errorMessages: Record<string, string> = {
  "REGISTER_USER_ALREADY_EXISTS": "User with this email already exists.",
  "LOGIN_BAD_CREDENTIALS": "Invalid email or password.",
  "Unauthorized": "You are not authorized to perform this action.",
  "Forbidden": "You do not have permission to perform this action.",
  "Not Found": "The requested resource was not found.",
};

export function getErrorMessage(code: any): string {
  if (typeof code === "string") {
    return errorMessages[code] || code;
  }
  
  if (Array.isArray(code)) {
      // Handle FastAPI validation errors
      return code.map((err: any) => err.msg).join(", ");
  }
  
  if (typeof code === "object" && code !== null) {
      return JSON.stringify(code);
  }

  return "An unknown error occurred.";
}
