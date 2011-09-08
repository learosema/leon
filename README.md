LEON.js
=======

LEON stands for **Lutz' Evil Object Notation** and can be used as an alternative to 
JSON. The sense behind LEON is to minimize URL-encoding in stringified JS objects 
when you want to send them using ajax via HTTP-POST. 

All chars used by LEONs syntax are safe to use in a POST request without 
url-encoding them into something like `%HH`.

## Syntax

### Differences between LEON and JSON:

- brackets are represented as a tilde ~ in LEON ( `[] {}` change to `~` ) 
  and the outer brackets are omitted
- commas are represented as a point (`,` changes to `.`)
- underscores are to identify a key-value-pair (`key:val` changes to `key_val`)
- There are no quote signs to identify a string. As a result of this, value types are guessed by the decode method. You can turn off typeGuessing and force Strings by setting `LEON.typeGuessing(false);`
    - empty strings are guessed to be empty arrays
    - `true`, `false` is guessed to be a `boolean`, 
    - `null` is guessed to be `null`
    - `undefined` is guessed to be `undefined`, 
    - `NaN` is guessed to `NaN`, 
    - numeric strings are guessed to be Ints/Floats
    - everything else is returned as a string

### String escaping rules

String escaping is done using hyphens.

- underscores are escaped to "-_"
- points become "-."
- tildes are escaped to "-~"
- hyphens are escaped to double hyphens
- negative integer numbers stay as they are (so -x becomes --x, but -9 stays -9)
- `-0` is escaped to emptiness. So `abc-0` becomes `abc`. This helps the parser to identify empty objects: `~-0~`. If you want to name something `-0`, then you escape it with a hyphen: `--0`

### Examples

- **JSON:** `[1,2,3,4]`
- **LEON:** `1.2.3.4`

- **JSON:** `[{x:1,y:[1,2,3],z:{"border-style":"1px solid green"},a:[1,2,3]},23]`
- **LEON:** `~x_1.y_~1.2.3~.z_~border--style_1 px solid green~.a_~1.2.3~~.23`

### Usage

- encoding: `LEON.encode(object);`
- decoding: `LEON.decode(string);`

## FAQ

### Why is LEON so evil ?

- LEON is less human readable than JSON
- LEON sounds nicer than just LON :)
- It has some limitations: 
    - LEON does not have a syntax definition for 1-length arrays (yet). So LEON.decode(LEON.encode([666])) returns 666. 
    - when encoding a string like "666", the LEON decoder returns it as a number. You can turn off typeGuessing if you want to force strings.
    - empty strings are returned as empty arrays []


## License

LEON is released under the terms of the MIT license:

Copyright (c) 2011 Lutz Rosema

Permission is hereby granted, free of charge, to any person obtaining a copy of this 
software and associated documentation files (the "Software"), to deal in the Software
without restriction, including without limitation the rights to use, copy, modify, merge,
publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons 
to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall 
be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, 
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, 
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR 
THE USE OR OTHER DEALINGS IN THE SOFTWARE.
