package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func main() {
	// Setup flags
	var host string
	flag.StringVar(&host, "host", "127.0.0.1", "Server Host")
	var port int
	flag.IntVar(&port, "port", 8080, "Server Port")
	var certFile string
	flag.StringVar(&certFile, "cert", "", "Path of TLS cert file (optional)")
	var keyFile string
	flag.StringVar(&keyFile, "key", "", "Path of TLS key file (optional)")
	var settingsFile string
	flag.StringVar(&settingsFile, "settings", "settings.json", "Path of settings.js file")
	flag.Parse()
	addr := fmt.Sprintf("%s:%d", host, port)
	// Create server
	s := &http.Server{
		Addr:    addr,
		Handler: routes(),
	}
	var err error
	// Start listening
	if len(certFile) == 0 || len(keyFile) == 0 {
		log.Println("Serving at http://" + addr)
		err = s.ListenAndServe()
	} else {
		log.Println("Serving at https://" + addr)
		err = s.ListenAndServeTLS(certFile, keyFile)
	}
	if err != nil {
		log.Fatal(err)
	}
}

// Create routes
func routes() *mux.Router {
	r := mux.NewRouter().StrictSlash(true)
	// Serve index page
	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "index.html")
	}).Methods("GET")
	// Setup static file server
	r.PathPrefix("/static/").Handler(
		http.StripPrefix("/static/", http.FileServer(http.Dir("./static/"))),
	).Methods("GET")
	return r
}
