package models

import (
	"encoding/json"
	"testing"
)

func TestCoffeeBeanJSONMarshalling(t *testing.T) {
	bean := CoffeeBean{
		ID:          "123",
		Name:        "Test Bean",
		Origin:      "Test Origin",
		RoastLevel:  "Medium",
		FlavorNotes: []string{"Note 1", "Note 2"},
	}

	bytes, err := json.Marshal(bean)
	if err != nil {
		t.Fatalf("failed to marshal CoffeeBean: %v", err)
	}

	jsonStr := string(bytes)
	if !contains(jsonStr, `"id":"123"`) || !contains(jsonStr, `"name":"Test Bean"`) {
		t.Errorf("marshalled JSON is missing expected keys/values: %s", jsonStr)
	}
}

func contains(s, substr string) bool {
	return len(s) >= len(substr) && func() bool {
		for i := 0; i <= len(s)-len(substr); i++ {
			if s[i:i+len(substr)] == substr {
				return true
			}
		}
		return false
	}()
}
