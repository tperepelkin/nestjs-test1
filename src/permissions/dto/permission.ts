import {
  Individual,
  Airfield as AirfieldModel,
  Entity as EntityModel,
  Permission as PermissionModel,
  ActorType,
  Aircraft as AircraftModel,
  Airfield, AircraftType
} from '@prisma/client';

export type PilotRequest = Pick<Individual, 'firstName' | 'lastName' | 'patronimyc'>;
export type PilotShort = Pick<Individual, 'firstName' | 'lastName' | 'patronimyc'>;
type Pilot = Individual;
type Entity = EntityModel;

export type AirfieldShort = Pick<AirfieldModel, 'name' | 'code'>;

export type AircraftShort = Pick<AircraftModel, 'aircraftNumber'>;

export class PermissionRequest {
  aircraftNumber: string;
  pilot: PilotRequest;
  date: Date;
  permissionNumber: string
}

export type KsaPivpPermissionDetails = {
  target: string;
  zoneDescription: string | null;
} | {
  target: string;
  airfields: AirfieldShort[] | null;
}

export type PermissionDetails = Omit<PermissionModel, 'isObsoleted'> & {
  recipient: Pilot | Entity
} & {
  pilots: Pilot[]
} & {
  aircrafts: AircraftModel[]
} & {
  airfields: AircraftModel[]
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



export class IndividualDto {
  id: number;
  firstName: string;
  lastName: string;
  patronimyc: string;
  passportSeries: string;
  passportNumber: string;
  address: string;
  passportSource: string;
}

export class AirfieldDto {
  id: number
  code: string | null
  name: string
  type: string
  latitude: number
  longitude: number
  militaryZoneId: number | null
  militaryZoneName: string | null
  workAboutSchedule: string | null
}

export class AircraftDto {
  id: number;
  modelName: string;
  aircraftNumber: string;
  aircraftType: AircraftType;
}

export class PermissionShortDto {
  id: number;
  permissionNumber: number | null;
  recipientId: number;
  target: string;
  zoneDescription: string | null;
  createDate: Date;
  startDate: Date;
  endDate: Date | null;
}

export class PermissionDto extends PermissionShortDto {
  pilots: Array<IndividualDto>;
  aircrafts: Array<AircraftDto>;
  airfields: Array<AirfieldDto>;
}
