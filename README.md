[README.md](https://github.com/user-attachments/files/23267193/README.md)
# JW Quiz 

Um quiz interativo sobre conhecimentos bíblicos com sistema de pontuação avançado, modo multiplayer e PWA.

## 🎯 Funcionalidades

- **Quiz Temático**: Mais de 200 perguntas organizadas por temas bíblicos
- **Sistema de Pontuação Avançado**: Bônus por velocidade, streak e dificuldade
- **Modo Multiplayer**: Crie salas e jogue com amigos (em desenvolvimento)
- **PWA**: Funciona offline e pode ser instalado como app
- **Responsivo**: Otimizado para desktop e mobile
- **Analytics**: Rastreamento de uso e performance

## 🚀 Como Jogar

1. Clique em "Iniciar Quiz Rápido" para perguntas aleatórias
2. Ou escolha um tema específico nos filtros
3. Responda as perguntas dentro do tempo limite
4. Ganhe pontos extras por velocidade e acertos consecutivos
5. Veja seu resultado final e desafie seus amigos!

## 🛠️ Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **PWA**: Service Worker para funcionamento offline
- **Armazenamento**: LocalStorage para progresso e analytics
- **Audio**: Web Audio API para efeitos sonoros

## 📁 Estrutura do Projeto

```
quiz-biblico/
├── index.html          # Página principal
├── CSS/
│   └── style.css       # Estilos responsivos
├── JS/
│   ├── main.js         # Lógica principal e UI
│   └── quiz.js         # Lógica do quiz
├── DATA/
│   └── perguntas.json  # Banco de perguntas
├── manifest.json       # Configuração PWA
└── sw.js              # Service Worker
```

## 🎮 Sistema de Pontuação

- **Base**: 1 ponto por acerto
- **Velocidade**: Até 0.1 pontos extras (máx. 10s restantes)
- **Streak**: 0.01 pontos por acerto consecutivo
- **Dificuldade**: Bônus baseado no nível (fácil/médio/difícil)
- **Penalidade**: -0.1 por erro

## 📱 Instalação como App

O quiz pode ser instalado como um aplicativo nativo:
1. Abra no navegador Chrome/Edge
2. Clique no botão "Instalar" na barra de endereço
3. Ou vá em Menu → "Instalar JW Quiz"

## 🔧 Desenvolvimento Local

```bash
# Clone o repositório
git clone [URL_DO_REPOSITORIO]

# Entre na pasta
cd quiz-biblico

# Inicie um servidor local
python -m http.server 8000

# Abra http://localhost:8000 no navegador
```

## 📊 Analytics

O app inclui analytics básico para:
- Número de sessões
- Quizzes iniciados
- Temas mais populares
- Estatísticas de uso

## 🤝 Contribuição

Sinta-se à vontade para contribuir:
1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto é open source e está disponível sob a [Licença MIT](LICENSE).

---

**Desenvolvido com ❤️ para compartilhar conhecimentos bíblicos**
