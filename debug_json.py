import json

try:
    with open('DATA/perguntas.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f"Total de perguntas: {len(data)}")
    if data:
        pergunta = data[0].get('pergunta', 'NÃO ENCONTRADA')
        opcoes = data[0].get('opcoes', 'NÃO ENCONTRADAS')
        resposta = data[0].get('resposta_correta', 'NÃO ENCONTRADA')

        print(f"Pergunta: {pergunta}")
        print(f"Opções: {opcoes}")
        print(f"Resposta correta: {resposta}")
        print(f"Tem todas as propriedades necessárias: {'pergunta' in data[0] and 'opcoes' in data[0] and 'resposta_correta' in data[0]}")
except Exception as e:
    print(f"Erro: {e}")