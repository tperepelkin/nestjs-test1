import { ApiProperty } from '@nestjs/swagger'

export default interface IAdsbData {
  sacSic: number;
  latitude: number;
  longitude: number;
  altitude: number;
  courseAngle: number;
  targetAddress: number;
  targetNumber: number;
  targetIdent: string;
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
  targetAddress: number;
  @ApiProperty()
  targetNumber: number;
  @ApiProperty()
  targetIdent: string;
  @ApiProperty()
  squawk: number;
  @ApiProperty()
  planeType: number; 
}
