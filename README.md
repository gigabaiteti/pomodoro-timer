# Pomodoro Timer by Gigabaite Tecnologia

Pomodoro Timer para implementação do Método Pomodoro baseado em HTML, CSS e JavaScript, com interface moderna, responsiva e multilíngue.

## Funcionalidades

- Timer configurável para Foco e Pausa (padrões: 25 e 5 min)
- Controles de Iniciar, Pausar e Resetar
- Contador de ciclos concluídos
- Indicador de modo com mudança de cores e transições suaves
- Histórico de sessões com horário e exclusão individual
- Persistência de dados (histórico e configurações) via LocalStorage
- Alerta sonoro ao fim de cada ciclo (Web Audio API)
- Configurações em modal Bootstrap
- Alertas e confirmações em modal Bootstrap
- Ícones FontAwesome v7.0.1 (Free)
- Responsivo: em dispositivos móveis o texto dos botões é oculto, exibindo apenas ícones
- Internacionalização (i18n): Português, Inglês e Espanhol
  - Detecção automática do idioma preferido do navegador
  - Seletor de idioma pelas opções: Português, Inglês e Espanhol
  - Preferência salva no LocalStorage

## Como Executar

- Não há dependências locais; bibliotecas via CDN.
- Abra o arquivo [index.html](index.html) em um navegador moderno.

## Tecnologias

- HTML5, CSS3, JavaScript (ES6+)
- Bootstrap 5.3.2 (layout e modais)
- FontAwesome v7.0.1 Free (ícones)
- Web Audio API (alarme)
- LocalStorage (persistência)
- Pronto para uso como Progressive Web Application (PWA)

## Estrutura de Arquivos

- [index.html](index.html): Estrutura e componentes da interface
- [style.css](style.css): Estilos e ajustes visuais
- [script.js](script.js): Lógica do timer, estado, i18n e modais
- README.md: Esta documentação

## Personalização

- Cores e tema utilizam variáveis do Bootstrap em [style.css](style.css).
- O modo Pausa alterna o esquema de cores aplicando a classe `break-mode` no `body`.
- Ajuste as durações de foco/pausa no modal de Configurações.

## Idiomas

- Idioma inicial baseado no navegador (detecção automática).
- Troca manual pelo menu de idioma (ícone globo).
- Preferência armazenada em `localStorage` (`pomodoroLang`).

## Licença

Criado por [Gigabaite Tecnologia](https://www.gigabaite.com.br) e distribuído sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
