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
      name: 'Cartulina',
      group: 'cartulina',
      code: 'cartulina-240',
      description: '240 gr',
      factor: 1,
    },
    {
      name: 'Cartulina',
      group: 'cartulina',
      code: 'cartulina-315',
      description: '315 gr',
      factor: 1,
    },
    {
      name: 'Estucado mate',
      group: 'estucado-mate',
      code: 'estucado-mate-250',
      description: '250 gr',
      factor: 1,
    },
    {
      name: 'Estucado mate',
      group: 'estucado-mate',
      code: 'estucado-mate-300',
      description: '300 gr',
      factor: 1,
    },
    {
      name: 'Estucado mate',
      group: 'estucado-mate',
      code: 'estucado-mate-350',
      description: '350 gr',
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
      name: 'Estucado brillo',
      group: 'estucado-brillo',
      code: 'estucado-brillo-300',
      description: '300 gr',
      factor: 1,
    },

    {
      name: 'Estucado brillo',
      group: 'estucado-brillo',
      code: 'estucado-brillo-350',
      description: '350 gr',
      factor: 1,
    },
  ],

  finishType: [
    {
      default: true,

      name: 'Laminado brillo',
      code: 'laminado-brillo',
    },
    {
      name: 'Laminado mate',
      code: 'laminado-mate',
    },
    {
      name: 'Soft touch',
      code: 'soft-touch',
    },
    {
      name: 'Sin acabado',
      code: 'sin-acabado',
    },
  ],

  printQuantity: [
    {
      default: true,
      name: '100',
      code: '100',
      factor: 1,
      group: '1',
    },
    {
      name: '250',
      code: '250',
      factor: 2.5,
      group: '1',
    },
    {
      name: '500',
      code: '500',
      factor: 5,
      group: '1',
    },
    {
      name: '750',
      code: '750',
      factor: 7.5,
      group: '2',
    },
    {
      name: '1000',
      code: '1000',
      factor: 10,
      group: '2',
    },
    {
      name: '1500',
      code: '1500',
      factor: 15,
      group: '2',
    },
    {
      name: '2000',
      code: '2000',
      factor: 20,
      group: '3',
    },
    {
      name: '3000',
      code: '3000',
      factor: 30,
      group: '3',
    },
    {
      name: '5000',
      code: '5000',
      factor: 50,
      group: '3',
    },
  ],
};
