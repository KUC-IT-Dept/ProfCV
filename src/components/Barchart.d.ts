import type { FC } from 'react';

export interface BarchartPoint {
  year: string | number;
  publications: number;
  [key: string]: unknown;
}

export interface BarchartProps {
  data: BarchartPoint[];
}

declare const Barchart: FC<BarchartProps>;

export default Barchart;
