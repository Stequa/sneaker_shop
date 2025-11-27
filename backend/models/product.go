package models

type Category struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description,omitempty"`
}

type Product struct {
	ID          int     `json:"id"`
	Name        string  `json:"name"`
	Description string  `json:"description,omitempty"`
	Brand       string  `json:"brand,omitempty"`
	Price       float64 `json:"price"`
	ImageURL    string  `json:"image_url"`
	CategoryID  int     `json:"category_id"`
	CreatedAt   string  `json:"created_at"`
}
