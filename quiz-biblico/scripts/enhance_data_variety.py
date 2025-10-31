import json
import os

# Load the JSON data
data_path = os.path.join(os.path.dirname(__file__), '..', 'DATA', 'perguntas.json')
with open(data_path, 'r', encoding='utf-8') as f:
    questions = json.load(f)

# Function to enhance variety
def enhance_question(q):
    # Set dificuldade based on id last digit
    last_digit = int(q['id'][-1])
    if last_digit in [1,2,3]:
        q['dificuldade'] = 1
        if 'básico' not in q['tags']:
            q['tags'].append('básico')
    elif last_digit in [4,5,6]:
        q['dificuldade'] = 2
        if 'intermediário' not in q['tags']:
            q['tags'].append('intermediário')
    else:
        q['dificuldade'] = 3
        if 'avançado' not in q['tags']:
            q['tags'].append('avançado')
    
    # Add tags based on content
    pergunta_lower = q['pergunta'].lower()
    if any(word in pergunta_lower for word in ['criança', 'filho', 'menino', 'menina']):
        if 'crianças' not in q['tags']:
            q['tags'].append('crianças')
    if any(word in pergunta_lower for word in ['rei', 'rainha', 'profeta', 'apóstolo']):
        if 'história' not in q['tags']:
            q['tags'].append('história')
    if any(word in pergunta_lower for word in ['amor', 'fé', 'esperança', 'caridade']):
        if 'valores' not in q['tags']:
            q['tags'].append('valores')
    if any(word in pergunta_lower for word in ['milagre', 'ressurreição', 'cura']):
        if 'milagres' not in q['tags']:
            q['tags'].append('milagres')

# Apply to all questions
for q in questions:
    enhance_question(q)

# Save back
with open(data_path, 'w', encoding='utf-8') as f:
    json.dump(questions, f, ensure_ascii=False, indent=2)

print("Data variety enhanced successfully!")