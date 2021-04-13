# Create Release Notes

This action compiles the commits between the latest release tag and a head ref into release notes. For use with [actions/create-release](https://github.com/actions/create-release).

-   If no release tags exist, only the `head-ref` commit will be compiled.

## Inputs

### `head-ref`

**Optional** Custom head ref. Default is `HEAD`.

### `format`

**Optional** Release note format. Default is `- {{subject}} by @{{author}}`.

> Usable commit values: `subject`, `author` and `message`

## Outputs

### `release-notes`

Multi-lined release notes e.g.

```
- Do more stuff (#2) by @johnyherangi
- Do stuff (#1) by @johnyherangi
```

## Example usage

```yaml
- uses: johnyherangi/create-release-notes@main
  id: create-release-notes
  env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
- uses: actions/create-release@v1
  env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  with:
      tag_name: '1.0.0'
      release_name: My Release
      body: ${{ steps.create-release-notes.outputs.release-notes }}
```
