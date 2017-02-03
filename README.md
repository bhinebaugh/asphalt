# Asphalt
A task tracking utility that lives with your code.

## Caution
This is very much a work in progress. The following setup and usage **will not work** in its current state. If you're interested, you can try it out by running:
```
$ ./bin/asphalt create|status|show feature
```

## Setup
```
$ npm install asphalt
```

## Usage
Creating a new item:
```
$ asphalt create feature
title: My Feature
description: Does the things
acceptance: Thing one
acceptance: Thing two
started: today
completed:

Created feature abcde
```

Display status of all items:
```
$ asphalt status feature
id      title         started    completed
abcde   My Feature    Today    
```

Display details of one item:
```
$ asphalt show feature abcde
title: My Feature
description: Does the Things
acceptance: Thing one, Thing two
started: Today
```
