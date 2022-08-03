export function displayAlert(
  message: string,
  type: "error" | "info" | "warning" = "info"
) {
  if (!window) {
    console.warn("displayAlert cannot be called on the server.");
    return;
  }
  const event = new CustomEvent("displayAlert", {
    detail: {
      message,
      type,
    },
  });

  window.dispatchEvent(event);
}
