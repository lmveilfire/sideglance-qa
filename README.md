# Multi-Stack QA Automation Portfolio
Демонстрационный репозиторий с тестовыми фреймворками на разных стеках (TypeScript, Python; Java в разработке) для сквозного тестирования (API/E2E) изолированного full-stack приложения: веб-галерея авторских пейзажных фотографий с ролевой моделью пользователей и админкой модерации комментариев.

Безопасность и NDA: Исходный код самого тестируемого приложения и базы данных закрытый и в этом репозитории отсутствует. Здесь только код тестовых фреймворков и конфигурация CI/CD.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[![CI Tests Typescript](https://github.com/lmveilfire/sideglance-qa/actions/workflows/playwright.yml/badge.svg)](https://github.com/lmveilfire/sideglance-qa/actions/workflows/playwright.yml)
[![CI Tests Python](https://github.com/lmveilfire/sideglance-qa/actions/workflows/python-pytest.yml/badge.svg)](https://github.com/lmveilfire/sideglance-qa/actions/workflows/python-pytest.yml)

## Архитектура запуска и CI/CD
У каждого стека свой собственный workflow-файл в .github/workflows/, со своим набором инструментов сборки. Но общая канва одна и та же:
1. Чекаут тестов. Пайплайн забирает кодовую базу автотестов из этого репозитория.
2. Чекаут приватного приложения. По токену подтягивается закрытый репозиторий с исходным кодом SUT (frontend + backend). Образы собираются из исходников прямо на раннере (docker compose ... --build).
3. Конфигурация. Динамически собирает .env файлы для тестового контура из GitHub Secrets.
4. Зависимости стека. Устанавливает окружение конкретного языка (детали см. в README каждого фреймворка).
5. Оркестрация. Через Docker Compose поднимается изолированный тестовый контур: PostgreSQL + Backend + Frontend с настроенными healthcheck-ами.
6. Верификация готовности. В цикле опрашивает сервисы через curl, пока оба не станут доступны.
7. Прогон тестов. Запускает автотесты конкретного стека напрямую на раннере. 
8. Артефакты. Сохраняет отчёты Allure и (там, где применимо для конкретного стека) скриншоты/видео падений.
9. Очистка. Полностью останавливает контейнеры и удаляет Docker Volumes.

## Структура тестовых фреймворков
Тестирование одной и той же бизнес-логики приложения (авторизация, модерация, комментарии) реализовано независимо в изолированных папках с разным набором технических решений в каждой:

- /typescript-playwright — E2E и API-тесты на `TypeScript` + `Playwright`. Линтинг (`ESLint`), форматирование (`Prettier`), генерация данных (`@faker-js/faker`).
- /python-pytest — API-тесты на `Python` + `pytest` со строгой типизацией через `mypy --strict` (в `Python`, в отличие от `TypeScript`, это не встроенная возможность языка, а отдельно настроенный и поддерживаемый процесс).
- /java-automation API-тесты на Java 21 + RestAssured (в разработке, планируется интеграция Testcontainers и WireMock)

## Безопасность
* Все секреты хранятся в GitHub Secrets.
* Токены не коммитятся, не логируются.
* Тестовые данные изолированы от прода.
