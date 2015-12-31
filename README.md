# Nodedown

Nodedown is a content management system (CMS) framework 
based on Node.js and Markdown.

It is special because this system does NOT depend on any 
external system, like a database. All you need to bring 
it up is a runtime of Node.js. All contents exist as 
files. For this reason, Nodedown is especially suitable 
for embedded environment.


## Installation and Running

Only two steps is necessary to install and bring up the 
Nodedown CMS.

1.  Copy the Nodedown folder to wherever you want on a system 
    with Node.js and NPM pre-installed.
    
2.  If bower is not installed, execute the following command to 
    install bower tool:
    
        npm install -g bower

3.  Install dependent NPM and bower packages by executing the 
    following commands in the `server` directory:
    
        npm install
        bower install


4.  In the `web` directory, run the following command on 
    console to bring up the Nodedown CMS:
    
        npm start
    
And the Nodedown CMS is brought up and ready for requests. Notice 
that Internect connection is required during the installation 
process, and no longer required after all installation steps are 
done.


## Access

By visiting the corresponding domain name and port, users can 
access to the contents and resources from the Nodedown CMS. 

Since the access routing rules are designed to be user-firendly 
and straight-forward, the best way to know the routing rules is 
exploring it freely.

But there is some common rules to access to different kinds of 
resources. The routing rule is: 
  
    http://{domain}/{A}/{B}/{C}/...
  
* `{domain}`: is the domain name of the server where Nodedown 
   CMS locates.

* `{A}`: is the first routing field. If it is 
  
  - _a valid user name_: request will be redirected to the home 
    page of the corresponding user.

  - _indicating home_: request will be redirected to homepage 
    of the Nodedown CMS.

  - _`static`_: the following path will be redirected to static 
    resource directory. And if the resource does not exist, the 
    request will be redirected to homepage of the Nodedown CMS.

  - _others_: the request will be redirected to homepage of the 
   Nodedown CMS.

* `{B}`: is the second routing field. Assuming the first routing 
  field is a valid user name, if `{B}` is 
  
  - _a valid content_: request will be redirected to the content 
    page.

  - _others_: request will be redirected to the homepage of the 
    corresponding user.

* `{C}`: is the third routing field. Assuming the second routing 
  field is a valid content, if `{C}` is 

  - _a valid attachment_: the corresponding attachment of this 
    content will be responded.

  - _others_: request will be redirected to the corresponding 
    content page.

* The remaining: will be ignored.


## Directory Structures

* `./web/server/`: The service programs. You may put all kinds 
  of service logic here.
* `./web/view/`: The client view templates. You may put client 
  side HTML templates here, and these templates will be compiled 
  while a request comes.
* `./web/data/`: The data of users. Nodedown is a multi-user CMS, 
  and each user owns a folder in this directory.
* `./web/static/`: The static resources. All files here can be 
  accessed directly.


## Mathematical Support

Nodedown supports mathematical inputs by

  * Branketing with `$(` and `)$` for inline text; or
  * Branketing with `$$` and `$$` for independent formulas.

An example for this feature is shown as below.

  $$ f(a)=\frac{1}{2 \pi i}\oint_{\gamma}\frac{f(z)}{z-a}dz $$

Notice that the formulars to render must not be quoted by markdown 
formatted language. Otherwise, it will be shown in plain text.


## Authorship

Below is the information of the author.

  * __Author__:  David Qiu
  * __Email__:   david@davidqiu.com
  * __Website__: www.davidqiu.com

Copyright (C) 2015, David Qiu.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
