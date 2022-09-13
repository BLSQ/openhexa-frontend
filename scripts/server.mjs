import express from "express";
import next from "next";
import proxy from "express-http-proxy";
const port = process.env.PORT ?? 3000;
const dev = process.env.NODE_ENV !== "production";
const fallback_url = process.env.FALLBACK_URL ?? "localhost:8000";

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  const server = express();

  if (process.env.NEXT_PUBLIC_API_MOCKING === "enabled") {
    server.use(express.json());
    const { fetchQuery } = await import("../mocks/index.mjs");
    server.all("/graphql/*", async (req, res) => {
      res.json(await fetchQuery(req.body));
    });

    // server.post("/set-graphql-mock", (req, res) => {
    // Set mocks to be used (useful for testing specific use cases)
    // })
  }

  server.use(
    "/",
    proxy(fallback_url, {
      filter: function (req) {
        const isNext =
          req.url.startsWith("/collections") ||
          req.url.startsWith("/pipelines") ||
          req.url.startsWith("/airflow") ||
          req.url.startsWith("/images") ||
          req.url.startsWith("/_next") ||
          req.url === "/" ||
          req.url.startsWith("/ready");

        return !isNext;
      },
    })
  );

  server.all("*", (req, res) => handle(req, res));

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
