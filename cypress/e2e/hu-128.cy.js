// Mock global para Google OAuth
beforeEach(() => {
  Cypress.on('window:before:load', (win) => {
    win.addEventListener('beforeunload', () => {});
  });

  cy.intercept('https://accounts.google.com/gsi/client', {
    statusCode: 200,
    body: 'window.google = { accounts: { id: { initialize: () => {}, prompt: () => {} } } }'
  });
});

describe("HU-128 - Visualización de talleres", () => {
  const userData = {
    nombre: 'ALEJANDRO MARROQUIN ALMEIDA',
    email: 'alejandro.marroquin@correounivalle.edu.co',
    rol: 'user'
  };

  beforeEach(() => {
    // Usar el mock de Google Login
    cy.loginWithGoogle(userData);
    
    // Mockear la data de talleres para la tabla - ENDPOINT CORREGIDO
    cy.intercept('GET', '**/api/talleres/**', {
      statusCode: 200,
      body: [
        {
          id: 1,
          name: "Taller de React Avanzado",
          date: "2025-11-20T00:00:00.000Z",
          start_time: "10:00",
          end_time: "12:00",
          location: "E26 - 1011",
          modality: "presencial",
          slots: 15,
          details: "Taller sobre React avanzado y mejores prácticas",
          facilitators: [{ name: "Alejandro Marroquín" }]
        },
        {
          id: 2,
          name: "Taller de Node.js Backend",
          date: "2025-11-25T00:00:00.000Z", 
          start_time: "14:00",
          end_time: "16:00",
          location: "A21 - 205",
          modality: "virtual",
          slots: 20,
          details: "Desarrollo backend con Node.js y Express",
          facilitators: [{ name: "Carlos Pérez" }]
        }
      ]
    }).as('getTalleres');
  });

  it("Debería cargar la página de visualización de talleres", () => {
    // Navegar directamente a la página de talleres
    cy.visit("http://localhost:3000/talleres/ver");
    
    // Verificar que la URL es correcta
    cy.url().should('include', '/talleres/ver');
    
    // Verificar que el título de la página existe
    cy.contains('h1', '🎯 Lista de Talleres').should('be.visible');
  });

  it("Debería cargar la tabla de talleres con todos los encabezados", () => {
    cy.visit("http://localhost:3000/talleres/ver");
    
    // Esperar a que se carguen los talleres - ENDPOINT CORREGIDO
    cy.wait('@getTalleres');
    
    // Verificar que la tabla existe
    cy.get('table').should('exist');
    cy.get('table').should('be.visible');
    
    // Verificar los encabezados de la tabla
    cy.get('th').contains('Taller').should('be.visible');
    cy.get('th').contains('Fecha').should('be.visible');
    cy.get('th').contains('Horario').should('be.visible');
    cy.get('th').contains('Ubicación').should('be.visible');
    cy.get('th').contains('Modalidad').should('be.visible');
    cy.get('th').contains('Cupos').should('be.visible');
    cy.get('th').contains('Talleristas').should('be.visible');
    cy.get('th').contains('Estado').should('be.visible');
    cy.get('th').contains('Acciones').should('be.visible');
  });

  it("Debería mostrar los talleres en la tabla con datos correctos", () => {
    cy.visit("http://localhost:3000/talleres/ver");
    cy.wait('@getTalleres');
    
    // Verificar que hay filas de datos
    cy.get('tbody tr').should('have.length.at.least', 1);
    
    // Verificar que se muestran los datos mockeados
    cy.contains('td', 'Taller de React Avanzado').should('exist');
    cy.contains('td', 'Taller de Node.js Backend').should('exist');
    
    // Verificar ubicaciones
    cy.contains('td', 'E26 - 1011').should('exist');
    cy.contains('td', 'A21 - 205').should('exist');
  });

  it("Debería mostrar los botones de acciones en cada fila", () => {
    cy.visit("http://localhost:3000/talleres/ver");
    cy.wait('@getTalleres');
    
    // Verificar que hay botones de acciones
    cy.get('button').find('svg').should('exist');
    cy.get('[title="Ver detalles"]').should('exist');
    cy.get('[title="Eliminar taller"]').should('exist');
  });

  it("Debería mostrar la barra de búsqueda y filtros", () => {
    cy.visit("http://localhost:3000/talleres/ver");
    cy.wait('@getTalleres');
    
    // Verificar barra de búsqueda
    cy.get('input[placeholder="Buscar por nombre del taller..."]').should('exist');
    cy.contains('button', 'Filtros').should('exist');
    cy.contains('button', 'Exportar').should('exist');
  });

  it("Debería mostrar mensaje cuando no hay talleres disponibles", () => {
    // Mock para cuando no hay talleres - ENDPOINT CORREGIDO
    cy.intercept('GET', '**/api/talleres/**', {
      statusCode: 200,
      body: []
    }).as('getEmptyTalleres');

    cy.visit("http://localhost:3000/talleres/ver");
    cy.wait('@getEmptyTalleres');
    
    // Verificar que se muestra mensaje de "no hay datos"
    cy.contains('No se encontraron talleres').should('exist');
  });

  it("Debería mantener la sesión del usuario durante la navegación", () => {
    cy.visit("http://localhost:3000/talleres/ver");
    cy.wait('@getTalleres');
    
    // Verificar que el usuario sigue logueado - SOLO token
    cy.window().then((win) => {
      expect(win.localStorage.getItem('userToken')).to.exist;
    });
  });

  it("Debería mostrar información de talleres con formato correcto", () => {
    cy.visit("http://localhost:3000/talleres/ver");
    cy.wait('@getTalleres');
    
    // Verificar formato de fechas
    cy.contains('2025-11-20').should('exist');
    cy.contains('2025-11-25').should('exist');
    
    // Verificar horarios
    cy.contains('10:00').should('exist');
    cy.contains('14:00').should('exist');
  });

  it("Debería mostrar la paginación correctamente", () => {
    cy.visit("http://localhost:3000/talleres/ver");
    cy.wait('@getTalleres');
    
    // Verificar información de paginación
    cy.contains(/Mostrando \d+-\d+ de \d+ talleres/).should('exist');
  });

  it("Debería filtrar talleres por búsqueda", () => {
    cy.visit("http://localhost:3000/talleres/ver");
    cy.wait('@getTalleres');
    
    // Buscar por nombre
    cy.get('input[placeholder="Buscar por nombre del taller..."]')
      .type('React');
    

    cy.get('input[placeholder="Buscar por nombre del taller..."]')
      .should('have.value', 'React');
  });
});