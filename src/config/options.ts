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
        'radial-gradient(circle at 10% 20%, rgb(0, 0, 0) 0%, rgb(64, 64, 64) 90.2%)',
			name: 'Metálica negra',
			factor: 0,
			default: true,
		},
		{
			id: 2,
			color: '#000080',
			name: 'Azul oscuro',
			factor: 0.25,
		},
		{ id: 3, color: '#9fd8e6', name: 'Azul pastel', factor: 0.25 },
		{ id: 4, color: '#BDECB6', name: 'Verde agua', factor: 0.25 },
		{ id: 5, color: '#008F39', name: 'Verde oscuro', factor: 0.25 },
		{ id: 6, color: '#800080', name: 'Morado', factor: 0.25 },
		{ id: 7, color: '#d29bfd', name: 'Lila', factor: 0.25 },
		{ id: 8, color: '#FF0080', name: 'Rosa fuscia', factor: 0.25 },
		{ id: 9, color: 'yellow', name: 'Amarillo', factor: 0.25 },
		{ id: 10, color: 'red', name: 'Rojo', factor: 0.25 },
	],

	colorsCover: [
		{
			id: 1,
			sides: ['delantera'],

			color:
        'repeating-linear-gradient(-45deg,white,white 4px,rgba(0,0,0,.1) 4px,rgba(0,0,0,.1) 9px)',
			name: 'Acetato transparente',
			default: true,
			factor: 0,
		},

		{
			id: 2,
			sides: ['trasera'],
			color: '#1c1c1c',
			name: 'Negra gofrada',
			factor: 0,
			default: true,
		},
		{
			id: 3,
			sides: ['delantera', 'trasera'],
			color: '#b6ecda',
			name: 'Verde agua',
			factor: 0.25,
		},
		{
			id: 4,
			sides: ['delantera', 'trasera'],
			color: '#39ff14',
			name: 'Verde flúor',
			factor: 0.25,
		},
		{
			id: 5,
			sides: ['delantera', 'trasera'],
			color: '#008F39',
			name: 'Verde oscuro',
			factor: 0.25,
		},
		{
			id: 6,
			sides: ['delantera', 'trasera'],
			color: '#FF0080',
			name: 'Rosa fucsia',
			factor: 0.25,
		},
		{
			id: 7,
			sides: ['delantera', 'trasera'],
			color: '#FDFD96',
			name: 'Amarillo pastel',
			factor: 0.25,
		},
		{
			id: 8,
			sides: ['delantera', 'trasera'],
			color: '#ff8000',
			name: 'Naranja',
			factor: 0.25,
		},
		{
			id: 9,
			sides: ['delantera', 'trasera'],
			color: '#000080',
			name: 'Azul oscuro',
			factor: 0.25,
		},
		{
			id: 10,
			sides: ['delantera', 'trasera'],
			color: '#9fd8e6',
			name: 'Azul pastel',
			factor: 0.25,
		},
		{
			id: 11,
			sides: ['delantera', 'trasera'],
			color: '#ff91a4',
			name: 'Rosa salmón',
			factor: 0.25,
		},
		{
			id: 12,
			color: '#800080',
			name: 'Morado',
			sides: ['delantera', 'trasera'],
			factor: 0.25,
		},
	],

	bounds: [
		{ name: 'Anillas', code: 'anillas', default: true },
		{ name: 'Tapa delantera', code: 'tapa-delantera' },
		{ name: 'Tapa trasera', code: 'tapa-trasera' },
	],
};
