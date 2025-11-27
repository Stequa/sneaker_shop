package db

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

var DB *sql.DB

func InitDB() {
	connStr := "user=postgres password=20061972 dbname=Sneaker sslmode=disable"

	var err error
	DB, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Не удалось подключиться к БД:", err)
	}

	if err = DB.Ping(); err != nil {
		log.Fatal("Не удалось пингануть БД:", err)
	}

	fmt.Println("✅ Подключение к PostgreSQL установлено!")
}
