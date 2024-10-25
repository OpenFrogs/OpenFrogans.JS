# OpenFrogans.JS

OpenFrogans.JS is a JavaScript library that provides a simple way to interact with the Frogans Core Registry and fetch resources from Frogans sites.

The Frogans Core Registry endpoints have changed between the alpha and beta players in an incompatible manner. As such, alpha sites are not available through the beta player and vice versa.

Presently this library can only access Frogans sites compatible with the beta player, but future versions will add support for the alpha player.

## API

-   [Preface](#preface)
-   [`OpenFrogansClient`](#openfrogansclient)
    -   [`initialize()`](#initialize)
    -   [`resolveV5(address: string): Promise<Site>`](#resolvev5address-string-promisesite)
    -   [`fetchV5(address: string, resource: string): Promise<Response>`](#fetchv5address-string-resource-string-promiseresponse)
    -   [`submitV5(address: string, resource: string, data: string): Promise<Response>`](#submitv5address-string-resource-string-data-string-promiseresponse)

### Preface

The OpenFrogansClient class needs to bootstrap itself with information about the Frogans Core Registry from the OP3FT before it can be used. You can initialize the client with the following code:

```javascript
import OpenFrogansClient from "openfrogans.js";

const client = new OpenFrogansClient();
await client.initialize();
```

APIs intended for use with beta player sites will be suffixed with `V5`, while APIs intended for use with alpha player sites (not presently implemented) will be suffixed with `V4`. This corresponds with the version of the Frogans Network System Language used by the respective players.

### `OpenFrogansClient`

The `OpenFrogansClient` class is the main class of the library. It is used to interact with the Frogans Core Registry and fetch resources from Frogans sites.

#### `initialize()`

This method initializes the client with information about the Frogans Core Registry from the OP3FT. It must be called before any other methods on the client.

#### `resolveV5(address: string): Promise<Site>`

This method resolves a Frogans site address to a `Site` object. The `Site` object contains information about the site, such as its index file and the servers that host it.

This method is useful if you need to know the index file of a site before fetching it.

#### `fetchV5(address: string, resource: string): Promise<Response>`

This method fetches a resource from a Frogans site. The `address` parameter is the address of the site, and the `resource` parameter is the path to the resource on the site.

This is the method you will use most often to fetch resources from Frogans sites.

#### `submitV5(address: string, resource: string, data: string): Promise<Response>`

This method submits data to a resource on a Frogans site. The `address` parameter is the address of the site, the `resource` parameter is the path to the resource on the site, and the `data` parameter is the data to submit.

This method is useful if you need to submit data to a site, such as submitting interaction data.

### `Site`

The `Site` class represents a Frogans site. It contains information about the site, such as its index file and the servers that host it.

```typescript
interface Site {
	index: string;
	servers: {
		protocol: string;
		siteServer: string;
		port: number;
		directory: string;
	}[];
}
```

## Credits

### "Frogans" Trademark

"Frogans" is a trademark of the OP3FT. The use of this trademark is governed by the OP3FT Trademark Usage Policy, available at the following permanent URL.

https://www.frogans.org/en/resources/otup/access.html

### "FNSL" Trademark

"FNSL" is a trademark of the OP3FT. The use of this trademark is governed by the OP3FT Trademark Usage Policy, available at the following permanent URL.

https://www.frogans.org/en/resources/otup/access.html

### "Frogans Network System Language" Trademark

"Frogans Network System Language" is a trademark of the OP3FT. The use of this trademark is governed by the OP3FT Trademark Usage Policy, available at the following permanent URL.

https://www.frogans.org/en/resources/otup/access.html

### "FSDL" Trademark

"FSDL" is a trademark of the OP3FT. The use of this trademark is governed by the OP3FT Trademark Usage Policy, available at the following permanent URL.

https://www.frogans.org/en/resources/otup/access.html

### "OP3FT" Trademark

"OP3FT" is a trademark of the OP3FT. The use of this trademark is governed by the OP3FT Trademark Usage Policy, available at the following permanent URL.

https://www.frogans.org/en/resources/otup/access.html
