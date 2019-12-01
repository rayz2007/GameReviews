package handlers

import (
	"GameReviews/servers/gateway/models/users"
	"errors"
	"golang.org/x/crypto/bcrypt"
	"time"
)


type MockStore struct {
}
// LogUserSignIn logs a user sign in
func (ms *MockStore) LogUserSignIn(id int64, time time.Time, addr string) error {
	return nil
}


func (ms *MockStore) GetByID(id int64) (*users.User, error) {
	user := &users.User{
		ID:        1,
		Email:     "valid@email.com",
		PassHash:  []byte("passwordHash"),
		UserName:  "user",
		FirstName: "first",
		LastName:  "last",
		PhotoURL:  "testphotourl.com",
	}

	return user, nil
}

func (ms *MockStore) GetByEmail(email string) (*users.User, error) {
	if email == "invalid@email.com" {
		return nil, errors.New("couldnt find user")
	}
	hash, _ := bcrypt.GenerateFromPassword([]byte("password"), 13)
	user := &users.User{
		ID:        0,
		Email:     "valid@email.com",
		PassHash:  hash,
		UserName:  "user",
		FirstName: "first",
		LastName:  "last",
		PhotoURL:  "testphotourl.com",
	}
	return user, nil
}

func (ms *MockStore) GetByUserName(username string) (*users.User, error) {
	user := &users.User{
	}
	return user, nil
}

func (ms *MockStore) Insert(user *users.User) (*users.User, error) {
	user.ID = 1
	return user, nil
}

func (ms *MockStore) Update(id int64, updates *users.Updates) (*users.User, error) {
	user := &users.User{
	}
	return user, nil
}

func (ms *MockStore) Delete(id int64) error {
	return nil
}