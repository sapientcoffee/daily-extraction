package handlers

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"origin-service/models"
	"testing"
)

func TestGetBrewMethods(t *testing.T) {
	req, err := http.NewRequest("GET", "/brew", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(GetBrewMethods)

	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	expectedContentType := "application/json"
	if ct := rr.Header().Get("Content-Type"); ct != expectedContentType {
		t.Errorf("handler returned wrong content type: got %v want %v",
			ct, expectedContentType)
	}

	var responseMethods []models.BrewMethod
	if err := json.Unmarshal(rr.Body.Bytes(), &responseMethods); err != nil {
		t.Errorf("failed to unmarshal response: %v", err)
	}

	if len(responseMethods) != len(methods) {
		t.Errorf("handler returned unexpected number of brew methods: got %v want %v",
			len(responseMethods), len(methods))
	}
}
