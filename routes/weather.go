package routes

import (
	"encoding/json"
	"io"
	"net/http"
)

const DarkSkyKey = ""
const DarkSkyLocation = ""

func weather(w http.ResponseWriter, r *http.Request) {
	url := "https://api.darksky.net/forecast/"
	url = url + DarkSkyKey + "/" + DarkSkyLocation
	res, err := http.Get(url)
	if err != nil {
		weatherError(w, err.Error())
		return
	}
	if res.StatusCode != 200 {
		weatherError(w, "invalid request")
		return
	}
	w.Header().Set("Content-Type", "application/json")
	io.Copy(w, res.Body)
}

func weatherError(w http.ResponseWriter, msg string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusInternalServerError)
	encoder := json.NewEncoder(w)
	encoder.Encode(struct {
		Error string `json:"error"`
	}{
		msg,
	})
}
