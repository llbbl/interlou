import { isAbsolute, relative, resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const defaultDocument = "preview/homepage-cards.html";
const allowedRoots = [resolve(root, "preview"), resolve(root, "static")];
const port = Number(Bun.env.PORT ?? "48137");

function isInside(basePath, targetPath) {
  const pathFromBase = relative(basePath, targetPath);

  return pathFromBase !== ""
    && !pathFromBase.startsWith("..")
    && !isAbsolute(pathFromBase);
}

const server = Bun.serve({
  hostname: "127.0.0.1",
  port,
  async fetch(request) {
    const url = new URL(request.url);
    let requestPath;

    try {
      requestPath = decodeURIComponent(url.pathname);
    } catch {
      return new Response("Bad request", { status: 400 });
    }

    const relativeRequestPath = requestPath === "/"
      ? defaultDocument
      : requestPath.replace(/^\/+/, "");
    const filePath = resolve(root, relativeRequestPath);
    const pathFromRoot = relative(root, filePath);

    if (
      pathFromRoot.startsWith("..")
      || isAbsolute(pathFromRoot)
      || !allowedRoots.some((allowedRoot) => isInside(allowedRoot, filePath))
    ) {
      return new Response("Forbidden", { status: 403 });
    }

    const file = Bun.file(filePath);
    if (!(await file.exists())) {
      return new Response("Not found", { status: 404 });
    }

    return new Response(file);
  },
});

console.log(`Interlou layout preview: ${server.url}`);
