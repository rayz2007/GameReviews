package handlers

import (
	"GameReviews/servers/gateway/models/users"
	"GameReviews/servers/gateway/sessions"
	"encoding/json"
	"net/http"
	"path"
	"strconv"
	"strings"
	"time"
)

//TODO: define HTTP handler functions as described in the
//assignment description. Remember to use your handler context
//struct as the receiver on these functions so that you have
//access to things like the session store and user store.

func (hdlr *HandlerContext) UsersHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		if !strings.HasPrefix(r.Header.Get("Content-Type"), "application/json"){
			http.Error(w, "Request content type must be json", http.StatusUnsupportedMediaType)
			return
		}
		newUser := new(users.NewUser)
		jsonDecoder := json.NewDecoder(r.Body)
		decodeErr := jsonDecoder.Decode(newUser)
		if decodeErr != nil {
			http.Error(w, "could not decode request", http.StatusBadRequest)
			return
		}
		user, userErr := newUser.ToUser()
		if userErr != nil {
			http.Error(w, "error while converting new user to actual user", http.StatusBadRequest)
			return
		}
		insertedUser, insertErr := hdlr.UserStore.Insert(user)
		if insertErr != nil {
			http.Error(w, "error while inserting new user ", http.StatusBadRequest)
			return
		}
		sessState := SessionState{
			StartTime: time.Now(),
			User:      insertedUser,
		}
		_, sessStartErr := sessions.BeginSession(hdlr.SigningKey, hdlr.SessionStore, sessState, w)
		if sessStartErr != nil {
			http.Error(w, "session did not begin: ", http.StatusBadRequest)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(insertedUser)
	} else {
		http.Error(w, "unsupported HTTP request", http.StatusMethodNotAllowed)
		return
	}
}

func (hdlr *HandlerContext) SpecificUserHandler(w http.ResponseWriter, r *http.Request) {
	userID := path.Base(r.URL.Path)
	sessState := &SessionState{}
	sessID, err := sessions.GetState(r, hdlr.SigningKey, hdlr.SessionStore, sessState)
	if sessID == sessions.InvalidSessionID || err != nil {
		http.Error(w, "current user is not authenticated: ", http.StatusUnauthorized)
		return
	}
	user := getRequestUser(userID, w, r, hdlr)
	if r.Method == http.MethodGet {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(user)
	} else if r.Method == http.MethodPatch {
		id, _ := strconv.ParseInt(userID, 10, 64)
		state := &SessionState{}
		sessions.GetState(r, hdlr.SigningKey, hdlr.SessionStore, state)
		if userID != "me" && state.User.ID != id {
			http.Error(w, "Incorrect User Found", http.StatusForbidden)
			return
		}
		if !strings.HasPrefix(r.Header.Get("Content-Type"), "application/json") {
			http.Error(w, "Request must be in JSON", http.StatusUnsupportedMediaType)
			return
		}
		updates := new(users.Updates)
		decodeErr := json.NewDecoder(r.Body).Decode(updates)
		if decodeErr != nil {
			http.Error(w, "Unable to create updates from request JSON", http.StatusBadRequest)
			return
		}
		hdlr.UserStore.Update(user.ID, updates)
		user.ApplyUpdates(updates)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(user)
 	} else {
		http.Error(w, "unsupported HTTP request", http.StatusMethodNotAllowed)
		return
	}
}

func (hdlr *HandlerContext) SessionsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		if !strings.HasPrefix(r.Header.Get("Content-Type"), "application/json") {
			http.Error(w, "Request must be in JSON", http.StatusUnsupportedMediaType)
			return
		}
		credentials := &users.Credentials{}
		json.NewDecoder(r.Body).Decode(credentials)
		user, err := hdlr.UserStore.GetByEmail(credentials.Email)
		if err != nil {
			time.Sleep(5 * time.Second)
			http.Error(w, "Incorrect Credentials Provided", http.StatusUnauthorized)
			return
		} else if err = user.Authenticate(credentials.Password); err != nil {
			http.Error(w, "Incorrect Credentials Provided", http.StatusUnauthorized)
			return
		}
		sessState := &SessionState{
			StartTime: time.Now(),
			User:      user,
		}
		hdlr.UserStore.LogUserSignIn(user.ID, time.Now(), r.RemoteAddr)
		sessions.BeginSession(hdlr.SigningKey, hdlr.SessionStore, sessState, w)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(user)
	} else {
		http.Error(w, "unsupported HTTP request", http.StatusMethodNotAllowed)
		return
	}
}

func (hdlr *HandlerContext) SpecificSessionHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodDelete {
		if path.Base(r.URL.Path) != "mine" {
			http.Error(w, "request must end with 'mine'", http.StatusForbidden)
			return
		}
		_, err := sessions.EndSession(r, hdlr.SigningKey, hdlr.SessionStore)
		if err != nil {
			http.Error(w, "could not end current session ", http.StatusBadRequest)
			return
		}
		w.Write([]byte("signed out"))
	} else {
		http.Error(w, "unsupported HTTP request", http.StatusMethodNotAllowed)
		return
	}
}

func getRequestUser(userID string, w http.ResponseWriter, r *http.Request, hdlr *HandlerContext) *users.User {
	if userID == "me" {
		state := &SessionState{}
		sessions.GetState(r, hdlr.SigningKey, hdlr.SessionStore, state)
		user, _ := hdlr.UserStore.GetByID(state.User.ID)
		return user
	} else {
		i64id, _ := strconv.ParseInt(userID, 10, 64)
		user, err := hdlr.UserStore.GetByID(i64id)
		if err != nil {
			http.Error(w, "no user found with given id", http.StatusNotFound)
			return nil
		}
		return user
	}
}
