package main

import (
	"context"
	"errors"

	"github.com/wailsapp/wails/v2/pkg/runtime"

	"github.com/vpaulo/figo"
	fg "github.com/vpaulo/figo/figma"
)

type Config struct {
	Page   string `json:"page"`
	Token  string `json:"token"`
	Prefix string `json:"prefix"`
}

type Components struct {
	data   map[string]fg.Element
	tokens string
}

// App struct
type App struct {
	ctx        context.Context
	config     Config
	components Components
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) domready(ctx context.Context) {
	// runtime.EventsEmit(a.ctx, "loaded")
}

func (a *App) shutdown(ctx context.Context) {
	// TODO:
}

func (a *App) beforeClose(ctx context.Context) (prevent bool) {
	// TODO:
	return false
}

func (a *App) LoadComponentsFromApi(config Config) (map[string]fg.Element, error) {
	a.config = config
	runtime.LogInfof(a.ctx, "GET INFO FROM API:  %+v", a.config)

	if a.config.Page == "" || a.config.Token == "" {
		error := errors.New("field is empty")
		runtime.LogErrorf(a.ctx, "Error Figma page or token can't be empty: %+v", error)
		return nil, error
	}

	figma := figo.Figma{
		FILE_KEY: a.config.Page,
		API_KEY:  a.config.Token,
		Prefix:   a.config.Prefix,
	}

	// Get Figma data from API
	file, err := figma.GetData()
	if err != nil {
		// fmt.Println("Error fetching Figma file:", err)
		runtime.LogErrorf(a.ctx, "Error fetching Figma file: %+v", err)
		return nil, err
	}

	// Tokens from File API
	tokens := figma.ParseTokens(file)

	// Get CSS from tokens
	tokensCSS, err := figma.GenerateTokensCSS(tokens)
	if err != nil {
		runtime.LogErrorf(a.ctx, "Error creating CSS Tokens: %+v", err)
		return nil, err
	}

	// Parse components
	components := figma.ParseComponents(file, tokens)

	a.components = Components{
		data:   components,
		tokens: tokensCSS,
	}

	return components, nil
}

func (a *App) GetTokens() string {
	return a.components.tokens
}

// Greet returns a greeting for the given name
// func (a *App) Greet(name string) string {
// 	return fmt.Sprintf("Hello %s, It's show time!", name)
// }
