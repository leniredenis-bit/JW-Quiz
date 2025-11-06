import json

try:
    with open('DATA/perguntas.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f"Total de perguntas: {len(data)}")
    if data:
        print(f"Primeira pergunta: {data[0]['pergunta'][:50]}...")
        print(f"Último ID: {data[-1]['id']}")
        print(f"Propriedades: {list(data[0].keys())}")
        print(f"Tem 'pergunta': {'pergunta' in data[0]}")
        print(f"Tem 'opcoes': {'opcoes' in data[0]}")
        print(f"Tem 'resposta_correta': {'resposta_correta' in data[0]}")
except Exception as e:
    print(f"Erro: {e}")