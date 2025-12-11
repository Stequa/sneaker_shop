package main

import (
	"fmt"
	"sneaker-shop/backend/db"
	"sneaker-shop/backend/handlers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	db.InitDB()
	defer db.DB.Close()

	r := gin.Default()

	// Разрешаем CORS (иначе React не сможет делать запросы)
	r.Use(cors.Default())

	// Регистрируем маршруты
	r.GET("/api/products", handlers.GetProducts)
	r.POST("/api/orders", handlers.CreateOrder)
	r.Get("api/cart", handlers.GetCart)
	r.Post("api/cart/add", handlers.AddToCart)
	r.Delete("api/cart/remove", handlers.RemoveFromCart)
	fmt.Println("Сервер запущен на http://localhost:8080")
	r.Run(":8080")
}
