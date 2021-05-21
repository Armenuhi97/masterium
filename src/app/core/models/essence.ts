
export type EssenceTypes = 'help' | 'measurement-type' | 'specialization' | 'subservice-type' | 'user-attachment-type' | 'bank' ;

export enum EssenceType {
  help = 'help',
  measurementType = 'measurement-type',
  specialization = 'specialization',
  subserviceType = 'subservice-type',
  userAttachmentType = 'user-attachment-type',
  bank = 'bank'
}

export interface EssencePreview {
  itemsList: any;
  essenceLabel: string;
  buttonLabel: string;
  inputLabel: string;
  type: EssenceTypes;
}
