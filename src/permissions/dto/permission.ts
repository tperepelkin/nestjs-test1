import {
  Individual,
  Airfield as AirfieldModel,
  Entity as EntityModel,
  Permission as PermissionModel,
  Aircraft as AircraftModel,
  AircraftType
} from '@prisma/client';


export type PilotRequest = Pick<Individual, 'firstName' | 'lastName' | 'patronimyc'>;
export type PilotShort = Pick<Individual, 'firstName' | 'lastName' | 'patronimyc'>;
type Pilot = Individual;
type Entity = EntityModel;

export type AirfieldShort = Pick<AirfieldModel, 'name' | 'code'> & {
  location?: {
    type: string;
    geometry: {
      type: string;
      coordinates: Array<number>;
    },
    porperties?: {
      [key: string]: string | number | boolean;
    }
  }
};

export type AircraftShort = Pick<AircraftModel, 'aircraftNumber'>;

export type PermissionWithAirfieldsModel = PermissionModel & {
  airfields?: Array<AirfieldModel>
};

export type PermissionShortResponse = {
  result: boolean;
}

export class KsaPivpPermissionRequestDto {
  aircraftNumber: string;
  pilot?: PilotRequest;
  date?: Date;
  permissionNumber?: number;
}

export type KsaPivpPermissionDetails = {
  target: string;
  zoneDescription: string;
} | {
  target: string;
  airfields: AirfieldShort[];
}

export type KsaPivpPermissionDetailedResponse = PermissionShortResponse & {
  details?: KsaPivpPermissionDetails | Array<KsaPivpPermissionDetails>;
}

export type KsaPivpPermissionResponse = PermissionShortResponse | KsaPivpPermissionDetailedResponse

export type PermissionDetails = Omit<PermissionModel, 'isObsoleted'> & {
  recipient: Pilot | Entity
} & {
  pilots: Pilot[]
} & {
  aircrafts: AircraftModel[]
} & {
  airfields: AircraftModel[]
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
