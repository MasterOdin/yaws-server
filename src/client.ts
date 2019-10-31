import { EventEmitter } from 'events';
import WebSocket from 'ws';

export class YawsServerClient extends EventEmitter {
  client: WebSocket;
  id: number;
  onmessage?: (data: any) => void;

  constructor(client: WebSocket, id: number) {
    super();
    this.client = client;
    this.id = id;

    this.client.on('close', (code, reason): void => {
      this.emit('close', code, reason);
    });

    this.client.onmessage = (message): void => {
      this.handleMessage(message);
    };
  }

  send(event: string, data: any): void {
    this.client.send(JSON.stringify({event: event, data: data}));
  }

  handleMessage(message: any): void {
    message = JSON.parse(message);
    if (message.type) {
      this.emit(message.type, message.data);
    }
    if (this.onmessage) {
      this.onmessage(message);
    }
  }
}
