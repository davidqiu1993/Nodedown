/**
 * Nodedown require service.
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



/**
 * @param name Name of the built-in Nodedown module.
 * @return The module required. If corresponding 
 *         module is not found, an undefined will 
 *         be returned.
 *
 * @brief
 *    Shortcut of the require service for built-in 
 *    Nodedown module.
 */
var ndrequire = function (name) {
  // Switch the name of module
  switch(name) {

    // ndlib
    case 'ndfs': return require('./lib/ndlib/ndfs');
    case 'ndlog': return require('./lib/ndlib/ndlog');
    case 'ndutil': return require('./lib/ndlib/ndutil');

    // ejs
    case 'ejs': return require('./lib/ejs/ejs');

    // showdown
    case 'showdown': return require('./lib/showdown/showdown');

  }

  // Module not found
  return undefined;
}


module.exports = ndrequire;

