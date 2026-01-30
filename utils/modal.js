/**
 * OSCAR Custom Modal System
 * Themed dialogs to replace browser defaults
 */

const OscarModal = {
  // Oscar expressions for different modal types
  expressions: {
    confirm: '🤔',
    alert: '🐕',
    success: '🎉',
    warning: '⚠️',
    danger: '😰',
    question: '❓',
    info: 'ℹ️'
  },

  // Oscar messages for different situations
  messages: {
    confirm: [
      "Are you sure about this?",
      "Just double-checking!",
      "Oscar wants to make sure..."
    ],
    danger: [
      "Whoa, this is serious!",
      "This can't be undone!",
      "Oscar is a bit worried..."
    ],
    success: [
      "Woof! Great job!",
      "Mission accomplished!",
      "Oscar approves!"
    ]
  },

  /**
   * Show a confirmation dialog
   * @param {Object} options - Modal options
   * @param {string} options.title - Modal title
   * @param {string} options.message - Modal message
   * @param {string} options.confirmText - Confirm button text (default: "Confirm")
   * @param {string} options.cancelText - Cancel button text (default: "Cancel")
   * @param {string} options.type - Modal type: 'confirm', 'danger', 'warning' (default: 'confirm')
   * @param {boolean} options.showOscarSpeech - Show Oscar's speech bubble (default: false)
   * @returns {Promise<boolean>} - Resolves to true if confirmed, false if cancelled
   */
  confirm(options) {
    return new Promise((resolve) => {
      const {
        title = 'Confirm Action',
        message = 'Are you sure you want to proceed?',
        confirmText = 'Confirm',
        cancelText = 'Cancel',
        type = 'confirm',
        showOscarSpeech = true
      } = options;

      const icon = this.expressions[type] || this.expressions.confirm;
      const modalClass = type === 'danger' ? 'modal-danger' : 'modal-confirm';
      const btnClass = type === 'danger' ? 'oscar-modal-btn-danger' : 'oscar-modal-btn-primary';

      const oscarMessage = type === 'danger'
        ? this.messages.danger[Math.floor(Math.random() * this.messages.danger.length)]
        : this.messages.confirm[Math.floor(Math.random() * this.messages.confirm.length)];

      const speechBubble = showOscarSpeech ? `
        <div class="oscar-modal-speech">
          <span class="oscar-modal-speech-icon">🐕</span>
          <span class="oscar-modal-speech-text">${oscarMessage}</span>
        </div>
      ` : '';

      const html = `
        <div class="oscar-modal-overlay" id="oscar-modal-overlay">
          <div class="oscar-modal ${modalClass}">
            <div class="oscar-modal-header">
              <span class="oscar-modal-icon">${icon}</span>
              <h3 class="oscar-modal-title">${title}</h3>
            </div>
            <div class="oscar-modal-body">
              ${speechBubble}
              <p class="oscar-modal-message">${message}</p>
            </div>
            <div class="oscar-modal-footer">
              <button class="oscar-modal-btn oscar-modal-btn-secondary" id="oscar-modal-cancel">
                ${cancelText}
              </button>
              <button class="oscar-modal-btn ${btnClass}" id="oscar-modal-confirm">
                ${confirmText}
              </button>
            </div>
          </div>
        </div>
      `;

      // Remove any existing modal
      this.close();

      // Add modal to DOM
      document.body.insertAdjacentHTML('beforeend', html);
      const overlay = document.getElementById('oscar-modal-overlay');
      const confirmBtn = document.getElementById('oscar-modal-confirm');
      const cancelBtn = document.getElementById('oscar-modal-cancel');

      // Show modal with animation
      requestAnimationFrame(() => {
        overlay.classList.add('visible');
        confirmBtn.focus();
      });

      // Handle confirm
      confirmBtn.addEventListener('click', () => {
        this.close();
        resolve(true);
      });

      // Handle cancel
      cancelBtn.addEventListener('click', () => {
        this.close();
        resolve(false);
      });

      // Handle escape key
      const handleKeydown = (e) => {
        if (e.key === 'Escape') {
          this.close();
          resolve(false);
          document.removeEventListener('keydown', handleKeydown);
        } else if (e.key === 'Enter') {
          this.close();
          resolve(true);
          document.removeEventListener('keydown', handleKeydown);
        }
      };
      document.addEventListener('keydown', handleKeydown);

      // Handle overlay click
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          // Shake animation instead of closing
          const modal = overlay.querySelector('.oscar-modal');
          modal.classList.add('shake');
          setTimeout(() => modal.classList.remove('shake'), 300);
        }
      });
    });
  },

  /**
   * Show an alert dialog
   * @param {Object} options - Modal options
   * @param {string} options.title - Modal title
   * @param {string} options.message - Modal message
   * @param {string} options.buttonText - Button text (default: "OK")
   * @param {string} options.type - Modal type: 'alert', 'success', 'warning', 'info' (default: 'alert')
   * @returns {Promise<void>} - Resolves when dismissed
   */
  alert(options) {
    return new Promise((resolve) => {
      const {
        title = 'Notice',
        message = '',
        buttonText = 'OK',
        type = 'alert'
      } = options;

      const icon = this.expressions[type] || this.expressions.alert;

      const html = `
        <div class="oscar-modal-overlay" id="oscar-modal-overlay">
          <div class="oscar-modal modal-alert">
            <div class="oscar-modal-header">
              <span class="oscar-modal-icon">${icon}</span>
              <h3 class="oscar-modal-title">${title}</h3>
            </div>
            <div class="oscar-modal-body">
              <p class="oscar-modal-message">${message}</p>
            </div>
            <div class="oscar-modal-footer centered">
              <button class="oscar-modal-btn oscar-modal-btn-primary" id="oscar-modal-ok">
                ${buttonText}
              </button>
            </div>
          </div>
        </div>
      `;

      // Remove any existing modal
      this.close();

      // Add modal to DOM
      document.body.insertAdjacentHTML('beforeend', html);
      const overlay = document.getElementById('oscar-modal-overlay');
      const okBtn = document.getElementById('oscar-modal-ok');

      // Show modal with animation
      requestAnimationFrame(() => {
        overlay.classList.add('visible');
        okBtn.focus();
      });

      // Handle OK
      okBtn.addEventListener('click', () => {
        this.close();
        resolve();
      });

      // Handle escape or enter key
      const handleKeydown = (e) => {
        if (e.key === 'Escape' || e.key === 'Enter') {
          this.close();
          resolve();
          document.removeEventListener('keydown', handleKeydown);
        }
      };
      document.addEventListener('keydown', handleKeydown);

      // Handle overlay click
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          this.close();
          resolve();
        }
      });
    });
  },

  /**
   * Show a prompt dialog
   * @param {Object} options - Modal options
   * @param {string} options.title - Modal title
   * @param {string} options.message - Modal message
   * @param {string} options.placeholder - Input placeholder
   * @param {string} options.defaultValue - Default input value
   * @param {string} options.confirmText - Confirm button text (default: "OK")
   * @param {string} options.cancelText - Cancel button text (default: "Cancel")
   * @returns {Promise<string|null>} - Resolves to input value or null if cancelled
   */
  prompt(options) {
    return new Promise((resolve) => {
      const {
        title = 'Enter Value',
        message = '',
        placeholder = '',
        defaultValue = '',
        confirmText = 'OK',
        cancelText = 'Cancel'
      } = options;

      const html = `
        <div class="oscar-modal-overlay" id="oscar-modal-overlay">
          <div class="oscar-modal modal-confirm">
            <div class="oscar-modal-header">
              <span class="oscar-modal-icon">✏️</span>
              <h3 class="oscar-modal-title">${title}</h3>
            </div>
            <div class="oscar-modal-body">
              ${message ? `<p class="oscar-modal-message">${message}</p>` : ''}
              <input type="text" class="oscar-modal-input" id="oscar-modal-input"
                     placeholder="${placeholder}" value="${defaultValue}">
            </div>
            <div class="oscar-modal-footer">
              <button class="oscar-modal-btn oscar-modal-btn-secondary" id="oscar-modal-cancel">
                ${cancelText}
              </button>
              <button class="oscar-modal-btn oscar-modal-btn-primary" id="oscar-modal-confirm">
                ${confirmText}
              </button>
            </div>
          </div>
        </div>
      `;

      // Remove any existing modal
      this.close();

      // Add modal to DOM
      document.body.insertAdjacentHTML('beforeend', html);
      const overlay = document.getElementById('oscar-modal-overlay');
      const input = document.getElementById('oscar-modal-input');
      const confirmBtn = document.getElementById('oscar-modal-confirm');
      const cancelBtn = document.getElementById('oscar-modal-cancel');

      // Show modal with animation
      requestAnimationFrame(() => {
        overlay.classList.add('visible');
        input.focus();
        input.select();
      });

      // Handle confirm
      confirmBtn.addEventListener('click', () => {
        this.close();
        resolve(input.value);
      });

      // Handle cancel
      cancelBtn.addEventListener('click', () => {
        this.close();
        resolve(null);
      });

      // Handle enter key in input
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.close();
          resolve(input.value);
        }
      });

      // Handle escape key
      const handleKeydown = (e) => {
        if (e.key === 'Escape') {
          this.close();
          resolve(null);
          document.removeEventListener('keydown', handleKeydown);
        }
      };
      document.addEventListener('keydown', handleKeydown);
    });
  },

  /**
   * Close any open modal
   */
  close() {
    const overlay = document.getElementById('oscar-modal-overlay');
    if (overlay) {
      overlay.classList.remove('visible');
      setTimeout(() => overlay.remove(), 250);
    }
  }
};

// Export for use in other scripts
if (typeof window !== 'undefined') {
  window.OscarModal = OscarModal;
}
