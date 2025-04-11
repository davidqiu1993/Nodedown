/**
 * Nodedown server.
 *
 * Author  : David Qiu.
 * Email   : david@davidqiu.com
 * Website : www.DavidQiu.com
 *
 * Copyright (C) 2014, David Qiu. All rights reserved.
 */

var http = require('http');
var util = require('util');
var marked = require('marked');
var ndrequire = require('./ndrequire');

var ndutil = ndrequire('ndutil');
var ndfs = ndrequire('ndfs');
var ndlog = ndrequire('ndlog');
var ejs = ndrequire('ejs');

var SERVICE_PORT = process.env.PORT || 8080;


/**
 * @param response The HTTP response stream.
 * @param name The name of redirection target.
 * @param args The arguments of the redirection.
 *
 * @brief
 *    Redirect the response.
 */
function _redirect(response, name, args) {
  switch (name) {

    case 'home':
      ndfs.getUsers(function (categories) {
        ndfs.getView('home', function (view) {
          var params = { categories: categories };
          var html = ejs.render(view, params);
          response.writeHead(200, {'Content-Type': 'text/html'});
          response.end(html);
        });
      });
      break;

    case 'category':
      ndfs.getContents(args.category, function (contents) {
        ndfs.getView('category', function (view) {
          var params = { category: args.category, contents: contents };
          var html = ejs.render(view, params);
          response.writeHead(200, {'Content-Type': 'text/html'});
          response.end(html);
        });
      });
      break;

    case 'content':
      // Obtain attachment list
      ndfs.getAttachments(args.category, args.content, function (attachments) {
        // Obtain markdown content
        ndfs.getContent(args.category, args.content, function (text) {
          // Convert markdown content to html
          var mdcontent = marked(text.toString());

          // Obtain view template
          ndfs.getView('content', function (view) {
            // Render the view
            var params = { category: args.category, content: args.content, mdcontent: mdcontent, attachments: attachments };
            var html = ejs.render(view, params);

            // Response
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.end(html);
          });
        });
      });
      break;

    case 'attachment':
      ndfs.getAttachment(args.category, args.content, args.attachment, function (file, extension) {
          if (file !== undefined) {
            response.write(file, 'binary');
            response.end();
          }
          else {
            _redirect(response, 'content', args);
          }
      })
      break;

      case 'static':
        // Join the path structure
        var srpathBuilder = new ndutil.StringBuilder();
        for (var i=1; i<args.pathSturct.length-1; ++i) {
          srpathBuilder.append(args.pathSturct[i]);
          srpathBuilder.append('/');
        }
        if (args.pathSturct.length > 1) srpathBuilder.append(args.pathSturct[args.pathSturct.length-1]);
        var srpath = srpathBuilder.toString();

        // Check the path
        if (!srpath) {
          _redirect(response, 'home');
          return;
        }

        // Obtain the static resource
        ndfs.getStaticResource(srpath, function (file) {
          if (file !== undefined) {
            response.write(file, 'binary');
            response.end();
          }
          else {
            _redirect(response, 'home');
          }
        });
        break;

    default:
      _redirect(response, 'home');
      break;
  }
}


// Create server for http services
var server = http.createServer(function (request, response) {
  // Log this request
  var reqInfoBuilder = new ndutil.StringBuilder();
  reqInfoBuilder.append('Request Client IP = [');
  reqInfoBuilder.append(ndutil.http.getClientIp(request));
  reqInfoBuilder.append('], Hostname = [');
  reqInfoBuilder.append(ndutil.http.getHost(request));
  reqInfoBuilder.append('], Path = [');
  reqInfoBuilder.append(ndutil.http.getUrl(request));
  reqInfoBuilder.append(']');
  ndlog.log(reqInfoBuilder.toString(), ndlog.Level.Info);

  // Handler selection
  var pathSturct = ndutil.http.getRequestPathStructure(request);
  for (var i=0; i<pathSturct.length; ++i) {
    try {
      pathSturct[i] = decodeURIComponent(pathSturct[i]);
    } catch (err) {
      pathSturct = [''];
      break;
    }
  }

  // pathSturct A: Check preserved system paths
  switch (pathSturct[0]) {
    case '':
    case null:
    case undefined:
    case 'home':
    case 'index':
    case 'default':
      _redirect(response, 'home');
      return;

    case 'static':
      _redirect(response, 'static', { pathSturct: pathSturct });
      return;
  }

  // pathSturct A: Check category paths
  if (!ndfs.existsUserSync(pathSturct[0])) {
    _redirect(response, 'home');
    return;
  }

  // Category path exists
  // pathSturct B: Check preserved category paths
  switch (pathSturct[1]) {
    case '':
    case null:
    case undefined:
    case 'home':
    case 'index':
    case 'default':
      _redirect(response, 'category', { category: pathSturct[0] });
      return;
  }

  // pathSturct B: Check content paths
  if (!ndfs.existsContentSync(pathSturct[0], pathSturct[1])) {
    _redirect(response, 'category', { category: pathSturct[0] });
    return;
  }

  // Content path exists
  // pathSturct C: Check preserved content paths
  switch (pathSturct[2]) {
    case '':
    case null:
    case undefined:
    case 'home':
    case 'index':
    case 'default':
    case 'view':
      _redirect(response, 'content', { category: pathSturct[0], content: pathSturct[1] });
      return;
  }

  // pathSturct C: Check attachment paths
  if (!ndfs.existsAttachmentSync(pathSturct[0], pathSturct[1], pathSturct[2])) {
    _redirect(response, 'content', { category: pathSturct[0], content: pathSturct[1] });
    return;
  }

  // Attachment path exists
  _redirect(response, 'attachment', { category: pathSturct[0], content: pathSturct[1], attachment: pathSturct[2] });
  return;
});


// Set the log level
ndlog.logLevel = ndlog.Level.Info;

// Listen the service port and log that server starts
server.listen(SERVICE_PORT);
ndlog.log('Server starts. (port: ' + SERVICE_PORT + ').', ndlog.Level.Info);


