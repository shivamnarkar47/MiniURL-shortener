package main

import (
	"fmt"
  "os"
	"log"
	"miniurl/handlers"
	"miniurl/storage"
	"net/http"
)
// corsMiddleware adds CORS headers to each response
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Set CORS headers
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		// If it's a preflight OPTIONS request, return immediately
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Pass down the request to the next middleware (or final handler)
		next.ServeHTTP(w, r)
	})
}
func main() {
	storage := storage.NewMemoryStorage()

	urlHandler := &handlers.URLHandler{
		Storage: storage,
	}
  mux := http.NewServeMux()
	mux.HandleFunc("/shorten", func(w http.ResponseWriter, r *http.Request) {
		urlHandler.ShortenURL(w, r)
	})
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		urlHandler.Redirect(w, r)
	})
	mux.HandleFunc("/recent", func(w http.ResponseWriter, r *http.Request) {
		urlHandler.GetRecentURLs(w, r)
	})
	handler := corsMiddleware(mux)

	
port := os.Getenv("PORT")
if port == "" {
    port = "8080"
}

	fmt.Printf("Server is running on port %s \n", port)
  log.Fatal(http.ListenAndServe(("0.0.0.0:"+port), handler))

}
