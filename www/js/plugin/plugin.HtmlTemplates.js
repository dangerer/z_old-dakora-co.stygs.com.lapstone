/**
 * Copyright (c) 2015 martin.kattner@stygs.com
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

var plugin_HtmlTemplates = {
	config : null,
	templates : {},
	constructor : function() {
		var dfd = $.Deferred();
		dfd.resolve();
		return dfd.promise();
	},
	pluginsLoaded : function() {
		app.debug.trace("plugin_HtmlTemplates.pluginsLoaded()");

		var dfd = $.Deferred(), promises = Array(), promiseOfPromises;

		$.each(plugin_HtmlTemplates.config.templates, function(key, template) {
			if (template.url != undefined) {

				if (app.config.min) {
					promises.push(globalLoader.AsyncTextLoader(template.url));
					promises.push(globalLoader.AsyncTextLoader(template.url.substr(0, template.url.lastIndexOf(".")) + "." + app.config.version.app + ".css"));
				}

				else {
					promises.push(globalLoader.AsyncTextLoader(template.url));
					promises.push(globalLoader.AsyncTextLoader(template.url.substr(0, template.url.lastIndexOf(".")) + ".css"));
				}

			}

			else {
				app.debug.debug("plugin_HtmlTemplates.pluginsLoaded() - step into context");
				$.each(plugin_HtmlTemplates.config.templates[key], function(key, template) {
					if (template.url != undefined) {

						if (app.config.min) {
							promises.push(globalLoader.AsyncTextLoader(template.url));
							promises.push(globalLoader.AsyncTextLoader(template.url.substr(0, template.url.lastIndexOf(".")) + "." + app.config.version.app + ".css"));
						}

						else {
							promises.push(globalLoader.AsyncTextLoader(template.url));
							promises.push(globalLoader.AsyncTextLoader(template.url.substr(0, template.url.lastIndexOf(".")) + ".css"));
						}

					}

				});
			}
		});

		promiseOfPromises = $.when.apply($, promises);

		promiseOfPromises.done(function() {
			var args = arguments, context, i = 0;
			$.each(plugin_HtmlTemplates.config.templates, function(key, template) {
				if (template.url != undefined) {
					plugin_HtmlTemplates.templates[key] = {};
					// console.log(i + args[i]);
					plugin_HtmlTemplates.templates[key]['html'] = (args[i]);
					i = i + 1;
					// console.log(i + args[i]);
					plugin_HtmlTemplates.templates[key]['css'] = (args[i]);
					i = i + 1;
				} else {
					context = key;
					plugin_HtmlTemplates.templates[context] = {};
					$.each(plugin_HtmlTemplates.config.templates[key], function(key, template) {
						if (template.url != undefined) {
							plugin_HtmlTemplates.templates[context][key] = {};
							// console.log(i + args[i]);
							plugin_HtmlTemplates.templates[context][key]['html'] = (args[i]);
							i = i + 1;
							// console.log(i + args[i]);
							plugin_HtmlTemplates.templates[context][key]['css'] = (args[i]);
							i = i + 1;
						}

					});
				}
			});
			dfd.resolve();
		});
		promiseOfPromises.fail(function() {
			dfd.reject();
		});

		return dfd.promise();
	},

	// called after all pages are loaded
	pagesLoaded : function() {
		app.debug.trace("plugin_HtmlTemplates.pagesLoaded()");
		var dfd = $.Deferred();
		dfd.resolve();
		return dfd.promise();
	},

	definePluginEvents : function() {
	},

	// called by pages.js
	afterHtmlInjectedBeforePageComputing : function(container) {
		app.debug.trace("plugin_HtmlTemplates.afterHtmlInjectedBeforePageComputing()");
	},
	pageSpecificEvents : function(container) {
		app.debug.trace("plugin_HtmlTemplates.pageSpecificEvents()");
	},

	getText : function(templateId, context) {
		app.debug.trace("plugin_HtmlTemplates.getText()");
		var text = null, css = null, styleIsActive;
		if (context != undefined) {
			text = plugin_HtmlTemplates.templates[context][templateId]['html'];
			css = plugin_HtmlTemplates.templates[context][templateId]['css'];
			styleIsActive = plugin_HtmlTemplates.templates[context][templateId]['styleIsActive'];
			if (styleIsActive == undefined)
				styleIsActive = plugin_HtmlTemplates.templates[context][templateId]['styleIsActive'] = false;

		} else {
			text = plugin_HtmlTemplates.templates[templateId]['html'];
			css = plugin_HtmlTemplates.templates[templateId]['css'];
			styleIsActive = plugin_HtmlTemplates.templates[templateId]['styleIsActive'];
			if (styleIsActive == undefined)
				styleIsActive = plugin_HtmlTemplates.templates[templateId]['styleIsActive'] = false;
		}

		if ($("style")[0] == undefined)
			$('head').append("<style></style>");

		if (styleIsActive === false) {
			$("style").append(css);

			if (context != undefined) {
				plugin_HtmlTemplates.templates[context][templateId]['styleIsActive'] = true;
			} else {
				plugin_HtmlTemplates.templates[templateId]['styleIsActive'] = true;
			}
		}
		app.debug.debug("plugin_HtmlTemplates.getText() - text: " + text);
		return text;
	},

	getElements : function(templateId, context) {
		app.debug.trace("plugin_HtmlTemplates.getElements()");
		var elements;
		if (context != undefined) {
			elements = plugin_HtmlTemplates.config.templates[context][templateId]['elements'];
		} else {
			elements = plugin_HtmlTemplates.config.templates[templateId]['elements'];
		}
		if (elements == undefined)
			elements = {};

		app.debug.debug("plugin_HtmlTemplates.getElements() - elements: " + JSON.stringify(elements));

		return elements;
	},

	functions : {
		get : function(templateId, context) {
			app.debug.trace("plugin_HtmlTemplates.functions.get()");
			app.debug.debug("plugin_HtmlTemplates.functions.get() - templateId: " + templateId);
			app.debug.debug("plugin_HtmlTemplates.functions.get() - context: " + context);
			return $(plugin_HtmlTemplates.getText(templateId, context));
		},
		append : function(selector, templateId, context) {
			app.debug.trace("plugin_HtmlTemplates.functions.append()");
			$(selector).append(plugin_HtmlTemplates.functions.get(templateId, context));
		},
		prepend : function(selector, templateId, context) {
			app.debug.trace("plugin_HtmlTemplates.functions.prepend()");
			$(selector).prepend(plugin_HtmlTemplates.functions.get(templateId, context));
		},
		overwrite : function(selector, templateId, context) {
			app.debug.trace("plugin_HtmlTemplates.functions.overwrite()");
			app.debug.debug("plugin_HtmlTemplates.functions.overwrite() - selector: " + selector);
			app.debug.debug("plugin_HtmlTemplates.functions.overwrite() - templateId: " + templateId);
			app.debug.debug("plugin_HtmlTemplates.functions.overwrite() - context: " + context);
			$(selector).empty();
			$(selector).attr("data-context", templateId);
			$(selector).prepend(plugin_HtmlTemplates.functions.get(templateId, context));
			app.debug.debug("plugin_HtmlTemplates.functions.overwrite() - new html code: " + $(selector)[0].outerHTML);
		},
		elements : function(templateId, context) {
			app.debug.trace("plugin_HtmlTemplates.functions.elements()");
			return plugin_HtmlTemplates.getElements(templateId, context);
		}
	}
};