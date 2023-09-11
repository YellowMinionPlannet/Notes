const crypto = require("node:crypto");

/**
 * Custom Handlebars helpers
 * @param {Object} fractal Fractal instance
 * @param {string} [version] Package version
 * @returns {Object} Handlebars helpers
 */
module.exports = function (fractal, version = "") {
  return {
    componentList: function () {
      let ret = "<ul>";
      const options = Array.from(arguments).pop();
      for (let component of fractal.components.flatten()) {
        ret = ret + "<li>";
        ret = ret + "<ul>";
        for (const [key, value] of Object.entries(component.variants)) {
          ret = ret + "<li>" + `${key}: ${value}` + "</li>";
        }
        ret = ret + "</ul>" + "</li>";
      }
      return ret + "</ul>";
    },
    /**
     * Interpolate a string.
     * @param {string} template - The template string to interpolate, with keys in the format %{key}.
     * @param {object} data - An object containing the keys and values to replace in the template.
     * @returns {string} - The interpolated string.
     */
    interpolateString: (template, data) =>
      template.replace(/%{(\w+)}/g, (match, key) => {
        if (Object.prototype.hasOwnProperty.call(data.hash, key)) {
          return data.hash[key];
        }

        // %{key} not found, show a warning in the console and return an empty string
        // eslint-disable-next-line no-console
        console.warn(`Template error, %{${key}} not found:`, template);
        return "";
      }),
    slug: (input) => {
      if (!input || typeof input !== "string") {
        return input;
      }

      return input
        .replace(/^\s+|\s+$/g, "")
        .toLowerCase()
        .replace(/[^\d a-z-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
    },
    compareOr: (val1, val2, val3, val4, opts) =>
      val1 === val2 || val3 === val4
        ? opts.fn(opts.data.root)
        : opts.inverse(opts.data.root),
    compareAnd: (val1, val2, val3, val4, opts) =>
      val1 === val2 && val3 === val4
        ? opts.fn(opts.data.root)
        : opts.inverse(opts.data.root),
    /**
     * Handlebars Helper: if condition
     * Example usage: {{#ifCond input1 '<=' input2}} something {{/ifCond}}
     * @param {(string|number)} input1 first string or number value to compare
     * @param {(string)} operator equality operators
     * @param {(string|number)} input2 second string or number value to compare
     * @param {object} opts object options
     * @returns {object} returns boolean
     */
    // eslint-disable-next-line complexity
    ifCond: (input1, operator, input2, options) => {
      switch (operator) {
        case "==":
          // eslint-disable-next-line eqeqeq
          return input1 == input2
            ? options.fn(options)
            : options.inverse(options);
        case "===":
          return input1 === input2
            ? options.fn(options)
            : options.inverse(options);
        case "!=":
          // eslint-disable-next-line no-negated-condition, eqeqeq
          return input1 != input2
            ? options.fn(options)
            : options.inverse(options);
        case "!==":
          // eslint-disable-next-line no-negated-condition
          return input1 !== input2
            ? options.fn(options)
            : options.inverse(options);
        case "<":
          return input1 < input2
            ? options.fn(options)
            : options.inverse(options);
        case "<=":
          return input1 <= input2
            ? options.fn(options)
            : options.inverse(options);
        case ">":
          return input1 > input2
            ? options.fn(options)
            : options.inverse(options);
        case ">=":
          return input1 >= input2
            ? options.fn(options)
            : options.inverse(options);
        case "&&":
          return input1 && input2
            ? options.fn(options)
            : options.inverse(options);
        case "||":
          return input1 || input2
            ? options.fn(options)
            : options.inverse(options);
        default:
          return options.inverse(options.data.root);
      }
    },
    math: (input1, operator, input2) => {
      // If trying to add a string, convert undefined value to empty string.
      if (typeof input2 === "string") {
        input1 = typeof input1 === "undefined" ? "" : input1;
      }

      switch (operator) {
        case "+":
          return input1 + input2;
        case "-":
          return input1 - input2;
        case "*":
          return input1 * input2;
        case "/":
          return input1 / input2;
        case "%":
          return input1 % input2;
        default:
          return false;
      }
    },
    /**
     * Handlebars Helper: Short-circuit evaluation
     * Example usage: (evaluate value1 '||' 'true')
     * @param {*} input1 the first value for the logical expression
     * @param {string} operator the logical operator for the logical expression
     * @param {*} input2 the second value for the logical expression
     * @returns {object} returns the result of logical expression
     */
    evaluate: (input1, operator, input2) => {
      switch (operator) {
        case "&&":
          return input1 && input2;
        case "||":
          return input1 || input2;
        case "==":
          return input1 == input2; // eslint-disable-line eqeqeq
        case "===":
          return input1 === input2;
        case "!=":
          return input1 != input2; // eslint-disable-line eqeqeq
        case "!==":
          return input1 !== input2;
        case ">":
          return input1 > input2;
        case "<":
          return input1 < input2;
        default:
          return false;
      }
    },
    /**
     * Handlebars Helper: For Loop
     * Example usage: {{#for 0 5 1}} {{@index}} {{@indexPlusOne}} {{/for}}
     * @param {(string|number)} start start loop at this value
     * @param {(string|number)} end loop until this value
     * @param {(string|number)} incr value to increment for loop
     * @param {object} opts object options
     * @returns {object} returns data object
     */
    for: (start, end, incr, opts) => {
      start = parseInt(start, 10);
      end = parseInt(end, 10);
      incr = parseInt(incr, 10);

      let out = "";
      const data = {};

      if (end) {
        for (let i = start; i < end; i += incr) {
          data.index = i;
          data.indexPlusOne = i + 1;
          out += opts.fn(this, {
            data,
          });
        }
      } else {
        out = opts.inverse(this);
      }

      return out;
    },
    /**
     * Handlebars Helper: render html attributes
     * Example usage: {{{htmlAttr textarea.attributes}}}
     * @param {object} input object that contains key value pairs
     * @returns {string} returns formatted string of html attributes
     */
    htmlAttr: (input) => {
      if (!input || typeof input !== "object") {
        return;
      }

      let out = "";

      for (const [key, value] of Object.entries(input)) {
        if (typeof value === "boolean" && value) {
          out += `${key} `;
        } else {
          out += `${key}="${value.toString()}" `;
        }
      }

      return out.trim();
    },
    /**
     * Handlebars Helper: output an object as JSON
     * Example usage: {{{ json objectName }}}
     * @param {object} input object you want to output as JSON
     * @returns {string} returns stringified version of JSON object
     */
    json: (input) => JSON.stringify(input),
    /**
     * Handlebars Helper: defines a variable with a value
     * Example usage: {{setVar "color" "red"}}
     * @param {string} name the variable reference name to be set
     * @param {*} value the value of the variable
     * @param {object} options the handlebars options object
     */
    setVar: (name, value, options) => {
      options.data.root[name] = value;
    },
    /**
     * Handlebars Helper: returns the value of a variable from a string
     * Example usage: {{#ifCond (getVar "preset") == color}}
     * @param {string} name the variable reference name as a string
     * @param {object} options the handlebars options object
     * @returns {string} the value of the variable
     */
    getVar: (name, options) => options.data.root[name],
    /**
     * Handlebars Helper: sets a key/value on an object
     * Example usage: {{setProp this "color" "red"}}
     * @param {string} object the object reference
     * @param {string} name the property to be set
     * @param {*} value the value of the property
     */
    setProp: (object, name, value) => {
      object[name] = value;
    },
    /**
     * Handlebars Helper: merges two objects
     * Example usage: (merge attributes (object aria-controls="menuId"))
     * @param {string} object the object reference
     * @param {string} name the property to be set
     * @param {*} value the value of the property
     */
    merge: (object1, object2) => ({ ...object1, ...object2 }),
    /**
     * Handlebars Helper: returns a random unique-enough string
     * Example usage: {{uid}}
     * @returns {string} an alphanumeric string
     */
    uid: () =>
      // querySelector() uses CSS3 selectors for querying the DOM, CSS3 doesn't support ID selectors that start with a digit
      `mwf${crypto.randomBytes(4).toString("hex")}`,
    /**
     * Handlebars Helper: output a link to another Fractal page with the correct extension
     * Example usage: {{ internalLink '/components/detail/hero-regular--default' }}
     * @param {string} input link destination without exension
     * @param {Object} options object that holds optional named parameters
     * @param {string} options.hash.anchor reference to element id with #.
     * @returns {string} link with extension in production
     */
    internalLink: (input, options) => {
      const ext = process.env.NODE_ENV === "production" ? ".html" : "";
      const anchor = options.hash.anchor || "";
      const subfolderRegex = /--subfolder=(\w+)/;
      let prefix = "";

      if (subfolderRegex.test(process.argv[3])) {
        const subfolder = process.argv[3].replace("--subfolder=", "");
        prefix = subfolder === "version" ? `/${version}` : `/${subfolder}`;
      }

      return prefix + input + ext + anchor;
    },
    /**
     * Handlebars Helper: output an object from hash parameters
     * Example usage: {{ object color=red }}
     * @param {hash} hash parameters
     * @returns {object} hash parameters converted to an object
     */
    object: ({ hash }) => hash,
    /**
     * Handlebars Helper: output an array from args
     * Example usage: {{ array "red" "blue" "yellow" }}
     * @param {any} args
     * @returns {Array} args converted to an array
     */
    array: (...args) => [...args].slice(0, args.length - 1),
    /**
     * Handlebars Helper: output template from template name
     * Example usage: {{{partial template template-data}}}
     * @param {string} name template name
     * @param {object} context template data
     * @param {hash} hash parameters
     * @returns compiled template
     */
    partial: (name, context, hash) => {
      const { partials } = fractal.components._engine._engine;
      let template = partials[`@${name}`];
      if (typeof template !== "function") {
        template = fractal.components._engine._engine.compile(template);
      }
      console.log("WITHIN PARTIAL:");
      console.dir(context);
      console.dir(hash);
      return template(context, hash);
    },
    /**
     * Handlebars Helper: generates warning for partial READMEs
     * Example usage: {{ partialWarning 'Card' 'https://mwf.azurewebsites.net/catalog/card/index.html'}}
     * @param {string} parent the name of the partial's parent component
     * @param {string} url the url of the partial's parent component
     * @param {object} options the handlebars options object
     */
    partialWarning: (parent, url, options) => {
      const name = options.data.root._env.request.params.handle
        .toLowerCase() // get handle
        .split("--")[0] // remove variant name
        .split("-") // remove '-'
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1)) // capitalize first letter of each word
        .join(" ");

      if (parent && url) {
        return `${name} is part of [${parent}](${url}) and is not intended for use on its own.`;
      }

      return `${name} is not intended for use on its own.`;
    },
    /**
     * Handlebars Helper: pushes value to array
     * Example usage: {{push array value}}
     * @param {Array} array the array to push to
     * @param {any} value value to push to the array
     */
    push: (array, value) => {
      array.push(value);
    },
    /**
     * Handlebars Helper: output a string from an array
     * Example usage: {{ join myArray " " }}
     * @param {Array} array the array to join
     * @param {string} separator separator between array elements in output string
     * @returns {string} array converted to a string
     */
    join: (array, separator) => array.join(separator),
    /**
     * Handlebars Helper: checks if searchValue is present in compareValue
     * Example usage: {{contains compareValue searchValue}}
     * @param {string|array} compareValue the value to compare against
     * @param {any} searchValue value to search for
     * @returns {boolean} if value1 contains searchValue
     */
    contains: (compareValue, searchValue) =>
      compareValue.indexOf(searchValue) > -1,
    /**
     * Handlebars Helper: concatenates strings
     * Example usage: {{strConcat str1 str2}}
     * @param {string} str1 string 1
     * @param {string} str2 string 2
     * @returns {string} returns string concatenation
     */
    strConcat: (str1, str2) => str1 + str2,
    /**
     * Handlebars Helper: concatenates strings
     * Example usage: {{strConcat [string array]}}
     * @param {...string} string array of strings
     * @returns {string} returns string concatenation
     */
    strConcatArr: (...string) => {
      const strArr = [].slice.call(string, 0, -1);
      return strArr.join("");
    },
    /**
     * Handlebars Helper: concatenates space delimited strings (aka tokens)
     * Example usage: {{tokenConcat str1 str2 str3}}
     * @param {...string} args any number of string parameters
     * @returns {string} returns space delimited tokens in a string
     */
    tokenConcat: (...args) => args.slice(0, -1).join(" ").trim(),
    /**
     * Handlebars Helper: truncates strings based on character length
     * Example usage: {{truncate str length}}
     * @param {string} str string
     * @param {number} length character length to truncate
     * @param {number} [suffix] string to append after truncated string
     * @returns {string} returns a string
     */
    truncate: (str, length, suffix) => {
      if (str && str.length > length) {
        suffix = typeof suffix === "string" ? suffix : "";
        return str.slice(0, length).trim() + suffix;
      }

      return str;
    },
    /**
     * Get the current value of NODE_ENV
     * @returns {string} the environment
     */
    getEnvironment: () => process.env.NODE_ENV,
  };
};
