describe("Flujo de creación de talleres", () => {

  beforeEach(() => {
    cy.visit("http://localhost:3000/login");
    cy.get('#email').type("alejandro.marroquin@correounivalle.edu.co");
    cy.get('#password').type("alejo01");
    cy.get('.px-6').click();
    cy.visit("http://localhost:3000/quejas/lista");
    cy.get(':nth-child(3) > .p-2').click();
    cy.get('.ml-4 > :nth-child(2) > .flex').click();
  });

  it("Debería crear un taller exitosamente y mostrar modal de confirmación", () => {

    cy.get('.grid > :nth-child(1) > .w-full').type("Taller de prueba");
    cy.get('.grid > :nth-child(2) > .w-full').type("2025-05-18");
    cy.get('.grid > :nth-child(3) > .w-full').type("13:00");
    cy.get('.grid > :nth-child(4) > .w-full').type("15:00");
    cy.get(':nth-child(5) > .w-full').select("Presencial");
    cy.get(':nth-child(6) > .w-full').type("E26 - 1011");
    cy.get(':nth-child(7) > .w-full').type("10");
    cy.get(':nth-child(8) > .flex > .w-full').type("Alejandro Marroquín");
    cy.get('.col-span-2 > .w-full').type("Taller de prueba para la creación de talleres");

    cy.get('.bg-blue-600').click({ force: true });

    cy.get('.fixed > .bg-white')
      .should("be.visible")
      .contains("¡Taller creado exitosamente!")
      .should("exist");
  });

  it("Creación de taller con todos los campos vacíos", () => {
    cy.get('.bg-blue-600').click({ force: true });
    
    cy.get('.fixed > .bg-white')
      .should("be.visible")
      .contains("Por favor completa todos los campos requeridos y corrige los errores.")
      .should("exist");
    });

    it("Se crea un taller sin el nombre del mismo", () => {

      cy.get('.grid > :nth-child(2) > .w-full').type("2025-05-18");
      cy.get('.grid > :nth-child(3) > .w-full').type("13:00");
      cy.get('.grid > :nth-child(4) > .w-full').type("15:00");
      cy.get(':nth-child(5) > .w-full').select("Presencial");
      cy.get(':nth-child(6) > .w-full').type("E26 - 1011");
      cy.get(':nth-child(7) > .w-full').type("10");
      cy.get(':nth-child(8) > .flex > .w-full').type("Alejandro Marroquín");
      cy.get('.col-span-2 > .w-full').type("Taller de prueba para la creación de talleres");
  
      cy.get('.bg-blue-600').click({ force: true });
  
      cy.get('.fixed > .bg-white')
        .should("be.visible")
        .contains("Por favor completa todos los campos requeridos y corrige los errores.")
        .should("exist");

      cy.get('.text-red-500')
        .contains("Nombre del taller es requerido")
        .should("exist");
    });

    it("Crear un taller con una fecha pasada", () => {

      cy.get('.grid > :nth-child(1) > .w-full').type("Taller de prueba");
      cy.get('.grid > :nth-child(2) > .w-full').type("2024-05-18");
      cy.get('.grid > :nth-child(3) > .w-full').type("13:00");
      cy.get('.grid > :nth-child(4) > .w-full').type("15:00");
      cy.get(':nth-child(5) > .w-full').select("Presencial");
      cy.get(':nth-child(6) > .w-full').type("E26 - 1011");
      cy.get(':nth-child(7) > .w-full').type("10");
      cy.get(':nth-child(8) > .flex > .w-full').type("Alejandro Marroquín");
      cy.get('.col-span-2 > .w-full').type("Taller de prueba para la creación de talleres");
  
      cy.get('.bg-blue-600').click({ force: true });
  
      cy.get('.fixed > .bg-white')
        .should("be.visible")
        .contains("Por favor completa todos los campos requeridos y corrige los errores.")
        .should("exist");

      cy.get('.text-red-500')
        .contains("La fecha no puede ser anterior al día actual")
        .should("exist");
    });

    it("Hora de finalización antes de hora de inicio", () => {

      cy.get('.grid > :nth-child(1) > .w-full').type("Taller de prueba");
      cy.get('.grid > :nth-child(2) > .w-full').type("2025-05-18");
      cy.get('.grid > :nth-child(3) > .w-full').type("15:00");
      cy.get('.grid > :nth-child(4) > .w-full').type("13:00");
      cy.get(':nth-child(5) > .w-full').select("Presencial");
      cy.get(':nth-child(6) > .w-full').type("E26 - 1011");
      cy.get(':nth-child(7) > .w-full').type("10");
      cy.get(':nth-child(8) > .flex > .w-full').type("Alejandro Marroquín");
      cy.get('.col-span-2 > .w-full').type("Taller de prueba para la creación de talleres");
  
      cy.get('.bg-blue-600').click({ force: true });
  
      cy.get('.fixed > .bg-white')
        .should("be.visible")
        .contains("Por favor completa todos los campos requeridos y corrige los errores.")
        .should("exist");

      cy.get('.text-red-500')
        .contains("La hora de inicio no debe ser mayor a la hora de finalización")
        .should("exist");
    });

    it("Campo cupos no completado", () => {

      cy.get('.grid > :nth-child(1) > .w-full').type("Taller de prueba");
      cy.get('.grid > :nth-child(2) > .w-full').type("2025-05-18");
      cy.get('.grid > :nth-child(3) > .w-full').type("13:00");
      cy.get('.grid > :nth-child(4) > .w-full').type("14:00");
      cy.get(':nth-child(5) > .w-full').select("Presencial");
      cy.get(':nth-child(6) > .w-full').type("E26 - 1011");
      cy.get(':nth-child(8) > .flex > .w-full').type("Alejandro Marroquín");
      cy.get('.col-span-2 > .w-full').type("Taller de prueba para la creación de talleres");
  
      cy.get('.bg-blue-600').click({ force: true });
  
      cy.get('.fixed > .bg-white')
        .should("be.visible")
        .contains("Por favor completa todos los campos requeridos y corrige los errores.")
        .should("exist");

      cy.get('.text-red-500')
        .contains("Cupos válidos son requeridos")
        .should("exist");
    });

    it("Campo tallerista no completado", () => {

      cy.get('.grid > :nth-child(1) > .w-full').type("Taller de prueba");
      cy.get('.grid > :nth-child(2) > .w-full').type("2025-05-18");
      cy.get('.grid > :nth-child(3) > .w-full').type("13:00");
      cy.get('.grid > :nth-child(4) > .w-full').type("14:00");
      cy.get(':nth-child(5) > .w-full').select("Presencial");
      cy.get(':nth-child(6) > .w-full').type("E26 - 1011");
      cy.get(':nth-child(7) > .w-full').type("20");
      cy.get('.col-span-2 > .w-full').type("Taller de prueba para la creación de talleres");
  
      cy.get('.bg-blue-600').click({ force: true });
  
      cy.get('.fixed > .bg-white')
        .should("be.visible")
        .contains("Por favor completa todos los campos requeridos y corrige los errores.")
        .should("exist");

      cy.get('.text-red-500')
        .contains("Al menos un tallerista es requerido")
        .should("exist");
    });

    it("Campo tallerista con datos no válidos", () => {

      cy.get('.grid > :nth-child(1) > .w-full').type("Taller de prueba");
      cy.get('.grid > :nth-child(2) > .w-full').type("2025-05-18");
      cy.get('.grid > :nth-child(3) > .w-full').type("13:00");
      cy.get('.grid > :nth-child(4) > .w-full').type("14:00");
      cy.get(':nth-child(5) > .w-full').select("Presencial");
      cy.get(':nth-child(6) > .w-full').type("E26 - 1011");
      cy.get(':nth-child(7) > .w-full').type("20");
      cy.get(':nth-child(8) > .flex > .w-full').type("12345");
      cy.get('.col-span-2 > .w-full').type("Taller de prueba para la creación de talleres");
  
      cy.get('.bg-blue-600').click({ force: true });
  
      cy.get('.fixed > .bg-white')
        .should("be.visible")
        .contains("Por favor completa todos los campos requeridos y corrige los errores.")
        .should("exist");

      cy.get('.text-red-500')
        .contains("Por favor, ingrese un nombre válido para el tallerista")
        .should("exist");
    });

    it("Campo descripción no completado", () => {

      cy.get('.grid > :nth-child(1) > .w-full').type("Taller de prueba");
      cy.get('.grid > :nth-child(2) > .w-full').type("2025-05-18");
      cy.get('.grid > :nth-child(3) > .w-full').type("13:00");
      cy.get('.grid > :nth-child(4) > .w-full').type("14:00");
      cy.get(':nth-child(5) > .w-full').select("Presencial");
      cy.get(':nth-child(6) > .w-full').type("E26 - 1011");
      cy.get(':nth-child(7) > .w-full').type("20");
      cy.get(':nth-child(8) > .flex > .w-full').type("Alejandro Marroquín");
  
      cy.get('.bg-blue-600').click({ force: true });
  
      cy.get('.fixed > .bg-white')
        .should("be.visible")
        .contains("Por favor completa todos los campos requeridos y corrige los errores.")
        .should("exist");

      cy.get('.text-red-500')
        .contains("Detalles son requeridos")
        .should("exist");
    });
});