export interface Network {
  id: number;
  name: string;
  logo: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  color: string;
  layerZeroId?: number;
  isSupported: boolean; // Flag to indicate if we currently support this network
}