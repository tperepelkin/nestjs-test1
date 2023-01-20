import { Individual, Airfield as AirfieldModel, Entity as EntityModel, Permission, ActorType, Aircraft, Airfield } from '@prisma/client';

export type PilotRequest = Pick<Individual, 'firstName' | 'lastName' | 'patronimyc'>;
export type PilotShort = Pick<Individual, 'firstName' | 'lastName' | 'patronimyc'>;
type Pilot = Individual;
type Entity = EntityModel;

type AirfieldShort = Pick<AirfieldModel, 'name' | 'code'>;

export class PermissionRequest {
    aircraftNumber: string;
    pilots: PilotRequest | PilotRequest[];
    date: Date;
    permissionNumber: string
}

export type KsaPivpPermissionDetails = {
  permissionNumber: string;
  startDate: string;
  endDate: string;
  pilots: PilotShort[];
  aircraftNumbers: string[];
  target: string;
  airfields: AirfieldShort[];
}

export type PermissionDetails = Omit<Permission, 'isObsoleted'> & {
  recipient: Pilot | Entity
} & {
  pilots: Pilot[]
} & {
  aircrafts: Aircraft[]
}  & {
  airfields: Airfield[]
}

export type PermissionShortResponse = {
  result: boolean;
}

export type KsaPivpPermissionDetailedResponse = PermissionShortResponse & {
  details?: KsaPivpPermissionDetails;
}

export type PermissionDetailedResponse = PermissionShortResponse & {
  details?: PermissionDetails;
}

export const NOT_FOUND_PERMISSION_RESPONSE: KsaPivpPermissionDetailedResponse = {
  result: false,
};