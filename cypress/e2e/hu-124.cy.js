// Mock global para Google OAuth
beforeEach(() => {
  // Evitar que Cypress falle con ventanas emergentes de OAuth
  Cypress.on('window:before:load', (win) => {
    win.addEventListener('beforeunload', () => {});
  });

  // Mock para @react-oauth/google
  cy.intercept('https://accounts.google.com/gsi/client', {
    statusCode: 200,
    body: 'window.google = { accounts: { id: { initialize: () => {}, prompt: () => {} } } }'
  });
});

describe("HU-124 -Flujo de creación de talleres", () => {
  const userData = {
    nombre: 'ALEJANDRO MARROQUIN ALMEIDA',
    email: 'alejandro.marroquin@correounivalle.edu.co',
    rol: 'user'
  };

  beforeEach(() => {
    // Usar el mock de Google Login
    cy.loginWithGoogle(userData);
    
    // Navegar al flujo específico
    cy.visit("http://localhost:3000/quejas/lista");
    cy.visit("http://localhost:3000/talleres/crear");
  });

    it("Debería crear un taller exitosamente y mostrar modal de confirmación", () => {
    cy.get('.grid > :nth-child(1) > .w-full').type("Taller de prueba");
    cy.get('.grid > :nth-child(2) > .w-full').type("2025-11-18");
    cy.get('.grid > :nth-child(3) > .w-full').select("🏢 Presencial");
    cy.get('.grid > :nth-child(4) > .w-full').type("13:00");
    cy.get('.grid > :nth-child(5) > .w-full').type("15:00");
    cy.get(':nth-child(6) > .w-full').type("E26 - 1011");
    cy.get(':nth-child(7) > .w-full').type("10");
    cy.get('.mb-3 > .flex-1').type("Alejandro Marroquín");
    cy.get(':nth-child(9) > .w-full').type("Taller de prueba para la creación de talleres");

    cy.get('.px-8').click({ force: true });

    cy.get('.fixed > .bg-white')
      .should("be.visible")
      .contains("¡Taller creado exitosamente!")
      .should("exist");
  });

  it("Debería evitar colocar una fecha pasada", () => {
    cy.get('.grid > :nth-child(1) > .w-full').type("Taller de prueba");
    cy.get('.grid > :nth-child(2) > .w-full').type("2025-09-18");
    cy.get('.grid > :nth-child(3) > .w-full').select("🏢 Presencial");
    cy.get('.grid > :nth-child(4) > .w-full').type("13:00");
    cy.get('.grid > :nth-child(5) > .w-full').type("15:00");
    cy.get(':nth-child(6) > .w-full').type("E26 - 1011");
    cy.get(':nth-child(7) > .w-full').type("10");
    cy.get('.mb-3 > .flex-1').type("Alejandro Marroquín");
    cy.get(':nth-child(9) > .w-full').type("Taller de prueba para la creación de talleres");

    cy.get('.px-8').click({ force: true });

    cy.get('.text-red-500')
    .contains("La fecha no puede ser anterior al día actual")
    .should("exist");
  });

  it("Debería mostrar modal de error si los campos obligatorios son incompletos", () => {

    cy.get('.px-8').click({ force: true });

    cy.get('.fixed > .bg-white')
      .should("be.visible")
      .contains("Por favor completa todos los campos requeridos y corrige los errores.")
      .should("exist");
  });

});