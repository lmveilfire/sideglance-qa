# sideglance-qa
> E2E и API-тесты для галереи [sideglance.ru](https://sideglance.ru)  
> TypeScript/Playwright + Python/Selenium/Pythest | CI/CD в GitHub Actions | Allure отчёты

[![CI Tests](https://github.com/lmveilfire/sideglance-qa/actions/workflows/playwright.yml/badge.svg)](https://github.com/lmveilfire/sideglance-qa/actions)
[![Playwright](https://img.shields.io/badge/Playwright-TypeScript-blue)](https://playwright.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

### 1. Архитектура

## Typescript-playwright
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

## Typescript/Playwright

```mermaid
flowchart TD
    A["Test Layer
    test TC-CAT-01"] -->|использует| B["Client Layer
    CategoryClient.create
    Promise<CategoryDto>"]
    B -->|делегирует| C["API Layer
    CategoryApi.create
    Promise<APIResponse>"]
    C -->|использует| D["Playwright
    APIRequestContext"]
    
    style A fill:#e1f5fe,stroke:#01579b
    style B fill:#e8f5e9,stroke:#2e7d32
    style C fill:#fff3e0,stroke:#ef6c00
    style D fill:#f3e5f5,stroke:#7b1fa2
```

### CI/CD

## Playwright.yml
1. Чекаутит приватный репо с кодом приложения
2. Создаёт .env из GitHub Secrets
3. Восстанавливает кэш node_modules из предыдущих запусков (по хэшу package-lock.json)
4. Устанавливает Node.js 24 и зависимости через npm ci
5. Устанавливает браузер Chromium и системные зависимости
6. Собирает фронтенд (React) с увеличенным лимитом памяти
7. Собирает бэкенд (Spring) и фронтенд в Docker
8. Поднимает окружение (PostgreSQL, backend, frontend) с healthcheck-ами
9. Ожидает готовности backend и frontend через curl в цикле
10. Запускает Playwright-тесты с изоляцией
11. Архивирует Playwright и Allure отчёты как артефакты
12. Очищает окружение: останавливает контейнеры и удаляет volumes

### Безопасность
* Все секреты — в GitHub Secrets
* Токены не коммитятся, не логируются
* Тестовые данные изолированы от продакшена

### Результаты прогона
1. Перейти по вкладке Actions
2. Кликнуть на workflow CI Tests Typescript Playwright или CI Tests Python
3. Открыть результаты тестов