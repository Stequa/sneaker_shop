package handlers

import (
	"log"
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
