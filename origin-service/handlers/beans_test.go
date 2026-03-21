package handlers

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"origin-service/models"
	"testing"
)

func TestGetBeans(t *testing.T) {
	req, err := http.NewRequest("GET", "/beans", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(GetBeans)

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

	var responseBeans []models.CoffeeBean
	if err := json.Unmarshal(rr.Body.Bytes(), &responseBeans); err != nil {
		t.Errorf("failed to unmarshal response: %v", err)
	}

	if len(responseBeans) != len(beans) {
		t.Errorf("handler returned unexpected number of beans: got %v want %v",
			len(responseBeans), len(beans))
	}
}
