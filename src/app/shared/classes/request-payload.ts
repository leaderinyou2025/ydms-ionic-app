import { OdooJsonrpcServiceNames } from '../enums/odoo-jsonrpc-service-names';
import { OdooMethodName } from '../enums/odoo-method-name';

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
    this.method = OdooMethodName.CALL;
    this.params = {
      method: OdooMethodName.EXECUTE_KW,
      service: OdooJsonrpcServiceNames.OBJECT,
      args: new Array<any>()
    };
  }
}
