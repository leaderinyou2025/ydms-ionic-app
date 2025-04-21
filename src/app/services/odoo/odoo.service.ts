import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

import { AuthService } from '../auth/auth.service';
import { HttpClientService } from '../http-client/http-client.service';

import { IDictionary } from '../../shared/interfaces/base/dictionary';
import { IKwArgs } from '../../shared/interfaces/http/kw-args';
import { ModelName } from '../../shared/enums/model-name';
import { OdooMethodName } from '../../shared/enums/odoo-method-name';
import { RequestPayload } from '../../shared/classes/request-payload';
import { environment } from '../../../environments/environment';
import { CommonConstants } from '../../shared/classes/common-constants';
import { OrderBy } from '../../shared/enums/order-by';


export type SearchDomain = Array<any>;

@Injectable({
  providedIn: 'root'
})
export class OdooService {
  public maximumLimitRecords = 999999;

  constructor(
    private httpClientService: HttpClientService,
    private authService: AuthService,
    private alertController: AlertController,
  ) {
  }

  async read(model: ModelName, ids: Array<number>, fields?: Array<string>): Promise<Array<any>> {
    if (!model || !ids?.length) return [];

    const context: IDictionary<string> = {lang: 'vi_VN'};
    const kwArgs: IKwArgs = {context: context};
    if (typeof fields !== 'undefined') kwArgs.fields = fields;

    let results: Array<any> = await this.call_kw(model, OdooMethodName.READ, [ids], kwArgs);
    return results?.length ? results : [];
  }

  async create(model: ModelName, values: IDictionary<any>): Promise<number | undefined> {
    if (!model || !values) return;
    return this.call_kw(model, OdooMethodName.CREATE, [values]);
  }

  async write(model: ModelName, ids: Array<number>, values: IDictionary<any>): Promise<any | number | boolean> {
    if (!model || !ids?.length || !values) return;
    return this.call_kw(model, OdooMethodName.WRITE, [ids, values]);
  }

  async unlink(model: ModelName, ids: Array<number>): Promise<boolean> {
    if (!model || !ids?.length) return true;
    return this.call_kw(model, OdooMethodName.UNLINK, [ids]);
  }

  async search(
    model: ModelName,
    args: SearchDomain = [],
    offset: number = 0,
    limit: number = 0,
    order?: OrderBy
  ): Promise<Array<any>> {
    if (!model) return [];

    const kwArgs: IKwArgs = {limit: limit || 999999};
    if (offset > 0) kwArgs.offset = offset;
    if (order) kwArgs.order = order;

    let results: Array<any> = await this.call_kw(model, OdooMethodName.SEARCH, [args], kwArgs);
    return results?.length ? results : [];
  }

  async search_read(
    model: ModelName,
    args: SearchDomain = [],
    fields: Array<string> = [],
    offset: number = 0,
    limit: number = 0,
    order?: OrderBy
  ): Promise<Array<any>> {
    if (!model) return [];

    const kwArgs: IKwArgs = {fields: fields, context: {lang: 'vi_VN'}, limit: limit || this.maximumLimitRecords};
    if (offset > 0) kwArgs.offset = offset;
    if (order) kwArgs.order = order;

    let results: Array<any> = await this.call_kw(model, OdooMethodName.SEARCH_READ, [args], kwArgs);
    return results?.length ? results : [];
  }

  async search_count(model: ModelName, args: SearchDomain = []): Promise<number> {
    if (!model) return 0;
    return this.call_kw(model, OdooMethodName.SEARCH_COUNT, [args]);
  }

  async call_kw(model: ModelName, method: string, paramsArgs: Array<any> = [], kwArgs: IKwArgs = {}): Promise<any> {
    const authInfo = this.authService.getAuthData();

    const dataRequest = new RequestPayload();
    dataRequest.params.args = [environment.database, authInfo.id, authInfo.password, model, method, paramsArgs, kwArgs];

    const result = await this.httpClientService.post(environment.serverUrl, dataRequest, {headers: CommonConstants.getRequestHeader()}, 'call_kw');

    if (result?.error?.data?.message) {
      this.alertController.create({
        header: 'Lỗi hệ thống',
        message: result?.error?.data?.message,
        cssClass: 'error-alert text-justify',
      }).then(alert => alert.present());
    }

    return result?.error ? false : (result?.result != null ? result?.result : true);
  }
}
