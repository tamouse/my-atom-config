(function() {
  describe("React tests", function() {
    var sampleCorrectAddonsES6File, sampleCorrectAddonsFile, sampleCorrectES6File, sampleCorrectFile, sampleCorrectNativeFile, sampleInvalidFile;
    sampleCorrectFile = require.resolve('./fixtures/sample-correct.js');
    sampleCorrectNativeFile = require.resolve('./fixtures/sample-correct-native.js');
    sampleCorrectES6File = require.resolve('./fixtures/sample-correct-es6.js');
    sampleCorrectAddonsES6File = require.resolve('./fixtures/sample-correct-addons-es6.js');
    sampleCorrectAddonsFile = require.resolve('./fixtures/sample-correct-addons.js');
    sampleInvalidFile = require.resolve('./fixtures/sample-invalid.js');
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.packages.activatePackage("language-javascript");
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage("react");
      });
      return afterEach(function() {
        atom.packages.deactivatePackages();
        return atom.packages.unloadPackages();
      });
    });
    return describe("should select correct grammar", function() {
      it("should select source.js.jsx if file has require('react')", function() {
        return waitsForPromise(function() {
          return atom.workspace.open(sampleCorrectFile, {
            autoIndent: false
          }).then(function(editor) {
            expect(editor.getGrammar().scopeName).toEqual('source.js.jsx');
            return editor.destroy();
          });
        });
      });
      it("should select source.js.jsx if file has require('react-native')", function() {
        return waitsForPromise(function() {
          return atom.workspace.open(sampleCorrectNativeFile, {
            autoIndent: false
          }).then(function(editor) {
            expect(editor.getGrammar().scopeName).toEqual('source.js.jsx');
            return editor.destroy();
          });
        });
      });
      it("should select source.js.jsx if file has require('react/addons')", function() {
        return waitsForPromise(function() {
          return atom.workspace.open(sampleCorrectAddonsFile, {
            autoIndent: false
          }).then(function(editor) {
            expect(editor.getGrammar().scopeName).toEqual('source.js.jsx');
            return editor.destroy();
          });
        });
      });
      it("should select source.js.jsx if file has react es6 import", function() {
        return waitsForPromise(function() {
          return atom.workspace.open(sampleCorrectES6File, {
            autoIndent: false
          }).then(function(editor) {
            expect(editor.getGrammar().scopeName).toEqual('source.js.jsx');
            return editor.destroy();
          });
        });
      });
      it("should select source.js.jsx if file has react/addons es6 import", function() {
        return waitsForPromise(function() {
          return atom.workspace.open(sampleCorrectAddonsES6File, {
            autoIndent: false
          }).then(function(editor) {
            expect(editor.getGrammar().scopeName).toEqual('source.js.jsx');
            return editor.destroy();
          });
        });
      });
      return it("should select source.js if file doesnt have require('react')", function() {
        return waitsForPromise(function() {
          return atom.workspace.open(sampleInvalidFile, {
            autoIndent: false
          }).then(function(editor) {
            expect(editor.getGrammar().scopeName).toEqual('source.js');
            return editor.destroy();
          });
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3RhbWFyYS50ZW1wbGUvLmF0b20vcGFja2FnZXMvcmVhY3Qvc3BlYy9hdG9tLXJlYWN0LXNwZWMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUEsUUFBQSxDQUFTLGFBQVQsRUFBd0IsU0FBQTtBQUN0QixRQUFBO0lBQUEsaUJBQUEsR0FBb0IsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsOEJBQWhCO0lBQ3BCLHVCQUFBLEdBQTBCLE9BQU8sQ0FBQyxPQUFSLENBQWdCLHFDQUFoQjtJQUMxQixvQkFBQSxHQUF1QixPQUFPLENBQUMsT0FBUixDQUFnQixrQ0FBaEI7SUFDdkIsMEJBQUEsR0FBNkIsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IseUNBQWhCO0lBQzdCLHVCQUFBLEdBQTBCLE9BQU8sQ0FBQyxPQUFSLENBQWdCLHFDQUFoQjtJQUMxQixpQkFBQSxHQUFvQixPQUFPLENBQUMsT0FBUixDQUFnQiw4QkFBaEI7SUFFcEIsVUFBQSxDQUFXLFNBQUE7TUFDVCxlQUFBLENBQWdCLFNBQUE7ZUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIscUJBQTlCO01BRGMsQ0FBaEI7TUFHQSxlQUFBLENBQWdCLFNBQUE7ZUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsT0FBOUI7TUFEYyxDQUFoQjthQUdBLFNBQUEsQ0FBVSxTQUFBO1FBQ1IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxrQkFBZCxDQUFBO2VBQ0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxjQUFkLENBQUE7TUFGUSxDQUFWO0lBUFMsQ0FBWDtXQVdBLFFBQUEsQ0FBUywrQkFBVCxFQUEwQyxTQUFBO01BQ3hDLEVBQUEsQ0FBRywwREFBSCxFQUErRCxTQUFBO2VBQzdELGVBQUEsQ0FBZ0IsU0FBQTtpQkFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsaUJBQXBCLEVBQXVDO1lBQUEsVUFBQSxFQUFZ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IHNhbXBsZUNvcnJlY3RGaWxlID0gcmVxdWlyZS5yZXNvbHZlICcuL2ZpeHR1cmVzL3NhbXBsZS1jb3JyZWN0LmpzJ1xuICBzYW1wbGVDb3JyZWN0TmF0aXZlRmlsZSA9IHJlcXVpcmUucmVzb2x2ZSAnLi9maXh0dXJlcy9zYW1wbGUtY29ycmVjdC1uYXRpdmUuanMnXG4gIHNhbXBsZUNvcnJlY3RFUzZGaWxlID0gcmVxdWlyZS5yZXNvbHZlICcuL2ZpeHR1cmVzL3NhbXBsZS1jb3JyZWN0LWVzNi5qcydcbiAgc2FtcGxlQ29ycmVjdEFkZG9uc0VTNkZpbGUgPSByZXF1aXJlLnJlc29sdmUgJy4vZml4dHVyZXMvc2FtcGxlLWNvcnJlY3QtYWRkb25zLWVzNi5qcydcbiAgc2FtcGxlQ29ycmVjdEFkZG9uc0ZpbGUgPSByZXF1aXJlLnJlc29sdmUgJy4vZml4dHVyZXMvc2FtcGxlLWNvcnJlY3QtYWRkb25zLmpzJ1xuICBzYW1wbGVJbnZhbGlkRmlsZSA9IHJlcXVpcmUucmVzb2x2ZSAnLi9maXh0dXJlcy9zYW1wbGUtaW52YWxpZC5qcydcblxuICBiZWZvcmVFYWNoIC0+XG4gICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZShcImxhbmd1YWdlLWphdmFzY3JpcHRcIilcblxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoXCJyZWFjdFwiKVxuXG4gICAgYWZ0ZXJFYWNoIC0+XG4gICAgICBhdG9tLnBhY2thZ2VzLmRlYWN0aXZhdGVQYWNrYWdlcygpXG4gICAgICBhdG9tLnBhY2thZ2VzLnVubG9hZFBhY2thZ2VzKClcblxuICBkZXNjcmliZSBcInNob3VsZCBzZWxlY3QgY29ycmVjdCBncmFtbWFyXCIsIC0+XG4gICAgaXQgXCJzaG91bGQgc2VsZWN0IHNvdXJjZS5qcy5qc3ggaWYgZmlsZSBoYXMgcmVxdWlyZSgncmVhY3QnKVwiLCAtPlxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oc2FtcGxlQ29ycmVjdEZpbGUsIGF1dG9JbmRlbnQ6IGZhbHNlKS50aGVuIChlZGl0b3IpIC0+XG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRHcmFtbWFyKCkuc2NvcGVOYW1lKS50b0VxdWFsICdzb3VyY2UuanMuanN4J1xuICAgICAgICAgIGVkaXRvci5kZXN0cm95KClcblxuICAgIGl0IFwic2hvdWxkIHNlbGVjdCBzb3VyY2UuanMuanN4IGlmIGZpbGUgaGFzIHJlcXVpcmUoJ3JlYWN0LW5hdGl2ZScpXCIsIC0+XG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihzYW1wbGVDb3JyZWN0TmF0aXZlRmlsZSwgYXV0b0luZGVudDogZmFsc2UpLnRoZW4gKGVkaXRvcikgLT5cbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldEdyYW1tYXIoKS5zY29wZU5hbWUpLnRvRXF1YWwgJ3NvdXJjZS5qcy5qc3gnXG4gICAgICAgICAgZWRpdG9yLmRlc3Ryb3koKVxuXG4gICAgaXQgXCJzaG91bGQgc2VsZWN0IHNvdXJjZS5qcy5qc3ggaWYgZmlsZSBoYXMgcmVxdWlyZSgncmVhY3QvYWRkb25zJylcIiwgLT5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKHNhbXBsZUNvcnJlY3RBZGRvbnNGaWxlLCBhdXRvSW5kZW50OiBmYWxzZSkudGhlbiAoZWRpdG9yKSAtPlxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0R3JhbW1hcigpLnNjb3BlTmFtZSkudG9FcXVhbCAnc291cmNlLmpzLmpzeCdcbiAgICAgICAgICBlZGl0b3IuZGVzdHJveSgpXG5cbiAgICBpdCBcInNob3VsZCBzZWxlY3Qgc291cmNlLmpzLmpzeCBpZiBmaWxlIGhhcyByZWFjdCBlczYgaW1wb3J0XCIsIC0+XG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihzYW1wbGVDb3JyZWN0RVM2RmlsZSwgYXV0b0luZGVudDogZmFsc2UpLnRoZW4gKGVkaXRvcikgLT5cbiAgICAgICAgICBleHBlY3QoZWRpdG9yLmdldEdyYW1tYXIoKS5zY29wZU5hbWUpLnRvRXF1YWwgJ3NvdXJjZS5qcy5qc3gnXG4gICAgICAgICAgZWRpdG9yLmRlc3Ryb3koKVxuXG4gICAgaXQgXCJzaG91bGQgc2VsZWN0IHNvdXJjZS5qcy5qc3ggaWYgZmlsZSBoYXMgcmVhY3QvYWRkb25zIGVzNiBpbXBvcnRcIiwgLT5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKHNhbXBsZUNvcnJlY3RBZGRvbnNFUzZGaWxlLCBhdXRvSW5kZW50OiBmYWxzZSkudGhlbiAoZWRpdG9yKSAtPlxuICAgICAgICAgIGV4cGVjdChlZGl0b3IuZ2V0R3JhbW1hcigpLnNjb3BlTmFtZSkudG9FcXVhbCAnc291cmNlLmpzLmpzeCdcbiAgICAgICAgICBlZGl0b3IuZGVzdHJveSgpXG5cbiAgICBpdCBcInNob3VsZCBzZWxlY3Qgc291cmNlLmpzIGlmIGZpbGUgZG9lc250IGhhdmUgcmVxdWlyZSgncmVhY3QnKVwiLCAtPlxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oc2FtcGxlSW52YWxpZEZpbGUsIGF1dG9JbmRlbnQ6IGZhbHNlKS50aGVuIChlZGl0b3IpIC0+XG4gICAgICAgICAgZXhwZWN0KGVkaXRvci5nZXRHcmFtbWFyKCkuc2NvcGVOYW1lKS50b0VxdWFsICdzb3VyY2UuanMnXG4gICAgICAgICAgZWRpdG9yLmRlc3Ryb3koKVxuIl19
