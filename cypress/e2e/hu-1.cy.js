// Pruebas para la tabla de decisiones del homepage
describe('Acceso al Homepage - Tabla de Decisiones', () => {

    beforeEach(() => {
        // Limpiar localStorage antes de cada prueba
        cy.clearLocalStorage();
        cy.clearCookies();
    });

    // R1: Usuario autenticado SI - Carga la homepage SI
    describe('Regla R1 - Usuario autenticado', () => {
        const userData = {
            email: 'alejandromarroquin.com@gmail.com',
            password: '123456',
            token: 'mock-normal-token-' + Date.now(),
            user: {
                nombre: 'ALEJANDRO MARROQUIN ALMEIDA',
                rol: 'user'
            }
        };

        beforeEach(() => {
            // Mock para el login normal
            cy.intercept('POST', '**/api/login/', {
                statusCode: 200,
                body: {
                    token: userData.token,
                    user: userData.user
                }
            }).as('normalLogin');

            // Mock para la verificación de sesión
            cy.intercept('GET', '**/api/auth/checkSession/', {
                statusCode: 200,
                body: {
                    isAuthenticated: true,
                    user: userData.user
                }
            }).as('checkSession');

            // Visitar la página de login
            cy.visit('http://localhost:3000/login');

            // Llenar el formulario de login normal
            cy.get('input[type="email"]').type(userData.email);
            cy.get('input[type="password"]').type(userData.password);

            // Hacer click en el botón de iniciar sesión
            cy.get('button').contains('Iniciar Sesión').click();

            // Esperar a que se complete el login
            cy.wait('@normalLogin');

            // Esperar a que se complete la navegación
            cy.url().should('not.include', '/login', { timeout: 10000 });
        });

        it('debería permitir acceso al homepage cuando el usuario está autenticado', () => {
            // Intentar acceder directamente al homepage
            cy.visit('http://localhost:3000/quejas/lista');

            // Verificaciones para R1
            cy.url().should('eq', 'http://localhost:3000/quejas/lista');

            // Verificar que la página carga correctamente
            cy.get('body').should('be.visible');

            // Verificar que existe contenido específico del homepage
            cy.get('h1, h2, h3').should('exist');

            // Verificar que NO somos redirigidos al login
            cy.url().should('not.include', '/login');

            // Verificar localStorage tiene datos de usuario
            cy.window().then((win) => {
                expect(win.localStorage.getItem('userToken')).to.exist;
                expect(win.localStorage.getItem('userName')).to.exist;
                expect(win.localStorage.getItem('userEmail')).to.exist;
            });
        });

        it('debería mantener la sesión al recargar la página', () => {
            cy.visit('http://localhost:3000/quejas/lista');

            // Recargar la página
            cy.reload();

            // Verificar que seguimos autenticados
            cy.url().should('eq', 'http://localhost:3000/quejas/lista');
            cy.window().then((win) => {
                expect(win.localStorage.getItem('userToken')).to.exist;
            });
        });
    });

    // R2: Usuario autenticado NO - Carga la homepage SI (pero debería redirigir)
    describe('Regla R2 - Usuario NO autenticado', () => {
        beforeEach(() => {
            // Mock para la verificación de sesión no autenticada
            cy.intercept('GET', '**/api/auth/checkSession/', {
                statusCode: 200,
                body: {
                    isAuthenticated: false,
                    user: null
                }
            }).as('checkSessionNotAuth');

            // Asegurarse de que no hay token en localStorage
            cy.window().then((win) => {
                win.localStorage.removeItem('userToken');
                win.localStorage.removeItem('userName');
                win.localStorage.removeItem('userRole');
                win.localStorage.removeItem('userEmail');
            });
        });

        it('debería redirigir al login cuando el usuario no está autenticado', () => {
            // Visitar directamente el homepage sin estar autenticado
            cy.visit('http://localhost:3000/quejas/lista', {
                failOnStatusCode: false
            });

            // Verificaciones para R2 - debería redirigir a login
            cy.url().should('include', '/login');

            // Verificar que estamos en la página de login
            cy.get('body').should('be.visible');

            // Verificar elementos específicos del login
            cy.get('input[type="email"]').should('exist');
            cy.get('input[type="password"]').should('exist');
            cy.get('button').contains('Iniciar Sesión').should('exist');

            // Verificar que NO estamos en el homepage
            cy.url().should('not.include', '/quejas/lista');

            // Verificar localStorage NO tiene datos de usuario
            cy.window().then((win) => {
                expect(win.localStorage.getItem('userToken')).to.be.null;
                expect(win.localStorage.getItem('userName')).to.be.null;
            });
        });

        it('debería mostrar el formulario de login al acceder sin autenticación', () => {
            // Visitar login directamente
            cy.visit('http://localhost:3000/login');

            // Verificar que estamos en login
            cy.url().should('include', '/login');

            // Verificar elementos del formulario de login
            cy.get('input[type="email"]').should('be.visible');
            cy.get('input[type="password"]').should('be.visible');
            cy.get('button').contains('Iniciar Sesión').should('be.visible');
        });
    });

    // Pruebas de autenticación fallida
    describe('Autenticación fallida', () => {
        it('debería mostrar error con credenciales incorrectas', () => {
            // Mock para login fallido
            cy.intercept('POST', '**/api/login/', {
                statusCode: 401,
                body: { error: 'Usuario no encontrado o credenciales incorrectas' }
            }).as('failedLogin');

            cy.visit('http://localhost:3000/login');

            // Llenar con credenciales incorrectas
            cy.get('input[type="email"]').type('wrong@email.com');
            cy.get('input[type="password"]').type('wrongpassword');
            cy.get('button').contains('Iniciar Sesión').click();

            cy.wait('@failedLogin');

            // Verificar que se muestra mensaje de error
            cy.get('.bg-red-50').should('be.visible');
            cy.contains('Usuario no encontrado o credenciales incorrectas').should('exist');

            // Verificar que seguimos en la página de login
            cy.url().should('include', '/login');
        });
    });

    // Prueba de transición de estados
    describe('Transición de estados de autenticación', () => {
        const userData = {
            email: 'alejandromarroquin.com@gmail.com',
            password: '123456',
            token: 'mock-transition-token-' + Date.now(),
            user: {
                nombre: 'ALEJANDRO MARROQUIN ALMEIDA',
                rol: 'user'
            }
        };

        it('debería permitir acceso después del login y redirigir después del logout', () => {
            // Primero: estado no autenticado
            cy.intercept('GET', '**/api/auth/checkSession/', {
                statusCode: 200,
                body: { isAuthenticated: false, user: null }
            });

            cy.visit('http://localhost:3000/quejas/lista', { failOnStatusCode: false });
            cy.url().should('include', '/login');

            // Segundo: hacer login
            cy.intercept('POST', '**/api/login/', {
                statusCode: 200,
                body: { token: userData.token, user: userData.user }
            }).as('transitionLogin');

            cy.intercept('GET', '**/api/auth/checkSession/', {
                statusCode: 200,
                body: { isAuthenticated: true, user: userData.user }
            });

            cy.get('input[type="email"]').type(userData.email);
            cy.get('input[type="password"]').type(userData.password);
            cy.get('button').contains('Iniciar Sesión').click();

            cy.wait('@transitionLogin');
            cy.url().should('not.include', '/login');

            // Tercero: verificar acceso al homepage
            cy.visit('http://localhost:3000/quejas/lista');
            cy.url().should('eq', 'http://localhost:3000/quejas/lista');

            // Cuarto: simular logout
            cy.window().then((win) => {
                win.localStorage.removeItem('userToken');
            });

            cy.intercept('GET', '**/api/auth/checkSession/', {
                statusCode: 200,
                body: { isAuthenticated: false, user: null }
            });

            // Quinto: verificar redirección después de logout
            cy.visit('http://localhost:3000/quejas/lista', { failOnStatusCode: false });
            cy.url().should('include', '/login');
        });
    });
});