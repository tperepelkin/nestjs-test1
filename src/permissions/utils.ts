import { Aircraft, Individual } from "@prisma/client";
import { AircraftShort, PilotShort } from "./dto/permission";

function isPilot(pilot: any): pilot is PilotShort {
  if (typeof pilot === 'object') {
      pilot = (pilot as PilotShort);
      return pilot.firstName !== undefined
          && pilot.patronimyc !== undefined
          && pilot.lastName !== undefined;
  } else {
      return false;
  }
}

function isAircraft(aircraft: any): aircraft is AircraftShort {
  if (typeof aircraft === 'object') {
      aircraft = (aircraft as AircraftShort);
      return aircraft.aircraftNumber !== undefined;
  } else {
      return false;
  }
}

function compareItems(
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

function isArrayIncludes<T extends PilotShort | Individual | Aircraft | AircraftShort>(
  original: Array<T>,
  included: Array<T>,
  predicate: (item1: T, item2: T) => boolean
): boolean {
  return included.length === original.length
      && included.every(includedItem =>
          original.some(originalItem => predicate(includedItem, originalItem))
      );
}