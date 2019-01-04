package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func main() {
	var err error
	// Setup flags
	var host string
	flag.StringVar(&host, "host", "127.0.0.1", "Server Host")
	var port int
	flag.IntVar(&port, "port", 8080, "Server Port")
	var certFile string
	flag.StringVar(&certFile, "cert", "", "Path of TLS cert file (optional)")
	var keyFile string
	flag.StringVar(&keyFile, "key", "", "Path of TLS key file (optional)")
	flag.Parse()
	addr := fmt.Sprintf("%s:%d", host, port)
	// Setup router
	r := mux.NewRouter().StrictSlash(true)
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
