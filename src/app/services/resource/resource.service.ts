import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { OdooService, SearchDomain } from '../odoo/odoo.service';
import { OrderBy } from '../../shared/enums/order-by';
import { ForceTestData } from '../../shared/classes/force-test-data';
import { IResource } from '../../shared/interfaces/resource/resource.interface';
import { ResourceType } from '../../shared/enums/libary/resource-type.enum';
import { ResourceTopic } from '../../shared/enums/libary/resource-topic.enum';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  constructor(
    private odooService: OdooService,
  ) { }

  public getResources(
    searchTerm: string = '',
    type: ResourceType = ResourceType.ALL,
    topic: ResourceTopic = ResourceTopic.ALL,
    offset: number = 0,
    limit: number = 20
  ): Observable<{ resources: IResource[], total: number }> {
    // TODO: Implement actual API call when backend is ready
    // For now, return test data with filtering
    let resources = ForceTestData.resources;

    // Apply search filter if provided
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      resources = resources.filter(resource =>
        resource.title?.toLowerCase().includes(term) ||
        resource.description?.toLowerCase().includes(term) ||
        resource.shortDescription?.toLowerCase().includes(term)
      );
    }

    // Apply type filter if not ALL
    if (type !== ResourceType.ALL) {
      resources = resources.filter(resource => resource.type === type);
    }

    // Apply topic filter if not ALL
    if (topic !== ResourceTopic.ALL) {
      resources = resources.filter(resource => resource.topic === topic);
    }

    // Apply pagination
    const paginatedResources = resources.slice(offset, offset + limit);

    return of({
      resources: paginatedResources,
      total: resources.length
    });
  }


  public getResourceById(id: number): Observable<IResource | undefined> {
    // TODO: Implement actual API call when backend is ready
    const resource = ForceTestData.resources.find(r => r.id === id);
    return of(resource);
  }

  public getTopicThumbnail(topic: ResourceTopic): string {
    return ForceTestData.resourceTopicThumbnails[topic] || ForceTestData.resourceTopicThumbnails[ResourceTopic.ALL];
  }
}
