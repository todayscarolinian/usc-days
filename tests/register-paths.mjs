import { existsSync } from "node:fs";
import { registerHooks } from "node:module";
import { fileURLToPath } from "node:url";

const projectRoot = new URL("../", import.meta.url);

// Node can run TypeScript on our supported versions, but does not read tsconfig paths.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (!specifier.startsWith("@/")) return nextResolve(specifier, context);

    const target = new URL(specifier.slice(2), projectRoot);
    const candidates = [target.href, `${target.href}.ts`, `${target.href}/index.ts`];
    const match = candidates.find(candidate => existsSync(fileURLToPath(candidate)));
    return nextResolve(match ?? target.href, context);
  },
});
