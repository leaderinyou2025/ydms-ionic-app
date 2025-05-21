import { Injectable } from '@angular/core';

import { OdooService, SearchDomain } from '../odoo/odoo.service';
import { IResCountryState } from '../../shared/interfaces/models/res.country.state';
import { ModelName } from '../../shared/enums/model-name';
import { OdooDomainOperator } from '../../shared/enums/odoo-domain-operator';
import { OrderBy } from '../../shared/enums/order-by';
import { CommonConstants } from '../../shared/classes/common-constants';
import { ILiyYdmsDistrict } from '../../shared/interfaces/models/liy.ydms.district';
import { ILiyYdmsPrecint } from '../../shared/interfaces/models/liy.ydms.precint';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  public readonly stateFields = ['name', 'admin_code', 'code', 'country_id', 'district_ids', 'precint_ids', 'order_weight'];
  public readonly districtFields = ['name', 'admin_code', 'state_id', 'precint_ids', 'order_weight'];
  public readonly precintFields = ['name', 'admin_code', 'state_id', 'district_id', 'order_weight'];

  constructor(
    private odooService: OdooService,
  ) {
  }


  /**
   * Get list state of Vietnam
   * @private
   */
  public async getStateList(): Promise<Array<IResCountryState>> {
    const results = await this.odooService.searchRead<IResCountryState>(
      ModelName.RES_COUNTRY_STATE,
      [['country_id', OdooDomainOperator.ILIKE, 'Vietnam']],
      this.stateFields, 0, 0, OrderBy.ORDER_WEIGHT_ASC
    );
    return CommonConstants.convertArr2ListItem(results);
  }

  /**
   * Get district list by stateId
   * @param stateId
   * @private
   */
  public async getDistrictList(stateId: number): Promise<Array<ILiyYdmsDistrict>> {
    const results = await this.odooService.searchRead<ILiyYdmsDistrict>(
      ModelName.DISTRICT, [['state_id', OdooDomainOperator.EQUAL, stateId]], this.districtFields, 0, 0, OrderBy.ORDER_WEIGHT_ASC
    );
    return CommonConstants.convertArr2ListItem(results);
  }

  /**
   * Get precint list by stateId or districtId
   * @param stateId
   * @param districtId
   * @private
   */
  public async getPrecintList(stateId: number, districtId?: number): Promise<Array<ILiyYdmsPrecint>> {
    const query: SearchDomain = [['state_id', OdooDomainOperator.EQUAL, stateId]];
    if (districtId) query.push(['district_id', OdooDomainOperator.EQUAL, districtId]);
    const results = await this.odooService.searchRead<ILiyYdmsDistrict>(
      ModelName.PRECINT, query, this.precintFields, 0, 0, OrderBy.ORDER_WEIGHT_ASC
    );
    return CommonConstants.convertArr2ListItem(results);
  }

}
