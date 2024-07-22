import { NextRequest } from "next/server";

interface TrackEventProperties {
  [key: string]: any;
}

export async function trackEvent(
  event: string,
  properties: TrackEventProperties,
): Promise<void> {
  const baseUrl = process.env.OPENHEXA_BACKEND_URL ?? "";
  try {
    const res = await fetch(`${baseUrl}/analytics/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ event, properties }),
    });

    if (!res.ok) {
      throw new Error(`Failed to track event: ${res.statusText}`);
    }
  } catch (error) {
    console.error("Error tracking event:", error);
  }
}

export async function trackPageView(request: NextRequest) {
  const srcUrl = new URL(request.url);

  const page = srcUrl.pathname.slice("/graphql".length).replaceAll("/", "");
  const baseUrl = process.env.OPENHEXA_BACKEND_URL ?? "";

  try {
    const res = await fetch(`${baseUrl}/analytics/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `sessionid=${request.cookies.get("sessionid")?.value}`,
      },

      body: JSON.stringify({ event: "page_viewed", properties: { page } }),
    });

    if (!res.ok) {
      throw new Error(`Failed to track event: ${res.statusText}`);
    }
  } catch (error) {
    console.error("Error tracking event:", error);
  }
}
