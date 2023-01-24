export default {
  paperSize: [
    { name: 'A3', code: 'A3' },
    { name: 'A4', code: 'A4', default: true },
  ],

  paperType: [
    {
      name: 'Normal',
      code: 'normal',
      factor: 0,
      description: '80 grs',
      default: true,
    },
    {
      name: 'Cartulina',
      code: 'cartulina',
      description: '180 grs',
      factor: 0.1,
    },
    {
      name: 'Fotográfico',
      description: '250 grs',
      code: 'fotografico',
      factor: 0.15,
    },
  ],

  printType: [
    { name: 'Blanco y negro', code: 'blanco-negro', default: true },
    { name: 'Color', code: 'color' },
    { name: 'Color ECO', code: 'color-eco' },
  ],

  printForm: [
    {
      default: true,
      name: 'Una cara',
      code: 'una-cara',
      factor: 1,
      description: 'Por una cara del papel',
    },
    {
      name: 'Doble cara',
      code: 'doble-cara',
      factor: 1,
      description: 'Por ambas caras del papel',
    },
  ],

  pagesPerSide: [
    {
      name: '1 página',
      factor: 1,
      code: '1_vertical',
      description: 'Por cara',
      image: 'ppc_v_1',
      default: true,
    },
    {
      name: '2 páginas',
      factor: 0.5,
      code: '2_horizontal',
      image: 'ppc_h_2',
      description: 'Por cara',
    },
    {
      name: '2 páginas',
      factor: 0.5,
      code: '2_vertical',
      image: 'ppc_v_2',
      description: 'Por cara',
    },
    {
      name: '4 páginas',
      factor: 0.25,
      code: '4_horizontal',
      image: 'ppc_h_4',
      description: 'Por cara',
    },
  ],

  orientation: [
    {
      name: 'Vertical. Derecha-Izquierda',
      code: 'vertical-derecha-izquierda',
      image: 'o_vdi',
      default: true,
    },
    {
      name: 'Horizontal. Abajo-Arriba',
      code: 'horizontal-abajo-arriba',
      image: 'o_haa',
    },
    {
      name: 'Vertical. Abajo-Arriba',
      code: 'vertical-abajo-arriba',
      image: 'o_vaa',
    },
    {
      name: 'Horizontal. Derecha-Izquierda',
      code: 'horizontal-derecha-izquierda',
      image: 'o_hdi',
    },
  ],

  finishType: [
    {
      name: 'Sin acabado',
      code: 'sin-acabado',
      description: 'Folios sueltos',
      default: true,
    },
    {
      name: 'Grapado',
      code: 'grapado',
      description: 'En esquina',
    },
    {
      name: 'Dos Taladros',
      code: 'dos-taladros',
    },
    {
      name: 'Cuatro Taladros',
      code: 'cuatro-taladros',
    },
    {
      name: 'Encuadernado',
      code: 'encuadernado',
      description: 'En espiral',
      factor: 1.2,
    },
  ],

  boundTypes: [
    {
      name: 'Individualmente',
      code: 'individual',
      description: 'Por cada documento',
      default: true,
    },
    {
      name: 'Agrupados',
      code: 'agrupados',
      description: 'Todos en uno',
    },
  ],
  colorsRings: [
    {
      id: 1,
      color:
        'repeating-linear-gradient(-45deg,white,white 4px,rgba(0,0,0,.1) 4px,rgba(0,0,0,.1) 9px)',
      name: 'Transparente',
      default: true,
    },
    { id: 2, color: 'white', name: 'Blanco' },
    { id: 3, color: 'black', name: 'Negro' },
    { id: 4, color: '#40e0d0', name: 'Turquesa' },
    { id: 5, color: '#ffc0cb', name: 'Rosa pastel', factor: 0.2 },
    { id: 6, color: '#9370db', name: 'Lila pastel', factor: 0.2 },
    { id: 7, color: '#87cefa', name: 'Azul pastel', factor: 0.2 },
    { id: 8, color: '#ffa500', name: 'Naranja pastel', factor: 0.2 },
    { id: 9, color: '#ffff00', name: 'Amarillo pastel', factor: 0.2 },
    { id: 10, color: '#bdecb6', name: 'Verde pastel', factor: 0.2 },
    { id: 11, color: '#ff6961', name: 'Rojo' },
  ],

  colorsCover: [
    {
      id: 1,
      color:
        'repeating-linear-gradient(-45deg,white,white 4px,rgba(0,0,0,.1) 4px,rgba(0,0,0,.1) 9px)',
      name: 'Transparente',
      default: true,
    },
    { id: 2, color: 'black', name: 'Negro' },
    { id: 3, color: '#40e0d0', name: 'Turquesa' },
    { id: 4, color: '#ffc0cb', name: 'Rosa pastel', factor: 0.2 },
    { id: 5, color: '#9370db', name: 'Lila pastel', factor: 0.2 },
    { id: 6, color: '#87cefa', name: 'Azul pastel', factor: 0.2 },
    { id: 7, color: '#ffa500', name: 'Naranja pastel', factor: 0.2 },
    { id: 8, color: '#ffff00', name: 'Amarillo pastel', factor: 0.2 },
    { id: 9, color: '#ff6961', name: 'Rojo' },
  ],

  bounds: [
    { name: 'Anillas', code: 'anillas', default: true },
    { name: 'Tapa delantera', code: 'tapa-delantera' },
    { name: 'Tapa trasera', code: 'tapa-trasera' },
  ],
};
