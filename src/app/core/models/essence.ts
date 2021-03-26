
export type EssenceTypes = 'help' | 'measurement-type' | 'specialization' | 'subservice-type' | 'user-attachment-type' ;

export enum EssenceType {
  help = 'help',
  measurementType = 'measurement-type',
  specialization = 'specialization',
  subserviceType = 'subservice-type',
  userAttachmentType = 'user-attachment-type'
}

export interface EssencePreview {
  itemsList: any;
  essenceLabel: string;
  buttonLabel: string;
  inputLabel: string;
  type: EssenceTypes;
}
