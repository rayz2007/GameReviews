package users

import (
	"database/sql"
	"github.com/DATA-DOG/go-sqlmock"
	"log"
	"reflect"
	"regexp"

	"testing"
)


func setUpDb() (*UserStore, sqlmock.Sqlmock, error) {
	db, mock, err := sqlmock.New()

	userStore := NewUserStore(db)
	return userStore, mock, err
}


func TestUserStore_Insert(t *testing.T) {

	userStore, mock, err := setUpDb()
	defer userStore.DB.Close()

	newUser := &User{
		ID:        1,
		Email:     "a@a.com",
		PassHash:  []byte("password"),
		UserName:  "test",
		FirstName: "first",
		LastName:  "last",
		PhotoURL:  "www.google.com",
	}

	mock.ExpectExec("insert into").WithArgs(newUser.Email, newUser.UserName, newUser.PassHash,
		newUser.FirstName, newUser.LastName, newUser.PhotoURL).
		WillReturnResult(sqlmock.NewResult(2, 1))

	// now we execute our method
	if _, err = userStore.Insert(newUser); err != nil {
		t.Errorf("error was not expected while inserting: %s", err)
	}

	// we make sure that all expectations were met
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

func TestUserStore_GetByID(t *testing.T) {
	//create a new sql mock
	store, mock, err := setUpDb()
	if err != nil {
		log.Fatalf("error creating sql mock: %v", err)
	}

	defer store.DB.Close()

	newUser := &User {
		ID:        1,
		Email:     "a@a.com",
		PassHash:  []byte("password"),
		UserName:  "test",
		FirstName: "first",
		LastName:  "last",
		PhotoURL:  "www.google.com",
	}
	row := sqlmock.NewRows([]string{"id", "email", "user_name", "pass_hash", "first_name", "last_name", "photo_url"})
	row.AddRow(newUser.ID, newUser.Email, newUser.UserName, newUser.PassHash, newUser.FirstName,
		newUser.LastName, newUser.PhotoURL)

	mock.ExpectQuery("SELECT").
		WithArgs(newUser.ID).WillReturnRows(row)

	user, err := store.GetByID(newUser.ID)
	if err != nil {
		t.Errorf("Did not expect an error")
	}

	if err == nil && !reflect.DeepEqual(user, newUser) {
		t.Errorf("User did not match our test user")
	}
	if _, err = store.GetByID(90); err == nil {
		t.Errorf("Expected error: %v, but recieved nil", sql.ErrNoRows)
	}
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("Expectations not fulfilled: %v", err)
	}
}

func TestUserStore_GetByEmail(t *testing.T) {
	//create a new sql mock
	store, mock, err := setUpDb()
	if err != nil {
		log.Fatalf("error creating sql mock: %v", err)
	}

	defer store.DB.Close()

	newUser := &User{
		ID:        1,
		Email:     "a@a.com",
		PassHash:  []byte("password"),
		UserName:  "test",
		FirstName: "first",
		LastName:  "last",
		PhotoURL:  "www.google.com",
	}
	row := sqlmock.NewRows([]string{"id", "email", "user_name", "pass_hash", "first_name", "last_name", "photo_url"})
	row.AddRow(newUser.ID, newUser.Email, newUser.UserName, newUser.PassHash, newUser.FirstName,
		newUser.LastName, newUser.PhotoURL)


	mock.ExpectQuery("SELECT").
		WithArgs(newUser.UserName).WillReturnRows(row)

	user, err := store.GetByUserName(newUser.UserName)
	if err != nil {
		t.Errorf("Did not expect an error")
	}

	if err == nil && !reflect.DeepEqual(user, newUser) {
		t.Errorf("User did not match our test user")
	}
	if _, err = store.GetByUserName(""); err == nil {
		t.Errorf("Expected error: %v, but recieved nil", sql.ErrNoRows)
	}
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("Expectations not fulfilled: %v", err)
	}
}

func TestUserStore_GetByUserName(t *testing.T) {
	//create a new sql mock
	store, mock, err := setUpDb()
	if err != nil {
		log.Fatalf("error creating sql mock: %v", err)
	}

	defer store.DB.Close()

	newUser := &User{
		ID:        1,
		Email:     "a@a.com",
		PassHash:  []byte("password"),
		UserName:  "test",
		FirstName: "first",
		LastName:  "last",
		PhotoURL:  "www.google.com",
	}
	row := sqlmock.NewRows([]string{"id", "email", "user_name", "pass_hash", "first_name", "last_name", "photo_url"})
	row.AddRow(newUser.ID, newUser.Email, newUser.UserName, newUser.PassHash, newUser.FirstName,
		newUser.LastName, newUser.PhotoURL)


	mock.ExpectQuery("SELECT").
		WithArgs(newUser.UserName).WillReturnRows(row)

	user, err := store.GetByUserName(newUser.UserName)
	if err != nil {
		t.Errorf("Did not expect an error")
	}

	if err == nil && !reflect.DeepEqual(user, newUser) {
		t.Errorf("User did not match our test user")
	}
	if _, err = store.GetByUserName(""); err == nil {
		t.Errorf("Expected error: %v, but recieved nil", sql.ErrNoRows)
	}
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("Expectations not fulfilled: %v", err)
	}
}

func TestUserStore_Delete(t *testing.T) {
	userStore, mock, err := setUpDb()
	defer userStore.DB.Close()

	newUser0 := &User{
		ID:        1,
		Email:     "z@z.com",
		PassHash:  []byte("password"),
		UserName:  "test0",
		FirstName: "first",
		LastName:  "last",
		PhotoURL:  "www.google.com",
	}

	newUser := &User{
		ID:        2,
		Email:     "a@a.com",
		PassHash:  []byte("password"),
		UserName:  "test",
		FirstName: "first",
		LastName:  "last",
		PhotoURL:  "www.google.com",
	}


	_, err = userStore.Insert(newUser0)
	_, err = userStore.Insert(newUser)

	mock.ExpectExec("DELETE FROM users").WithArgs(2).WillReturnResult(sqlmock.NewResult(1,1))

	// now we execute our method
	if err = userStore.Delete(2); err != nil {
		t.Errorf("error was not expected while deleting: %s", err)
	}

	// we make sure that all expectations were met
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}

func TestUserStore_Update(t *testing.T) {
	//create a new sql mock
	userStore, mock, err := setUpDb()
	defer userStore.DB.Close()

	if err != nil {
		log.Fatalf("error creating sql mock: %v", err)
	}

	newUser := &User{
		ID:        2,
		Email:     "a@a.com",
		PassHash:  []byte("password"),
		UserName:  "test",
		FirstName: "first",
		LastName:  "last",
		PhotoURL:  "www.google.com",
	}

	updates := &Updates{
		FirstName: "newName",
		LastName:  "newLast",
	}

	row := sqlmock.NewRows([]string{"id", "email", "pass_hash", "username", "firstname", "lastname", "photo_url"})

	row.AddRow(newUser.ID, newUser.Email, newUser.PassHash, newUser.UserName, newUser.FirstName, newUser.LastName, newUser.PhotoURL)

	mock.ExpectExec(regexp.QuoteMeta("update users set first_name=?, last_name=? where id=?")).
		WithArgs(newUser.ID).
		WillReturnResult(sqlmock.NewResult(newUser.ID, 1))

	mock.ExpectQuery(regexp.QuoteMeta("Select * From users Where id=?")).
		WithArgs(newUser.ID).WillReturnRows(row)

	u, err := userStore.Update(newUser.ID, updates)
	if err == nil && !reflect.DeepEqual(newUser, u) {
		t.Errorf("User is not correct")
	}
}