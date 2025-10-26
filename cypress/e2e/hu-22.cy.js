// Pruebas para HU-22 - Creación de la sidebar - Tabla de Decisiones CORREGIDAS
describe('HU-22 - Creación de la sidebar - Tabla de Decisiones', () => {
  
  beforeEach(() => {
    // Configurar viewport como desktop
    cy.viewport(1280, 720);
    
    // Limpiar localStorage antes de cada prueba
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  // R1: Usuario autenticado SI - Sidebar redirige SI
  describe('Regla R1 - Usuario autenticado con sidebar funcional', () => {
    const userData = {
      email: 'alejandromarroquin.com@gmail.com',
      password: '123456',
      token: 'mock-sidebar-token-' + Date.now(),
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

      // Login
      cy.visit('http://localhost:3000/login');
      cy.get('input[type="email"]').type(userData.email);
      cy.get('input[type="password"]').type(userData.password);
      cy.get('button').contains('Iniciar Sesión').click();
      cy.wait('@successLogin');
      
      // Esperar a que se complete la navegación
      cy.url().should('not.include', '/login', { timeout: 10000 });
    });

    it('debería mostrar la sidebar con menús de navegación cuando el usuario está autenticado', () => {
      // Navegar a una página con sidebar
      cy.visit('http://localhost:3000/quejas/lista');
      
      // VERIFICACIONES R1 - Sidebar visible y funcional
      
      // 1. Verificar que la sidebar existe
      cy.get('aside').should('exist');
      
      // 2. Verificar menús principales que SÍ son visibles
      cy.contains('Quejas').should('be.visible');
      cy.contains('Agenda').should('be.visible');
      cy.contains('Talleres').should('be.visible');
      
      // 3. Verificar estructura de navegación
      cy.get('nav').should('exist');
      cy.get('ul').should('exist');
    });

    it('debería permitir navegación a través de los menús de la sidebar', () => {
      cy.visit('http://localhost:3000/quejas/lista');
      
      // VERIFICACIONES R1 - Navegación funcional
      
      // Navegar a Talleres → Crear taller
      cy.contains('Talleres').click();
      
      // Verificar que el submenú se expande
      cy.contains('Crear taller').should('be.visible');
      
      // Hacer click en Crear taller
      cy.contains('Crear taller').click();
      
      // Verificar que navegó correctamente
      cy.url().should('include', '/talleres/crear');
      
      // Verificar que seguimos en página con sidebar
      cy.contains('Quejas').should('be.visible');
      cy.contains('Agenda').should('be.visible');
      cy.contains('Talleres').should('be.visible');
    });

    it('debería mostrar estados activos en la sidebar según la ruta actual', () => {
      // Navegar a una ruta específica
      cy.visit('http://localhost:3000/quejas/lista');
      
      // VERIFICACIONES R1 - Estados visuales
      
      // Verificar que el menú "Quejas" muestra sus submenús (está expandido)
      cy.contains('Estadísticas').should('be.visible');
      cy.contains('Lista de quejas').should('be.visible');
      
      // Navegar a otra ruta y verificar cambio
      cy.visit('http://localhost:3000/agenda/list');
      cy.contains('Citas').should('be.visible');
    });

    it('debería poder expandir y contraer menús principales', () => {
      cy.visit('http://localhost:3000/quejas/lista');
      
      // VERIFICACIONES R1 - Interacción con menús
      
      // 1. Verificar que el menú Quejas está expandido inicialmente (ruta activa)
      cy.contains('Estadísticas').should('be.visible');
      cy.contains('Lista de quejas').should('be.visible');
      
      // 2. Contraer menú Quejas
      cy.contains('Quejas').click();
      cy.contains('Estadísticas').should('not.be.visible');
      cy.contains('Lista de quejas').should('not.be.visible');
      
      // 3. Expandir menú Agenda
      cy.contains('Agenda').click();
      cy.contains('Estadísticas').should('be.visible');
      cy.contains('Citas').should('be.visible');
      
      // 4. Expandir menú Talleres
      cy.contains('Talleres').click();
      cy.contains('Crear taller').should('be.visible');
      cy.contains('Ver talleres').should('be.visible');
    });

    it('debería mantener la sidebar visible al navegar entre rutas protegidas', () => {
      // Probar navegación entre diferentes rutas
      const rutasProtegidas = [
        '/quejas/lista',
        '/quejas/estadisticas',
        '/agenda/list',
        '/talleres/crear'
      ];

      rutasProtegidas.forEach(ruta => {
        cy.visit(`http://localhost:3000${ruta}`);
        
        // Verificar que la sidebar sigue visible con menús principales
        cy.contains('Quejas').should('be.visible');
        cy.contains('Agenda').should('be.visible');
        cy.contains('Talleres').should('be.visible');
        
        // Verificar que existe la estructura de sidebar
        cy.get('aside').should('be.visible');
      });
    });
  });

  // R2: Usuario autenticado NO - Sidebar redirige SI (pero no se muestra)
  describe('Regla R2 - Usuario NO autenticado', () => {
    beforeEach(() => {
      // Mock para usuario no autenticado
      cy.intercept('GET', '**/api/auth/checkSession/', {
        statusCode: 200,
        body: {
          isAuthenticated: false,
          user: null
        }
      });

      // Limpiar localStorage completamente
      cy.window().then((win) => {
        win.localStorage.clear();
      });
    });

    it('NO debería mostrar menús de sidebar en rutas protegidas sin autenticación', () => {
      // VERIFICACIONES R2 - Sidebar no visible
      
      // 1. Intentar acceder a ruta protegida
      cy.visit('http://localhost:3000/quejas/lista', {
        failOnStatusCode: false
      });
      
      // 2. Verificar que NO muestra elementos de la sidebar
      cy.contains('Quejas').should('not.exist');
      cy.contains('Agenda').should('not.exist');
      cy.contains('Talleres').should('not.exist');
      
      // 3. Verificar que NO existe la sidebar
      cy.get('aside').should('not.exist');
    });

    it('NO debería mostrar sidebar en páginas públicas de autenticación', () => {
      // VERIFICACIONES R2 - Páginas públicas sin sidebar
      
      // Página de login
      cy.visit('http://localhost:3000/login');
      cy.contains('Quejas').should('not.exist');
      cy.contains('Agenda').should('not.exist');
      cy.contains('Talleres').should('not.exist');
      cy.contains('Iniciar sesión').should('be.visible');
      
      // Página de registro
      cy.visit('http://localhost:3000/registrarse');
      cy.contains('Quejas').should('not.exist');
      cy.contains('Agenda').should('not.exist');
      
      // Página de restaurar contraseña
      cy.visit('http://localhost:3000/restorepassword');
      cy.contains('Quejas').should('not.exist');
      cy.contains('Agenda').should('not.exist');
    });

    it('debería mostrar formulario de login al acceder a rutas protegidas sin auth', () => {
      // VERIFICACIONES R2 - Comportamiento de redirección
      
      cy.visit('http://localhost:3000/quejas/lista', {
        failOnStatusCode: false
      });

      // Verificar que muestra elementos de login
      cy.get('input[type="email"]').should('exist');
      cy.get('input[type="password"]').should('exist');
      cy.contains('Iniciar Sesión').should('exist');
      
      // Verificar que NO muestra elementos de sidebar
      cy.contains('Quejas').should('not.exist');
      cy.get('aside').should('not.exist');
    });
  });

  // Pruebas de flujo completo de autenticación
  describe('Flujo completo de autenticación con sidebar', () => {
    it('debería mostrar sidebar después del login y ocultarla después del logout', () => {
      const userData = {
        email: 'alejandromarroquin.com@gmail.com',
        password: '123456',
        token: 'mock-flow-token-' + Date.now(),
        user: {
          nombre: 'ALEJANDRO MARROQUIN ALMEIDA',
          rol: 'user'
        }
      };

      // Mock para login
      cy.intercept('POST', '**/api/login/', {
        statusCode: 200,
        body: {
          token: userData.token,
          user: userData.user
        }
      }).as('login');

      // Mock para sesión autenticada
      cy.intercept('GET', '**/api/auth/checkSession/', {
        statusCode: 200,
        body: {
          isAuthenticated: true,
          user: userData.user
        }
      });

      // 1. Ir a login inicialmente
      cy.visit('http://localhost:3000/login');
      
      // Verificar que NO hay sidebar
      cy.contains('Quejas').should('not.exist');
      cy.get('aside').should('not.exist');
      
      // 2. Hacer login
      cy.get('input[type="email"]').type(userData.email);
      cy.get('input[type="password"]').type(userData.password);
      cy.get('button').contains('Iniciar Sesión').click();
      cy.wait('@login');
      
      // 3. Verificar que ahora SÍ hay sidebar con menús
      cy.contains('Quejas').should('be.visible');
      cy.contains('Agenda').should('be.visible');
      cy.contains('Talleres').should('be.visible');
      cy.get('aside').should('exist');

      // 4. Simular logout
      cy.window().then((win) => {
        win.localStorage.clear();
      });

      // Mock para sesión no autenticada después de logout
      cy.intercept('GET', '**/api/auth/checkSession/', {
        statusCode: 200,
        body: {
          isAuthenticated: false,
          user: null
        }
      });

      // 5. Recargar la página
      cy.reload();

      // 6. Verificar que NO hay sidebar
      cy.contains('Quejas').should('not.exist');
      cy.get('aside').should('not.exist');
    });
  });

  // Pruebas de navegación específica
  describe('Navegación específica entre secciones', () => {
    beforeEach(() => {
      // Setup de usuario autenticado
      const userData = {
        email: 'alejandromarroquin.com@gmail.com',
        password: '123456',
        token: 'mock-nav-token-' + Date.now(),
        user: {
          nombre: 'ALEJANDRO MARROQUIN ALMEIDA',
          rol: 'user'
        }
      };

      cy.intercept('POST', '**/api/login/', {
        statusCode: 200,
        body: {
          token: userData.token,
          user: userData.user
        }
      }).as('login');

      cy.intercept('GET', '**/api/auth/checkSession/', {
        statusCode: 200,
        body: {
          isAuthenticated: true,
          user: userData.user
        }
      });

      cy.visit('http://localhost:3000/login');
      cy.get('input[type="email"]').type(userData.email);
      cy.get('input[type="password"]').type(userData.password);
      cy.get('button').contains('Iniciar Sesión').click();
      cy.wait('@login');
    });

    it('debería navegar correctamente entre todas las opciones del menú', () => {
      // Navegar de Quejas a Agenda
      cy.visit('http://localhost:3000/quejas/lista');
      cy.contains('Agenda').click();
      cy.contains('Citas').click();
      cy.url().should('include', '/agenda/list');
      
      // Navegar de Agenda a Talleres
      cy.contains('Talleres').click();
      cy.contains('Ver talleres').click();
      cy.url().should('include', '/talleres/ver');
      
      // Navegar de Talleres a Quejas
      cy.contains('Quejas').click();
      cy.contains('Estadísticas').click();
      cy.url().should('include', '/quejas/estadisticas');
    });
  });

  // Prueba para verificar elementos visuales
  describe('Elementos visuales de la sidebar', () => {
    beforeEach(() => {
      const userData = {
        email: 'alejandromarroquin.com@gmail.com',
        password: '123456',
        token: 'mock-visual-token-' + Date.now(),
        user: {
          nombre: 'ALEJANDRO MARROQUIN ALMEIDA',
          rol: 'user'
        }
      };

      cy.intercept('POST', '**/api/login/', {
        statusCode: 200,
        body: {
          token: userData.token,
          user: userData.user
        }
      }).as('login');

      cy.intercept('GET', '**/api/auth/checkSession/', {
        statusCode: 200,
        body: {
          isAuthenticated: true,
          user: userData.user
        }
      });

      cy.visit('http://localhost:3000/login');
      cy.get('input[type="email"]').type(userData.email);
      cy.get('input[type="password"]').type(userData.password);
      cy.get('button').contains('Iniciar Sesión').click();
      cy.wait('@login');
    });

    it('debería mostrar iconos en los menús de la sidebar', () => {
      cy.visit('http://localhost:3000/quejas/lista');
      
      // Verificar que existen iconos cerca de los menús
      cy.contains('Quejas').siblings('svg').should('exist');
      cy.contains('Agenda').siblings('svg').should('exist');
      cy.contains('Talleres').siblings('svg').should('exist');
    });
  });
});