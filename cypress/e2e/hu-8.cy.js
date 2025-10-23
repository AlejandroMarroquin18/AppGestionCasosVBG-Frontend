// Pruebas para HU-8 - Realizar queja - Tabla de Decisiones
describe('HU-8 - Realizar queja - Tabla de Decisiones', () => {
  
  beforeEach(() => {
    cy.viewport(1280, 720);
    cy.visit('http://localhost:3000/reportarvbg');
  });

  // R1: Datos obligatorios erróneos SI, Datos obligatorios completos SI
  describe('Regla R1 - Datos erróneos pero formulario completo', () => {
    it('debería mostrar error al enviar formulario con datos inválidos pero completos', () => {
      // Mock para envío fallido
      cy.intercept('POST', '**/api/quejas/', {
        statusCode: 400,
        body: { error: 'Error en los datos enviados' }
      }).as('submitComplaintError');

      // Llenar todos los campos obligatorios con datos inválidos
      
      // Paso 1: Persona que reporta - Datos inválidos
      cy.contains('Nombre completo *').parent().find('input').type('12345'); // Nombre inválido
      cy.contains('Sexo *').parent().find('select').select('Femenino');
      cy.contains('Edad *').parent().find('input').type('500'); // Edad inválida
      cy.contains('Estamento *').parent().find('select').select('Estudiante');
      cy.contains('Vicerrectoría *').parent().find('select').select('Vicerrectoría Académica');
      cy.contains('Dependencia *').parent().find('input').type('Dependencia inválida');
      cy.contains('Facultad *').parent().find('select').select('Artes Integradas');
      cy.contains('Sede *').parent().find('select').select('Melendez');
      cy.contains('Celular *').parent().find('input').type('no-es-un-numero'); // Celular inválido
      cy.contains('Correo electrónico *').parent().find('input').type('correo-invalido'); // Email inválido

      // Avanzar al siguiente paso
      cy.contains('Siguiente').click();

      // Paso 2: Persona afectada - Datos inválidos
      cy.contains('Nombre completo *').parent().find('input').type('Afectado 123'); // Nombre inválido
      cy.contains('Sexo *').parent().find('select').select('Masculino');
      cy.contains('Edad *').parent().find('input').type('200'); // Edad inválida
      cy.contains('Estamento *').parent().find('select').select('Docente');
      cy.contains('Tipo de violencia basada en género *').parent().find('select').select('Economica');
      cy.contains('Detalles del caso *').parent().find('textarea').type('x'.repeat(10)); // Detalles muy cortos

      // Avanzar al siguiente paso
      cy.contains('Siguiente').click();

      // Paso 3: Persona agresora (campos opcionales) - Saltar
      cy.contains('Siguiente').click();

      // Paso 4: Información adicional
      cy.contains('¿Desea activar la ruta de atención integral?').parent().find('select').select('Si');

      // Intentar enviar el formulario
      cy.contains('Enviar formulario').click();

      // VERIFICACIONES R1:
      // - Debería mostrar error del servidor
      cy.wait('@submitComplaintError');
      cy.contains('Error al enviar el formulario').should('exist');
      
      // - Debería permanecer en la misma página
      cy.url().should('include', '/reportarvbg');
    });

    it('debería validar formato de email incorrecto', () => {
      // Paso 1: Email inválido
      cy.contains('Correo electrónico *').parent().find('input').type('email-invalido');
      cy.contains('Siguiente').click();
      
      // El formulario debería avanzar (validación HTML5 básica)
      // Pero el envío final fallará
    });
  });

  // R2: Datos obligatorios erróneos SI, Datos obligatorios completos NO
  describe('Regla R2 - Datos erróneos e incompletos', () => {
    it('debería impedir avanzar con campos obligatorios vacíos', () => {
      // Intentar avanzar sin llenar campos obligatorios del paso 1
      cy.contains('Siguiente').click();
      
      // VERIFICACIONES R2:
      // - Debería permanecer en el paso 1
      cy.contains('Persona que reporta el caso').should('be.visible');
      
      // - Los campos obligatorios deberían estar vacíos
      cy.contains('Nombre completo *').parent().find('input').should('have.value', '');
      cy.contains('Sexo *').parent().find('select').should('have.value', '');
    });

    it('debería mostrar campos vacíos como no válidos al intentar avanzar', () => {
      // Llenar algunos campos pero dejar obligatorios vacíos
      cy.contains('Nombre completo *').parent().find('input').type('Nombre de prueba');
      // Dejar Sexo vacío (obligatorio)
      
      cy.contains('Siguiente').click();
      
      // Debería permanecer en paso 1
      cy.contains('Persona que reporta el caso').should('be.visible');
      
      // El campo Sexo debería seguir vacío
      cy.contains('Sexo *').parent().find('select').should('have.value', '');
    });

    it('debería impedir envío final con formulario incompleto', () => {
      // Llenar solo paso 1 incompleto
      cy.contains('Nombre completo *').parent().find('input').type('Nombre incompleto');
      // Saltar otros campos obligatorios
      
      // Forzar navegación rápida (simular bugs)
      cy.contains('Siguiente').click();
      // Debería quedarse en paso 1
    });
  });

  // R3: Datos obligatorios erróneos NO, Datos obligatorios completos SI
  describe('Regla R3 - Datos correctos y formulario completo', () => {
    it('debería enviar exitosamente con todos los datos correctos', () => {
      // Mock para envío exitoso
      cy.intercept('POST', '**/api/quejas/', {
        statusCode: 201,
        body: { message: 'Queja registrada exitosamente' }
      }).as('submitComplaintSuccess');

      // Paso 1: Persona que reporta - Datos válidos
      cy.contains('Nombre completo *').parent().find('input').type('María González López');
      cy.contains('Sexo *').parent().find('select').select('Femenino');
      cy.contains('Edad *').parent().find('input').type('28');
      cy.contains('Estamento *').parent().find('select').select('Estudiante');
      cy.contains('Vicerrectoría *').parent().find('select').select('Vicerrectoría Académica');
      cy.contains('Dependencia *').parent().find('input').type('Departamento de Matemáticas');
      cy.contains('Facultad *').parent().find('select').select('Ciencias Naturales y Exactas');
      cy.contains('Programa académico').parent().find('input').type('Licenciatura en Matemáticas');
      cy.contains('Sede *').parent().find('select').select('Melendez');
      cy.contains('Celular *').parent().find('input').type('3124567890');
      cy.contains('Correo electrónico *').parent().find('input').type('maria.gonzalez@correounivalle.edu.co');

      cy.contains('Siguiente').click();

      // Paso 2: Persona afectada - Datos válidos
      cy.contains('Nombre completo *').parent().find('input').type('Ana Rodríguez Pérez');
      cy.contains('Sexo *').parent().find('select').select('Femenino');
      cy.contains('Edad *').parent().find('input').type('25');
      cy.contains('Código').parent().find('input').type('A00345678');
      cy.contains('Estamento *').parent().find('select').select('Estudiante');
      cy.contains('Facultad').parent().find('select').select('Ingeniería');
      cy.contains('Programa académico').parent().find('input').type('Ingeniería de Sistemas');
      cy.contains('Sede').parent().find('select').select('San Fernando');
      cy.contains('Celular').parent().find('input').type('3001234567');
      cy.contains('Correo electrónico').parent().find('input').type('ana.rodriguez@correounivalle.edu.co');
      cy.contains('Tipo de violencia basada en género *').parent().find('select').select('Sexual');
      cy.contains('Detalles del caso *').parent().find('textarea').type('Incidente ocurrido en la biblioteca central el día 15 de noviembre. La persona afectada fue abordada de manera inapropiada mientras estudiaba.');

      cy.contains('Siguiente').click();

      // Paso 3: Persona agresora - Datos opcionales
      cy.contains('Nombre completo').parent().find('input').type('Carlos Méndez');
      cy.contains('Sexo').parent().find('select').select('Masculino');
      cy.contains('Edad').parent().find('input').type('32');
      cy.contains('Estamento').parent().find('select').select('Docente');
      cy.contains('Facultad').parent().find('select').select('Ingeniería');

      cy.contains('Siguiente').click();

      // Paso 4: Información adicional
      cy.contains('¿Desea activar la ruta de atención integral?').parent().find('select').select('Si');
      cy.contains('¿Requiere recibir asesoría y orientación socio-pedagógica?').parent().find('select').select('Si');
      cy.contains('¿Requiere recibir orientación psicológica?').parent().find('select').select('Si');
      cy.contains('Observaciones adicionales').parent().find('textarea').type('La persona afectada solicita confidencialidad del caso.');

      // VERIFICACIONES R3:
      // - Enviar formulario exitosamente
      cy.contains('Enviar formulario').click();
      
      cy.wait('@submitComplaintSuccess');
      
      // - Debería mostrar mensaje de éxito
      cy.contains('¡Formulario enviado exitosamente!').should('exist');
      
      // - Debería redirigir a la lista de quejas
      cy.url().should('include', '/quejas/lista');
    });

    it('debería navegar correctamente entre todos los pasos', () => {
      // Verificar navegación paso a paso
      cy.contains('Persona que reporta el caso').should('be.visible');
      
      // Llenar paso 1
      cy.contains('Nombre completo *').parent().find('input').type('Juan Pérez');
      cy.contains('Sexo *').parent().find('select').select('Masculino');
      cy.contains('Edad *').parent().find('input').type('30');
      cy.contains('Estamento *').parent().find('select').select('Docente');
      cy.contains('Vicerrectoría *').parent().find('select').select('Vicerrectoría de Investigaciones');
      cy.contains('Dependencia *').parent().find('input').type('Laboratorio de Física');
      cy.contains('Facultad *').parent().find('select').select('Ciencias Naturales y Exactas');
      cy.contains('Sede *').parent().find('select').select('San Fernando');
      cy.contains('Celular *').parent().find('input').type('3151234567');
      cy.contains('Correo electrónico *').parent().find('input').type('juan.perez@correounivalle.edu.co');

      cy.contains('Siguiente').click();
      
      // Verificar que avanzó al paso 2
      cy.contains('Persona afectada').should('be.visible');
      
      // Navegar de regreso
      cy.contains('Anterior').click();
      cy.contains('Persona que reporta el caso').should('be.visible');
      
      // Volver a avanzar
      cy.contains('Siguiente').click();
      cy.contains('Persona afectada').should('be.visible');
    });
  });

  // Pruebas adicionales para casos edge
  describe('Casos edge y validaciones específicas', () => {
    it('debería manejar campos opcionales vacíos correctamente', () => {
      // Probar envío sin llenar campos opcionales
      cy.intercept('POST', '**/api/quejas/', {
        statusCode: 201,
        body: { message: 'Queja registrada exitosamente' }
      }).as('submitMinimalComplaint');

      // Solo llenar campos obligatorios
      
      // Paso 1: Solo obligatorios
      cy.contains('Nombre completo *').parent().find('input').type('Laura Martínez');
      cy.contains('Sexo *').parent().find('select').select('Femenino');
      cy.contains('Edad *').parent().find('input').type('26');
      cy.contains('Estamento *').parent().find('select').select('Estudiante');
      cy.contains('Vicerrectoría *').parent().find('select').select('Vicerrectoría Académica');
      cy.contains('Dependencia *').parent().find('input').type('Facultad de Medicina');
      cy.contains('Facultad *').parent().find('select').select('Salud');
      cy.contains('Sede *').parent().find('select').select('Melendez');
      cy.contains('Celular *').parent().find('input').type('3187654321');
      cy.contains('Correo electrónico *').parent().find('input').type('laura.martinez@correounivalle.edu.co');

      cy.contains('Siguiente').click();

      // Paso 2: Solo obligatorios
      cy.contains('Nombre completo *').parent().find('input').type('Pedro Sánchez');
      cy.contains('Sexo *').parent().find('select').select('Masculino');
      cy.contains('Edad *').parent().find('input').type('24');
      cy.contains('Estamento *').parent().find('select').select('Estudiante');
      cy.contains('Tipo de violencia basada en género *').parent().find('select').select('Fisica');
      cy.contains('Detalles del caso *').parent().find('textarea').type('Incidente reportado por testigos.');

      // Saltar pasos 3 y 4 (opcionales)
      cy.contains('Siguiente').click(); // Paso 3
      cy.contains('Siguiente').click(); // Paso 4

      // Enviar
      cy.contains('Enviar formulario').click();
      
      cy.wait('@submitMinimalComplaint');
      cy.contains('¡Formulario enviado exitosamente!').should('exist');
    });

    it('debería mostrar spinner durante el envío', () => {
      cy.intercept('POST', '**/api/quejas/', {
        delay: 1000, // 1 segundo de delay
        statusCode: 201,
        body: { message: 'Queja registrada' }
      }).as('submitWithDelay');

      // Llenar datos mínimos rápidos
      cy.contains('Nombre completo *').parent().find('input').type('Test Spinner');
      cy.contains('Sexo *').parent().find('select').select('Femenino');
      cy.contains('Edad *').parent().find('input').type('25');
      cy.contains('Estamento *').parent().find('select').select('Estudiante');
      cy.contains('Vicerrectoría *').parent().find('select').select('Vicerrectoría Académica');
      cy.contains('Dependencia *').parent().find('input').type('Test');
      cy.contains('Facultad *').parent().find('select').select('Artes Integradas');
      cy.contains('Sede *').parent().find('select').select('Melendez');
      cy.contains('Celular *').parent().find('input').type('3111111111');
      cy.contains('Correo electrónico *').parent().find('input').type('test@test.com');

      cy.contains('Siguiente').click();

      cy.contains('Nombre completo *').parent().find('input').type('Afectado Test');
      cy.contains('Sexo *').parent().find('select').select('Masculino');
      cy.contains('Edad *').parent().find('input').type('26');
      cy.contains('Estamento *').parent().find('select').select('Estudiante');
      cy.contains('Tipo de violencia basada en género *').parent().find('select').select('Economica');
      cy.contains('Detalles del caso *').parent().find('textarea').type('Detalles de prueba');

      cy.contains('Siguiente').click();
      cy.contains('Siguiente').click();
      cy.contains('Siguiente').click();

      cy.contains('Enviar formulario').click();

      // Verificar que se muestra el spinner
      cy.contains('Enviando formulario...').should('be.visible');
      
      cy.wait('@submitWithDelay');
      
      // Verificar que el spinner desaparece
      cy.contains('Enviando formulario...').should('not.exist');
    });

    it('debería manejar errores de conexión', () => {
      cy.intercept('POST', '**/api/quejas/', {
        statusCode: 500,
        body: { error: 'Error interno del servidor' }
      }).as('serverError');

      // Llenar datos válidos
      cy.contains('Nombre completo *').parent().find('input').type('Test Error');
      cy.contains('Sexo *').parent().find('select').select('Femenino');
      cy.contains('Edad *').parent().find('input').type('25');
      cy.contains('Estamento *').parent().find('select').select('Estudiante');
      cy.contains('Vicerrectoría *').parent().find('select').select('Vicerrectoría Académica');
      cy.contains('Dependencia *').parent().find('input').type('Test');
      cy.contains('Facultad *').parent().find('select').select('Artes Integradas');
      cy.contains('Sede *').parent().find('select').select('Melendez');
      cy.contains('Celular *').parent().find('input').type('3111111111');
      cy.contains('Correo electrónico *').parent().find('input').type('test@test.com');

      cy.contains('Siguiente').click();

      cy.contains('Nombre completo *').parent().find('input').type('Afectado Error');
      cy.contains('Sexo *').parent().find('select').select('Masculino');
      cy.contains('Edad *').parent().find('input').type('26');
      cy.contains('Estamento *').parent().find('select').select('Estudiante');
      cy.contains('Tipo de violencia basada en género *').parent().find('select').select('Economica');
      cy.contains('Detalles del caso *').parent().find('textarea').type('Detalles de prueba');

      cy.contains('Siguiente').click();
      cy.contains('Siguiente').click();
      cy.contains('Siguiente').click();

      cy.contains('Enviar formulario').click();

      cy.wait('@serverError');
      cy.contains('Error al enviar el formulario').should('exist');
    });
  });

  // Pruebas de usabilidad
  describe('Pruebas de usabilidad y navegación', () => {
    it('debería permitir navegación con los puntos de progreso', () => {
      // Verificar que existen los puntos de navegación
      cy.get('button').should('have.length.at.least', 3); // Puntos de navegación
      
      // Hacer click en el segundo punto
      cy.get('button').eq(1).click(); // Segundo punto
      
      // Debería permanecer en paso 1 (no se puede saltar sin completar)
      cy.contains('Persona que reporta el caso').should('be.visible');
    });

    it('debería deshabilitar botón anterior en el primer paso', () => {
      cy.contains('Anterior').should('be.disabled');
      
      // Llenar paso 1 y avanzar
      cy.contains('Nombre completo *').parent().find('input').type('Test Navegación');
      cy.contains('Sexo *').parent().find('select').select('Femenino');
      cy.contains('Edad *').parent().find('input').type('25');
      cy.contains('Estamento *').parent().find('select').select('Estudiante');
      cy.contains('Vicerrectoría *').parent().find('select').select('Vicerrectoría Académica');
      cy.contains('Dependencia *').parent().find('input').type('Test');
      cy.contains('Facultad *').parent().find('select').select('Artes Integradas');
      cy.contains('Sede *').parent().find('select').select('Melendez');
      cy.contains('Celular *').parent().find('input').type('3111111111');
      cy.contains('Correo electrónico *').parent().find('input').type('test@test.com');

      cy.contains('Siguiente').click();
      
      // Ahora el botón anterior debería estar habilitado
      cy.contains('Anterior').should('not.be.disabled');
    });

    it('debería cambiar el texto del botón en el último paso', () => {
      // Navegar hasta el último paso
      cy.contains('Nombre completo *').parent().find('input').type('Test Final');
      cy.contains('Sexo *').parent().find('select').select('Femenino');
      cy.contains('Edad *').parent().find('input').type('25');
      cy.contains('Estamento *').parent().find('select').select('Estudiante');
      cy.contains('Vicerrectoría *').parent().find('select').select('Vicerrectoría Académica');
      cy.contains('Dependencia *').parent().find('input').type('Test');
      cy.contains('Facultad *').parent().find('select').select('Artes Integradas');
      cy.contains('Sede *').parent().find('select').select('Melendez');
      cy.contains('Celular *').parent().find('input').type('3111111111');
      cy.contains('Correo electrónico *').parent().find('input').type('test@test.com');

      cy.contains('Siguiente').click();

      cy.contains('Nombre completo *').parent().find('input').type('Afectado Final');
      cy.contains('Sexo *').parent().find('select').select('Masculino');
      cy.contains('Edad *').parent().find('input').type('26');
      cy.contains('Estamento *').parent().find('select').select('Estudiante');
      cy.contains('Tipo de violencia basada en género *').parent().find('select').select('Economica');
      cy.contains('Detalles del caso *').parent().find('textarea').type('Detalles de prueba');

      cy.contains('Siguiente').click();
      cy.contains('Siguiente').click();
      
      // En el último paso, el botón debería decir "Enviar formulario"
      cy.contains('Enviar formulario').should('be.visible');
      cy.contains('Siguiente').should('not.exist');
    });
  });
});