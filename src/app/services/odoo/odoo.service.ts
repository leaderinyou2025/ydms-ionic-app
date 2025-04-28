import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

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
import { RelatedField } from '../../shared/interfaces/base/related-field';
import { TranslateKeys } from '../../shared/enums/translate-keys';
import { StyleClass } from '../../shared/enums/style-class';


export type SearchDomain = Array<string | Array<string | number | boolean | Array<string | number>>>;

@Injectable({
  providedIn: 'root'
})
export class OdooService {
  public maximumLimitRecords = 999999;
  private lang: string = 'vi_VN';

  constructor(
    private httpClientService: HttpClientService,
    private authService: AuthService,
    private alertController: AlertController,
    private translate: TranslateService,
  ) {
  }

  /**
   * Read model method
   * @param model
   * @param ids
   * @param fields
   */
  async read<T>(model: ModelName, ids: Array<number>, fields?: Array<string>): Promise<Array<T>> {
    if (!model || !ids?.length) return [];

    const context: IDictionary<string> = {lang: this.lang};
    const kwArgs: IKwArgs = {context: context};
    if (fields) kwArgs.fields = fields;

    let results: Array<any> = await this.callKw<T>(model, OdooMethodName.READ, [ids], kwArgs);
    return results?.length ? results : [];
  }

  /**
   * Create model method
   * @param model
   * @param values
   */
  async create<T>(model: ModelName, values: Partial<T>): Promise<number | undefined> {
    if (!model || !values) return;
    return this.callKw<T>(model, OdooMethodName.CREATE, [values]);
  }

  /**
   * Write model method
   * @param model
   * @param ids
   * @param values
   */
  async write<T>(model: ModelName, ids: Array<number>, values: Partial<T>): Promise<number | boolean> {
    if (!model || !ids?.length || !values) return false;
    return this.callKw<T>(model, OdooMethodName.WRITE, [ids, values]);
  }

  /**
   * Unlink model method
   * @param model
   * @param ids
   */
  async unlink(model: ModelName, ids: Array<number>): Promise<boolean> {
    if (!model || !ids?.length) return true;
    return this.callKw(model, OdooMethodName.UNLINK, [ids]);
  }

  /**
   * Search model method
   * @param model
   * @param args
   * @param offset
   * @param limit
   * @param order
   */
  async search<T>(
    model: ModelName,
    args: SearchDomain = [],
    offset: number = 0,
    limit: number = 0,
    order?: OrderBy
  ): Promise<Array<RelatedField>> {
    if (!model) return [];

    const kwArgs: IKwArgs = {limit: limit || this.maximumLimitRecords};
    if (offset > 0) kwArgs.offset = offset;
    if (order) kwArgs.order = order;

    let results: Array<RelatedField> = await this.callKw(model, OdooMethodName.SEARCH, [args], kwArgs);
    return results?.length ? results : [];
  }

  /**
   * Search read model method
   * @param model
   * @param args
   * @param fields
   * @param offset
   * @param limit
   * @param order
   */
  async searchRead<T>(
    model: ModelName,
    args: SearchDomain = [],
    fields: Array<string> = [],
    offset: number = 0,
    limit: number = 0,
    order?: OrderBy
  ): Promise<Array<T>> {
    if (!model) return [];

    const kwArgs: IKwArgs = {fields: fields, context: {lang: this.lang}, limit: limit || this.maximumLimitRecords};
    if (offset > 0) kwArgs.offset = offset;
    if (order) kwArgs.order = order;

    let results: Array<T> = await this.callKw<T>(model, OdooMethodName.SEARCH_READ, [args], kwArgs);
    return results?.length ? results : [];
  }

  /**
   * Search count model method
   * @param model
   * @param args
   */
  async searchCount<T>(model: ModelName, args: SearchDomain = []): Promise<number> {
    if (!model) return 0;
    return this.callKw(model, OdooMethodName.SEARCH_COUNT, [args]);
  }

  /**
   * call_kw jsonrpc
   * @param model
   * @param method
   * @param paramsArgs
   * @param kwArgs
   */
  async callKw<T>(
    model: ModelName,
    method: string,
    paramsArgs: Array<Array<number> | Partial<T> | SearchDomain> = [],
    kwArgs: IKwArgs = {}
  ): Promise<any> {
    const authData = await this.authService.getAuthData();
    const authToken = this.authService.getAuthToken();
    if (!authData || !authToken) return false;

    const dataRequest = new RequestPayload();
    dataRequest.params.args = [environment.database, authData.id, authToken, model, method, paramsArgs, kwArgs];

    const result = await this.httpClientService.post(environment.serverUrl, dataRequest, {headers: CommonConstants.getRequestHeader()}, OdooMethodName.CALL_KW);

    if (result?.error?.data?.message) {
      this.alertController.create({
        header: this.translate.instant(TranslateKeys.ALERT_ERROR_SYSTEM_HEADER),
        message: result?.error?.data?.message,
        cssClass: `${StyleClass.ERROR_ALERT} ${StyleClass.TEXT_JUSTIFY}`,
        buttons: this.translate.instant(TranslateKeys.BUTTON_CLOSE),
      }).then(alert => alert.present());
    }

    return result?.error ? false : (result?.result != null ? result?.result : true);
  }
}
