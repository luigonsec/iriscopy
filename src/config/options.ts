export default {
  paperSize: [
    {
      name: 'A3',
      code: 'A3',
      description: '29.7cm x 42cm',
    },
    {
      name: 'A4',
      code: 'A4',
      description: '21cm x 29.7cm',
      default: true,
    },
  ],

  paperType: [
    {
      name: 'Normal',
      code: 'normal',
      description: '80 grs',
      default: true,
    },
    {
      name: 'Cartulina',
      code: 'cartulina (Blanca)',
      description: '180 grs',
    },
    {
      name: 'Fotográfico',
      description: '250 grs',
      code: 'fotografico',
    },
  ],

  printType: [
    {
      name: 'B/N',
      code: 'blanco-negro',
      default: true,
      description: 'Escala de grises',
      image: 'assets/images/colors/bn.png',
    },
    {
      name: 'Color',
      code: 'color',
      description: 'Color CMYK',
      image: 'assets/images/colors/color.png',
    },
    {
      name: 'Color PRO',
      code: 'color-pro',
      image: 'assets/images/colors/color_pro.png',
      description: 'Full color',
    },
  ],

  printForm: [
    {
      default: true,
      name: 'Una cara',
      code: 'una-cara',
      description: 'Por una cara del papel',
    },
    {
      name: 'Doble cara',
      code: 'doble-cara',
      description: 'Por ambas caras del papel',
    },
  ],

  pagesPerSide: [
    {
      name: '1 página',
      code: '1_vertical',
      description: 'Por cara',
      image: 'assets/images/pagesPerSide/ppc_v_1',
      default: true,
    },
    {
      name: '1 página',
      code: '1_horizontal',
      description: 'Por cara',
      image: 'assets/images/pagesPerSide/ppc_h_1',
      default: true,
    },
    {
      name: '2 páginas',
      code: '2_horizontal',
      image: 'assets/images/pagesPerSide/ppc_h_2',
      description: 'Por cara',
    },
    {
      name: '2 páginas',
      code: '2_vertical',
      image: 'assets/images/pagesPerSide/ppc_v_2',
      description: 'Por cara',
    },
    {
      name: '4 páginas',
      code: '4_horizontal',
      image: 'assets/images/pagesPerSide/ppc_h_4',
      description: 'Por cara',
    },
  ],

  orientation: [
    {
      name: 'Vertical. Derecha-Izquierda',
      code: 'vertical-derecha-izquierda',
      image: 'assets/images/orientations/o_vdi',
      default: true,
    },
    {
      name: 'Vertical. Abajo-Arriba',
      code: 'vertical-abajo-arriba',
      image: 'assets/images/orientations/o_vaa',
    },
    {
      name: 'Horizontal. Abajo-Arriba',
      code: 'horizontal-abajo-arriba',
      image: 'assets/images/orientations/o_haa',
    },

    {
      name: 'Horizontal. Derecha-Izquierda',
      code: 'horizontal-derecha-izquierda',
      image: 'assets/images/orientations/o_hdi',
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
      name: 'Plastificado',
      code: 'plastificado',
    },
    {
      name: 'Encuadernado',
      code: 'encuadernado',
      description: 'En espiral',
    },
    {
      name: 'Cuatro Taladros',
      code: 'cuatro-taladros',
    },
  ],

  boundTypes: [
    {
      name: 'Individualmente',
      code: 'individual',
      description: 'Por separado',
      default: true,
    },
    {
      name: 'Agrupados',
      code: 'agrupados',
      description: 'Todos en uno',
    },
  ],

  boundPages: [
    {
      name: 'No',
      code: 'no',
      default: true,
    },
    {
      name: 'Por delante',
      code: 'delante',
    },
    {
      name: 'Por detrás',
      code: 'detras',
    },
    {
      name: 'Ambos',
      code: 'ambos',
    },
  ],

  colorsRings: [
    {
      id: 1,
      color:
        'radial-gradient(circle at 10% 20%, rgb(0, 0, 0) 0%, rgb(64, 64, 64) 90.2%)',
      name: 'Metálica negra',
      advice:
        '(Máximo 600 hojas a doble cara ó 350 hojas a una cara. Para más cantidad dividir el documento)',
      code: 'metalica-negra',
      image: 'assets/images/rings/negra.png',
      default: true,
    },
    {
      id: 2,
      color: '#000080',
      name: 'Azul oscuro',
      code: 'azul-oscuro',
      image: 'assets/images/rings/azul.png',
    },
    {
      id: 3,
      color: '#9fd8e6',
      name: 'Azul pastel',
      code: 'azul-pastel',
      image: 'assets/images/rings/azul-pastel.png',
    },
    {
      id: 4,
      color: '#BDECB6',
      name: 'Verde agua',
      code: 'verde-agua',
      image: 'assets/images/rings/verde-pastel.png',
    },
    {
      id: 5,
      color: '#008F39',
      name: 'Verde oscuro',
      code: 'verde-oscuro',
      image: 'assets/images/rings/verde-oscuro.png',
    },
    {
      id: 6,
      color: '#800080',
      name: 'Morado',
      code: 'morado',
      image: 'assets/images/rings/morado.png',
    },
    {
      id: 7,
      color: '#d29bfd',
      name: 'Lila',
      code: 'lila',
      image: 'assets/images/rings/lila.png',
    },
    {
      id: 8,
      color: '#FF0080',
      name: 'Rosa fuscia',
      code: 'rosa-fucsia',
      image: 'assets/images/rings/rosa.png',
    },

    {
      id: 9,
      color: 'yellow',
      name: 'Amarillo',
      code: 'amarillo',
      image: 'assets/images/rings/amarillo.png',
    },
    {
      id: 10,
      color: 'red',
      name: 'Rojo',
      code: 'rojo',
      image: 'assets/images/rings/rojo.png',
    },
    {
      id: 11,
      color: '#FF0080',
      name: 'Rosa pastel',
      code: 'rosa-pastel',
      image: 'assets/images/rings/rosa-pastel.png',
    },
  ],

  colorsCover: [
    {
      id: 1,
      sides: ['delantera'],
      color:
        'repeating-linear-gradient(-45deg,white,white 4px,rgba(0,0,0,.1) 4px,rgba(0,0,0,.1) 9px)',
      name: 'Acetato transparente',
      code: 'acetato-transparente',
      default: true,
      image: 'assets/images/bounds/transparente.png',
    },

    {
      id: 2,
      sides: ['trasera'],
      color: '#1c1c1c',
      name: 'Negra gofrada',
      code: 'negra-grofada',
      default: true,
      image: 'assets/images/bounds/negra.png',
    },
    {
      id: 3,
      sides: ['delantera', 'trasera'],
      color: '#b6ecda',
      name: 'Verde agua',
      code: 'verde-agua',
      image: 'assets/images/bounds/verde-pastel.png',
    },
    {
      id: 4,
      sides: ['delantera', 'trasera'],
      color: '#39ff14',
      name: 'Verde flúor',
      code: 'verde-fluor',
      image: 'assets/images/bounds/verde-neon.png',
    },
    {
      id: 6,
      sides: ['delantera', 'trasera'],
      color: '#FF0080',
      name: 'Rosa fucsia',
      code: 'rosa-fucsia',
      image: 'assets/images/bounds/rosa.png',
    },
    {
      id: 7,
      sides: ['delantera', 'trasera'],
      color: '#FDFD96',
      name: 'Amarillo pastel',
      code: 'amarillo-pastel',
      image: 'assets/images/bounds/amarillo-pastel.png',
    },
    {
      id: 8,
      sides: ['delantera', 'trasera'],
      color: '#ff8000',
      name: 'Naranja',
      code: 'naranja',
      image: 'assets/images/bounds/melocoton.png',
    },
    {
      id: 10,
      sides: ['delantera', 'trasera'],
      color: '#9fd8e6',
      name: 'Azul pastel',
      code: 'azul-pastel',
      image: 'assets/images/bounds/azul-pastel.png',
    },
    {
      id: 11,
      sides: ['delantera', 'trasera'],
      color: '#ff91a4',
      name: 'Rosa salmón',
      code: 'rosa-salmon',
      image: 'assets/images/bounds/rosa-salmon.png',
    },
    {
      id: 12,
      color: '#800080',
      name: 'Morado',
      code: 'morado',
      sides: ['delantera', 'trasera'],
      image: 'assets/images/bounds/morado.png',
    },
    {
      id: 13,
      color: '#800080',
      name: 'Lila',
      code: 'lila',
      sides: ['delantera', 'trasera'],
      image: 'assets/images/bounds/lila.png',
    },
  ],

  bounds: [
    { name: 'Anillas', code: 'anillas', default: true },
    { name: 'Tapa delantera', code: 'tapa-delantera' },
    { name: 'Tapa trasera', code: 'tapa-trasera' },
  ],
};
