# atlas-atlas-files_manager

how to create an API with Express
how to authenticate a user
how to store data in MongoDB
how to store temporary data in Redis
how to setup and use a background worker


Start a redis-server via docker (or any other method you prefer):

docker run -p 6379:6379 -it redis/redis-stack-server:latest
To install node-redis, simply:

npm install redis
"redis" is the "whole in one" package that includes all the other packages. If you only need a subset of the commands, you can install the individual packages. See the list below.

Packages
Name	Description
redis	The client with all the "redis-stack" modules
@redis/client	The base clients (i.e RedisClient, RedisCluster, etc.)
@redis/bloom	Redis Bloom commands
@redis/json	Redis JSON commands
@redis/search	RediSearch commands
@redis/time-series	Redis Time-Series commands
@redis/entraid	Secure token-based authentication for Redis clients using Microsoft Entra ID

Docs » Api » Process
process
The process object is a global object and can be accessed from anywhere. It is an instance of EventEmitter.

Exit Codes
Node will normally exit with a 0 status code when no more async operations are pending. The following status codes are used in other cases:

1 Uncaught Fatal Exception - There was an uncaught exception, and it was not handled by a domain or an uncaughtException event handler.
2 - Unused (reserved by Bash for builtin misuse)
3 Internal JavaScript Parse Error - The JavaScript source code internal in Node's bootstrapping process caused a parse error. This is extremely rare, and generally can only happen during development of Node itself.
4 Internal JavaScript Evaluation Failure - The JavaScript source code internal in Node's bootstrapping process failed to return a function value when evaluated. This is extremely rare, and generally can only happen during development of Node itself.
5 Fatal Error - There was a fatal unrecoverable error in V8. Typically a message will be printed to stderr with the prefix FATAL
  ERROR.
6 Non-function Internal Exception Handler - There was an uncaught exception, but the internal fatal exception handler function was somehow set to a non-function, and could not be called.
7 Internal Exception Handler Run-Time Failure - There was an uncaught exception, and the internal fatal exception handler function itself threw an error while attempting to handle it. This can happen, for example, if a process.on('uncaughtException') or domain.on('error') handler throws an error.
8 - Unused. In previous versions of Node, exit code 8 sometimes indicated an uncaught exception.
9 - Invalid Argument - Either an unknown option was specified, or an option requiring a value was provided without a value.
10 Internal JavaScript Run-Time Failure - The JavaScript source code internal in Node's bootstrapping process threw an error when the bootstrapping function was called. This is extremely rare, and generally can only happen during development of Node itself.
12 Invalid Debug Argument - The --debug and/or --debug-brk options were set, but an invalid port number was chosen.
>128 Signal Exits - If Node receives a fatal signal such as SIGKILL or SIGHUP, then its exit code will be 128 plus the value of the signal code. This is a standard Unix practice, since exit codes are defined to be 7-bit integers, and signal exits set the high-order bit, and then contain the value of the signal code.
Event: 'exit'
Emitted when the process is about to exit. There is no way to prevent the exiting of the event loop at this point, and once all exit listeners have finished running the process will exit. Therefore you must only perform synchronous operations in this handler. This is a good hook to perform checks on the module's state (like for unit tests). The callback takes one argument, the code the process is exiting with.

Example of listening for exit:

process.on('exit', function(code) {
  // do *NOT* do this
  setTimeout(function() {
    console.log('This will not run');
  }, 0);
  console.log('About to exit with code:', code);
});
Event: 'beforeExit'
This event is emitted when node empties it's event loop and has nothing else to schedule. Normally, node exits when there is no work scheduled, but a listener for 'beforeExit' can make asynchronous calls, and cause node to continue.

'beforeExit' is not emitted for conditions causing explicit termination, such as process.exit() or uncaught exceptions, and should not be used as an alternative to the 'exit' event unless the intention is to schedule more work.

Event: 'uncaughtException'
Emitted when an exception bubbles all the way back to the event loop. If a listener is added for this exception, the default action (which is to print a stack trace and exit) will not occur.

Example of listening for uncaughtException:

process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
});

setTimeout(function() {
  console.log('This will still run.');
}, 500);

// Intentionally cause an exception, but don't catch it.
nonexistentFunc();
console.log('This will not run.');
Note that uncaughtException is a very crude mechanism for exception handling.

Don't use it, use domains instead. If you do use it, restart your application after every unhandled exception!
Do not use it as the node.js equivalent of On Error Resume Next. An unhandled exception means your application - and by extension node.js itself - is in an undefined state. Blindly resuming means anything could happen.

Think of resuming as pulling the power cord when you are upgrading your system. Nine out of ten times nothing happens - but the 10th time, your system is bust.



The fastest, most reliable, Redis-based queue for Node.
Carefully written for rock solid stability and atomicity.


Sponsors · Features · UIs · Install · Quick Guide · Documentation

Check the new Guide!

