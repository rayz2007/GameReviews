package sessions

import (
	"encoding/json"
	"time"

	"github.com/go-redis/redis"
)

//RedisStore represents a session.Store backed by redis.
type RedisStore struct {
	//Redis client used to talk to redis server.
	Client *redis.Client
	//Used for key expiry time on redis.
	SessionDuration time.Duration
}

//NewRedisStore constructs a new RedisStore
func NewRedisStore(client *redis.Client, sessionDuration time.Duration) *RedisStore {
	//initialize and return a new RedisStore struct
	return &RedisStore{client, sessionDuration}
}

//Store implementation

//Save saves the provided `sessionState` and associated SessionID to the store.
//The `sessionState` parameter is typically a pointer to a struct containing
//all the data you want to associated with the given SessionID.
func (rs *RedisStore) Save(sid SessionID, sessionState interface{}) error {
	//TODO: marshal the `sessionState` to JSON and save it in the redis database,
	//using `sid.getRedisKey()` for the key.
	//return any errors that occur along the way.
	sessionJson, err := json.Marshal(sessionState)
	if err != nil {
		return err
		//fmt.Errorf("error marshalling session state into json: %v\n", err)
	}
	saveErr := rs.Client.Set(sid.getRedisKey(), sessionJson, rs.SessionDuration).Err()
	if saveErr != nil {

		return saveErr
		//fmt.Errorf("error saving state to id in redis: %v\n", saveErr)
	}
	return nil
}

//Get populates `sessionState` with the data previously saved
//for the given SessionID
func (rs *RedisStore) Get(sid SessionID, sessionState interface{}) error {
	//TODO: get the previously-saved session state data from redis,
	//unmarshal it back into the `sessionState` parameter
	//and reset the expiry time, so that it doesn't get deleted until
	//the SessionDuration has elapsed.

	//for extra-credit using the Pipeline feature of the redis
	//package to do both the get and the reset of the expiry time
	//in just one network round trip!
	val, err := rs.Client.Get(sid.getRedisKey()).Result()
	if err == redis.Nil {
		return ErrStateNotFound
	} else if err != nil {
		return err
		//fmt.Errorf("error retrieving info for given session: %v\n", err)
	}
	unmarshalErr := json.Unmarshal([]byte(val), sessionState)
	if unmarshalErr != nil {
		//fmt.Errorf("error unmarshalling json for session info: %v\n", unmarshalErr)
		return unmarshalErr
	}
	sessionJson, err := json.Marshal(sessionState)
	saveErr := rs.Client.Set(sid.getRedisKey(), sessionJson, rs.SessionDuration).Err()
	if saveErr != nil {
		return saveErr
		//fmt.Errorf("error resetting expiry time for session: %v\n", saveErr)

	}
	return nil
}

//Delete deletes all state data associated with the SessionID from the store.
func (rs *RedisStore) Delete(sid SessionID) error {
	//TODO: delete the data stored in redis for the provided SessionID
	rs.Client.Del(sid.getRedisKey())
	return nil
}

//getRedisKey() returns the redis key to use for the SessionID
func (sid SessionID) getRedisKey() string {
	//convert the SessionID to a string and add the prefix "sid:" to keep
	//SessionID keys separate from other keys that might end up in this
	//redis instance
	return "sid:" + sid.String()
}
