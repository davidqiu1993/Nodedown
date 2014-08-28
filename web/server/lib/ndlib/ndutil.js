/**
 * Nodedown Utilities.
 *
 * Author  : David Qiu.
 * Email   : david@davidqiu.com
 * Website : www.DavidQiu.com
 *
 * Copyright (C) 2014, David Qiu.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var url = require('url');
var path = require('path');

var ndutil = {};
ndutil.system = {};
ndutil.http = {};
ndutil.fs = {};


/**
 * @param timeDigit A digit of the datetime.
 * @return The formatted datetime digit string.
 *
 * @brief
 *    Fill the formatted front zero of a datetime digit.
 */
function _formatDateTimeZero(timeDigit) {
  return (timeDigit < 10) ? ("0" + timeDigit) : ("" + timeDigit);
}


/**
 * @param str Initial substring of the string builder. 
 *            This parameter is optional.
 *
 * @brief
 *    Construct a string builder with optional initial 
 *    substring.
 */
ndutil.StringBuilder = function (str) {
  // Allocate an array for substring storage
  this._substrings = new Array();

  // Initial string of the string builder
  if (str) this._substrings.push(str);
}

/**
 * @param str The appended substring to the back of the 
 *            string builder.
 *
 * @brief
 *    Append a substring to the back of the string builder.
 */
ndutil.StringBuilder.prototype.append = function (str) {
  // Append the new substring
  if (str) this._substrings.push(str);
}

/**
 * @return The complete string built.
 *
 * @brief
 *    Construct the complete string from current string 
 *    builder.
 */
ndutil.StringBuilder.prototype.toString = function () {
  // Join the substrings and return
  return this._substrings.join("");
}


/**
 * @return A string of the current datetime.
 *
 * @brief
 *    Get the datetime of the current system clock in 
 *    formatted string.
 */
ndutil.system.getCurrentDateTime = function () {
  var dsBuilder = new ndutil.StringBuilder();
  var date = new Date();

  // The full year
  dsBuilder.append(date.getFullYear());
  dsBuilder.append("-");
  dsBuilder.append(_formatDateTimeZero(date.getMonth()));
  dsBuilder.append("-");
  dsBuilder.append(_formatDateTimeZero(date.getDate()));
  dsBuilder.append(" ");
  dsBuilder.append(_formatDateTimeZero(date.getHours()));
  dsBuilder.append(":");
  dsBuilder.append(_formatDateTimeZero(date.getMinutes()));
  dsBuilder.append(":");
  dsBuilder.append(_formatDateTimeZero(date.getSeconds()));

  // Construct the datetime string and return
  return dsBuilder.toString();
}


/**
 * @param req The HTTP request.
 * @return IP address of the client.
 *
 * @brief
 *    Get the IP address of client of a HTTP request.
 */
ndutil.http.getClientIp = function (req) {
  return req.headers['x-forwarded-for'] ||
  req.connection.remoteAddress ||
  req.socket.remoteAddress ||
  req.connection.socket.remoteAddress;
};


/**
 * @param req The HTTP request.
 * @return Hostname and port of the request.
 *
 * @brief
 *    Get the access hostname and port of a HTTP 
 *    request.
 */
ndutil.http.getHost = function (req) {
  return req.headers.host;
}


/**
 * @param req The HTTP request.
 * @return Requested url of the request.
 *
 * @brief
 *    Get the requested url of a HTTP request.
 */
ndutil.http.getUrl = function (req) {
  return req.url;
}


/**
 * @param req The HTTP request.
 * @return The request path structure element array. Each 
 *         element string of the url break.
 *
 * @brief
 *    Get the request Nodedown path structure of a HTTP 
 *    request. Postfix will be ignored.
 */
ndutil.http.getRequestPathStructure = function (req) {
  // Obtain the path name from request url
  var pathname = url.parse(req.url).pathname || '';

  // Normalize and split the url
  var reqStruct = path.normalize(pathname).split(path.sep);

  // Remove the empty elements
  while (reqStruct.length>0 && (!reqStruct[0] || reqStruct[0]=='.')) reqStruct.shift();
  while (reqStruct.length>0 && (!reqStruct[reqStruct.length-1])) reqStruct.pop();

  // Return the request structure
  return reqStruct;
}


/**
 * @param name The original name of the file.
 * @return A valid name of the file for storage.
 *
 * @brief
 *    Format an original file name to a valid one for 
 *    storage in the Nodedown file system.
 */
ndutil.fs.formatStorageFilename = function (name) {
  // Replace the invalid chars
  var regexFilter = /[^a-zA-Z0-9]+/g;
  name = name.replace(regexFilter, '-');

  // Check if the name is completely invalid
  if (!name || (name.length == 1 && name.charAt(0) == '-')) return "";

  // Ignore the single linked hyphen
  var idxBegin = 0;
  var idxEnd = name.length;
  if (name.charAt(0) == '-') idxBegin++;
  if (name.charAt(name.length-1) == '-') idxEnd--;
  return name.substr(idxBegin, idxEnd - idxBegin);
}


module.exports = ndutil;

