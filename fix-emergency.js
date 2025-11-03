// CORREÇÃO EMERGENCIAL - Cole este código no Console do navegador para testar

console.log('🔧 Iniciando correção emergencial...');

// 1. Testar se o Toast existe
if (typeof Toast !== 'undefined') {
    console.log('✅ Toast OK');
    Toast.success('Sistema Toast funcionando!');
} else {
    console.error('❌ Toast não encontrado!');
}

// 2. Testar showView
if (typeof showView !== 'undefined') {
    console.log('✅ showView OK');
} else {
    console.error('❌ showView não encontrado!');
}

// 3. Corrigir tema manualmente
function fixTheme() {
    const theme = document.documentElement.getAttribute('data-theme') || 'light';
    console.log('🎨 Tema atual:', theme);
    
    const welcomeThemeToggle = document.getElementById('welcome-theme-toggle');
    if (welcomeThemeToggle) {
        const icon = welcomeThemeToggle.querySelector('.theme-icon');
        if (icon) {
            // Se está em light, mostrar lua (para ir para dark)
            // Se está em dark, mostrar sol (para ir para light)
            icon.textContent = theme === 'light' ? '🌙' : '☀️';
            console.log('✅ Ícone do tema corrigido:', icon.textContent);
        }
    } else {
        console.error('❌ Botão de tema não encontrado!');
    }
}

fixTheme();

// 4. Adicionar event listener manualmente
const welcomeQuizBtn = document.getElementById('welcome-quiz-btn');
if (welcomeQuizBtn) {
    console.log('✅ Botão Quiz encontrado');
    welcomeQuizBtn.onclick = function() {
        console.log('🎯 Quiz clicado!');
        if (typeof showView !== 'undefined') {
            showView('home-view');
        } else {
            console.error('❌ showView não disponível!');
        }
    };
} else {
    console.error('❌ Botão Quiz não encontrado!');
}

console.log('🔧 Correção concluída. Tente clicar nos botões agora.');
