import { WhiteListIpModel } from '../model/WhiteListIpModel';

export interface IOutWhiteListIpDTO {
  useWhiteListIPs: boolean;
  whiteListIPs: WhiteListIpModel[];
}