import { NextRequest } from "next/server";

export const config = {
  runtime: "experimental-edge",
};

export default async function proxy(req: NextRequest) {
  const url = new URL(req.url);
  const fallbackURL = `${process.env.FALLBACK_URL}${url.pathname}${url.search}`;

  const cookie = ["sessionid", "csrftoken"]
    .map((key) => {
      const value = req.cookies.get(key);
      if (value) {
        return `${key}=${value}`;
      }
      return null;
    })
    .filter((c) => c !== null)
    .join(";");

  return await fetch(fallbackURL, {
    headers: { cookie },
    credentials: "include",
  });
}
