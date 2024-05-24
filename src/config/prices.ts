export default {
  'color-pro': {
    'una-cara': {
      A4: (paginas) => {
        if (paginas <= 20) return 0.12;
        if (paginas <= 50) return 0.1;
        if (paginas <= 150) return 0.095;
        return 0.09;
      },
      A3: (paginas) => {
        if (paginas <= 20) return 0.28;
        if (paginas <= 50) return 0.26;
        if (paginas <= 150) return 0.24;
        return 0.228;
      },
    },
    'doble-cara': {
      A4: (paginas) => {
        if (paginas <= 20) return 0.12;
        if (paginas <= 50) return 0.1;
        if (paginas <= 150) return 0.095;
        return 0.09;
      },
      A3: (paginas) => {
        if (paginas <= 20) return 0.28;
        if (paginas <= 50) return 0.26;
        if (paginas <= 150) return 0.24;
        return 0.228;
      },
    },
  },
  'blanco-negro': {
    'una-cara': {
      A4: (paginas) => {
        if (paginas <= 50) return 0.034;
        if (paginas <= 100) return 0.031;
        if (paginas <= 250) return 0.029;
        if (paginas <= 500) return 0.027;
        return 0.025;
      },
      A3: (paginas) => {
        if (paginas <= 50) return 0.08;
        if (paginas <= 100) return 0.076;
        if (paginas <= 250) return 0.072;
        if (paginas <= 500) return 0.068;
        return 0.066;
      },
    },
    'doble-cara': {
      A4: (paginas) => {
        if (paginas <= 50) return 0.03;
        if (paginas <= 100) return 0.026;
        if (paginas <= 250) return 0.023;
        if (paginas <= 500) return 0.021;
        return 0.019;
      },
      A3: (paginas) => {
        if (paginas <= 50) return 0.068;
        if (paginas <= 100) return 0.062;
        if (paginas <= 250) return 0.056;
        if (paginas <= 500) return 0.052;
        return 0.048;
      },
    },
  },
  color: {
    'una-cara': {
      A4: (paginas) => {
        if (paginas <= 25) return 0.075;
        if (paginas <= 75) return 0.072;
        if (paginas <= 150) return 0.07;
        if (paginas <= 300) return 0.065;
        return 0.06;
      },
      A3: (paginas) => {
        if (paginas <= 50) return 0.16;
        if (paginas <= 100) return 0.15;
        if (paginas <= 250) return 0.144;
        if (paginas <= 500) return 0.14;
        return 0.136;
      },
    },
    'doble-cara': {
      A4: (paginas) => {
        if (paginas <= 25) return 0.065;
        if (paginas <= 75) return 0.058;
        if (paginas <= 150) return 0.055;
        if (paginas <= 300) return 0.052;
        return 0.049;
      },
      A3: (paginas) => {
        if (paginas <= 50) return 0.15;
        if (paginas <= 100) return 0.14;
        if (paginas <= 250) return 0.13;
        if (paginas <= 500) return 0.124;
        return 0.116;
      },
    },
  },
};
