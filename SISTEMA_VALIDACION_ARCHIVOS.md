# Sistema de Validación de Archivos para Productos de Imprenta

## Descripción General

Se ha implementado un sistema genérico y reutilizable para validar archivos PDF en diferentes productos de imprenta. El sistema verifica automáticamente las dimensiones y número de páginas de los archivos, y configura automáticamente las opciones del formulario según las características detectadas.

## Componentes del Sistema

### 1. FileValidator (`src/app/_helpers/file-validator.ts`)

Clase principal que realiza las validaciones según la configuración del producto.

**Características principales:**

- Validación del número de páginas
- Validación de dimensiones de página
- Detección automática de orientación (vertical, horizontal, cuadrado)
- Búsqueda de tamaños coincidentes
- Generación de mensajes de error específicos

### 2. FileValidatorFactory

Factory pattern para crear validadores específicos para cada tipo de producto.

**Métodos disponibles:**

- `createFlyerValidator(flyerOptions)` - Para flyers
- `createCarpetaValidator(carpetaOptions)` - Para carpetas
- `createDipticoValidator(dipticoOptions)` - Para dípticos
- `createTripticoValidator(tripticoOptions)` - Para trípticos

### 3. FormBase (Actualizada)

Clase base extendida con funcionalidades de validación genérica.

**Nuevas funcionalidades:**

- Configuración automática de validadores
- Manejo centralizado de errores de validación
- Métodos abstractos para configuración automática
- Integración con MessageService para mostrar errores

## Configuración por Tipo de Producto

### Flyers y Carpetas

- **Páginas permitidas:** 1 o 2
- **Validación:** Dimensiones deben coincidir con tamaños disponibles
- **Configuración automática:**
  - 1 página → printForm: "una-cara"
  - 2 páginas → printForm: "doble-cara"
  - Tamaño detectado → paperSize preseleccionado y bloqueado

### Dípticos y Trípticos

- **Páginas permitidas:** Exactamente 2
- **Validación:** Dimensiones deben coincidir con tamaños disponibles por orientación
- **Configuración automática:**
  - Detección de orientación (vertical/horizontal/cuadrado)
  - Orientación → format preseleccionado y bloqueado
  - Tamaño detectado → paperSize preseleccionado y bloqueado

## Flujo de Validación

1. **Usuario sube archivo** → Se ejecuta `validateFiles()`
2. **Validación básica** → Verificar que hay archivos
3. **Validación específica** → FileValidator valida según configuración del producto
4. **Manejo de errores** → Si hay errores, se muestran mensajes y se rechaza el archivo
5. **Configuración automática** → Si es válido, se aplican configuraciones automáticas
6. **Bloqueo de controles** → Se deshabilitan los selectores configurados automáticamente

## Métodos de Configuración Automática

Cada componente puede implementar estos métodos para personalizar la configuración automática:

```typescript
protected setRecommendedPrintForm(printFormCode: string): void {
  // Configurar automáticamente el tipo de impresión
}

protected setDetectedSize(paperSize: any): void {
  // Configurar automáticamente el tamaño del papel
}

protected setDetectedOrientation(orientation: string): void {
  // Configurar automáticamente la orientación
}

public undoPresetProperties(): void {
  // Restaurar controles cuando se elimina un archivo
}
```

## Mensajes de Error

El sistema genera mensajes de error específicos y descriptivos:

- **Número de páginas incorrecto:** "El archivo debe tener 1 o 2 páginas"
- **Dimensiones incorrectas:** "Las dimensiones del archivo no coinciden con ningún tamaño disponible"
- **Orientación no válida:** "No se encontró un tamaño válido para la orientación detectada"
- **Páginas inconsistentes:** "Todas las páginas deben tener las mismas dimensiones"

## Ejemplo de Uso

```typescript
export class ViewFlyersComponent extends FormBase<Flyer> {
  constructor(public pricesService: PricesService, public shopCart: ShopcartService, public messageService: MessageService) {
    super();

    // Configurar validador y servicio de mensajes
    this.setFileValidator(FileValidatorFactory.createFlyerValidator(flyerOptions));
    this.setMessageService(messageService);
  }

  protected setRecommendedPrintForm(printFormCode: string): void {
    const option = this.flyerOptions.printForm.find((x) => x.code === printFormCode);
    if (option && this.printFormSelector) {
      this.printFormSelector.setUpOption(option);
      this.printFormSelector.disable();
    }
  }

  public undoPresetProperties(): void {
    if (this.printFormSelector) {
      this.printFormSelector.enable();
    }
  }
}
```

## Ventajas del Sistema

1. **Reutilizable:** Un solo sistema para todos los productos de imprenta
2. **Configurable:** Cada producto define sus propias reglas de validación
3. **Extensible:** Fácil agregar nuevos tipos de productos
4. **User-friendly:** Mensajes de error claros y configuración automática
5. **Mantenible:** Código centralizado y bien estructurado

## Configuraciones Específicas

### Flyers

```typescript
{
  allowedPages: [1, 2],
  paperSizes: flyerOptions.paperSize,
  printFormMapping: { onePage: 'una-cara', twoPages: 'doble-cara' }
}
```

### Dípticos/Trípticos

```typescript
{
  allowedPages: [2],
  orientationSizes: {
    vertical: options.vertical_size,
    horizontal: options.horizontal_size,
    cuadrado: options.square_size
  }
}
```

Este sistema proporciona una solución completa y robusta para la validación de archivos en el sistema de imprenta, mejorando significativamente la experiencia del usuario y reduciendo errores en los pedidos.
