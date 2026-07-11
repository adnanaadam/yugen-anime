// Helper to show error toasts from anywhere
import { addGlobalToast } from "@/components/Toast";

export function showErrorToast(message: string) {
  addGlobalToast({
    type: "error",
    message,
  });
}

export function showSuccessToast(message: string) {
  addGlobalToast({
    type: "success",
    message,
  });
}