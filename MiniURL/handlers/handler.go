package handlers

import (
	"encoding/json"
	"math/rand"
	"miniurl/models"
	"miniurl/storage"
	"net/http"
	"strings"
  "strconv"
)

type URLHandler struct {
	Storage *storage.MemoryStorage
}

func (h *URLHandler) ShortenURL(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method Not Allowed, Use POST Request", http.StatusMethodNotAllowed)
	}

	var req models.URL

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if req.OriginalURL == "" {
		http.Error(w, "Original URL is required", http.StatusBadRequest)
		return

	}

	if req.ShortCode == "" {
		req.ShortCode = generateShortCode()
	}

	if err := h.Storage.Save(req); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-type", "application/json")
	json.NewEncoder(w).Encode(req)

}

func (h *URLHandler) Redirect(w http.ResponseWriter, r *http.Request) {
	shortCode := strings.TrimSpace(r.URL.Path[1:]) // Remove leading slash and trim

	// Validate short code
	if shortCode == "" {
		h.respondWithError(w, "Short code is required", http.StatusBadRequest)
		return
	}

	if !isValidShortCode(shortCode) {
		h.respondWithError(w, "Invalid short code format", http.StatusBadRequest)
		return
	}

	url, err := h.Storage.Find(shortCode)
	if err != nil {
		h.respondWithError(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	http.Redirect(w, r, url.OriginalURL, http.StatusMovedPermanently)
}

func isValidShortCode(code string) bool {
	// Add your validation logic here
	return len(code) >= 4 && len(code) <= 10
}

func (h *URLHandler) respondWithError(w http.ResponseWriter, message string, code int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(map[string]string{"error": message})
}

func generateShortCode() string {
	return RandStringBytes(6)
}

func RandStringBytes(n int) string {
	const letterBytes = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	b := make([]byte, n)
	for i := range b {
		b[i] = letterBytes[rand.Intn(len(letterBytes))]

	}

	return string(b)
}

const defaultRecentLimit = 10
const maxRecentLimit = 100

func (h *URLHandler) GetRecentURLs(w http.ResponseWriter, r *http.Request) {
    // Get limit from query param with validation
    limit := defaultRecentLimit
    if limitParam := r.URL.Query().Get("limit"); limitParam != "" {
        if l, err := strconv.Atoi(limitParam); err == nil && l > 0 {
            if l > maxRecentLimit {
                l = maxRecentLimit
            }
            limit = l
        }
    }

    urls, err := h.Storage.GetRecent(limit)
    if err != nil {
        http.Error(w, "Failed to fetch recent URLs", http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    if err := json.NewEncoder(w).Encode(urls); err != nil {
        http.Error(w, "Failed to encode response", http.StatusInternalServerError)
    }
}
