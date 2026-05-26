# sideglance-qa
E2E и API тесты на TypeScript/Playwright и Python/Selenium/Pytest. Использует Page Object Model, изолированный API-слой и data-driven подход. Allure отчёты, GitHub Actions CI, запуск в headless-режиме.

> E2E и API-тесты для галереи [sideglance.ru](https://sideglance.ru)  
> TypeScript/Playwright + Python/Selenium | CI/CD в GitHub Actions | Allure отчёты

[![CI Tests](https://github.com/lmveilfire/sideglance-qa/actions/workflows/run.yml/badge.svg)](https://github.com/lmveilfire/sideglance-qa/actions)
[![Playwright](https://img.shields.io/badge/Playwright-TypeScript-blue)](https://playwright.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 1. Архитектура

```
typescript-playwright/           
├── src
│   ├── api                     # Слой транспорта: чистые HTTP-обёртки
│   ├── clients                 # Слой клиентов: бизнес-методы поверх Api
│   ├── fixtures                # Изолированные фикстуры: auth, cleanup
│   ├── helpers                 # Хелперы: генераторы данных, декораторы @step, statusIn
│   ├── pages                   # Page Objects для UI-тестов
│   └── utils                   # Утилиты
├── tests                       # Тесты
│   ├── api                     # API-тесты: контракты, негативные сценарии, rate-limit
│   └── ui                      # UI-тесты
├── package.json                # Скрипты, зависимости, typescript
├── playwright.config.ts        # Конфиг: окружения, ретраи, отчёты
└── tsconfig.json
 
```

### Ключевые принципы
### Typescript/Playwright

```mermaid
flowchart TD
    A[Test Layer\ntest('TC-CAT-01', async ({ categoryClient }) => {})] -->|использует| B[Client Layer\nCategoryClient.create(name)\n→ Promise<CategoryDto>\nбросает исключение при !ok()]
    B -->|делегирует| C[API Layer\nCategoryApi.create(name)\n→ Promise<APIResponse>\nчистый HTTP, без assert]
    C -->|использует| D[Playwright\nAPIRequestContext]
    
    style A fill:#e1f5fe,stroke:#01579b
    style B fill:#e8f5e9,stroke:#2e7d32
    style C fill:#fff3e0,stroke:#ef6c00
    style D fill:#f3e5f5,stroke:#7b1fa2
```

### CI/CD
1. Чекаутит приватный репо с кодом приложения
2. Собирает бэкенд (Spring) и фронтенд (React) в Docker
3. Поднимает окружение с healthcheck-ами
4. Запускает Playwright-тесты с изоляцией
5. Архивирует playwright и Allure отчёты

### Безопасность
* Все секреты — в GitHub Secrets
* Токены не коммитятся, не логируются
* Тестовые данные изолированы от продакшена