# Werk Aan De Muur - API

Werk aan de Muur - API client for Deno/Node

This client is intended for limited use at the backend. It is not intended for use in the browser.

Inspired by the [Wordpress Plugin](https://nl.wordpress.org/plugins/werk-aan-de-muur/)

## Table of Contents

- [Werk Aan De Muur - API](#werk-aan-de-muur---api)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Installation](#installation)
  - [Example](#example)
  - [Development](#development)
  - [License](#license)

## Features

- Request data from the [Werk Aan De Muur](https://www.werkaandemuur.nl/) API
- Get artworks for a user
- Get paginated results
- Get artworks for a specific album

## Installation

```typescript
import { WAMClient } from 'https://deno.land/x/wamclient/mod.ts';
```

## Example

```typescript

import { WAMClient, Medium, Size } from 'https://deno.land/x/wamclient/mod.ts';

const artistID = 000000; // Your artist ID
const apiKey = "<api_key>"; // Your API key

const client = new WAMClient(artistID, apiKey);

const authenticated = await client.authenticationTest();

// Get all artworks
const artworks = await client.getArtworks();

// Get artworks for a specific album
const albumArtworks = await client.getArtworksByAlbumId(123456);

// Get paginated results
const paginatedArtworks = await client.getArtworksPage(1);

// Get a single artwork
const artwork = await client.getArtworkById(123456);

// Apply filters
const filteredArtworks = await client.getArtworks({
  medium: Medium.Canvas,
  size: Size.XLarge,
});

```

## Development

- [ ] Publish NPM module

## License

[MIT](LICENSE)

---

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/j3lte)
