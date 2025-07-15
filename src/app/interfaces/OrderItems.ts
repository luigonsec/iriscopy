import { OrderCopy } from './OrderCopy';
import OrderProduct from './OrderProduct';
import Flyer from './Flyer';
import TarjetaVisita from './TarjetaVisita';
import Carpeta from './Carpeta';
import Diptico from './Diptico';
import Triptico from './Triptico';
import Rollup from './Rollup';
import Cartel from './Cartel';
import Revista from './Revista';

export interface OrderItems {
  copies?: OrderCopy[];
  products?: OrderProduct[];
  flyers?: Flyer[];
  businessCards?: TarjetaVisita[];
  folders?: Carpeta[];
  diptychs?: Diptico[];
  triptychs?: Triptico[];
  rollups?: Rollup[];
  posters?: Cartel[];
  magazines?: Revista[];
}
