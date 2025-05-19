import { IBase } from '../base/base';
import { ResourceType } from '../../enums/libary/resource-type.enum';
import { ResourceTopic } from '../../enums/libary/resource-topic.enum';

export interface IResource extends IBase {
  title: string;
  description: string;
  shortDescription?: string;
  resourceUrl: string;
  thumbnailUrl?: string;
  type: ResourceType;
  topic: ResourceTopic;
  fileType?: string; // pdf, docx, mp4, etc.
  isExternal?: boolean; // Whether the resource is hosted externally (e.g., YouTube)
  viewCount?: number;
  createdDate?: string;
  updatedDate?: string;
}
