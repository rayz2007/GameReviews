package handlers

import (
	"GameReviews/servers/gateway/sessions"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"
)

func TestHandlerContext_UsersHandler(t *testing.T) {
	cases := []string{
		`{ 
			"email": "valid@email.com",
			"password": "password",
			"passwordConf": "password",
			"userName": "user",
			"firstName": "first",
			"lastName": "last"
		}`,
		`
			"": "valid@email.com",
			"password": "password",
			"passwordConf": "password",
			"userName": "user",
			"firstName": "first",
			"lastName": "last"
		}`,
		`{ 
			"email": "valid@email.com",
			"password": "pasword",
			"passwordConf": "password",
			"userName": "user",
			"firstName": "first",
			"lastName": "last"
		}`,
	}
	testHdlr := getMockContext()
	req, err := http.NewRequest("POST", "/v1/users", strings.NewReader(cases[0]))
	if err != nil {
		t.Error("error processing request")
	}
	rr := httptest.NewRecorder()
	req.Header.Set("Content-Type", "text/html")
	handler := http.HandlerFunc(testHdlr.UsersHandler)
	handler.ServeHTTP(rr, req)
	if rr.Code != http.StatusUnsupportedMediaType {
		t.Errorf("handler returned wrong status code: got %v want %v",
			rr.Code, http.StatusUnsupportedMediaType)
	}
	req, _ = http.NewRequest("GET", "/v1/users", strings.NewReader(cases[0]))
	rr = httptest.NewRecorder()
	handler.ServeHTTP(rr, req)
	if rr.Code != http.StatusMethodNotAllowed {
		t.Errorf("handler returned wrong status code: got %v want %v",
			rr.Code, http.StatusMethodNotAllowed)
	}
	for _, c := range cases {
		newReq, _ := http.NewRequest("POST", "/v1/users", strings.NewReader(c))
		newReq.Header.Set("Content-Type", "application/json")
		rr = httptest.NewRecorder()
		handler.ServeHTTP(rr, newReq)
		if c == cases[0] {
			if rr.Code != http.StatusCreated {
				t.Errorf("handler returned wrong status code: got %v want %v",
					rr.Code, http.StatusCreated)
			}
		} else {
			if rr.Code != http.StatusBadRequest {
				t.Errorf("handler returned wrong status code: got %v want %v",
					rr.Code, http.StatusBadRequest)
			}
		}
	}
}

func TestHandlerContext_SessionsHandler(t *testing.T) {
	cases := []string{
		`{ 
			"email": "valid@email.com",
			"password": "password"
		}`,
		`{
			"email": "invalid@email.com",
			"password": "password"
		}`,
		`{ 
			"email": "valid@email.com",
			"password": "pssword"
		}`,
	}
	testHandler := getMockContext()
	req, err := http.NewRequest("POST", "/v1/sessions", strings.NewReader(cases[0]))
	if err != nil {
		t.Error("error processing request")
	}
	rr := httptest.NewRecorder()
	req.Header.Set("Content-Type", "text/html")
	handler := http.HandlerFunc(testHandler.SessionsHandler)
	handler.ServeHTTP(rr, req)
	if rr.Code != http.StatusUnsupportedMediaType {
		t.Errorf("handler returned wrong status code: got %v want %v",
			rr.Code, http.StatusUnsupportedMediaType)
	}
	req, _ = http.NewRequest("GET", "/v1/sessions", strings.NewReader(cases[0]))
	rr = httptest.NewRecorder()
	handler.ServeHTTP(rr, req)
	if rr.Code != http.StatusMethodNotAllowed {
		t.Errorf("handler returned wrong status code: got %v want %v",
			rr.Code, http.StatusMethodNotAllowed)
	}
	for _,c := range cases {
		newReq, _ := http.NewRequest("POST", "/v1/sessions", strings.NewReader(c))
		newReq.Header.Set("Content-Type", "application/json")
		rr = httptest.NewRecorder()
		handler.ServeHTTP(rr, newReq)
		if c == cases[0] {
			if rr.Code != http.StatusCreated {
				t.Errorf("handler returned wrong status code: got %v want %v",
					rr.Code, http.StatusCreated)
			}
		} else {
			if rr.Code != http.StatusUnauthorized {
				t.Errorf("handler returned wrong status code: got %v want %v",
					rr.Code, http.StatusUnauthorized)
			}
		}
	}

}

func TestHandlerContext_SpecificSessionHandler(t *testing.T) {
	testHandler := getMockContext()
	handler := http.HandlerFunc(testHandler.SpecificSessionHandler)
	rr := httptest.NewRecorder()
	req, err := http.NewRequest("DELETE", "/v1/sessions/mie", nil)
	if err != nil {
		t.Fatal(err)
	}
	handler.ServeHTTP(rr, req)
	if rr.Code != http.StatusForbidden {
		t.Errorf("handler returned wrong status code: got %v want %v",
			rr.Code, http.StatusForbidden)
	}
	sessId, err := sessions.NewSessionID(testHandler.SigningKey)
	req.Header.Add("Authorization", "Bearer " + sessId.String())
	req, _ = http.NewRequest("DELETE", "/v1/sessions/mine", nil)
	rr = httptest.NewRecorder()
	handler.ServeHTTP(rr, req)
	if rr.Code != http.StatusBadRequest {
		t.Errorf("handler returned wrong status code: got %v want %v",
			rr.Code, http.StatusBadRequest)
	}
	req.Header.Add("Authorization", "Bearer " + sessId.String())
	rr = httptest.NewRecorder()
	handler.ServeHTTP(rr, req)
	if rr.Body.String() != "signed out"{
		t.Errorf("handler returned wrong respinse: got %v want %v",
			rr.Body.String(), "signed out")
	}
	req, _ = http.NewRequest("GET", "/v1/sessions/mine", nil)
	rr = httptest.NewRecorder()
	handler.ServeHTTP(rr, req)
	if rr.Code != http.StatusMethodNotAllowed {
		t.Errorf("handler returned wrong status code: got %v want %v",
			rr.Code, http.StatusMethodNotAllowed)
	}
}

func TestHandlerContext_SpecificUserHandler(t *testing.T) {
	testHandler := getMockContext()
	req, err := http.NewRequest("GET", "/v1/users/0", nil)
	if err != nil {
		t.Error("error processing request")
	}
	user, _ := testHandler.UserStore.GetByEmail("")
	sessState := SessionState{
		StartTime: time.Now(),
		User:      user,
	}
	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(testHandler.SpecificUserHandler)
	handler.ServeHTTP(rr, req)
	if rr.Code != http.StatusUnauthorized {
		t.Errorf("handler returned wrong status code: got %v want %v",
			rr.Code, http.StatusUnauthorized)
	}
	sessId, err := sessions.NewSessionID(testHandler.SigningKey)
	testHandler.SessionStore.Save(sessId, sessState)
	req.Header.Set("Authorization", "Bearer " + sessId.String())
	sessions.BeginSession(testHandler.SigningKey, testHandler.SessionStore, sessState, rr)
	rr = httptest.NewRecorder()
	handler.ServeHTTP(rr, req)
	if rr.Code != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			rr.Code, http.StatusOK)
	}
	updates := strings.NewReader(`{
		"firstName": "joe",
		"lastName": "bob"
	}`)
	req, _ = http.NewRequest("PATCH", "/v1/users/me", updates)
	req.Header.Set("Authorization", "Bearer " + sessId.String())
	req.Header.Set("Content-Type", "application/json")
	rr = httptest.NewRecorder()
	handler.ServeHTTP(rr, req)

	if rr.Code != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			rr.Code, http.StatusOK)
	}
	req, _ = http.NewRequest("PATCH", "/v1/users/20", updates)
	req.Header.Set("Authorization", "Bearer " + sessId.String())
	req.Header.Set("Content-Type", "application/json")
	rr = httptest.NewRecorder()
	handler.ServeHTTP(rr, req)
	if rr.Code != http.StatusForbidden {
		t.Errorf("handler returned wrong status code: got %v want %v",
			rr.Code, http.StatusForbidden)
	}
	req, _ = http.NewRequest("PATCH", "/v1/users/me", updates)
	req.Header.Set("Authorization", "Bearer " + sessId.String())
	req.Header.Set("Content-Type", "application/json")
	rr = httptest.NewRecorder()
	handler.ServeHTTP(rr, req)
	if rr.Code != http.StatusBadRequest {
		t.Errorf("handler returned wrong status code: got %v want %v",
			rr.Code, http.StatusBadRequest)
	}
	req, _ = http.NewRequest("PATCH", "/v1/users/me", updates)
	req.Header.Set("Authorization", "Bearer " + sessId.String())
	req.Header.Set("Content-Type", "appliation/json")
	rr = httptest.NewRecorder()
	handler.ServeHTTP(rr, req)
	if rr.Code != http.StatusUnsupportedMediaType {
		t.Errorf("handler returned wrong status code: got %v want %v",
			rr.Code, http.StatusUnsupportedMediaType)
	}
	req, _ = http.NewRequest("POST", "/v1/users/me", nil)
	req.Header.Set("Authorization", "Bearer " + sessId.String())
	rr = httptest.NewRecorder()
	handler.ServeHTTP(rr, req)
	if rr.Code != http.StatusMethodNotAllowed {
		t.Errorf("handler returned wrong status code: got %v want %v",
			rr.Code, http.StatusMethodNotAllowed)
	}
}

func getMockContext() (hdlr *HandlerContext) {
	return &HandlerContext{
		SigningKey:   "key",
		SessionStore: sessions.NewMemStore(time.Hour, time.Minute),
		UserStore:   &MockStore{},
	}
}
