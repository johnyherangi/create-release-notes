import { buildReleaseNote } from '../src/buildReleaseNote'
import { Commit } from '../src/types'

describe('buildReleaseNote', () => {
    test('replaces placeholders with commit values', async () => {
        const commit: Commit = {
            author: 'johnyherangi',
            subject: 'foo',
            commit: 'bar',
        }
        const result = buildReleaseNote('- {{subject}} by @{{author}}', commit)
        expect(result).toMatchInlineSnapshot('"- foo by @johnyherangi"')
    })
    test('replaces placeholders with fallback commit values', async () => {
        const commit: Commit = {
            committer: 'shrekswampman',
            subject: 'foo',
            commit: 'bar',
        }
        const result = buildReleaseNote('- {{subject}} by @{{author|committer}}', commit)
        expect(result).toMatchInlineSnapshot('"- foo by @shrekswampman"')
    })
    test('ignores invalid placeholders', async () => {
        const commit: Commit = {
            author: 'johnyherangi',
            subject: 'foo',
            commit: 'bar',
        }
        const result = buildReleaseNote('- {{invalid}} by @{{author}}', commit)
        expect(result).toMatchInlineSnapshot('"- {{invalid}} by @johnyherangi"')
    })
})
