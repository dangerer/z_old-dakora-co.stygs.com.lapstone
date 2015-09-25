/*
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>
 */

/**
 * @author Martin Kattner <martin.kattner@gmail.com>
 */

// data-html5-*
/**
 * Plugin:
 * 
 * @version 1.0
 * @namespace
 */
var plugin_HTML5Storage = {
	config : null,

	type : {
		array : "fdasfda3"
	},

	constructor : function() {
		var dfd = $.Deferred();
		dfd.resolve();
		return dfd.promise();
	},
	pluginsLoaded : function() {
		app.debug.trace("plugin_HTML5Storage.pluginsLoaded()");
		var dfd = $.Deferred();
		dfd.resolve();
		return dfd.promise();
	},

	// called after all pages are loaded
	pagesLoaded : function() {
		app.debug.trace("plugin_HTML5Storage.pagesLoaded()");
		var dfd = $.Deferred();
		dfd.resolve();
		return dfd.promise();
	},

	definePluginEvents : function() {
		app.debug.trace("plugin_HTML5Storage.definePluginEvents()");
		// data-html5-<storage id>
		$(document).on("click", "a", function(event) {
			app.debug.alert("plugin.HTML5Storage.js plugin_HTML5Storage.definePluginEvents()", 12);
			$.each($(this).attrs(), function(key, value) {
				if (key.substring(0, 11).trim().toLowerCase() == "data-html5-") {
					app.debug.alert("plugin.HTML5Storage.js plugin_HTML5Storage.definePluginEvents() Set localStorage: " + key + " = " + value, 60);
					plugin_HTML5Storage.functions.localStorage.set(key, value);
				}
			});
			app.debug.debug("plugin_HTML5Storage.definePluginEvents() - trigger: storagefilled");
			$(this).trigger("storagefilled");
		});
	},

	// called by pages.js
	afterHtmlInjectedBeforePageComputing : function(container) {
		app.debug.trace("plugin_HTML5Storage.afterHtmlInjectedBeforePageComputing()");
	},
	pageSpecificEvents : function(container) {
		app.debug.trace("plugin_HTML5Storage.pageSpecificEvents()");
	},

	// private functions
	setDeep : function(el, key, value) {
		console.warn("Fuction is deprecated. Use: app.help.object.setDeep");
		app.debug.alert('plugin_HTML5Storage.setDeep(' + el + ', ' + key + ', ' + value + ')');
		key = key.split('.');
		var i = 0, n = key.length;
		for (; i < n - 1; ++i) {
			el = el[key[i]];
		}
		return el[key[i]] = value;
	},

	setDeepX : function(object, key, value) {
		app.debug.debug('plugin_HTML5Storage.setDeepX(' + JSON.stringify(object) + ', ' + key + ', ' + value + ')');
		var keyArray = key.split('.'), currentKey, arrayIndex, objectIndex;

		currentKey = keyArray[0];

		if (currentKey) {
			app.debug.debug("plugin_HTML5Storage.setDeepX() - case: depth >0");

			// it's an array
			if (currentKey.startsWith("_t_array_")) {
				app.debug.debug("plugin_HTML5Storage.setDeepX() - case: object is an array");

				arrayIndex = (currentKey.substring("_t_array_".length));

				app.debug.debug("plugin_HTML5Storage.setDeepX() - array index: " + arrayIndex);

				if (!Array.isArray(object)) {
					app.debug.debug("plugin_HTML5Storage.setDeepX() - array is not defined - define empty array");
					object = [];
				}

				if (keyArray.length == 1) {
					app.debug.debug("plugin_HTML5Storage.setDeepX() - case: depth 1; push value to array: " + value);
					object.push(value)
				}

				else {

					if (keyArray[1].startsWith("_t_object_")) {
						app.debug.debug("plugin_HTML5Storage.setDeepX() - next element is an object; so push empty object");
						if (!object[arrayIndex])
							object.push({});
					}

					else if (keyArray[1].startsWith("_t_array_")) {

						app.debug.debug("plugin_HTML5Storage.setDeepX() - next element is an array; so push empty array; next key: " + keyArray[1]);
						if (!object[arrayIndex])
							object.push([]);
					}

					app.debug.debug("plugin_HTML5Storage.setDeepX() - call recursively for nested array");
					object[currentKey] = this.setDeepX(object[arrayIndex], key.substr(currentKey.length + 1), value);
				}

			}

			// it's an object
			else if (currentKey.startsWith("_t_object_")) {
				app.debug.debug("plugin_HTML5Storage.setDeepX() - case: object is an object");

				objectIndex = (currentKey.substring("_t_object_".length));

				if (keyArray.length == 1) {
					app.debug.debug("plugin_HTML5Storage.setDeepX() - case: depth 1; so add the value: " + value + " to key: " + currentKey);
					object[objectIndex] = value;
				}

				else {
					if (!object[objectIndex]) {
						app.debug.debug("plugin_HTML5Storage.setDeepX() - case: object key is not defined - define empty object: " + currentKey);

						object[objectIndex] = {};
					}

					app.debug.debug("plugin_HTML5Storage.setDeepX() - call recursively for nested object");
					object[objectIndex] = this.setDeepX(object[objectIndex], key.substr(currentKey.length + 1), value);
				}
			}

			// it's a value
			else if (keyArray.length == 1) {
				app.debug.debug("plugin_HTML5Storage.setDeepX() - case: depth 1; so add the value: " + value + " to key: " + currentKey);

				app.debug.debug("plugin_HTML5Storage.setDeepX() - value type == value");

				object[currentKey] = value;
			}

			// it's the root object
			else {
				app.debug.debug("plugin_HTML5Storage.setDeepX() - case: root element");

				if (!object[currentKey]) {
					app.debug.debug("plugin_HTML5Storage.setDeepX() - case: object key is not defined - define empty object: " + currentKey);

					object[currentKey] = {};
				}

				app.debug.debug("plugin_HTML5Storage.setDeepX() - call recursively for nested object");
				object[currentKey] = this.setDeepX(object[currentKey], key.substr(currentKey.length + 1), value);
			}
		}
		return object;
	},

	getDeep : function(el, key) {
		console.warn("Fuction is deprecated. Use: app.help.object.getDeep");
		app.debug.alert('plugin_HTML5Storage.getDeep(' + el + ', ' + key + ')');
		key = key.split('.');
		var i = 0, n = key.length;
		for (; i < n; ++i) {
			el = el[key[i]];
		}
		return el;
	},

	parseValue : function(value) {
		app.debug.trace('plugin_HTML5Storage.parseValue()');
		switch (value) {
		// is true?
		case "true":

			app.debug.alert('plugin_HTML5Storage.parseValue() - case: value == true');
			value = true;
			break;

		// is false?
		case "false":

			app.debug.alert('plugin_HTML5Storage.parseValue() - case: value == false');
			value = false;
			break;

		// is null?
		case "null":

			app.debug.alert('plugin_HTML5Storage.parseValue() - case: value == null');
			value = null;
			break;

		default:
			app.debug.alert('plugin_HTML5Storage.parseValue() - case: default');

			if (/^(\+|\-){0,1}([0-9])+$/.test(value)) {

				app.debug.alert('plugin_HTML5Storage.parseValue() - case: typeof value == integer');
				value = parseInt(value);
			}

			else if (/^(\+|\-){0,1}([0-9])+(\.){1}([0-9])+$/.test(value)) {

				app.debug.alert('plugin_HTML5Storage.parseValue() - case: typeof value == float');
				value = parseFloat(value);
			}

			else {

				app.debug.alert('plugin_HTML5Storage.parseValue() - case: value == ???');

			}
			// is float?

			break;
		}

		app.debug.alert('plugin_HTML5Storage.parseValue() - return: ' + value);
		return value;
	},

	getSpace : function(length) {
		app.debug.trace('plugin_HTML5Storage.getSpace()');
		var string = "";
		for (var i = 0; i < length; i++)
			string = string + " ";
		return string;
	},

	// public functions
	functions : {
		pufferedFormValuePrefix : "pufferedFormValue-",

		localStorage : {
			set : function(key, val) {
				app.debug.trace('plugin_HTML5Storage.functions.localStorage.set()');
				key = key.toLowerCase();
				window.localStorage.setItem(app.config.name + "." + key, val);
				return true;
			},
			get : function(key) {
				app.debug.trace('plugin_HTML5Storage.functions.localStorage.get()');
				key = key.toLowerCase();
				return plugin_HTML5Storage.parseValue(window.localStorage.getItem(app.config.name + "." + key));
			},
			clear : function() {
				app.debug.trace('plugin_HTML5Storage.functions.localStorage.clear()');
				// window.localStorage.clear();
				$.each(window.localStorage, function(key, value) {
					if (key.substring(0, app.config.name.length) == app.config.name) {
						window.localStorage.removeItem(key);
					}
				});
				return true;
			},
			clearHtml5 : function() {
				app.debug.trace('plugin_HTML5Storage.functions.localStorage.clearHtml5()');
				$.each(window.localStorage, function(key, value) {
					if (key.substr(app.config.name.length + 1, 10) == "data-html5") {
						try {
							window.localStorage.removeItem(key.trim())
						} catch (err) {
							alert(err);
						}
					}
				});
				return true;
			},

			pufferFormValues : function(container) {
				app.debug.trace('plugin_HTML5Storage.functions.localStorage.pufferFormValues()');
				container.find("input[type=text], input[type=password]").each(function(elementNumber, element) {
					plugin_HTML5Storage.functions.localStorage.set(plugin_HTML5Storage.functions.pufferedFormValuePrefix + container.attr("id") + "__" + $(element).attr("id"), $(element).val());
				});
			},
			getPufferedFormValue : function(container, id) {
				app.debug.trace('plugin_HTML5Storage.functions.localStorage.getPufferedFormValue()');
				var containerId;
				if (typeof container == "object")
					containerId = container.attr("id");
				else
					containerId = container;
				return plugin_HTML5Storage.functions.localStorage.get(plugin_HTML5Storage.functions.pufferedFormValuePrefix + containerId + "__" + id);
			},
			restorePufferedFormValues : function(container) {
				app.debug.trace('plugin_HTML5Storage.functions.localStorage.restorePufferedFormValues()');
				container.find("input[type=text]").each(function(elementNumber, element) {
					var id, value;
					id = $(element).attr("id");
					value = plugin_HTML5Storage.functions.localStorage.getPufferedFormValue(container, id);
					$(element).val(value);
				});
			},
			clearPufferedFormValues : function() {
				app.debug.trace('plugin_HTML5Storage.functions.localStorage.clearPufferedFormValues()');
				var newkey;
				$.each(window.localStorage, function(key, value) {
					if (key.substring(0, app.config.name.length) == app.config.name) {
						newkey = key.substring(app.config.name.length + 1);
						var comp1, comp2;
						comp1 = newkey.substring(0, plugin_HTML5Storage.functions.pufferedFormValuePrefix.length).toLowerCase();
						comp2 = plugin_HTML5Storage.functions.pufferedFormValuePrefix.toLowerCase();
						// console.log(comp1 + " == " + comp2);
						// console.log(comp2);
						if (comp1 == comp2) {
							// alert("dsasd");
							window.localStorage.removeItem(key);
						}
					}
				});
			},
			removeItem : function(key) {
				app.debug.trace('plugin_HTML5Storage.functions.localStorage.removeItem()');
				var keyPrefix, storagePrefix;

				if (key.indexOf("*") != -1) {

					app.debug.debug('plugin_HTML5Storage.functions.localStorage.removeItem() - wildcard detected: *');

					keyPrefix = key.substring(0, key.indexOf("*")).toLowerCase();

					$.each(window.localStorage, function(key, value) {

						storagePrefix = key.substr(app.config.name.length + 1, keyPrefix.length).toLowerCase();

						app.debug.debug('plugin_HTML5Storage.functions.localStorage.removeItem() - ' + storagePrefix + ' == ' + keyPrefix);

						if (storagePrefix == keyPrefix) {
							app.debug.debug('plugin_HTML5Storage.functions.localStorage.removeItem() - case: ' + storagePrefix + ' == ' + keyPrefix);

							try {
								window.localStorage.removeItem(key.trim())
							} catch (err) {
								alert(err);
							}
						}
					});
				}

				else {
					window.localStorage.removeItem(app.config.name + "." + key);
				}

				return true;
			},
			show : function() {
				app.debug.trace('plugin_HTML5Storage.functions.localStorage.show()');
				var string = '', i = 0;
				$.each(window.localStorage, function(key, value) {
					if (key.substring(0, app.config.name.length) == app.config.name) {
						string += key + "\n" + plugin_HTML5Storage.getSpace(app.config.name.length + 1) + key.substring(app.config.name.length + 1) + " = " + value + "\n";
						i++;
					} else {
						string += key + " = " + value + "\n";
						i++;
					}
					/*
					 * if (i % 20 == 0) { alert(string); string = ""; }
					 */
				});
				return string;
			},
			log : function() {
				app.debug.trace('plugin_HTML5Storage.functions.localStorage.log()');
				$.each(window.localStorage, function(key, value) {
					if (key.substring(0, app.config.name.length) == app.config.name) {
						app.debug.log(key.substring(app.config.name.length + 1) + " = " + value);
					}
				});
			},
			setObject : function(name, object) {
				app.debug.trace('plugin_HTML5Storage.functions.localStorage.setObject()');
				app.debug.debug('plugin_HTML5Storage.functions.localStorage.setObject(' + name + ', ' + JSON.stringify(object) + ')');

				name = name.toLowerCase();

				$.each(object, function(key, value) {

					app.debug.debug("plugin_HTML5Storage.functions.localStorage.setObject() - element: " + key + " = " + value);

					if (Array.isArray(object)) {
						key = "_t_array_" + key;
					}

					else if ($.isPlainObject(object)) {
						key = "_t_object_" + key;
					}

					if (typeof value == "object" && value != null) {
						app.debug.debug("plugin_HTML5Storage.functions.localStorage.setObject() - nested object");
						plugin_HTML5Storage.functions.localStorage.setObject((name + "." + key).trim(), value);
					}

					else {
						plugin_HTML5Storage.functions.localStorage.set((name + "." + key).trim(), value);
					}
				});
				// app.store.localStorage.show();
				return true;
			},

			getObject : function(name) {
				app.debug.trace('plugin_HTML5Storage.functions.localStorage.getObject()');
				app.debug.debug('plugin_HTML5Storage.functions.localStorage.getObject("' + name + '")');

				name = name.toLowerCase();

				var object = {}, compNameOfLocalStorage;
				$.each(window.localStorage, function(key, value) {
					var storageKey, storageValue, compNameOfLocalStorage;
					app.debug.debug("plugin_HTML5Storage.functions.localStorage.getObject() - element: " + key + " = " + value);

					compNameOfLocalStorage = key.substr(app.config.name.length + 1, name.length).trim();

					if (compNameOfLocalStorage == name.trim()) {
						app.debug.debug("plugin_HTML5Storage.functions.localStorage.getObject() - found part of object: " + compNameOfLocalStorage);

						storageKey = key.substr(app.config.name.length + 1);
						app.debug.debug("plugin_HTML5Storage.functions.localStorage.getObject() - storage key: " + storageKey);

						storageValue = plugin_HTML5Storage.functions.localStorage.get(key.substr(app.config.name.length + 1));
						app.debug.debug("plugin_HTML5Storage.functions.localStorage.getObject() - storage value: " + storageValue);

						object = plugin_HTML5Storage.setDeepX(object, storageKey, storageValue);
					}
				});

				if (object[name] != undefined)
					return object[name];
				else {
					return null;
				}
			},
			removeObject : function(name) {
				name = name.toLowerCase();
				app.debug.trace("plugin_HTML5Storage.functions.localStorage.removeObject()");
				var success = true;
				$.each(window.localStorage, function(key, value) {
					if (key.substr(app.config.name.length + 1, name.length) == name.trim()) {
						try {
							window.localStorage.removeItem(key.trim())
						} catch (err) {
							alert(err);
							success = false;
						}
					}
				});
				return success;
			},
			getList : function(identifier) {
				app.debug.trace('plugin_HTML5Storage.functions.localStorage.getList()');
				var list = {};
				$.each(window.localStorage, function(key, value) {
					if (key.substr(app.config.name.length + 1, identifier.length) == identifier) {
						list[key.substr(app.config.name.length + 1)] = plugin_HTML5Storage.functions.localStorage.get(key.substr(app.config.name.length + 1));
					}
				});
				return list;
			}
		},
		sessionStorage : {
			set : function(key, val) {
				app.debug.trace('plugin_HTML5Storage.functions.sessionStorage.set()');
				window.sessionStorage.setItem(key, val);
			},
			get : function(key) {
				app.debug.trace('plugin_HTML5Storage.functions.sessionStorage.get()');
				window.sessionStorage.getItem(key);
			},
			clear : function() {
				window.sessionStorage.clear();
			},
			removeItem : function(key) {
				window.sessionStorage.removeItem(key);
			},
			show : function() {

			}
		},
		ss : this.sessionStorage,

	}
};