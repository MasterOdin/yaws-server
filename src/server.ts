import { Server as HttpServer } from 'http';
import { Server as WebSocketServer } from 'ws';
import { EventEmitter } from 'events';
import { YawsServerClient } from './client';

export class YawsServer extends EventEmitter {
  public server: WebSocketServer;
  public clients: YawsServerClient[];
  public clientCounter = 0;

  constructor(httpServer: HttpServer) {
    super();
    this.server = new WebSocketServer({server: httpServer});
    this.clients = [];
    this.server.on('connection', (webSocketClient) => {
      const client = new YawsServerClient(webSocketClient, this.clientCounter);
      this.clientCounter++;
      client.on('close', () => {
        for (let i = 0; i < this.clients.length; i++) {
          if (this.clients[i].id === client.id) {
            this.clients.splice(i, 1);
          }
        }
      });
      this.clients.push(client);
    });
  }

  broadcast(event: string, msg: any): void {
    this.server.clients.forEach((client) => {
      client.send(event, msg);
    });
  }
}
