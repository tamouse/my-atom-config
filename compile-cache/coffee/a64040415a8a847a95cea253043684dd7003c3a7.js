(function() {
  describe("Tag autocomplete tests", function() {
    var buffer, editor, languageMode, ref;
    ref = [], editor = ref[0], buffer = ref[1], languageMode = ref[2];
    beforeEach(function() {
      waitsForPromise(function() {
        return atom.packages.activatePackage("react");
      });
      waitsForPromise(function() {
        return atom.workspace.open("foofoo", {
          autoIndent: false
        }).then(function(o) {
          var grammar;
          editor = o;
          buffer = editor.buffer, languageMode = editor.languageMode;
          grammar = atom.grammars.grammarForScopeName("source.js.jsx");
          return editor.setGrammar(grammar);
        });
      });
      return afterEach(function() {
        atom.packages.deactivatePackages();
        return atom.packages.unloadPackages();
      });
    });
    return describe("tag handling", function() {
      it("should autocomplete tag", function() {
        editor.insertText('<p');
        editor.insertText('>');
        return expect(editor.getText()).toBe('<p></p>');
      });
      it("should not autocomplete tag attributes", function() {
        editor.insertText('<p attr={ 1');
        editor.insertText('>');
        return expect(editor.getText()).toBe('<p attr={ 1>');
      });
      it("should not autocomplete tag attributes with arrow functions", function() {
        editor.insertText('<p attr={number =');
        editor.insertText('>');
        return expect(editor.getText()).toBe('<p attr={number =>');
      });
      it("should not autocomplete tag attributes when insterted between", function() {
        editor.insertText('<p attr={ 1 }');
        editor.setCursorBufferPosition([0, 11]);
        editor.insertText('>');
        return expect(editor.getText()).toBe('<p attr={ 1> }');
      });
      it("should remove closing tag", function() {
        editor.insertText('<p');
        editor.insertText('>');
        expect(editor.getText()).toBe('<p></p>');
        editor.backspace();
        return expect(editor.getText()).toBe('<p');
      });
      return it("should add extra line break when new line added between open and close tag", function() {
        editor.insertText('<p></p>');
        editor.setCursorBufferPosition([0, 3]);
        editor.insertText('\n');
        expect(editor.buffer.getLines()[0]).toBe('<p>');
        expect(editor.buffer.getLines()[2]).toBe('</p>');
        editor.setText("");
        editor.insertText('<p\n  attr=""></p>');
        editor.setCursorBufferPosition([1, 10]);
        editor.insertText('\n');
        expect(editor.buffer.getLines()[0]).toBe('<p');
        expect(editor.buffer.getLines()[1]).toBe('  attr="">');
        return expect(editor.buffer.getLines()[3]).toBe('</p>');
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3RhbWFyYS50ZW1wbGUvLmF0b20vcGFja2FnZXMvcmVhY3Qvc3BlYy9hdXRvY29tcGxldGUtc3BlYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQSxRQUFBLENBQVMsd0JBQVQsRUFBbUMsU0FBQTtBQUNqQyxRQUFBO0lBQUEsTUFBaUMsRUFBakMsRUFBQyxlQUFELEVBQVMsZUFBVCxFQUFpQjtJQUVqQixVQUFBLENBQVcsU0FBQTtNQUNULGVBQUEsQ0FBZ0IsU0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixPQUE5QjtNQURjLENBQWhCO01BR0EsZUFBQSxDQUFnQixTQUFBO2VBQ1osSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLFFBQXBCLEVBQThCO1VBQUEsVUFBQSxFQUFZLEtBQVo7U0FBOUIsQ0FBZ0QsQ0FBQyxJQUFqRCxDQUFzRCxTQUFDLENBQUQ7QUFDcEQsY0FBQTtVQUFBLE1BQUEsR0FBUztVQUNSLHNCQUFELEVBQVM7VUFDVCxPQUFBLEdBQVUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxtQkFBZCxDQUFrQyxlQUFsQztpQkFDVixNQUFNLENBQUMsVUFBUCxDQUFrQixPQUFsQjtRQUpvRCxDQUF0RDtNQURZLENBQWhCO2FBT0EsU0FBQSxDQUFVLFNBQUE7UUFDUixJQUFJLENBQUMsUUFBUSxDQUFDLGtCQUFkLENBQUE7ZUFDQSxJQUFJLENBQUMsUUFBUSxDQUFDLGNBQWQsQ0FBQTtNQUZRLENBQVY7SUFYUyxDQUFYO1dBZUEsUUFBQSxDQUFTLGNBQVQsRUFBeUIsU0FBQTtNQUN2QixFQUFBLENBQUcseUJBQUgsRUFBOEIsU0FBQTtRQUM1QixNQUFNLENBQUMsVUFBUCxDQUFrQixJQUFsQjtRQUNBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEdBQWxCO2VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFNBQTlCO01BSDRCLENBQTlCO01BS0EsRUFBQSxDQUFHLHdDQUFILEVBQTZDLFNBQUE7UUFDM0MsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsYUFBbEI7UUFDQSxNQUFNLENBQUMsVUFBUCxDQUFrQixHQUFsQjtlQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixjQUE5QjtNQUgyQyxDQUE3QztNQUtBLEVBQUEsQ0FBRyw2REFBSCxFQUFrRSxTQUFBO1FBQ2hFLE1BQU0sQ0FBQyxVQUFQLENBQWtCLG1CQUFsQjtRQUNBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEdBQWxCO2VBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLG9CQUE5QjtNQUhnRSxDQUFsRTtNQUtBLEVBQUEsQ0FBRywrREFBSCxFQUFvRSxTQUFBO1FBQ2xFLE1BQU0sQ0FBQyxVQUFQLENBQWtCLGVBQWxCO1FBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFHLEVBQUgsQ0FBL0I7UUFDQSxNQUFNLENBQUMsVUFBUCxDQUFrQixHQUFsQjtlQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixnQkFBOUI7TUFKa0UsQ0FBcEU7TUFNQSxFQUFBLENBQUcsMkJBQUgsRUFBZ0MsU0FBQTtRQUM5QixNQUFNLENBQUMsVUFBUCxDQUFrQixJQUFsQjtRQUNBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEdBQWxCO1FBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBUCxDQUF3QixDQUFDLElBQXpCLENBQThCLFNBQTlCO1FBQ0EsTUFBTSxDQUFDLFNBQVAsQ0FBQTtlQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVAsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixJQUE5QjtNQUw4QixDQUFoQzthQU9BLEVBQUEsQ0FBRyw0RUFBSCxFQUFpRixTQUFBO1FBQy9FLE1BQU0sQ0FBQyxVQUFQLENBQWtCLFNBQWxCO1FBQ0EsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsQ0FBRCxFQUFHLENBQUgsQ0FBL0I7UUFDQSxNQUFNLENBQUMsVUFBUCxDQUFrQixJQUFsQjtRQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQWQsQ0FBQSxDQUF5QixDQUFBLENBQUEsQ0FBaEMsQ0FBbUMsQ0FBQyxJQUFwQyxDQUF5QyxLQUF6QztRQUNBLE1BQUEsQ0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQWQsQ0FBQSxDQUF5QixDQUFBLENBQUEsQ0FBaEMsQ0FBbUMsQ0FBQyxJQUFwQyxDQUF5QyxNQUF6QztRQUVBLE1BQU0sQ0FBQyxPQUFQLENBQWUsRUFBZjtRQUNBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLG9CQUFsQjtRQUNBLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLENBQUQsRUFBRyxFQUFILENBQS9CO1FBQ0EsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsSUFBbEI7UUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFkLENBQUEsQ0FBeUIsQ0FBQSxDQUFBLENBQWhDLENBQW1DLENBQUMsSUFBcEMsQ0FBeUMsSUFBekM7UUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFkLENBQUEsQ0FBeUIsQ0FBQSxDQUFBLENBQWhDLENBQW1DLENBQUMsSUFBcEMsQ0FBeUMsWUFBekM7ZUFDQSxNQUFBLENBQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFkLENBQUEsQ0FBeUIsQ0FBQSxDQUFBLENBQWhDLENBQW1DLENBQUMsSUFBcEMsQ0FBeUMsTUFBekM7TUFiK0UsQ0FBakY7SUE3QnVCLENBQXpCO0VBbEJpQyxDQUFuQztBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiZGVzY3JpYmUgXCJUYWcgYXV0b2NvbXBsZXRlIHRlc3RzXCIsIC0+XG4gIFtlZGl0b3IsIGJ1ZmZlciwgbGFuZ3VhZ2VNb2RlXSA9IFtdXG5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoXCJyZWFjdFwiKVxuXG4gICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oXCJmb29mb29cIiwgYXV0b0luZGVudDogZmFsc2UpLnRoZW4gKG8pIC0+XG4gICAgICAgICAgZWRpdG9yID0gb1xuICAgICAgICAgIHtidWZmZXIsIGxhbmd1YWdlTW9kZX0gPSBlZGl0b3JcbiAgICAgICAgICBncmFtbWFyID0gYXRvbS5ncmFtbWFycy5ncmFtbWFyRm9yU2NvcGVOYW1lKFwic291cmNlLmpzLmpzeFwiKVxuICAgICAgICAgIGVkaXRvci5zZXRHcmFtbWFyKGdyYW1tYXIpO1xuXG4gICAgYWZ0ZXJFYWNoIC0+XG4gICAgICBhdG9tLnBhY2thZ2VzLmRlYWN0aXZhdGVQYWNrYWdlcygpXG4gICAgICBhdG9tLnBhY2thZ2VzLnVubG9hZFBhY2thZ2VzKClcblxuICBkZXNjcmliZSBcInRhZyBoYW5kbGluZ1wiLCAtPlxuICAgIGl0IFwic2hvdWxkIGF1dG9jb21wbGV0ZSB0YWdcIiwgLT5cbiAgICAgIGVkaXRvci5pbnNlcnRUZXh0KCc8cCcpXG4gICAgICBlZGl0b3IuaW5zZXJ0VGV4dCgnPicpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSgnPHA+PC9wPicpXG5cbiAgICBpdCBcInNob3VsZCBub3QgYXV0b2NvbXBsZXRlIHRhZyBhdHRyaWJ1dGVzXCIsIC0+XG4gICAgICBlZGl0b3IuaW5zZXJ0VGV4dCgnPHAgYXR0cj17IDEnKVxuICAgICAgZWRpdG9yLmluc2VydFRleHQoJz4nKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUoJzxwIGF0dHI9eyAxPicpXG5cbiAgICBpdCBcInNob3VsZCBub3QgYXV0b2NvbXBsZXRlIHRhZyBhdHRyaWJ1dGVzIHdpdGggYXJyb3cgZnVuY3Rpb25zXCIsIC0+XG4gICAgICBlZGl0b3IuaW5zZXJ0VGV4dCgnPHAgYXR0cj17bnVtYmVyID0nKVxuICAgICAgZWRpdG9yLmluc2VydFRleHQoJz4nKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUoJzxwIGF0dHI9e251bWJlciA9PicpXG5cbiAgICBpdCBcInNob3VsZCBub3QgYXV0b2NvbXBsZXRlIHRhZyBhdHRyaWJ1dGVzIHdoZW4gaW5zdGVydGVkIGJldHdlZW5cIiwgLT5cbiAgICAgIGVkaXRvci5pbnNlcnRUZXh0KCc8cCBhdHRyPXsgMSB9JylcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbMCwxMV0pXG4gICAgICBlZGl0b3IuaW5zZXJ0VGV4dCgnPicpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSgnPHAgYXR0cj17IDE+IH0nKVxuXG4gICAgaXQgXCJzaG91bGQgcmVtb3ZlIGNsb3NpbmcgdGFnXCIsIC0+XG4gICAgICBlZGl0b3IuaW5zZXJ0VGV4dCgnPHAnKVxuICAgICAgZWRpdG9yLmluc2VydFRleHQoJz4nKVxuICAgICAgZXhwZWN0KGVkaXRvci5nZXRUZXh0KCkpLnRvQmUoJzxwPjwvcD4nKVxuICAgICAgZWRpdG9yLmJhY2tzcGFjZSgpXG4gICAgICBleHBlY3QoZWRpdG9yLmdldFRleHQoKSkudG9CZSgnPHAnKVxuXG4gICAgaXQgXCJzaG91bGQgYWRkIGV4dHJhIGxpbmUgYnJlYWsgd2hlbiBuZXcgbGluZSBhZGRlZCBiZXR3ZWVuIG9wZW4gYW5kIGNsb3NlIHRhZ1wiLCAtPlxuICAgICAgZWRpdG9yLmluc2VydFRleHQoJzxwPjwvcD4nKVxuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFswLDNdKVxuICAgICAgZWRpdG9yLmluc2VydFRleHQoJ1xcbicpXG4gICAgICBleHBlY3QoZWRpdG9yLmJ1ZmZlci5nZXRMaW5lcygpWzBdKS50b0JlKCc8cD4nKVxuICAgICAgZXhwZWN0KGVkaXRvci5idWZmZXIuZ2V0TGluZXMoKVsyXSkudG9CZSgnPC9wPicpXG5cbiAgICAgIGVkaXRvci5zZXRUZXh0KFwiXCIpO1xuICAgICAgZWRpdG9yLmluc2VydFRleHQoJzxwXFxuICBhdHRyPVwiXCI+PC9wPicpXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oWzEsMTBdKVxuICAgICAgZWRpdG9yLmluc2VydFRleHQoJ1xcbicpXG4gICAgICBleHBlY3QoZWRpdG9yLmJ1ZmZlci5nZXRMaW5lcygpWzBdKS50b0JlKCc8cCcpXG4gICAgICBleHBlY3QoZWRpdG9yLmJ1ZmZlci5nZXRMaW5lcygpWzFdKS50b0JlKCcgIGF0dHI9XCJcIj4nKVxuICAgICAgZXhwZWN0KGVkaXRvci5idWZmZXIuZ2V0TGluZXMoKVszXSkudG9CZSgnPC9wPicpXG4iXX0=
