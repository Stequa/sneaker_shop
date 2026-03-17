package handlers_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"sneaker-shop/backend/db"
	"sneaker-shop/backend/handlers"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestGetProductPoId(t *testing.T) {
	// Настройка Gin в тестовом режиме
	gin.SetMode(gin.TestMode) //отключает логи и ошибки в выводе (чистый тест)
	router := gin.New()
	router.GET("/api/products/:id", handlers.GetProductPoId)
	// Создаём мок БД
	mockDB, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer mockDB.Close()
	// Сохраняем оригинальное подключение и заменяем на мок
	oldDB := db.DB
	db.DB = mockDB
	defer func() {
		db.DB = oldDB // Восстанавливаем после теста
	}()

	// Мокаем первый запрос (получение информации о продукте)
	mock.ExpectQuery(`SELECT p\.name, p\.description, p\.brand, p\.price, COALESCE\(p\.image_url, ''\), c\.name`).
		WithArgs(1).
		WillReturnRows(sqlmock.NewRows([]string{"name", "description", "brand", "price", "image_url", "category"}).
			AddRow("Nike Air Force 1", "Классические кроссовки", "Nike", 99.99, "http://example.com/image.jpg", "Мужские"))

	// Мокаем второй запрос (получение размеров)
	mock.ExpectQuery(`SELECT s\.id, s\.size_label`).
		WithArgs(1).
		WillReturnRows(sqlmock.NewRows([]string{"id", "size_label"}).
			AddRow(1, "40").
			AddRow(2, "41").
			AddRow(3, "42"))

	// Создаём HTTP запрос
	req := httptest.NewRequest("GET", "/api/products/1", nil) //создаёт виртуальный HTTP-запрос
	w := httptest.NewRecorder()                               //Записывает ответ сервера
	// Выполняем запрос
	router.ServeHTTP(w, req)
	// Проверяем статус ответа
	assert.Equal(t, http.StatusOK, w.Code)
	// Проверяем тело ответа
	// Используем структуру из handlers
	type productResponse struct {
		Sizes []struct {
			ID    int    `json:"id"`
			Sizes string `json:"sizes"`
		} `json:"sizes"`
		Name        string  `json:"name"`
		Description string  `json:"description"`
		Brand       string  `json:"brand"`
		Price       float64 `json:"price"`
		ImageUrl    string  `json:"image_url"`
		Category    string  `json:"category"`
	}
	var resp productResponse
	err = json.Unmarshal(w.Body.Bytes(), &resp)
	assert.NoError(t, err)
	// Проверяем данные продукта
	assert.Equal(t, "Nike Air Force 1", resp.Name)
	assert.Equal(t, "Nike", resp.Brand)
	assert.Equal(t, 99.99, resp.Price)
	assert.Equal(t, "Мужские", resp.Category)
	assert.Equal(t, "http://example.com/image.jpg", resp.ImageUrl)
	// Проверяем размеры
	assert.Len(t, resp.Sizes, 3)
	assert.Equal(t, "40", resp.Sizes[0].Sizes)
	assert.Equal(t, "41", resp.Sizes[1].Sizes)
	assert.Equal(t, "42", resp.Sizes[2].Sizes)

	// Проверяем, что все ожидания мока выполнены
	assert.NoError(t, mock.ExpectationsWereMet())
}

// Успешный запрос 200
func TestPostContact_Success(t *testing.T) {
	//начало теста такое же
	gin.SetMode(gin.TestMode)
	router := gin.New()
	router.POST("/api/contact", handlers.PostContact)

	// Создаём мок подключения
	mockDB, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer mockDB.Close()

	// Сохраняем оригинальное подключение и заменяем на мок
	oldDB := db.DB
	db.DB = mockDB
	defer func() {
		db.DB = oldDB
	}()

	// Ожидаем INSERT
	mock.ExpectExec(`INSERT INTO contact \(name_contact, email, comment\)`).
		WithArgs("Иван", "ivan@example.com", "Привет!").
		WillReturnResult(sqlmock.NewResult(1, 1))

	// Тело запроса
	jsonBody := `{"name_contact": "Иван", "email": "ivan@example.com", "comment": "Все гвно"}`

	req := httptest.NewRequest("POST", "/api/contact", bytes.NewBufferString(jsonBody))
	req.Header.Set("Content-Type", "application/json") //Добавляет HTTP-заголовок Хэндлер c.ShouldBindJSON()
	// требует,
	// чтобы Content-Type был application/json. Без этого — ошибка 400
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req) //Запуск хэндлера

	assert.Equal(t, http.StatusOK, w.Code)
	var resp map[string]string //Парсинг тела ответа
	// Преобразует JSON-ответ ({"message": "Заявка отправлена"}) в Go-структуру (map[string]string)
	json.Unmarshal(w.Body.Bytes(), &resp)
	assert.Equal(t, "Заявка отправлена", resp["message"])

	assert.NoError(t, mock.ExpectationsWereMet())
}

// нет комментария, ожидаю ошибку 400
func TestPostContact_InvalidJSON(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := gin.New()
	router.POST("/api/contact", handlers.PostContact)

	// Невалидный JSON (нет обязательного поля)
	jsonBody := `{"name_contact": "Иван", "email": "ivan@example.com"}` // нет comment

	req := httptest.NewRequest("POST", "/api/contact", bytes.NewBufferString(jsonBody))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	var resp map[string]string
	json.Unmarshal(w.Body.Bytes(), &resp)
	assert.Equal(t, "Неверный формат данных", resp["error"])
}

// ошибка 500
func TestPostContact_DBError(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := gin.New()
	router.POST("/api/contact", handlers.PostContact)

	mockDB, mock, err := sqlmock.New()
	assert.NoError(t, err)
	defer mockDB.Close()

	oldDB := db.DB
	db.DB = mockDB
	defer func() {
		db.DB = oldDB
	}()

	// Ожидаем INSERT, но возвращаем ошибку
	mock.ExpectExec(`INSERT INTO contact \(name_contact, email, comment\)`).
		WithArgs("Иван", "ivan@example.com", "Привет!").
		WillReturnError(assert.AnError)

	jsonBody := `{"name_contact": "Иван", "email": "ivan@example.com", "comment": "Привет!"}`

	req := httptest.NewRequest("POST", "/api/contact", bytes.NewBufferString(jsonBody))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusInternalServerError, w.Code)
	var resp map[string]string
	json.Unmarshal(w.Body.Bytes(), &resp)
	assert.Equal(t, "Ошибка добавления", resp["message"])

	assert.NoError(t, mock.ExpectationsWereMet())
}
