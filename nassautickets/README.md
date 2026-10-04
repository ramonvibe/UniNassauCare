# 🎫 nassauTickets

Sistema Web para **controle de atendimento de um Laboratório de Análises Clínicas**, desenvolvido como atividade acadêmica para aplicar conceitos de React, desenvolvimento Web, APIs REST, Git/GitHub e organização de projetos.

## 📌 Funcionalidades

O sistema permite:

- Emissão de senhas;
- Gerenciamento da fila de atendimento;
- Chamada e rechamada de senhas;
- Início e finalização de atendimentos;
- Painel com as últimas senhas chamadas;
- Autenticação de atendentes;
- Geração de relatórios e auditoria.

### Tipos de senha

| Código | Descrição |
|---|---|
| `SP` | Senha Prioritária |
| `SG` | Senha Geral |
| `SE` | Retirada de Exames |

A prioridade de atendimento segue:

```text
[SP] → [SE|SG] → [SP] → [SE|SG]
```

As senhas seguem o padrão:

```text
YYMMDD-PPSQ
```

Exemplo: `261001-SP001`.

## 🛠️ Tecnologias

**Frontend**
- React
- JavaScript
- HTML/CSS
- API REST / JSON

**Backend**
- `[Tecnologia escolhida pelo grupo]`

**Banco de dados**
- MySQL 8.0

**Versionamento**
- Git e GitHub

> A escolha da tecnologia do backend deverá ser justificada pelo grupo.

## 📁 Estrutura

```text
nassautickets/
├── backend/
├── docs/
│   ├── branding/
│   ├── mer/
│   ├── mockups/
│   ├── models/
│   │   └── uml/
│   └── requirements/
├── frontend/
├── .gitignore
├── LICENSE
└── README.md
```

## 🚀 Instalação e execução

Clone o projeto:

```bash
git clone https://github.com/SEU-USUARIO/nassauTickets.git
cd nassautickets
```

Instale e execute o frontend:

```bash
cd frontend
npm install
npm run dev
```

Para o backend, consulte as instruções correspondentes à tecnologia escolhida pelo grupo.

## 🌿 Branches

O projeto utiliza:

- `main` — versão integrada do projeto;
- `dev` — desenvolvimento.

O código deverá ser desenvolvido inicialmente na `dev` e posteriormente integrado à `main` por meio de merge.

Exemplos de commits:

```text
feat: implementa emissão de senha
feat: implementa fila de atendimento
fix: corrige regra de prioridade
docs: atualiza documentação
```

## 📄 Licença

Este projeto utiliza a licença **MIT**.

## 🎓 Sobre

Projeto acadêmico desenvolvido com o objetivo de aplicar práticas de **desenvolvimento Web, React, documentação, trabalho em equipe e versionamento com Git/GitHub**.

## Membros

| Nome | Matrícula | Papel |
|---|---|---|
| Ramon Monteiro Neto Filho | 01908981 | Scrum Master |
| Edson Rafael da Silva Filho | 01180144 | Testador |
| Cauã Moura Costa | 01888216 | Desenvolvedor |
| Pedro Henrique Barbosa Cabral | 01885327 | Documentador |
| Daniel Tavares de Oliveira Souza | 01889356 | Desenvolvedor |
| Filipe Augusto Galdino dos Santos | 01909125 | Testador |
