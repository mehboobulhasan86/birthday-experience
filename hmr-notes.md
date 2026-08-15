# Development preview HMR notes

The managed Manus preview serves the Express middleware on port 3000 but does not proxy the internal Vite websocket endpoint that the middleware-mode bridge previously advertised at localhost:5173. That produced the browser error `[vite] failed to connect to websocket`.

The fix disables HMR at the actual Express-to-Vite middleware bridge in `server/_core/vite.ts` and keeps the root Vite config aligned. After restarting the server and reloading the proxied preview, the browser console reported `[vite] connected.` with no newer websocket failure. The changed `client/src/ai-scenes.css` was also confirmed served by the preview through its transformed asset endpoint.

This environment uses the managed restart-on-change workflow rather than relying on a directly proxied Vite hot-update websocket. Production builds are unaffected by this development-only setting.
