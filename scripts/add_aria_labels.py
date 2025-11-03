import re

# Mapa de IDs de botões e seus aria-labels
aria_labels = {
    'confirm-join-group': 'Confirmar entrada na partida',
    'cancel-join-group': 'Cancelar entrada na partida',
    'copy-code-btn': 'Copiar código da partida',
    'copy-link-btn': 'Copiar link da partida',
    'start-group-game': 'Iniciar partida em grupo',
    'cancel-group-lobby': 'Cancelar e sair da partida',
    'leave-group-lobby': 'Sair da sala de espera',
    'restart-game': 'Reiniciar jogo da memória',
    'back-to-config': 'Voltar para configurações do jogo',
    'export-analytics': 'Exportar dados analíticos completos',
    'clear-analytics': 'Limpar todos os dados analíticos',
    'reset-stats': 'Resetar todas as estatísticas',
    'export-stats': 'Exportar estatísticas',
    'start-game': 'Iniciar jogo da memória',
}

# Aria labels para botões por classe
class_aria_labels = {
    'memory-player-btn': lambda n: f'Selecionar {n} jogador(es)',
    'memory-difficulty-btn': lambda diff: f'Selecionar dificuldade {diff.lower()}',
}

file_path = r'c:\Users\NOTEBOOK 63\Desktop\Bot Benefícios\quiz-biblico\index.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

original_content = content
changes = []

# Adicionar aria-labels por ID
for button_id, label in aria_labels.items():
    # Procurar botões que não têm aria-label
    pattern = rf'(<button[^>]*id="{button_id}"[^>]*?)(?!.*aria-label)(>)'
    
    def replacement(match):
        before = match.group(1)
        after = match.group(2)
        changes.append(f'  ✓ {button_id}: "{label}"')
        return f'{before} aria-label="{label}"{after}'
    
    content = re.sub(pattern, replacement, content, flags=re.DOTALL)

# Adicionar aria-labels para botões de player do memory game
for i in range(1, 5):
    pattern = rf'(<button[^>]*class="memory-player-btn[^"]*"[^>]*data-players="{i}"[^>]*?)(?!.*aria-label)(>)'
    label = f'Selecionar {i} jogador' if i == 1 else f'Selecionar {i} jogadores'
    
    def replacement(match):
        before = match.group(1)
        after = match.group(2)
        changes.append(f'  ✓ memory-player-btn[{i}]: "{label}"')
        return f'{before} aria-label="{label}"{after}'
    
    content = re.sub(pattern, replacement, content, flags=re.DOTALL)

# Adicionar aria-labels para botões de dificuldade do memory game
difficulties = [('easy', 'Fácil'), ('medium', 'Médio'), ('hard', 'Difícil')]
for diff_value, diff_name in difficulties:
    pattern = rf'(<button[^>]*class="memory-difficulty-btn[^"]*"[^>]*data-difficulty="{diff_value}"[^>]*?)(?!.*aria-label)(>)'
    label = f'Selecionar dificuldade {diff_name.lower()}'
    
    def replacement(match):
        before = match.group(1)
        after = match.group(2)
        changes.append(f'  ✓ memory-difficulty-btn[{diff_name}]: "{label}"')
        return f'{before} aria-label="{label}"{after}'
    
    content = re.sub(pattern, replacement, content, flags=re.DOTALL)

# Salvar se houver mudanças
if content != original_content:
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print('✅ ARIA labels adicionados com sucesso!\n')
    print('📝 Mudanças realizadas:')
    for change in changes:
        print(change)
    print(f'\n📊 Total: {len(changes)} ARIA labels adicionados')
else:
    print('ℹ️ Nenhuma mudança necessária - todos os botões já têm ARIA labels')
