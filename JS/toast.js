// Sistema de notificações toast moderno
const Toast = {
    container: null,
    queue: [],
    isProcessing: false,
    maxToasts: 3,

    init: function() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'toast-container';
            this.container.setAttribute('role', 'region');
            this.container.setAttribute('aria-live', 'polite');
            this.container.setAttribute('aria-label', 'Notificações');
            document.body.appendChild(this.container);
        }
    },

    show: function(message, type = 'info', duration = 4000) {
        this.init();
        
        const toast = {
            id: Date.now() + Math.random(),
            message,
            type, // 'success', 'error', 'warning', 'info'
            duration
        };

        this.queue.push(toast);
        
        if (!this.isProcessing) {
            this.processQueue();
        }
    },

    processQueue: function() {
        if (this.queue.length === 0) {
            this.isProcessing = false;
            return;
        }

        this.isProcessing = true;

        // Limitar número de toasts visíveis
        const visibleToasts = this.container.querySelectorAll('.toast');
        if (visibleToasts.length >= this.maxToasts) {
            // Remover o mais antigo
            visibleToasts[0].remove();
        }

        const toast = this.queue.shift();
        this.createToast(toast);

        // Processar próximo após um delay
        setTimeout(() => this.processQueue(), 150);
    },

    createToast: function(toast) {
        const toastEl = document.createElement('div');
        toastEl.className = `toast toast-${toast.type}`;
        toastEl.setAttribute('role', 'alert');
        toastEl.innerHTML = `
            <div class="toast-icon">${this.getIcon(toast.type)}</div>
            <div class="toast-message">${this.escapeHtml(toast.message)}</div>
            <button class="toast-close" aria-label="Fechar notificação">&times;</button>
        `;

        this.container.appendChild(toastEl);

        // Animação de entrada
        requestAnimationFrame(() => {
            toastEl.classList.add('toast-show');
        });

        // Botão de fechar
        const closeBtn = toastEl.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            this.removeToast(toastEl);
        });

        // Auto-remover após duração
        if (toast.duration > 0) {
            setTimeout(() => {
                this.removeToast(toastEl);
            }, toast.duration);
        }
    },

    removeToast: function(toastEl) {
        toastEl.classList.remove('toast-show');
        toastEl.classList.add('toast-hide');
        
        setTimeout(() => {
            if (toastEl.parentNode) {
                toastEl.parentNode.removeChild(toastEl);
            }
        }, 300);
    },

    getIcon: function(type) {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || icons.info;
    },

    escapeHtml: function(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    // Atalhos para tipos específicos
    success: function(message, duration) {
        this.show(message, 'success', duration);
    },

    error: function(message, duration) {
        this.show(message, 'error', duration);
    },

    warning: function(message, duration) {
        this.show(message, 'warning', duration);
    },

    info: function(message, duration) {
        this.show(message, 'info', duration);
    }
};

// Expor globalmente
window.Toast = Toast;

// Sobrescrever alert global (opcional - pode ser comentado se preferir manter alert nativo em alguns casos)
// window.alert = function(message) {
//     Toast.info(message);
// };
