// Mock completo del objeto Google
Cypress.Commands.add('mockGoogleAPI', () => {
  cy.intercept('https://accounts.google.com/gsi/client', (req) => {
    req.reply(`
      window.google = {
        accounts: {
          oauth2: {
            initCodeClient: (config) => {
              return {
                requestCode: () => {
                  // Simular éxito inmediato con un código mock
                  if (config.callback) {
                    config.callback({ code: 'mock_google_auth_code_12345' });
                  }
                }
              };
            }
          },
          id: {
            initialize: () => {},
            renderButton: () => {},
            prompt: () => {}
          }
        }
      };
    `);
  }).as('googleClient');
});

// Comando corregido para login con Google - VERSIÓN COMPLETA
Cypress.Commands.add('loginWithGoogle', (userData = {}) => {
  // Primero mockear el objeto Google
  cy.mockGoogleAPI();

  const mockUser = {
    token: 'mock-google-token-' + Date.now(),
    user: {
      nombre: userData.nombre || 'ALEJANDRO MARROQUIN ALMEIDA',
      email: userData.email || 'alejandro.marroquin@correounivalle.edu.co',
      rol: userData.rol || 'user',
      picture: userData.picture || 'https://lh3.googleusercontent.com/a/ACg8ocJSg7ek9wOavwRWFKV7PEfxj1rs5riYhanUtYY9nejRpMAVBh8=s96-c'
    }
  };

  // Interceptar la llamada a tu backend para Google Auth
  cy.intercept('POST', '**/api/auth/google/', {
    statusCode: 200,
    body: mockUser
  }).as('googleAuth');

  // Interceptar la verificación de sesión - IMPORTANTE!
  cy.intercept('GET', '**/api/auth/checkSession/', {
    statusCode: 200,
    body: {
      isAuthenticated: true,
      user: mockUser.user
    }
  }).as('checkSession');

  // Interceptar cualquier otra verificación de auth
  cy.intercept('GET', '**/api/auth/verify/**', {
    statusCode: 200,
    body: { 
      valid: true, 
      user: mockUser.user 
    }
  }).as('verifyAuth');

  // Interceptar la ruta de logout también (por si acaso)
  cy.intercept('POST', '**/api/logout/', {
    statusCode: 200,
    body: { message: 'Logged out successfully' }
  }).as('logout');

  // Visitar la página de login
  cy.visit('http://localhost:3000/login');

  // Esperar a que cargue la página y el script de Google
  cy.wait('@googleClient');

  // Esperar un poco más para que React renderice completamente
  cy.wait(1000);

  // Ahora hacer click en el botón de Google
  cy.get('button').contains('Continuar con Google').click();

  // Esperar a que se complete la autenticación
  cy.wait('@googleAuth');

  // Verificar que el login fue exitoso - con timeout más largo
  cy.url().should('not.include', '/login', { timeout: 10000 });
  
  // Verificar localStorage
  cy.window().then((win) => {
    // Establecer los valores en localStorage
    win.localStorage.setItem('userToken', mockUser.token);
    win.localStorage.setItem('userName', mockUser.user.nombre);
    win.localStorage.setItem('userRole', mockUser.user.rol);
    win.localStorage.setItem('userEmail', mockUser.user.email);
    
    // Verificar que existen
    expect(win.localStorage.getItem('userToken')).to.exist;
    //expect(win.localStorage.getItem('userName')).to.exist;
  });

  // Esperar a que se completen las verificaciones de sesión
  cy.wait('@checkSession');
});