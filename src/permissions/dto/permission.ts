import { Individual, Airfield as AirfieldModel, Entity as EntityModel, Permission, ActorType, Aircraft as AircraftModel, Airfield, Aircraft } from '@prisma/client';

export type PilotRequest = Pick<Individual, 'firstName' | 'lastName' | 'patronimyc'>;
export type PilotShort = Pick<Individual, 'firstName' | 'lastName' | 'patronimyc'>;
type Pilot = Individual;
type Entity = EntityModel;

export type AirfieldShort = Pick<AirfieldModel, 'name' | 'code'>;

export type AircraftShort = Pick<AircraftModel, 'aircraftNumber'>;

export class PermissionRequest {
    aircraftNumber: string;
    pilots: PilotRequest[];
    date: Date;
    permissionNumber: string
}

export type KsaPivpPermissionDetails = {
  permissionNumber: number;
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
  aircrafts: AircraftModel[]
}  & {
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

export function isPilot(pilot: any): pilot is PilotShort {
  if (typeof pilot === 'object') {
      pilot = (pilot as PilotShort);
      return pilot.firstName !== undefined
          && pilot.patronimyc !== undefined
          && pilot.lastName !== undefined;
  } else {
      return false;
  }
}

export function isAircraft(aircraft: any): aircraft is AircraftShort {
  if (typeof aircraft === 'object') {
      aircraft = (aircraft as AircraftShort);
      return aircraft.aircraftNumber !== undefined;
  } else {
      return false;
  }
}

export function compareItems(
  item1: PilotShort | Individual | Aircraft | AircraftShort,
  item2: PilotShort | Individual | Aircraft | AircraftShort
): boolean {
  if (isPilot(item1) && isPilot(item2)) {
      return item1.firstName === item2.firstName
          && item1.patronimyc === item2.patronimyc
          && item1.lastName === item2.lastName;
  }

  if (isAircraft(item1) && isAircraft(item2)) {
      return item1.aircraftNumber === item2.aircraftNumber;

  }

  throw new TypeError('Wrong parameter types!');
}

export function isArrayIncludes<T extends PilotShort | Individual | Aircraft | AircraftShort>(
  original: Array<T>,
  included: Array<T>,
  predicate: (item1: T, item2: T) => boolean
): boolean {
  return included.length === original.length
      && included.every(includedItem =>
          original.some(originalItem => predicate(includedItem, originalItem))
      );
}