package handlers

import (
	"database/sql"
	"log"
	"net/http"
	"sneaker-shop/backend/db"
	"sneaker-shop/backend/models"

	"github.com/gin-gonic/gin"
)

// GetProducts возвращает список всех кроссовок (Gin-хэндлер)
func GetProducts(c *gin.Context) {
	rows, err := db.DB.Query(`
		SELECT id, name, description, brand, price, COALESCE(image_url, ''), category_id, created_at
		FROM products 
		ORDER BY created_at DESC
	`)
	if err != nil {
		log.Printf(" Ошибка SQL-запроса: %v", err)
		c.JSON(500, gin.H{"error": "Ошибка при запросе к БД"})
		return
	}
	defer rows.Close()

	var products []models.Product
	for rows.Next() {
		var p models.Product
		var createdAt string
		err := rows.Scan(&p.ID, &p.Name, &p.Description, &p.Brand, &p.Price, &p.ImageURL, &p.CategoryID, &createdAt)
		if err != nil {
			log.Printf(" Ошибка Scan(): %v", err)
			c.JSON(500, gin.H{"error": "Ошибка при чтении данных"})
			return
		}
		p.CreatedAt = createdAt
		products = append(products, p)
	}

	c.JSON(200, products)
}
func CreateOrder(c *gin.Context) {
	var req struct { //Эта структура для ввода данных из JSON
		UserId          int                `json:"user_id"`
		Status          string             `json:"status"`
		ShippingAddress string             `json:"shipping_address"`
		Phone           string             `json:"phone"`
		Items           []models.OrderItem `json:"items"`
	}
	if err := c.ShouldBindJSON(&req); err != nil { //Заполнение структуры из JSON, проверка на ошибки
		c.JSON(400, gin.H{"error": "Неверный формат данных"})
		return
	}
	if len(req.Items) == 0 { //Проверка на наличие товаров в заказе
		c.JSON(400, gin.H{"error": "Заказ должен содержать хотя бы один товар"})
		return
	}
	tx, err := db.DB.Begin() //Начало транзакции
	if err != nil {
		log.Printf(" Ошибка начала транзакции: %v", err)
		c.JSON(500, gin.H{"error": "Не удалось создать заказ"})
		return
	}
	defer tx.Rollback() //Откат транзакции в случае ошибки

	var total float64
	for i := range req.Items { //Цикл для получения цены товара
		var price float64
		err := tx.QueryRow(`SELECT price FROM products WHERE id = $1`, req.Items[i].ProductID).Scan(&price)
		if err != nil {
			log.Printf(" Ошибка получения цены товара %d: %v", req.Items[i].ProductID, err)
			c.JSON(400, gin.H{"error": "Товар не найден"})
			return
		}
		req.Items[i].PricePerUnit = price
		total += price * float64(req.Items[i].Quantity) //Сумма заказа
	}

	orderQuery := ` //Запрос на вставку заказа
		INSERT INTO orders (user_id, total_amount, status, shipping_address, phone)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, created_at
	`

	var createdAt string                                                                          //Время создания заказа
	err = tx.QueryRow(orderQuery, req.UserId, total, req.Status, req.ShippingAddress, req.Phone). //Запрос на вставку заказа
													Scan(&req.Items[0].OrderId, &createdAt)
	if err != nil { //Ошибка вставки заказа
		log.Printf(" Ошибка вставки заказа: %v", err)
		c.JSON(500, gin.H{"error": "Не удалось создать заказ"})
		return
	}
	orderID := req.Items[0].OrderId

	itemStmt, err := tx.Prepare(` //Prepare нужен чтобы скомпелировать запрос один раз и после использовать его с данными
		INSERT INTO order_items (order_id, product_id, size_id, quantity, price_per_unit)
		VALUES ($1, $2, $3, $4, $5)
	`)
	if err != nil { //Ошибка подготовки stmt
		log.Printf(" Ошибка подготовки stmt: %v", err)
		c.JSON(500, gin.H{"error": "Не удалось создать заказ"})
		return
	}
	defer itemStmt.Close() //Закрытие stmt

	for _, it := range req.Items {
		if _, err := itemStmt.Exec(orderID, it.ProductID, it.SizeId, it.Quantity, it.PricePerUnit); err != nil {
			log.Printf(" Ошибка вставки позиции: %v", err)
			c.JSON(500, gin.H{"error": "Не удалось создать заказ"})
			return
		}
	}
	if err := tx.Commit(); err != nil { //Коммит транзакции
		log.Printf(" Ошибка коммита: %v", err)
		c.JSON(500, gin.H{"error": "Не удалось создать заказ"})
		return
	}
	c.JSON(201, gin.H{ //Отправка ответа
		"id":          orderID,
		"totalAmount": total,
		"created_at":  createdAt,
	})
}

type CartItemResponse struct { //Элемент корзины
	ID          int     `json:"id"`
	ProductName string  `json:"product_name"`
	Brand       string  `json:"brand"`
	SizeLabel   string  `json:"size"`
	Quantity    int     `json:"quantity"`
	Price       float64 `json:"price"`
	Total       float64 `json:"total"`
}

// CartResponse — полный ответ корзины
type CartResponse struct {
	Items     []CartItemResponse `json:"items"`
	TotalSum  float64            `json:"total_sum"`
	ItemCount int                `json:"item_count"`
}

func GetCart(c *gin.Context) {
	userId := 1
	var cartId int
	err := db.DB.QueryRow(` 
	Select cart_id from user Where user_id=$1`, userId).Scan(&cartId) //Запрс для получения корзины по пользователю
	if err != nil {
		log.Printf(" Ошибка SQL-запроса: %v", err)
		c.JSON(500, gin.H{"error": "Ошибка при запросе к БД"})
		return
	}
	if err == sql.ErrNoRows {
		// Корзина не создана — возвращаем пустую
		c.JSON(http.StatusOK, CartResponse{
			Items:     []CartItemResponse{},
			TotalSum:  0,
			ItemCount: 0,
		})
		return
	}
	//Запрос на получение информации о продуктах в корзине юзера
	query := `SELECT ci.id, p.name, p.brand, s.size_label, ci.quantity, p.price 
		FROM cart_items ci
		JOIN products p ON ci.product_id = p.id
		JOIN sizes s ON ci.size_id = s.id
		WHERE ci.cart_id = $1`
	rows, err := db.DB.Query(query, cartId)
	if err != nil {
		log.Printf("Ошибка запроса товаров корзины: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка загрузки корзины"})
		return
	}
	defer rows.Close()
	var items []CartItemResponse
	var totalSum float64
	var itemCount int

	for rows.Next() {
		var item CartItemResponse
		var price float64
		err := rows.Scan(
			&item.ID,
			&item.ProductName,
			&item.Brand,
			&item.SizeLabel,
			&item.Quantity,
			&price,
		)
		if err != nil {
			log.Printf("Ошибка сканирования товара корзины: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка данных"})
			return
		}
		item.Price = price
		item.Total = price * float64(item.Quantity)
		totalSum += item.Total
		itemCount += item.Quantity
		items = append(items, item)
	}

	if err = rows.Err(); err != nil {
		log.Printf("Ошибка итерации по корзине: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка итерации"})
		return
	}

	c.JSON(http.StatusOK, CartResponse{
		Items:     items,
		TotalSum:  totalSum,
		ItemCount: itemCount,
	})
}

func AddToCart(c *gin.Context) {
	//продукт, его данные отправляем в запись для создания записи в корзине
	userID := 1
	var cartID int
	var input struct { //структура для вводa
		ProductID int `json:"product_id" binding:"required"`
		SizeID    int `json:"size_id" binding:"required"`
		Quantity  int `json:"quantity" binding:"required,min=1"`
	}
	if err := c.ShouldBindJSON(&input); err != nil { //Заполнение структуры из JSON, проверка на ошибки
		c.JSON(400, gin.H{"error": "Неверный формат данных"})
		return
	}
	err := db.DB.QueryRow(`SELECT id FROM carts WHERE user_id = $1`, userID).Scan(&cartID) //Получаю id корзины
	if err != nil {
		log.Printf(" Ошибка SQL-запроса: %v", err)
		c.JSON(500, gin.H{"error": "Ошибка при запросе к БД"})
		return
	}
	if err == sql.ErrNoRows {
		// Создаём корзину
		err = db.DB.QueryRow(`
		INSERT INTO carts (user_id) VALUES ($1) RETURNING id
	`, userID).Scan(&cartID)
		if err != nil {
			c.JSON(500, gin.H{"error": "Не удалось создать корзину"})
			return
		}
	} else if err != nil {
		c.JSON(500, gin.H{"error": "Ошибка корзины"})
		return
	}
	var stock int //Проверка на наличие
	err = db.DB.QueryRow(`
	SELECT stock FROM product_sizes WHERE product_id = $1 AND size_id = $2
`, input.ProductID, input.SizeID).Scan(&stock)
	if err != nil || stock < input.Quantity {
		c.JSON(400, gin.H{"error": "Товара нет в наличии"})
		return
	}
	var in_cart int //Если запись уже существует
	err = db.DB.QueryRow(`Select id from cart_items where cart_id=$1 and product_id=$2 and size_id=$3`,
		cartID, input.ProductID, input.SizeID).Scan(&in_cart)
	if err == nil {
		// Запись найдена — обновляем
		_, err = db.DB.Exec(`UPDATE cart_items set quantity=quantity + $1 where id=$2`, input.Quantity, in_cart)
	} else if err == sql.ErrNoRows {
		_, err = db.DB.Exec(`INSERT INTO cart_items (cart_id, product_id, size_id, quantity)
	VALUES ($1, $2, $3, $4)`, cartID, input.ProductID, input.SizeID, input.Quantity)
	} else {
		c.JSON(500, gin.H{"error": "Ошибка обновление корзины"})
		return
	}

	c.JSON(200, gin.H{"message": "Товар добавлен в корзину"})
}

func RemoveFromCart(c *gin.Context) {
}
