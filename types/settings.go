package types

import (
	"encoding/json"
	"io/ioutil"
	"os"
)

type Plugin struct {
	File    string                 `json:"file"`
	Options map[string]interface{} `json:"options"`
}

type Settings struct {
	DarkSkyKey      string   `json:"dark_sky_key"`
	DarkSkyLocation string   `json:"dark_sky_location"`
	Plugins         []Plugin `json:"plugins"`
}

func LoadSettings(filepath string) (*Settings, error) {
	f, err := os.Open(filepath)
	if err != nil {
		return nil, err
	}
	defer f.Close()
	b, err := ioutil.ReadAll(f)
	if err != nil {
		return nil, err
	}
	settings := &Settings{}
	err = json.Unmarshal(b, &settings)
	if err != nil {
		return nil, err
	}
	return settings, nil
}
