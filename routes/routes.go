package routes

import (
	"encoding/json"
	"net/http"

	"../types"
	"github.com/gorilla/mux"
)

func Routes(settings *types.Settings) *mux.Router {
	r := mux.NewRouter().StrictSlash(true)

	// Serve index page
	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "index.html")
	}).Methods("GET")

	// Serve settings.json
	r.HandleFunc("/settings.json", func(w http.ResponseWriter, r *http.Request) {
		jsonResponse(w, settings)
	}).Methods("GET")

	// Setup static file server
	r.PathPrefix("/static/").Handler(
		http.StripPrefix(
			"/static/",
			http.FileServer(http.Dir("./static/")),
		),
	)

	// Setup plugins file server
	r.PathPrefix("/plugins/").Handler(
		http.StripPrefix(
			"/plugins/",
			http.FileServer(http.Dir("./plugins/")),
		),
	)

	// Handle /weather API
	r.HandleFunc("/weather", func(w http.ResponseWriter, r *http.Request) {
		weather(settings, w, r)
	})

	return r
}

func jsonResponse(w http.ResponseWriter, obj interface{}) {
	w.Header().Set("Content-Type", "application/json")
	encoder := json.NewEncoder(w)
	encoder.SetIndent("", "  ")
	err := encoder.Encode(obj)
	if err != nil {
		jsonError(w, "marshalling error")
		return
	}
}

func jsonError(w http.ResponseWriter, msg string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusInternalServerError)
	encoder := json.NewEncoder(w)
	encoder.SetIndent("", "  ")
	err := encoder.Encode(
		struct {
			Error string `json:"error"`
		}{
			Error: msg,
		},
	)
	if err != nil {
		return
	}
}
