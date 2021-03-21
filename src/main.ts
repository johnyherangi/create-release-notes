import core from '@actions/core'
import { context, getOctokit } from '@actions/github'

type Commit = {
    author: { login: string }
    commit: { message: string }
}

async function main() {
    if (process.env.GITHUB_TOKEN === undefined) {
        core.setFailed('env.GITHUB_TOKEN is not set')
        return
    }

    let baseRef = ''
    const headRef = core.getInput('head-ref')
    const format = core.getInput('format')

    const github = getOctokit(process.env.GITHUB_TOKEN)
    const { owner, repo } = context.repo
    return github.repos
        .getLatestRelease({ owner, repo })
        .then(
            (release) =>
                github.request('GET /repos/:owner/:repo/compare/:baseRef...:headRef', {
                    owner,
                    repo,
                    baseRef: (baseRef = release.data.tag_name),
                    headRef,
                }),
            () =>
                github
                    .request('GET /repos/:owner/:repo/commits/:headRef', {
                        owner,
                        repo,
                        headRef,
                    })
                    .then((response) => ({
                        data: {
                            commits: [response.data as Commit],
                        },
                    })),
        )
        .then((response) =>
            response.data.commits
                .map((commit: Commit) => ({
                    author: commit.author.login,
                    subject: commit.commit.message.split('\n')[0],
                    message: commit.commit.message,
                }))
                .reverse(),
        )
        .then((commits) => {
            if (commits.length === 0) {
                core.setFailed(`No commits found between refs ${baseRef}...${headRef}`)
                return
            }

            core.setOutput('release_name', commits[0].subject)

            let releaseNotes = ''
            for (const commit of commits) {
                releaseNotes += format
                    .replace('{{author}}', commit.author)
                    .replace('{{subject}}', commit.subject)
                    .replace('{{message}}', commit.message)
                releaseNotes += '%0A'
            }

            core.setOutput('release_notes', releaseNotes)
        })
        .catch((error) => core.setFailed(error.message))
}

main()
