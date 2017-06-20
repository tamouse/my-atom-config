(function() {
  describe("JSX indent", function() {
    var buffer, editor, formattedFile, formattedLines, formattedSample, fs, languageMode, ref, sampleFile;
    fs = require('fs');
    formattedFile = require.resolve('./fixtures/sample-formatted.jsx');
    sampleFile = require.resolve('./fixtures/sample.jsx');
    formattedSample = fs.readFileSync(formattedFile);
    formattedLines = formattedSample.toString().split('\n');
    ref = [], editor = ref[0], buffer = ref[1], languageMode = ref[2];
    afterEach(function() {
      return editor.destroy();
    });
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.workspace.open(sampleFile, {
          autoIndent: false
        }).then(function(o) {
          editor = o;
          return buffer = editor.buffer, languageMode = editor.languageMode, editor;
        });
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage("react");
      });
      afterEach(function() {
        atom.packages.deactivatePackages();
        return atom.packages.unloadPackages();
      });
      return runs(function() {
        var grammar;
        grammar = atom.grammars.grammarForScopeName("source.js.jsx");
        return editor.setGrammar(grammar);
      });
    });
    return describe("should indent sample file correctly", function() {
      return it("autoIndentBufferRows should indent same as sample file", function() {
        var i, j, line, ref1, results;
        editor.autoIndentBufferRows(0, formattedLines.length - 1);
        results = [];
        for (i = j = 0, ref1 = formattedLines.length; 0 <= ref1 ? j < ref1 : j > ref1; i = 0 <= ref1 ? ++j : --j) {
          line = formattedLines[i];
          if (!line.trim()) {
            continue;
          }
          results.push(expect((i + 1) + ":" + buffer.lineForRow(i)).toBe((i + 1) + ":" + line));
        }
        return results;
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3RhbWFyYS50ZW1wbGUvLmF0b20vcGFja2FnZXMvcmVhY3Qvc3BlYy9pbmRlbnQtc3BlYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQSxRQUFBLENBQVMsWUFBVCxFQUF1QixTQUFBO0FBQ3JCLFFBQUE7SUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVI7SUFDTCxhQUFBLEdBQWdCLE9BQU8sQ0FBQyxPQUFSLENBQWdCLGlDQUFoQjtJQUNoQixVQUFBLEdBQWEsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsdUJBQWhCO0lBQ2IsZUFBQSxHQUFrQixFQUFFLENBQUMsWUFBSCxDQUFnQixhQUFoQjtJQUNsQixjQUFBLEdBQWlCLGVBQWUsQ0FBQyxRQUFoQixDQUFBLENBQTBCLENBQUMsS0FBM0IsQ0FBaUMsSUFBakM7SUFDakIsTUFBaUMsRUFBakMsRUFBQyxlQUFELEVBQVMsZUFBVCxFQUFpQjtJQUVqQixTQUFBLENBQVUsU0FBQTthQUNSLE1BQU0sQ0FBQyxPQUFQLENBQUE7SUFEUSxDQUFWO0lBR0EsVUFBQSxDQUFXLFNBQUE7TUFDVCxlQUFBLENBQWdCLFNBQUE7ZUFDWixJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsVUFBcEIsRUFBZ0M7VUFBQSxVQUFBLEVBQVksS0FBWjtTQUFoQyxDQUFrRCxDQUFDLElBQW5ELENBQXdELFNBQUMsQ0FBRDtVQUN0RCxNQUFBLEdBQVM7aUJBQ1Isc0JBQUQsRUFBUyxrQ0FBVCxFQUF5QjtRQUY2QixDQUF4RDtNQURZLENBQWhCO01BS0EsZUFBQSxDQUFnQixTQUFBO2VBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLE9BQTlCO01BRGMsQ0FBaEI7TUFHQSxTQUFBLENBQVUsU0FBQTtRQUNSLElBQUksQ0FBQyxRQUFRLENBQUMsa0JBQWQsQ0FBQTtlQUNBLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBZCxDQUFBO01BRlEsQ0FBVjthQUlBLElBQUEsQ0FBSyxTQUFBO0FBQ0gsWUFBQTtRQUFBLE9BQUEsR0FBVSxJQUFJLENBQUMsUUFBUSxDQUFDLG1CQUFkLENBQWtDLGVBQWxDO2VBQ1YsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsT0FBbEI7TUFGRyxDQUFMO0lBYlMsQ0FBWDtXQWlCQSxRQUFBLENBQVMscUNBQVQsRUFBZ0QsU0FBQTthQUM5QyxFQUFBLENBQUcsd0RBQUgsRUFBNkQsU0FBQTtBQUMzRCxZQUFBO1FBQUEsTUFBTSxDQUFDLG9CQUFQLENBQTRCLENBQTVCLEVBQStCLGNBQWMsQ0FBQyxNQUFmLEdBQXdCLENBQXZEO0FBQ0E7YUFBUyxtR0FBVDtVQUNFLElBQUEsR0FBTyxjQUFlLENBQUEsQ0FBQTtVQUN0QixJQUFZLENBQUMsSUFBSSxDQUFDLElBQUwsQ0FBQSxDQUFiO0FBQUEscUJBQUE7O3VCQUNBLE1BQUEsQ0FBTyxDQUFDLENBQUEsR0FBSSxDQUFMLENBQUEsR0FBVSxHQUFWLEdBQWdCLE1BQU0sQ0FBQyxVQUFQLENBQWtCLENBQWxCLENBQXZCLENBQTRDLENBQUMsSUFBN0MsQ0FBbUQsQ0FBQyxDQUFBLEdBQUksQ0FBTCxDQUFBLEdBQVUsR0FBVixHQUFnQixJQUFuRTtBQUhGOztNQUYyRCxDQUE3RDtJQUQ4QyxDQUFoRDtFQTVCcUIsQ0FBdkI7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbImRlc2NyaWJlIFwiSlNYIGluZGVudFwiLCAtPlxuICBmcyA9IHJlcXVpcmUgJ2ZzJ1xuICBmb3JtYXR0ZWRGaWxlID0gcmVxdWlyZS5yZXNvbHZlICcuL2ZpeHR1cmVzL3NhbXBsZS1mb3JtYXR0ZWQuanN4J1xuICBzYW1wbGVGaWxlID0gcmVxdWlyZS5yZXNvbHZlICcuL2ZpeHR1cmVzL3NhbXBsZS5qc3gnXG4gIGZvcm1hdHRlZFNhbXBsZSA9IGZzLnJlYWRGaWxlU3luYyBmb3JtYXR0ZWRGaWxlXG4gIGZvcm1hdHRlZExpbmVzID0gZm9ybWF0dGVkU2FtcGxlLnRvU3RyaW5nKCkuc3BsaXQgJ1xcbidcbiAgW2VkaXRvciwgYnVmZmVyLCBsYW5ndWFnZU1vZGVdID0gW11cblxuICBhZnRlckVhY2ggLT5cbiAgICBlZGl0b3IuZGVzdHJveSgpXG5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKHNhbXBsZUZpbGUsIGF1dG9JbmRlbnQ6IGZhbHNlKS50aGVuIChvKSAtPlxuICAgICAgICAgIGVkaXRvciA9IG9cbiAgICAgICAgICB7YnVmZmVyLCBsYW5ndWFnZU1vZGV9ID0gZWRpdG9yXG5cbiAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKFwicmVhY3RcIilcblxuICAgIGFmdGVyRWFjaCAtPlxuICAgICAgYXRvbS5wYWNrYWdlcy5kZWFjdGl2YXRlUGFja2FnZXMoKVxuICAgICAgYXRvbS5wYWNrYWdlcy51bmxvYWRQYWNrYWdlcygpXG5cbiAgICBydW5zIC0+XG4gICAgICBncmFtbWFyID0gYXRvbS5ncmFtbWFycy5ncmFtbWFyRm9yU2NvcGVOYW1lKFwic291cmNlLmpzLmpzeFwiKVxuICAgICAgZWRpdG9yLnNldEdyYW1tYXIoZ3JhbW1hcik7XG5cbiAgZGVzY3JpYmUgXCJzaG91bGQgaW5kZW50IHNhbXBsZSBmaWxlIGNvcnJlY3RseVwiLCAtPlxuICAgIGl0IFwiYXV0b0luZGVudEJ1ZmZlclJvd3Mgc2hvdWxkIGluZGVudCBzYW1lIGFzIHNhbXBsZSBmaWxlXCIsIC0+XG4gICAgICBlZGl0b3IuYXV0b0luZGVudEJ1ZmZlclJvd3MoMCwgZm9ybWF0dGVkTGluZXMubGVuZ3RoIC0gMSlcbiAgICAgIGZvciBpIGluIFswLi4uZm9ybWF0dGVkTGluZXMubGVuZ3RoXVxuICAgICAgICBsaW5lID0gZm9ybWF0dGVkTGluZXNbaV1cbiAgICAgICAgY29udGludWUgaWYgIWxpbmUudHJpbSgpXG4gICAgICAgIGV4cGVjdCgoaSArIDEpICsgXCI6XCIgKyBidWZmZXIubGluZUZvclJvdyhpKSkudG9CZSAoKGkgKyAxKSArIFwiOlwiICsgbGluZSlcbiJdfQ==
