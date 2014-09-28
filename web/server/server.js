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
var ndrequire = require('./ndrequire');

var ndutil = ndrequire('ndutil');
var ndfs = ndrequire('ndfs');
var ndlog = ndrequire('ndlog');
var ejs = ndrequire('ejs');
var showdown = ndrequire('showdown');

var SERVICE_PORT = 8080;


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
      ndfs.getUsers(function (users) {
        ndfs.getView('home', function (view) {
          var params = { users: users };
          var html = ejs.render(view, params);
          response.writeHead(200, {'Content-Type': 'text/html'});
          response.end(html);
        });
      });
      break;

    case 'user':
      ndfs.getContents(args.user, function (contents) {
        ndfs.getView('user', function (view) {
          var params = { user: args.user, contents: contents };
          var html = ejs.render(view, params);
          response.writeHead(200, {'Content-Type': 'text/html'});
          response.end(html);
        });
      });
      break;

    case 'content':
      // Obtain attachment list
      ndfs.getAttachments(args.user, args.content, function (attachments) {
        // Obtain markdown content
        ndfs.getContent(args.user, args.content, function (text) {
          // Convert markdown content to html
          var mdcontent = showdown.Markdown2Html(text.toString());

          // Obtain view template
          ndfs.getView('content', function (view) {
            // Render the view
            var params = { user: args.user, content: args.content, mdcontent: mdcontent, attachments: attachments };
            var html = ejs.render(view, params);

            // Response
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.end(html);
          });
        });
      });
      break;

    case 'attachment':
      ndfs.getAttachment(args.user, args.content, args.attachment, function (file, extension) {
          if (file != undefined) {
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
          if (file != undefined) {
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
server = http.createServer(function (request, response) {
  // Log this request
  reqInfoBuilder = new ndutil.StringBuilder();
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

  // pathSturct A: Check user paths
  if (!ndfs.existsUserSync(pathSturct[0])) {
    _redirect(response, 'home');
    return;
  }

  // User path exists
  // pathSturct B: Check preserved user paths
  switch (pathSturct[1]) {
    case '':
    case null:
    case undefined:
    case 'home':
    case 'index':
    case 'default':
      _redirect(response, 'user', { user: pathSturct[0] });
      return;
  }

  // pathSturct B: Check content paths
  if (!ndfs.existsContentSync(pathSturct[0], pathSturct[1])) {
    _redirect(response, 'user', { user: pathSturct[0] });
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
      _redirect(response, 'content', { user: pathSturct[0], content: pathSturct[1] });
      return;
  }

  // pathSturct C: Check attachment paths
  if (!ndfs.existsAttachmentSync(pathSturct[0], pathSturct[1], pathSturct[2])) {
    _redirect(response, 'content', { user: pathSturct[0], content: pathSturct[1] });
    return;
  }

  // Attachment path exists
  _redirect(response, 'attachment', { user: pathSturct[0], content: pathSturct[1], attachment: pathSturct[2] });
  return;
});


// Set the log level
ndlog.logLevel = ndlog.Level.Info;

// Listen the service port and log that server starts
server.listen(SERVICE_PORT);
ndlog.log('Server starts. (port: ' + SERVICE_PORT + ').', ndlog.Level.Info);

