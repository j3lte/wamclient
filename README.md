# Werk Aan De Muur - API

[![GitHub release (latest by date)](https://img.shields.io/github/v/release/j3lte/wamclient?style=for-the-badge)](https://github.com/j3lte/wamclient/releases/latest "GitHub release (latest by date)")
[![NPM Version](https://img.shields.io/npm/v/wamclient?style=for-the-badge)](https://www.npmjs.com/package/wamclient "NPM Version")
[![GitHub Release Date](https://img.shields.io/github/release-date/j3lte/wamclient?style=for-the-badge)](https://github.com/j3lte/wamclient/releases/latest "GitHub Release Date")
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/j3lte/wamclient?style=for-the-badge)
[![GitHub](https://img.shields.io/github/license/j3lte/wamclient?style=for-the-badge)](https://github.com/j3lte/wamclient/blob/main/LICENSE "GitHub License")
[![GitHub last commit](https://img.shields.io/github/last-commit/j3lte/wamclient?style=for-the-badge)](https://github.com/j3lte/wamclient/commits/main "GitHub last commit")
[![GitHub issues](https://img.shields.io/github/issues/j3lte/wamclient?style=for-the-badge)](https://github.com/j3lte/wamclient/issues "Github Issues")
[![Deno docs](https://img.shields.io/badge/Deno-Docs-blue?style=for-the-badge)](https://doc.deno.land/https/deno.land/x/wamclient/mod.ts "Deno docs")

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

Deno

```typescript
import { WAMClient } from 'https://deno.land/x/wamclient/mod.ts';
```

Node

```typescript
import { WAMClient } from 'wamclient';
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
