import { type ViteDevServer } from "vite";

function isIpv6(address: any) {
  return address.family === "IPv6" || address.family === 6;
}

export default function getServerInfo(server: ViteDevServer) {
  const address = server.httpServer?.address();
  if (!address || typeof address === "string") {
    console.error("Unexpected dev server address", address);
    process.exit(1);
  }
  const protocol = server.config.server.https ? "https" : "http";
  const host = isIpv6(address) ? `[${address.address}]` : address.address;
  const port = address.port;
  const devServerUrl = `${protocol}://${host}:${port}`;
  return devServerUrl;
}
