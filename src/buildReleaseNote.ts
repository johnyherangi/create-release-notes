import { Commit } from './types'

export function buildReleaseNote(template: string, commit: Commit): string {
    let match: RegExpExecArray | null = null
    let result = template
    const regex = new RegExp('{{([a-z\\|]+)}}', 'g')
    while ((match = regex.exec(template)) !== null) {
        const replacers = match[1].split('|')
        let value = ''
        for (const replacer of replacers) {
            value = commit[replacer as keyof Commit] ?? ''
            if (value) {
                const placeholder = match[0]
                result = result.replace(placeholder, value)
                break
            }
        }
    }

    return result
}
