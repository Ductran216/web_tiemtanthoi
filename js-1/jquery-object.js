function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * jQuery.query - Query String Modification and Creation for jQuery
 * Written by Blair Mitchelmore (blair DOT mitchelmore AT gmail DOT com)
 * Licensed under the WTFPL (http://sam.zoy.org/wtfpl/).
 * Date: 2009/8/13
 *
 * @author Blair Mitchelmore
 * @version 2.2.3
 *
 **/
new function (settings) {
  // Various Settings
  var $separator = settings.separator || '&';
  var $spaces = settings.spaces === false ? false : true;
  var $suffix = settings.suffix === false ? '' : '[]';
  var $prefix = settings.prefix === false ? false : true;
  var $hash = $prefix ? settings.hash === true ? "#" : "?" : "";
  var $numbers = settings.numbers === false ? false : true;
  jQuery.query = new function () {
    var is = function is(o, t) {
      return o != undefined && o !== null && (!!t ? o.constructor == t : true);
    };

    var parse = function parse(path) {
      var m,
          rx = /\[([^[]*)\]/g,
          match = /^([^[]+)(\[.*\])?$/.exec(path),
          base = match[1],
          tokens = [];

      while (m = rx.exec(match[2])) {
        tokens.push(m[1]);
      }

      return [base, tokens];
    };

    var set = function set(target, tokens, value) {
      var o,
          token = tokens.shift();
      if (_typeof(target) != 'object') target = null;

      if (token === "") {
        if (!target) target = [];

        if (is(target, Array)) {
          target.push(tokens.length == 0 ? value : set(null, tokens.slice(0), value));
        } else if (is(target, Object)) {
          var i = 0;

          while (target[i++] != null) {
            ;
          }

          target[--i] = tokens.length == 0 ? value : set(target[i], tokens.slice(0), value);
        } else {
          target = [];
          target.push(tokens.length == 0 ? value : set(null, tokens.slice(0), value));
        }
      } else if (token && token.match(/^\s*[0-9]+\s*$/)) {
        var index = parseInt(token, 10);
        if (!target) target = [];
        target[index] = tokens.length == 0 ? value : set(target[index], tokens.slice(0), value);
      } else if (token) {
        var index = token.replace(/^\s*|\s*$/g, "");
        if (!target) target = {};

        if (is(target, Array)) {
          var temp = {};

          for (var i = 0; i < target.length; ++i) {
            temp[i] = target[i];
          }

          target = temp;
        }

        target[index] = tokens.length == 0 ? value : set(target[index], tokens.slice(0), value);
      } else {
        return value;
      }

      return target;
    };

    var queryObject = function queryObject(a) {
      var self = this;
      self.keys = {};

      if (a.queryObject) {
        jQuery.each(a.get(), function (key, val) {
          self.SET(key, val);
        });
      } else {
        self.parseNew.apply(self, arguments);
      }

      return self;
    };

    queryObject.prototype = {
      queryObject: true,
      parseNew: function parseNew() {
        var self = this;
        self.keys = {};
        jQuery.each(arguments, function () {
          var q = "" + this;
          q = q.replace(/^[?#]/, ''); // remove any leading ? || #

          q = q.replace(/[;&]$/, ''); // remove any trailing & || ;

          if ($spaces) q = q.replace(/[+]/g, ' '); // replace +'s with spaces

          jQuery.each(q.split(/[&;]/), function () {
            var key = decodeURIComponent(this.split('=')[0] || "");
            var val = decodeURIComponent(this.split('=')[1] || "");
            if (!key) return;

            if ($numbers) {
              if (/^[+-]?[0-9]+\.[0-9]*$/.test(val)) // simple float regex
                val = parseFloat(val);else if (/^[+-]?[1-9][0-9]*$/.test(val)) // simple int regex
                val = parseInt(val, 10);
            }

            val = !val && val !== 0 ? true : val;
            self.SET(key, val);
          });
        });
        return self;
      },
      has: function has(key, type) {
        var value = this.get(key);
        return is(value, type);
      },
      GET: function GET(key) {
        if (!is(key)) return this.keys;
        var parsed = parse(key),
            base = parsed[0],
            tokens = parsed[1];
        var target = this.keys[base];

        while (target != null && tokens.length != 0) {
          target = target[tokens.shift()];
        }

        return typeof target == 'number' ? target : target || "";
      },
      get: function get(key) {
        var target = this.GET(key);
        if (is(target, Object)) return jQuery.extend(true, {}, target);else if (is(target, Array)) return target.slice(0);
        return target;
      },
      SET: function SET(key, val) {
        var value = !is(val) ? null : val;
        var parsed = parse(key),
            base = parsed[0],
            tokens = parsed[1];
        var target = this.keys[base];
        this.keys[base] = set(target, tokens.slice(0), value);
        return this;
      },
      set: function set(key, val) {
        return this.copy().SET(key, val);
      },
      REMOVE: function REMOVE(key, val) {
        if (val) {
          var target = this.GET(key);

          if (is(target, Array)) {
            for (tval in target) {
              target[tval] = target[tval].toString();
            }

            var index = $.inArray(val, target);

            if (index >= 0) {
              key = target.splice(index, 1);
              key = key[index];
            } else {
              return;
            }
          } else if (val != target) {
            return;
          }
        }

        return this.SET(key, null).COMPACT();
      },
      remove: function remove(key, val) {
        return this.copy().REMOVE(key, val);
      },
      EMPTY: function EMPTY() {
        var self = this;
        jQuery.each(self.keys, function (key, value) {
          delete self.keys[key];
        });
        return self;
      },
      load: function load(url) {
        var hash = url.replace(/^.*?[#](.+?)(?:\?.+)?$/, "$1");
        var search = url.replace(/^.*?[?](.+?)(?:#.+)?$/, "$1");
        return new queryObject(url.length == search.length ? '' : search, url.length == hash.length ? '' : hash);
      },
      empty: function empty() {
        return this.copy().EMPTY();
      },
      copy: function copy() {
        return new queryObject(this);
      },
      COMPACT: function COMPACT() {
        function build(orig) {
          var obj = _typeof(orig) == "object" ? is(orig, Array) ? [] : {} : orig;

          if (_typeof(orig) == 'object') {
            var add = function add(o, key, value) {
              if (is(o, Array)) o.push(value);else o[key] = value;
            };

            jQuery.each(orig, function (key, value) {
              if (!is(value)) return true;
              add(obj, key, build(value));
            });
          }

          return obj;
        }

        this.keys = build(this.keys);
        return this;
      },
      compact: function compact() {
        return this.copy().COMPACT();
      },
      toString: function toString() {
        var i = 0,
            queryString = [],
            chunks = [],
            self = this;

        var encode = function encode(str) {
          str = str + "";
          str = encodeURIComponent(str);
          if ($spaces) str = str.replace(/%20/g, "+");
          return str;
        };

        var addFields = function addFields(arr, key, value) {
          if (!is(value) || value === false) return;
          var o = [encode(key)];

          if (value !== true) {
            o.push("=");
            o.push(encode(value));
          }

          arr.push(o.join(""));
        };

        var build = function build(obj, base) {
          var newKey = function newKey(key) {
            return !base || base == "" ? [key].join("") : [base, "[", key, "]"].join("");
          };

          jQuery.each(obj, function (key, value) {
            if (_typeof(value) == 'object') build(value, newKey(key));else addFields(chunks, newKey(key), value);
          });
        };

        build(this.keys);
        if (chunks.length > 0) queryString.push($hash);
        queryString.push(chunks.join($separator));
        return queryString.join("");
      }
    };
    return new queryObject(location.search, location.hash);
  }();
}(jQuery.query || {}); // Pass in jQuery.query as settings object
