"""
Script para remover tags com menos de 10 ocorrências do perguntas.json
Cria uma cópia de backup antes de fazer as alterações
"""
import json
from collections import Counter
from datetime import datetime

# Caminhos dos arquivos
INPUT_FILE = r'c:\Users\NOTEBOOK 63\Desktop\Bot Benefícios\quiz-biblico\DATA\perguntas_novo.json'
OUTPUT_FILE = r'c:\Users\NOTEBOOK 63\Desktop\Bot Benefícios\quiz-biblico\DATA\perguntas_cleaned.json'
BACKUP_FILE = r'c:\Users\NOTEBOOK 63\Desktop\Bot Benefícios\quiz-biblico\DATA\perguntas_novo.json.backup.' + datetime.now().strftime('%Y%m%d_%H%M%S')

print("=" * 60)
print("LIMPEZA DE TAGS COM MENOS DE 10 OCORRÊNCIAS")
print("=" * 60)

# Ler o arquivo JSON
print(f"\n📖 Lendo arquivo: {INPUT_FILE}")
with open(INPUT_FILE, 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"✅ Total de questões: {len(data)}")

# Contar ocorrências de cada tag
print("\n🔍 Contando tags...")
tag_counter = Counter()

for question in data:
    if 'tags' in question and question['tags']:
        # Verifica se tags é uma lista
        tags_list = question['tags'] if isinstance(question['tags'], list) else []
        for tag in tags_list:
            # Tags são strings diretas no JSON
            if isinstance(tag, str) and tag.strip():
                tag_counter[tag.strip()] += 1

print(f"✅ Total de tags únicas encontradas: {len(tag_counter)}")

# Separar tags por frequência
tags_to_keep = {tag: count for tag, count in tag_counter.items() if count >= 10}
tags_to_remove = {tag: count for tag, count in tag_counter.items() if count < 10}

print(f"\n📊 Estatísticas:")
print(f"   Tags com >= 10 usos: {len(tags_to_keep)}")
print(f"   Tags com < 10 usos: {len(tags_to_remove)}")

if tags_to_remove:
    print(f"\n🗑️ Tags que serão REMOVIDAS ({len(tags_to_remove)}):")
    for tag, count in sorted(tags_to_remove.items(), key=lambda x: x[1], reverse=True):
        print(f"   - {tag}: {count} uso{'s' if count > 1 else ''}")
else:
    print("\n✅ Nenhuma tag com menos de 10 ocorrências encontrada!")
    exit(0)

# Criar backup
print(f"\n💾 Criando backup: {BACKUP_FILE}")
with open(BACKUP_FILE, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
print("✅ Backup criado com sucesso!")

# Limpar tags das questões
print(f"\n🧹 Removendo tags de {len(data)} questões...")
questions_modified = 0
tags_removed_count = 0

for question in data:
    if 'tags' in question and question['tags'] and isinstance(question['tags'], list):
        original_tags = question['tags'].copy()
        
        # Filtrar tags mantendo apenas as com 10+ ocorrências
        cleaned_tags = [tag for tag in question['tags'] if isinstance(tag, str) and tag.strip() in tags_to_keep]
        
        # Contar quantas foram removidas
        tags_removed_count += len(original_tags) - len(cleaned_tags)
        
        # Atualizar apenas se houve mudança
        if len(cleaned_tags) != len(original_tags):
            question['tags'] = cleaned_tags
            questions_modified += 1

print(f"✅ {questions_modified} questões foram modificadas")
print(f"✅ {tags_removed_count} tags foram removidas no total")

# Salvar arquivo limpo
print(f"\n💾 Salvando arquivo limpo: {OUTPUT_FILE}")
with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("\n" + "=" * 60)
print("✅ LIMPEZA CONCLUÍDA COM SUCESSO!")
print("=" * 60)
print(f"\n📁 Arquivos gerados:")
print(f"   Backup: {BACKUP_FILE}")
print(f"   Limpo: {OUTPUT_FILE}")
print(f"\n⚠️ PRÓXIMO PASSO:")
print(f"   Revise o arquivo '{OUTPUT_FILE}'")
print(f"   Se estiver OK, substitua o perguntas.json original")
print("=" * 60)
