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

export type KPASIVPPermissionDetails = {
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

export class PermissionShortResponse {
  result: boolean;
}

export class KPASIVPPermissionDetailedResponse extends PermissionShortResponse {
  details: KPASIVPPermissionDetails;
}

