// Tipo de papel: Offset 80gr / Offset 90gr / Offset 100gr /  Offset 120gr / Offset 180gr /
// Estocado brillo 115 130 / 150 / 200 / 250 /
// Estocado mate / 115 / 130 / 150 / 200 / 250
// Formatos: Vertical, Horizontal, Cuadrado
// Tamaños verticales: 10x20 / A7 / A6 / A5 / A4 / A4 medio / 1/3 A3 / DVD / Maxi
// Tamaños horizontales: 20x10 A6 A5 A4 DVD
// Tamaños cuadrados: A6-cuadrado / A5-cuadrado / A4-cuadrado / 12x12

// 50 / 100 / 250 /500 / 750 / 1000 / 1500 / 2000 / 3000 / 5000

export default {
  paperType: [
    {
      default: true,
      name: 'Offset',
      code: 'offset-80',
      group: 'offset',
      description: '80 gr',
      factor: 1,
    },
    {
      name: 'Offset',
      code: 'offset-90',
      group: 'offset',
      description: '90 gr',
      factor: 1,
    },
    {
      name: 'Offset',
      code: 'offset-100',
      group: 'offset',
      description: '100 gr',
      factor: 1,
    },
    {
      name: 'Offset',
      code: 'offset-120',
      group: 'offset',
      description: '120 gr',
      factor: 1,
    },
    {
      name: 'Offset',
      code: 'offset-180',
      group: 'offset',
      description: '180 gr',
      factor: 1,
    },
    {
      name: 'Estucado brillo',
      code: 'estucado-brillo-115',
      group: 'estucado-brillo',
      description: '115 gr',
      factor: 1,
    },
    {
      name: 'Estucado brillo',
      code: 'estucado-brillo-130',
      group: 'estucado-brillo',
      description: '130 gr',
      factor: 1,
    },
    {
      name: 'Estucado brillo',
      code: 'estucado-brillo-150',
      group: 'estucado-brillo',
      description: '150 gr',
      factor: 1,
    },
    {
      name: 'Estucado brillo',
      code: 'estucado-brillo-200',
      group: 'estucado-brillo',
      description: '200 gr',
      factor: 1,
    },
    {
      name: 'Estucado brillo',
      code: 'estucado-brillo-250',
      group: 'estucado-brillo',
      description: '250 gr',
      factor: 1,
    },
    {
      name: 'Estucado mate',
      code: 'estucado-mate-115',
      group: 'estucado-mate',
      description: '115 gr',
      factor: 1,
    },
    {
      name: 'Estucado mate',
      code: 'estucado-mate-130',
      group: 'estucado-mate',
      description: '130 gr',
      factor: 1,
    },
    {
      name: 'Estucado mate',
      code: 'estucado-mate-150',
      group: 'estucado-mate',
      description: '150 gr',
      factor: 1,
    },
    {
      name: 'Estucado mate',
      code: 'estucado-mate-200',
      group: 'estucado-mate',
      description: '200 gr',
      factor: 1,
    },
    {
      name: 'Estucado mate',
      code: 'estucado-mate-250',
      group: 'estucado-mate',
      description: '250 gr',
      factor: 1,
    },
  ],

  format: [
    {
      default: true,
      name: 'Vertical',
      code: 'vertical',
      group: '1',
      description: 'Vertical',
      factor: 1,
    },
    {
      name: 'Horizontal',
      code: 'horizontal',
      group: '1',
      description: 'Horizontal',
      factor: 1,
    },
    {
      name: 'Cuadrado',
      code: 'cuadrado',
      group: '1',
      description: 'Cuadrado',
      factor: 1,
    },
  ],

  vertical_size: [
    {
      default: true,
      name: '10x21',
      description: '100x210',
      code: '10x21',
      width: 100,
      height: 210,
      group: '1',
    },
    {
      name: 'A7',
      code: 'a7',
      description: '74x105',
      width: 74,
      height: 105,
      group: '1',
    },
    {
      name: 'A6',
      code: 'a6',
      description: '105x148',
      width: 105,
      height: 148,
      group: '1',
    },
    {
      name: 'A5',
      code: 'a5',
      description: '148x210',
      width: 148,
      height: 210,
      group: '1',
    },
    {
      name: 'A4',
      code: 'a4',
      description: '210x297',
      width: 210,
      height: 297,
      group: '1',
    },
    {
      name: 'A4 medio',
      code: 'a4-medio',
      description: '105x297',
      width: 105,
      height: 297,
      group: '2',
    },
    {
      name: '1/3 A3',
      code: 'tercio-a3',
      description: '140x297',
      width: 140,
      height: 297,
      group: '2',
    },
    {
      name: 'DVD',
      code: 'dvd',
      description: '120x180',
      width: 120,
      height: 180,
      group: '2',
    },
    {
      name: 'Maxi',
      code: 'maxi',
      description: '125x235',
      width: 125,
      height: 235,
      group: '2',
    },
  ],

  horizontal_size: [
    {
      default: true,
      name: '20x10',
      description: '200x100',
      width: 200,
      height: 100,
      code: '20x10',
      group: '1',
    },
    {
      name: 'A6',
      code: 'a6-horizontal',
      description: '148x105',
      width: 148,
      height: 105,
      group: '1',
    },
    {
      name: 'A5',
      code: 'a5-horizontal',
      description: '210X148',
      width: 210,
      height: 148,
      group: '2',
    },

    {
      name: 'DVD',
      code: 'dvd-horizontal',
      description: '180x120',
      width: 180,
      height: 120,
      group: '2',
    },
  ],

  square_size: [
    {
      default: true,
      name: 'A6-cuadrado',
      code: 'a6-cuadrado',
      description: '105x105',
      width: 105,
      height: 105,
      group: '1',
    },
    {
      name: 'A5-cuadrado',
      code: 'a5-cuadrado',
      description: '148x148',
      width: 148,
      height: 148,
      group: '1',
    },
    {
      name: 'A4-cuadrado',
      code: 'a4-cuadrado',
      description: '210x210',
      width: 210,
      height: 210,
      group: '2',
    },
    {
      name: '12x12',
      code: '12x12',
      description: '120x120',
      width: 120,
      height: 120,
      group: '2',
    },
  ],

  copiesQuantity: [
    {
      default: true,
      name: '50',
      code: '50',
      group: '1',
    },
    {
      name: '100',
      code: '100',
      group: '1',
    },
    {
      name: '250',
      code: '250',
      group: '1',
    },
    {
      name: '500',
      code: '500',
      group: '1',
    },
    {
      name: '750',
      code: '750',
      group: '1',
    },
    {
      name: '1000',
      code: '1000',
      group: '2',
    },
    {
      name: '1500',
      code: '1500',
      group: '2',
    },
    {
      name: '2000',
      code: '2000',
      group: '2',
    },
    {
      name: '3000',
      code: '3000',
      group: '2',
    },
    {
      name: '5000',
      code: '5000',
      group: '2',
    },
  ],
};
