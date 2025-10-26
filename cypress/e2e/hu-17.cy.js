// Pruebas para HU-17 - Gestión de autenticación - Tabla de Decisiones
describe('HU-17 - Gestión de autenticación - Tabla de Decisiones', () => {
  
  beforeEach(() => {
    // Limpiar localStorage antes de cada prueba
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  // R1: Datos obligatorios erróneos SI, Datos obligatorios completos SI
  describe('Regla R1 - Datos erróneos pero completos', () => {
    it('debería mostrar error con credenciales incorrectas pero formulario completo', () => {
      // Mock para login fallido
      cy.intercept('POST', '**/api/login/', {
        statusCode: 401,
        body: { error: 'Usuario no encontrado o credenciales incorrectas' }
      }).as('failedLogin');

      cy.visit('http://localhost:3000/login');
      
      // Llenar todos los campos obligatorios pero con datos incorrectos
      cy.get('input[type="email"]').type('usuario_inexistente@correo.com');
      cy.get('input[type="password"]').type('password_incorrecto');
      
      // Verificar que ambos campos están completos
      cy.get('input[type="email"]').should('have.value', 'usuario_inexistente@correo.com');
      cy.get('input[type="password"]').should('have.value', 'password_incorrecto');
      
      // Intentar login
      cy.get('button').contains('Iniciar Sesión').click();
      
      cy.wait('@failedLogin');
      
      // VERIFICACIONES R1:
      // - Debería mostrar mensaje de error
      cy.get('.bg-red-50').should('be.visible');
      cy.contains('Usuario no encontrado o credenciales incorrectas').should('exist');
      
      // - Debería permanecer en la página de login
      cy.url().should('include', '/login');
      
      // - NO debería tener token en localStorage
      cy.window().then((win) => {
        expect(win.localStorage.getItem('userToken')).to.be.null;
      });
      
      // - El botón debería estar habilitado nuevamente después del error
      cy.get('button').contains('Iniciar Sesión').should('not.be.disabled');
    });
  });

  // R2: Datos obligatorios erróneos SI, Datos obligatorios completos NO
  describe('Regla R2 - Datos erróneos e incompletos', () => {
    it('debería mostrar validación de campos requeridos con datos incompletos', () => {
      cy.visit('http://localhost:3000/login');
      
      // Caso 2.1: Solo email, sin contraseña
      cy.get('input[type="email"]').type('email_invalido@correo');
      cy.get('button').contains('Iniciar Sesión').click();
      
      // Debería permanecer en la página sin hacer llamada al API
      cy.url().should('include', '/login');
      
      // Caso 2.2: Solo contraseña, sin email
      cy.get('input[type="email"]').clear();
      cy.get('input[type="password"]').type('123');
      cy.get('button').contains('Iniciar Sesión').click();
      
      // Debería permanecer en la página sin hacer llamada al API
      cy.url().should('include', '/login');
      
      // Caso 2.3: Campos vacíos
      cy.get('input[type="email"]').clear();
      cy.get('input[type="password"]').clear();
      cy.get('button').contains('Iniciar Sesión').click();
      
      // VERIFICACIONES R2:
      // - No debería hacer llamadas al API (no mocks interceptados)
      // - Debería permanecer en login
      cy.url().should('include', '/login');
      
      // - No debería haber token
      cy.window().then((win) => {
        expect(win.localStorage.getItem('userToken')).to.be.null;
      });
    });

    it('debería prevenir el envío del formulario con email inválido', () => {
      cy.visit('http://localhost:3000/login');
      
      // Email con formato inválido
      cy.get('input[type="email"]').type('email_invalido_sin_aroba');
      cy.get('input[type="password"]').type('contraseña_cualquiera');
      cy.get('button').contains('Iniciar Sesión').click();
      
      // El navegador debería prevenir el envío por validación HTML5
      cy.url().should('include', '/login');
    });
  });

  // R3: Datos obligatorios erróneos NO, Datos obligatorios completos SI
  describe('Regla R3 - Datos correctos y completos', () => {
    const userData = {
      email: 'alejandromarroquin.com@gmail.com',
      password: '123456',
      token: 'mock-success-token-' + Date.now(),
      user: {
        nombre: 'ALEJANDRO MARROQUIN ALMEIDA',
        rol: 'user'
      }
    };

    beforeEach(() => {
      // Mock para login exitoso
      cy.intercept('POST', '**/api/login/', {
        statusCode: 200,
        body: {
          token: userData.token,
          user: userData.user
        }
      }).as('successLogin');

      // Mock para verificación de sesión
      cy.intercept('GET', '**/api/auth/checkSession/', {
        statusCode: 200,
        body: {
          isAuthenticated: true,
          user: userData.user
        }
      });
    });

    it('debería autenticar exitosamente con credenciales correctas y completas', () => {
      cy.visit('http://localhost:3000/login');
      
      // Llenar todos los campos con datos correctos
      cy.get('input[type="email"]').type(userData.email);
      cy.get('input[type="password"]').type(userData.password);
      
      // Verificar que los campos están completos
      cy.get('input[type="email"]').should('have.value', userData.email);
      cy.get('input[type="password"]').should('have.value', userData.password);
      
      // Iniciar sesión
      cy.get('button').contains('Iniciar Sesión').click();
      
      cy.wait('@successLogin');
      
      // VERIFICACIONES R3:
      // - Debería redirigir fuera del login
      cy.url().should('not.include', '/login', { timeout: 10000 });
      
      // - Debería establecer el token en localStorage
      cy.window().then((win) => {
        expect(win.localStorage.getItem('userToken')).to.exist;
        expect(win.localStorage.getItem('userToken')).to.equal(userData.token);
        expect(win.localStorage.getItem('userName')).to.equal(userData.user.nombre);
        expect(win.localStorage.getItem('userRole')).to.equal(userData.user.rol);
      });
      
      // - No debería mostrar mensajes de error
      cy.get('.bg-red-50').should('not.exist');
    });

    it('debería mostrar spinner de carga durante la autenticación', () => {
      cy.visit('http://localhost:3000/login');
      
      cy.get('input[type="email"]').type(userData.email);
      cy.get('input[type="password"]').type(userData.password);
      cy.get('button').contains('Iniciar Sesión').click();
      
      // Verificar que se muestra el spinner de carga
      cy.contains('Iniciando sesión...').should('be.visible');
      
      cy.wait('@successLogin');
      
      // Verificar que el spinner desaparece después del login
      cy.contains('Iniciando sesión...').should('not.exist');
    });
  });

  // Pruebas adicionales para casos edge
  describe('Casos edge de autenticación', () => {
    it('debería deshabilitar el botón durante el proceso de login', () => {
      // Mock con delay para probar el estado de loading
      cy.intercept('POST', '**/api/login/', (req) => {
        req.reply({
          statusCode: 200,
          body: {
            token: 'mock-token',
            user: { nombre: 'Test User', rol: 'user' }
          },
          delay: 1000 // 1 segundo de delay
        });
      }).as('delayedLogin');

      cy.visit('http://localhost:3000/login');
      
      cy.get('input[type="email"]').type('alejandromarroquin.com@gmail.com');
      cy.get('input[type="password"]').type('123456');
      cy.get('button').contains('Iniciar Sesión').click();
      
      // Verificar que el botón se deshabilita durante el login
      cy.get('button').contains('Iniciando sesión...').should('be.disabled');
      
      cy.wait('@delayedLogin');
    });

    it('debería manejar errores de servidor', () => {
      // Mock para error del servidor
      cy.intercept('POST', '**/api/login/', {
        statusCode: 500,
        body: { error: 'Error interno del servidor' }
      }).as('serverError');

      cy.visit('http://localhost:3000/login');
      
      cy.get('input[type="email"]').type('alejandromarroquin.com@gmail.com');
      cy.get('input[type="password"]').type('123456');
      cy.get('button').contains('Iniciar Sesión').click();
      
      cy.wait('@serverError');
      
      // Debería mostrar mensaje de error
      cy.get('.bg-red-50').should('be.visible');
      cy.url().should('include', '/login');
    });
  });
});