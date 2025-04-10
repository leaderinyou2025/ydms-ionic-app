export class RequestPayload {
  id: number;
  jsonrpc: string;
  method: string;
  params: {
    method: string,
    service: string,
    args: Array<any>
  }

  constructor() {
    this.id = new Date().getUTCMilliseconds();
    this.jsonrpc = '2.0';
    this.method = 'call';
    this.params = {
      method: 'execute_kw',
      service: 'object',
      args: new Array<any>()
    };
  }
}
