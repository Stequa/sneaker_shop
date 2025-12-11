package models

type Category struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description,omitempty"`
}

type Product struct {
	ID          int     `json:"id"`
	Name        string  `json:"name"`
	Description string  `json:"description,omitempty"` //Пропускается если пустое
	Brand       string  `json:"brand,omitempty"`
	Price       float64 `json:"price"`
	ImageURL    string  `json:"image_url"`
	CategoryID  int     `json:"category_id"`
	CreatedAt   string  `json:"created_at"`
}
type Order struct {
	ID              int    `json:"id"`
	UserID          int    `json:"user_id"`
	TotalAmount     int    `json:"total_amount"`
	Status          string `json:"status"`
	ShippingAddress string `json:"shipping_address"`
	Phone           string `json:"phone"`
	CreatedAt       string `json:"created_at"`
}
type OrderItem struct {
	ID           int     `json:"id"`
	OrderId      int     `json:"order_id"`
	ProductID    int     `json:"product_id"`
	SizeId       int     `json:"size_id"`
	Quantity     int     `json:"quantity"`
	PricePerUnit float64 `json:"price_per_unit"`
}
type Size struct {
	ID    int    `json:"id"`
	Sizes string `json:"sizes"`
}
type ProductSize struct {
	ProductID int `json:"product_id"`
	SizeID    int `json:"size_id"`
	Stock     int `json:"stock"`
}
type Cart struct {
	CartID    int    `json:"cart_id"`
	UserID    int    `json:"user_id"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
}
