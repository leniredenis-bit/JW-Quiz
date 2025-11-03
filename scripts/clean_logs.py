"""
Script para limpar console.logs desnecessários do código
Mantém apenas logs de erro e informações críticas
"""

import re

# Logs a serem removidos (debug/teste)
patterns_to_remove = [
    r"\s*console\.log\('populateFilters called'\);?\n",
    r"\s*console\.log\('tagsContainer:', tagsContainer\);?\n",
    r"\s*console\.log\('difficultyContainer:', difficultyContainer\);?\n",
    r"\s*console\.log\('Adding hardcoded test buttons\.\.\.'\);?\n",
    r"\s*console\.log\('Test tag clicked:', tag\);?\n",
    r"\s*console\.log\('Test difficulty clicked:', d\);?\n",
    r"\s*console\.log\('Test buttons added successfully'\);?\n",
    r"\s*console\.log\('Adding event listeners'\);?\n",
    r"\s*console\.log\('Quick quiz button clicked'\);?\n",
    r"\s*console\.log\('Study mode button clicked'\);?\n",
    r"\s*console\.log\('Multiplayer button clicked'\);?\n",
    r"\s*console\.log\('Stats button clicked'\);?\n",
    r"\s*console\.log\('Legal button clicked'\);?\n",
    r"\s*console\.log\('Wrapped startQuiz called with:', filter\);?\n",
    r"\s*console\.log\('window\.originalStartQuiz exists:', typeof window\.originalStartQuiz\);?\n",
    r"\s*console\.log\('window\.allQuestions length:', window\.allQuestions \? window\.allQuestions\.length : 'undefined'\);?\n",
    r"\s*console\.log\('Calling originalStartQuiz\.\.\.'\);?\n",
    r"\s*console\.log\('Retrying originalStartQuiz call\.\.\.'\);?\n",
    r"\s*console\.log\('showMemoryView called'\);?\n",
    r"\s*console\.log\('Calling showMemoryConfig from main\.js'\);?\n",
    r"\s*console\.log\('window\.showMemoryConfig exists, calling it'\);?\n",
    r"\s*console\.log\('window\.showMemoryConfig does not exist'\);?\n",
    r"\s*console\.log\('Adding event listener to start-memory-game-btn'\);?\n",
    r"\s*console\.log\('start-memory-game-btn clicked'\);?\n",
    r"\s*console\.log\('start-memory-game-btn not found'\);?\n",
    r"\s*console\.log\('Adding event listener to back-from-memory'\);?\n",
    r"\s*console\.log\('back-from-memory clicked - going back to welcome'\);?\n",
    r"\s*console\.log\('back-from-memory not found'\);?\n",
    r"\s*console\.log\('Tentando carregar perguntas do JSON\.\.\.'\);?\n",
    r"\s*console\.log\('Resposta do fetch:', res\.status, res\.statusText\);?\n",
    r"\s*console\.log\('Perguntas carregadas com sucesso:', data\.length\);?\n",
    r"\s*console\.log\('Chamando populateFilters\.\.\.'\);?\n",
    r"\s*console\.log\('Filtros populados, botões devem funcionar agora'\);?\n",
]

# Ler arquivo
file_path = r"c:\Users\NOTEBOOK 63\Desktop\Bot Benefícios\quiz-biblico\JS\main.js"
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Aplicar remoções
original_length = len(content)
for pattern in patterns_to_remove:
    content = re.sub(pattern, '', content)

# Salvar arquivo limpo
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

removed = original_length - len(content)
print(f"✅ Limpeza concluída!")
print(f"📊 Removidos {removed} caracteres de logs de debug")
print(f"📁 Arquivo: {file_path}")
