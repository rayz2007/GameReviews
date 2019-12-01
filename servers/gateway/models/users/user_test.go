package users

import (
	"crypto/md5"
	"encoding/hex"
	"testing"
)

//TODO: add tests for the various functions in user.go, as described in the assignment.
//use `go test -cover` to ensure that you are covering all or nearly all of your code paths.

func TestNewUser_Validate(t *testing.T) {
	cases := []struct {
		email        string
		password        string
		passwordConf     string
		userName string
		expectErr bool
	}{
		{
			"valid@gmail.com",
			"validPass",
			"validPass",
			"validUser",
			false,
		},
		{
			"valid@gmail.com",
			"short",
			"short",
			"validUser",
			true,
		},
		{
			"valid@gmail.com",
			"invalidPass",
			"validPass",
			"validUser",
			true,
		},
		{
			"valid@gmail.com",
			"validPass",
			"validPass",
			"",
			true,
		},
		{
			"valid@gmail.com",
			"validPass",
			"validPass",
			"space user",
			true,
		},
	}

	for _, c := range cases {
		testUser := NewUser{
			Email:        c.email,
			Password:     c.password,
			PasswordConf: c.passwordConf,
			UserName:     c.userName,
			FirstName:    "",
			LastName:     "",
		}
		err := testUser.Validate()
		if err != nil && !c.expectErr {
			t.Errorf("unexpected error: %s", err)
		}
		if c.expectErr && err == nil {
			t.Errorf("expected an error")
		}
	}
}

func TestNewUser_ToUser(t *testing.T) {
	cases := []struct {
		email        string
		password        string
		passwordConf     string
		userName string
		expectErr bool
	}{
		{
			"valid@gmail.com",
			"validPass",
			"validPass",
			"validUser",
			false,
		},
		{
			"vALid@gmail.com",
			"validPass",
			"validPass",
			"validUser",
			false,
		},
		{
			"      vALid@gmail.com     ",
			"validPass",
			"validPass",
			"validUser",
			false,
		},
		{
			"valid@gmail.com",
			"short",
			"short",
			"validUser",
			true,
		},
		{
			"valid@gmail.com",
			"invalidPass",
			"validPass",
			"validUser",
			true,
		},
		{
			"valid@gmail.com",
			"validPass",
			"validPass",
			"",
			true,
		},
		{
			"valid@gmail.com",
			"validPass",
			"validPass",
			"space user",
			true,
		},
	}

	for _, c := range cases {
		testUser := NewUser{
			Email:        c.email,
			Password:     c.password,
			PasswordConf: c.passwordConf,
			UserName:     c.userName,
			FirstName:    "",
			LastName:     "",
		}

		user, err := testUser.ToUser()
		if err != nil && !c.expectErr {
			t.Errorf("unexpected error: %s", err)
		}
		if c.expectErr && err == nil {
			t.Errorf("expected an error")
		}
		if user != nil {
			hasher := md5.New()
			hasher.Write([]byte("valid@gmail.com"))
			correctHashString := hex.EncodeToString(hasher.Sum(nil))
			validPhotoURL := "https://www.gravatar.com/avatar/" + correctHashString
			if validPhotoURL != user.PhotoURL {
				t.Errorf(c.email + " photo URL creation incorrect")
			}
		}
	}
}

func TestUser_FullName(t *testing.T) {
	cases := []struct {
		firstName       string
		lastName       string
		expected	string
	}{
		{
			"validFirstName",
			"validLastName",
			"validFirstName validLastName",

		},
		{
			"onlyFirstName",
			"",
			"onlyFirstName",
		},
		{
			"",
			"onlyLastName",
			"onlyLastName",
		},
		{
			"",
			"",
			"",
		},
	}
	for _, c := range cases {
		user := User{
			ID:        0,
			Email:     "",
			PassHash:  nil,
			UserName:  "testUser",
			FirstName: c.firstName,
			LastName:  c.lastName,
			PhotoURL:  "",
		}
		testFullName := user.FullName()
		if testFullName != c.expected {
			t.Errorf("Expected " + c.expected + " but got " + testFullName)
		}
	}
}

func TestUser_Authenticate(t *testing.T) {
	cases := []struct {
		password string
		expectErr bool
	}{
		{
			"correctPassword",
			false,
		},
		{
			"incorrectPassword",
			true,
		},
		{
			"",
			true,
		},
	}
	newUser := NewUser{
		Email:        "test@gmail.com",
		Password:     "correctPassword",
		PasswordConf: "correctPassword",
		UserName:     "test",
		FirstName:    "testName",
		LastName:     "testName",
	}
	for _, c := range cases {
		user, err := newUser.ToUser()
		if err != nil {
			t.Error(err)
		}
		authErr := user.Authenticate(c.password)
		if !c.expectErr && authErr != nil {
			t.Errorf("Expected no error but got: %s", authErr)
		}
		if c.expectErr && authErr == nil {
			t.Errorf("Expected an error but got: %s", authErr)
		}
		if c.password == "" && authErr != ErrEmptyPass {
			t.Errorf("Expected empty pass error but got: %s", authErr)
		}
	}
}

func TestUser_ApplyUpdates(t *testing.T) {
	cases := []struct{
		newFirstName string
		newLastName string
	} {
		{
			"newFirst",
			"newLast",
		},
		{
			"newFirst",
			"",
		},
		{
			"",
			"newLast",
		},
		{
			"",
			"",
		},
	}
	user := User{
		ID:        0,
		Email:     "",
		PassHash:  nil,
		UserName:  "",
		FirstName: "Joe",
		LastName:  "Bob",
		PhotoURL:  "",
	}
	for _, c := range cases {
		updates := Updates{
			FirstName: c.newFirstName,
			LastName:  c.newLastName,
		}
		user.ApplyUpdates(&updates)
		if user.FirstName != updates.FirstName || user.LastName != updates.LastName {
			t.Errorf("Expected first name: %s and last name: %s but got first name: %s " +
				"and last name: %s", updates.FirstName, updates.LastName, user.FirstName, user.LastName)
		}
	}
}