import { OrderCopy } from './OrderCopy';
import Carpeta from './Carpeta';
import Flyer from './Flyer';
import OrderProduct from './OrderProduct';
import TarjetaVisita from './TarjetaVisita';
import Diptico from './Diptico';
import Triptico from './Triptico';
import Rollup from './Rollup';

export default interface Cart {
  copies: OrderCopy[];
  products: OrderProduct[];
  bussinessCard: TarjetaVisita[];
  flyers: Flyer[];
  folders: Carpeta[];
  diptychs: Diptico[];
  triptychs: Triptico[];
  rollups: Rollup[];
}
