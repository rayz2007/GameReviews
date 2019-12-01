package users

import (
	"database/sql"
	_ "github.com/go-sql-driver/mysql"
	"time"
)

type UserStore struct {
	DB *sql.DB
}

func NewUserStore(db *sql.DB) *UserStore {
	return &UserStore{db}
}

func (us *UserStore) LogUserSignIn(userID int64, time time.Time, addr string) error {
	_, err := us.DB.Exec("insert into logins(user_id, login_time, request_addr) values (?,?,?)",
		userID, time, addr)
	if err != nil {
		return err
	}
	return nil
}

func (us *UserStore) GetByID(id int64) (*User, error) {
	user := &User{}
	row := us.DB.QueryRow("SELECT * FROM users WHERE id=?", id)
	if err := row.Scan(&user.ID, &user.Email, &user.UserName, &user.PassHash, &user.FirstName,
		&user.LastName, &user.PhotoURL); err != nil {
		return nil, ErrUserNotFound
	}
	return user, nil
}

func (us *UserStore) GetByEmail(email string) (*User, error) {
	user := &User{}
	row := us.DB.QueryRow("SELECT * FROM users WHERE email=?", email)
	if err := row.Scan(&user.ID, &user.Email, &user.UserName, &user.PassHash, &user.FirstName,
		&user.LastName, &user.PhotoURL); err != nil {
		return nil, ErrUserNotFound
	}
	return user, nil
}

func (us *UserStore) GetByUserName(userName string) (*User, error) {
	user := &User{}
	row := us.DB.QueryRow("SELECT * FROM users WHERE user_name=?", userName)
	if err := row.Scan(&user.ID, &user.Email, &user.UserName, &user.PassHash, &user.FirstName,
		&user.LastName, &user.PhotoURL); err != nil {
		return nil, ErrUserNotFound
	}
	return user, nil
}

func (us *UserStore) Insert(user *User) (*User, error) {
	res, err := us.DB.Exec("insert into users(email, user_name, pass_hash, first_name, last_name, photo_url) values (?,?,?,?,?,?)",
		user.Email, user.UserName, user.PassHash, user.FirstName, user.LastName, user.PhotoURL)
	if err != nil {
		return nil, err
	}

	id, err := res.LastInsertId()
	if err != nil {
		return nil, err
	}

	user.ID = id
	return user, nil
}

func (us *UserStore) Update(id int64, updates *Updates) (*User, error) {
	_, err := us.DB.Exec("UPDATE users SET first_name = ?, last_name = ? WHERE id = ?", updates.FirstName, updates.LastName, id)
	if err != nil {
		return nil, err
	}
	return us.GetByID(id)
}

func (us *UserStore) Delete(id int64) error {
	query := `DELETE FROM users WHERE id = ?;`
	_, err := us.DB.Exec(query, id)
	return err
}

