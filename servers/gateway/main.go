package main

import (
	"GameReviews/servers/gateway/handlers"
	"GameReviews/servers/gateway/models/users"
	"GameReviews/servers/gateway/sessions"
	"database/sql"
	"encoding/json"
	"fmt"
	"github.com/go-redis/redis"
	"log"
	"net/http"
	"net/http/httputil"
	"os"
	"time"
)

func main() {
	addr := os.Getenv("ADDR")
	tlsCert := os.Getenv("TLSCERT")
	tlsKey := os.Getenv("TLSKEY")
	sessKey := os.Getenv("SESSIONKEY")
	redisAdd := os.Getenv("REDISADDR")
	gamesAddr := os.Getenv("GAMEADDR")
	dsn := os.Getenv("DSN")
	if len(tlsCert) == 0 || len(tlsKey) == 0 {
		fmt.Println("error: env variable TLSCERT and/or TLSKEY not set")
		os.Exit(1)
	}
	if len(addr) == 0 {
		addr = ":443"
	}
	// create sessionStore through Redis
	redisDb := redis.NewClient(&redis.Options{
		Addr:     redisAdd,
		Password: "",
		DB:       0,
	})
	redisStore := sessions.NewRedisStore(redisDb, time.Hour)
	// create userStore through mySQL
	db, _ := sql.Open("mysql", dsn)
	if err := db.Ping(); err != nil {
		fmt.Printf("error pinging the db: %v\n", err)
	}
	userStore := &users.UserStore{
		DB: db,
	}
	defer db.Close()

	// instantiate handler context
	hdlr := &handlers.HandlerContext{
		SigningKey:  sessKey,
		SessionStore:   redisStore,
		UserStore:   userStore,
	}

	gameProxy := func(r *http.Request) {
		r.Header.Del("X-User")
		sessionState := new(handlers.SessionState)
		sid, err := sessions.GetState(r, hdlr.SigningKey, hdlr.SessionStore, sessionState)
		if sid != sessions.InvalidSessionID && err == nil {
			user, err := json.Marshal(sessionState.User)
			if err == nil {
				r.Header.Add("X-User", string(user)) // User is authenticated
			}
		}
		r.Host = gamesAddr
		r.URL.Host = gamesAddr
		r.URL.Scheme = "http"
	}

	gamingProxy := &httputil.ReverseProxy{Director: gameProxy}
	mux := http.NewServeMux()
	mux.Handle("/v1/games", gamingProxy)
	mux.Handle("/v1/games/", gamingProxy)
	mux.Handle("/v1/games/reviews", gamingProxy)
	mux.Handle("/v1/games/reviews/", gamingProxy)
	mux.HandleFunc("/v1/users", hdlr.UsersHandler)
	mux.HandleFunc("/v1/users/", hdlr.SpecificUserHandler)
	mux.HandleFunc("/v1/sessions", hdlr.SessionsHandler)
	mux.HandleFunc("/v1/sessions/", hdlr.SpecificSessionHandler)
	wrapper := &handlers.CorsMiddleWare{Handler:mux}
	log.Printf("server is listening at http://%s", addr)
	log.Fatal(http.ListenAndServeTLS(addr, tlsCert, tlsKey, wrapper))
}
