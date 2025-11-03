"""
Script para adicionar documentação JSDoc nas funções principais do main.js
"""

# Documentações JSDoc para funções principais
jsdoc_docs = {
    'showView': '''/**
     * Exibe uma view (tela) específica e oculta as demais.
     * @param {string} viewId - ID da view a ser exibida
     */''',
    
    'updateThemeButton': '''/**
     * Atualiza o texto e ícone do botão de tema conforme o tema atual.
     * @param {string} theme - Tema atual ('light' ou 'dark')
     */''',
    
    'populateFilters': '''/**
     * Popula os filtros de tags e dificuldades com base nas perguntas carregadas.
     * Cria botões dinamicamente para cada tag e dificuldade disponível.
     */''',
    
    'focusFirstInteractive': '''/**
     * Foca no primeiro elemento interativo da view para melhorar acessibilidade.
     * @param {string} viewId - ID da view onde buscar o elemento
     */''',
    
    'initTheme': '''/**
     * Inicializa o tema da aplicação baseado na preferência salva ou do sistema.
     * Aplica o tema e configura o event listener do botão de alternância.
     */''',
    
    'showStatsView': '''/**
     * Exibe a tela de estatísticas e carrega os dados do usuário.
     */''',
    
    'loadAndDisplayStats': '''/**
     * Carrega as estatísticas do localStorage e exibe na interface.
     */''',
    
    'calculateStats': '''/**
     * Calcula estatísticas detalhadas baseadas no histórico de quizzes.
     * @returns {Object} Objeto contendo todas as estatísticas calculadas
     */''',
    
    'displayCategoryStats': '''/**
     * Exibe estatísticas por categoria/tag no DOM.
     * @param {Object} categoryStats - Objeto com estatísticas por categoria
     */''',
    
    'formatTime': '''/**
     * Formata tempo em segundos para formato legível (Xmin Ys).
     * @param {number} seconds - Tempo em segundos
     * @returns {string} Tempo formatado
     */''',
    
    'resetStats': '''/**
     * Reseta todas as estatísticas do usuário após confirmação.
     */''',
    
    'exportStats': '''/**
     * Exporta as estatísticas do usuário em formato JSON para download.
     */''',
    
    'getRandomQuestions': '''/**
     * Retorna um número aleatório de perguntas do banco de dados.
     * @param {number} count - Número de perguntas desejadas
     * @returns {Array} Array com as perguntas aleatórias
     */''',
    
    'showGroupView': '''/**
     * Exibe a view de partida em grupo.
     */''',
    
    'showGroupMenu': '''/**
     * Exibe o menu inicial de partida em grupo.
     */''',
    
    'showCreateGroup': '''/**
     * Exibe o formulário para criar uma nova partida em grupo.
     */''',
    
    'showJoinGroup': '''/**
     * Exibe o formulário para entrar em uma partida existente.
     */''',
    
    'createGroup': '''/**
     * Cria uma nova partida em grupo e exibe a sala de espera do anfitrião.
     */''',
    
    'joinGroup': '''/**
     * Permite um jogador entrar em uma partida existente usando o código.
     */''',
    
    'showGroupLobbyHost': '''/**
     * Exibe a sala de espera do anfitrião com lista de jogadores.
     */''',
    
    'showGroupLobbyPlayer': '''/**
     * Exibe a sala de espera do jogador participante.
     */''',
    
    'updatePlayersListHost': '''/**
     * Atualiza a lista de jogadores na view do anfitrião.
     */''',
    
    'updatePlayersListPlayer': '''/**
     * Atualiza a lista de jogadores na view do participante.
     */''',
    
    'updateStartButton': '''/**
     * Atualiza o estado do botão de iniciar partida baseado no número de jogadores.
     */''',
    
    'startGroupGame': '''/**
     * Inicia a partida em grupo após validações.
     */''',
    
    'startGroupQuiz': '''/**
     * Inicia o quiz da partida em grupo com as perguntas selecionadas.
     */''',
    
    'showGroupQuestion': '''/**
     * Exibe a pergunta atual da partida em grupo.
     */''',
    
    'startGroupTimer': '''/**
     * Inicia o timer para a pergunta atual da partida em grupo.
     */''',
}

file_path = r'c:\Users\NOTEBOOK 63\Desktop\Bot Benefícios\quiz-biblico\JS\main.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

original_content = content
changes_count = 0

# Adicionar JSDoc antes de cada função
for func_name, jsdoc in jsdoc_docs.items():
    # Procurar pela função sem JSDoc antes dela
    import re
    
    # Pattern para encontrar função sem JSDoc imediatamente antes
    pattern = rf'(?<!/\*\*[\s\S]*?\*/)\n(\s*)function {func_name}\('
    
    def replacement(match):
        global changes_count
        indent = match.group(1)
        changes_count += 1
        return f'\n{indent}{jsdoc}\n{indent}function {func_name}('
    
    content = re.sub(pattern, replacement, content)

# Salvar se houver mudanças
if content != original_content:
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f'✅ JSDoc adicionado com sucesso!')
    print(f'📊 Total: {changes_count} documentações adicionadas')
else:
    print('ℹ️ Nenhuma mudança necessária - funções já documentadas')
