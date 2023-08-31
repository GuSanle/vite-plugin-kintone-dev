import net from "node:net";

export default function getNextPort(port: number): Promise<number> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.unref();
    server.on("error", () => {
      resolve(getNextPort(port + 1));
    });
    server.listen(port, () => {
      server.close(() => {
        resolve(port);
      });
    });
  });
}
