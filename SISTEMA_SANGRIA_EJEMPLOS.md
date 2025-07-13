# Sistema de Validación con Sangría - Ejemplos de Dimensiones

## ¿Qué es la Sangría de Impresión?

La sangría (bleed) es un margen adicional de **3mm por cada lado** que se añade a las dimensiones del archivo para asegurar que no queden bordes blancos después del corte final.

- **Sangría por lado**: 3mm
- **Sangría total**: 6mm (3mm + 3mm por cada dimensión)

## Clasificación de Productos

### 📄 **Productos NO Plegables** (Tamaño Final Directo)

- **Flyers**: Las dimensiones configuradas son las finales del producto
- **Carpetas**: Las dimensiones configuradas son las finales del producto
- **Tarjetas de Visita**: Las dimensiones configuradas son las finales del producto

### 📄 **Productos Plegables** (Requieren Tamaño Abierto)

- **Dípticos**: Se pliegan por la mitad (x2)
- **Trípticos**: Se pliegan en tres partes (x3)

## Ejemplos por Tipo de Producto

### 📄 **Tarjetas de Visita** (NO Plegable)

- **Tamaño final**: 91x61mm
- **Archivo requerido**: 97x67mm (91+6 x 61+6)

### 📋 **Carpetas** (NO Plegable)

- **Tamaño A4**: 210x297mm
- **Archivo requerido**: 216x303mm (210+6 x 297+6)

### 📄 **Flyers** (NO Plegable)

Para un flyer A5 (148x210mm):

- **Tamaño final**: 148x210mm
- **Archivo requerido**: 154x216mm (148+6 x 210+6)

**Orientación Vertical:**

- Tamaño cerrado: 148x210mm
- Tamaño abierto: 148x420mm (se abre hacia arriba/abajo, 2 paneles: 210x2=420)
- **Archivo requerido**: 154x426mm (148+6 x 420+6)

**Orientación Horizontal:**

- Tamaño cerrado: 148x210mm
- Tamaño abierto: 296x210mm (se abre hacia los lados, 2 paneles: 148x2=296)
- **Archivo requerido**: 302x216mm (296+6 x 210+6)

### 📄 **Dípticos** (Plegable x2)

Para un díptico A5 cerrado (148x210mm):

**Orientación Vertical:**

- Tamaño cerrado: 148x210mm
- Tamaño abierto: 148x420mm (se abre hacia arriba/abajo: 210x2=420)
- **Archivo requerido**: 154x426mm (148+6 x 420+6)

**Orientación Horizontal:**

- Tamaño cerrado: 148x210mm
- Tamaño abierto: 296x210mm (se abre hacia los lados: 148x2=296)
- **Archivo requerido**: 302x216mm (296+6 x 210+6)

### 📄 **Trípticos** (Tamaño Abierto)

Para un tríptico A5 (148x210mm cerrado):

**Orientación Vertical:**

- Tamaño cerrado: 148x210mm
- Tamaño abierto: 148x630mm (se abre hacia arriba/abajo, 3 paneles: 210x3=630)
- **Archivo requerido**: 154x636mm (148+6 x 630+6)

**Orientación Horizontal:**

- Tamaño cerrado: 148x210mm
- Tamaño abierto: 444x210mm (se abre hacia los lados, 3 paneles: 148x3=444)
- **Archivo requerido**: 450x216mm (444+6 x 210+6)

## Configuración del Sistema

## Configuración del Sistema

### Productos NO Plegables (`isOpenSize: false`)

- **Flyers**: Se usan las dimensiones exactas configuradas + sangría
- **Carpetas**: Se usan las dimensiones exactas configuradas + sangría
- **Tarjetas de Visita**: Se usan las dimensiones exactas (91x61mm) + sangría

### Productos Plegables (`isOpenSize: true`)

- **Dípticos**: Las dimensiones se multiplican x2 según orientación + sangría
- **Trípticos**: Las dimensiones se multiplican x3 según orientación + sangría

### Todos Requieren Sangría (`requiresBleed: true`)

Todos los productos añaden automáticamente 6mm (3mm por cada lado) a las dimensiones calculadas.

## Mensajes de Error Informativos

El sistema genera mensajes específicos como:

**Para Flyers A5:**

```
Las dimensiones del archivo no coinciden con ningún tamaño disponible
Esperado: 154x216mm (A5 con sangría)
Actual: 148x210mm
```

**Para Dípticos A5 Horizontal:**

```
Las dimensiones del archivo no coinciden con ningún tamaño disponible
Esperado: 302x216mm (A5 con sangría abierto)
Actual: 296x210mm
```

## Flujo de Cálculo de Dimensiones

1. **Dimensiones base**: Se toman del archivo de configuración (ej: Carpeta = 220x305mm)
2. **Tamaño abierto** (si aplica): Se calcula según orientación detectada sobre las dimensiones base
3. **Sangría**: Se añaden 6mm a ambas dimensiones del resultado final
4. **Validación**: Se compara con las dimensiones del archivo subido

**Ejemplo Carpeta Estándar:**

- Tamaño base: 220x305mm
- Tamaño abierto: 440x305mm (220x2 x 305) - se multiplica por 2 el ancho
- Con sangría: 446x311mm (440+6 x 305+6)
- **Archivo requerido**: 446x311mm

Este sistema asegura que todos los archivos tengan las dimensiones correctas para impresión profesional con sangría incluida.
