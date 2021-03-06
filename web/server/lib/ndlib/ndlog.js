/**
 * Nodedown Logging Toolset.
 *
 * Author  : David Qiu.
 * Email   : david@davidqiu.com
 * Website : www.DavidQiu.com
 *
 * Copyright (C) 2014, David Qiu. All rights reserved.
 */

var ndutil = require('./ndutil');

var ndlog = {};


/**
 * @param str The log string.
 *
 * @brief
 *    Write the log string to the logging output.
 */
function _writeLog(str) {
  console.log(str);
}


/**
 * @brief
 *    Log levels.
 */
ndlog.Level = {
  Error: "Error",
  Warning: "Warning",
  Info: "Info",
  Debug: "Debug"
}


/**
 * @brief
 *    Current log level of the Nodedown system.
 */
ndlog.logLevel = ndlog.Level.Info;


/**
 * @param message The logging message.
 * @param level The level of this logging.
 *
 * @brief
 *    Do logging with specific log level and message.
 */
ndlog.log = function (message, level) {
  var onLevel = false;

  // Check if level is default
  if(!level) level = this.Level.Info;

  // Check if the log is on system logging level
  switch (this.logLevel) {
    case this.Level.Debug:
      if (level == this.Level.Debug) onLevel = true;
    case this.Level.Info:
      if (level == this.Level.Info) onLevel = true;
    case this.Level.Warning:
      if (level == this.Level.Warning) onLevel = true;
    case this.Level.Error:
      if (level == this.Level.Error) onLevel = true;
      break;
  }
  
  // Write the log
  if (onLevel) {
    var logBuilder = new ndutil.StringBuilder();

    // Current datetime
    logBuilder.append("[");
    logBuilder.append(ndutil.system.getCurrentDateTime());
    logBuilder.append("] ");

    // The logging level
    logBuilder.append("[");
    logBuilder.append(level);
    logBuilder.append("] ");

    // The message
    logBuilder.append(message);

    // Write the log
    _writeLog(logBuilder.toString());
  }
}


module.exports = ndlog;
