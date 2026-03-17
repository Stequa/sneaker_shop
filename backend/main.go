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
	// Важно: специфичные маршруты с параметрами должны быть ПЕРЕД общими
	r.GET("/api/products/:id", handlers.GetProductPoId)
	r.GET("/api/products", handlers.GetProducts)
	r.POST("/api/orders", handlers.CreateOrder)
	r.GET("api/cart", handlers.GetCart)
	r.POST("api/cart/add", handlers.AddToCart)
	r.DELETE("api/cart/remove", handlers.RemoveFromCart)
	r.POST("api/contact", handlers.PostContact)
	fmt.Println("Сервер запущен на http://localhost:8080")
	r.Run(":8080")
}
