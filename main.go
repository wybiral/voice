package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func main() {
	addr := "127.0.0.1:80"
	r := mux.NewRouter().StrictSlash(true)
	// Install API handlers here
	// ...
	// Serve index page
	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "index.html")
	}).Methods("GET")
	// Setup static file server
	fs := http.FileServer(http.Dir("./static/"))
	r.PathPrefix("/static/").Handler(http.StripPrefix("/static/", fs))
	s := &http.Server{
		Addr:    addr,
		Handler: r,
	}
	// Start listening
	log.Println("Serving at " + addr)
	err := s.ListenAndServe()
	if err != nil {
		log.Fatal(err)
	}
}
