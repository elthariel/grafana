package plugins

import (
	"embed"
	"text/template"
	"time"
)

// All the parsed templates in the tmpl subdirectory
var tmpls *template.Template

func init() {
	base := template.New("codegen").Funcs(template.FuncMap{
		"now": time.Now,
	})
	tmpls = template.Must(base.ParseFS(tmplFS, "tmpl/*.tmpl"))
}

//go:embed tmpl/*.tmpl
var tmplFS embed.FS

// The following group of types, beginning with templateVars_*, all contain the set
// of variables expected by the corresponding named template file under tmpl/
type (
	templateVars_autogen_header struct {
		GeneratorPath  string
		LineagePath    string
		LineageCUEPath string
		GenLicense     bool
	}
	templateVars_plugin_registry struct {
		Header  templateVars_autogen_header
		Plugins []struct {
			PkgName    string
			Path       string
			ImportPath string
			NoAlias    bool
		}
	}
)
