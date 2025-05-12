// In-memory storage soln
package storage

import (
	"errors"
	"miniurl/models"
	"sync"
  "sort"
)

// Learn how is this implemented.
type MemoryStorage struct {
	urls map[string]models.URL
	mu   sync.RWMutex
}

func NewMemoryStorage() *MemoryStorage {
	return &MemoryStorage{
		urls: make(map[string]models.URL),
	}
}

func (s *MemoryStorage) Save(url models.URL) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	if _, exists := s.urls[url.ShortCode]; exists {
		return errors.New("Short Code already exists.")
	}

	s.urls[url.ShortCode] = url
	return nil
}

func (s *MemoryStorage) Find(shortCode string) (models.URL, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	url, exists := s.urls[shortCode]

	if !exists {
		return models.URL{}, errors.New("URL Not Found")
	}

	return url, nil
}

func (s *MemoryStorage) GetRecent(limit int) ([]models.URL, error) {
    s.mu.RLock()
    defer s.mu.RUnlock()

    // Convert map to slice
    urls := make([]models.URL, 0, len(s.urls))
    for _, url := range s.urls {
        urls = append(urls, url)
    }

    // Sort by creation time (newest first)
    sort.Slice(urls, func(i, j int) bool {
        return urls[i].CreatedAt.After(urls[j].CreatedAt)
    })

    // Apply limit
    if limit > 0 && limit < len(urls) {
        urls = urls[:limit]
    }

    return urls, nil
}
