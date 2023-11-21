module.exports = {
    authUrl: 'https://haystac.gno-sys.com/auth/signin',
    catalogUrl: 'https://haystac.gno-sys.com/',
    catalogTitle: "Haystac Browser",
    allowExternalAccess: true, // Must be true if catalogUrl is not given
    allowedDomains: [
        'haystac.gno-sys.com'
    ],
    detectLocaleFromBrowser: true,
    storeLocale: true,
    locale: "en",
    fallbackLocale: "en",
    supportedLocales: [
        "de",
//      "de-CH",
        "es",
        "en",
        "fr",
//      "fr-CA",
//      "fr-CH",
        "it",
//      "it-CH",
        "ro"
    ],
    apiCatalogPriority: null,
    useTileLayerAsFallback: true,
    displayGeoTiffByDefault: false,
    buildTileUrlTemplate: ({href, asset}) => "https://tiles.rdnt.io/tiles/{z}/{x}/{y}@2x?url=" + encodeURIComponent(asset.href.startsWith("/vsi") ? asset.href : href),
    stacProxyUrl: null,
    pathPrefix: "/",
    historyMode: "history",
    cardViewMode: "cards",
    cardViewSort: "asc",
    showThumbnailsAsAssets: false,
    stacLint: true,
    geoTiffResolution: 128,
    redirectLegacyUrls: false,
    itemsPerPage: 12,
    defaultThumbnailSize: null,
    maxPreviewsOnMap: 50,
    crossOriginMedia: null,
    requestHeaders: {},
    requestQueryParameters: {},
    preprocessSTAC: null,
    authConfig: null
    // authConfig: {
    //     type: 'header',
    //     key: 'Authorization',
    //     formatter: token => `Bearer ${token}`,
    //     description: 'Login to retrieve access token from our [Haystac API](https://haystac.gno-sys.com/auth/login)'
    // }
};
