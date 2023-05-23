const Handlebars =
  require("./node_modules/handlebars/dist/cjs/handlebars.runtime")["default"];

Handlebars.registerHelper("loud", function (aString) {
  return aString.toUpperCase();
});

Handlebars.registerHelper("list", function (items, options) {
  console.dir(items);
  const itemsAsHtml = items.map((item) => {
    console.log(item.firstname);
    return "<li>" + options.fn(item) + "</li>";
  });
  return "<ul>\n" + itemsAsHtml.join("\n") + "\n</ul>";
});

Handlebars.registerHelper("bold", function (options) {
  return new Handlebars.SafeString(
    "<div style='font-weight:bolder'>" + options.fn(this) + "</div>"
  );
});

Handlebars.registerHelper("a", function (context, options) {
  var out = "<ul>",
    data;

  if (options.data) {
    console.dir(options.data);
    data = Handlebars.createFrame(options.data);
    console.dir(data);
  }

  for (var i = 0; i < context.length; i++) {
    if (data) {
      data.index = i;
    }

    out += "<li>" + options.fn(context[i]) + "</li>";
  }

  out += "</ul>";
  return out;
});

const expressionsTemplate = require("./expressions.handlebars");
const blocksTemplate = require("./blocks.handlebars");
const context = {
  firstname: "Lei",
  lastname: "Zhong",
  prefix: "HBS",
  staff: {
    firstname: "Yellow",
    lastname: "Minions",
  },
  people: [
    { firstname: "stuart" },
    { firstname: "kevin" },
    { firstname: "bob" },
  ],
  nav: [{ url: "foo", test: true, title: "bar" }, { url: "bar" }],
  array: [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }],
};

document.addEventListener("DOMContentLoaded", function () {
  const expressions = document.getElementById("expressions");
  expressions.innerHTML = expressionsTemplate(context);
  const blocks = document.getElementById("blocks");
  blocks.innerHTML = blocksTemplate(context);
});
