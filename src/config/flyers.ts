// Impresión: Una cara / Doble cara
// Tipo de papel: Offset 80gr / Offset 90gr / Offset 100gr /  Offset 120gr / Offset 180gr / Estocado brillo 115gr / Estocado brillo 130 / 150 / 200 / 250 /  Estocado mate / 115 / 130 / 150 / 200 / 250
// Tamaños: A7 / A6 / A5 / A4 / 10x21 / Personalizado (min: 50mmx50mm, max: 440x310)
// Tirada: 50 / 100 / 250 / 500 / 750 / 1000 / 1500 / 2000 / 3000 / 5000

export default {
  printForm: [
    {
      default: true,
      name: 'Una cara',
      code: 'una-cara',
      description: 'Por una cara del papel',
      factor: 1,
    },
    {
      name: 'Doble cara',
      code: 'doble-cara',
      description: 'Por ambas caras del papel',
      factor: 0.5,
    },
  ],

  paperType: [
    {
      default: true,
      name: 'Offset',
      group: 'offset',
      code: 'offset-80',
      description: '80 gr',
      factor: 1,
    },
    {
      name: 'Offset',
      group: 'offset',
      code: 'offset-90',
      description: '90 gr',
      factor: 1,
    },
    {
      name: 'Offset',
      group: 'offset',
      code: 'offset-100',
      description: '100 gr',
      factor: 1,
    },
    {
      name: 'Offset',
      group: 'offset',
      code: 'offset-120',
      description: '120 gr',
      factor: 1,
    },
    {
      name: 'Offset',
      group: 'offset',
      code: 'offset-180',
      description: '180 gr',
      factor: 1,
    },
    {
      name: 'Estucado brillo',
      group: 'estucado-brillo',
      code: 'estucado-brillo-115',
      description: '115 gr',
      factor: 1,
    },
    {
      name: 'Estucado brillo',
      group: 'estucado-brillo',
      code: 'estucado-brillo-130',
      description: '130 gr',
      factor: 1,
    },
    {
      name: 'Estucado brillo',
      group: 'estucado-brillo',
      code: 'estucado-brillo-150',
      description: '150 gr',
      factor: 1,
    },
    {
      name: 'Estucado brillo',
      group: 'estucado-brillo',
      code: 'estucado-brillo-200',
      description: '200 gr',
      factor: 1,
    },
    {
      name: 'Estucado brillo',
      group: 'estucado-brillo',
      code: 'estucado-brillo-250',
      description: '250 gr',
      factor: 1,
    },
    {
      name: 'Estucado mate',
      group: 'estucado-mate',
      code: 'estucado-mate-115',
      description: '115 gr',
      factor: 1,
    },
    {
      name: 'Estucado mate',
      group: 'estucado-mate',
      code: 'estucado-mate-130',
      description: '130 gr',
      factor: 1,
    },
    {
      name: 'Estucado mate',
      group: 'estucado-mate',
      code: 'estucado-mate-150',
      description: '150 gr',
      factor: 1,
    },
    {
      name: 'Estucado mate',
      group: 'estucado-mate',
      code: 'estucado-mate-200',
      description: '200 gr',
      factor: 1,
    },
    {
      name: 'Estucado mate',
      group: 'estucado-mate',
      code: 'estucado-mate-250',
      description: '250 gr',
      factor: 1,
    },
  ],

  size: [
    {
      default: true,
      name: 'A7',
      code: 'a7',
      description: '74 x 105 mm',
      factor: 1,
      group: '1',
    },
    {
      name: 'A6',
      code: 'a6',
      description: '105 x 148 mm',
      factor: 1,
      group: '1',
    },
    {
      name: 'A5',
      code: 'a5',
      description: '148 x 210 mm',
      factor: 1,
      group: '1',
    },
    {
      name: 'A4',
      code: 'a4',
      description: '210 x 297 mm',
      factor: 1,
      group: '2',
    },
    {
      name: '10x21 cm',
      code: '10x21-cm',
      description: '100 x 210 mm',
      factor: 1,
      group: '2',
    },
    {
      name: 'Personalizado',
      code: 'personalizado',
      factor: 1,
      group: '2',
    },
  ],

  printQuantity: [
    {
      default: true,
      name: '50',
      code: '50',
      factor: 1,
    },
    {
      name: '100',
      code: '100',
      factor: 1,
    },
    {
      name: '250',
      code: '250',
      factor: 1,
    },
    {
      name: '500',
      code: '500',
      factor: 1,
    },
    {
      name: '750',
      code: '750',
      factor: 1,
    },
    {
      name: '1000',
      code: '1000',
      factor: 1,
    },
    {
      name: '1500',
      code: '1500',
      factor: 1,
    },
    {
      name: '2000',
      code: '2000',
      factor: 1,
    },
    {
      name: '3000',
      code: '3000',
      factor: 1,
    },
    {
      name: '5000',
      code: '5000',
      factor: 1,
    },
  ],
};
