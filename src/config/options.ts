export default {
  paperSize: [
    { name: 'A3', code: 'A3' },
    { name: 'A4', code: 'A4', default: true },
  ],

  paperType: [
    { name: 'Normal', code: 'normal', factor: 0, default: true },
    { name: 'Cartulina', code: 'cartulina', factor: 0.1 },
    {
      name: 'Fortográfico',
      code: 'fotografico',
      factor: 0.15,
    },
  ],

  printType: [
    { name: 'Blanco y negro', code: 'blanco-negro', default: true },
    { name: 'Color', code: 'color' },
    { name: 'Color ECO', code: 'color-eco' },
  ],

  pagesPerSide: [
    {
      name: '1 página',
      factor: 1,
      code: '1',
      description: 'Por cara',
      default: true,
    },
    {
      name: '2 páginas',
      factor: 0.5,
      code: '2',
      description: 'Por cara',
    },
    {
      name: '4 páginas',
      factor: 0.25,
      code: '4',
      description: 'Por cara',
    },
  ],

  orientation: [
    {
      name: 'Vertical. Derecha-Izquierda',
      code: 'vertical-derecha-izquierda',
      default: true,
    },
    {
      name: 'Horizontal. Abajo-Arriba',
      code: 'horizontal-abajo-arriba',
    },
    {
      name: 'Vertical. Abajo-Arriba',
      code: 'vertical-abajo-arriba',
    },
    {
      name: 'Horizontal. Derecha-Izquierda',
      code: 'horizontal-derecha-izquierda',
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
      name: 'Encuadernado',
      code: 'encuadernado',
      description: 'En espiral',
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
    { id: 5, color: '#ffc0cb', name: 'Rosa pastel' },
    { id: 6, color: '#9370db', name: 'Lila pastel' },
    { id: 7, color: '#87cefa', name: 'Azul pastel' },
    { id: 8, color: '#ffa500', name: 'Naranja pastel' },
    { id: 9, color: '#ffff00', name: 'Amarillo pastel' },
    { id: 10, color: '#bdecb6', name: 'Verde pastel' },
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
    { id: 4, color: '#ffc0cb', name: 'Rosa pastel' },
    { id: 5, color: '#9370db', name: 'Lila pastel' },
    { id: 6, color: '#87cefa', name: 'Azul pastel' },
    { id: 7, color: '#ffa500', name: 'Naranja pastel' },
    { id: 8, color: '#ffff00', name: 'Amarillo pastel' },
    { id: 9, color: '#ff6961', name: 'Rojo' },
  ],

  bounds: [
    { name: 'Anillas', code: 'anillas', default: true },
    { name: 'Tapa delantera', code: 'tapa-delantera' },
    { name: 'Tapa trasera', code: 'tapa-trasera' },
  ],
};
