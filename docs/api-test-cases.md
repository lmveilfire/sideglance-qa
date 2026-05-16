# API Test Coverage

## Аутентификация

- POST /auth/login (admin, pass)
  - Тело ответа (200): accessToken, refreshToken, username
  - Блокировка (429): error, retryAfter

- POST /auth/login (неверный пароль)
  - Ошибка (401): error

- POST /auth/refresh (валидный refreshToken)
  - Тело ответа (200): accessToken, refreshToken, username

- POST /auth/refresh (невалидный refreshToken)
  - Ошибка (401): error

## Фотографии

- GET /photos
  - Тело ответа (200): массив объектов

- GET /photos/{id} (существующий)
  - Тело ответа (200): id, title, author, url, fullUrl, likes, views

- GET /photos/{id} (несуществующий)
  - Ошибка (404): не найдено

- PUT /photos/{id}/like
  - Тело ответа (200): totalLikes, newlyLiked

- POST /photos (без токена)
  - Ошибка (401): не авторизован

- POST /photos (загрузка + удаление, полный цикл)
  - Успех (200): id, url, fullUrl
  - Проверка: фото доступно по id
  - Успех (204): удаление фото
  - Проверка: фото недоступно (404)

## Категории

- GET /categories
  - Тело ответа (200): массив объектов

- POST /categories (с токеном, name)
  - Тело ответа (200): id, name
  - Полный цикл: создание + удаление

- DELETE /categories/{id} (без токена)
  - Ошибка (401): не авторизован

- DELETE /categories/{id} (несуществующая)
  - Ошибка (404) или (204): зависит от реализации

- Создание + удаление категории (полный цикл)
  - Успех (200): создание
  - Успех (204): удаление

  ## Подкатегории
- GET /subcategories?categoryId={id}
  - Тело ответа (200): массив объектов

- POST /subcategories (с токеном, categoryId, name)
  - Тело ответа (200): id, name, categoryId
  - Полный цикл: создание + проверка в списке + удаление

- GET /subcategories (пустая категория)
  - Тело ответа (200): пустой массив

## Комментарии

- GET /comments/captcha
  - Тело ответа (200): sessionId, question

- GET /comments?photoId={id}&page=0&size=5
  - Тело ответа (200): comments (массив), hasMore, totalCount, page

- POST /comments (неверная капча)
  - Ошибка (400): error

- POST /comments (ответ быстрее 2 секунд)
  - Ошибка (400): error

- POST /comments (повторный sessionId)
  - Первый запрос: (201) создан
  - Второй запрос: ошибка (400)

- POST /comments (заполнен honeypot)
  - Тело ответа (200): тихое отклонение (комментарий не создан)

- POST /comments (успешное создание)
  - Успех (201): комментарий создан со статусом PENDING
  - Проверка: комментарий не виден публично (статус PENDING)
  - Полный цикл: создание + удаление через админку

## Админ: комментарии (все требуют токен)

- GET /admin/comments (без токена)
  - Ошибка (401): не авторизован

- GET /admin/comments/stats
  - Тело ответа (200): total, pending, approved, rejected
  - Проверка: total = pending + approved + rejected

- PUT /admin/comments/{id}/moderate (APPROVED)
  - Тело ответа (200): статус APPROVED
  - Проверка: комментарий становится виден публично
  - Полный цикл: создание → одобрение → проверка видимости → удаление

- PUT /admin/comments/{id}/moderate (REJECTED)
  - Тело ответа (200): статус REJECTED
  - Проверка: комментарий не виден публично
  - Полный цикл: создание → отклонение → проверка скрытости → удаление

## Безопасность

- Path traversal (/uploads/../etc/passwd)
  - Ошибка (400) или (404)

- Path traversal URL-encoded (..%2F..%2Fetc%2Fpasswd)
  - Ошибка (400) или (404)

- Security headers
  - Заголовки: x-content-type-options, x-frame-options, referrer-policy

- CORS: неразрешённый origin
  - Заголовок Access-Control-Allow-Origin не содержит запрещённый origin

- Captcha: повторный sessionId
  - Второй запрос с тем же sessionId: ошибка (400)

## Служебные

- GET /api/health
  - Тело ответа (200): status, timestamp, service, version

- GET /api/ready
  - Тело ответа (200): status, timestamp  
