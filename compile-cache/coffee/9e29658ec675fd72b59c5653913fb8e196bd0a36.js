(function() {
  var TagMacher;

  TagMacher = (function() {
    TagMacher.prototype.startRegex = /\S/;

    TagMacher.prototype.endRegex = /\S(\s+)?$/;

    function TagMacher(editor) {
      this.editor = editor;
    }

    TagMacher.prototype.lineStartsWithOpeningTag = function(bufferLine) {
      var match, scopeDescriptor;
      if (match = bufferLine.match(/\S/)) {
        scopeDescriptor = this.editor.tokenForBufferPosition([bufferRow, match.index]);
        return scopeDescriptor.scopes.indexOf('tag.open.js') > -1 && scopeDescriptor.scopes.indexOf('meta.tag.attribute-name.js') === -1;
      }
      return false;
    };

    TagMacher.prototype.lineStartWithAttribute = function(bufferLine) {
      var match, scopeDescriptor;
      if (match = bufferLine.match(/\S/)) {
        scopeDescriptor = this.editor.tokenForBufferPosition([bufferRow, match.index]);
        return scopeDescriptor.scopes.indexOf('meta.tag.attribute-name.js') > -1;
      }
      return false;
    };

    TagMacher.prototype.lineStartsWithClosingTag = function(bufferRow) {
      var match, scopeDescriptor;
      if (match = bufferLine.match(/\S/)) {
        scopeDescriptor = this.editor.tokenForBufferPosition([bufferRow, match.index]);
        return scopeDescriptor.scopes.indexOf('tag.closed.js') > -1;
      }
      return false;
    };

    return TagMacher;

  })();

  module.exports = TagMacher;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL3RhbWFyYS50ZW1wbGUvLmF0b20vcGFja2FnZXMvcmVhY3QvbGliL3RhZy1tYXRjaGVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQU07d0JBQ0osVUFBQSxHQUFZOzt3QkFDWixRQUFBLEdBQVU7O0lBRUcsbUJBQUMsTUFBRDtNQUNYLElBQUMsQ0FBQSxNQUFELEdBQVU7SUFEQzs7d0JBR2Isd0JBQUEsR0FBMEIsU0FBQyxVQUFEO0FBQ3hCLFVBQUE7TUFBQSxJQUFHLEtBQUEsR0FBUSxVQUFVLENBQUMsS0FBWCxDQUFpQixJQUFqQixDQUFYO1FBQ0UsZUFBQSxHQUFrQixJQUFDLENBQUEsTUFBTSxDQUFDLHNCQUFSLENBQStCLENBQUMsU0FBRCxFQUFZLEtBQUssQ0FBQyxLQUFsQixDQUEvQjtBQUNsQixlQUFPLGVBQWUsQ0FBQyxNQUFNLENBQUMsT0FBdkIsQ0FBK0IsYUFBL0IsQ0FBQSxHQUFnRCxDQUFDLENBQWpELElBQ0EsZUFBZSxDQUFDLE1BQU0sQ0FBQyxPQUF2QixDQUErQiw0QkFBL0IsQ0FBQSxLQUFnRSxDQUFDLEVBSDFFOztBQUtBLGFBQU87SUFOaUI7O3dCQVExQixzQkFBQSxHQUF3QixTQUFDLFVBQUQ7QUFDdEIsVUFBQTtNQUFBLElBQUcsS0FBQSxHQUFRLFVBQVUsQ0FBQyxLQUFYLENBQWlCLElBQWpCLENBQVg7UUFDRSxlQUFBLEdBQWtCLElBQUMsQ0FBQSxNQUFNLENBQUMsc0JBQVIsQ0FBK0IsQ0FBQyxTQUFELEVBQVksS0FBSyxDQUFDLEtBQWxCLENBQS9CO0FBQ2xCLGVBQU8sZUFBZSxDQUFDLE1BQU0sQ0FBQyxPQUF2QixDQUErQiw0QkFBL0IsQ0FBQSxHQUErRCxDQUFDLEVBRnpFOztBQUlBLGFBQU87SUFMZTs7d0JBT3hCLHdCQUFBLEdBQTBCLFNBQUMsU0FBRDtBQUN4QixVQUFBO01BQUEsSUFBRyxLQUFBLEdBQVEsVUFBVSxDQUFDLEtBQVgsQ0FBaUIsSUFBakIsQ0FBWDtRQUNFLGVBQUEsR0FBa0IsSUFBQyxDQUFBLE1BQU0sQ0FBQyxzQkFBUixDQUErQixDQUFDLFNBQUQsRUFBWSxLQUFLLENBQUMsS0FBbEIsQ0FBL0I7QUFDbEIsZUFBTyxlQUFlLENBQUMsTUFBTSxDQUFDLE9BQXZCLENBQStCLGVBQS9CLENBQUEsR0FBa0QsQ0FBQyxFQUY1RDs7QUFJQSxhQUFPO0lBTGlCOzs7Ozs7RUFPNUIsTUFBTSxDQUFDLE9BQVAsR0FBaUI7QUE3QmpCIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgVGFnTWFjaGVyXG4gIHN0YXJ0UmVnZXg6IC9cXFMvXG4gIGVuZFJlZ2V4OiAvXFxTKFxccyspPyQvXG5cbiAgY29uc3RydWN0b3I6IChlZGl0b3IpIC0+XG4gICAgQGVkaXRvciA9IGVkaXRvclxuXG4gIGxpbmVTdGFydHNXaXRoT3BlbmluZ1RhZzogKGJ1ZmZlckxpbmUpIC0+XG4gICAgaWYgbWF0Y2ggPSBidWZmZXJMaW5lLm1hdGNoKC9cXFMvKVxuICAgICAgc2NvcGVEZXNjcmlwdG9yID0gQGVkaXRvci50b2tlbkZvckJ1ZmZlclBvc2l0aW9uKFtidWZmZXJSb3csIG1hdGNoLmluZGV4XSlcbiAgICAgIHJldHVybiBzY29wZURlc2NyaXB0b3Iuc2NvcGVzLmluZGV4T2YoJ3RhZy5vcGVuLmpzJykgPiAtMSBhbmRcbiAgICAgICAgICAgICBzY29wZURlc2NyaXB0b3Iuc2NvcGVzLmluZGV4T2YoJ21ldGEudGFnLmF0dHJpYnV0ZS1uYW1lLmpzJykgPT0gLTFcblxuICAgIHJldHVybiBmYWxzZVxuXG4gIGxpbmVTdGFydFdpdGhBdHRyaWJ1dGU6IChidWZmZXJMaW5lKSAtPlxuICAgIGlmIG1hdGNoID0gYnVmZmVyTGluZS5tYXRjaCgvXFxTLylcbiAgICAgIHNjb3BlRGVzY3JpcHRvciA9IEBlZGl0b3IudG9rZW5Gb3JCdWZmZXJQb3NpdGlvbihbYnVmZmVyUm93LCBtYXRjaC5pbmRleF0pXG4gICAgICByZXR1cm4gc2NvcGVEZXNjcmlwdG9yLnNjb3Blcy5pbmRleE9mKCdtZXRhLnRhZy5hdHRyaWJ1dGUtbmFtZS5qcycpID4gLTFcblxuICAgIHJldHVybiBmYWxzZVxuXG4gIGxpbmVTdGFydHNXaXRoQ2xvc2luZ1RhZzogKGJ1ZmZlclJvdykgLT5cbiAgICBpZiBtYXRjaCA9IGJ1ZmZlckxpbmUubWF0Y2goL1xcUy8pXG4gICAgICBzY29wZURlc2NyaXB0b3IgPSBAZWRpdG9yLnRva2VuRm9yQnVmZmVyUG9zaXRpb24oW2J1ZmZlclJvdywgbWF0Y2guaW5kZXhdKVxuICAgICAgcmV0dXJuIHNjb3BlRGVzY3JpcHRvci5zY29wZXMuaW5kZXhPZigndGFnLmNsb3NlZC5qcycpID4gLTFcblxuICAgIHJldHVybiBmYWxzZVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRhZ01hY2hlcjtcbiJdfQ==
