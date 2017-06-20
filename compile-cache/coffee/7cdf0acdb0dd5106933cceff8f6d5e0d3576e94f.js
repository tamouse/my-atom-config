(function() {
  var TextEditor, buildTextEditor;

  TextEditor = null;

  buildTextEditor = function(params) {
    if (atom.workspace.buildTextEditor != null) {
      return atom.workspace.buildTextEditor(params);
    } else {
      if (TextEditor == null) {
        TextEditor = require('atom').TextEditor;
      }
      return new TextEditor(params);
    }
  };

  describe("React grammar", function() {
    var grammar;
    grammar = null;
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.packages.activatePackage("language-javascript");
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage("react");
      });
      afterEach(function() {
        atom.packages.deactivatePackages();
        return atom.packages.unloadPackages();
      });
      return runs(function() {
        return grammar = atom.grammars.grammarForScopeName("source.js.jsx");
      });
    });
    it("parses the grammar", function() {
      expect(grammar).toBeTruthy();
      return expect(grammar.scopeName).toBe("source.js.jsx");
    });
    describe("strings", function() {
      return it("tokenizes single-line strings", function() {
        var delim, delimsByScope, results, scope, tokens;
        delimsByScope = {
          "string.quoted.double.js": '"',
          "string.quoted.single.js": "'"
        };
        results = [];
        for (scope in delimsByScope) {
          delim = delimsByScope[scope];
          tokens = grammar.tokenizeLine(delim + "x" + delim).tokens;
          expect(tokens[0].value).toEqual(delim);
          expect(tokens[0].scopes).toEqual(["source.js.jsx", scope, "punctuation.definition.string.begin.js"]);
          expect(tokens[1].value).toEqual("x");
          expect(tokens[1].scopes).toEqual(["source.js.jsx", scope]);
          expect(tokens[2].value).toEqual(delim);
          results.push(expect(tokens[2].scopes).toEqual(["source.js.jsx", scope, "punctuation.definition.string.end.js"]));
        }
        return results;
      });
    });
    describe("keywords", function() {
      return it("tokenizes with as a keyword", function() {
        var tokens;
        tokens = grammar.tokenizeLine('with').tokens;
        return expect(tokens[0]).toEqual({
          value: 'with',
          scopes: ['source.js.jsx', 'keyword.control.js']
        });
      });
    });
    describe("regular expressions", function() {
      it("tokenizes regular expressions", function() {
        var tokens;
        tokens = grammar.tokenizeLine('/test/').tokens;
        expect(tokens[0]).toEqual({
          value: '/',
          scopes: ['source.js.jsx', 'string.regexp.js', 'punctuation.definition.string.begin.js']
        });
        expect(tokens[1]).toEqual({
          value: 'test',
          scopes: ['source.js.jsx', 'string.regexp.js']
        });
        expect(tokens[2]).toEqual({
          value: '/',
          scopes: ['source.js.jsx', 'string.regexp.js', 'punctuation.definition.string.end.js']
        });
        tokens = grammar.tokenizeLine('foo + /test/').tokens;
        expect(tokens[0]).toEqual({
          value: 'foo ',
          scopes: ['source.js.jsx']
        });
        expect(tokens[1]).toEqual({
          value: '+',
          scopes: ['source.js.jsx', 'keyword.operator.js']
        });
        expect(tokens[2]).toEqual({
          value: ' ',
          scopes: ['source.js.jsx', 'string.regexp.js']
        });
        expect(tokens[3]).toEqual({
          value: '/',
          scopes: ['source.js.jsx', 'string.regexp.js', 'punctuation.definition.string.begin.js']
        });
        expect(tokens[4]).toEqual({
          value: 'test',
          scopes: ['source.js.jsx', 'string.regexp.js']
        });
        return expect(tokens[5]).toEqual({
          value: '/',
          scopes: ['source.js.jsx', 'string.regexp.js', 'punctuation.definition.string.end.js']
        });
      });
      return it("tokenizes regular expressions inside arrays", function() {
        var tokens;
        tokens = grammar.tokenizeLine('[/test/]').tokens;
        expect(tokens[0]).toEqual({
          value: '[',
          scopes: ['source.js.jsx', 'meta.brace.square.js']
        });
        expect(tokens[1]).toEqual({
          value: '/',
          scopes: ['source.js.jsx', 'string.regexp.js', 'punctuation.definition.string.begin.js']
        });
        expect(tokens[2]).toEqual({
          value: 'test',
          scopes: ['source.js.jsx', 'string.regexp.js']
        });
        expect(tokens[3]).toEqual({
          value: '/',
          scopes: ['source.js.jsx', 'string.regexp.js', 'punctuation.definition.string.end.js']
        });
        expect(tokens[4]).toEqual({
          value: ']',
          scopes: ['source.js.jsx', 'meta.brace.square.js']
        });
        tokens = grammar.tokenizeLine('[1, /test/]').tokens;
        expect(tokens[0]).toEqual({
          value: '[',
          scopes: ['source.js.jsx', 'meta.brace.square.js']
        });
        expect(tokens[1]).toEqual({
          value: '1',
          scopes: ['source.js.jsx', 'constant.numeric.decimal.js']
        });
        expect(tokens[2]).toEqual({
          value: ',',
          scopes: ['source.js.jsx', 'meta.delimiter.object.comma.js']
        });
        expect(tokens[3]).toEqual({
          value: ' ',
          scopes: ['source.js.jsx', 'string.regexp.js']
        });
        expect(tokens[4]).toEqual({
          value: '/',
          scopes: ['source.js.jsx', 'string.regexp.js', 'punctuation.definition.string.begin.js']
        });
        expect(tokens[5]).toEqual({
          value: 'test',
          scopes: ['source.js.jsx', 'string.regexp.js']
        });
        expect(tokens[6]).toEqual({
          value: '/',
          scopes: ['source.js.jsx', 'string.regexp.js', 'punctuation.definition.string.end.js']
        });
        expect(tokens[7]).toEqual({
          value: ']',
          scopes: ['source.js.jsx', 'meta.brace.square.js']
        });
        tokens = grammar.tokenizeLine('0x1D306').tokens;
        expect(tokens[0]).toEqual({
          value: '0x1D306',
          scopes: ['source.js.jsx', 'constant.numeric.hex.js']
        });
        tokens = grammar.tokenizeLine('0X1D306').tokens;
        expect(tokens[0]).toEqual({
          value: '0X1D306',
          scopes: ['source.js.jsx', 'constant.numeric.hex.js']
        });
        tokens = grammar.tokenizeLine('0b011101110111010001100110').tokens;
        expect(tokens[0]).toEqual({
          value: '0b011101110111010001100110',
          scopes: ['source.js.jsx', 'constant.numeric.binary.js']
        });
        tokens = grammar.tokenizeLine('0B011101110111010001100110').tokens;
        expect(tokens[0]).toEqual({
          value: '0B011101110111010001100110',
          scopes: ['source.js.jsx', 'constant.numeric.binary.js']
        });
        tokens = grammar.tokenizeLine('0o1411').tokens;
        expect(tokens[0]).toEqual({
          value: '0o1411',
          scopes: ['source.js.jsx', 'constant.numeric.octal.js']
        });
        tokens = grammar.tokenizeLine('0O1411').tokens;
        return expect(tokens[0]).toEqual({
          value: '0O1411',
          scopes: ['source.js.jsx', 'constant.numeric.octal.js']
        });
      });
    });
    describe("operators", function() {
      it("tokenizes void correctly", function() {
        var tokens;
        tokens = grammar.tokenizeLine('void').tokens;
        return expect(tokens[0]).toEqual({
          value: 'void',
          scopes: ['source.js.jsx', 'keyword.operator.void.js']
        });
      });
      return it("tokenizes the / arithmetic operator when separated by newlines", function() {
        var lines;
        lines = grammar.tokenizeLines("1\n/ 2");
        expect(lines[0][0]).toEqual({
          value: '1',
          scopes: ['source.js.jsx', 'constant.numeric.decimal.js']
        });
        expect(lines[1][0]).toEqual({
          value: '/',
          scopes: ['source.js.jsx', 'keyword.operator.js']
        });
        expect(lines[1][1]).toEqual({
          value: ' ',
          scopes: ['source.js.jsx']
        });
        return expect(lines[1][2]).toEqual({
          value: '2',
          scopes: ['source.js.jsx', 'constant.numeric.decimal.js']
        });
      });
    });
    describe("ES6 string templates", function() {
      return it("tokenizes them as strings", function() {
        var tokens;
        tokens = grammar.tokenizeLine('`hey ${name}`').tokens;
        expect(tokens[0]).toEqual({
          value: '`',
          scopes: ['source.js.jsx', 'string.quoted.template.js', 'punctuation.definition.string.begin.js']
        });
        expect(tokens[1]).toEqual({
          value: 'hey ',
          scopes: ['source.js.jsx', 'string.quoted.template.js']
        });
        expect(tokens[2]).toEqual({
          value: '${',
          scopes: ['source.js.jsx', 'string.quoted.template.js', 'source.js.embedded.source', 'punctuation.section.embedded.js']
        });
        expect(tokens[3]).toEqual({
          value: 'name',
          scopes: ['source.js.jsx', 'string.quoted.template.js', 'source.js.embedded.source']
        });
        expect(tokens[4]).toEqual({
          value: '}',
          scopes: ['source.js.jsx', 'string.quoted.template.js', 'source.js.embedded.source', 'punctuation.section.embedded.js']
        });
        return expect(tokens[5]).toEqual({
          value: '`',
          scopes: ['source.js.jsx', 'string.quoted.template.js', 'punctuation.definition.string.end.js']
        });
      });
    });
    describe("default: in a switch statement", function() {
      return it("tokenizes it as a keyword", function() {
        var tokens;
        tokens = grammar.tokenizeLine('default: ').tokens;
        return expect(tokens[0]).toEqual({
          value: 'default',
          scopes: ['source.js.jsx', 'keyword.control.js']
        });
      });
    });
    it("tokenizes comments in function params", function() {
      var tokens;
      tokens = grammar.tokenizeLine('foo: function (/**Bar*/bar){').tokens;
      expect(tokens[5]).toEqual({
        value: '(',
        scopes: ['source.js.jsx', 'meta.function.json.js', 'meta.parameters.js', 'punctuation.definition.parameters.begin.bracket.round.js']
      });
      expect(tokens[6]).toEqual({
        value: '/**',
        scopes: ['source.js.jsx', 'meta.function.json.js', 'meta.parameters.js', 'comment.block.documentation.js', 'punctuation.definition.comment.js']
      });
      expect(tokens[7]).toEqual({
        value: 'Bar',
        scopes: ['source.js.jsx', 'meta.function.json.js', 'meta.parameters.js', 'comment.block.documentation.js']
      });
      expect(tokens[8]).toEqual({
        value: '*/',
        scopes: ['source.js.jsx', 'meta.function.json.js', 'meta.parameters.js', 'comment.block.documentation.js', 'punctuation.definition.comment.js']
      });
      return expect(tokens[9]).toEqual({
        value: 'bar',
        scopes: ['source.js.jsx', 'meta.function.json.js', 'meta.parameters.js', 'variable.parameter.function.js']
      });
    });
    it("tokenizes /* */ comments", function() {
      var tokens;
      tokens = grammar.tokenizeLine('/**/').tokens;
      expect(tokens[0]).toEqual({
        value: '/*',
        scopes: ['source.js.jsx', 'comment.block.js', 'punctuation.definition.comment.js']
      });
      expect(tokens[1]).toEqual({
        value: '*/',
        scopes: ['source.js.jsx', 'comment.block.js', 'punctuation.definition.comment.js']
      });
      tokens = grammar.tokenizeLine('/* foo */').tokens;
      expect(tokens[0]).toEqual({
        value: '/*',
        scopes: ['source.js.jsx', 'comment.block.js', 'punctuation.definition.comment.js']
      });
      expect(tokens[1]).toEqual({
        value: ' foo ',
        scopes: ['source.js.jsx', 'comment.block.js']
      });
      return expect(tokens[2]).toEqual({
        value: '*/',
        scopes: ['source.js.jsx', 'comment.block.js', 'punctuation.definition.comment.js']
      });
    });
    it("tokenizes /** */ comments", function() {
      var tokens;
      tokens = grammar.tokenizeLine('/***/').tokens;
      expect(tokens[0]).toEqual({
        value: '/**',
        scopes: ['source.js.jsx', 'comment.block.documentation.js', 'punctuation.definition.comment.js']
      });
      expect(tokens[1]).toEqual({
        value: '*/',
        scopes: ['source.js.jsx', 'comment.block.documentation.js', 'punctuation.definition.comment.js']
      });
      tokens = grammar.tokenizeLine('/** foo */').tokens;
      expect(tokens[0]).toEqual({
        value: '/**',
        scopes: ['source.js.jsx', 'comment.block.documentation.js', 'punctuation.definition.comment.js']
      });
      expect(tokens[1]).toEqual({
        value: ' foo ',
        scopes: ['source.js.jsx', 'comment.block.documentation.js']
      });
      return expect(tokens[2]).toEqual({
        value: '*/',
        scopes: ['source.js.jsx', 'comment.block.documentation.js', 'punctuation.definition.comment.js']
      });
    });
    it("tokenizes jsx tags", function() {
      var tokens;
      tokens = grammar.tokenizeLine('<tag></tag>').tokens;
      expect(tokens[0]).toEqual({
        value: '<',
        scopes: ["source.js.jsx", "tag.open.js", "punctuation.definition.tag.begin.js"]
      });
      expect(tokens[1]).toEqual({
        value: 'tag',
        scopes: ["source.js.jsx", "tag.open.js", "entity.name.tag.js"]
      });
      expect(tokens[2]).toEqual({
        value: '>',
        scopes: ["source.js.jsx", "tag.open.js", "punctuation.definition.tag.end.js"]
      });
      expect(tokens[3]).toEqual({
        value: '</',
        scopes: ["source.js.jsx", "tag.closed.js", "punctuation.definition.tag.begin.js"]
      });
      expect(tokens[4]).toEqual({
        value: 'tag',
        scopes: ["source.js.jsx", "tag.closed.js", "entity.name.tag.js"]
      });
      return expect(tokens[5]).toEqual({
        value: '>',
        scopes: ["source.js.jsx", "tag.closed.js", "punctuation.definition.tag.end.js"]
      });
    });
    it("tokenizes jsx inside parenthesis", function() {
      var tokens;
      tokens = grammar.tokenizeLine('return (<tag></tag>)').tokens;
      expect(tokens[3]).toEqual({
        value: '<',
        scopes: ["source.js.jsx", "tag.open.js", "punctuation.definition.tag.begin.js"]
      });
      expect(tokens[4]).toEqual({
        value: 'tag',
        scopes: ["source.js.jsx", "tag.open.js", "entity.name.tag.js"]
      });
      expect(tokens[5]).toEqual({
        value: '>',
        scopes: ["source.js.jsx", "tag.open.js", "punctuation.definition.tag.end.js"]
      });
      expect(tokens[6]).toEqual({
        value: '</',
        scopes: ["source.js.jsx", "tag.closed.js", "punctuation.definition.tag.begin.js"]
      });
      expect(tokens[7]).toEqual({
        value: 'tag',
        scopes: ["source.js.jsx", "tag.closed.js", "entity.name.tag.js"]
      });
      return expect(tokens[8]).toEqual({
        value: '>',
        scopes: ["source.js.jsx", "tag.closed.js", "punctuation.definition.tag.end.js"]
      });
    });
    it("tokenizes jsx inside function body", function() {
      var tokens;
      tokens = grammar.tokenizeLine('function () { return (<tag></tag>) }').tokens;
      expect(tokens[10]).toEqual({
        value: '<',
        scopes: ["source.js.jsx", "tag.open.js", "punctuation.definition.tag.begin.js"]
      });
      expect(tokens[11]).toEqual({
        value: 'tag',
        scopes: ["source.js.jsx", "tag.open.js", "entity.name.tag.js"]
      });
      expect(tokens[12]).toEqual({
        value: '>',
        scopes: ["source.js.jsx", "tag.open.js", "punctuation.definition.tag.end.js"]
      });
      expect(tokens[13]).toEqual({
        value: '</',
        scopes: ["source.js.jsx", "tag.closed.js", "punctuation.definition.tag.begin.js"]
      });
      expect(tokens[14]).toEqual({
        value: 'tag',
        scopes: ["source.js.jsx", "tag.closed.js", "entity.name.tag.js"]
      });
      return expect(tokens[15]).toEqual({
        value: '>',
        scopes: ["source.js.jsx", "tag.closed.js", "punctuation.definition.tag.end.js"]
      });
    });
    it("tokenizes jsx inside function body in an object", function() {
      var tokens;
      tokens = grammar.tokenizeLine('{foo:function () { return (<tag></tag>) }}').tokens;
      expect(tokens[13]).toEqual({
        value: '<',
        scopes: ["source.js.jsx", "tag.open.js", "punctuation.definition.tag.begin.js"]
      });
      expect(tokens[14]).toEqual({
        value: 'tag',
        scopes: ["source.js.jsx", "tag.open.js", "entity.name.tag.js"]
      });
      expect(tokens[15]).toEqual({
        value: '>',
        scopes: ["source.js.jsx", "tag.open.js", "punctuation.definition.tag.end.js"]
      });
      expect(tokens[16]).toEqual({
        value: '</',
        scopes: ["source.js.jsx", "tag.closed.js", "punctuation.definition.tag.begin.js"]
      });
      expect(tokens[17]).toEqual({
        value: 'tag',
        scopes: ["source.js.jsx", "tag.closed.js", "entity.name.tag.js"]
      });
      return expect(tokens[18]).toEqual({
        value: '>',
        scopes: ["source.js.jsx", "tag.closed.js", "punctuation.definition.tag.end.js"]
      });
    });
    it("tokenizes jsx inside function call", function() {
      var tokens;
      tokens = grammar.tokenizeLine('foo(<tag></tag>)').tokens;
      expect(tokens[2]).toEqual({
        value: '<',
        scopes: ["source.js.jsx", "meta.function-call.js", "tag.open.js", "punctuation.definition.tag.begin.js"]
      });
      expect(tokens[3]).toEqual({
        value: 'tag',
        scopes: ["source.js.jsx", "meta.function-call.js", "tag.open.js", "entity.name.tag.js"]
      });
      expect(tokens[4]).toEqual({
        value: '>',
        scopes: ["source.js.jsx", "meta.function-call.js", "tag.open.js", "punctuation.definition.tag.end.js"]
      });
      expect(tokens[5]).toEqual({
        value: '</',
        scopes: ["source.js.jsx", "meta.function-call.js", "tag.closed.js", "punctuation.definition.tag.begin.js"]
      });
      expect(tokens[6]).toEqual({
        value: 'tag',
        scopes: ["source.js.jsx", "meta.function-call.js", "tag.closed.js", "entity.name.tag.js"]
      });
      return expect(tokens[7]).toEqual({
        value: '>',
        scopes: ["source.js.jsx", "meta.function-call.js", "tag.closed.js", "punctuation.definition.tag.end.js"]
      });
    });
    it("tokenizes jsx inside method call", function() {
      var tokens;
      tokens = grammar.tokenizeLine('bar.foo(<tag></tag>)').tokens;
      expect(tokens[4]).toEqual({
        value: '<',
        scopes: ["source.js.jsx", "meta.method-call.js", "tag.open.js", "punctuation.definition.tag.begin.js"]
      });
      expect(tokens[5]).toEqual({
        value: 'tag',
        scopes: ["source.js.jsx", "meta.method-call.js", "tag.open.js", "entity.name.tag.js"]
      });
      expect(tokens[6]).toEqual({
        value: '>',
        scopes: ["source.js.jsx", "meta.method-call.js", "tag.open.js", "punctuation.definition.tag.end.js"]
      });
      expect(tokens[7]).toEqual({
        value: '</',
        scopes: ["source.js.jsx", "meta.method-call.js", "tag.closed.js", "punctuation.definition.tag.begin.js"]
      });
      expect(tokens[8]).toEqual({
        value: 'tag',
        scopes: ["source.js.jsx", "meta.method-call.js", "tag.closed.js", "entity.name.tag.js"]
      });
      return expect(tokens[9]).toEqual({
        value: '>',
        scopes: ["source.js.jsx", "meta.method-call.js", "tag.closed.js", "punctuation.definition.tag.end.js"]
      });
    });
    it("tokenizes ' as string inside jsx", function() {
      var tokens;
      tokens = grammar.tokenizeLine('<tag>fo\'o</tag>').tokens;
      expect(tokens[0]).toEqual({
        value: '<',
        scopes: ["source.js.jsx", "tag.open.js", "punctuation.definition.tag.begin.js"]
      });
      expect(tokens[1]).toEqual({
        value: 'tag',
        scopes: ["source.js.jsx", "tag.open.js", "entity.name.tag.js"]
      });
      expect(tokens[2]).toEqual({
        value: '>',
        scopes: ["source.js.jsx", "tag.open.js", "punctuation.definition.tag.end.js"]
      });
      expect(tokens[3]).toEqual({
        value: 'fo\'o',
        scopes: ["source.js.jsx", "meta.other.pcdata.js"]
      });
      expect(tokens[4]).toEqual({
        value: '</',
        scopes: ["source.js.jsx", "tag.closed.js", "punctuation.definition.tag.begin.js"]
      });
      expect(tokens[5]).toEqual({
        value: 'tag',
        scopes: ["source.js.jsx", "tag.closed.js", "entity.name.tag.js"]
      });
      return expect(tokens[6]).toEqual({
        value: '>',
        scopes: ["source.js.jsx", "tag.closed.js", "punctuation.definition.tag.end.js"]
      });
    });
    it("tokenizes ternary operator inside jsx code section", function() {
      var tokens;
      tokens = grammar.tokenizeLine('{x?<tag></tag>:null}').tokens;
      expect(tokens[0]).toEqual({
        value: '{',
        scopes: ["source.js.jsx", "meta.brace.curly.js"]
      });
      expect(tokens[1]).toEqual({
        value: 'x',
        scopes: ["source.js.jsx"]
      });
      expect(tokens[2]).toEqual({
        value: '?',
        scopes: ["source.js.jsx", "keyword.operator.ternary.js"]
      });
      expect(tokens[3]).toEqual({
        value: '<',
        scopes: ["source.js.jsx", "tag.open.js", "punctuation.definition.tag.begin.js"]
      });
      expect(tokens[4]).toEqual({
        value: 'tag',
        scopes: ["source.js.jsx", "tag.open.js", "entity.name.tag.js"]
      });
      expect(tokens[5]).toEqual({
        value: '>',
        scopes: ["source.js.jsx", "tag.open.js", "punctuation.definition.tag.end.js"]
      });
      expect(tokens[6]).toEqual({
        value: '</',
        scopes: ["source.js.jsx", "tag.closed.js", "punctuation.definition.tag.begin.js"]
      });
      expect(tokens[7]).toEqual({
        value: 'tag',
        scopes: ["source.js.jsx", "tag.closed.js", "entity.name.tag.js"]
      });
      expect(tokens[8]).toEqual({
        value: '>',
        scopes: ["source.js.jsx", "tag.closed.js", "punctuation.definition.tag.end.js"]
      });
      expect(tokens[9]).toEqual({
        value: ':',
        scopes: ["source.js.jsx", "keyword.operator.ternary.js"]
      });
      expect(tokens[10]).toEqual({
        value: 'null',
        scopes: ["source.js.jsx", "constant.language.null.js"]
      });
      return expect(tokens[11]).toEqual({
        value: '}',
        scopes: ["source.js.jsx", "meta.brace.curly.js"]
      });
    });
    return describe("indentation", function() {
      var editor, expectPreservedIndentation;
      editor = null;
      beforeEach(function() {
        editor = buildTextEditor();
        return editor.setGrammar(grammar);
      });
      expectPreservedIndentation = function(text) {
        editor.setText(text);
        editor.autoIndentBufferRows(0, text.split("\n").length - 1);
        return expect(editor.getText()).toBe(text);
      };
      it("indents allman-style curly braces", function() {
        return expectPreservedIndentation("if (true)\n{\n  for (;;)\n  {\n    while (true)\n    {\n      x();\n    }\n  }\n}\n\nelse\n{\n  do\n  {\n    y();\n  } while (true);\n}");
      });
      return it("indents non-allman-style curly braces", function() {
        return expectPreservedIndentation("if (true) {\n  for (;;) {\n    while (true) {\n      x();\n    }\n  }\n} else {\n  do {\n    y();\n  } while (true);\n}");
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3RhbWFyYS50ZW1wbGUvLmF0b20vcGFja2FnZXMvcmVhY3Qvc3BlYy9yZWFjdC1ncmFtbWFyLXNwZWMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxVQUFBLEdBQWE7O0VBQ2IsZUFBQSxHQUFrQixTQUFDLE1BQUQ7SUFDaEIsSUFBRyxzQ0FBSDthQUNFLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZixDQUErQixNQUEvQixFQURGO0tBQUEsTUFBQTs7UUFHRSxhQUFjLE9BQUEsQ0FBUSxNQUFSLENBQWUsQ0FBQzs7YUFDMUIsSUFBQSxVQUFBLENBQVcsTUFBWCxFQUpOOztFQURnQjs7RUFPbEIsUUFBQSxDQUFTLGVBQVQsRUFBMEIsU0FBQTtBQUN4QixRQUFBO0lBQUEsT0FBQSxHQUFVO0lBRVYsVUFBQSxDQUFXLFNBQUE7TUFDVCxlQUFBLENBQWdCLFNBQUE7ZUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIscUJBQTlCO01BRGMsQ0FBaEI7TUFHQSxlQUFBLENBQWdCLFNBQUE7ZUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsT0FBOUI7TUFEYyxDQUFoQjtNQUdBLFNBQUEsQ0FBVSxTQUFBO1FBQ1IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBZCxDQUFBO2VBQ0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFkLENBQUE7TUFGUSxDQUFWO2FBSUEsSUFBQSxDQUFLLFNBQUE7ZUFDSCxPQUFBLEdBQVUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxtQkFBZCxDQUFrQyxlQUFsQztNQURQLENBQUw7SUFYUyxDQUFYO0lBY0EsRUFBQSxDQUFHLG9CQUFILEVBQXlCLFNBQUE7TUFDdkIsTUFBQSxDQUFPLE9BQVAsQ0FBZSxDQUFDLFVBQWhCLENBQUE7YUFDQSxNQUFBLENBQU8sT0FBTyxDQUFDLFNBQWYsQ0FBeUIsQ0FBQyxJQUExQixD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QXdDLFNBQUE7ZUFDdEMsMEJBQUEsQ0FBMkIseUlBQTNCO01BRHNDLENBQXhDO2FBc0JBLEVBQUEsQ0FBRyx1Q0FBSCxFQUE0QyxTQUFBO2VBQzFDLDBCQUFBLENBQTJCLHlIQUEzQjtNQUQwQyxDQUE1QztJQWxDc0IsQ0FBeEI7RUExUHdCLENBQTFCO0FBUkEiLCJzb3VyY2VzQ29udGVudCI6WyJUZXh0RWRpdG9yID0gbnVsbFxuYnVpbGRUZXh0RWRpdG9yID0gKHBhcmFtcykgLT5cbiAgaWYgYXRvbS53b3Jrc3BhY2UuYnVpbGRUZXh0RWRpdG9yP1xuICAgIGF0b20ud29ya3NwYWNlLmJ1aWxkVGV4dEVkaXRvcihwYXJhbXMpXG4gIGVsc2VcbiAgICBUZXh0RWRpdG9yID89IHJlcXVpcmUoJ2F0b20nKS5UZXh0RWRpdG9yXG4gICAgbmV3IFRleHRFZGl0b3IocGFyYW1zKVxuXG5kZXNjcmliZSBcIlJlYWN0IGdyYW1tYXJcIiwgLT5cbiAgZ3JhbW1hciA9IG51bGxcblxuICBiZWZvcmVFYWNoIC0+XG4gICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZShcImxhbmd1YWdlLWphdmFzY3JpcHRcIilcblxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoXCJyZWFjdFwiKVxuXG4gICAgYWZ0ZXJFYWNoIC0+XG4gICAgICBhdG9tLnBhY2thZ2VzLmRlYWN0aXZhdGVQYWNrYWdlcygpXG4gICAgICBhdG9tLnBhY2thZ2VzLnVubG9hZFBhY2thZ2VzKClcblxuICAgIHJ1bnMgLT5cbiAgICAgIGdyYW1tYXIgPSBhdG9tLmdyYW1tYXJzLmdyYW1tYXJGb3JTY29wZU5hbWUoXCJzb3VyY2UuanMuanN4XCIpXG5cbiAgaXQgXCJwYXJzZXMgdGhlIGdyYW1tYXJcIiwgLT5cbiAgICBleHBlY3QoZ3JhbW1hcikudG9CZVRydXRoeSgpXG4gICAgZXhwZWN0KGdyYW1tYXIuc2NvcGVOYW1lKS50b0JlIFwic291cmNlLmpzLmpzeFwiXG5cbiAgZGVzY3JpYmUgXCJzdHJpbmdzXCIsIC0+XG4gICAgaXQgXCJ0b2tlbml6ZXMgc2luZ2xlLWxpbmUgc3RyaW5nc1wiLCAtPlxuICAgICAgZGVsaW1zQnlTY29wZSA9XG4gICAgICAgIFwic3RyaW5nLnF1b3RlZC5kb3VibGUuanNcIjogJ1wiJ1xuICAgICAgICBcInN0cmluZy5xdW90ZWQuc2luZ2xlLmpzXCI6IFwiJ1wiXG5cbiAgICAgIGZvciBzY29wZSwgZGVsaW0gb2YgZGVsaW1zQnlTY29wZVxuICAgICAgICB7dG9rZW5zfSA9IGdyYW1tYXIudG9rZW5pemVMaW5lKGRlbGltICsgXCJ4XCIgKyBkZWxpbSlcbiAgICAgICAgZXhwZWN0KHRva2Vuc1swXS52YWx1ZSkudG9FcXVhbCBkZWxpbVxuICAgICAgICBleHBlY3QodG9rZW5zWzBdLnNjb3BlcykudG9FcXVhbCBbXCJzb3VyY2UuanMuanN4XCIsIHNjb3BlLCBcInB1bmN0dWF0aW9uLmRlZmluaXRpb24uc3RyaW5nLmJlZ2luLmpzXCJdXG4gICAgICAgIGV4cGVjdCh0b2tlbnNbMV0udmFsdWUpLnRvRXF1YWwgXCJ4XCJcbiAgICAgICAgZXhwZWN0KHRva2Vuc1sxXS5zY29wZXMpLnRvRXF1YWwgW1wic291cmNlLmpzLmpzeFwiLCBzY29wZV1cbiAgICAgICAgZXhwZWN0KHRva2Vuc1syXS52YWx1ZSkudG9FcXVhbCBkZWxpbVxuICAgICAgICBleHBlY3QodG9rZW5zWzJdLnNjb3BlcykudG9FcXVhbCBbXCJzb3VyY2UuanMuanN4XCIsIHNjb3BlLCBcInB1bmN0dWF0aW9uLmRlZmluaXRpb24uc3RyaW5nLmVuZC5qc1wiXVxuXG4gIGRlc2NyaWJlIFwia2V5d29yZHNcIiwgLT5cbiAgICBpdCBcInRva2VuaXplcyB3aXRoIGFzIGEga2V5d29yZFwiLCAtPlxuICAgICAge3Rva2Vuc30gPSBncmFtbWFyLnRva2VuaXplTGluZSgnd2l0aCcpXG4gICAgICBleHBlY3QodG9rZW5zWzBdKS50b0VxdWFsIHZhbHVlOiAnd2l0aCcsIHNjb3BlczogWydzb3VyY2UuanMuanN4JywgJ2tleXdvcmQuY29udHJvbC5qcyddXG5cbiAgZGVzY3JpYmUgXCJyZWd1bGFyIGV4cHJlc3Npb25zXCIsIC0+XG4gICAgaXQgXCJ0b2tlbml6ZXMgcmVndWxhciBleHByZXNzaW9uc1wiLCAtPlxuICAgICAge3Rva2Vuc30gPSBncmFtbWFyLnRva2VuaXplTGluZSgnL3Rlc3QvJylcbiAgICAgIGV4cGVjdCh0b2tlbnNbMF0pLnRvRXF1YWwgdmFsdWU6ICcvJywgc2NvcGVzOiBbJ3NvdXJjZS5qcy5qc3gnLCAnc3RyaW5nLnJlZ2V4cC5qcycsICdwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnN0cmluZy5iZWdpbi5qcyddXG4gICAgICBleHBlY3QodG9rZW5zWzFdKS50b0VxdWFsIHZhbHVlOiAndGVzdCcsIHNjb3BlczogWydzb3VyY2UuanMuanN4JywgJ3N0cmluZy5yZWdleHAuanMnXVxuICAgICAgZXhwZWN0KHRva2Vuc1syXSkudG9FcXVhbCB2YWx1ZTogJy8nLCBzY29wZXM6IFsnc291cmNlLmpzLmpzeCcsICdzdHJpbmcucmVnZXhwLmpzJywgJ3B1bmN0dWF0aW9uLmRlZmluaXRpb24uc3RyaW5nLmVuZC5qcyddXG5cbiAgICAgIHt0b2tlbnN9ID0gZ3JhbW1hci50b2tlbml6ZUxpbmUoJ2ZvbyArIC90ZXN0LycpXG4gICAgICBleHBlY3QodG9rZW5zWzBdKS50b0VxdWFsIHZhbHVlOiAnZm9vICcsIHNjb3BlczogWydzb3VyY2UuanMuanN4J11cbiAgICAgIGV4cGVjdCh0b2tlbnNbMV0pLnRvRXF1YWwgdmFsdWU6ICcrJywgc2NvcGVzOiBbJ3NvdXJjZS5qcy5qc3gnLCAna2V5d29yZC5vcGVyYXRvci5qcyddXG4gICAgICBleHBlY3QodG9rZW5zWzJdKS50b0VxdWFsIHZhbHVlOiAnICcsIHNjb3BlczogWydzb3VyY2UuanMuanN4JywgJ3N0cmluZy5yZWdleHAuanMnXVxuICAgICAgZXhwZWN0KHRva2Vuc1szXSkudG9FcXVhbCB2YWx1ZTogJy8nLCBzY29wZXM6IFsnc291cmNlLmpzLmpzeCcsICdzdHJpbmcucmVnZXhwLmpzJywgJ3B1bmN0dWF0aW9uLmRlZmluaXRpb24uc3RyaW5nLmJlZ2luLmpzJ11cbiAgICAgIGV4cGVjdCh0b2tlbnNbNF0pLnRvRXF1YWwgdmFsdWU6ICd0ZXN0Jywgc2NvcGVzOiBbJ3NvdXJjZS5qcy5qc3gnLCAnc3RyaW5nLnJlZ2V4cC5qcyddXG4gICAgICBleHBlY3QodG9rZW5zWzVdKS50b0VxdWFsIHZhbHVlOiAnLycsIHNjb3BlczogWydzb3VyY2UuanMuanN4JywgJ3N0cmluZy5yZWdleHAuanMnLCAncHVuY3R1YXRpb24uZGVmaW5pdGlvbi5zdHJpbmcuZW5kLmpzJ11cblxuICAgIGl0IFwidG9rZW5pemVzIHJlZ3VsYXIgZXhwcmVzc2lvbnMgaW5zaWRlIGFycmF5c1wiLCAtPlxuICAgICAge3Rva2Vuc30gPSBncmFtbWFyLnRva2VuaXplTGluZSgnWy90ZXN0L10nKVxuICAgICAgZXhwZWN0KHRva2Vuc1swXSkudG9FcXVhbCB2YWx1ZTogJ1snLCBzY29wZXM6IFsnc291cmNlLmpzLmpzeCcsICdtZXRhLmJyYWNlLnNxdWFyZS5qcyddXG4gICAgICBleHBlY3QodG9rZW5zWzFdKS50b0VxdWFsIHZhbHVlOiAnLycsIHNjb3BlczogWydzb3VyY2UuanMuanN4JywgJ3N0cmluZy5yZWdleHAuanMnLCAncHVuY3R1YXRpb24uZGVmaW5pdGlvbi5zdHJpbmcuYmVnaW4uanMnXVxuICAgICAgZXhwZWN0KHRva2Vuc1syXSkudG9FcXVhbCB2YWx1ZTogJ3Rlc3QnLCBzY29wZXM6IFsnc291cmNlLmpzLmpzeCcsICdzdHJpbmcucmVnZXhwLmpzJ11cbiAgICAgIGV4cGVjdCh0b2tlbnNbM10pLnRvRXF1YWwgdmFsdWU6ICcvJywgc2NvcGVzOiBbJ3NvdXJjZS5qcy5qc3gnLCAnc3RyaW5nLnJlZ2V4cC5qcycsICdwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnN0cmluZy5lbmQuanMnXVxuICAgICAgZXhwZWN0KHRva2Vuc1s0XSkudG9FcXVhbCB2YWx1ZTogJ10nLCBzY29wZXM6IFsnc291cmNlLmpzLmpzeCcsICdtZXRhLmJyYWNlLnNxdWFyZS5qcyddXG5cbiAgICAgIHt0b2tlbnN9ID0gZ3JhbW1hci50b2tlbml6ZUxpbmUoJ1sxLCAvdGVzdC9dJylcbiAgICAgIGV4cGVjdCh0b2tlbnNbMF0pLnRvRXF1YWwgdmFsdWU6ICdbJywgc2NvcGVzOiBbJ3NvdXJjZS5qcy5qc3gnLCAnbWV0YS5icmFjZS5zcXVhcmUuanMnXVxuICAgICAgZXhwZWN0KHRva2Vuc1sxXSkudG9FcXVhbCB2YWx1ZTogJzEnLCBzY29wZXM6IFsnc291cmNlLmpzLmpzeCcsICdjb25zdGFudC5udW1lcmljLmRlY2ltYWwuanMnXVxuICAgICAgZXhwZWN0KHRva2Vuc1syXSkudG9FcXVhbCB2YWx1ZTogJywnLCBzY29wZXM6IFsnc291cmNlLmpzLmpzeCcsICdtZXRhLmRlbGltaXRlci5vYmplY3QuY29tbWEuanMnXVxuICAgICAgZXhwZWN0KHRva2Vuc1szXSkudG9FcXVhbCB2YWx1ZTogJyAnLCBzY29wZXM6IFsnc291cmNlLmpzLmpzeCcsICdzdHJpbmcucmVnZXhwLmpzJ11cbiAgICAgIGV4cGVjdCh0b2tlbnNbNF0pLnRvRXF1YWwgdmFsdWU6ICcvJywgc2NvcGVzOiBbJ3NvdXJjZS5qcy5qc3gnLCAnc3RyaW5nLnJlZ2V4cC5qcycsICdwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnN0cmluZy5iZWdpbi5qcyddXG4gICAgICBleHBlY3QodG9rZW5zWzVdKS50b0VxdWFsIHZhbHVlOiAndGVzdCcsIHNjb3BlczogWydzb3VyY2UuanMuanN4JywgJ3N0cmluZy5yZWdleHAuanMnXVxuICAgICAgZXhwZWN0KHRva2Vuc1s2XSkudG9FcXVhbCB2YWx1ZTogJy8nLCBzY29wZXM6IFsnc291cmNlLmpzLmpzeCcsICdzdHJpbmcucmVnZXhwLmpzJywgJ3B1bmN0dWF0aW9uLmRlZmluaXRpb24uc3RyaW5nLmVuZC5qcyddXG4gICAgICBleHBlY3QodG9rZW5zWzddKS50b0VxdWFsIHZhbHVlOiAnXScsIHNjb3BlczogWydzb3VyY2UuanMuanN4JywgJ21ldGEuYnJhY2Uuc3F1YXJlLmpzJ11cblxuICAgICAge3Rva2Vuc30gPSBncmFtbWFyLnRva2VuaXplTGluZSgnMHgxRDMwNicpXG4gICAgICBleHBlY3QodG9rZW5zWzBdKS50b0VxdWFsIHZhbHVlOiAnMHgxRDMwNicsIHNjb3BlczogWydzb3VyY2UuanMuanN4JywgJ2NvbnN0YW50Lm51bWVyaWMuaGV4LmpzJ11cblxuICAgICAge3Rva2Vuc30gPSBncmFtbWFyLnRva2VuaXplTGluZSgnMFgxRDMwNicpXG4gICAgICBleHBlY3QodG9rZW5zWzBdKS50b0VxdWFsIHZhbHVlOiAnMFgxRDMwNicsIHNjb3BlczogWydzb3VyY2UuanMuanN4JywgJ2NvbnN0YW50Lm51bWVyaWMuaGV4LmpzJ11cblxuICAgICAge3Rva2Vuc30gPSBncmFtbWFyLnRva2VuaXplTGluZSgnMGIwMTExMDExMTAxMTEwMTAwMDExMDAxMTAnKVxuICAgICAgZXhwZWN0KHRva2Vuc1swXSkudG9FcXVhbCB2YWx1ZTogJzBiMDExMTAxMTEwMTExMDEwMDAxMTAwMTEwJywgc2NvcGVzOiBbJ3NvdXJjZS5qcy5qc3gnLCAnY29uc3RhbnQubnVtZXJpYy5iaW5hcnkuanMnXVxuXG4gICAgICB7dG9rZW5zfSA9IGdyYW1tYXIudG9rZW5pemVMaW5lKCcwQjAxMTEwMTExMDExMTAxMDAwMTEwMDExMCcpXG4gICAgICBleHBlY3QodG9rZW5zWzBdKS50b0VxdWFsIHZhbHVlOiAnMEIwMTExMDExMTAxMTEwMTAwMDExMDAxMTAnLCBzY29wZXM6IFsnc291cmNlLmpzLmpzeCcsICdjb25zdGFudC5udW1lcmljLmJpbmFyeS5qcyddXG5cbiAgICAgIHt0b2tlbnN9ID0gZ3JhbW1hci50b2tlbml6ZUxpbmUoJzBvMTQxMScpXG4gICAgICBleHBlY3QodG9rZW5zWzBdKS50b0VxdWFsIHZhbHVlOiAnMG8xNDExJywgc2NvcGVzOiBbJ3NvdXJjZS5qcy5qc3gnLCAnY29uc3RhbnQubnVtZXJpYy5vY3RhbC5qcyddXG5cbiAgICAgIHt0b2tlbnN9ID0gZ3JhbW1hci50b2tlbml6ZUxpbmUoJzBPMTQxMScpXG4gICAgICBleHBlY3QodG9rZW5zWzBdKS50b0VxdWFsIHZhbHVlOiAnME8xNDExJywgc2NvcGVzOiBbJ3NvdXJjZS5qcy5qc3gnLCAnY29uc3RhbnQubnVtZXJpYy5vY3RhbC5qcyddXG5cbiAgZGVzY3JpYmUgXCJvcGVyYXRvcnNcIiwgLT5cbiAgICBpdCBcInRva2VuaXplcyB2b2lkIGNvcnJlY3RseVwiLCAtPlxuICAgICAge3Rva2Vuc30gPSBncmFtbWFyLnRva2VuaXplTGluZSgndm9pZCcpXG4gICAgICBleHBlY3QodG9rZW5zWzBdKS50b0VxdWFsIHZhbHVlOiAndm9pZCcsIHNjb3BlczogWydzb3VyY2UuanMuanN4JywgJ2tleXdvcmQub3BlcmF0b3Iudm9pZC5qcyddXG5cbiAgICBpdCBcInRva2VuaXplcyB0aGUgLyBhcml0aG1ldGljIG9wZXJhdG9yIHdoZW4gc2VwYXJhdGVkIGJ5IG5ld2xpbmVzXCIsIC0+XG4gICAgICBsaW5lcyA9IGdyYW1tYXIudG9rZW5pemVMaW5lcyBcIlwiXCJcbiAgICAgICAgMVxuICAgICAgICAvIDJcbiAgICAgIFwiXCJcIlxuICAgICAgZXhwZWN0KGxpbmVzWzBdWzBdKS50b0VxdWFsIHZhbHVlOiAnMScsIHNjb3BlczogWydzb3VyY2UuanMuanN4JywgJ2NvbnN0YW50Lm51bWVyaWMuZGVjaW1hbC5qcyddXG4gICAgICBleHBlY3QobGluZXNbMV1bMF0pLnRvRXF1YWwgdmFsdWU6ICcvJywgc2NvcGVzOiBbJ3NvdXJjZS5qcy5qc3gnLCAna2V5d29yZC5vcGVyYXRvci5qcyddXG4gICAgICBleHBlY3QobGluZXNbMV1bMV0pLnRvRXF1YWwgdmFsdWU6ICcgJywgc2NvcGVzOiBbJ3NvdXJjZS5qcy5qc3gnXVxuICAgICAgZXhwZWN0KGxpbmVzWzFdWzJdKS50b0VxdWFsIHZhbHVlOiAnMicsIHNjb3BlczogWydzb3VyY2UuanMuanN4JywgJ2NvbnN0YW50Lm51bWVyaWMuZGVjaW1hbC5qcyddXG5cbiAgZGVzY3JpYmUgXCJFUzYgc3RyaW5nIHRlbXBsYXRlc1wiLCAtPlxuICAgIGl0IFwidG9rZW5pemVzIHRoZW0gYXMgc3RyaW5nc1wiLCAtPlxuICAgICAge3Rva2Vuc30gPSBncmFtbWFyLnRva2VuaXplTGluZSgnYGhleSAke25hbWV9YCcpXG4gICAgICBleHBlY3QodG9rZW5zWzBdKS50b0VxdWFsIHZhbHVlOiAnYCcsIHNjb3BlczogWydzb3VyY2UuanMuanN4JywgJ3N0cmluZy5xdW90ZWQudGVtcGxhdGUuanMnLCAncHVuY3R1YXRpb24uZGVmaW5pdGlvbi5zdHJpbmcuYmVnaW4uanMnXVxuICAgICAgZXhwZWN0KHRva2Vuc1sxXSkudG9FcXVhbCB2YWx1ZTogJ2hleSAnLCBzY29wZXM6IFsnc291cmNlLmpzLmpzeCcsICdzdHJpbmcucXVvdGVkLnRlbXBsYXRlLmpzJ11cbiAgICAgIGV4cGVjdCh0b2tlbnNbMl0pLnRvRXF1YWwgdmFsdWU6ICckeycsIHNjb3BlczogWydzb3VyY2UuanMuanN4JywgJ3N0cmluZy5xdW90ZWQudGVtcGxhdGUuanMnLCAnc291cmNlLmpzLmVtYmVkZGVkLnNvdXJjZScsICdwdW5jdHVhdGlvbi5zZWN0aW9uLmVtYmVkZGVkLmpzJ11cbiAgICAgIGV4cGVjdCh0b2tlbnNbM10pLnRvRXF1YWwgdmFsdWU6ICduYW1lJywgc2NvcGVzOiBbJ3NvdXJjZS5qcy5qc3gnLCAnc3RyaW5nLnF1b3RlZC50ZW1wbGF0ZS5qcycsICdzb3VyY2UuanMuZW1iZWRkZWQuc291cmNlJ11cbiAgICAgIGV4cGVjdCh0b2tlbnNbNF0pLnRvRXF1YWwgdmFsdWU6ICd9Jywgc2NvcGVzOiBbJ3NvdXJjZS5qcy5qc3gnLCAnc3RyaW5nLnF1b3RlZC50ZW1wbGF0ZS5qcycsICdzb3VyY2UuanMuZW1iZWRkZWQuc291cmNlJywgJ3B1bmN0dWF0aW9uLnNlY3Rpb24uZW1iZWRkZWQuanMnXVxuICAgICAgZXhwZWN0KHRva2Vuc1s1XSkudG9FcXVhbCB2YWx1ZTogJ2AnLCBzY29wZXM6IFsnc291cmNlLmpzLmpzeCcsICdzdHJpbmcucXVvdGVkLnRlbXBsYXRlLmpzJywgJ3B1bmN0dWF0aW9uLmRlZmluaXRpb24uc3RyaW5nLmVuZC5qcyddXG5cbiAgZGVzY3JpYmUgXCJkZWZhdWx0OiBpbiBhIHN3aXRjaCBzdGF0ZW1lbnRcIiwgLT5cbiAgICBpdCBcInRva2VuaXplcyBpdCBhcyBhIGtleXdvcmRcIiwgLT5cbiAgICAgIHt0b2tlbnN9ID0gZ3JhbW1hci50b2tlbml6ZUxpbmUoJ2RlZmF1bHQ6ICcpXG4gICAgICBleHBlY3QodG9rZW5zWzBdKS50b0VxdWFsIHZhbHVlOiAnZGVmYXVsdCcsIHNjb3BlczogWydzb3VyY2UuanMuanN4JywgJ2tleXdvcmQuY29udHJvbC5qcyddXG5cbiAgaXQgXCJ0b2tlbml6ZXMgY29tbWVudHMgaW4gZnVuY3Rpb24gcGFyYW1zXCIsIC0+XG4gICAge3Rva2Vuc30gPSBncmFtbWFyLnRva2VuaXplTGluZSgnZm9vOiBmdW5jdGlvbiAoLyoqQmFyKi9iYXIpeycpXG5cbiAgICBleHBlY3QodG9rZW5zWzVdKS50b0VxdWFsIHZhbHVlOiAnKCcsIHNjb3BlczogWydzb3VyY2UuanMuanN4JywgJ21ldGEuZnVuY3Rpb24uanNvbi5qcycsICdtZXRhLnBhcmFtZXRlcnMuanMnLCAncHVuY3R1YXRpb24uZGVmaW5pdGlvbi5wYXJhbWV0ZXJzLmJlZ2luLmJyYWNrZXQucm91bmQuanMnXVxuICAgIGV4cGVjdCh0b2tlbnNbNl0pLnRvRXF1YWwgdmFsdWU6ICcvKionLCBzY29wZXM6IFsnc291cmNlLmpzLmpzeCcsICdtZXRhLmZ1bmN0aW9uLmpzb24uanMnLCAnbWV0YS5wYXJhbWV0ZXJzLmpzJywgJ2NvbW1lbnQuYmxvY2suZG9jdW1lbnRhdGlvbi5qcycsICdwdW5jdHVhdGlvbi5kZWZpbml0aW9uLmNvbW1lbnQuanMnXVxuICAgIGV4cGVjdCh0b2tlbnNbN10pLnRvRXF1YWwgdmFsdWU6ICdCYXInLCBzY29wZXM6IFsnc291cmNlLmpzLmpzeCcsICdtZXRhLmZ1bmN0aW9uLmpzb24uanMnLCAnbWV0YS5wYXJhbWV0ZXJzLmpzJywgJ2NvbW1lbnQuYmxvY2suZG9jdW1lbnRhdGlvbi5qcyddXG4gICAgZXhwZWN0KHRva2Vuc1s4XSkudG9FcXVhbCB2YWx1ZTogJyovJywgc2NvcGVzOiBbJ3NvdXJjZS5qcy5qc3gnLCAnbWV0YS5mdW5jdGlvbi5qc29uLmpzJywgJ21ldGEucGFyYW1ldGVycy5qcycsICdjb21tZW50LmJsb2NrLmRvY3VtZW50YXRpb24uanMnLCAncHVuY3R1YXRpb24uZGVmaW5pdGlvbi5jb21tZW50LmpzJ11cbiAgICBleHBlY3QodG9rZW5zWzldKS50b0VxdWFsIHZhbHVlOiAnYmFyJywgc2NvcGVzOiBbJ3NvdXJjZS5qcy5qc3gnLCAnbWV0YS5mdW5jdGlvbi5qc29uLmpzJywgJ21ldGEucGFyYW1ldGVycy5qcycsICd2YXJpYWJsZS5wYXJhbWV0ZXIuZnVuY3Rpb24uanMnIF1cblxuICBpdCBcInRva2VuaXplcyAvKiAqLyBjb21tZW50c1wiLCAtPlxuICAgIHt0b2tlbnN9ID0gZ3JhbW1hci50b2tlbml6ZUxpbmUoJy8qKi8nKVxuXG4gICAgZXhwZWN0KHRva2Vuc1swXSkudG9FcXVhbCB2YWx1ZTogJy8qJywgc2NvcGVzOiBbJ3NvdXJjZS5qcy5qc3gnLCAnY29tbWVudC5ibG9jay5qcycsICdwdW5jdHVhdGlvbi5kZWZpbml0aW9uLmNvbW1lbnQuanMnXVxuICAgIGV4cGVjdCh0b2tlbnNbMV0pLnRvRXF1YWwgdmFsdWU6ICcqLycsIHNjb3BlczogWydzb3VyY2UuanMuanN4JywgJ2NvbW1lbnQuYmxvY2suanMnLCAncHVuY3R1YXRpb24uZGVmaW5pdGlvbi5jb21tZW50LmpzJ11cblxuICAgIHt0b2tlbnN9ID0gZ3JhbW1hci50b2tlbml6ZUxpbmUoJy8qIGZvbyAqLycpXG5cbiAgICBleHBlY3QodG9rZW5zWzBdKS50b0VxdWFsIHZhbHVlOiAnLyonLCBzY29wZXM6IFsnc291cmNlLmpzLmpzeCcsICdjb21tZW50LmJsb2NrLmpzJywgJ3B1bmN0dWF0aW9uLmRlZmluaXRpb24uY29tbWVudC5qcyddXG4gICAgZXhwZWN0KHRva2Vuc1sxXSkudG9FcXVhbCB2YWx1ZTogJyBmb28gJywgc2NvcGVzOiBbJ3NvdXJjZS5qcy5qc3gnLCAnY29tbWVudC5ibG9jay5qcyddXG4gICAgZXhwZWN0KHRva2Vuc1syXSkudG9FcXVhbCB2YWx1ZTogJyovJywgc2NvcGVzOiBbJ3NvdXJjZS5qcy5qc3gnLCAnY29tbWVudC5ibG9jay5qcycsICdwdW5jdHVhdGlvbi5kZWZpbml0aW9uLmNvbW1lbnQuanMnXVxuXG4gIGl0IFwidG9rZW5pemVzIC8qKiAqLyBjb21tZW50c1wiLCAtPlxuICAgIHt0b2tlbnN9ID0gZ3JhbW1hci50b2tlbml6ZUxpbmUoJy8qKiovJylcblxuICAgIGV4cGVjdCh0b2tlbnNbMF0pLnRvRXF1YWwgdmFsdWU6ICcvKionLCBzY29wZXM6IFsnc291cmNlLmpzLmpzeCcsICdjb21tZW50LmJsb2NrLmRvY3VtZW50YXRpb24uanMnLCAncHVuY3R1YXRpb24uZGVmaW5pdGlvbi5jb21tZW50LmpzJ11cbiAgICBleHBlY3QodG9rZW5zWzFdKS50b0VxdWFsIHZhbHVlOiAnKi8nLCBzY29wZXM6IFsnc291cmNlLmpzLmpzeCcsICdjb21tZW50LmJsb2NrLmRvY3VtZW50YXRpb24uanMnLCAncHVuY3R1YXRpb24uZGVmaW5pdGlvbi5jb21tZW50LmpzJ11cblxuICAgIHt0b2tlbnN9ID0gZ3JhbW1hci50b2tlbml6ZUxpbmUoJy8qKiBmb28gKi8nKVxuXG4gICAgZXhwZWN0KHRva2Vuc1swXSkudG9FcXVhbCB2YWx1ZTogJy8qKicsIHNjb3BlczogWydzb3VyY2UuanMuanN4JywgJ2NvbW1lbnQuYmxvY2suZG9jdW1lbnRhdGlvbi5qcycsICdwdW5jdHVhdGlvbi5kZWZpbml0aW9uLmNvbW1lbnQuanMnXVxuICAgIGV4cGVjdCh0b2tlbnNbMV0pLnRvRXF1YWwgdmFsdWU6ICcgZm9vICcsIHNjb3BlczogWydzb3VyY2UuanMuanN4JywgJ2NvbW1lbnQuYmxvY2suZG9jdW1lbnRhdGlvbi5qcyddXG4gICAgZXhwZWN0KHRva2Vuc1syXSkudG9FcXVhbCB2YWx1ZTogJyovJywgc2NvcGVzOiBbJ3NvdXJjZS5qcy5qc3gnLCAnY29tbWVudC5ibG9jay5kb2N1bWVudGF0aW9uLmpzJywgJ3B1bmN0dWF0aW9uLmRlZmluaXRpb24uY29tbWVudC5qcyddXG5cbiAgaXQgXCJ0b2tlbml6ZXMganN4IHRhZ3NcIiwgLT5cbiAgICB7dG9rZW5zfSA9IGdyYW1tYXIudG9rZW5pemVMaW5lKCc8dGFnPjwvdGFnPicpXG5cbiAgICBleHBlY3QodG9rZW5zWzBdKS50b0VxdWFsIHZhbHVlOiAnPCcsIHNjb3BlczogW1wic291cmNlLmpzLmpzeFwiLFwidGFnLm9wZW4uanNcIixcInB1bmN0dWF0aW9uLmRlZmluaXRpb24udGFnLmJlZ2luLmpzXCJdXG4gICAgZXhwZWN0KHRva2Vuc1sxXSkudG9FcXVhbCB2YWx1ZTogJ3RhZycsIHNjb3BlczogW1wic291cmNlLmpzLmpzeFwiLFwidGFnLm9wZW4uanNcIixcImVudGl0eS5uYW1lLnRhZy5qc1wiXVxuICAgIGV4cGVjdCh0b2tlbnNbMl0pLnRvRXF1YWwgdmFsdWU6ICc+Jywgc2NvcGVzOiBbXCJzb3VyY2UuanMuanN4XCIsXCJ0YWcub3Blbi5qc1wiLFwicHVuY3R1YXRpb24uZGVmaW5pdGlvbi50YWcuZW5kLmpzXCJdXG4gICAgZXhwZWN0KHRva2Vuc1szXSkudG9FcXVhbCB2YWx1ZTogJzwvJywgc2NvcGVzOiBbXCJzb3VyY2UuanMuanN4XCIsXCJ0YWcuY2xvc2VkLmpzXCIsXCJwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnRhZy5iZWdpbi5qc1wiXVxuICAgIGV4cGVjdCh0b2tlbnNbNF0pLnRvRXF1YWwgdmFsdWU6ICd0YWcnLCBzY29wZXM6IFtcInNvdXJjZS5qcy5qc3hcIixcInRhZy5jbG9zZWQuanNcIixcImVudGl0eS5uYW1lLnRhZy5qc1wiXVxuICAgIGV4cGVjdCh0b2tlbnNbNV0pLnRvRXF1YWwgdmFsdWU6ICc+Jywgc2NvcGVzOiBbXCJzb3VyY2UuanMuanN4XCIsXCJ0YWcuY2xvc2VkLmpzXCIsXCJwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnRhZy5lbmQuanNcIl1cblxuICBpdCBcInRva2VuaXplcyBqc3ggaW5zaWRlIHBhcmVudGhlc2lzXCIsIC0+XG4gICAge3Rva2Vuc30gPSBncmFtbWFyLnRva2VuaXplTGluZSgncmV0dXJuICg8dGFnPjwvdGFnPiknKVxuICAgIGV4cGVjdCh0b2tlbnNbM10pLnRvRXF1YWwgdmFsdWU6ICc8Jywgc2NvcGVzOiBbXCJzb3VyY2UuanMuanN4XCIsXCJ0YWcub3Blbi5qc1wiLFwicHVuY3R1YXRpb24uZGVmaW5pdGlvbi50YWcuYmVnaW4uanNcIl1cbiAgICBleHBlY3QodG9rZW5zWzRdKS50b0VxdWFsIHZhbHVlOiAndGFnJywgc2NvcGVzOiBbXCJzb3VyY2UuanMuanN4XCIsXCJ0YWcub3Blbi5qc1wiLFwiZW50aXR5Lm5hbWUudGFnLmpzXCJdXG4gICAgZXhwZWN0KHRva2Vuc1s1XSkudG9FcXVhbCB2YWx1ZTogJz4nLCBzY29wZXM6IFtcInNvdXJjZS5qcy5qc3hcIixcInRhZy5vcGVuLmpzXCIsXCJwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnRhZy5lbmQuanNcIl1cbiAgICBleHBlY3QodG9rZW5zWzZdKS50b0VxdWFsIHZhbHVlOiAnPC8nLCBzY29wZXM6IFtcInNvdXJjZS5qcy5qc3hcIixcInRhZy5jbG9zZWQuanNcIixcInB1bmN0dWF0aW9uLmRlZmluaXRpb24udGFnLmJlZ2luLmpzXCJdXG4gICAgZXhwZWN0KHRva2Vuc1s3XSkudG9FcXVhbCB2YWx1ZTogJ3RhZycsIHNjb3BlczogW1wic291cmNlLmpzLmpzeFwiLFwidGFnLmNsb3NlZC5qc1wiLFwiZW50aXR5Lm5hbWUudGFnLmpzXCJdXG4gICAgZXhwZWN0KHRva2Vuc1s4XSkudG9FcXVhbCB2YWx1ZTogJz4nLCBzY29wZXM6IFtcInNvdXJjZS5qcy5qc3hcIixcInRhZy5jbG9zZWQuanNcIixcInB1bmN0dWF0aW9uLmRlZmluaXRpb24udGFnLmVuZC5qc1wiXVxuXG4gIGl0IFwidG9rZW5pemVzIGpzeCBpbnNpZGUgZnVuY3Rpb24gYm9keVwiLCAtPlxuICAgIHt0b2tlbnN9ID0gZ3JhbW1hci50b2tlbml6ZUxpbmUoJ2Z1bmN0aW9uICgpIHsgcmV0dXJuICg8dGFnPjwvdGFnPikgfScpXG4gICAgZXhwZWN0KHRva2Vuc1sxMF0pLnRvRXF1YWwgdmFsdWU6ICc8Jywgc2NvcGVzOiBbXCJzb3VyY2UuanMuanN4XCIsXCJ0YWcub3Blbi5qc1wiLFwicHVuY3R1YXRpb24uZGVmaW5pdGlvbi50YWcuYmVnaW4uanNcIl1cbiAgICBleHBlY3QodG9rZW5zWzExXSkudG9FcXVhbCB2YWx1ZTogJ3RhZycsIHNjb3BlczogW1wic291cmNlLmpzLmpzeFwiLFwidGFnLm9wZW4uanNcIixcImVudGl0eS5uYW1lLnRhZy5qc1wiXVxuICAgIGV4cGVjdCh0b2tlbnNbMTJdKS50b0VxdWFsIHZhbHVlOiAnPicsIHNjb3BlczogW1wic291cmNlLmpzLmpzeFwiLFwidGFnLm9wZW4uanNcIixcInB1bmN0dWF0aW9uLmRlZmluaXRpb24udGFnLmVuZC5qc1wiXVxuICAgIGV4cGVjdCh0b2tlbnNbMTNdKS50b0VxdWFsIHZhbHVlOiAnPC8nLCBzY29wZXM6IFtcInNvdXJjZS5qcy5qc3hcIixcInRhZy5jbG9zZWQuanNcIixcInB1bmN0dWF0aW9uLmRlZmluaXRpb24udGFnLmJlZ2luLmpzXCJdXG4gICAgZXhwZWN0KHRva2Vuc1sxNF0pLnRvRXF1YWwgdmFsdWU6ICd0YWcnLCBzY29wZXM6IFtcInNvdXJjZS5qcy5qc3hcIixcInRhZy5jbG9zZWQuanNcIixcImVudGl0eS5uYW1lLnRhZy5qc1wiXVxuICAgIGV4cGVjdCh0b2tlbnNbMTVdKS50b0VxdWFsIHZhbHVlOiAnPicsIHNjb3BlczogW1wic291cmNlLmpzLmpzeFwiLFwidGFnLmNsb3NlZC5qc1wiLFwicHVuY3R1YXRpb24uZGVmaW5pdGlvbi50YWcuZW5kLmpzXCJdXG5cbiAgaXQgXCJ0b2tlbml6ZXMganN4IGluc2lkZSBmdW5jdGlvbiBib2R5IGluIGFuIG9iamVjdFwiLCAtPlxuICAgIHt0b2tlbnN9ID0gZ3JhbW1hci50b2tlbml6ZUxpbmUoJ3tmb286ZnVuY3Rpb24gKCkgeyByZXR1cm4gKDx0YWc+PC90YWc+KSB9fScpXG4gICAgZXhwZWN0KHRva2Vuc1sxM10pLnRvRXF1YWwgdmFsdWU6ICc8Jywgc2NvcGVzOiBbXCJzb3VyY2UuanMuanN4XCIsXCJ0YWcub3Blbi5qc1wiLFwicHVuY3R1YXRpb24uZGVmaW5pdGlvbi50YWcuYmVnaW4uanNcIl1cbiAgICBleHBlY3QodG9rZW5zWzE0XSkudG9FcXVhbCB2YWx1ZTogJ3RhZycsIHNjb3BlczogW1wic291cmNlLmpzLmpzeFwiLFwidGFnLm9wZW4uanNcIixcImVudGl0eS5uYW1lLnRhZy5qc1wiXVxuICAgIGV4cGVjdCh0b2tlbnNbMTVdKS50b0VxdWFsIHZhbHVlOiAnPicsIHNjb3BlczogW1wic291cmNlLmpzLmpzeFwiLFwidGFnLm9wZW4uanNcIixcInB1bmN0dWF0aW9uLmRlZmluaXRpb24udGFnLmVuZC5qc1wiXVxuICAgIGV4cGVjdCh0b2tlbnNbMTZdKS50b0VxdWFsIHZhbHVlOiAnPC8nLCBzY29wZXM6IFtcInNvdXJjZS5qcy5qc3hcIixcInRhZy5jbG9zZWQuanNcIixcInB1bmN0dWF0aW9uLmRlZmluaXRpb24udGFnLmJlZ2luLmpzXCJdXG4gICAgZXhwZWN0KHRva2Vuc1sxN10pLnRvRXF1YWwgdmFsdWU6ICd0YWcnLCBzY29wZXM6IFtcInNvdXJjZS5qcy5qc3hcIixcInRhZy5jbG9zZWQuanNcIixcImVudGl0eS5uYW1lLnRhZy5qc1wiXVxuICAgIGV4cGVjdCh0b2tlbnNbMThdKS50b0VxdWFsIHZhbHVlOiAnPicsIHNjb3BlczogW1wic291cmNlLmpzLmpzeFwiLFwidGFnLmNsb3NlZC5qc1wiLFwicHVuY3R1YXRpb24uZGVmaW5pdGlvbi50YWcuZW5kLmpzXCJdXG5cblxuICBpdCBcInRva2VuaXplcyBqc3ggaW5zaWRlIGZ1bmN0aW9uIGNhbGxcIiwgLT5cbiAgICB7dG9rZW5zfSA9IGdyYW1tYXIudG9rZW5pemVMaW5lKCdmb28oPHRhZz48L3RhZz4pJylcbiAgICBleHBlY3QodG9rZW5zWzJdKS50b0VxdWFsIHZhbHVlOiAnPCcsIHNjb3BlczogW1wic291cmNlLmpzLmpzeFwiLFwibWV0YS5mdW5jdGlvbi1jYWxsLmpzXCIsXCJ0YWcub3Blbi5qc1wiLFwicHVuY3R1YXRpb24uZGVmaW5pdGlvbi50YWcuYmVnaW4uanNcIl1cbiAgICBleHBlY3QodG9rZW5zWzNdKS50b0VxdWFsIHZhbHVlOiAndGFnJywgc2NvcGVzOiBbXCJzb3VyY2UuanMuanN4XCIsXCJtZXRhLmZ1bmN0aW9uLWNhbGwuanNcIixcInRhZy5vcGVuLmpzXCIsXCJlbnRpdHkubmFtZS50YWcuanNcIl1cbiAgICBleHBlY3QodG9rZW5zWzRdKS50b0VxdWFsIHZhbHVlOiAnPicsIHNjb3BlczogW1wic291cmNlLmpzLmpzeFwiLFwibWV0YS5mdW5jdGlvbi1jYWxsLmpzXCIsXCJ0YWcub3Blbi5qc1wiLFwicHVuY3R1YXRpb24uZGVmaW5pdGlvbi50YWcuZW5kLmpzXCJdXG4gICAgZXhwZWN0KHRva2Vuc1s1XSkudG9FcXVhbCB2YWx1ZTogJzwvJywgc2NvcGVzOiBbXCJzb3VyY2UuanMuanN4XCIsXCJtZXRhLmZ1bmN0aW9uLWNhbGwuanNcIixcInRhZy5jbG9zZWQuanNcIixcInB1bmN0dWF0aW9uLmRlZmluaXRpb24udGFnLmJlZ2luLmpzXCJdXG4gICAgZXhwZWN0KHRva2Vuc1s2XSkudG9FcXVhbCB2YWx1ZTogJ3RhZycsIHNjb3BlczogW1wic291cmNlLmpzLmpzeFwiLFwibWV0YS5mdW5jdGlvbi1jYWxsLmpzXCIsXCJ0YWcuY2xvc2VkLmpzXCIsXCJlbnRpdHkubmFtZS50YWcuanNcIl1cbiAgICBleHBlY3QodG9rZW5zWzddKS50b0VxdWFsIHZhbHVlOiAnPicsIHNjb3BlczogW1wic291cmNlLmpzLmpzeFwiLFwibWV0YS5mdW5jdGlvbi1jYWxsLmpzXCIsXCJ0YWcuY2xvc2VkLmpzXCIsXCJwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnRhZy5lbmQuanNcIl1cblxuICBpdCBcInRva2VuaXplcyBqc3ggaW5zaWRlIG1ldGhvZCBjYWxsXCIsIC0+XG4gICAge3Rva2Vuc30gPSBncmFtbWFyLnRva2VuaXplTGluZSgnYmFyLmZvbyg8dGFnPjwvdGFnPiknKVxuICAgIGV4cGVjdCh0b2tlbnNbNF0pLnRvRXF1YWwgdmFsdWU6ICc8Jywgc2NvcGVzOiBbXCJzb3VyY2UuanMuanN4XCIsXCJtZXRhLm1ldGhvZC1jYWxsLmpzXCIsXCJ0YWcub3Blbi5qc1wiLFwicHVuY3R1YXRpb24uZGVmaW5pdGlvbi50YWcuYmVnaW4uanNcIl1cbiAgICBleHBlY3QodG9rZW5zWzVdKS50b0VxdWFsIHZhbHVlOiAndGFnJywgc2NvcGVzOiBbXCJzb3VyY2UuanMuanN4XCIsXCJtZXRhLm1ldGhvZC1jYWxsLmpzXCIsXCJ0YWcub3Blbi5qc1wiLFwiZW50aXR5Lm5hbWUudGFnLmpzXCJdXG4gICAgZXhwZWN0KHRva2Vuc1s2XSkudG9FcXVhbCB2YWx1ZTogJz4nLCBzY29wZXM6IFtcInNvdXJjZS5qcy5qc3hcIixcIm1ldGEubWV0aG9kLWNhbGwuanNcIixcInRhZy5vcGVuLmpzXCIsXCJwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnRhZy5lbmQuanNcIl1cbiAgICBleHBlY3QodG9rZW5zWzddKS50b0VxdWFsIHZhbHVlOiAnPC8nLCBzY29wZXM6IFtcInNvdXJjZS5qcy5qc3hcIixcIm1ldGEubWV0aG9kLWNhbGwuanNcIixcInRhZy5jbG9zZWQuanNcIixcInB1bmN0dWF0aW9uLmRlZmluaXRpb24udGFnLmJlZ2luLmpzXCJdXG4gICAgZXhwZWN0KHRva2Vuc1s4XSkudG9FcXVhbCB2YWx1ZTogJ3RhZycsIHNjb3BlczogW1wic291cmNlLmpzLmpzeFwiLFwibWV0YS5tZXRob2QtY2FsbC5qc1wiLFwidGFnLmNsb3NlZC5qc1wiLFwiZW50aXR5Lm5hbWUudGFnLmpzXCJdXG4gICAgZXhwZWN0KHRva2Vuc1s5XSkudG9FcXVhbCB2YWx1ZTogJz4nLCBzY29wZXM6IFtcInNvdXJjZS5qcy5qc3hcIixcIm1ldGEubWV0aG9kLWNhbGwuanNcIixcInRhZy5jbG9zZWQuanNcIixcInB1bmN0dWF0aW9uLmRlZmluaXRpb24udGFnLmVuZC5qc1wiXVxuXG5cbiAgaXQgXCJ0b2tlbml6ZXMgJyBhcyBzdHJpbmcgaW5zaWRlIGpzeFwiLCAtPlxuICAgIHt0b2tlbnN9ID0gZ3JhbW1hci50b2tlbml6ZUxpbmUoJzx0YWc+Zm9cXCdvPC90YWc+JylcblxuICAgIGV4cGVjdCh0b2tlbnNbMF0pLnRvRXF1YWwgdmFsdWU6ICc8Jywgc2NvcGVzOiBbXCJzb3VyY2UuanMuanN4XCIsXCJ0YWcub3Blbi5qc1wiLFwicHVuY3R1YXRpb24uZGVmaW5pdGlvbi50YWcuYmVnaW4uanNcIl1cbiAgICBleHBlY3QodG9rZW5zWzFdKS50b0VxdWFsIHZhbHVlOiAndGFnJywgc2NvcGVzOiBbXCJzb3VyY2UuanMuanN4XCIsXCJ0YWcub3Blbi5qc1wiLFwiZW50aXR5Lm5hbWUudGFnLmpzXCJdXG4gICAgZXhwZWN0KHRva2Vuc1syXSkudG9FcXVhbCB2YWx1ZTogJz4nLCBzY29wZXM6IFtcInNvdXJjZS5qcy5qc3hcIixcInRhZy5vcGVuLmpzXCIsXCJwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnRhZy5lbmQuanNcIl1cbiAgICBleHBlY3QodG9rZW5zWzNdKS50b0VxdWFsIHZhbHVlOiAnZm9cXCdvJywgc2NvcGVzOiBbXCJzb3VyY2UuanMuanN4XCIsXCJtZXRhLm90aGVyLnBjZGF0YS5qc1wiXVxuICAgIGV4cGVjdCh0b2tlbnNbNF0pLnRvRXF1YWwgdmFsdWU6ICc8LycsIHNjb3BlczogW1wic291cmNlLmpzLmpzeFwiLFwidGFnLmNsb3NlZC5qc1wiLFwicHVuY3R1YXRpb24uZGVmaW5pdGlvbi50YWcuYmVnaW4uanNcIl1cbiAgICBleHBlY3QodG9rZW5zWzVdKS50b0VxdWFsIHZhbHVlOiAndGFnJywgc2NvcGVzOiBbXCJzb3VyY2UuanMuanN4XCIsXCJ0YWcuY2xvc2VkLmpzXCIsXCJlbnRpdHkubmFtZS50YWcuanNcIl1cbiAgICBleHBlY3QodG9rZW5zWzZdKS50b0VxdWFsIHZhbHVlOiAnPicsIHNjb3BlczogW1wic291cmNlLmpzLmpzeFwiLFwidGFnLmNsb3NlZC5qc1wiLFwicHVuY3R1YXRpb24uZGVmaW5pdGlvbi50YWcuZW5kLmpzXCJdXG5cbiAgaXQgXCJ0b2tlbml6ZXMgdGVybmFyeSBvcGVyYXRvciBpbnNpZGUganN4IGNvZGUgc2VjdGlvblwiLCAtPlxuICAgIHt0b2tlbnN9ID0gZ3JhbW1hci50b2tlbml6ZUxpbmUoJ3t4Pzx0YWc+PC90YWc+Om51bGx9JylcbiAgICBleHBlY3QodG9rZW5zWzBdKS50b0VxdWFsIHZhbHVlOiAneycsIHNjb3BlczogW1wic291cmNlLmpzLmpzeFwiLFwibWV0YS5icmFjZS5jdXJseS5qc1wiXVxuICAgIGV4cGVjdCh0b2tlbnNbMV0pLnRvRXF1YWwgdmFsdWU6ICd4Jywgc2NvcGVzOiBbXCJzb3VyY2UuanMuanN4XCJdXG4gICAgZXhwZWN0KHRva2Vuc1syXSkudG9FcXVhbCB2YWx1ZTogJz8nLCBzY29wZXM6IFtcInNvdXJjZS5qcy5qc3hcIiwgXCJrZXl3b3JkLm9wZXJhdG9yLnRlcm5hcnkuanNcIl1cbiAgICBleHBlY3QodG9rZW5zWzNdKS50b0VxdWFsIHZhbHVlOiAnPCcsIHNjb3BlczogW1wic291cmNlLmpzLmpzeFwiLFwidGFnLm9wZW4uanNcIixcInB1bmN0dWF0aW9uLmRlZmluaXRpb24udGFnLmJlZ2luLmpzXCJdXG4gICAgZXhwZWN0KHRva2Vuc1s0XSkudG9FcXVhbCB2YWx1ZTogJ3RhZycsIHNjb3BlczogW1wic291cmNlLmpzLmpzeFwiLFwidGFnLm9wZW4uanNcIixcImVudGl0eS5uYW1lLnRhZy5qc1wiXVxuICAgIGV4cGVjdCh0b2tlbnNbNV0pLnRvRXF1YWwgdmFsdWU6ICc+Jywgc2NvcGVzOiBbXCJzb3VyY2UuanMuanN4XCIsXCJ0YWcub3Blbi5qc1wiLFwicHVuY3R1YXRpb24uZGVmaW5pdGlvbi50YWcuZW5kLmpzXCJdXG4gICAgZXhwZWN0KHRva2Vuc1s2XSkudG9FcXVhbCB2YWx1ZTogJzwvJywgc2NvcGVzOiBbXCJzb3VyY2UuanMuanN4XCIsXCJ0YWcuY2xvc2VkLmpzXCIsXCJwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnRhZy5iZWdpbi5qc1wiXVxuICAgIGV4cGVjdCh0b2tlbnNbN10pLnRvRXF1YWwgdmFsdWU6ICd0YWcnLCBzY29wZXM6IFtcInNvdXJjZS5qcy5qc3hcIixcInRhZy5jbG9zZWQuanNcIixcImVudGl0eS5uYW1lLnRhZy5qc1wiXVxuICAgIGV4cGVjdCh0b2tlbnNbOF0pLnRvRXF1YWwgdmFsdWU6ICc+Jywgc2NvcGVzOiBbXCJzb3VyY2UuanMuanN4XCIsXCJ0YWcuY2xvc2VkLmpzXCIsXCJwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnRhZy5lbmQuanNcIl1cbiAgICBleHBlY3QodG9rZW5zWzldKS50b0VxdWFsIHZhbHVlOiAnOicsIHNjb3BlczogW1wic291cmNlLmpzLmpzeFwiLFwia2V5d29yZC5vcGVyYXRvci50ZXJuYXJ5LmpzXCJdXG4gICAgZXhwZWN0KHRva2Vuc1sxMF0pLnRvRXF1YWwgdmFsdWU6ICdudWxsJywgc2NvcGVzOiBbXCJzb3VyY2UuanMuanN4XCIsXCJjb25zdGFudC5sYW5ndWFnZS5udWxsLmpzXCJdXG4gICAgZXhwZWN0KHRva2Vuc1sxMV0pLnRvRXF1YWwgdmFsdWU6ICd9Jywgc2NvcGVzOiBbXCJzb3VyY2UuanMuanN4XCIsXCJtZXRhLmJyYWNlLmN1cmx5LmpzXCJdXG5cbiAgICAje3Rva2Vuc30gPSBncmFtbWFyLnRva2VuaXplTGluZSgnPHRhZz5cXCdmb288L3RhZz4nKVxuXG4gICAgI2V4cGVjdCh0b2tlbnNbMF0pLnRvRXF1YWwgdmFsdWU6ICc8Jywgc2NvcGVzOiBbXCJzb3VyY2UuanMuanN4XCIsXCJ0YWcub3Blbi5qc1wiLFwicHVuY3R1YXRpb24uZGVmaW5pdGlvbi50YWcuYmVnaW4uanNcIl1cbiAgICAjZXhwZWN0KHRva2Vuc1sxXSkudG9FcXVhbCB2YWx1ZTogJ3RhZycsIHNjb3BlczogW1wic291cmNlLmpzLmpzeFwiLFwidGFnLm9wZW4uanNcIixcImVudGl0eS5uYW1lLnRhZy5qc1wiXVxuICAgICNleHBlY3QodG9rZW5zWzJdKS50b0VxdWFsIHZhbHVlOiAnPicsIHNjb3BlczogW1wic291cmNlLmpzLmpzeFwiLFwidGFnLm9wZW4uanNcIixcInB1bmN0dWF0aW9uLmRlZmluaXRpb24udGFnLmVuZC5qc1wiXVxuICAgICNleHBlY3QodG9rZW5zWzNdKS50b0VxdWFsIHZhbHVlOiAnXFwnZm9vJywgc2NvcGVzOiBbXCJzb3VyY2UuanMuanN4XCIsXCJtZXRhLm90aGVyLnBjZGF0YS5qc1wiXVxuICAgICNleHBlY3QodG9rZW5zWzRdKS50b0VxdWFsIHZhbHVlOiAnPC8nLCBzY29wZXM6IFtcInNvdXJjZS5qcy5qc3hcIixcInRhZy5jbG9zZWQuanNcIixcInB1bmN0dWF0aW9uLmRlZmluaXRpb24udGFnLmJlZ2luLmpzXCJdXG4gICAgI2V4cGVjdCh0b2tlbnNbNV0pLnRvRXF1YWwgdmFsdWU6ICd0YWcnLCBzY29wZXM6IFtcInNvdXJjZS5qcy5qc3hcIixcInRhZy5jbG9zZWQuanNcIixcImVudGl0eS5uYW1lLnRhZy5qc1wiXVxuICAgICNleHBlY3QodG9rZW5zWzZdKS50b0VxdWFsIHZhbHVlOiAnPicsIHNjb3BlczogW1wic291cmNlLmpzLmpzeFwiLFwidGFnLmNsb3NlZC5qc1wiLFwicHVuY3R1YXRpb24uZGVmaW5pdGlvbi50YWcuZW5kLmpzXCJdXG5cblxuXG4gIGRlc2NyaWJlIFwiaW5kZW50YXRpb25cIiwgLT5cbiAgICBlZGl0b3IgPSBudWxsXG5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICBlZGl0b3IgPSBidWlsZFRleHRFZGl0b3IoKVxuICAgICAgZWRpdG9yLnNldEdyYW1tYXIoZ3JhbW1hcilcblxuICAgIGV4cGVjdFByZXNlcnZlZEluZGVudGF0aW9uID0gKHRleHQpIC0+XG4gICAgICBlZGl0b3Iuc2V0VGV4dCh0ZXh0KVxuICAgICAgZWRpdG9yLmF1dG9JbmRlbnRCdWZmZXJSb3dzKDAsIHRleHQuc3BsaXQoXCJcXG5cIikubGVuZ3RoIC0gMSlcbiAgICAgIGV4cGVjdChlZGl0b3IuZ2V0VGV4dCgpKS50b0JlIHRleHRcblxuICAgIGl0IFwiaW5kZW50cyBhbGxtYW4tc3R5bGUgY3VybHkgYnJhY2VzXCIsIC0+XG4gICAgICBleHBlY3RQcmVzZXJ2ZWRJbmRlbnRhdGlvbiBcIlwiXCJcbiAgICAgICAgaWYgKHRydWUpXG4gICAgICAgIHtcbiAgICAgICAgICBmb3IgKDs7KVxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHdoaWxlICh0cnVlKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB4KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZWxzZVxuICAgICAgICB7XG4gICAgICAgICAgZG9cbiAgICAgICAgICB7XG4gICAgICAgICAgICB5KCk7XG4gICAgICAgICAgfSB3aGlsZSAodHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgIFwiXCJcIlxuXG4gICAgaXQgXCJpbmRlbnRzIG5vbi1hbGxtYW4tc3R5bGUgY3VybHkgYnJhY2VzXCIsIC0+XG4gICAgICBleHBlY3RQcmVzZXJ2ZWRJbmRlbnRhdGlvbiBcIlwiXCJcbiAgICAgICAgaWYgKHRydWUpIHtcbiAgICAgICAgICBmb3IgKDs7KSB7XG4gICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgICB4KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgIHkoKTtcbiAgICAgICAgICB9IHdoaWxlICh0cnVlKTtcbiAgICAgICAgfVxuICAgICAgXCJcIlwiXG4iXX0=
