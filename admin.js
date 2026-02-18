// Sistema de administración para Herrería Salinas

class AdminSystem {
    constructor() {
        this.adminPassword = 'herreria2025'; // Contraseña por defecto (cambiar en producción)
        this.isAdmin = this.checkAdminStatus();
        this.init();
    }

    // Verificar si el usuario es administrador
    checkAdminStatus() {
        const sessionToken = sessionStorage.getItem('adminToken');
        return sessionToken === this.getToken();
    }

    // Generar token (simple)
    getToken() {
        return btoa(this.adminPassword + 'salt123');
    }

    // Inicializar el sistema
    init() {
        this.addAdminButton();
        this.setupAdminUI();
    }

    // Agregar botón de admin en la esquina
    addAdminButton() {
        const adminButtonContainer = document.createElement('div');
        adminButtonContainer.id = 'admin-panel';
        adminButtonContainer.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 1000;
        `;

        if (this.isAdmin) {
            adminButtonContainer.innerHTML = `
                <button id="logout-btn" style="
                    padding: 8px 15px;
                    background-color: #e76f51;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 0.9rem;
                ">Salir Admin</button>
            `;
            document.body.appendChild(adminButtonContainer);
            document.getElementById('logout-btn').addEventListener('click', () => this.logout());
        } else {
            adminButtonContainer.innerHTML = `
                <button id="login-btn" style="
                    padding: 8px 15px;
                    background-color: #264653;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: bold;
                    font-size: 0.9rem;
                ">Admin</button>
            `;
            document.body.appendChild(adminButtonContainer);
            document.getElementById('login-btn').addEventListener('click', () => this.showLoginModal());
        }
    }

    // Mostrar modal de login
    showLoginModal() {
        const modal = document.createElement('div');
        modal.id = 'login-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
        `;

        modal.innerHTML = `
            <div style="
                background-color: white;
                padding: 2rem;
                border-radius: 10px;
                max-width: 400px;
                width: 90%;
                box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
            ">
                <h2 style="color: #264653; margin-bottom: 1rem; text-align: center;">Panel de Administrador</h2>
                <input type="password" id="admin-password" placeholder="Ingrese la contraseña" style="
                    width: 100%;
                    padding: 10px;
                    margin-bottom: 1rem;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    font-size: 1rem;
                    box-sizing: border-box;
                " />
                <div style="display: flex; gap: 10px;">
                    <button id="login-submit" style="
                        flex: 1;
                        padding: 10px;
                        background-color: #264653;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        font-weight: bold;
                    ">Acceder</button>
                    <button id="login-cancel" style="
                        flex: 1;
                        padding: 10px;
                        background-color: #ccc;
                        color: #333;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        font-weight: bold;
                    ">Cancelar</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById('login-submit').addEventListener('click', () => this.checkPassword());
        document.getElementById('login-cancel').addEventListener('click', () => modal.remove());
        document.getElementById('admin-password').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.checkPassword();
        });

        document.getElementById('admin-password').focus();
    }

    // Verificar contraseña
    checkPassword() {
        const password = document.getElementById('admin-password').value;
        if (password === this.adminPassword) {
            sessionStorage.setItem('adminToken', this.getToken());
            this.isAdmin = true;
            document.getElementById('login-modal').remove();
            location.reload();
        } else {
            alert('Contraseña incorrecta');
            document.getElementById('admin-password').value = '';
        }
    }

    // Logout
    logout() {
        sessionStorage.removeItem('adminToken');
        this.isAdmin = false;
        location.reload();
    }

    // Configurar interfaz de admin
    setupAdminUI() {
        if (this.isAdmin && window.location.pathname.includes('catalogo.html')) {
            this.addAddWorkButton();
        }
    }

    // Agregar botón para añadir trabajos en catálogo
    addAddWorkButton() {
        const galeria = document.querySelector('.galeria');
        if (!galeria) return;

        const addButton = document.createElement('div');
        addButton.className = 'tarjeta admin-add-btn';
        addButton.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 300px;
            background: linear-gradient(135deg, #264653, #2a5a6f);
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        addButton.innerHTML = `
            <div style="text-align: center; color: white;">
                <div style="font-size: 3rem; margin-bottom: 0.5rem;">+</div>
                <div style="font-weight: bold; font-size: 1.2rem;">Añadir Trabajo</div>
            </div>
        `;

        addButton.addEventListener('mouseover', () => {
            addButton.style.background = 'linear-gradient(135deg, #2a5a6f, #333)';
            addButton.style.transform = 'translateY(-8px)';
        });

        addButton.addEventListener('mouseout', () => {
            addButton.style.background = 'linear-gradient(135deg, #264653, #2a5a6f)';
            addButton.style.transform = 'translateY(0)';
        });

        addButton.addEventListener('click', () => this.showAddWorkModal());
        galeria.insertBefore(addButton, galeria.firstChild);
    }

    // Modal para añadir trabajo
    showAddWorkModal() {
        const modal = document.createElement('div');
        modal.id = 'add-work-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            overflow-y: auto;
        `;

        modal.innerHTML = `
            <div style="
                background-color: white;
                padding: 2rem;
                border-radius: 10px;
                max-width: 500px;
                width: 90%;
                box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
                margin: auto;
                color: #333;
            ">
                <h2 style="color: #264653; margin-bottom: 1rem; text-align: center;">Añadir Nuevo Trabajo</h2>
                
                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Tipo de Contenido:</label>
                    <select id="content-type" style="
                        width: 100%;
                        padding: 10px;
                        border: 1px solid #ddd;
                        border-radius: 5px;
                    ">
                        <option value="image">Imagen</option>
                        <option value="video">Video</option>
                    </select>
                </div>

                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Imagen/Video:</label>
                    <input type="file" id="work-file" accept="image/*,video/*" style="
                        width: 100%;
                        padding: 10px;
                        border: 1px solid #ddd;
                        border-radius: 5px;
                        box-sizing: border-box;
                    " />
                </div>

                <div style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: bold;">Descripción:</label>
                    <textarea id="work-description" placeholder="Descripción del trabajo" style="
                        width: 100%;
                        padding: 10px;
                        border: 1px solid #ddd;
                        border-radius: 5px;
                        box-sizing: border-box;
                        min-height: 80px;
                        font-family: Arial;
                    "></textarea>
                </div>

                <div style="display: flex; gap: 10px;">
                    <button id="add-submit" style="
                        flex: 1;
                        padding: 10px;
                        background-color: #264653;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        font-weight: bold;
                    ">Agregar</button>
                    <button id="add-cancel" style="
                        flex: 1;
                        padding: 10px;
                        background-color: #ccc;
                        color: #333;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        font-weight: bold;
                    ">Cancelar</button>
                </div>
                <p style="font-size: 0.9rem; color: #666; margin-top: 1rem; text-align: center;">
                    Nota: Los cambios se guardan localmente. Recarge la página para verlos.
                </p>
            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById('add-submit').addEventListener('click', () => this.addWork(modal));
        document.getElementById('add-cancel').addEventListener('click', () => modal.remove());
    }

    // Agregar trabajo a la galería
    addWork(modal) {
        const contentType = document.getElementById('content-type').value;
        const fileInput = document.getElementById('work-file');
        const description = document.getElementById('work-description').value;

        if (!fileInput.files.length || !description) {
            alert('Por favor complete todos los campos');
            return;
        }

        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const url = e.target.result;
            // Guardar en localStorage
            let works = JSON.parse(localStorage.getItem('customWorks')) || [];
            works.push({
                type: contentType,
                url: url,
                description: description,
                timestamp: new Date().getTime()
            });
            localStorage.setItem('customWorks', JSON.stringify(works));

            // Agregar a la página
            this.displayNewWork(contentType, url, description);
            modal.remove();
            alert('Trabajo agregado exitosamente');
        };
        if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
            reader.readAsDataURL(file);
        } else {
            alert('Solo se permiten imágenes o videos');
        }
    }

    // Mostrar nuevo trabajo
    displayNewWork(type, url, description) {
        const galeria = document.querySelector('.galeria');
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta';

        let contentHTML = '';
        if (type === 'image') {
            contentHTML = `<img src="${url}" alt="${description}" class="tarjeta-media">`;
        } else {
            contentHTML = `<video src="${url}" class="tarjeta-media" controls autoplay muted loop></video>`;
        }

        tarjeta.innerHTML = `
            ${contentHTML}
            <div class="info">${description}</div>
        `;

        // Expande la tarjeta al hacer clic
        tarjeta.addEventListener('click', function(e) {
            // Si es imagen y en móvil, usar pantalla completa
            const isMobile = window.matchMedia('(max-width: 768px)').matches;
            const media = tarjeta.querySelector('.tarjeta-media');
            if (type === 'image' && isMobile && media && media.requestFullscreen) {
                media.requestFullscreen();
                e.stopPropagation();
                return;
            }
            tarjeta.classList.toggle('tarjeta-expandida');
        });

        galeria.appendChild(tarjeta);
    }

    // Cargar trabajos guardados
    loadCustomWorks() {
        if (window.location.pathname.includes('catalogo.html')) {
            const works = JSON.parse(localStorage.getItem('customWorks')) || [];
            works.forEach(work => {
                this.displayNewWork(work.type, work.url, work.description);
            });
        }
    }
}

// Inicializar cuando el documento esté listo
document.addEventListener('DOMContentLoaded', () => {
    const admin = new AdminSystem();
    admin.loadCustomWorks();
});
