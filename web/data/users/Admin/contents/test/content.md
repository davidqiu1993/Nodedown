# Nodedown Yell

Nodedown is a content management system (CMS) framework 
based on Node.js and Markdown.

It is special because this system does NOT depend on any 
external system, like a database. All you need to bring 
it up is a runtime of Node.js. All contents exist as 
files. For this reason, Nodedown is especially suitable 
for embedded environment.

__Yell__ is an distribution of Nodedown CMS.

![Nodedown Yell](./NodedownYell_brand.png)


## Installation and Running

Only two steps is necessary to install and bring up the 
Nodedown CMS.

1. Copy the Nodedown folder to wherever you want on a system 
   with Node.js pre-installed.

2. In the `web` directory, run the following command on 
   console to bring up the Nodedown CMS:
    
    `node server.js`
    
And the Nodedown CMS is brought up and ready for requests.


## Access

By visiting the corresponding domain name and port, users can 
access to the contents and resources from the Nodedown CMS. 

Since the access routing rules are designed to be user-firendly 
and straight-forward, the best way to know the routing rules is 
exploring it freely.

But there is some common rules to access to different kinds of 
resources. The routing rule is: 
  
  `http://{domain}/{A}/{B}/{C}/...`
  
 * `{domain}`: is the domain name of the server where Nodedown 
               CMS locates.
 
 * `{A}`: is the first routing field. If it is 
   
   - _a valid user name_: request will be redirected to the home 
                          page of the corresponding user.
   
   - _indicating home_: request will be redirected to homepage 
                        of the Nodedown CMS.
                        
   - _`static`_: the following path will be redirected to static 
                 resource directory. And if the resource does not 
                 exist, the request will be redirected to 
                 homepage of the Nodedown CMS.
                 
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

 
# Title 2


## 2-1

 * `./web/server/`: The service programs. You may put all 
                    kinds of service logic here.
 * `./web/view/`: The client view templates. You may put 
                  client side HTML templates here, and 
                  these templates will be compiled while a 
                  request comes.
 * `./web/data/`: The data of users. Nodedown is a multi-user 
                  CMS, and each user owns a folder in this 
                  directory.
 * `./web/static/`: The static resources. All files here can 
                    be accessed directly.


### 2-1-1

 * `./web/server/`: The service programs. You may put all 
                    kinds of service logic here.
 * `./web/view/`: The client view templates. You may put 
                  client side HTML templates here, and 
                  these templates will be compiled while a 
                  request comes.
 * `./web/data/`: The data of users. Nodedown is a multi-user 
                  CMS, and each user owns a folder in this 
                  directory.
 * `./web/static/`: The static resources. All files here can 
                    be accessed directly.

### 2-1-2

 * `./web/server/`: The service programs. You may put all 
                    kinds of service logic here.
 * `./web/view/`: The client view templates. You may put 
                  client side HTML templates here, and 
                  these templates will be compiled while a 
                  request comes.
 * `./web/data/`: The data of users. Nodedown is a multi-user 
                  CMS, and each user owns a folder in this 
                  directory.
 * `./web/static/`: The static resources. All files here can 
                    be accessed directly.

                    
## Directory Structures

 * `./web/server/`: The service programs. You may put all 
                    kinds of service logic here.
 * `./web/view/`: The client view templates. You may put 
                  client side HTML templates here, and 
                  these templates will be compiled while a 
                  request comes.
 * `./web/data/`: The data of users. Nodedown is a multi-user 
                  CMS, and each user owns a folder in this 
                  directory.
 * `./web/static/`: The static resources. All files here can 
                    be accessed directly.


## Authorship

Below is the information of the author.

 * __Author__: David Qiu
 * __Email__: david@davidqiu.com
 * __Website__: www.davidqiu.com
 
Copyright (C) 2014, David Qiu. All rights reserved.

