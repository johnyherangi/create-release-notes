// Full response schema can be found here: https://docs.github.com/en/rest/commits/commits#list-commits
export type ApiCommit = {
    author: { login: string } | null
    committer: { login: string } | null
    commit: { message: string }
}

export type Commit = {
    author?: string | null
    committer?: string | null
    subject: string
    commit: string
}
