# UniNassauCare

MVP acadêmico para organização de filas e atendimentos em ambiente hospitalar. A proposta é oferecer uma experiência clara para pacientes e uma visão operacional para colaboradores da unidade.

## Estado atual

O frontend contém uma landing page e fluxos demonstrativos executados apenas no navegador. Os dados são mocks e voltam ao estado inicial ao recarregar a página.

### Portal do paciente

- Login demonstrativo;
- visualização da senha de atendimento;
- posição e previsão da fila;
- identificação de prioridade;
- sala, serviço e profissional responsável.

### Área do colaborador

- Resumo das filas normal e prioritária;
- lista de pacientes aguardando;
- painel do próximo paciente;
- painel de televisão com relógio em tempo real e próximas senhas;
- chamada simulada de uma senha;
- cadastro simulado de novo atendimento;
- dados administrativos de paciente, serviço, profissional e destino.

### Aparência e acessibilidade

- Alternância entre temas claro e escuro em toda a aplicação;
- preferência de tema mantida no navegador;
- animações reduzidas automaticamente quando o sistema solicita menos movimento;
- painel de televisão sem exposição do nome do paciente.

## Acessos de demonstração

| Perfil | Usuário | Senha |
|---|---|---|
| Paciente | `paciente` | `paciente` |
| Colaborador | `colaborador` | `colaborador` |

> Este MVP não possui autenticação real e não deve receber dados pessoais ou clínicos verdadeiros.

## Tecnologias

- React 19;
- Vite;
- Tailwind CSS;
- Java 21 e Spring Boot no backend inicial;
- Maven Wrapper.

## Estrutura

```text
UniNassauCare/
├── backend/   # Estrutura inicial da API Spring Boot
├── docs/      # Documentação do projeto
├── frontend/  # Landing page e portais demonstrativos
├── LICENSE
└── README.md
```

## Executar o frontend

Depois de baixar ou clonar o projeto, entre na pasta do repositório e execute o frontend:

```bash
cd UniNassauTickets
cd frontend
npm install
npm run dev
```

O Vite exibirá o endereço local no terminal, normalmente `http://localhost:5173`.

Para validar a versão de produção:

```bash
npm run build
npm run lint
```

## Executar o backend

O backend ainda não está integrado aos mocks do frontend. Com o JDK 21 instalado:

```bash
cd backend
./mvnw spring-boot:run
```

## Regras de fila representadas no mock

- `UNI-P###`: atendimento prioritário;
- `UNI-N###`: atendimento normal;
- a interface diferencia visualmente pacientes aguardando, próximos e chamados;
- a lógica exibida é demonstrativa e ainda não representa uma regra clínica definitiva.

## Segurança e privacidade

Este repositório é um protótipo educacional. Antes de uso real, será necessário implementar autenticação, autorização por perfil, persistência segura, auditoria, proteção de dados e adequação à LGPD.

## Equipe

| Nome | Matrícula | Papel |
|---|---|---|
| Ramon Monteiro Neto Filho | 01908981 | Scrum Master |
| Edson Rafael da Silva Filho | 01180144 | Testador |
| Cauã Moura Costa | 01888216 | Desenvolvedor |
| Pedro Henrique Barbosa Cabral | 01885327 | Documentador |
| Daniel Tavares de Oliveira Souza | 01889356 | Desenvolvedor |
| Filipe Augusto Galdino dos Santos | 01909125 | Testador |

## Licença

Distribuído sob a licença MIT.
