# Inline Full

A REDCap External Module that adds a fullscreen toggle to inline images/PDFs and a view button to image/PDF links.

## Installation

- Install this module from the REDCap External Module Repository and enable it.
- Enable the module in any projects that want to make use of it.

Manual installation:

- Clone this repo into `<redcap-root>/modules/redcap_inline_full_v<version-number>`.
- Go to _Control Center > External Modules > Manage_ and enable 'Inline Full'.
- Enable the module in any projects that want to make use of it.

## Configuration

A **debug** mode can be enable in the module's project settings. When enabled, some information about the module's actions that may be useful for troubleshooting is output to the browser console.

## Usage

The module's actions are controlled by **Action Tags**: 

- **`@INLINE-FULL-SURVEY`** will apply the module's effect to each tagged field on survey pages.

- **`@INLINE-FULL-DATAENTRY`** will apply the module's effect to each tagged field on data entry pages.

There are no parameters that can or should be set for these action tags.

Valid target fields are file upload fields and any fields that have file upload fields piped into them (with the `:inline` or `:link` modifiers.

When applied to file upload fields, a button will be added next to the file name that will trigger a full screen view of the image/PDF. This effect does not depend on whether the `@INLINE` action tag is present.

When applied to any field that includes piping of a file upload field with the `:inline` or `:link` modifiers and the file is one of the supported types, a button will be added next to the link or above the inline view that will trigger a full screen view of the image/PDF.

Supported file types are: 
- Bitmap file (.bmp)
- Graphics Interchange Format (.gif)
- Joint Photographic Expert Group image (.jpg, .jpeg, .jfif, .pjpeg, .pjp)
- Portable Network Graphics (.png)
- Scalable Vector Graphics (.svg)
- Tagged Image File Format (.tif, .tiff)
- Web Picture format (.webp)

## Changelog

Version | Comment
------- | -------------
1.0.0   | Initial release.