// Tamaños: A4 / A3 / A2 / A1 Tamaños personalizado (min: A4, max: 310x440)
// Tipo de papel: / Estucado mate y Estucado brillo / 115 / 130 / 150 / 200 / 250
// Tiradas: 50 / 100 / 150 / 200 / 250 / 300 / 400 / 500

export default {
  paperSize: [
    {
      default: true,
      name: 'A4',
      code: 'A4',
      group: '1',
      description: '210 x 297 mm',
      factor: 1,
    },
    {
      name: 'A3',
      code: 'A3',
      group: '1',
      description: '297 x 420 mm',
      factor: 1,
    },
    {
      name: 'A2',
      code: 'A2',
      group: '1',
      description: '420 x 594 mm',
      factor: 1,
    },
    {
      name: 'A1',
      code: 'A1',
      group: '2',
      description: '594 x 841 mm',
      factor: 1,
    },
    {
      name: 'Personalizado',
      code: 'custom',
      group: '2',
      factor: 1,
    },
  ],

  paperType: [
    {
      default: true,
      name: 'Estucado brillo',
      code: 'estucado-brillo',
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

  copiesQuantity: [
    {
      default: true,
      name: '50',
      code: '50',
      group: '1',
      factor: 1,
    },
    {
      name: '100',
      code: '100',
      group: '1',
      factor: 1,
    },
    {
      name: '150',
      code: '150',
      group: '1',
      factor: 1,
    },
    {
      name: '200',
      code: '200',
      group: '1',
      factor: 1,
    },
    {
      name: '250',
      code: '250',
      group: '2',
      factor: 1,
    },
    {
      name: '300',
      code: '300',
      group: '2',
      factor: 1,
    },
    {
      name: '400',
      code: '400',
      group: '2',
      factor: 1,
    },
    {
      name: '500',
      code: '500',
      group: '2',
      factor: 1,
    },
  ],
};
