package routes

import (
	"net/http"

	"github.com/gorilla/mux"
)

func Routes() *mux.Router {
	r := mux.NewRouter().StrictSlash(true)
	// Serve index page
	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "index.html")
	}).Methods("GET")
	// Setup static file server
	r.PathPrefix("/static/").Handler(
		http.StripPrefix("/static/", http.FileServer(http.Dir("./static/"))),
	).Methods("GET")
	// Handle /weather API
	r.HandleFunc("/weather", weather).Methods("GET")
	return r
}
