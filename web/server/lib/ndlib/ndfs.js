/**
 * Nodedown File System.
 *
 * Author  : David Qiu.
 * Email   : david@davidqiu.com
 * Website : www.DavidQiu.com
 *
 * Copyright (C) 2014, David Qiu. All rights reserved.
 */

var fs = require('fs');
var path = require('path');
var ndlog = require('./ndlog');
var ndutil = require('./ndutil');

var ndfs = {};


/**
 * @brief
 *    Path of the Nodedown data directory.
 */
ndfs.dataPath = '../data';


/**
 * @brief
 *    Path of the Nodedown view directory.
 */
ndfs.viewPath = '../views';


/**
 * @brief
 *    Path of the Nodedown static directory.
 */
ndfs.staticPath = '../static';


/**
 * @brief
 *    Postfix of the view templates.
 */
ndfs.viewPostfix = '.ejs';


/**
 * @param category The category to query its existance.
 * @param callback The callback function when query result achieved.
 *                 Its form is "function (exists)", where exists is
 *                 a boolean indicating the existance of the category.
 *
 * @brief
 *    Query if a category exists. Note that all usrnames starting with `.` will be
 *    ignored and considered as inexistence.
 */
ndfs.existsUser = function (category, callback) {
  // Check the arguments
  if (!category) {
    var errmsg = 'ndfs.existsUser(category, callback): The parameter [category] is necessary.';
    ndlog.log(errmsg, ndlog.Level.Error);
    throw errmsg;
  }
  if (!callback || typeof (callback) != 'function') {
    var errmsg = 'ndfs.existsUser(category, callback): The parameter [callback] is necessary and must be a function';
    ndlog.log(errmsg, ndlog.Level.Error);
    throw errmsg;
  }
  if (category[0] == '.') {
    callback(false);
    return;
  }

  // Obtain the category path
  var pathBuilder = new ndutil.StringBuilder();
  pathBuilder.append(this.dataPath);
  pathBuilder.append('/categories/');
  pathBuilder.append(category);
  var userpath = pathBuilder.toString();

  // Query the category path
  fs.exists(userpath, callback);
}


/**
 * @param category The category to query its existance.
 * @return A boolean indicating if the queried category exists.
 *
 * @brief
 *    Query if a category exists. Note that all usrnames starting with `.` will be
 *    ignored and considered as inexistence. This is a synchronous version.
 */
ndfs.existsUserSync = function (category) {
  // Check the arguments
  if (!category) {
    var errmsg = 'ndfs.existsUserSync(category): The parameter [category] is necessary.';
    ndlog.log(errmsg, ndlog.Level.Error);
    throw errmsg;
  }
  if (category[0] == '.') {
    return false;
  }

  // Obtain the category path
  var pathBuilder = new ndutil.StringBuilder();
  pathBuilder.append(this.dataPath);
  pathBuilder.append('/categories/');
  pathBuilder.append(category);
  var userpath = pathBuilder.toString();

  // Query the category path
  return fs.existsSync(userpath);
}


/**
 * @param callback The callback function when categories achieved. Its
 *                 form is "function (categories)", where categories is a
 *                 collection of categories in key-value pairs. The
 *                 key is category and value the corresponding url.
 *
 * @brief
 *    Get all the categories. Note that all usrnames starting with `.` will be
 *    ignored and considered as inexistence.
 */
ndfs.getUsers = function (callback) {
  // Check the argument
  if (!callback || typeof (callback) != 'function') {
    var errmsg = 'ndfs.getUsers(callback): The parameter [callback] is necessary and must be a function';
    ndlog.log(errmsg, ndlog.Level.Error);
    throw errmsg;
  }

  // Obtain the category directory path
  var userpath = this.dataPath + '/categories';

  // Get all categories
  fs.readdir(userpath, function (err, items) {
    // Error detection
    if (err) {
      ndlog.log('ndfs.getUsers(callback): Error occurs when calling fs.readdir. (path: \'' + userpath + '\'', ndlog.Level.Error);
      throw err;
    }

    // Traverse the category directory
    var categories = {};
    items.forEach(function (item) {
      if (!item) return;
      if (item[0] == '.') return;
      if (fs.statSync(userpath + '/' + item).isDirectory()) {
        var accessUrl =  '/' + item + '/';
        categories[item] = accessUrl;
      }
    });

    // Run the callback function
    callback(categories);
  });
}


/**
 * @param category The category to whom the content belong.
 * @param content The content to query.
 * @param callback The callback function when query result achieved.
 *                 Its form is "function (exists)", where exists is
 *                 a boolean indicating the existance of the content.
 *
 * @brief
 *    Query if a content exists. Note that all usrnames starting with `.` will
 *    be ignored and considered as inexistence.
 */
ndfs.existsContent = function (category, content, callback) {
  // Check the arguments
  if (!category) {
    var errmsg = 'ndfs.existsContent(category, content, callback): The parameter [category] is necessary.';
    ndlog.log(errmsg, ndlog.Level.Error);
    throw errmsg;
  }
  if (!content) {
    var errmsg = 'ndfs.existsContent(category, content, callback): The parameter [content] is necessary.';
    ndlog.log(errmsg, ndlog.Level.Error);
    throw errmsg;
  }
  if (!callback || typeof (callback) != 'function') {
    var errmsg = 'ndfs.existsContent(category, content, callback): The parameter [callback] is necessary and must be a function';
    ndlog.log(errmsg, ndlog.Level.Error);
    throw errmsg;
  }
  if(category[0] == '.') {
    callback(false);
    return;
  }

  // Obtain the content path
  var pathBuilder = new ndutil.StringBuilder();
  pathBuilder.append(this.dataPath);
  pathBuilder.append('/categories/');
  pathBuilder.append(category);
  pathBuilder.append('/contents/');
  pathBuilder.append(content);
  var contentpath = pathBuilder.toString();

  // Query the existance of the path
  fs.exists(contentpath, callback);
}


/**
 * @param category The category to whom the content belong.
 * @param content The content to query.
 * @return A boolean indicating if the category and content exist.
 *
 * @brief
 *    Query if a content exists. Note that all usrnames starting with `.` will
 *    be ignored and considered as inexistence. This is a synchronous version.
 */
ndfs.existsContentSync = function (category, content) {
  // Check the arguments
  if (!category) {
    var errmsg = 'ndfs.existsContentSync(category, content): The parameter [category] is necessary.';
    ndlog.log(errmsg, ndlog.Level.Error);
    throw errmsg;
  }
  if (!content) {
    var errmsg = 'ndfs.existsContentSync(category, content): The parameter [content] is necessary.';
    ndlog.log(errmsg, ndlog.Level.Error);
    throw errmsg;
  }
  if (category[0] == '.') {
    return false;
  }

  // Obtain the content path
  var pathBuilder = new ndutil.StringBuilder();
  pathBuilder.append(this.dataPath);
  pathBuilder.append('/categories/');
  pathBuilder.append(category);
  pathBuilder.append('/contents/');
  pathBuilder.append(content);
  var contentpath = pathBuilder.toString();

  // Query the existance of the path
  return fs.existsSync(contentpath);
}


/**
 * @param category The category to whom the content belong.
 * @param content The content to get.
 * @param callback The callback function when content achieved.
 *                 Its form is "function (text)", where text
 *                 is a text stream of the content, normally it
 *                 is in Markdown format. If the content does
 *                 not exist, text will be set as undefined.
 *
 * @brief
 *    Obtain a content from the Nodedown file system. Note that all usrnames
 *    starting with `.` will be ignored and considered as inexistence.
 */
ndfs.getContent = function (category, content, callback) {
  // Check the arguments
  if (!category) {
    var errmsg = 'ndfs.getContent(category, content, callback): The parameter [category] is necessary.';
    ndlog.log(errmsg, ndlog.Level.Error);
    throw errmsg;
  }
  if (!content) {
    var errmsg = 'ndfs.getContent(category, content, callback): The parameter [content] is necessary.';
    ndlog.log(errmsg, ndlog.Level.Error);
    throw errmsg;
  }
  if (!callback || typeof (callback) != 'function') {
    var errmsg = 'ndfs.getContent(category, content, callback): The parameter [callback] is necessary and must be a function';
    ndlog.log(errmsg, ndlog.Level.Error);
    throw errmsg;
  }
  if (category[0] == '.') {
    callback(undefined);
    return;
  }

  // Obtain the content path
  var pathBuilder = new ndutil.StringBuilder();
  pathBuilder.append(this.dataPath);
  pathBuilder.append('/categories/');
  pathBuilder.append(category);
  pathBuilder.append('/contents/');
  pathBuilder.append(content);
  pathBuilder.append('/content.md');
  var contentpath = pathBuilder.toString();

  // Query the existance of the path
  fs.exists(contentpath, function (exists) {
    // Check if the content exists
    if (exists) {
      // DEBUG: Inform content exists
      ndlog.log('Content found. (Path = \'' + contentpath + '\')', ndlog.Level.Debug);

      // Read the content file in text
      fs.readFile(contentpath, function (err, text) {
        // Check error
        if (err) {
          ndlog.log('ndfs.getContent(category, content, callback): Error occurs when calling fs.readFile. (path: \'' + contentpath + '\')', ndlog.Level.Error);
          throw err;
        }

        // Run the callback function
        callback(text);
      });

      // Finish the request
      return;
    }

    // Content not exists
    // DEBUG: Inform content exists
    ndlog.log('Content not found. (Path = \'' + contentpath + '\')', ndlog.Level.Debug);

    // Run the callback function
    callback(undefined);
  });
}


/**
 * @param category The category to whom contents belong.
 * @param callback The callback function when contents achieved. Its
 *                 form is "function (contents)", where contents is
 *                 a collection of contents in key-value pairs. The
 *                 key is content and value the corresponding url.
 *                 If the content path does not exist, an empty
 *                 objectwill be returned.
 *
 * @brief
 *    Get all the contents of a category. Note that all usrnames starting with `.`
 *    will be ignored and considered as inexistence.
 */
ndfs.getContents = function (category, callback) {
  // Check the arguments
  if (!category) {
    var errmsg = 'ndfs.getContents(category, callback): The parameter [category] is necessary.';
    ndlog.log(errmsg, ndlog.Level.Error);
    throw errmsg;
  }
  if (!callback || typeof (callback) != 'function') {
    var errmsg = 'ndfs.getContents(category, callback): The parameter [callback] is necessary and must be a function';
    ndlog.log(errmsg, ndlog.Level.Error);
    throw errmsg;
  }
  if (category[0] == '.') {
    callback({});
    return;
  }

  // Obtain the content directory path
  var pathBuilder = new ndutil.StringBuilder();
  pathBuilder.append(this.dataPath);
  pathBuilder.append('/categories/');
  pathBuilder.append(category);
  pathBuilder.append('/contents');
  var contentpath = pathBuilder.toString();

  // Check if the path exists
  fs.exists(contentpath, function (exists) {
    // Path does not exists
    if (!exists) {
      // Return an empty object
      callback({});
      return;
    }

    // Get all contents
    fs.readdir(contentpath, function (err, items) {
      // Error detection
      if (err) {
        ndlog.log('ndfs.getContents(category, callback): Error occurs when calling fs.readdir. (path: \'' + contentpath + '\')', ndlog.Level.Error);
        throw err;
      }

      // Traverse the content directory
      var accessUrlPrefix = '/' + category + '/';
      var contents = {};
      items.forEach(function (item) {
        if (fs.statSync(contentpath + '/' + item).isDirectory()) {
          var accessUrl = accessUrlPrefix + item + '/';
          contents[item] = accessUrl;
        }
      });

      // Run the callback function
      callback(contents);
    });
  })
}


/**
 * @param category The category to whom the attachment belong.
 * @param content The content to which the attachment belong.
 * @param attachment The attachment to query.
 * @param callback The callback function when query result achieved.
 *                 Its form is "function (exists)", where exists is
 *                 a boolean indicating the existance of the
 *                 attachment.
 *
 * @brief
 *    Query if an attachment exists. Note that all usrnames starting with `.`
 *    will be ignored and considered as inexistence.
 */
ndfs.existsAttachment = function (category, content, attachment, callback) {
    // Check the arguments
  if (!category) {
    var errmsg = 'ndfs.existsAttachment(category, content, attachment, callback): The parameter [category] is necessary.';
    ndlog.log(errmsg, ndlog.Level.Error);
    throw errmsg;
  }
  if (!content) {
    var errmsg = 'ndfs.existsAttachment(category, content, attachment, callback): The parameter [content] is necessary.';
    ndlog.log(errmsg, ndlog.Level.Error);
    throw errmsg;
  }
  if (!attachment) {
    var errmsg = 'ndfs.existsAttachment(category, content, attachment, callback): The parameter [attachment] is necessary.';
    ndlog.log(errmsg, ndlog.Level.Error);
    throw errmsg;
  }
  if (!callback || typeof (callback) != 'function') {
    var errmsg = 'ndfs.existsAttachment(category, content, attachment, callback): The parameter [callback] is necessary and must be a function';
    ndlog.log(errmsg, ndlog.Level.Error);
    throw errmsg;
  }
  if (category[0] == '.') {
    callback(false);
    return;
  }

  // Obtain the attachment path
  var pathBuilder = new ndutil.StringBuilder();
  pathBuilder.append(this.dataPath);
  pathBuilder.append('/categories/');
  pathBuilder.append(category);
  pathBuilder.append('/contents/');
  pathBuilder.append(content);
  pathBuilder.append('/attachments/');
  pathBuilder.append(attachment);
  var attachmentpath = pathBuilder.toString();

  // Query the existance of the path
  fs.exists(attachmentpath, callback);
}


/**
 * @param category The category to whom the attachment belong.
 * @param content The content to which the attachment belong.
 * @param attachment The attachment to query.
 * @return A boolean indicating the existance of the attachment.
 *
 * @brief
 *    Query if a attachment exists. Note that all usrnames starting with `.`
 *    will be ignored and considered as inexistence. This is a synchronous
 *    version.
 */
ndfs.existsAttachmentSync = function (category, content, attachment) {
  // Check the arguments
  if (!category) {
    var errmsg = 'ndfs.existsAttachmentSync(category, content, attachment): The parameter [category] is necessary.';
    ndlog.log(errmsg, ndlog.Level.Error);
    throw errmsg;
  }
  if (!content) {
    var errmsg = 'ndfs.existsAttachmentSync(category, content, attachment): The parameter [content] is necessary.';
    ndlog.log(errmsg, ndlog.Level.Error);
    throw errmsg;
  }
  if (!attachment) {
    var errmsg = 'ndfs.existsAttachmentSync(category, content, attachment): The parameter [attachment] is necessary.';
    ndlog.log(errmsg, ndlog.Level.Error);
    throw errmsg;
  }
  if (category[0] == '.') {
    return false;
  }

  // Obtain the attachment path
  var pathBuilder = new ndutil.StringBuilder();
  pathBuilder.append(this.dataPath);
  pathBuilder.append('/categories/');
  pathBuilder.append(category);
  pathBuilder.append('/contents/');
  pathBuilder.append(content);
  pathBuilder.append('/attachments/');
  pathBuilder.append(attachment);
  var attachmentpath = pathBuilder.toString();

  // Query the existance of the path
  return fs.existsSync(attachmentpath);
}


/**
 * @param category The category to whom the attachment belong.
 * @param content The content to which the attachment belong.
 * @param attachment The attachment to get.
 * @param callback The callback function when attachment achieved.
 *                 Its form is "function (file, extension)", where
 *                 file is a binary stream of the attachment and
 *                 extension the extension name of the attachment.
 *                 The extension name includes the dot, and it
 *                 will be an empty string if the attachment has
 *                 no extension name. If the attachment does not
 *                 exist, attachment will be undefined and
 *                 extension an empty string.
 *
 * @brief
 *    Obtain an attachment from the Nodedown file system. Note that all
 *    usrnames starting with `.` will be ignored and considered as inexistence.
 */
ndfs.getAttachment = function (category, content, attachment, callback) {
  // Check the arguments
  if (!category) {
    var errmsg = 'ndfs.getAttachment(category, content, attachment, callback): The parameter [category] is necessary.';
    ndlog.log(errmsg, ndlog.Level.Error);
    throw errmsg;
  }
  if (!content) {
    var errmsg = 'ndfs.getAttachment(category, content, attachment, callback): The parameter [content] is necessary.';
    ndlog.log(errmsg, ndlog.Level.Error);
    throw errmsg;
  }
  if (!attachment) {
    var errmsg = 'ndfs.getAttachment(category, content, attachment, callback): The parameter [attachment] is necessary.';
    ndlog.log(errmsg, ndlog.Level.Error);
    throw errmsg;
  }
  if (!callback || typeof (callback) != 'function') {
    var errmsg = 'ndfs.getAttachment(category, content, attachment, callback): The parameter [callback] is necessary and must be a function';
    ndlog.log(errmsg, ndlog.Level.Error);
    throw errmsg;
  }
  if (category[0] == '.') {
    callback(undefined, '');
    return;
  }

  // Obtain the attachment path
  var pathBuilder = new ndutil.StringBuilder();
  pathBuilder.append(this.dataPath);
  pathBuilder.append('/categories/');
  pathBuilder.append(category);
  pathBuilder.append('/contents/');
  pathBuilder.append(content);
  pathBuilder.append('/attachments/');
  pathBuilder.append(attachment);
  var attachmentpath = pathBuilder.toString();

  // Query the existance of the path
  fs.exists(attachmentpath, function (exists) {
    // Check if the attachment exists
    if (exists) {
      // DEBUG: Inform attachment exists
      ndlog.log('Attachment found. (Path = \'' + attachmentpath + '\')', ndlog.Level.Debug);

      // Read the attachment file
      fs.readFile(attachmentpath, 'binary', function (err, file) {
        // Check error
        if (err) {
          ndlog.log('ndfs.getAttachment(category, content, attachment, callback): Error occurs when calling fs.readFile. (path: \'' + attachmentpath + '\')', ndlog.Level.Error);
          throw err;
        }

        // Run the callback function
        callback(file, path.extname(attachmentpath));
      });

      // Finish the request
      return;
    }

    // Attachment not exists
    // DEBUG: Inform attachment exists
    ndlog.log('Attachment not found. (Path = \'' + attachmentpath + '\')', ndlog.Level.Debug);

    // Run the callback function
    callback(undefined, '');
  });
}


/**
 * @param category The category to whom attachments belong.
 * @param content The content to which attachments belong.
 * @param callback The callback function when attachments achieved.
 *                 Its form is "function (attachments)", where
 *                 attachments is a collection of attachments in
 *                 key-value pairs. The key is attachment and value
 *                 the corresponding url. If the attachment path does
 *                 not exist, an empty object will be returned.
 *
 * @brief
 *    Get all the attachments of a category's content. Note that all usrnames
 *    starting with `.` will be ignored and considered as inexistence.
 */
ndfs.getAttachments = function (category, content, callback) {
  // Check the arguments
  if (!category) {
    var errmsg = 'ndfs.getAttachments(category, content, callback): The parameter [category] is necessary.';
    ndlog.log(errmsg, ndlog.Level.Error);
    throw errmsg;
  }
  if (!content) {
    var errmsg = 'ndfs.getAttachments(category, content, callback): The parameter [content] is necessary.';
    ndlog.log(errmsg, ndlog.Level.Error);
    throw errmsg;
  }
  if (!callback || typeof (callback) != 'function') {
    var errmsg = 'ndfs.getAttachments(category, content, callback): The parameter [callback] is necessary and must be a function';
    ndlog.log(errmsg, ndlog.Level.Error);
    throw errmsg;
  }
  if (category[0] == '.') {
    callback({});
    return;
  }

  // Obtain the attachment directory path
  var pathBuilder = new ndutil.StringBuilder();
  pathBuilder.append(this.dataPath);
  pathBuilder.append('/categories/');
  pathBuilder.append(category);
  pathBuilder.append('/contents/');
  pathBuilder.append(content);
  pathBuilder.append('/attachments');
  var userpath = pathBuilder.toString();

  // Check if the path exists
  fs.exists(userpath, function (exists) {
    // Path does not exists
    if (!exists) {
      // Return an empty object
      callback({});
      return;
    }

    // Get all attachments
    fs.readdir(userpath, function (err, items) {
      // Error detection
      if (err) {
        ndlog.log('ndfs.getAttachments(category, content, callback): Error occurs when calling fs.readdir. (path: \'' + userpath + '\')', ndlog.Level.Error);
        throw err;
      }

      // Traverse the content directory
      var prefixBuilder = new ndutil.StringBuilder();
      prefixBuilder.append('/');
      prefixBuilder.append(category);
      prefixBuilder.append('/');
      prefixBuilder.append(content);
      prefixBuilder.append('/');
      var accessUrlPrefix = prefixBuilder.toString();
      var attachments = {};
      items.forEach(function (item) {
        if (fs.statSync(userpath + '/' + item).isFile()) {
          var accessUrl = accessUrlPrefix + item;
          attachments[item] = accessUrl;
        }
      });

      // Run the callback function
      callback(attachments);
    });
  })
}


/**
 * @param name Name of the view.
 * @param callback The callback function when view file achieved.
 *                 Its form is "function (view)", where view is a
 *                 string of the view template content.
 *
 * @brief
 *    Get a view from the Nodedown view directory.
 */
ndfs.getView = function (name, callback) {
  // Check the arguments
  if (!name) {
    var errmsg = 'ndfs.getView(name, callback): The parameter [name] is necessary.';
    ndlog.log(errmsg, ndlog.Level.Error);
    throw errmsg;
  }
  if (!callback || typeof (callback) != 'function') {
    var errmsg = 'ndfs.getView(name, callback): The parameter [callback] is necessary and must be a function';
    ndlog.log(errmsg, ndlog.Level.Error);
    throw errmsg;
  }

  // Obtain the view path
  var pathBuilder = new ndutil.StringBuilder();
  pathBuilder.append(this.viewPath);
  pathBuilder.append('/');
  pathBuilder.append(name);
  pathBuilder.append(this.viewPostfix);
  var viewpath = pathBuilder.toString();

  // Read the view file
  fs.readFile(viewpath, 'utf-8', function (err, data) {
    // Error detection
    if (err) {
      ndlog.log('ndfs.getView(name, callback): Error occurs when calling fs.readFile. (path: \'' + viewpath + '\')', ndlog.Level.Error);
      throw err;
    }

    // Run the callback function
    callback(data);
  });
}


/**
 * @param src Location of the static resource based on the static
 *            path. The path does not includes any prefix.
 * @param callback The callback function when static resource
 *                 achieved. Its form is "function (file)", where
 *                 file is a binary of the static resource. If the
 *                 static resource not found, an undefined will be
 *                 set as the file.
 *
 * @brief
 *    Get a static resource from the Nodedown static directory.
 */
ndfs.getStaticResource = function (src, callback) {
  // Check the arguments
  if (!src) {
    var errmsg = 'ndfs.getStaticResource(src, callback): The parameter [src] is necessary.';
    ndlog.log(errmsg, ndlog.Level.Error);
    throw errmsg;
  }
  if (!callback || typeof (callback) != 'function') {
    var errmsg = 'ndfs.getStaticResource(src, callback): The parameter [callback] is necessary and must be a function';
    ndlog.log(errmsg, ndlog.Level.Error);
    throw errmsg;
  }

  // Obtain the static resource path
  var pathBuilder = new ndutil.StringBuilder();
  pathBuilder.append(this.staticPath);
  pathBuilder.append('/');
  pathBuilder.append(src);
  var srpath = pathBuilder.toString();

  // Check the existance of the path
  fs.exists(srpath, function (exists) {
    // Path exists
    if (exists) {
      // Read the static resource file
      fs.readFile(srpath, 'binary', function (err, file) {
        // Error detection
        if (err) {
          ndlog.log('ndfs.getStaticResource(src, callback): Error occurs when calling fs.readFile. (path: \'' + srpath + '\')', ndlog.Level.Error);
          throw err;
        }

        // Run the callback function
        callback(file);
      });

      // Finish process
      return;
    }

    // Path not exists
    callback(undefined);
  });
}


module.exports = ndfs;

