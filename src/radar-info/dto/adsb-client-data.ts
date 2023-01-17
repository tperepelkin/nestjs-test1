import { ApiProperty } from '@nestjs/swagger'

export default interface IAdsbData {
  sacSic: number;
  latitude: number;
  longitude: number;
  altitude: number;
  courseAngle: number;
  targetNumber: number;
  callSign: string;
  icao: number;
  squawk: number;
  planeType: number; 
}

export class AdsbData implements IAdsbData {
  @ApiProperty()
  sacSic: number;
  @ApiProperty()
  latitude: number;
  @ApiProperty()
  longitude: number;
  @ApiProperty()
  altitude: number;
  @ApiProperty()
  courseAngle: number;
  @ApiProperty()
  targetNumber: number;
  @ApiProperty()
  callSign: string;
  @ApiProperty()
  icao: number;
  @ApiProperty()
  squawk: number;
  @ApiProperty()
  planeType: number; 
}
