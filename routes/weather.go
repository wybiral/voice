package routes

import (
	"fmt"
	"io"
	"net/http"

	"../types"
)

func weather(s *types.Settings, w http.ResponseWriter, r *http.Request) {
	key := s.DarkSkyKey
	if len(key) == 0 {
		jsonError(w, "missing key")
		return
	}
	location := s.DarkSkyLocation
	if len(location) == 0 {
		jsonError(w, "missing location")
		return
	}
	url := fmt.Sprintf("https://api.darksky.net/forecast/%s/%s", key, location)
	res, err := http.Get(url)
	if err != nil {
		jsonError(w, err.Error())
		return
	}
	w.Header().Set("Content-Type", "application/json")
	io.Copy(w, res.Body)
}
